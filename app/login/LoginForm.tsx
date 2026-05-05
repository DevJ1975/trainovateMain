"use client";

import { useFormState, useFormStatus } from "react-dom";
import { login, LoginState } from "./actions";

const initial: LoginState = {};

export function LoginForm({ next }: { next: string }) {
  const [state, formAction] = useFormState(login, initial);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="next" value={next} />

      {state.error && (
        <div
          role="alert"
          className="rounded-md border border-flare/50 bg-flare/10 px-3 py-2 text-sm text-flare"
        >
          {state.error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-xs uppercase tracking-[0.18em] text-bone/60">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoFocus
          className="mt-1 w-full rounded-md border border-bone/15 bg-ink/40 px-3 py-2 text-bone placeholder:text-bone/30 focus:border-cobalt focus:outline-none focus:ring-1 focus:ring-cobalt"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-xs uppercase tracking-[0.18em] text-bone/60">
          Password
          <span className="ml-2 normal-case tracking-normal text-bone/40">
            optional — leave blank for a magic-link email
          </span>
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className="mt-1 w-full rounded-md border border-bone/15 bg-ink/40 px-3 py-2 text-bone placeholder:text-bone/30 focus:border-cobalt focus:outline-none focus:ring-1 focus:ring-cobalt"
        />
      </div>

      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-cobalt px-5 py-3 text-sm font-medium text-bone hover:bg-cobalt/90 disabled:opacity-60"
    >
      {pending ? "Signing in…" : "Sign in"}
    </button>
  );
}
