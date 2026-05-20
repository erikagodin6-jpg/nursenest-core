/**
 * Map legacy Replit Object Storage paths (as stored in DB/seed JSON) to
 * DigitalOcean Spaces object keys and public CDN URLs (nursenest-images, tor1).
 */

export const NURSENEST_IMAGES_CDN_BASE = "https://nursenest-images.tor1.cdn.digitaloceanspaces.com";

const REPLIT_OBJSTORE_PREFIX = /^replit-objstore-[0-9a-f-]+\//i;

/**
 * Strip `/replit-objstore-<uuid>/` and map `.private/products|previews` → `private-products/...`.
 * `public/...` stays under `public/...`.
 *
 * @returns Spaces object key (no leading slash), or `null` if the path is not recognized.
 */
export function replitLegacyStoragePathToSpacesObjectKey(legacyPath: string): string | null {
  if (legacyPath == null || typeof legacyPath !== "string") return null;
  let s = legacyPath.trim();
  if (!s) return null;
  s = s.replace(/^\/+/, "");
  if (REPLIT_OBJSTORE_PREFIX.test(s)) {
    s = s.replace(REPLIT_OBJSTORE_PREFIX, "");
  }
  if (s.startsWith(".private/products/")) {
    return `private-products/${s.slice(".private/products/".length)}`;
  }
  if (s.startsWith(".private/previews/")) {
    return `private-products/previews/${s.slice(".private/previews/".length)}`;
  }
  if (s.startsWith("public/")) {
    return s;
  }
  return null;
}

export function spacesObjectKeyToCdnUrl(
  objectKey: string,
  baseUrl: string = NURSENEST_IMAGES_CDN_BASE,
): string {
  const b = baseUrl.replace(/\/$/, "");
  const k = objectKey.replace(/^\/+/, "");
  const enc = k.split("/").map((seg) => encodeURIComponent(seg)).join("/");
  return `${b}/${enc}`;
}

/** Full CDN URL for a legacy Replit storage path, or `null` if unmappable. */
export function replitLegacyStorageUrlToCdnUrl(legacyPath: string): string | null {
  const key = replitLegacyStoragePathToSpacesObjectKey(legacyPath);
  if (!key) return null;
  return spacesObjectKeyToCdnUrl(key);
}

export function isNursenestImagesCdnUrl(urlString: string): boolean {
  try {
    const u = new URL(urlString.trim());
    return u.protocol === "https:" && u.hostname === "nursenest-images.tor1.cdn.digitaloceanspaces.com";
  } catch {
    return false;
  }
}
