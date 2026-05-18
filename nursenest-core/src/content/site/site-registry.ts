import { FAQ } from "../pages/faq";
import { ABOUT } from "../pages/about";
import { TERMS_OF_SERVICE } from "../legal/terms";
import { PLATFORM_LEGAL } from "../platform/platform-legal";
import { ALLIED_HEALTH_PLATFORM } from "../pages/allied-health";

export const SITE_REGISTRY = {
  faq: FAQ,
  about: ABOUT,
  terms: TERMS_OF_SERVICE,
  legal: PLATFORM_LEGAL,
  alliedHealth: ALLIED_HEALTH_PLATFORM,
} as const;

export type SitePageKey = keyof typeof SITE_REGISTRY;

export function getSitePage(key: SitePageKey) {
  return SITE_REGISTRY[key];
}
