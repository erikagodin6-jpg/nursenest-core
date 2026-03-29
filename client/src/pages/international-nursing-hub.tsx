import { useState } from "react";
import { Link } from "wouter";
import { SEO } from "@/components/seo";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { buildFaqStructuredData } from "@/lib/structured-data";
import { useI18n } from "@/lib/i18n";
import {
  ArrowRight, BookOpen, Globe, GraduationCap, FileText, CheckCircle2,
  ChevronDown, MapPin, Stethoscope, Shield, BarChart3, Languages,
  Award, Briefcase, ClipboardCheck, Scale, HelpCircle, Clock,
  DollarSign, Heart, Users, Building2, Wrench,
} from "lucide-react";
import { TranslationFallbackNotice } from "@/components/translation-fallback-notice";

const COUNTRIES = [
  { slug: "canada", name: "Canada", flag: "🇨🇦", exam: "NCLEX-RN", regBody: "NNAS / Provincial Colleges", color: "bg-red-50 border-red-200 text-red-700" },
  { slug: "united-states", name: "United States", flag: "🇺🇸", exam: "NCLEX-RN", regBody: "CGFNS / State Boards", color: "bg-blue-50 border-blue-200 text-blue-700" },
  { slug: "united-kingdom", name: "United Kingdom", flag: "🇬🇧", exam: "CBT & OSCE", regBody: "NMC", color: "bg-indigo-50 border-indigo-200 text-indigo-700" },
  { slug: "australia", name: "Australia", flag: "🇦🇺", exam: "NCLEX-RN (pilot)", regBody: "AHPRA / ANMAC", color: "bg-yellow-50 border-yellow-200 text-yellow-700" },
  { slug: "new-zealand", name: "New Zealand", flag: "🇳🇿", exam: "CAP Programme", regBody: "NCNZ", color: "bg-green-50 border-green-200 text-green-700" },
  { slug: "ireland", name: "Ireland", flag: "🇮🇪", exam: "Aptitude Test", regBody: "NMBI", color: "bg-emerald-50 border-emerald-200 text-emerald-700" },
  { slug: "uae", name: "United Arab Emirates", flag: "🇦🇪", exam: "DHA / HAAD / MOH", regBody: "DHA / DOH / MOH", color: "bg-purple-50 border-purple-200 text-purple-700" },
  { slug: "saudi-arabia", name: "Saudi Arabia", flag: "🇸🇦", exam: "Prometric / SCFHS", regBody: "SCFHS", color: "bg-teal-50 border-teal-200 text-teal-700" },
];

const MIGRATION_PATHS = [
  { slug: "philippines-to-canada", from: "Philippines", to: "Canada", flag: "🇵🇭→🇨🇦" },
  { slug: "india-to-canada", from: "India", to: "Canada", flag: "🇮🇳→🇨🇦" },
  { slug: "philippines-to-usa", from: "Philippines", to: "United States", flag: "🇵🇭→🇺🇸" },
  { slug: "india-to-uk", from: "India", to: "United Kingdom", flag: "🇮🇳→🇬🇧" },
  { slug: "philippines-to-uk", from: "Philippines", to: "United Kingdom", flag: "🇵🇭→🇬🇧" },
  { slug: "india-to-australia", from: "India", to: "Australia", flag: "🇮🇳→🇦🇺" },
  { slug: "nigeria-to-canada", from: "Nigeria", to: "Canada", flag: "🇳🇬→🇨🇦" },
  { slug: "nepal-to-uk", from: "Nepal", to: "United Kingdom", flag: "🇳🇵→🇬🇧" },
];

const EXAM_PAGES = [
  { slug: "nclex-for-international-nurses", title: "NCLEX for International Nurses", desc: "Everything IENs need to know about the NCLEX-RN exam — eligibility, preparation, and how NurseNest can help you pass." },
  { slug: "rex-pn-for-international-nurses", title: "REx-PN for International Nurses", desc: "Canadian practical nursing exam guide for internationally educated nurses seeking RPN registration." },
  { slug: "ielts-for-nurses", title: "IELTS for Nurses", desc: "IELTS Academic requirements, scoring, and preparation strategies for nursing licensure applications." },
  { slug: "oet-for-nurses", title: "OET for Nurses", desc: "Occupational English Test guide — why nurses choose OET, scoring, and how to prepare effectively." },
  { slug: "nursing-credential-assessment-explained", title: "Credential Assessment Explained", desc: "How nursing credential evaluation works, which agencies to use, and what documents you need." },
  { slug: "how-to-transfer-nursing-license", title: "How to Transfer Your Nursing License", desc: "Step-by-step guide to transferring your nursing license to another country." },
];

const COMPARISON_PAGES = [
  { slug: "canada-vs-usa-nursing", title: "Canada vs USA", desc: "Compare licensing, salary, exams, and immigration pathways for nurses." },
  { slug: "canada-vs-uk-nursing", title: "Canada vs UK", desc: "Compare NMC vs NNAS, NCLEX vs CBT/OSCE, and immigration pathways." },
  { slug: "australia-vs-new-zealand-nursing", title: "Australia vs New Zealand", desc: "Compare AHPRA vs NCNZ, visa options, and nursing work environments." },
];

const FEATURES = [
  { title: "Licensing Guides", desc: "Country-specific licensing requirements, regulatory bodies, and step-by-step registration processes.", icon: Shield, link: "/international-nurses/canada" },
  { title: "Exam Preparation", desc: "NCLEX, REx-PN, IELTS, OET prep resources with practice questions and study plans.", icon: GraduationCap, link: "/nclex-for-international-nurses" },
  { title: "Migration Pathways", desc: "Step-by-step guides for moving from your home country to your destination.", icon: MapPin, link: "/philippines-to-canada" },
  { title: "Country Comparisons", desc: "Side-by-side comparison of licensing difficulty, salary, and immigration pathways.", icon: Scale, link: "/canada-vs-usa-nursing" },
  { title: "Credential Guidance", desc: "How to get your nursing credentials evaluated and recognized internationally.", icon: ClipboardCheck, link: "/nursing-credential-assessment-explained" },
  { title: "Job Support", desc: "Find nursing jobs abroad with visa sponsorship through ApplyNest.", icon: Briefcase, link: "/applynest" },
];

const CONTENT_PAGES = [
  { slug: "nursing-bridging-programs-explained", title: "Nursing Bridging Programs", desc: "What bridging programs are, who needs them, and how to choose the right one.", icon: BookOpen },
  { slug: "international-nurse-salary-comparison", title: "Salary Comparison Guide", desc: "Compare nursing salaries across countries with tax and purchasing power analysis.", icon: DollarSign },
  { slug: "nursing-visa-sponsorship-guide", title: "Visa Sponsorship Guide", desc: "How to find nursing jobs with visa sponsorship and navigate immigration.", icon: Globe },
  { slug: "working-as-a-nurse-in-canada", title: "Working as a Nurse in Canada", desc: "Real-world insights into the Canadian nursing work environment for IENs.", icon: Heart },
  { slug: "nnas-application-guide", title: "NNAS Application Guide", desc: "Step-by-step guide to the National Nursing Assessment Service process.", icon: ClipboardCheck },
  { slug: "cgfns-certification-guide", title: "CGFNS Certification Guide", desc: "Complete guide to CGFNS certification for nurses heading to the United States.", icon: Award },
  { slug: "nmc-registration-guide-international-nurses", title: "NMC Registration Guide", desc: "How international nurses register with the UK Nursing & Midwifery Council.", icon: Shield },
  { slug: "nursing-recruitment-agencies-guide", title: "Recruitment Agencies Guide", desc: "How to find and evaluate reputable international nursing recruitment agencies.", icon: Building2 },
  { slug: "cultural-adjustment-international-nurses", title: "Cultural Adjustment Guide", desc: "Preparing for cultural differences in healthcare settings abroad.", icon: Users },
  { slug: "international-nurse-interview-tips", title: "Interview Tips for IENs", desc: "Prepare for nursing job interviews in your destination country.", icon: Briefcase },
];

const FAQ_DATA = [
  { question: "Can I practice nursing in another country with my current license?", answer: "No. Each country has its own nursing regulatory body and licensing requirements. You must apply for licensure in your destination country, which typically involves credential evaluation, passing required exams (such as NCLEX-RN, CBT/OSCE, or Prometric), meeting language proficiency requirements, and completing the registration process with the relevant regulatory authority." },
  { question: "What exams do internationally educated nurses need to pass?", answer: "The exams required depend on your destination country. For Canada and the US, you need the NCLEX-RN. For the UK, you need the NMC CBT and OSCE. For Australia, requirements vary by state. For the UAE and Saudi Arabia, you need Prometric exams. Most countries also require English language proficiency tests such as IELTS Academic or OET." },
  { question: "How long does the international nursing licensing process take?", answer: "The timeline varies significantly by country. In general, expect 6-18 months from application to registration. Canada typically takes 8-14 months, the US 6-12 months, the UK 4-8 months, and Gulf countries 2-6 months. Delays can occur with credential evaluation, exam scheduling, and immigration processing." },
  { question: "Do I need to take IELTS or OET?", answer: "Most English-speaking destination countries require proof of English proficiency for nurses whose primary language is not English. IELTS Academic and OET (Occupational English Test) are the most widely accepted. OET is healthcare-specific and often preferred by nursing regulatory bodies. Required scores vary by country — for example, Canada typically requires IELTS 7.0 overall or OET B grade." },
  { question: "What is credential evaluation and why is it required?", answer: "Credential evaluation (also called credential assessment) is the process of having your nursing education and qualifications assessed by an authorized agency to determine if they meet the standards of your destination country. This is required because nursing education standards, curriculum content, and clinical hours vary between countries. Agencies like NNAS (Canada), CGFNS (US), and NMC (UK) perform these evaluations." },
  { question: "Which country is easiest for international nurses to get licensed in?", answer: "There is no single 'easiest' country — it depends on your background, qualifications, and goals. The UAE and Saudi Arabia generally have faster processing times (2-6 months). The UK has a well-structured pathway through the NMC. Canada and the US have rigorous but well-documented processes. Our country comparison pages can help you evaluate which destination best matches your situation." },
  { question: "Can NurseNest help me prepare for licensing exams?", answer: "Yes. NurseNest offers comprehensive exam preparation for NCLEX-RN and REx-PN with 6,000+ lessons, 2,400+ practice questions, adaptive mock exams, clinical simulators, and study tools available in 15 languages. Our platform is specifically designed to support internationally educated nurses preparing for Canadian and American licensure exams." },
  { question: "What documents do I need to apply for nursing licensure abroad?", answer: "Common documents include: nursing degree/diploma transcripts, nursing license from your home country, passport, English proficiency test scores (IELTS/OET), credential evaluation reports, police clearance certificates, professional references, and immunization records. Specific requirements vary by country — check our country-specific guides for detailed document checklists." },
];

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden" data-testid={`faq-item-${index}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
        data-testid={`button-faq-toggle-${index}`}
      >
        <span className="font-medium text-gray-900 pr-4">{question}</span>
        <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180 text-blue-500' : 'text-gray-400'}`} />
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed" data-testid={`text-faq-answer-${index}`}>
          {answer}
        </div>
      )}
    </div>
  );
}

export default function InternationalNursingHub() {
  const { t, language } = useI18n();
  const faqStructuredData = buildFaqStructuredData(FAQ_DATA.map(f => ({ question: f.question, answer: f.answer })));

  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": t("intlNursing.hub.title"),
    "description": t("intlNursing.hub.metaDesc"),
    "author": { "@type": "Organization", "name": "NurseNest", "url": "https://www.nursenest.ca" },
    "publisher": { "@type": "Organization", "name": "NurseNest", "url": "https://www.nursenest.ca" },
    "mainEntityOfPage": "https://www.nursenest.ca/international-nurses",
  };

  return (
    <div data-testid="page-international-nursing-hub">
      <Navigation />
      <SEO
        title={`${t("intlNursing.hub.title")} | NurseNest`}
        description={t("intlNursing.hub.metaDesc")}
        keywords="international nursing, internationally educated nurse, IEN, nursing license transfer, NCLEX international, nursing abroad, nurse migration, nursing credential evaluation, IELTS for nurses, OET for nurses"
        canonicalPath="/international-nurses"
        structuredData={articleStructuredData}
        additionalStructuredData={[faqStructuredData]}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: t("intlNursing.hub.badge"), url: "https://www.nursenest.ca/international-nurses" },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <BreadcrumbNav items={[
          { name: "Home", url: "https://www.nursenest.ca/" },
          { name: t("intlNursing.hub.badge"), url: "https://www.nursenest.ca/international-nurses" },
        ]} />
        <TranslationFallbackNotice />
      </div>

      <section className="relative py-8 sm:py-10 overflow-hidden" data-testid="section-hero">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-blue-50/50 to-white" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-700 mb-4" data-testid="badge-international">
              <Globe className="w-4 h-4" /> {t("intlNursing.hub.badge")}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4" data-testid="text-h1">
              {t("intlNursing.hub.heading")}
            </h1>
            <p className="text-lg text-gray-600 mb-6" data-testid="text-subtitle">
              {t("intlNursing.hub.subtitle")}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/international-nurses/canada" className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-colors shadow-lg shadow-teal-200" data-testid="button-explore-countries">
                {t("intlNursing.hub.ctaExplore")} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/nclex-for-international-nurses" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-teal-700 rounded-xl font-semibold hover:bg-teal-50 transition-colors border border-teal-200" data-testid="button-start-prep">
                {t("intlNursing.hub.ctaPrepare")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white border-y border-gray-100" data-testid="section-who-is-this-for">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">{t("pages.internationalNursingHub.whoIsThisSectionFor")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
              <CheckCircle2 className="w-5 h-5 text-teal-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">{t("pages.internationalNursingHub.internationallyEducatedNurses")}</p>
                <p className="text-sm text-gray-500">{t("pages.internationalNursingHub.seekingLicensureInANew")}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
              <CheckCircle2 className="w-5 h-5 text-teal-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">{t("pages.internationalNursingHub.nursesExploringOpportunities")}</p>
                <p className="text-sm text-gray-500">{t("pages.internationalNursingHub.comparingCountriesAndPathways")}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
              <CheckCircle2 className="w-5 h-5 text-teal-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">{t("pages.internationalNursingHub.nursingStudentsAbroad")}</p>
                <p className="text-sm text-gray-500">{t("pages.internationalNursingHub.planningTheirCareerInternationally")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16" data-testid="section-features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3" data-testid="text-features-h2">{t("pages.internationalNursingHub.howNursenestHelpsInternationalNurses")}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{t("pages.internationalNursingHub.everythingYouNeedToNavigate")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(f => (
              <Link key={f.title} href={f.link} className="group" data-testid={`card-feature-${f.title.toLowerCase().replace(/\s+/g, '-')}`}>
                <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-teal-200 transition-all h-full">
                  <f.icon className="w-7 h-7 text-teal-500 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-teal-700 transition-colors">{f.title}</h3>
                  <p className="text-sm text-gray-500">{f.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50" data-testid="section-countries">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3" data-testid="text-countries-h2">{t("intlNursing.hub.sectionCountries")}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{t("intlNursing.hub.sectionCountriesDesc")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {COUNTRIES.map(c => {
              const countryKey = c.slug.replace(/-([a-z])/g, (_, l) => l.toUpperCase()) as string;
              const countryName = t(`intlNursing.countries.${countryKey}`) !== `intlNursing.countries.${countryKey}` ? t(`intlNursing.countries.${countryKey}`) : c.name;
              return (
                <Link key={c.slug} href={`/international-nurses/${c.slug}`} className="group" data-testid={`card-country-${c.slug}`}>
                  <div className={`rounded-xl border p-5 hover:shadow-md transition-all h-full ${c.color}`}>
                    <div className="text-3xl mb-3">{c.flag}</div>
                    <h3 className="font-semibold text-gray-900 mb-1">{countryName}</h3>
                    <p className="text-sm text-gray-600 mb-1">{t("intlNursing.hub.exam")}: {c.exam}</p>
                    <p className="text-xs text-gray-500 mb-3">{t("intlNursing.hub.regBody")}: {c.regBody}</p>
                    <span className="inline-flex items-center gap-1 text-sm text-teal-600 font-medium group-hover:gap-2 transition-all">
                      {t("intlNursing.hub.viewGuide")} <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16" data-testid="section-migration">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3" data-testid="text-migration-h2">{t("intlNursing.hub.sectionMigration")}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{t("intlNursing.hub.sectionMigrationDesc")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {MIGRATION_PATHS.map(m => (
              <Link key={m.slug} href={`/${m.slug}`} className="group" data-testid={`card-migration-${m.slug}`}>
                <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-teal-200 transition-all h-full">
                  <div className="text-lg mb-2">{m.flag}</div>
                  <h3 className="font-semibold text-gray-900 text-sm">{m.from} → {m.to}</h3>
                  <span className="inline-flex items-center gap-1 text-xs text-teal-600 font-medium mt-2">
                    {t("intlNursing.hub.viewGuide")} <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50" data-testid="section-exams">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3" data-testid="text-exams-h2">{t("intlNursing.hub.sectionExams")}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{t("intlNursing.hub.sectionExamsDesc")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {EXAM_PAGES.map(e => (
              <Link key={e.slug} href={`/${e.slug}`} className="group" data-testid={`card-exam-${e.slug}`}>
                <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-teal-200 transition-all h-full">
                  <GraduationCap className="w-6 h-6 text-teal-500 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-teal-700 transition-colors">{e.title}</h3>
                  <p className="text-sm text-gray-500">{e.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16" data-testid="section-comparisons">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3" data-testid="text-comparisons-h2">{t("intlNursing.hub.sectionComparisons")}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{t("intlNursing.hub.sectionComparisonsDesc")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {COMPARISON_PAGES.map(cp => (
              <Link key={cp.slug} href={`/${cp.slug}`} className="group" data-testid={`card-compare-${cp.slug}`}>
                <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md hover:border-teal-200 transition-all h-full text-center">
                  <Scale className="w-8 h-8 text-teal-500 mx-auto mb-3" />
                  <h3 className="font-bold text-gray-900 mb-2 group-hover:text-teal-700 transition-colors">{cp.title}</h3>
                  <p className="text-sm text-gray-500">{cp.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16" data-testid="section-supporting-guides">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3" data-testid="text-guides-h2">{t("pages.internationalNursingHub.supportingGuidesResources")}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{t("pages.internationalNursingHub.indepthArticlesOnEveryAspect")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CONTENT_PAGES.map(cp => (
              <Link key={cp.slug} href={`/${cp.slug}`} className="group" data-testid={`card-content-${cp.slug}`}>
                <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-teal-200 transition-all h-full">
                  <cp.icon className="w-6 h-6 text-teal-500 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-teal-700 transition-colors text-sm">{cp.title}</h3>
                  <p className="text-xs text-gray-500">{cp.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-blue-50" data-testid="section-tools">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700 mb-4">
            <Wrench className="w-4 h-4" /> Interactive Tools
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3" data-testid="text-tools-h2">{t("pages.internationalNursingHub.compareCheckPlan")}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">{t("pages.internationalNursingHub.useOurInteractiveToolsTo")}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl p-5 border border-blue-200">
              <BarChart3 className="w-7 h-7 text-blue-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1 text-sm">{t("pages.internationalNursingHub.countryComparison")}</h3>
              <p className="text-xs text-gray-500">{t("pages.internationalNursingHub.compareRequirementsSideBySide")}</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-blue-200">
              <ClipboardCheck className="w-7 h-7 text-green-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1 text-sm">{t("pages.internationalNursingHub.licensingChecklist")}</h3>
              <p className="text-xs text-gray-500">{t("pages.internationalNursingHub.trackYourLicensingProgress")}</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-blue-200">
              <CheckCircle2 className="w-7 h-7 text-purple-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1 text-sm">{t("pages.internationalNursingHub.readinessAssessment")}</h3>
              <p className="text-xs text-gray-500">{t("pages.internationalNursingHub.checkIfYoureReadyTo")}</p>
            </div>
          </div>
          <Link href="/international-nurses/tools" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200" data-testid="button-explore-tools">
            Explore Interactive Tools <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-teal-50/50 to-white" data-testid="section-common-mistakes">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{t("pages.internationalNursingHub.commonMistakesToAvoid")}</h2>
            <p className="text-gray-600">{t("pages.internationalNursingHub.internationalNursesFrequentlyEncounterThese")}</p>
          </div>
          <div className="space-y-4">
            {[
              { title: "Starting the process without credential evaluation", desc: "Many nurses begin studying for exams before checking if their credentials are recognized. Always start with credential evaluation — it determines your eligibility and may reveal gaps you need to address." },
              { title: "Underestimating language test requirements", desc: "IELTS and OET scores are time-sensitive (usually valid for 2 years) and require significant preparation. Many nurses need 2-3 attempts to reach the required scores. Start language prep early." },
              { title: "Applying to the wrong regulatory body", desc: "Each country (and sometimes each province/state) has its own nursing regulatory body. Research the specific requirements for your intended destination before applying." },
              { title: "Not budgeting for the full process", desc: "The licensing process involves multiple fees — credential evaluation, exam registration, language tests, immigration applications, and more. Budget $3,000-$10,000+ depending on your destination." },
              { title: "Ignoring bridging programs", desc: "Some countries offer bridging programs that can fast-track your registration. These are especially valuable if your credential evaluation identifies gaps in your education." },
            ].map((mistake, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 flex gap-4" data-testid={`card-mistake-${i}`}>
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm">{i + 1}</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{mistake.title}</h3>
                  <p className="text-sm text-gray-500">{mistake.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-teal-600" data-testid="section-cta">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">{t("intlNursing.hub.whyNurseNest")}</h2>
          <p className="text-teal-100 mb-8 max-w-2xl mx-auto">{t("intlNursing.hub.subtitle")}</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/international-nurses/canada" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-teal-700 rounded-xl font-semibold hover:bg-teal-50 transition-colors" data-testid="button-cta-guides">
              {t("intlNursing.hub.ctaExplore")} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/mock-exams" className="inline-flex items-center gap-2 px-6 py-3 bg-teal-700 text-white rounded-xl font-semibold hover:bg-teal-800 transition-colors border border-teal-500" data-testid="button-cta-prep">
              {t("intlNursing.hub.ctaPrepare")}
            </Link>
            <Link href="/applynest" className="inline-flex items-center gap-2 px-6 py-3 bg-teal-700 text-white rounded-xl font-semibold hover:bg-teal-800 transition-colors border border-teal-500" data-testid="button-cta-jobs">
              {t("intlNursing.hub.startFree")}
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16" data-testid="section-faq">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3" data-testid="text-faq-h2">{t("intlNursing.hub.faqTitle")}</h2>
            <p className="text-gray-600">{t("intlNursing.hub.sectionResourcesDesc")}</p>
          </div>
          <div className="space-y-3">
            {FAQ_DATA.map((faq, i) => (
              <FAQItem key={i} question={faq.question} answer={faq.answer} index={i} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
