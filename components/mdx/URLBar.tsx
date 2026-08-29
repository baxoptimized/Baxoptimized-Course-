// Renders a realistic mock browser address bar so URL/domain concepts have
// a concrete visual anchor instead of being described only in prose.

function LockIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="var(--color-success)" strokeWidth="1.5">
      <rect x="3" y="7.5" width="10" height="7" rx="1.5" />
      <path d="M5 7.5V5a3 3 0 0 1 6 0v2.5" strokeLinecap="round" />
    </svg>
  );
}

/** Splits a URL into { protocol, domain, path } for independent highlighting. */
function splitUrl(url: string) {
  const m = url.match(/^(https?:\/\/)?([^/]+)(\/.*)?$/i);
  if (!m) return { protocol: "https://", domain: url, path: "" };
  return {
    protocol: m[1] ?? "https://",
    domain: m[2] ?? "",
    path: m[3] ?? "",
  };
}

export function URLBar({ url, label }: { url: string; label?: string }) {
  const { domain, path } = splitUrl(url);

  return (
    <figure data-reveal="true" className="my-6">
      <div
        className="mx-auto flex max-w-xl items-center gap-2 rounded-t-lg px-3 py-2"
        style={{ background: "var(--color-navy-800)", border: "1px solid var(--color-navy-600)", borderBottom: "none" }}
      >
        <span className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#f87171" }} />
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#fbbf24" }} />
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#34d399" }} />
        </span>
      </div>
      <div
        className="mx-auto flex max-w-xl items-center gap-2 rounded-b-lg px-3 py-2.5"
        style={{ background: "var(--color-navy-900)", border: "1px solid var(--color-navy-600)" }}
      >
        <LockIcon />
        <span className="truncate font-mono text-[13px]" style={{ color: "var(--color-text-primary)" }}>
          <span style={{ color: "var(--color-text-muted)" }}>https://</span>
          <span style={{ color: "var(--color-text-primary)", fontWeight: 600 }}>{domain}</span>
          {path && <span style={{ color: "var(--color-text-secondary)" }}>{path}</span>}
        </span>
      </div>
      {label && (
        <figcaption className="mt-2 text-center text-xs" style={{ color: "var(--color-text-muted)" }}>
          {label}
        </figcaption>
      )}
    </figure>
  );
}
