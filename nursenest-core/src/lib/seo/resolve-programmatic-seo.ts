import type { SeoPageDefinition } from "@/lib/seo/programmatic-registry";
import {
  getCrossClusterLinks,
  getProgrammaticSeoPage,
  getRelatedProgrammaticPages,
} from "@/lib/seo/programmatic-registry";
import { mergeProgrammaticPage } from "@/lib/seo/merge-programmatic-page";
import { loadProgrammaticOverlayBundle } from "@/lib/seo/load-programmatic-overlay";

export type ProgrammaticSeoResolved = {
  page: SeoPageDefinition;
  related: { slug: string; title: string }[];
  cross: { slug: string; label: string }[];
};

/** Registry page merged with locale overlay; related/cross titles use each target slug’s overlay when present. */
export function resolveProgrammaticSeoForLocale(slug: string, locale: string): ProgrammaticSeoResolved | null {
  const base = getProgrammaticSeoPage(slug);
  if (!base) return null;
  const bundle = loadProgrammaticOverlayBundle(locale);
  const page = mergeProgrammaticPage(base, bundle[slug]);

  const relatedRaw = getRelatedProgrammaticPages(slug, 6);
  const related = relatedRaw.map((r) => ({
    slug: r.slug,
    title: mergeProgrammaticPage(r, bundle[r.slug]).title,
  }));

  const crossRaw = getCrossClusterLinks(slug);
  const cross = crossRaw.map((c) => ({
    slug: c.slug,
    label: mergeProgrammaticPage(c, bundle[c.slug]).h1,
  }));

  return { page, related, cross };
}
