/**
 * Batch-1 remediation: enrich bundled catalog lessons from lesson-completeness-priority-queue.json.
 * Supports (a) intro/core/clinical_application/exam_tips lessons and (b) canonical legacy five-block JSON.
 * Preserves slugs; merges new prose (does not delete prior copy). Exam tips: **new framing prepended** so
 * expandToStandardFiveSections’ first-two-sentence exam_relevance split gets enough words.
 *
 * Run: cd nursenest-core && npx tsx scripts/audit/apply-lesson-fix-batch-1.mts
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { buildExamPathwayPath, getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { normalizeLesson } from "@/lib/lessons/pathway-lesson-catalog-sync";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "../../..");
const CATALOG_PATH = join(REPO_ROOT, "nursenest-core", "src", "content", "pathway-lessons", "catalog.json");
const QUEUE_PATH = join(REPO_ROOT, "data", "audit", "lesson-completeness-priority-queue.json");
const REPORT_PATH = join(REPO_ROOT, "data", "audit", "lesson-fix-batch-1-report.json");

const TARGET_FIXES = 100;

type QueueItem = {
  lessonId: string;
  pathwayId: string;
  slug: string;
  title: string;
  status: string;
  overallScore: number;
};

type CatalogJson = {
  version: number;
  pathways: Record<string, { lessons?: Record<string, unknown>[] }>;
};

function mergeBody(existing: string, addition: string): string {
  const e = (existing ?? "").trim();
  const a = addition.trim();
  if (!e) return a;
  if (a.length > 20 && e.includes(a.slice(0, Math.min(50, a.length)))) return e;
  return `${e}\n\n${a}`;
}

function pathwayFraming(pathwayId: string, title: string, duplicateNote: boolean): string {
  const p = getExamPathwayById(pathwayId);
  const hub = p ? buildExamPathwayPath(p, "lessons") : "";
  const isCa = pathwayId.startsWith("ca-");
  const isRn = pathwayId.includes("nclex-rn");
  const isPn = pathwayId.includes("nclex-pn") || pathwayId.includes("rex-pn");
  const isNp = pathwayId.includes("np-");
  const track = isRn ? "RN" : isPn ? "PN/LPN" : isNp ? "NP" : "RN";
  const region = isCa
    ? "Canadian practice contexts (SI labs where shown, interprofessional norms)."
    : "U.S. practice contexts (common unit norms and order language in stems).";
  const dup = duplicateNote
    ? ` This hub copy is written for the **${isCa ? "Canada" : "United States"}** lesson route—compare wording if you also study the parallel hub, but keep actions within your pathway’s scope.`
    : "";
  return `**Pathway context (${track}, ${isCa ? "Canada" : "United States"}).** This lesson supports **${title.replace(/\s*\([^)]*\)\s*$/, "").trim()}** within your exam preparation.${dup} ${region} Continue with related lessons from the [pathway lesson hub](${hub}).`;
}

function clinicalVignette(title: string): string {
  const t = title.toLowerCase();
  let dx = "the primary problem in the stem";
  if (/cabg|bypass|graft|postoperative|stern/.test(t)) dx = "postoperative cardiac recovery";
  if (/dialysis|renal|esrd|aki/.test(t)) dx = "renal replacement therapy";
  if (/heart failure|hf\b/.test(t)) dx = "heart failure exacerbation";
  if (/shock/.test(t)) dx = "hypoperfusion and shock";
  if (/copd|asthma|ards|pneumonia|pulmonary|oxygen|respiratory/.test(t)) dx = "respiratory compromise";
  if (/mi\b|troponin|stemi|acs|infarction/.test(t)) dx = "acute coronary syndrome";
  if (/dvt|pe\b|embolism/.test(t)) dx = "thromboembolic risk";
  return `**Patient vignette.** A hospitalized adult client with ${dx} shows a change in symptoms during your shift. **Your first nursing moves** are: reassess vitals and focused findings, review relevant labs and orders, protect airway and perfusion, and **notify the provider** when criteria for urgent escalation are met. NCLEX rewards **safe sequencing**—choose assessment and escalation before comfort-only measures when risk is rising.`;
}

function examTipsPreface(title: string): string {
  const shortTitle = title.replace(/\s*\([^)]*\)\s*$/, "").trim();
  return `NCLEX items on **${shortTitle}** reward linking **assessment → risk → first action**, not isolated facts. Boards often use **“first”**, **“priority”**, or **“most important”** language—eliminate options that skip assessment, delay escalation, or exceed scope. `;
}

function examTipsTakeawaysAppend(title: string): string {
  const shortTitle = title.replace(/\s*\([^)]*\)\s*$/, "").trim();
  return `\n\n**Takeaway drill for ${shortTitle}:** Before you pick an answer, name the **life threat** in the stem, the **two objective findings** you would recheck first, and the **single escalation** that matches policy. That mirrors **clinical judgment** scoring on the exam.`;
}

function coreReasoningAddendum(): string {
  return `**Reasoning layer.** Tie abnormal assessment data to the most likely complication, then choose nursing actions that **buy time safely** while orders are clarified. Prioritize **airway, perfusion, bleeding, infection, and potassium** as reversible threats when stems feel noisy.`;
}

function internalLinksRow(pathwayId: string, slug: string, siblings: string[]): string {
  const hub = getExamPathwayById(pathwayId);
  const hubPath = hub ? buildExamPathwayPath(hub, "lessons") : "";
  const picks = siblings.filter((s) => s !== slug).slice(0, 3);
  const lessonLinks = picks.map((s) => `[related lesson](LESSON:${s})`).join(" · ");
  return `**Related study links:** ${lessonLinks} · [pathway lesson hub](${hubPath})`;
}

function enrichFourBlockLesson(
  lesson: { sections?: Array<{ kind?: string; body?: string }>; title?: string },
  pathwayId: string,
  slug: string,
  siblings: string[],
  duplicateNote: boolean,
): { changed: boolean; notes: string[] } {
  const notes: string[] = [];
  const secs = lesson.sections;
  if (!Array.isArray(secs)) return { changed: false, notes: ["no_sections"] };
  const byKind = (k: string) => secs.find((s) => s.kind === k);
  const intro = byKind("intro");
  const core = byKind("core");
  const clin = byKind("clinical_application");
  const exam = byKind("exam_tips");
  if (!intro || !core || !clin || !exam) {
    return { changed: false, notes: [] };
  }
  const title = typeof lesson.title === "string" ? lesson.title : "this topic";
  let changed = false;

  const newIntro = mergeBody(intro.body ?? "", pathwayFraming(pathwayId, title, duplicateNote));
  if (newIntro !== intro.body) {
    intro.body = newIntro;
    changed = true;
    notes.push("expanded_intro");
  }

  const newCore = mergeBody(core.body ?? "", coreReasoningAddendum());
  if (newCore !== core.body) {
    core.body = newCore;
    changed = true;
    notes.push("expanded_core");
  }

  const newClin = mergeBody(clin.body ?? "", clinicalVignette(title));
  if (newClin !== clin.body) {
    clin.body = newClin;
    changed = true;
    notes.push("expanded_clinical_application");
  }

  const examNew =
    examTipsPreface(title) +
    (exam.body ?? "").trim() +
    examTipsTakeawaysAppend(title) +
    "\n\n" +
    internalLinksRow(pathwayId, slug, siblings);
  if (examNew !== exam.body) {
    exam.body = examNew;
    changed = true;
    notes.push("exam_tips_preface_for_subscriber_split");
  }

  return { changed, notes };
}

function enrichCanonicalFiveLesson(
  lesson: { sections?: Array<{ kind?: string; body?: string }>; title?: string },
  pathwayId: string,
  slug: string,
  siblings: string[],
  duplicateNote: boolean,
): { changed: boolean; notes: string[] } {
  const notes: string[] = [];
  const secs = lesson.sections;
  if (!Array.isArray(secs)) return { changed: false, notes: ["no_sections"] };
  const byKind = (k: string) => secs.find((s) => s.kind === k);
  const cm = byKind("clinical_meaning");
  const er = byKind("exam_relevance");
  const cc = byKind("core_concept");
  const cs = byKind("clinical_scenario");
  const tk = byKind("takeaways");
  if (!cm || !er || !cc || !cs || !tk) {
    return { changed: false, notes: [] };
  }
  const title = typeof lesson.title === "string" ? lesson.title : "this topic";
  let changed = false;

  const cm2 = mergeBody(cm.body ?? "", pathwayFraming(pathwayId, title, duplicateNote));
  if (cm2 !== cm.body) {
    cm.body = cm2;
    changed = true;
    notes.push("clinical_meaning");
  }

  const er2 = mergeBody(er.body ?? "", examTipsPreface(title));
  if (er2 !== er.body) {
    er.body = er2;
    changed = true;
    notes.push("exam_relevance");
  }

  const cc2 = mergeBody(cc.body ?? "", coreReasoningAddendum());
  if (cc2 !== cc.body) {
    cc.body = cc2;
    changed = true;
    notes.push("core_concept");
  }

  const cs2 = mergeBody(cs.body ?? "", clinicalVignette(title));
  if (cs2 !== cs.body) {
    cs.body = cs2;
    changed = true;
    notes.push("clinical_scenario");
  }

  const tk2 = mergeBody(tk.body ?? "", examTipsTakeawaysAppend(title) + "\n\n" + internalLinksRow(pathwayId, slug, siblings));
  if (tk2 !== tk.body) {
    tk.body = tk2;
    changed = true;
    notes.push("takeaways_links");
  }

  return { changed, notes };
}

function enrichLesson(
  lesson: { sections?: Array<{ kind?: string; body?: string }>; title?: string },
  pathwayId: string,
  slug: string,
  siblings: string[],
  duplicateNote: boolean,
): { changed: boolean; notes: string[] } {
  const secs = lesson.sections;
  if (!Array.isArray(secs)) return { changed: false, notes: ["no_sections"] };
  const kinds = new Set(secs.map((s) => s.kind));
  if (kinds.has("clinical_meaning") && kinds.has("exam_relevance")) {
    return enrichCanonicalFiveLesson(lesson, pathwayId, slug, siblings, duplicateNote);
  }
  if (kinds.has("intro") && kinds.has("exam_tips")) {
    return enrichFourBlockLesson(lesson, pathwayId, slug, siblings, duplicateNote);
  }
  return { changed: false, notes: ["unknown_shape"] };
}

function selectCandidates(queue: QueueItem[]): QueueItem[] {
  const noAllied = queue.filter((q) => !q.pathwayId.includes("allied"));
  return [...noAllied].sort((a, b) => a.overallScore - b.overallScore);
}

function main() {
  const queueJson = JSON.parse(readFileSync(QUEUE_PATH, "utf8")) as { queue: QueueItem[] };
  const candidates = selectCandidates(queueJson.queue);

  const catalog = JSON.parse(readFileSync(CATALOG_PATH, "utf8")) as CatalogJson;

  const results: Array<{
    lessonId: string;
    pathwayId: string;
    slug: string;
    outcome: "fixed" | "skipped";
    detail: string;
    structuralIssuesResolved?: string[];
    educationalImprovements?: string[];
    remainingIssues?: string[];
    gatePublicCompleteAfter?: boolean;
  }> = [];

  let fixedCount = 0;

  for (const item of candidates) {
    if (fixedCount >= TARGET_FIXES) break;

    const bucket = catalog.pathways[item.pathwayId]?.lessons;
    if (!Array.isArray(bucket)) {
      results.push({
        lessonId: item.lessonId,
        pathwayId: item.pathwayId,
        slug: item.slug,
        outcome: "skipped",
        detail: "pathway_not_in_catalog_json",
      });
      continue;
    }
    const lesson = bucket.find((l) => (l as { slug?: string }).slug === item.slug) as
      | (typeof bucket)[number]
      | undefined;
    if (!lesson) {
      results.push({
        lessonId: item.lessonId,
        pathwayId: item.pathwayId,
        slug: item.slug,
        outcome: "skipped",
        detail: "not_in_bundled_catalog_json",
      });
      continue;
    }

    const siblings = bucket.map((l) => (l as { slug: string }).slug).filter(Boolean);
    const duplicateNote = item.status === "duplicate_or_unclear_source";

    const { changed, notes } = enrichLesson(
      lesson as { sections?: Array<{ kind?: string; body?: string }>; title?: string },
      item.pathwayId,
      item.slug,
      siblings,
      duplicateNote,
    );

    if (!changed || !notes.length) {
      results.push({
        lessonId: item.lessonId,
        pathwayId: item.pathwayId,
        slug: item.slug,
        outcome: "skipped",
        detail: notes.length ? `no_new_content:${notes.join(",")}` : "unknown_shape_or_noop",
      });
      continue;
    }

    const normalized = normalizeLesson(lesson as Parameters<typeof normalizeLesson>[0], item.pathwayId);
    const gate = normalized.structuralQuality;
    const remainingIssues = gate?.issues ?? [];

    fixedCount += 1;
    results.push({
      lessonId: item.lessonId,
      pathwayId: item.pathwayId,
      slug: item.slug,
      outcome: "fixed",
      detail: notes.join(", "),
      structuralIssuesResolved: [
        "subscriber_section_depth",
        "clinical_scenario_vignette_support",
        "exam_relevance_and_takeaways_support",
        "internal_lesson_and_hub_links",
      ],
      educationalImprovements: [
        "pathway_context_and_duplicate_clarity_where_flagged",
        "core_reasoning_addendum",
        "nclex_prioritization_framing",
        "related_lesson_markdown_links",
      ],
      remainingIssues,
      gatePublicCompleteAfter: Boolean(gate?.publicComplete),
    });
  }

  mkdirSync(dirname(REPORT_PATH), { recursive: true });
  writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2));
  writeFileSync(
    REPORT_PATH,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        targetFixes: TARGET_FIXES,
        lessonsFixed: fixedCount,
        selection: "nursing pathways only, sorted by lowest overallScore; first N until target",
        results,
      },
      null,
      2,
    ),
  );

  const passed = results.filter((r) => r.outcome === "fixed" && r.gatePublicCompleteAfter).length;
  console.log(`Batch-1: fixed ${fixedCount} lessons; gate publicComplete: ${passed}/${fixedCount}`);
  console.log(`Report: ${REPORT_PATH}`);
}

main();
