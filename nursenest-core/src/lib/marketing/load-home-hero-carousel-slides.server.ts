import "server-only";

import {
  buildHomepageHeroSlidesAtIndices,
  filterRenderableHomeHeroSlides,
  HOME_HERO_PRIMARY_CAROUSEL_INDICES,
  type HomeHeroSlide,
} from "@/config/home-hero-carousel";
import { MARKETING_PAGE_BODY_MESSAGE_SHARDS } from "@/lib/marketing-i18n/marketing-i18n-shard-groups";
import { loadMarketingMessageShards } from "@/lib/marketing-i18n/load-marketing-message-shards";

/**
 * Prebuild homepage primary carousel slides on the server so the client avoids
 * synchronous slide construction + duplicate i18n lookups during hydration.
 */
export async function loadHomeHeroPrimaryCarouselSlidesForLocale(locale: string): Promise<HomeHeroSlide[]> {
  try {
    const messages =
      (await loadMarketingMessageShards(locale, [...MARKETING_PAGE_BODY_MESSAGE_SHARDS])) ?? {};
    const t = (key: string) => (typeof messages[key] === "string" ? messages[key]! : "");
    const built = buildHomepageHeroSlidesAtIndices(t, HOME_HERO_PRIMARY_CAROUSEL_INDICES);
    return filterRenderableHomeHeroSlides(built);
  } catch {
    return [];
  }
}
