"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";
import Link from "next/link";
import Image from "next/image";
import { Logo } from "@/components/Logo";

export default function LoginPage() {
  const [state, action, pending] = useActionState(loginAction, null);

  return (
    <div className="flex min-h-screen" style={{ background: "var(--color-navy-950)" }}>
      {/* Photo panel — desktop only */}
      <div className="relative hidden w-[42%] shrink-0 lg:block">
        <Image
          src="/bax-hero.png"
          alt="Baxter, your instructor"
          fill
          priority
          sizes="42vw"
          className="object-cover"
          style={{ objectPosition: "center 15%" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(100deg, transparent 55%, var(--color-navy-950) 100%)" }}
        />
        <div className="absolute bottom-10 left-8 right-8">
          <p className="font-display text-lg font-semibold" style={{ color: "var(--color-text-primary)" }}>
            Hey, I&apos;m Baxter.
          </p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center overflow-y-auto px-4 py-12">
      <div className="w-full max-w-md">

        {/* Logo / Brand */}
        <div className="text-center mb-10">
          <div className="mb-4 flex justify-center">
            <Logo height={26} />
          </div>
          <h1 className="text-3xl font-bold" style={{ color: "var(--color-text-primary)" }}>
            Welcome back
          </h1>
          <p className="mt-2 text-sm" style={{ color: "var(--color-text-secondary)" }}>
            Sign in to continue your training
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
              <label className="block text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                autoComplete="current-password"
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
              {pending ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-sm" style={{ color: "var(--color-text-muted)" }}>
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium" style={{ color: "var(--color-accent)" }}>
            Sign up
          </Link>
        </p>

        {/* Purchase CTA */}
        <div
          className="mt-8 rounded-2xl border p-6 text-center"
          style={{ background: "rgba(240,168,67,0.06)", borderColor: "rgba(240,168,67,0.25)" }}
        >
          <p className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
            Want to purchase the course?
          </p>
          <p className="mt-1 text-xs" style={{ color: "var(--color-text-secondary)" }}>
            Buy access, then create your account with the same email.
          </p>
          {process.env.NEXT_PUBLIC_PURCHASE_URL && (
            <a
              href={process.env.NEXT_PUBLIC_PURCHASE_URL}
              className="mt-4 inline-flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold"
              style={{ background: "var(--color-gold)", color: "#000" }}
            >
              Get the course →
            </a>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
