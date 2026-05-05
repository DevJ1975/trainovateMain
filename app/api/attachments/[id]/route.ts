import { NextRequest, NextResponse } from "next/server";
import { getAttachment, getReport } from "@/lib/near-miss/store";
import { readUpload } from "@/lib/near-miss/storage";
import { getCurrentUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

/**
 * Serves attachment bytes. Authorization:
 *  - Authenticated safety users: any attachment.
 *  - Anyone holding a valid receipt code via ?code=: only attachments belonging
 *    to that anonymous report.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const att = getAttachment(params.id);
  if (!att) return new NextResponse("Not found", { status: 404 });

  const user = getCurrentUser();
  if (!user) {
    const code = req.nextUrl.searchParams.get("code")?.trim().toUpperCase();
    if (!code) return new NextResponse("Forbidden", { status: 403 });
    const report = getReport(att.reportId);
    if (!report || !report.anonymous || report.receiptCode !== code) {
      return new NextResponse("Forbidden", { status: 403 });
    }
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
