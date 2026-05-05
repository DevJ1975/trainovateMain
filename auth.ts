import NextAuth, {
  type DefaultSession,
  type NextAuthConfig,
} from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Resend from "next-auth/providers/resend";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import { ensureMigrated, getDb } from "@/lib/near-miss/db/client";
import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from "@/lib/near-miss/db/schema";
import { assertDevAuthAllowed } from "@/lib/auth/dev-stub";
import { ensureDevUsersSeeded } from "@/lib/auth/seed";

/**
 * NextAuth (Auth.js v5) — canonical web auth.
 *
 * Providers:
 *   - Resend: email magic-link. Active when RESEND_API_KEY + AUTH_RESEND_FROM
 *     are set. Real production path.
 *   - Credentials ("Dev login"): any non-empty password for known
 *     emails in the DB. Gated by NM_ALLOW_DEV_AUTH so it can never
 *     leak into a real production deploy. Convenience for local /
 *     internal staging.
 *
 * Mobile bearer-token auth still flows through `/api/auth/token` and
 * `lib/auth/session.ts` — it validates against the same DB users
 * table this config writes to, so the source of truth is shared.
 *
 * To add OAuth (Google / Okta / Azure AD), drop in a provider here:
 *   import Google from "next-auth/providers/google"
 *   providers.push(Google({ clientId: ..., clientSecret: ... }))
 */

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }
}

function buildProviders(): NextAuthConfig["providers"] {
  const list: NextAuthConfig["providers"] = [];

  if (process.env.RESEND_API_KEY && process.env.AUTH_RESEND_FROM) {
    list.push(
      Resend({
        apiKey: process.env.RESEND_API_KEY,
        from: process.env.AUTH_RESEND_FROM,
      }),
    );
  }

  list.push(
    Credentials({
      id: "dev-credentials",
      name: "Dev login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password (any non-empty value)", type: "password" },
      },
      async authorize(credentials) {
        assertDevAuthAllowed();
        const email = String(credentials?.email ?? "").trim().toLowerCase();
        const password = String(credentials?.password ?? "");
        if (!email || !password) return null;
        ensureMigrated();
        ensureDevUsersSeeded();
        const row = getDb()
          .select()
          .from(users)
          .where(eq(users.email, email))
          .get();
        if (!row) return null;
        return {
          id: row.id,
          email: row.email,
          name: row.name ?? row.email,
          role: row.role,
        };
      },
    }),
  );

  return list;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(getDb(), {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: buildProviders(),
  // JWT strategy is required by Auth.js v5 to use the Credentials
  // provider. The Drizzle adapter still owns users + accounts +
  // verificationTokens; the sessions table just goes unused.
  // Trade-off: sessions can't be invalidated server-side without
  // rotating AUTH_SECRET. For a 7-day session that's acceptable —
  // revoke by rotating if it ever matters.
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 },
  pages: { signIn: "/login" },
  secret: process.env.AUTH_SECRET ?? process.env.SESSION_SECRET,
  // Trust the host header. Vercel deploys auto-detect AUTH_URL; for
  // self-hosted (Docker, bare metal) we need this so callbacks resolve
  // correctly. Cookies are still HMAC-signed with AUTH_SECRET, so the
  // host header itself isn't an authentication boundary.
  trustHost: true,
  callbacks: {
    async jwt({ token, user }) {
      // First sign-in: stash user.id + role into the token so we don't
      // have to hit the DB on every session lookup.
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? "safety_lead";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = String(token.id ?? "");
        session.user.role = String(token.role ?? "safety_lead");
      }
      return session;
    },
  },
});
