import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import type { Page, TestInfo } from "@playwright/test";
import { getPaidTestCredentials } from "./paid-test-credentials";

const OUT = path.join("test-results", "auth-audit");

export type AuthAuditScenario = {
  id: string;
  pass: boolean;
  detail: string;
  redirectChain?: string[];
  screenshotPath?: string;
};

export function getAuthAuditCredentials(): { email: string; password: string } | null {
  const fe = process.env.E2E_FREE_EMAIL?.trim();
  const fp = process.env.E2E_FREE_PASSWORD;
  if (fe && fp) return { email: fe, password: fp };
  return getPaidTestCredentials();
}

export function absoluteUrl(pathOrUrl: string, base: string): string {
  try {
    const u = pathOrUrl.startsWith("http") ? new URL(pathOrUrl) : new URL(pathOrUrl, base);
    return new URL(u.pathname + u.search + u.hash, base).href;
  } catch {
    return new URL(pathOrUrl, base).href;
  }
}

export function attachMainFrameNavChain(page: Page): { getChain: () => string[]; clear: () => void } {
  const chain: string[] = [];
  const onNav = (frame: import("@playwright/test").Frame) => {
    if (frame === page.mainFrame()) {
      try {
        chain.push(frame.url());
      } catch {
        /* closed */
      }
    }
  };
  page.on("framenavigated", onNav);
  return {
    getChain: () => [...chain],
    clear: () => {
      chain.length = 0;
    },
  };
}

export async function writeAuthAuditReport(
  scenarios: AuthAuditScenario[],
  baseURL: string,
): Promise<{ json: string; md: string }> {
  await mkdir(OUT, { recursive: true });
  const jsonPath = path.join(OUT, "auth-audit-report.json");
  const mdPath = path.join(OUT, "auth-audit-report.md");
  const payload = {
    generatedAt: new Date().toISOString(),
    baseURL,
    scenarios,
    summary: {
      total: scenarios.length,
      passed: scenarios.filter((s) => s.pass).length,
      failed: scenarios.filter((s) => !s.pass).length,
    },
  };
  await writeFile(jsonPath, JSON.stringify(payload, null, 2), "utf8");
  const esc = (s: string) => String(s).replace(/\|/g, "\\|").replace(/\n/g, " ");
  const md = [
    "# Auth audit",
    "",
    `Base URL: \`${esc(baseURL)}\``,
    "",
    "| Scenario | Pass | Detail | Redirect chain | Screenshot |",
    "|---|---:|---|---|---|",
    ...scenarios.map((s) => {
      const chain = s.redirectChain?.length ? esc(s.redirectChain.join(" → ")) : "—";
      const shot = s.screenshotPath ?? "—";
      return `| ${esc(s.id)} | ${s.pass ? "PASS" : "FAIL"} | ${esc(s.detail)} | ${chain} | ${esc(shot)} |`;
    }),
    "",
  ].join("\n");
  await writeFile(mdPath, md, "utf8");
  return { json: jsonPath, md: mdPath };
}

export async function captureAuthFailure(page: Page, testInfo: TestInfo, slug: string): Promise<string> {
  const dir = path.join(OUT, "screenshots");
  await mkdir(dir, { recursive: true });
  const file = `${slug}-${randomUUID().slice(0, 8)}.png`;
  const fullPath = path.join(dir, file);
  await page.screenshot({ path: fullPath, fullPage: false });
  const rel = path.join(OUT, "screenshots", file);
  await testInfo.attach(`auth-audit-${slug}`, { path: fullPath });
  return rel;
}

/** Detect redirect loops: same URL repeated many times in chain. */
export function hasRedirectLoop(chain: string[], maxRepeat = 4): boolean {
  const counts = new Map<string, number>();
  for (const u of chain) {
    const key = u.replace(/#.*$/, "");
    counts.set(key, (counts.get(key) ?? 0) + 1);
    if ((counts.get(key) ?? 0) >= maxRepeat) return true;
  }
  return false;
}
