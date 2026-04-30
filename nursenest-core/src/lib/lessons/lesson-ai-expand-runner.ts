/**
 * CLI runner for RN + RPN/PN catalog lesson AI expansion (shared by `scripts/*-ai-expand-lessons.ts`).
 */
import OpenAI from "openai";
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

import { getLessonOpenAiChatModel } from "@/lib/ai/openai-env";
import {
  RN_EXPAND_REQUIRED_SECTION_KINDS,
  RN_EXPAND_SECTION_WORD_MIN,
  sectionKindsNeedingRegeneration,
  validateExpandedLesson,
  type ExpandedLessonValidation,
  type LessonLike,
} from "@/lib/lessons/rn-expanded-lesson-contract";
import {
  getExpandCatalogFiles,
  LESSON_EXPAND_FLASHCARD_TOPIC_MAP,
  LESSON_EXPAND_PROGRESS_FILENAME,
  LESSON_EXPAND_REQUIRED_KINDS,
  type LessonExpandSectionKind,
  type LessonExpandTier,
  parseTierCliArg,
  pathwayIdsForTiers,
  sectionMetaForTier,
  systemPromptForTier,
  tierForPathwayId,
} from "@/lib/lessons/lesson-ai-expand-shared";

const SAVE_EVERY = 3;
const MAX_CLINICAL_REGEN_ROUNDS = 2;

function countWords(body: string): number {
  return (body || "").trim().split(/\s+/).filter(Boolean).length;
}

function lessonWordCount(sections: { body?: string }[]): number {
  return (sections || []).reduce((n, s) => n + countWords(s?.body || ""), 0);
}

function getThinSections(
  sections: { kind?: string; body?: string }[],
  required: readonly LessonExpandSectionKind[],
): LessonExpandSectionKind[] {
  const map = new Map<string, number>((sections || []).map((s) => [String(s.kind), countWords(s?.body || "")]));
  return required.filter((k) => !map.has(k) || (map.get(k) ?? 0) < RN_EXPAND_SECTION_WORD_MIN);
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/** Satisfies {@link validateExpandedLesson} `LessonLike` (catalog JSON uses loose section rows). */
function lessonForValidation(lesson: {
  slug: string;
  title: string;
  sections?: unknown;
  linked_flashcard_prompts?: unknown;
}): LessonLike {
  return {
    slug: lesson.slug,
    title: lesson.title,
    sections: (lesson.sections ?? []) as LessonLike["sections"],
    linked_flashcard_prompts: lesson.linked_flashcard_prompts,
  };
}

interface Progress {
  done: string[];
  failed: string[];
}

function loadProgress(progressPath: string, pkgRoot: string): Progress {
  try {
    if (fs.existsSync(progressPath)) return JSON.parse(fs.readFileSync(progressPath, "utf8")) as Progress;
  } catch {
    /* ignore */
  }
  const legacyPath = path.join(pkgRoot, "tmp", "rn-expand-progress.json");
  try {
    if (fs.existsSync(legacyPath)) {
      const legacy = JSON.parse(fs.readFileSync(legacyPath, "utf8")) as Progress;
      if (legacy?.done?.length || legacy?.failed?.length) {
        console.log(`[progress] Migrated keys from legacy tmp/rn-expand-progress.json → ${path.basename(progressPath)}`);
        return {
          done: [...(legacy.done || [])],
          failed: [...(legacy.failed || [])],
        };
      }
    }
  } catch {
    /* ignore */
  }
  return { done: [], failed: [] };
}

function saveProgress(progressPath: string, p: Progress): void {
  fs.mkdirSync(path.dirname(progressPath), { recursive: true });
  fs.writeFileSync(progressPath, JSON.stringify(p, null, 2));
}

function buildRepairContext(kind: LessonExpandSectionKind, v: ExpandedLessonValidation): string {
  const lines: string[] = [];
  if (v.thinSections.some((t) => t.kind === kind)) {
    lines.push(`Section is below ${RN_EXPAND_SECTION_WORD_MIN} words — expand substantially.`);
  }
  if (v.missingSections.includes(kind)) {
    lines.push("Section was missing or empty — write full clinical content.");
  }
  for (const m of v.missingClinicalRequirements) {
    if (m.kind === kind) lines.push(`Missing clinical requirement: ${m.requirement}`);
  }
  return lines.join("\n");
}

async function generateSection(
  openai: OpenAI,
  title: string,
  bodySystem: string,
  kind: LessonExpandSectionKind,
  existingBody: string,
  region: "ca" | "us",
  tier: LessonExpandTier,
  repairContext?: string,
): Promise<string | null> {
  const meta = sectionMetaForTier(tier)[kind];
  const regionNote =
    region === "ca"
      ? " (Canadian context: CNA standards, Canadian terminology where natural, provincial scope for practical nursing)"
      : " (US context: state Nurse Practice Act boundaries for LPN/LVN where applicable, NCLEX-PN style for PN tier)";
  const repairBlock = repairContext?.trim()
    ? `\n\n--- VALIDATION FAILURES (fix all; preserve topic specificity; no headings) ---\n${repairContext.trim()}`
    : "";
  const userMsg = `Topic: **${title}** — Body System: ${bodySystem}${regionNote}
Section: ${meta.heading}
Task: ${meta.prompt}${existingBody.trim() ? `\n\nExisting thin content (expand it — do not copy verbatim):\n${existingBody.slice(0, 300)}` : ""}${repairBlock}`;

  const systemPrompt = systemPromptForTier(tier);

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const resp = await openai.chat.completions.create({
        model: getLessonOpenAiChatModel(),
        max_tokens: 900,
        temperature: 0.25,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMsg },
        ],
      });
      const content = (resp.choices[0]?.message?.content || "").trim();
      if (content && countWords(content) >= 100) return content;
      console.log(`    [attempt ${attempt}] Short response (${countWords(content)}w), retrying...`);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      if (attempt < 3) {
        await sleep(2000 * attempt);
        continue;
      }
      console.error(`    API error: ${msg}`);
      return null;
    }
  }
  return null;
}

function buildFlashcardPrompts(title: string): string[] {
  return LESSON_EXPAND_FLASHCARD_TOPIC_MAP.map((t) => t.prompt.replace("{title}", title));
}

function syncLinkedFlashcardSection(lesson: { sections?: unknown[] }, prompts: string[]): void {
  const body = prompts.map((p, i) => `${i + 1}. ${p}`).join("\n");
  const sections = [...((lesson.sections as object[]) || [])];
  const idx = sections.findIndex((s: { kind?: string }) => String((s as { kind?: string }).kind) === "linked_flashcard_prompts");
  const row = {
    id: "linked_flashcard_prompts",
    heading: "Linked flashcard prompts",
    kind: "linked_flashcard_prompts",
    body,
  };
  if (idx >= 0) sections[idx] = { ...(sections[idx] as object), ...row };
  else sections.push(row);
  lesson.sections = sections;
}

function logLessonOutcome(
  pathway: string,
  lesson: { slug: string; title: string },
  startWc: number,
  generatedSectionCount: number,
  v: ExpandedLessonValidation,
): void {
  console.log(
    JSON.stringify({
      pathway,
      slug: lesson.slug,
      title: lesson.title,
      startingWordCount: startWc,
      generatedSectionCount,
      finalWordCount: v.totalWords,
      validationPass: v.pass,
      missingSections: v.missingSections,
      thinSections: v.thinSections,
      missingClinicalRequirementsCount: v.missingClinicalRequirements.length,
      flashcardPromptErrorsCount: v.flashcardPromptErrors.length,
    }),
  );
}

export type LessonAiExpandRunnerOptions = {
  /** When argv has no --tier, use these tiers. */
  defaultTiers: Set<LessonExpandTier>;
};

export async function runLessonAiExpandMain(
  argv: string[],
  options: LessonAiExpandRunnerOptions,
): Promise<void> {
  const tiers = parseTierCliArg(argv, options.defaultTiers);
  const pathwaySet = pathwayIdsForTiers(tiers);
  const DRY_RUN = argv.includes("--dry-run");
  const FORCE = argv.includes("--force");
  const SLUG_FILTER = (() => {
    const i = argv.indexOf("--slug");
    return i !== -1 ? argv[i + 1] : null;
  })();
  const LIMIT = (() => {
    const i = argv.indexOf("--limit");
    return i !== -1 ? parseInt(argv[i + 1]!, 10) : Infinity;
  })();

  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  /** This file lives at `src/lib/lessons/` — package root is three levels up. */
  const pkgRoot = path.resolve(scriptDir, "../../..");
  const catalogDir = path.join(pkgRoot, "src/content/pathway-lessons");
  const progressPath = path.join(pkgRoot, "tmp", LESSON_EXPAND_PROGRESS_FILENAME);

  const model = getLessonOpenAiChatModel();
  console.log(`Model: ${model}`);
  console.log("═══════════════════════════════════════════════════════");
  console.log(" Nursing clinical expansion (RN + RPN/PN) — validate / retry / gate");
  console.log("═══════════════════════════════════════════════════════");
  console.log(`  Tiers:      ${[...tiers].sort().join(", ")}`);
  console.log(`  Pathways:   ${[...pathwaySet].sort().join(", ")}`);
  console.log(`  Dry run:    ${DRY_RUN}`);
  console.log(`  Force:      ${FORCE}`);
  console.log(`  Slug:       ${SLUG_FILTER || "(all in scope)"}`);
  console.log(`  Limit:      ${Number.isFinite(LIMIT) ? LIMIT : "none"}`);
  console.log(`  Progress:   ${progressPath}`);
  console.log("───────────────────────────────────────────────────────\n");

  if (!process.env.AI_INTEGRATIONS_OPENAI_API_KEY && !DRY_RUN) {
    console.error("ERROR: AI_INTEGRATIONS_OPENAI_API_KEY not set.");
    process.exit(1);
  }

  const catalogFiles = getExpandCatalogFiles(catalogDir, pathwaySet);
  console.log(`  Catalog files touching selected pathways: ${catalogFiles.length}`);
  catalogFiles.forEach((f) => console.log(`    ${f.fileName}`));
  console.log("");

  const progress = loadProgress(progressPath, pkgRoot);
  const openai = DRY_RUN
    ? (null as unknown as OpenAI)
    : new OpenAI({
        apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
        baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
      });

  let totalExpanded = 0;
  let totalSections = 0;
  let totalSkipped = 0;
  let totalFailed = 0;
  let count = 0;
  let rnScanned = 0;
  let rpnScanned = 0;
  const REQUIRED_ORDER = [...RN_EXPAND_REQUIRED_SECTION_KINDS] as readonly string[];

  for (const { filePath, fileName } of catalogFiles) {
    if (count >= LIMIT) break;

    const catalog = JSON.parse(fs.readFileSync(filePath, "utf8")) as {
      pathways: Record<string, { lessons: object[] } | object[]>;
    };
    let fileDirty = false;

    console.log(`\n━━━ ${fileName} ━━━`);

    for (const [pwKey, pwValRaw] of Object.entries(catalog.pathways || {})) {
      if (!pathwaySet.has(pwKey)) continue;
      if (count >= LIMIT) break;

      const tier = tierForPathwayId(pwKey);
      if (!tier) continue;

      const region: "ca" | "us" = pwKey.startsWith("ca-") ? "ca" : "us";
      const lessonList: object[] = Array.isArray(pwValRaw)
        ? pwValRaw
        : (pwValRaw as { lessons?: object[] }).lessons || [];

      for (const lesson of lessonList) {
        if (SLUG_FILTER && (lesson as { slug?: string }).slug !== SLUG_FILTER) continue;

        const L = lesson as {
          slug: string;
          title: string;
          bodySystem?: string;
          sections?: { kind?: string; body?: string; heading?: string; id?: string }[];
          linked_flashcard_prompts?: string[];
        };
        const sections = L.sections || [];
        if (tier === "rn") rnScanned += 1;
        else rpnScanned += 1;

        const startWc = lessonWordCount(sections);
        const key = `${pwKey}:${L.slug}`;

        const initialValidation = validateExpandedLesson(lessonForValidation(L));
        if (initialValidation.pass && !FORCE && !SLUG_FILTER) {
          totalSkipped++;
          continue;
        }
        if (progress.done.includes(key) && !FORCE && !SLUG_FILTER) {
          if (initialValidation.pass) {
            totalSkipped++;
            continue;
          }
          progress.done = progress.done.filter((x) => x !== key);
        }

        if (count >= LIMIT) break;
        count++;

        const thinInitial = getThinSections(sections, LESSON_EXPAND_REQUIRED_KINDS);
        console.log(`\n[${count}] [${pwKey}] [${tier}] ${L.slug}`);
        console.log(`  "${L.title}" | ${L.bodySystem || "?"} | ${startWc}w | thin: ${thinInitial.join(", ") || "none"}`);

        if (DRY_RUN) {
          console.log(`  [DRY] Would process; pass=${initialValidation.pass}, missing=${initialValidation.missingSections.length}`);
          totalSkipped++;
          continue;
        }

        const sectionMap = new Map<string, { kind?: string; body?: string; heading?: string; id?: string }>(
          sections.map((s) => [String(s.kind), { ...s }]),
        );
        let generated = 0;
        let failedGen = 0;
        const metaByKind = sectionMetaForTier(tier);

        for (const kind of thinInitial) {
          const existing = sectionMap.get(kind)?.body || "";
          const meta = metaByKind[kind];
          process.stdout.write(`  ↳ [${kind}] generating...`);
          const body = await generateSection(openai, L.title, L.bodySystem || "General", kind, existing, region, tier);
          if (!body) {
            console.log(" ✗ failed");
            failedGen++;
            continue;
          }
          console.log(` ✓ ${countWords(body)}w`);
          sectionMap.set(kind, { id: kind, heading: meta.heading, kind, body });
          generated++;
          totalSections++;
        }

        const newSections: typeof sections = [];
        for (const k of REQUIRED_ORDER) {
          if (sectionMap.has(k)) newSections.push(sectionMap.get(k)!);
        }
        for (const [k, val] of sectionMap) {
          if (!REQUIRED_ORDER.includes(k)) newSections.push(val);
        }
        L.sections = newSections;

        L.linked_flashcard_prompts = buildFlashcardPrompts(L.title);
        syncLinkedFlashcardSection(L, L.linked_flashcard_prompts);

        let v = validateExpandedLesson(lessonForValidation(L));
        for (let regenRound = 0; regenRound < MAX_CLINICAL_REGEN_ROUNDS && !v.pass; regenRound++) {
          if (v.flashcardPromptCount < 8 || v.flashcardPromptErrors.length > 0) {
            L.linked_flashcard_prompts = buildFlashcardPrompts(L.title);
            syncLinkedFlashcardSection(L, L.linked_flashcard_prompts);
          }
          v = validateExpandedLesson(lessonForValidation(L));
          if (v.pass) break;

          const sm = new Map<string, { kind?: string; body?: string; heading?: string; id?: string }>(
            (L.sections || []).map((s) => [String(s.kind), { ...s }]),
          );
          const targetKinds = sectionKindsNeedingRegeneration(v);
          if (targetKinds.length === 0) break;

          for (const kind of targetKinds) {
            const existing = sm.get(kind)?.body || "";
            const meta = metaByKind[kind];
            const ctx = buildRepairContext(kind, v);
            process.stdout.write(`  ↳ [repair ${regenRound + 1}] [${kind}] ...`);
            const body = await generateSection(openai, L.title, L.bodySystem || "General", kind, existing, region, tier, ctx);
            if (!body) {
              console.log(" ✗");
              failedGen++;
            } else {
              console.log(` ✓ ${countWords(body)}w`);
              sm.set(kind, { id: kind, heading: meta.heading, kind, body });
              generated++;
              totalSections++;
            }
          }
          const rebuilt: typeof sections = [];
          for (const k of REQUIRED_ORDER) {
            if (sm.has(k)) rebuilt.push(sm.get(k)!);
          }
          for (const [k, row] of sm) {
            if (!REQUIRED_ORDER.includes(k)) rebuilt.push(row);
          }
          L.sections = rebuilt;
          v = validateExpandedLesson(lessonForValidation(L));
        }

        logLessonOutcome(pwKey, L, startWc, generated, v);
        fileDirty = true;

        if (v.pass) {
          totalExpanded++;
          if (!progress.done.includes(key)) progress.done.push(key);
          progress.failed = progress.failed.filter((s) => s !== key);
        } else {
          totalFailed++;
          if (!progress.failed.includes(key)) progress.failed.push(key);
          console.error(
            JSON.stringify({
              event: "lesson_expand_validation_failed",
              pathway: pwKey,
              tier,
              slug: L.slug,
              missingSections: v.missingSections,
              thinSections: v.thinSections,
              missingClinicalCount: v.missingClinicalRequirements.length,
              flashcardErrors: v.flashcardPromptErrors.length,
            }),
          );
        }

        if ((totalExpanded + totalFailed) % SAVE_EVERY === 0) {
          fs.writeFileSync(filePath, JSON.stringify(catalog, null, 2));
          saveProgress(progressPath, progress);
          console.log("  [checkpoint saved]");
        }
      }
    }

    if (!DRY_RUN && fileDirty) {
      fs.writeFileSync(filePath, JSON.stringify(catalog, null, 2));
      saveProgress(progressPath, progress);
      console.log(`\n  Saved: ${fileName}`);
    }
  }

  console.log("\n═══════════════════════════════════════════════════════");
  console.log(
    ` Summary | RN lessons scanned: ${rnScanned} | RPN/PN lessons scanned: ${rpnScanned} | expanded(valid): ${totalExpanded} | sections written: ${totalSections} | skipped: ${totalSkipped} | failed validation: ${totalFailed}`,
  );
  console.log("═══════════════════════════════════════════════════════\n");
}
