import { STYLE_GOVERNANCE } from "@/lib/content/lesson-image-audit/constants";
import type {
  ImageProductionRoadmap,
  ImageProductionRoadmapItem,
  ProposedVisualSystemBatch,
} from "@/lib/content/lesson-image-audit/production-roadmap";
import { visualSystemLabel } from "@/lib/content/lesson-image-audit/production-roadmap";
import type { DuplicateImageOpportunity } from "@/lib/content/lesson-image-audit/types";

function csvEscape(value: string | number | boolean | null | undefined): string {
  if (value === null || value === undefined) return "";
  const s = String(value);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

const ROADMAP_CSV_COLUMNS: (keyof ImageProductionRoadmapItem)[] = [
  "productionPriority",
  "priorityScore",
  "lessonTitle",
  "pathway",
  "pathwayId",
  "slug",
  "cluster",
  "productionCluster",
  "currentImageStatus",
  "backlogReason",
  "whyImageryNeeded",
  "recommendedImageType",
  "recommendedFilename",
  "suggestedAltText",
  "educationalRationale",
  "seoRationale",
  "clinicalImportance",
  "visualComplexity",
  "visualNecessity",
  "seoImportance",
  "educationalValue",
  "trafficPotential",
  "suggestedImagePrompt",
  "productionNotes",
  "matchedInventoryFilename",
  "fallbackSourceUsed",
  "sharedVisualSystemId",
  "duplicateGroupId",
];

export function imageProductionRoadmapToCsv(roadmap: ImageProductionRoadmap): string {
  const header = ROADMAP_CSV_COLUMNS.join(",");
  const lines = roadmap.all.map((row) =>
    ROADMAP_CSV_COLUMNS.map((col) => csvEscape(row[col] as string | number | boolean | null)).join(","),
  );
  return [header, ...lines].join("\n") + "\n";
}

function formatLessonBlock(item: ImageProductionRoadmapItem, index: number): string[] {
  return [
    `### ${index}. ${item.lessonTitle}`,
    "",
    `| Field | Value |`,
    `| --- | --- |`,
    `| **Pathway** | ${item.pathway} (\`${item.pathwayId}\`) |`,
    `| **Slug** | \`${item.slug}\` |`,
    `| **Cluster** | ${item.cluster} |`,
    `| **Status** | \`${item.currentImageStatus}\` (${item.backlogReason}) |`,
    `| **Priority** | **${item.productionPriority}** (score ${item.priorityScore}) |`,
    `| **Image type** | ${item.recommendedImageType.replace(/_/g, " ")} |`,
    `| **Filename** | \`${item.recommendedFilename}\` |`,
    `| **Alt text** | ${item.suggestedAltText} |`,
    `| **Clinical importance** | ${item.clinicalImportance}/100 |`,
    `| **Visual complexity** | ${item.visualComplexity}/100 |`,
    "",
    "**Why imagery is needed**",
    "",
    item.whyImageryNeeded,
    "",
    "**Educational rationale**",
    "",
    item.educationalRationale,
    "",
    "**SEO rationale**",
    "",
    item.seoRationale,
    "",
    "**Production notes**",
    "",
    item.productionNotes,
    "",
    "**AI illustration prompt**",
    "",
    "```text",
    item.suggestedImagePrompt,
    "```",
    "",
    "---",
    "",
  ];
}

export function priorityBacklogMarkdown(
  title: string,
  intro: string,
  items: ImageProductionRoadmapItem[],
  generatedAt: string,
): string {
  const lines = [
    `# ${title}`,
    "",
    `Generated: ${generatedAt}`,
    "",
    intro,
    "",
    `**${items.length}** lessons in this queue.`,
    "",
    "## Style governance",
    "",
    `- ${STYLE_GOVERNANCE.aesthetic}`,
    `- Avoid: ${STYLE_GOVERNANCE.avoid.join("; ")}`,
    "",
  ];

  if (items.length === 0) {
    lines.push("_No lessons in this tier for the current audit run._", "");
    return lines.join("\n");
  }

  items.forEach((item, i) => {
    lines.push(...formatLessonBlock(item, i + 1));
  });

  return lines.join("\n");
}

export function duplicateVisualSystemsMarkdown(
  opportunities: DuplicateImageOpportunity[],
  generatedAt: string,
  proposedBatches: ProposedVisualSystemBatch[] = [],
): string {
  const lines = [
    "# Duplicate / Shared Visual Systems",
    "",
    `Generated: ${generatedAt}`,
    "",
    "Modular illustration systems — build once, label variants across related lessons.",
    "",
    `**${opportunities.length}** reuse groups identified.",
    "",
    "## Quick-win systems (batch these first)",
    "",
  ];

  const bySystem = new Map<string, DuplicateImageOpportunity[]>();
  for (const opp of opportunities) {
    const label = visualSystemLabel(opp.sharedVisualSystemId);
    const list = bySystem.get(label) ?? [];
    list.push(opp);
    bySystem.set(label, list);
  }

  const sortedSystems = [...bySystem.entries()].sort((a, b) => {
    const countA = a[1].reduce((s, o) => s + o.lessonCount, 0);
    const countB = b[1].reduce((s, o) => s + o.lessonCount, 0);
    return countB - countA;
  });

  for (const [label, opps] of sortedSystems) {
    lines.push(`### ${label}`, "");
    for (const opp of opps) {
      lines.push(
        `#### ${opp.duplicateGroupId} — ${opp.lessonCount} lessons`,
        "",
        opp.recommendation,
        "",
        `**Suggested base file:** \`${opp.recommendedFilename}\``,
        opp.matchedObjectKey ? `**Current shared asset:** \`${opp.matchedObjectKey}\`` : "",
        "",
        "**Lessons:**",
        "",
        ...opp.titles.slice(0, 12).map((t, i) => `- ${t} (\`${opp.lessonSlugs[i]}\`)`),
        ...(opp.titles.length > 12 ? [`- _…and ${opp.titles.length - 12} more_`] : []),
        "",
        "---",
        "",
      );
    }
  }

  if (opportunities.length === 0) {
    lines.push("_No duplicate groups with 2+ lessons in this run._", "");
  }

  lines.push("## Proposed modular systems (backlog batching)", "", "Lessons sharing a visual system ID — build master art once.", "");

  for (const batch of proposedBatches.slice(0, 20)) {
    lines.push(
      `### ${batch.label} (${batch.lessonCount} lessons)`,
      "",
      batch.recommendation,
      "",
      ...batch.titles.slice(0, 8).map((t, i) => `- ${t} (\`${batch.slugs[i]}\`)`),
      ...(batch.titles.length > 8 ? [`- _…and ${batch.titles.length - 8} more_`] : []),
      "",
      "---",
      "",
    );
  }

  if (proposedBatches.length === 0) {
    lines.push("_No proposed system batches (need 2+ backlog lessons per system)._", "");
  }

  return lines.join("\n");
}

export function clusterImageQueuesMarkdown(roadmap: ImageProductionRoadmap): string {
  const lines = [
    "# Cluster-Based Image Production Queues",
    "",
    `Generated: ${roadmap.generatedAt}`,
    "",
    "Batch illustration work by clinical cluster for style consistency.",
    "",
  ];

  for (const queue of roadmap.byCluster) {
    if (queue.count === 0) continue;
    lines.push(
      `## ${queue.clusterLabel}`,
      "",
      `**${queue.count}** lessons — ${queue.criticalCount} CRITICAL · ${queue.highCount} HIGH · ${queue.mediumCount} MEDIUM`,
      "",
      "| Priority | Lesson | Slug | Filename | Type |",
      "| --- | --- | --- | --- | --- |",
    );
    for (const item of queue.items.slice(0, 40)) {
      lines.push(
        `| ${item.productionPriority} | ${item.lessonTitle.replace(/\|/g, "/")} | \`${item.slug}\` | \`${item.recommendedFilename}\` | ${item.recommendedImageType.replace(/_/g, " ")} |`,
      );
    }
    if (queue.items.length > 40) {
      lines.push(`| … | _${queue.items.length - 40} more in CSV/JSON_ | | | |`);
    }
    lines.push("", "---", "");
  }

  return lines.join("\n");
}

export function imageProductionRoadmapSummaryMarkdown(roadmap: ImageProductionRoadmap): string {
  const s = roadmap.summary;
  const lines = [
    "# What Images Do We Need to Create Next?",
    "",
    `Generated: ${roadmap.generatedAt}`,
    "",
    "Actionable illustration roadmap from the Lesson Image Coverage Audit.",
    "",
    "## At a glance",
    "",
    "| Queue | Count |",
    "| --- | --- |",
    `| **CRITICAL** (create first) | ${s.criticalCount} |`,
    `| **HIGH** | ${s.highCount} |`,
    `| **MEDIUM** | ${s.mediumCount} |`,
    `| **Total production backlog** | ${s.totalBacklog} |`,
    `| Missing imagery entirely | ${s.missingCount} |`,
    `| Needs upgrade (weak/fallback/low quality) | ${s.upgradeCount} |`,
    "",
    "## Top 25 highest-impact missing visuals",
    "",
  ];

  roadmap.all.slice(0, 25).forEach((item, i) => {
    lines.push(
      `${i + 1}. **${item.lessonTitle}** — \`${item.slug}\` (${item.pathway}) — **${item.productionPriority}** — \`${item.recommendedFilename}\``,
    );
  });

  lines.push(
    "",
    "## Quickest-win reusable systems",
    "",
    ...(s.quickestWinSystems.length
      ? s.quickestWinSystems.map((w) => `- ${w}`)
      : ["- _Run audit after inventory sync for richer system grouping._"]),
    "",
    "## High learner value, no imagery",
    "",
  );

  const missingHigh = roadmap.all
    .filter((i) => i.backlogReason === "missing" && (i.productionPriority === "CRITICAL" || i.productionPriority === "HIGH"))
    .slice(0, 20);

  for (const item of missingHigh) {
    lines.push(`- **${item.lessonTitle}** (\`${item.slug}\`) — ${item.cluster}`);
  }

  lines.push(
    "",
    "## Weak / fallback imagery needing upgrades",
    "",
  );

  const upgrades = roadmap.all
    .filter((i) => i.backlogReason !== "missing")
    .slice(0, 15);

  for (const item of upgrades) {
    lines.push(
      `- **${item.lessonTitle}** — status \`${item.currentImageStatus}\` — ${item.whyImageryNeeded.split(".")[0]}.`,
    );
  }

  lines.push(
    "",
    "## Cluster batches (production order)",
    "",
  );

  for (const q of roadmap.byCluster.slice(0, 12)) {
    lines.push(
      `- **${q.clusterLabel}** — ${q.count} lessons (${q.criticalCount} critical, ${q.highCount} high, ${q.mediumCount} medium)`,
    );
  }

  lines.push(
    "",
    "## Output files",
    "",
    "| File | Purpose |",
    "| --- | --- |",
    "| `critical-images.md` | CRITICAL production queue |",
    "| `high-priority-images.md` | HIGH production queue |",
    "| `medium-priority-images.md` | MEDIUM production queue |",
    "| `duplicate-visual-systems.md` | Shared / modular visual systems |",
    "| `image-production-roadmap.csv` | Spreadsheet for producers |",
    "| `image-production-roadmap.json` | Full structured backlog |",
    "",
    "## Next actions",
    "",
    "1. Produce **CRITICAL** assets first (flagship NCLEX visuals: PE, STEMI, ABG, shock, insulin, ECG).",
    "2. Batch **duplicate-visual-systems** modules before one-off illustrations.",
    "3. Upload to Spaces as `recommendedFilename` (`.webp` / `.avif`), sync inventory, re-run audit.",
    "",
  );

  return lines.join("\n");
}
