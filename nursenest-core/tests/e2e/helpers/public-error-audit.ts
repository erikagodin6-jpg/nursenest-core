import type { ConsoleMessage, Page, Request, Response } from "@playwright/test";

export type ErrorAuditSeverity = "critical" | "high" | "medium" | "low" | "info";

export type PublicErrorAuditRow = {
  route: string;
  errorType:
    | "console_error"
    | "console_warning"
    | "i18n_missing_key"
    | "hydration_warning"
    | "pageerror"
    | "request_failed"
    | "http_4xx"
    | "http_5xx"
    | "missing_asset"
    | "image_load_failure";
  message: string;
  severity: ErrorAuditSeverity;
  likelySource?: string;
  /** Request or resource URL when applicable */
  detailUrl?: string;
  httpStatus?: number;
  resourceType?: string;
};

function isHydrationText(text: string): boolean {
  return /hydrat|did not match|server rendered HTML|Expected server HTML|suppressHydrationWarning|There was an error while hydrating/i.test(
    text,
  );
}

function severityForConsole(text: string, isHydration: boolean): ErrorAuditSeverity {
  if (isHydration) return "high";
  if (/ChunkLoadError|Loading chunk \d+ failed|Failed to fetch dynamically imported module/i.test(text)) {
    return "critical";
  }
  if (/Uncaught|ReferenceError|TypeError| is not defined/i.test(text)) return "high";
  return "medium";
}

function severityForHttp(status: number): ErrorAuditSeverity {
  if (status >= 500) return "high";
  if (status === 404) return "medium";
  return "low";
}

/** Best-effort: React component/stack hints in console or pageerror text */
export function inferLikelySource(text: string): string | undefined {
  const m =
    text.match(/in the <([A-Za-z0-9_.]+)>/i) ||
    text.match(/The above error occurred in the <([A-Za-z0-9_.]+)>/i) ||
    text.match(/at ([A-Za-z0-9_.]+) \(/);
  if (m?.[1]) return m[1];

  const mod = text.match(/\/([^/]+\.(tsx|jsx|ts|js)):\d+/);
  if (mod?.[1]) return mod[1];

  return undefined;
}

function errorTypeForHttp(
  status: number,
  resourceType: string,
  url: string,
): PublicErrorAuditRow["errorType"] {
  const isImage = resourceType === "image" || /\.(png|jpe?g|webp|gif|svg|avif)(\?|$)/i.test(url);
  if (isImage && status >= 400) return "image_load_failure";
  const isAsset =
    resourceType === "stylesheet" ||
    resourceType === "script" ||
    resourceType === "font" ||
    /\.(css|js|mjs|woff2?)(\?|$)/i.test(url);
  if (isAsset && status === 404) return "missing_asset";
  return status >= 500 ? "http_5xx" : "http_4xx";
}

export type PublicErrorAuditHandle = {
  /** Call before navigating to a new route (resets per-route HTTP dedupe). */
  beginRoute: (label: string) => void;
  /** Update label after redirects (optional). */
  setRouteLabel: (label: string) => void;
  /** Manual row (e.g. failed navigation) — same shape as captured events */
  addEntry: (row: PublicErrorAuditRow) => void;
  dispose: () => void;
  getEntries: () => PublicErrorAuditRow[];
  clearEntries: () => void;
};

/**
 * Captures console errors/warnings, uncaught page errors, failed requests, and HTTP error responses
 * for same-origin traffic. Intended for public-route audits — not filtered like {@link attachPageObservers}.
 */
export function attachPublicErrorAudit(page: Page, opts: { origin: string }): PublicErrorAuditHandle {
  const { origin } = opts;
  const entries: PublicErrorAuditRow[] = [];
  let routeLabel = "";
  const seenHttp = new Set<string>();

  const push = (row: Omit<PublicErrorAuditRow, "route"> & { route?: string }) => {
    entries.push({
      route: row.route ?? routeLabel,
      errorType: row.errorType,
      message: row.message,
      severity: row.severity,
      likelySource: row.likelySource ?? inferLikelySource(row.message),
      detailUrl: row.detailUrl,
      httpStatus: row.httpStatus,
      resourceType: row.resourceType,
    });
  };

  const onConsole = (msg: ConsoleMessage) => {
    const text = msg.text();
    const type = msg.type();
    const hydration = isHydrationText(text);

    if (type === "error") {
      const i18nMissing = /marketing_message_key_missing/i.test(text);
      if (i18nMissing && !hydration) {
        push({
          errorType: "i18n_missing_key",
          message: text,
          severity: "low",
        });
        return;
      }
      push({
        errorType: hydration ? "hydration_warning" : "console_error",
        message: text,
        severity: severityForConsole(text, hydration),
      });
      return;
    }
    if (type === "warning" && hydration) {
      push({
        errorType: "hydration_warning",
        message: text,
        severity: "high",
      });
    }
  };

  const onPageError = (err: Error) => {
    const message = err?.message ?? String(err);
    push({
      errorType: "pageerror",
      message,
      severity: "critical",
    });
  };

  const onRequestFailed = (req: Request) => {
    const url = req.url();
    const fail = req.failure();
    if (fail?.errorText === "net::ERR_ABORTED") return;
    const rt = req.resourceType();
    const isImage = rt === "image";
    push({
      errorType: isImage ? "image_load_failure" : "request_failed",
      message: `${fail?.errorText ?? "request failed"} → ${url}`,
      severity: isImage ? "medium" : "medium",
      detailUrl: url,
      resourceType: rt,
    });
  };

  const onResponse = (response: Response) => {
    const status = response.status();
    if (status < 400) return;
    const url = response.url();
    if (!url.startsWith(origin)) return;
    const req = response.request();
    const resourceType = req.resourceType();
    const key = `${status}:${url}:${resourceType}`;
    if (seenHttp.has(key)) return;
    seenHttp.add(key);

    const et = errorTypeForHttp(status, resourceType, url);
    const sev = severityForHttp(status);
    push({
      errorType: et,
      message: `HTTP ${status} ${resourceType} ${url}`,
      severity: et === "image_load_failure" || et === "missing_asset" ? "medium" : sev,
      detailUrl: url,
      httpStatus: status,
      resourceType,
    });
  };

  page.on("console", onConsole);
  page.on("pageerror", onPageError);
  page.on("requestfailed", onRequestFailed);
  page.on("response", onResponse);

  return {
    beginRoute: (label: string) => {
      routeLabel = label;
      seenHttp.clear();
    },
    setRouteLabel: (label: string) => {
      routeLabel = label;
    },
    addEntry: (row: PublicErrorAuditRow) => {
      entries.push(row);
    },
    getEntries: () => [...entries],
    clearEntries: () => {
      entries.length = 0;
    },
    dispose: () => {
      page.off("console", onConsole);
      page.off("pageerror", onPageError);
      page.off("requestfailed", onRequestFailed);
      page.off("response", onResponse);
    },
  };
}

export async function writePublicErrorAuditReport(
  rows: PublicErrorAuditRow[],
  baseURL: string,
): Promise<{ jsonPath: string; mdPath: string }> {
  const fs = await import("node:fs/promises");
  const path = await import("node:path");

  const dir = path.join(process.cwd(), "test-results", "public-error-audit");
  await fs.mkdir(dir, { recursive: true });

  const stamp = new Date().toISOString();
  const jsonPath = path.join(dir, "public-error-audit-report.json");
  const mdPath = path.join(dir, "public-error-audit-report.md");

  const bySeverity = (s: ErrorAuditSeverity) => rows.filter((r) => r.severity === s).length;

  const payload = {
    generatedAt: stamp,
    baseURL,
    summary: {
      total: rows.length,
      critical: bySeverity("critical"),
      high: bySeverity("high"),
      medium: bySeverity("medium"),
      low: bySeverity("low"),
      info: bySeverity("info"),
    },
    findings: rows,
  };

  await fs.writeFile(jsonPath, JSON.stringify(payload, null, 2), "utf8");

  const esc = (s: string) => s.replace(/\|/g, "\\|").replace(/\n/g, " ");

  const lines: string[] = [
    `# Public error audit`,
    ``,
    `Generated: ${stamp}`,
    ``,
    `Base URL: \`${baseURL}\``,
    ``,
    `| Route | Type | Severity | Message | Likely source |`,
    `| --- | --- | --- | --- | --- |`,
  ];

  for (const r of rows) {
    lines.push(
      `| ${esc(r.route)} | ${r.errorType} | ${r.severity} | ${esc(r.message)} | ${esc(r.likelySource ?? "")} |`,
    );
  }

  if (rows.length === 0) {
    lines.push(``, `_No issues recorded._`);
  }

  await fs.writeFile(mdPath, lines.join("\n"), "utf8");
  return { jsonPath, mdPath };
}
