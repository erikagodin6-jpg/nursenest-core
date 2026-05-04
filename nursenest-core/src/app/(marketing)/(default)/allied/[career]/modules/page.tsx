import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { resolveAlliedProfessionFromRouteSlug } from "@/lib/allied/allied-professions-registry";
import { alliedMasteryModulesForProfession } from "@/lib/allied/allied-mastery-modules";
import { getCurrentAlliedMasteryModuleAccess } from "@/lib/allied/allied-mastery-module-access.server";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ career: string }> };

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Allied modules | Admin preview | NurseNest",
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    },
  };
}

export default async function AlliedMasteryModulesIndexPage({ params }: Props) {
  const access = await getCurrentAlliedMasteryModuleAccess();
  if (!access.ok) notFound();

  const { career } = await params;
  const prof = resolveAlliedProfessionFromRouteSlug(career);
  if (!prof) notFound();

  const modules = alliedMasteryModulesForProfession(prof.professionKey);
  if (modules.length === 0) notFound();

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8" data-testid="allied-mastery-admin-preview-index">
      <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">
        <strong>Hidden / Admin Preview Only.</strong> These modules are not visible to public users, pricing, sitemap,
        hreflang, or checkout.
      </div>
      <header className="mt-8 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--semantic-brand)]">
          {prof.h1} · Admin preview
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[var(--theme-heading-text)]">
          Career-specific mastery modules
        </h1>
      </header>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {modules.map((module) => (
          <article key={module.id} className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5">
            <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">{module.title}</h2>
            <p className="mt-2 text-sm text-[var(--theme-muted-text)]">{module.description}</p>
            <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-950">
              Not visible to public users.
            </p>
            <Link href={module.route} className="mt-4 inline-flex text-sm font-semibold text-[var(--semantic-brand)] underline">
              Preview module
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}
