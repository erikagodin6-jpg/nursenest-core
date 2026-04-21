/**
 * Pathway-scoped programmatic SEO pages served at
 * `/{country}/{role}/{examCode}/{seoSlug}` (marketing hub + long-tail slug).
 *
 * **Sitemap:** list these only in the default (non-`/{lang}`) urlset (`collectPathwayTopicProgrammaticUrls`).
 * Do not prefix marketing locale codes (`/fr/`, `/es/`, …) — those URLs are not routed and return 404.
 *
 * Content is registry-backed (no DB reads). Sitemap emission is bounded; see
 * `MAX_PATHWAY_TOPIC_PROGRAMMATIC_SITEMAP_URLS`.
 */
import { ExamFamily } from "@prisma/client";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { listPublishedExamPathwaysForPublicSite } from "@/lib/navigation/country-exam-launch-readiness";
import type { SeoCluster, SeoPageDefinition } from "@/lib/seo/programmatic-registry";
import type { SeoPageKind } from "@/lib/seo/programmatic-page-kind";
import { PROGRAMMATIC_SEO_ISR_REVALIDATE_SECONDS } from "@/lib/seo/programmatic-registry-constants";

export { PROGRAMMATIC_SEO_ISR_REVALIDATE_SECONDS as PATHWAY_TOPIC_PROGRAMMATIC_REVALIDATE_SECONDS };

/** Safety rail for sitemap + build size. */
export const MAX_PATHWAY_TOPIC_PROGRAMMATIC_SITEMAP_URLS = 2_000;

const SITE = "NurseNest";

type BodyTopic = {
  key: string;
  label: string;
  lead: string;
  studyTip: string;
};

const BODY_SYSTEMS: BodyTopic[] = [
  {
    key: "cardiovascular",
    label: "cardiovascular",
    lead:
      "Cardiovascular items on nursing exams expect you to connect vitals, labs, medications, and priority actions—not just name anatomy.",
    studyTip:
      "After each block, write a one-line rule you used (for example, perfusion vs pump failure) and re-try missed items the next day.",
  },
  {
    key: "respiratory",
    label: "respiratory",
    lead:
      "Respiratory scenarios test oxygenation, airway protection, infection control, and when to escalate care versus monitor.",
    studyTip: "Pair ABG or SpO₂ trends with the intervention you chose so rationales stick as patterns, not isolated facts.",
  },
  {
    key: "renal-and-fluid",
    label: "renal and fluid balance",
    lead:
      "Renal and electrolyte questions often hinge on fluid volume status, diuretics, and dangerous shifts (potassium, sodium).",
    studyTip: "Track intake/output assumptions the item implies before reading answer choices—misread volume status is a common trap.",
  },
  {
    key: "gastrointestinal",
    label: "gastrointestinal",
    lead:
      "GI nursing items blend nutrition, bleeding risk, infection, and post-procedure monitoring across acute and chronic presentations.",
    studyTip: "For each topic batch, list red-flag findings that change priority (peritonitis, hemodynamic compromise, obstruction).",
  },
  {
    key: "neurological",
    label: "neurological",
    lead:
      "Neuro questions emphasize level of consciousness, stroke timelines, seizure safety, and spinal precautions when cues support them.",
    studyTip: "Rehearse a short mental script for neuro checks and escalation so you do not over-intervene on stable cues.",
  },
  {
    key: "endocrine",
    label: "endocrine",
    lead:
      "Endocrine prep ties glucose management, thyroid extremes, adrenal crisis signals, and education for self-monitoring.",
    studyTip: "Compare “too high vs too low” symptom clusters for the same hormone axis to reduce sign confusion under pressure.",
  },
  {
    key: "musculoskeletal",
    label: "musculoskeletal",
    lead:
      "MSK items cover mobility, falls, joint surgery pathways, and pain control with safety limits for sedation and opioids.",
    studyTip: "Link weight-bearing orders and PT/OT milestones to complication risks (DVT, dislocation) as you review.",
  },
  {
    key: "immune-and-infection",
    label: "immune and infection",
    lead:
      "Immune and infection scenarios stress isolation, antibiotic stewardship clues, sepsis recognition, and vulnerable populations.",
    studyTip: "Practice naming the *first* nursing action implied by vitals and culture timing—not the eventual discharge plan.",
  },
];

type PharmTopic = { key: string; label: string; angle: string };

const PHARM_TOPICS: PharmTopic[] = [
  {
    key: "cardiac-meds",
    label: "cardiac medications",
    angle: "antihypertensives, antidysrhythmics, and drugs that affect preload/afterload",
  },
  {
    key: "diabetes-meds",
    label: "diabetes medications",
    angle: "insulin types, oral agents, hypoglycemia recognition, and sick-day education",
  },
  {
    key: "antibiotics",
    label: "antibiotic stewardship",
    angle: "indications, adverse effects, renal adjustments, and teaching for adherence",
  },
  {
    key: "pain-and-sedation",
    label: "pain and sedation",
    angle: "opioid safety, adjuvants, assessment scales, and respiratory depression monitoring",
  },
];

type LabTopic = { key: string; label: string; focus: string };

const LAB_TOPICS: LabTopic[] = [
  {
    key: "cbc",
    label: "CBC",
    focus: "anemia patterns, infection clues, and when trends matter more than a single value",
  },
  {
    key: "bmp",
    label: "basic metabolic panel",
    focus: "renal function, electrolytes, and volume status interpretation for nursing priorities",
  },
  {
    key: "abg",
    label: "ABGs",
    focus: "acid-base compensation, oxygenation problems, and the next assessment step",
  },
  {
    key: "coagulation",
    label: "coagulation studies",
    focus: "bleeding risk, anticoagulant effects, and procedural hold teaching",
  },
  {
    key: "liver-panel",
    label: "liver panels",
    focus: "jaundice pathways, medication metabolism concerns, and escalation cues",
  },
];

type PrioTopic = { key: string; label: string; frame: string };

const PRIORITIZATION_TOPICS: PrioTopic[] = [
  {
    key: "airway-first",
    label: "airway and breathing first",
    frame: "when ABC stability should win over a convenient but non-urgent task",
  },
  {
    key: "safety-and-infection",
    label: "safety and infection control",
    frame: "isolation, falls, and immediate harm reduction versus documentation or comfort-only tasks",
  },
  {
    key: "unstable-vitals",
    label: "unstable vital signs",
    frame: "trend recognition, who to assess first, and when to activate rapid response",
  },
  {
    key: "new-onset-neuro",
    label: "new neuro deficits",
    frame: "time-sensitive escalation, positioning, and monitoring frequency",
  },
];

function linkPackForPathwayId(id: string): NonNullable<SeoPageDefinition["linkPack"]> {
  if (id.includes("allied")) return "allied";
  if (id.includes("np-")) return "np";
  if (id.includes("lpn") || id === "ca-rpn-rex-pn") return "nclex-pn";
  return "nclex-rn";
}

function clusterForPathwayId(id: string): SeoCluster {
  if (id.includes("allied")) return "allied";
  if (id.includes("np-")) return "exam-np";
  if (id.includes("lpn") || id === "ca-rpn-rex-pn") return "exam-pn";
  return "exam-nclex";
}

/** Long-tail slug prefix per pathway (exam-specific wording). */
function practiceSlugPrefix(pathwayId: string): string | null {
  switch (pathwayId) {
    case "us-rn-nclex-rn":
    case "ca-rn-nclex-rn":
      return "nclex-rn-practice-questions";
    case "us-lpn-nclex-pn":
      return "nclex-pn-practice-questions";
    case "ca-rpn-rex-pn":
      return "rex-pn-practice-questions";
    case "us-np-fnp":
    case "us-np-agpcnp":
    case "us-np-pmhnp":
    case "us-np-whnp":
    case "us-np-pnp-pc":
    case "ca-np-cnple":
      return "np-clinical-practice";
    case "us-allied-core":
    case "ca-allied-core":
      return "nursing-practice-questions";
    default:
      return null;
  }
}

function lessonsAngleSlug(pathwayId: string, body: BodyTopic): string {
  if (pathwayId.includes("allied")) {
    return `rn-lessons-${body.key}`;
  }
  if (pathwayId.includes("np-")) {
    return `np-lessons-${body.key}`;
  }
   if (pathwayId === "us-lpn-nclex-pn" || pathwayId === "ca-rpn-rex-pn") {
    return `pn-lessons-${body.key}`;
  }
  return `rn-lessons-${body.key}`;
}

function buildBodyPracticePage(pathway: ExamPathwayDefinition, body: BodyTopic, seoSlug: string): SeoPageDefinition {
  const pack = linkPackForPathwayId(pathway.id);
  const cluster = clusterForPathwayId(pathway.id);
  const h1 = `${pathway.shortName} practice questions — ${body.label}`;
  return {
    slug: seoSlug,
    title: `${h1} | ${SITE}`,
    description: `Pathway-scored practice for ${body.label} on ${pathway.displayName}. ${body.lead.slice(0, 120)}…`,
    h1,
    cluster,
    pageKind: "topic-guide" satisfies SeoPageKind,
    keywords: [pathway.shortName, body.label, "practice questions", "nursing exam"],
    linkPack: pack,
    practiceConversion: false,
    sections: [
      {
        heading: `How ${body.label} shows up on ${pathway.shortName} items`,
        level: 2,
        body: [
          body.lead,
          `${SITE} keeps the bank scoped to your pathway so examples, rationales, and difficulty track what you are authorized to study—not a generic “nursing mega-bank.”`,
        ],
      },
      {
        heading: "Study loop that beats passive reading",
        level: 2,
        body: [
          body.studyTip,
          "Mix a short lesson block on the same system, then return to questions within 48 hours so you are testing retrieval, not familiarity.",
        ],
      },
      {
        heading: "What to do when a category stays weak",
        level: 2,
        body: [
          "Export or screenshot your miss themes, then schedule a second pass after sleep—spaced repetition beats marathon cramming for procedural exams.",
          "If timing is the issue, switch to shorter timed sets before full-length practice exams.",
        ],
      },
    ],
    faq: [
      {
        question: `Are ${body.label} questions filtered for ${pathway.displayName}?`,
        answer: `Yes. Items are pathway-scoped for entitlement and content rules, so you practice in the same tier and region context as your subscription.`,
      },
      {
        question: "Do I need lessons if I only want questions?",
        answer:
          "You can start in the question bank, but when accuracy stalls, a focused lesson on the same system usually breaks the plateau faster than more random items.",
      },
      {
        question: "Where does adaptive CAT fit in?",
        answer:
          "CAT-style practice helps calibrate difficulty and stamina. Use it after you have baseline accuracy in the system so the session targets gaps instead of guessing cold.",
      },
    ],
  };
}

function buildLessonsAnglePage(pathway: ExamPathwayDefinition, body: BodyTopic, seoSlug: string): SeoPageDefinition {
  const pack = linkPackForPathwayId(pathway.id);
  const cluster = clusterForPathwayId(pathway.id);
  const h1 = `${pathway.shortName} lessons hub — ${body.label}`;
  return {
    slug: seoSlug,
    title: `${h1} | ${SITE}`,
    description: `Structured lessons for ${body.label} within ${pathway.displayName}, paired with pathway-scoped practice and CAT.`,
    h1,
    cluster,
    pageKind: "topic-guide" satisfies SeoPageKind,
    keywords: [pathway.shortName, body.label, "lessons", "study plan"],
    linkPack: pack,
    practiceConversion: false,
    sections: [
      {
        heading: "Why lessons plus questions beats either alone",
        level: 2,
        body: [
          `Lessons give you the mental model for ${body.label}; questions force you to apply it under uncertainty like the real exam.`,
          "Use the lesson index for your pathway, then jump to the matching question set while the rules are still fresh.",
        ],
      },
      {
        heading: "A realistic weekly rhythm",
        level: 2,
        body: [
          "Two or three focused sessions beat seven distracted ones: one lesson block, one question set, one short review of rationales.",
          "If you are working clinically, anchor study to cases you saw that week—transfer improves retention.",
        ],
      },
    ],
    faq: [
      {
        question: `Will ${body.label} lessons match my exam authorization?`,
        answer: `Lessons are organized under your pathway hub so titles and depth align with ${pathway.shortName} expectations in ${pathway.countryCode}.`,
      },
      {
        question: "How do I avoid duplicating the topic cluster page?",
        answer:
          "This guide is a study-mode landing page: use it when you want a lessons-first route into the same clinical territory as your practice sets.",
      },
    ],
  };
}

function buildPharmPage(pathway: ExamPathwayDefinition, topic: PharmTopic, seoSlug: string): SeoPageDefinition {
  const pack = linkPackForPathwayId(pathway.id);
  const cluster: SeoCluster = "study-guide";
  const h1 = `Pharmacology nursing — ${topic.label}`;
  return {
    slug: seoSlug,
    title: `${h1} for ${pathway.shortName} | ${SITE}`,
    description: `Pharmacology study track for ${topic.label} (${topic.angle}) scoped to ${pathway.displayName}.`,
    h1,
    cluster,
    pageKind: "topic-guide" satisfies SeoPageKind,
    keywords: ["pharmacology", topic.label, pathway.shortName],
    linkPack: pack,
    practiceConversion: false,
    sections: [
      {
        heading: "What exam writers expect",
        level: 2,
        body: [
          `Items cluster around safe administration, patient education, and side effects for ${topic.angle}.`,
          "Prioritization often hinges on which option reduces harm fastest when cues conflict.",
        ],
      },
      {
        heading: "A pharmacology practice pattern",
        level: 2,
        body: [
          "After a batch, group misses by mechanism (for example, beta blockade vs ACE effects) instead of by letter choice.",
          "Teach-back prompts in rationales mirror real-world counseling items—say the teaching point out loud once per session.",
        ],
      },
    ],
    faq: [
      {
        question: "Is this a substitute for a drug guide?",
        answer:
          "No. Use it to train judgment for your exam; verify dosing and organization-specific policies with current references.",
      },
      {
        question: `Does ${pathway.shortName} include alternate brand names?`,
        answer:
          "Rationales emphasize generic concepts and safety patterns; regional naming can differ, so lean on class effects and monitoring priorities.",
      },
    ],
  };
}

function buildLabPage(pathway: ExamPathwayDefinition, lab: LabTopic, seoSlug: string): SeoPageDefinition {
  const pack = linkPackForPathwayId(pathway.id);
  const cluster: SeoCluster = "study-guide";
  const h1 = `Lab values — ${lab.label}`;
  return {
    slug: seoSlug,
    title: `${h1} for ${pathway.shortName} | ${SITE}`,
    description: `Interpretation drills for ${lab.label}: ${lab.focus} within ${pathway.displayName}.`,
    h1,
    cluster,
    pageKind: "topic-guide" satisfies SeoPageKind,
    keywords: ["lab values", lab.label, pathway.shortName],
    linkPack: pack,
    practiceConversion: false,
    sections: [
      {
        heading: "How labs appear in nursing items",
        level: 2,
        body: [
          `Writers embed ${lab.focus} into a vignette and expect you to pick the nursing action that matches the trend.`,
          "Memorizing reference ranges alone rarely passes items—you need the *next step* the scenario implies.",
        ],
      },
      {
        heading: "Drill method",
        level: 2,
        body: [
          "Cover the answers, list three nursing implications from the stem, then reveal choices—this reduces pattern-matching.",
          "Pair abnormal labs with contraindicated interventions to build safety reflexes.",
        ],
      },
    ],
    faq: [
      {
        question: "Are reference intervals exactly my hospital’s?",
        answer:
          "Items use clinically meaningful thresholds; always follow your facility’s policies and the latest reference lab for real shifts.",
      },
      {
        question: "Should I memorize every differential?",
        answer:
          "Prioritize the pathways your exam emphasizes—often perfusion, infection, and electrolyte emergencies for RN/PN tracks.",
      },
    ],
  };
}

function buildPrioPage(pathway: ExamPathwayDefinition, topic: PrioTopic, seoSlug: string): SeoPageDefinition {
  const pack = linkPackForPathwayId(pathway.id);
  const cluster: SeoCluster = "study-guide";
  const h1 = `Prioritization — ${topic.label}`;
  return {
    slug: seoSlug,
    title: `${h1} (${pathway.shortName}) | ${SITE}`,
    description: `NCLEX-style prioritization for ${topic.label}: ${topic.frame} on ${pathway.displayName}.`,
    h1,
    cluster,
    pageKind: "topic-guide" satisfies SeoPageKind,
    keywords: ["prioritization", "NCLEX", topic.label, pathway.shortName],
    linkPack: pack,
    practiceConversion: false,
    sections: [
      {
        heading: "The judgment frame",
        level: 2,
        body: [
          `These items test ${topic.frame}.`,
          "If two answers look “nursing enough,” pick the one that addresses immediate physiologic threat or legal/safety duty first.",
        ],
      },
      {
        heading: "Practice discipline",
        level: 2,
        body: [
          "State the rule in one sentence before you look at options—if you cannot, pause and review a lesson example.",
          "Track whether mistakes are reading errors or priority errors; they need different fixes.",
        ],
      },
    ],
    faq: [
      {
        question: "Is “assess first” always wrong?",
        answer:
          "No—assessment is correct when data is missing or unstable in a way that changes the plan. The stem usually signals which instability matters most.",
      },
      {
        question: `Does ${pathway.shortName} use the same priority heuristics?`,
        answer:
          "Core safety sequencing is similar, but scope and authorization differ by pathway—stay inside your hub’s content filters.",
      },
    ],
  };
}

export type PathwayTopicProgrammaticRow = {
  pathwayId: string;
  seoSlug: string;
  /** Precomputed marketing hub path (`/{country}/{role}/{exam}/{seoSlug}`) for sitemap emission without re-resolving the pathway. */
  publicRelativePath: string;
  page: SeoPageDefinition;
};

function expandRowsForPathway(pathway: ExamPathwayDefinition): PathwayTopicProgrammaticRow[] {
  if (pathway.status === "hidden") return [];
  const rows: PathwayTopicProgrammaticRow[] = [];
  const prefix = practiceSlugPrefix(pathway.id);

  if (prefix) {
    for (const body of BODY_SYSTEMS) {
      const seoSlug = `${prefix}-${body.key}`;
      rows.push({
        pathwayId: pathway.id,
        seoSlug,
        publicRelativePath: buildExamPathwayPath(pathway, seoSlug),
        page: buildBodyPracticePage(pathway, body, seoSlug),
      });
    }
  }

  for (const body of BODY_SYSTEMS) {
    const seoSlug = lessonsAngleSlug(pathway.id, body);
    rows.push({
      pathwayId: pathway.id,
      seoSlug,
      publicRelativePath: buildExamPathwayPath(pathway, seoSlug),
      page: buildLessonsAnglePage(pathway, body, seoSlug),
    });
  }

  if (!pathway.id.includes("allied")) {
    for (const ph of PHARM_TOPICS) {
      const seoSlug = `pharmacology-nursing-${ph.key}`;
      rows.push({
        pathwayId: pathway.id,
        seoSlug,
        publicRelativePath: buildExamPathwayPath(pathway, seoSlug),
        page: buildPharmPage(pathway, ph, seoSlug),
      });
    }
  }

  const labEligible =
    pathway.examFamily === ExamFamily.NCLEX_RN ||
    pathway.examFamily === ExamFamily.NCLEX_PN ||
    pathway.examFamily === ExamFamily.REX_PN;
  if (labEligible) {
    for (const lab of LAB_TOPICS) {
      const seoSlug = `lab-values-${lab.key}`;
      rows.push({
        pathwayId: pathway.id,
        seoSlug,
        publicRelativePath: buildExamPathwayPath(pathway, seoSlug),
        page: buildLabPage(pathway, lab, seoSlug),
      });
    }
  }

  const prioEligible =
    pathway.examFamily === ExamFamily.NCLEX_RN ||
    pathway.examFamily === ExamFamily.NCLEX_PN ||
    pathway.examFamily === ExamFamily.REX_PN;
  if (prioEligible) {
    for (const pr of PRIORITIZATION_TOPICS) {
      const seoSlug = `prioritization-nclex-${pr.key}`;
      rows.push({
        pathwayId: pathway.id,
        seoSlug,
        publicRelativePath: buildExamPathwayPath(pathway, seoSlug),
        page: buildPrioPage(pathway, pr, seoSlug),
      });
    }
  }

  return rows;
}

const registryKey = (pathwayId: string, seoSlug: string) => `${pathwayId}::${seoSlug}`;

function buildRegistryMaps(): {
  byKey: Map<string, PathwayTopicProgrammaticRow>;
  rows: PathwayTopicProgrammaticRow[];
} {
  const byKey = new Map<string, PathwayTopicProgrammaticRow>();
  const rows: PathwayTopicProgrammaticRow[] = [];
  for (const pathway of listPublishedExamPathwaysForPublicSite()) {
    for (const row of expandRowsForPathway(pathway)) {
      const k = registryKey(row.pathwayId, row.seoSlug);
      if (row.page.slug !== row.seoSlug) {
        throw new Error(
          `Pathway topic programmatic registry drift: page.slug (${row.page.slug}) !== seoSlug (${row.seoSlug}) for ${row.pathwayId}`,
        );
      }
      if (byKey.has(k)) {
        throw new Error(`Duplicate pathway topic programmatic seoSlug for ${row.pathwayId}: ${row.seoSlug}`);
      }
      byKey.set(k, row);
      rows.push(row);
    }
  }
  return { byKey, rows };
}

/**
 * Lazy registry: expanding every published pathway × topic matrix is thousands of rows.
 * Importing this module (route compilation, unrelated SEO helpers) must not synchronously
 * allocate the full maps — work runs on first lookup or sitemap collection instead.
 */
let pathwayTopicRegistryMaps:
  | {
      byKey: Map<string, PathwayTopicProgrammaticRow>;
      rows: PathwayTopicProgrammaticRow[];
    }
  | undefined;

function getPathwayTopicRegistryMaps(): {
  byKey: Map<string, PathwayTopicProgrammaticRow>;
  rows: PathwayTopicProgrammaticRow[];
} {
  if (!pathwayTopicRegistryMaps) {
    pathwayTopicRegistryMaps = buildRegistryMaps();
  }
  return pathwayTopicRegistryMaps;
}

export function getPathwayTopicProgrammaticRow(
  pathwayId: string,
  seoSlug: string,
): PathwayTopicProgrammaticRow | undefined {
  return getPathwayTopicRegistryMaps().byKey.get(registryKey(pathwayId, seoSlug));
}

/** Relative URL paths (English-default hub shape) for sitemap — capped. */
export function collectPathwayTopicProgrammaticPublicPaths(): string[] {
  const out: string[] = [];
  for (const row of getPathwayTopicRegistryMaps().rows) {
    if (out.length >= MAX_PATHWAY_TOPIC_PROGRAMMATIC_SITEMAP_URLS) break;
    out.push(row.publicRelativePath);
  }
  return out;
}

export function pathwayTopicProgrammaticRowCount(): number {
  return getPathwayTopicRegistryMaps().rows.length;
}
