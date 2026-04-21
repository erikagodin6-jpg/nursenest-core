import "server-only";

import { createHash } from "node:crypto";
export const PUBLIC_ROUTE_CACHE_CONTROL =
  "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400, stale-if-error=86400" as const;

export function buildPublicResponseEtag(body: string): string {
  const digest = createHash("sha256").update(body, "utf8").digest("base64url").slice(0, 27);
  return `W/"${digest}"`;
}

export function requestMatchesEtag(request: Pick<Request, "headers">, etag: string): boolean {
  const ifNoneMatch = request.headers.get("if-none-match");
  if (!ifNoneMatch) return false;
  return ifNoneMatch
    .split(",")
    .map((value) => value.trim())
    .some((value) => value === "*" || value === etag);
}
