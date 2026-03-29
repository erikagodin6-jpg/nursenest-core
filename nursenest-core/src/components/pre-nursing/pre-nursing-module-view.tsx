"use client";

import { ModuleEditContext } from "@/components/pre-nursing/module-edit-context";
import { PreNursingStringsProvider } from "@/content/pre-nursing/pre-nursing-i18n";
import { getPreNursingModuleComponent } from "@/content/pre-nursing/pre-nursing-module-map";

export function PreNursingModuleView({ slug }: { slug: string }) {
  const Comp = getPreNursingModuleComponent(slug);
  if (!Comp) return null;
  return (
    <PreNursingStringsProvider>
      <ModuleEditContext.Provider value={{ isEditing: false, sections: {}, updateSection: () => {} }}>
        <article className="nn-marketing-surface">
          <Comp />
        </article>
      </ModuleEditContext.Provider>
    </PreNursingStringsProvider>
  );
}
