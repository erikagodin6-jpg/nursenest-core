/**
 * Public marketing URLs for blog CTAs (no app-only or API routes; no rationales).
 * Prefer canonical exam pathway hubs over generic fallbacks.
 */

import { CountryCode } from "@prisma/client";
import { blogCountryFromPrismaTarget, marketingStudyHubsForBlogExam } from "@/lib/blog/blog-study-cta";

export function defaultPracticeHubForExam(exam: string | null | undefined, countryTarget?: CountryCode | null): string {
  const hubs = marketingStudyHubsForBlogExam(exam ?? "", blogCountryFromPrismaTarget(countryTarget));
  return hubs.pathwayQuestionsHub ?? hubs.questionBankHub;
}

export function defaultLessonsHubForExam(exam: string | null | undefined, countryTarget?: CountryCode | null): string {
  return marketingStudyHubsForBlogExam(exam ?? "", blogCountryFromPrismaTarget(countryTarget)).lessonsHub;
}

/** Map tool slug from BlogPost.relatedTools to a public path */
export function toolPathForSlug(slug: string): string {
  const s = slug.replace(/^\//, "").trim();
  if (!s) return "/tools";
  return `/tools/${s}`;
}
