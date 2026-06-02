import type { Page } from "@playwright/test";
import type { HttpDocumentError } from "./types";

export type ButtonAuditObservers = {
  pageErrors: string[];
  documentHttpErrors: HttpDocumentError[];
  /** Same-origin XHR/fetch responses with status ≥400 (opt-in — can be noisy). */
  sameOriginApiErrors: HttpDocumentError[];
  dispose: () => void;
};

/** Significant console errors (excludes known noisy dev patterns). */
const NOISE_RE =
  /favicon|ResizeObserver|webpack-hmr|WebSocket connection.*_next\/webpack-hmr|Download the React DevTools|next-image-unconfigured-qualities/i;

/**
 * Tracks uncaught page errors, document HTTP >=400, and console errors (filtered).
 */
const TRACK_API = process.env.E2E_BUTTON_AUDIT_TRACK_API === "1";
const MAX_API_ERRORS = 80;

export function attachButtonAuditObservers(page: Page, baseOrigin?: string): ButtonAuditObservers {
  const pageErrors: string[] = [];
  const documentHttpErrors: HttpDocumentError[] = [];
  const sameOriginApiErrors: HttpDocumentError[] = [];

  const onPageError = (err: Error) => {
    pageErrors.push(err.message || String(err));
  };

  const onConsole = (msg: { type: () => string; text: () => string }) => {
    if (msg.type() !== "error") return;
    const t = msg.text();
    if (NOISE_RE.test(t)) return;
    pageErrors.push(`[console.error] ${t.slice(0, 2000)}`);
  };

  const originNorm = baseOrigin ? baseOrigin.replace(/\/$/, "") : "";

  const onResponse = (response: import("@playwright/test").Response) => {
    const req = response.request();
    const status = response.status();
    if (status < 400) return;
    const url = response.url();
    let u: URL;
    try {
      u = new URL(url);
    } catch {
      return;
    }

    if (req.resourceType() === "document") {
      if (u.pathname.startsWith("/api/")) return;
      documentHttpErrors.push({ url, status, method: req.method() });
      return;
    }

    if (
      TRACK_API &&
      sameOriginApiErrors.length < MAX_API_ERRORS &&
      (req.resourceType() === "xhr" || req.resourceType() === "fetch") &&
      originNorm &&
      u.origin === originNorm
    ) {
      sameOriginApiErrors.push({ url, status, method: req.method() });
    }
  };

  page.on("pageerror", onPageError);
  page.on("console", onConsole);
  page.on("response", onResponse);

  return {
    pageErrors,
    documentHttpErrors,
    sameOriginApiErrors,
    dispose: () => {
      page.off("pageerror", onPageError);
      page.off("console", onConsole);
      page.off("response", onResponse);
    },
  };
}
