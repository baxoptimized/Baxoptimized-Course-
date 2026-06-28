function Bone({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`rounded animate-pulse ${className ?? ""}`}
      style={{ background: "var(--color-navy-700)", ...style }}
    />
  );
}

export default function QuizLoading() {
  return (
    <div className="min-h-dvh" style={{ background: "var(--color-navy-950)" }}>
      {/* Nav shell */}
      <div
        className="sticky top-0 z-40 flex items-center justify-between px-5 py-3"
        style={{
          background:   "rgba(8,15,30,0.90)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--color-navy-700)",
          minHeight:    "49px",
        }}
      >
        <Bone style={{ width: 96, height: 10 }} />
        <div className="flex items-center gap-5">
          <Bone className="hidden sm:block" style={{ width: 100, height: 10 }} />
          <Bone style={{ width: 64, height: 32, borderRadius: 8 }} />
        </div>
      </div>

      <main className="mx-auto max-w-2xl px-5 pb-24 pt-10 space-y-6">
        {/* Quiz header skeleton */}
        <div className="mb-8 space-y-2">
          <Bone style={{ width: 100, height: 10 }} />
          <Bone style={{ width: 140, height: 28 }} />
          <Bone style={{ width: 180, height: 12 }} />
        </div>

        {/* Info banner skeleton */}
        <Bone className="rounded-lg" style={{ height: 48 }} />

        {/* Question skeletons */}
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl p-6 space-y-4"
            style={{ background: "var(--color-navy-900)", border: "1px solid var(--color-navy-700)" }}
          >
            <div className="flex items-center gap-3">
              <Bone style={{ width: 28, height: 28, borderRadius: "50%" }} />
              <Bone style={{ width: 30, height: 10 }} />
            </div>
            <Bone style={{ width: "85%", height: 16 }} />
            <div className="space-y-2 mt-4">
              {Array.from({ length: 4 }).map((_, j) => (
                <Bone key={j} className="rounded-lg" style={{ height: 48 }} />
              ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
