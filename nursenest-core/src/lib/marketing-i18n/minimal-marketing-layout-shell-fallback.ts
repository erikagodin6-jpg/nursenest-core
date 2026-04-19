/**
 * English-only emergency strings for `(marketing)/(default)` layout when chrome shards
 * fail to load. Merged under live messages so real copy wins when present.
 */
export const MINIMAL_MARKETING_LAYOUT_SHELL_MESSAGES: Record<string, string> = {
  "brand.nurseNest": "NurseNest",
  "brand.homeAriaLabel": "NurseNest home",
  "nav.logIn": "Log in",
  "nav.language": "Language",
  "nav.theme": "Theme",
  "nav.pricing": "Pricing",
  "footer.blog": "Blog",
  "footer.faq": "FAQ",
};

export function mergeMinimalMarketingLayoutShellMessages(
  messages: Record<string, string>,
): Record<string, string> {
  return { ...MINIMAL_MARKETING_LAYOUT_SHELL_MESSAGES, ...messages };
}
