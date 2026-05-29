/**
 * Content Review Queue
 *
 * Automatically creates and prioritizes review tickets for content issues.
 * Aggregates signals from:
 *   - Content Quality Intelligence (question flags)
 *   - Rationale Quality Engine (weak rationales)
 *   - Tier Alignment Engine (scope mismatches)
 *   - Adaptive Learning (broken remediation loops)
 *   - Feature Health (low-performing content surfaces)
 *
 * Queue items are:
 *   CRITICAL — Block release / immediate action
 *   HIGH     — Address in current sprint
 *   MEDIUM   — Address in next sprint
 *   LOW      — Backlog item
 *
 * Usage:
 *   createReviewItem({ type: "question_quality", questionId, priority: "HIGH", reason });
 *   getReviewQueue({ priority: "CRITICAL" });
 *   exportReviewQueueMarkdown();
 */

import { safeServerLog } from "@/lib/observability/safe-server-log";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ReviewPriority = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export type ReviewItemType =
  | "question_quality"      // Poor/ambiguous/miskeyed question
  | "rationale_quality"     // Weak/generic rationale
  | "tier_mismatch"         // Content in wrong pathway
  | "broken_remediation"    // Remediation not working for a topic
  | "low_performing_content"// Content with high abandonment/low completion
  | "seo_regression"        // SEO asset issue
  | "instrumentation_gap"   // Route with no observability
  | "friction_hotspot";     // High-friction user experience area

export type ReviewItem = {
  id: string;
  type: ReviewItemType;
  priority: ReviewPriority;
  title: string;
  reason: string;
  evidence: string[];
  /** Resource identifier (questionId, topicSlug, routePath, etc.). */
  resourceId?: string;
  tier?: string;
  topic?: string;
  createdAt: string;
  /** Whether this item has been acknowledged by a reviewer. */
  acknowledged: boolean;
};

// ─── In-process queue ─────────────────────────────────────────────────────────

const MAX_ITEMS = 500;
let nextId = 1;
const queue: ReviewItem[] = [];

function generateId(): string {
  return `RQ-${String(nextId++).padStart(4, "0")}`;
}

// ─── Queue operations ─────────────────────────────────────────────────────────

/** Add a review item to the queue. Deduplicates by resourceId + type. */
export function createReviewItem(opts: {
  type: ReviewItemType;
  priority: ReviewPriority;
  title: string;
  reason: string;
  evidence?: string[];
  resourceId?: string;
  tier?: string;
  topic?: string;
}): ReviewItem {
  // Deduplicate: don't create duplicate items for the same resource + type
  const existing = queue.find(
    (item) =>
      item.type === opts.type &&
      item.resourceId === opts.resourceId &&
      !item.acknowledged,
  );
  if (existing) {
    // Escalate priority if higher
    const priorities: ReviewPriority[] = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
    if (priorities.indexOf(opts.priority) > priorities.indexOf(existing.priority)) {
      existing.priority = opts.priority;
      existing.reason = opts.reason;
    }
    return existing;
  }

  const item: ReviewItem = {
    id: generateId(),
    type: opts.type,
    priority: opts.priority,
    title: opts.title,
    reason: opts.reason,
    evidence: opts.evidence ?? [],
    resourceId: opts.resourceId,
    tier: opts.tier,
    topic: opts.topic,
    createdAt: new Date().toISOString(),
    acknowledged: false,
  };

  queue.push(item);
  if (queue.length > MAX_ITEMS) queue.shift();

  // Log critical items immediately
  if (opts.priority === "CRITICAL") {
    safeServerLog("content", "review_queue_critical_item", {
      itemId: item.id,
      type: opts.type,
      title: opts.title.slice(0, 120),
      resourceId: opts.resourceId?.slice(0, 64),
      tier: opts.tier,
    });
  }

  return item;
}

/** Get queue items, optionally filtered. */
export function getReviewQueue(opts: {
  priority?: ReviewPriority | ReviewPriority[];
  type?: ReviewItemType | ReviewItemType[];
  tier?: string;
  acknowledgedOnly?: boolean;
  unacknowledgedOnly?: boolean;
} = {}): ReviewItem[] {
  let items = [...queue];

  if (opts.priority) {
    const priorities = Array.isArray(opts.priority) ? opts.priority : [opts.priority];
    items = items.filter((i) => priorities.includes(i.priority));
  }
  if (opts.type) {
    const types = Array.isArray(opts.type) ? opts.type : [opts.type];
    items = items.filter((i) => types.includes(i.type));
  }
  if (opts.tier) items = items.filter((i) => i.tier === opts.tier);
  if (opts.acknowledgedOnly) items = items.filter((i) => i.acknowledged);
  if (opts.unacknowledgedOnly) items = items.filter((i) => !i.acknowledged);

  // Sort: CRITICAL first, then by createdAt desc
  const priorityOrder: Record<ReviewPriority, number> = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
  return items.sort((a, b) => {
    const pd = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (pd !== 0) return pd;
    return b.createdAt.localeCompare(a.createdAt);
  });
}

/** Acknowledge a review item (mark as seen by reviewer). */
export function acknowledgeReviewItem(itemId: string): boolean {
  const item = queue.find((i) => i.id === itemId);
  if (!item) return false;
  item.acknowledged = true;
  return true;
}

/** Queue summary. */
export function getQueueSummary(): {
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  unacknowledged: number;
  byType: Record<ReviewItemType, number>;
} {
  const unack = queue.filter((i) => !i.acknowledged);
  const byType = {} as Record<ReviewItemType, number>;
  for (const item of queue) {
    byType[item.type] = (byType[item.type] ?? 0) + 1;
  }

  return {
    total: queue.length,
    critical: queue.filter((i) => i.priority === "CRITICAL").length,
    high: queue.filter((i) => i.priority === "HIGH").length,
    medium: queue.filter((i) => i.priority === "MEDIUM").length,
    low: queue.filter((i) => i.priority === "LOW").length,
    unacknowledged: unack.length,
    byType,
  };
}

/** Export queue as Markdown for sprint planning / Notion docs. */
export function exportReviewQueueMarkdown(filter?: { priority?: ReviewPriority }): string {
  const items = getReviewQueue({ ...filter, unacknowledgedOnly: true });

  if (items.length === 0) return "# Content Review Queue\n\nNo items requiring review.\n";

  const priorityEmoji: Record<ReviewPriority, string> = {
    CRITICAL: "🔴",
    HIGH: "🟠",
    MEDIUM: "🟡",
    LOW: "🟢",
  };

  const byPriority = new Map<ReviewPriority, ReviewItem[]>();
  for (const item of items) {
    const arr = byPriority.get(item.priority) ?? [];
    arr.push(item);
    byPriority.set(item.priority, arr);
  }

  const lines = [
    "# Content Review Queue",
    "",
    `Generated: ${new Date().toISOString()}`,
    `Total items: ${items.length}`,
    "",
  ];

  for (const priority of ["CRITICAL", "HIGH", "MEDIUM", "LOW"] as ReviewPriority[]) {
    const group = byPriority.get(priority);
    if (!group?.length) continue;

    lines.push(`## ${priorityEmoji[priority]} ${priority} (${group.length})`);
    lines.push("");

    for (const item of group) {
      lines.push(`### ${item.id}: ${item.title}`);
      lines.push(`- **Type**: ${item.type.replace(/_/g, " ")}`);
      if (item.tier) lines.push(`- **Tier**: ${item.tier}`);
      if (item.topic) lines.push(`- **Topic**: ${item.topic}`);
      if (item.resourceId) lines.push(`- **Resource**: ${item.resourceId}`);
      lines.push(`- **Reason**: ${item.reason}`);
      if (item.evidence.length > 0) {
        lines.push("- **Evidence**:");
        for (const e of item.evidence.slice(0, 3)) {
          lines.push(`  - ${e}`);
        }
      }
      lines.push(`- **Created**: ${item.createdAt.slice(0, 10)}`);
      lines.push("");
    }
  }

  return lines.join("\n");
}

// ─── Auto-populate from quality engines ──────────────────────────────────────

import type { QuestionQualityReport } from "@/lib/observability/content-quality-intelligence";
import type { RationaleQualityResult } from "@/lib/observability/rationale-quality-engine";
import type { TierAlignmentResult } from "@/lib/observability/tier-alignment-engine";

/** Ingest question quality reports and create review items for flagged questions. */
export function ingestQuestionQualityReport(reports: QuestionQualityReport[]): number {
  let created = 0;
  for (const r of reports) {
    if (r.flags.length === 0) continue;

    const priority: ReviewPriority =
      r.status === "critical" ? "CRITICAL" :
      r.status === "review_required" ? "HIGH" :
      r.status === "watch" ? "MEDIUM" : "LOW";

    createReviewItem({
      type: "question_quality",
      priority,
      title: `Question quality issue: ${r.topic}`,
      reason: `Flags: ${r.flags.join(", ")}. Score: ${r.qualityScore}/100.`,
      evidence: [`Correct rate: ${Math.round(r.correctRate * 100)}%`, `Abandon rate: ${Math.round(r.abandonRate * 100)}%`],
      resourceId: r.questionId,
      tier: r.tier,
      topic: r.topic,
    });
    created++;
  }
  return created;
}

/** Ingest rationale quality results and create review items for poor rationales. */
export function ingestRationaleQualityResults(results: RationaleQualityResult[]): number {
  let created = 0;
  for (const r of results) {
    if (r.status === "excellent" || r.status === "good") continue;

    const priority: ReviewPriority =
      r.status === "critical" ? "HIGH" :
      r.status === "poor" ? "MEDIUM" : "LOW";

    createReviewItem({
      type: "rationale_quality",
      priority,
      title: `Rationale needs improvement: ${r.questionId}`,
      reason: `Rationale score: ${r.qualityScore}/100. ${r.flags.join(", ")}.`,
      evidence: r.flaggedPhrases.slice(0, 3),
      resourceId: r.questionId,
    });
    created++;
  }
  return created;
}

/** Ingest tier alignment results and create review items for misaligned content. */
export function ingestTierAlignmentResults(results: TierAlignmentResult[]): number {
  let created = 0;
  for (const r of results) {
    if (r.violations.length === 0) continue;

    createReviewItem({
      type: "tier_mismatch",
      priority: r.alignmentScore < 50 ? "HIGH" : "MEDIUM",
      title: `Tier alignment issue: ${r.topic} (${r.tier})`,
      reason: `${r.violations.join(", ")}`,
      evidence: r.violationDetails.slice(0, 3),
      resourceId: r.questionId,
      tier: r.tier,
      topic: r.topic,
    });
    created++;
  }
  return created;
}

export function clearReviewQueue(): void {
  queue.length = 0;
  nextId = 1;
}
