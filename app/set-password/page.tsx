"use client";

import { useActionState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { setPasswordAction, SetPasswordState } from "./actions";
import { Suspense } from "react";

function SetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [state, action, pending] = useActionState<SetPasswordState, FormData>(
    setPasswordAction,
    null
  );

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="token" value={token} />

      {!token && (
        <p className="text-sm text-center" style={{ color: "var(--color-error)" }}>
          Invalid or missing link. Please check your email.
        </p>
      )}

      {state?.error && (
        <p className="text-sm text-center" style={{ color: "var(--color-error)" }}>
          {state.error}
        </p>
      )}

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium mb-1.5"
          style={{ color: "var(--color-text-secondary)" }}
        >
          New password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-colors"
          style={{
            background: "var(--color-navy-800)",
            border: "1px solid var(--color-navy-600)",
            color: "var(--color-text-primary)",
          }}
          placeholder="At least 8 characters"
        />
      </div>

      <div>
        <label
          htmlFor="confirm"
          className="block text-sm font-medium mb-1.5"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Confirm password
        </label>
        <input
          id="confirm"
          name="confirm"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-colors"
          style={{
            background: "var(--color-navy-800)",
            border: "1px solid var(--color-navy-600)",
            color: "var(--color-text-primary)",
          }}
          placeholder="Repeat your password"
        />
      </div>

      <button
        type="submit"
        disabled={pending || !token}
        className="w-full py-3 rounded-lg text-sm font-semibold transition-opacity disabled:opacity-60"
        style={{ background: "var(--color-gold)", color: "#0a0f1e" }}
      >
        {pending ? "Setting password…" : "Set password & enter course"}
      </button>
    </form>
  );
}

export default function SetPasswordPage() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: "var(--color-navy-950)" }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-8 space-y-6"
        style={{ background: "var(--color-navy-900)", border: "1px solid var(--color-navy-700)" }}
      >
        <div className="text-center space-y-1">
          <p
            className="text-xs font-bold tracking-widest uppercase"
            style={{ color: "var(--color-gold)" }}
          >
            Baxoptimized
          </p>
          <h1 className="text-xl font-bold" style={{ color: "var(--color-text-primary)" }}>
            Set your password
          </h1>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            Choose a password to activate your account.
          </p>
        </div>

        <Suspense fallback={null}>
          <SetPasswordForm />
        </Suspense>
      </div>
    </main>
  );
}
