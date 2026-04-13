/**
 * Convert legacy `LessonContent` objects (client/src/data/lessons/**) into
 * PathwayLessonSection[] enrichment records ready for catalog.json injection.
 *
 * Usage (as a library):
 *   import { convertLegacyLesson } from './convert-legacy-lesson-to-enrichment';
 *   const enrichmentEntry = convertLegacyLesson({ pathwayId, slug, lesson });
 *
 * Usage (standalone — reads a lesson key from a specified bundle):
 *   npx tsx scripts/convert-legacy-lesson-to-enrichment.ts \
 *     --bundle cardiovascular \
 *     --key "aaa-rupture" \
 *     --pathwayId ca-rn-nclex-rn \
 *     --slug ca-rn-aortic-aneurysm
 *
 * The output is a JSON snippet you can paste into a data/lesson-enrichments/ file.
 */

type QuizQuestion = {
  question: string;
  options: string[];
  correct: number;
  rationale: string | string[];
};

type MedicationEntry =
  | {
      name: string;
      type: string;
      action: string;
      sideEffects: string | string[];
      contra: string | string[];
      pearl: string;
    }
  | { name: string; dose: string; route: string; purpose: string };

type LessonContent = {
  title: string;
  cellular: { title: string; content: string; image?: string } | string;
  riskFactors?: string[];
  diagnostics?: string[];
  management?: string[];
  nursingActions?: string[];
  assessmentFindings?: string[];
  signs?: { left: string[]; right: string[] } | string[];
  medications?: MedicationEntry[];
  pearls?: string[];
  lifespan?: { title: string; content: string };
  quiz?: Array<QuizQuestion | undefined>;
  preTest?: Array<QuizQuestion | undefined>;
  postTest?: Array<QuizQuestion | undefined>;
  image?: string;
};

type EnrichmentLesson = {
  pathwayId: string;
  slug: string;
  previewSectionCount: number;
  sections: object[];
  preTest?: object[];
  postTest?: object[];
};

function bulletList(items: string[]): string {
  return items.map((i) => `- ${i}`).join("\n");
}

function formatMedication(med: MedicationEntry): string {
  if ("dose" in med) {
    return `**${med.name}**: ${med.dose} ${med.route} — ${med.purpose}`;
  }
  const sideEffects = Array.isArray(med.sideEffects)
    ? med.sideEffects.join("; ")
    : med.sideEffects;
  const contra = Array.isArray(med.contra) ? med.contra.join("; ") : med.contra;
  return (
    `**${med.name}** (${med.type}): ${med.action}\n` +
    `  - Side effects: ${sideEffects}\n` +
    `  - Contraindications: ${contra}\n` +
    `  - Clinical pearl: ${med.pearl}`
  );
}

function normalizeQuizQuestion(q: QuizQuestion): object {
  const rationale = Array.isArray(q.rationale) ? q.rationale.join(" ") : q.rationale;
  return {
    question: q.question,
    options: q.options,
    correct: q.correct,
    rationale,
  };
}

export function convertLegacyLesson(opts: {
  pathwayId: string;
  slug: string;
  lesson: LessonContent;
}): EnrichmentLesson {
  const { pathwayId, slug, lesson } = opts;
  const sections: object[] = [];

  // Section 1: Introduction / Overview
  const riskFactorBody = lesson.riskFactors?.length
    ? `\n\n**Risk factors:**\n${bulletList(lesson.riskFactors)}`
    : "";

  sections.push({
    id: "introduction",
    heading: "Overview",
    kind: "introduction",
    body: `**${lesson.title}** is a clinically important condition that nurses must assess, monitor, and prioritize effectively.${riskFactorBody}`,
  });

  // Section 2: Pathophysiology
  const cellular = lesson.cellular;
  const cellularContent = typeof cellular === "string" ? cellular : cellular?.content ?? "";
  const cellularTitle = typeof cellular === "string" ? "Pathophysiology" : (cellular?.title ?? "Pathophysiology");
  if (cellularContent) {
    sections.push({
      id: "pathophysiology_overview",
      heading: "Pathophysiology",
      kind: "pathophysiology_overview",
      body: `**${cellularTitle}**\n\n${cellularContent}`,
    });
  }

  // Section 3: Signs & Symptoms
  const signs = lesson.signs;
  if (signs) {
    let signsBody = "";
    if (Array.isArray(signs)) {
      signsBody = bulletList(signs);
    } else {
      // { left, right } or { classic, warning } etc.
      const leftLabel = "Signs (stable / early)";
      const rightLabel = "Signs (unstable / late)";
      const leftItems = signs.left ?? [];
      const rightItems = signs.right ?? [];
      if (leftItems.length) signsBody += `**${leftLabel}:**\n${bulletList(leftItems)}\n\n`;
      if (rightItems.length) signsBody += `**${rightLabel}:**\n${bulletList(rightItems)}`;
    }
    const assessments = lesson.assessmentFindings;
    if (assessments?.length) {
      signsBody += `\n\n**Assessment findings:**\n${bulletList(assessments)}`;
    }
    if (signsBody) {
      sections.push({
        id: "signs_symptoms",
        heading: "Signs & Symptoms",
        kind: "signs_symptoms",
        body: signsBody.trim(),
      });
    }
  }

  // Section 4: Diagnostics / Labs
  const diagnostics = lesson.diagnostics;
  if (diagnostics?.length) {
    sections.push({
      id: "labs_diagnostics",
      heading: "Diagnostics / Labs",
      kind: "labs_diagnostics",
      body: `**Nursing: anticipate these orders and monitor these results:**\n${bulletList(diagnostics)}`,
    });
  }

  // Section 5: Nursing Assessment & Interventions
  const management = lesson.management ?? [];
  const nursingActions = lesson.nursingActions ?? [];
  const medications = lesson.medications ?? [];

  let interventionsBody = "";
  if (management.length) {
    interventionsBody += `**Management / Interventions:**\n${bulletList(management)}`;
  }
  if (nursingActions.length) {
    if (interventionsBody) interventionsBody += "\n\n";
    interventionsBody += `**Nursing Actions:**\n${bulletList(nursingActions)}`;
  }
  if (medications.length) {
    if (interventionsBody) interventionsBody += "\n\n";
    interventionsBody += `**Medications:**\n${medications.map(formatMedication).join("\n\n")}`;
  }

  if (interventionsBody) {
    sections.push({
      id: "nursing_assessment_interventions",
      heading: "Nursing Responsibilities",
      kind: "nursing_assessment_interventions",
      body: interventionsBody.trim(),
    });
  }

  // Section 6: Clinical Pearls
  const pearls = lesson.pearls;
  if (pearls?.length) {
    sections.push({
      id: "clinical_pearls",
      heading: "Clinical Pearls",
      kind: "clinical_pearls",
      body: bulletList(pearls),
    });
  }

  // Section 7: Lifespan considerations (if present)
  const lifespan = lesson.lifespan;
  if (lifespan?.content) {
    sections.push({
      id: "client_education",
      heading: lifespan.title ?? "Patient Education",
      kind: "client_education",
      body: lifespan.content,
    });
  }

  // Questions
  const quizItems = [
    ...(lesson.preTest ?? []),
    ...(lesson.quiz ?? []),
  ]
    .filter((q): q is QuizQuestion => !!q)
    .map(normalizeQuizQuestion);

  const postTestItems = (lesson.postTest ?? [])
    .filter((q): q is QuizQuestion => !!q)
    .map(normalizeQuizQuestion);

  const result: EnrichmentLesson = {
    pathwayId,
    slug,
    previewSectionCount: Math.min(2, sections.length),
    sections,
  };

  if (quizItems.length) result.preTest = quizItems;
  if (postTestItems.length) result.postTest = postTestItems;

  return result;
}

// ── CLI entrypoint ─────────────────────────────────────────────────────────
// Run: npx tsx scripts/convert-legacy-lesson-to-enrichment.ts --bundle cardiovascular --key "aaa-rupture" --pathwayId ca-rn-nclex-rn --slug ca-rn-aortic-aneurysm

async function main() {
  const args = process.argv.slice(2);
  const getArg = (flag: string) => {
    const idx = args.indexOf(flag);
    return idx !== -1 ? args[idx + 1] : undefined;
  };

  const bundle = getArg("--bundle");
  const key = getArg("--key");
  const pathwayId = getArg("--pathwayId");
  const slug = getArg("--slug");

  if (!bundle || !key || !pathwayId || !slug) {
    console.log(
      "Usage: npx tsx scripts/convert-legacy-lesson-to-enrichment.ts\n" +
      "  --bundle <bundleName>   (e.g. cardiovascular)\n" +
      "  --key    <lessonKey>    (e.g. aaa-rupture)\n" +
      "  --pathwayId <id>        (e.g. ca-rn-nclex-rn)\n" +
      "  --slug   <slug>         (e.g. ca-rn-aortic-aneurysm)\n",
    );
    process.exit(1);
  }

  // Dynamic import of the legacy bundle
  const bundlePath = `${process.cwd()}/../client/src/data/lessons/${bundle}.ts`;
  try {
    const { default: mod, ...named } = await import(bundlePath);
    const allExports: Record<string, unknown> = { ...named, ...(mod ?? {}) };

    // Find the record that likely contains the key
    let lesson: LessonContent | undefined;
    for (const val of Object.values(allExports)) {
      if (val && typeof val === "object" && !Array.isArray(val)) {
        const record = val as Record<string, unknown>;
        if (key in record) {
          lesson = record[key] as LessonContent;
          break;
        }
      }
    }

    if (!lesson) {
      console.error(`Key '${key}' not found in bundle '${bundle}'.`);
      process.exit(1);
    }

    const enrichment = convertLegacyLesson({ pathwayId, slug, lesson });
    console.log(JSON.stringify(enrichment, null, 2));
  } catch (e) {
    console.error(`Failed to load bundle '${bundle}':`, e);
    process.exit(1);
  }
}

main().catch(console.error);
