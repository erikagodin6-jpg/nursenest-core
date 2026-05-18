import type {
  EvidenceConfidence,
  EvidenceRiskDomain,
  EvidenceSource,
} from "./evidence-governance";

export type GuidelineOrganization =
  | "AHA"
  | "CDC"
  | "WHO"
  | "ADA"
  | "AACN"
  | "Surviving Sepsis Campaign"
  | "CNA"
  | "NICE"
  | "RNAO"
  | "Joint Commission"
  | "Custom";

export type ClinicalGuidelineDefinition = EvidenceSource & {
  organizationKey: GuidelineOrganization;
  specialty: string;
  regions: string[];
  keywords: string[];
  supersedes?: string[];
  expiresAfterMonths?: number;
  canonical: boolean;
};

export const clinicalGuidelineRegistry: ClinicalGuidelineDefinition[] = [
  {
    id: "aha-acls-2025",
    title: "AHA ACLS Guidelines 2025",
    organization: "American Heart Association",
    organizationKey: "AHA",
    sourceType: "clinical-guideline",
    publicationYear: 2025,
    version: "2025",
    confidence: "authoritative",
    riskDomains: ["cardiac-acls", "critical-care"],
    reviewCadenceMonths: 12,
    expiresAfterMonths: 24,
    specialty: "Cardiac emergency response",
    regions: ["US", "Canada", "Global"],
    keywords: [
      "acls",
      "cardiac arrest",
      "defibrillation",
      "tachycardia",
      "bradycardia",
      "cpr",
    ],
    canonical: true,
  },
  {
    id: "cdc-isolation-2024",
    title: "CDC Isolation Precautions Guidance",
    organization: "Centers for Disease Control and Prevention",
    organizationKey: "CDC",
    sourceType: "clinical-guideline",
    publicationYear: 2024,
    version: "2024",
    confidence: "authoritative",
    riskDomains: ["infection-control"],
    reviewCadenceMonths: 12,
    expiresAfterMonths: 24,
    specialty: "Infection prevention",
    regions: ["US", "Global"],
    keywords: [
      "ppe",
      "droplet",
      "airborne",
      "contact precautions",
      "infection control",
      "isolation",
    ],
    canonical: true,
  },
  {
    id: "ssc-sepsis-2024",
    title: "Surviving Sepsis Campaign Adult Guidelines",
    organization: "Society of Critical Care Medicine",
    organizationKey: "Surviving Sepsis Campaign",
    sourceType: "clinical-guideline",
    publicationYear: 2024,
    version: "2024",
    confidence: "authoritative",
    riskDomains: ["sepsis", "critical-care"],
    reviewCadenceMonths: 12,
    expiresAfterMonths: 24,
    specialty: "Sepsis management",
    regions: ["Global"],
    keywords: [
      "sepsis",
      "vasopressor",
      "fluid resuscitation",
      "shock",
      "lactate",
    ],
    canonical: true,
  },
  {
    id: "ada-diabetes-2025",
    title: "ADA Standards of Care in Diabetes",
    organization: "American Diabetes Association",
    organizationKey: "ADA",
    sourceType: "clinical-guideline",
    publicationYear: 2025,
    version: "2025",
    confidence: "authoritative",
    riskDomains: ["medication-safety"],
    reviewCadenceMonths: 12,
    expiresAfterMonths: 18,
    specialty: "Diabetes care",
    regions: ["US", "Canada", "Global"],
    keywords: [
      "insulin",
      "diabetes",
      "hypoglycemia",
      "hyperglycemia",
      "glucose",
    ],
    canonical: true,
  },
  {
    id: "rnao-delegation-2023",
    title: "RNAO Professional Practice and Delegation",
    organization: "Registered Nurses' Association of Ontario",
    organizationKey: "RNAO",
    sourceType: "professional-standard",
    publicationYear: 2023,
    version: "2023",
    confidence: "high",
    riskDomains: ["scope-of-practice"],
    reviewCadenceMonths: 18,
    expiresAfterMonths: 36,
    specialty: "Professional nursing standards",
    regions: ["Ontario", "Canada"],
    keywords: [
      "delegation",
      "scope",
      "assignment",
      "rpn",
      "lpn",
      "rn",
    ],
    canonical: true,
  },
];

export function searchClinicalGuidelines(query: string): ClinicalGuidelineDefinition[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return clinicalGuidelineRegistry;

  return clinicalGuidelineRegistry
    .map((guideline) => {
      const haystack = [
        guideline.title,
        guideline.organization,
        guideline.specialty,
        ...guideline.keywords,
        ...guideline.riskDomains,
      ]
        .join(" ")
        .toLowerCase();

      const score = guideline.keywords.filter((keyword) => normalized.includes(keyword)).length +
        (haystack.includes(normalized) ? 2 : 0);

      return {
        guideline,
        score,
      };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.guideline);
}

export function getGuidelinesForRiskDomain(
  domain: EvidenceRiskDomain,
): ClinicalGuidelineDefinition[] {
  return clinicalGuidelineRegistry.filter((guideline) =>
    guideline.riskDomains.includes(domain),
  );
}

export function getCanonicalGuideline(
  id: string,
): ClinicalGuidelineDefinition | undefined {
  return clinicalGuidelineRegistry.find((guideline) => guideline.id === id);
}

export function calculateGuidelineFreshness(
  guideline: ClinicalGuidelineDefinition,
  now = new Date(),
): {
  monthsOld: number | null;
  freshness: "current" | "aging" | "stale";
} {
  if (!guideline.publicationYear) {
    return {
      monthsOld: null,
      freshness: "aging",
    };
  }

  const monthsOld =
    (now.getFullYear() - guideline.publicationYear) * 12 + now.getMonth();
  const staleThreshold = guideline.expiresAfterMonths ?? guideline.reviewCadenceMonths * 2;

  if (monthsOld >= staleThreshold) {
    return {
      monthsOld,
      freshness: "stale",
    };
  }

  if (monthsOld >= staleThreshold * 0.7) {
    return {
      monthsOld,
      freshness: "aging",
    };
  }

  return {
    monthsOld,
    freshness: "current",
  };
}
