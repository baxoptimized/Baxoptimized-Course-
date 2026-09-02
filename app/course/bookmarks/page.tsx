import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { sql } from "@/lib/db";
import { parseModuleTitle } from "@/lib/moduleTitle";
import { lessonUrlPart } from "@/lib/lessonUrl";
import { CourseNav } from "@/components/course/CourseNav";

type BookmarkedLesson = {
  lesson_id: string;
  lesson_slug: string;
  lesson_title: string;
  module_slug: string;
  module_title: string;
  bookmarked_at: string;
};

export default async function BookmarksPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const rows = (await sql`
    SELECT
      l.id         AS lesson_id,
      l.slug       AS lesson_slug,
      l.title      AS lesson_title,
      m.slug       AS module_slug,
      m.title      AS module_title,
      b.created_at AS bookmarked_at
    FROM bookmarks b
    JOIN lessons l ON l.id = b.lesson_id
    JOIN modules m ON m.id = l.module_id
    WHERE b.user_id = ${user.userId}
    ORDER BY b.created_at DESC
  `) as unknown as BookmarkedLesson[];

  return (
    <div className="min-h-screen" style={{ background: "var(--color-navy-950)" }}>
      <CourseNav back={{ href: "/course", label: "← All modules" }} />

      <main className="mx-auto max-w-2xl px-5 pb-24 pt-12">
        <p
          className="mb-1 text-xs font-semibold uppercase tracking-widest"
          style={{ color: "var(--color-gold)" }}
        >
          Saved for later
        </p>
        <h1 className="mb-8 text-3xl font-bold" style={{ color: "var(--color-text-primary)" }}>
          Your bookmarks
        </h1>

        {rows.length === 0 ? (
          <div
            className="rounded-xl p-8 text-center"
            style={{ background: "var(--color-navy-900)", border: "1px solid var(--color-navy-700)" }}
          >
            <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
              Nothing saved yet. Click the bookmark icon on any lesson to keep it here, handy once
              you&apos;re doing real client work and want to come back to something specific.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {rows.map((r) => {
              const { num } = parseModuleTitle(r.module_title);
              const href = `/course/${r.module_slug}/${lessonUrlPart(r.lesson_slug, r.module_slug)}`;
              return (
                <a
                  key={r.lesson_id}
                  href={href}
                  className="block rounded-xl p-4 transition-colors"
                  style={{
                    background: "var(--color-navy-900)",
                    border: "1px solid var(--color-navy-700)",
                    textDecoration: "none",
                  }}
                >
                  <p
                    className="font-display mb-1 text-[11px] font-bold uppercase tracking-widest"
                    style={{ color: "var(--color-gold)" }}
                  >
                    Module {num}
                  </p>
                  <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
                    {r.lesson_title}
                  </p>
                </a>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
