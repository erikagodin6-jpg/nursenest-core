/**
 * Map stored URLs (or same-origin proxy paths) to Spaces object keys for orphan detection.
 */

export function urlToObjectKey(urlStr: string, publicBaseUrls: string[]): string | null {
  const raw = urlStr.trim();
  if (!raw) return null;

  if (raw.startsWith("uploads/") || raw.startsWith("screenshots/") || raw.startsWith("blog/")) {
    return raw.replace(/^\/+/, "");
  }

  let u: URL;
  try {
    u = new URL(raw, "https://placeholder.local");
  } catch {
    return null;
  }

  const path = u.pathname.replace(/^\/+/, "");

  if (u.hostname === "placeholder.local") {
    if (path.startsWith("api/marketing-assets/")) {
      return path.slice("api/marketing-assets/".length);
    }
    return null;
  }

  for (const base of publicBaseUrls) {
    try {
      const b = new URL(base);
      if (u.hostname === b.hostname) {
        return decodeURIComponent(path.replace(/^\/+/, ""));
      }
    } catch {
      /* skip */
    }
  }

  return null;
}

export function collectUrlsFromJson(value: unknown, into: Set<string>): void {
  if (value === null || value === undefined) return;
  if (typeof value === "string") {
    if (/^https?:\/\//i.test(value) || value.startsWith("//")) into.add(value);
    else if (value.includes(".digitaloceanspaces.com/") || value.includes("/api/marketing-assets/")) into.add(value);
    return;
  }
  if (Array.isArray(value)) {
    for (const x of value) collectUrlsFromJson(x, into);
    return;
  }
  if (typeof value === "object") {
    for (const v of Object.values(value as Record<string, unknown>)) {
      collectUrlsFromJson(v, into);
    }
  }
}
