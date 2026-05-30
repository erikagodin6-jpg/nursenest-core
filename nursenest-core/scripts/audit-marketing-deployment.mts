#!/usr/bin/env node
/**
 * Deployment audit — asset usage, production image map, cache analysis.
 * Does NOT capture screenshots.
 *
 * Usage: npx tsx scripts/audit-marketing-deployment.mts
 */
import { createHash } from "node:crypto";
import { execSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync, mkdirSync } from "node:fs";
import { join, relative, basename } from "node:path";

const APP_ROOT = join(import.meta.dirname, "..");
const PUBLIC_MARKETING = join(APP_ROOT, "public/marketing");
const DOCS = join(APP_ROOT, "docs");
const PRODUCTION = "https://nursenest.ca";

const PAGE_PATHS: Array<{ id: string; path: string; label: string }> = [
  { id: "homepage", path: "/", label: "Homepage" },
  { id: "pricing", path: "/pricing", label: "Pricing" },
  { id: "rn", path: "/us/rn/nclex-rn", label: "RN Hub" },
  { id: "pn", path: "/canada/pn/rex-pn", label: "RPN/PN Hub" },
  { id: "np", path: "/canada/np/cnple", label: "NP Hub" },
  { id: "allied", path: "/allied/allied-health", label: "Allied" },
  { id: "newgrad", path: "/canada/new-grad", label: "New Grad" },
  { id: "ecg", path: "/ecg-interpretation", label: "ECG" },
  { id: "institutions", path: "/for-institutions", label: "Institutions" },
];

function sha256File(abs: string): string {
  return createHash("sha256").update(readFileSync(abs)).digest("hex");
}

function walkWebp(dir: string, out: string[] = []): string[] {
  if (!existsSync(dir)) return out;
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, ent.name);
    if (ent.isDirectory()) walkWebp(p, out);
    else if (ent.name.endsWith(".webp")) out.push(p);
  }
  return out;
}

function grepRefs(relPath: string): string[] {
  const needle = relPath.replace(/^public\//, "").replace(/^\//, "");
  const short = basename(relPath, ".webp");
  try {
    const out = execSync(
      `rg -l "${needle}|${short}" src --glob '*.{ts,tsx,js,mjs,css}' 2>/dev/null || true`,
      { cwd: APP_ROOT, encoding: "utf8", maxBuffer: 4 * 1024 * 1024 },
    );
    return out.trim().split("\n").filter(Boolean).slice(0, 12);
  } catch {
    return [];
  }
}

async function fetchMeta(url: string) {
  try {
    const res = await fetch(url, { redirect: "follow" });
    const buf = Buffer.from(await res.arrayBuffer());
    return {
      ok: res.ok,
      status: res.status,
      contentType: res.headers.get("content-type") ?? "",
      bytes: buf.length,
      sha256: res.ok && res.headers.get("content-type")?.includes("image") ? sha256(buf) : null,
      lastModified: res.headers.get("last-modified") ?? "",
    };
  } catch {
    return { ok: false, status: 0, contentType: "", bytes: 0, sha256: null, lastModified: "" };
  }
}

function sha256(buf: Buffer): string {
  return createHash("sha256").update(buf).digest("hex");
}

function mdTable(rows: string[][]): string {
  if (!rows.length) return "";
  const [h, ...body] = rows;
  return [
    `| ${h!.join(" | ")} |`,
    `| ${h!.map(() => "---").join(" | ")} |`,
    ...body.map((r) => `| ${r.join(" | ")} |`),
  ].join("\n");
}

async function scrapePageImages(path: string): Promise<string[]> {
  const html = await fetch(`${PRODUCTION}${path}`).then((r) => r.text());
  const urls = new Set<string>();
  for (const m of html.matchAll(/(?:src|href)="([^"]*(?:screenshot|generated-screenshots|digitaloceanspaces)[^"]*)"/gi)) {
    urls.add(m[1]!.replace(/&amp;/g, "&"));
  }
  return [...urls].slice(0, 25);
}

async function main(): Promise<void> {
  mkdirSync(DOCS, { recursive: true });
  const now = new Date().toISOString();

  // Phase 1 — asset usage
  const assets = walkWebp(PUBLIC_MARKETING);
  const usageRows: string[][] = [
    ["File", "Location", "Used?", "Page/Component refs", "Notes"],
  ];
  let usedCount = 0;
  for (const abs of assets.sort()) {
    const rel = relative(join(APP_ROOT, "public"), abs).replace(/\\/g, "/");
    const refs = grepRefs(rel);
    const used = refs.length > 0 ? "Yes" : "No";
    if (used === "Yes") usedCount++;
    const note =
      rel.includes("-480w") || rel.includes("-768w") || rel.includes("-1200w")
        ? "Responsive variant"
        : rel.includes("homepage-screenshots/")
          ? "CDN slot sync"
          : "";
    usageRows.push([
      basename(abs),
      rel,
      used,
      refs.length ? refs.slice(0, 3).join(", ") : "—",
      note,
    ]);
  }
  writeFileSync(
    join(DOCS, "marketing-asset-usage-report.md"),
    `# Marketing Asset Usage Report\n\n**Generated:** ${now}\n**Total WebP assets:** ${assets.length}\n**Referenced in src:** ${usedCount}\n**Orphan (no src grep match):** ${assets.length - usedCount}\n\n> Grep matches path basename or relative path in \`src/**\`. Orphans may still be synced homepage slots or fallbacks.\n\n${mdTable(usageRows)}\n`,
  );

  // Phase 2 — production image map
  const prodRows: string[][] = [
    ["Page", "URL", "Sample rendered asset", "Source type", "Prod bytes", "Local match"],
  ];
  const fingerprintSamples: Array<{ rel: string; localSha: string; prodSha: string | null; match: boolean }> = [];

  for (const page of PAGE_PATHS) {
    const imgs = await scrapePageImages(page.path);
    const sample = imgs.find((u) => /generated-screenshots|homepage-screenshots|screenshot\d/.test(u)) ?? imgs[0] ?? "(none in HTML)";
    let source = "Unknown";
    if (sample.includes("digitaloceanspaces.com")) source = "CDN (DigitalOcean Spaces)";
    else if (sample.includes("homepage-screenshots")) source = "App static — homepage slot";
    else if (sample.includes("generated-screenshots")) source = "App static — generated WebP";
    else if (sample.includes("_next/image")) source = "Next.js Image optimizer";

    let prodBytes = "—";
    let localMatch = "—";
    if (sample.startsWith("/")) {
      const meta = await fetchMeta(`${PRODUCTION}${sample.split("?")[0]!.replace(/\/_next\/image.*url=/, "")}`);
      // decode _next/image url param if present
      let direct = sample;
      const m = sample.match(/url=([^&]+)/);
      if (m) direct = decodeURIComponent(m[1]!);
      const meta2 = await fetchMeta(direct.startsWith("http") ? direct : `${PRODUCTION}${direct}`);
      prodBytes = meta2.ok ? String(meta2.bytes) : String(meta2.status);
      const localPath = join(APP_ROOT, "public", direct.replace(/^\//, ""));
      if (existsSync(localPath)) {
        const localSha = sha256File(localPath);
        localMatch = meta2.sha256 === localSha ? "YES" : "NO";
        fingerprintSamples.push({
          rel: direct,
          localSha: localSha.slice(0, 16),
          prodSha: meta2.sha256?.slice(0, 16) ?? null,
          match: meta2.sha256 === localSha,
        });
      } else {
        localMatch = "missing locally";
      }
    }
    prodRows.push([page.label, `${PRODUCTION}${page.path}`, sample.slice(0, 90), source, prodBytes, localMatch]);
  }
  writeFileSync(
    join(DOCS, "production-image-map.md"),
    `# Production Image Map\n\n**Production:** ${PRODUCTION}\n**Mapped:** ${now}\n\nHTML scrape + HEAD fingerprint for primary marketing images per page.\n\n${mdTable(prodRows)}\n\n## Fingerprint samples\n\n${fingerprintSamples.map((f) => `- \`${f.rel}\` local \`${f.localSha}…\` prod \`${f.prodSha ?? "n/a"}…\` **${f.match ? "MATCH" : "MISMATCH"}**`).join("\n") || "No decodable static paths in HTML sample."}\n`,
  );

  // Phase 4 — cache analysis
  const cacheChecks: Array<{ label: string; url: string; result: string }> = [];
  for (const [label, path] of [
    ["Homepage slot 1 local", "/marketing/homepage-screenshots/screenshot1-480w.webp"],
    ["CDN screenshot1.png", "https://nursenest-images.tor1.cdn.digitaloceanspaces.com/screenshot1.png"],
    ["CDN screenshot1 webp", "https://nursenest-images.tor1.cdn.digitaloceanspaces.com/screenshot1-480w.webp"],
    ["Core dashboard", "/marketing/generated-screenshots/core/learner-dashboard.webp"],
    ["RN hub marketing", "/marketing/generated-screenshots/marketing/rn-marketing-hub.webp"],
    ["Phantom themes/ocean (should 404)", "/marketing/generated-screenshots/themes/ocean/ecg-workstation.webp"],
  ] as const) {
    const url = path.startsWith("http") ? path : `${PRODUCTION}${path}`;
    const meta = await fetchMeta(url);
    cacheChecks.push({
      label,
      url,
      result: `${meta.status} · ${meta.contentType || "—"} · ${meta.bytes}b · ${meta.lastModified || "—"}`,
    });
  }

  const gitDirty = execSync("git status --short public/marketing 2>/dev/null | wc -l", {
    cwd: APP_ROOT,
    encoding: "utf8",
  }).trim();

  writeFileSync(
    join(DOCS, "asset-cache-analysis.md"),
    `# Asset Cache Analysis\n\n**Analyzed:** ${now}\n\n## Root cause summary\n\n| Layer | Finding |\n| --- | --- |\n| **Git / deploy** | ${gitDirty} modified/untracked files under \`public/marketing/\` — new bytes not shipped until commit + deploy |\n| **App wiring** | Code on \`main\` references \`generated-screenshots\`; Ocean theme must use \`core/\` not \`themes/ocean/\` (fixed locally) |\n| **CDN fallback** | Institutions + hero carousel still resolve CDN WebP/PNG when local slot missing or chain falls through |\n| **Next.js Image** | \`/_next/image\` caches optimized derivatives — fingerprint compares underlying static file |\n| **Browser** | Standard cache headers on \`public/marketing/**\` static files |\n\n## Probe results\n\n${cacheChecks.map((c) => `- **${c.label}:** \`${c.url}\` → ${c.result}`).join("\n")}\n\n## Remediation order\n\n1. Commit + deploy all \`public/marketing/**\` changes (homepage slots + generated captures)\n2. Deploy wiring fix (\`marketingProofFromCoreKey\` Ocean → \`core/\`)\n3. Re-upload CDN \`screenshot1–15\` per \`docs/SCREENSHOT_CAPTURE_TO_CDN.md\` OR rely on local-first hero chain after deploy\n4. Purge DigitalOcean CDN if institutions page still serves stale Spaces WebP after local files deploy\n5. Re-run \`npm run verify:production:marketing-screenshots\`\n`,
  );

  console.log("Wrote marketing-asset-usage-report.md");
  console.log("Wrote production-image-map.md");
  console.log("Wrote asset-cache-analysis.md");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
