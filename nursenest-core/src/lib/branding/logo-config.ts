import { NURSENEST_IMAGES_SPACE_PUBLIC_BASE_URL } from "@/config/marketing-cdn.catalog";
import { relativeLuminanceFromHex } from "@/lib/color/hex-luminance";
import { THEME_OPTIONS } from "@/lib/theme/theme-registry";

/** Same-origin transparent theme marks (see `scripts/generate-theme-logos-from-registry.ts`). */
export const COMMITTED_THEME_LOGO_PUBLIC_PREFIX = "/branding/theme-logos/" as const;

/**
 * Global site logo fallbacks (header uses `SiteBrandLogoMark` → `getHeaderBrandLogoLoadChain`:
 * committed transparent PNG first, then CDN/proxy, then `PRIMARY_LOGO_URL`, then local SVG).
 * Default brand theme is ocean/clinical-blue (`NURSENEST_DEFAULT_THEME`).
 */
export const PRIMARY_LOGO_URL = `${COMMITTED_THEME_LOGO_PUBLIC_PREFIX}lavenderbrandlogo_transparent.png` as const;

/** CDN URL for default lavender wordmark (last resort when same-origin assets are unavailable). */
export const PRIMARY_LOGO_CDN_URL = `${NURSENEST_IMAGES_SPACE_PUBLIC_BASE_URL.replace(/\/$/, "")}/lavenderbrandlogo_transparent.png` as const;

/**
 * Committed same-origin wordmark — always available when CDN/proxy/theme objects fail.
 * Bump `v` after visual updates to bust caches.
 */
export const LOCAL_BRAND_MARK_PATH = "/branding/nursenest-mark.svg?v=1" as const;

/** Same-origin SVG when remote theme marks fail (not the hero gradient placeholder). */
export const SITE_LOGO_FALLBACK_PATH = LOCAL_BRAND_MARK_PATH;

/**
 * @deprecated Alias for legacy `theme-logo-url` chains; same as `SITE_LOGO_FALLBACK_PATH`.
 */
export const FALLBACK_LOGO_PATH = SITE_LOGO_FALLBACK_PATH;

export const BRAND_NAME = "NurseNest" as const;

/**
 * Fixed header slot: height + max-width are the single authority for rendered logo size.
 * Marketing header: h-5 · sm:h-6 · lg:h-7 — compact wordmark, no stretch.
 * The img uses {@link HEADER_BRAND_LOGO_IMG_CLASSNAME} (`h-full`, `object-contain`) inside this slot.
 */
export const HEADER_BRAND_LOGO_SLOT_CLASSNAME =
  "nn-brand-header-logo-slot inline-flex flex-none shrink-0 items-center justify-start overflow-hidden self-center bg-transparent h-5 max-h-5 w-auto max-w-[min(92vw,10rem)] sm:h-6 sm:max-h-6 sm:max-w-[12rem] lg:h-7 lg:max-h-7 lg:max-w-[14rem]" as const;

/** @deprecated Homepage no longer enlarges the mark; kept as empty merge for older call sites. */
export const HOME_BRAND_LOGO_MARK_CLASSNAME = "" as const;

/**
 * Raster mark: fills slot height; width from aspect ratio; `object-contain` keeps sharpness and trims effective padding vs stretching.
 */
export const HEADER_BRAND_LOGO_IMG_CLASSNAME =
  "nn-brand-header-logo block h-full w-auto max-h-full max-w-full shrink-0 bg-transparent object-contain object-left [image-rendering:auto]" as const;

/** Site footer: smaller than header; same object-contain rules, no vertical stretch. */
export const FOOTER_BRAND_LOGO_SLOT_CLASSNAME =
  "nn-brand-footer-logo-slot inline-flex flex-none shrink-0 items-center justify-center overflow-visible bg-transparent h-[3rem] max-h-[3rem] w-auto max-w-[min(88vw,14rem)] sm:h-[3.25rem] sm:max-h-[3.25rem] sm:max-w-[15rem] md:max-w-[16rem]" as const;

export const FOOTER_BRAND_LOGO_IMG_CLASSNAME =
  "nn-brand-footer-logo block h-full w-auto max-h-full max-w-full shrink-0 bg-transparent object-contain object-center [image-rendering:auto]" as const;

/** Auth / narrow forms: same height scale as marketing header (compact, consistent). */
export const AUTH_BRAND_LOGO_SLOT_CLASSNAME =
  "nn-brand-auth-logo-slot inline-flex flex-none shrink-0 items-center justify-center overflow-hidden bg-transparent h-5 max-h-5 w-auto max-w-[min(90vw,10rem)] sm:h-6 sm:max-h-6 sm:max-w-[12rem] lg:h-7 lg:max-h-7 lg:max-w-[14rem]" as const;

export const AUTH_BRAND_LOGO_IMG_CLASSNAME =
  "nn-brand-auth-logo block h-full w-auto max-h-full max-w-full shrink-0 bg-transparent object-contain object-center [image-rendering:auto]" as const;

/** Learner app shell top bar: matches marketing header logo scale. */
export const LEARNER_BRAND_LOGO_SLOT_CLASSNAME =
  "nn-brand-learner-logo-slot inline-flex flex-none shrink-0 items-center justify-start overflow-hidden bg-transparent h-5 max-h-5 w-auto max-w-[min(92vw,10rem)] sm:h-6 sm:max-h-6 sm:max-w-[12rem] lg:h-7 lg:max-h-7 lg:max-w-[14rem]" as const;

export const LEARNER_BRAND_LOGO_IMG_CLASSNAME =
  "nn-brand-learner-logo block h-full w-auto max-h-full max-w-full shrink-0 bg-transparent object-contain object-left [image-rendering:auto]" as const;

/** 404 / branded empty states: larger mark than nav; same object-contain rules as footer. */
export const HERO_BRAND_LOGO_SLOT_CLASSNAME =
  "nn-brand-hero-logo-slot inline-flex flex-none shrink-0 items-center justify-center overflow-hidden bg-transparent h-16 max-h-16 w-auto max-w-[min(92vw,14rem)] sm:h-[5.25rem] sm:max-h-[5.25rem] sm:max-w-[17rem] md:h-24 md:max-h-24 md:max-w-[18rem]" as const;

export const HERO_BRAND_LOGO_IMG_CLASSNAME =
  "nn-brand-hero-logo block h-full w-auto max-h-full max-w-full shrink-0 bg-transparent object-contain object-center [image-rendering:auto]" as const;

export type BrandLogoMarkVariant = "header" | "footer" | "auth" | "learner" | "hero";

/** Single presentation contract for `<SiteBrandLogoMark />` (slot + img). Default `header` matches marketing nav. */
export function brandLogoMarkPresentation(variant: BrandLogoMarkVariant = "header"): {
  slotClassName: string;
  imgClassName: string;
} {
  switch (variant) {
    case "footer":
      return { slotClassName: FOOTER_BRAND_LOGO_SLOT_CLASSNAME, imgClassName: FOOTER_BRAND_LOGO_IMG_CLASSNAME };
    case "auth":
      return { slotClassName: AUTH_BRAND_LOGO_SLOT_CLASSNAME, imgClassName: AUTH_BRAND_LOGO_IMG_CLASSNAME };
    case "learner":
      return { slotClassName: LEARNER_BRAND_LOGO_SLOT_CLASSNAME, imgClassName: LEARNER_BRAND_LOGO_IMG_CLASSNAME };
    case "hero":
      return { slotClassName: HERO_BRAND_LOGO_SLOT_CLASSNAME, imgClassName: HERO_BRAND_LOGO_IMG_CLASSNAME };
    default:
      return { slotClassName: HEADER_BRAND_LOGO_SLOT_CLASSNAME, imgClassName: HEADER_BRAND_LOGO_IMG_CLASSNAME };
  }
}

/** Extra classes merged onto the slot in `<SiteBrandLogoMark />` (call sites rarely need overrides). */
export const DEFAULT_BRAND_LOGO_MARK_CLASSNAME = "" as const;

/**
 * CSS filter for brand mark images — adapts the logo mark to theme context.
 *
 * ## Dark themes
 * The SVG fallback (`nursenest-mark.svg`) is a dark-colored mark. On dark nav backgrounds
 * it would be invisible. `brightness(0) invert(1)` converts any mark to opaque white —
 * safe for both the SVG fallback and correctly-produced light-on-transparent dark-theme PNGs
 * (white → brightness(0) → black → invert → white = no-op; dark → brightness(0) → black → invert → white).
 * A subtle drop-shadow restores depth.
 *
 * ## High-luminance light themes
 * Very pale primaries (pastels) on a near-white header need a hairline edge to stay visible.
 *
 * ## Standard light themes
 * No filter — dark mark on a light-tinted nav reads clearly.
 */
export function brandLogoRasterContrastClass(themeId: string): string {
  const opt = THEME_OPTIONS.find((o) => o.id === themeId);
  if (!opt) return "";
  if (opt.group === "dark") {
    // Convert dark logo to white silhouette for dark nav backgrounds.
    return "[filter:brightness(0)_invert(1)_drop-shadow(0_1px_3px_rgba(0,0,0,0.4))]";
  }
  if (relativeLuminanceFromHex(opt.color) >= 0.55) {
    // Very light primary: add a hairline edge so the mark doesn't vanish on light chrome.
    return "[filter:drop-shadow(0_0_1px_rgba(15,23,42,0.28))]";
  }
  return "";
}
