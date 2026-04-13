/**
 * Pathway-scoped CAT (adaptive) practice entry points.
 * Delivery uses existing {@link createCatPracticeTestPayload} + `/api/practice-tests` + {@link PracticeTestRunnerClient}.
 */

export type ResolveStudySurfaceCatHrefArgs = {
  pathwayId?: string | null;
  availablePathwayIds?: Array<string | null | undefined>;
  topic?: string | null;
  preferWeakFocus?: boolean;
};

export function appPathwayCatSessionStartPath(pathwayId: string): string {
  const q = new URLSearchParams({ pathwayId: pathwayId.trim() });
  return `/app/practice-tests/start?${q.toString()}`;
}

export function resolvePreferredCatPathwayId(
  preferredPathwayId?: string | null,
  availablePathwayIds?: Array<string | null | undefined>,
): string | null {
  const preferred = preferredPathwayId?.trim() || null;
  const available = [...new Set((availablePathwayIds ?? []).map((id) => id?.trim()).filter(Boolean))] as string[];
  if (preferred && (available.length === 0 || available.includes(preferred))) return preferred;
  if (available.length === 1) return available[0]!;
  return null;
}

/**
 * CAT-focused weak-area launch inside the signed-in builder.
 * Keeps CAT mode explicit while preserving pathway/topic context when available.
 */
export function appCatWeakFocusPath(pathwayId?: string | null, topic?: string | null): string {
  const q = new URLSearchParams({ cat: "1", focus: "weak" });
  const pathway = pathwayId?.trim();
  if (pathway) q.set("pathwayId", pathway);
  const topicLabel = topic?.trim();
  if (topicLabel) q.set("topic", topicLabel);
  return `/app/practice-tests?${q.toString()}`;
}

export function appPathwayCatWeakFocusPath(pathwayId: string, topic?: string | null): string {
  return appCatWeakFocusPath(pathwayId, topic);
}

/**
 * Signed-in study-surface resolver for app CAT CTAs.
 * Prefer `resolveStudyLoopCatDestination` / `resolveStudyLoopCatHref` from
 * `study-loop-cat-routing.ts` when a surface may be public or needs destination metadata.
 */
export function resolveStudySurfaceCatHref({
  pathwayId,
  availablePathwayIds,
  topic,
  preferWeakFocus = false,
}: ResolveStudySurfaceCatHrefArgs): string {
  const resolvedPathwayId = resolvePreferredCatPathwayId(pathwayId, availablePathwayIds);
  if (preferWeakFocus) {
    return appCatWeakFocusPath(resolvedPathwayId, topic);
  }
  return resolvedPathwayId ? appPathwayCatSessionStartPath(resolvedPathwayId) : "/app/practice-tests/start";
}
