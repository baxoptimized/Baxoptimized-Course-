"use client";

import { useState } from "react";
import Link from "next/link";

const FEATURES = [
  "15 modules covering everything from zero to launch",
  "Prompt engineering, design, SEO, domains & deployment",
  "Quizzes, checkpoints, and a capstone project",
  "Lifetime access — including all future updates",
  "Staff-reviewed checkpoint submissions",
  "Certificate on completion",
];

export default function PricingPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleBuy() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error ?? "Something went wrong.");
      window.location.href = data.url;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <main
      className="min-h-screen flex flex-col"
      style={{ background: "var(--color-navy-950)" }}
    >
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-5xl mx-auto w-full">
        <span
          className="text-sm font-bold tracking-widest uppercase"
          style={{ color: "var(--color-gold)" }}
        >
          Baxoptimized
        </span>
        <Link
          href="/login"
          className="text-sm font-medium transition-opacity hover:opacity-70"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Log in
        </Link>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center max-w-3xl mx-auto w-full">
        <p
          className="text-xs font-bold tracking-widest uppercase mb-4"
          style={{ color: "var(--color-gold)" }}
        >
          The complete course
        </p>
        <h1
          className="text-4xl sm:text-5xl font-bold leading-tight mb-6"
          style={{ color: "var(--color-text-primary)" }}
        >
          Build, launch, and grow a real business — with AI
        </h1>
        <p
          className="text-lg leading-relaxed mb-12 max-w-xl"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Baxoptimized teaches you to use Claude and modern AI tools to go from
          idea to live product — including design, SEO, and deployment. No
          experience required.
        </p>

        {/* Pricing card */}
        <div
          className="w-full max-w-sm rounded-2xl p-8 text-left space-y-6"
          style={{
            background: "var(--color-navy-900)",
            border: "1px solid var(--color-navy-700)",
          }}
        >
          <div>
            <p
              className="text-3xl font-bold"
              style={{ color: "var(--color-text-primary)" }}
            >
              $297{" "}
              <span
                className="text-base font-normal"
                style={{ color: "var(--color-text-muted)" }}
              >
                one-time
              </span>
            </p>
            <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
              Lifetime access · No subscription
            </p>
          </div>

          <ul className="space-y-3">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm">
                <span style={{ color: "var(--color-gold)" }} className="mt-0.5 shrink-0">
                  ✓
                </span>
                <span style={{ color: "var(--color-text-secondary)" }}>{f}</span>
              </li>
            ))}
          </ul>

          {error && (
            <p className="text-sm text-center" style={{ color: "var(--color-error, #f87171)" }}>
              {error}
            </p>
          )}

          <button
            onClick={handleBuy}
            disabled={loading}
            className="w-full py-3.5 rounded-xl text-sm font-bold transition-opacity disabled:opacity-60"
            style={{ background: "var(--color-gold)", color: "#0a0f1e" }}
          >
            {loading ? "Redirecting to checkout…" : "Buy the course — $297"}
          </button>

          <p className="text-xs text-center" style={{ color: "var(--color-text-muted)" }}>
            Secure checkout via Stripe · 30-day money-back guarantee
          </p>
        </div>
      </section>

      <footer className="py-8 text-center">
        <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
          © {new Date().getFullYear()} Baxoptimized. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
