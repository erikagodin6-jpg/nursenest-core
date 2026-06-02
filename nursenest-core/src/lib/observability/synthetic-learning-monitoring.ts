import { htmlEmailShell, sendTransactionalEmailHtml } from "@/lib/email/resend-transactional";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export type SyntheticLearningStatus = "pass" | "fail";

export type SyntheticLearningCheckInput = {
  runId: string;
  checkName: string;
  route: string;
  status: SyntheticLearningStatus;
  durationMs: number;
  httpStatus?: number | null;
  error?: string | null;
  screenshotDataUrl?: string | null;
  checkedAt?: string | null;
  meta?: Record<string, unknown> | null;
};

export type SyntheticLearningDashboardRow = {
  checkName: string;
  route: string;
  status: SyntheticLearningStatus;
  durationMs: number;
  checkedAt: string;
  error: string | null;
  screenshotDataUrl: string | null;
};

export type SyntheticLearningDashboard = {
  generatedAt: string;
  windowHours: number;
  uptimePct: number | null;
  startupLatency: {
    avgMs: number | null;
    p95Ms: number | null;
  };
  totals: {
    total: number;
    passed: number;
    failed: number;
  };
  recentFailures: SyntheticLearningDashboardRow[];
  latestByCheck: SyntheticLearningDashboardRow[];
};

const MAX_SCREENSHOT_DATA_URL_LENGTH = 450_000;

export function isSyntheticLearningIngestAuthorized(req: Request): boolean {
  const configured = process.env.SYNTHETIC_MONITOR_SECRET?.trim() || process.env.CRON_SECRET?.trim();
  if (!configured) return process.env.NODE_ENV !== "production";
  const header = req.headers.get("authorization") ?? "";
  return header === `Bearer ${configured}`;
}

function cleanText(value: unknown, max = 1000): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, max) : null;
}

function cleanNumber(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  return Math.max(0, Math.round(value));
}

export function parseSyntheticLearningPayload(body: unknown): { ok: true; checks: SyntheticLearningCheckInput[] } | { ok: false; error: string } {
  if (!body || typeof body !== "object") return { ok: false, error: "invalid_body" };
  const record = body as Record<string, unknown>;
  const rawChecks = Array.isArray(record.checks) ? record.checks : null;
  if (!rawChecks) return { ok: false, error: "checks_required" };
  const fallbackRunId = cleanText(record.runId, 96) ?? `synthetic-${Date.now()}`;
  const checks: SyntheticLearningCheckInput[] = [];
  for (const raw of rawChecks) {
    if (!raw || typeof raw !== "object") continue;
    const row = raw as Record<string, unknown>;
    const checkName = cleanText(row.checkName, 96);
    const route = cleanText(row.route, 512);
    const status = row.status === "pass" || row.status === "fail" ? row.status : null;
    const durationMs = cleanNumber(row.durationMs);
    if (!checkName || !route || !status || durationMs === null) continue;
    const screenshot = cleanText(row.screenshotDataUrl, MAX_SCREENSHOT_DATA_URL_LENGTH);
    checks.push({
      runId: cleanText(row.runId, 96) ?? fallbackRunId,
      checkName,
      route,
      status,
      durationMs,
      httpStatus: cleanNumber(row.httpStatus),
      error: cleanText(row.error, 1000),
      screenshotDataUrl: screenshot?.startsWith("data:image/") ? screenshot : null,
      checkedAt: cleanText(row.checkedAt, 64),
      meta: row.meta && typeof row.meta === "object" ? (row.meta as Record<string, unknown>) : null,
    });
  }
  if (checks.length === 0) return { ok: false, error: "no_valid_checks" };
  return { ok: true, checks };
}

function alertText(failures: SyntheticLearningCheckInput[]): string {
  return failures
    .map((f) => `- ${f.checkName} ${f.route}: ${f.durationMs}ms${f.error ? ` (${f.error})` : ""}`)
    .join("\n");
}

async function postJsonWebhook(url: string, body: unknown): Promise<void> {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), 5000);
  try {
    await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
      signal: ac.signal,
    });
  } finally {
    clearTimeout(t);
  }
}

export async function sendSyntheticLearningFailureAlerts(failures: SyntheticLearningCheckInput[]): Promise<void> {
  if (failures.length === 0) return;
  const text = `NurseNest synthetic learning monitor detected ${failures.length} failure(s):\n${alertText(failures)}`;
  const jobs: Promise<unknown>[] = [];

  const emailRecipients = (process.env.SYNTHETIC_MONITOR_ALERT_EMAILS ?? "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
  for (const to of emailRecipients) {
    jobs.push(
      sendTransactionalEmailHtml({
        to,
        subject: "NurseNest learning activity monitor failure",
        text,
        html: htmlEmailShell(
          "NurseNest learning activity monitor failure",
          `<p>Authenticated learner synthetic monitoring detected a failure.</p><pre style="white-space:pre-wrap;background:#f6f8fa;padding:12px;border-radius:8px;">${text.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</pre>`,
        ),
      }),
    );
  }

  const slack = process.env.SYNTHETIC_MONITOR_SLACK_WEBHOOK_URL?.trim();
  if (slack) jobs.push(postJsonWebhook(slack, { text }));

  const discord = process.env.SYNTHETIC_MONITOR_DISCORD_WEBHOOK_URL?.trim();
  if (discord) jobs.push(postJsonWebhook(discord, { content: text }));

  const settled = await Promise.allSettled(jobs);
  for (const result of settled) {
    if (result.status === "rejected") {
      safeServerLog("synthetic_learning", "alert_delivery_failed", {
        message: result.reason instanceof Error ? result.reason.message.slice(0, 200) : String(result.reason).slice(0, 200),
      });
    }
  }
}
