import { getSnapshotCounts } from "@/lib/navigation/country-exam-readiness-snapshot";
import { EXAM_PATHWAYS } from "@/lib/exam-pathways/exam-product-registry";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";

export const NP_CERTIFICATION_PATHWAY_COOKIE = "nn_np_certification_pathway" as const;

export type NpCertificationCountry = "Canada" | "United States";

export type NpCertificationPathway = {
  pathwayId: string;
  country: NpCertificationCountry;
  name: string;
  shortName: string;
  description: string;
  expectedRole: string;
  questions: number;
  lessons: number;
  flashcardsLabel: string;
  simulationsLabel: string;
  readinessTrackingLabel: string;
  hint: string;
  clinicalPearl: string;
  rationaleScope: string;
  readinessDomains: readonly string[];
  hubHref: string;
};

const NP_PATHWAY_DETAILS: Record<
  string,
  Pick<
    NpCertificationPathway,
    | "description"
    | "expectedRole"
    | "flashcardsLabel"
    | "simulationsLabel"
    | "readinessTrackingLabel"
    | "hint"
    | "clinicalPearl"
    | "rationaleScope"
    | "readinessDomains"
  >
> = {
  "ca-np-cnple": {
    description: "Canadian NP licensure prep aligned to CNPLE clinical judgment, Canadian scope, prescribing, diagnostics, and LOFT-style simulation.",
    expectedRole: "Canadian nurse practitioner entry-to-practice licensure",
    flashcardsLabel: "CNPLE-aligned flashcards",
    simulationsLabel: "LOFT simulation",
    readinessTrackingLabel: "Canadian NP competency readiness",
    hint: "Focus on Canadian NP scope, clinical decision-making, health promotion, and when regulator-aware escalation is required.",
    clinicalPearl: "Canadian NP practice rewards safe independent reasoning paired with clear referral thresholds and jurisdiction-aware scope.",
    rationaleScope: "CNPLE rationales should use Canadian NP competency language and should not read like a U.S. FNP board item.",
    readinessDomains: ["Canadian NP Competencies", "Clinical Decision-Making", "Leadership", "Health Promotion"],
  },
  "us-np-fnp": {
    description: "Family NP board preparation for lifespan primary care, prevention, chronic disease, pediatrics, women's health, and safe prescribing.",
    expectedRole: "Family Nurse Practitioner primary care practice",
    flashcardsLabel: "FNP-scoped flashcards",
    simulationsLabel: "Primary care clinical scenarios",
    readinessTrackingLabel: "FNP domain readiness",
    hint: "Consider the most appropriate primary care management strategy.",
    clinicalPearl: "Hypertension management often requires individualized treatment goals based on risk, comorbidities, and follow-up reliability.",
    rationaleScope: "FNP rationales should emphasize primary care management, lifespan prevention, and when to refer.",
    readinessDomains: ["Primary Care", "Women's Health", "Pediatrics", "Chronic Disease", "Health Promotion"],
  },
  "us-np-agpcnp": {
    description: "Adult-Gerontology Primary Care NP prep focused on adult chronic disease, functional status, multimorbidity, and geriatric safety.",
    expectedRole: "Adult-Gerontology Primary Care Nurse Practitioner",
    flashcardsLabel: "AGPCNP-scoped flashcards",
    simulationsLabel: "Adult-gerontology primary care scenarios",
    readinessTrackingLabel: "AGPCNP domain readiness",
    hint: "Think about chronic disease management, functional status, medication burden, and adult-gerontology risk.",
    clinicalPearl: "Functional decline can be a more urgent geriatric signal than a single abnormal value in isolation.",
    rationaleScope: "AGPCNP rationales should foreground adult chronic disease, geriatric syndromes, polypharmacy, and function.",
    readinessDomains: ["Adult Primary Care", "Geriatric Syndromes", "Chronic Disease", "Polypharmacy", "Functional Status"],
  },
  "us-np-pmhnp": {
    description: "Psychiatric-Mental Health NP prep covering psychiatric assessment, therapy foundations, psychopharmacology, and crisis management.",
    expectedRole: "Psychiatric-Mental Health Nurse Practitioner",
    flashcardsLabel: "PMHNP-scoped flashcards",
    simulationsLabel: "Psychiatric assessment scenarios",
    readinessTrackingLabel: "PMHNP domain readiness",
    hint: "Focus on psychiatric assessment, safety risk, therapeutic communication, and evidence-based interventions.",
    clinicalPearl: "Therapeutic alliance is one of the strongest predictors of psychiatric outcomes.",
    rationaleScope: "PMHNP rationales should prioritize psychiatric diagnosis, risk assessment, therapy choices, and psychopharmacology safety.",
    readinessDomains: ["Psychiatric Assessment", "Therapeutic Communication", "Psychopharmacology", "Crisis Management"],
  },
  "us-np-whnp": {
    description: "Women's Health NP prep for reproductive health, screening, prevention, gynecology, prenatal safety, and hormone-related prescribing.",
    expectedRole: "Women's Health Nurse Practitioner",
    flashcardsLabel: "WHNP-scoped flashcards",
    simulationsLabel: "Women's health clinical scenarios",
    readinessTrackingLabel: "WHNP domain readiness",
    hint: "Consider reproductive health screening, prevention, pregnancy status, and hormone-related safety.",
    clinicalPearl: "Routine preventive care often identifies reproductive and gynecologic issues before symptoms become obvious.",
    rationaleScope: "WHNP rationales should center reproductive health, gynecology, prenatal considerations, screening, and prevention.",
    readinessDomains: ["Prenatal Care", "Gynecology", "Reproductive Health", "Screening", "Hormonal Therapy Safety"],
  },
  "us-np-pnp-pc": {
    description: "Pediatric Primary Care NP prep for growth, development, immunizations, common pediatric conditions, and family-centered care.",
    expectedRole: "Pediatric Primary Care Nurse Practitioner",
    flashcardsLabel: "PNP-PC-scoped flashcards",
    simulationsLabel: "Pediatric primary care scenarios",
    readinessTrackingLabel: "PNP-PC domain readiness",
    hint: "Review age-specific developmental considerations, weight-based safety, and family-centered anticipatory guidance.",
    clinicalPearl: "Growth and development are central to pediatric assessment because subtle delays can be the first clinical clue.",
    rationaleScope: "PNP-PC rationales should use age-specific developmental, dosing, immunization, and caregiver education reasoning.",
    readinessDomains: ["Growth & Development", "Pediatric Assessment", "Immunizations", "Family Education", "Weight-Based Safety"],
  },
};

function countryLabel(pathway: ExamPathwayDefinition): NpCertificationCountry {
  return pathway.countryCode === "CA" ? "Canada" : "United States";
}

function hubHref(pathway: ExamPathwayDefinition): string {
  return `/${pathway.countrySlug}/np/${pathway.examCode}`;
}

export function listNpCertificationPathways(): NpCertificationPathway[] {
  return EXAM_PATHWAYS.filter((p) => p.roleTrack === "np" && p.status !== "hidden")
    .map((pathway) => {
      const details = NP_PATHWAY_DETAILS[pathway.id] ?? {
        description: pathway.seoDescription,
        expectedRole: pathway.boardLabel,
        flashcardsLabel: `${pathway.shortName} flashcards`,
        simulationsLabel: `${pathway.shortName} simulations`,
        readinessTrackingLabel: `${pathway.shortName} readiness`,
        hint: "Use the selected NP certification scope to decide what finding, diagnosis, or intervention matters most.",
        clinicalPearl: "Advanced practice questions reward scope-aware reasoning, not generic nursing recall.",
        rationaleScope: `${pathway.shortName} rationales should stay scoped to this certification pathway.`,
        readinessDomains: [pathway.shortName, "Clinical Decision-Making", "Patient Safety"],
      };
      const counts = getSnapshotCounts(pathway.id);
      return {
        pathwayId: pathway.id,
        country: countryLabel(pathway),
        name: pathway.displayName,
        shortName: pathway.shortName,
        description: details.description,
        expectedRole: details.expectedRole,
        questions: counts.questions,
        lessons: counts.lessons,
        flashcardsLabel: details.flashcardsLabel,
        simulationsLabel: details.simulationsLabel,
        readinessTrackingLabel: details.readinessTrackingLabel,
        hint: details.hint,
        clinicalPearl: details.clinicalPearl,
        rationaleScope: details.rationaleScope,
        readinessDomains: details.readinessDomains,
        hubHref: hubHref(pathway),
      };
    })
    .sort((a, b) => {
      if (a.country !== b.country) return a.country === "Canada" ? -1 : 1;
      if (a.pathwayId === "us-np-fnp") return -1;
      if (b.pathwayId === "us-np-fnp") return 1;
      return a.shortName.localeCompare(b.shortName);
    });
}

export function isNpCertificationPathwayId(pathwayId: string | null | undefined): pathwayId is string {
  const id = pathwayId?.trim();
  return Boolean(id && listNpCertificationPathways().some((pathway) => pathway.pathwayId === id));
}

export function getNpCertificationPathway(pathwayId: string | null | undefined): NpCertificationPathway | null {
  const id = pathwayId?.trim();
  if (!id) return null;
  return listNpCertificationPathways().find((pathway) => pathway.pathwayId === id) ?? null;
}

export function defaultNpCertificationPathwayId(): string {
  return listNpCertificationPathways().find((pathway) => pathway.pathwayId === "us-np-fnp")?.pathwayId ?? "us-np-fnp";
}

export function normalizeNpCertificationPathwayId(pathwayId: string | null | undefined): string | null {
  const id = pathwayId?.trim();
  return isNpCertificationPathwayId(id) ? id : null;
}
