/**
 * Concise stdout summaries when Playwright observer assertions will fail (console + failed requests).
 * Keeps logs bounded; full lists live in JSON attachments or section reports.
 */

import { groupConsoleLinesByCategory, tryParseI18nMissingKeyConsole } from "./observer-error-taxonomy";
import type { AuthHttpProbe, ConsoleErrorContext } from "./attach-observers";

export const OBSERVER_SUMMARY_LINE_MAX = 220;
export const OBSERVER_SUMMARY_URL_MAX = 160;

export function truncateObserverSummaryLine(s: string, max: number): string {
  const t = s.replace(/\s+/g, " ").trim();
  return t.length <= max ? t : `${t.slice(0, Math.max(0, max - 1))}…`;
}

/** First http(s) URL embedded in a console line, if any */
export function extractUrlFromConsoleText(s: string): string {
  const m = s.match(/https?:\/\/[^\s)'"<>]+/);
  return m ? m[0] : "";
}

/** `attach-observers` stores failed requests as `${failureText} ${url}` */
export function parseFailedRequestLine(line: string): { fail: string; url: string } {
  const m = line.match(/^(.*?)\s+(https?:\/\/\S+)$/);
  if (m) return { fail: m[1].trim(), url: m[2] };
  return { fail: line.trim(), url: "" };
}

export type LogObserverFailureSummaryOpts = {
  /** e.g. `[public-smoke]` or `[paid-smoke]` */
  tag: string;
  routeLabel: string;
  seriousConsole: string[];
  failedRequests: string[];
  pageUrl: string;
  /** Shown on the first line after routeLabel */
  artifactHint?: string;
};

/**
 * Prints up to 5 serious console lines (msg + url) and up to 5 failed requests (url + status/error).
 */
export function logObserverFailureSummary(opts: LogObserverFailureSummaryOpts): void {
  const { tag, routeLabel, seriousConsole, failedRequests, pageUrl } = opts;
  const hint = opts.artifactHint ?? "(full detail in test artifacts)";
  if (seriousConsole.length === 0 && failedRequests.length === 0) return;
  const out: string[] = [`${tag} ${routeLabel} — failure summary ${hint}`];
  if (seriousConsole.length > 0) {
    const n = Math.min(5, seriousConsole.length);
    out.push(`  Serious console (${seriousConsole.length} total, first ${n}):`);
    for (let i = 0; i < n; i++) {
      const raw = seriousConsole[i]!;
      const fromMsg = extractUrlFromConsoleText(raw);
      const url = fromMsg || pageUrl;
      const msg = truncateObserverSummaryLine(
        fromMsg ? raw.replace(fromMsg, "").replace(/\s{2,}/g, " ").trim() || raw : raw,
        OBSERVER_SUMMARY_LINE_MAX,
      );
      out.push(`    ${i + 1}. msg: ${msg}`);
      out.push(`       url: ${truncateObserverSummaryLine(url, OBSERVER_SUMMARY_URL_MAX)}`);
    }
  }
  if (failedRequests.length > 0) {
    const n = Math.min(5, failedRequests.length);
    out.push(`  Failed requests (${failedRequests.length} total, first ${n}):`);
    for (let i = 0; i < n; i++) {
      const { fail, url } = parseFailedRequestLine(failedRequests[i]!);
      const u = url || truncateObserverSummaryLine(failedRequests[i]!, OBSERVER_SUMMARY_URL_MAX);
      out.push(`    ${i + 1}. url: ${truncateObserverSummaryLine(u, OBSERVER_SUMMARY_URL_MAX)}`);
      out.push(`       status/error: ${truncateObserverSummaryLine(fail || "unknown", 120)}`);
    }
  }
  console.log(out.join("\n"));
}

export type CategorizedObserverDiagnostics = {
  i18n: { line: string; pageUrl?: string; parsedKey?: string }[];
  auth: { line: string; pageUrl?: string }[];
  consoleOther: { line: string; pageUrl?: string }[];
  failedRequests: { raw: string; category: "api" | "network" }[];
  authHttp: AuthHttpProbe[];
};

function categorizeWithContext(
  seriousConsole: string[],
  consoleErrorContext: ConsoleErrorContext[] | undefined,
): CategorizedObserverDiagnostics {
  const byText = new Map<string, string>();
  if (consoleErrorContext) {
    for (const e of consoleErrorContext) {
      byText.set(e.text, e.pageUrl);
    }
  }
  const grouped = groupConsoleLinesByCategory(seriousConsole);
  return {
    i18n: grouped.i18n.map((line) => ({
      line,
      pageUrl: byText.get(line),
      parsedKey: tryParseI18nMissingKeyConsole(line)?.key,
    })),
    auth: grouped.auth.map((line) => ({ line, pageUrl: byText.get(line) })),
    consoleOther: grouped.other.map((line) => ({ line, pageUrl: byText.get(line) })),
    failedRequests: [],
    authHttp: [],
  };
}

/**
 * Prints failures in four buckets (i18n / auth / other console / network) so one class
 * (e.g. stale i18n) does not hide auth/session issues.
 */
export function logCategorizedObserverFailureSummary(opts: {
  tag: string;
  routeLabel: string;
  seriousConsole: string[];
  failedRequests: string[];
  consoleErrorContext?: ConsoleErrorContext[];
  authHttp?: AuthHttpProbe[];
  pageUrl: string;
  i18nRuntimeBundle?: unknown;
  artifactHint?: string;
}): CategorizedObserverDiagnostics {
  const { tag, routeLabel, seriousConsole, failedRequests, pageUrl } = opts;
  const hint = opts.artifactHint ?? "(see attachment audit-results.json)";
  const cat = categorizeWithContext(seriousConsole, opts.consoleErrorContext);
  for (const raw of failedRequests) {
    const { fail, url } = parseFailedRequestLine(raw);
    const isApi = /\/api\//i.test(url || raw);
    cat.failedRequests.push({ raw, category: isApi ? "api" : "network" });
  }
  cat.authHttp = opts.authHttp ?? [];

  const lines: string[] = [`${tag} ${routeLabel} — categorized failure summary ${hint}`];

  if (cat.i18n.length > 0) {
    lines.push(`  [i18n missing-key / marketing logs] (${cat.i18n.length}):`);
    cat.i18n.slice(0, 8).forEach((x, i) => {
      lines.push(
        `    ${i + 1}. key=${x.parsedKey ?? "(parse failed)"} page=${truncateObserverSummaryLine(x.pageUrl ?? pageUrl, OBSERVER_SUMMARY_URL_MAX)}`,
      );
      lines.push(`       ${truncateObserverSummaryLine(x.line, OBSERVER_SUMMARY_LINE_MAX)}`);
    });
  }

  if (cat.auth.length > 0) {
    lines.push(`  [auth / session client errors] (${cat.auth.length}):`);
    cat.auth.slice(0, 6).forEach((x, i) => {
      lines.push(`    ${i + 1}. page=${truncateObserverSummaryLine(x.pageUrl ?? pageUrl, OBSERVER_SUMMARY_URL_MAX)}`);
      lines.push(`       ${truncateObserverSummaryLine(x.line, OBSERVER_SUMMARY_LINE_MAX)}`);
    });
  }

  if (cat.consoleOther.length > 0) {
    lines.push(`  [other console errors] (${cat.consoleOther.length}, first 4):`);
    cat.consoleOther.slice(0, 4).forEach((x, i) => {
      lines.push(`    ${i + 1}. ${truncateObserverSummaryLine(x.line, OBSERVER_SUMMARY_LINE_MAX)}`);
    });
  }

  if (cat.failedRequests.length > 0) {
    lines.push(`  [failed requests] (${cat.failedRequests.length}, first 5):`);
    cat.failedRequests.slice(0, 5).forEach((x, i) => {
      lines.push(`    ${i + 1}. [${x.category}] ${truncateObserverSummaryLine(x.raw, OBSERVER_SUMMARY_LINE_MAX)}`);
    });
  }

  if (cat.authHttp.length > 0) {
    const recent = cat.authHttp.slice(-8);
    lines.push(`  [auth HTTP] (last ${recent.length} /api/auth responses):`);
    recent.forEach((x, i) => {
      lines.push(
        `    ${i + 1}. ${x.status} ${truncateObserverSummaryLine(x.url, OBSERVER_SUMMARY_URL_MAX)} @ page ${truncateObserverSummaryLine(x.pageUrl, 100)}`,
      );
    });
  }

  if (opts.i18nRuntimeBundle !== undefined) {
    lines.push(`  [live /i18n bundle probe] (see JSON attachment for full object)`);
  }

  console.log(lines.join("\n"));
  return cat;
}
