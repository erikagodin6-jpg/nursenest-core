/**
 * RN clinical expansion contract — shared by `scripts/rn-ai-expand-lessons.ts` and
 * `verify:lesson-content-depth` so generation and verification use identical rules.
 */
import { countWords, stripToPlainText } from "@/lib/content-quality/plain-text";
import type { PathwayLessonRecord, PathwayLessonSection } from "@/lib/lessons/pathway-lesson-types";

/** Twelve RN spine kinds expanded by the RN AI script (excludes risk_factors + linked_flashcard_prompts row). */
export const RN_EXPAND_REQUIRED_SECTION_KINDS = [
  "introduction",
  "pathophysiology_overview",
  "signs_symptoms",
  "labs_diagnostics",
  "treatments",
  "pharmacology",
  "nursing_assessment_interventions",
  "clinical_decision_making",
  "complications",
  "clinical_pearls",
  "client_education",
  "case_study",
] as const;

export type RNExpandRequiredSectionKind = (typeof RN_EXPAND_REQUIRED_SECTION_KINDS)[number];

export const RN_EXPAND_SECTION_WORD_MIN = 150;
export const RN_EXPAND_TOTAL_WORD_MIN = 1200;
export const RN_EXPAND_FLASHCARD_PROMPT_MIN = 8;
export const RN_EXPAND_FLASHCARD_PROMPT_STRING_MIN = 10;

export type ExpandedLessonValidation = {
  pass: boolean;
  totalWords: number;
  missingSections: string[];
  thinSections: Array<{ kind: string; words: number }>;
  missingClinicalRequirements: Array<{ kind: string; requirement: string }>;
  flashcardPromptCount: number;
  flashcardPromptErrors: string[];
};

/** Catalog JSON / expand scripts use loose rows; validators normalize internally. */
export type LessonLike = Pick<PathwayLessonRecord, "sections" | "title" | "slug"> & {
  linked_flashcard_prompts?: unknown;
};

function sectionMap(sections: PathwayLessonSection[] | undefined): Map<string, PathwayLessonSection> {
  const m = new Map<string, PathwayLessonSection>();
  for (const s of sections ?? []) {
    if (s?.kind && !m.has(String(s.kind))) m.set(String(s.kind), s);
  }
  return m;
}

function bodyPlainLower(body: string): string {
  return stripToPlainText(body ?? "").toLowerCase();
}

/** Collect flashcard prompt strings from top-level `linked_flashcard_prompts` and/or `linked_flashcard_prompts` section. */
export function extractLinkedFlashcardPromptStrings(lesson: LessonLike): { prompts: string[]; errors: string[] } {
  const errors: string[] = [];
  const out: string[] = [];

  const raw = lesson.linked_flashcard_prompts;
  if (raw !== undefined && raw !== null) {
    if (!Array.isArray(raw)) {
      errors.push("linked_flashcard_prompts: expected string[]");
    } else {
      raw.forEach((item, i) => {
        if (typeof item !== "string") {
          errors.push(`linked_flashcard_prompts[${i}]: not a string`);
          return;
        }
        const t = item.trim();
        if (t.length === 0) errors.push(`linked_flashcard_prompts[${i}]: empty`);
        else out.push(t);
      });
    }
  }

  const sec = (lesson.sections ?? []).find((s) => String(s.kind) === "linked_flashcard_prompts");
  if (sec?.body?.trim()) {
    const lines = stripToPlainText(sec.body)
      .split(/\n+/)
      .map((l) => l.replace(/^\s*[-*•\d.)]+\s*/, "").trim())
      .filter(Boolean);
    for (let i = 0; i < lines.length; i++) {
      const t = lines[i]!;
      if (t.length < RN_EXPAND_FLASHCARD_PROMPT_STRING_MIN) {
        errors.push(`section linked_flashcard_prompts line ${i}: too short (${t.length} chars)`);
      } else {
        out.push(t);
      }
    }
  }

  const seen = new Set<string>();
  const deduped: string[] = [];
  for (const p of out) {
    const k = p.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    deduped.push(p);
  }

  return { prompts: deduped, errors };
}

export type ExpandedLessonValidateOptions = {
  /** When set to a Canadian NP hub pathway, NP-specific clinical gates apply. */
  pathwayId?: string;
};

/** Canadian NP / CNPLE hub: same expanded-lesson spine as RN, with NP-specific validation gates when pathwayId is passed to {@link validateExpandedLesson}. */
export function isNpExpandPathwayId(pathwayId: string): boolean {
  return pathwayId === "ca-np-cnple";
}

function evalClinical(
  kind: RNExpandRequiredSectionKind,
  body: string,
  options?: ExpandedLessonValidateOptions,
): Array<{ kind: string; requirement: string }> {
  const t = bodyPlainLower(body);
  const miss: Array<{ kind: string; requirement: string }> = [];
  const need = (label: string, ok: boolean) => {
    if (!ok) miss.push({ kind, requirement: label });
  };
  const npPath = isNpExpandPathwayId(String(options?.pathwayId || ""));

  switch (kind) {
    case "pathophysiology_overview":
      need(
        "pathophysiology: mention cellular/receptor/inflammatory/mediator/enzyme/perfusion/oxygenation/acid-base/electrolyte/immune/endocrine/renal",
        npPath
          ? /\b(cellular|receptor|inflammatory|mediator|enzyme|perfusion|oxygenation|acid-base|acid base|electrolyte|immune|endocrine|renal|mechanism|pathophysiology|condition|features|inflammation|ischemia|fibrosis)\b/i.test(
              body,
            )
          : /\b(cellular|receptor|inflammatory|mediator|enzyme|perfusion|oxygenation|acid-base|acid base|electrolyte|immune|endocrine|renal)\b/i.test(
              body,
            ),
      );
      break;
    case "signs_symptoms":
      need("signs_symptoms: include early", /\bearly\b/i.test(t));
      need("signs_symptoms: include late or red flag", /\b(late|red flag)\b/i.test(t));
      need("signs_symptoms: include why/because/due to", /\b(why|because|due to)\b/i.test(t));
      break;
    case "labs_diagnostics":
      need(
        "labs_diagnostics: numeric value pattern (e.g. >100, <3.5, 0.04, 140 mmol/L)",
        /([<>]\s*\d+|\d+\.\d+|\d+\s*(mmol|meq|mg\/dl|g\/dl|units?\/l|ng\/ml|pg\/ml)\b|\d{2,}\s*(mg|mcg)\b)/i.test(
          body,
        ),
      );
      need("labs_diagnostics: critical/abnormal/diagnostic", /\b(critical|abnormal|diagnostic)\b/i.test(t));
      break;
    case "treatments":
      need(
        "treatments: medical/procedure/oxygen/fluid/surgery/device",
        /\b(medical|procedure|oxygen|fluid|surgery|device)\b/i.test(t),
      );
      need("treatments: rationale/because/goal", /\b(rationale|because|goal)\b/i.test(t));
      break;
    case "pharmacology":
      need(
        "pharmacology: mechanism/inhibits/blocks/stimulates/increases/decreases",
        npPath
          ? /\b(mechanism|inhibits|blocks|stimulates|increases|decreases|antibiotic|dose|mg|formulary|renal adjustment|contraindication)\b/i.test(t)
          : /\b(mechanism|inhibits|blocks|stimulates|increases|decreases)\b/i.test(t),
      );
      need(
        "pharmacology: side effect/adverse/contraindication/monitor",
        /\b(side effect|adverse|contraindication|monitor|stewardship|resistance)\b/i.test(t),
      );
      need(
        "pharmacology: drug class or medication-like term",
        /\b(ace|arb|beta|blocker|diuretic|antibiotic|anticoagulant|opioid|benzodiazepine|insulin|statin|ssri|nitrate|nsaid|steroid|heparin|warfarin|metformin|furosemide|medication|tablet|infusion|iv push|dosing)\b/i.test(
          t,
        ),
      );
      break;
    case "nursing_assessment_interventions":
      need("nursing_assessment_interventions: monitoring/monitor", /\b(monitoring|monitor)\b/i.test(t));
      need(
        "nursing_assessment_interventions: escalate/notify/provider/rapid response",
        /\b(escalate|notify|provider|rapid response)\b/i.test(t),
      );
      need("nursing_assessment_interventions: rationale/because/prevents", /\b(rationale|because|prevents)\b/i.test(t));
      break;
    case "clinical_decision_making":
      need("clinical_decision_making: priority/prioritize/first", /\b(priority|prioritize|first)\b/i.test(t));
      need(
        "clinical_decision_making: ABC/airway/breathing/circulation",
        /\b(abc|airway|breathing|circulation)\b/i.test(t),
      );
      need("clinical_decision_making: SBAR/rapid response/notify", /\b(sbar|rapid response|notify)\b/i.test(t));
      if (npPath) {
        need(
          "clinical_decision_making (NP): differential/diagnosis/narrow/rule out",
          /\b(differential|diagnosis|narrow|rule out|most likely|working diagnosis)\b/i.test(t),
        );
      }
      break;
    case "complications":
      need("complications: acute", /\bacute\b/i.test(t));
      need("complications: chronic", /\bchronic\b/i.test(t));
      need("complications: monitor/escalate/report", /\b(monitor|escalate|report)\b/i.test(t));
      break;
    case "clinical_pearls":
      need(
        "clinical_pearls: trap/common mistake/confused with",
        /\b(trap|common mistake|confused with)\b/i.test(t),
      );
      need("clinical_pearls: never/avoid/do not", /\b(never|avoid|do not|don't)\b/i.test(t));
      need("clinical_pearls: mnemonic/memory/pearl", /\b(mnemonic|memory|pearl)\b/i.test(t));
      break;
    case "client_education":
      need("client_education: teach-back", /\b(teach-back|teach back)\b/i.test(t));
      need(
        "client_education: call 911/emergency/seek immediate",
        /\b(call 911|911|emergency|seek immediate)\b/i.test(t),
      );
      need(
        "client_education: call provider/clinic/seek help",
        /(call provider|call the provider|clinic|seek help|contact provider)/i.test(t),
      );
      break;
    case "case_study":
      need("case_study: vital/BP/HR/SpO2/temperature", /\b(vital|bp|hr|spo2|temperature|temp)\b/i.test(t));
      need("case_study: first/priority", /\b(first|priority)\b/i.test(t));
      need("case_study: rationale", /\b(rationale)\b/i.test(t));
      break;
    case "introduction":
      need(
        "introduction: why it matters/clinically important/nursing priority/exam relevance",
        npPath
          ? /\b(why it matters|clinically important|nursing priority|exam relevance|np priority|cnple|nurse practitioner|primary care scope|clinical reasoning)\b/i.test(
              t,
            )
          : /\b(why it matters|clinically important|nursing priority|exam relevance)\b/i.test(t),
      );
      break;
    default:
      break;
  }
  return miss;
}

/**
 * Validates an RN expanded lesson against total words, per-section floors, clinical cues, and flashcard prompts.
 */
export function validateExpandedLesson(lesson: LessonLike, options?: ExpandedLessonValidateOptions): ExpandedLessonValidation {
  const sections = lesson.sections ?? [];
  const byKind = sectionMap(sections);
  let totalWords = 0;
  for (const s of sections) {
    totalWords += countWords(s.body ?? "");
  }

  const missingSections: string[] = [];
  const thinSections: Array<{ kind: string; words: number }> = [];
  const missingClinicalRequirements: Array<{ kind: string; requirement: string }> = [];

  for (const kind of RN_EXPAND_REQUIRED_SECTION_KINDS) {
    const sec = byKind.get(kind);
    const w = sec ? countWords(sec.body ?? "") : 0;
    if (!sec || !String(sec.body ?? "").trim()) {
      missingSections.push(kind);
      continue;
    }
    if (w < RN_EXPAND_SECTION_WORD_MIN) {
      thinSections.push({ kind, words: w });
    }
    missingClinicalRequirements.push(...evalClinical(kind, sec.body ?? "", options));
  }

  const { prompts, errors: flashErrors } = extractLinkedFlashcardPromptStrings(lesson);
  const flashcardPromptErrors = [...flashErrors];
  const validPrompts = prompts.filter((p) => p.trim().length >= RN_EXPAND_FLASHCARD_PROMPT_STRING_MIN);
  const flashcardPromptCount = validPrompts.length;
  if (flashcardPromptCount < RN_EXPAND_FLASHCARD_PROMPT_MIN) {
    flashcardPromptErrors.push(
      `need at least ${RN_EXPAND_FLASHCARD_PROMPT_MIN} prompts >= ${RN_EXPAND_FLASHCARD_PROMPT_STRING_MIN} chars (found ${flashcardPromptCount})`,
    );
  }

  const pass =
    totalWords >= RN_EXPAND_TOTAL_WORD_MIN &&
    missingSections.length === 0 &&
    thinSections.length === 0 &&
    missingClinicalRequirements.length === 0 &&
    flashcardPromptErrors.length === 0;

  return {
    pass,
    totalWords,
    missingSections,
    thinSections,
    missingClinicalRequirements,
    flashcardPromptCount,
    flashcardPromptErrors,
  };
}

/** Section kinds that should be regenerated (missing, thin body, or failed clinical checks). */
export function sectionKindsNeedingRegeneration(v: ExpandedLessonValidation): RNExpandRequiredSectionKind[] {
  const kinds = new Set<string>();
  for (const k of v.missingSections) kinds.add(k);
  for (const t of v.thinSections) kinds.add(t.kind);
  for (const m of v.missingClinicalRequirements) kinds.add(m.kind);
  return RN_EXPAND_REQUIRED_SECTION_KINDS.filter((k) => kinds.has(k));
}

export function isRnNclexExpandPathwayId(pathwayId: string): boolean {
  return pathwayId === "us-rn-nclex-rn" || pathwayId === "ca-rn-nclex-rn";
}

/** CA REx-PN + US NCLEX-PN (LPN) bundled catalogs — same expanded-lesson contract as RN. */
export function isRpnPnExpandPathwayId(pathwayId: string): boolean {
  return pathwayId === "ca-rpn-rex-pn" || pathwayId === "us-lpn-nclex-pn";
}

export function isNursingClinicalExpandPathwayId(pathwayId: string): boolean {
  return isRnNclexExpandPathwayId(pathwayId) || isRpnPnExpandPathwayId(pathwayId) || isNpExpandPathwayId(pathwayId);
}
