import { MARKETING_CDN_BASE } from "@/lib/marketing-assets.generated";

/** Public CDN URL for a Spaces object key (no trailing slash on base). */
export function publicCdnUrlForObjectKey(objectKey: string): string {
  const k = objectKey.replace(/^\/+/, "");
  return `${MARKETING_CDN_BASE.replace(/\/$/, "")}/${k}`;
}
