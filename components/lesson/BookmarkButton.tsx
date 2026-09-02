"use client";

import { useState, useTransition } from "react";

export function BookmarkButton({
  lessonId,
  initialBookmarked,
  action,
}: {
  lessonId: string;
  initialBookmarked: boolean;
  action: (lessonId: string) => Promise<{ bookmarked: boolean }>;
}) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [pending, startTransition] = useTransition();

  return (
    <button
      onClick={() =>
        startTransition(async () => {
          const result = await action(lessonId);
          setBookmarked(result.bookmarked);
        })
      }
      disabled={pending}
      aria-pressed={bookmarked}
      aria-label={bookmarked ? "Remove bookmark" : "Bookmark this lesson"}
      title={bookmarked ? "Remove bookmark" : "Bookmark this lesson"}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors disabled:opacity-60"
      style={{
        background: bookmarked ? "var(--color-accent-subtle)" : "var(--color-navy-800)",
        border: `1px solid ${bookmarked ? "var(--color-accent)" : "var(--color-navy-700)"}`,
      }}
    >
      <svg width="15" height="15" viewBox="0 0 15 15" fill={bookmarked ? "var(--color-accent)" : "none"}>
        <path
          d="M3.5 1.5h8a1 1 0 0 1 1 1v11l-5-3.2-5 3.2v-11a1 1 0 0 1 1-1Z"
          stroke={bookmarked ? "var(--color-accent)" : "var(--color-text-muted)"}
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
