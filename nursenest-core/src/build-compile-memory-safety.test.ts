import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const dir = dirname(fileURLToPath(import.meta.url));
const root = join(dir, "..");

const emptyGenerateStaticParamsPattern =
  /export\s+(?:async\s+)?function\s+generateStaticParams\([^)]*\)\s*(?::\s*[^{]+)?\s*\{\s*return\s+\[\]\s*;?\s*\}/m;

/** Single-line `import … from "…"` only — avoids false positives across later `export type … from` lines. */
const eagerImportPattern = (modulePath: string) =>
  new RegExp(
    String.raw`^import\s+(?!type\b)[^\n]*?from\s+["']${modulePath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["'];?$`,
    "m",
  );

const dynamicImportPattern = (modulePath: string) =>
  new RegExp(
    String.raw`import\s*\(\s*["']${modulePath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']\s*\)`,
  );

function read(relativePath: string): string {
  return readFileSync(join(root, relativePath), "utf8");
}

function assertNoEagerImport(source: string, modulePath: string, message?: string) {
  assert.doesNotMatch(source, eagerImportPattern(modulePath), message ?? modulePath);
}

function assertHasDynamicImport(source: string, modulePath: string, message?: string) {
  assert.match(source, dynamicImportPattern(modulePath), message ?? modulePath);
}

const onDemandRouteFiles = [
  "src/app/(marketing)/(default)/australia/[topic]/page.tsx",
  "src/app/(marketing)/(default)/china/[topic]/page.tsx",
  "src/app/(marketing)/(default)/france/[topic]/page.tsx",
  "src/app/(marketing)/(default)/germany/[topic]/page.tsx",
  "src/app/(marketing)/(default)/hungary/[topic]/page.tsx",
  "src/app/(marketing)/(default)/india/[topic]/page.tsx",
  "src/app/(marketing)/(default)/italy/[topic]/page.tsx",
  "src/app/(marketing)/(default)/japan/[topic]/page.tsx",
  "src/app/(marketing)/(default)/korea/[topic]/page.tsx",
  "src/app/(marketing)/(default)/mexico/[topic]/page.tsx",
  "src/app/(marketing)/(default)/middle-east/[topic]/page.tsx",
  "src/app/(marketing)/(default)/portugal/[topic]/page.tsx",
  "src/app/(marketing)/[locale]/australia/[topic]/page.tsx",
  "src/app/(marketing)/[locale]/china/[topic]/page.tsx",
  "src/app/(marketing)/[locale]/france/[topic]/page.tsx",
  "src/app/(marketing)/[locale]/germany/[topic]/page.tsx",
  "src/app/(marketing)/[locale]/hungary/[topic]/page.tsx",
  "src/app/(marketing)/[locale]/india/[topic]/page.tsx",
  "src/app/(marketing)/[locale]/italy/[topic]/page.tsx",
  "src/app/(marketing)/[locale]/japan/[topic]/page.tsx",
  "src/app/(marketing)/[locale]/korea/[topic]/page.tsx",
  "src/app/(marketing)/[locale]/mexico/[topic]/page.tsx",
  "src/app/(marketing)/[locale]/middle-east/[topic]/page.tsx",
  "src/app/(marketing)/[locale]/portugal/[topic]/page.tsx",
  "src/app/(marketing)/(default)/allied-health/[slug]/page.tsx",
  "src/app/(marketing)/(default)/allied-health/[slug]/lessons/page.tsx",
  "src/app/(marketing)/(default)/allied-health/[slug]/lessons/[lessonSlug]/page.tsx",
  "src/app/(marketing)/(default)/allied/[career]/page.tsx",
  "src/app/(marketing)/(default)/pre-nursing/lessons/[slug]/page.tsx",
  "src/app/(marketing)/(default)/pre-nursing/practice/[slug]/page.tsx",
  "src/app/(marketing)/[locale]/pre-nursing/lessons/[slug]/page.tsx",
  "src/app/(marketing)/(default)/questions/[slug]/page.tsx",
  "src/app/(marketing)/(default)/seo/[slug]/page.tsx",
  "src/app/(marketing)/[locale]/[slug]/page.tsx",
  "src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/[exam]/page.tsx",
] as const;

test("next.config.mjs avoids async-module and optional static Sentry load during build", () => {
  const nextConfig = read("next.config.mjs");

  assert.doesNotMatch(nextConfig, /await\s+import\(["']@sentry\/nextjs["']\)/);
  assert.doesNotMatch(nextConfig, eagerImportPattern("@sentry/nextjs"));
  assert.doesNotMatch(nextConfig, /\beslint\s*:\s*\{/);
  // Turbopack is now the primary build engine — these env vars must be set to prevent
  // webpack from spawning unconstrained parallel workers on memory-tight builders.
  assert.match(nextConfig, /process\.env\.TURBOPACK\s*=\s*["']1["']/);
  assert.match(nextConfig, /process\.env\.NEXT_TURBOPACK\s*=\s*["']1["']/);
  // webpackBuildWorker must stay false so any explicit --webpack fallback path stays single-worker.
  assert.match(nextConfig, /webpackBuildWorker:\s*false/);
  assert.match(nextConfig, /workerThreads:\s*false/);
});

test("staff-session defers heavy auth and role-source imports", () => {
  const staffSession = read("src/lib/auth/staff-session.ts");

  assertNoEagerImport(staffSession, "@/lib/auth");
  assertNoEagerImport(staffSession, "@/lib/auth/admin-role-source");

  assertHasDynamicImport(staffSession, "@/lib/auth");
  assertHasDynamicImport(staffSession, "@/lib/auth/admin-role-source");
});

test("auth runtime avoids direct @sentry/nextjs imports (logging via safeServerLog)", () => {
  const auth = read("src/lib/auth.ts");

  assert.doesNotMatch(auth, /^import\s+\*\s+as\s+Sentry\s+from\s+["']@sentry\/nextjs["'];?$/m);
  assert.doesNotMatch(auth, /import\s*\(\s*["']@sentry\/nextjs["']\s*\)/);
  assert.match(auth, /safeServerLog/);
});

test("sentry metrics helper defers core SDK import", () => {
  const sentryMetrics = read("src/lib/observability/sentry-metrics.ts");

  assertNoEagerImport(sentryMetrics, "@sentry/core");
  assertHasDynamicImport(sentryMetrics, "@sentry/core");
});

test("safe server log keeps optional Sentry load opaque to build-time tracing", () => {
  const safeServerLog = read("src/lib/observability/safe-server-log.ts");

  assert.doesNotMatch(safeServerLog, /import\s*\(\s*["']@sentry\/nextjs["']\s*\)/);
  assert.match(safeServerLog, /loadSentryServerSdk/);
});

test("on-demand marketing routes do not keep empty generateStaticParams exports", () => {
  for (const file of onDemandRouteFiles) {
    const source = read(file);
    assert.doesNotMatch(source, emptyGenerateStaticParamsPattern, file);
  }
});

test("root app error boundary defers optional Sentry import", () => {
  const appError = read("src/app/error.tsx");

  assert.doesNotMatch(appError, /^import\s+\*\s+as\s+Sentry\s+from\s+["']@sentry\/nextjs["'];?$/m);
  assert.doesNotMatch(appError, /import\s*\(\s*["']@sentry\/nextjs["']\s*\)/);
  assert.match(appError, /captureClientExceptionIfEnabled/);
});

test("root not-found page defers auth-bound resume imports during build", () => {
  const notFound = read("src/app/not-found.tsx");

  assertNoEagerImport(notFound, "@/lib/auth");
  assertNoEagerImport(notFound, "@/lib/ui/not-found-resume");

  assertHasDynamicImport(notFound, "@/lib/auth");
  assertHasDynamicImport(notFound, "@/lib/ui/not-found-resume");
});

test("shared root layouts avoid eager observability imports during production build", () => {
  const rootLayout = read("src/app/layout.tsx");
  assertNoEagerImport(rootLayout, "@/lib/observability/render-trace");
  assertNoEagerImport(rootLayout, "@/lib/observability/sentry-route-observability");
  assert.doesNotMatch(rootLayout, /loadRenderTrace/);

  const marketingLayout = read("src/app/(marketing)/(default)/layout.tsx");
  assertNoEagerImport(marketingLayout, "@/lib/observability/render-trace");
  assertNoEagerImport(marketingLayout, "@/lib/observability/sentry-route-observability");
  assert.match(marketingLayout, /loadRenderTrace/);
  assert.match(marketingLayout, /loadMarketingLayoutObservability/);
});

test("canonical destinations avoid eager learner nav imports in public marketing callers", () => {
  const canonicalDestinations = read("src/lib/navigation/canonical-destinations.ts");

  assertNoEagerImport(canonicalDestinations, "@/lib/navigation/learner-primary-nav");
  assert.match(canonicalDestinations, /getLearnerPrimaryNavModule/);
});

test("shared app layouts defer admin palette and learner bundle loaders", () => {
  const appLayout = read("src/app/(app)/app/layout.tsx");

  assertNoEagerImport(appLayout, "@/components/admin/admin-global-command-palette");
  assertNoEagerImport(appLayout, "@/lib/learner/learner-marketing-server");

  assertHasDynamicImport(appLayout, "@/components/admin/admin-global-command-palette");
  assertHasDynamicImport(appLayout, "@/lib/learner/learner-marketing-server");

  const adminLayout = read("src/app/(admin)/layout.tsx");

  assertNoEagerImport(adminLayout, "@/components/admin/admin-global-command-palette");
  assertNoEagerImport(adminLayout, "@/lib/marketing-i18n/load-marketing-message-shards");

  assertHasDynamicImport(adminLayout, "@/components/admin/admin-global-command-palette");
  assertHasDynamicImport(adminLayout, "@/lib/marketing-i18n/load-marketing-message-shards");
});

test("no src file uses Prisma runtime values (DbNull/JsonNull/sql/join) without a value import", () => {
  // Prevents `ReferenceError: Prisma is not defined` at build time / route evaluation.
  // `import type { Prisma }` is erased by TypeScript — runtime value members need `import { Prisma }`.
  const runtimeValuePattern = /\bPrisma\.(DbNull|JsonNull|AnyNull|sql|join|Decimal|validator)\b/;
  const valueImportPattern = /^import\s+\{[^}]*\bPrisma\b[^}]*\}\s+from\s+["']@prisma\/client["']/m;

  function walkSrc(dir: string, problems: string[]): void {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name !== "node_modules" && entry.name !== ".git") walkSrc(fullPath, problems);
      } else if ((entry.name.endsWith(".ts") || entry.name.endsWith(".tsx")) && !entry.name.endsWith(".test.ts")) {
        const src = readFileSync(fullPath, "utf8");
        if (runtimeValuePattern.test(src) && !valueImportPattern.test(src)) {
          problems.push(fullPath.slice(root.length + 1));
        }
      }
    }
  }

  const problems: string[] = [];
  walkSrc(join(root, "src"), problems);
  assert.deepEqual(problems, [], `Files using Prisma runtime values without value import:\n  ${problems.join("\n  ")}`);
});
