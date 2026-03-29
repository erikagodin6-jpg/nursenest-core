import {
  rexPnCategories,
  rexPnConditions,
  rexPnMedications,
  rexPnLabValues,
  rexPnComparisons,
  rexPnStrategies,
  type RexPnInternalLink,
} from "@/data/rex-pn-hub-data";

const allRoutes = new Set<string>();

const CROSS_NAMESPACE_PATTERNS = [
  /^\/medications\//,
  /^\/lab-values\//,
  /^\/conditions\//,
  /^\/mock-exams/,
  /^\/free-practice/,
  /^\/pricing/,
  /^\/flashcards/,
];

function buildRouteRegistry() {
  if (allRoutes.size > 0) return;
  allRoutes.add("/rex-pn");
  allRoutes.add("/mock-exams");
  allRoutes.add("/free-practice");
  allRoutes.add("/pricing");
  allRoutes.add("/flashcards");
  rexPnCategories.forEach(c => allRoutes.add(`/rex-pn/${c.slug}`));
  rexPnConditions.forEach(c => allRoutes.add(`/rex-pn/conditions/${c.slug}`));
  rexPnMedications.forEach(m => allRoutes.add(`/rex-pn/medications/${m.slug}`));
  rexPnLabValues.forEach(l => allRoutes.add(`/rex-pn/lab-values/${l.slug}`));
  rexPnComparisons.forEach(c => allRoutes.add(`/rex-pn/compare/${c.slug}`));
  rexPnStrategies.forEach(s => allRoutes.add(`/rex-pn/strategy/${s.slug}`));
}

function isCrossNamespaceRoute(href: string): boolean {
  return CROSS_NAMESPACE_PATTERNS.some(pattern => pattern.test(href));
}

export function isValidRexPnRoute(href: string): boolean {
  buildRouteRegistry();
  return allRoutes.has(href);
}

export function getValidatedLinks(links: RexPnInternalLink[]): RexPnInternalLink[] {
  buildRouteRegistry();
  return links.filter(link => allRoutes.has(link.href) || isCrossNamespaceRoute(link.href));
}

export function mergeWithGeneratedLinks(staticLinks: RexPnInternalLink[], generatedLinks: RexPnInternalLink[]): RexPnInternalLink[] {
  const seen = new Set(staticLinks.map(l => l.href));
  const merged = [...staticLinks];
  for (const link of generatedLinks) {
    if (!seen.has(link.href)) {
      seen.add(link.href);
      merged.push(link);
    }
  }
  return getValidatedLinks(merged);
}

export function getRelatedLinksForCondition(slug: string): RexPnInternalLink[] {
  const links: RexPnInternalLink[] = [
    { title: "REx-PN Exam Prep Hub", href: "/rex-pn", type: "hub" },
  ];

  const condition = rexPnConditions.find(c => c.slug === slug);
  if (condition) {
    condition.medications.forEach(med => {
      const medPage = rexPnMedications.find(m => m.genericName.toLowerCase() === med.name.toLowerCase().split(" ")[0]);
      if (medPage) links.push({ title: `${medPage.genericName} Guide`, href: `/rex-pn/medications/${medPage.slug}`, type: "medication" });
    });

    condition.labs.forEach(lab => {
      const labPage = rexPnLabValues.find(l => lab.name.toLowerCase().includes(l.name.toLowerCase()));
      if (labPage) links.push({ title: `${labPage.name} Lab Values`, href: `/rex-pn/lab-values/${labPage.slug}`, type: "lab-value" });
    });

    rexPnComparisons.forEach(comp => {
      if (comp.conditionA.name.toLowerCase().includes(condition.name.toLowerCase()) ||
          comp.conditionB.name.toLowerCase().includes(condition.name.toLowerCase())) {
        links.push({ title: comp.h1, href: `/rex-pn/compare/${comp.slug}`, type: "comparison" });
      }
    });

    rexPnConditions.filter(c => c.slug !== slug).slice(0, 3).forEach(c => {
      links.push({ title: c.name, href: `/rex-pn/conditions/${c.slug}`, type: "condition" });
    });
  }

  links.push({ title: "Practice Questions", href: "/rex-pn/practice-questions", type: "category" });
  return getValidatedLinks(links);
}

export function getRelatedLinksForMedication(slug: string): RexPnInternalLink[] {
  const links: RexPnInternalLink[] = [
    { title: "REx-PN Exam Prep Hub", href: "/rex-pn", type: "hub" },
    { title: "Pharmacology Review", href: "/rex-pn/pharmacology", type: "category" },
  ];

  const med = rexPnMedications.find(m => m.slug === slug);
  if (med) {
    rexPnConditions.forEach(cond => {
      if (cond.medications.some(m => m.name.toLowerCase().includes(med.genericName.toLowerCase()))) {
        links.push({ title: cond.name, href: `/rex-pn/conditions/${cond.slug}`, type: "condition" });
      }
    });
  }

  rexPnMedications.filter(m => m.slug !== slug).slice(0, 3).forEach(m => {
    links.push({ title: `${m.genericName} Guide`, href: `/rex-pn/medications/${m.slug}`, type: "medication" });
  });

  return getValidatedLinks(links);
}

export function getRelatedLinksForLabValue(slug: string): RexPnInternalLink[] {
  const links: RexPnInternalLink[] = [
    { title: "REx-PN Exam Prep Hub", href: "/rex-pn", type: "hub" },
  ];

  const lab = rexPnLabValues.find(l => l.slug === slug);
  if (lab) {
    rexPnConditions.forEach(cond => {
      if (cond.labs.some(l => l.name.toLowerCase().includes(lab.name.toLowerCase()))) {
        links.push({ title: cond.name, href: `/rex-pn/conditions/${cond.slug}`, type: "condition" });
      }
    });
  }

  rexPnLabValues.filter(l => l.slug !== slug).forEach(l => {
    links.push({ title: `${l.name} Lab Values`, href: `/rex-pn/lab-values/${l.slug}`, type: "lab-value" });
  });

  links.push({ title: "Practice Questions", href: "/rex-pn/practice-questions", type: "category" });
  return getValidatedLinks(links);
}
