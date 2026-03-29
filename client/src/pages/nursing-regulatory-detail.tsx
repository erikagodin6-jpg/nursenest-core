import { Link, useParams } from "wouter";
import { SEO } from "@/components/seo";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { useI18n } from "@/lib/i18n";
import { buildFaqStructuredData } from "@/lib/structured-data";
import { REGULATORY_BODIES } from "@/data/nursing-regulatory-data";
import { Shield, ChevronRight, ExternalLink, CheckCircle2, BookOpen, Award, FileText, GraduationCap, Globe } from "lucide-react";

export default function NursingRegulatoryDetail() {
  const { t } = useI18n();
  const params = useParams<{ slug: string }>();
  const body = REGULATORY_BODIES.find(b => b.slug === params.slug);

  if (!body) {
    return (
      <div data-testid="page-regulatory-not-found">
        <Navigation />
        <div className="max-w-3xl mx-auto px-4 py-24 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{t("pages.nursingRegulatoryDetail.regulatoryBodyNotFound")}</h1>
          <p className="text-gray-600 mb-6">{t("pages.nursingRegulatoryDetail.theRegulatoryBodyPageYoure")}</p>
          <Link href="/nursing-regulatory-bodies" className="text-purple-600 font-medium hover:text-purple-700">
            Back to Regulatory Bodies Directory
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const faqStructuredData = buildFaqStructuredData(body.faq);
  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": body.metaTitle,
    "description": body.metaDescription,
    "url": `https://www.nursenest.ca/nursing-regulatory-bodies/${body.slug}`,
    "publisher": { "@type": "Organization", "name": "NurseNest", "url": "https://www.nursenest.ca" },
  };

  return (
    <div data-testid={`page-regulatory-${body.slug}`}>
      <Navigation />
      <SEO
        title={body.metaTitle}
        description={body.metaDescription}
        keywords={body.metaKeywords}
        canonicalPath={`/nursing-regulatory-bodies/${body.slug}`}
        structuredData={articleStructuredData}
        additionalStructuredData={[faqStructuredData]}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "Nursing Regulatory Bodies", url: "https://www.nursenest.ca/nursing-regulatory-bodies" },
          { name: body.shortName, url: `https://www.nursenest.ca/nursing-regulatory-bodies/${body.slug}` },
        ]}
      />

      <section className="relative py-16 sm:py-20 overflow-hidden" data-testid="section-hero">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-violet-50/50 to-indigo-50/30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-purple-600">{t("pages.nursingRegulatoryDetail.home")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/nursing-regulatory-bodies" className="hover:text-purple-600">{t("pages.nursingRegulatoryDetail.regulatoryBodies")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-purple-700 font-medium">{body.shortName}</span>
          </div>
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">{body.flag}</span>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900" data-testid="text-h1">{body.name}</h1>
                <p className="text-sm text-gray-500 mt-1">{body.country}</p>
              </div>
            </div>
            <p className="text-lg text-gray-600 leading-relaxed" data-testid="text-subtitle">{body.overview}</p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white border-b border-gray-100" data-testid="section-authority">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-xl font-bold text-gray-900 mb-3">{t("pages.nursingRegulatoryDetail.licensingAuthority")}</h2>
          <p className="text-gray-600 leading-relaxed">{body.licensingAuthority}</p>
          <a href={body.websiteUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-4 text-purple-600 font-medium hover:text-purple-700" data-testid="link-website">
            Visit Official Website <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </section>

      <section className="py-16" data-testid="section-registration">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("pages.nursingRegulatoryDetail.registrationRequirements")}</h2>
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <ul className="space-y-3">
              {body.registrationRequirements.map((req, i) => (
                <li key={i} className="flex items-start gap-3" data-testid={`req-${i}`}>
                  <CheckCircle2 className="w-5 h-5 text-purple-500 mt-0.5 shrink-0" />
                  <span className="text-gray-700">{req}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50" data-testid="section-exams">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("pages.nursingRegulatoryDetail.examRequirements")}</h2>
          <div className="space-y-3">
            {body.examRequirements.map((exam, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 flex items-start gap-3" data-testid={`exam-${i}`}>
                <FileText className="w-5 h-5 text-purple-500 mt-0.5 shrink-0" />
                <span className="text-gray-700">{exam}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 p-5 bg-blue-50 rounded-xl border border-blue-100">
            <h3 className="font-semibold text-blue-900 mb-2 text-sm">{t("pages.nursingRegulatoryDetail.prepareWithNursenest")}</h3>
            <p className="text-sm text-blue-700 mb-3">{t("pages.nursingRegulatoryDetail.nursenestOffersComprehensiveExamPrep")}</p>
            <Link href="/exam-prep" className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700" data-testid="link-exam-prep-cta">
              Explore Exam Prep <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16" data-testid="section-credential-recognition">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("pages.nursingRegulatoryDetail.credentialRecognition")}</h2>
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <Globe className="w-8 h-8 text-purple-500 mb-3" />
            <p className="text-gray-600 leading-relaxed">{body.credentialRecognition}</p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50" data-testid="section-details">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("pages.nursingRegulatoryDetail.keyInformation")}</h2>
          <div className="space-y-6">
            {body.sections.map((section, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-6" data-testid={`section-detail-${i}`}>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{section.title}</h3>
                <p className="text-gray-600 leading-relaxed">{section.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-purple-50/30" data-testid="section-cross-links">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{t("pages.nursingRegulatoryDetail.relatedResources")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/exam-prep" className="group" data-testid="link-exam-prep">
              <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-blue-200 transition-all h-full">
                <BookOpen className="w-6 h-6 text-blue-500 mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-700 text-sm">{t("pages.nursingRegulatoryDetail.examPrep")}</h3>
                <p className="text-xs text-gray-500">{t("pages.nursingRegulatoryDetail.adaptivePracticeForNclexRexpn")}</p>
              </div>
            </Link>
            <Link href="/nursing-schools" className="group" data-testid="link-schools">
              <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-emerald-200 transition-all h-full">
                <GraduationCap className="w-6 h-6 text-emerald-500 mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-emerald-700 text-sm">{t("pages.nursingRegulatoryDetail.nursingSchools")}</h3>
                <p className="text-xs text-gray-500">{t("pages.nursingRegulatoryDetail.findAccreditedNursingProgramsWorldwide")}</p>
              </div>
            </Link>
            <Link href="/applynest" className="group" data-testid="link-applynest">
              <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-teal-200 transition-all h-full">
                <Award className="w-6 h-6 text-teal-500 mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-teal-700 text-sm">{t("pages.nursingRegulatoryDetail.careerTools")}</h3>
                <p className="text-xs text-gray-500">{t("pages.nursingRegulatoryDetail.resumeTemplatesAndJobSearch")}</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16" data-testid="section-faq">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">{t("pages.nursingRegulatoryDetail.frequentlyAskedQuestions")}</h2>
          <div className="space-y-4">
            {body.faq.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-6" data-testid={`card-faq-${i}`}>
                <h3 className="font-semibold text-gray-900 text-sm mb-2">{faq.question}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-white" data-testid="section-other-bodies">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">{t("pages.nursingRegulatoryDetail.exploreOtherRegulatoryBodies")}</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {REGULATORY_BODIES.filter(b => b.slug !== body.slug).map(b => (
              <Link key={b.slug} href={`/nursing-regulatory-bodies/${b.slug}`} className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-purple-50 rounded-lg border border-gray-200 hover:border-purple-200 transition-all text-sm font-medium text-gray-700 hover:text-purple-700" data-testid={`link-body-${b.slug}`}>
                <span>{b.flag}</span> {b.shortName}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
