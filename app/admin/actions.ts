"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/session";
import { sql } from "@/lib/db";

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") redirect("/login");
  return user;
}

export async function updateUserRole(formData: FormData): Promise<void> {
  await requireAdmin();

  const userId = formData.get("userId") as string;
  const role = formData.get("role") as string;

  if (!["student", "staff", "admin"].includes(role)) return;

  await sql`UPDATE users SET role = ${role} WHERE id = ${userId}`;
}

export async function approveCheckpoint(formData: FormData): Promise<void> {
  await requireAdmin();

  const submissionId = formData.get("submissionId") as string;

  // Fetch the submission so we know which module and user it belongs to
  const subRaw = await sql`
    SELECT cs.user_id, cs.content, m.slug AS module_slug
    FROM   checkpoint_submissions cs
    JOIN   modules m ON m.id = cs.module_id
    WHERE  cs.id = ${submissionId}
    LIMIT  1
  `;
  const sub = (subRaw as unknown as { user_id: string; content: string; module_slug: string }[])[0];
  if (!sub) return;

  await sql`
    UPDATE checkpoint_submissions
    SET status = 'approved', reviewed_at = NOW()
    WHERE id = ${submissionId}
  `;

  // Capstone approval → create (or update) certificate row
  if (sub.module_slug === "module-15-capstone") {
    const parsed = (() => {
      try { return JSON.parse(sub.content) as Record<string, unknown>; }
      catch { return {}; }
    })();
    const userName = (parsed.name  as string) || "";
    const brief    = (parsed.brief as string) || "";

    await sql`
      INSERT INTO certificates (user_id, user_name, brief)
      VALUES (${sub.user_id}, ${userName}, ${brief})
      ON CONFLICT DO NOTHING
    `;
  }

  revalidatePath("/admin");
}

export async function requestRevision(formData: FormData): Promise<void> {
  await requireAdmin();

  const submissionId = formData.get("submissionId") as string;

  await sql`
    UPDATE checkpoint_submissions
    SET status = 'needs_revision', reviewed_at = NOW()
    WHERE id = ${submissionId}
  `;

  revalidatePath("/admin");
}
