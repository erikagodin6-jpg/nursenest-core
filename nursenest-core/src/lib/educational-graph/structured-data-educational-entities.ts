import { toAbsoluteSiteUrl } from "@/lib/seo/breadcrumb-utils";
import type { NursingGlossaryTerm } from "@/lib/seo/nursing-glossary-registry";

export function definedTermJsonLd(term: NursingGlossaryTerm, pagePath: string): Record<string, unknown> {
  const url = toAbsoluteSiteUrl(pagePath);
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: term.term,
    description: term.definition,
    url,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      name: "NurseNest Nursing Glossary",
      url: toAbsoluteSiteUrl("/nursing-glossary"),
    },
  };
}

export function learningResourceJsonLd(input: {
  name: string;
  description: string;
  pagePath: string;
  educationalLevel?: string;
  about?: string;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: input.name,
    description: input.description,
    url: toAbsoluteSiteUrl(input.pagePath),
    learningResourceType: "Study guide",
    educationalLevel: input.educationalLevel ?? "Registered Nurse",
    ...(input.about ? { about: input.about } : {}),
  };
}

export function medicalWebPageJsonLd(input: {
  name: string;
  description: string;
  pagePath: string;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: input.name,
    description: input.description,
    url: toAbsoluteSiteUrl(input.pagePath),
  };
}
