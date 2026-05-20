import {
  listPublishedNursingMechanismClusters,
  nursingMechanismCanonicalPath,
} from "@/lib/seo/nursing-mechanism-clusters";
import { normalizeTopicKey } from "@/lib/linking/link-resolver";
import type { LinkCandidate } from "@/lib/linking/internal-link-types";

/** Topic keys aligned to priority mechanism explainers (synonym-normalized). */
const MECHANISM_TOPIC_HINTS: Record<string, readonly string[]> = {
  "why-hyperkalemia-affects-the-heart-nursing-mechanism": [
    "hyperkalemia",
    "potassium",
    "fluid-balance",
    "electrolytes",
    "cardiac-arrhythmia",
  ],
  "kussmaul-respirations-mechanism-nursing": [
    "diabetic-ketoacidosis",
    "dka",
    "abg-interpretation",
    "metabolic-acidosis",
  ],
  "why-hyperglycemia-causes-osmotic-diuresis-nursing": [
    "diabetes-mellitus",
    "diabetic-ketoacidosis",
    "fluid-balance",
  ],
  "why-copd-causes-barrel-chest-nursing": ["copd", "respiratory-failure"],
  "siadh-vs-diabetes-insipidus-nursing-mechanism": ["siadh", "fluid-balance", "endocrine-disorders"],
  "hemodynamic-shock-types-nursing-preload-afterload": ["shock", "heart-failure", "sepsis"],
  "respiratory-acidosis-vs-metabolic-acidosis-nursing": ["abg-interpretation", "copd", "respiratory-failure"],
};

function clusterTopicKeys(slug: string): string[] {
  const hints = MECHANISM_TOPIC_HINTS[slug] ?? [];
  return hints.map((h) => normalizeTopicKey(h) ?? h).filter(Boolean);
}

/**
 * Published mechanism explainers as lesson-surface link candidates (hub kind — bounded to 1 per lesson resolve).
 */
export function mechanismExplainerLinkCandidatesForLesson(input: {
  topicKey?: string | null;
  topicHints?: readonly string[];
  excludeHrefs?: Set<string>;
}): LinkCandidate[] {
  const keys = new Set<string>();
  if (input.topicKey) {
    const n = normalizeTopicKey(input.topicKey);
    if (n) keys.add(n);
  }
  for (const h of input.topicHints ?? []) {
    const n = normalizeTopicKey(h);
    if (n) keys.add(n);
  }
  if (keys.size === 0) return [];

  const out: LinkCandidate[] = [];
  for (const cluster of listPublishedNursingMechanismClusters()) {
    const href = nursingMechanismCanonicalPath(cluster);
    if (input.excludeHrefs?.has(href)) continue;
    const clusterTopics = clusterTopicKeys(cluster.slug);
    const match = clusterTopics.some((t) => keys.has(t));
    if (!match) continue;
    out.push({
      kind: "hub",
      topicKey: cluster.slug,
      href,
      anchorText: `Mechanism: ${cluster.suggestedTitle.split(":")[0]?.trim() || "clinical reasoning"}`,
      score: 12,
      strength: "strong",
      localeMatch: true,
      pathwayMatch: true,
      debugReason: "mechanism_topic_match",
    });
    if (out.length >= 1) break;
  }
  return out;
}
