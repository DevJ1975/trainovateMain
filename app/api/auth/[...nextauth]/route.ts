// NextAuth (Auth.js v5) catch-all route handler. Handles /signin,
// /callback/<provider>, /signout, /session, /csrf, /verify-request,
// /error — see auth.ts for provider config.
import { handlers } from "@/auth";
export const { GET, POST } = handlers;
