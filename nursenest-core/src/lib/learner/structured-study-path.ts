/**
 * Deterministic **structured study paths**: foundational → advanced, with weak-area inserts and CAT.
 * Links target signed-in app routes (`/app/lessons`, `/app/questions`, CAT entry points).
 */
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { appCatWeakFocusPath, appPathwayCatSessionStartPath } from "@/lib/exam-pathways/pathway-cat-flow";
import { loadUnifiedTopicPerformance } from "@/lib/learner/topic-performance";

export const STUDY_PATH_KINDS = ["pn", "rn", "np", "allied", "new_grad"] as const;

export type StudyPathKind = (typeof STUDY_PATH_KINDS)[number];

export type StudyPathPhase = "foundation" | "weak_spot" | "build" | "advanced" | "adaptive";

export type StudyPathContentType = "lessons" | "questions" | "cat";

export type StructuredStudyPathStep = {
  id: string;
  order: number;
  phase: StudyPathPhase;
  contentType: StudyPathContentType;
  title: string;
  description: string;
  href: string;
  pathwayId: string;
  /** Topic label for question bank / CAT focus (display + query). */
  focusTopic?: string;
  /** When set, preferred lesson hub filter (`topicSlug`). */
  focusTopicSlug?: string;
};

export type StructuredStudyPath = {
  version: 1;
  kind: StudyPathKind;
  pathwayId: string;
  pathwayDisplayName: string;
  weakTopicsApplied: string[];
  summary: string;
  steps: StructuredStudyPathStep[];
};

type TopicBlock = { slug?: string; label: string };

type Curriculum = {
  foundation: TopicBlock[];
  build: TopicBlock[];
  advanced: TopicBlock[];
};

const DEFAULT_PATHWAY_BY_KIND: Record<StudyPathKind, string> = {
  pn: "us-lpn-nclex-pn",
  rn: "us-rn-nclex-rn",
  np: "us-np-fnp",
  allied: "us-allied-core",
  new_grad: "us-rn-nclex-rn",
};

const RN_LIKE_CURRICULUM: Curriculum = {
  foundation: [
    { slug: "fundamentals", label: "Fundamentals" },
    { slug: "safety", label: "Safety & infection control" },
    { slug: "pharmacology", label: "Pharmacology" },
  ],
  build: [
    { slug: "cardiovascular", label: "Cardiovascular" },
    { slug: "respiratory", label: "Respiratory" },
    { slug: "fluids-electrolytes", label: "Fluids & electrolytes" },
  ],
  advanced: [
    { slug: "endocrine", label: "Endocrine" },
    { slug: "neurological", label: "Neurological" },
    { slug: "multisystem", label: "Multisystem" },
  ],
};

const PN_CURRICULUM: Curriculum = {
  foundation: [
    { slug: "fundamentals", label: "Fundamentals & scope" },
    { slug: "safety", label: "Safety & infection control" },
    { slug: "pharmacology", label: "Pharmacology essentials" },
  ],
  build: [
    { slug: "cardiovascular", label: "Cardiovascular" },
    { slug: "respiratory", label: "Respiratory" },
    { slug: "fluids-electrolytes", label: "Fluids & electrolytes" },
  ],
  advanced: [
    { slug: "endocrine", label: "Endocrine & diabetes" },
    { slug: "neurological", label: "Neurological" },
    { slug: "mental-health", label: "Psychosocial & mental health" },
  ],
};

/** NP: topic slugs vary by spine — use labels + optional slugs where stable. */
const NP_CURRICULUM: Curriculum = {
  foundation: [
    { label: "Primary assessment & history" },
    { slug: "preventive-care-screening", label: "Preventive care & screening" },
    { label: "Evidence-based prescribing principles" },
  ],
  build: [
    { label: "Chronic disease management" },
    { label: "Acute outpatient presentations" },
    { slug: "mental-health", label: "Mental health in primary care" },
  ],
  advanced: [
    { label: "Complex multisystem coordination" },
    { label: "Professional role & documentation" },
    { label: "Population health & follow-up" },
  ],
};

const ALLIED_CURRICULUM: Curriculum = {
  foundation: [
    { slug: "fundamentals", label: "Fundamentals" },
    { slug: "safety", label: "Safety & infection control" },
    { label: "Vital signs & monitoring" },
  ],
  build: [
    { label: "Acute deterioration recognition" },
    { slug: "pharmacology", label: "Medications & routes" },
    { label: "Documentation & handoff" },
  ],
  advanced: [
    { label: "Emergency response priorities" },
    { label: "Scope-appropriate interventions" },
    { label: "Interprofessional collaboration" },
  ],
};

function curriculumForKind(kind: StudyPathKind): Curriculum {
  switch (kind) {
    case "pn":
      return PN_CURRICULUM;
    case "np":
      return NP_CURRICULUM;
    case "allied":
      return ALLIED_CURRICULUM;
    case "new_grad":
    case "rn":
    default:
      return RN_LIKE_CURRICULUM;
  }
}

function summaryForKind(kind: StudyPathKind): string {
  switch (kind) {
    case "pn":
      return "PN track: build scope-safe clinical judgment from fundamentals through body systems, then confirm with adaptive practice.";
    case "np":
      return "NP track: emphasize assessment, chronic and acute management, then advanced coordination — capped with CAT-style adaptive review.";
    case "allied":
      return "Allied health track: safety and monitoring first, then protocols and teamwork, ending with adaptive drills.";
    case "new_grad":
      return "New graduate track: reinforce NCLEX-level foundations, prioritize your weakest topics from real attempts, then run a CAT session.";
    case "rn":
    default:
      return "RN track: master fundamentals and safety, strengthen organ systems, prioritize weak areas from your data, then adaptive CAT.";
  }
}

function lessonsHref(pathwayId: string, block: TopicBlock): string {
  const q = new URLSearchParams({ pathwayId });
  if (block.slug) q.set("topicSlug", block.slug);
  else q.set("topic", block.label);
  return `/app/lessons?${q.toString()}`;
}

function questionsHref(pathwayId: string, topicLabel: string): string {
  return `/app/questions?${new URLSearchParams({ pathwayId, topic: topicLabel }).toString()}`;
}

function slugifyIdPart(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

/**
 * Resolve pathway id: explicit > learner-compatible default per kind; must exist in registry.
 */
export function resolveStructuredStudyPathwayId(kind: StudyPathKind, preferred?: string | null): string {
  const raw = (preferred?.trim() || DEFAULT_PATHWAY_BY_KIND[kind]).trim();
  if (getExamPathwayById(raw)) return raw;
  const fallback = DEFAULT_PATHWAY_BY_KIND[kind];
  return getExamPathwayById(fallback) ? fallback : "us-rn-nclex-rn";
}

const KIND_SET = new Set<string>(STUDY_PATH_KINDS);

/** Parse optional `kind` query value; invalid values fall back to `inferred`. */
export function coalesceStudyPathKindParam(raw: string | null | undefined, inferred: StudyPathKind): StudyPathKind {
  const k = raw?.trim().toLowerCase() ?? "";
  if (k && KIND_SET.has(k)) return k as StudyPathKind;
  return inferred;
}

/**
 * Map subscription tier + saved exam pathway to a path kind.
 * Does not return `new_grad` — use {@link coalesceStudyPathKindParam} with `kind=new_grad` or the Study Plan link.
 */
export function inferStudyPathKindFromLearnerProfile(args: {
  tier?: string | null;
  learnerPathId?: string | null;
}): StudyPathKind {
  const tierRaw = (args.tier ?? "").trim().toUpperCase();
  if (tierRaw === "ALLIED") return "allied";
  if (tierRaw === "NP") return "np";
  if (tierRaw === "LVN_LPN" || tierRaw === "RPN") return "pn";

  const pid = args.learnerPathId?.trim();
  const path = pid ? getExamPathwayById(pid) : null;
  if (path) {
    if (path.roleTrack === "allied") return "allied";
    if (path.roleTrack === "np") return "np";
    if (path.roleTrack === "lpn" || path.roleTrack === "rpn") return "pn";
  }

  return "rn";
}

export type WeakTopicInput = { topic: string; normalizedTopic?: string | null };

/**
 * Build an ordered path: foundation → optional weak blocks → build → advanced → CAT.
 * Weak topics are de-duplicated against foundation labels (case-insensitive) to avoid redundant lesson rows.
 */
export function buildStructuredStudyPath(args: {
  kind: StudyPathKind;
  pathwayId: string;
  weakTopics?: WeakTopicInput[];
  /** Max weak-topic triplets (lesson + questions + CAT). Default 3. */
  maxWeakBlocks?: number;
}): StructuredStudyPath {
  const pathwayId = resolveStructuredStudyPathwayId(args.kind, args.pathwayId);
  const pathway = getExamPathwayById(pathwayId);
  const pathwayDisplayName = pathway?.displayName ?? pathwayId;
  const curriculum = curriculumForKind(args.kind);
  const maxWeak = args.maxWeakBlocks ?? 3;

  const foundationLabels = new Set(
    curriculum.foundation.map((b) => b.label.trim().toLowerCase()).filter(Boolean),
  );

  const weakTopicsApplied: string[] = [];
  const weakBlocks: WeakTopicInput[] = [];
  for (const w of args.weakTopics ?? []) {
    const label = (w.topic ?? "").trim();
    if (!label) continue;
    if (foundationLabels.has(label.toLowerCase())) continue;
    if (weakBlocks.some((x) => x.topic.toLowerCase() === label.toLowerCase())) continue;
    weakBlocks.push(w);
    weakTopicsApplied.push(label);
    if (weakBlocks.length >= maxWeak) break;
  }

  const steps: StructuredStudyPathStep[] = [];
  let order = 0;

  const push = (step: Omit<StructuredStudyPathStep, "order">) => {
    order += 1;
    steps.push({ ...step, order });
  };

  const runPhase = (phase: StudyPathPhase, blocks: TopicBlock[]) => {
    for (const block of blocks) {
      const lid = `${phase}-lesson-${slugifyIdPart(block.slug ?? block.label)}`;
      push({
        id: lid,
        phase,
        contentType: "lessons",
        title: `Lessons · ${block.label}`,
        description: "Read the pathway lesson hub for this topic before drilling questions.",
        href: lessonsHref(pathwayId, block),
        pathwayId,
        focusTopic: block.label,
        ...(block.slug ? { focusTopicSlug: block.slug } : {}),
      });
      push({
        id: `${lid.replace("-lesson-", "-questions-")}`,
        phase,
        contentType: "questions",
        title: `Question bank · ${block.label}`,
        description: "Timed and untimed sets filtered to this topic within your pathway scope.",
        href: questionsHref(pathwayId, block.label),
        pathwayId,
        focusTopic: block.label,
        ...(block.slug ? { focusTopicSlug: block.slug } : {}),
      });
    }
  };

  runPhase("foundation", curriculum.foundation);

  for (const w of weakBlocks) {
    const label = w.topic.trim();
    const slug = w.normalizedTopic?.trim() || undefined;
    const base = `weak-${slugifyIdPart(slug ?? label)}`;
    push({
      id: `${base}-lessons`,
      phase: "weak_spot",
      contentType: "lessons",
      title: `Priority review · ${label}`,
      description: "Your performance data flagged this area — revisit lessons before more attempts.",
      href: lessonsHref(pathwayId, { slug, label }),
      pathwayId,
      focusTopic: label,
      ...(slug ? { focusTopicSlug: slug } : {}),
    });
    push({
      id: `${base}-questions`,
      phase: "weak_spot",
      contentType: "questions",
      title: `Targeted drills · ${label}`,
      description: "Short bursts of items in this topic to confirm understanding.",
      href: questionsHref(pathwayId, label),
      pathwayId,
      focusTopic: label,
    });
    push({
      id: `${base}-cat`,
      phase: "weak_spot",
      contentType: "cat",
      title: `Adaptive (CAT) · weak focus · ${label}`,
      description: "Computer-adaptive session biased to weak performance while staying pathway-scoped.",
      href: appCatWeakFocusPath(pathwayId, label),
      pathwayId,
      focusTopic: label,
    });
  }

  runPhase("build", curriculum.build);
  runPhase("advanced", curriculum.advanced);

  push({
    id: "capstone-cat",
    phase: "adaptive",
    contentType: "cat",
    title: "Full adaptive (CAT) session",
    description: "Run a pathway-scoped CAT to simulate exam-style difficulty progression.",
    href: appPathwayCatSessionStartPath(pathwayId),
    pathwayId,
  });

  return {
    version: 1,
    kind: args.kind,
    pathwayId,
    pathwayDisplayName,
    weakTopicsApplied,
    summary: summaryForKind(args.kind),
    steps,
  };
}

/**
 * Loads weak topics from the unified performance snapshot, then {@link buildStructuredStudyPath}.
 */
export async function loadStructuredStudyPathForSubscriber(args: {
  kind: StudyPathKind;
  pathwayId?: string | null;
  userId: string;
  entitlement: AccessScope;
  maxWeakBlocks?: number;
}): Promise<StructuredStudyPath> {
  const pathwayId = resolveStructuredStudyPathwayId(args.kind, args.pathwayId);
  let weakTopics: WeakTopicInput[] = [];
  if (args.entitlement.hasAccess) {
    const snap = await loadUnifiedTopicPerformance(args.userId, args.entitlement, 12);
    weakTopics = snap.weakTopics.map((w) => ({
      topic: w.topic,
      normalizedTopic: w.normalizedTopic ?? null,
    }));
  }
  return buildStructuredStudyPath({
    kind: args.kind,
    pathwayId,
    weakTopics,
    maxWeakBlocks: args.maxWeakBlocks,
  });
}
