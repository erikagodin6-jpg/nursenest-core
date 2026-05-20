import { revalidatePath } from "next/cache";
import type { MarketingPublicContentSurface } from "@/lib/marketing/marketing-public-content-policy";
import { normalizeMarketingPublicContentLocale } from "@/lib/marketing/marketing-public-content-policy";

/**
 * Best-effort path revalidation after marketing public copy changes.
 * Does not alter canonical URLs — only refreshes cached HTML for listed paths.
 */
export function revalidatePathsForMarketingSurface(surface: MarketingPublicContentSurface, locale: string): void {
  const loc = normalizeMarketingPublicContentLocale(locale);
  const locPrefix = loc !== "en" ? `/${loc}` : "";

  const paths = new Set<string>();

  const add = (p: string) => {
    if (p) paths.add(p);
  };

  switch (surface) {
    case "home":
    case "registry":
      add("/");
      if (locPrefix) add(locPrefix);
      break;
    case "pricing":
      add("/pricing");
      if (locPrefix) add(`${locPrefix}/pricing`);
      break;
    case "flashcards":
      add("/flashcards");
      if (locPrefix) add(`${locPrefix}/flashcards`);
      break;
    case "blog":
      add("/blog");
      if (locPrefix) add(`${locPrefix}/blog`);
      break;
    case "tools":
      add("/tools");
      if (locPrefix) add(`${locPrefix}/tools`);
      break;
    case "study":
      add("/questions");
      add("/practice");
      if (locPrefix) {
        add(`${locPrefix}/questions`);
        add(`${locPrefix}/practice`);
      }
      break;
    case "hubs":
      /** Hub copy can affect multiple entry routes; refresh default marketing shell + home. */
      add("/");
      if (locPrefix) add(locPrefix);
      break;
    case "labs":
      add("/labs");
      if (locPrefix) add(`${locPrefix}/labs`);
      break;
    case "med_calc":
      add("/med-calculations");
      if (locPrefix) add(`${locPrefix}/med-calculations`);
      break;
    default:
      add("/");
  }

  for (const p of paths) {
    try {
      revalidatePath(p);
    } catch {
      /* revalidatePath can throw in edge contexts */
    }
  }
}
