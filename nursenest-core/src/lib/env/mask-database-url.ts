/**
 * Mask userinfo in postgres/mysql-style URLs for logs and telemetry.
 * Pure string/URL parsing — safe for client bundles (no DB or process env reads).
 */
export function maskDatabaseUrl(url: string): string {
  try {
    const u = new URL(url);
    const host = u.hostname;
    const port = u.port ? `:${u.port}` : "";
    const db = u.pathname.replace(/^\//, "") || "(no database name)";
    const search = u.search || "";
    return `${u.protocol}//***:***@${host}${port}/${db}${search}`;
  } catch {
    return "(unparseable connection string)";
  }
}
