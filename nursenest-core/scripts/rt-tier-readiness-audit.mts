#!/usr/bin/env npx tsx
/**
 * Respiratory therapy tier readiness — inventory markdown for docs/reports/rt-tier-readiness-audit.md
 *
 *   cd nursenest-core && npm run report:rt-tier-audit
 *
 * Requires DATABASE_URL for DB sections; otherwise writes a stub with registry-only facts.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Prisma } from "@prisma/client";

import { US_ALLIED_CORE_PATHWAY_ID } from "@/lib/allied/allied-hub-program-model";
import { getAlliedProfessionByProfessionKey } from "@/lib/allied/allied-professions-registry";
import { buildAlliedOccupationMarketingHubPath } from "@/lib/allied/allied-global-hub-path";
import { alliedHubCatSurfaceUnlocked } from "@/lib/marketing/allied-hub-premium-module-policy";
import { respiratoryTherapyExamQuestionPoolWhere } from "@/lib/allied/allied-respiratory-pool-scope";
import { isCompleteCatQuestionRow } from "@/lib/practice-tests/cat-question-completeness";
import { ALLIED_LEGACY_EXAM_QUESTION_CAREER_TYPES } from "@/lib/allied/allied-exam-question-scope";

const coreRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outMd = path.join(coreRoot, "docs", "reports", "rt-tier-readiness-audit.md");

const CATEGORY_QUERIES: { label: string; where: Prisma.ExamQuestionWhereInput }[] = [
  {
    label: "Airway management",
    where: {
      OR: [
        { stem: { contains: "airway", mode: "insensitive" } },
        { topic: { contains: "airway", mode: "insensitive" } },
        { bodySystem: { contains: "respiratory", mode: "insensitive" } },
        { tags: { hasSome: ["airway", "ett", "intubation"] } },
      ],
    },
  },
  {
    label: "Oxygen therapy",
    where: {
      OR: [
        { stem: { contains: "oxygen", mode: "insensitive" } },
        { topic: { contains: "oxygen", mode: "insensitive" } },
        { tags: { hasSome: ["oxygen-therapy", "oxygen-delivery", "fio2"] } },
      ],
    },
  },
  {
    label: "Ventilation / mechanical ventilation",
    where: {
      OR: [
        { stem: { contains: "ventilat", mode: "insensitive" } },
        { topic: { contains: "ventilat", mode: "insensitive" } },
        { tags: { hasSome: ["ventilator", "mechanical-ventilation"] } },
      ],
    },
  },
  {
    label: "ABGs / acid-base",
    where: {
      OR: [
        { stem: { contains: "ABG", mode: "insensitive" } },
        { stem: { contains: "arterial blood", mode: "insensitive" } },
        { stem: { contains: "acid-base", mode: "insensitive" } },
        { tags: { hasSome: ["abg", "acid-base"] } },
      ],
    },
  },
  {
    label: "Pulmonary diagnostics",
    where: {
      OR: [
        { stem: { contains: "spirom", mode: "insensitive" } },
        { stem: { contains: "PFT", mode: "insensitive" } },
        { topic: { contains: "diagnostic", mode: "insensitive" } },
      ],
    },
  },
  {
    label: "Pharmacology (respiratory meds)",
    where: {
      OR: [
        { stem: { contains: "bronchodilat", mode: "insensitive" } },
        { stem: { contains: "albuterol", mode: "insensitive" } },
        { stem: { contains: "inhaled", mode: "insensitive" } },
        { tags: { hasSome: ["pharmacology"] } },
      ],
    },
  },
  {
    label: "Neonatal / pediatric respiratory",
    where: {
      OR: [
        { stem: { contains: "neonatal", mode: "insensitive" } },
        { stem: { contains: "NICU", mode: "insensitive" } },
        { stem: { contains: "pediatric", mode: "insensitive" } },
      ],
    },
  },
  {
    label: "Emergency / critical care",
    where: {
      OR: [
        { stem: { contains: "ARDS", mode: "insensitive" } },
        { stem: { contains: "critical", mode: "insensitive" } },
        { stem: { contains: "emergency", mode: "insensitive" } },
      ],
    },
  },
  {
    label: "Ethics / safety / infection control",
    where: {
      OR: [
        { stem: { contains: "infection", mode: "insensitive" } },
        { stem: { contains: "PPE", mode: "insensitive" } },
        { stem: { contains: "isolation", mode: "insensitive" } },
        { tags: { hasSome: ["infection-control"] } },
      ],
    },
  },
];

async function main(): Promise<void> {
  mkdirSync(path.dirname(outMd), { recursive: true });

  const prof = getAlliedProfessionByProfessionKey("respiratory");
  const lines: string[] = [];

  lines.push("# Respiratory therapy (RT / RRT) tier — readiness audit");
  lines.push("");
  lines.push(`_Generated: ${new Date().toISOString()}_`);
  lines.push("");

  lines.push("## Tier registration (product)");
  lines.push("");
  lines.push(
    "- **Billing tier:** `TierCode.ALLIED` — RT is **not** a separate Stripe tier; subscribers use the **Allied** plan with profession context `respiratory` (`User.alliedProfessionKey`).",
  );
  lines.push(`- **Canonical pathway id:** \`${US_ALLIED_CORE_PATHWAY_ID}\` (US allied core hub)`);
  lines.push("- **Exam column scope:** `exam_questions.exam` ∈ expanded keys from pathway `contentExamKeys` (`ALLIED` + publish allowlist variants).");
  lines.push(
    `- **Profession hub (marketing):** \`${buildAlliedOccupationMarketingHubPath("respiratory")}\` — **must not** redirect to RN; legacy country-prefixed URLs may 301 to \`/allied/allied-health/*\` only.`,
  );
  lines.push(
    `- **Legacy career types mapped to DB (\`careerType\`):** \`${(ALLIED_LEGACY_EXAM_QUESTION_CAREER_TYPES.respiratory ?? []).join(", ")}\` plus tags \`profession:respiratory\` / \`alliedProfession:respiratory\`.`,
  );
  lines.push(
    `- **Readiness engine:** \`pathway-readiness-config.ts\` sets **SIMULATION** for \`us-allied-core\` (not NCLEX CAT readiness branding). Learners may still start **adaptive practice sessions** from \`/app/practice-tests?cat=1\` when entitled.`,
  );
  lines.push(
    `- **CAT marketing card:** ${alliedHubCatSurfaceUnlocked("respiratory") ? "unlocked on allied hubs" : "locked / de-emphasized"} (\`alliedHubCatSurfaceUnlocked\`).`,
  );
  lines.push("");

  if (!prof) {
    lines.push("## Registry error");
    lines.push("");
    lines.push("`getAlliedProfessionByProfessionKey(\"respiratory\")` returned null — fix allied-professions-registry.");
    lines.push("");
    writeFileSync(outMd, lines.join("\n"), "utf8");
    console.warn("[rt-tier-readiness-audit] missing respiratory profession in registry");
    return;
  }

  lines.push("## Profession registry row");
  lines.push("");
  lines.push("| Field | Value |");
  lines.push("|-------|-------|");
  lines.push(`| professionKey | \`${prof.professionKey}\` |`);
  lines.push(`| pathwayId | \`${prof.pathwayId}\` |`);
  lines.push(`| segment | \`${prof.segment}\` |`);
  lines.push(`| topicSlugsIn | ${prof.topicSlugsIn?.length ? prof.topicSlugsIn.map((s) => `\`${s}\``).join(", ") : "_(none — lesson counts rely on alliedProfessionKey or fallback)_"} |`);
  lines.push("");

  if (!process.env.DATABASE_URL?.trim()) {
    lines.push("## Database inventory");
    lines.push("");
    lines.push("`DATABASE_URL` not set — re-run with DB configured for lesson / flashcard / question counts.");
    lines.push("");
    writeFileSync(outMd, lines.join("\n"), "utf8");
    console.warn("[rt-tier-readiness-audit] wrote stub (no DATABASE_URL)");
    return;
  }

  const { prisma } = await import("@/lib/db");
  const pool = respiratoryTherapyExamQuestionPoolWhere();

  if (!pool) {
    lines.push("## Pool scope error");
    lines.push("");
    lines.push("`respiratoryTherapyExamQuestionPoolWhere()` returned null — check pathway registry + allied legacy career map.");
    lines.push("");
  } else {
    const publishedWhere = { ...pool, status: "published" as const };

    const [totalPub, draftish, byType, topicRows] = await Promise.all([
      prisma.examQuestion.count({ where: publishedWhere }),
      prisma.examQuestion.count({
        where: {
          AND: [
            pool,
            {
              OR: [{ status: { not: "published" } }, { status: null }],
            },
          ],
        },
      }),
      prisma.examQuestion.groupBy({
        by: ["questionType"],
        where: publishedWhere,
        _count: { _all: true },
      }),
      prisma.examQuestion.groupBy({
        by: ["topic"],
        where: publishedWhere,
        _count: { _all: true },
      }),
    ]);

    const adaptiveEligible = await prisma.examQuestion.count({
      where: { ...publishedWhere, isAdaptiveEligible: true },
    });

    /** CAT-complete rows (same completeness gate as {@link fetchCatPracticePool}). */
    let catComplete = 0;
    let scanned = 0;
    const MAX_SCAN = 12_000;
    let cursor: string | undefined;
    while (scanned < MAX_SCAN) {
      const batch = await prisma.examQuestion.findMany({
        where: publishedWhere,
        select: {
          id: true,
          questionType: true,
          stem: true,
          options: true,
          correctAnswer: true,
          rationale: true,
        },
        orderBy: { id: "asc" },
        take: 400,
        ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      });
      if (batch.length === 0) break;
      for (const r of batch) {
        if (
          isCompleteCatQuestionRow({
            questionType: r.questionType,
            stem: r.stem,
            options: r.options,
            correctAnswer: r.correctAnswer,
            rationale: r.rationale,
          })
        ) {
          catComplete += 1;
        }
      }
      scanned += batch.length;
      cursor = batch[batch.length - 1]!.id;
      if (batch.length < 400) break;
    }

    lines.push("## Exam question bank (US allied + respiratory scope)");
    lines.push("");
    lines.push(
      "> Scope = `questionBankWhereForProfile(US, ALLIED)` ∩ `exam ∈ expanded(ALLIED)` ∩ non-ECG ∩ general study-bank gates ∩ (`careerType ∈ {rrt}` OR profession tags). Matches allied hub inventory ∩ respiratory.",
    );
    lines.push("");
    lines.push("| Metric | Count |");
    lines.push("|--------|------:|");
    lines.push(`| Published | ${totalPub} |`);
    lines.push(`| Non-published / null status (in scope) | ${draftish} |`);
    lines.push(`| isAdaptiveEligible (published) | ${adaptiveEligible} |`);
    lines.push(`| CAT-complete rows (sample scan, max ${MAX_SCAN}) | ${catComplete} |`);
    lines.push("");

    lines.push("### Question types (published)");
    lines.push("");
    lines.push("| question_type | count |");
    lines.push("|---------------|------:|");
    for (const row of byType.sort((a, b) => (b._count._all ?? 0) - (a._count._all ?? 0))) {
      lines.push(`| ${row.questionType} | ${row._count._all} |`);
    }
    lines.push("");

    lines.push("### Topics (top 40, published)");
    lines.push("");
    lines.push("| topic | count |");
    lines.push("|-------|------:|");
    const topicsSorted = [...topicRows].sort((a, b) => (b._count._all ?? 0) - (a._count._all ?? 0)).slice(0, 40);
    for (const row of topicsSorted) {
      lines.push(`| ${row.topic ?? "(null)"} | ${row._count._all} |`);
    }
    lines.push("");

    lines.push("### Critical category coverage (published RT pool ∩ heuristic OR)");
    lines.push("");
    lines.push("_Heuristic keyword/tag overlap — for prioritizing imports, not clinical completeness._");
    lines.push("");
    lines.push("| Category | Matching published rows |");
    lines.push("|----------|------------------------:|");
    for (const cat of CATEGORY_QUERIES) {
      const n = await prisma.examQuestion.count({
        where: { AND: [publishedWhere, cat.where] },
      });
      lines.push(`| ${cat.label} | ${n} |`);
    }
    lines.push("");
  }

  const lessonWhere: Prisma.PathwayLessonWhereInput = {
    status: "PUBLISHED",
    OR: [{ alliedProfessionKey: "respiratory" }, { pathwayId: US_ALLIED_CORE_PATHWAY_ID, topicSlug: { in: prof.topicSlugsIn ?? [] } }],
  };

  let lessonCount = 0;
  let lessonCountFallbackNote: string | null = null;
  try {
    lessonCount = await prisma.pathwayLesson.count({ where: lessonWhere });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    const fallback: Prisma.PathwayLessonWhereInput = {
      status: "PUBLISHED",
      pathwayId: US_ALLIED_CORE_PATHWAY_ID,
      topicSlug: { in: prof.topicSlugsIn ?? [] },
    };
    if (!msg.includes("allied_profession_key")) throw e;
    lessonCount = await prisma.pathwayLesson.count({ where: fallback }).catch(() => -1);
    lessonCountFallbackNote =
      "Note: `pathway_lessons.allied_profession_key` missing in this DB — lesson count uses **topicSlug** fallback only.";
  }

  const flashByTag = await prisma.flashcard.count({
    where: {
      status: "PUBLISHED",
      tier: "ALLIED",
      deck: {
        pathwayId: { in: ["us-allied-core", "ca-allied-core"] },
        tags: { some: { tag: { slug: "respiratory" } } },
      },
    },
  });

  lines.push("## Lessons & flashcards");
  lines.push("");
  if (lessonCountFallbackNote) {
    lines.push(`> _${lessonCountFallbackNote}_`);
    lines.push("");
  }
  lines.push("| Surface | Count | Notes |");
  lines.push("|--------|------:|-------|");
  lines.push(`| Pathway lessons (published, alliedProfessionKey **or** topic fallback) | ${lessonCount} | See registry \`topicSlugsIn\` |`);
  lines.push(`| Flashcards (ALLIED decks tagged \`respiratory\`) | ${flashByTag} | Does not include examQuestionId-linked cards unless counted separately |`);
  lines.push("");

  await prisma.$disconnect();

  lines.push("## Verification commands");
  lines.push("");
  lines.push("```bash");
  lines.push("npm run typecheck:critical");
  lines.push("npm run test:homepage");
  lines.push("npm run sitemap:validate");
  lines.push("npx playwright test tests/e2e/rt/rt-tier-smoke.spec.ts");
  lines.push("npm run report:rt-tier-audit");
  lines.push("```");
  lines.push("");

  writeFileSync(outMd, lines.join("\n"), "utf8");
  console.log(`[rt-tier-readiness-audit] wrote ${outMd}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
