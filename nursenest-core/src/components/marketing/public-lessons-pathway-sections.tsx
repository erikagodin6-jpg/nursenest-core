import Link from "next/link";
import { unstable_cache } from "next/cache";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { buildExamPathwayPath, getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { getCatalogLessonPreviewTitles, listPathwayIdsWithLessons } from "@/lib/lessons/pathway-lesson-loader";
import { examLessonsIndexBreadcrumbs } from "@/lib/seo/pathway-breadcrumbs";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";
import { formatMarketingMessage } from "@/lib/marketing-i18n-core";

const cachedPathwayIdsWithLessons = unstable_cache(
  () => listPathwayIdsWithLessons(),
  ["public-lessons-pathway-sections-v1"],
  { revalidate: 600, tags: ["pathway-lesson-index"] },
);

function roleGroup(p: ExamPathwayDefinition): "rn" | "pn" | "np" | "allied" | null {
  if (p.roleTrack === "rn") return "rn";
  if (p.roleTrack === "lpn" || p.roleTrack === "rpn") return "pn";
  if (p.roleTrack === "np") return "np";
  if (p.roleTrack === "allied") return "allied";
  return null;
}

export async function PublicLessonsPathwaySections({ locale }: { locale: string }) {
  const pathwayIds = await cachedPathwayIdsWithLessons();
  const pathways = pathwayIds
    .map((id) => getExamPathwayById(id))
    .filter((p): p is ExamPathwayDefinition => !!p && p.status !== "hidden")
    .sort((a, b) => {
      const c = a.countrySlug.localeCompare(b.countrySlug);
      if (c !== 0) return c;
      return a.displayName.localeCompare(b.displayName);
    });

  const grouped: Record<"rn" | "pn" | "np" | "allied", ExamPathwayDefinition[]> = {
    rn: [],
    pn: [],
    np: [],
    allied: [],
  };
  for (const p of pathways) {
    const g = roleGroup(p);
    if (g) grouped[g].push(p);
  }

  const { crumbs, schemaItems } = examLessonsIndexBreadcrumbs();
  const m = await loadMarketingMessages(locale);
  const en = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
  const t = (key: string, params?: Record<string, string | number>) => formatMarketingMessage(m, key, params, en);

  const regionLabel = (slug: string) =>
    slug === "canada" ? t("pages.pricing.country.ca") : t("pages.pricing.country.us");

  const sectionTitle: Record<"rn" | "pn" | "np" | "allied", string> = {
    rn: "Registered Nurse (RN)",
    pn: "Practical Nurse (PN)",
    np: "Nurse Practitioner (NP)",
    allied: "Allied health",
  };

  const sectionLead: Record<"rn" | "pn" | "np" | "allied", string> = {
    rn: "NCLEX-RN and country-specific RN tracks. Each hub lists modules aligned to that exam.",
    pn: "NCLEX-PN (US) and REx-PN (Canada) hubs with PN-scoped clinical lessons.",
    np: "Board-specific NP preparation—FNP, AGPCNP, PMHNP, and Canadian NP tracks.",
    allied: "Discipline-aligned reasoning for allied certification prep.",
  };

  const order: Array<"rn" | "pn" | "np" | "allied"> = ["rn", "pn", "np", "allied"];

  return (
    <div id="exam-pathways" className="scroll-mt-8">
      <BreadcrumbJsonLd items={schemaItems.map((s) => ({ name: s.name, item: s.item }))} />
      <div className="mb-6">
        <BreadcrumbTrail items={crumbs} />
      </div>
      {order.map((key) => {
        const rows = grouped[key];
        if (rows.length === 0) return null;
        return (
          <section key={key} className="mb-10 scroll-mt-8" aria-labelledby={`lessons-section-${key}`}>
            <h2 id={`lessons-section-${key}`} className="nn-marketing-h2">
              {sectionTitle[key]}
            </h2>
            <p className="mt-1 nn-marketing-body-sm text-muted">{sectionLead[key]}</p>
            <ul className="mt-4 flex flex-col gap-3 sm:gap-[var(--nn-rhythm-card-grid-gap)]">
              {rows.map((p) => {
                const previews = getCatalogLessonPreviewTitles(p.id, 4);
                return (
                  <li key={p.id} className="nn-card p-4">
                    <p className="text-xs font-semibold uppercase text-primary">
                      {t("pages.examLessons.pathwayBadge", { region: regionLabel(p.countrySlug), shortName: p.shortName })}
                    </p>
                    <h3 className="mt-1 text-lg font-semibold text-[var(--theme-heading-text)]">{p.displayName}</h3>
                    <p className="mt-2 text-sm text-muted">{p.seoDescription}</p>
                    {previews.length > 0 ? (
                      <div className="mt-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">
                          Sample lesson topics
                        </p>
                        <ul className="mt-2 list-inside list-disc text-sm text-[var(--theme-muted-text)]">
                          {previews.map((title) => (
                            <li key={title}>{title}</li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p className="mt-3 text-sm text-[var(--theme-muted-text)]">
                        Open the hub for the full lesson list and previews for this pathway.
                      </p>
                    )}
                    <Link
                      href={buildExamPathwayPath(p, "lessons")}
                      className="mt-3 inline-block text-sm font-semibold text-primary hover:underline"
                    >
                      {t("pages.examLessons.openHub")}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
