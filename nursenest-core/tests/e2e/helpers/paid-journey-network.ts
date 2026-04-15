import type { Page, Response } from "@playwright/test";

/**
 * Tracks same-origin `/api/*` responses. Violations: status &lt; 200, &gt;= 400, or not 304 when 3xx.
 * (2xx and 304 are OK.)
 */
export function attachPaidJourneyApiObserver(page: Page, appOrigin: string) {
  const violations: string[] = [];

  const onResponse = (res: Response) => {
    const url = res.url();
    if (!url.startsWith(appOrigin)) return;
    let pathname = "";
    try {
      pathname = new URL(url).pathname;
    } catch {
      return;
    }
    if (!pathname.startsWith("/api/")) return;
    const st = res.status();
    const ok = (st >= 200 && st < 300) || st === 304;
    if (!ok) {
      violations.push(`${st} ${url}`);
    }
  };

  page.on("response", onResponse);

  return {
    violations,
    dispose: () => {
      page.off("response", onResponse);
    },
  };
}
