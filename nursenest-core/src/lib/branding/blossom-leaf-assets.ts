/** Same-origin optimized Blossom leaf rasters (generated from hotpinkblossomleaflogo.png). */
export const BLOSSOM_LEAF_ASSET_VERSION = "2026-05-21-opt1" as const;

const v = `?v=${BLOSSOM_LEAF_ASSET_VERSION}`;

export const BLOSSOM_LEAF_64_AVIF = `/branding/blossom-leaf/leaf-64.avif${v}` as const;
export const BLOSSOM_LEAF_64_WEBP = `/branding/blossom-leaf/leaf-64.webp${v}` as const;
export const BLOSSOM_LEAF_128_AVIF = `/branding/blossom-leaf/leaf-128.avif${v}` as const;
export const BLOSSOM_LEAF_128_WEBP = `/branding/blossom-leaf/leaf-128.webp${v}` as const;

/** Default raster for header/footer lockups (~42–52px rendered). */
export const BLOSSOM_LEAF_DEFAULT_SRC = BLOSSOM_LEAF_64_WEBP;

/** Legacy CDN key — keep for Spaces uploads / admin references only. */
export const BLOSSOM_LEAF_LEGACY_CDN_PNG =
  "https://nursenest-images.tor1.cdn.digitaloceanspaces.com/hotpinkblossomleaflogo.png" as const;

export function isLegacyBlossomLeafCdnUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return url.includes("hotpinkblossomleaflogo.png");
}

export function shouldUseOptimizedBlossomLeafDelivery(url: string | null | undefined): boolean {
  if (!url) return false;
  if (isLegacyBlossomLeafCdnUrl(url)) return true;
  return url.includes("/branding/blossom-leaf/");
}
