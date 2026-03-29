import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { LocaleLink } from "@/lib/LocaleLink";
import { useI18n } from "@/lib/i18n";
import { LICENSING_EXAMS } from "@/data/licensing-exams-data";
import { buildFaqStructuredData } from "@/lib/structured-data";
import {
  GraduationCap, ChevronRight, ArrowRight, Globe, FileText,
  Clock, MapPin, BookOpen, HelpCircle, ChevronDown,
} from "lucide-react";
import { useState } from "react";

const HUB_FAQS = [
  { question: "What nursing licensing exam do I need?", answer: "The exam you need depends on the country where you want to practice. In the US, you need the NCLEX. In Canada, RPNs take the REx-PN and RNs take the NCLEX-RN. In the UK, international nurses take the NMC CBT. In Australia, international nurses are assessed through AHPRA. In the Middle East, each country has its own Prometric exam." },
  { question: "Do I need an English language test to practice nursing abroad?", answer: "Most English-speaking countries require internationally educated nurses to demonstrate English proficiency through IELTS Academic (typically 7.0 overall) or OET (grade B). Requirements vary by country and regulatory body." },
  { question: "Can I transfer my nursing license between countries?", answer: "Generally, nursing licenses are not directly transferable. Each country has its own licensing process that may require credential evaluation, additional exams, language testing, and sometimes bridging programs. Some mutual recognition agreements exist between certain countries." },
  { question: "How long does it take to get a nursing license in another country?", answer: "The timeline varies significantly. In the US, the NCLEX process can take 2–6 months. UK NMC registration typically takes 4–12 months. Australian AHPRA registration can take 3–6 months. Factor in exam preparation, credential evaluation, and visa processing times." },
];

export default function NursingLicensingExamsHub() {
  const { t } = useI18n();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqStructuredData = buildFaqStructuredData(HUB_FAQS);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Global Nursing Licensing Exam Database",
    description: "Comprehensive database of nursing licensing examinations worldwide including NCLEX, REx-PN, NMC CBT, AHPRA, Prometric, IELTS, and OET.",
    author: { "@type": "Organization", name: "NurseNest", url: "https://www.nursenest.ca" },
    publisher: { "@type": "Organization", name: "NurseNest", url: "https://www.nursenest.ca" },
    mainEntityOfPage: { "@type": "WebPage", "@id": "https://www.nursenest.ca/nursing-licensing-exams" },
  };

  return (
    <div data-testid="nursing-licensing-exams-hub">
      <Navigation />
      <SEO
        title={t("licensingExams.hub.seoTitle")}
        description={t("licensingExams.hub.seoDescription")}
        keywords="nursing licensing exams, NCLEX, REx-PN, NMC CBT, AHPRA, Prometric nursing, IELTS for nurses, OET for nurses, nursing license requirements, international nursing exams"
        canonicalPath="/nursing-licensing-exams"
        ogType="article"
        structuredData={articleSchema}
        additionalStructuredData={[faqStructuredData]}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "Nursing Licensing Exams", url: "https://www.nursenest.ca/nursing-licensing-exams" },
        ]}
      />

      <section className="relative py-16 sm:py-20 overflow-hidden" data-testid="section-hero">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2E3A59] to-[#3d4d73]" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-6" data-testid="breadcrumb-nav">
            <LocaleLink href="/" className="hover:text-white/80">{t("pages.nursingLicensingExamsHub.home")}</LocaleLink>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/90">{t("licensingExams.hub.title")}</span>
          </nav>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4 bg-[#BFA6F6]/20 text-[#BFA6F6]">
            <GraduationCap className="w-4 h-4" /> {t("licensingExams.hub.badge")}
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight" data-testid="text-title">
            {t("licensingExams.hub.title")}
          </h1>
          <p className="text-lg text-white/80 max-w-3xl leading-relaxed" data-testid="text-description">
            {t("licensingExams.hub.description")}
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16" data-testid="section-exams-grid">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t("licensingExams.hub.exploreTitle")}</h2>
          <p className="text-gray-600 mb-8">{t("licensingExams.hub.exploreDescription")}</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {LICENSING_EXAMS.map((exam) => (
              <LocaleLink
                key={exam.slug}
                href={`/nursing-licensing-exams/${exam.slug}`}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:border-[#BFA6F6]/40 hover:shadow-md transition-all group"
                data-testid={`card-exam-${exam.slug}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-[#2E3A59] text-lg group-hover:text-[#BFA6F6] transition-colors" data-testid={`text-exam-name-${exam.slug}`}>
                      {exam.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5">{exam.fullName}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-[#BFA6F6] transition-colors mt-1 shrink-0" />
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{exam.countries.join(", ")}</span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">{exam.whoIsItFor.slice(0, 120)}...</p>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                    <FileText className="w-3 h-3" /> {exam.examFormat.split(" ").slice(0, 3).join(" ")}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                    <Clock className="w-3 h-3" /> {exam.timeLimit}
                  </span>
                </div>
              </LocaleLink>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50" data-testid="section-how-it-works">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("licensingExams.hub.howToChooseTitle")}</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <div className="w-10 h-10 rounded-lg bg-[#BFA6F6]/10 flex items-center justify-center mb-3">
                <Globe className="w-5 h-5 text-[#BFA6F6]" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{t("licensingExams.hub.step1Title")}</h3>
              <p className="text-sm text-gray-600">{t("licensingExams.hub.step1Desc")}</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <div className="w-10 h-10 rounded-lg bg-[#BFA6F6]/10 flex items-center justify-center mb-3">
                <FileText className="w-5 h-5 text-[#BFA6F6]" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{t("licensingExams.hub.step2Title")}</h3>
              <p className="text-sm text-gray-600">{t("licensingExams.hub.step2Desc")}</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <div className="w-10 h-10 rounded-lg bg-[#BFA6F6]/10 flex items-center justify-center mb-3">
                <BookOpen className="w-5 h-5 text-[#BFA6F6]" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{t("licensingExams.hub.step3Title")}</h3>
              <p className="text-sm text-gray-600">{t("licensingExams.hub.step3Desc")}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12" data-testid="section-faq">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-sky-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{t("licensingExams.hub.faqTitle")}</h2>
          </div>
          <div className="space-y-3">
            {HUB_FAQS.map((faq, i) => (
              <div key={i} className="border border-gray-200 rounded-lg overflow-hidden" data-testid={`faq-item-${i}`}>
                <button
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  data-testid={`faq-toggle-${i}`}
                >
                  <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-gray-600 leading-relaxed border-t border-gray-100 pt-3" data-testid={`faq-answer-${i}`}>
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gradient-to-r from-[#BFA6F6]/10 to-[#BFA6F6]/5" data-testid="section-cta">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-[#2E3A59] mb-3">{t("licensingExams.hub.ctaTitle")}</h2>
          <p className="text-gray-600 mb-6 max-w-lg mx-auto">{t("licensingExams.hub.ctaDescription")}</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <LocaleLink
              href="/question-bank"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#BFA6F6] text-white rounded-lg font-semibold hover:bg-[#a88de8] transition-colors"
              data-testid="link-question-bank"
            >
              Practice Questions <ArrowRight className="w-4 h-4" />
            </LocaleLink>
            <LocaleLink
              href="/mock-exams"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#2E3A59] border border-gray-200 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              data-testid="link-mock-exams"
            >
              Mock Exams
            </LocaleLink>
            <LocaleLink
              href="/international-nurses"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#2E3A59] border border-gray-200 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              data-testid="link-international"
            >
              International Nurses Hub
            </LocaleLink>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
