import { MARKETING_CDN_BASE } from "./marketing-assets.generated";

const PROXY_PREFIX = "/api/marketing-assets";

function isGoogleCloudStoragePublicUrl(urlString: string): boolean {
  try {
    const u = new URL(urlString);
    return u.hostname === "storage.googleapis.com";
  } catch {
    return false;
  }
}

/** `gs://` and similar are never valid in the browser — never pass them to `<img src>`. */
export function isForbiddenBrowserImageScheme(url: string): boolean {
  const s = url.trim().toLowerCase();
  return (
    s.startsWith("gs://") ||
    s.startsWith("gs:") ||
    s.startsWith("blob:") ||
    s.startsWith("chrome-extension:") ||
    s.startsWith("file:")
  );
}

/**
 * When `true`, absolute Spaces/CDN URLs are rewritten to same-origin `/api/marketing-assets/...`
 * so the server can stream objects using SPACES_KEY/SPACES_SECRET (private bucket).
 * Default is `false`: browsers load public `https://…digitaloceanspaces.com/...` URLs directly (no server credentials).
 *
 * Set `NEXT_PUBLIC_MARKETING_USE_SPACES_PROXY=true` only when the bucket is private and you intentionally use the proxy.
 *
 * Google Cloud Storage public URLs (`storage.googleapis.com/...`) are never rewritten to the proxy.
 */
export function marketingImageUsesProxy(): boolean {
  return process.env.NEXT_PUBLIC_MARKETING_USE_SPACES_PROXY === "true";
}

/**
 * After a direct public URL fails to load, retry via `/api/marketing-assets/...` (requires SPACES_* on the server).
 * Default `false`. Set `NEXT_PUBLIC_MARKETING_USE_SPACES_PROXY_FALLBACK=true` to enable.
 */
export function marketingProxyFallbackEnabled(): boolean {
  return process.env.NEXT_PUBLIC_MARKETING_USE_SPACES_PROXY_FALLBACK === "true";
}

/** Same-origin path for S3 key `screenshots/foo.webp` → `/api/marketing-assets/screenshots/foo.webp` */
export function marketingProxyPathForKey(objectKey: string): string {
  const k = objectKey.replace(/^\/+/, "");
  const enc = k
    .split("/")
    .map((seg) => encodeURIComponent(seg))
    .join("/");
  return `${PROXY_PREFIX}/${enc}`;
}

/** Rewrite an absolute Spaces/CDN URL to the local proxy path only when proxy-as-primary is enabled. */
export function resolveMarketingAbsoluteUrl(absoluteUrl: string): string {
  if (isForbiddenBrowserImageScheme(absoluteUrl)) {
    return "/marketing/hero-fallback.svg";
  }
  if (!marketingImageUsesProxy()) return absoluteUrl;
  if (isGoogleCloudStoragePublicUrl(absoluteUrl)) return absoluteUrl;
  try {
    const u = new URL(absoluteUrl);
    if (u.protocol !== "https:" && u.protocol !== "http:") {
      return "/marketing/hero-fallback.svg";
    }
    return `${PROXY_PREFIX}${u.pathname}`;
  } catch {
    return "/marketing/hero-fallback.svg";
  }
}

/** Rewrite responsive srcSet (space-separated url + descriptor per entry). */
export function resolveMarketingSrcSet(srcSet: string | undefined | null): string | undefined {
  if (!srcSet || !marketingImageUsesProxy()) return srcSet ?? undefined;
  return srcSet
    .split(",")
    .map((part) => {
      const trimmed = part.trim();
      const spaceIdx = trimmed.lastIndexOf(" ");
      if (spaceIdx === -1) {
        if (isGoogleCloudStoragePublicUrl(trimmed)) return trimmed;
        return resolveMarketingAbsoluteUrl(trimmed);
      }
      const urlPart = trimmed.slice(0, spaceIdx);
      const descriptor = trimmed.slice(spaceIdx + 1);
      if (isGoogleCloudStoragePublicUrl(urlPart)) return `${urlPart} ${descriptor}`;
      return `${resolveMarketingAbsoluteUrl(urlPart)} ${descriptor}`;
    })
    .join(", ");
}

export function getMarketingCdnBaseForDirectFallback(): string {
  return (
    process.env.NEXT_PUBLIC_MARKETING_CDN_BASE?.replace(/\/$/, "") ?? MARKETING_CDN_BASE.replace(/\/$/, "")
  );
}
