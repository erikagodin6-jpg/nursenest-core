import "server-only";

import { safeServerLog } from "@/lib/observability/safe-server-log";
import type { GraphLineageEnvelope } from "@/lib/educational-graph/graph-lineage-envelope";

export type GraphLineageServerMetricCode =
  | "graph_lineage.server_capture"
  | "graph_lineage.client_server_divergence"
  | "graph_lineage.checkpoint_missing"
  | "graph_lineage.replay_divergent";

export function logGraphLineageServerCapture(args: {
  event: string;
  lineage: GraphLineageEnvelope;
  userId: string;
}): void {
  safeServerLog("educational_graph", "graph_lineage.server_capture", {
    event: args.event,
    user_id: args.userId,
    pathway_id: args.lineage.pathwayId,
    graph_version: args.lineage.graphVersion,
    continuity_checkpoint_id: args.lineage.continuityCheckpointId,
  });
}

export function logGraphLineageDivergence(detail: string, lineage?: GraphLineageEnvelope): void {
  safeServerLog("educational_graph", "graph_lineage.client_server_divergence", {
    detail,
    pathway_id: lineage?.pathwayId ?? null,
    checkpoint: lineage?.continuityCheckpointId ?? null,
  });
}
