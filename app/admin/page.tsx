import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { sql } from "@/lib/db";
import LogoutButton from "@/components/LogoutButton";
import { updateUserRole, approveCheckpoint, requestRevision } from "./actions";

type User = {
  id: string;
  email: string;
  role: string;
  created_at: string;
};

type Submission = {
  id: string;
  status: string;
  submitted_at: string;
  reviewed_at: string | null;
  content: string;
  user_email: string;
  module_slug: string;
  module_title: string;
};

export default async function AdminPage() {
  const me = await getCurrentUser();
  if (!me || me.role !== "admin") redirect("/login");

  const [usersRaw, submissionsRaw] = await Promise.all([
    sql`SELECT id, email, role, created_at FROM users ORDER BY created_at DESC`,
    sql`
      SELECT cs.id, cs.status, cs.submitted_at, cs.reviewed_at, cs.content,
             u.email  AS user_email,
             m.slug   AS module_slug,
             m.title  AS module_title
      FROM   checkpoint_submissions cs
      JOIN   users   u ON u.id = cs.user_id
      JOIN   modules m ON m.id = cs.module_id
      ORDER  BY cs.submitted_at DESC
    `,
  ]);
  const users = usersRaw as unknown as User[];
  const submissions = submissionsRaw as unknown as Submission[];

  const pending = submissions.filter((s) => s.status === "pending");
  const reviewed = submissions.filter((s) => s.status !== "pending");

  return (
    <main className="min-h-screen p-4 sm:p-8 lg:p-10" style={{ background: "var(--color-navy-950)" }}>
      <div className="max-w-5xl mx-auto space-y-14">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link
              href="/course"
              className="text-sm font-semibold tracking-widest uppercase"
              style={{ color: "var(--color-gold)", textDecoration: "none" }}
            >
              Baxoptimized
            </Link>
            <h1 className="text-2xl font-bold mt-1" style={{ color: "var(--color-text-primary)" }}>
              Admin
            </h1>
          </div>
          <LogoutButton />
        </div>

        {/* Users */}
        <section>
          <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--color-text-primary)" }}>
            Users
          </h2>
          <div className="overflow-x-auto rounded-lg border" style={{ borderColor: "var(--color-navy-700)" }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "var(--color-navy-900)", color: "var(--color-text-secondary)" }}>
                  <th className="text-left px-4 py-3 font-medium">Email</th>
                  <th className="text-left px-4 py-3 font-medium">Role</th>
                  <th className="text-left px-4 py-3 font-medium">Joined</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr
                    key={u.id}
                    style={{
                      background: i % 2 === 0 ? "var(--color-navy-950)" : "var(--color-navy-900)",
                      color: "var(--color-text-primary)",
                    }}
                  >
                    <td className="px-4 py-3">
                      {u.email}
                      {u.email === me.email && (
                        <span className="ml-2 text-xs px-1.5 py-0.5 rounded" style={{ background: "var(--color-navy-700)", color: "var(--color-text-muted)" }}>
                          you
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <form action={updateUserRole} className="flex items-center gap-2">
                        <input type="hidden" name="userId" value={u.id} />
                        <select
                          name="role"
                          defaultValue={u.role}
                          className="rounded px-2 py-1 text-sm border"
                          style={{
                            background: "var(--color-navy-800)",
                            color: "var(--color-text-primary)",
                            borderColor: "var(--color-navy-600)",
                          }}
                        >
                          <option value="student">student</option>
                          <option value="staff">staff</option>
                          <option value="admin">admin</option>
                        </select>
                        <button
                          type="submit"
                          className="text-xs px-3 py-1 rounded font-medium transition-opacity hover:opacity-80"
                          style={{ background: "var(--color-accent)", color: "#fff" }}
                        >
                          Save
                        </button>
                      </form>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: "var(--color-text-muted)" }}>
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3" />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Pending checkpoint submissions */}
        <section>
          <h2 className="text-lg font-semibold mb-1" style={{ color: "var(--color-text-primary)" }}>
            Checkpoint Submissions
          </h2>
          <p className="text-sm mb-4" style={{ color: "var(--color-text-muted)" }}>
            {pending.length} pending · {reviewed.length} reviewed
          </p>

          {pending.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              No pending submissions.
            </p>
          ) : (
            <div className="space-y-4">
              {pending.map((s) => (
                <div
                  key={s.id}
                  className="rounded-lg border p-5 space-y-3"
                  style={{ borderColor: "var(--color-navy-700)", background: "var(--color-navy-900)" }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-sm" style={{ color: "var(--color-text-primary)" }}>
                        {s.user_email}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
                        Module: <span style={{ color: "var(--color-text-secondary)" }}>{s.module_title || s.module_slug}</span>
                        &nbsp;·&nbsp;Submitted {new Date(s.submitted_at).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className="shrink-0 text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ background: "var(--color-warning)", color: "#000" }}
                    >
                      pending
                    </span>
                  </div>

                  {s.content && (
                    <p
                      className="text-sm whitespace-pre-wrap rounded p-3"
                      style={{ background: "var(--color-navy-950)", color: "var(--color-text-secondary)" }}
                    >
                      {s.content}
                    </p>
                  )}

                  <div className="flex items-center gap-3">
                    <form action={approveCheckpoint}>
                      <input type="hidden" name="submissionId" value={s.id} />
                      <button
                        type="submit"
                        className="text-sm px-4 py-1.5 rounded font-medium transition-opacity hover:opacity-80"
                        style={{ background: "var(--color-success)", color: "#000" }}
                      >
                        Approve
                      </button>
                    </form>
                    <form action={requestRevision}>
                      <input type="hidden" name="submissionId" value={s.id} />
                      <button
                        type="submit"
                        className="text-sm px-4 py-1.5 rounded font-medium transition-opacity hover:opacity-80"
                        style={{ background: "var(--color-navy-700)", color: "var(--color-text-primary)", border: "1px solid var(--color-navy-600)" }}
                      >
                        Request revision
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Reviewed submissions (collapsed summary) */}
          {reviewed.length > 0 && (
            <details className="mt-6">
              <summary
                className="text-sm cursor-pointer select-none"
                style={{ color: "var(--color-text-muted)" }}
              >
                Show {reviewed.length} reviewed submission{reviewed.length !== 1 ? "s" : ""}
              </summary>
              <div className="mt-3 space-y-3">
                {reviewed.map((s) => (
                  <div
                    key={s.id}
                    className="rounded-lg border px-5 py-3 flex items-center justify-between gap-4"
                    style={{ borderColor: "var(--color-navy-700)", background: "var(--color-navy-900)" }}
                  >
                    <div>
                      <p className="text-sm" style={{ color: "var(--color-text-primary)" }}>
                        {s.user_email}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
                        {s.module_title || s.module_slug} · {new Date(s.submitted_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className="shrink-0 text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{
                        background: s.status === "approved" ? "var(--color-success)" : "var(--color-error)",
                        color: "#000",
                      }}
                    >
                      {s.status}
                    </span>
                  </div>
                ))}
              </div>
            </details>
          )}
        </section>

      </div>
    </main>
  );
}
