#!/usr/bin/env npx tsx
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

type Check = {
  contract: string;
  name: string;
  ok: boolean;
  detail: string;
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const reportPath = path.join(root, "docs", "reports", "architecture-contract-verification.md");

function rel(...parts: string[]): string {
  return path.join(root, ...parts);
}

function read(relativePath: string): string {
  return readFileSync(rel(relativePath), "utf8");
}

function fileExists(relativePath: string): boolean {
  return existsSync(rel(relativePath));
}

const checks: Check[] = [];

function check(contract: string, name: string, ok: boolean, detail: string): void {
  checks.push({ contract, name, ok, detail });
}

function includesAll(source: string, needles: readonly string[]): boolean {
  return needles.every((needle) => source.includes(needle));
}

const contractsDoc = fileExists("docs/architecture/contracts.md") ? read("docs/architecture/contracts.md") : "";
const packageJson = JSON.parse(read("package.json")) as { scripts?: Record<string, string> };
const deploymentGates = fileExists(".github/workflows/deployment-gates.yml")
  ? read(".github/workflows/deployment-gates.yml")
  : "";

// Contract 001
const proxyPath = "src/proxy.ts";
const proxySrc = fileExists(proxyPath) ? read(proxyPath) : "";
check("001", "contracts.md records Contract 001", /## Contract 001/.test(contractsDoc), "Next.js request interception contract is documented.");
check("001", "src/proxy.ts exists", fileExists(proxyPath), "Next.js 16 proxy entrypoint must exist.");
check("001", "src/middleware.ts is absent", !fileExists("src/middleware.ts"), "middleware.ts is permanently banned.");
check("001", "src/middleware.js is absent", !fileExists("src/middleware.js"), "middleware.js is permanently banned.");
check("001", "proxy exports proxy function", /export\s+(async\s+)?function\s+proxy\b/.test(proxySrc), "proxy.ts must export a proxy function.");
check("001", "proxy exports matcher config", /export\s+const\s+config\b/.test(proxySrc) && /matcher/.test(proxySrc), "proxy.ts must export config with matcher.");
check("001", "proxy does not import middleware shim", !/from\s+["']\.\/middleware["']/.test(proxySrc), "proxy.ts must not re-export or import middleware.ts.");

// Contract 002
const flashcardsRoute = fileExists("src/app/api/flashcards/inventory/route.ts")
  ? read("src/app/api/flashcards/inventory/route.ts")
  : "";
const flashcardsPage = fileExists("src/app/(app)/app/(learner)/flashcards/page.tsx")
  ? read("src/app/(app)/app/(learner)/flashcards/page.tsx")
  : "";
const sharedFlashcardsHelper = fileExists("src/lib/flashcards/load-shared-flashcards-hub-inventory.server.ts")
  ? read("src/lib/flashcards/load-shared-flashcards-hub-inventory.server.ts")
  : "";
check("002", "contracts.md records Contract 002", /## Contract 002/.test(contractsDoc), "Flashcards shared inventory contract is documented.");
check(
  "002",
  "flashcard inventory API uses shared helper",
  /loadSharedFlashcardsHubInventoryForPathway/.test(flashcardsRoute) && !/loadFlashcardsExamInventoryForPathway/.test(flashcardsRoute),
  "API route must not return an exam-only flashcard inventory.",
);
check(
  "002",
  "flashcard server page uses shared helper",
  /loadSharedFlashcardsHubInventoryForPathway/.test(flashcardsPage) && !/loadFlashcardsExamInventoryForPathway/.test(flashcardsPage),
  "Server bootstrap must use the same shared helper as the API.",
);
check(
  "002",
  "shared helper derives from count-only session builder",
  includesAll(sharedFlashcardsHelper, ["buildFlashcardCustomSession", "includeCards: false", "lessonVirtualDiagnostics"]),
  "Shared flashcard inventory must be a count-only projection of the session builder.",
);

// Contract 003
const dbPreflight = fileExists("scripts/db-preflight.mts") ? read("scripts/db-preflight.mts") : "";
const dbAssert = fileExists("scripts/lib/database-env-assert.mts") ? read("scripts/lib/database-env-assert.mts") : "";
const publicationReadiness = fileExists("scripts/blog/verify-blog-publication-readiness.mts")
  ? read("scripts/blog/verify-blog-publication-readiness.mts")
  : "";
check("003", "contracts.md records Contract 003", /## Contract 003/.test(contractsDoc), "Publication preflight contract is documented.");
check(
  "003",
  "database preflight script exists and parses safely",
  includesAll(dbPreflight, ["load-dotenv-for-cli.mts", "parsePostgresUrlTargetSafe", "script-env-bootstrap", "DATABASE_URL"]),
  "DB preflight must load env from package root and print only safe URL components.",
);
check(
  "003",
  "database env assertion blocks missing/bad URLs",
  includesAll(dbAssert, ["assertDatabaseUrlPresentOrExit", "DATABASE_URL is missing", "placeholder database"]),
  "DB-backed scripts need a reusable fail-fast assertion.",
);
check(
  "003",
  "publication readiness fails without DATABASE_URL",
  includesAll(publicationReadiness, ["DATABASE_URL is required", "process.exit(1)"]),
  "Publication verification must not pass without database connectivity.",
);
check(
  "003",
  "package exposes database URL validation",
  Boolean(packageJson.scripts?.["db:validate-url-shape"]),
  "CI/operators must have a direct database URL shape validator.",
);

// Contract 004
const contentInventoryContract = fileExists("src/lib/content-inventory/content-inventory-resolver.contract.test.ts")
  ? read("src/lib/content-inventory/content-inventory-resolver.contract.test.ts")
  : "";
const studyFailover = fileExists("src/lib/learner/study-inventory-failover.ts")
  ? read("src/lib/learner/study-inventory-failover.ts")
  : "";
const practiceInventory = fileExists("src/lib/questions/pathway-practice-hub-inventory.ts")
  ? read("src/lib/questions/pathway-practice-hub-inventory.ts")
  : "";
check("004", "contracts.md records Contract 004", /## Contract 004/.test(contractsDoc), "One-inventory-helper contract is documented.");
check(
  "004",
  "content inventory contract covers CAT and flashcard parity",
  includesAll(contentInventoryContract, ["catPool", "flashcardExamPool", "loadSharedFlashcardsHubInventoryForPathway"]),
  "Existing contract tests must continue enforcing shared CAT/flashcard inventory parity.",
);
check(
  "004",
  "study inventory failover helper exists",
  /loadStudyInventoryWithFailover/.test(studyFailover),
  "Learner surfaces should use shared failover/snapshot inventory wrappers instead of ad hoc fallback logic.",
);
check(
  "004",
  "practice hub inventory helper exists",
  /buildSkeletonPracticeHubAggregates/.test(practiceInventory) && /hydratePracticeHubAggregatesFromGroupByRows/.test(practiceInventory),
  "Practice must use a shared pathway hub inventory projection.",
);

// CI wiring
check(
  "CI",
  "package has verify:architecture-contracts script",
  packageJson.scripts?.["verify:architecture-contracts"] === "npx tsx scripts/verify-architecture-contracts.mts",
  "Architecture contracts must be runnable by npm script.",
);
check(
  "CI",
  "ci:verify runs architecture contracts",
  Boolean(packageJson.scripts?.["ci:verify"]?.includes("verify:architecture-contracts")),
  "Main CI verification must include architecture contracts.",
);
check(
  "CI",
  "deployment-gates workflow runs architecture contracts",
  /verify:architecture-contracts/.test(deploymentGates),
  "Deployment gates must block architecture contract regressions.",
);

const failed = checks.filter((row) => !row.ok);
const generatedAt = new Date().toISOString();
const lines = [
  "# Architecture Contract Verification",
  "",
  `Generated: ${generatedAt}`,
  "",
  failed.length === 0 ? "**Status:** PASS" : "**Status:** FAIL",
  "",
  "| Contract | Check | Status | Detail |",
  "| --- | --- | --- | --- |",
  ...checks.map((row) => `| ${row.contract} | ${row.name} | ${row.ok ? "PASS" : "FAIL"} | ${row.detail.replaceAll("|", "\\|")} |`),
  "",
];

mkdirSync(path.dirname(reportPath), { recursive: true });
writeFileSync(reportPath, `${lines.join("\n")}\n`);

if (failed.length > 0) {
  console.error(`[architecture-contracts] ${failed.length} failure(s). See docs/reports/architecture-contract-verification.md`);
  for (const row of failed) {
    console.error(`- Contract ${row.contract}: ${row.name}`);
  }
  process.exit(1);
}

console.log(`[architecture-contracts] PASS ${checks.length} checks. Wrote docs/reports/architecture-contract-verification.md`);
