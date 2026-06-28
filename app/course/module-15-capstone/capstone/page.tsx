import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { sql } from "@/lib/db";
import { CourseNav } from "@/components/course/CourseNav";
import { CapstonePage } from "@/components/capstone/CapstonePage";
import { submitCapstone } from "./actions";

const MODULE_SLUG = "module-15-capstone";

type Submission = {
  id: string;
  status: "pending" | "approved" | "needs_revision";
  content: string;
  file_urls: string[];
  submitted_at: string;
};

type Certificate = {
  id: string;
  user_name: string;
  brief: string;
  issued_at: string;
};

export default async function CapstonePageRoute() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [submissionRaw, certRaw] = await Promise.all([
    sql`
      SELECT cs.id, cs.status, cs.content, cs.file_urls, cs.submitted_at
      FROM   checkpoint_submissions cs
      JOIN   modules m ON m.id = cs.module_id AND m.slug = ${MODULE_SLUG}
      WHERE  cs.user_id = ${user.userId}
      ORDER  BY cs.submitted_at DESC
      LIMIT  1
    `,
    sql`
      SELECT id, user_name, brief, issued_at
      FROM   certificates
      WHERE  user_id = ${user.userId}
      LIMIT  1
    `,
  ]);

  const submission = (submissionRaw as unknown as Submission[])[0] ?? null;
  const certificate = (certRaw as unknown as Certificate[])[0] ?? null;

  return (
    <div className="min-h-dvh" style={{ background: "var(--color-navy-950)" }}>

      <CourseNav back={{ href: "/course", label: "← All modules" }} />

      <CapstonePage
        submission={submission}
        certificate={certificate}
        action={submitCapstone}
      />
    </div>
  );
}
