import type { Express, Request, Response, NextFunction } from "express";

const TIMESTAMP_SUFFIX_REGEX = /-(\d{10,13})$/;
const LOCALE_PATTERN = /^\/([a-z]{2}(?:-[a-z]{2,4})?)(?=\/)/i;

const KNOWN_REDIRECTS: Record<string, string> = {
  "oxygenation-vs-ventilation-critical-differences":
    "oxygenation-vs-ventilation-clinical-distinction",
  "create-more-posts-about-hyperkalemia": "hyperkalemia-nursing-guide",
  "test-publish-flow-1772145129698": "",
};

function stripTimestampSuffix(slug: string): string {
  return slug.replace(TIMESTAMP_SUFFIX_REGEX, "");
}

function hasTimestampSuffix(slug: string): boolean {
  return TIMESTAMP_SUFFIX_REGEX.test(slug);
}

function resolveCanonicalSlug(slug: string): string | null {
  const baseSlug = hasTimestampSuffix(slug) ? stripTimestampSuffix(slug) : slug;

  if (Object.prototype.hasOwnProperty.call(KNOWN_REDIRECTS, baseSlug)) {
    const redirectTarget = KNOWN_REDIRECTS[baseSlug];
    return redirectTarget || null;
  }

  if (baseSlug !== slug) {
    return baseSlug;
  }

  return null;
}

function buildRedirectPath(localePart: string, prefix: "learn" | "lessons", slug: string): string {
  return `${localePart}/${prefix}/${slug}`;
}

function parseContentRoute(pathname: string): {
  localePart: string;
  prefix: "learn" | "lessons" | null;
  slug: string | null;
} {
  let localePart = "";
  let restPath = pathname;

  const localeMatch = pathname.match(LOCALE_PATTERN);
  if (localeMatch) {
    localePart = `/${localeMatch[1]}`;
    restPath = pathname.slice(localeMatch[0].length);
  }

  const learnMatch = restPath.match(/^\/learn\/([^/]+)$/);
  if (learnMatch) {
    return {
      localePart,
      prefix: "learn",
      slug: learnMatch[1],
    };
  }

  const lessonMatch = restPath.match(/^\/lessons\/([^/]+)$/);
  if (lessonMatch) {
    return {
      localePart,
      prefix: "lessons",
      slug: lessonMatch[1],
    };
  }

  return {
    localePart,
    prefix: null,
    slug: null,
  };
}

export function setupSeoRedirects(app: Express): void {
  app.use((req: Request, res: Response, next: NextFunction) => {
    const { localePart, prefix, slug } = parseContentRoute(req.path);

    if (!prefix || !slug) {
      return next();
    }

    const canonicalSlug = resolveCanonicalSlug(slug);

    if (!canonicalSlug || canonicalSlug === slug) {
      return next();
    }

    return res.redirect(301, buildRedirectPath(localePart, prefix, canonicalSlug));
  });
}

export function isTimestampDuplicate(slug: string): boolean {
  return hasTimestampSuffix(slug);
}

export function getCanonicalSlug(slug: string): string {
  const resolved = resolveCanonicalSlug(slug);
  return resolved ?? (hasTimestampSuffix(slug) ? stripTimestampSuffix(slug) : slug);
}