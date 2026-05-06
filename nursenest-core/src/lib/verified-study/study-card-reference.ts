/**
 * Reference URL validation for verified study cards — no fake / placeholder hosts;
 * prefer HTTPS and credible clinical / public-health domains.
 */

export type StudyCardReferenceInput = {
  url: string;
  title?: string | null;
  year?: number | null;
};

export type StudyCardReferenceValidation = "valid" | "warn" | "invalid";

const BLOCKED_HOST_SUBSTRINGS = [
  "example.com",
  "example.org",
  "test.com",
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "fake",
  "loremipsum",
];

/** Host suffixes (lowercase) considered credible for clinical citations. */
const TRUSTED_HOST_SUFFIXES: readonly string[] = [
  "cdc.gov",
  "who.int",
  "nih.gov",
  "nlm.nih.gov",
  "medlineplus.gov",
  "ncbi.nlm.nih.gov",
  "statpearls.com",
  "pubmed.ncbi.nlm.nih.gov",
  "clinicaltrials.gov",
  "uspreventiveservicestaskforce.org",
  "nice.org.uk",
  "canada.ca",
  "phac-aspc.gc.ca",
  "cps.ca",
  "rnao.ca",
  "nccn.org",
  "ahrq.gov",
  "fda.gov",
  "ema.europa.eu",
  "cochrane.org",
  "bmj.com",
  "nejm.org",
  "thelancet.com",
  "jamanetwork.com",
  "nature.com",
  "science.org",
  "sciencedirect.com",
  "springer.com",
  "wiley.com",
  "oup.com",
  "acpjournals.org",
];

const CURRENT_YEAR = new Date().getUTCFullYear();
const MAX_REFERENCE_AGE_YEARS = 10;

function hostMatchesTrusted(hostname: string): boolean {
  const h = hostname.toLowerCase();
  return TRUSTED_HOST_SUFFIXES.some((suf) => h === suf || h.endsWith(`.${suf}`));
}

export function validateStudyCardReference(ref: StudyCardReferenceInput): {
  level: StudyCardReferenceValidation;
  reason?: string;
} {
  const raw = (ref.url ?? "").trim();
  if (!raw) return { level: "invalid", reason: "empty_url" };

  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return { level: "invalid", reason: "unparseable_url" };
  }

  if (url.protocol !== "https:") {
    return { level: "invalid", reason: "https_required" };
  }

  const host = url.hostname.toLowerCase();
  if (!host || host.length < 3) return { level: "invalid", reason: "bad_host" };

  for (const b of BLOCKED_HOST_SUBSTRINGS) {
    if (host === b || host.endsWith(`.${b}`) || host.includes(b)) {
      return { level: "invalid", reason: "blocked_or_placeholder_host" };
    }
  }

  if (!hostMatchesTrusted(host)) {
    return { level: "invalid", reason: "host_not_in_allowlist" };
  }

  const y = ref.year;
  if (typeof y === "number" && Number.isFinite(y)) {
    if (y < CURRENT_YEAR - MAX_REFERENCE_AGE_YEARS) {
      return { level: "warn", reason: "reference_older_than_preferred_window" };
    }
  }

  return { level: "valid" };
}

export type ParsedStudyReference = {
  url: string;
  title?: string;
  year?: number;
};

export function parseStudyReferencesJson(raw: unknown): ParsedStudyReference[] {
  if (!Array.isArray(raw)) return [];
  const out: ParsedStudyReference[] = [];
  for (const row of raw) {
    if (!row || typeof row !== "object") continue;
    const o = row as Record<string, unknown>;
    const url = typeof o.url === "string" ? o.url.trim() : "";
    if (!url) continue;
    const title = typeof o.title === "string" ? o.title : undefined;
    const year = typeof o.year === "number" && Number.isFinite(o.year) ? o.year : undefined;
    out.push({ url, title, year });
  }
  return out;
}

/** Deck is publishable to the public community only when every reference entry is at least `warn`, none `invalid`. */
export function referencesJsonMeetsPublicationBar(referencesJson: unknown): boolean {
  const refs = parseStudyReferencesJson(referencesJson);
  if (refs.length === 0) return false;
  for (const r of refs) {
    const v = validateStudyCardReference(r);
    if (v.level === "invalid") return false;
  }
  return true;
}
