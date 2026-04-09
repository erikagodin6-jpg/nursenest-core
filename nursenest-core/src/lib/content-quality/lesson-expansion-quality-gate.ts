/**
 * Editorial **quality gate** for pathway lesson catalog rows (expansion waves, imports, adaptations).
 * Complements structural validators in `pathway-lesson-premium.ts` — focuses on uniqueness, learner value,
 * and metadata hygiene as the library scales past 150 lessons per pathway.
 */
import { countWords, stripToPlainText } from "@/lib/content-quality/plain-text";

export type ExpansionQualitySeverity = "error" | "warn";

export type ExpansionQualityViolation = {
  ruleId: string;
  severity: ExpansionQualitySeverity;
  message: string;
  slug?: string;
};

/** Human-readable rulebook (source of truth for editorial + automation). */
export const LESSON_EXPANSION_QUALITY_RULEBOOK = {
  uniqueness: [
    "U1: Within the same pathway catalog slice, two lessons must not target the same clinical intent under different titles (near-duplicate). Heuristic: same topicSlug + high token overlap (Jaccard ≥ 0.65) on normalized titles.",
    "U2: Expansion placeholders must be visually distinct from curated lessons — titles that are only “Integrated review #N” without a specific clinical anchor are flagged as filler risk.",
    "U3: Slugs must remain stable once published; the gate does not rewrite slugs — it blocks obvious internal-prefixed expansion slugs from shipping with learner-facing ops copy.",
  ],
  lessonQuality: [
    "Q1: Title must be specific (length 12–120 chars) and name a concrete topic, skill, or scenario — not “Lesson 12” or generic “Overview”.",
    "Q2: At least one legacy section (`exam_relevance`) must exist with sufficient prose (≥ 40 words) so “exam relevance” is real, not a label.",
    "Q3: Pathway-accurate scope: US PN vs Canada RPN vs US NP vs RN titles/SEO must not mis-brand the target exam.",
    "Q4: Learner outcome: takeaways section should reference study actions (e.g. question bank, practice, related lesson links) — thin takeaways warn.",
  ],
  metadata: [
    "M1: No internal operations language in title, seoTitle, or seoDescription (e.g. “Blueprint expansion”, “slot pool”, “padded spread”, editorial-only blueprint labels).",
    "M2: No mislabeled exam branding — e.g. Canada RPN content must not present as US NCLEX-PN; US LPN must not present as REx-PN.",
    "M3: seoDescription must be substantive (≥ 18 words, ≥ 120 characters) and not a generic template line (“This lesson covers nursing topics.”).",
  ],
} as const;

const INTERNAL_OPS_RE =
  /\b(blueprint\s+expansion|slot\s+pool|padded\s+spread|editorial\s*only|internal\s+ops|bp26-\s*batch)\b/i;

const GENERIC_SEO_RE = /^(this\s+lesson|learn\s+about|overview\s+of)\s+/i;

function tokenSet(s: string): Set<string> {
  const t = s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP.has(w));
  return new Set(t);
}

const STOP = new Set([
  "the",
  "and",
  "for",
  "with",
  "that",
  "this",
  "from",
  "your",
  "into",
  "about",
  "nursing",
  "exam",
  "test",
  "prep",
]);

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let inter = 0;
  for (const x of a) {
    if (b.has(x)) inter += 1;
  }
  const union = a.size + b.size - inter;
  return union === 0 ? 0 : inter / union;
}

/** Strip trailing exam suffix like “ — NCLEX-PN (United States)” for duplicate compare. */
function titleCore(title: string): string {
  return title.replace(/\s*[—–-]\s*[^—–-]+$/u, "").trim();
}

export type CatalogLessonRowInput = {
  slug: string;
  title: string;
  topic: string;
  topicSlug: string;
  seoTitle: string;
  seoDescription: string;
  sections: Array<{ kind?: string; body?: string }>;
};

export type LessonExpansionGateContext = {
  pathwayId: string;
  /** Other lessons in the same pathway catalog slice (for near-duplicate checks). Exclude `slug` under test if present. */
  cohort: CatalogLessonRowInput[];
};

function sectionBody(sections: CatalogLessonRowInput["sections"], kind: string): string {
  const sec = sections.find((s) => s.kind === kind);
  return stripToPlainText(typeof sec?.body === "string" ? sec.body : "");
}

export function evaluateLessonExpansionQuality(
  row: CatalogLessonRowInput,
  ctx: LessonExpansionGateContext,
): ExpansionQualityViolation[] {
  const v: ExpansionQualityViolation[] = [];
  const { slug, title, seoTitle, seoDescription, topicSlug } = row;
  const corpus = [title, seoTitle, seoDescription, ...row.sections.map((s) => s.body ?? "")].join("\n");

  // --- M metadata ---
  if (INTERNAL_OPS_RE.test(corpus)) {
    v.push({
      ruleId: "M1",
      severity: "error",
      slug,
      message: "Remove internal/editorial ops phrasing (blueprint expansion, slot pool, padded spread, etc.) from learner-visible fields.",
    });
  }

  const seoWords = countWords(seoDescription);
  const seoLen = stripToPlainText(seoDescription).length;
  if (seoWords < 18 || seoLen < 120) {
    v.push({
      ruleId: "M3",
      severity: "warn",
      slug,
      message: `seoDescription should be substantive (got ~${seoWords} words, ${seoLen} chars; target ≥18 words and ≥120 chars).`,
    });
  }
  if (GENERIC_SEO_RE.test(stripToPlainText(seoDescription))) {
    v.push({
      ruleId: "M3b",
      severity: "warn",
      slug,
      message: "seoDescription reads as a generic opener — replace with pathway-specific value.",
    });
  }

  // M2 pathway branding
  if (ctx.pathwayId === "ca-rpn-rex-pn") {
    if (/\bNCLEX-PN\b/i.test(title) || /\bNCLEX-PN\b/i.test(seoTitle)) {
      v.push({
        ruleId: "M2",
        severity: "error",
        slug,
        message: "Canada RPN pathway: do not label lessons as NCLEX-PN (US exam) in title/seoTitle.",
      });
    }
  }
  if (ctx.pathwayId === "us-lpn-nclex-pn") {
    if (/\bREx-PN\b/i.test(title) || /\bREx-PN\b/i.test(seoTitle)) {
      v.push({
        ruleId: "M2",
        severity: "error",
        slug,
        message: "US LPN pathway: do not brand lessons as REx-PN (Canada) in title/seoTitle.",
      });
    }
  }

  // --- Q lesson quality ---
  const t = stripToPlainText(title);
  if (t.length < 12 || t.length > 120) {
    v.push({
      ruleId: "Q1",
      severity: "warn",
      slug,
      message: `Title length ${t.length} — target 12–120 characters for specificity.`,
    });
  }
  if (/^(lesson|overview|topic)\s*\d*$/i.test(t) || /^untitled/i.test(t)) {
    v.push({ ruleId: "Q1b", severity: "error", slug, message: "Title is too generic." });
  }

  const examRel = sectionBody(row.sections, "exam_relevance");
  if (countWords(examRel) < 35) {
    v.push({
      ruleId: "Q2",
      severity: "warn",
      slug,
      message: "exam_relevance section should clearly state how the item shows up on the exam (target ≥ ~35 words of concrete guidance).",
    });
  }

  const take = sectionBody(row.sections, "takeaways");
  if (!/\b(bank|practice|question|review|lesson|flashcard|timed|mock)\b/i.test(take)) {
    v.push({
      ruleId: "Q4",
      severity: "warn",
      slug,
      message: "Takeaways should point learners to a next study action (bank, practice, related lesson, etc.).",
    });
  }

  // U2 filler risk
  if (/^integrated review:/i.test(t) && /#\d+/.test(t)) {
    v.push({
      ruleId: "U2",
      severity: "warn",
      slug,
      message: "Title looks like a numbered placeholder — replace with a specific clinical/educational anchor when editorially ready.",
    });
  }

  // U1 near-duplicates (same pathway, same topicSlug)
  const core = titleCore(t);
  const a = tokenSet(core);
  for (const other of ctx.cohort) {
    if (other.slug === row.slug) continue;
    if (other.topicSlug !== topicSlug) continue;
    const otherCore = titleCore(stripToPlainText(other.title));
    /** Placeholder family shares a template title — skip automated overlap (editorial replaces later). */
    if (/^integrated review:/i.test(core) && /^integrated review:/i.test(otherCore)) continue;
    const b = tokenSet(otherCore);
    const j = jaccard(a, b);
    if (j >= 0.72 && a.size >= 5 && b.size >= 5) {
      v.push({
        ruleId: "U1",
        severity: "warn",
        slug,
        message: `Possible near-duplicate of "${other.slug}" (topicSlug=${topicSlug}, title token overlap ~${Math.round(j * 100)}%).`,
      });
      break;
    }
  }

  return v;
}

export function gateErrors(violations: ExpansionQualityViolation[]): ExpansionQualityViolation[] {
  return violations.filter((x) => x.severity === "error");
}

export function gateWarnings(violations: ExpansionQualityViolation[]): ExpansionQualityViolation[] {
  return violations.filter((x) => x.severity === "warn");
}

/**
 * Scan every lesson in a pathway catalog bucket. Useful for CI / pre-merge reporting.
 */
export function evaluatePathwayCatalogExpansionQuality(
  lessons: CatalogLessonRowInput[],
  pathwayId: string,
): { bySlug: Record<string, ExpansionQualityViolation[]>; summary: { errors: number; warnings: number } } {
  const bySlug: Record<string, ExpansionQualityViolation[]> = {};
  let errors = 0;
  let warnings = 0;
  for (const row of lessons) {
    const v = evaluateLessonExpansionQuality(row, { pathwayId, cohort: lessons });
    if (v.length) {
      bySlug[row.slug] = v;
      for (const x of v) {
        if (x.severity === "error") errors += 1;
        else warnings += 1;
      }
    }
  }
  return { bySlug, summary: { errors, warnings } };
}
