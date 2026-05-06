import { getCatalogLessonsRaw } from "@/lib/lessons/pathway-lesson-catalog-sync";
import { ALLIED_PROFESSIONS } from "@/lib/allied/allied-professions-registry";
import { filterCatalogLessonsForAlliedProfessionHub } from "@/lib/allied/allied-profession-catalog-hub-filter";

function filterByTopics(rows: ReturnType<typeof getCatalogLessonsRaw>, topicSlugsIn?: string[]) {
  if (!topicSlugsIn?.length) return rows;
  const set = new Set(topicSlugsIn.map((s) => s.trim()).filter(Boolean));
  return rows.filter((row) => set.has(String(row.topicSlug ?? "").trim()));
}

function slugSet(rows: ReturnType<typeof getCatalogLessonsRaw>) {
  return new Set(rows.map((r) => r.slug.trim()));
}

const pathwayId = "us-allied-core";
const raw = getCatalogLessonsRaw(pathwayId);
const withKey = raw.filter((r) => (r.alliedProfessionKey ?? "").trim());

// eslint-disable-next-line no-console
console.log(
  JSON.stringify(
    {
      pathwayId,
      totalMergedCatalogLessons: raw.length,
      lessonsWithAlliedProfessionKeyField: withKey.length,
    },
    null,
    2,
  ),
);

const perProf = [];
for (const p of ALLIED_PROFESSIONS) {
  const scoped = filterCatalogLessonsForAlliedProfessionHub(raw, p.professionKey, pathwayId);
  const afterTopics = filterByTopics(scoped, p.topicSlugsIn);
  perProf.push({
    professionKey: p.professionKey,
    afterProfessionScopedCount: scoped.length,
    afterTopicFilterCount: afterTopics.length,
    topicSlugsInCount: p.topicSlugsIn?.length ?? 0,
    dedicatedCatalogFile: p.dedicatedCatalogFile ?? null,
    professionFilterIsNoop: scoped.length === raw.length,
    receivesFullCatalogWhenNoTopics: (p.topicSlugsIn?.length ?? 0) === 0 && afterTopics.length === raw.length,
  });
}
// eslint-disable-next-line no-console
console.log("PER_PROF_JSON\n" + JSON.stringify(perProf, null, 2));

const keys = ["mlt", "paramedic", "ota", "pta", "social-work", "respiratory", "psw-hca", "pharmacy-tech", "emt"];
const byKey: Record<string, Set<string>> = {};
for (const k of keys) {
  const prof = ALLIED_PROFESSIONS.find((x) => x.professionKey === k);
  if (!prof) continue;
  const scoped = filterCatalogLessonsForAlliedProfessionHub(raw, prof.professionKey, pathwayId);
  const afterTopics = filterByTopics(scoped, prof.topicSlugsIn);
  byKey[k] = slugSet(afterTopics);
}

// eslint-disable-next-line no-console
console.log("HIGH_OVERLAP_JACCARD_GT_0.15");
for (let i = 0; i < keys.length; i++) {
  for (let j = i + 1; j < keys.length; j++) {
    const a = byKey[keys[i]]!;
    const b = byKey[keys[j]]!;
    let inter = 0;
    for (const s of a) if (b.has(s)) inter++;
    const union = a.size + b.size - inter;
    const jacc = union ? inter / union : 0;
    if (jacc > 0.15) {
      // eslint-disable-next-line no-console
      console.log(keys[i], "vs", keys[j], "jaccard", jacc.toFixed(3), "inter", inter, "sizes", a.size, b.size);
    }
  }
}
