function Bone({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`rounded animate-pulse ${className ?? ""}`}
      style={{ background: "var(--color-navy-700)", ...style }}
    />
  );
}

export default function CheckpointLoading() {
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
          <Bone className="hidden sm:block" style={{ width: 80, height: 10 }} />
          <Bone style={{ width: 64, height: 32, borderRadius: 8 }} />
        </div>
      </div>

      <main className="mx-auto max-w-2xl px-5 pb-24 pt-10 space-y-8">
        {/* Header skeleton */}
        <div className="space-y-2">
          <Bone style={{ width: 100, height: 10 }} />
          <Bone style={{ width: 180, height: 28 }} />
          <Bone style={{ width: 260, height: 12 }} />
        </div>

        {/* Form skeleton */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Bone style={{ width: 160, height: 14 }} />
            <Bone style={{ width: 220, height: 12 }} />
            <Bone className="rounded-lg" style={{ height: 120 }} />
          </div>
          <div className="space-y-2">
            <Bone style={{ width: 100, height: 14 }} />
            <Bone className="rounded-lg" style={{ height: 48 }} />
          </div>
          <Bone className="rounded-lg" style={{ height: 64 }} />
          <Bone className="rounded-lg" style={{ width: 120, height: 44 }} />
        </div>
      </main>
    </div>
  );
}
