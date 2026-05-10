export type RtLongtailTopic = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  /** Drives sentence banks and clinical emphasis */
  cluster:
    | "abg"
    | "vent"
    | "oxygen"
    | "airway"
    | "pft"
    | "neonatal"
    | "infection"
    | "education"
    | "cardiopulmonary"
    | "pharmacology";
  /** Short clause inserted into headings and FAQs */
  focusPhrase: string;
};
