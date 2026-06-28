function Bone({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`rounded animate-pulse ${className ?? ""}`}
      style={{ background: "var(--color-navy-700)", ...style }}
    />
  );
}

export default function AdminLoading() {
  return (
    <main
      className="min-h-screen p-4 sm:p-8 lg:p-10"
      style={{ background: "var(--color-navy-950)" }}
    >
      <div className="max-w-5xl mx-auto space-y-14">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Bone style={{ width: 90, height: 10 }} />
            <Bone style={{ width: 60, height: 28 }} />
          </div>
          <Bone style={{ width: 72, height: 36, borderRadius: 8 }} />
        </div>

        {/* Users table skeleton */}
        <div className="space-y-4">
          <Bone style={{ width: 60, height: 22 }} />
          <div
            className="rounded-lg overflow-hidden"
            style={{ border: "1px solid var(--color-navy-700)" }}
          >
            <div
              className="px-4 py-3 flex gap-4"
              style={{ background: "var(--color-navy-900)" }}
            >
              {[140, 80, 80, 40].map((w, i) => (
                <Bone key={i} style={{ width: w, height: 12 }} />
              ))}
            </div>
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="px-4 py-3 flex gap-4 items-center"
                style={{
                  background: i % 2 === 0 ? "var(--color-navy-950)" : "var(--color-navy-900)",
                }}
              >
                <Bone style={{ width: 160, height: 12 }} />
                <Bone style={{ width: 90, height: 28, borderRadius: 6 }} />
                <Bone style={{ width: 80, height: 12 }} />
              </div>
            ))}
          </div>
        </div>

        {/* Submissions skeleton */}
        <div className="space-y-4">
          <Bone style={{ width: 200, height: 22 }} />
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg p-5 space-y-3"
              style={{ background: "var(--color-navy-900)", border: "1px solid var(--color-navy-700)" }}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1.5">
                  <Bone style={{ width: 160, height: 14 }} />
                  <Bone style={{ width: 220, height: 10 }} />
                </div>
                <Bone style={{ width: 60, height: 20, borderRadius: 20 }} />
              </div>
              <Bone className="rounded" style={{ height: 56 }} />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
