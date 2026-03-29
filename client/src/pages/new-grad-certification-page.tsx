import { useParams, Link } from "wouter";
import { SEO } from "@/components/seo";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { getSpecialtyBySlug, SPECIALTY_CONFIGS, type SpecialtyConfig } from "@/data/specialty-hub-data";
import { useI18n } from "@/lib/i18n";
import {
  ArrowRight, BookOpen, ChevronRight, Check, GraduationCap,
  ClipboardList, Layers, Award
} from "lucide-react";

const SLUG_TO_SPECIALTY: Record<string, string> = {
  "nicu": "nicu",
  "picu": "pediatric-icu",
  "emergency-nursing": "emergency-nursing-specialty",
  "oncology-nursing": "oncology-nursing-specialty",
  "perioperative-nursing": "perioperative-nursing-specialty",
  "critical-care-nursing": "critical-care-specialty",
};

function CertificationNotFound() {
  const { t } = useI18n();
  return (
    <div data-testid="page-certification-not-found">
      <Navigation />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-4" data-testid="text-not-found">{t("pages.newGradCertificationPage.certificationNotFound")}</h1>
          <p className="text-gray-600 mb-6">{t("pages.newGradCertificationPage.theCertificationPageYouAre")}</p>
          <Link href="/new-grad" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors" data-testid="link-back-to-new-grad">
            Back to New Grad Hub <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function CertificationContent({ specialty, certSlug }: { specialty: SpecialtyConfig; certSlug: string }) {
  const Icon = specialty.icon;

  const relatedSpecialties = SPECIALTY_CONFIGS.filter(s =>
    specialty.relatedSpecialties.includes(s.slug)
  );

  return (
    <div data-testid={`page-newgrad-cert-${certSlug}`}>
      <Navigation />
      <SEO
        title={`${specialty.name} Certification Guide for New Grads | NurseNest`}
        description={`New graduate guide to ${specialty.name.toLowerCase()} certification. ${specialty.description}`}
        keywords={`new grad ${specialty.name.toLowerCase()}, ${specialty.certifications.join(", ").toLowerCase()}, new graduate nurse certification, ${certSlug}`}
        canonicalPath={`/new-grad/certifications/${certSlug}`}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "New Grad Hub", url: "https://www.nursenest.ca/new-grad" },
          { name: `${specialty.name} Certification`, url: `https://www.nursenest.ca/new-grad/certifications/${certSlug}` },
        ]}
      />

      <section className={`relative py-16 sm:py-20 overflow-hidden`} data-testid="section-hero">
        <div className={`absolute inset-0 bg-gradient-to-br ${specialty.gradientFrom} via-white/50 ${specialty.gradientTo}`} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6" data-testid="nav-breadcrumb">
            <Link href="/" className="hover:text-blue-600">{t("pages.newGradCertificationPage.home")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/new-grad" className="hover:text-blue-600">{t("pages.newGradCertificationPage.newGradHub")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-blue-700 font-medium">{specialty.name} Certification</span>
          </div>
          <div className="max-w-3xl">
            <div className={`w-14 h-14 rounded-xl ${specialty.bgColor} flex items-center justify-center mb-4`}>
              <Icon className={`w-7 h-7 ${specialty.iconColor}`} />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700 mb-4" data-testid="badge-new-grad-cert">
              <GraduationCap className="w-4 h-4" />
              New Graduate Certification Guide
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4" data-testid="text-page-title">
              {specialty.name} for New Graduates
            </h1>
            <p className="text-lg text-gray-600 mb-6" data-testid="text-page-subtitle">
              {specialty.longDescription}
            </p>
            <div className="flex flex-wrap gap-2 mb-8">
              {specialty.certifications.map((cert) => (
                <span key={cert} className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${specialty.bgColor} ${specialty.iconColor}`} data-testid={`badge-cert-${cert}`}>
                  <Award className="w-3 h-3 mr-1" />
                  {cert}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-4">
              <Link href={`/${specialty.slug}`} className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200" data-testid="button-explore-specialty">
                Explore {specialty.name} Track <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/nursing-certifications" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-700 rounded-xl font-semibold hover:bg-blue-50 transition-colors border border-blue-200" data-testid="button-all-certifications">
                All Certifications
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white" data-testid="section-new-grad-guide">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-2xl border border-blue-100 p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900" data-testid="text-guide-heading">{specialty.newGradGuideTitle}</h2>
            </div>
            <p className="text-gray-600 text-lg mb-6" data-testid="text-guide-desc">{specialty.newGradGuideDescription}</p>
            <div className="bg-white rounded-xl border border-blue-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-2">{t("pages.newGradCertificationPage.clinicalContext")}</h3>
              <p className="text-gray-600" data-testid="text-clinical-context">{specialty.clinicalContext}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50" data-testid="section-topics">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-3" data-testid="text-topics-heading">{t("pages.newGradCertificationPage.whatYoullLearn")}</h2>
            <p className="text-gray-600">Core topics covered in the {specialty.name} track to prepare for certification.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {specialty.topics.map((topic, i) => (
              <div key={i} className="flex items-start gap-3 bg-white rounded-xl border border-gray-100 p-4" data-testid={`card-topic-${i}`}>
                <Check className={`w-5 h-5 ${specialty.iconColor} mt-0.5 flex-shrink-0`} />
                <span className="text-sm text-gray-700 font-medium">{topic}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white" data-testid="section-certifications">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-3" data-testid="text-certs-heading">{t("pages.newGradCertificationPage.certificationsToPursue")}</h2>
            <p className="text-gray-600">Key certifications for {specialty.name.toLowerCase()} nurses.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {specialty.certifications.map((cert) => (
              <div key={cert} className={`rounded-xl border ${specialty.borderColor} p-5 text-center`} data-testid={`card-cert-detail-${cert}`}>
                <div className={`w-12 h-12 rounded-xl ${specialty.bgColor} flex items-center justify-center mx-auto mb-3`}>
                  <Award className={`w-6 h-6 ${specialty.iconColor}`} />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">{cert}</h3>
                <p className="text-sm text-gray-500 mt-1">{t("pages.newGradCertificationPage.specialtyCertification")}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50" data-testid="section-resources">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-3" data-testid="text-resources-heading">{t("pages.newGradCertificationPage.studyResources")}</h2>
            <p className="text-gray-600">Everything included to prepare for {specialty.name.toLowerCase()} certification.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Link href="/lessons" className="group" data-testid="card-resource-lessons">
              <div className={`bg-white rounded-xl border ${specialty.borderColor} p-6 hover:shadow-md transition-all h-full`}>
                <div className={`w-12 h-12 rounded-xl ${specialty.bgColor} flex items-center justify-center mb-4`}>
                  <BookOpen className={`w-6 h-6 ${specialty.iconColor}`} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">{t("pages.newGradCertificationPage.lessonLibrary")}</h3>
                <p className="text-sm text-gray-500 mb-3">In-depth lessons specific to {specialty.name.toLowerCase()}.</p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-blue-600">
                  Browse Lessons <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
            <Link href="/free-practice" className="group" data-testid="card-resource-qbank">
              <div className={`bg-white rounded-xl border ${specialty.borderColor} p-6 hover:shadow-md transition-all h-full`}>
                <div className={`w-12 h-12 rounded-xl ${specialty.bgColor} flex items-center justify-center mb-4`}>
                  <ClipboardList className={`w-6 h-6 ${specialty.iconColor}`} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">{t("pages.newGradCertificationPage.testBank")}</h3>
                <p className="text-sm text-gray-500 mb-3">Practice questions for {specialty.certifications.join(", ")} certification prep.</p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-blue-600">
                  Practice Now <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
            <Link href="/flashcards" className="group" data-testid="card-resource-flashcards">
              <div className={`bg-white rounded-xl border ${specialty.borderColor} p-6 hover:shadow-md transition-all h-full`}>
                <div className={`w-12 h-12 rounded-xl ${specialty.bgColor} flex items-center justify-center mb-4`}>
                  <Layers className={`w-6 h-6 ${specialty.iconColor}`} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">{t("pages.newGradCertificationPage.flashcardDecks")}</h3>
                <p className="text-sm text-gray-500 mb-3">Spaced-repetition flashcards for {specialty.name.toLowerCase()} concepts.</p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-blue-600">
                  Study Flashcards <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white" data-testid="section-faq">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-3" data-testid="text-faq-heading">{t("pages.newGradCertificationPage.frequentlyAskedQuestions")}</h2>
            <p className="text-gray-600">Common questions about {specialty.name.toLowerCase()} for new graduates</p>
          </div>
          <div className="space-y-3">
            {specialty.faq.map((faq, i) => (
              <div key={i} className="border border-gray-200 rounded-xl p-5" data-testid={`faq-item-${i}`}>
                <h3 className="font-medium text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {relatedSpecialties.length > 0 && (
        <section className="py-16 bg-gray-50" data-testid="section-related">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-3" data-testid="text-related-heading">{t("pages.newGradCertificationPage.relatedSpecialties")}</h2>
              <p className="text-gray-600">Explore specialties that complement {specialty.name.toLowerCase()}.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedSpecialties.map((rel) => {
                const RelIcon = rel.icon;
                return (
                  <Link key={rel.slug} href={`/${rel.slug}`} className="group" data-testid={`card-related-${rel.slug}`}>
                    <div className={`bg-white rounded-xl border ${rel.borderColor} p-5 hover:shadow-md transition-all h-full`}>
                      <div className={`w-10 h-10 rounded-xl ${rel.bgColor} flex items-center justify-center mb-3`}>
                        <RelIcon className={`w-5 h-5 ${rel.iconColor}`} />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors text-sm">{rel.name}</h3>
                      <p className="text-xs text-gray-500 line-clamp-2">{rel.description}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 bg-gradient-to-br from-blue-600 to-indigo-700" data-testid="section-cta">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4" data-testid="text-cta-heading">
            Ready to Start Your {specialty.name} Journey?
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            All specialty tracks and certification prep are included with your NurseNest subscription.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href={`/${specialty.slug}`} className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-blue-700 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg" data-testid="button-cta-specialty">
              Explore {specialty.name} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/new-grad" className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-400 transition-colors border border-blue-400" data-testid="button-cta-new-grad">
              New Grad Hub
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default function NewGradCertificationPage() {
  const params = useParams<{ slug: string }>();
  const certSlug = params.slug || "";
  const specialtySlug = SLUG_TO_SPECIALTY[certSlug];

  if (!specialtySlug) {
    return <CertificationNotFound />;
  }

  const specialty = getSpecialtyBySlug(specialtySlug);

  if (!specialty) {
    return <CertificationNotFound />;
  }

  return <CertificationContent specialty={specialty} certSlug={certSlug} />;
}
