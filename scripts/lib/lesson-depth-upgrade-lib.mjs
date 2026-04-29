/**
 * Safe structural upgrades for pathway lesson JSON (no slug changes, no fabricated citations).
 * Appends editorial scaffolds + optional overview glue from existing title/seo only.
 */
import fs from "node:fs";
import {
  countWords,
  lessonCorpus,
  usesPremiumStructure,
  structuralLegacyComplete,
  structuralShortFormComplete,
  detectMissingSpineSections,
} from "./lesson-clinical-depth-shared.mjs";

const HARD_USER_BANNED = [
  /\bread the stem as a safety problem\b/i,
  /\bpicture one client whose data forces a fork\b/i,
  /\banchor pathophysiology to assessment findings\b/i,
];

const FAKE_CITATION_RE = /\[\d+\]|\bdoi:\s*\S|\bPMID\s*:\s*\d|\bRetrieved\s+\d{4}\b/i;
const UNSUPPORTED_DOSE_RE = /\b\d{1,4}\s*(mg|mcg|g)\s*(PO|IV|IM|SQ|subcut|q\d|BID|TID|QID|daily)\b/i;
const VAGUE_MONITOR_RE = /\bmonitor closely\b/i;
const SPINE_TITLES = {
  pathophysiology: "## Pathophysiology",
  risk_factors: "## Risk factors",
  signs_symptoms: "## Signs and symptoms",
  assessment_findings: "## Assessment findings",
  diagnostics: "## Diagnostics",
  labs_interpretation: "## Labs and interpretation",
  treatments: "## Treatments",
  medications: "## Medications (nursing implications)",
  nursing_interventions: "## Nursing interventions",
  prioritization: "## Prioritization",
  complications: "## Complications",
  client_education: "## Client education",
  clinical_pearls: "## Clinical pearls",
  safety_alerts: "## Safety alerts",
  exam_tips: "## Exam tips",
};

function scaffoldBlock(id, topic, bodySystem, title) {
  const head = SPINE_TITLES[id] ?? `## ${id}`;
  return `${head}\n\n**Clinical depth (authoring required):** Expand this block for **${topic}** (${bodySystem || "general"}) in the context of **${title}**. ` +
    `Use condition-specific mechanisms, expected assessment findings, and concrete nursing actions. ` +
    `Do **not** invent trial names, bracketed citations, or numeric doses unless they already appear elsewhere in this lesson and are clinically standard. ` +
    `When you document monitoring, specify **which** assessments or lab trends you mean and **why** they change management (avoid vague “monitor closely” without targets).\n\n`;
}

function hardBannedIn(corpus) {
  return HARD_USER_BANNED.some((re) => re.test(corpus));
}

export function validateUpgradeGuardrails({ mergedCorpus, appendedOnly }) {
  const reasons = [];
  if (hardBannedIn(appendedOnly)) reasons.push("hard_banned_phrase_in_appendix");
  if (FAKE_CITATION_RE.test(appendedOnly)) reasons.push("fake_citation_pattern_in_appendix");
  if (UNSUPPORTED_DOSE_RE.test(appendedOnly)) reasons.push("unsupported_exact_dosing_in_appendix");
  if (VAGUE_MONITOR_RE.test(appendedOnly)) reasons.push("vague_monitor_language_in_appendix");
  if (hardBannedIn(mergedCorpus)) reasons.push("hard_banned_phrase_in_merged_lesson");
  return { pass: reasons.length === 0, reasons };
}

function findSection(sections, kind) {
  return sections.find((s) => s.kind === kind);
}

function appendToSection(sections, kind, chunk) {
  const idx = sections.findIndex((s) => s.kind === kind);
  if (idx < 0) return { ok: false, reason: `missing_section_kind:${kind}` };
  const next = sections.map((s, i) =>
    i === idx ? { ...s, body: `${String(s.body ?? "").trim()}\n\n${chunk}`.trim() } : s,
  );
  return { ok: true, sections: next };
}

function firstPresentKind(sections, kinds) {
  for (const k of kinds) {
    if (findSection(sections, k)) return k;
  }
  return null;
}

/** Normalize scaffold for duplicate-boilerplate detection (strip topic-specific bits). */
export function boilerplateSignature(text) {
  return String(text)
    .toLowerCase()
    .replace(/\*\*[^*]+\*\*/g, "**__TOPIC__**")
    .replace(/\([^)]{0,120}\)/g, "()")
    .replace(/\s+/g, " ")
    .trim();
}

export function lessonsStructuralFingerprint(lesson) {
  const bodies = (lesson.sections ?? []).map((s) => String(s.body ?? "")).join("\n");
  return boilerplateSignature(bodies.replace(/\*\*[^*]+\*\*/g, "**T**"));
}

/**
 * @returns {{ ok: boolean, lesson?: object, skippedReason?: string, appended?: string, wordsBefore?: number, wordsAfter?: number }}
 */
export function upgradeLessonInMemory(lesson, { onlyMissingSpine = true } = {}) {
  const title = lesson.title ?? "";
  const topic = lesson.topic ?? title;
  const bodySystem = lesson.bodySystem ?? "";
  const slug = lesson.slug ?? "";
  const sections = Array.isArray(lesson.sections) ? [...lesson.sections] : [];
  const before = lessonCorpus(lesson);
  const wordsBefore = countWords(before);

  if (hardBannedIn(before)) {
    return { ok: false, skippedReason: "preexisting_hard_banned_skip", wordsBefore, wordsAfter: wordsBefore };
  }

  const initialMissing = detectMissingSpineSections(lesson);
  if (onlyMissingSpine && initialMissing.length === 0) {
    return { ok: false, skippedReason: "no_missing_spine", wordsBefore, wordsAfter: wordsBefore };
  }

  let work = { ...lesson, sections };
  let appended = "";

  const appendIdsToKind = (kind, ids) => {
    if (!kind) return { ok: false, reason: "no_target_section_kind" };
    for (const id of ids) {
      const curMissing = detectMissingSpineSections(work);
      if (onlyMissingSpine && !curMissing.includes(id)) continue;
      const block = scaffoldBlock(id, topic, bodySystem, title);
      const r = appendToSection(work.sections, kind, block);
      if (!r.ok) return r;
      work = { ...work, sections: r.sections };
      appended += block;
    }
    return { ok: true };
  };

  if (usesPremiumStructure(sections)) {
    const pathoKind = firstPresentKind(work.sections, ["pathophysiology_overview", "introduction"]);
    if (!pathoKind) return { ok: false, skippedReason: "premium_missing_patho_intro", wordsBefore };
    const r1 = appendIdsToKind(pathoKind, ["pathophysiology", "risk_factors"]);
    if (!r1.ok) return { ok: false, skippedReason: r1.reason, wordsBefore };

    const signsKind = firstPresentKind(work.sections, ["signs_symptoms", "red_flags"]);
    if (!signsKind) return { ok: false, skippedReason: "premium_missing_signs_redflags", wordsBefore };
    const r2 = appendIdsToKind(signsKind, ["signs_symptoms", "assessment_findings"]);
    if (!r2.ok) return { ok: false, skippedReason: r2.reason, wordsBefore };

    const labsKind = firstPresentKind(work.sections, ["labs_diagnostics"]);
    if (!labsKind) return { ok: false, skippedReason: "premium_missing_labs_diagnostics", wordsBefore };
    const r3 = appendIdsToKind(labsKind, ["diagnostics", "labs_interpretation", "treatments", "medications"]);
    if (!r3.ok) return { ok: false, skippedReason: r3.reason, wordsBefore };

    const nurseKind = firstPresentKind(work.sections, ["nursing_assessment_interventions"]);
    if (!nurseKind) return { ok: false, skippedReason: "premium_missing_nursing_section", wordsBefore };
    const r4 = appendIdsToKind(nurseKind, ["nursing_interventions", "prioritization", "complications"]);
    if (!r4.ok) return { ok: false, skippedReason: r4.reason, wordsBefore };

    const eduKind = firstPresentKind(work.sections, ["client_education", "nursing_assessment_interventions"]);
    if (!eduKind) return { ok: false, skippedReason: "premium_missing_education_target", wordsBefore };
    const r5 = appendIdsToKind(eduKind, ["client_education"]);
    if (!r5.ok) return { ok: false, skippedReason: r5.reason, wordsBefore };

    const pearlsKind = firstPresentKind(work.sections, [
      "clinical_pearls",
      "red_flags",
      "related_next_steps",
      "introduction",
    ]);
    if (!pearlsKind) return { ok: false, skippedReason: "premium_missing_pearls_tail", wordsBefore };
    const r6a = appendIdsToKind(pearlsKind, ["clinical_pearls", "exam_tips"]);
    if (!r6a.ok) return { ok: false, skippedReason: r6a.reason, wordsBefore };

    const rfKind = firstPresentKind(work.sections, ["red_flags"]);
    if (rfKind && rfKind !== pearlsKind) {
      const r6b = appendIdsToKind(rfKind, ["safety_alerts"]);
      if (!r6b.ok) return { ok: false, skippedReason: r6b.reason, wordsBefore };
    } else {
      const r6b = appendIdsToKind(pearlsKind, ["safety_alerts"]);
      if (!r6b.ok) return { ok: false, skippedReason: r6b.reason, wordsBefore };
    }
  } else if (structuralLegacyComplete(sections)) {
    const cm = findSection(work.sections, "clinical_meaning");
    if (cm && !String(cm.body).includes("## Overview") && !String(cm.body).includes("## 1.")) {
      const ov = `## Overview\n\n**${title}.** ${lesson.seoDescription ?? ""}\n\n`;
      const r0 = appendToSection(work.sections, "clinical_meaning", ov);
      if (r0.ok) {
        work = { ...work, sections: r0.sections };
        appended += ov;
      }
    }
    const legacyMap = [
      { kind: "clinical_meaning", ids: ["pathophysiology", "risk_factors"] },
      { kind: "exam_relevance", ids: ["signs_symptoms", "assessment_findings"] },
      { kind: "core_concept", ids: ["diagnostics", "labs_interpretation", "treatments", "medications"] },
      { kind: "clinical_scenario", ids: ["nursing_interventions", "prioritization", "complications", "client_education"] },
      { kind: "takeaways", ids: ["clinical_pearls", "safety_alerts", "exam_tips"] },
    ];
    for (const { kind, ids } of legacyMap) {
      const r = appendIdsToKind(kind, ids);
      if (!r.ok) return { ok: false, skippedReason: r.reason, wordsBefore };
    }
  } else if (structuralShortFormComplete(sections)) {
    const shortMap = [
      { kind: "intro", ids: ["pathophysiology", "risk_factors", "signs_symptoms"] },
      { kind: "core", ids: ["assessment_findings", "diagnostics", "labs_interpretation", "treatments"] },
      {
        kind: "clinical_application",
        ids: ["medications", "nursing_interventions", "prioritization", "complications", "client_education"],
      },
      { kind: "exam_tips", ids: ["clinical_pearls", "safety_alerts", "exam_tips"] },
    ];
    for (const { kind, ids } of shortMap) {
      const r = appendIdsToKind(kind, ids);
      if (!r.ok) return { ok: false, skippedReason: r.reason, wordsBefore };
    }
  } else {
    return { ok: false, skippedReason: "unsupported_section_shape_for_upgrade", wordsBefore };
  }

  if (appended.length > 0 && slug) {
    const marker = `\n<!-- clinical-spine-scaffold:${slug} -->\n`;
    const mkKind = work.sections[0]?.kind;
    if (mkKind) {
      const rM = appendToSection(work.sections, mkKind, marker);
      if (rM.ok) {
        work = { ...work, sections: rM.sections };
        appended += marker;
      }
    }
  }

  const after = lessonCorpus(work);
  const wordsAfter = countWords(after);
  const g = validateUpgradeGuardrails({ mergedCorpus: after, appendedOnly: appended });
  if (!g.pass) return { ok: false, skippedReason: g.reasons.join(","), wordsBefore, wordsAfter };

  if (appended.trim().length === 0) {
    return { ok: false, skippedReason: "nothing_to_append", wordsBefore, wordsAfter: wordsAfter };
  }

  return { ok: true, lesson: work, appended, wordsBefore, wordsAfter };
}

export function loadCatalogJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

export function saveCatalogJson(filePath, data) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

export function applyLessonAtLocation(data, loc, newLesson) {
  if (loc.container === "lessons") {
    const bucket = data.pathways?.[loc.pathwayKey];
    if (!bucket?.lessons) throw new Error(`Invalid catalog shape at ${loc.pathwayKey}.lessons`);
    bucket.lessons[loc.index] = newLesson;
  } else if (loc.container === "array") {
    const arr = data.pathways?.[loc.pathwayKey];
    if (!Array.isArray(arr)) throw new Error(`Invalid catalog array at ${loc.pathwayKey}`);
    arr[loc.index] = newLesson;
  } else {
    throw new Error(`Unknown container ${loc.container}`);
  }
}
