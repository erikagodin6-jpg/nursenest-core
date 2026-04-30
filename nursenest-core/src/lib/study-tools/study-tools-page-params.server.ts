import "server-only";

type LearnerSearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function pathwayIdFromLearnerSearchParams(searchParams: LearnerSearchParams): Promise<string | null> {
  const raw = await searchParams;
  const pid = raw.pathwayId;
  if (typeof pid === "string" && pid.trim()) return pid.trim();
  if (Array.isArray(pid) && typeof pid[0] === "string" && pid[0].trim()) return pid[0].trim();
  return null;
}
