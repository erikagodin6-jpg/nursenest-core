#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(new URL("../..", import.meta.url).pathname);
const reportDir = path.join(repoRoot, "reports", "deployment-reliability");
const reportPath = path.join(reportDir, "build-artifact-validation.json");

const expectedRoutes = [
  "/",
  "/canada/rn/nclex-rn",
  "/canada/pn/rex-pn",
  "/canada/np/cnple",
  "/flashcards",
  "/cat",
  "/practice-tests",
  "/lessons",
  "/readyz",
  "/healthz",
];

const defaultRetiredStrings = [
  "origin_no_healthy_upstream",
  "no healthy upstream",
  "The request did not complete before the flashcard player could hydrate.",
];

const retiredStrings = (process.env.NN_RETIRED_ERROR_STRINGS ?? "")
  .split(/\n|\|/)
  .map((s) => s.trim())
  .filter(Boolean);
const stringsToScan = retiredStrings.length > 0 ? retiredStrings : defaultRetiredStrings;

function readJson(relativePath) {
  const fullPath = path.join(repoRoot, relativePath);
  if (!fs.existsSync(fullPath)) {
    return { ok: false, relativePath, message: `${relativePath} is missing.` };
  }
  try {
    return { ok: true, relativePath, fullPath, json: JSON.parse(fs.readFileSync(fullPath, "utf8")) };
  } catch (error) {
    return {
      ok: false,
      relativePath,
      message: `${relativePath} is not valid JSON: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

function routeRegexMatches(route, regexText) {
  try {
    return new RegExp(regexText).test(route);
  } catch {
    return false;
  }
}

function classifyRoute(route, routesManifest, appPathsManifest) {
  const staticRoutes = routesManifest.staticRoutes ?? [];
  const dynamicRoutes = routesManifest.dynamicRoutes ?? [];
  const redirects = routesManifest.redirects ?? [];
  const rewrites = [
    ...(routesManifest.rewrites?.beforeFiles ?? []),
    ...(routesManifest.rewrites?.afterFiles ?? []),
    ...(routesManifest.rewrites?.fallback ?? []),
  ];
  const appPathKeys = Object.keys(appPathsManifest ?? {});

  const staticHit = staticRoutes.find((entry) => entry.page === route || routeRegexMatches(route, entry.regex));
  if (staticHit) return { ok: true, route, kind: "static", page: staticHit.page };

  const dynamicHit = dynamicRoutes.find((entry) => entry.page === route || routeRegexMatches(route, entry.regex));
  if (dynamicHit) return { ok: true, route, kind: "dynamic", page: dynamicHit.page };

  const redirectHit = redirects.find((entry) => entry.source === route || entry.destination === route || routeRegexMatches(route, entry.regex));
  if (redirectHit) {
    return {
      ok: true,
      route,
      kind: "redirect",
      source: redirectHit.source,
      destination: redirectHit.destination,
      statusCode: redirectHit.statusCode,
    };
  }

  const rewriteHit = rewrites.find((entry) => entry.source === route || entry.destination === route);
  if (rewriteHit) return { ok: true, route, kind: "rewrite", source: rewriteHit.source, destination: rewriteHit.destination };

  const appHit = appPathKeys.find((key) => {
    const normalized = key.replace(/\/(?:page|route)$/, "").replace(/\([^)]*\)\//g, "");
    return normalized === route || key.endsWith(`${route}/page`) || key.endsWith(`${route}/route`);
  });
  if (appHit) return { ok: true, route, kind: "app-path", appPath: appHit };

  return { ok: false, route, kind: "missing", message: `${route} is not registered in routes/app manifests.` };
}

function scanRetiredStrings(rootDir, strings) {
  const hits = [];
  const maxBytes = 2 * 1024 * 1024;
  const allowedExt = new Set([".js", ".json", ".html", ".txt", ".rsc", ".meta", ".css"]);

  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === "cache" || entry.name === "trace") continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
        continue;
      }
      const ext = path.extname(entry.name);
      if (!allowedExt.has(ext)) continue;
      const stat = fs.statSync(full);
      if (stat.size > maxBytes) continue;
      const text = fs.readFileSync(full, "utf8");
      for (const retired of strings) {
        if (retired && text.includes(retired)) {
          hits.push({ file: path.relative(repoRoot, full), retiredString: retired });
        }
      }
    }
  }

  walk(rootDir);
  return hits;
}

const checks = [];
const middlewareManifest = readJson(".next/server/middleware-manifest.json");
const routesManifest = readJson(".next/routes-manifest.json");
const appPathsManifest = readJson(".next/server/app-paths-manifest.json");

checks.push({
  name: "middleware-manifest",
  ok: middlewareManifest.ok && fs.existsSync(path.join(repoRoot, ".next", "server", "middleware.js")),
  details: middlewareManifest.ok
    ? {
        version: middlewareManifest.json.version,
        middlewareCount: Object.keys(middlewareManifest.json.middleware ?? {}).length,
        functionCount: Object.keys(middlewareManifest.json.functions ?? {}).length,
        middlewareRuntimeFile: ".next/server/middleware.js",
      }
    : { message: middlewareManifest.message },
});
checks.push({
  name: "routes-manifest",
  ok: routesManifest.ok,
  details: routesManifest.ok
    ? {
        version: routesManifest.json.version,
        staticRouteCount: routesManifest.json.staticRoutes?.length ?? 0,
        dynamicRouteCount: routesManifest.json.dynamicRoutes?.length ?? 0,
        redirectCount: routesManifest.json.redirects?.length ?? 0,
      }
    : { message: routesManifest.message },
});
checks.push({
  name: "app-paths-manifest",
  ok: appPathsManifest.ok,
  details: appPathsManifest.ok ? { appPathCount: Object.keys(appPathsManifest.json).length } : { message: appPathsManifest.message },
});

const routeChecks = routesManifest.ok && appPathsManifest.ok
  ? expectedRoutes.map((route) => classifyRoute(route, routesManifest.json, appPathsManifest.json))
  : expectedRoutes.map((route) => ({ ok: false, route, kind: "unverified", message: "Required manifests missing." }));
checks.push({ name: "expected-route-registrations", ok: routeChecks.every((r) => r.ok), details: routeChecks });

const retiredHits = fs.existsSync(path.join(repoRoot, ".next"))
  ? scanRetiredStrings(path.join(repoRoot, ".next"), stringsToScan)
  : [{ file: ".next", retiredString: "(missing .next output)" }];
checks.push({
  name: "retired-error-string-scan",
  ok: retiredHits.length === 0,
  details: { stringsScanned: stringsToScan, hitCount: retiredHits.length, hits: retiredHits.slice(0, 50) },
});

const failed = checks.filter((check) => !check.ok);
const report = {
  generatedAt: new Date().toISOString(),
  status: failed.length === 0 ? "pass" : "fail",
  failureCount: failed.length,
  expectedRoutes,
  checks,
};

fs.mkdirSync(reportDir, { recursive: true });
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);

for (const check of checks) {
  console.log(`[deploy:build-artifacts] ${check.ok ? "OK" : "FAIL"} ${check.name}`);
}
console.log(`[deploy:build-artifacts] report=${path.relative(repoRoot, reportPath)}`);

if (failed.length > 0) {
  process.exit(1);
}
