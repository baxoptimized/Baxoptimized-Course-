import { neon } from "@neondatabase/serverless";

let _conn: ReturnType<typeof neon> | undefined;

function getConn(): ReturnType<typeof neon> {
  if (!_conn) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL environment variable is not set");
    _conn = neon(url);
  }
  return _conn;
}

// Lazy tagged-template proxy — safe to import at build time.
// Cast to Record<string, unknown>[] — all callers do row-result queries.
export const sql = (strings: TemplateStringsArray, ...values: unknown[]) =>
  getConn()(strings, ...values) as Promise<Record<string, unknown>[]>;
