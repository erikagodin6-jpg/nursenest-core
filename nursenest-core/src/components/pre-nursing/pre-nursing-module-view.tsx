"use client";

import { ModuleEditContext } from "@/components/pre-nursing/module-edit-context";
import { PreNursingStringsProvider } from "@/content/pre-nursing/pre-nursing-i18n";
import { getPreNursingModuleComponent } from "@/content/pre-nursing/pre-nursing-module-map";
import { PreNursingLocaleProvider } from "@/lib/i18n/pre-nursing-locale-context";
import type { PreNursingModuleOverlay } from "@/lib/i18n/pre-nursing-content-overlay";

type Props = {
  slug: string;
  /** BCP-47 locale (e.g. "fr", "es"). Defaults to "en". */
  locale?: string;
  /** Prose overlay for non-English locales. Null = render English TSX content. */
  moduleOverlay?: PreNursingModuleOverlay | null;
};

export function PreNursingModuleView({ slug, locale = "en", moduleOverlay = null }: Props) {
  const Comp = getPreNursingModuleComponent(slug);
  if (!Comp) return null;
  return (
    <PreNursingLocaleProvider locale={locale} moduleOverlay={moduleOverlay}>
      <PreNursingStringsProvider>
        <ModuleEditContext.Provider value={{ isEditing: false, sections: {}, updateSection: () => {} }}>
          <article className="nn-marketing-surface">
            {moduleOverlay && <PreNursingModuleOverlayHeader overlay={moduleOverlay} />}
            <Comp />
            {moduleOverlay && <PreNursingModuleOverlayFooter overlay={moduleOverlay} />}
          </article>
        </ModuleEditContext.Provider>
      </PreNursingStringsProvider>
    </PreNursingLocaleProvider>
  );
}

/** Renders the translated overview + key concepts above the TSX module body. */
function PreNursingModuleOverlayHeader({ overlay }: { overlay: PreNursingModuleOverlay }) {
  if (!overlay.overview && (!overlay.key_concepts || overlay.key_concepts.length === 0)) return null;
  return (
    <div className="mx-auto max-w-4xl px-4 pb-6 pt-4 sm:px-6 lg:px-8">
      {overlay.overview && (
        <p className="mb-4 text-base leading-7 text-[var(--semantic-text-secondary)]">{overlay.overview}</p>
      )}
      {overlay.key_concepts && overlay.key_concepts.length > 0 && (
        <ul className="mb-2 list-inside list-disc space-y-1 text-sm text-[var(--semantic-text-secondary)]">
          {overlay.key_concepts.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Renders translated nursing responsibilities, clinical pearls, patient education, and key takeaways
 *  below the TSX module body (interactive components stay English-only in the body). */
function PreNursingModuleOverlayFooter({ overlay }: { overlay: PreNursingModuleOverlay }) {
  const hasContent =
    overlay.nursing_responsibilities ||
    overlay.clinical_pearls ||
    overlay.patient_education ||
    (overlay.key_takeaways && overlay.key_takeaways.length > 0);
  if (!hasContent) return null;
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      {overlay.nursing_responsibilities && (
        <section>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[var(--semantic-brand)]">
            Nursing Responsibilities
          </h3>
          <p className="text-sm leading-6 text-[var(--semantic-text-secondary)]">{overlay.nursing_responsibilities}</p>
        </section>
      )}
      {overlay.clinical_pearls && (
        <section className="rounded-xl border-l-4 border-[var(--semantic-info)] bg-[var(--semantic-panel-cool)] px-4 py-3">
          <h3 className="mb-1 text-sm font-semibold text-[var(--semantic-info-contrast)]">Clinical Pearls</h3>
          <p className="text-sm leading-6 text-[var(--semantic-text-secondary)]">{overlay.clinical_pearls}</p>
        </section>
      )}
      {overlay.patient_education && (
        <section>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[var(--semantic-brand)]">
            Patient Education
          </h3>
          <p className="text-sm leading-6 text-[var(--semantic-text-secondary)]">{overlay.patient_education}</p>
        </section>
      )}
      {overlay.key_takeaways && overlay.key_takeaways.length > 0 && (
        <section className="rounded-xl bg-[var(--semantic-panel-positive)] px-4 py-4">
          <h3 className="mb-2 text-sm font-semibold text-[var(--semantic-success-contrast)]">Key Takeaways</h3>
          <ul className="list-inside list-disc space-y-1 text-sm text-[var(--semantic-text-secondary)]">
            {overlay.key_takeaways.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
