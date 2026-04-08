/** Shared related-lesson links for Launch Wave 1 scoped gold lessons. */
export const RELATED_CORE = {
  sepsis: { slug: "sepsis-early-recognition-gold", title: "Sepsis early recognition" },
  shock: { slug: "shock-emergencies-gold", title: "Shock emergencies" },
  fluids: { slug: "fluids-electrolytes-emergencies-gold", title: "Fluids & electrolyte emergencies" },
  cj: { slug: "clinical-judgment-prioritization-gold", title: "Clinical judgment & prioritization" },
  acs: { slug: "acute-coronary-syndrome-gold", title: "Acute coronary syndrome" },
  ham: { slug: "high-alert-medications-safety-gold", title: "High-alert medication safety" },
  stroke: { slug: "stroke-increased-icp-gold", title: "Stroke & increased ICP" },
  copd: { slug: "copd-clinical-judgment-gold", title: "COPD clinical judgment" },
} as const;

export function rel(...keys: (keyof typeof RELATED_CORE)[]): {
  relatedSlugs: string[];
  relatedTitlesBySlug: Record<string, string>;
} {
  const relatedSlugs = keys.map((k) => RELATED_CORE[k].slug);
  const relatedTitlesBySlug = Object.fromEntries(keys.map((k) => [RELATED_CORE[k].slug, RELATED_CORE[k].title]));
  return { relatedSlugs, relatedTitlesBySlug };
}
