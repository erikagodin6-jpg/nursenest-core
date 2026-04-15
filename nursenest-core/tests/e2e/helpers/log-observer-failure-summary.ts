/**
 * Concise stdout summaries when Playwright observer assertions will fail (console + failed requests).
 * Keeps logs bounded; full lists live in JSON attachments or section reports.
 */

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
