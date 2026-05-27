#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const packageRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const reportPath = path.join(packageRoot, "docs", "reports", "live-layout-drift-comparison.md");
const screenshotDir = path.join(packageRoot, "docs", "screenshots", "live-layout-verification");

const defaultLiveBase = "https://www.nursenest.ca";
const liveBase = process.env.NN_LAYOUT_AUDIT_LIVE_BASE_URL || defaultLiveBase;
const localBase = process.env.NN_LAYOUT_AUDIT_LOCAL_BASE_URL || null;

const routes = [
  {
    id: "homepage",
    path: "/",
    authRequired: false,
    markers: ["nn-home-marketing-rich-hero", "nn-premium-hero-grid", "nn-premium-hero-panel"],
  },
  {
    id: "learner-app",
    path: "/app",
    authRequired: true,
    markers: ["data-nn-learner-dashboard-convergence", "nn-learner-dashboard-convergence"],
  },
  {
    id: "practice-tests-hub",
    path: "/app/practice-tests?pathwayId=ca-rn-nclex-rn",
    authRequired: true,
    markers: [
      "data-nn-learner-area=\"practice-tests\"",
      "data-nn-premium-platform-module=\"practice-tests\"",
      "nn-practice-tests-hub-premium",
      "data-nn-practice-exam-hub-convergence",
    ],
  },
  {
    id: "flashcards-hub",
    path: "/app/flashcards?pathwayId=ca-rn-nclex-rn",
    authRequired: true,
    markers: [
      "data-nn-premium-flashcard-convergence",
      "data-nn-premium-platform-module=\"flashcards\"",
      "data-nn-e2e-flashcards-hub",
      "nn-flashcards-hub-premium",
    ],
  },
  {
    id: "report-card",
    path: "/app/account/report",
    authRequired: true,
    markers: [
      "data-nn-learner-report-card-convergence",
      "nn-learner-report-card-convergence",
      "nn-report-card-premium",
    ],
  },
  {
    id: "rn-questions-hub",
    path: "/canada/rn/nclex-rn/questions",
    authRequired: false,
    markers: ["MarketingPracticeQuestionsHubClient", "PathwayHero", "Start Mix"],
  },
  {
    id: "rn-lessons-hub",
    path: "/canada/rn/nclex-rn/lessons",
    authRequired: false,
    markers: ["nn-premium-lessons-system", "nn-premium-lessons-hub-hero", "data-nn-premium-full-platform-convergence"],
  },
  {
    id: "cat-entry",
    path: "/canada/rn/nclex-rn/cat",
    authRequired: false,
    markers: ["cat", "adaptive", "NurseNest"],
  },
];

const repoFiles = [
  "src/components/marketing/home/premium-homepage-hero.tsx",
  "src/components/student/learner-dashboard-page-shell.tsx",
  "src/components/student/learner-study-home.tsx",
  "src/app/(app)/app/(learner)/account/_lib/learner-report-card-route.tsx",
  "src/components/student/learner-report-card-premium.tsx",
  "src/components/student/practice-tests-hub-client.tsx",
  "src/components/flashcards/flashcards-hub-client.tsx",
  "src/components/exam/exam-session-shell.tsx",
  "src/components/study/cat-question-card.tsx",
  "src/components/study/practice-session-layout.tsx",
  "src/components/study/practice-question-card.tsx",
  "src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/questions/page.tsx",
  "src/app/premium-redesign-2026.css",
  "src/app/globals.css",
];

const repoText = repoFiles
  .map((file) => {
    try {
      return readFileSync(path.join(packageRoot, file), "utf8");
    } catch {
      return "";
    }
  })
  .join("\n");

function cacheBustedUrl(base, routePath) {
  const url = new URL(routePath, base);
  url.searchParams.set("cb", String(Date.now()));
  return url;
}

function htmlAssetUrls(html, pageUrl) {
  const urls = new Set();
  const attrRe = /\b(?:src|href)=["']([^"']*\/_next\/static\/[^"']+)["']/g;
  let match;
  while ((match = attrRe.exec(html))) {
    urls.add(new URL(match[1], pageUrl).toString());
  }
  return [...urls].sort();
}

function contentTypeOk(url, type) {
  const contentType = String(type || "").toLowerCase();
  if (url.endsWith(".js") || url.includes(".js?")) return contentType.includes("javascript");
  if (url.endsWith(".css") || url.includes(".css?")) return contentType.includes("text/css");
  return true;
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      "cache-control": "no-cache",
      pragma: "no-cache",
      "user-agent": "NurseNest-layout-drift-audit/1.0",
    },
  });
  const text = await response.text();
  return {
    url: String(url),
    ok: response.ok,
    status: response.status,
    contentType: response.headers.get("content-type") || "",
    text,
  };
}

async function auditRoute(base, route) {
  const pageUrl = cacheBustedUrl(base, route.path);
  const htmlResult = await fetchText(pageUrl);
  const assetUrls = htmlAssetUrls(htmlResult.text, pageUrl);
  const cssAssets = assetUrls.filter((url) => url.includes(".css"));
  const jsAssets = assetUrls.filter((url) => url.includes(".js"));
  const sampledAssets = [...cssAssets.slice(0, 4), ...jsAssets.slice(0, 6)];
  const assetResults = [];

  for (const assetUrl of sampledAssets) {
    try {
      const asset = await fetchText(assetUrl);
      assetResults.push({
        url: assetUrl,
        status: asset.status,
        contentType: asset.contentType,
        contentTypeCorrect: contentTypeOk(assetUrl, asset.contentType),
        returnedHtml: /<html|<!doctype html|NurseNest \| Global Nursing Exam Prep/i.test(asset.text.slice(0, 500)),
        text: asset.text,
      });
    } catch (error) {
      assetResults.push({
        url: assetUrl,
        status: 0,
        contentType: "",
        contentTypeCorrect: false,
        returnedHtml: false,
        error: error instanceof Error ? error.message : String(error),
        text: "",
      });
    }
  }

  const cssText = assetResults
    .filter((asset) => asset.url.includes(".css"))
    .map((asset) => asset.text)
    .join("\n");

  const markers = route.markers.map((marker) => ({
    marker,
    existsInRepo: repoText.includes(marker),
    existsInHtml: htmlResult.text.includes(marker),
    existsInCss: cssText.includes(marker),
  }));

  const badAssets = assetResults.filter((asset) => !asset.contentTypeCorrect || asset.returnedHtml || asset.status !== 200);
  return {
    route,
    page: htmlResult,
    dom: null,
    assetCount: assetUrls.length,
    cssAssetCount: cssAssets.length,
    jsAssetCount: jsAssets.length,
    sampledAssets: assetResults,
    badAssets,
    markers,
  };
}

async function auditBrowserDom(base, results) {
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    for (const result of results) {
      await page.goto(String(cacheBustedUrl(base, result.route.path)), { waitUntil: "domcontentloaded", timeout: 60_000 });
      await page.waitForLoadState("networkidle", { timeout: 30_000 }).catch(() => {});
      const content = await page.content();
      result.dom = {
        url: page.url(),
        title: await page.title().catch(() => ""),
        markers: result.route.markers.map((marker) => ({
          marker,
          existsInDom: content.includes(marker),
        })),
      };
    }
  } catch (error) {
    for (const result of results) {
      result.dom = {
        error: error instanceof Error ? error.message : String(error),
        markers: result.route.markers.map((marker) => ({ marker, existsInDom: false })),
      };
    }
  } finally {
    await browser?.close().catch(() => {});
  }
}

function yes(value) {
  return value ? "yes" : "no";
}

function routeConclusion(result) {
  const repoMarkers = result.markers.filter((m) => m.existsInRepo).length;
  const htmlMarkers = result.markers.filter((m) => m.existsInHtml).length;
  const cssMarkers = result.markers.filter((m) => m.existsInCss).length;
  const domMarkers = result.dom?.markers?.filter((m) => m.existsInDom).length ?? 0;

  if (result.badAssets.length > 0) {
    return "D candidate: sampled static asset returned wrong status/content-type/body.";
  }
  if (repoMarkers === 0) {
    return "A candidate: configured markers were not found in repo source.";
  }
  if (domMarkers > 0) {
    return "Markers present in hydrated browser DOM.";
  }
  if (htmlMarkers === 0 && cssMarkers > 0) {
    return result.route.authRequired
      ? "C/auth-gated: premium CSS exists but anonymous HTML does not render route markers."
      : "C candidate: premium CSS exists but route body marker is absent from HTML.";
  }
  if (htmlMarkers === 0) {
    return result.route.authRequired
      ? "Auth-gated anonymous shell; requires authenticated capture for final route verdict."
      : "B/C candidate: repo marker exists but live HTML lacks route marker.";
  }
  return "Markers present in live response.";
}

function renderTableRows(label, results) {
  const rows = [];
  for (const result of results) {
    for (const marker of result.markers) {
      const escapedMarker = marker.marker.replaceAll("|", "\\|");
      const domMarker = result.dom?.markers?.find((m) => m.marker === marker.marker);
      rows.push(
        `| ${label} | ${result.route.id} | \`${escapedMarker}\` | ${yes(marker.existsInRepo)} | n/a | ${yes(marker.existsInHtml)} | ${yes(domMarker?.existsInDom)} | ${yes(marker.existsInCss)} | ${result.badAssets.length === 0 ? "yes" : "no"} | ${routeConclusion(result)} |`,
      );
    }
  }
  return rows;
}

function renderAssetProof(label, results) {
  const lines = [];
  for (const result of results) {
    lines.push(`### ${label}: ${result.route.id}`);
    lines.push("");
    lines.push(`Page: \`${result.page.status}\` \`${result.page.contentType}\` \`${result.page.url}\``);
    lines.push(`Assets discovered: ${result.assetCount} (${result.jsAssetCount} JS, ${result.cssAssetCount} CSS); sampled: ${result.sampledAssets.length}`);
    lines.push("");
    lines.push("| Asset | Status | Content-Type | Correct Type | Returned HTML |");
    lines.push("| --- | ---: | --- | --- | --- |");
    for (const asset of result.sampledAssets) {
      const assetPath = new URL(asset.url).pathname;
      lines.push(`| \`${assetPath}\` | ${asset.status} | \`${asset.contentType || "unknown"}\` | ${yes(asset.contentTypeCorrect)} | ${yes(asset.returnedHtml)} |`);
    }
    lines.push("");
  }
  return lines;
}

async function auditBase(label, base) {
  const out = [];
  for (const route of routes) {
    out.push(await auditRoute(base, route));
  }
  await auditBrowserDom(base, out);
  return { label, base, results: out };
}

const audits = [await auditBase("live", liveBase)];
if (localBase) {
  audits.push(await auditBase("local", localBase));
}

mkdirSync(path.dirname(reportPath), { recursive: true });
mkdirSync(screenshotDir, { recursive: true });

const generatedAt = new Date().toISOString();
const lines = [
  "# Live Layout Drift Comparison",
  "",
  `Generated: ${generatedAt}`,
  "",
  `Live base: ${liveBase}`,
  "",
  localBase
    ? `Local base: ${localBase}`
    : "Local base: not provided. Set `NN_LAYOUT_AUDIT_LOCAL_BASE_URL=http://127.0.0.1:<port>` after a local production build to populate local-build rows.",
  "",
  "## Marker Comparison",
  "",
  "| Target | Route | Marker | Exists In Repo | Exists In Local Build | Exists In Raw HTML | Exists In Browser DOM | Exists In Live CSS | Asset Content-Type Correct | Conclusion |",
  "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
  ...audits.flatMap((audit) => renderTableRows(audit.label, audit.results)),
  "",
  "## Static Asset Content-Type Proof",
  "",
  ...audits.flatMap((audit) => renderAssetProof(audit.label, audit.results)),
  "## Classification Notes",
  "",
  "- A: redesign markers are not in repo/source.",
  "- B: markers are in repo/local build but absent from live responses, indicating deployment drift/stale artifact/wrong source.",
  "- C: markers are in live assets but the route renders another shell or branch.",
  "- D: emitted `/_next/static` assets return HTML or wrong content-type.",
  "",
];

writeFileSync(reportPath, `${lines.join("\n")}\n`, "utf8");

const hasBadAssets = audits.some((audit) => audit.results.some((result) => result.badAssets.length > 0));
console.log(`[layout-drift] wrote ${reportPath}`);
if (hasBadAssets) {
  console.error("[layout-drift] one or more sampled assets failed content-type/body checks");
  process.exitCode = 1;
}
