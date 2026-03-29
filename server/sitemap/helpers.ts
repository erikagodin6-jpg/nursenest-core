import { getIndexableLocales, getHreflangCode } from "../translation-audit";
import { getMainSiteDomain } from "@shared/locales";

export const SITEMAP_SPLIT_LIMIT = 5000;
export const SITEMAP_CACHE_TTL = 3600_000;

const SITEMAP_SLUG_MAP: Record<string, Record<string, string>> = {
  "zh-tw": {
    "/pricing": "/jiage",
    "/flashcards": "/shankakapian",
    "/lessons": "/kecheng",
    "/mock-exams": "/moni-kaoshi",
    "/glossary": "/shuyu",
    "/about": "/guanyu",
    "/contact": "/lianxi",
    "/faq": "/changjianwenti",
    "/blog": "/boke",
    "/international-nurses": "/guoji-hushi",
    "/healthcare-policy-and-updates": "/yiliao-zhengce-gengxin",
  },
  fr: {
    "/pricing": "/tarifs",
    "/flashcards": "/cartes-memoire",
    "/lessons": "/lecons",
    "/mock-exams": "/examens-pratiques",
    "/glossary": "/glossaire",
    "/about": "/a-propos",
    "/contact": "/nous-joindre",
    "/faq": "/foire-aux-questions",
    "/blog": "/blogue",
    "/nursing-exam-prep": "/examen-nclex",
    "/nursing-simulation-practice": "/simulation-nursing",
    "/hyperkalemia-effects-on-heart": "/hyperkalemie-coeur",
    "/international-nurses": "/infirmiers-internationaux",
    "/nursing-licensing-exams": "/examens-licence-infirmiere",
    "/nurse-salary-guide": "/guide-salaire-infirmier",
    "/nurse-salary-canada": "/salaire-infirmier-canada",
    "/nurse-salary-united-states": "/salaire-infirmier-etats-unis",
    "/nurse-salary-united-kingdom": "/salaire-infirmier-royaume-uni",
    "/nurse-salary-australia": "/salaire-infirmier-australie",
    "/healthcare-policy-and-updates": "/politique-sante-et-mises-a-jour",
  },
  es: {
    "/pricing": "/precios",
    "/flashcards": "/tarjetas-de-memoria",
    "/lessons": "/lecciones",
    "/mock-exams": "/examenes-de-practica",
    "/glossary": "/glosario",
    "/about": "/acerca-de",
    "/contact": "/contacto",
    "/faq": "/preguntas-frecuentes",
    "/blog": "/blog",
    "/international-nurses": "/enfermeros-internacionales",
    "/healthcare-policy-and-updates": "/politica-salud-y-actualizaciones",
  },
  pt: {
    "/pricing": "/precos",
    "/flashcards": "/cartoes-de-estudo",
    "/lessons": "/licoes",
    "/mock-exams": "/simulados",
    "/glossary": "/glossario",
    "/about": "/sobre",
    "/contact": "/contato",
    "/faq": "/perguntas-frequentes",
    "/blog": "/blog",
    "/international-nurses": "/enfermeiros-internacionais",
    "/healthcare-policy-and-updates": "/politica-saude-e-atualizacoes",
  },
  th: {
    "/pricing": "/rakha",
    "/flashcards": "/bat-kham-sap",
    "/lessons": "/bot-rian",
    "/mock-exams": "/khaw-sop-chamlong",
    "/glossary": "/sap-banyat",
    "/about": "/kiao-kap-rao",
    "/contact": "/tidtaw",
    "/faq": "/kham-tham-thi-phop-boi",
    "/blog": "/blog",
    "/international-nurses": "/phayaban-nana-chat",
    "/healthcare-policy-and-updates": "/nayobai-sukkhaphap-lae-khao-mai",
  },
  tr: {
    "/pricing": "/fiyatlandirma",
    "/flashcards": "/bilgi-kartlari",
    "/lessons": "/dersler",
    "/mock-exams": "/deneme-sinavlari",
    "/glossary": "/sozluk",
    "/about": "/hakkimizda",
    "/contact": "/iletisim",
    "/faq": "/sikca-sorulan-sorular",
    "/blog": "/blog",
    "/international-nurses": "/uluslararasi-hemsireler",
    "/healthcare-policy-and-updates": "/saglik-politikasi-ve-guncellemeler",
  },
  id: {
    "/pricing": "/harga",
    "/flashcards": "/kartu-flash",
    "/lessons": "/pelajaran",
    "/mock-exams": "/ujian-simulasi",
    "/glossary": "/glosarium",
    "/about": "/tentang",
    "/contact": "/kontak",
    "/faq": "/pertanyaan-umum",
    "/blog": "/blog",
    "/international-nurses": "/perawat-internasional",
    "/healthcare-policy-and-updates": "/kebijakan-kesehatan-dan-pembaruan",
  },
};

function applySlugMapping(path: string, locale: string): string {
  const mapping = SITEMAP_SLUG_MAP[locale];
  if (!mapping) return path;
  for (const [enSlug, localizedSlug] of Object.entries(mapping)) {
    if (path === enSlug || path.startsWith(enSlug + "/") || path.startsWith(enSlug + "?") || path.startsWith(enSlug + "#")) {
      return localizedSlug + path.slice(enSlug.length);
    }
  }
  return path;
}

export function getSiteBase(): string {
  return getMainSiteDomain();
}

export function getAlliedBase(): string {
  return "https://www.nursenest.ca/allied-health";
}

export function getNewGradBase(): string {
  return "https://newgrad.nursenest.ca";
}

export function todayDate(): string {
  return new Date().toISOString().split("T")[0];
}

export function toLastmod(date: any): string {
  if (!date) return todayDate();
  return new Date(date).toISOString().split("T")[0];
}

export function xmlHeader(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>`;
}

export function wrapUrlset(urls: string[]): string {
  return `${xmlHeader()}\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join("\n")}\n</urlset>`;
}

export function wrapSitemapIndex(entries: string[]): string {
  return `${xmlHeader()}\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</sitemapindex>`;
}

export function sitemapIndexEntry(loc: string, lastmod: string): string {
  return `<sitemap><loc>${loc}</loc><lastmod>${lastmod}</lastmod></sitemap>`;
}

export function simpleUrl(loc: string, lastmod: string, changefreq = "weekly", priority = "0.7"): string {
  return `<url><loc>${loc}</loc><lastmod>${lastmod}</lastmod><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`;
}

export function localizedUrl(base: string, path: string, priority: string, changefreq: string, locales: string[], lastmod?: string): string {
  const filteredLocales = locales.filter(locale => !_isLowValueTranslatedPage(path, locale));

  const lines: string[] = [];
  for (const locale of filteredLocales) {
    const mappedPath = applySlugMapping(path, locale);
    const loc = `${base}/${locale}${mappedPath === "/" ? "" : mappedPath}`;
    lines.push(`<url>`);
    lines.push(`<loc>${loc}</loc>`);
    lines.push(`<priority>${priority}</priority>`);
    lines.push(`<changefreq>${changefreq}</changefreq>`);
    if (lastmod) lines.push(`<lastmod>${lastmod}</lastmod>`);
    for (const alt of filteredLocales) {
      const altMapped = applySlugMapping(path, alt);
      const hreflang = getHreflangCode(alt);
      const altHref = `${base}/${alt}${altMapped === "/" ? "" : altMapped}`;
      lines.push(`<xhtml:link rel="alternate" hreflang="${hreflang}" href="${altHref}"/>`);
    }
    const enMapped = applySlugMapping(path, "en");
    lines.push(`<xhtml:link rel="alternate" hreflang="x-default" href="${base}/en${enMapped === "/" ? "" : enMapped}"/>`);
    lines.push(`</url>`);
  }
  return lines.join("\n");
}

export function singleLocaleUrl(base: string, path: string, locale: string, indexableLocales: string[], priority: string, changefreq: string, lastmod?: string): string {
  if (_isLowValueTranslatedPage(path, locale)) return "";

  const filteredLocales = indexableLocales.filter(l => !_isLowValueTranslatedPage(path, l));
  const mappedPath = applySlugMapping(path, locale);
  const loc = `${base}/${locale}${mappedPath === "/" ? "" : mappedPath}`;
  const lines: string[] = [];
  lines.push(`<url>`);
  lines.push(`<loc>${loc}</loc>`);
  lines.push(`<priority>${priority}</priority>`);
  lines.push(`<changefreq>${changefreq}</changefreq>`);
  if (lastmod) lines.push(`<lastmod>${lastmod}</lastmod>`);
  for (const alt of filteredLocales) {
    const altMapped = applySlugMapping(path, alt);
    const hreflang = getHreflangCode(alt);
    const altHref = `${base}/${alt}${altMapped === "/" ? "" : altMapped}`;
    lines.push(`<xhtml:link rel="alternate" hreflang="${hreflang}" href="${altHref}"/>`);
  }
  const enMapped = applySlugMapping(path, "en");
  lines.push(`<xhtml:link rel="alternate" hreflang="x-default" href="${base}/en${enMapped === "/" ? "" : enMapped}"/>`);
  lines.push(`</url>`);
  return lines.join("\n");
}

export function splitIntoChunks<T>(items: T[], chunkSize: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += chunkSize) {
    chunks.push(items.slice(i, i + chunkSize));
  }
  if (chunks.length === 0) chunks.push([]);
  return chunks;
}

export { getIndexableLocales, getHreflangCode };

import { isLowValueTranslatedPage as _isLowValueTranslatedPage, hasTimestampSuffix as _hasTimestampSuffix } from "@shared/canonical-url";
export { _isLowValueTranslatedPage as isLowValueTranslatedPage, _hasTimestampSuffix as hasTimestampSuffix };
import { isNoindexPath } from "../seo-meta";
export { isNoindexPath };

export const LEARN_REDIRECTS: Record<string, string> = {
  "oxygenation-vs-ventilation-critical-differences": "oxygenation-vs-ventilation-clinical-distinction",
  "create-more-posts-about-hyperkalemia": "hyperkalemia-nursing-guide",
  "test-publish-flow-1772145129698": "",
};

export interface StaticRouteDefinition {
  path: string;
  priority: string;
  changefreq: string;
  multilingual: boolean;
  lastmod?: string;
}

export function getSharedStaticRoutes(today: string): StaticRouteDefinition[] {
  const multilingualRoutes: Omit<StaticRouteDefinition, "multilingual">[] = [
    { path: "/", priority: "1.0", changefreq: "weekly", lastmod: today },
    { path: "/lessons", priority: "0.9", changefreq: "weekly", lastmod: today },
    { path: "/flashcards", priority: "0.8", changefreq: "weekly", lastmod: today },
    { path: "/pricing", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/start-free", priority: "0.9", changefreq: "monthly", lastmod: today },
    { path: "/anatomy", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/med-math", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/lab-values", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/si-to-conventional-units-converter", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/canadian-vs-american-lab-values", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/glucose-mmol-l-to-mg-dl", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/creatinine-umol-l-to-mg-dl", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/hemoglobin-g-l-to-g-dl", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/bilirubin-umol-l-to-mg-dl", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/calcium-mmol-l-to-mg-dl", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/urea-to-bun-conversion-nursing", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/cholesterol-triglyceride-unit-conversion", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/kg-to-lb-nursing", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/celsius-to-fahrenheit-nursing", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/mock-exams", priority: "0.8", changefreq: "weekly", lastmod: today },
    { path: "/clinical-clarity", priority: "0.8", changefreq: "weekly", lastmod: today },
    { path: "/blog", priority: "0.7", changefreq: "daily", lastmod: today },
    { path: "/pre-nursing", priority: "0.6", changefreq: "monthly", lastmod: today },
    { path: "/question-of-the-day", priority: "0.9", changefreq: "daily", lastmod: today },
    { path: "/daily-question", priority: "0.9", changefreq: "daily", lastmod: today },
    { path: "/question-bank", priority: "0.8", changefreq: "weekly", lastmod: today },
    { path: "/lectures", priority: "0.7", changefreq: "weekly", lastmod: today },
    { path: "/nursing", priority: "0.9", changefreq: "monthly", lastmod: today },
    { path: "/nursing-specialties", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/nursing-certifications", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/healthcare-certifications", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/healthcare-certifications/acls", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/healthcare-certifications/pals", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/healthcare-certifications/bls", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/healthcare-certifications/nrp", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/healthcare-certifications/tncc", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/healthcare-certifications/enpc", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/healthcare-certifications/ccrn", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/healthcare-certifications/cen", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/healthcare-certifications/ocn", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/healthcare-certifications/cmsrn", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/nursing-schools", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/nursing-schools/canada", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/nursing-schools/united-states", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/nursing-schools/united-kingdom", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/nursing-schools/australia", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/nursing-schools/philippines", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/nursing-schools/india", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/nurse-residency-programs", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/nurse-residency-programs/united-states", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/nurse-residency-programs/canada", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/nurse-residency-programs/united-kingdom", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/nursing-regulatory-bodies", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/nursing-regulatory-bodies/college-of-nurses-of-ontario", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/nursing-regulatory-bodies/us-state-boards-of-nursing", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/nursing-regulatory-bodies/nmc-uk", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/nursing-regulatory-bodies/ahpra-australia", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/nursing-regulatory-bodies/nursing-council-new-zealand", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/study-pathways", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/faq", priority: "0.5", changefreq: "monthly" },
    { path: "/about", priority: "0.6", changefreq: "monthly" },
    { path: "/contact", priority: "0.4", changefreq: "monthly" },
    { path: "/terms", priority: "0.3", changefreq: "yearly" },
    { path: "/privacy", priority: "0.3", changefreq: "yearly" },
    { path: "/nclex-rn-practice-questions", priority: "0.9", changefreq: "weekly", lastmod: today },
    { path: "/nclex-pn-practice-questions", priority: "0.9", changefreq: "weekly", lastmod: today },
    { path: "/rex-pn-practice-questions", priority: "0.9", changefreq: "weekly", lastmod: today },
    { path: "/np-exam-practice-questions", priority: "0.9", changefreq: "weekly", lastmod: today },
    { path: "/free-practice", priority: "0.9", changefreq: "weekly", lastmod: today },
    { path: "/practice-questions", priority: "0.9", changefreq: "weekly", lastmod: today },
    { path: "/glossary", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/medical-abbreviations-for-nurses", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/nursing-skill-checklists", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/medication-mastery", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/exam-prep", priority: "0.9", changefreq: "weekly", lastmod: today },
    { path: "/new-graduate-support", priority: "0.9", changefreq: "weekly", lastmod: today },
    { path: "/healthcare-careers", priority: "0.9", changefreq: "weekly", lastmod: today },
    { path: "/healthcare-careers/registered-nurse", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/healthcare-careers/licensed-practical-nurse", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/healthcare-careers/nurse-practitioner", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/healthcare-careers/respiratory-therapist", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/healthcare-careers/radiologic-technologist", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/healthcare-careers/sonographer", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/healthcare-careers/physical-therapist-assistant", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/healthcare-careers/occupational-therapy-assistant", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/healthcare-careers/surgical-technologist", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/healthcare-careers/medical-laboratory-technologist", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/healthcare-careers/paramedic", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/healthcare-careers/pharmacy-technician", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/healthcare-certifications", priority: "0.9", changefreq: "weekly", lastmod: today },
    { path: "/healthcare-certifications/acls", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/healthcare-certifications/pals", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/healthcare-certifications/bls", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/healthcare-certifications/nrp", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/healthcare-certifications/tncc", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/healthcare-certifications/enpc", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/healthcare-certifications/ccrn", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/healthcare-certifications/cen", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/healthcare-certifications/ocn", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/healthcare-certifications/cmsrn", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/guides", priority: "0.9", changefreq: "weekly", lastmod: today },
    { path: "/guides/complete-guide-to-becoming-a-registered-nurse", priority: "0.9", changefreq: "monthly", lastmod: today },
    { path: "/guides/complete-guide-to-becoming-an-rpn-lvn", priority: "0.9", changefreq: "monthly", lastmod: today },
    { path: "/guides/complete-guide-to-becoming-a-respiratory-therapist", priority: "0.9", changefreq: "monthly", lastmod: today },
    { path: "/guides/complete-guide-to-becoming-a-paramedic", priority: "0.9", changefreq: "monthly", lastmod: today },
    { path: "/guides/complete-guide-to-becoming-a-medical-lab-technologist", priority: "0.9", changefreq: "monthly", lastmod: today },
    { path: "/topics", priority: "0.8", changefreq: "weekly", lastmod: today },
    { path: "/allied-health", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/allied-health/careers", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/allied-health/pricing", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/allied-health/rrt", priority: "0.8", changefreq: "weekly", lastmod: today },
    { path: "/allied-health/rrt/domain/mechanical-ventilation", priority: "0.8", changefreq: "weekly", lastmod: today },
    { path: "/allied-health/rrt/domain/abg-interpretation", priority: "0.8", changefreq: "weekly", lastmod: today },
    { path: "/allied-health/rrt/domain/oxygen-therapy", priority: "0.8", changefreq: "weekly", lastmod: today },
    { path: "/allied-health/rrt/domain/airway-management", priority: "0.8", changefreq: "weekly", lastmod: today },
    { path: "/allied-health/rrt/domain/pulmonary-function-testing", priority: "0.8", changefreq: "weekly", lastmod: today },
    { path: "/allied-health/rrt/domain/neonatal-pediatric", priority: "0.8", changefreq: "weekly", lastmod: today },
    { path: "/allied-health/rrt/domain/critical-care", priority: "0.8", changefreq: "weekly", lastmod: today },
    { path: "/allied-health/rrt/domain/cardiopulmonary-physiology", priority: "0.8", changefreq: "weekly", lastmod: today },
    { path: "/allied-health/rrt/domain/aerosol-medication-delivery", priority: "0.8", changefreq: "weekly", lastmod: today },
    { path: "/allied-health/rrt/domain/sleep-niv", priority: "0.8", changefreq: "weekly", lastmod: today },
    { path: "/allied-health/rrt/domain/emergency-care", priority: "0.8", changefreq: "weekly", lastmod: today },
    { path: "/allied-health/rrt/domain/patient-assessment", priority: "0.8", changefreq: "weekly", lastmod: today },
    { path: "/allied-health/rrt/domain/infection-control", priority: "0.8", changefreq: "weekly", lastmod: today },
    { path: "/allied-health/paramedic", priority: "0.8", changefreq: "weekly", lastmod: today },
    { path: "/allied-health/pharmacy-technician", priority: "0.8", changefreq: "weekly", lastmod: today },
    { path: "/allied-health/mlt", priority: "0.8", changefreq: "weekly", lastmod: today },
    { path: "/allied-health/imaging", priority: "0.8", changefreq: "weekly", lastmod: today },
    { path: "/allied-health/social-work", priority: "0.8", changefreq: "weekly", lastmod: today },
    { path: "/allied-health/psychotherapy", priority: "0.8", changefreq: "weekly", lastmod: today },
    { path: "/allied-health/addictions", priority: "0.8", changefreq: "weekly", lastmod: today },
    { path: "/allied-health/occupational-therapy", priority: "0.8", changefreq: "weekly", lastmod: today },
    { path: "/languages", priority: "0.6", changefreq: "monthly", lastmod: today },
    { path: "/pass-nclex-first-time", priority: "0.9", changefreq: "monthly", lastmod: today },
    { path: "/pharmacology", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/rex-pn", priority: "0.9", changefreq: "monthly", lastmod: today },
    { path: "/rex-pn/exam-format", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/rex-pn/test-taking-strategies", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/rex-pn/wellness", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/rex-pn/practice-questions", priority: "0.9", changefreq: "weekly", lastmod: today },
    { path: "/rex-pn/study-plan", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/rex-pn/fundamentals", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/rex-pn/pharmacology", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/rex-pn/safety-and-infection-control", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/rex-pn/clinical-judgment", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/rex-pn/exam-tips", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/rex-pn/top-conditions", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/rex-pn/lab-values", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/rex-pn/medications", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/rex-pn/how-to-pass", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/rex-pn/clinical-judgment-framework", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/rex-pn/prioritization-tips", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/rex-pn/infection-control-study-guide", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/rex-pn/pharmacology-questions", priority: "0.8", changefreq: "weekly", lastmod: today },
    { path: "/rex-pn/safety-questions", priority: "0.8", changefreq: "weekly", lastmod: today },
    { path: "/rex-pn/fundamentals-questions", priority: "0.8", changefreq: "weekly", lastmod: today },
    { path: "/rex-pn/conditions/heart-failure", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/rex-pn/conditions/diabetes-dka-hhs", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/rex-pn/conditions/copd", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/rex-pn/conditions/pneumonia", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/rex-pn/conditions/sepsis", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/rex-pn/conditions/hypertension", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/rex-pn/conditions/mi-acs", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/rex-pn/conditions/stroke", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/rex-pn/conditions/uti", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/rex-pn/conditions/dvt-pe", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/rex-pn/conditions/anemia", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/rex-pn/conditions/wound-infection", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/rex-pn/conditions/dehydration", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/rex-pn/conditions/hypoglycemia", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/rex-pn/conditions/seizures", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/rex-pn/labs/potassium", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/rex-pn/labs/sodium", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/rex-pn/labs/glucose", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/rex-pn/labs/bun-creatinine", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/rex-pn/labs/cbc-wbc", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/rex-pn/labs/hemoglobin-hematocrit", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/rex-pn/labs/abgs", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/rex-pn/labs/calcium", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/rex-pn/labs/magnesium", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/rex-pn/labs/inr-pt", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/rex-pn/medications/furosemide", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/rex-pn/medications/insulin", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/rex-pn/medications/metoprolol", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/rex-pn/medications/lisinopril", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/rex-pn/medications/metformin", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/rex-pn/medications/acetaminophen", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/rex-pn/medications/warfarin", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/rex-pn/medications/heparin", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/rex-pn/medications/digoxin", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/rex-pn/medications/albuterol", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/rex-pn/medications/levothyroxine", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/rex-pn/medications/omeprazole", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/rex-pn/comparisons/dka-vs-hhs", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/rex-pn/comparisons/crohns-vs-ulcerative-colitis", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/rex-pn/comparisons/type-1-vs-type-2-diabetes", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/rex-pn/comparisons/dvt-vs-pe", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/rex-pn/comparisons/hypoglycemia-vs-hyperglycemia", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/rpn/test-bank", priority: "0.8", changefreq: "weekly", lastmod: today },
    { path: "/rn/test-bank", priority: "0.8", changefreq: "weekly", lastmod: today },
    { path: "/np/test-bank", priority: "0.8", changefreq: "weekly", lastmod: today },
    { path: "/perioperative-nursing", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/preoperative-care", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/preoperative-nursing-guide", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/perioperative-nurse-career", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/nclex-rn/mock-exam", priority: "0.9", changefreq: "weekly", lastmod: today },
    { path: "/nclex-pn/mock-exam", priority: "0.9", changefreq: "weekly", lastmod: today },
    { path: "/rex-pn/mock-exam", priority: "0.9", changefreq: "weekly", lastmod: today },
    { path: "/canada-np/mock-exam", priority: "0.9", changefreq: "weekly", lastmod: today },
    { path: "/us-np/mock-exam", priority: "0.9", changefreq: "weekly", lastmod: today },
    { path: "/nclex-rn", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/nclex-pn", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/canada-np", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/us-np", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/np/exams", priority: "0.9", changefreq: "weekly", lastmod: today },
    { path: "/np/aanp-exam", priority: "0.9", changefreq: "monthly", lastmod: today },
    { path: "/np/ancc-exam", priority: "0.9", changefreq: "monthly", lastmod: today },
    { path: "/np/upcoming-canada-np-exam", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/how-to-become-a-nurse/rpn", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/how-to-become-a-nurse/rn", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/how-to-become-a-nurse/np", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/medical-imaging", priority: "0.9", changefreq: "weekly", lastmod: today },
    { path: "/medical-imaging/canada", priority: "0.9", changefreq: "weekly", lastmod: today },
    { path: "/medical-imaging/usa", priority: "0.9", changefreq: "weekly", lastmod: today },
    { path: "/medical-imaging/blog", priority: "0.8", changefreq: "daily", lastmod: today },
    { path: "/medical-imaging/canada/lessons", priority: "0.8", changefreq: "weekly", lastmod: today },
    { path: "/medical-imaging/canada/positioning", priority: "0.8", changefreq: "weekly", lastmod: today },
    { path: "/medical-imaging/canada/physics", priority: "0.8", changefreq: "weekly", lastmod: today },
    { path: "/medical-imaging/canada/flashcards", priority: "0.8", changefreq: "weekly", lastmod: today },
    { path: "/medical-imaging/canada/practice-exams", priority: "0.8", changefreq: "weekly", lastmod: today },
    { path: "/medical-imaging/canada/exam-simulator", priority: "0.8", changefreq: "weekly", lastmod: today },
    { path: "/medical-imaging/usa/lessons", priority: "0.8", changefreq: "weekly", lastmod: today },
    { path: "/medical-imaging/usa/positioning", priority: "0.8", changefreq: "weekly", lastmod: today },
    { path: "/medical-imaging/usa/physics", priority: "0.8", changefreq: "weekly", lastmod: today },
    { path: "/medical-imaging/usa/flashcards", priority: "0.8", changefreq: "weekly", lastmod: today },
    { path: "/medical-imaging/usa/practice-exams", priority: "0.8", changefreq: "weekly", lastmod: today },
    { path: "/medical-imaging/usa/exam-simulator", priority: "0.8", changefreq: "weekly", lastmod: today },
    { path: "/radiography-practice-questions", priority: "0.9", changefreq: "weekly", lastmod: today },
    { path: "/radiography-positioning-guide", priority: "0.9", changefreq: "weekly", lastmod: today },
    { path: "/radiography-artifact-recognition", priority: "0.9", changefreq: "weekly", lastmod: today },
    { path: "/nursing-exam-prep", priority: "0.9", changefreq: "weekly", lastmod: today },
    { path: "/hyperkalemia-effects-on-heart", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/hyperkalemia-vs-hypokalemia-cardiac", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/barrel-chest-copd", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/question-bank-nursing", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/medication-mastery-nursing", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/nursing-simulation-practice", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/test-nclex-avec-corrige", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/sepsis-nursing-interventions", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/ventilator-management-nursing", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/diabetes-nursing-management", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/fluid-electrolyte-imbalance-nursing", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/hemodynamic-monitoring-nursing", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/wound-care-nursing", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/medication-administration-safety-nursing", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/pain-management-nursing", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/cardiac-rhythm-interpretation-nursing", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/infection-control-nursing", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/maternal-newborn-nursing", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/pediatric-assessment-nursing", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/mental-health-crisis-nursing", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/perioperative-care-nursing", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/pharmacology-basics-nursing", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/nclex-clinical-judgment-nursing", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/nursing-physiology-explained", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/why-burns-cause-hyperkalemia", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/potassium-effects-on-cardiac-conduction", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/metabolic-acidosis-in-aki", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/pyloric-stenosis-metabolic-alkalosis", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/qrs-complex-explained-for-nurses", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/clinical-nursing-skills", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/sterile-technique-nursing", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/wound-irrigation-procedure", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/fluid-status-assessment", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/pain-assessment-scales", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/newborn-assessment-guide", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/nclex-question-bank", priority: "0.9", changefreq: "monthly", lastmod: today },
    { path: "/rex-pn-exam-prep", priority: "0.9", changefreq: "monthly", lastmod: today },
    { path: "/nursing-clinical-scenarios", priority: "0.9", changefreq: "monthly", lastmod: today },
    { path: "/nursing-exam-preparation", priority: "0.9", changefreq: "monthly", lastmod: today },
    { path: "/electrolytes-nursing-exam-guide", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/acid-base-disorders-nursing-guide", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/nursing-clinical-assessment-guide", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/neurological-assessment-nursing", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/respiratory-assessment-nursing", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/critical-care-nursing-essentials", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/acid-base-balance-nursing", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/nclex-question-bank-guide", priority: "0.9", changefreq: "monthly", lastmod: today },
    { path: "/rex-pn-exam-prep-guide", priority: "0.9", changefreq: "monthly", lastmod: today },
    { path: "/nursing-clinical-scenarios-guide", priority: "0.9", changefreq: "monthly", lastmod: today },
    { path: "/lab-values-complete-nursing-guide", priority: "0.9", changefreq: "monthly", lastmod: today },
    { path: "/acid-base-disorders-nursing", priority: "0.9", changefreq: "monthly", lastmod: today },
    { path: "/nursing-clinical-assessment-complete-guide", priority: "0.9", changefreq: "monthly", lastmod: today },
    { path: "/international-nurses", priority: "0.9", changefreq: "weekly", lastmod: today },
    { path: "/international-nurses/tools", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/international-nurses/canada", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/international-nurses/united-states", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/international-nurses/united-kingdom", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/international-nurses/australia", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/international-nurses/new-zealand", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/international-nurses/ireland", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/international-nurses/uae", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/international-nurses/saudi-arabia", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/international-nurses/philippines-to-canada", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/international-nurses/india-to-canada", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/international-nurses/philippines-to-usa", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/international-nurses/india-to-uk", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/international-nurses/philippines-to-uk", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/international-nurses/india-to-australia", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/international-nurses/nigeria-to-canada", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/international-nurses/nepal-to-uk", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/nclex-for-international-nurses", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/rex-pn-for-international-nurses", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/ielts-for-nurses", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/oet-for-nurses", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/nursing-credential-assessment-explained", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/how-to-transfer-nursing-license", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/canada-vs-usa-nursing", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/canada-vs-uk-nursing", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/australia-vs-new-zealand-nursing", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/nursing-bridging-programs-explained", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/international-nurse-salary-comparison", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/nursing-visa-sponsorship-guide", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/working-as-a-nurse-in-canada", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/nnas-application-guide", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/cgfns-certification-guide", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/nmc-registration-guide-international-nurses", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/nursing-recruitment-agencies-guide", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/cultural-adjustment-international-nurses", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/international-nurse-interview-tips", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/clinical-calculators", priority: "0.9", changefreq: "monthly", lastmod: today },
    { path: "/clinical-calculators/anion-gap", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/clinical-calculators/iv-drip-rate", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/clinical-calculators/body-surface-area", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/clinical-calculators/pediatric-dose", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/clinical-calculators/abg-interpretation", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/clinical-calculators/gfr-calculator", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/clinical-calculators/bmi-calculator", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/nursing-study-guides", priority: "0.9", changefreq: "monthly", lastmod: today },
    { path: "/nursing-study-guides/electrolytes-nursing-guide", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/nursing-study-guides/acid-base-disorders-study-guide", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/nursing-study-guides/ecg-interpretation-study-guide", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/nursing-study-guides/fluid-electrolyte-balance-guide", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/nursing-study-guides/critical-lab-values-guide", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/nursing-clinical-scenarios/chest-pain-emergency", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/nursing-clinical-scenarios/sepsis-recognition", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/nursing-clinical-scenarios/respiratory-distress", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/nursing-clinical-scenarios/stroke-assessment", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/nursing-clinical-scenarios/pediatric-deterioration", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/nursing-licensing-exams", priority: "0.9", changefreq: "monthly", lastmod: today },
    { path: "/nursing-licensing-exams/nclex", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/nursing-licensing-exams/rex-pn", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/nursing-licensing-exams/nmc-cbt", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/nursing-licensing-exams/ahpra", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/nursing-licensing-exams/prometric", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/nursing-licensing-exams/ielts-for-nurses", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/nursing-licensing-exams/oet-for-nurses", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/nurse-salary-guide", priority: "0.9", changefreq: "monthly", lastmod: today },
    { path: "/nurse-salary-canada", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/nurse-salary-united-states", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/nurse-salary-united-kingdom", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/nurse-salary-australia", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/newgrad", priority: "0.9", changefreq: "weekly", lastmod: today },
    { path: "/newgrad/interview", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/newgrad/resume", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/newgrad/salary", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/newgrad/career", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/newgrad/workplace", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/newgrad/burnout", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/newgrad/professional-development", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/newgrad/guides", priority: "0.8", changefreq: "weekly", lastmod: today },
    { path: "/newgrad/clinical-references", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/newgrad/certifications", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/newgrad/survival-guide", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/healthcare-policy-and-updates", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/healthcare-policy-and-updates/licensing-policy-changes", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/healthcare-policy-and-updates/international-nursing-recruitment", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/healthcare-policy-and-updates/exam-format-updates", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/healthcare-policy-and-updates/regulatory-changes-affecting-nurses", priority: "0.7", changefreq: "monthly", lastmod: today },
  ];

  const enOnlyRoutes: Omit<StaticRouteDefinition, "multilingual">[] = [
    { path: "/case-simulations", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/first-action-simulator", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/safety-hazard-simulator", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/iv-complications-simulator", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/electrolyte-abg-simulator", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/deteriorating-patient-simulator", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/blood-transfusion-simulator", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/simulators/clinical-skills", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/simulators/osce", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/simulators/clinical-lab", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/shop", priority: "0.7", changefreq: "weekly", lastmod: today },
    { path: "/disclaimer", priority: "0.3", changefreq: "yearly" },
    { path: "/refund-policy", priority: "0.3", changefreq: "yearly" },
    { path: "/clinical-skills", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/clinical-case-studies", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/for-institutions", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/order-of-the-draw", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/applynest", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/applynest/resume-templates", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/applynest/interview-prep", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/applynest/job-search-guide", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/rexpn-exam-blueprint", priority: "0.9", changefreq: "monthly", lastmod: today },
    { path: "/nclex-rn-exam-blueprint", priority: "0.9", changefreq: "monthly", lastmod: today },
    { path: "/nclex-pn-exam-blueprint", priority: "0.9", changefreq: "monthly", lastmod: today },
    { path: "/allied-health-exam-blueprint", priority: "0.8", changefreq: "monthly", lastmod: today },
    { path: "/rexpn-foundations-of-practice", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/rexpn-collaborative-practice", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/rexpn-professional-practice", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/rexpn-ethical-practice", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/rexpn-legal-practice", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/rexpn-safety-and-infection-control", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/rexpn-health-promotion", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/rexpn-pharmacological-therapies", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/nclex-management-of-care", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/nclex-safety-and-infection-control", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/nclex-health-promotion", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/nclex-psychosocial-integrity", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/nclex-basic-care-and-comfort", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/nclex-pharmacology", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/nclex-reduction-of-risk", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/nclex-physiological-adaptation", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/nclex-pn-coordinated-care", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/nclex-pn-safety-infection-control", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/nclex-pn-health-promotion", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/nclex-pn-psychosocial-integrity", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/nclex-pn-basic-care", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/nclex-pn-pharmacology", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/nclex-pn-reduction-of-risk", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/nclex-pn-physiological-adaptation", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/allied-respiratory-therapy", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/allied-medical-lab-tech", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/allied-radiography", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/allied-paramedic", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/allied-occupational-therapy", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/allied-social-work", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/allied-pharmacy-tech", priority: "0.7", changefreq: "monthly", lastmod: today },
    { path: "/allied-psychotherapy-addictions", priority: "0.7", changefreq: "monthly", lastmod: today },
  ];

  return [
    ...multilingualRoutes.map(r => ({ ...r, multilingual: true })),
    ...enOnlyRoutes.map(r => ({ ...r, multilingual: false })),
  ];
}

export const COMPARE_PAGES = [
  "uworld-vs-archer-vs-nursenest", "best-uworld-alternatives-nclex",
  "best-rex-pn-question-bank-canada", "nursenest-vs-uworld",
  "nursenest-vs-archer", "nursenest-vs-quizlet",
  "best-nclex-prep-canada", "cheapest-nclex-prep", "rex-pn-practice-questions-free",
];

export const NURSING_QUESTION_TIERS = ["rpn", "rn", "np"];
