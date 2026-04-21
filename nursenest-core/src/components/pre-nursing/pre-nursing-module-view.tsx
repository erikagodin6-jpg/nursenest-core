"use client";

import { ModuleEditContext } from "@/components/pre-nursing/module-edit-context";
import { PreNursingLessonTemplateV2 } from "@/components/pre-nursing/pre-nursing-lesson-template-v2";
import { PreNursingStringsProvider } from "@/content/pre-nursing/pre-nursing-i18n";
import { getPreNursingModuleComponent } from "@/content/pre-nursing/pre-nursing-module-map";
import { PreNursingLocaleProvider } from "@/lib/i18n/pre-nursing-locale-context";
import type { PreNursingModuleOverlay } from "@/lib/i18n/pre-nursing-overlay-types";

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
            <PreNursingLessonTemplateV2 moduleSlug={slug} moduleOverlay={moduleOverlay}>
              <Comp />
            </PreNursingLessonTemplateV2>
          </article>
        </ModuleEditContext.Provider>
      </PreNursingStringsProvider>
    </PreNursingLocaleProvider>
  );
}
