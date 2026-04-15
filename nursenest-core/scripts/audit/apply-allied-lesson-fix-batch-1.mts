/**
 * Allied batch-1: profession-scoped copy fixes + internal study links + relatedLessonRefs on
 * `allied-bundled-catalog.json`. Does not touch nursing pathways or main catalog.json.
 *
 * Run: cd nursenest-core && npx tsx scripts/audit/apply-allied-lesson-fix-batch-1.mts
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { buildExamPathwayPath, getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { normalizeLesson } from "@/lib/lessons/pathway-lesson-catalog-sync";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "../../..");
const ALLIED_CATALOG_PATH = join(
  REPO_ROOT,
  "nursenest-core",
  "src",
  "content",
  "pathway-lessons",
  "allied-bundled-catalog.json",
);
const REPORT_PATH = join(REPO_ROOT, "data", "audit", "allied-lesson-fix-batch-1-report.json");

const TARGET_PATHWAYS = ["us-allied-core", "ca-allied-core"] as const;
const BATCH_CAP = 100;

type AlliedCatalog = {
  version: number;
  pathways: Record<string, Array<Record<string, unknown>>>;
};

type LessonJson = {
  slug: string;
  title?: string;
  pathwayId?: string;
  sections?: Array<{ kind?: string; heading?: string; body?: string }>;
  relatedLessonRefs?: Array<{ slug: string; titleHint?: string }>;
};

/** One sentence: scope-safe, not NCLEX-nursing “first move” boilerplate. */
const ALLIED_VIGNETTE_BY_SLUG: Record<string, string> = {
  "allied-human-anatomy":
    "**Clinical application.** Use anatomy as a shared map when you correlate symptoms, imaging, and procedural landmarks—especially when several disciplines (therapy, imaging, nursing) are interpreting the same findings.",
  "allied-human-physiology":
    "**Clinical application.** Expect physiology questions to show up as trends: vitals, labs, and device data that must be reconciled with symptoms before you act or escalate.",
  "allied-medical-terminology":
    "**Clinical application.** Terminology errors propagate into orders, labels, and billing—treat precise language as a safety layer, not paperwork trivia.",
  "allied-pharmacology-basics":
    "**Clinical application.** Medication questions often hinge on mechanism + organ vulnerability; connect drug class to the monitoring parameter that catches harm early.",
  "allied-patient-assessment":
    "**Clinical application.** Frame assessment as structured data collection plus change detection—your discipline decides which subset you own, but escalation rules are shared.",
  "allied-infection-control":
    "**Clinical application.** Infection control is operational: PPE, device handling, and transmission routes must match the task you are performing in real time.",
  "allied-medical-ethics":
    "**Clinical application.** Ethics cases usually force a tradeoff between autonomy, safety, and fairness—name the conflict explicitly before choosing a next step.",
  "allied-clinical-documentation":
    "**Clinical application.** Documentation should answer who did what, when, and why it mattered; vague charting creates downstream clinical and legal ambiguity.",
  "allied-vital-signs":
    "**Clinical application.** Treat trends and context (baseline, activity, medications) as part of the “vital sign”—single snapshots mislead without trajectory.",
  "allied-emergency-response":
    "**Clinical application.** Emergencies reward role clarity: airway/perfusion threats get rapid escalation while you operate within scope and local protocol.",
  "allied-lab-values":
    "**Clinical application.** Lab interpretation starts with pre-analytical quality (timing, hemolysis, fasting) and ends with whether the value changes management today.",
  "allied-imaging-basics":
    "**Clinical application.** Imaging choices trade resolution, speed, radiation, and access—match modality to the clinical question and contraindications (e.g., pregnancy, renal risk).",
  "allied-medication-safety":
    "**Clinical application.** Safety systems fail at interfaces: name/look-alike risk, duplicate therapy, and unclear routes—verify the “five rights” at the moment of administration.",
  "allied-patient-communication":
    "**Clinical application.** Communication failures drive near-misses; teach-back and plain language reduce wrong assumptions across language and literacy barriers.",
  "allied-healthcare-teamwork":
    "**Clinical application.** Teamwork items test closed-loop communication: who owns the task, what was heard, and what will be reported back.",
};

function mergeBody(existing: string, addition: string): string {
  const e = (existing ?? "").trim();
  const a = addition.trim();
  if (!e) return a;
  if (e.includes(a.slice(0, Math.min(60, a.length)))) return e;
  return `${e}\n\n${a}`;
}

function titleHintFromLessonTitle(title: string | undefined, slug: string): string {
  const t = (title ?? "").replace(/\s*\([^)]*\)\s*$/, "").trim();
  if (t.length > 3) return t;
  return slug
    .replace(/^allied-/, "")
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function pickRelatedRefs(
  allSlugs: string[],
  slug: string,
  titlesBySlug: Map<string, string>,
): Array<{ slug: string; titleHint: string }> {
  const others = allSlugs.filter((s) => s !== slug).sort();
  const picks = [...others.filter((s) => s !== slug)].slice(0, 6);
  return picks.slice(0, 4).map((s) => ({
    slug: s,
    titleHint: titleHintFromLessonTitle(titlesBySlug.get(s), s),
  }));
}

function internalStudyAppend(pathwayId: string, slug: string, hubPath: string, siblingPool: string[], titlesBySlug: Map<string, string>): string {
  const picks = siblingPool.filter((s) => s !== slug).sort();
  const a = picks[0];
  const b = picks[1] ?? picks[0];
  const c = picks[2] ?? picks[1] ?? picks[0];
  const label = (s: string) => titleHintFromLessonTitle(titlesBySlug.get(s), s);
  return (
    `**Related study on this pathway:** ${label(a)} — [open lesson](LESSON:${a}) · ${label(b)} — [open lesson](LESSON:${b}) · ${label(c)} — [open lesson](LESSON:${c}) · [all lessons](${hubPath})`
  );
}

function rewriteProse(body: string): string {
  let out = body;
  out = out.replace(
    /\*\*([^*]+)\*\* is a clinically important condition that nurses must assess, monitor, and prioritize effectively\./g,
    (_, topic: string) =>
      `**${topic}** is core to **allied health practice**: use it to interpret assessments, document precisely, collaborate across disciplines, and stay within your professional scope.`,
  );
  out = out.replace(
    /\*\*Nursing: anticipate these orders and monitor these results:\*\*/g,
    "**In practice, anticipate these orders and interpret results in scope:**",
  );
  out = out.replace(/\*\*Nursing Actions:\*\*/g, "**Scope-aware actions:**");
  out = out.replace(/\*\*Nursing Actions:\*\*/gi, "**Scope-aware actions:**");
  return out;
}

function patchLesson(
  lesson: LessonJson,
  pathwayId: string,
  allSlugs: string[],
  titlesBySlug: Map<string, string>,
): { changed: boolean; notes: string[] } {
  const notes: string[] = [];
  const p = getExamPathwayById(pathwayId);
  const hubPath = p ? buildExamPathwayPath(p, "lessons") : "";
  const slug = lesson.slug;

  const secs = lesson.sections;
  if (!Array.isArray(secs)) return { changed: false, notes: ["no_sections"] };

  for (const sec of secs) {
    if (typeof sec.body === "string") {
      const before = sec.body;
      let body = rewriteProse(before);
      if (sec.heading === "Nursing Responsibilities") {
        sec.heading = "Allied practice & application";
        notes.push("rename_intervention_heading");
      }
      if (body !== before) {
        sec.body = body;
        notes.push("prose_scope_rewrites");
      }
    }
  }

  const na = secs.find((s) => s.kind === "nursing_assessment_interventions");
  if (na?.body) {
    const vignette = ALLIED_VIGNETTE_BY_SLUG[slug];
    if (vignette && !na.body.includes("**Clinical application.**")) {
      na.body = mergeBody(vignette, na.body);
      notes.push("allied_clinical_application_frame");
    }
  }

  const pearls = secs.find((s) => s.kind === "clinical_pearls");
  if (pearls?.body && hubPath && !/\]\(LESSON:/.test(pearls.body)) {
    pearls.body = mergeBody(
      pearls.body,
      internalStudyAppend(pathwayId, slug, hubPath, allSlugs, titlesBySlug),
    );
    notes.push("internal_study_links_block");
  }

  const refs = pickRelatedRefs(allSlugs, slug, titlesBySlug);
  const prev = JSON.stringify(lesson.relatedLessonRefs ?? []);
  const next = JSON.stringify(refs);
  if (prev !== next) {
    lesson.relatedLessonRefs = refs;
    notes.push("relatedLessonRefs_metadata");
  }

  return { changed: notes.length > 0, notes: [...new Set(notes)] };
}

function main() {
  const raw = JSON.parse(readFileSync(ALLIED_CATALOG_PATH, "utf8")) as AlliedCatalog;
  const results: Array<{
    lessonId: string;
    pathwayId: string;
    slug: string;
    outcome: "fixed" | "skipped";
    detail: string;
    notes?: string[];
  }> = [];

  let nFixed = 0;
  let processed = 0;

  for (const pathwayId of TARGET_PATHWAYS) {
    const bucket = raw.pathways[pathwayId];
    if (!Array.isArray(bucket)) continue;

    const titlesBySlug = new Map<string, string>();
    for (const l of bucket) {
      const les = l as LessonJson;
      if (les.slug && typeof les.title === "string") titlesBySlug.set(les.slug, les.title);
    }
    const allSlugs = bucket.map((l) => (l as LessonJson).slug).filter(Boolean);

    for (const item of bucket) {
      if (processed >= BATCH_CAP) break;
      const lesson = item as LessonJson;
      const slug = lesson.slug;
      const { changed, notes } = patchLesson(lesson, pathwayId, allSlugs, titlesBySlug);
      processed += 1;

      const lessonId = `${pathwayId}:${slug}`;
      if (!changed) {
        results.push({ lessonId, pathwayId, slug, outcome: "skipped", detail: "no_changes" });
        continue;
      }

      const normalized = normalizeLesson(lesson as Parameters<typeof normalizeLesson>[0], pathwayId);
      const gate = normalized.structuralQuality;
      nFixed += 1;
      results.push({
        lessonId,
        pathwayId,
        slug,
        outcome: "fixed",
        detail: notes.join(", "),
        notes,
      });
    }
  }

  writeFileSync(ALLIED_CATALOG_PATH, JSON.stringify(raw, null, 2));
  mkdirSync(dirname(REPORT_PATH), { recursive: true });
  writeFileSync(
    REPORT_PATH,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        targetPathways: TARGET_PATHWAYS,
        lessonsTouched: nFixed,
        selectionNote: `Up to ${BATCH_CAP} lessons across allied bundled pathways (catalog contains 30 total US+CA).`,
        results,
      },
      null,
      2,
    ),
  );

  console.log(`Allied batch-1: updated ${nFixed} lessons. Report: ${REPORT_PATH}`);
}

main();
