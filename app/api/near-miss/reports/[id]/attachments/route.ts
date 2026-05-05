import { NextRequest } from "next/server";
import { getUserFromRequest } from "@/lib/auth/session";
import {
  addAttachment,
  getReport,
  listAttachments,
} from "@/lib/near-miss/store";
import { writeUpload } from "@/lib/near-miss/storage";
import {
  ALLOWED_PHOTO_TYPES,
  LIMITS,
} from "@/shared/near-miss/validation";
import {
  badRequest,
  forbidden,
  json,
  notFound,
} from "@/lib/api/responses";
import { features } from "@/lib/features";

export const dynamic = "force-dynamic";

const ALLOWED = new Set<string>(ALLOWED_PHOTO_TYPES);

/**
 * Multipart photo upload. Authorization:
 *  - Authenticated safety user (cookie or bearer), or
 *  - Anonymous reporter passing ?code=<receiptCode> matching the report.
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

  const existing = listAttachments(report.id);
  if (existing.length >= LIMITS.attachmentsPerReport) {
    return badRequest(`Up to ${LIMITS.attachmentsPerReport} photos`);
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return badRequest("Expected multipart form data");
  }

  const file = form.get("photo");
  if (!(file instanceof File) || file.size === 0) {
    return badRequest("Missing 'photo' field");
  }
  if (!ALLOWED.has(file.type)) {
    return badRequest("Only JPG, PNG, WEBP, or GIF");
  }
  if (file.size > LIMITS.attachmentBytes) {
    return badRequest(
      `Each photo must be under ${Math.round(LIMITS.attachmentBytes / 1024 / 1024)}MB`,
    );
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const stored = await writeUpload(buf, file.type);
  const attachment = addAttachment(report.id, {
    kind: "photo",
    storageKey: stored.storageKey,
    contentType: stored.contentType,
    sizeBytes: stored.sizeBytes,
  });

  return json({ attachment }, { status: 201 });
}
