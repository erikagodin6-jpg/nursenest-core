import "server-only";

import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { REVENUE_ALERT_LOG_KIND, revenueAlertHealthStatus } from "@/lib/revenue-alerts/revenue-alerts";

export type RevenueAlertCenterRow = {
  id: string;
  createdAt: string;
  userId: string;
  event: string;
  subject: string;
  deliveryStatus: string;
  emailStatus: string;
  smsStatus: string;
  retryStatus: string;
  amountLabel: string;
  unread: boolean;
  resolved: boolean;
  errorMessages: string[];
};

export type RevenueAlertsCenterDashboard = {
  generatedAt: string;
  health: ReturnType<typeof revenueAlertHealthStatus> & {
    recentFailedDeliveries: number;
    notificationQueueHealthy: boolean;
    backgroundJobsHealthy: boolean;
  };
  summary: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    unread: number;
    resolved: number;
    revenueEvents: number;
  };
  rows: RevenueAlertCenterRow[];
};

function metaRecord(meta: unknown): Record<string, unknown> {
  return meta && typeof meta === "object" && !Array.isArray(meta) ? (meta as Record<string, unknown>) : {};
}

function boolMeta(meta: Record<string, unknown>, key: string, fallback: boolean): boolean {
  return typeof meta[key] === "boolean" ? meta[key] : fallback;
}

function strMeta(meta: Record<string, unknown>, key: string, fallback = "—"): string {
  return typeof meta[key] === "string" && meta[key].trim() ? meta[key].trim() : fallback;
}

function money(amount: unknown, currency: unknown): string {
  if (typeof amount !== "number") return "—";
  const cur = typeof currency === "string" && currency.trim() ? currency.toUpperCase() : "USD";
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: cur }).format(amount / 100);
  } catch {
    return `${(amount / 100).toFixed(2)} ${cur}`;
  }
}

function sinceDays(days: number): Date {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  return d;
}

export async function loadRevenueAlertsCenterDashboard(): Promise<RevenueAlertsCenterDashboard> {
  const healthBase = revenueAlertHealthStatus();
  if (!isDatabaseUrlConfigured()) {
    return {
      generatedAt: new Date().toISOString(),
      health: {
        ...healthBase,
        recentFailedDeliveries: 0,
        notificationQueueHealthy: false,
        backgroundJobsHealthy: false,
      },
      summary: { today: 0, thisWeek: 0, thisMonth: 0, unread: 0, resolved: 0, revenueEvents: 0 },
      rows: [],
    };
  }

  const [rows, today, thisWeek, thisMonth] = await Promise.all([
    prisma.emailNotificationLog.findMany({
      where: { kind: REVENUE_ALERT_LOG_KIND },
      orderBy: { createdAt: "desc" },
      take: 80,
      select: { id: true, userId: true, createdAt: true, meta: true },
    }),
    prisma.emailNotificationLog.count({ where: { kind: REVENUE_ALERT_LOG_KIND, createdAt: { gte: sinceDays(1) } } }),
    prisma.emailNotificationLog.count({ where: { kind: REVENUE_ALERT_LOG_KIND, createdAt: { gte: sinceDays(7) } } }),
    prisma.emailNotificationLog.count({ where: { kind: REVENUE_ALERT_LOG_KIND, createdAt: { gte: sinceDays(31) } } }),
  ]);

  const mapped = rows.map((row) => {
    const meta = metaRecord(row.meta);
    const errors = Array.isArray(meta.errorMessages) ? meta.errorMessages.map(String) : [];
    return {
      id: row.id,
      createdAt: row.createdAt.toISOString(),
      userId: row.userId,
      event: strMeta(meta, "event", "revenue_event"),
      subject: strMeta(meta, "subject", "Revenue alert"),
      deliveryStatus: strMeta(meta, "deliveryStatus", "unknown"),
      emailStatus: strMeta(meta, "emailStatus", "unknown"),
      smsStatus: strMeta(meta, "smsStatus", "unknown"),
      retryStatus: strMeta(meta, "retryStatus", "unknown"),
      amountLabel: money(meta.amountCents, meta.currency),
      unread: boolMeta(meta, "unread", true),
      resolved: boolMeta(meta, "resolved", false),
      errorMessages: errors,
    };
  });

  const recentFailedDeliveries = mapped.filter((row) => row.deliveryStatus !== "delivered").length;

  return {
    generatedAt: new Date().toISOString(),
    health: {
      ...healthBase,
      recentFailedDeliveries,
      notificationQueueHealthy: recentFailedDeliveries === 0,
      backgroundJobsHealthy: healthBase.stripeWebhookConfigured,
    },
    summary: {
      today,
      thisWeek,
      thisMonth,
      unread: mapped.filter((row) => row.unread).length,
      resolved: mapped.filter((row) => row.resolved).length,
      revenueEvents: mapped.length,
    },
    rows: mapped,
  };
}
