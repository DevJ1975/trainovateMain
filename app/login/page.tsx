import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "Sign in · Trainovate" };
export const dynamic = "force-dynamic";

const DEV_ACCOUNTS = [
  { email: "lead@trainovate.demo", name: "Priya Shah", role: "safety_lead" },
  { email: "admin@trainovate.demo", name: "Marcus Webb", role: "safety_admin" },
];

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: { next?: string };
}) {
  const next = searchParams?.next ?? "/safety/near-misses";
  if (await getCurrentUser()) redirect(next);

  const devAuthOn =
    process.env.NODE_ENV !== "production" ||
    process.env.NM_ALLOW_DEV_AUTH === "true";
  const emailOn = !!(process.env.RESEND_API_KEY && process.env.AUTH_RESEND_FROM);

  return (
    <main className="min-h-screen bg-ink text-bone">
      <div className="mx-auto max-w-sm px-5 py-16 sm:py-24">
        <Link href="/" className="font-mono text-[10px] uppercase tracking-[0.24em] text-bone/55 hover:text-bone">
          ← Trainovate.ai
        </Link>

        <h1 className="mt-8 text-3xl font-semibold tracking-tight">Sign in</h1>
        <p className="mt-2 text-sm text-bone/60">Safety team access.</p>

        <div className="mt-8">
          <LoginForm next={next} />
        </div>

        <div className="mt-6 rounded-md border border-bone/10 bg-ink/40 px-4 py-3 text-xs text-bone/55">
          {emailOn && (
            <p className="mb-2">
              <span className="font-mono uppercase tracking-[0.18em] text-bone/45">
                Magic-link
              </span>{" "}
              — leave the password blank to receive a one-tap sign-in link by email.
            </p>
          )}
          {devAuthOn && (
            <>
              <div className="mb-1 font-mono uppercase tracking-[0.18em] text-bone/45">
                Dev accounts (any non-empty password)
              </div>
              <ul className="space-y-1">
                {DEV_ACCOUNTS.map((u) => (
                  <li key={u.email}>
                    <span className="font-mono text-bone/85">{u.email}</span>
                    {" — "}
                    {u.name} <span className="text-bone/45">({u.role})</span>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-bone/40">
                Dev login is gated by <code>NM_ALLOW_DEV_AUTH</code> in production.
              </p>
            </>
          )}
          {!emailOn && !devAuthOn && (
            <p>
              No sign-in providers are configured. Set{" "}
              <code>RESEND_API_KEY + AUTH_RESEND_FROM</code> for magic-link, or
              wire an OAuth provider in <code>auth.ts</code>.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
