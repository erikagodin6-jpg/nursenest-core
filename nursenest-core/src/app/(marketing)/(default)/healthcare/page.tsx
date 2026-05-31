import type { Metadata } from "next";
import Link from "next/link";
import { BookOpenCheck, ClipboardCheck, FlaskConical, HeartPulse, Pill, Search, ShieldCheck, Stethoscope } from "lucide-react";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import {
  AUTHORITY_CATEGORY_META,
  getAuthorityPages,
  getAuthorityPagesByCategory,
  searchAuthorityContent,
  validateAuthorityPage,
  type AuthorityContentCategory,
} from "@/lib/authority/healthcare-authority-content-engine";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";

const PATH = "/healthcare";

export const metadata: Metadata = {
  title: "Healthcare Education Library | NurseNest",
  description:
    "Explore NurseNest healthcare authority guides for conditions, medications, clinical skills, labs, and nursing care plans with clinical review governance.",
  alternates: {
    canonical: marketingAlternatesSharedPage("en", PATH).canonical,
  },
  openGraph: {
    title: "Healthcare Education Library | NurseNest",
    description:
      "Clinically governed healthcare education guides for nursing and allied health learners.",
    type: "website",
    url: marketingAlternatesSharedPage("en", PATH).canonical,
  },
};

const CATEGORY_ICONS: Record<AuthorityContentCategory, typeof HeartPulse> = {
  conditions: HeartPulse,
  medications: Pill,
  "clinical-skills": Stethoscope,
  labs: FlaskConical,
  "care-plans": ClipboardCheck,
};

export default async function HealthcareAuthorityIndexPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const query = String(resolvedSearchParams.q ?? "").trim();
  const results = query ? searchAuthorityContent(query, 12) : [];
  const allPages = getAuthorityPages();
  const averageQuality =
    Math.round(allPages.reduce((sum, page) => sum + validateAuthorityPage(page).score, 0) / Math.max(1, allPages.length));

  return (
    <main className="bg-[var(--theme-page-bg)] text-[var(--theme-body-text)]">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Healthcare Library", path: PATH },
        ]}
      />
      <section className="border-b border-[var(--semantic-border-soft)] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--semantic-brand)_10%,var(--theme-page-bg)),var(--theme-page-bg))]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <BreadcrumbTrail
            items={[
              { name: "Home", href: "/" },
              { name: "Healthcare Library", href: PATH },
            ]}
            navClassName="nn-marketing-caption text-[var(--theme-muted-text)]"
          />
          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--semantic-brand)]">
                Healthcare Authority Content Engine
              </p>
              <h1 className="nn-marketing-h1 mt-3 text-[var(--theme-heading-text)]">
                Evidence-Informed Healthcare Guides For Nursing And Allied Health Learners
              </h1>
              <p className="nn-marketing-lead mt-4 max-w-3xl text-[var(--theme-muted-text)]">
                A governed content library for conditions, medications, clinical skills, labs, and nursing care plans,
                built around clinical reasoning, internal linking, review status, references, and EEAT signals.
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)]">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-8 w-8 text-[var(--semantic-success)]" aria-hidden />
                <div>
                  <p className="text-sm font-bold text-[var(--theme-heading-text)]">Governance Active</p>
                  <p className="text-xs text-[var(--theme-muted-text)]">Average content quality gate score: {averageQuality}%</p>
                </div>
              </div>
              <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <Metric label="Seed Pages" value={`${allPages.length}`} />
                <Metric label="Review Fields" value="Required" />
                <Metric label="References" value="Required" />
                <Metric label="Schema" value="Enabled" />
              </dl>
            </div>
          </div>

          <form action="/healthcare" className="mt-8 flex flex-col gap-3 rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-3 shadow-[var(--semantic-shadow-soft)] sm:flex-row">
            <label className="sr-only" htmlFor="authority-search">
              Search Healthcare Library
            </label>
            <div className="flex min-h-12 flex-1 items-center gap-3 rounded-xl border border-[var(--semantic-border-soft)] px-3">
              <Search className="h-5 w-5 text-[var(--semantic-brand)]" aria-hidden />
              <input
                id="authority-search"
                name="q"
                defaultValue={query}
                placeholder="Search heart failure, Lasix, K+, oxygen therapy..."
                className="w-full bg-transparent text-sm text-[var(--theme-body-text)] outline-none placeholder:text-[var(--theme-muted-text)]"
              />
            </div>
            <button className="min-h-12 rounded-xl bg-[var(--semantic-brand)] px-5 text-sm font-bold text-[var(--semantic-on-brand)] shadow-[var(--elevation-rest)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-elevated)]">
              Search
            </button>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {query ? (
          <div className="mb-10 rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)]">
            <h2 className="text-xl font-bold text-[var(--theme-heading-text)]">Search Results For “{query}”</h2>
            {results.length ? (
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {results.map((page) => (
                  <AuthorityCard key={`${page.category}-${page.slug}`} page={page} />
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-[var(--theme-muted-text)]">No authority pages match that search yet.</p>
            )}
          </div>
        ) : null}

        <div className="grid gap-6">
          {(Object.keys(AUTHORITY_CATEGORY_META) as AuthorityContentCategory[]).map((category) => {
            const meta = AUTHORITY_CATEGORY_META[category];
            const Icon = CATEGORY_ICONS[category];
            const pages = getAuthorityPagesByCategory(category);
            return (
              <section id={category} key={category} className="scroll-mt-24">
                <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5 text-[var(--semantic-brand)]" aria-hidden />
                      <h2 className="text-2xl font-bold text-[var(--theme-heading-text)]">{meta.title}</h2>
                    </div>
                    <p className="mt-1 text-sm text-[var(--theme-muted-text)]">{meta.description}</p>
                  </div>
                  <span className="rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-1 text-xs font-semibold text-[var(--theme-muted-text)]">
                    {meta.futureTarget}
                  </span>
                </div>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {pages.map((page) => (
                    <AuthorityCard key={`${page.category}-${page.slug}`} page={page} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </section>
    </main>
  );
}

function AuthorityCard({ page }: { page: ReturnType<typeof getAuthorityPages>[number] }) {
  const quality = validateAuthorityPage(page);
  return (
    <Link
      href={`/healthcare/${page.category}/${page.slug}`}
      className="group flex min-h-56 flex-col rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)] transition hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--semantic-brand)_32%,var(--semantic-border-soft))] hover:shadow-[var(--shadow-elevated)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_45%,transparent)]"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-full bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--semantic-surface))] px-3 py-1 text-xs font-bold text-[var(--semantic-brand)]">
          {AUTHORITY_CATEGORY_META[page.category].singular}
        </span>
        <span className="rounded-full bg-[color-mix(in_srgb,var(--semantic-success)_10%,var(--semantic-surface))] px-3 py-1 text-xs font-bold text-[var(--semantic-success)]">
          Quality {quality.score}%
        </span>
      </div>
      <h3 className="mt-4 text-lg font-bold text-[var(--theme-heading-text)] group-hover:text-[var(--semantic-brand)]">
        {page.title}
      </h3>
      <p className="mt-2 line-clamp-3 text-sm leading-6 text-[var(--theme-muted-text)]">{page.summary}</p>
      <div className="mt-auto pt-4 text-xs font-semibold text-[var(--semantic-brand)]">Open Guide</div>
    </Link>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-text-muted)_4%,var(--semantic-surface))] p-3">
      <dt className="text-xs text-[var(--theme-muted-text)]">{label}</dt>
      <dd className="mt-1 font-bold text-[var(--theme-heading-text)]">{value}</dd>
    </div>
  );
}
