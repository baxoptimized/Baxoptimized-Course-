// Styled placeholder slot for screenshots, GIFs, and images.
// Renders a clearly labelled card sized for the content type.
// Replace with a real <img> or <video> via the admin panel later.

const ICONS: Record<string, string> = {
  screenshot: "🖼️",
  "screenshot-gif": "🎞️",
  gif: "🎞️",
  image: "🖼️",
  "code-walkthrough": "💻",
};

const LABELS: Record<string, string> = {
  screenshot: "Screenshot placeholder",
  "screenshot-gif": "Screenshot / GIF placeholder",
  gif: "GIF placeholder",
  image: "Image placeholder",
  "code-walkthrough": "Code walkthrough placeholder",
};

const ASPECTS: Record<string, string> = {
  gif: "aspect-video",
  "screenshot-gif": "aspect-video",
  screenshot: "aspect-[16/9]",
  image: "aspect-[4/3]",
  "code-walkthrough": "aspect-[16/9]",
};

export function MediaPlaceholder({
  type = "screenshot",
  description,
}: {
  type?: string;
  description: string;
}) {
  const icon = ICONS[type] ?? "🖼️";
  const label = LABELS[type] ?? "Media placeholder";
  const aspect = ASPECTS[type] ?? "aspect-video";

  return (
    <figure
      data-reveal="true"
      className={`my-6 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3 px-8 text-center ${aspect}`}
      style={{
        borderColor: "var(--color-navy-600)",
        background: "rgba(20,32,53,0.5)",
      }}
      aria-label={description || label}
    >
      <span className="text-3xl opacity-40">{icon}</span>
      <p
        className="text-xs font-bold uppercase tracking-widest"
        style={{ color: "var(--color-text-muted)" }}
      >
        {label}
      </p>
      {description && (
        <p
          className="text-sm leading-relaxed max-w-sm"
          style={{ color: "var(--color-text-muted)" }}
        >
          {description}
        </p>
      )}
    </figure>
  );
}
