import { publicFeatures } from "@/lib/features";
import { json } from "@/lib/api/responses";

/**
 * Public feature snapshot. Mobile / browser clients call this on
 * startup (and whenever they want fresh truth) to know which
 * features are turned on for the current deploy.
 *
 * No auth — these flags are not secrets, just product on/off
 * switches. If a flag becomes sensitive, drop it from
 * `publicFeatures()` in lib/features.ts.
 */

export const dynamic = "force-dynamic";

export async function GET() {
  return json({ features: publicFeatures() });
}
