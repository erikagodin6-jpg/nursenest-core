import { normalizeCanonicalUrl } from "@shared/canonical-url";

const SITE_DOMAIN = "https://www.nursenest.ca";

export interface BreadcrumbItem {
  name: string;
  url: string;
}

function canonicalUrl(path: string): string {
  return normalizeCanonicalUrl(path, "en", SITE_DOMAIN);
}

const MEDICAL_ACRONYMS = new Set([
  "COPD", "ECG", "EKG", "ICU", "IV", "NG", "ABG", "DKA", "HHNS", "SIADH",
  "DVT", "PE", "MI", "HF", "AKI", "CKD", "UTI", "BPH", "GERD", "IBS",
  "GI", "CNS", "PNS", "MS", "ALS", "ACLS", "BLS", "OSCE",
  "NBRC", "NREMT", "PTCB", "CSMLS",
  "CAMRT", "RRT", "MLT", "ADHD", "OCD", "PTSD", "DIC", "TB", "RSV",
  "PALS", "TNCC", "NRP", "CEN", "CCRN",
  "ARDS", "ERCP", "EGD", "FAQ", "AI", "QBank", "SEO",
]);

const TIER_LABELS = new Set(["RN", "NP", "RPN", "LVN", "NCLEX", "REX-PN"]);

const ACRONYMS = new Set([...MEDICAL_ACRONYMS, ...TIER_LABELS]);

function stripTierLabels(text: string): string {
  return text
    .replace(/^(RN|NP|RPN|LVN|NCLEX|NCLEX-RN|NCLEX-PN|REx-PN)\s+/i, "")
    .replace(/\s+\((RN|NP|RPN|LVN|NCLEX|RPN\/LVN|RPN\/RN)\)$/i, "")
    .trim();
}

function formatSegment(segment: string): string {
  const words = segment.replace(/-/g, " ").split(" ");
  const formatted = words
    .filter((w) => !TIER_LABELS.has(w.toUpperCase()))
    .map((w) => {
      const upper = w.toUpperCase();
      if (MEDICAL_ACRONYMS.has(upper)) return upper;
      if (upper === "VS") return "vs";
      if (upper === "AND") return "&";
      if (upper === "OF") return "of";
      if (upper === "THE") return "the";
      if (upper === "FOR") return "for";
      if (upper === "IN") return "in";
      if (upper === "TO") return "to";
      return w.charAt(0).toUpperCase() + w.slice(1);
    })
    .join(" ");
  return stripTierLabels(formatted);
}

const STATIC_ROUTES: Record<string, string> = {
  "/lessons": "Lessons",
  "/mock-exams": "Mock Exams",
  "/flashcards": "Flashcards",
  "/med-math": "Med Math",
  "/lab-values": "Lab Values",
  "/si-to-conventional-units-converter": "SI ↔ Conventional Units Converter",
  "/pricing": "Pricing",
  "/shop": "Shop",
  "/test-bank": "Test Bank",
  "/question-bank": "Test Bank",
  "/simulators": "Simulators",
  "/simulators/clinical-skills": "Clinical Skills Simulators",
  "/simulators/osce": "OSCE Simulators",
  "/simulators/clinical-lab": "Clinical Lab Simulators",
  "/study-plan": "Study Plan",
  "/free-practice": "Free Practice",
  "/anatomy": "Anatomy & Physiology",
  "/clinical-clarity": "Clinical Clarity",
  "/pre-nursing": "Pre-Nursing",
  "/dashboard": "Dashboard",
  "/faq": "FAQ",
  "/contact": "Contact",
  "/feedback": "Feedback",
  "/terms": "Terms of Service",
  "/privacy": "Privacy Policy",
  "/disclaimer": "Disclaimer",
  "/refund-policy": "Refund Policy",
  "/question-of-the-day": "Question of the Day",
  "/diagnostic-assessment": "Diagnostic Assessment",
  "/medication-mastery": "Medication Mastery",
  "/compare": "Compare Plans",
  "/lectures": "Lectures",
  "/np-exam-prep": "NP Exam Prep",
  "/np/exams": "NP Exam Hub",
  "/np/aanp-exam": "AANP Certification Exam",
  "/np/ancc-exam": "ANCC Certification Exam",
  "/np/upcoming-canada-np-exam": "Upcoming Canadian NP Exam",
  "/canada-np": "Canadian NP Exam (CNPLE)",
  "/np-exam-guide": "NP Exam Guide",
  "/rex-pn-guide": "REx-PN Guide",
  "/nclex-rn-guide": "NCLEX-RN Guide",
  "/rex-pn": "REx-PN Exam Prep",
  "/nclex-rn": "NCLEX-RN Exam Prep",
  "/blog": "Blog",
  "/reports": "Reports",
  "/case-simulations": "Case Simulations",
  "/first-action-simulator": "First Action Simulator",
  "/safety-hazard-simulator": "Safety Hazard Simulator",
  "/iv-complications-simulator": "IV Complications Simulator",
  "/electrolyte-abg-simulator": "Electrolyte & ABG Simulator",
  "/deteriorating-patient-simulator": "Deteriorating Patient Simulator",
  "/blood-transfusion-simulator": "Blood Transfusion Simulator",
  "/probability-simulator": "Probability Simulator",
  "/pathways": "Learning Pathways",
  "/upgrade": "Upgrade",
  "/profile": "Profile",
  "/exam-practice": "Exam Practice",
  "/nclex-rn-practice-questions": "NCLEX-RN Practice Questions",
  "/nclex-pn-practice-questions": "NCLEX-PN Practice Questions",
  "/rex-pn-practice-questions": "REx-PN Practice Questions",
  "/np-exam-practice-questions": "NP Exam Practice Questions",
  "/practice-questions": "Free Practice Questions",
  "/glossary": "Glossary",
  "/newgrad/certifications": "Certifications",
  "/new-grad": "New Grad Hub",
};

const PARENT_ROUTES: Record<string, string> = {
  "/shop/": "/shop",
  "/lessons/": "/lessons",
  "/flashcards/deck/": "/flashcards",
  "/clinical-clarity/": "/clinical-clarity",
  "/lectures/": "/lectures",
  "/anatomy/": "/anatomy",
  "/np/": "/np-exam-prep",
  "/np-exam-guide/": "/np-exam-guide",
  "/rex-pn-guide/": "/rex-pn-guide",
  "/nclex-rn-guide/": "/nclex-rn-guide",
  "/rex-pn/": "/rex-pn",
  "/nclex-rn/": "/nclex-rn",
  "/np-exam-prep/": "/np-exam-prep",
  "/np-exam/": "/np-exam-prep",
  "/mock-exams/": "/mock-exams",
  "/learn/": "/lessons",
  "/study-guide/": "/lessons",
  "/compare/": "/compare",
  "/practice-questions/": "/practice-questions",
  "/glossary/": "/glossary",
  "/newgrad/certifications/": "/newgrad/certifications",
};

const SIMULATOR_PATHS = [
  "/first-action-simulator",
  "/safety-hazard-simulator",
  "/iv-complications-simulator",
  "/electrolyte-abg-simulator",
  "/deteriorating-patient-simulator",
  "/blood-transfusion-simulator",
  "/probability-simulator",
  "/case-simulations",
];

export function buildBreadcrumbs(
  pathname: string,
  metadata?: { title?: string; parentTitle?: string; system?: string }
): BreadcrumbItem[] {
  const localeMatch = pathname.match(/^\/(en|fr|es|de|pt|zh|ja|ko|ar|hi|it|ru|nl|pl|tr)\//);
  const cleanPath = localeMatch ? pathname.slice(localeMatch[0].length - 1) : pathname;

  const items: BreadcrumbItem[] = [{ name: "Home", url: `${SITE_DOMAIN}/` }];

  if (cleanPath === "/" || cleanPath === "") return items;

  if (STATIC_ROUTES[cleanPath]) {
    if (SIMULATOR_PATHS.includes(cleanPath)) {
      items.push({ name: "Simulators", url: canonicalUrl("/simulators/clinical-skills") });
    }
    items.push({ name: STATIC_ROUTES[cleanPath], url: canonicalUrl(cleanPath) });
    return items;
  }

  for (const [prefix, parentPath] of Object.entries(PARENT_ROUTES)) {
    if (cleanPath.startsWith(prefix)) {
      const parentName = STATIC_ROUTES[parentPath];
      if (parentName) {
        items.push({ name: parentName, url: canonicalUrl(parentPath) });
      }

      const slug = cleanPath.slice(prefix.length);
      const pageName = metadata?.title || formatSegment(slug);
      items.push({ name: pageName, url: canonicalUrl(cleanPath) });
      return items;
    }
  }

  if (cleanPath.startsWith("/simulators/") && !STATIC_ROUTES[cleanPath]) {
    items.push({ name: "Simulators", url: canonicalUrl("/simulators/clinical-skills") });
    const sub = cleanPath.slice("/simulators/".length);
    items.push({ name: formatSegment(sub), url: canonicalUrl(cleanPath) });
    return items;
  }

  const segments = cleanPath.split("/").filter(Boolean);
  let path = "";
  for (const seg of segments) {
    path += `/${seg}`;
    const name = STATIC_ROUTES[path] || formatSegment(seg);
    items.push({ name, url: canonicalUrl(path) });
  }

  if (metadata?.title && items.length > 1) {
    items[items.length - 1].name = metadata.title;
  }

  return items;
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": item.name,
      "item": item.url,
    })),
  };
}
