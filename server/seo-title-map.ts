type SeoMeta = {
  title: string;
  description: string;
  keyword: string;
};

/* =========================
   CORE MAP (UNCHANGED DATA)
========================= */

export const seoTitleMap: Record<string, SeoMeta> = {
  // keep your existing entries EXACTLY as they are
};

/* =========================
   CACHE (tiny perf win)
========================= */

const seoCache = new Map<string, SeoMeta>();

/* =========================
   HELPERS
========================= */

function normalizeSlug(slug: string): string {
  return slug
    .toLowerCase()
    .trim()
    .replace(/^\/(learn|lessons)\//, "")
    .replace(/\/+$/, "");
}

function formatSlug(slug: string): string {
  return slug
    .replace(/[-/]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, c => c.toUpperCase());
}

/* =========================
   DEFAULT FALLBACK
========================= */

function generateFallback(slug: string): SeoMeta {
  const formatted = formatSlug(slug);

  return {
    title: `${formatted}: Nursing Guide & NCLEX Review`,
    description: `Master ${formatted.toLowerCase()} with key concepts, clinical insights, and nursing interventions for exam success.`,
    keyword: `${formatted.toLowerCase()} nursing`,
  };
}

/* =========================
   SAFE GETTER (USE THIS)
========================= */

export function getSeoMeta(slug: string): SeoMeta {
  if (!slug) {
    return {
      title: "NurseNest | Nursing Exam Prep",
      description:
        "NCLEX, REx-PN, and NP exam prep with questions, flashcards, and clinical guides.",
      keyword: "nursing exam prep",
    };
  }

  const cleanSlug = normalizeSlug(slug);

  if (seoCache.has(cleanSlug)) {
    return seoCache.get(cleanSlug)!;
  }

  const result = seoTitleMap[cleanSlug] ?? generateFallback(cleanSlug);

  seoCache.set(cleanSlug, result);

  return result;
}

/* =========================
   OPTIONAL: VALIDATION (DEV)
========================= */

export function validateSeoMap(): void {
  const seen = new Set<string>();

  for (const key of Object.keys(seoTitleMap)) {
    if (seen.has(key)) {
      console.warn(`[SEO] Duplicate slug detected: ${key}`);
    }

    seen.add(key);

    const entry = seoTitleMap[key];

    if (!entry.title || entry.title.length < 10) {
      console.warn(`[SEO] Weak title for ${key}`);
    }

    if (!entry.description || entry.description.length < 50) {
      console.warn(`[SEO] Weak description for ${key}`);
    }

    if (!entry.keyword || entry.keyword.length < 3) {
      console.warn(`[SEO] Weak keyword for ${key}`);
    }
  }
}