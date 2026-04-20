import type { Page, TestInfo } from "@playwright/test";
import path from "node:path";

export type AuditStatus = "PASS" | "FAIL" | "DEGRADED" | "BLOCKED";

export type RouteAuditRow = {
  phase: string;
  url: string;
  status: AuditStatus;
  summary: string;
  assertion?: string;
  consoleErrors: string[];
  networkFailures: { url: string; status: number }[];
  artifactPaths: string[];
};

/** Visible copy must not include known stub / loading-leak strings (case-insensitive). */
export const PLACEHOLDER_SUBSTRINGS = [
  "lorem ipsum",
  "loading pricing...",
  "loading pricing…",
  "<<stub",
  "[missing:",
  "{{missing",
];

/** Whole-line style stubs (trimmed lower match). */
export const PLACEHOLDER_EXACT = new Set([
  "heading",
  "eyebrow",
  "intro",
  "value1",
  "included1",
  "placeholder",
]);

export type PageEvidence = {
  consoleErrors: string[];
  networkFailures: { url: string; status: number }[];
  detach: () => void;
};

export function attachPageEvidence(page: Page, sameOrigin: string): PageEvidence {
  const consoleErrors: string[] = [];
  const networkFailures: { url: string; status: number }[] = [];

  const onConsole = (msg: { type: () => string; text: () => string }) => {
    if (msg.type() === "error") consoleErrors.push(msg.text().slice(0, 500));
  };
  const onPageError = (err: Error) => {
    consoleErrors.push(`pageerror: ${err.message}`.slice(0, 500));
  };
  const onResponse = (res: { url: () => string; status: () => number; request: () => { resourceType: () => string } }) => {
    try {
      const u = res.url();
      const st = res.status();
      if (st < 400) return;
      if (!u.startsWith(sameOrigin)) return;
      const rt = res.request().resourceType();
      if (rt === "websocket") return;
      networkFailures.push({ url: u.slice(0, 400), status: st });
    } catch {
      /* ignore */
    }
  };

  page.on("console", onConsole);
  page.on("pageerror", onPageError);
  page.on("response", onResponse);

  return {
    consoleErrors,
    networkFailures,
    detach: () => {
      page.off("console", onConsole);
      page.off("pageerror", onPageError);
      page.off("response", onResponse);
    },
  };
}

export function scanBodyForPlaceholders(bodyText: string): string | null {
  const lower = bodyText.toLowerCase();
  for (const s of PLACEHOLDER_SUBSTRINGS) {
    if (lower.includes(s.toLowerCase())) return `body contains forbidden substring: ${s}`;
  }
  for (const line of bodyText.split(/\n+/)) {
    const t = line.trim().toLowerCase();
    if (t && PLACEHOLDER_EXACT.has(t)) return `body contains forbidden stub line: ${line.trim()}`;
  }
  return null;
}

export async function screenshotFailure(page: Page, testInfo: TestInfo, slug: string): Promise<string> {
  const safe = slug.replace(/[^a-z0-9-]+/gi, "_").slice(0, 80);
  const p = path.join(testInfo.outputDir, `audit-fail-${safe}.png`);
  await page.screenshot({ path: p, fullPage: true }).catch(() => {});
  return p;
}
