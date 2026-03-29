import { useState } from "react";
import { Link } from "wouter";
import { SEO } from "@/components/seo";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { buildFaqStructuredData } from "@/lib/structured-data";
import { useI18n } from "@/lib/i18n";
import {
  ArrowRight, CheckCircle2, ChevronDown, Scale, Globe, GraduationCap,
  DollarSign, Clock, Shield, Briefcase,
} from "lucide-react";

interface ComparisonRow {
  category: string;
  countryA: string;
  countryB: string;
}

interface ComparisonConfig {
  slug: string;
  countryA: { name: string; flag: string; slug: string };
  countryB: { name: string; flag: string; slug: string };
  title: string;
  description: string;
  seoKeywords: string;
  intro: string;
  rows: ComparisonRow[];
  verdict: string;
  faqs: { question: string; answer: string }[];
}

const COMPARISON_CONFIGS: Record<string, ComparisonConfig> = {
  "canada-vs-usa-nursing": {
    slug: "canada-vs-usa-nursing",
    countryA: { name: "Canada", flag: "🇨🇦", slug: "canada" },
    countryB: { name: "United States", flag: "🇺🇸", slug: "united-states" },
    title: "Canada vs USA for International Nurses",
    description: "Compare Canada and the United States for international nurses. Side-by-side comparison of licensing, exams, salary, immigration, and job opportunities.",
    seoKeywords: "Canada vs USA nursing, nursing Canada or USA, compare nursing license Canada USA, international nurse Canada USA, NCLEX Canada vs USA",
    intro: "Both Canada and the USA require the NCLEX-RN for RN licensure, but the licensing process, immigration pathways, salary expectations, and work environments differ significantly. This comparison helps internationally educated nurses choose the best destination.",
    rows: [
      { category: "Licensing Exam", countryA: "NCLEX-RN (same exam)", countryB: "NCLEX-RN (same exam)" },
      { category: "Credential Agency", countryA: "NNAS (National)", countryB: "CGFNS (varies by state)" },
      { category: "Language Test", countryA: "IELTS 7.0 / OET B / CELBAN", countryB: "TOEFL / IELTS (varies by state)" },
      { category: "Licensing Difficulty", countryA: "Moderate-High (NNAS + provincial)", countryB: "Moderate (state-specific)" },
      { category: "Processing Time", countryA: "8-14 months", countryB: "6-12 months" },
      { category: "Salary (Annual)", countryA: "CAD $65,000-$95,000", countryB: "USD $60,000-$120,000" },
      { category: "Tax-Free?", countryA: "No (income tax applies)", countryB: "No (income tax applies)" },
      { category: "Immigration Ease", countryA: "High (Express Entry, PNP)", countryB: "Moderate (visa backlogs for EB-3)" },
      { category: "Permanent Residency", countryA: "Faster through Express Entry", countryB: "Slower due to EB-3 wait times" },
      { category: "Healthcare System", countryA: "Universal (publicly funded)", countryB: "Mixed (private/public)" },
      { category: "Work-Life Balance", countryA: "Generally better", countryB: "Varies by employer" },
      { category: "Nurse Demand", countryA: "Very high (nursing shortage)", countryB: "Very high (especially travel nursing)" },
      { category: "Cost of Licensing", countryA: "CAD $3,000-$7,000", countryB: "USD $5,000-$15,000" },
    ],
    verdict: "Canada offers easier immigration through Express Entry and Provincial Nominee Programs, with a publicly funded healthcare system and strong work-life balance. The USA offers higher earning potential (especially in travel nursing and high-cost states) but has more complex immigration with potential visa backlogs. Both use the same NCLEX-RN exam, making it possible to prepare for both simultaneously.",
    faqs: [
      { question: "Can I apply to both Canada and the USA at the same time?", answer: "Yes. Since both countries use the NCLEX-RN, you can prepare for the same exam while pursuing credential evaluation in both countries simultaneously. However, you'll need separate credential evaluations (NNAS for Canada, CGFNS for USA)." },
      { question: "Which country pays nurses more?", answer: "The USA generally offers higher nominal salaries, especially in states like California and New York. However, Canada's universal healthcare, stronger labor protections, and potentially faster immigration offset some of the salary difference. Cost of living varies significantly in both countries." },
      { question: "Which country has faster immigration for nurses?", answer: "Canada's Express Entry and Provincial Nominee Programs generally process faster than US employment-based green cards (EB-3), which can have multi-year backlogs depending on your country of origin." },
    ],
  },
  "canada-vs-uk-nursing": {
    slug: "canada-vs-uk-nursing",
    countryA: { name: "Canada", flag: "🇨🇦", slug: "canada" },
    countryB: { name: "United Kingdom", flag: "🇬🇧", slug: "united-kingdom" },
    title: "Canada vs UK for International Nurses",
    description: "Compare Canada and the United Kingdom for international nurses. Side-by-side comparison of NCLEX vs CBT/OSCE, NNAS vs NMC, salary, NHS vs Canadian healthcare, and immigration.",
    seoKeywords: "Canada vs UK nursing, nursing Canada or UK, compare nursing license Canada UK, international nurse Canada UK, NCLEX vs NMC, NHS vs Canadian nursing",
    intro: "Canada and the UK are both popular destinations for international nurses but have very different licensing processes. Canada uses the NCLEX-RN with a multi-step credential evaluation through NNAS, while the UK uses a two-part process (CBT + OSCE) through the NMC. Immigration pathways and work environments also differ significantly.",
    rows: [
      { category: "Licensing Exam", countryA: "NCLEX-RN", countryB: "NMC CBT + OSCE" },
      { category: "Credential Agency", countryA: "NNAS + Provincial body", countryB: "NMC (self-contained)" },
      { category: "Language Test", countryA: "IELTS 7.0 / OET B / CELBAN", countryB: "IELTS 7.0 / OET B" },
      { category: "Licensing Difficulty", countryA: "Moderate-High", countryB: "Moderate (OSCE is practical)" },
      { category: "Processing Time", countryA: "8-14 months", countryB: "4-8 months" },
      { category: "Salary (Annual)", countryA: "CAD $65,000-$95,000", countryB: "GBP £28,000-£50,000" },
      { category: "Immigration Ease", countryA: "High (Express Entry)", countryB: "High (Health & Care Worker visa)" },
      { category: "Employer Sponsorship", countryA: "Available but less common", countryB: "Very common (NHS sponsors)" },
      { category: "Healthcare System", countryA: "Provincial (publicly funded)", countryB: "NHS (nationally funded)" },
      { category: "Shortage Occupation", countryA: "Yes (most provinces)", countryB: "Yes (Shortage Occupation List)" },
      { category: "Permanent Residency", countryA: "Faster (Express Entry)", countryB: "5 years for ILR" },
      { category: "Cost of Licensing", countryA: "CAD $3,000-$7,000", countryB: "GBP £2,000-$5,000" },
    ],
    verdict: "The UK offers a faster licensing process (4-8 months) with strong employer sponsorship through the NHS. Canada offers higher salaries and faster permanent residency through Express Entry. The UK's OSCE is a practical exam that many nurses find manageable, while Canada's NCLEX-RN is a computer-based knowledge exam. Both countries have nursing on their shortage occupation lists.",
    faqs: [
      { question: "Which is faster — Canada or UK licensing?", answer: "The UK is typically faster (4-8 months vs 8-14 months for Canada). The NMC process is more self-contained, while Canada's NNAS assessment adds 3-6 months before you can even apply to a province." },
      { question: "Which country pays more for nursing?", answer: "Canada offers higher salaries in absolute terms (CAD $65,000-$95,000 vs GBP £28,000-£50,000). However, purchasing power depends on location, cost of living, and tax rates in each country." },
      { question: "Is the OSCE harder than the NCLEX?", answer: "They test different skills. The OSCE is a practical, hands-on clinical assessment, while the NCLEX-RN is a computer-based knowledge exam. Many nurses who struggle with written exams find the OSCE more manageable, and vice versa." },
    ],
  },
  "australia-vs-new-zealand-nursing": {
    slug: "australia-vs-new-zealand-nursing",
    countryA: { name: "Australia", flag: "🇦🇺", slug: "australia" },
    countryB: { name: "New Zealand", flag: "🇳🇿", slug: "new-zealand" },
    title: "Australia vs New Zealand for International Nurses",
    description: "Compare Australia and New Zealand for international nurses. Side-by-side comparison of AHPRA vs NCNZ registration, salary, visa options, and nursing work environments.",
    seoKeywords: "Australia vs New Zealand nursing, nursing Australia or NZ, compare nursing license Australia NZ, international nurse Australia NZ, AHPRA vs NCNZ",
    intro: "Australia and New Zealand are neighboring countries with distinct nursing registration processes. Australia uses ANMAC skills assessment through AHPRA, while New Zealand uses the Nursing Council (NCNZ) with a potential Competence Assessment Programme. Both are on skilled migration lists, but they differ in salary, job market size, and immigration pathways.",
    rows: [
      { category: "Registration Body", countryA: "AHPRA / ANMAC", countryB: "NCNZ" },
      { category: "Assessment Type", countryA: "ANMAC skills assessment", countryB: "NCNZ assessment + CAP (if required)" },
      { category: "Licensing Exam", countryA: "NCLEX-RN (piloting)", countryB: "No universal exam" },
      { category: "Language Test", countryA: "IELTS 7.0 / OET B / PTE 65", countryB: "IELTS 7.0 / OET B" },
      { category: "Processing Time", countryA: "6-12 months", countryB: "4-8 months" },
      { category: "Salary (Annual)", countryA: "AUD $70,000-$110,000", countryB: "NZD $60,000-$90,000" },
      { category: "Immigration Ease", countryA: "High (MLTSSL)", countryB: "High (Green List)" },
      { category: "Job Market Size", countryA: "Large (25+ million population)", countryB: "Smaller (5 million population)" },
      { category: "Permanent Residency", countryA: "Available (189, 190 visas)", countryB: "Available (SMC, Green List)" },
      { category: "Quality of Life", countryA: "High", countryB: "Very High" },
      { category: "Cost of Living", countryA: "High (especially Sydney, Melbourne)", countryB: "Moderate-High (Auckland)" },
      { category: "Rural Incentives", countryA: "Strong (regional visa advantages)", countryB: "Available" },
    ],
    verdict: "Australia offers a larger job market, higher salaries, and more diverse career opportunities. New Zealand offers a simpler registration process (no universal exam), excellent quality of life, and fast-track residency through the Green List. Both countries have nursing on their skilled migration lists. Consider whether you prefer a larger metropolitan career market (Australia) or a smaller, close-knit healthcare community (New Zealand).",
    faqs: [
      { question: "Which country is easier for nurse registration?", answer: "New Zealand's process is generally simpler — NCNZ doesn't require a universal licensing exam (though CAP may be required). Australia's ANMAC assessment is more document-intensive and is piloting the NCLEX-RN for some applicants." },
      { question: "Can I register in both countries?", answer: "The Trans-Tasman Mutual Recognition Agreement allows registered nurses in Australia to practice in New Zealand and vice versa, though additional steps may be required." },
      { question: "Which country offers better salaries?", answer: "Australia offers higher nominal salaries (AUD $70,000-$110,000 vs NZD $60,000-$90,000). However, cost of living in major Australian cities is also higher. Rural positions in both countries may offer additional incentives." },
    ],
  },
  "international-nurses/compare-canada-vs-united-states": {
    slug: "international-nurses/compare-canada-vs-united-states",
    countryA: { name: "Canada", flag: "🇨🇦", slug: "canada" },
    countryB: { name: "United States", flag: "🇺🇸", slug: "united-states" },
    title: "Canada vs United States for International Nurses",
    description: "Compare Canada and the United States for international nurses. Side-by-side comparison of licensing exams, credential evaluation, salary, immigration pathways, and job opportunities for IENs.",
    seoKeywords: "Canada vs United States nursing, nursing Canada or United States, compare nursing license Canada USA, international nurse Canada USA, NCLEX Canada vs USA, IEN Canada vs USA",
    intro: "Both Canada and the USA require the NCLEX-RN for RN licensure, but the licensing process, immigration pathways, salary expectations, and work environments differ significantly. This comparison helps internationally educated nurses choose the best destination for their career goals.",
    rows: [
      { category: "Licensing Exam", countryA: "NCLEX-RN (same exam)", countryB: "NCLEX-RN (same exam)" },
      { category: "Credential Agency", countryA: "NNAS (National)", countryB: "CGFNS (varies by state)" },
      { category: "Language Test", countryA: "IELTS 7.0 / OET B / CELBAN", countryB: "TOEFL / IELTS (varies by state)" },
      { category: "Licensing Difficulty", countryA: "Moderate-High (NNAS + provincial)", countryB: "Moderate (state-specific)" },
      { category: "Processing Time", countryA: "8-14 months", countryB: "6-12 months" },
      { category: "Salary (Annual)", countryA: "CAD $65,000-$95,000", countryB: "USD $60,000-$120,000" },
      { category: "Tax Structure", countryA: "Income tax applies (25-35%)", countryB: "Income tax applies (22-37%)" },
      { category: "Immigration Ease", countryA: "High (Express Entry, PNP)", countryB: "Moderate (visa backlogs for EB-3)" },
      { category: "Permanent Residency", countryA: "Faster through Express Entry", countryB: "Slower due to EB-3 wait times" },
      { category: "Healthcare System", countryA: "Universal (publicly funded)", countryB: "Mixed (private/public)" },
      { category: "Work-Life Balance", countryA: "Generally better", countryB: "Varies by employer" },
      { category: "Nurse Demand", countryA: "Very high (nursing shortage)", countryB: "Very high (especially travel nursing)" },
      { category: "Cost of Licensing", countryA: "CAD $3,000-$7,000", countryB: "USD $5,000-$15,000" },
      { category: "Overtime Opportunities", countryA: "Available at 1.5x-2x pay", countryB: "Travel nursing pays $80K-$150K+" },
    ],
    verdict: "Canada offers easier immigration through Express Entry and Provincial Nominee Programs, with a publicly funded healthcare system and strong work-life balance. The USA offers higher earning potential (especially in travel nursing and high-cost states) but has more complex immigration with potential visa backlogs. Both use the same NCLEX-RN exam, making it possible to prepare for both simultaneously. Canada is ideal for nurses prioritizing immigration stability and quality of life, while the USA suits those seeking maximum earning potential.",
    faqs: [
      { question: "Can I apply to both Canada and the USA at the same time?", answer: "Yes. Since both countries use the NCLEX-RN, you can prepare for the same exam while pursuing credential evaluation in both countries simultaneously. However, you'll need separate credential evaluations (NNAS for Canada, CGFNS for USA)." },
      { question: "Which country pays nurses more?", answer: "The USA generally offers higher nominal salaries, especially in states like California and New York. However, Canada's universal healthcare, stronger labor protections, and potentially faster immigration offset some of the salary difference. Cost of living varies significantly in both countries." },
      { question: "Which country has faster immigration for nurses?", answer: "Canada's Express Entry and Provincial Nominee Programs generally process faster than US employment-based green cards (EB-3), which can have multi-year backlogs depending on your country of origin." },
      { question: "Is the nursing shortage the same in both countries?", answer: "Both countries face significant nursing shortages. Canada has nursing on its National Occupational Classification (NOC) shortage list, while the US lists nurses on Schedule A for immigration purposes. Both actively recruit internationally educated nurses." },
      { question: "Can I transfer my license between Canada and the USA?", answer: "There is no automatic license transfer between Canada and the USA. You would need to apply to the regulatory body in the other country and may need additional credential evaluation. However, since both use NCLEX-RN, you wouldn't need to retake the licensing exam." },
    ],
  },
  "international-nurses/compare-canada-vs-united-kingdom": {
    slug: "international-nurses/compare-canada-vs-united-kingdom",
    countryA: { name: "Canada", flag: "🇨🇦", slug: "canada" },
    countryB: { name: "United Kingdom", flag: "🇬🇧", slug: "united-kingdom" },
    title: "Canada vs United Kingdom for International Nurses",
    description: "Compare Canada and the United Kingdom for international nurses. Side-by-side comparison of NCLEX vs CBT/OSCE, NNAS vs NMC, salary, NHS vs Canadian healthcare, and immigration pathways.",
    seoKeywords: "Canada vs United Kingdom nursing, nursing Canada or UK, compare nursing license Canada UK, international nurse Canada UK, NCLEX vs NMC, NHS vs Canadian nursing, IEN Canada UK",
    intro: "Canada and the UK are both highly popular destinations for international nurses, offering distinct advantages. Canada uses the NCLEX-RN with a multi-step credential evaluation through NNAS, while the UK uses a two-part process (CBT + OSCE) through the NMC. This guide compares every aspect to help you make an informed decision.",
    rows: [
      { category: "Licensing Exam", countryA: "NCLEX-RN", countryB: "NMC CBT + OSCE" },
      { category: "Credential Agency", countryA: "NNAS + Provincial body", countryB: "NMC (self-contained)" },
      { category: "Language Test", countryA: "IELTS 7.0 / OET B / CELBAN", countryB: "IELTS 7.0 / OET B" },
      { category: "Licensing Difficulty", countryA: "Moderate-High", countryB: "Moderate (OSCE is practical)" },
      { category: "Processing Time", countryA: "8-14 months", countryB: "4-8 months" },
      { category: "Salary (Annual)", countryA: "CAD $65,000-$95,000", countryB: "GBP £28,000-£50,000" },
      { category: "Immigration Ease", countryA: "High (Express Entry)", countryB: "High (Health & Care Worker visa)" },
      { category: "Employer Sponsorship", countryA: "Available but less common", countryB: "Very common (NHS sponsors)" },
      { category: "Healthcare System", countryA: "Provincial (publicly funded)", countryB: "NHS (nationally funded)" },
      { category: "Shortage Occupation", countryA: "Yes (most provinces)", countryB: "Yes (Shortage Occupation List)" },
      { category: "Permanent Residency", countryA: "Faster (Express Entry)", countryB: "5 years for ILR" },
      { category: "Cost of Licensing", countryA: "CAD $3,000-$7,000", countryB: "GBP £2,000-£5,000" },
      { category: "Pension & Benefits", countryA: "Provincial plans + employer", countryB: "NHS pension + 27 days leave" },
      { category: "Career Progression", countryA: "NP pathway available", countryB: "Band 5-8 progression" },
    ],
    verdict: "The UK offers a faster licensing process (4-8 months) with strong employer sponsorship through the NHS and a well-structured career ladder (Band 5-8). Canada offers higher salaries and faster permanent residency through Express Entry. The UK's OSCE is a practical exam that many nurses find manageable, while Canada's NCLEX-RN is a computer-based knowledge exam. Both countries have nursing on their shortage occupation lists and actively recruit international nurses.",
    faqs: [
      { question: "Which is faster — Canada or UK licensing?", answer: "The UK is typically faster (4-8 months vs 8-14 months for Canada). The NMC process is more self-contained, while Canada's NNAS assessment adds 3-6 months before you can even apply to a province." },
      { question: "Which country pays more for nursing?", answer: "Canada offers higher salaries in absolute terms (CAD $65,000-$95,000 vs GBP £28,000-£50,000). However, purchasing power depends on location, cost of living, and tax rates in each country." },
      { question: "Is the OSCE harder than the NCLEX?", answer: "They test different skills. The OSCE is a practical, hands-on clinical assessment, while the NCLEX-RN is a computer-based knowledge exam. Many nurses who struggle with written exams find the OSCE more manageable, and vice versa." },
      { question: "Which country offers better long-term career prospects?", answer: "Both offer excellent prospects. The UK's NHS provides a clear career ladder (Band 5-8) with structured progression. Canada offers NP pathways and generally higher base salaries. Both countries have growing demand for specialized nurses." },
      { question: "Can I bring my family?", answer: "Both countries allow dependents. The UK's Health and Care Worker visa includes dependent visas. Canada's Express Entry allows you to include your spouse and dependent children in your permanent residency application." },
    ],
  },
  "international-nurses/compare-australia-vs-new-zealand": {
    slug: "international-nurses/compare-australia-vs-new-zealand",
    countryA: { name: "Australia", flag: "🇦🇺", slug: "australia" },
    countryB: { name: "New Zealand", flag: "🇳🇿", slug: "new-zealand" },
    title: "Australia vs New Zealand for International Nurses",
    description: "Compare Australia and New Zealand for international nurses. Side-by-side comparison of AHPRA vs NCNZ registration, salary, visa pathways, job market, and quality of life for IENs.",
    seoKeywords: "Australia vs New Zealand nursing, nursing Australia or NZ, compare nursing license Australia NZ, international nurse Australia NZ, AHPRA vs NCNZ, IEN Australia New Zealand",
    intro: "Australia and New Zealand are neighboring countries that share cultural similarities but have distinct nursing registration processes, job markets, and immigration pathways. Australia uses ANMAC skills assessment through AHPRA, while New Zealand uses the Nursing Council (NCNZ). This guide helps internationally educated nurses choose between these two popular destinations.",
    rows: [
      { category: "Registration Body", countryA: "AHPRA / ANMAC", countryB: "NCNZ" },
      { category: "Assessment Type", countryA: "ANMAC skills assessment", countryB: "NCNZ assessment + CAP (if required)" },
      { category: "Licensing Exam", countryA: "NCLEX-RN (piloting)", countryB: "No universal exam" },
      { category: "Language Test", countryA: "IELTS 7.0 / OET B / PTE 65", countryB: "IELTS 7.0 / OET B" },
      { category: "Processing Time", countryA: "6-12 months", countryB: "4-8 months" },
      { category: "Salary (Annual)", countryA: "AUD $70,000-$110,000", countryB: "NZD $60,000-$90,000" },
      { category: "Immigration Ease", countryA: "High (MLTSSL)", countryB: "High (Green List)" },
      { category: "Job Market Size", countryA: "Large (25+ million population)", countryB: "Smaller (5 million population)" },
      { category: "Permanent Residency", countryA: "Available (189, 190 visas)", countryB: "Available (SMC, Green List)" },
      { category: "Quality of Life", countryA: "High", countryB: "Very High" },
      { category: "Cost of Living", countryA: "High (especially Sydney, Melbourne)", countryB: "Moderate-High (Auckland)" },
      { category: "Rural Incentives", countryA: "Strong (regional visa advantages)", countryB: "Available" },
      { category: "Mutual Recognition", countryA: "Trans-Tasman agreement", countryB: "Trans-Tasman agreement" },
      { category: "Specialty Opportunities", countryA: "Diverse (large hospital systems)", countryB: "Limited but growing" },
    ],
    verdict: "Australia offers a larger job market, higher salaries, and more diverse career and specialty opportunities, particularly in major cities. New Zealand offers a simpler registration process (no universal exam), excellent quality of life, and fast-track residency through the Green List. The Trans-Tasman Mutual Recognition Agreement means you can potentially move between the two countries. Choose Australia for career breadth and earning potential, or New Zealand for lifestyle and simpler registration.",
    faqs: [
      { question: "Which country is easier for nurse registration?", answer: "New Zealand's process is generally simpler — NCNZ doesn't require a universal licensing exam (though CAP may be required). Australia's ANMAC assessment is more document-intensive and is piloting the NCLEX-RN for some applicants." },
      { question: "Can I register in both countries?", answer: "The Trans-Tasman Mutual Recognition Agreement allows registered nurses in Australia to practice in New Zealand and vice versa, though additional steps may be required." },
      { question: "Which country offers better salaries?", answer: "Australia offers higher nominal salaries (AUD $70,000-$110,000 vs NZD $60,000-$90,000). However, cost of living in major Australian cities is also higher. Rural positions in both countries may offer additional incentives." },
      { question: "Is it better to start in New Zealand then move to Australia?", answer: "This is a common strategy. New Zealand's simpler registration process means you can start working sooner, gain international experience, and then use the Trans-Tasman agreement to move to Australia if desired." },
      { question: "Which country has better work-life balance?", answer: "New Zealand is consistently ranked higher for work-life balance and quality of life. However, Australia's larger cities offer more cultural activities and career opportunities. Both countries offer good working conditions compared to many other destinations." },
    ],
  },
};

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden" data-testid={`faq-item-${index}`}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors" data-testid={`button-faq-toggle-${index}`}>
        <span className="font-medium text-gray-900 pr-4">{question}</span>
        <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180 text-teal-500' : 'text-gray-400'}`} />
      </button>
      {open && <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed" data-testid={`text-faq-answer-${index}`}>{answer}</div>}
    </div>
  );
}

export function ComparisonPageBySlug({ slug }: { slug: string }) {
  const { t } = useI18n();
  const config = COMPARISON_CONFIGS[slug];
  if (!config) return null;

  const faqStructuredData = buildFaqStructuredData(config.faqs.map(f => ({ question: f.question, answer: f.answer })));

  return (
    <div data-testid={`page-comparison-${config.slug}`}>
      <Navigation />
      <SEO
        title={`${config.title} | NurseNest`}
        description={config.description}
        keywords={config.seoKeywords}
        canonicalPath={`/${config.slug}`}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": config.title,
          "description": config.description,
          "author": { "@type": "Organization", "name": "NurseNest" },
          "publisher": { "@type": "Organization", "name": "NurseNest" },
        }}
        additionalStructuredData={[faqStructuredData]}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: t("intlNursing.hub.badge"), url: "https://www.nursenest.ca/international-nurses" },
          { name: config.title, url: `https://www.nursenest.ca/${config.slug}` },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <BreadcrumbNav items={[
          { name: "Home", url: "https://www.nursenest.ca/" },
          { name: t("intlNursing.hub.badge"), url: "https://www.nursenest.ca/international-nurses" },
          { name: config.title, url: `https://www.nursenest.ca/${config.slug}` },
        ]} />
      </div>

      <section className="relative py-14 sm:py-20 overflow-hidden" data-testid="section-hero">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-blue-50/30 to-white" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-700 mb-4">
            <Scale className="w-4 h-4" /> Country Comparison
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4" data-testid="text-h1">
            {config.countryA.flag} {config.countryA.name} vs {config.countryB.flag} {config.countryB.name}
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">{config.intro}</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href={`/international-nurses/${config.countryA.slug}`} className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-teal-700 rounded-xl font-medium hover:bg-teal-50 border border-teal-200" data-testid="link-country-a">
              {config.countryA.flag} {config.countryA.name} Guide
            </Link>
            <Link href={`/international-nurses/${config.countryB.slug}`} className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-teal-700 rounded-xl font-medium hover:bg-teal-50 border border-teal-200" data-testid="link-country-b">
              {config.countryB.flag} {config.countryB.name} Guide
            </Link>
          </div>
        </div>
      </section>

      <section className="py-14" data-testid="section-table">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{t("pages.internationalNursingComparison.sidebysideComparison")}</h2>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm overflow-x-auto">
            <div className="grid grid-cols-3 bg-gray-50 border-b border-gray-200 min-w-[600px]">
              <div className="px-5 py-3 text-sm font-semibold text-gray-500">{t("pages.internationalNursingComparison.category")}</div>
              <div className="px-5 py-3 text-sm font-semibold text-teal-700 text-center">{config.countryA.flag} {config.countryA.name}</div>
              <div className="px-5 py-3 text-sm font-semibold text-blue-700 text-center">{config.countryB.flag} {config.countryB.name}</div>
            </div>
            {config.rows.map((row, i) => (
              <div key={i} className={`grid grid-cols-3 min-w-[600px] ${i < config.rows.length - 1 ? 'border-b border-gray-100' : ''}`} data-testid={`comparison-row-${i}`}>
                <div className="px-5 py-4 text-sm font-medium text-gray-700">{row.category}</div>
                <div className="px-5 py-4 text-sm text-gray-600 text-center">{row.countryA}</div>
                <div className="px-5 py-4 text-sm text-gray-600 text-center">{row.countryB}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 bg-gray-50" data-testid="section-verdict">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("pages.internationalNursingComparison.ourAssessment")}</h2>
          <p className="text-gray-700 leading-relaxed">{config.verdict}</p>
        </div>
      </section>

      <section className="py-14 bg-teal-600" data-testid="section-cta">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">{t("intlNursing.hub.whyNurseNest")}</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href={`/international-nurses/${config.countryA.slug}`} className="inline-flex items-center gap-2 px-6 py-3 bg-white text-teal-700 rounded-xl font-semibold hover:bg-teal-50" data-testid="button-cta-a">
              {config.countryA.flag} {config.countryA.name} Guide <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href={`/international-nurses/${config.countryB.slug}`} className="inline-flex items-center gap-2 px-6 py-3 bg-teal-700 text-white rounded-xl font-semibold hover:bg-teal-800 border border-teal-500" data-testid="button-cta-b">
              {config.countryB.flag} {config.countryB.name} Guide <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {config.faqs.length > 0 && (
        <section className="py-14" data-testid="section-faq">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("intlNursing.country.faqTitle")}</h2>
            <div className="space-y-3">
              {config.faqs.map((faq, i) => (
                <FAQItem key={i} question={faq.question} answer={faq.answer} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}

export default function InternationalNursingComparisonPage() {
  const rawPath = window.location.pathname.replace(/\/$/, '');
  const localeStripped = rawPath.replace(/^\/(en|fr|es|fil|hi|zh-tw|zh|ar|ko|pt|pa|vi|ht|ur|ja|fa|de|th|tr|id)(\/|$)/, '/');
  const slug = localeStripped.replace(/^\//, '');
  return <ComparisonPageBySlug slug={slug} />;
}

export const COMPARISON_SLUGS = Object.keys(COMPARISON_CONFIGS);
