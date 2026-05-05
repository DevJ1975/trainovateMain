import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { logout } from "../login/actions";

export const dynamic = "force-dynamic";

export default async function SafetyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/safety/near-misses");

  return (
    <div className="min-h-screen bg-ink text-bone">
      <header className="border-b border-bone/10">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <Link
            href="/"
            className="font-mono text-[10px] uppercase tracking-[0.24em] text-bone/55 hover:text-bone"
          >
            Trainovate.ai · Safety
          </Link>
          <nav className="flex items-center gap-5 text-sm">
            <Link href="/safety/near-misses" className="text-bone/85 hover:text-bone">
              Near misses
            </Link>
            <Link
              href="/report"
              className="rounded-md bg-cobalt px-3 py-1.5 text-bone hover:bg-cobalt/90"
            >
              + Report
            </Link>
            <span className="hidden text-xs text-bone/55 sm:inline">
              {user.name} · {user.role.replace("_", " ")}
            </span>
            <form action={logout}>
              <button
                type="submit"
                className="text-xs uppercase tracking-[0.14em] text-bone/55 hover:text-bone"
              >
                Sign out
              </button>
            </form>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-8">{children}</div>
    </div>
  );
}
