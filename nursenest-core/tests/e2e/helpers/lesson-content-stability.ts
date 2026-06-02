import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import type { APIRequestContext, Page, TestInfo } from "@playwright/test";
import { isLearnerShell } from "./learner-shell";

export type StabilitySeverity = "error" | "warn" | "info";

export type StabilityFinding = {
  route: string;
  pathwayId?: string;
  kind: "broken" | "content" | "layout";
  message: string;
  severity: StabilitySeverity;
  screenshotPath?: string;
};

const OUT_DIR = path.join("test-results", "lesson-content-stability");

/** Placeholder / bad-copy signals in visible lesson/hub body text. */
export const PLACEHOLDER_PATTERNS: { re: RegExp; label: string }[] = [
  { re: /\blorem ipsum\b/i, label: "lorem ipsum" },
  { re: /\bTBD\b/, label: "TBD" },
  { re: /\[object Object\]/, label: "[object Object]" },
  { re: /\bundefined\b/, label: "undefined" },
  { re: /\[missing:/i, label: "i18n [missing:…]" },
  { re: /coming soon/i, label: "coming soon" },
];

export function findPlaceholderHits(text: string): string[] {
  const hits = new Set<string>();
  const t = text.slice(0, 500_000);
  for (const { re, label } of PLACEHOLDER_PATTERNS) {
    if (re.test(t)) hits.add(label);
  }
  return [...hits];
}

export async function writeLessonStabilityReports(args: {
  workingRoutes: string[];
  findings: StabilityFinding[];
}): Promise<{ json: string; md: string }> {
  await mkdir(OUT_DIR, { recursive: true });
  const jsonPath = path.join(OUT_DIR, "lesson-content-stability-report.json");
  const mdPath = path.join(OUT_DIR, "lesson-content-stability-report.md");
  const broken = args.findings.filter((f) => f.kind === "broken");
  const content = args.findings.filter((f) => f.kind === "content");
  const layout = args.findings.filter((f) => f.kind === "layout");
  const workingUnique = [...new Set(args.workingRoutes)];
  const payload = {
    generatedAt: new Date().toISOString(),
    workingRoutes: workingUnique,
    brokenRoutes: broken,
    contentQualityIssues: content,
    layoutIssues: layout,
    summary: {
      workingCount: workingUnique.length,
      brokenCount: broken.length,
      contentIssueCount: content.length,
      layoutIssueCount: layout.length,
    },
  };
  await writeFile(jsonPath, JSON.stringify(payload, null, 2), "utf8");
  const esc = (s: string) => String(s).replace(/\|/g, "\\|").replace(/\n/g, " ");
  const md = [
    "# Lesson content stability",
    "",
    `- Working routes: **${payload.summary.workingCount}**`,
    `- Broken: **${payload.summary.brokenCount}** · Content-quality: **${payload.summary.contentIssueCount}** · Layout: **${payload.summary.layoutIssueCount}**`,
    "",
    "## Working routes",
    "",
    ...workingUnique.map((r) => `- ${esc(r)}`),
    "",
    "## Broken routes",
    "",
    ...broken.map((f) => `- **${esc(f.route)}** (${f.severity}): ${esc(f.message)}${f.screenshotPath ? ` — \`${esc(f.screenshotPath)}\`` : ""}`),
    broken.length ? "" : "- (none)",
    "",
    "## Content-quality issues",
    "",
    ...content.map((f) => `- **${esc(f.route)}**: ${esc(f.message)}${f.screenshotPath ? ` — \`${esc(f.screenshotPath)}\`` : ""}`),
    content.length ? "" : "- (none)",
    "",
    "## Layout issues",
    "",
    ...layout.map((f) => `- **${esc(f.route)}**: ${esc(f.message)}${f.screenshotPath ? ` — \`${esc(f.screenshotPath)}\`` : ""}`),
    layout.length ? "" : "- (none)",
    "",
  ].join("\n");
  await writeFile(mdPath, md, "utf8");
  return { json: jsonPath, md: mdPath };
}

export async function captureStabilityShot(
  page: Page,
  testInfo: TestInfo,
  slug: string,
): Promise<string> {
  const dir = path.join(OUT_DIR, "screenshots");
  await mkdir(dir, { recursive: true });
  const file = `${slug}-${randomUUID().slice(0, 8)}.png`;
  const fullPath = path.join(dir, file);
  await page.screenshot({ path: fullPath, fullPage: false });
  const rel = path.join(OUT_DIR, "screenshots", file);
  await testInfo.attach(`stability-${slug}`, { path: fullPath });
  return rel;
}

/** Lesson detail paths under a hub (excludes topic query variants and bare /lessons). */
export async function collectLessonDetailPathsFromHub(page: Page, origin: string): Promise<string[]> {
  return page.evaluate((o) => {
    const lib = document.querySelector("#pathway-lesson-library");
    const root = lib ?? document.body;
    const seen = new Set<string>();
    for (const a of root.querySelectorAll("a[href]")) {
      const href = a.getAttribute("href");
      if (!href || href.startsWith("#")) continue;
      let u: URL;
      try {
        u = new URL(href, o);
      } catch {
        continue;
      }
      const p = u.pathname.replace(/\/$/, "");
      const m = p.match(/\/lessons\/([^/]+)$/);
      if (!m?.[1] || m[1] === "topics") continue;
      seen.add(u.pathname);
    }
    return [...seen];
  }, origin);
}

export async function checkInternalLinksSample(args: {
  page: Page;
  request: APIRequestContext;
  baseURL: string;
  maxChecks: number;
}): Promise<string[]> {
  const { page, request, baseURL, maxChecks } = args;
  const hrefs = await page.evaluate(() => {
    const main = document.querySelector("main") ?? document.body;
    const out: string[] = [];
    for (const a of main.querySelectorAll('a[href^="/"]')) {
      const h = a.getAttribute("href");
      if (h && !h.startsWith("//") && !h.includes("#") && h.length > 1) out.push(h.split("?")[0]!);
    }
    return [...new Set(out)].slice(0, 24);
  });
  const broken: string[] = [];
  let n = 0;
  for (const h of hrefs) {
    if (n >= maxChecks) break;
    const pn = h.split("?")[0] ?? "";
    if (isLearnerShell(pn)) continue;
    n += 1;
    const url = new URL(h, baseURL).href;
    try {
      const res = await request.get(url, { timeout: 30_000, maxRedirects: 5 });
      if (res.status() === 404) broken.push(`${h} → 404`);
    } catch (e) {
      broken.push(`${h} → ${e instanceof Error ? e.message : String(e)}`);
    }
  }
  return broken;
}
