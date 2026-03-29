/**
 * Shipped marketing tools — hub lists these; each route lazy-loads its own bundle.
 * Keep in sync with `components/tools/tool-lazy.tsx` imports and sitemap.
 */
export const TOOL_SLUGS = ["med-math", "lab-values", "electrolyte-abg", "iv-infusion", "transfusion-safety"] as const;
export type ToolSlug = (typeof TOOL_SLUGS)[number];

export function isToolSlug(s: string): s is ToolSlug {
  return (TOOL_SLUGS as readonly string[]).includes(s);
}

export function getAllToolSlugs(): string[] {
  return [...TOOL_SLUGS];
}
