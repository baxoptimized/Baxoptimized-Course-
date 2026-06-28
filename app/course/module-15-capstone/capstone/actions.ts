"use server";

import { redirect } from "next/navigation";
import { put } from "@vercel/blob";
import { getCurrentUser } from "@/lib/session";
import { sql } from "@/lib/db";

const MODULE_SLUG = "module-15-capstone";

export async function submitCapstone(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const brief     = (formData.get("brief")      as string | null)?.trim() ?? "";
  const name      = (formData.get("name")       as string | null)?.trim() ?? "";
  const liveUrl   = (formData.get("live_url")   as string | null)?.trim() ?? "";
  const githubUrl = (formData.get("github_url") as string | null)?.trim() ?? "";
  const notes     = (formData.get("notes")      as string | null)?.trim() ?? "";
  const rubricRaw = formData.get("rubric")      as string | null;
  const rubric    = rubricRaw ? (JSON.parse(rubricRaw) as string[]) : [];

  if (!brief || !name || !liveUrl || !githubUrl) {
    redirect(`/course/${MODULE_SLUG}/capstone`);
  }

  const modRaw = await sql`SELECT id FROM modules WHERE slug = ${MODULE_SLUG} LIMIT 1`;
  const mod = (modRaw as unknown as { id: string }[])[0];
  if (!mod) redirect("/course");

  // Upload screenshots (pagespeed required, email optional)
  const fileUrls: string[] = [];
  for (const field of ["pagespeed_screenshot", "email_screenshot"]) {
    const file = formData.get(field) as File | null;
    if (file && file.size > 0) {
      if (!process.env.BLOB_READ_WRITE_TOKEN) {
        console.warn("BLOB_READ_WRITE_TOKEN not set — screenshot upload skipped");
      } else {
        try {
          const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
          const blob = await put(
            `capstone/${user.userId}/${field}-${Date.now()}-${safeName}`,
            file,
            { access: "public" },
          );
          fileUrls.push(blob.url);
        } catch (err) {
          console.error("Blob upload failed:", err);
        }
      }
    }
  }

  const content = JSON.stringify({ brief, name, live_url: liveUrl, github_url: githubUrl, notes, rubric });

  await sql`
    INSERT INTO checkpoint_submissions (user_id, module_id, content, file_urls, status)
    VALUES (
      ${user.userId},
      ${mod.id},
      ${content},
      ${JSON.stringify(fileUrls)},
      'pending'
    )
  `;

  redirect(`/course/${MODULE_SLUG}/capstone`);
}
