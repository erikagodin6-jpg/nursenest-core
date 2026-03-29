import { useState } from "react";
import { useParams } from "wouter";
import { Link } from "wouter";
import { SEO } from "@/components/seo";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { AutoRelatedContent, YouMayAlsoLike } from "@/components/auto-related-content";
import { buildFaqStructuredData, PARENT_EDUCATIONAL_ORG } from "@/lib/structured-data";
import { getSpecialtyBySlug, SPECIALTY_CONFIGS, type SpecialtyConfig } from "@/data/specialty-hub-data";
import { useI18n } from "@/lib/i18n";
import {
  ArrowRight, BookOpen, FileText, HelpCircle, ChevronRight,
  Check, Layers, ClipboardList, GraduationCap, Stethoscope,
  ChevronDown, Activity, Award
} from "lucide-react";

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden" data-testid={`faq-item-${index}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
        data-testid={`button-faq-toggle-${index}`}
      >
        <span className="font-medium text-gray-900 pr-4">{question}</span>
        <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""} text-gray-400`} />
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3" data-testid={`text-faq-answer-${index}`}>
          {answer}
        </div>
      )}
    </div>
  );
}

function SpecialtyNotFound() {
  return (
    <div data-testid="page-specialty-not-found">
      <Navigation />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-4" data-testid="text-specialty-not-found">{t("pages.specialtyHubPage.specialtyNotFound")}</h1>
          <p className="text-gray-600 mb-6">{t("pages.specialtyHubPage.theSpecialtyYouAreLooking")}</p>
          <Link href="/nursing-specialties" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors" data-testid="link-back-to-specialties">
            View All Specialties <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function SpecialtyHubContent({ specialty }: { specialty: SpecialtyConfig }) {
  const Icon = specialty.icon;
  const faqStructuredData = buildFaqStructuredData(specialty.faq);

  const medicalWebPageSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "name": `${specialty.name} - NurseNest`,
    "description": specialty.longDescription,
    "url": `https://www.nursenest.ca/${specialty.slug}`,
    "about": {
      "@type": "MedicalSpecialty",
      "name": specialty.name,
    },
    "provider": {
      "@type": "EducationalOrganization",
      "name": "NurseNest",
      "url": "https://www.nursenest.ca",
      "parentOrganization": {
        "@type": "EducationalOrganization",
        "name": PARENT_EDUCATIONAL_ORG.name,
        "url": PARENT_EDUCATIONAL_ORG.url,
      },
    },
    "educationalLevel": "Advanced",
    "inLanguage": "en",
    "isAccessibleForFree": false,
  };

  const relatedSpecialties = SPECIALTY_CONFIGS.filter(s =>
    specialty.relatedSpecialties.includes(s.slug)
  );

  return (
    <div data-testid={`page-specialty-${specialty.slug}`}>
      <Navigation />
      <SEO
        title={`${specialty.name} - Specialty Nursing Track | NurseNest`}
        description={specialty.longDescription}
        keywords={`${specialty.name.toLowerCase()}, ${specialty.certifications.join(", ").toLowerCase()}, nursing specialty, ${specialty.slug} nursing, specialty nursing certification`}
        canonicalPath={`/${specialty.slug}`}
        structuredData={medicalWebPageSchema}
        additionalStructuredData={[faqStructuredData]}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "Nursing Specialties", url: "https://www.nursenest.ca/nursing-specialties" },
          { name: specialty.name, url: `https://www.nursenest.ca/${specialty.slug}` },
        ]}
      />

      <section className={`relative py-16 sm:py-20 overflow-hidden`} data-testid="section-hero">
        <div className={`absolute inset-0 bg-gradient-to-br ${specialty.gradientFrom} via-white/50 ${specialty.gradientTo}`} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6" data-testid="nav-breadcrumb">
            <Link href="/" className="hover:text-blue-600">{t("pages.specialtyHubPage.home")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/nursing-specialties" className="hover:text-blue-600">{t("pages.specialtyHubPage.nursingSpecialties")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-blue-700 font-medium">{specialty.name}</span>
          </div>
          <div className="max-w-3xl">
            <div className={`w-14 h-14 rounded-xl ${specialty.bgColor} flex items-center justify-center mb-4`}>
              <Icon className={`w-7 h-7 ${specialty.iconColor}`} />
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {specialty.certifications.map((cert) => (
                <span key={cert} className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${specialty.bgColor} ${specialty.iconColor}`} data-testid={`badge-cert-${cert}`}>
                  {cert}
                </span>
              ))}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4" data-testid="text-page-title">
              {specialty.name}
            </h1>
            <p className="text-lg text-gray-600 mb-8" data-testid="text-page-subtitle">
              {specialty.longDescription}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/lessons" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200" data-testid="button-browse-lessons">
                Browse {specialty.name} Lessons <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/pricing" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-700 rounded-xl font-semibold hover:bg-blue-50 transition-colors border border-blue-200" data-testid="button-view-pricing">
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white" data-testid="section-overview">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-10 h-10 rounded-xl ${specialty.bgColor} flex items-center justify-center`}>
              <Stethoscope className={`w-5 h-5 ${specialty.iconColor}`} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900" data-testid="text-overview-heading">{t("pages.specialtyHubPage.clinicalContext")}</h2>
          </div>
          <p className="text-gray-700 leading-relaxed text-lg" data-testid="text-clinical-context">{specialty.clinicalContext}</p>
        </div>
      </section>

      <section className="py-16 bg-gray-50" data-testid="section-topics">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-3" data-testid="text-topics-heading">{t("pages.specialtyHubPage.whatYoullLearn")}</h2>
            <p className="text-gray-600">Core topics covered in the {specialty.name} specialty track.</p>
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

      <section className="py-16 bg-white" data-testid="section-resources">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-3" data-testid="text-resources-heading">{t("pages.specialtyHubPage.studyResources")}</h2>
            <p className="text-gray-600">Everything included in your {specialty.name} specialty track.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Link href="/lessons" className="group" data-testid="card-resource-lessons">
              <div className={`bg-white rounded-xl border ${specialty.borderColor} p-6 hover:shadow-md transition-all h-full`}>
                <div className={`w-12 h-12 rounded-xl ${specialty.bgColor} flex items-center justify-center mb-4`}>
                  <BookOpen className={`w-6 h-6 ${specialty.iconColor}`} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">{t("pages.specialtyHubPage.lessonLibrary")}</h3>
                <p className="text-sm text-gray-500 mb-3">In-depth pathophysiology and clinical lessons specific to {specialty.name.toLowerCase()}.</p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 group-hover:gap-2 transition-all">
                  Browse Lessons <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
            <Link href="/free-practice" className="group" data-testid="card-resource-qbank">
              <div className={`bg-white rounded-xl border ${specialty.borderColor} p-6 hover:shadow-md transition-all h-full`}>
                <div className={`w-12 h-12 rounded-xl ${specialty.bgColor} flex items-center justify-center mb-4`}>
                  <ClipboardList className={`w-6 h-6 ${specialty.iconColor}`} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">{t("pages.specialtyHubPage.testBank")}</h3>
                <p className="text-sm text-gray-500 mb-3">Practice questions aligned to {specialty.certifications.join(", ")} certification exam blueprints.</p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 group-hover:gap-2 transition-all">
                  Practice Now <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
            <Link href="/flashcards" className="group" data-testid="card-resource-flashcards">
              <div className={`bg-white rounded-xl border ${specialty.borderColor} p-6 hover:shadow-md transition-all h-full`}>
                <div className={`w-12 h-12 rounded-xl ${specialty.bgColor} flex items-center justify-center mb-4`}>
                  <Layers className={`w-6 h-6 ${specialty.iconColor}`} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">{t("pages.specialtyHubPage.flashcardDecks")}</h3>
                <p className="text-sm text-gray-500 mb-3">Spaced-repetition flashcards for {specialty.name.toLowerCase()} terminology and clinical concepts.</p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 group-hover:gap-2 transition-all">
                  Study Flashcards <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-blue-50 via-indigo-50/30 to-white" data-testid="section-new-grad">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-blue-100 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900" data-testid="text-new-grad-heading">{t("pages.specialtyHubPage.forNewGraduates")}</h2>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2" data-testid="text-new-grad-title">{specialty.newGradGuideTitle}</h3>
            <p className="text-gray-600 mb-6" data-testid="text-new-grad-desc">{specialty.newGradGuideDescription}</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/new-grad" className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors" data-testid="link-new-grad-hub">
                Visit New Grad Hub <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/new-grad/nursing" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-blue-700 rounded-xl font-semibold hover:bg-blue-50 transition-colors border border-blue-200" data-testid="link-new-grad-nursing">
                New Grad Nursing Guide
              </Link>
            </div>
          </div>
        </div>
      </section>

      {relatedSpecialties.length > 0 && (
        <section className="py-16 bg-white" data-testid="section-related">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-3" data-testid="text-related-heading">{t("pages.specialtyHubPage.relatedSpecialties")}</h2>
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

      <section className="py-16 bg-gray-50" data-testid="section-faq">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-3" data-testid="text-faq-heading">{t("pages.specialtyHubPage.frequentlyAskedQuestions")}</h2>
            <p className="text-gray-600">Common questions about {specialty.name.toLowerCase()}</p>
          </div>
          <div className="space-y-3">
            {specialty.faq.map((faq, i) => (
              <FAQItem key={i} question={faq.question} answer={faq.answer} index={i} />
            ))}
          </div>
        </div>
      </section>

      {(() => {
        const certMap: Record<string, { slug: string; name: string; label: string }[]> = {
          "icu": [
            { slug: "acls", name: "ACLS", label: "Advanced Cardiovascular Life Support" },
            { slug: "bls", name: "BLS", label: "Basic Life Support" },
          ],
          "emergency-nursing": [
            { slug: "tncc", name: "TNCC", label: "Trauma Nursing Core Course" },
            { slug: "enpc", name: "ENPC", label: "Emergency Nursing Pediatric Course" },
            { slug: "acls", name: "ACLS", label: "Advanced Cardiovascular Life Support" },
          ],
          "nicu": [
            { slug: "nrp", name: "NRP", label: "Neonatal Resuscitation Program" },
            { slug: "pals", name: "PALS", label: "Pediatric Advanced Life Support" },
          ],
          "pediatric-icu": [
            { slug: "pals", name: "PALS", label: "Pediatric Advanced Life Support" },
            { slug: "enpc", name: "ENPC", label: "Emergency Nursing Pediatric Course" },
          ],
          "med-surg": [
            { slug: "bls", name: "BLS", label: "Basic Life Support" },
            { slug: "acls", name: "ACLS", label: "Advanced Cardiovascular Life Support" },
          ],
        };
        const relevantCerts = certMap[specialty.slug] || [];
        if (relevantCerts.length === 0) return null;
        return (
          <section className="py-16 bg-white" data-testid="section-cert-cross-promo">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-2 mb-6">
                <GraduationCap className="w-5 h-5 text-amber-600" />
                <h2 className="text-xl font-bold text-gray-900">{t("pages.specialtyHubPage.relatedCertificationPrep")}</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relevantCerts.map(cert => (
                  <Link
                    key={cert.slug}
                    href={`/certifications/${cert.slug}-prep`}
                    className="flex items-center gap-3 bg-amber-50 rounded-xl border border-amber-100 p-4 hover:shadow-md hover:border-amber-300 transition-all group"
                    data-testid={`link-cert-${cert.slug}`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                      <Award className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 group-hover:text-amber-700 transition-colors">{cert.name} Prep Guide</h3>
                      <p className="text-xs text-gray-500">{cert.label}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-amber-500 flex-shrink-0 ml-auto" />
                  </Link>
                ))}
              </div>
              <Link
                href="/nursing-certifications"
                className="inline-flex items-center gap-1 text-sm font-medium text-amber-700 hover:text-amber-800 mt-4"
                data-testid="link-all-certs-from-specialty"
              >
                View all certification prep guides <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </section>
        );
      })()}

      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AutoRelatedContent slug={specialty.slug} contentType="specialty-hub" title={specialty.name} category={specialty.name} />
          <YouMayAlsoLike slug={specialty.slug} contentType="specialty-hub" title={specialty.name} category={specialty.name} />
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-blue-600 to-indigo-700" data-testid="section-cta">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4" data-testid="text-cta-heading">
            Ready to Master {specialty.name}?
          </h2>
          <p className="text-blue-100 mb-4 text-lg">
            All specialty tracks are included with your NurseNest subscription. No per-track fees, no content limits.
          </p>
          <p className="text-blue-200 mb-8 text-sm">
            Starting at $19/month or included with any RN/NP subscription tier.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/pricing" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-blue-700 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg" data-testid="button-cta-pricing">
              View Pricing <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/lessons" className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-400 transition-colors border border-blue-400" data-testid="button-cta-browse">
              Browse Lessons
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default function SpecialtyHubPage() {
  const params = useParams<{ slug: string }>();
  const specialty = getSpecialtyBySlug(params.slug || "");

  if (!specialty) {
    return <SpecialtyNotFound />;
  }

  return <SpecialtyHubContent specialty={specialty} />;
}

export function SpecialtyHubBySlug({ slug }: { slug: string }) {
  const specialty = getSpecialtyBySlug(slug);

  if (!specialty) {
    return <SpecialtyNotFound />;
  }

  return <SpecialtyHubContent specialty={specialty} />;
}
