import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { isRuntimeSafeMode } from "@/lib/runtime/safe-mode";

export function utcDayDate(): Date {
  const n = new Date();
  return new Date(Date.UTC(n.getUTCFullYear(), n.getUTCMonth(), n.getUTCDate()));
}

function segmentClamp(s: string, max = 96): string {
  const t = s.trim();
  if (t.length <= max) return t;
  return t.slice(0, max);
}

async function bumpRollup(day: Date, metricKey: string, segment: string, delta: number): Promise<void> {
  await prisma.premiumProtectionRollup.upsert({
    where: {
      day_metricKey_segment: { day, metricKey: segmentClamp(metricKey), segment: segmentClamp(segment) },
    },
    create: {
      day,
      metricKey: segmentClamp(metricKey),
      segment: segmentClamp(segment),
      count: delta,
    },
    update: { count: { increment: delta } },
  });
}

async function bumpUserDay(userId: string, day: Date, metricKey: string, delta: number): Promise<number> {
  const key = segmentClamp(metricKey);
  const row = await prisma.premiumProtectionUserDay.upsert({
    where: { userId_day_metricKey: { userId, day, metricKey: key } },
    create: { userId, day, metricKey: key, count: delta },
    update: { count: { increment: delta } },
    select: { count: true },
  });
  return row.count;
}

async function maybeQueueAbuseReview(args: {
  userId: string;
  day: Date;
  kind: string;
  route: string;
  userDayCount: number;
}): Promise<void> {
  const { userId, day, kind, route, userDayCount } = args;
  if (kind !== "user_rate_limit" && kind !== "bulk_question_fetch" && kind !== "bulk_list_fetch") return;

  const reason =
    kind === "user_rate_limit" ? "repeated_user_rate_limit" : kind === "bulk_question_fetch" ? "bulk_question_volume" : "bulk_list_volume";
  const threshold = kind === "user_rate_limit" ? 14 : 4;
  if (userDayCount < threshold) return;

  const dayEnd = new Date(day);
  dayEnd.setUTCDate(dayEnd.getUTCDate() + 1);

  const existing = await prisma.protectionAbuseReview.findFirst({
    where: {
      userId,
      reason,
      dismissedAt: null,
      createdAt: { gte: day, lt: dayEnd },
    },
    select: { id: true },
  });
  if (existing) return;

  await prisma.protectionAbuseReview.create({
    data: {
      userId,
      reason,
      score: userDayCount,
      evidence: { kind, route, day: day.toISOString().slice(0, 10), count: userDayCount },
    },
  });
}

/**
 * Fire-and-forget from API abuse logging: global rollup + per-user daily tally (no PII in rollups).
 */
export async function recordPremiumProtectionAbuseFromLog(args: {
  kind: string;
  route: string;
  userId: string;
}): Promise<void> {
  if (!isDatabaseUrlConfigured() || isRuntimeSafeMode()) return;
  const day = utcDayDate();
  const mk = `api_abuse_${segmentClamp(args.kind, 64)}`;
  const seg = segmentClamp(args.route, 64);
  const userMk = `abuse:${segmentClamp(args.kind, 40)}:${seg}`;

  try {
    await prisma.$transaction([
      prisma.premiumProtectionRollup.upsert({
        where: { day_metricKey_segment: { day, metricKey: mk, segment: seg } },
        create: { day, metricKey: mk, segment: seg, count: 1 },
        update: { count: { increment: 1 } },
      }),
      prisma.premiumProtectionUserDay.upsert({
        where: { userId_day_metricKey: { userId: args.userId, day, metricKey: userMk } },
        create: { userId: args.userId, day, metricKey: userMk, count: 1 },
        update: { count: { increment: 1 } },
      }),
    ]);
    const row = await prisma.premiumProtectionUserDay.findUnique({
      where: { userId_day_metricKey: { userId: args.userId, day, metricKey: userMk } },
      select: { count: true },
    });
    if (row) {
      await maybeQueueAbuseReview({
        userId: args.userId,
        day,
        kind: args.kind,
        route: args.route,
        userDayCount: row.count,
      });
    }
  } catch {
    /* avoid throwing into request path */
  }
}

const CLIENT_METRIC_KEYS = new Set(["copy_blocked", "cut_blocked", "print_prompt", "tab_blur_applied"]);

export function isClientProtectionMetricKey(k: string): boolean {
  return CLIENT_METRIC_KEYS.has(k);
}

/** Subscriber client deterrence signals (batched). */
export async function recordPremiumProtectionClientBatch(args: {
  userId: string;
  items: Array<{ metricKey: string; surface: string; count: number }>;
}): Promise<void> {
  if (!isDatabaseUrlConfigured() || isRuntimeSafeMode()) return;
  const day = utcDayDate();
  const { userId, items } = args;

  const ops = items.flatMap((it) => {
    if (!isClientProtectionMetricKey(it.metricKey) || it.count <= 0) return [];
    const c = Math.min(it.count, 500);
    const seg = segmentClamp(it.surface || "unknown", 64);
    const mk = `client_${it.metricKey}`;
    return [
      prisma.premiumProtectionRollup.upsert({
        where: { day_metricKey_segment: { day, metricKey: mk, segment: seg } },
        create: { day, metricKey: mk, segment: seg, count: c },
        update: { count: { increment: c } },
      }),
      prisma.premiumProtectionUserDay.upsert({
        where: {
          userId_day_metricKey: { userId, day, metricKey: `client:${it.metricKey}:${seg}` },
        },
        create: { userId, day, metricKey: `client:${it.metricKey}:${seg}`, count: c },
        update: { count: { increment: c } },
      }),
    ];
  });
  if (ops.length === 0) return;
  try {
    await prisma.$transaction(ops);
  } catch {
    /* ignore */
  }
}

export async function recordLearnerNoteMutationRollup(kind: "note_upsert" | "note_delete", userId: string): Promise<void> {
  if (!isDatabaseUrlConfigured() || isRuntimeSafeMode()) return;
  const day = utcDayDate();
  try {
    await bumpRollup(day, kind, "", 1);
    await bumpUserDay(userId, day, kind, 1);
  } catch {
    /* ignore */
  }
}
