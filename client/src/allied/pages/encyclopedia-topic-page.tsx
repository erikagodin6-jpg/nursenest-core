import { useState, useEffect } from "react";
import { useParams, useRoute } from "wouter";
import { AlliedSEO } from "../allied-seo";
import { useI18n } from "@/lib/i18n";
import {
  Breadcrumbs, FAQAccordion, ConversionCTA, ClinicalPearlCard, ExamTipCard,
} from "../components/paramedic-seo-components";
import {
  Loader2, BookOpen, Stethoscope, AlertTriangle, Brain,
  ClipboardList, Shield, ArrowRight, ChevronRight, Activity, Microscope,
} from "lucide-react";

const ALLIED_DOMAIN = "https://www.nursenest.ca/allied-health";

const PROFESSION_META: Record<string, { label: string; hubPath: string; color: string; accent: string }> = {
  paramedic: { label: "Paramedic", hubPath: "/allied-health/paramedic-encyclopedia", color: "teal", accent: "from-red-50 via-white to-teal-50" },
  "respiratory-therapy": { label: "Respiratory Therapy", hubPath: "/respiratory-therapy-encyclopedia", color: "blue", accent: "from-blue-50 via-white to-teal-50" },
  mlt: { label: "Medical Laboratory", hubPath: "/mlt-encyclopedia", color: "purple", accent: "from-purple-50 via-white to-teal-50" },
  imaging: { label: "Diagnostic Imaging", hubPath: "/imaging-encyclopedia", color: "orange", accent: "from-orange-50 via-white to-teal-50" },
  "social-work": { label: "Social Work", hubPath: "/social-work-encyclopedia", color: "cyan", accent: "from-cyan-50 via-white to-teal-50" },
  psychotherapy: { label: "Psychotherapy", hubPath: "/psychotherapy-encyclopedia", color: "indigo", accent: "from-indigo-50 via-white to-teal-50" },
  addictions: { label: "Addictions Counselling", hubPath: "/addictions-encyclopedia", color: "emerald", accent: "from-emerald-50 via-white to-teal-50" },
  "occupational-therapy": { label: "Occupational Therapy", hubPath: "/occupational-therapy-encyclopedia", color: "pink", accent: "from-pink-50 via-white to-teal-50" },
};

function professionQuestionsPath(profession: string): string {
  const { t } = useI18n();
  const map: Record<string, string> = {
    paramedic: "/allied-health/paramedic/questions",
    "respiratory-therapy": "/allied-health/rrt/questions",
    mlt: "/allied-health/mlt/questions",
    imaging: "/allied-health/imaging/questions",
    "social-work": "/allied-health/social-work",
    psychotherapy: "/allied-health/psychotherapy",
    addictions: "/allied-health/addictions",
    "occupational-therapy": "/allied-health/occupational-therapy",
  };
  return map[profession] || "/careers";
}

export default function EncyclopediaTopicPage({ profession: propProfession }: { profession?: string }) {
  const profession = propProfession || "paramedic";
  const hubPath = PROFESSION_META[profession]?.hubPath || "/allied-health/paramedic-encyclopedia";
  const [, routeParams] = useRoute(`${hubPath}/:slug`);
  const fallbackParams = useParams<{ slug: string }>();
  const slug = routeParams?.slug || fallbackParams.slug;
  const meta = PROFESSION_META[profession] || PROFESSION_META.paramedic;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedContent, setRelatedContent] = useState<any>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/encyclopedia/${profession}/${slug}`)
      .then(r => { if (!r.ok) throw new Error("Not found"); return r.json(); })
      .then(d => {
        setData(d);
        setError(null);
        fetch(`/api/encyclopedia/${profession}/${slug}/related-content`)
          .then(r => r.json())
          .then(rc => setRelatedContent(rc))
          .catch(() => {});
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [profession, slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("allied.encyclopediaTopicPage.topicNotFound")}</h1>
        <p className="text-gray-600">{t("allied.encyclopediaTopicPage.thisEncyclopediaTopicDoesntExist")}</p>
        <a href={meta.hubPath} className="inline-block mt-4 px-6 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-700" data-testid="link-back-encyclopedia">
          Back to {meta.label} Encyclopedia
        </a>
      </div>
    );
  }

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: meta.label, href: meta.hubPath },
    ...(data.category ? [{ label: data.category, href: `${meta.hubPath}?category=${encodeURIComponent(data.category)}` }] : []),
    { label: data.title, href: `${meta.hubPath}/${data.slug}` },
  ];

  const schemas = buildStructuredData(data, profession, meta, breadcrumbs);
  const faq = Array.isArray(data.faq) ? data.faq : [];
  const clinicalPearls = Array.isArray(data.clinicalPearls) ? data.clinicalPearls : [];
  const examPitfalls = Array.isArray(data.examPitfalls) ? data.examPitfalls : [];
  const relatedTopics = Array.isArray(data.relatedTopics) ? data.relatedTopics : [];
  const crossProfessionTopics = Array.isArray(data.crossProfessionTopics) ? data.crossProfessionTopics : [];

  return (
    <div data-testid="encyclopedia-topic-page">
      <AlliedSEO
        title={data.seoTitle || `${data.title} — ${meta.label} Encyclopedia`}
        description={data.metaDescription || data.overview || ""}
        canonicalPath={`${meta.hubPath}/${data.slug}`}
        structuredData={schemas[0]}
        additionalStructuredData={schemas.slice(1)}
      />
      <Breadcrumbs items={breadcrumbs} />

      <div className={`bg-gradient-to-br ${meta.accent} border-b border-gray-100 py-10 px-4`}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium bg-${meta.color}-100 text-${meta.color}-700`} data-testid="badge-profession">
              {meta.label} Encyclopedia
            </span>
            {data.category && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600" data-testid="badge-category">
                {data.category}
              </span>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 font-['DM_Sans']" data-testid="text-topic-title">
            {data.title}
          </h1>
          {data.metaDescription && (
            <p className="text-lg text-gray-600 max-w-3xl" data-testid="text-topic-subtitle">{data.metaDescription}</p>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        <article className="flex-1 min-w-0">
          {data.overview && (
            <Section icon={<BookOpen className="w-5 h-5" />} title={t("allied.encyclopediaTopicPage.overview")} testId="section-overview">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{data.overview}</p>
            </Section>
          )}

          {data.mechanism && (
            <Section icon={<Activity className="w-5 h-5" />} title={t("allied.encyclopediaTopicPage.mechanismPhysiology")} testId="section-mechanism">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{data.mechanism}</p>
            </Section>
          )}

          {data.clinicalRelevance && (
            <Section icon={<Stethoscope className="w-5 h-5" />} title={t("allied.encyclopediaTopicPage.clinicalRelevance")} testId="section-clinical-relevance">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{data.clinicalRelevance}</p>
            </Section>
          )}

          {data.signsSymptoms && (
            <Section icon={<AlertTriangle className="w-5 h-5" />} title={t("allied.encyclopediaTopicPage.signsSymptoms")} testId="section-signs-symptoms">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{data.signsSymptoms}</p>
            </Section>
          )}

          {data.assessmentMethods && (
            <Section icon={<ClipboardList className="w-5 h-5" />} title={t("allied.encyclopediaTopicPage.assessmentDiagnosticMethods")} testId="section-assessment">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{data.assessmentMethods}</p>
            </Section>
          )}

          {data.management && (
            <Section icon={<Shield className="w-5 h-5" />} title={t("allied.encyclopediaTopicPage.managementProfessionalPractice")} testId="section-management">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{data.management}</p>
            </Section>
          )}

          {data.complications && (
            <Section icon={<AlertTriangle className="w-5 h-5" />} title={t("allied.encyclopediaTopicPage.complications")} testId="section-complications">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{data.complications}</p>
            </Section>
          )}

          {clinicalPearls.length > 0 && (
            <div className="mt-6" data-testid="section-clinical-pearls">
              <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Brain className="w-5 h-5 text-amber-500" /> Clinical Pearls
              </h2>
              {clinicalPearls.map((pearl: any, i: number) => (
                <ClinicalPearlCard key={i} pearl={typeof pearl === "string" ? { content: pearl } : pearl} />
              ))}
            </div>
          )}

          {examPitfalls.length > 0 && (
            <div className="mt-6" data-testid="section-exam-pitfalls">
              <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" /> Exam Pitfalls
              </h2>
              {examPitfalls.map((pitfall: any, i: number) => (
                <div key={i} className="bg-red-50 border border-red-200 rounded-xl p-4 my-3" data-testid={`exam-pitfall-${i}`}>
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                    <div>
                      {pitfall.title && <h4 className="font-semibold text-red-800 mb-1">{pitfall.title}</h4>}
                      <p className="text-red-900 text-sm leading-relaxed">{typeof pitfall === "string" ? pitfall : pitfall.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <FAQAccordion items={faq.map((f: any) => ({ question: f.question || f.q, answer: f.answer || f.a }))} />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-8" data-testid="cta-section">
            <CTACard
              title={t("allied.encyclopediaTopicPage.testYourKnowledge")}
              description={`Practice ${meta.label} questions on this topic`}
              href={professionQuestionsPath(profession)}
              icon={<ClipboardList className="w-5 h-5" />}
              color="teal"
              testId="cta-test-knowledge"
            />
            <CTACard
              title={t("allied.encyclopediaTopicPage.reviewFlashcards")}
              description={t("allied.encyclopediaTopicPage.reinforceKeyConceptsWithSpaced")}
              href={`/${profession === "respiratory-therapy" ? "rrt" : profession}/flashcards`}
              icon={<Brain className="w-5 h-5" />}
              color="purple"
              testId="cta-flashcards"
            />
            <CTACard
              title={t("allied.encyclopediaTopicPage.startAMockExam")}
              description={`Full-length ${meta.label} practice exam`}
              href={`/${profession === "respiratory-therapy" ? "rrt" : profession}/mock-exams`}
              icon={<Microscope className="w-5 h-5" />}
              color="amber"
              testId="cta-mock-exam"
            />
          </div>

          <ConversionCTA
            title={`Ready to master ${meta.label}?`}
            description={`Join thousands of ${meta.label.toLowerCase()} students using NurseNest to prepare for certification exams.`}
          />
        </article>

        <aside className="lg:w-72 shrink-0 space-y-6">
          {relatedTopics.length > 0 && (
            <SidebarCard title={t("allied.encyclopediaTopicPage.relatedTopics")} testId="sidebar-related-topics">
              {relatedTopics.map((topic: any) => (
                <a
                  key={topic.id}
                  href={`${meta.hubPath}/${topic.slug}`}
                  className="flex items-center gap-2 text-sm text-gray-700 hover:text-teal-600 py-1.5 transition-colors"
                  data-testid={`related-topic-${topic.slug}`}
                >
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                  {topic.title}
                </a>
              ))}
            </SidebarCard>
          )}

          {crossProfessionTopics.length > 0 && (
            <SidebarCard title={t("allied.encyclopediaTopicPage.crossprofessionLinks")} testId="sidebar-cross-profession">
              {crossProfessionTopics.map((topic: any) => {
                const tMeta = PROFESSION_META[topic.profession] || PROFESSION_META.paramedic;
                return (
                  <a
                    key={topic.id}
                    href={`${tMeta.hubPath}/${topic.slug}`}
                    className="flex items-start gap-2 text-sm text-gray-700 hover:text-teal-600 py-1.5 transition-colors"
                    data-testid={`cross-link-${topic.slug}`}
                  >
                    <span className={`text-xs px-1.5 py-0.5 rounded bg-${tMeta.color}-100 text-${tMeta.color}-700 shrink-0`}>
                      {tMeta.label}
                    </span>
                    <span className="line-clamp-2">{topic.title}</span>
                  </a>
                );
              })}
            </SidebarCard>
          )}

          {relatedContent && (
            <>
              {(relatedContent.lessons || []).length > 0 && (
                <SidebarCard title={t("allied.encyclopediaTopicPage.relatedLessons")} testId="sidebar-lessons">
                  {relatedContent.lessons.map((lesson: any) => (
                    <a
                      key={lesson.id}
                      href={`/lessons/${lesson.slug}`}
                      className="flex items-center gap-2 text-sm text-gray-700 hover:text-teal-600 py-1.5 transition-colors"
                      data-testid={`related-lesson-${lesson.slug}`}
                    >
                      <BookOpen className="w-3.5 h-3.5 text-gray-400" />
                      {lesson.title}
                    </a>
                  ))}
                </SidebarCard>
              )}
              {(relatedContent.questions || []).length > 0 && (
                <SidebarCard title={t("allied.encyclopediaTopicPage.practiceQuestions")} testId="sidebar-questions">
                  {relatedContent.questions.map((q: any, i: number) => (
                    <a
                      key={i}
                      href={q.url}
                      className="flex items-center gap-2 text-sm text-gray-700 hover:text-teal-600 py-1.5 transition-colors"
                      data-testid={`related-question-${i}`}
                    >
                      <ClipboardList className="w-3.5 h-3.5 text-gray-400" />
                      {q.topic}
                    </a>
                  ))}
                </SidebarCard>
              )}
            </>
          )}
        </aside>
      </div>
    </div>
  );
}

function Section({ icon, title, children, testId }: { icon: React.ReactNode; title: string; children: React.ReactNode; testId: string }) {
  return (
    <div className="mb-6" data-testid={testId}>
      <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
        {icon} {title}
      </h2>
      <div className="bg-white border border-gray-100 rounded-xl p-5">{children}</div>
    </div>
  );
}

function SidebarCard({ title, children, testId }: { title: string; children: React.ReactNode; testId: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4" data-testid={testId}>
      <h3 className="font-semibold text-gray-900 text-sm mb-3">{title}</h3>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function CTACard({ title, description, href, icon, color, testId }: {
  title: string; description: string; href: string; icon: React.ReactNode; color: string; testId: string;
}) {
  return (
    <a
      href={href}
      className={`block bg-${color}-50 border border-${color}-200 rounded-xl p-4 hover:shadow-sm transition-all group`}
      data-testid={testId}
    >
      <div className={`text-${color}-600 mb-2`}>{icon}</div>
      <h3 className="font-semibold text-gray-900 text-sm mb-1">{title}</h3>
      <p className="text-xs text-gray-600">{description}</p>
      <span className={`inline-flex items-center gap-1 text-xs font-medium text-${color}-600 mt-2 group-hover:gap-2 transition-all`}>
        Get Started <ArrowRight className="w-3 h-3" />
      </span>
    </a>
  );
}

function buildStructuredData(data: any, profession: string, meta: any, breadcrumbs: { label: string; href: string }[]) {
  const schemas: Record<string, any>[] = [];

  schemas.push({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: b.label,
      item: `${ALLIED_DOMAIN}${b.href}`,
    })),
  });

  schemas.push({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: data.seoTitle || data.title,
    description: data.metaDescription || data.overview || "",
    publisher: {
      "@type": "EducationalOrganization",
      name: "NurseNest",
      url: ALLIED_DOMAIN,
    },
    datePublished: data.publishedAt,
    dateModified: data.updatedAt,
    mainEntityOfPage: `${ALLIED_DOMAIN}${meta.hubPath}/${data.slug}`,
  });

  if (data.clinicalRelevance || data.signsSymptoms) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "MedicalCondition",
      name: data.title,
      description: data.overview || "",
      signOrSymptom: data.signsSymptoms ? { "@type": "MedicalSignOrSymptom", name: data.signsSymptoms.substring(0, 200) } : undefined,
    });
  }

  const faq = Array.isArray(data.faq) ? data.faq : [];
  if (faq.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((f: any) => ({
        "@type": "Question",
        name: f.question || f.q,
        acceptedAnswer: { "@type": "Answer", text: f.answer || f.a },
      })),
    });
  }

  schemas.push({
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "NurseNest",
    url: ALLIED_DOMAIN,
    description: `Allied health education platform for ${meta.label} professionals`,
  });

  return schemas;
}
