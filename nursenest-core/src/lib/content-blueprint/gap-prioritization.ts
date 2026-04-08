import type { BlueprintDomainId } from "./blueprint-domain";
import type { ClinicalSystemId } from "./clinical-system-id";
import type { CoverageBand } from "./coverage-status";
import type { PathwayBlueprintProfile } from "./pathway-blueprint-profiles";

export type GapKind = "domain" | "system" | "rationale" | "medication" | "lessons" | "total" | "clinical_judgment";

export type GapItem = {
  /** Higher = address first (relative within pathway). */
  score: number;
  kind: GapKind;
  id: string;
  title: string;
  detail: string;
};

type DomainRow = {
  domain: BlueprintDomainId;
  label: string;
  questionCount: number;
  minQuestions: number;
  stretchQuestions: number;
  band: CoverageBand;
};

type SystemRow = {
  system: ClinicalSystemId;
  label: string;
  questionCount: number;
  minQuestions: number;
  stretchQuestions: number;
  band: CoverageBand;
};

export function buildGapBacklog(args: {
  profile: PathwayBlueprintProfile;
  publishedQuestionTotal: number;
  pctThinRationale: number;
  pctMissingRationale: number;
  domainRows: DomainRow[];
  systemRows: SystemRow[];
  medicationBuckets: number;
  clinicalJudgmentProxyCount: number;
  lessonTopicCount: number;
}): GapItem[] {
  const items: GapItem[] = [];
  const { profile, domainRows, systemRows } = args;

  if (args.publishedQuestionTotal < profile.minTotalQuestions) {
    const short = profile.minTotalQuestions - args.publishedQuestionTotal;
    items.push({
      score: 120 + short * 0.02,
      kind: "total",
      id: "total:pool_floor",
      title: "Published question pool below pathway floor",
      detail: `${args.publishedQuestionTotal} in-scope vs min ${profile.minTotalQuestions} — expand imports or generation before fine-tuning domains.`,
    });
  }

  if (args.pctThinRationale > profile.maxPctThinRationale) {
    items.push({
      score: 65 + (args.pctThinRationale - profile.maxPctThinRationale) * 0.5,
      kind: "rationale",
      id: "rationale:thin_share",
      title: "Thin rationales (word-count heuristic)",
      detail: `${args.pctThinRationale}% thin vs max ${profile.maxPctThinRationale}% — strengthen explanations on high-traffic items first.`,
    });
  }

  if (args.pctMissingRationale > profile.maxPctMissingRationale) {
    items.push({
      score: 85 + (args.pctMissingRationale - profile.maxPctMissingRationale) * 2,
      kind: "rationale",
      id: "rationale:missing_share",
      title: "Missing rationales",
      detail: `${args.pctMissingRationale}% missing vs max ${profile.maxPctMissingRationale}% — backfill rationales before adding net-new items in the same topics.`,
    });
  }

  for (const d of domainRows) {
    const tgt = profile.domainTargets[d.domain];
    const w = tgt?.weight ?? 0.08;
    if (d.band === "missing" || d.band === "insufficient") {
      const shortfall = Math.max(0, (tgt?.minQuestions ?? 0) - d.questionCount);
      items.push({
        score: 100 * w + shortfall,
        kind: "domain",
        id: `domain:${d.domain}`,
        title: `${d.label}`,
        detail:
          d.band === "missing"
            ? `No in-scope questions mapped to this blueprint domain yet (min ~${tgt?.minQuestions ?? "n/a"}).`
            : `Below operational floor (${d.questionCount} vs min ~${tgt?.minQuestions ?? "n/a"}).`,
      });
    } else if (d.band === "thin_acceptable") {
      items.push({
        score: 40 * w,
        kind: "domain",
        id: `domain:${d.domain}:thin`,
        title: `${d.label} (thin but present)`,
        detail: `Has ${d.questionCount} items; stretch target ~${d.stretchQuestions}.`,
      });
    }
  }

  for (const s of systemRows) {
    if (s.band === "missing" || s.band === "insufficient") {
      const shortfall = Math.max(0, s.minQuestions - s.questionCount);
      items.push({
        score: 55 + shortfall * 0.5,
        kind: "system",
        id: `system:${s.system}`,
        title: `${s.label} clinical area`,
        detail:
          s.band === "missing"
            ? "No questions mapped to this system via topic/subtopic/body_system text."
            : `Below system floor (${s.questionCount} vs min ${s.minQuestions}).`,
      });
    }
  }

  if (args.medicationBuckets < profile.minMedicationBuckets) {
    items.push({
      score: 72,
      kind: "medication",
      id: "medication:breadth",
      title: "Medication safety / class breadth",
      detail: `Distinct coarse medication buckets hit: ${args.medicationBuckets} (min ${profile.minMedicationBuckets}). Add items with clear insulin/anticoag/antimicrobial/cardiovascular med signals in tags or stems.`,
    });
  }

  if (args.clinicalJudgmentProxyCount < profile.minClinicalJudgmentSignals) {
    items.push({
      score: 78,
      kind: "clinical_judgment",
      id: "clinical_judgment:proxy",
      title: "Management / delegation / prioritization depth",
      detail: `Proxy count (management_of_care domain): ${args.clinicalJudgmentProxyCount}; min ${profile.minClinicalJudgmentSignals}.`,
    });
  }

  if (args.lessonTopicCount < 8) {
    items.push({
      score: 35,
      kind: "lessons",
      id: "lessons:topic_breadth",
      title: "Published lesson topic breadth (en hub)",
      detail: `Only ${args.lessonTopicCount} distinct topic slugs with ≥1 published lesson in DB for this pathway — expand hub or add scoped gold-standard lessons for weak systems.`,
    });
  }

  return items.sort((a, b) => b.score - a.score);
}

export function recommendedFirstAdditions(gaps: GapItem[], limit = 6): string[] {
  const out: string[] = [];
  for (const g of gaps.slice(0, limit)) {
    if (g.kind === "domain") out.push(`Add/label questions toward: ${g.title}`);
    else if (g.kind === "system") out.push(`Add case banks + lessons for: ${g.title}`);
    else if (g.kind === "medication") out.push("Increase pharmacology items with explicit high-alert / class cues in metadata or stems");
    else if (g.kind === "clinical_judgment") out.push("Add prioritization/delegation items; tag client-need category where possible");
    else if (g.kind === "lessons") out.push("Publish or scope additional pathway lessons on thin systems (see systems table)");
    else if (g.kind === "rationale") out.push("Improve rationales: expand thin explanations and backfill missing ones on in-scope items");
    else if (g.kind === "total") out.push("Grow the in-scope published pool to the pathway minimum before deep domain tuning");
    else out.push(g.title);
  }
  return [...new Set(out)];
}
