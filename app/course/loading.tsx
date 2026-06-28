function Bone({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`rounded animate-pulse ${className ?? ""}`}
      style={{ background: "var(--color-navy-700)", ...style }}
    />
  );
}

export default function CourseLoading() {
  return (
    <div className="min-h-screen" style={{ background: "var(--color-navy-950)" }}>
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
        <Bone style={{ width: 64, height: 32, borderRadius: 8 }} />
      </div>

      <main className="mx-auto max-w-2xl px-5 pb-24 pt-12">
        {/* Welcome skeleton */}
        <div className="mb-12 space-y-4">
          <Bone style={{ width: 80, height: 10 }} />
          <Bone style={{ width: 200, height: 30 }} />
          <Bone className="h-1.5 w-full rounded-full" />
          <div className="flex gap-6">
            <Bone style={{ width: 72, height: 10 }} />
            <Bone style={{ width: 110, height: 10 }} />
          </div>
        </div>

        {/* Module card skeletons */}
        <div className="space-y-0">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="relative flex gap-3 mb-4">
              <div className="relative flex flex-col items-center">
                <Bone style={{ width: 44, height: 44, borderRadius: "50%", flexShrink: 0 }} />
                {i < 4 && (
                  <div
                    className="mt-1 w-px flex-1"
                    style={{ minHeight: "1.5rem", background: "var(--color-navy-700)" }}
                  />
                )}
              </div>
              <div
                className="flex-1 ml-2 rounded-xl p-5"
                style={{ background: "var(--color-navy-900)", border: "1px solid var(--color-navy-700)" }}
              >
                <div className="mb-3 flex items-center justify-between">
                  <Bone style={{ width: 70, height: 12, borderRadius: 20 }} />
                  <Bone style={{ width: 80, height: 10 }} />
                </div>
                <Bone style={{ width: "60%", height: 16 }} />
                <div className="mt-4 space-y-2">
                  <Bone className="h-1.5 w-full rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
