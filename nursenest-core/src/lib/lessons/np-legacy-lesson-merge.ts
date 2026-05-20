/**
 * Legacy NP content index + merge helpers for CNPLE expansion.
 * Primary legacy source: repo-root `data/phase2/np-advanced-batch-*.json` (structured NP drafts).
 */
import * as fs from "node:fs";
import * as path from "node:path";

import {
  RN_EXPAND_REQUIRED_SECTION_KINDS,
  RN_EXPAND_SECTION_WORD_MIN,
  type RNExpandRequiredSectionKind,
} from "@/lib/lessons/rn-expanded-lesson-contract";

export type LegacyNpPhase2Lesson = Record<string, unknown>;

export type LegacyNpRecord = {
  topicSlug: string;
  topicName: string;
  lesson: LegacyNpPhase2Lesson;
  /** Absolute path of source file (for reporting). */
  sourcePath: string;
};

function countWords(body: string): number {
  return (body || "").trim().split(/\s+/).filter(Boolean).length;
}

export function normalizeLessonTitleForMatch(title: string): string {
  return title
    .toLowerCase()
    .replace(/\(.*?\)/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Optional hand-mapped aliases: current lesson slug -> legacy topicSlug. */
export const LEGACY_NP_SLUG_ALIASES: Record<string, string> = {};

function stableJson(obj: unknown, maxChars?: number): string {
  try {
    const s = JSON.stringify(obj, null, 2);
    if (maxChars && s.length > maxChars) return `${s.slice(0, maxChars)}\n\n…`;
    return s;
  } catch {
    return "";
  }
}

/**
 * Turn a phase-2 NP batch `lesson` object into bodies for the same canonical kinds
 * used by RN/RPN expanded lessons (on-disk compatibility).
 */
export function mapPhase2LessonToCanonicalSections(lesson: LegacyNpPhase2Lesson): Partial<Record<RNExpandRequiredSectionKind, string>> {
  const out: Partial<Record<RNExpandRequiredSectionKind, string>> = {};
  const framing = typeof lesson.clinicalFraming === "string" ? lesson.clinicalFraming.trim() : "";
  if (framing) {
    out.introduction = `${framing}\n\n**Canadian NP / CNPLE lens:** align orders, prescribing, diagnostics, and referral language with **provincial scope**, **interprofessional collaboration**, and **risk-appropriate escalation** rather than independent management outside your regulatory framework.`;
  }

  const core = lesson.coreConceptsAndDifferential;
  const coreStr = core ? stableJson(core, 22_000) : "";
  if (coreStr) {
    out.pathophysiology_overview = `**Advanced pathophysiology and disease mechanisms**\n\n${coreStr}`;
  }

  const red = lesson.redFlagsEscalation;
  const redLines = Array.isArray(red) ? red.map((x) => String(x).trim()).filter(Boolean) : [];
  if (redLines.length) {
    out.signs_symptoms = `**Early patterns and context cues**\n\nUse the stem timeline, vitals, risk factors, and functional change to decide whether presentation is evolving versus stable.\n\n**Late and red flag findings (escalate)**\n\n${redLines.map((l) => `• ${l}`).join("\n")}`;
    out.complications = `**Acute complications and unsafe trajectories**\n\n${redLines.map((l) => `• ${l}`).join("\n")}`;
  }

  const mgmt = lesson.managementApproach as Record<string, unknown> | undefined;
  if (mgmt) {
    const dx = mgmt.diagnosis;
    const imaging = mgmt.imagingDecision;
    const parts: string[] = [];
    if (Array.isArray(dx)) parts.push("**Diagnostics and bedside reasoning**\n\n" + dx.map(String).join("\n"));
    if (imaging) parts.push("**Imaging decisions**\n\n" + stableJson(imaging, 6000));
    const joined = parts.join("\n\n").trim();
    if (joined) out.labs_diagnostics = joined;

    const abx = mgmt.antibioticSelection;
    if (abx) {
      out.pharmacology = `**Pharmacology and prescribing considerations (verify local formulary and scope)**\n\n${stableJson(abx, 12_000)}`;
    }
    const restMgmt = { ...mgmt };
    delete restMgmt.antibioticSelection;
    const restStr = stableJson(restMgmt, 16_000).trim();
    if (restStr) {
      out.treatments = `**Treatment plan overview (NP-appropriate: diagnosis-linked, monitoring, follow-up)**\n\n${restStr}`;
    }
  }

  const initEval =
    mgmt && Array.isArray((mgmt as { initialEvaluation?: unknown }).initialEvaluation)
      ? ((mgmt as { initialEvaluation: unknown[] }).initialEvaluation as unknown[]).map(String).join("\n")
      : "";
  if (initEval) {
    out.nursing_assessment_interventions = `**Assessment priorities and interprofessional coordination**\n\n${initEval}`;
  }

  const fu = lesson.followUpAndMonitoring;
  if (fu) {
    out.client_education = `**Monitoring, follow-up, and safety netting**\n\n${stableJson(fu, 8000)}`;
  }

  const pop = lesson.populationConsiderations;
  if (pop) {
    out.clinical_pearls = `**Population nuances and exam-style traps**\n\n${stableJson(pop, 8000)}`;
  }

  const cdParts: string[] = [];
  if (redLines.length) cdParts.push(`**Red flags and escalation (referral, ED, specialist)**\n\n${redLines.join("\n")}`);
  if (coreStr) {
    cdParts.push(
      `**Differential diagnosis and narrowing (NP scope)**\n\nIntegrate the structured mechanisms and differentials from the Pathophysiology section. Use onset, risk factors, vitals, focused exam, and time course to separate common mimics, decide what to rule out first, and document referral thresholds that match Canadian practice and CNPLE-style stems.\n\n**Legacy differential excerpt**\n\n${coreStr.slice(0, 6000)}`,
    );
  }
  if (fu) cdParts.push(`**Follow-up, monitoring, and safety netting**\n\n${stableJson(fu, 4000)}`);
  if (cdParts.length) {
    out.clinical_decision_making = `**Clinical decision-making (NP scope)**\n\n${cdParts.join("\n\n")}`;
  }

  const caseHint =
    framing &&
    `**Scenario (synthetic vitals for exam-style practice)**\n\nA 58-year-old in primary care: **BP 152/92 mm Hg**, **HR 88 bpm**, **SpO2 96%** on room air, **temperature 36.8°C**. ${framing.slice(0, 520)}\n\n**Q1: What is the first priority assessment and why?**\n\n**Q2: What is your rationale for next diagnostics, treatment steps, follow-up interval, and referral?**\n\n**Key teaching point:** tie vitals and trajectory to scope-safe actions, documentation, and escalation for Canadian NP practice.`;
  if (caseHint) out.case_study = caseHint;

  return out;
}

export function loadNpPhase2LegacyRecords(repoRoot: string): LegacyNpRecord[] {
  const dir = path.join(repoRoot, "data", "phase2");
  const out: LegacyNpRecord[] = [];
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    if (!name.startsWith("np-advanced-batch-") || !name.endsWith("-lessons.json")) continue;
    const p = path.join(dir, name);
    let raw: unknown;
    try {
      raw = JSON.parse(fs.readFileSync(p, "utf8"));
    } catch {
      continue;
    }
    if (!raw || typeof raw !== "object") continue;
    const lessons = (raw as { lessons?: unknown }).lessons;
    if (!Array.isArray(lessons)) continue;
    for (const row of lessons) {
      if (!row || typeof row !== "object") continue;
      const topicSlug = String((row as { topicSlug?: unknown }).topicSlug || "").trim();
      const topicName = String((row as { topicName?: unknown }).topicName || "").trim();
      const lesson = (row as { lesson?: unknown }).lesson;
      if (!topicSlug || !lesson || typeof lesson !== "object") continue;
      out.push({ topicSlug, topicName, lesson: lesson as LegacyNpPhase2Lesson, sourcePath: p });
    }
  }
  return out;
}

export type LegacyNpMatchKind = "slug" | "title" | "alias" | "topic_slug_contains";

export type LegacyNpMatch = {
  record: LegacyNpRecord;
  kind: LegacyNpMatchKind;
};

/**
 * Build lookup indexes for matching current catalog rows to legacy phase-2 drafts.
 */
export function buildLegacyNpIndex(records: LegacyNpRecord[]): {
  byTopicSlug: Map<string, LegacyNpRecord>;
  byNormTitle: Map<string, LegacyNpRecord[]>;
  all: LegacyNpRecord[];
} {
  const byTopicSlug = new Map<string, LegacyNpRecord>();
  const byNormTitle = new Map<string, LegacyNpRecord[]>();
  for (const r of records) {
    byTopicSlug.set(r.topicSlug.toLowerCase(), r);
    const nt = normalizeLessonTitleForMatch(r.topicName);
    if (nt) {
      const prev = byNormTitle.get(nt) ?? [];
      prev.push(r);
      byNormTitle.set(nt, prev);
    }
  }
  return { byTopicSlug, byNormTitle, all: records };
}

export function findLegacyNpMatch(args: {
  slug: string;
  title: string;
  topic?: string;
  index: ReturnType<typeof buildLegacyNpIndex>;
}): LegacyNpMatch | null {
  const slug = args.slug.trim();
  const alias = LEGACY_NP_SLUG_ALIASES[slug];
  if (alias) {
    const hit = args.index.byTopicSlug.get(alias.toLowerCase());
    if (hit) return { record: hit, kind: "alias" };
  }
  const direct = args.index.byTopicSlug.get(slug.toLowerCase());
  if (direct) return { record: direct, kind: "slug" };

  const slugUnderscore = slug.replace(/-/g, "_").toLowerCase();
  const hit2 = args.index.byTopicSlug.get(slugUnderscore);
  if (hit2) return { record: hit2, kind: "slug" };

  const nt = normalizeLessonTitleForMatch(args.title);
  const titleHits = args.index.byNormTitle.get(nt);
  if (titleHits?.length === 1) return { record: titleHits[0]!, kind: "title" };
  if (titleHits && titleHits.length > 1) return { record: titleHits[0]!, kind: "title" };

  const topic = (args.topic || "").trim().toLowerCase();
  if (topic) {
    for (const r of args.index.all) {
      if (slug.toLowerCase().includes(r.topicSlug.toLowerCase()) || r.topicSlug.toLowerCase().includes(slug.toLowerCase())) {
        return { record: r, kind: "topic_slug_contains" };
      }
    }
  }
  return null;
}

export function isStrongSectionBody(body: string): boolean {
  return countWords(body) >= RN_EXPAND_SECTION_WORD_MIN;
}

/**
 * Merge mapped legacy bodies into an in-memory lesson row (mutates `sections` array).
 * Does not overwrite strong current bodies with clearly thinner legacy bodies.
 */
export function mergeLegacyBodiesIntoLessonSections(args: {
  sections: Array<{ kind?: string; body?: string; heading?: string; id?: string }>;
  legacyBodies: Partial<Record<RNExpandRequiredSectionKind, string>>;
}): { mergedKinds: RNExpandRequiredSectionKind[]; skippedStrong: RNExpandRequiredSectionKind[] } {
  const mergedKinds: RNExpandRequiredSectionKind[] = [];
  const skippedStrong: RNExpandRequiredSectionKind[] = [];
  const byKind = new Map<string, (typeof args.sections)[number]>();
  for (const s of args.sections) {
    const k = String(s.kind || "");
    if (k) byKind.set(k, s);
  }

  for (const kind of RN_EXPAND_REQUIRED_SECTION_KINDS) {
    const legacy = args.legacyBodies[kind]?.trim();
    if (!legacy) continue;
    const lw = countWords(legacy);
    const row = byKind.get(kind);
    const cur = String(row?.body || "").trim();
    const cw = countWords(cur);

    if (cw >= RN_EXPAND_SECTION_WORD_MIN && lw < cw * 0.85) {
      skippedStrong.push(kind);
      continue;
    }
    if (!cur) {
      if (row) {
        row.body = legacy;
      } else {
        args.sections.push({ id: kind, kind, heading: kind, body: legacy });
        byKind.set(kind, args.sections[args.sections.length - 1]!);
      }
      mergedKinds.push(kind);
      continue;
    }
    if (cw < RN_EXPAND_SECTION_WORD_MIN || lw > cw * 1.25) {
      if (row) row.body = legacy;
      mergedKinds.push(kind);
      continue;
    }
    skippedStrong.push(kind);
  }
  return { mergedKinds, skippedStrong };
}

export function mapLegacySectionLabelToKind(label: string): RNExpandRequiredSectionKind | null {
  const t = label.toLowerCase().replace(/[_\s]+/g, " ").trim();
  const table: Array<{ re: RegExp; kind: RNExpandRequiredSectionKind }> = [
    { re: /^(intro|overview|introduction)/, kind: "introduction" },
    { re: /pathophys|mechanism|disease process/, kind: "pathophysiology_overview" },
    { re: /sign|symptom|presentation|clinical feature/, kind: "signs_symptoms" },
    { re: /lab|diagnostic|imaging|investigation/, kind: "labs_diagnostics" },
    { re: /treatment|management|therapy|plan(?!.*pharm)/, kind: "treatments" },
    { re: /pharm|prescri|medication|drug/, kind: "pharmacology" },
    { re: /nursing|assessment|intervention|monitor/, kind: "nursing_assessment_interventions" },
    { re: /decision|priorit|differential|ddx|reasoning/, kind: "clinical_decision_making" },
    { re: /complication/, kind: "complications" },
    { re: /pearl|trap|mnemonic/, kind: "clinical_pearls" },
    { re: /education|teaching|counsel|follow[- ]?up|safety net/, kind: "client_education" },
    { re: /case|vignette|scenario/, kind: "case_study" },
    { re: /exam|takeaway|summary/, kind: "clinical_pearls" },
  ];
  for (const { re, kind } of table) {
    if (re.test(t)) return kind;
  }
  return null;
}
