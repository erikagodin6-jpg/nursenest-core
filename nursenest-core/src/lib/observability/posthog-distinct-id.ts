/** Short stable id for PostHog (matches server `captureServerEvent` distinct ids). */
export function analyticsDistinctId(userId: string | undefined): string {
  if (!userId) return "anonymous";
  return `u_${userId.slice(0, 12)}`;
}
