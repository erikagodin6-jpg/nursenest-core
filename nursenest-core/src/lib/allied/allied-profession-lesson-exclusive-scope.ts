import { ALLIED_PROFESSIONS } from "@/lib/allied/allied-professions-registry";
import { isAlliedMarketingCorePathwayId } from "@/lib/lessons/canonical-lessons-hubs";
import type { LessonInput } from "@/lib/lessons/pathway-lesson-catalog-sync";
import { safeServerLog } from "@/lib/observability/safe-server-log";

/** `ALLIED_PROFESSIONS` rows use this pathway id; CA/US marketing core share the same profession registry. */
const ALLIED_REGISTRY_PATHWAY_ID = "us-allied-core";

function registryPathwayIdForHub(pathwayId: string): string {
  return isAlliedMarketingCorePathwayId(pathwayId) ? ALLIED_REGISTRY_PATHWAY_ID : pathwayId;
}

function alliedProfessionsOnPathway(pathwayId: string) {
  const pid = registryPathwayIdForHub(pathwayId);
  return ALLIED_PROFESSIONS.filter((p) => p.pathwayId === pid);
}

function registryIndexForProfession(pathwayId: string, professionKey: string): number {
  const order = alliedProfessionsOnPathway(pathwayId).map((p) => p.professionKey);
  const i = order.indexOf(professionKey);
  return i === -1 ? 99999 : i;
}

function professionRegistryTopics(pathwayId: string, professionKey: string): string[] {
  const pid = registryPathwayIdForHub(pathwayId);
  const prof = ALLIED_PROFESSIONS.find((p) => p.pathwayId === pid && p.professionKey === professionKey);
  return prof?.topicSlugsIn?.map((s) => s.trim().toLowerCase()).filter(Boolean) ?? [];
}

const topicClaimantsCache = new Map<string, Map<string, string[]>>();

/** topic slug → claimants (sorted keys), for allied marketing core registry pathway only. */
function topicClaimantsMap(pathwayId: string): Map<string, string[]> {
  const pid = registryPathwayIdForHub(pathwayId);
  const hit = topicClaimantsCache.get(pid);
  if (hit) return hit;

  const professions = alliedProfessionsOnPathway(pathwayId);
  const topicToClaimants = new Map<string, Set<string>>();
  for (const p of professions) {
    for (const raw of p.topicSlugsIn ?? []) {
      const t = raw.trim().toLowerCase();
      if (!t) continue;
      let set = topicToClaimants.get(t);
      if (!set) {
        set = new Set();
        topicToClaimants.set(t, set);
      }
      set.add(p.professionKey);
    }
  }
  const out = new Map<string, string[]>();
  for (const [t, set] of topicToClaimants) {
    out.set(t, [...set].sort((a, b) => a.localeCompare(b)));
  }
  topicClaimantsCache.set(pid, out);
  return out;
}

const exclusiveTopicOwnerCache = new Map<string, Map<string, string>>();

/**
 * One deterministic owner per topic so hubs stay disjoint while every profession
 * with `topicSlugsIn` keeps at least one owned topic when the graph allows it.
 */
function exclusiveTopicOwnerMap(pathwayId: string): Map<string, string> {
  const pid = registryPathwayIdForHub(pathwayId);
  const hit = exclusiveTopicOwnerCache.get(pid);
  if (hit) return hit;

  const claimantsMap = topicClaimantsMap(pathwayId);
  const professions = alliedProfessionsOnPathway(pathwayId);
  const owners = new Map<string, string>();

  const claimantsFor = (topic: string) => claimantsMap.get(topic) ?? [];

  const countOwnedInRegistry = (prof: string): number => {
    let n = 0;
    for (const t of professionRegistryTopics(pathwayId, prof)) {
      if (owners.get(t) === prof) n++;
    }
    return n;
  };

  const hasAtLeastOneOwnedTopic = (prof: string): boolean => countOwnedInRegistry(prof) >= 1;

  // 1) Sole claimants
  for (const [topic, claimants] of claimantsMap) {
    if (claimants.length === 1) owners.set(topic, claimants[0]!);
  }

  const profsByNarrow = [...professions].sort((a, b) => {
    const la = a.topicSlugsIn?.length ?? 0;
    const lb = b.topicSlugsIn?.length ?? 0;
    if (la !== lb) return la - lb;
    return registryIndexForProfession(pathwayId, a.professionKey) - registryIndexForProfession(pathwayId, b.professionKey);
  });

  const tryAssignProfession = (pk: string): void => {
    if (hasAtLeastOneOwnedTopic(pk)) return;
    const list = professionRegistryTopics(pathwayId, pk);
    if (!list.length) return;

    const topicsSorted = [...list].sort((a, b) => {
      const ca = claimantsFor(a).length;
      const cb = claimantsFor(b).length;
      if (ca !== cb) return ca - cb;
      return a.localeCompare(b);
    });

    for (const topic of topicsSorted) {
      const cur = owners.get(topic);
      if (cur === undefined) {
        owners.set(topic, pk);
        return;
      }
      if (cur === pk) return;
      if (countOwnedInRegistry(cur) > 1) {
        owners.set(topic, pk);
        return;
      }
    }
    owners.set(topicsSorted[0]!, pk);
  };

  // 2) Ensure each profession has ≥1 owned topic from its list (narrow lists first)
  for (const p of profsByNarrow) tryAssignProfession(p.professionKey);

  // 3) Repair chains after forced steals
  for (let round = 0; round < professions.length * 4; round++) {
    const needy = profsByNarrow.filter(
      (p) => professionRegistryTopics(pathwayId, p.professionKey).length > 0 && !hasAtLeastOneOwnedTopic(p.professionKey),
    );
    if (!needy.length) break;
    for (const p of needy) tryAssignProfession(p.professionKey);
  }

  // 4) Remaining topics: minimize global assignment count per profession (tie → registry order)
  const winTotals = (): Map<string, number> => {
    const m = new Map<string, number>();
    for (const p of professions) m.set(p.professionKey, 0);
    for (const [, w] of owners) m.set(w, (m.get(w) ?? 0) + 1);
    return m;
  };

  const unresolved = [...claimantsMap.keys()].filter((t) => !owners.has(t)).sort((a, b) => {
    const d = claimantsFor(b).length - claimantsFor(a).length;
    if (d !== 0) return d;
    return a.localeCompare(b);
  });

  for (const topic of unresolved) {
    const claimants = claimantsFor(topic);
    const wc = winTotals();
    const sorted = [...claimants].sort((a, b) => {
      const wa = wc.get(a) ?? 0;
      const wb = wc.get(b) ?? 0;
      if (wa !== wb) return wa - wb;
      return registryIndexForProfession(pathwayId, a) - registryIndexForProfession(pathwayId, b);
    });
    owners.set(topic, sorted[0]!);
  }

  exclusiveTopicOwnerCache.set(pid, owners);
  return owners;
}

/**
 * Professions (registry keys) that list this topic slug on the allied registry pathway.
 */
export function alliedProfessionClaimantsForTopic(pathwayId: string, topicSlug: string): string[] {
  const t = topicSlug.trim().toLowerCase();
  return topicClaimantsMap(pathwayId).get(t) ?? [];
}

/**
 * Deterministic single owner per topic for allied marketing core hubs.
 */
export function exclusiveWinningProfessionForTopic(pathwayId: string, topicSlug: string): string | null {
  const t = topicSlug.trim().toLowerCase();
  if (!t) return null;
  const map = exclusiveTopicOwnerMap(pathwayId);
  if (map.has(t)) return map.get(t)!;
  const c = alliedProfessionClaimantsForTopic(pathwayId, t);
  return c.length === 1 ? c[0]! : null;
}

/**
 * Topic slugs this profession may list on the hub after exclusive ownership resolution.
 */
export function exclusiveTopicSlugsForAlliedProfession(pathwayId: string, professionKey: string): string[] {
  const key = professionKey.trim().toLowerCase();
  const pid = registryPathwayIdForHub(pathwayId);
  const prof = ALLIED_PROFESSIONS.find((p) => p.pathwayId === pid && p.professionKey === key);
  const registryTopics = prof?.topicSlugsIn?.map((s) => s.trim().toLowerCase()).filter(Boolean) ?? [];
  const owned: string[] = [];
  for (const t of registryTopics) {
    const winner = exclusiveWinningProfessionForTopic(pathwayId, t);
    if (winner === key) owned.push(t);
  }
  return owned;
}

export function catalogLessonInputBelongsToAlliedProfession(
  row: Pick<LessonInput, "topicSlug" | "alliedProfessionKey">,
  pathwayId: string,
  professionKey: string,
): boolean {
  const key = professionKey.trim().toLowerCase();
  if (!key) return true;
  if (!isAlliedMarketingCorePathwayId(pathwayId)) {
    const explicit = (row.alliedProfessionKey ?? "").trim().toLowerCase();
    return explicit === key;
  }
  const explicit = (row.alliedProfessionKey ?? "").trim().toLowerCase();
  if (explicit) return explicit === key;
  const topic = (row.topicSlug ?? "").trim().toLowerCase();
  const winner = exclusiveWinningProfessionForTopic(pathwayId, topic);
  return winner === key;
}

export function pathwayLessonTopicBelongsToAlliedProfession(
  topicSlug: string,
  pathwayId: string,
  professionKey: string,
): boolean {
  const key = professionKey.trim().toLowerCase();
  if (!key || !isAlliedMarketingCorePathwayId(pathwayId)) return true;
  const topic = topicSlug.trim().toLowerCase();
  return exclusiveWinningProfessionForTopic(pathwayId, topic) === key;
}

const CONTAMINATION_WARN_RATIO = 0.3;

/**
 * When an allied profession hub is active, warn if many rows fail explicit/topic ownership checks.
 */
export function logAlliedHubProfessionScopeContaminationIfNeeded(args: {
  pathwayId: string;
  alliedProfessionKey: string | undefined;
  rows: Array<{ topicSlug: string; alliedProfessionKey?: string | null }>;
  surface: string;
}): void {
  const key = args.alliedProfessionKey?.trim().toLowerCase();
  if (!key || !isAlliedMarketingCorePathwayId(args.pathwayId)) return;
  const total = args.rows.length;
  if (total === 0) return;
  let bad = 0;
  for (const r of args.rows) {
    const ok = catalogLessonInputBelongsToAlliedProfession(
      { topicSlug: r.topicSlug, alliedProfessionKey: r.alliedProfessionKey ?? undefined },
      args.pathwayId,
      key,
    );
    if (!ok) bad++;
  }
  if (bad / total > CONTAMINATION_WARN_RATIO) {
    safeServerLog("pathway_lessons", "allied_hub_profession_scope_contamination_warn", {
      pathway_id: args.pathwayId,
      allied_profession_key: key,
      surface: args.surface,
      row_total: String(total),
      mismatched: String(bad),
      ratio: String(Math.round((bad / total) * 1000) / 1000),
    });
  }
}
