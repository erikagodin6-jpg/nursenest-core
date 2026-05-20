import type { ProgrammaticInternalLink } from "@/lib/seo/programmatic-seo-engine/types";

function normalizeHref(href: string): string {
  const h = href.trim();
  const q = h.indexOf("?");
  return q === -1 ? h.replace(/\/$/, "") || h : `${h.slice(0, q).replace(/\/$/, "")}${h.slice(q)}`;
}

/**
 * Dedupe by href, drop self-links, cap list length, prefer stable order (first wins).
 */
export function sanitizeProgrammaticInternalLinks(
  links: ProgrammaticInternalLink[],
  opts: { excludeHrefPrefixes?: readonly string[]; max?: number },
): ProgrammaticInternalLink[] {
  const max = Math.min(Math.max(opts.max ?? 6, 2), 10);
  const exclude = (opts.excludeHrefPrefixes ?? []).map((p) => normalizeHref(p));
  const seen = new Set<string>();
  const out: ProgrammaticInternalLink[] = [];
  for (const l of links) {
    const href = normalizeHref(l.href);
    if (!href.startsWith("/")) continue;
    if (exclude.some((p) => href === p || href.startsWith(`${p}?`))) continue;
    if (seen.has(href)) continue;
    seen.add(href);
    const anchor = l.anchor.trim().slice(0, 96) || href;
    out.push({ ...l, href, anchor });
    if (out.length >= max) break;
  }
  return out;
}
