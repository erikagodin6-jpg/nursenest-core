#!/usr/bin/env node
/**
 * Production marketing screenshot verification (Phases 4–6, 8).
 *
 * Audits LIVE production URLs only — never localhost.
 * Compares rendered image fingerprints against repo expected assets.
 *
 * Usage:
 *   PLAYWRIGHT_BASE_URL=https://nursenest.ca npx tsx scripts/verify-production-marketing-screenshots.mts
 */
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync, existsSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { chromium, type Page } from "playwright";

const PRODUCTION_BASE =
  process.env.PLAYWRIGHT_BASE_URL?.replace(/\/$/, "") ??
  process.env.BASE_URL?.replace(/\/$/, "") ??
  "https://nursenest.ca";

if (!/^https:\/\/(www\.)?nursenest\.(ca|io)/i.test(PRODUCTION_BASE)) {
  console.error(
    `Refusing to run: base URL must be production nursenest.ca/io, got ${PRODUCTION_BASE}`,
  );
  process.exit(2);
}

const APP_ROOT = resolve(import.meta.dirname, "..");
const REPORT_DIR = join(APP_ROOT, "reports", "production-screenshot-verification");
const DOCS_DIR = join(APP_ROOT, "docs");

type PageSpec = {
  id: string;
  path: string;
  label: string;
  /** CSS/data hooks that should exist after deploy */
  expectSelectors?: string[];
  /** Substrings that must NOT appear in loaded marketing img URLs when deployed */
  forbidUrlSubstrings?: string[];
  /** Local repo paths that should match live rendered assets (post-deploy) */
  expectedLocalAssets?: string[];
};

const PAGES: PageSpec[] = [
  { id: "homepage", path: "/", label: "Homepage", expectSelectors: ['main img[alt*="NurseNest"]'], expectedLocalAssets: ["public/marketing/homepage-screenshots/screenshot1.webp"] },
  { id: "pricing", path: "/pricing", label: "Pricing", expectSelectors: ['#pricing-tier-value img', 'img[src*="generated-screenshots"]'], expectedLocalAssets: ["public/marketing/generated-screenshots/marketing/rn-marketing-hub.webp"] },
  { id: "rn-hub", path: "/us/rn/nclex-rn", label: "RN Hub", expectSelectors: ['[data-nn-pathway-hub-proof="1"]'], expectedLocalAssets: ["public/marketing/generated-screenshots/marketing/rn-marketing-hub.webp"] },
  { id: "pn-hub", path: "/canada/pn/rex-pn", label: "RPN/PN Hub", expectSelectors: ['[data-nn-pathway-hub-proof="1"]'], expectedLocalAssets: ["public/marketing/generated-screenshots/marketing/pn-marketing-hub.webp"] },
  { id: "np-hub", path: "/canada/np/cnple", label: "NP Hub", expectSelectors: ['[data-nn-pathway-hub-proof="1"]'], expectedLocalAssets: ["public/marketing/generated-screenshots/marketing/np-marketing-hub.webp"] },
  { id: "allied-hub", path: "/allied/allied-health", label: "Allied Health", expectSelectors: ['[data-nn-pathway-hub-proof="1"]'], expectedLocalAssets: ["public/marketing/generated-screenshots/marketing/allied-marketing-hub.webp"] },
  { id: "new-grad", path: "/canada/new-grad", label: "New Grad", expectSelectors: ['[data-nn-marketing-product-proof="1"]'], expectedLocalAssets: ["public/marketing/generated-screenshots/marketing/new-grad-marketing-hub.webp"] },
  { id: "ecg", path: "/ecg-interpretation", label: "ECG Marketing", expectSelectors: ['[data-nn-marketing-product-proof="1"]'], expectedLocalAssets: ["public/marketing/generated-screenshots/core/ecg-workstation.webp"] },
  { id: "faq", path: "/faq", label: "FAQ", expectSelectors: ['main img[alt*="NurseNest"]'] },
  { id: "institutions", path: "/for-institutions", label: "Institutions", expectSelectors: ['main img[alt*="NurseNest"]'] },
];

const LEGACY_MARKERS = [
  "dashboard-redesign-preview",
  "landing-polish-preview",
  "/screenshot1.png",
  "digitaloceanspaces.com/screenshot",
];

function sha256(buf: Buffer): string {
  return createHash("sha256").update(buf).digest("hex");
}

function hashLocalFile(relPath: string): string | null {
  const abs = join(APP_ROOT, relPath);
  if (!existsSync(abs)) return null;
  return sha256(readFileSync(abs));
}

async function fetchHash(url: string): Promise<{ hash: string; bytes: number; contentType: string } | null> {
  try {
    const res = await fetch(url, { redirect: "follow" });
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    return {
      hash: sha256(buf),
      bytes: buf.length,
      contentType: res.headers.get("content-type") ?? "",
    };
  } catch {
    return null;
  }
}

/** Decode Next.js Image optimizer URLs to the underlying static marketing asset. */
function resolveMarketingAssetUrl(resolvedUrl: string, base: string): string {
  try {
    const u = new URL(resolvedUrl, base);
    if (u.pathname.includes("_next/image")) {
      const inner = u.searchParams.get("url");
      if (inner) {
        const decoded = decodeURIComponent(inner);
        return decoded.startsWith("http") ? decoded : `${base}${decoded.startsWith("/") ? decoded : `/${decoded}`}`;
      }
    }
    return u.href;
  } catch {
    return resolvedUrl;
  }
}

async function productionStaticHash(relPublicPath: string): Promise<{ hash: string; bytes: number } | null> {
  const url = `${PRODUCTION_BASE}/${relPublicPath.replace(/^public\//, "")}`;
  const remote = await fetchHash(url);
  if (!remote?.contentType.includes("image")) return null;
  return { hash: remote.hash, bytes: remote.bytes };
}

async function collectMarketingImages(page: Page): Promise<
  Array<{ src: string; alt: string; naturalWidth: number; resolvedUrl: string }>
> {
  return page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll("img"));
    return imgs
      .filter((img) => {
        const src = img.currentSrc || img.src || "";
        return (
          /screenshot|generated-screenshots|digitaloceanspaces|marketing\/homepage/i.test(src) ||
          (img.alt && /NurseNest|practice|flashcard|CAT|ECG|readiness|lesson/i.test(img.alt))
        );
      })
      .map((img) => ({
        src: img.src.slice(0, 300),
        alt: img.alt.slice(0, 120),
        naturalWidth: img.naturalWidth,
        resolvedUrl: (img.currentSrc || img.src).slice(0, 300),
      }));
  });
}

async function auditPage(spec: PageSpec): Promise<Record<string, unknown>> {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const url = `${PRODUCTION_BASE}${spec.path}`;

  const result: Record<string, unknown> = {
    id: spec.id,
    label: spec.label,
    url,
    timestamp: new Date().toISOString(),
    status: "unknown",
    httpStatus: null,
    images: [] as unknown[],
    missingSelectors: [] as string[],
    legacyUrls: [] as string[],
    fingerprintMatches: [] as unknown[],
    fingerprintMismatches: [] as unknown[],
    screenshotPath: null as string | null,
  };

  try {
    const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90_000 });
    result.httpStatus = response?.status() ?? null;
    await page.waitForTimeout(2500);

    if (spec.expectSelectors) {
      for (const sel of spec.expectSelectors) {
        const count = await page.locator(sel).count();
        if (count === 0) (result.missingSelectors as string[]).push(sel);
      }
    }

    const images = await collectMarketingImages(page);
    result.images = images;

    for (const img of images) {
      if (LEGACY_MARKERS.some((m) => img.resolvedUrl.includes(m))) {
        (result.legacyUrls as string[]).push(img.resolvedUrl);
      }
    }

    if (spec.expectedLocalAssets) {
      for (const rel of spec.expectedLocalAssets) {
        const localHash = hashLocalFile(rel);
        const localStat = existsSync(join(APP_ROOT, rel)) ? statSync(join(APP_ROOT, rel)) : null;
        let matched = false;

        // 1) Direct static URL on production (authoritative deploy fingerprint)
        if (localHash) {
          const staticRemote = await productionStaticHash(rel);
          if (staticRemote && staticRemote.hash === localHash) {
            (result.fingerprintMatches as unknown[]).push({
              local: rel,
              url: `${PRODUCTION_BASE}/${rel.replace(/^public\//, "")}`,
              sha256: localHash,
              bytes: staticRemote.bytes,
              via: "static-probe",
            });
            matched = true;
          }
        }

        // 2) Rendered img tags (carousel / lazy sections)
        if (!matched) {
          for (const img of images) {
            const assetUrl = resolveMarketingAssetUrl(img.resolvedUrl, PRODUCTION_BASE);
            const remote = await fetchHash(assetUrl);
            if (remote && localHash && remote.hash === localHash) {
              (result.fingerprintMatches as unknown[]).push({
                local: rel,
                url: assetUrl,
                sha256: localHash,
                bytes: remote.bytes,
                via: "dom",
              });
              matched = true;
              break;
            }
          }
        }

        if (!matched) {
          (result.fingerprintMismatches as unknown[]).push({
            local: rel,
            localSha256: localHash,
            localBytes: localStat?.size ?? null,
            localMtime: localStat?.mtime.toISOString() ?? null,
            note: localHash
              ? "Production static asset did not match repo fingerprint (deploy stale or path wrong)"
              : "Expected local asset missing from repo",
          });
        }
      }
    }

    mkdirSync(REPORT_DIR, { recursive: true });
    const shotPath = join(REPORT_DIR, `${spec.id}--1440x900.png`);
    await page.screenshot({ path: shotPath, fullPage: false });
    result.screenshotPath = shotPath;

    const hasLegacy = (result.legacyUrls as string[]).length > 0;
    const hasMissingSelectors = (result.missingSelectors as string[]).length > 0;
    const hasMismatches = (result.fingerprintMismatches as unknown[]).length > 0;

    if (hasLegacy || hasMissingSelectors || hasMismatches) {
      result.status = "FAIL";
    } else if ((result.fingerprintMatches as unknown[]).length > 0) {
      result.status = "PASS";
    } else {
      result.status = "WARN";
    }
  } catch (err) {
    result.status = "ERROR";
    result.error = err instanceof Error ? err.message : String(err);
  } finally {
    await browser.close();
  }

  return result;
}

function mdTable(rows: string[][]): string {
  if (rows.length === 0) return "";
  const header = rows[0]!;
  const sep = header.map(() => "---");
  const body = rows.slice(1);
  return [`| ${header.join(" | ")} |`, `| ${sep.join(" | ")} |`, ...body.map((r) => `| ${r.join(" | ")} |`)].join("\n");
}

async function main(): Promise<void> {
  console.log(`Production screenshot verification\nBase: ${PRODUCTION_BASE}\n`);

  const results: Record<string, unknown>[] = [];
  for (const spec of PAGES) {
    console.log(`Auditing ${spec.label} (${spec.path})…`);
    const r = await auditPage(spec);
    results.push(r);
    console.log(`  → ${r.status}`);
  }

  mkdirSync(REPORT_DIR, { recursive: true });
  const jsonPath = join(REPORT_DIR, "verification-results.json");
  writeFileSync(jsonPath, JSON.stringify({ baseUrl: PRODUCTION_BASE, auditedAt: new Date().toISOString(), results }, null, 2));

  const pass = results.filter((r) => r.status === "PASS").length;
  const fail = results.filter((r) => r.status === "FAIL" || r.status === "ERROR").length;

  // Phase 1 — live-site-screenshot-audit.md
  const liveAuditRows: string[][] = [
    ["Page URL", "Current Image (sample)", "Asset Source", "Screenshot Age", "Needs Replacement", "Replacement Candidate", "Live Status"],
  ];
  for (const r of results) {
    const imgs = (r.images as Array<{ resolvedUrl: string }>) ?? [];
    const sample = imgs[0]?.resolvedUrl ?? "(no marketing img detected)";
    const source = sample.includes("digitaloceanspaces.com/screenshot")
      ? "CDN legacy PNG"
      : sample.includes("homepage-screenshots")
        ? "App local WebP"
        : sample.includes("generated-screenshots")
          ? "App generated WebP"
          : sample.includes("digitaloceanspaces")
            ? "CDN (other)"
            : "Unknown / none";
    const needs = r.status === "PASS" ? "No" : "Yes";
    const candidate =
      ((r.fingerprintMismatches as Array<{ local: string }>)?.[0]?.local) ??
      "See screenshot-replacement-map.md";
    liveAuditRows.push([
      String(r.url),
      sample.slice(0, 80),
      source,
      r.status === "PASS" ? "Current (verified)" : "Stale / not deployed",
      needs,
      candidate.replace("public/", "/"),
      String(r.status),
    ]);
  }
  writeFileSync(
    join(DOCS_DIR, "live-site-screenshot-audit.md"),
    `# Live Site Screenshot Audit\n\n**Production base:** ${PRODUCTION_BASE}\n**Audited:** ${new Date().toISOString()}\n**Pass:** ${pass}/${results.length} · **Fail/Error:** ${fail}/${results.length}\n\n> **Completion rule:** This program is NOT complete until every row shows \`Live Status = PASS\` with fingerprint-verified new assets.\n\n${mdTable(liveAuditRows)}\n\n## Evidence\n\n- JSON: \`reports/production-screenshot-verification/verification-results.json\`\n- Playwright captures: \`reports/production-screenshot-verification/*.png\`\n`,
  );

  // Phase 8 — production-screenshot-verification-report.md
  const reportRows: string[][] = [
    ["URL", "Screenshot Expected", "Screenshot Found", "Verified", "Timestamp", "Playwright Capture", "Status"],
  ];
  for (const r of results) {
    const expected =
      ((r.fingerprintMismatches as Array<{ local: string }>)?.[0]?.local) ??
      ((r.fingerprintMatches as Array<{ local: string }>)?.[0]?.local) ??
      "Registry slot / proof component";
    const found = ((r.images as Array<{ resolvedUrl: string }>)?.[0]?.resolvedUrl) ?? "none";
    reportRows.push([
      String(r.url),
      expected.replace("public/", "/"),
      found.slice(0, 100),
      r.status === "PASS" ? "Yes" : "No",
      String(r.timestamp),
      r.screenshotPath ? `\`${String(r.screenshotPath).split("/reports/")[1]}\`` : "—",
      String(r.status),
    ]);
  }
  writeFileSync(
    join(DOCS_DIR, "production-screenshot-verification-report.md"),
    `# Production Screenshot Verification Report\n\n**Verdict:** ${fail === 0 && pass > 0 ? "PASS — production displays verified new assets" : "FAIL — production does not yet display all replacement assets"}\n\n${mdTable(reportRows)}\n\n## Deployment blockers\n\nWhen status is FAIL, typical causes:\n\n1. **Code not deployed** — wiring (\`MarketingPathwayHubProductPreview\`, proof bands) exists only in local working tree\n2. **Assets not deployed** — \`public/marketing/homepage-screenshots/\` and \`public/marketing/generated-screenshots/\` not in production build\n3. **CDN stale** — carousel still falls back to \`screenshot{N}.png\` (last-modified Mar 2026 on CDN)\n4. **Cache** — DO App Platform / CDN edge serving old static files\n\n## Required actions before PASS\n\n1. Commit and deploy application + \`public/marketing/**\` assets\n2. Upload refreshed CDN slots per \`docs/SCREENSHOT_CAPTURE_TO_CDN.md\` OR ensure local WebP chain resolves on production\n3. Purge CDN / invalidate static cache if old PNGs persist\n4. Re-run: \`PLAYWRIGHT_BASE_URL=https://nursenest.ca npm run verify:production:marketing-screenshots\`\n`,
  );

  // Phase 5 — screenshot-deployment-validation.md (fingerprint matrix)
  const FINGERPRINT_ASSETS = [
    "public/marketing/homepage-screenshots/screenshot1.webp",
    "public/marketing/homepage-screenshots/screenshot1-480w.webp",
    "public/marketing/generated-screenshots/marketing/rn-marketing-hub.webp",
    "public/marketing/generated-screenshots/marketing/pn-marketing-hub.webp",
    "public/marketing/generated-screenshots/core/ecg-workstation.webp",
  ];
  const fingerprintRows: string[][] = [
    ["Repo Asset", "Repo SHA256", "Repo Bytes", "Production URL", "Prod SHA256", "Prod Bytes", "Match"],
  ];
  for (const rel of FINGERPRINT_ASSETS) {
    const localHash = hashLocalFile(rel);
    const localStat = existsSync(join(APP_ROOT, rel)) ? statSync(join(APP_ROOT, rel)) : null;
    const prodUrl = `${PRODUCTION_BASE}/${rel.replace(/^public\//, "")}`;
    const remote = await fetchHash(prodUrl);
    fingerprintRows.push([
      rel.replace("public/", "/"),
      localHash?.slice(0, 16) ?? "—",
      localStat ? String(localStat.size) : "—",
      prodUrl,
      remote?.hash.slice(0, 16) ?? "404/missing",
      remote ? String(remote.bytes) : "—",
      localHash && remote && localHash === remote.hash ? "YES" : "NO",
    ]);
  }
  const cdnRemote = await fetchHash(
    "https://nursenest-images.tor1.cdn.digitaloceanspaces.com/screenshot1.png",
  );
  writeFileSync(
    join(DOCS_DIR, "screenshot-deployment-validation.md"),
    `# Screenshot Deployment Validation (Phase 5)\n\n**Production base:** ${PRODUCTION_BASE}\n**Validated:** ${new Date().toISOString()}\n**Program status:** ${fail === 0 && pass > 0 ? "COMPLETE" : "NOT COMPLETE — stale or missing assets on live site"}\n\n## Fingerprint matrix (repo vs deployed static URL)\n\n${mdTable(fingerprintRows)}\n\n## CDN carousel fallback\n\n| Asset | Last known state |\n| --- | --- |\n| \`screenshot1.png\` on DigitalOcean Spaces CDN | ${cdnRemote ? `${cdnRemote.bytes} bytes, SHA256 ${cdnRemote.hash.slice(0, 16)}…` : "unreachable"} |\n| Expected | Refreshed PNG/WebP from \`docs/SCREENSHOT_CAPTURE_TO_CDN.md\` or local WebP chain only |\n\n## Legacy markers detected on live pages\n\n${results.flatMap((r) => ((r.legacyUrls as string[]) ?? []).map((u) => `- ${r.url}: \`${u.slice(0, 100)}\``)).join("\n") || "None detected in this audit pass."}\n\n## Cache invalidation checklist (Phase 6)\n\n- [ ] Deploy app build containing \`public/marketing/**\` with new byte sizes\n- [ ] Upload refreshed CDN slots if carousel still uses Spaces PNG fallback\n- [ ] Purge DigitalOcean CDN / App Platform static cache if fingerprints still mismatch post-deploy\n- [ ] Re-run verification until \`Match = YES\` for all rows and Playwright suite passes\n\n## Re-verify commands\n\n\`\`\`bash\ncd nursenest-core\nPLAYWRIGHT_BASE_URL=https://nursenest.ca npm run verify:production:marketing-screenshots\nPLAYWRIGHT_SKIP_WEB_SERVER=1 BASE_URL=https://nursenest.ca npm run test:e2e:production-screenshot-verification\n\`\`\`\n`,
  );

  console.log(`\nWrote ${jsonPath}`);
  console.log(`Pass: ${pass}  Fail/Error: ${fail}`);

  if (fail > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
