/**
 * Marketing chrome (header, footer, utility strip) should import href helpers from here instead of
 * `@/lib/legacy-marketing-routes` so layout components do not depend on that module directly.
 */
export { mapLegacyMarketingHref, marketingAssetUrl, resolveMarketingHref } from "@/lib/legacy-marketing-routes";
