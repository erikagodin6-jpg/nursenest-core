import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const dir = dirname(fileURLToPath(import.meta.url));
const root = join(dir, "..");
const emptyGenerateStaticParamsPattern =
  /export function generateStaticParams\([^)]*\)\s*(:\s*[^{]+)?\s*\{\s*return \[\];\s*\}/m;

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
  const nextConfig = readFileSync(join(root, "next.config.ts"), "utf8");
  assert.doesNotMatch(nextConfig, /await\s+import\(["']@sentry\/nextjs["']\)/);
  assert.doesNotMatch(nextConfig, /import\s+\{\s*withSentryConfig\s*\}\s+from\s+["']@sentry\/nextjs["']/);
  assert.doesNotMatch(nextConfig, /\beslint\s*:\s*\{/);
});

test("staff-session defers heavy auth and role-source imports", () => {
  const staffSession = readFileSync(join(root, "src", "lib", "auth", "staff-session.ts"), "utf8");
  assert.doesNotMatch(staffSession, /^import .*@\/lib\/auth["'];?$/m);
  assert.doesNotMatch(staffSession, /^import .*@\/lib\/auth\/admin-role-source["'];?$/m);
  assert.match(staffSession, /await import\(["']@\/lib\/auth["']\)/);
  assert.match(staffSession, /await import\(["']@\/lib\/auth\/admin-role-source["']\)/);
});

test("auth runtime defers optional Sentry import", () => {
  const auth = readFileSync(join(root, "src", "lib", "auth.ts"), "utf8");
  assert.doesNotMatch(auth, /^import \* as Sentry from ["']@sentry\/nextjs["'];?$/m);
  assert.doesNotMatch(auth, /import\(["']@sentry\/nextjs["']\)/);
  assert.match(auth, /loadSentryAuthSdk/);
});

test("sentry metrics helper defers core SDK import", () => {
  const sentryMetrics = readFileSync(join(root, "src", "lib", "observability", "sentry-metrics.ts"), "utf8");
  assert.doesNotMatch(sentryMetrics, /^import .*@sentry\/core["'];?$/m);
  assert.match(sentryMetrics, /import\(["']@sentry\/core["']\)/);
});

test("safe server log keeps optional Sentry load opaque to build-time tracing", () => {
  const safeServerLog = readFileSync(join(root, "src", "lib", "observability", "safe-server-log.ts"), "utf8");
  assert.doesNotMatch(safeServerLog, /import\(["']@sentry\/nextjs["']\)/);
  assert.match(safeServerLog, /loadSentryServerSdk/);
});

test("on-demand marketing routes do not keep empty generateStaticParams exports", () => {
  for (const file of onDemandRouteFiles) {
    const source = readFileSync(join(root, file), "utf8");
    assert.doesNotMatch(source, emptyGenerateStaticParamsPattern, file);
  }
});

test("root app error boundary defers optional Sentry import", () => {
  const appError = readFileSync(join(root, "src", "app", "error.tsx"), "utf8");
  assert.doesNotMatch(appError, /^import \* as Sentry from ["']@sentry\/nextjs["'];?$/m);
  assert.match(appError, /import\(["']@sentry\/nextjs["']\)/);
});

test("safe server log helper avoids async Sentry import in shared build graph", () => {
  const safeServerLog = readFileSync(join(root, "src", "lib", "observability", "safe-server-log.ts"), "utf8");
  assert.doesNotMatch(safeServerLog, /import\(["']@sentry\/nextjs["']\)/);
  assert.match(safeServerLog, /loadSentryServerSdk/);
});

test("root not-found page defers auth-bound resume imports during build", () => {
  const notFound = readFileSync(join(root, "src", "app", "not-found.tsx"), "utf8");
  assert.doesNotMatch(notFound, /^import .*@\/lib\/auth["'];?$/m);
  assert.doesNotMatch(notFound, /^import .*@\/lib\/ui\/not-found-resume["'];?$/m);
  assert.match(notFound, /import\(["']@\/lib\/auth["']\)/);
  assert.match(notFound, /import\(["']@\/lib\/ui\/not-found-resume["']\)/);
});

test("shared root layouts avoid eager observability imports during production build", () => {
  const rootLayout = readFileSync(join(root, "src", "app", "layout.tsx"), "utf8");
  assert.doesNotMatch(rootLayout, /^import .*@\/lib\/observability\/render-trace["'];?$/m);
  assert.match(rootLayout, /loadRenderTrace/);

  const marketingLayout = readFileSync(join(root, "src", "app", "(marketing)", "(default)", "layout.tsx"), "utf8");
  assert.doesNotMatch(marketingLayout, /^import .*@\/lib\/observability\/render-trace["'];?$/m);
  assert.doesNotMatch(marketingLayout, /^import .*@\/lib\/observability\/sentry-route-observability["'];?$/m);
  assert.match(marketingLayout, /loadRenderTrace/);
  assert.match(marketingLayout, /loadMarketingLayoutObservability/);
});

test("canonical destinations avoid eager learner nav imports in public marketing callers", () => {
  const canonicalDestinations = readFileSync(
    join(root, "src", "lib", "navigation", "canonical-destinations.ts"),
    "utf8",
  );
  assert.doesNotMatch(canonicalDestinations, /^import .*@\/lib\/navigation\/learner-primary-nav["'];?$/m);
  assert.match(canonicalDestinations, /getLearnerPrimaryNavModule/);
});

test("shared app layouts defer admin palette and learner bundle loaders", () => {
  const appLayout = readFileSync(join(root, "src", "app", "(student)", "app", "layout.tsx"), "utf8");
  assert.doesNotMatch(appLayout, /^import .*@\/components\/admin\/admin-global-command-palette["'];?$/m);
  assert.doesNotMatch(appLayout, /^import .*@\/lib\/learner\/learner-marketing-server["'];?$/m);
  assert.match(appLayout, /import\(["']@\/components\/admin\/admin-global-command-palette["']\)/);
  assert.match(appLayout, /import\(["']@\/lib\/learner\/learner-marketing-server["']\)/);

  const adminLayout = readFileSync(join(root, "src", "app", "(admin)", "layout.tsx"), "utf8");
  assert.doesNotMatch(adminLayout, /^import .*@\/components\/admin\/admin-global-command-palette["'];?$/m);
  assert.doesNotMatch(adminLayout, /^import .*@\/lib\/marketing-i18n\/load-marketing-message-shards["'];?$/m);
  assert.match(adminLayout, /import\(["']@\/components\/admin\/admin-global-command-palette["']\)/);
  assert.match(adminLayout, /import\(["']@\/lib\/marketing-i18n\/load-marketing-message-shards["']\)/);
});
