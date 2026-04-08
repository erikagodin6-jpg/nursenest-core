export type BlogSourceRecord = {
  authors?: string[];
  year?: string;
  title?: string;
  source?: string;
  publisher?: string;
  url?: string;
  doi?: string;
  accessedAt?: string;
  authority?: "regulator" | "guideline_body" | "peer_reviewed" | "academic_hospital" | "association" | "general_web" | "low_authority";
};

function compact(s: string | undefined): string {
  return (s ?? "").trim();
}

export function formatApa7Source(source: BlogSourceRecord): string {
  const authors = (source.authors ?? []).map((a) => a.trim()).filter(Boolean);
  const authorText = authors.length > 0 ? `${authors.join(", ")}.` : "";
  const yearText = source.year?.trim() ? ` (${source.year.trim()}).` : " (n.d.).";
  const titleText = compact(source.title) ? ` ${compact(source.title)}.` : "";
  const containerText = compact(source.source) ? ` ${compact(source.source)}.` : "";
  const publisherText = compact(source.publisher) ? ` ${compact(source.publisher)}.` : "";
  const doiText = compact(source.doi) ? ` https://doi.org/${compact(source.doi).replace(/^https?:\/\/doi\.org\//, "")}` : "";
  const urlText = !doiText && compact(source.url) ? ` ${compact(source.url)}` : "";
  return `${authorText}${yearText}${titleText}${containerText}${publisherText}${doiText}${urlText}`.replace(/\s+/g, " ").trim();
}

export function buildApa7References(sources: BlogSourceRecord[]): string[] {
  return sources.map(formatApa7Source).filter(Boolean);
}

export function validateSources(sources: BlogSourceRecord[]): { warnings: string[]; reliabilityScore: number } {
  const warnings: string[] = [];
  if (sources.length === 0) {
    return { warnings: ["No structured sources provided."], reliabilityScore: 0 };
  }
  let score = 0;
  for (const s of sources) {
    if (!s.title || !s.year) warnings.push(`Incomplete source fields for "${s.title ?? "untitled"}".`);
    switch (s.authority) {
      case "regulator":
      case "guideline_body":
      case "peer_reviewed":
      case "academic_hospital":
        score += 2;
        break;
      case "association":
      case "general_web":
        score += 1;
        break;
      case "low_authority":
      default:
        score += 0;
        break;
    }
  }
  if (score < sources.length) warnings.push("Source authority mix is weak; add higher-authority references.");
  return { warnings, reliabilityScore: Math.round((score / (sources.length * 2)) * 100) };
}

const AUTHORITY_VALUES = [
  "regulator",
  "guideline_body",
  "peer_reviewed",
  "academic_hospital",
  "association",
  "general_web",
  "low_authority",
] as const;

function coerceAuthorityLoose(v: unknown): BlogSourceRecord["authority"] | undefined {
  const s = typeof v === "string" ? v : "";
  return AUTHORITY_VALUES.includes(s as (typeof AUTHORITY_VALUES)[number]) ? (s as BlogSourceRecord["authority"]) : undefined;
}

/** Best-effort parse of API/JSON rows into {@link BlogSourceRecord}. */
export function coerceBlogSourceRows(raw: unknown[]): BlogSourceRecord[] {
  const out: BlogSourceRecord[] = [];
  for (const row of raw) {
    if (!row || typeof row !== "object") continue;
    const o = row as Record<string, unknown>;
    const authors = Array.isArray(o.authors) ? o.authors.filter((a): a is string => typeof a === "string") : undefined;
    out.push({
      authors,
      year: typeof o.year === "string" ? o.year : undefined,
      title: typeof o.title === "string" ? o.title : undefined,
      source: typeof o.source === "string" ? o.source : undefined,
      publisher: typeof o.publisher === "string" ? o.publisher : undefined,
      url: typeof o.url === "string" ? o.url : undefined,
      doi: typeof o.doi === "string" ? o.doi : undefined,
      accessedAt: typeof o.accessedAt === "string" ? o.accessedAt : undefined,
      authority: coerceAuthorityLoose(o.authority),
    });
  }
  return out;
}
