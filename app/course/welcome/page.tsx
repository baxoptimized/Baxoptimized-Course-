import { redirect } from "next/navigation";
import Image from "next/image";
import { getCurrentUser } from "@/lib/session";
import { Logo } from "@/components/Logo";
import { dismissWelcome } from "./actions";

const OUTCOMES = [
  "Design and build a professional, fast website",
  "Make it look expensive: scroll animations, ambient effects, polish",
  "Talk to AI properly to get exactly what you want, every time",
  "Deploy it live on a real domain",
  "Set it up to actually generate leads, safely and reliably",
  "Get it found on Google",
];

const STEPS = [
  { label: "Read", desc: "A short burst of text, a few lines, not a page" },
  { label: "Look", desc: "A screenshot, GIF, or short clip showing the real thing" },
  { label: "Prompt", desc: "An exact, ready-to-use AI prompt for that step" },
  { label: "Prove", desc: "A quiz or a real checkpoint, something you actually submit" },
];

export default async function WelcomePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen" style={{ background: "var(--color-navy-950)" }}>
      <main className="mx-auto max-w-3xl px-5 py-16">
        <div className="mb-10 flex justify-center">
          <Logo height={22} />
        </div>

        <div className="mb-12 flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
          <div
            className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full"
            style={{ border: "2px solid var(--color-accent)" }}
          >
            <Image src="/bax-portrait-seated.jpg" alt="Baxter" fill sizes="96px" className="object-cover" style={{ objectPosition: "center 20%" }} />
          </div>
          <div>
            <p className="font-display text-2xl font-bold" style={{ color: "var(--color-text-primary)" }}>
              Welcome in.
            </p>
            <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
              I&apos;m Baxter, and I built this course myself. Before you dive into Module 1, here&apos;s
              what you&apos;re actually getting and how it works.
            </p>
          </div>
        </div>

        {/* Outcomes */}
        <section className="mb-10">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--color-gold)" }}>
            By the end, you can independently
          </p>
          <ul className="space-y-2.5">
            {OUTCOMES.map((o) => (
              <li key={o} className="flex items-start gap-2.5 text-sm" style={{ color: "var(--color-text-primary)" }}>
                <span
                  className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px]"
                  style={{ background: "var(--color-success)", color: "#000" }}
                >
                  ✓
                </span>
                {o}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs" style={{ color: "var(--color-text-muted)" }}>
            No coding background needed. We start from zero.
          </p>
        </section>

        {/* How it works */}
        <section className="mb-10">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--color-gold)" }}>
            How every lesson works
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {STEPS.map((s, i) => (
              <div
                key={s.label}
                className="rounded-xl p-3"
                style={{ background: "var(--color-navy-900)", border: "1px solid var(--color-navy-700)" }}
              >
                <p className="font-display text-xs font-bold" style={{ color: "var(--color-accent)" }}>
                  0{i + 1}
                </p>
                <p className="mt-1 text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
                  {s.label}
                </p>
                <p className="mt-1 text-xs leading-snug" style={{ color: "var(--color-text-muted)" }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Locked modules + build-along */}
        <section className="mb-12 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl p-4" style={{ background: "rgba(232,100,26,0.06)", border: "1px solid rgba(232,100,26,0.25)" }}>
            <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
              You can&apos;t skip ahead
            </p>
            <p className="mt-1 text-xs leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
              Quizzes need 80% to pass, with unlimited retakes. Each module unlocks only once you&apos;ve
              actually cleared the one before it.
            </p>
          </div>
          <div className="rounded-xl p-4" style={{ background: "var(--color-navy-900)", border: "1px solid var(--color-navy-700)" }}>
            <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
              You build one real site
            </p>
            <p className="mt-1 text-xs leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
              Every module builds toward one fictional client project. You watch a step happen, then
              you do the exact same step yourself.
            </p>
          </div>
        </section>

        <form action={dismissWelcome} className="flex justify-center">
          <button
            type="submit"
            className="rounded-lg px-8 py-3.5 text-sm font-semibold transition-opacity hover:opacity-90"
            style={{ background: "var(--color-accent)", color: "#fff" }}
          >
            Let&apos;s go →
          </button>
        </form>
      </main>
    </div>
  );
}
