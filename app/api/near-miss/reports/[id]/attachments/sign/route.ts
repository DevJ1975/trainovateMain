import { NextRequest } from "next/server";
import { getUserFromRequest } from "@/lib/auth/session";
import { getReport, listAttachments } from "@/lib/near-miss/store";
import { getStorage } from "@/lib/near-miss/storage";
import { ALLOWED_PHOTO_TYPES, LIMITS } from "@/shared/near-miss/validation";
import { badRequest, error, forbidden, json, notFound } from "@/lib/api/responses";
import { features } from "@/lib/features";

export const dynamic = "force-dynamic";

const ALLOWED = new Set<string>(ALLOWED_PHOTO_TYPES);

interface Body {
  contentType?: string;
  sizeBytes?: number;
}

/**
 * Returns a presigned URL the client can PUT directly to (S3 mode only).
 * On Local mode returns 501 — clients should fall back to the multipart
 * proxy endpoint at the parent route.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!features().photoAttachments) return notFound("Photo attachments are disabled on this deploy");
  const report = getReport(params.id);
  if (!report) return notFound("Report not found");

  const user = await getUserFromRequest(req);
  if (!user) {
    const code = req.nextUrl.searchParams.get("code")?.trim().toUpperCase();
    if (!code || !report.anonymous || report.receiptCode !== code) {
      return forbidden();
    }
  }

  if (listAttachments(report.id).length >= LIMITS.attachmentsPerReport) {
    return badRequest(`Up to ${LIMITS.attachmentsPerReport} photos`);
  }

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  const contentType = (body.contentType ?? "").trim();
  const sizeBytes = Number(body.sizeBytes ?? 0);
  if (!ALLOWED.has(contentType)) return badRequest("Only JPG, PNG, WEBP, or GIF");
  if (!Number.isFinite(sizeBytes) || sizeBytes <= 0 || sizeBytes > LIMITS.attachmentBytes) {
    return badRequest(
      `sizeBytes must be 1-${LIMITS.attachmentBytes}`,
    );
  }

  const signed = await getStorage().signUpload({ contentType, sizeBytes });
  if (!signed) {
    return error(
      501,
      "Signed uploads are not enabled — set NEAR_MISS_STORAGE=s3 to use this flow, " +
        "or POST the file directly to the parent /attachments endpoint.",
    );
  }
  return json(signed);
}
