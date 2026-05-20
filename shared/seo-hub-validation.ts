import type { SeoHubPage } from "./schema";

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

const MIN_BODY_WORD_COUNT = 200;
const MIN_META_DESCRIPTION_LENGTH = 50;
const MAX_META_DESCRIPTION_LENGTH = 160;
const MIN_TITLE_LENGTH = 10;
const MAX_TITLE_LENGTH = 70;

export function validateSeoHubPage(page: Partial<SeoHubPage>): ValidationResult {
  const errors: ValidationError[] = [];

  if (!page.title || page.title.trim().length < MIN_TITLE_LENGTH) {
    errors.push({ field: "title", message: `Title must be at least ${MIN_TITLE_LENGTH} characters` });
  }

  if (!page.metaTitle || page.metaTitle.trim().length < MIN_TITLE_LENGTH) {
    errors.push({ field: "metaTitle", message: `Meta title must be at least ${MIN_TITLE_LENGTH} characters` });
  } else if (page.metaTitle.trim().length > MAX_TITLE_LENGTH) {
    errors.push({ field: "metaTitle", message: `Meta title should be under ${MAX_TITLE_LENGTH} characters` });
  }

  if (!page.metaDescription || page.metaDescription.trim().length < MIN_META_DESCRIPTION_LENGTH) {
    errors.push({ field: "metaDescription", message: `Meta description must be at least ${MIN_META_DESCRIPTION_LENGTH} characters` });
  } else if (page.metaDescription.trim().length > MAX_META_DESCRIPTION_LENGTH) {
    errors.push({ field: "metaDescription", message: `Meta description should be under ${MAX_META_DESCRIPTION_LENGTH} characters` });
  }

  if (!page.h1 || page.h1.trim().length < 5) {
    errors.push({ field: "h1", message: "H1 heading is required" });
  }

  const sections = Array.isArray(page.contentSections) ? page.contentSections : [];
  if (sections.length === 0) {
    errors.push({ field: "contentSections", message: "At least one content section is required" });
  } else {
    const totalWords = sections.reduce((count: number, section: any) => {
      const content = typeof section.content === "string" ? section.content : JSON.stringify(section.content || "");
      return count + content.split(/\s+/).filter(Boolean).length;
    }, 0);
    if (totalWords < MIN_BODY_WORD_COUNT) {
      errors.push({ field: "contentSections", message: `Body content must be at least ${MIN_BODY_WORD_COUNT} words (currently ${totalWords})` });
    }
  }

  const internalLinks = Array.isArray(page.internalLinks) ? page.internalLinks : [];
  if (internalLinks.length === 0) {
    errors.push({ field: "internalLinks", message: "At least one internal link is required" });
  }

  if (!page.parentHub || page.parentHub.trim().length === 0) {
    errors.push({ field: "parentHub", message: "Parent hub association is required" });
  }

  if (!page.medicallyReviewedBy || page.medicallyReviewedBy.trim().length === 0) {
    errors.push({ field: "medicallyReviewedBy", message: "Medically reviewed by attribution is required" });
  }

  const refs = Array.isArray(page.references) ? page.references : [];
  if (refs.length === 0) {
    errors.push({ field: "references", message: "At least one reference is required" });
  }

  if (!page.tier) {
    errors.push({ field: "tier", message: "Tier is required" });
  }

  if (!page.pageType) {
    errors.push({ field: "pageType", message: "Page type is required" });
  }

  if (!page.slug || page.slug.trim().length === 0) {
    errors.push({ field: "slug", message: "Slug is required" });
  }

  if (!page.language || page.language.trim().length === 0) {
    errors.push({ field: "language", message: "Language is required" });
  }

  return { valid: errors.length === 0, errors };
}
