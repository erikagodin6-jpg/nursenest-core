/**
 * Shared clinical-depth audit utilities (used by audit CLI + upgrade script).
 * Keep GENERIC / structural constants aligned with scripts/audit-lesson-clinical-depth.mjs.
 */
import fs from "node:fs";
import path from "node:path";

export const SKIP_FILES = new Set([
  "rn-nclex-master-map.json",
  "rn-nclex-explicit-inventory-aliases.json",
  "rn-nclex-catalog-import-state.json",
  "nclex-rn-source-checklist.json",
]);

export const PREMIUM_KINDS = new Set([
  "introduction",
  "pathophysiology_overview",
  "signs_symptoms",
  "red_flags",
  "labs_diagnostics",
  "nursing_assessment_interventions",
  "clinical_pearls",
  "client_education",
  "tier_specific_relevance",
  "country_specific_notes",
  "related_next_steps",
]);

export const LEGACY_KINDS = ["clinical_meaning", "exam_relevance", "core_concept", "clinical_scenario", "takeaways"];
export const SHORT_FORM_KINDS = ["intro", "core", "clinical_application", "exam_tips"];

export const GENERIC_BOILERPLATE_RES = [
  /\bread the stem as a safety problem\b/i,
  /\bpicture one client whose data forces a fork\b/i,
  /\banchor pathophysiology to assessment findings\b/i,
  /\*\*Patient vignette\*\*/i,
  /\*\*Exam fork:\*\*/i,
  /\bboards (often|love to) use\b/i,
  /\beliminate answers that\b/i,
];

export const CLINICAL_SIGNAL_RES = [
  /\b(pathophysiolog|pathophys|mechanism|etiology|physiology|dysfunction|cascade)\b/i,
  /\b(lab[s]?|serum|plasma|WBC|RBC|Hgb|hematocrit|platelet|sodium|potassium|chloride|bicarb|creatinine|BUN|eGFR|ABG|\bpH\b|PaCO|PaO|HCO|glucose|troponin|INR|aPTT|lactate|anion gap)\b/i,
  /\b(diagnos|imaging|CT|MRI|ultrasound|x-?ray|ECG|EKG|telemetry)\b/i,
  /\b(treat|medication|pharmac|dose|mg\b|mEq|infusion|protocol|order)\b/i,
  /\b(intervention|nursing|assessment|monitor|vital|auscultat|palpat)\b/i,
  /\b(complication|adverse|contraindicat|overdose|toxicity)\b/i,
  /\b(educat|teach|discharge|home care|client)\b/i,
];

export function stripHtml(s) {
  return String(s).replace(/<[^>]+>/g, " ");
}

export function countWords(s) {
  const t = stripHtml(s).replace(/\s+/g, " ").trim();
  if (!t) return 0;
  return t.split(/\s+/).length;
}

export function lessonCorpus(lesson) {
  const parts = [lesson.title, lesson.seoDescription ?? "", ...(lesson.sections ?? []).map((x) => x.body ?? "")];
  return parts.join("\n");
}

export function usesPremiumStructure(sections) {
  if (!Array.isArray(sections) || sections.length === 0) return false;
  return sections.some((s) => PREMIUM_KINDS.has(String(s.kind)));
}

export function structuralLegacyComplete(sections) {
  const kinds = new Set((sections ?? []).map((s) => String(s.kind)));
  return LEGACY_KINDS.every((k) => kinds.has(k));
}

export function structuralShortFormComplete(sections) {
  const kinds = new Set((sections ?? []).map((s) => String(s.kind)));
  return SHORT_FORM_KINDS.every((k) => kinds.has(k));
}

export function structuralShapeOk(sections) {
  if (!Array.isArray(sections) || sections.length === 0) return false;
  if (structuralLegacyComplete(sections)) return true;
  if (usesPremiumStructure(sections)) return true;
  if (structuralShortFormComplete(sections)) return true;
  return sections.length >= 5;
}

export function premiumSpinePresent(sections) {
  const kinds = new Set((sections ?? []).map((s) => String(s.kind)));
  return ["red_flags", "related_next_steps", "tier_specific_relevance"].every((k) => kinds.has(k));
}

export function inferTier(pathwayId) {
  const id = String(pathwayId).toLowerCase();
  if (id.includes("allied")) return "allied";
  if (id.includes("new-grad") || id.includes("new_grad")) return "new_grad";
  if (id.includes("np") || id.includes("fnp") || id.includes("anp")) return "np";
  if (id.includes("lpn") || id.includes("pn") || id.includes("rpn") || id.includes("rex-pn")) return "pn";
  if (id.includes("rn")) return "rn";
  return "other";
}

/** CLI: --tier=rn | rpn | pn | np | allied | new-grad */
export function normalizeTierFilter(argv) {
  const raw = argv.find((a) => a.startsWith("--tier="));
  if (!raw) return null;
  const v = raw.split("=", 2)[1]?.trim().toLowerCase();
  if (v === "rpn" || v === "pn") return "pn";
  if (v === "new-grad" || v === "new_grad") return "new_grad";
  if (["rn", "np", "allied", "new_grad"].includes(v)) return v === "new_grad" ? "new_grad" : v;
  return v;
}

export function tierFilterMatches(filterTier, pathwayId) {
  if (!filterTier) return true;
  const t = inferTier(pathwayId);
  if (filterTier === "pn") return t === "pn";
  return t === filterTier;
}

export function countGenericHits(corpus) {
  let n = 0;
  for (const re of GENERIC_BOILERPLATE_RES) {
    const rg = new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g");
    const m = corpus.match(rg);
    if (m) n += m.length;
  }
  return n;
}

export function clinicalSignalScore(corpus) {
  let score = 0;
  for (const re of CLINICAL_SIGNAL_RES) {
    if (re.test(corpus)) score += 1;
  }
  return score;
}

/**
 * Fifteen-point spine coverage (keyword / structure heuristics on full corpus).
 * Returns list of spine ids still thin or absent.
 */
export function detectMissingSpineSections(lesson) {
  const corpus = lessonCorpus(lesson);
  const c = corpus.toLowerCase();
  const missing = [];

  const need = (id, ok) => {
    if (!ok) missing.push(id);
  };

  need(
    "pathophysiology",
    /\b(pathophysiolog|pathophysiology|pathophys)\b/i.test(corpus) ||
      (/\b(mechanism|etiology|physiology|cascade|dysfunction)\b/i.test(corpus) &&
        !/\b(without\s+mechanism|no\s+mechanism|mechanism\s+vocabulary|lack(s)?\s+mechanism)\b/i.test(corpus)),
  );
  need("risk_factors", /\b(risk factor|risk factors|predispos|contributing factor|modifiable risk)\b/i.test(corpus));
  need(
    "signs_symptoms",
    /\b(sign|symptom|presentation|manifestation|clinical picture|early|late)\b/i.test(corpus) &&
      /\b(client|patient|vital|dyspnea|pain|altered)\b/i.test(c),
  );
  need(
    "assessment_findings",
    /\b(assessment|auscultat|palpat|inspect|focused exam|neuro check|skin turgor)\b/i.test(corpus),
  );
  need("diagnostics", /\b(diagnostic|imaging|\bCT\b|\bMRI\b|ultrasound|x-?ray|ECG|EKG|telemetry|score)\b/i.test(corpus));
  need(
    "labs_interpretation",
    /\b(lab|BUN|creatinine|troponin|electrolyt|ABG|WBC|Hgb|platelet|INR|lactate|glucose)\b/i.test(corpus) &&
      /\b(trend|interpret|elevated|decreased|critical|implication|why)\b/i.test(corpus),
  );
  need("treatments", /\b(treatment|therapy|protocol|resuscitat|surgery|repletion|replacement)\b/i.test(corpus));
  need("medications", /\b(medication|pharmac|drug class|antibiotic|diuretic|vasoactive|analgesic|insulin)\b/i.test(corpus));
  need(
    "nursing_interventions",
    /\b(nursing intervention|nurse(s)?\s+(should|will|monitor|administer)|independent nursing|reposition|strict I&O)\b/i.test(
      corpus,
    ),
  );
  need("prioritization", /\b(priorit|first action|urgent|unstable|ABC|Maslow|delegate)\b/i.test(corpus));
  need("complications", /\b(complication|adverse|deteriorat|if untreated|worsen|progression)\b/i.test(corpus));
  need("client_education", /\b(client education|patient education|teach-back|discharge teaching|home care)\b/i.test(corpus));
  need("clinical_pearls", /\b(pearl|high-?yield|remember|classic pattern|do not miss)\b/i.test(corpus));
  need("safety_alerts", /\b(safety|red flag|escalat|never|avoid|contraindicat|hard stop)\b/i.test(corpus));
  need("exam_tips", /\b(NCLEX|exam|stem|item|distractor|SATA|NGN|board)\b/i.test(corpus));

  return missing;
}

export function priorityScore({ words, genericHits, flags, missingSpine }) {
  let s = (missingSpine?.length ?? 0) * 18 + (flags?.length ?? 0) * 4;
  if (words < 380) s += 35;
  if (words < 800) s += 12;
  if (genericHits >= 6) s += 28;
  if (genericHits >= 3) s += 10;
  if (flags?.includes("thin_total_words")) s += 15;
  if (flags?.includes("generic_boilerplate_heavy")) s += 22;
  return Math.round(s);
}

export function auditLesson({ lesson, source, pathwayId }) {
  const corpus = lessonCorpus(lesson);
  const words = countWords(corpus);
  const genericHits = countGenericHits(corpus);
  const signals = clinicalSignalScore(corpus);
  const sections = lesson.sections ?? [];
  const premium = usesPremiumStructure(sections);
  const legacyOk = structuralLegacyComplete(sections);
  const shortForm = structuralShortFormComplete(sections);
  const shapeOk = structuralShapeOk(sections);
  const flags = [];

  if (!lesson.slug) flags.push("missing_slug");
  if (!shapeOk) flags.push("unrecognized_section_shape");

  if (premium) {
    if (!premiumSpinePresent(sections)) flags.push("premium_partial_may_normalize");
    const hasPatho =
      sections.some((s) => s.kind === "pathophysiology_overview" && countWords(s.body) >= 80) ||
      sections.some((s) => s.kind === "introduction" && countWords(s.body) >= 120);
    if (!hasPatho) flags.push("missing_pathophysiology_block");
    const hasLabs = sections.some((s) => s.kind === "labs_diagnostics" && countWords(s.body) >= 60);
    if (!hasLabs) flags.push("missing_labs_block");
    const hasNursing = sections.some(
      (s) => s.kind === "nursing_assessment_interventions" && countWords(s.body) >= 100,
    );
    if (!hasNursing) flags.push("thin_nursing_interventions");
  } else if (legacyOk) {
    const cm = sections.find((s) => s.kind === "clinical_meaning");
    if (!cm || countWords(cm.body) < 120) flags.push("thin_clinical_meaning");
    if (!/\b(pathophysiolog|mechanism|etiology|physiology|manifest)\b/i.test(corpus) && words < 700)
      flags.push("weak_pathophysiology_language");
  } else if (shortForm) {
    const intro = sections.find((s) => s.kind === "intro");
    const core = sections.find((s) => s.kind === "core");
    const introW = intro ? countWords(intro.body) : 0;
    const coreW = core ? countWords(core.body) : 0;
    if (introW + coreW < 220) flags.push("thin_short_form_spine");
    if (!/\b(pathophysiolog|mechanism|etiology|physiology|assessment|monitor|nursing)\b/i.test(corpus) && words < 500)
      flags.push("weak_pathophysiology_language");
  } else if (shapeOk) {
    if (words < 320) flags.push("thin_nonstandard_shape");
  }

  if (words < 380) flags.push("thin_total_words");
  if (signals < 3) flags.push("few_clinical_signals");
  if (genericHits >= 6 && words < 900) flags.push("generic_boilerplate_heavy");

  const critical =
    flags.includes("missing_slug") ||
    flags.includes("unrecognized_section_shape") ||
    (flags.includes("generic_boilerplate_heavy") && words < 420);

  const missingSpine = detectMissingSpineSections(lesson);
  const score = priorityScore({ words, genericHits, flags, missingSpine });

  return {
    slug: lesson.slug,
    title: lesson.title,
    pathwayId,
    source,
    tier: inferTier(pathwayId || ""),
    bodySystem: lesson.bodySystem ?? "",
    topic: lesson.topic ?? "",
    topicSlug: lesson.topicSlug ?? "",
    words,
    genericHits,
    clinicalSignals: signals,
    premium,
    flags,
    critical: Boolean(critical),
    missingSpineSections: missingSpine,
    genericFillerFlags: flags.filter((f) => f.includes("generic") || f.includes("thin") || f.includes("weak")),
    priorityScore: score,
  };
}

/**
 * Walk pathway-lessons JSON and yield lesson locations for upgrades.
 * @param {string} pathwayDir absolute dir to pathway-lessons
 */
export function* walkPathwayCatalogLocations(pathwayDir) {
  const files = fs.readdirSync(pathwayDir).filter((f) => f.endsWith(".json"));
  for (const file of files) {
    if (SKIP_FILES.has(file)) continue;
    const fp = path.join(pathwayDir, file);
    let data;
    try {
      data = JSON.parse(fs.readFileSync(fp, "utf8"));
    } catch {
      continue;
    }
    if (!data.pathways || typeof data.pathways !== "object" || Array.isArray(data.pathways)) continue;
    for (const [pathwayId, bucket] of Object.entries(data.pathways)) {
      if (Array.isArray(bucket)) {
        for (let index = 0; index < bucket.length; index++) {
          const lesson = bucket[index];
          const pid = lesson.pathwayId || pathwayId;
          yield { filePath: fp, file: file, pathwayId: pid, pathwayKey: pathwayId, index, container: "array", lesson };
        }
        continue;
      }
      const lessons = bucket?.lessons;
      if (!Array.isArray(lessons)) continue;
      for (let index = 0; index < lessons.length; index++) {
        yield { filePath: fp, file, pathwayId, pathwayKey: pathwayId, index, container: "lessons", lesson: lessons[index] };
      }
    }
  }
}
