#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import fg from "fast-glob";

const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const strict = process.argv.includes("--strict");
const reportDir = `${root}/reports`;
const jsonPath = `${reportDir}/runtime-boundary-audit.json`;
const mdPath = `${reportDir}/runtime-boundary-audit.md`;

const patterns = [
  "src/app/**/*.{ts,tsx}",
  "src/components/**/*.{ts,tsx}",
  "src/lib/**/*.{ts,tsx}",
].map((p) => `${root}/${p}`);

function rel(path) {
  return relative(root, path).replaceAll("\\", "/");
}

function routeGroupFor(path) {
  if (path.startsWith("src/app/(marketing)/")) return "public";
  if (path.startsWith("src/app/(app)/")) return "learner";
  if (path.startsWith("src/app/(admin)/")) return "admin";
  if (path.startsWith("src/app/api/auth/") || path.includes("/login/") || path.includes("/signup/")) return "auth";
  if (path.startsWith("src/app/api/admin/")) return "admin-api";
  if (path.startsWith("src/app/api/")) return "api";
  if (path.startsWith("src/app/(runtime)/")) return "runtime";
  if (path.startsWith("src/components/")) return "shared-component";
  if (path.startsWith("src/lib/")) return "shared-lib";
  return "other";
}

const dependencyRules = [
  ["layout", /\/layout\.tsx$/],
  ["provider", /Provider|Context|use[A-Z][A-Za-z0-9]*Context/],
  ["middleware", /src\/(middleware|proxy)\.ts$|from ["']next\/server["']/],
  ["auth-session-client", /next-auth\/react|useSession|getSession\(/],
  ["auth-server", /getProtectedRouteSession|from ["']@\/lib\/auth["']|auth\(\)|getServerSession/],
  ["entitlement", /resolveEntitlementForPage|entitlement|paywall/i],
  ["prisma", /from ["']@\/lib\/db["']|prisma\./],
  ["request-api", /cookies\(\)|headers\(\)|draftMode\(\)|searchParams/],
  ["force-dynamic", /export const dynamic\s*=\s*["']force-dynamic["']/],
  ["cache-isr", /export const revalidate|unstable_cache|Cache-Control|s-maxage|stale-while-revalidate/],
  ["learner-loader", /@\/lib\/learner|@\/components\/student|@\/components\/exam|loadLearner|studyNext|tutor/i],
  ["marketing-loader", /@\/lib\/marketing|@\/components\/marketing|loadMarketing/i],
];

function depsFor(source, path) {
  const deps = [];
  for (const [name, rule] of dependencyRules) {
    if (rule.test(source) || rule.test(path)) deps.push(name);
  }
  return deps;
}

function blastRadius(group, deps) {
  if (group === "public") {
    if (deps.includes("auth-session-client") || deps.includes("auth-server")) return "high";
    if (deps.includes("prisma") || deps.includes("learner-loader") || deps.includes("force-dynamic")) return "high";
    if (deps.includes("request-api")) return "medium";
    return "low";
  }
  if (group === "learner") {
    if (deps.includes("marketing-loader") || deps.includes("prisma") || deps.includes("auth-server")) return "medium";
    return "low";
  }
  if (group === "admin" || group === "admin-api") return "contained-admin";
  if (group === "shared-component" || group === "shared-lib") {
    if (deps.includes("auth-session-client") || deps.includes("prisma") || deps.includes("provider")) return "cross-cutting";
  }
  return "low";
}

function publicAuthenticatedRuntimeDependency(deps) {
  return deps.includes("auth-session-client") || deps.includes("auth-server") || deps.includes("entitlement");
}

function blockedPublicRuntimeImports(source) {
  const blocked = [];
  const checks = [
    ["protected-session", /getProtectedRouteSession|from ["']@\/lib\/auth\/protected-route-session["']/],
    ["optional-public-session", /getOptionalPublicSession|from ["']@\/lib\/auth\/optional-public-session["']/],
    ["entitlement-resolver", /resolveEntitlementForPage|from ["']@\/lib\/entitlements\/resolve-entitlement-for-page["']/],
    ["direct-prisma-client", /from ["']@\/lib\/db["']|prisma\./],
    ["learner-server-loader", /from ["']@\/lib\/learner\//],
  ];
  for (const [name, pattern] of checks) {
    if (pattern.test(source)) blocked.push(name);
  }
  return blocked;
}

function isCorePublicStabilityRoute(path) {
  return (
    path.includes("/pricing/page.tsx") ||
    path.includes("/blog/page.tsx") ||
    path.includes("/canada/rn/") ||
    path.includes("/canada/np/") ||
    /src\/app\/\(marketing\)\/\(default\)\/\[locale\]\/\[slug\]\/\[examCode\]\/(page|cat|pricing)\.tsx$/.test(path)
  );
}

const files = fg.sync(patterns, { dot: false, onlyFiles: true, absolute: true }).sort();
const entries = [];

for (const file of files) {
  const path = rel(file);
  const source = readFileSync(file, "utf8");
  const deps = depsFor(source, path);
  if (deps.length === 0) continue;
  const group = routeGroupFor(path);
  const blockedPublicImports = group === "public" ? blockedPublicRuntimeImports(source) : [];
  entries.push({
    path,
    group,
    dependencies: deps,
    blockedPublicRuntimeImports: blockedPublicImports,
    corePublicStabilityRoute: group === "public" && isCorePublicStabilityRoute(path),
    blastRadius: blastRadius(group, deps),
    publicAuthenticatedRuntimeDependency: group === "public" && publicAuthenticatedRuntimeDependency(deps),
  });
}

const byGroup = {};
for (const entry of entries) {
  byGroup[entry.group] ??= {
    files: 0,
    highBlastRadius: 0,
    publicAuthenticatedRuntimeDependencies: 0,
    dependencies: {},
  };
  byGroup[entry.group].files += 1;
  if (entry.blastRadius === "high" || entry.blastRadius === "cross-cutting") byGroup[entry.group].highBlastRadius += 1;
  if (entry.publicAuthenticatedRuntimeDependency) byGroup[entry.group].publicAuthenticatedRuntimeDependencies += 1;
  for (const dep of entry.dependencies) {
    byGroup[entry.group].dependencies[dep] = (byGroup[entry.group].dependencies[dep] ?? 0) + 1;
  }
}

const criticalPublicFiles = entries.filter(
  (entry) => entry.group === "public" && entry.blockedPublicRuntimeImports.length > 0,
);
const blockingCorePublicFiles = criticalPublicFiles.filter((entry) => entry.corePublicStabilityRoute);

const guardrails = {
  publicMarketingProviderIsPassive:
    existsSync(`${root}/src/app/(marketing)/layout.tsx`) &&
    readFileSync(`${root}/src/app/(marketing)/layout.tsx`, "utf8").includes('runtimeBoundary="public"'),
  appProviderStillAuthenticated:
    existsSync(`${root}/src/app/(app)/layout.tsx`) &&
    readFileSync(`${root}/src/app/(app)/layout.tsx`, "utf8").includes("<AuthSessionProvider session={session}>"),
};

const result = {
  generatedAt: new Date().toISOString(),
  root,
  totals: {
    filesWithRuntimeDependencies: entries.length,
    criticalPublicFiles: criticalPublicFiles.length,
    blockingCorePublicFiles: blockingCorePublicFiles.length,
  },
  groups: byGroup,
  guardrails,
  criticalPublicFiles,
  blockingCorePublicFiles,
  entries,
};

mkdirSync(reportDir, { recursive: true });
writeFileSync(jsonPath, `${JSON.stringify(result, null, 2)}\n`);

const lines = [];
lines.push("# Runtime Boundary Audit");
lines.push("");
lines.push(`Generated: ${result.generatedAt}`);
lines.push("");
lines.push("## Summary");
lines.push("");
lines.push(`- Files with runtime dependencies: ${entries.length}`);
lines.push(`- Critical public files: ${criticalPublicFiles.length}`);
lines.push(`- Blocking core public files: ${blockingCorePublicFiles.length}`);
lines.push(`- Public marketing provider passive: ${guardrails.publicMarketingProviderIsPassive ? "yes" : "no"}`);
lines.push(`- Learner app provider authenticated: ${guardrails.appProviderStillAuthenticated ? "yes" : "no"}`);
lines.push("");
lines.push("## Route Groups");
lines.push("");
lines.push("| Group | Files | High/Cross Blast Radius | Public Auth Runtime | Top Dependencies |");
lines.push("| --- | ---: | ---: | ---: | --- |");
for (const [group, stats] of Object.entries(byGroup).sort(([a], [b]) => a.localeCompare(b))) {
  const topDeps = Object.entries(stats.dependencies)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, count]) => `${name} ${count}`)
    .join(", ");
  lines.push(
    `| ${group} | ${stats.files} | ${stats.highBlastRadius} | ${stats.publicAuthenticatedRuntimeDependencies} | ${topDeps} |`,
  );
}
lines.push("");
lines.push("## Critical Public Dependencies");
lines.push("");
if (criticalPublicFiles.length === 0) {
  lines.push("No public route file imports protected auth, entitlement, or learner runtime loaders directly.");
} else {
  for (const entry of criticalPublicFiles) {
    const marker = entry.corePublicStabilityRoute ? " **CORE**" : "";
    lines.push(`- \`${entry.path}\`${marker} — ${entry.blockedPublicRuntimeImports.join(", ")}`);
  }
}
lines.push("");
lines.push("## Highest Blast Radius Files");
lines.push("");
for (const entry of entries
  .filter((item) => item.blastRadius === "high" || item.blastRadius === "cross-cutting")
  .slice(0, 80)) {
  lines.push(`- \`${entry.path}\` (${entry.group}) — ${entry.dependencies.join(", ")}`);
}
lines.push("");
writeFileSync(mdPath, `${lines.join("\n")}\n`);

console.log(`[runtime-boundary-audit] wrote ${rel(jsonPath)} and ${rel(mdPath)}`);
console.log(
  `[runtime-boundary-audit] criticalPublicFiles=${criticalPublicFiles.length} providerPassive=${guardrails.publicMarketingProviderIsPassive}`,
);

if (strict) {
  const failures = [];
  if (!guardrails.publicMarketingProviderIsPassive) failures.push("public marketing provider is not passive");
  if (!guardrails.appProviderStillAuthenticated) failures.push("learner app provider is not authenticated");
  if (blockingCorePublicFiles.length > 0) {
    failures.push(`${blockingCorePublicFiles.length} core public files import protected runtime dependencies`);
  }
  if (failures.length > 0) {
    console.error(`[runtime-boundary-audit] strict failure: ${failures.join("; ")}`);
    process.exit(1);
  }
}
