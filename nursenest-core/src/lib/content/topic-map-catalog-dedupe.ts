import { flattenTopicMap } from "./master-topic-map";

export type TopicCatalogCollision = {
  exam: string;
  topicId: string;
  topicName: string;
  catalogPathway: string;
  catalogTitle: string;
  reason: "normalized_equality" | "token_overlap";
};

type CatalogShape = { pathways?: Record<string, { lessons?: { title?: string }[] }> };

let catalogCache: CatalogShape | null = null;

function getCatalog(): CatalogShape {
  if (catalogCache) return catalogCache;
  catalogCache = require("@/content/pathway-lessons/catalog.json") as CatalogShape;
  return catalogCache;
}

function normalizeTitle(s: string): string {
  return s
    .toLowerCase()
    .replace(/\(.*?\)/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function tokenSet(s: string): Set<string> {
  return new Set(normalizeTitle(s).split(" ").filter((w) => w.length > 2));
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 1;
  let inter = 0;
  for (const x of a) {
    if (b.has(x)) inter += 1;
  }
  const union = a.size + b.size - inter;
  return union === 0 ? 0 : inter / union;
}

/** Collect every published/catalog lesson title (all pathways) for dedupe checks */
export function collectCatalogLessonTitles(): { pathwayId: string; title: string }[] {
  const pathways = getCatalog().pathways ?? {};
  const rows: { pathwayId: string; title: string }[] = [];
  for (const [pathwayId, bundle] of Object.entries(pathways)) {
    for (const lesson of bundle.lessons ?? []) {
      if (typeof lesson.title === "string" && lesson.title.trim()) {
        rows.push({ pathwayId, title: lesson.title.trim() });
      }
    }
  }
  return rows;
}

/**
 * Before generating a new lesson, check for obvious overlap with catalog titles.
 * Conservative: flags equality on normalized titles or high token overlap (>= 0.72).
 */
export function auditTopicMapAgainstCatalog(): TopicCatalogCollision[] {
  const catalogRows = collectCatalogLessonTitles();
  const hits: TopicCatalogCollision[] = [];

  for (const row of flattenTopicMap()) {
    const tn = normalizeTitle(row.topic.name);
    const tTokens = tokenSet(row.topic.name);
    for (const c of catalogRows) {
      const cn = normalizeTitle(c.title);
      if (tn.length >= 8 && cn.length >= 8 && (tn === cn || tn.includes(cn) || cn.includes(tn))) {
        hits.push({
          exam: row.exam,
          topicId: row.topic.id,
          topicName: row.topic.name,
          catalogPathway: c.pathwayId,
          catalogTitle: c.title,
          reason: "normalized_equality",
        });
        continue;
      }
      const cTokens = tokenSet(c.title);
      const jac = jaccard(tTokens, cTokens);
      if (jac >= 0.72 && tTokens.size >= 3) {
        hits.push({
          exam: row.exam,
          topicId: row.topic.id,
          topicName: row.topic.name,
          catalogPathway: c.pathwayId,
          catalogTitle: c.title,
          reason: "token_overlap",
        });
      }
    }
  }
  return dedupeCollisions(hits);
}

function dedupeCollisions(rows: TopicCatalogCollision[]): TopicCatalogCollision[] {
  const seen = new Set<string>();
  const out: TopicCatalogCollision[] = [];
  for (const r of rows) {
    const k = `${r.exam}:${r.topicId}:${r.catalogPathway}:${r.reason}`;
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(r);
  }
  return out;
}
