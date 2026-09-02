"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { sql } from "@/lib/db";

export async function markLessonComplete(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const lessonId = formData.get("lessonId") as string;
  const nextUrl  = formData.get("nextUrl")  as string;

  await sql`
    INSERT INTO progress (user_id, lesson_id)
    VALUES (${user.userId}, ${lessonId})
    ON CONFLICT DO NOTHING
  `;

  redirect(nextUrl || "/course");
}

export async function toggleBookmark(lessonId: string): Promise<{ bookmarked: boolean }> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const existing = await sql`
    SELECT id FROM bookmarks WHERE user_id = ${user.userId} AND lesson_id = ${lessonId}
  `;

  if (existing.length > 0) {
    await sql`DELETE FROM bookmarks WHERE user_id = ${user.userId} AND lesson_id = ${lessonId}`;
    return { bookmarked: false };
  }

  await sql`
    INSERT INTO bookmarks (user_id, lesson_id) VALUES (${user.userId}, ${lessonId})
    ON CONFLICT DO NOTHING
  `;
  return { bookmarked: true };
}
