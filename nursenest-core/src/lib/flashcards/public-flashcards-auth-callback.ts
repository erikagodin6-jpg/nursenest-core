import { buildLoginHrefWithCallback } from "@/lib/auth/auth-flow-governance";
import type { MarketingRegionToggle } from "@/lib/marketing/marketing-entry-routes";
import { pathwayHubAppFlashcardsHref } from "@/lib/marketing/pathway-hub-app-questions-href";

export function defaultPublicFlashcardsPathwayId(region: MarketingRegionToggle): string {
  return region === "CA" ? "ca-rn-nclex-rn" : "us-rn-nclex-rn";
}

export function publicFlashcardsHubLearnerHref(region: MarketingRegionToggle): string {
  return pathwayHubAppFlashcardsHref(defaultPublicFlashcardsPathwayId(region));
}

export function publicFlashcardDeckStudyHref(deckSlug: string): string {
  const slug = deckSlug.trim();
  if (!slug) return "/app/flashcards";
  const params = new URLSearchParams();
  params.set("start", "1");
  params.set("shuffle", "1");
  return `/app/flashcards/${encodeURIComponent(slug)}?${params.toString()}`;
}

export function publicFlashcardsHubLoginHref(locale: string, region: MarketingRegionToggle): string {
  return buildLoginHrefWithCallback(publicFlashcardsHubLearnerHref(region), locale);
}

export function publicFlashcardDeckLoginHref(locale: string, deckSlug: string): string {
  return buildLoginHrefWithCallback(publicFlashcardDeckStudyHref(deckSlug), locale);
}
