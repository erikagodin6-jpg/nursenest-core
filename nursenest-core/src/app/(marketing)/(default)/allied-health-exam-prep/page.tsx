import type { Metadata } from "next";
import Link from "next/link";
import { AlliedHubProfessionGrid } from "@/components/marketing/allied-hub-profession-grid";
import { AlliedMarketingPagination } from "@/components/marketing/allied-pagination";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { ALLIED_HUB_PROFESSION_PAGE_SIZE } from "@/lib/allied/allied-marketing-constants";
import { listAlliedProfessionsSorted } from "@/lib/allied/allied-professions-registry";
import { alliedHubBreadcrumbs } from "@/lib/seo/allied-breadcrumbs";
import { absoluteUrl } from "@/lib/seo/site-origin";

export const revalidate = 86400;

const BASE = "/allied-health-exam-prep";

type Props = { searchParams: Promise<{ page?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page ?? "1") || 1);
  const title =
    page > 1
      ? `Allied health exam prep — professions (page ${page}) | NurseNest`
      : "Allied health exam prep | RT, MLT, paramedic & more | NurseNest";
  const description =
    "Explore allied health certification prep by profession — pathway-scoped lessons, safe pagination, and clear links to study tools. Content stays within the allied tier.";
  const canonical = page > 1 ? `${BASE}?page=${page}` : BASE;
  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(canonical) },
    openGraph: { title, description, url: absoluteUrl(canonical), type: "website" },
    ...(page > 1 ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function AlliedHealthExamPrepHubPage({ searchParams }: Props) {
  const sp = await searchParams;
  const pageRequested = Math.max(1, Number(sp.page ?? "1") || 1);
  const all = listAlliedProfessionsSorted();
  const pageSize = ALLIED_HUB_PROFESSION_PAGE_SIZE;
  const total = all.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(pageRequested, pageCount);
  const skip = (page - 1) * pageSize;
  const slice = all.slice(skip, skip + pageSize);

  const { crumbs, schemaItems } = alliedHubBreadcrumbs();

  return (
    <div className="nn-marketing-surface">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <BreadcrumbJsonLd items={schemaItems} />
        <div className="mb-6">
          <BreadcrumbTrail items={crumbs} />
        </div>

        <header className="relative overflow-hidden rounded-3xl border border-primary/15 bg-gradient-to-br from-primary/[0.07] via-[var(--theme-card-bg)] to-amber-500/[0.06] px-6 py-10 sm:px-10">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Allied health</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[var(--theme-heading-text)] sm:text-4xl">
            Exam prep by profession
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted">
            Pick your discipline for overview pages, paginated lesson hubs, and internal links — built for scale without loading entire
            libraries into one screen. Nursing and NP hubs stay separate; allied content follows strict tier rules.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/pricing"
              className="inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-95"
            >
              View plans
            </Link>
            <Link
              href="/exam-lessons"
              className="inline-flex rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-muted/80"
            >
              All exam pathways
            </Link>
          </div>
        </header>

        <section className="mt-12">
          <h2 className="text-xl font-bold text-[var(--theme-heading-text)]">Professions</h2>
          <p className="mt-2 text-sm text-muted">
            Each card opens a dedicated guide with lessons listed on separate, paginated URLs — never the full dataset at once.
          </p>
          <div className="mt-6">
            <AlliedHubProfessionGrid professions={slice} />
          </div>
          <AlliedMarketingPagination
            basePath={BASE}
            page={page}
            pageCount={pageCount}
            total={total}
            pageSize={pageSize}
            label="professions"
          />
        </section>

        <section className="mt-14 rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Why this hub exists</h2>
          <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-muted">
            <li>ISR-cached pages with bounded queries — safe under load.</li>
            <li>Breadcrumbs and JSON-LD on indexable routes.</li>
            <li>Profession and lesson detail URLs are stable for growth and imports.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
