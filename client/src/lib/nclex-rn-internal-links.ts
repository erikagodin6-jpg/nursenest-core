import {
  nclexRnCategories,
  nclexRnConditions,
  nclexRnMedications,
  nclexRnLabValues,
  nclexRnComparisons,
  nclexRnStrategies,
  type NclexRnInternalLink,
} from "@/data/nclex-rn-hub-data";

const allRoutes = new Set<string>();

const CROSS_NAMESPACE_PATTERNS = [
  /^\/medications\//,
  /^\/lab-values\//,
  /^\/conditions\//,
  /^\/mock-exams/,
  /^\/free-practice/,
  /^\/pricing/,
  /^\/flashcards/,
  /^\/nclex-rn-guide/,
];

function buildRouteRegistry() {
  if (allRoutes.size > 0) return;
  allRoutes.add("/nclex-rn");
  allRoutes.add("/nclex-rn-guide");
  allRoutes.add("/mock-exams");
  allRoutes.add("/free-practice");
  allRoutes.add("/pricing");
  allRoutes.add("/flashcards");
  nclexRnCategories.forEach(c => allRoutes.add(`/nclex-rn/${c.slug}`));
  nclexRnConditions.forEach(c => allRoutes.add(`/nclex-rn/conditions/${c.slug}`));
  nclexRnMedications.forEach(m => allRoutes.add(`/nclex-rn/medications/${m.slug}`));
  nclexRnLabValues.forEach(l => allRoutes.add(`/nclex-rn/lab-values/${l.slug}`));
  nclexRnComparisons.forEach(c => allRoutes.add(`/nclex-rn/compare/${c.slug}`));
  nclexRnStrategies.forEach(s => allRoutes.add(`/nclex-rn/strategy/${s.slug}`));
}

function isCrossNamespaceRoute(href: string): boolean {
  return CROSS_NAMESPACE_PATTERNS.some(pattern => pattern.test(href));
}

export function isValidNclexRnRoute(href: string): boolean {
  buildRouteRegistry();
  return allRoutes.has(href);
}

export function getValidatedNclexRnLinks(links: NclexRnInternalLink[]): NclexRnInternalLink[] {
  buildRouteRegistry();
  return links.filter(link => allRoutes.has(link.href) || isCrossNamespaceRoute(link.href));
}

export function mergeWithGeneratedNclexRnLinks(staticLinks: NclexRnInternalLink[], generatedLinks: NclexRnInternalLink[]): NclexRnInternalLink[] {
  const seen = new Set(staticLinks.map(l => l.href));
  const merged = [...staticLinks];
  for (const link of generatedLinks) {
    if (!seen.has(link.href)) {
      seen.add(link.href);
      merged.push(link);
    }
  }
  return getValidatedNclexRnLinks(merged);
}

export function getRelatedLinksForNclexRnCondition(slug: string): NclexRnInternalLink[] {
  const links: NclexRnInternalLink[] = [
    { title: "NCLEX-RN Exam Prep Hub", href: "/nclex-rn", type: "hub" },
  ];

  const condition = nclexRnConditions.find(c => c.slug === slug);
  if (condition) {
    condition.medications.forEach(med => {
      const medPage = nclexRnMedications.find(m => m.genericName.toLowerCase() === med.name.toLowerCase().split(" ")[0]);
      if (medPage) links.push({ title: `${medPage.genericName} Guide`, href: `/nclex-rn/medications/${medPage.slug}`, type: "medication" });
    });

    condition.labs.forEach(lab => {
      const labPage = nclexRnLabValues.find(l => lab.name.toLowerCase().includes(l.name.toLowerCase()));
      if (labPage) links.push({ title: `${labPage.name} Lab Values`, href: `/nclex-rn/lab-values/${labPage.slug}`, type: "lab-value" });
    });

    nclexRnComparisons.forEach(comp => {
      if (comp.conditionA.name.toLowerCase().includes(condition.name.toLowerCase()) ||
          comp.conditionB.name.toLowerCase().includes(condition.name.toLowerCase())) {
        links.push({ title: comp.h1, href: `/nclex-rn/compare/${comp.slug}`, type: "comparison" });
      }
    });

    nclexRnConditions.filter(c => c.slug !== slug).slice(0, 3).forEach(c => {
      links.push({ title: c.name, href: `/nclex-rn/conditions/${c.slug}`, type: "condition" });
    });
  }

  links.push({ title: "Practice Questions", href: "/nclex-rn/practice-questions", type: "category" });
  return getValidatedNclexRnLinks(links);
}

export function getRelatedLinksForNclexRnMedication(slug: string): NclexRnInternalLink[] {
  const links: NclexRnInternalLink[] = [
    { title: "NCLEX-RN Exam Prep Hub", href: "/nclex-rn", type: "hub" },
    { title: "Pharmacology Review", href: "/nclex-rn/pharmacology", type: "category" },
  ];

  const med = nclexRnMedications.find(m => m.slug === slug);
  if (med) {
    nclexRnConditions.forEach(cond => {
      if (cond.medications.some(m => m.name.toLowerCase().includes(med.genericName.toLowerCase()))) {
        links.push({ title: cond.name, href: `/nclex-rn/conditions/${cond.slug}`, type: "condition" });
      }
    });
  }

  nclexRnMedications.filter(m => m.slug !== slug).slice(0, 3).forEach(m => {
    links.push({ title: `${m.genericName} Guide`, href: `/nclex-rn/medications/${m.slug}`, type: "medication" });
  });

  return getValidatedNclexRnLinks(links);
}

export function getRelatedLinksForNclexRnLabValue(slug: string): NclexRnInternalLink[] {
  const links: NclexRnInternalLink[] = [
    { title: "NCLEX-RN Exam Prep Hub", href: "/nclex-rn", type: "hub" },
  ];

  const lab = nclexRnLabValues.find(l => l.slug === slug);
  if (lab) {
    nclexRnConditions.forEach(cond => {
      if (cond.labs.some(l => l.name.toLowerCase().includes(lab.name.toLowerCase()))) {
        links.push({ title: cond.name, href: `/nclex-rn/conditions/${cond.slug}`, type: "condition" });
      }
    });
  }

  nclexRnLabValues.filter(l => l.slug !== slug).forEach(l => {
    links.push({ title: `${l.name} Lab Values`, href: `/nclex-rn/lab-values/${l.slug}`, type: "lab-value" });
  });

  links.push({ title: "Practice Questions", href: "/nclex-rn/practice-questions", type: "category" });
  return getValidatedNclexRnLinks(links);
}
