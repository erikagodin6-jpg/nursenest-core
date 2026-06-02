import type { RnLearnerStateSnapshot } from "@/lib/learner/rn-coaching-intelligence/learner-state-types";
import { RN_COMPETENCY_NODES } from "@/lib/educational-graph/rn-competency-ontology";
import { EDUCATIONAL_ONTOLOGY_NAMESPACE } from "@/lib/educational-graph/unified-educational-substrate";
import type {
  CognitionEnvelopeRepairReport,
  DurableLearnerCognitionEnvelope,
  PersistedGraphContinuity,
} from "@/lib/educational-cognition/cognition-snapshot-types";
import { fingerprintLearnerState } from "@/lib/learner/rn-coaching-intelligence/learner-state-server-sync";
import type { ClinicalJudgmentPattern } from "@/lib/learner/rn-coaching-intelligence/coaching-types";
import { RN_REASONING_ONTOLOGY } from "@/lib/learner/rn-coaching-intelligence/rn-reasoning-ontology";

const VALID_PATTERNS = new Set<string>([
  "premature_closure",
  "unsafe_prioritization",
  "delayed_escalation",
  "task_before_assessment",
  "monitoring_gap",
  "delegation_risk",
  "hesitant_intervention",
  "sata_partial_reasoning",
  "medication_safety_gap",
  "lifespan_context_gap",
  ...RN_REASONING_ONTOLOGY.map((d) => d.pattern),
]);

const VALID_COMPETENCY_IDS = new Set(RN_COMPETENCY_NODES.map((n) => n.id));

function isValidLearnerHref(href: string): boolean {
  return href.startsWith("/app/") || href.startsWith("/modules/");
}

function dedupeStrings(items: string[], max: number): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of items) {
    const key = item.trim();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(key);
    if (out.length >= max) break;
  }
  return out;
}

function normalizeCompetencyStates(
  snapshot: RnLearnerStateSnapshot,
  ops: string[],
  unrecoverable: string[],
): RnLearnerStateSnapshot {
  const seen = new Set<string>();
  const states = [];
  for (const c of snapshot.competencyStates) {
    if (!VALID_COMPETENCY_IDS.has(c.competencyId)) {
      unrecoverable.push(`competency:${c.competencyId}`);
      continue;
    }
    if (seen.has(c.competencyId)) {
      ops.push("dedupe_competency_state");
      continue;
    }
    seen.add(c.competencyId);
    states.push({
      ...c,
      masteryScore: Math.max(0, Math.min(100, Math.round(c.masteryScore))),
      sessionEvidenceCount: Math.max(0, c.sessionEvidenceCount),
    });
  }
  if (states.length !== snapshot.competencyStates.length) ops.push("normalize_competency_states");
  return { ...snapshot, competencyStates: states };
}

function repairGraphContinuity(
  continuity: PersistedGraphContinuity | undefined,
  ops: string[],
  unrecoverable: string[],
): PersistedGraphContinuity | undefined {
  if (!continuity) return continuity;
  const hrefs = continuity.remediationPathwayIds.filter((h) => {
    if (typeof h !== "string" || !isValidLearnerHref(h)) {
      unrecoverable.push(`graph_href:${String(h)}`);
      ops.push("prune_orphan_graph_href");
      return false;
    }
    return true;
  });
  const deduped = dedupeStrings(hrefs, 12);
  if (deduped.length !== hrefs.length) ops.push("dedupe_graph_steps");
  return {
    ...continuity,
    remediationPathwayIds: deduped,
    glossaryContinuityKeys: dedupeStrings(
      continuity.glossaryContinuityKeys.filter((k) => typeof k === "string"),
      16,
    ),
    interpretationContinuityKeys: dedupeStrings(
      continuity.interpretationContinuityKeys.filter((k) => typeof k === "string"),
      12,
    ),
    lastGraphHref:
      continuity.lastGraphHref && isValidLearnerHref(continuity.lastGraphHref)
        ? continuity.lastGraphHref
        : deduped[0] ?? null,
  };
}

/**
 * Non-destructive repair pipeline — preserves recoverable learner progress.
 */
export function repairDurableLearnerCognitionEnvelope(
  envelope: DurableLearnerCognitionEnvelope,
): { envelope: DurableLearnerCognitionEnvelope; report: CognitionEnvelopeRepairReport } {
  const ops: string[] = [];
  const unrecoverable: string[] = [];
  let snapshot = envelope.snapshot;

  const patterns = snapshot.reasoningPatterns.filter((p) => {
    if (VALID_PATTERNS.has(p)) return true;
    unrecoverable.push(`reasoning:${p}`);
    return false;
  });
  if (patterns.length !== snapshot.reasoningPatterns.length) {
    ops.push("invalid_reasoning_chain_repair");
    snapshot = { ...snapshot, reasoningPatterns: patterns as ClinicalJudgmentPattern[] };
  }

  snapshot = normalizeCompetencyStates(snapshot, ops, unrecoverable);

  const weak = snapshot.measurementWeaknesses.filter((t) => typeof t === "string" && t.length > 0);
  if (weak.length !== snapshot.measurementWeaknesses.length) ops.push("measurement_weakness_cleanup");

  const persistentIds = snapshot.competencyStates.filter((c) => c.persistentWeak).map((c) => c.competencyId);
  if (persistentIds.length === 0 && snapshot.competencyStates.some((c) => c.masteryScore < 55)) {
    ops.push("deleted_focus_area_recovery");
  }

  const graphContinuity = repairGraphContinuity(envelope.graphContinuity, ops, unrecoverable);

  if (envelope.ontologyRevision && envelope.ontologyRevision !== EDUCATIONAL_ONTOLOGY_NAMESPACE) {
    ops.push("stale_ontology_namespace_reconciliation");
  }

  const repairedEnvelope: DurableLearnerCognitionEnvelope = {
    ...envelope,
    snapshot: {
      ...snapshot,
      measurementWeaknesses: weak.slice(0, 24),
      updatedAt: new Date().toISOString(),
    },
    graphContinuity,
    ontologyRevision: EDUCATIONAL_ONTOLOGY_NAMESPACE,
    stateFingerprint: fingerprintLearnerState(snapshot),
    repairReport: undefined,
  };
  repairedEnvelope.stateFingerprint = fingerprintLearnerState(repairedEnvelope.snapshot);

  const integrityTier =
    ops.length > 0 ? ("repaired" as const) : (envelope.integrityTier ?? "valid");

  const report: CognitionEnvelopeRepairReport = {
    repaired: ops.length > 0,
    repairOperations: ops,
    unrecoverableReferences: unrecoverable.slice(0, 32),
    integrityTier,
    repairedAt: new Date().toISOString(),
  };

  return { envelope: { ...repairedEnvelope, repairReport: report }, report };
}
