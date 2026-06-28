function Bone({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`rounded animate-pulse ${className ?? ""}`}
      style={{ background: "var(--color-navy-700)", ...style }}
    />
  );
}

export default function LessonLoading() {
  return (
    <div className="min-h-dvh" style={{ background: "var(--color-navy-950)" }}>
      {/* Nav shell */}
      <div
        className="sticky top-0 z-40 flex items-center justify-between px-5 py-3"
        style={{
          background:   "rgba(8,15,30,0.90)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--color-navy-700)",
          height:       "49px",
        }}
      >
        <Bone style={{ width: 96, height: 10 }} />
        <div className="flex items-center gap-5">
          <Bone className="hidden sm:block" style={{ width: 80, height: 10 }} />
          <Bone style={{ width: 64, height: 32, borderRadius: 8 }} />
        </div>
      </div>

      <div className="flex min-h-dvh">
        {/* Sidebar skeleton — desktop only */}
        <div
          className="hidden lg:block"
          style={{
            width:       "240px",
            flexShrink:  0,
            background:  "var(--color-navy-900)",
            borderRight: "1px solid var(--color-navy-700)",
          }}
        >
          <div className="px-5 py-5 space-y-2" style={{ borderBottom: "1px solid var(--color-navy-700)" }}>
            <Bone style={{ width: 80, height: 9 }} />
            <Bone style={{ width: 110, height: 9 }} />
          </div>
          <div className="py-3 space-y-1 px-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5">
                <Bone style={{ width: 13, height: 13, borderRadius: "50%", flexShrink: 0 }} />
                <Bone style={{ width: `${60 + i * 8}px`, height: 10 }} />
              </div>
            ))}
          </div>
        </div>

        {/* Content skeleton */}
        <div className="flex-1 min-w-0">
          <main className="mx-auto max-w-3xl px-5 py-10 pb-32 space-y-6">
            <Bone style={{ width: "75%", height: 36 }} />
            <div className="space-y-3 mt-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <Bone key={i} style={{ width: i % 3 === 2 ? "60%" : "100%", height: 14 }} />
              ))}
            </div>
            <div className="space-y-3 mt-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Bone key={i} style={{ width: i === 2 ? "50%" : "100%", height: 14 }} />
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
