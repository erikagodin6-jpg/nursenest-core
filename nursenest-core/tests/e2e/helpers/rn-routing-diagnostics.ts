import type { Page } from "@playwright/test";

export type RnRoutingDiagnostics = {
  consoleErrors: string[];
  consoleWarnings: string[];
  hydrationWarnings: string[];
  redirectChain: string[];
};

export function attachRnRoutingDiagnostics(page: Page): RnRoutingDiagnostics {
  const diag: RnRoutingDiagnostics = {
    consoleErrors: [],
    consoleWarnings: [],
    hydrationWarnings: [],
    redirectChain: [],
  };

  let lastPath = "";
  page.on("framenavigated", (frame) => {
    if (frame !== page.mainFrame()) return;
    try {
      const path = new URL(page.url()).pathname;
      if (path !== lastPath) {
        lastPath = path;
        diag.redirectChain.push(page.url());
      }
    } catch {
      /* ignore */
    }
  });

  page.on("console", (msg) => {
    const text = msg.text();
    if (msg.type() === "error") diag.consoleErrors.push(text);
    if (msg.type() === "warning") diag.consoleWarnings.push(text);
    if (/hydration|did not match/i.test(text)) diag.hydrationWarnings.push(text);
  });

  return diag;
}

export function formatDiagnosticsForFailure(diag: RnRoutingDiagnostics): string {
  return [
    `redirectChain=${JSON.stringify(diag.redirectChain)}`,
    diag.hydrationWarnings.length ? `hydration=${diag.hydrationWarnings.join(" | ")}` : "",
    diag.consoleErrors.length ? `consoleErrors=${diag.consoleErrors.slice(0, 8).join(" | ")}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}
