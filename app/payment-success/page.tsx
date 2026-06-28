import Link from "next/link";

export default function PaymentSuccessPage() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
      style={{ background: "var(--color-navy-950)" }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-10 space-y-6"
        style={{ background: "var(--color-navy-900)", border: "1px solid var(--color-navy-700)" }}
      >
        <div
          className="mx-auto w-16 h-16 rounded-full flex items-center justify-center text-3xl"
          style={{ background: "var(--color-navy-800)" }}
        >
          ✓
        </div>

        <div className="space-y-2">
          <p
            className="text-xs font-bold tracking-widest uppercase"
            style={{ color: "var(--color-gold)" }}
          >
            Payment confirmed
          </p>
          <h1 className="text-2xl font-bold" style={{ color: "var(--color-text-primary)" }}>
            Welcome to Baxoptimized
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
            Check your email — we&apos;ve sent you a link to set your password and access the course.
            It may take a minute or two to arrive.
          </p>
        </div>

        <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
          Already set your password?{" "}
          <Link
            href="/login"
            style={{ color: "var(--color-gold)", textDecoration: "underline" }}
          >
            Log in here
          </Link>
        </p>
      </div>
    </main>
  );
}
