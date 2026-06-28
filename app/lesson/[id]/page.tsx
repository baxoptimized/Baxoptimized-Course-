import { notFound, redirect } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getCurrentUser } from "@/lib/session";
import { sql } from "@/lib/db";
import { preprocessMdx } from "@/lib/preprocessMdx";
import { mdxComponents } from "@/components/mdx";
import { LessonShell } from "@/components/lesson/LessonShell";
import LogoutButton from "@/components/LogoutButton";

type Lesson = {
  id: string;
  title: string;
  content_mdx: string;
  order_index: number;
  module_title: string;
  module_slug: string;
  is_staff_only: boolean;
};

export default async function LessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { id } = await params;

  const rows = (await sql`
    SELECT
      l.id,
      l.title,
      l.content_mdx,
      l.order_index,
      m.title   AS module_title,
      m.slug    AS module_slug,
      m.is_staff_only
    FROM lessons l
    JOIN modules m ON m.id = l.module_id
    WHERE l.id = ${id}
    LIMIT 1
  `) as Lesson[];

  if (!rows.length) notFound();
  const lesson = rows[0];

  // Staff-only modules require staff or admin role
  if (lesson.is_staff_only && user.role === "student") redirect("/course");

  const processedMdx = preprocessMdx(lesson.content_mdx ?? "");

  return (
    <>
      {/* Site-wide nav strip */}
      <header
        className="sticky top-0 z-40 flex items-center justify-between px-6 py-3"
        style={{
          background: "rgba(8,15,30,0.85)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--color-navy-700)",
        }}
      >
        <span
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: "var(--color-gold)" }}
        >
          Baxoptimized
        </span>
        <div className="flex items-center gap-4">
          <a
            href="/course"
            className="text-xs transition-colors"
            style={{ color: "var(--color-text-muted)" }}
          >
            ← All modules
          </a>
          <LogoutButton />
        </div>
      </header>

      <LessonShell title={lesson.title} moduleTitle={lesson.module_title}>
        <MDXRemote source={processedMdx} components={mdxComponents} />
      </LessonShell>
    </>
  );
}
