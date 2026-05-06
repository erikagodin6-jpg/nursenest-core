type SearchParams = Promise<{ pathwayId?: string | string[] } | undefined>;

export async function pathwayIdFromScenarioSearchParams(searchParams: SearchParams): Promise<string | null> {
  const raw = await searchParams;
  if (!raw) return null;
  const pid = raw.pathwayId;
  if (typeof pid === "string" && pid.trim()) return pid.trim();
  if (Array.isArray(pid) && typeof pid[0] === "string" && pid[0].trim()) return pid[0].trim();
  return null;
}
