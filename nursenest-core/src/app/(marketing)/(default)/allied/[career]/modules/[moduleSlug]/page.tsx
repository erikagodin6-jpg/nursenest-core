import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { resolveAlliedProfessionFromRouteSlug } from "@/lib/allied/allied-professions-registry";
import { findAlliedMasteryModule } from "@/lib/allied/allied-mastery-modules";
import { getCurrentAlliedMasteryModuleAccess } from "@/lib/allied/allied-mastery-module-access.server";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ career: string; moduleSlug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const access = await getCurrentAlliedMasteryModuleAccess();
  if (!access.ok) {
    return {
      title: "Not found",
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

  const { career, moduleSlug } = await params;
  const prof = resolveAlliedProfessionFromRouteSlug(career);
  const module = prof ? findAlliedMasteryModule(prof.professionKey, moduleSlug) : null;
  return {
    title: module ? `${module.title} | Admin preview | NurseNest` : "Not found",
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

export default async function AlliedMasteryModulePreviewPage({ params }: Props) {
  const access = await getCurrentAlliedMasteryModuleAccess();
  if (!access.ok) notFound();

  const { career, moduleSlug } = await params;
  const prof = resolveAlliedProfessionFromRouteSlug(career);
  if (!prof) notFound();

  const module = findAlliedMasteryModule(prof.professionKey, moduleSlug);
  if (!module) notFound();

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8" data-testid="allied-mastery-admin-preview">
      <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">
        <strong>Hidden / Admin Preview Only.</strong> Not visible to public users. Not in sitemap, hreflang,
        public navigation, pricing, or checkout.
      </div>

      <div className="mt-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--semantic-brand)]">
          {prof.h1} · Admin preview
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[var(--theme-heading-text)]">{module.title}</h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-[var(--theme-muted-text)]">{module.description}</p>
      </div>

      <section className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5">
          <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Access state</h2>
          <dl className="mt-4 space-y-2 text-sm text-[var(--theme-muted-text)]">
            <div className="flex justify-between gap-4">
              <dt>Status</dt>
              <dd className="font-semibold text-[var(--theme-heading-text)]">Hidden / Admin Preview Only</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>Public enabled</dt>
              <dd>false</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>Entitlement placeholder</dt>
              <dd className="text-right font-mono text-xs">{module.entitlementKey}</dd>
            </div>
          </dl>
        </div>
        <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5">
          <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Content types</h2>
          <ul className="mt-4 flex flex-wrap gap-2 text-xs">
            {module.contentTypes.map((type) => (
              <li key={type} className="rounded-full bg-[var(--semantic-panel-muted)] px-3 py-1 font-semibold">
                {type.replaceAll("_", " ")}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-[var(--theme-heading-text)]">Planned content structure</h2>
        <ul className="mt-4 space-y-3">
          {module.sections.map((section) => (
            <li key={section} className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-4 py-3 text-sm">
              {section}
            </li>
          ))}
        </ul>
      </section>

      {module.visualQuestionSupport ? (
        <section className="mt-8">
          <h2 className="text-xl font-semibold text-[var(--theme-heading-text)]">Visual question support</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 py-3 text-sm">
              <h3 className="font-semibold text-[var(--theme-heading-text)]">Question types</h3>
              <ul className="mt-2 space-y-1 text-[var(--theme-muted-text)]">
                {module.visualQuestionSupport.questionTypes.map((type) => (
                  <li key={type}>{type.replaceAll("_", " ")}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 py-3 text-sm">
              <h3 className="font-semibold text-[var(--theme-heading-text)]">Media fields</h3>
              <ul className="mt-2 space-y-1 text-[var(--theme-muted-text)]">
                <li>imageUrl</li>
                <li>secondaryImageUrl optional</li>
                <li>highlightOverlay optional</li>
                {module.visualQuestionSupport.cardiacSupport ? (
                  <>
                    <li>videoUrl</li>
                    <li>framePreviewImageUrl</li>
                    <li>functionalInterpretationPrompt</li>
                  </>
                ) : null}
              </ul>
            </div>
            <div className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 py-3 text-sm">
              <h3 className="font-semibold text-[var(--theme-heading-text)]">Required question structure</h3>
              <ul className="mt-2 space-y-1 text-[var(--theme-muted-text)]">
                {module.visualQuestionSupport.requiredQuestionStructure.map((field) => (
                  <li key={field}>{field}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 py-3 text-sm">
              <h3 className="font-semibold text-[var(--theme-heading-text)]">Rapid drill mode</h3>
              <ul className="mt-2 space-y-1 text-[var(--theme-muted-text)]">
                <li>fast image recognition</li>
                <li>minimal text</li>
                <li>delayed rationale</li>
              </ul>
            </div>
          </div>
        </section>
      ) : null}

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-[var(--theme-heading-text)]">Clinical action layer</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {module.actionLayer.map((item) => (
            <li key={item} className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 py-3 text-sm">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-10">
        <Link href="/admin/modules/allied" className="text-sm font-semibold text-[var(--semantic-brand)] underline">
          Back to allied module previews
        </Link>
      </div>
    </main>
  );
}
