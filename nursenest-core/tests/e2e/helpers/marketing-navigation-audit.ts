import { mkdir, writeFile } from "fs/promises";
import path from "path";
import type { Page } from "@playwright/test";

export type NavAuditRow = {
  id: string;
  surface: string;
  element: string;
  expectedDestination: string;
  actualDestination: string;
  pass: boolean;
  notes?: string;
};

/** Full-page scrims can block header clicks — match public-site-smoke pattern. */
export async function dismissMarketingScrims(page: Page): Promise<void> {
  for (let i = 0; i < 5; i++) {
    await page.keyboard.press("Escape");
  }
}

export function normalizePathname(u: string): string {
  try {
    const url = new URL(u);
    const p = url.pathname.replace(/\/$/, "") || "/";
    return p;
  } catch {
    return u;
  }
}

/** Compare same-origin navigations; pathname only (ignores query for marketing smoke). */
export function destinationsMatch(expectedHref: string, actualUrl: string, baseOrigin: string): boolean {
  try {
    const exp = new URL(expectedHref, baseOrigin);
    const act = new URL(actualUrl);
    if (exp.origin !== act.origin) return false;
    const ep = exp.pathname.replace(/\/$/, "") || "/";
    const ap = act.pathname.replace(/\/$/, "") || "/";
    return ep === ap;
  } catch {
    return false;
  }
}

export async function writeNavAuditReports(rows: NavAuditRow[], outDir = "test-results"): Promise<{ json: string; md: string }> {
  await mkdir(outDir, { recursive: true });
  const jsonPath = path.join(outDir, "marketing-nav-audit-report.json");
  const mdPath = path.join(outDir, "marketing-nav-audit-report.md");
  await writeFile(jsonPath, JSON.stringify(rows, null, 2), "utf8");
  const md = [
    "# Marketing navigation audit",
    "",
    "| ID | Surface | Element | Expected | Actual | Pass | Notes |",
    "|---|---|---|---|---|---|---|",
    ...rows.map((r) => {
      const esc = (s: string) => String(s).replace(/\|/g, "\\|").replace(/\n/g, " ");
      return `| ${esc(r.id)} | ${esc(r.surface)} | ${esc(r.element)} | ${esc(r.expectedDestination)} | ${esc(r.actualDestination)} | ${r.pass ? "PASS" : "FAIL"} | ${esc(r.notes ?? "")} |`;
    }),
    "",
  ].join("\n");
  await writeFile(mdPath, md, "utf8");
  return { json: jsonPath, md: mdPath };
}
