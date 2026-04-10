"use client";

import { createContext, useContext, useRef } from "react";
import { RichTextEditor, RichTextDisplay } from "@/components/pre-nursing/rich-text-mini";
import { usePreNursingT } from "@/content/pre-nursing/pre-nursing-i18n";

export type SectionOverride = {
  title?: string;
  subtitle?: string;
  content?: string;
  items?: string[];
  color?: string;
};

export type ModuleEditContextType = {
  isEditing: boolean;
  sections: Record<string, SectionOverride>;
  updateSection: (key: string, data: SectionOverride) => void;
};

export const ModuleEditContext = createContext<ModuleEditContextType>({
  isEditing: false,
  sections: {},
  updateSection: () => {},
});

export function useModuleEdit() {
  return useContext(ModuleEditContext);
}

export function useEditableText(sectionKey: string, defaultText: string): string {
  const { sections } = useModuleEdit();
  const { t } = usePreNursingT();
  const override = sections[sectionKey];
  if (override?.content) return override.content;
  const i18nKey = `prenursing.${sectionKey}`;
  const translated = t(i18nKey);
  if (translated !== i18nKey) return translated;
  return defaultText;
}

export function EditableModuleText({
  sectionKey,
  defaultText,
  as = "p",
  className = "",
  multiline = false,
}: {
  sectionKey: string;
  defaultText: string;
  as?: "p" | "h2" | "h3" | "span";
  className?: string;
  multiline?: boolean;
}) {
  const { isEditing, sections, updateSection } = useModuleEdit();
  const { t } = usePreNursingT();
  const override = sections[sectionKey];
  let displayText = override?.content ?? defaultText;
  if (!override?.content) {
    const i18nKey = `prenursing.${sectionKey}`;
    const translated = t(i18nKey);
    if (translated !== i18nKey) displayText = translated;
  }

  const editorContainerRef = useRef<HTMLDivElement>(null);

  if (!isEditing) {
    const Tag = as;
    const hasHtml = /<[a-z][\s\S]*>/i.test(displayText);
    if (hasHtml) {
      return (
        <Tag className={className}>
          <RichTextDisplay html={displayText} />
        </Tag>
      );
    }
    return <Tag className={className}>{displayText}</Tag>;
  }

  return (
    <div className="relative" ref={editorContainerRef}>
      {multiline ? (
        <RichTextEditor
          value={displayText}
          onChange={(v) => updateSection(sectionKey, { ...override, content: v })}
          className={className}
          minHeight="80px"
          placeholder={t("components.moduleEditContext.enterContent")}
        />
      ) : (
        <input
          type="text"
          value={displayText}
          onChange={(e) => updateSection(sectionKey, { ...override, content: e.target.value })}
          className={`w-full rounded-lg border border-border bg-card/80 px-3 py-1.5 text-sm focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/30 ${className}`}
          data-testid={`editable-text-${sectionKey}`}
        />
      )}
    </div>
  );
}
