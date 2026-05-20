import type { CognitionVersionMetadata } from "@/lib/educational-cognition/cognition-version-governance";
import { cognitionVersionTelemetryProps } from "@/lib/educational-cognition/cognition-version-governance";
import {
  cognitionSafePostHogProps,
  governTelemetryIsolation,
  type TelemetrySurface,
} from "@/lib/educational-cognition/telemetry-isolation-governance";
import type { CognitionExplainability } from "@/lib/educational-cognition/cognition-explainability";
import { explainabilityTelemetryProps } from "@/lib/educational-cognition/cognition-explainability";

export type CognitionTelemetryLineage = {
  surface: TelemetrySurface;
  event: string;
  version: CognitionVersionMetadata;
  props: Record<string, string | number | boolean>;
};

export function buildCognitionTelemetryLineage(args: {
  surface: TelemetrySurface;
  event: string;
  pathwayId?: string | null;
  version: CognitionVersionMetadata;
  explainability?: CognitionExplainability | null;
  extra?: Record<string, string | number | boolean | undefined>;
}): CognitionTelemetryLineage {
  const merged: Record<string, string | number | boolean | undefined> = {
    pathway_id: args.pathwayId ?? "unknown",
    ...cognitionVersionTelemetryProps(args.version),
    ...(args.explainability ? explainabilityTelemetryProps(args.explainability) : {}),
    ...(args.extra ?? {}),
  };

  const isolation = governTelemetryIsolation({
    surface: args.surface,
    event: args.event,
    props: merged,
    pathwayId: args.pathwayId,
  });

  const props = cognitionSafePostHogProps(
    Object.fromEntries(
      Object.entries(merged).filter(([k]) => !isolation.strippedKeys.includes(k)),
    ) as Record<string, string | number | boolean | undefined>,
  );

  return {
    surface: args.surface,
    event: isolation.normalizedEvent,
    version: args.version,
    props,
  };
}
