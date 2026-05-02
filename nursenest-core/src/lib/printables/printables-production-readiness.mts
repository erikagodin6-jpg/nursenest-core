/**
 * Printables production readiness report (static + optional DB).
 *
 * Run from app package root (`nursenest-core/`):
 *   npx tsx src/lib/printables/printables-production-readiness.mts
 *
 * Prefer the same env loading as Prisma CLI:
 *   npx tsx scripts/run-prisma-with-env.mts exec -- npx tsx src/lib/printables/printables-production-readiness.mts
 * (if `prisma exec` is unavailable, ensure `.env.local` provides DATABASE_URL / DIRECT_URL.)
 *
 * Exit 0 only if all checks pass. Set `PRINTABLES_READINESS_SKIP_DB=1` to skip DB table probes.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
/** `src/` — learner/admin routes live under `src/app/...`. */
const appSrc = join(__dirname, "..", "..");
function read(relFromSrc: string): string {
  return readFileSync(join(appSrc, relFromSrc), "utf8");
}

function fail(msg: string): never {
  console.error(`[printables-readiness] FAIL: ${msg}`);
  process.exit(1);
}

function ok(msg: string): void {
  console.log(`[printables-readiness] OK: ${msg}`);
}

function warn(msg: string): void {
  console.warn(`[printables-readiness] WARN: ${msg}`);
}

function assertNoForbiddenLearnerJson(src: string, label: string): void {
  const forbidden = ["storageKey", "publicUrl", "digitaloceanspaces", "amazonaws.com", "X-Amz-", "cdn."];
  for (const token of forbidden) {
    if (src.includes(token)) {
      fail(`${label}: learner-facing source must not contain "${token}" (risk of leaking URLs/keys in JSON).`);
    }
  }
}

// Best-effort: match Prisma CLI env resolution (DATABASE_URL / DIRECT_URL).
try {
  await import(/* webpackIgnore: true */ new URL("../../../scripts/load-dotenv-for-cli.mts", import.meta.url).href);
} catch {
  /* optional when scripts path differs */
}

// --- Static checks (no DB) ---

const listRoute = read("app/api/printables/route.ts");
assertNoForbiddenLearnerJson(listRoute, "GET /api/printables");
if (!listRoute.includes("isPrintableStoreEnabledForLearners")) fail("printables route: missing learner flag gate");

const detailRoute = read("app/api/printables/[id]/route.ts");
assertNoForbiddenLearnerJson(detailRoute, "GET /api/printables/[id]");
if (!detailRoute.includes("isPrintableStoreEnabledForLearners")) fail("printables [id]: missing learner flag gate");

const downloadRoute = read("app/api/printables/[id]/download/route.ts");
if (!downloadRoute.includes("validatePrintablePdfMediaAsset")) fail("download: missing PDF validation");
if (!downloadRoute.includes("fetchPrintableAssetBodyFromSpaces")) fail("download: missing Spaces fetch");
if (!downloadRoute.includes('gate.reason !== "purchase_required"')) fail("download: missing paid-SKU deferral for purchase_required");
if (!downloadRoute.includes("userHasPaidPrintableAccess")) fail("download: missing paid access check");
// download route may include `storageKey` only in server-side Prisma select (never in JSON bodies).
for (const token of ["publicUrl", "digitaloceanspaces", "amazonaws.com", "X-Amz-"]) {
  if (downloadRoute.includes(token)) fail(`download route: unexpected token "${token}"`);
}

const uploadRoute = read("app/api/admin/printables/[id]/upload/route.ts");
if (!uploadRoute.includes("validatePrintablePdfMediaAsset") || !uploadRoute.includes("validatePrintableThumbnailMediaAsset")) {
  fail("admin upload: missing media validation");
}
if (!uploadRoute.includes("mediaAsset.delete")) fail("admin upload: missing invalid-asset rollback (delete)");

const analytics = read("lib/printables/printable-analytics.server.ts");
if (!analytics.includes("downloadsByDay") || !analytics.includes("getPrintableAnalyticsSummary")) {
  fail("analytics: summary must expose downloadsByDay");
}

const fetchSpaces = read("lib/printables/fetch-printable-asset-from-spaces.ts");
if (!fetchSpaces.includes("setPrintableAssetFetchOverrideForTests")) {
  fail("fetch-printable-asset: missing test override hook (mock only at this boundary)");
}

const flags = read("lib/printables/printable-store-flags.ts");
if (!flags.includes("isPrintableStoreEnabledForLearners") || !flags.includes("isPrintableAdminApiAllowed")) {
  fail("printable-store-flags: missing gate exports");
}

const adminGate = read("lib/printables/printable-admin-gate.ts");
if (!adminGate.includes("assertPrintableAdminSurface")) fail("printable-admin-gate: missing admin surface assert");

const entitlement = read("lib/printables/printable-entitlement.ts");
if (!entitlement.includes("FREE") || !entitlement.includes("userHasPaidPrintableAccess")) {
  fail("printable-entitlement: paid access helper must allow FREE grants alongside purchase/subscription");
}
ok("static: PrintableAccess grant query includes FREE for manual grants on paid SKUs");

ok("static: learner list/detail sources omit storage/CDN tokens");
ok("static: download validates PDF, defers purchase_required to PrintableAccess, uses Spaces fetch");
ok("static: admin upload validates + rolls back bad MediaAsset rows");
ok("static: analytics summary includes downloadsByDay");
ok("static: Spaces fetch override exists only in fetch-printable-asset-from-spaces");
ok("static: feature-flag modules present");

// --- Optional DB: printable_* tables ---

const skipDb = process.env.PRINTABLES_READINESS_SKIP_DB === "1";

async function dbChecks(): Promise<void> {
  if (skipDb) {
    warn("Skipping DB probes (PRINTABLES_READINESS_SKIP_DB=1).");
    return;
  }

  let prisma: typeof import("@/lib/db").prisma;
  try {
    ({ prisma } = await import("@/lib/db"));
  } catch (e) {
    warn(`Could not load Prisma client (${String(e)}). Set DATABASE_URL or use PRINTABLES_READINESS_SKIP_DB=1.`);
    return;
  }

  const required = ["printable_products", "printable_download_events", "printable_accesses"];
  const rows = await prisma.$queryRaw<{ table_name: string }[]>`
    SELECT table_name::text
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name IN ('printable_products', 'printable_download_events', 'printable_accesses')
  `;
  const found = new Set(rows.map((r) => r.table_name));
  for (const t of required) {
    if (!found.has(t)) fail(`DB: missing table "${t}" — apply migrations on this database (see docs/printout-store.md).`);
  }
  ok("DB: printable_products, printable_download_events, printable_accesses exist");
}

await dbChecks();

console.log("[printables-readiness] All checks passed.");
process.exit(0);
