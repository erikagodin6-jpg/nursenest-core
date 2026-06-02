import type { SeoPageDefinition } from "@/lib/seo/programmatic-registry";
import type { ProgrammaticPageOverlay } from "@/lib/seo/programmatic-overlay-types";

function mergeSections(
  base: SeoPageDefinition["sections"],
  overlay?: ProgrammaticPageOverlay["sections"],
): SeoPageDefinition["sections"] {
  if (!overlay?.length) return base;
  return base.map((section, i) => {
    const o = overlay[i];
    if (!o) return section;
    return {
      heading: o.heading ?? section.heading,
      level: o.level ?? section.level,
      body: o.body && o.body.length > 0 ? o.body : section.body,
    };
  });
}

function mergeFaq(
  base: SeoPageDefinition["faq"],
  overlay?: ProgrammaticPageOverlay["faq"],
): SeoPageDefinition["faq"] | undefined {
  if (!base?.length) return base;
  if (!overlay?.length) return base;
  return base.map((item, i) => {
    const o = overlay[i];
    if (!o) return item;
    return {
      question: o.question ?? item.question,
      answer: o.answer ?? item.answer,
    };
  });
}

/** Deep-merge registry page with locale overlay (overlay wins when provided). */
export function mergeProgrammaticPage(
  base: SeoPageDefinition,
  overlay: ProgrammaticPageOverlay | undefined,
): SeoPageDefinition {
  if (!overlay) return base;
  const mergedBreadcrumb =
    base.breadcrumb && overlay.breadcrumb
      ? {
          ...base.breadcrumb,
          midLabel: overlay.breadcrumb.midLabel ?? base.breadcrumb.midLabel,
          currentLabel: overlay.breadcrumb.currentLabel ?? base.breadcrumb.currentLabel,
        }
      : base.breadcrumb;
  return {
    ...base,
    title: overlay.title ?? base.title,
    description: overlay.description ?? base.description,
    h1: overlay.h1 ?? base.h1,
    breadcrumb: mergedBreadcrumb,
    sections: mergeSections(base.sections, overlay.sections),
    faq: mergeFaq(base.faq, overlay.faq),
  };
}
