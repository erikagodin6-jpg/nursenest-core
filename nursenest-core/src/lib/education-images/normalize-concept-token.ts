const FILLER = new Set([
  "the",
  "a",
  "an",
  "and",
  "or",
  "for",
  "with",
  "without",
  "acute",
  "chronic",
  "disease",
  "syndrome",
  "disorder",
  "condition",
  "patient",
  "client",
]);

const ABBREV: Record<string, string> = {
  mi: "myocardial infarction",
  chf: "heart failure congestive",
  copd: "copd",
  dm: "diabetes mellitus",
  hf: "heart failure",
  afi: "atrial fibrillation",
  afib: "atrial fibrillation",
  tia: "transient ischemic",
  cva: "cerebrovascular stroke",
  gi: "gastrointestinal",
  gu: "genitourinary",
};

/** Normalizes a string for fuzzy concept/ filename matching. */
export function normalizeConceptToken(s: string): string {
  let t = s.toLowerCase().trim();
  t = t.replace(/['’]/g, "");
  t = t.replace(/[^a-z0-9]+/g, " ");
  t = t.replace(/\s+/g, " ").trim();
  const expanded = ABBREV[t];
  if (expanded) return expanded;
  return t;
}

export function tokenizeForConceptMatch(s: string): string[] {
  const n = normalizeConceptToken(s);
  if (!n) return [];
  const parts = n.split(" ").filter((w) => w.length > 1 && !FILLER.has(w));
  return [...new Set(parts)];
}

export function basenameWithoutExtension(pathOrKey: string): string {
  const base = pathOrKey.split("/").pop() ?? pathOrKey;
  return base.replace(/\.[^.]+$/, "").toLowerCase();
}

/**
 * Possible inventory basename forms for exact/slug matching (hyphenated keys in `uploads/images/`).
 */
export function inventoryBasenameCandidatesFromLabel(s: string): string[] {
  const n = normalizeConceptToken(s);
  const out = new Set<string>();
  if (n) {
    out.add(n.replace(/\s+/g, "-"));
    const collapsed = n.replace(/\s+/g, "");
    if (collapsed.length >= 4) out.add(collapsed);
  }
  const slugish = s
    .toLowerCase()
    .trim()
    .replace(/^\/+|\/+$/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (slugish.length >= 3) out.add(slugish);
  return [...out].filter((x) => x.length >= 3);
}
