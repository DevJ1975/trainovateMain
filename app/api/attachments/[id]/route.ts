import { NextRequest, NextResponse } from "next/server";
import { getAttachment, getReport } from "@/lib/near-miss/store";
import { getStorage, readUpload } from "@/lib/near-miss/storage";
import { getUserFromRequest } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

/**
 * Serves attachment bytes. Authorization:
 *  - Authenticated safety users (cookie or bearer): any attachment.
 *  - Anyone holding a valid receipt code via ?code=: only attachments
 *    belonging to that anonymous report.
 *
 * On S3-backed storage we 302 to a short-lived presigned GET URL so the
 * bytes flow client → S3 → client without proxying through the app
 * server. On local storage we stream from disk.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const att = getAttachment(params.id);
  if (!att) return new NextResponse("Not found", { status: 404 });

  const user = getUserFromRequest(req);
  if (!user) {
    const code = req.nextUrl.searchParams.get("code")?.trim().toUpperCase();
    if (!code) return new NextResponse("Forbidden", { status: 403 });
    const report = getReport(att.reportId);
    if (!report || !report.anonymous || report.receiptCode !== code) {
      return new NextResponse("Forbidden", { status: 403 });
    }
  }

  const storage = getStorage();

  // S3 path: redirect to a presigned download. Browser fetches bytes
  // directly from S3.
  if (storage.kind === "s3") {
    const signed = await storage.signDownload(att.storageKey);
    if (signed) {
      return NextResponse.redirect(signed.url, { status: 302 });
    }
    // Fall through to proxy below if signing failed.
  }

  let buf: Buffer;
  try {
    buf = await readUpload(att.storageKey);
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }

  return new NextResponse(new Uint8Array(buf), {
    status: 200,
    headers: {
      "content-type": att.contentType,
      "content-length": String(att.sizeBytes),
      "cache-control": "private, max-age=300",
    },
  });
}
