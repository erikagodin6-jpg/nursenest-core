import { PRE_NURSING_MODULE_REGISTRY } from "@/content/pre-nursing/pre-nursing-registry";

/** Next module in registry order that is not marked complete. */
export function nextPreNursingModuleSlug(completedSlugs: Iterable<string>): string | null {
  const done = new Set(completedSlugs);
  for (const m of PRE_NURSING_MODULE_REGISTRY) {
    if (!done.has(m.slug)) return m.slug;
  }
  return null;
}

export function preNursingCompletionFraction(completedCount: number): { pct: number; total: number } {
  const total = PRE_NURSING_MODULE_REGISTRY.length;
  if (total === 0) return { pct: 0, total: 0 };
  return { pct: Math.min(100, Math.round((completedCount / total) * 100)), total };
}
