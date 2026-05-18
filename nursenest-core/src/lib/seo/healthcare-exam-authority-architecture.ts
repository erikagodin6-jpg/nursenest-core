/**
 * NurseNest healthcare exam SEO authority architecture.
 *
 * This is the source-of-truth planning and QA registry for the exam SEO ecosystem.
 * It intentionally separates live, indexable routes from planned expansion aliases
 * so we can scale topical coverage without shipping thin pages or dead links.
 */

export type HealthcareExamAuthorityFamily = "nclex-rn" | "rex-pn" | "cnple" | "np" | "allied";

export type HealthcareExamSearchIntent =
  | "exam-prep"
  | "practice-questions"
  | "test-bank"
  | "cat-exam"
  | "flashcards"
  | "study-guide"
  | "clinical-judgment"
  | "pharmacology"
  | "prioritization"
  | "sata"
  | "case-studies"
  | "free-practice";

export type HealthcareExamRouteStatus = "live" | "planned";

export type HealthcareExamSchemaKind =
  | "FAQPage"
  | "EducationalCourse"
  | "BreadcrumbList"
  | "Article"
  | "ItemList";

export type HealthcareExamAuthorityCta = {
  label: string;
  href: string;
  intent: "primary" | "secondary" | "upgrade" | "email-capture" | "study";
};

export type HealthcareExamAuthorityLink = {
  label: string;
  href: string;
  anchorVariants: readonly string[];
};

export type HealthcareExamAuthorityPillar = {
  id: string;
  family: HealthcareExamAuthorityFamily;
  label: string;
  canonicalPath: string;
  status: HealthcareExamRouteStatus;
  targetQueries: readonly string[];
  title: string;
  description: string;
  h1: string;
  robots: "index,follow";
  schema: readonly HealthcareExamSchemaKind[];
  conversionCtas: readonly HealthcareExamAuthorityCta[];
  internalLinks: readonly HealthcareExamAuthorityLink[];
};

export type HealthcareExamEcosystemPage = {
  id: string;
  family: HealthcareExamAuthorityFamily;
  pillarId: string;
  canonicalPath: string;
  /**
   * Short SEO alias requested by content strategy. Keep planned until a real
   * substantive route exists; never link/index aliases by default.
   */
  plannedAliasPath?: string;
  status: HealthcareExamRouteStatus;
  intent: HealthcareExamSearchIntent;
  targetQueries: readonly string[];
  title: string;
  description: string;
  schema: readonly HealthcareExamSchemaKind[];
  linksBackTo: string;
};

export type HealthcareExamTopicCluster = {
  id: string;
  families: readonly HealthcareExamAuthorityFamily[];
  canonicalPath?: string;
  canonicalTopic: string;
  targetQueries: readonly string[];
  pageIntent: HealthcareExamSearchIntent;
  requiredInternalLinks: readonly string[];
  status: HealthcareExamRouteStatus;
};

export type HealthcareExamAuthorityUrlInventoryRow = {
  kind: "pillar" | "ecosystem" | "topic-cluster";
  id: string;
  family: HealthcareExamAuthorityFamily;
  canonicalPath: string;
  plannedAliasPath?: string;
  status: HealthcareExamRouteStatus;
  title: string;
  targetQueries: readonly string[];
};

const REQUIRED_PILLAR_SCHEMA = ["FAQPage", "EducationalCourse", "BreadcrumbList"] as const;
const REQUIRED_HUB_SCHEMA = ["FAQPage", "BreadcrumbList", "ItemList"] as const;
const REQUIRED_ARTICLE_SCHEMA = ["FAQPage", "BreadcrumbList", "Article"] as const;
const REQUIRED_TEST_BANK_SCHEMA = ["FAQPage", "EducationalCourse", "BreadcrumbList", "ItemList"] as const;
const PHASE_1_LIVE_TEST_BANK_PAGE_IDS = new Set([
  "us-rn-nclex-rn-test-bank",
  "ca-rpn-rex-pn-test-bank",
  "ca-np-cnple-test-bank",
  "us-np-fnp-test-bank",
  "us-np-agpcnp-test-bank",
]);

function pillar(args: Omit<HealthcareExamAuthorityPillar, "robots" | "schema"> & {
  schema?: readonly HealthcareExamSchemaKind[];
}): HealthcareExamAuthorityPillar {
  return {
    ...args,
    robots: "index,follow",
    schema: args.schema ?? REQUIRED_PILLAR_SCHEMA,
  };
}

const productCtas = {
  rn: [
    { label: "Start NCLEX-RN questions", href: "/us/rn/nclex-rn/questions", intent: "primary" },
    { label: "Try CAT exam practice", href: "/us/rn/nclex-rn/cat", intent: "secondary" },
    { label: "Review RN lessons", href: "/us/rn/nclex-rn/lessons", intent: "study" },
  ],
  rex: [
    { label: "Start REx-PN questions", href: "/canada/rpn/rex-pn/questions", intent: "primary" },
    { label: "Try REx-PN CAT", href: "/canada/rpn/rex-pn/cat", intent: "secondary" },
    { label: "Review RPN lessons", href: "/canada/rpn/rex-pn/lessons", intent: "study" },
  ],
  cnple: [
    { label: "Start CNPLE questions", href: "/canada/np/cnple/questions", intent: "primary" },
    { label: "Review CNPLE lessons", href: "/canada/np/cnple/lessons", intent: "study" },
    { label: "Open CNPLE simulation", href: "/canada/np/cnple/simulation", intent: "secondary" },
  ],
  np: [
    { label: "Start NP questions", href: "/us/np/fnp/questions", intent: "primary" },
    { label: "Review NP lessons", href: "/us/np/fnp/lessons", intent: "study" },
    { label: "Compare NP prep", href: "/np-exam-prep", intent: "secondary" },
  ],
  allied: [
    { label: "Explore Allied Health", href: "/allied/allied-health", intent: "primary" },
    { label: "Open Allied lessons", href: "/allied/allied-health/lessons", intent: "study" },
    { label: "Practice Allied questions", href: "/allied/allied-health/questions", intent: "secondary" },
  ],
} as const satisfies Record<string, readonly HealthcareExamAuthorityCta[]>;

function link(label: string, href: string, anchorVariants: readonly string[]): HealthcareExamAuthorityLink {
  return { label, href, anchorVariants };
}

export const HEALTHCARE_EXAM_AUTHORITY_PILLARS = [
  pillar({
    id: "us-rn-nclex-rn",
    family: "nclex-rn",
    label: "NCLEX-RN United States",
    canonicalPath: "/us/rn/nclex-rn",
    status: "live",
    targetQueries: ["NCLEX RN exam prep", "NCLEX RN practice questions", "NCLEX test bank", "NCLEX CAT exam"],
    title: "NCLEX-RN Exam Prep, CAT Practice, Test Bank & Flashcards | NurseNest",
    description:
      "Prepare for NCLEX-RN with clinical judgment questions, CAT-style practice, rationales, flashcards, study plans, and weak-area remediation.",
    h1: "NCLEX-RN exam prep built around clinical judgment",
    conversionCtas: productCtas.rn,
    internalLinks: [
      link("NCLEX-RN practice questions", "/us/rn/nclex-rn/questions", ["NCLEX-RN practice questions", "RN question bank"]),
      link("NCLEX-RN CAT exams", "/us/rn/nclex-rn/cat", ["NCLEX CAT practice", "adaptive NCLEX exam"]),
      link("NCLEX-RN lessons", "/us/rn/nclex-rn/lessons", ["NCLEX lessons", "RN clinical judgment lessons"]),
    ],
  }),
  pillar({
    id: "ca-rpn-rex-pn",
    family: "rex-pn",
    label: "REx-PN Canada",
    canonicalPath: "/canada/rpn/rex-pn",
    status: "live",
    targetQueries: ["REx-PN exam prep", "REx-PN practice questions", "REx-PN question bank", "REx-PN CAT exam"],
    title: "REx-PN Exam Prep, CAT Practice & Question Bank | NurseNest",
    description:
      "Canadian RPN exam prep with REx-PN questions, CAT strategy, pharmacology, delegation, fundamentals, rationales, and client-needs review.",
    h1: "REx-PN exam prep for Canadian practical nurses",
    conversionCtas: productCtas.rex,
    internalLinks: [
      link("REx-PN practice questions", "/canada/rpn/rex-pn/questions", ["REx-PN practice questions", "RPN question bank"]),
      link("REx-PN CAT exam", "/canada/rpn/rex-pn/cat", ["REx-PN CAT exam", "adaptive REx-PN practice"]),
      link("REx-PN pharmacology", "/canada/rpn/rex-pn/pharmacology", ["REx-PN pharmacology", "practical nursing meds"]),
    ],
  }),
  pillar({
    id: "ca-np-cnple",
    family: "cnple",
    label: "CNPLE Canada",
    canonicalPath: "/canada/np/cnple",
    status: "live",
    targetQueries: ["CNPLE exam prep", "CNPLE practice questions", "CNPLE case studies", "Canadian NP exam prep"],
    title: "CNPLE Exam Prep, Case Studies & Canadian NP Questions | NurseNest",
    description:
      "Canadian NP licensure exam prep with CNPLE questions, LOFT-style simulation, case studies, prescribing safety, diagnostics, and clinical reasoning.",
    h1: "CNPLE exam prep for Canadian nurse practitioners",
    conversionCtas: productCtas.cnple,
    internalLinks: [
      link("CNPLE practice questions", "/canada/np/cnple/questions", ["CNPLE practice questions", "Canadian NP question bank"]),
      link("CNPLE case studies", "/canada/np/cnple/case-based-questions", ["CNPLE case studies", "NP clinical cases"]),
      link("CNPLE study guide", "/canada/np/cnple/study-guide", ["CNPLE study guide", "Canadian NP study plan"]),
    ],
  }),
  ...[
    ["us-np-fnp", "FNP exam prep", "/us/np/fnp"],
    ["us-np-agpcnp", "AGPCNP exam prep", "/us/np/agpcnp"],
    ["us-np-pmhnp", "PMHNP exam prep", "/us/np/pmhnp"],
  ].map(([id, label, canonicalPath]) =>
    pillar({
      id,
      family: "np" as const,
      label,
      canonicalPath,
      status: "live",
      targetQueries: [`${label}`, "NP practice questions", "NP clinical judgment", "NP case studies"],
      title: `${label}, Practice Questions & Clinical Judgment Cases | NurseNest`,
      description:
        "Nurse practitioner exam prep with case-based questions, diagnostics, prescribing safety, pharmacology, and clinical reasoning support.",
      h1: `${label} with clinical judgment practice`,
      conversionCtas: productCtas.np,
      internalLinks: [
        link("NP practice questions", `${canonicalPath}/questions`, ["NP practice questions", "NP question bank"]),
        link("NP lessons", `${canonicalPath}/lessons`, ["NP lessons", "clinical reasoning lessons"]),
        link("NP exam prep hub", "/np-exam-prep", ["NP exam prep", "nurse practitioner prep"]),
      ],
    }),
  ),
  ...[
    ["mlt", "Medical Laboratory Technology"],
    ["paramedic", "Paramedic"],
    ["respiratory", "Respiratory Therapy"],
    ["social-work", "Social Work"],
    ["occupational-therapy", "Occupational Therapy"],
    ["physiotherapy", "Physiotherapy"],
    ["psychotherapy", "Psychotherapy"],
    ["psw-hca", "PSW / HCA"],
  ].map(([professionKey, label]) =>
    pillar({
      id: `allied-${professionKey}`,
      family: "allied" as const,
      label,
      canonicalPath: `/allied/${professionKey}`,
      status: "live",
      targetQueries: [`${label} exam prep`, `${label} practice questions`, `${label} licensing exam`],
      title: `${label} Exam Prep & Practice Questions | NurseNest`,
      description:
        "Allied Health licensing exam prep with profession-scoped questions, flashcards, study guides, mock exams, and case scenarios.",
      h1: `${label} exam prep`,
      conversionCtas: productCtas.allied,
      internalLinks: [
        link("Allied lessons", "/allied/allied-health/lessons", ["Allied Health lessons", `${label} study lessons`]),
        link("Allied questions", "/allied/allied-health/questions", ["Allied Health questions", `${label} practice questions`]),
        link("Allied hub", "/allied/allied-health", ["Allied Health hub", "allied licensing exam prep"]),
      ],
    }),
  ),
] as const satisfies readonly HealthcareExamAuthorityPillar[];

const ecosystemBlueprints: readonly Omit<HealthcareExamEcosystemPage, "id" | "pillarId" | "family" | "canonicalPath" | "linksBackTo">[] = [
  {
    intent: "practice-questions",
    status: "live",
    targetQueries: ["practice questions", "exam questions with rationales", "free practice questions"],
    title: "Practice Questions With Rationales",
    description: "Pathway-scoped practice questions with rationales, weak-area signals, and remediation links.",
    schema: REQUIRED_HUB_SCHEMA,
    plannedAliasPath: undefined,
  },
  {
    intent: "test-bank",
    status: "planned",
    targetQueries: ["test bank", "question bank", "qbank"],
    title: "Test Bank and Question Bank",
    description: "Dedicated commercial test bank page covering rationales, CAT, SATA, analytics, and remediation.",
    schema: REQUIRED_TEST_BANK_SCHEMA,
    plannedAliasPath: undefined,
  },
  {
    intent: "cat-exam",
    status: "live",
    targetQueries: ["CAT exam", "adaptive exam", "computer adaptive testing"],
    title: "CAT Exam Practice",
    description: "Adaptive exam practice with readiness, pacing, confidence, and post-test remediation.",
    schema: REQUIRED_HUB_SCHEMA,
    plannedAliasPath: undefined,
  },
  {
    intent: "flashcards",
    status: "live",
    targetQueries: ["flashcards", "pharmacology flashcards", "clinical judgment flashcards"],
    title: "Flashcards and Spaced Recall",
    description: "Spaced recall flashcards tied to missed rationales, lessons, and weak topics.",
    schema: REQUIRED_HUB_SCHEMA,
    plannedAliasPath: undefined,
  },
  {
    intent: "study-guide",
    status: "planned",
    targetQueries: ["study guide", "exam study plan", "exam prep guide"],
    title: "Study Guide",
    description: "Long-form study guide with schedule, high-yield topics, exam format, and linked practice.",
    schema: REQUIRED_ARTICLE_SCHEMA,
    plannedAliasPath: undefined,
  },
] as const;

function ecosystemPathFor(pillar: HealthcareExamAuthorityPillar, intent: HealthcareExamSearchIntent): string {
  if (intent === "practice-questions") return `${pillar.canonicalPath}/questions`;
  if (intent === "cat-exam") return `${pillar.canonicalPath}/cat`;
  if (intent === "flashcards") return `${pillar.canonicalPath}/flashcards`;
  if (intent === "study-guide") return `${pillar.canonicalPath}/study-guide`;
  if (intent === "test-bank") return `${pillar.canonicalPath}/test-bank`;
  return pillar.canonicalPath;
}

function aliasBaseForFamily(family: HealthcareExamAuthorityFamily): string {
  if (family === "nclex-rn") return "/nclex-rn";
  if (family === "rex-pn") return "/rex-pn";
  if (family === "cnple") return "/cnple";
  if (family === "np") return "/np";
  return "/allied";
}

function aliasSlugForIntent(intent: HealthcareExamSearchIntent): string {
  if (intent === "practice-questions") return "practice-questions";
  if (intent === "cat-exam") return "cat-exams";
  if (intent === "flashcards") return "flashcards";
  if (intent === "study-guide") return "study-guide";
  if (intent === "test-bank") return "test-bank";
  return intent;
}

export const HEALTHCARE_EXAM_ECOSYSTEM_PAGES = HEALTHCARE_EXAM_AUTHORITY_PILLARS.flatMap((pillar) =>
  ecosystemBlueprints.map((blueprint) => {
    const id = `${pillar.id}-${blueprint.intent}`;
    return {
      ...blueprint,
      id,
      family: pillar.family,
      pillarId: pillar.id,
      canonicalPath: ecosystemPathFor(pillar, blueprint.intent),
      plannedAliasPath: `${aliasBaseForFamily(pillar.family)}/${aliasSlugForIntent(blueprint.intent)}`,
      status:
        PHASE_1_LIVE_TEST_BANK_PAGE_IDS.has(id)
          ? "live"
          : pillar.family === "allied" ? "planned" : blueprint.status,
      linksBackTo: pillar.canonicalPath,
    };
  }),
) as readonly HealthcareExamEcosystemPage[];

export const HEALTHCARE_EXAM_TOPIC_CLUSTERS = [
  {
    id: "insulin-nursing-questions",
    families: ["nclex-rn", "rex-pn", "np"],
    canonicalTopic: "Insulin safety and diabetes questions",
    targetQueries: ["insulin nursing questions", "diabetes nursing questions", "insulin NCLEX questions"],
    pageIntent: "pharmacology",
    requiredInternalLinks: ["/us/rn/nclex-rn/questions", "/canada/rpn/rex-pn/questions", "/canada/np/cnple/questions"],
    status: "planned",
  },
  {
    id: "copd-respiratory-questions",
    families: ["nclex-rn", "rex-pn", "allied"],
    canonicalTopic: "COPD and respiratory practice questions",
    targetQueries: ["COPD nursing questions", "respiratory therapy ABG questions", "oxygen therapy questions"],
    pageIntent: "practice-questions",
    requiredInternalLinks: ["/us/rn/nclex-rn/questions", "/canada/rpn/rex-pn/questions", "/allied/respiratory"],
    status: "planned",
  },
  {
    id: "ecg-nursing-questions",
    families: ["nclex-rn", "np", "allied"],
    canonicalPath: "/ecg/ecg-practice-questions",
    canonicalTopic: "ECG interpretation questions",
    targetQueries: ["ECG nursing questions", "paramedic ECG interpretation", "telemetry practice questions"],
    pageIntent: "clinical-judgment",
    requiredInternalLinks: ["/advanced-ecg-nursing", "/ecg/ecg-practice-questions", "/allied/paramedic"],
    status: "live",
  },
  {
    id: "dosage-calculations",
    families: ["nclex-rn", "rex-pn", "allied"],
    canonicalTopic: "Dosage calculation practice",
    targetQueries: ["dosage calculations", "med math nursing questions", "dosage calculation practice test"],
    pageIntent: "pharmacology",
    requiredInternalLinks: ["/tools/dosage-calculator", "/us/rn/nclex-rn/questions", "/canada/rpn/rex-pn/questions"],
    status: "planned",
  },
  {
    id: "prioritization-delegation-sata",
    families: ["nclex-rn", "rex-pn"],
    canonicalTopic: "Prioritization, delegation, and SATA questions",
    targetQueries: ["prioritization nursing questions", "delegation NCLEX questions", "SATA nursing questions"],
    pageIntent: "prioritization",
    requiredInternalLinks: ["/nclex-next-gen-question-types", "/us/rn/nclex-rn/questions", "/canada/rpn/rex-pn/questions"],
    status: "planned",
  },
  {
    id: "np-case-studies-diagnostics",
    families: ["cnple", "np"],
    canonicalTopic: "NP diagnostics, SOAP notes, and prescribing case studies",
    targetQueries: ["hypertension case studies NP", "SOAP note examples", "diagnostic interpretation NP", "prescribing safety"],
    pageIntent: "case-studies",
    requiredInternalLinks: ["/canada/np/cnple/case-based-questions", "/canada/np/cnple/questions", "/np-exam-prep"],
    status: "planned",
  },
  {
    id: "allied-competency-clusters",
    families: ["allied"],
    canonicalTopic: "Allied profession competency practice",
    targetQueries: ["paramedic test bank", "MLT hematology questions", "OT case studies", "psychotherapy ethics scenarios"],
    pageIntent: "practice-questions",
    requiredInternalLinks: ["/allied/paramedic", "/allied/mlt", "/allied/occupational-therapy", "/allied/psychotherapy"],
    status: "planned",
  },
] as const satisfies readonly HealthcareExamTopicCluster[];

export function listHealthcareExamAuthorityPillars(): readonly HealthcareExamAuthorityPillar[] {
  return HEALTHCARE_EXAM_AUTHORITY_PILLARS;
}

export function listHealthcareExamEcosystemPages(): readonly HealthcareExamEcosystemPage[] {
  return HEALTHCARE_EXAM_ECOSYSTEM_PAGES;
}

export function listHealthcareExamTopicClusters(): readonly HealthcareExamTopicCluster[] {
  return HEALTHCARE_EXAM_TOPIC_CLUSTERS;
}

export function buildHealthcareExamAuthorityUrlInventory(): HealthcareExamAuthorityUrlInventoryRow[] {
  const pillars = HEALTHCARE_EXAM_AUTHORITY_PILLARS.map((p) => ({
    kind: "pillar" as const,
    id: p.id,
    family: p.family,
    canonicalPath: p.canonicalPath,
    status: p.status,
    title: p.title,
    targetQueries: p.targetQueries,
  }));
  const ecosystem = HEALTHCARE_EXAM_ECOSYSTEM_PAGES.map((p) => ({
    kind: "ecosystem" as const,
    id: p.id,
    family: p.family,
    canonicalPath: p.canonicalPath,
    plannedAliasPath: p.plannedAliasPath,
    status: p.status,
    title: p.title,
    targetQueries: p.targetQueries,
  }));
  const clusters = (HEALTHCARE_EXAM_TOPIC_CLUSTERS as readonly HealthcareExamTopicCluster[]).map((p) => ({
    kind: "topic-cluster" as const,
    id: p.id,
    family: p.families[0]!,
    canonicalPath: p.canonicalPath ?? `/seo-cluster/${p.id}`,
    status: p.status,
    title: p.canonicalTopic,
    targetQueries: p.targetQueries,
  }));
  return [...pillars, ...ecosystem, ...clusters];
}

export function listLiveHealthcareExamAuthorityUrls(): string[] {
  return buildHealthcareExamAuthorityUrlInventory()
    .filter((row) => row.status === "live" && !row.canonicalPath.startsWith("/seo-cluster/"))
    .map((row) => row.canonicalPath);
}
