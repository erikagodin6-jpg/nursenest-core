import { prisma } from "@/lib/db";

export type AcademicTopicHubActivityKey =
  | "lesson"
  | "flashcard"
  | "question"
  | "cat"
  | "simulation"
  | "clinical_skill"
  | "pharmacology"
  | "ecg"
  | "med_math"
  | "lab_interpretation"
  | "remediation"
  | "analytics";

export type AcademicTopicHubActivity = {
  key: AcademicTopicHubActivityKey;
  label: string;
  intent: string;
  count: number;
  href: string | null;
};

export type AcademicTopicHub = {
  topicKey: string;
  displayName: string;
  bodySystem: string | null;
  clinicalCategory: string | null;
  activities: AcademicTopicHubActivity[];
  overallMasteryCoverage: number;
  gaps: string[];
};

type AssetCountRow = {
  asset_type: string;
  count: bigint | number;
};

const ACTIVITY_DEFINITIONS: Array<{
  key: AcademicTopicHubActivityKey;
  label: string;
  intent: string;
  assetTypes: string[];
  href: (topicKey: string) => string;
}> = [
  {
    key: "lesson",
    label: "Learn",
    intent: "Lessons",
    assetTypes: ["lesson"],
    href: (topicKey) => `/app/lessons?topicSlug=${encodeURIComponent(topicKey)}`,
  },
  {
    key: "flashcard",
    label: "Memorize",
    intent: "Flashcards",
    assetTypes: ["flashcard"],
    href: (topicKey) => `/app/flashcards?topic=${encodeURIComponent(topicKey)}`,
  },
  {
    key: "question",
    label: "Practice",
    intent: "Questions",
    assetTypes: ["question", "cat_question"],
    href: (topicKey) => `/app/practice-tests?topic=${encodeURIComponent(topicKey)}`,
  },
  {
    key: "cat",
    label: "Adaptive",
    intent: "CAT",
    assetTypes: ["cat_question"],
    href: (topicKey) => `/app/practice-tests?topic=${encodeURIComponent(topicKey)}&mode=cat`,
  },
  {
    key: "simulation",
    label: "Apply",
    intent: "Simulation",
    assetTypes: ["simulation"],
    href: (topicKey) => `/app/simulations?topic=${encodeURIComponent(topicKey)}`,
  },
  {
    key: "clinical_skill",
    label: "Skills",
    intent: "Clinical Skills",
    assetTypes: ["clinical_skill", "skill"],
    href: (topicKey) => `/app/clinical-skills?topic=${encodeURIComponent(topicKey)}`,
  },
  {
    key: "pharmacology",
    label: "Medications",
    intent: "Pharmacology",
    assetTypes: ["pharmacology"],
    href: (topicKey) => `/app/pharmacology?topic=${encodeURIComponent(topicKey)}`,
  },
  {
    key: "ecg",
    label: "ECG",
    intent: "ECG",
    assetTypes: ["ecg"],
    href: (topicKey) => `/app/ecg?topic=${encodeURIComponent(topicKey)}`,
  },
  {
    key: "med_math",
    label: "Calculate",
    intent: "Med Math",
    assetTypes: ["med_math"],
    href: (topicKey) => `/app/med-math?topic=${encodeURIComponent(topicKey)}`,
  },
  {
    key: "lab_interpretation",
    label: "Interpret",
    intent: "Labs",
    assetTypes: ["lab_interpretation", "labs"],
    href: (topicKey) => `/app/labs?topic=${encodeURIComponent(topicKey)}`,
  },
  {
    key: "remediation",
    label: "Strengthen",
    intent: "Remediation",
    assetTypes: ["remediation"],
    href: (topicKey) => `/app/remediation?topic=${encodeURIComponent(topicKey)}`,
  },
  {
    key: "analytics",
    label: "Measure",
    intent: "Analytics",
    assetTypes: ["analytics"],
    href: (topicKey) => `/app/analytics?topic=${encodeURIComponent(topicKey)}`,
  },
];

function coverage(count: number, target: number): number {
  if (target <= 0) return 100;
  return Math.min(100, Number(((count / target) * 100).toFixed(1)));
}

export async function loadAcademicTopicHub(topicKey: string): Promise<AcademicTopicHub | null> {
  const normalizedTopicKey = topicKey.trim().toLowerCase();
  if (!normalizedTopicKey) return null;

  const topic = await prisma.canonicalTopic.findUnique({
    where: { topicKey: normalizedTopicKey },
    select: {
      id: true,
      topicKey: true,
      displayName: true,
      bodySystem: true,
      clinicalCategory: true,
    },
  });

  if (!topic) return null;

  let rows: AssetCountRow[] = [];
  try {
    rows = await prisma.$queryRaw<AssetCountRow[]>`
      SELECT asset_type, COUNT(*)::bigint AS count
      FROM academic_content_asset_links
      WHERE canonical_topic_id = ${topic.id}
        AND relationship = 'primary'
      GROUP BY asset_type
    `;
  } catch {
    rows = [];
  }

  const countByAsset = new Map(rows.map((row) => [row.asset_type, Number(row.count)]));
  const activities = ACTIVITY_DEFINITIONS.map((activity) => {
    const count = activity.assetTypes.reduce((sum, type) => sum + (countByAsset.get(type) ?? 0), 0);
    return {
      key: activity.key,
      label: activity.label,
      intent: activity.intent,
      count,
      href: count > 0 ? activity.href(topic.topicKey) : null,
    };
  });

  const measured = [
    coverage(activities.find((item) => item.key === "lesson")?.count ?? 0, 1),
    coverage(activities.find((item) => item.key === "question")?.count ?? 0, 20),
    coverage(activities.find((item) => item.key === "flashcard")?.count ?? 0, 30),
    coverage(activities.find((item) => item.key === "simulation")?.count ?? 0, 1),
    coverage(activities.find((item) => item.key === "clinical_skill")?.count ?? 0, 1),
    coverage(activities.find((item) => item.key === "pharmacology")?.count ?? 0, 5),
    coverage(activities.find((item) => item.key === "cat")?.count ?? 0, 10),
  ];

  return {
    topicKey: topic.topicKey,
    displayName: topic.displayName,
    bodySystem: topic.bodySystem,
    clinicalCategory: topic.clinicalCategory,
    activities,
    overallMasteryCoverage: Number((measured.reduce((sum, value) => sum + value, 0) / measured.length).toFixed(1)),
    gaps: activities.filter((activity) => activity.count === 0).map((activity) => activity.intent),
  };
}
