import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { USERS } from "@/lib/auth/users";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "Sign in · Trainovate" };
export const dynamic = "force-dynamic";

export default function LoginPage({
  searchParams,
}: {
  searchParams?: { next?: string };
}) {
  const next = searchParams?.next ?? "/safety/near-misses";
  if (getCurrentUser()) redirect(next);

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

        <div className="mt-10 rounded-md border border-bone/10 bg-ink/40 px-4 py-3 text-xs text-bone/55">
          <div className="mb-1 font-mono uppercase tracking-[0.18em] text-bone/45">
            Dev accounts
          </div>
          <ul className="space-y-1">
            {USERS.map((u) => (
              <li key={u.id}>
                <span className="font-mono text-bone/85">{u.email}</span>
                {" — "}
                {u.name} <span className="text-bone/45">({u.role})</span>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-bone/40">
            Any non-empty password works in dev. Real auth is Phase 2.
          </p>
        </div>
      </div>
    </main>
  );
}
