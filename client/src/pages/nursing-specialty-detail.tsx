import { useState } from "react";
import { useParams, Link } from "wouter";
import { SEO } from "@/components/seo";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { buildFaqStructuredData } from "@/lib/structured-data";
import { getSpecialtyBySlug, NURSING_SPECIALTIES } from "@/data/nursing-specialties-detail-data";
import { useI18n } from "@/lib/i18n";
import { safeArray, safeString, logMissingField, logLookupFailure } from "@/lib/utils";
import {
  ArrowRight,
  ChevronRight,
  CheckCircle,
  XCircle,
  HelpCircle,
  BookOpen,
  FileText,
  Layers,
  Award,
  Stethoscope,
  ClipboardList,
  Check,
} from "lucide-react";

function PracticeQuestion({ q, index }: { q: { question: string; options: string[]; correct: number; rationale: string }; index: number }) {
  const { t } = useI18n();
  const [selected, setSelected] = useState<number | null>(null);
  const [showRationale, setShowRationale] = useState(false);

  const handleSelect = (optionIndex: number) => {
    if (selected !== null) return;
    setSelected(optionIndex);
    setShowRationale(true);
  };

  const options = safeArray(q.options);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6" data-testid={`practice-question-${index}`}>
      <p className="font-semibold text-gray-900 mb-4">{index + 1}. {safeString(q.question)}</p>
      <div className="space-y-2 mb-4">
        {options.map((option, i) => {
          let optionStyle = "border-gray-200 hover:border-blue-300 hover:bg-blue-50/30 cursor-pointer";
          if (selected !== null) {
            if (i === q.correct) {
              optionStyle = "border-emerald-500 bg-emerald-50 text-emerald-900";
            } else if (i === selected && i !== q.correct) {
              optionStyle = "border-red-400 bg-red-50 text-red-900";
            } else {
              optionStyle = "border-gray-200 opacity-60";
            }
          }
          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              className={`w-full text-left px-4 py-3 rounded-lg border transition-all flex items-center gap-3 ${optionStyle}`}
              disabled={selected !== null}
              data-testid={`question-${index}-option-${i}`}
            >
              <span className="w-7 h-7 rounded-full border flex items-center justify-center text-sm font-medium shrink-0">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="text-sm">{option}</span>
              {selected !== null && i === q.correct && <CheckCircle className="w-4 h-4 text-emerald-500 ml-auto shrink-0" />}
              {selected !== null && i === selected && i !== q.correct && <XCircle className="w-4 h-4 text-red-400 ml-auto shrink-0" />}
            </button>
          );
        })}
      </div>
      {showRationale && (
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mt-3" data-testid={`question-${index}-rationale`}>
          <p className="text-sm font-semibold text-blue-900 mb-1">{t("pages.nursingSpecialtyDetail.rationale")}</p>
          <p className="text-sm text-gray-700 leading-relaxed">{safeString(q.rationale)}</p>
        </div>
      )}
    </div>
  );
}

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
        <HelpCircle className={`w-5 h-5 flex-shrink-0 transition-colors ${open ? 'text-blue-500' : 'text-gray-400'}`} />
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed" data-testid={`text-faq-answer-${index}`}>
          {answer}
        </div>
      )}
    </div>
  );
}

function SpecialtyNotFound() {
  const { t } = useI18n();
  return (
    <div data-testid="page-specialty-not-found">
      <Navigation />
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-4" data-testid="text-not-found">{t("pages.nursingSpecialtyDetail.specialtyNotFound")}</h1>
          <p className="text-gray-600 mb-6">{t("pages.nursingSpecialtyDetail.theNursingSpecialtyYouAre")}</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {NURSING_SPECIALTIES.map(spec => (
              <Link key={spec.slug} href={`/nursing-specialties/${spec.slug}`} className="text-blue-600 hover:underline text-sm" data-testid={`link-specialty-${spec.slug}`}>
                {spec.name}
              </Link>
            ))}
          </div>
          <div className="mt-6">
            <Link href="/nursing-specialties" className="inline-flex items-center gap-2 text-blue-600 font-medium hover:underline" data-testid="link-back-hub">
              <ArrowRight className="w-4 h-4 rotate-180" /> Back to All Specialties
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function NursingSpecialtyDetail() {
  const { t } = useI18n();
  const params = useParams<{ slug: string }>();
  const rawSlug = params.slug || "";
  const specialty = getSpecialtyBySlug(rawSlug);

  if (!specialty) {
    logLookupFailure("NursingSpecialtyDetail", rawSlug);
    return <SpecialtyNotFound />;
  }

  const SpecIcon = specialty.icon;

  const skills = safeArray(specialty.skills);
  const certifications = safeArray(specialty.certifications);
  const commonConditions = safeArray(specialty.commonConditions);
  const practiceQuestions = safeArray(specialty.practiceQuestions);
  const faq = safeArray(specialty.faq);
  const relatedLessons = safeArray(specialty.relatedLessons);
  const relatedQuestions = safeArray(specialty.relatedQuestions);
  const relatedFlashcards = safeArray(specialty.relatedFlashcards);
  const metaDescription = safeString(specialty.metaDescription, specialty.name);
  const roleDescription = safeString(specialty.roleDescription);

  if (skills.length === 0) logMissingField("NursingSpecialtyDetail", specialty.slug, "skills");
  if (certifications.length === 0) logMissingField("NursingSpecialtyDetail", specialty.slug, "certifications");
  if (commonConditions.length === 0) logMissingField("NursingSpecialtyDetail", specialty.slug, "commonConditions");
  if (practiceQuestions.length === 0) logMissingField("NursingSpecialtyDetail", specialty.slug, "practiceQuestions");
  if (faq.length === 0) logMissingField("NursingSpecialtyDetail", specialty.slug, "faq");
  if (relatedLessons.length === 0) logMissingField("NursingSpecialtyDetail", specialty.slug, "relatedLessons");
  if (relatedQuestions.length === 0) logMissingField("NursingSpecialtyDetail", specialty.slug, "relatedQuestions");
  if (relatedFlashcards.length === 0) logMissingField("NursingSpecialtyDetail", specialty.slug, "relatedFlashcards");

  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": safeString(specialty.name),
    "description": roleDescription,
    "provider": {
      "@type": "Organization",
      "name": "NurseNest",
      "url": "https://www.nursenest.ca",
    },
    "educationalLevel": "Advanced",
    "courseMode": "online",
    "isAccessibleForFree": false,
    "about": commonConditions.map(c => ({ "@type": "Thing", "name": c })),
  };

  const faqStructuredData = faq.length > 0 ? buildFaqStructuredData(faq) : null;

  return (
    <div data-testid={`page-specialty-${specialty.slug}`}>
      <Navigation />
      <SEO
        title={safeString(specialty.title, specialty.name)}
        description={metaDescription}
        keywords={safeString(specialty.keywords)}
        canonicalPath={`/nursing-specialties/${specialty.slug}`}
        structuredData={courseSchema}
        additionalStructuredData={faqStructuredData ? [faqStructuredData] : undefined}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "Nursing Specialties", url: "https://www.nursenest.ca/nursing-specialties" },
          { name: safeString(specialty.name), url: `https://www.nursenest.ca/nursing-specialties/${specialty.slug}` },
        ]}
      />

      <section className={`relative py-16 sm:py-20 overflow-hidden`} data-testid="section-hero">
        <div className={`absolute inset-0 bg-gradient-to-br ${safeString(specialty.gradientFrom)} via-white/50 to-white`} />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6" data-testid="breadcrumb-nav">
            <Link href="/" className="hover:text-blue-600">{t("pages.nursingSpecialtyDetail.home")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/nursing-specialties" className="hover:text-blue-600">{t("pages.nursingSpecialtyDetail.nursingSpecialties")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-blue-700 font-medium">{specialty.name}</span>
          </nav>
          <div className="flex items-start gap-4 mb-6">
            <div className={`w-14 h-14 rounded-2xl ${safeString(specialty.bgColor)} flex items-center justify-center flex-shrink-0`}>
              <SpecIcon className={`w-7 h-7 ${safeString(specialty.iconColor)}`} />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3" data-testid="text-specialty-title">
                {specialty.name}
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed" data-testid="text-specialty-subtitle">
                {metaDescription.split('.')[0]}.
              </p>
            </div>
          </div>
          {certifications.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {certifications.map(cert => (
                <span key={cert.name} className={`px-3 py-1 rounded-full text-xs font-semibold ${safeString(specialty.bgColor)} ${safeString(specialty.iconColor)}`}>
                  {cert.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">

        {roleDescription && (
          <section data-testid="section-role-overview">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl ${safeString(specialty.bgColor)} flex items-center justify-center`}>
                <Stethoscope className={`w-5 h-5 ${safeString(specialty.iconColor)}`} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">What {safeString(specialty.name).replace(" Nursing", " Nurses").replace(" Care Nursing", " Care Nurses")} Do</h2>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <p className="text-gray-700 leading-relaxed" data-testid="text-role-description">{roleDescription}</p>
            </div>
          </section>
        )}

        {skills.length > 0 && (
          <section data-testid="section-skills">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <ClipboardList className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{t("pages.nursingSpecialtyDetail.skillsRequired")}</h2>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <ul className="grid sm:grid-cols-2 gap-3">
                {skills.map((skill, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700" data-testid={`text-skill-${i}`}>
                    <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {certifications.length > 0 && (
          <section data-testid="section-certifications">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <Award className="w-5 h-5 text-amber-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{t("pages.nursingSpecialtyDetail.certifications")}</h2>
            </div>
            <div className="space-y-3">
              {certifications.map((cert, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-5" data-testid={`card-certification-${i}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${safeString(specialty.bgColor)} ${safeString(specialty.iconColor)}`}>{cert.name}</span>
                    <h3 className="font-semibold text-gray-900">{safeString(cert.fullName)}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{safeString(cert.description)}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {commonConditions.length > 0 && (
          <section data-testid="section-conditions">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl ${safeString(specialty.bgColor)} flex items-center justify-center`}>
                <SpecIcon className={`w-5 h-5 ${safeString(specialty.iconColor)}`} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{t("pages.nursingSpecialtyDetail.commonConditionsTreated")}</h2>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="grid sm:grid-cols-2 gap-2">
                {commonConditions.map((condition, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-sm text-gray-700" data-testid={`text-condition-${i}`}>
                    <ChevronRight className={`w-4 h-4 ${safeString(specialty.iconColor)} shrink-0 mt-0.5`} />
                    {condition}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {practiceQuestions.length > 0 && (
          <section data-testid="section-practice-questions">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{t("pages.nursingSpecialtyDetail.practiceQuestions")}</h2>
            </div>
            <p className="text-gray-600 mb-4">Test your {safeString(specialty.name).toLowerCase()} knowledge. Select an answer to reveal the rationale.</p>
            <div className="space-y-4">
              {practiceQuestions.map((q, i) => (
                <PracticeQuestion key={i} q={q} index={i} />
              ))}
            </div>
          </section>
        )}

        {(relatedLessons.length > 0 || relatedQuestions.length > 0 || relatedFlashcards.length > 0) && (
          <section data-testid="section-related-resources">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-violet-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{t("pages.nursingSpecialtyDetail.relatedResources")}</h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {relatedLessons.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    <h3 className="font-semibold text-gray-900 text-sm">{t("pages.nursingSpecialtyDetail.lessons")}</h3>
                  </div>
                  <ul className="space-y-2">
                    {relatedLessons.map((lesson, i) => (
                      <li key={i}>
                        <Link href={safeString(lesson.href)} className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1" data-testid={`link-lesson-${i}`}>
                          <ArrowRight className="w-3 h-3" /> {safeString(lesson.title)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {relatedQuestions.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <h3 className="font-semibold text-gray-900 text-sm">{t("pages.nursingSpecialtyDetail.practiceQuestions2")}</h3>
                  </div>
                  <ul className="space-y-2">
                    {relatedQuestions.map((q, i) => (
                      <li key={i}>
                        <Link href={safeString(q.href)} className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1" data-testid={`link-question-${i}`}>
                          <ArrowRight className="w-3 h-3" /> {safeString(q.title)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {relatedFlashcards.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Layers className="w-4 h-4 text-purple-600" />
                    <h3 className="font-semibold text-gray-900 text-sm">{t("pages.nursingSpecialtyDetail.flashcards")}</h3>
                  </div>
                  <ul className="space-y-2">
                    {relatedFlashcards.map((fc, i) => (
                      <li key={i}>
                        <Link href={safeString(fc.href)} className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1" data-testid={`link-flashcard-${i}`}>
                          <ArrowRight className="w-3 h-3" /> {safeString(fc.title)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}

        {faq.length > 0 && (
          <section data-testid="section-faq">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-gray-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{t("pages.nursingSpecialtyDetail.frequentlyAskedQuestions")}</h2>
            </div>
            <div className="space-y-3">
              {faq.map((f, i) => (
                <FAQItem key={i} question={safeString(f.question)} answer={safeString(f.answer)} index={i} />
              ))}
            </div>
          </section>
        )}

        <section className="py-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl text-center px-6" data-testid="section-cta">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4" data-testid="text-cta-heading">
            Ready to Master {safeString(specialty.name)}?
          </h2>
          <p className="text-blue-100 mb-6 text-lg max-w-2xl mx-auto">
            Access comprehensive lessons, practice questions, and flashcards tailored to {safeString(specialty.name).toLowerCase()} — all included with your NurseNest subscription.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/pricing" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-blue-700 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg" data-testid="button-cta-pricing">
              View Pricing <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/lessons" className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-400 transition-colors border border-blue-400" data-testid="button-cta-lessons">
              Browse Lessons
            </Link>
          </div>
        </section>

        <section data-testid="section-other-specialties">
          <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">{t("pages.nursingSpecialtyDetail.exploreOtherSpecialties")}</h2>
          <div className="flex flex-wrap gap-2 justify-center">
            {NURSING_SPECIALTIES.filter(s => s.slug !== specialty.slug).map(s => {
              const OtherIcon = s.icon;
              return (
                <Link key={s.slug} href={`/nursing-specialties/${s.slug}`} className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg ${safeString(s.bgColor)} ${safeString(s.iconColor)} text-xs font-medium hover:opacity-80 transition-opacity`} data-testid={`link-other-specialty-${s.slug}`}>
                  <OtherIcon className="w-3.5 h-3.5" />
                  {s.name}
                </Link>
              );
            })}
          </div>
        </section>

      </div>

      <Footer />
    </div>
  );
}
