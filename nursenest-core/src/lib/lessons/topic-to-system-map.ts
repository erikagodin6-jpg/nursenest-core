export const CANONICAL_LESSON_SYSTEMS = [
  "cardiovascular",
  "respiratory",
  "neurological",
  "endocrine",
  "renal-genitourinary",
  "gastrointestinal",
  "hematology-oncology-immunology",
  "integumentary-immune-autoimmune",
  "musculoskeletal",
  "maternity-newborn",
  "pediatrics",
  "mental-health",
  "pharmacology",
  "safety-prioritization",
  "critical-care",
  "general",
] as const;

export type CanonicalLessonSystem =
  (typeof CANONICAL_LESSON_SYSTEMS)[number];

export function mapTopicSlugToSystem(topicSlug?: string | null): CanonicalLessonSystem {
  if (!topicSlug) return "general";

  const t = topicSlug.toLowerCase();

  if (t.includes("cardio")) return "cardiovascular";
  if (t.includes("resp")) return "respiratory";
  if (t.includes("neuro")) return "neurological";
  if (t.includes("endo")) return "endocrine";
  if (t.includes("renal") || t.includes("gu")) return "renal-genitourinary";
  if (t.includes("gi") || t.includes("gastro")) return "gastrointestinal";
  if (t.includes("heme") || t.includes("onc")) return "hematology-oncology-immunology";
  if (t.includes("skin") || t.includes("immune")) return "integumentary-immune-autoimmune";
  if (t.includes("msk") || t.includes("musculo")) return "musculoskeletal";
  if (t.includes("mater") || t.includes("ob")) return "maternity-newborn";
  if (t.includes("peds")) return "pediatrics";
  if (t.includes("mental") || t.includes("psych")) return "mental-health";
  if (t.includes("pharm")) return "pharmacology";
  if (t.includes("safety") || t.includes("priority")) return "safety-prioritization";
  if (t.includes("critical") || t.includes("icu")) return "critical-care";

  return "general";
}
