#!/usr/bin/env npx tsx
/**
 * Print JSON from buildAdminOperationsDashboard (default page sizes). Requires DATABASE_URL for live flags.
 */
import "../src/lib/db/env-bootstrap";
import { buildAdminOperationsDashboard } from "@/lib/admin/build-admin-operations-dashboard";

async function main() {
  const dashboard = await buildAdminOperationsDashboard();
  console.log(JSON.stringify({ ok: true, dashboard }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
