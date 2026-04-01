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
