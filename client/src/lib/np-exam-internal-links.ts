import {
  npExamCategories,
  npExamConditions,
  npExamMedications,
  npExamLabValues,
  npExamComparisons,
  npExamStrategies,
  type NpExamInternalLink,
} from "@/data/np-exam-hub-data";

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
  allRoutes.add("/np-exam");
  allRoutes.add("/mock-exams");
  allRoutes.add("/free-practice");
  allRoutes.add("/pricing");
  allRoutes.add("/flashcards");
  npExamCategories.forEach(c => allRoutes.add(`/np-exam/${c.slug}`));
  npExamConditions.forEach(c => allRoutes.add(`/np-exam/conditions/${c.slug}`));
  npExamMedications.forEach(m => allRoutes.add(`/np-exam/medications/${m.slug}`));
  npExamLabValues.forEach(l => allRoutes.add(`/np-exam/lab-values/${l.slug}`));
  npExamComparisons.forEach(c => allRoutes.add(`/np-exam/compare/${c.slug}`));
  npExamStrategies.forEach(s => allRoutes.add(`/np-exam/strategy/${s.slug}`));
}

function isCrossNamespaceRoute(href: string): boolean {
  return CROSS_NAMESPACE_PATTERNS.some(pattern => pattern.test(href));
}

export function isValidNpExamRoute(href: string): boolean {
  buildRouteRegistry();
  return allRoutes.has(href);
}

export function getValidatedLinks(links: NpExamInternalLink[]): NpExamInternalLink[] {
  buildRouteRegistry();
  return links.filter(link => allRoutes.has(link.href) || isCrossNamespaceRoute(link.href));
}

export function mergeWithGeneratedLinks(staticLinks: NpExamInternalLink[], generatedLinks: NpExamInternalLink[]): NpExamInternalLink[] {
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

export function getRelatedLinksForCondition(slug: string): NpExamInternalLink[] {
  const links: NpExamInternalLink[] = [
    { title: "NP Exam Prep Hub", href: "/np-exam", type: "hub" },
  ];

  const condition = npExamConditions.find(c => c.slug === slug);
  if (condition) {
    condition.medications.forEach(med => {
      const medPage = npExamMedications.find(m => m.genericName.toLowerCase() === med.name.toLowerCase().split(" ")[0]);
      if (medPage) links.push({ title: `${medPage.genericName} Guide`, href: `/np-exam/medications/${medPage.slug}`, type: "medication" });
    });

    condition.labs.forEach(lab => {
      const labPage = npExamLabValues.find(l => lab.name.toLowerCase().includes(l.name.toLowerCase()));
      if (labPage) links.push({ title: `${labPage.name} Lab Values`, href: `/np-exam/lab-values/${labPage.slug}`, type: "lab-value" });
    });

    npExamComparisons.forEach(comp => {
      if (comp.conditionA.name.toLowerCase().includes(condition.name.toLowerCase()) ||
          comp.conditionB.name.toLowerCase().includes(condition.name.toLowerCase())) {
        links.push({ title: comp.h1, href: `/np-exam/compare/${comp.slug}`, type: "comparison" });
      }
    });

    npExamConditions.filter(c => c.slug !== slug).slice(0, 3).forEach(c => {
      links.push({ title: c.name, href: `/np-exam/conditions/${c.slug}`, type: "condition" });
    });
  }

  links.push({ title: "Practice Questions", href: "/np-exam/practice-questions", type: "category" });
  return getValidatedLinks(links);
}

export function getRelatedLinksForMedication(slug: string): NpExamInternalLink[] {
  const links: NpExamInternalLink[] = [
    { title: "NP Exam Prep Hub", href: "/np-exam", type: "hub" },
    { title: "Pharmacology Review", href: "/np-exam/pharmacology", type: "category" },
  ];

  const med = npExamMedications.find(m => m.slug === slug);
  if (med) {
    npExamConditions.forEach(cond => {
      if (cond.medications.some(m => m.name.toLowerCase().includes(med.genericName.toLowerCase()))) {
        links.push({ title: cond.name, href: `/np-exam/conditions/${cond.slug}`, type: "condition" });
      }
    });
  }

  npExamMedications.filter(m => m.slug !== slug).slice(0, 3).forEach(m => {
    links.push({ title: `${m.genericName} Guide`, href: `/np-exam/medications/${m.slug}`, type: "medication" });
  });

  return getValidatedLinks(links);
}

export function getRelatedLinksForLabValue(slug: string): NpExamInternalLink[] {
  const links: NpExamInternalLink[] = [
    { title: "NP Exam Prep Hub", href: "/np-exam", type: "hub" },
  ];

  const lab = npExamLabValues.find(l => l.slug === slug);
  if (lab) {
    npExamConditions.forEach(cond => {
      if (cond.labs.some(l => l.name.toLowerCase().includes(lab.name.toLowerCase()))) {
        links.push({ title: cond.name, href: `/np-exam/conditions/${cond.slug}`, type: "condition" });
      }
    });
  }

  npExamLabValues.filter(l => l.slug !== slug).forEach(l => {
    links.push({ title: `${l.name} Lab Values`, href: `/np-exam/lab-values/${l.slug}`, type: "lab-value" });
  });

  links.push({ title: "Practice Questions", href: "/np-exam/practice-questions", type: "category" });
  return getValidatedLinks(links);
}
