/**
 * Admissions prep (HESI A2, HESI Exit, ATI TEAS) — content taxonomy for Phase 2 internal scaffolding.
 * IDs are stable prefixes for future lesson imports, practice pools, and flashcard decks (not wired yet).
 *
 * Public launch requires the written gate in `docs/governance/admissions-prep-launch-gate.md` (no partial launch).
 *
 * @see docs/reports/hesi-teas-architecture-readiness.md
 */
import type { InternalAdmissionsPrepPathwayId } from "@/lib/exam-pathways/admissions-prep-internal-pathways";

export type AdmissionsPrepExamKind = "hesi_a2" | "hesi_exit" | "ati_teas";

/** One subject/domain row with future pipeline identifiers (lesson category, pools). */
export type AdmissionsPrepDomainRow = {
  /** Unique within the exam kind (used for anchors + future imports). */
  slug: string;
  label: string;
  /** Future PathwayLesson / curriculum category key (prefix `nn.lesson_cat.admissions`). */
  lessonCategoryId: string;
  /** Future `exam_questions.exam` or pool namespace (prefix `nn.practice_pool.admissions`). */
  practicePoolId: string;
  /** Future flashcard deck namespace (prefix `nn.flashcard_pool.admissions`). */
  flashcardPoolId: string;
};

export type AdmissionsPrepExamTaxonomy = {
  kind: AdmissionsPrepExamKind;
  examOverview: string;
  subjectsOrDomains: AdmissionsPrepDomainRow[];
  questionFormatExpectations: string[];
  studyPlanPreviewBullets: string[];
  staffPreviewNotes: string;
  /** Planned CAT/adaptive enablement after pools + eligibility review (not active). */
  futureCatEligible: boolean;
  /** Planned adaptive practice enablement (not active). */
  futureAdaptivePracticeEligible: boolean;
};

const PREFIX_LESSON = "nn.lesson_cat.admissions";
const PREFIX_PRACTICE = "nn.practice_pool.admissions";
const PREFIX_FLASH = "nn.flashcard_pool.admissions";

function domain(
  exam: AdmissionsPrepExamKind,
  slug: string,
  label: string,
): AdmissionsPrepDomainRow {
  return {
    slug,
    label,
    lessonCategoryId: `${PREFIX_LESSON}.${exam}.${slug}`,
    practicePoolId: `${PREFIX_PRACTICE}.${exam}.${slug}`,
    flashcardPoolId: `${PREFIX_FLASH}.${exam}.${slug}`,
  };
}

/** HESI A2 — eight scored sections (program-dependent weights vary by school). */
export const HESI_A2_TAXONOMY: AdmissionsPrepExamTaxonomy = {
  kind: "hesi_a2",
  examOverview:
    "HESI Admission Assessment (HESI A2) is a multi-section admissions exam used by many nursing programs. NurseNest will map content to official domains as pools and lessons are imported — this overview is informational only until launch.",
  subjectsOrDomains: [
    domain("hesi_a2", "anatomy_physiology", "Anatomy & physiology"),
    domain("hesi_a2", "vocabulary", "Vocabulary"),
    domain("hesi_a2", "grammar", "Grammar"),
    domain("hesi_a2", "reading_comprehension", "Reading comprehension"),
    domain("hesi_a2", "chemistry", "Chemistry"),
    domain("hesi_a2", "biology", "Biology"),
    domain("hesi_a2", "math", "Math"),
    domain("hesi_a2", "critical_thinking", "Critical thinking"),
  ],
  questionFormatExpectations: [
    "Computer-delivered, multi-section timed assessments (program-specific policies).",
    "Primarily selected-response items; some programs enable calculator policies per section.",
    "Scores and composite rules vary by institution — NurseNest surfaces preparation, not official scoring.",
  ],
  studyPlanPreviewBullets: [
    "Diagnostic baseline across eight domains (future feature).",
    "Weekly pacing toward target test date with weakness-first remediation (planned).",
    "Timed section drills once practice pools are tagged (planned).",
  ],
  staffPreviewNotes:
    "Verify Evolve / Elsevier naming and section availability against each partner program before public copy. Do not imply affiliation until legal/compliance review.",
  futureCatEligible: true,
  futureAdaptivePracticeEligible: true,
};

/** HESI Exit — specialty bundles vary by program; domains below are typical clusters. */
export const HESI_EXIT_TAXONOMY: AdmissionsPrepExamTaxonomy = {
  kind: "hesi_exit",
  examOverview:
    "HESI Exit exams assess readiness near program completion. Content domains vary by program option — taxonomy rows are structural placeholders for future lesson/pool mapping.",
  subjectsOrDomains: [
    domain("hesi_exit", "med_surg", "Medical–surgical"),
    domain("hesi_exit", "pharmacology", "Pharmacology"),
    domain("hesi_exit", "pediatrics", "Pediatrics"),
    domain("hesi_exit", "ob_maternal", "OB / maternal–newborn"),
    domain("hesi_exit", "mental_health", "Mental health"),
    domain("hesi_exit", "leadership", "Leadership / management"),
    domain("hesi_exit", "prioritization_delegation", "Prioritization & delegation"),
  ],
  questionFormatExpectations: [
    "Exit-item styles include scenario-based prioritization and clinical judgement stems.",
    "Program-specific forms (custom exams) may apply — scope content per cohort.",
    "Alignment to NCLEX-style reasoning without copying proprietary items.",
  ],
  studyPlanPreviewBullets: [
    "Rotation-aware review schedule tied to weak domains (planned).",
    "High-yield pharmacology and safety lanes for repeat misses (planned).",
    "Exit readiness signals layered on top of course progress (future analytics).",
  ],
  staffPreviewNotes:
    "Exit pathways must not be sold as official HESI replicas. Coordinate pool tagging with clinical SMEs before adaptive rollout.",
  futureCatEligible: true,
  futureAdaptivePracticeEligible: true,
};

/** ATI TEAS — four scored domains for many nursing programs. */
export const ATI_TEAS_TAXONOMY: AdmissionsPrepExamTaxonomy = {
  kind: "ati_teas",
  examOverview:
    "ATI TEAS (Test of Essential Academic Skills) measures essential academic skills for health science program entry. NurseNest will align lesson and pool taxonomy to ATI domain structure during content import.",
  subjectsOrDomains: [
    domain("ati_teas", "reading", "Reading"),
    domain("ati_teas", "math", "Math"),
    domain("ati_teas", "science", "Science"),
    domain("ati_teas", "english_language", "English & language usage"),
  ],
  questionFormatExpectations: [
    "Standardized timing per section; national norms vary by cohort — preparation focuses on skills, not guarantees.",
    "Selected-response formats with science integrated across biology, chemistry, A&P as configured in TEAS.",
    "Accessibility and accommodations follow ATI / testing-center policies (reference official guides).",
  ],
  studyPlanPreviewBullets: [
    "Four-domain baseline diagnostic (planned).",
    "Cross-domain study calendar with science-heavy weeks optional (planned).",
    "Vocabulary and reading-speed drills as premium add-ons (future).",
  ],
  staffPreviewNotes:
    "Confirm trademark / naming compliance for ATI TEAS public pages before launch. Internal scaffold only until marketing approval.",
  futureCatEligible: true,
  futureAdaptivePracticeEligible: true,
};

export const ADMISSIONS_PREP_TAXONOMY_BY_KIND: Record<AdmissionsPrepExamKind, AdmissionsPrepExamTaxonomy> = {
  hesi_a2: HESI_A2_TAXONOMY,
  hesi_exit: HESI_EXIT_TAXONOMY,
  ati_teas: ATI_TEAS_TAXONOMY,
};

export const INTERNAL_ADMISSIONS_PATHWAY_ID_TO_KIND: Record<InternalAdmissionsPrepPathwayId, AdmissionsPrepExamKind> = {
  "us-allied-hesi-a2": "hesi_a2",
  "us-allied-hesi-exit": "hesi_exit",
  "us-allied-ati-teas": "ati_teas",
};

export function getAdmissionsPrepTaxonomyForPathwayId(pathwayId: string): AdmissionsPrepExamTaxonomy | null {
  const kind = INTERNAL_ADMISSIONS_PATHWAY_ID_TO_KIND[pathwayId as InternalAdmissionsPrepPathwayId];
  if (!kind) return null;
  return ADMISSIONS_PREP_TAXONOMY_BY_KIND[kind];
}

/** Prefixed pipeline IDs — globally unique across all admissions exams. */
export function collectPrefixedAdmissionsPrepTaxonomyIds(): string[] {
  const out: string[] = [];
  for (const tax of Object.values(ADMISSIONS_PREP_TAXONOMY_BY_KIND)) {
    for (const row of tax.subjectsOrDomains) {
      out.push(row.lessonCategoryId, row.practicePoolId, row.flashcardPoolId);
    }
  }
  return out;
}

/** Slugs are unique within one exam kind only (e.g. `math` may appear under HESI A2 and TEAS). */
export function validateAdmissionsPrepTaxonomyUniqueIds(): { ok: true } | { ok: false; duplicates: string[] } {
  const ids = collectPrefixedAdmissionsPrepTaxonomyIds();
  const seen = new Set<string>();
  const duplicates: string[] = [];
  for (const id of ids) {
    if (seen.has(id)) duplicates.push(id);
    seen.add(id);
  }
  if (duplicates.length) return { ok: false, duplicates };

  const slugDup: string[] = [];
  for (const tax of Object.values(ADMISSIONS_PREP_TAXONOMY_BY_KIND)) {
    const slugs = new Set<string>();
    for (const row of tax.subjectsOrDomains) {
      if (slugs.has(row.slug)) slugDup.push(`${tax.kind}:${row.slug}`);
      slugs.add(row.slug);
    }
  }
  return slugDup.length ? { ok: false, duplicates: slugDup } : { ok: true };
}
