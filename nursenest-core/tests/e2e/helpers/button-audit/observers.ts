import type { Page } from "@playwright/test";
import type { HttpDocumentError } from "./types";

export type ButtonAuditObservers = {
  pageErrors: string[];
  documentHttpErrors: HttpDocumentError[];
  dispose: () => void;
};

/** Significant console errors (excludes known noisy dev patterns). */
const NOISE_RE =
  /favicon|ResizeObserver|webpack-hmr|WebSocket connection.*_next\/webpack-hmr|Download the React DevTools|next-image-unconfigured-qualities/i;

/**
 * Tracks uncaught page errors, document HTTP >=400, and console errors (filtered).
 */
export function attachButtonAuditObservers(page: Page): ButtonAuditObservers {
  const pageErrors: string[] = [];
  const documentHttpErrors: HttpDocumentError[] = [];

  const onPageError = (err: Error) => {
    pageErrors.push(err.message || String(err));
  };

  const onConsole = (msg: { type: () => string; text: () => string }) => {
    if (msg.type() !== "error") return;
    const t = msg.text();
    if (NOISE_RE.test(t)) return;
    pageErrors.push(`[console.error] ${t.slice(0, 2000)}`);
  };

  const onResponse = (response: import("@playwright/test").Response) => {
    const req = response.request();
    if (req.resourceType() !== "document") return;
    const status = response.status();
    if (status < 400) return;
    const url = response.url();
    try {
      const u = new URL(url);
      if (u.pathname.startsWith("/api/")) return;
    } catch {
      return;
    }
    documentHttpErrors.push({ url, status, method: req.method() });
  };

  page.on("pageerror", onPageError);
  page.on("console", onConsole);
  page.on("response", onResponse);

  return {
    pageErrors,
    documentHttpErrors,
    dispose: () => {
      page.off("pageerror", onPageError);
      page.off("console", onConsole);
      page.off("response", onResponse);
    },
  };
}
