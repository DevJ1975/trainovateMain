import { NextRequest } from "next/server";
import { getUserFromRequest } from "@/lib/auth/session";
import { json, unauthorized } from "@/lib/api/responses";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return unauthorized();
  return json({
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  });
}
