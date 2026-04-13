const PATHWAY_SCOPE_PREFIXES = [
  "/app/questions",
  "/app/lessons",
  "/app/flashcards",
  "/app/practice-tests",
] as const;

function isPathwayScopablePath(pathname: string): boolean {
  return PATHWAY_SCOPE_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function withPathwayScopeHref(href: string, pathwayId: string | null | undefined): string {
  const pathway = pathwayId?.trim();
  if (!pathway) return href;
  const rawHref = href.trim();
  if (!rawHref || !rawHref.startsWith("/")) return href;

  const url = new URL(rawHref, "http://localhost");
  if (!isPathwayScopablePath(url.pathname)) return href;
  if (url.searchParams.has("pathwayId")) return href;

  url.searchParams.set("pathwayId", pathway);
  const query = url.searchParams.toString();
  return `${url.pathname}${query ? `?${query}` : ""}${url.hash}`;
}
