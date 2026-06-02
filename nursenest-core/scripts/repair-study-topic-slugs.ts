#!/usr/bin/env npx tsx
/**
 * Repair PathwayLesson.topic_slug only (kebab-case, trimmed). Dry-run unless --apply.
 * Preserves already-valid strict kebab slugs. With --force, overwrites even when valid.
 *
 * Usage:
 *   npx tsx scripts/repair-study-topic-slugs.ts
 *   npx tsx scripts/repair-study-topic-slugs.ts --apply
 *   npx tsx scripts/repair-study-topic-slugs.ts --apply --force
 *   npx tsx scripts/repair-study-topic-slugs.ts --pathwayId=us-rn-nclex-rn
 */
import "dotenv/config";
import { prisma } from "./lib/prisma-script-client";
import {
  isStrictKebabTopicSlug,
  normalizeTopicSlugInput,
  topicTitleToSlugSuggestion,
} from "@/lib/study/topic-slug-normalize";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";

function parseArgs() {
  const argv = process.argv.slice(2);
  let apply = false;
  let force = false;
  let pathwayId: string | null = null;
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]!;
    if (a === "--apply") apply = true;
    else if (a === "--force") force = true;
    else if (a === "--pathwayId" && argv[i + 1]) {
      pathwayId = argv[i + 1]!.trim();
      i++;
    }
  }
  return { apply, force, pathwayId };
}

async function main() {
  const { apply, force, pathwayId } = parseArgs();
  if (!isDatabaseUrlConfigured()) {
    console.log("[TOPIC_SLUG_REPAIR_PLAN] DATABASE_URL not configured — exiting.");
    process.exit(0);
  }

  const plan: { id: string; from: string; to: string }[] = [];
  const pathwayWhere = pathwayId ? { pathwayId } : {};

  let cursor: string | undefined;
  for (;;) {
    const batch = await prisma.pathwayLesson.findMany({
      where: pathwayWhere,
      orderBy: { id: "asc" },
      take: 400,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      select: { id: true, topicSlug: true, topic: true, title: true },
    });
    if (batch.length === 0) break;
    cursor = batch[batch.length - 1]!.id;
    for (const r of batch) {
      const raw = r.topicSlug ?? "";
      const normalized = normalizeTopicSlugInput(raw);
      const fallback = topicTitleToSlugSuggestion(r.topic || r.title);
      const candidate = normalized || fallback;
      if (!candidate) continue;
      if (!force && isStrictKebabTopicSlug(raw)) continue;
      if (candidate === raw.trim()) continue;
      plan.push({ id: r.id, from: raw, to: candidate });
    }
  }

  console.log(`[TOPIC_SLUG_REPAIR_PLAN] rows=${plan.length} apply=${apply} force=${force}`);
  for (const p of plan.slice(0, 50)) {
    console.log(`[TOPIC_SLUG_REPAIR_PLAN] id=${p.id} "${p.from}" -> "${p.to}"`);
  }
  if (plan.length > 50) console.log(`[TOPIC_SLUG_REPAIR_PLAN] ... ${plan.length - 50} more`);

  if (!apply) {
    console.log("[TOPIC_SLUG_REPAIR_APPLIED] skipped (pass --apply)");
    return;
  }

  let n = 0;
  for (const p of plan) {
    await prisma.pathwayLesson.update({
      where: { id: p.id },
      data: { topicSlug: p.to },
    });
    n++;
  }
  console.log(`[TOPIC_SLUG_REPAIR_APPLIED] updated=${n}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
