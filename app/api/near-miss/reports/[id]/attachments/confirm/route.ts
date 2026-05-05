import { NextRequest } from "next/server";
import { getUserFromRequest } from "@/lib/auth/session";
import { addAttachment, getReport, listAttachments } from "@/lib/near-miss/store";
import { getStorage } from "@/lib/near-miss/storage";
import { ALLOWED_PHOTO_TYPES, LIMITS } from "@/shared/near-miss/validation";
import { badRequest, forbidden, json, notFound } from "@/lib/api/responses";

export const dynamic = "force-dynamic";

const ALLOWED = new Set<string>(ALLOWED_PHOTO_TYPES);

interface Body {
  storageKey?: string;
}

/**
 * Records the attachment row after a client-direct signed upload. We
 * verify against the actual stored object (HEAD on S3) instead of
 * trusting the client's claimed size/contentType — clients can lie in
 * the request body, S3 cannot.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
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

  const storageKey = (body.storageKey ?? "").trim();
  if (!storageKey) return badRequest("storageKey required");

  const stat = await getStorage().statObject(storageKey);
  if (!stat) return notFound("Uploaded object not found");
  if (!ALLOWED.has(stat.contentType)) {
    return badRequest("Stored object's content-type is not an allowed photo type");
  }
  if (stat.sizeBytes <= 0 || stat.sizeBytes > LIMITS.attachmentBytes) {
    return badRequest(
      `Stored object's size (${stat.sizeBytes}) exceeds the ${LIMITS.attachmentBytes} limit`,
    );
  }

  const attachment = addAttachment(report.id, {
    kind: "photo",
    storageKey,
    contentType: stat.contentType,
    sizeBytes: stat.sizeBytes,
  });
  return json({ attachment }, { status: 201 });
}
