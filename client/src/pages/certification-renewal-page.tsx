import { Link, useLocation } from "wouter";
import { SEO } from "@/components/seo";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { CERT_RENEWAL_CONTENT } from "@/data/certification-prep-content";
import { useI18n } from "@/lib/i18n";
import {
  ArrowRight, ChevronRight, GraduationCap, RefreshCw,
  AlertTriangle, BookOpen, CheckCircle2, Play, Layers,
  ClipboardList, ArrowLeft, XCircle
} from "lucide-react";

const COLOR_MAP: Record<string, { bg: string; iconColor: string; border: string; gradientFrom: string; gradientTo: string; badgeBg: string; badgeText: string; btnBg: string; btnHover: string }> = {
  red: { bg: "bg-red-50", iconColor: "text-red-600", border: "border-red-100", gradientFrom: "from-red-50", gradientTo: "to-red-100/30", badgeBg: "bg-red-100", badgeText: "text-red-700", btnBg: "bg-red-600", btnHover: "hover:bg-red-700" },
  blue: { bg: "bg-blue-50", iconColor: "text-blue-600", border: "border-blue-100", gradientFrom: "from-blue-50", gradientTo: "to-blue-100/30", badgeBg: "bg-blue-100", badgeText: "text-blue-700", btnBg: "bg-blue-600", btnHover: "hover:bg-blue-700" },
  sky: { bg: "bg-sky-50", iconColor: "text-sky-600", border: "border-sky-100", gradientFrom: "from-sky-50", gradientTo: "to-sky-100/30", badgeBg: "bg-sky-100", badgeText: "text-sky-700", btnBg: "bg-sky-600", btnHover: "hover:bg-sky-700" },
  orange: { bg: "bg-orange-50", iconColor: "text-orange-600", border: "border-orange-100", gradientFrom: "from-orange-50", gradientTo: "to-orange-100/30", badgeBg: "bg-orange-100", badgeText: "text-orange-700", btnBg: "bg-orange-600", btnHover: "hover:bg-orange-700" },
  pink: { bg: "bg-pink-50", iconColor: "text-pink-600", border: "border-pink-100", gradientFrom: "from-pink-50", gradientTo: "to-pink-100/30", badgeBg: "bg-pink-100", badgeText: "text-pink-700", btnBg: "bg-pink-600", btnHover: "hover:bg-pink-700" },
  violet: { bg: "bg-violet-50", iconColor: "text-violet-600", border: "border-violet-100", gradientFrom: "from-violet-50", gradientTo: "to-violet-100/30", badgeBg: "bg-violet-100", badgeText: "text-violet-700", btnBg: "bg-violet-600", btnHover: "hover:bg-violet-700" },
};

function extractCertSlug(pathname: string): string {

  const match = pathname.match(/\/certifications\/([a-z]+)-renewal-prep/);
  return match ? match[1] : "";
}

export default function CertificationRenewalPage() {
  const [location] = useLocation();
  const certSlug = extractCertSlug(location);
  const content = CERT_RENEWAL_CONTENT[certSlug];

  if (!content) {
    return (
      <div data-testid="page-cert-renewal-not-found">
        <Navigation />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md px-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-4" data-testid="text-not-found">{t("pages.certificationRenewalPage.renewalPrepNotFound")}</h1>
            <p className="text-gray-600 mb-6">{t("pages.certificationRenewalPage.theRenewalPrepPageYou")}</p>
            <Link href="/nursing-certifications" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors" data-testid="link-back-to-certs">
              Back to Certifications <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const colors = COLOR_MAP[content.color] || COLOR_MAP.blue;

  return (
    <div data-testid={`page-cert-renewal-${certSlug}`}>
      <Navigation />
      <SEO
        title={content.seo.title}
        description={content.seo.description}
        keywords={content.seo.keywords}
        canonicalPath={`/certifications/${certSlug}-renewal-prep`}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "Nursing Certifications", url: "https://www.nursenest.ca/nursing-certifications" },
          { name: `${content.certName} Prep`, url: `https://www.nursenest.ca/certifications/${certSlug}-prep` },
          { name: `${content.certName} Renewal`, url: `https://www.nursenest.ca/certifications/${certSlug}-renewal-prep` },
        ]}
      />

      <section className="relative py-16 sm:py-20 overflow-hidden" data-testid="section-hero">
        <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradientFrom} via-white/50 ${colors.gradientTo}`} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6" data-testid="breadcrumb-nav">
            <Link href="/" className="hover:text-blue-600">{t("pages.certificationRenewalPage.home")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/nursing-certifications" className="hover:text-blue-600">{t("pages.certificationRenewalPage.certifications")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href={`/certifications/${certSlug}-prep`} className="hover:text-blue-600">{content.certName} Prep</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className={`${colors.badgeText} font-medium`}>{t("pages.certificationRenewalPage.renewal")}</span>
          </div>
          <div className="max-w-3xl">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${colors.badgeBg} ${colors.badgeText} mb-4`} data-testid="badge-renewal">
              <RefreshCw className="w-4 h-4" /> Renewal Prep
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4" data-testid="text-page-title">
              {content.heroTitle}
            </h1>
            <p className="text-lg text-gray-600 mb-8" data-testid="text-page-subtitle">
              {content.heroSubtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/free-practice" className={`inline-flex items-center gap-2 px-6 py-3 ${colors.btnBg} text-white rounded-xl font-semibold ${colors.btnHover} transition-colors shadow-lg`} data-testid="button-renewal-practice">
                Renewal Practice Questions <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href={`/certifications/${certSlug}-prep`} className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors border border-gray-200" data-testid="button-full-prep">
                <ArrowLeft className="w-4 h-4" /> Full Prep Guide
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white" data-testid="section-renewal-overview">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`bg-gradient-to-br ${colors.gradientFrom} to-white rounded-2xl border ${colors.border} p-8`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center`}>
                <GraduationCap className={`w-5 h-5 ${colors.iconColor}`} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900" data-testid="text-renewal-overview-heading">{t("pages.certificationRenewalPage.renewalExamExpectations")}</h2>
            </div>
            <p className="text-gray-600 mb-4" data-testid="text-validity">
              <strong>{t("pages.certificationRenewalPage.certificationValidity")}</strong> {content.renewalOverview.validityPeriod}
            </p>
            <p className="text-gray-600 mb-4" data-testid="text-what-to-expect">{content.renewalOverview.whatToExpect}</p>
            <div className="mt-4">
              <h3 className="font-semibold text-gray-900 mb-2">{t("pages.certificationRenewalPage.renewalRequirements")}</h3>
              <ul className="space-y-2">
                {content.renewalOverview.renewalRequirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600" data-testid={`text-req-${i}`}>
                    <CheckCircle2 className={`w-4 h-4 ${colors.iconColor} mt-0.5 flex-shrink-0`} />
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50" data-testid="section-skills-refreshers">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-3" data-testid="text-refreshers-heading">{t("pages.certificationRenewalPage.skillsRefreshers")}</h2>
            <p className="text-gray-600">Review the essential skills tested on the {content.certName} renewal.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {content.skillsRefreshers.map((skill, i) => (
              <div key={i} className={`bg-white rounded-xl border ${colors.border} p-5`} data-testid={`card-refresher-${i}`}>
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg ${colors.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <BookOpen className={`w-4 h-4 ${colors.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm">{skill.title}</h3>
                    <p className="text-xs text-gray-500">{skill.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white" data-testid="section-algorithm-reviews">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-3" data-testid="text-algorithms-heading">{t("pages.certificationRenewalPage.algorithmProtocolReviews")}</h2>
            <p className="text-gray-600">Refresh your knowledge of key {content.certName} algorithms.</p>
          </div>
          <div className="space-y-4">
            {content.algorithmReviews.map((algo, i) => (
              <div key={i} className={`bg-white rounded-xl border ${colors.border} p-6`} data-testid={`card-algorithm-${i}`}>
                <h3 className="font-semibold text-gray-900 mb-3">{algo.title}</h3>
                <ol className="space-y-2">
                  {algo.steps.map((step, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm text-gray-600">
                      <span className={`w-6 h-6 rounded-full ${colors.bg} ${colors.iconColor} flex items-center justify-center flex-shrink-0 text-xs font-bold`}>{j + 1}</span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50" data-testid="section-common-mistakes">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-3" data-testid="text-mistakes-heading">{t("pages.certificationRenewalPage.commonExamMistakes")}</h2>
            <p className="text-gray-600">Avoid these frequent errors on the {content.certName} renewal exam.</p>
          </div>
          <div className="space-y-3">
            {content.commonMistakes.map((item, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-5" data-testid={`card-mistake-${i}`}>
                <div className="flex items-start gap-3 mb-2">
                  <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-700 font-medium">{item.mistake}</p>
                </div>
                <div className="flex items-start gap-3 ml-0">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-green-700">{item.correction}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white" data-testid="section-mock-exam">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-3" data-testid="text-mock-heading">{t("pages.certificationRenewalPage.shortRenewalMockExam")}</h2>
            <p className="text-gray-600">{t("pages.certificationRenewalPage.testYourReadinessWithA")}</p>
          </div>
          <div className={`bg-white rounded-xl border ${colors.border} p-6 max-w-lg mx-auto text-center`} data-testid="card-mock-exam">
            <div className={`w-14 h-14 rounded-xl ${colors.bg} flex items-center justify-center mx-auto mb-4`}>
              <Play className={`w-7 h-7 ${colors.iconColor}`} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{content.mockExam.title}</h3>
            <p className="text-sm text-gray-500 mb-4">{content.mockExam.description}</p>
            <div className="flex items-center justify-center gap-4 text-xs text-gray-400 mb-4">
              <span>{content.mockExam.questionCount} questions</span>
              <span>{content.mockExam.timeMinutes} minutes</span>
            </div>
            <Link href="/free-practice" className={`inline-flex items-center gap-2 px-6 py-3 ${colors.btnBg} text-white rounded-xl font-semibold ${colors.btnHover} transition-colors`} data-testid="button-start-mock">
              Start Mock Exam <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50" data-testid="section-condensed-resources">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-3" data-testid="text-resources-heading">{t("pages.certificationRenewalPage.condensedStudyResources")}</h2>
            <p className="text-gray-600">{t("pages.certificationRenewalPage.quickreviewMaterialsForEfficientRenewal")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {content.condensedResources.map((resource, i) => (
              <Link key={i} href={resource.type === "flashcards" ? "/flashcards" : resource.type === "lessons" ? "/lessons" : "/free-practice"} className="group" data-testid={`card-resource-${i}`}>
                <div className={`bg-white rounded-xl border ${colors.border} p-5 hover:shadow-md transition-all h-full`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg ${colors.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      {resource.type === "flashcards" ? <Layers className={`w-4 h-4 ${colors.iconColor}`} /> :
                       resource.type === "lessons" ? <BookOpen className={`w-4 h-4 ${colors.iconColor}`} /> :
                       <ClipboardList className={`w-4 h-4 ${colors.iconColor}`} />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1 text-sm group-hover:text-blue-700 transition-colors">{resource.title}</h3>
                      <p className="text-xs text-gray-500">{resource.description}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-blue-600 to-indigo-700" data-testid="section-cta">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4" data-testid="text-cta-heading">
            Renew Your {content.certName} With Confidence
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Practice questions, algorithm reviews, and quick refreshers to ace your {content.certName} renewal.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/pricing" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-blue-700 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg" data-testid="button-cta-pricing">
              View Plans <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href={`/certifications/${certSlug}-prep`} className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-400 transition-colors border border-blue-400" data-testid="button-cta-full-prep">
              Full Prep Guide
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white" data-testid="section-cross-links">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2" data-testid="text-cross-heading">{t("pages.certificationRenewalPage.otherRenewalPrepGuides")}</h2>
            <Link href="/nursing-certifications" className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors" data-testid="link-back-to-hub">
              ← Back to Certification Hub
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {["bls", "acls", "pals", "nrp", "tncc", "enpc"].filter(s => s !== certSlug).map(slug => {
              const rel = CERT_RENEWAL_CONTENT[slug];
              if (!rel) return null;
              return (
                <Link key={slug} href={`/certifications/${slug}-renewal-prep`} className="group" data-testid={`link-related-${slug}`}>
                  <div className="bg-gray-50 rounded-xl p-4 hover:bg-blue-50 transition-colors text-center h-full">
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors text-sm">{rel.certName}</h3>
                    <p className="text-xs text-gray-500 mt-1">{t("pages.certificationRenewalPage.renewalPrep")}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
