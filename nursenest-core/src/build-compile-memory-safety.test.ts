import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const dir = dirname(fileURLToPath(import.meta.url));
const root = join(dir, "..");

const emptyGenerateStaticParamsPattern =
  /export\s+(?:async\s+)?function\s+generateStaticParams\([^)]*\)\s*(?::\s*[^{]+)?\s*\{\s*return\s+\[\]\s*;?\s*\}/m;

const eagerImportPattern = (modulePath: string) =>
  new RegExp(
    String.raw`^import\s+(?!type\b)[\s\S]*?from\s+["']${modulePath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["'];?$`,
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

test("next.config avoids async-module and optional static Sentry load during build", () => {
  const nextConfig = read("next.config.ts");

  assert.doesNotMatch(nextConfig, /await\s+import\(["']@sentry\/nextjs["']\)/);
  assert.doesNotMatch(nextConfig, eagerImportPattern("@sentry/nextjs"));
  assert.doesNotMatch(nextConfig, /\beslint\s*:\s*\{/);
});

test("staff-session defers heavy auth and role-source imports", () => {
  const staffSession = read("src/lib/auth/staff-session.ts");

  assertNoEagerImport(staffSession, "@/lib/auth");
  assertNoEagerImport(staffSession, "@/lib/auth/admin-role-source");

  assertHasDynamicImport(staffSession, "@/lib/auth");
  assertHasDynamicImport(staffSession, "@/lib/auth/admin-role-source");
});

test("auth runtime defers optional Sentry import through opaque helper", () => {
  const auth = read("src/lib/auth.ts");

  assert.doesNotMatch(auth, /^import\s+\*\s+as\s+Sentry\s+from\s+["']@sentry\/nextjs["'];?$/m);
  assert.doesNotMatch(auth, /import\s*\(\s*["']@sentry\/nextjs["']\s*\)/);
  assert.match(auth, /loadSentryAuthSdk/);
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
  assert.match(rootLayout, /loadRenderTrace/);

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
  const appLayout = read("src/app/(student)/app/layout.tsx");

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