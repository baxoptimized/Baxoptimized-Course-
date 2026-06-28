"use client";

import { useActionState } from "react";
import { signupAction } from "./actions";
import Link from "next/link";

export default function SignupPage() {
  const [state, action, pending] = useActionState(signupAction, null);

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--color-navy-950)" }}>
      <div className="w-full max-w-md">

        {/* Logo / Brand */}
        <div className="text-center mb-10">
          <span className="inline-block text-sm font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "var(--color-gold)" }}>
            Baxoptimized
          </span>
          <h1 className="text-3xl font-bold" style={{ color: "var(--color-text-primary)" }}>
            Create your account
          </h1>
          <p className="mt-2 text-sm" style={{ color: "var(--color-text-secondary)" }}>
            Get access to the full training program
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border p-8" style={{ background: "var(--color-navy-800)", borderColor: "var(--color-border)" }}>
          <form action={action} className="space-y-5">

            {state?.error && (
              <div className="rounded-lg px-4 py-3 text-sm" style={{ background: "rgba(248,113,113,0.1)", color: "var(--color-error)", border: "1px solid rgba(248,113,113,0.3)" }}>
                {state.error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-colors"
                style={{
                  background: "var(--color-navy-900)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text-primary)",
                }}
                onFocus={e => (e.currentTarget.style.borderColor = "var(--color-accent)")}
                onBlur={e => (e.currentTarget.style.borderColor = "var(--color-border)")}
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>
                  Password
                </label>
                <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                  Minimum 8 characters
                </span>
              </div>
              <input
                type="password"
                name="password"
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="••••••••"
                className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-colors"
                style={{
                  background: "var(--color-navy-900)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text-primary)",
                }}
                onFocus={e => (e.currentTarget.style.borderColor = "var(--color-accent)")}
                onBlur={e => (e.currentTarget.style.borderColor = "var(--color-border)")}
              />
            </div>

            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-lg py-3 text-sm font-semibold transition-all disabled:opacity-60"
              style={{ background: "var(--color-accent)", color: "#fff" }}
              onMouseEnter={e => !pending && (e.currentTarget.style.background = "var(--color-accent-hover)")}
              onMouseLeave={e => (e.currentTarget.style.background = "var(--color-accent)")}
            >
              {pending ? "Creating account…" : "Create account"}
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-sm" style={{ color: "var(--color-text-muted)" }}>
          Already have an account?{" "}
          <Link href="/login" className="font-medium" style={{ color: "var(--color-accent)" }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
