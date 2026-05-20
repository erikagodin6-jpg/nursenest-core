/** Preview-only IA — does not replace production `global-nav-config`. */
export const figmaPreviewPrimaryLinks = [
  { key: "study", label: "Study", href: "#study" },
  { key: "practice", label: "Practice", href: "#practice" },
  { key: "pricing", label: "Pricing", href: "/pricing" },
] as const;

export type FigmaPreviewMegaKey = "pathways";

export const figmaPreviewMegaMenu = {
  key: "pathways" as const,
  label: "Pathways",
  description: "Exam-aligned hubs — preview labels only.",
  columns: [
    {
      heading: "United States",
      links: [
        { label: "NCLEX-RN", href: "#pathways" },
        { label: "NCLEX-PN", href: "#pathways" },
      ],
    },
    {
      heading: "Canada",
      links: [
        { label: "RN CPNRE", href: "#pathways" },
        { label: "RPN / LPN", href: "#pathways" },
      ],
    },
  ],
};
