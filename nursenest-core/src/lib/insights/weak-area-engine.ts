import type { WeakAreaInsight, WeaknessTier } from "@/lib/insights/types";
import type { WeakTopicRow } from "@/lib/learner/weak-topics-from-sessions";

function tierFromRow(r: WeakTopicRow): WeaknessTier {
  const mr = r.missRate;
  const ws = r.wrongStreak ?? 0;
  const n = r.attempted;

  if (ws >= 4 || mr >= 72 || (n >= 12 && mr >= 55)) return "critical";
  if (r.strength === "weak" || mr >= 48 || (n >= 6 && mr >= 42)) return "weak";
  if (r.strength === "strong" && mr <= 22 && n >= 4) return "strong";
  return "moderate";
}

function riskFromRow(r: WeakTopicRow, tier: WeaknessTier): "high" | "medium" | "low" {
  if (tier === "critical") return "high";
  if (tier === "weak") return "high";
  const ws = r.wrongStreak ?? 0;
  if (ws >= 2 && r.missRate >= 40) return "medium";
  if (tier === "moderate" && r.attempted >= 8 && r.missRate >= 35) return "medium";
  return "low";
}

function whyLine(r: WeakTopicRow, tier: WeaknessTier): string {
  const ws = r.wrongStreak ?? 0;
  if (tier === "critical") {
    return `High miss concentration on ${r.topic} (${r.missed} misses in ${r.attempted} attempts; streak ${ws}).`;
  }
  if (tier === "weak") {
    return `Ledger shows repeated trouble with ${r.topic} (~${r.missRate}% miss rate).`;
  }
  if (tier === "strong") {
    return `${r.topic} looks comparatively solid with enough attempts to trust the signal.`;
  }
  return `Mixed signal on ${r.topic} — keep short quizzes to confirm whether it stays a priority.`;
}

/**
 * Enriches weak-topic rows with tier, risk, and explainability.
 */
export function buildWeakAreaInsights(rows: WeakTopicRow[], limit = 12): WeakAreaInsight[] {
  const out: WeakAreaInsight[] = [];
  for (const r of rows.slice(0, limit)) {
    const tier = tierFromRow(r);
    const risk = riskFromRow(r, tier);
    out.push({
      ...r,
      tier,
      risk,
      why: whyLine(r, tier),
    });
  }
  return out.sort((a, b) => {
    const order: Record<WeaknessTier, number> = { critical: 0, weak: 1, moderate: 2, strong: 3 };
    return order[a.tier] - order[b.tier] || b.missRate - a.missRate;
  });
}
