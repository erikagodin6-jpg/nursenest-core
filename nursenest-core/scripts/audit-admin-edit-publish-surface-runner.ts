/**
 * Read-only audit: prints markdown table of admin edit → storage → public surfaces.
 * Run: `cd nursenest-core && npx tsx scripts/audit-admin-edit-publish-surface-runner.ts [--verify-files]`
 */
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  ADMIN_EDIT_PUBLISH_SURFACES,
  formatAdminEditPublishMarkdownTable,
} from "@/lib/admin/admin-edit-publish-surface-registry";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function primaryAdminPageFile(adminEditRoute: string): string | null {
  let p = adminEditRoute.split("|")[0]?.trim() ?? "";
  p = p.split("(")[0]?.trim() ?? p;
  if (p.includes("?")) p = p.split("?")[0] ?? p;
  if (!p.startsWith("/admin")) return null;
  const rest = p.replace(/^\/admin\/?/, "").replace(/\/$/, "");
  if (!rest) return join(root, "src/app/(admin)/admin/page.tsx");
  return join(root, "src/app/(admin)/admin", ...rest.split("/").filter(Boolean), "page.tsx");
}

const verify = process.argv.includes("--verify-files");

// eslint-disable-next-line no-console
console.log("# Admin edit → publish surface audit\n");
// eslint-disable-next-line no-console
console.log(formatAdminEditPublishMarkdownTable(ADMIN_EDIT_PUBLISH_SURFACES));

if (verify) {
  // eslint-disable-next-line no-console
  console.log("\n## File existence (primary admin route segment only)\n");
  for (const row of ADMIN_EDIT_PUBLISH_SURFACES) {
    const fp = primaryAdminPageFile(row.adminEditRoute);
    if (!fp) {
      // eslint-disable-next-line no-console
      console.log(`- **${row.contentType}**: skip (non-standard admin path)`);
      continue;
    }
    const ok = existsSync(fp);
    // eslint-disable-next-line no-console
    console.log(`- **${row.contentType}**: \`${fp.replace(root + "/", "")}\` → ${ok ? "OK" : "MISSING"}`);
  }

  const criticalApis = [
    "src/app/api/admin/pathway-lessons/[id]/route.ts",
    "src/app/api/admin/lessons/[id]/route.ts",
    "src/app/api/admin/marketing-public-content/route.ts",
    "src/app/api/admin/blog/route.ts",
    "src/app/api/admin/questions/[id]/route.ts",
  ];
  // eslint-disable-next-line no-console
  console.log("\n## Critical save APIs\n");
  for (const rel of criticalApis) {
    const fp = join(root, rel);
    // eslint-disable-next-line no-console
    console.log(`- \`${rel}\` → ${existsSync(fp) ? "OK" : "MISSING"}`);
  }
}
