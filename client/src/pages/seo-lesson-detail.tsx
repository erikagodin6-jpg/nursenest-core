import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { Navigation } from "@/components/navigation";
import { SEO } from "@/components/seo";
import { Footer } from "@/components/footer";
import { MedicalReviewBadge, MedicalReviewJsonLd } from "@/components/medical-review-badge";
import { MedicalReferences } from "@/components/medical-references";
import { LocaleLink } from "@/lib/LocaleLink";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { canAccessTier, getTierPricingPath, getTierLabel } from "@/lib/access";
import { PARENT_EDUCATIONAL_ORG } from "@/lib/structured-data";
import {
  ArrowLeft, Microscope, AlertCircle, Stethoscope, Pill, Lightbulb, FileText,
  Lock, BookOpen, ChevronRight, Heart, Activity, Search, ClipboardList,
  ShieldAlert, Loader2, ArrowRight, GraduationCap, ExternalLink, Sparkles,
} from "lucide-react";
import { FixedLessonNav } from "@/components/fixed-lesson-nav";
import { AutoRelatedContent } from "@/components/auto-related-content";

import { useI18n } from "@/lib/i18n";
function stripTierFromTitle(title: string): string {
  const { t } = useI18n();
  return title
    .replace(/^(RN|NP|RPN|LVN|NCLEX|NCLEX-RN|NCLEX-PN|REx-PN)\s+/i, "")
    .replace(/\s+\((RN|NP|RPN|LVN|NCLEX|RPN\/LVN|RPN\/RN)\)$/i, "")
    .trim();
}

function buildMedicalConditionSD(lesson: any) {
  const displayTitle = stripTierFromTitle(lesson.title);
  return {
    "@context": "https://schema.org",
    "@type": "MedicalCondition",
    "name": displayTitle,
    "description": lesson.seoDescription || lesson.summary || `Clinical nursing lesson about ${displayTitle}`,
    "signOrSymptom": Array.isArray(lesson.signsSymptoms) ? lesson.signsSymptoms.slice(0, 5).map((s: string) => ({
      "@type": "MedicalSignOrSymptom",
      "name": s,
    })) : [],
    "possibleTreatment": Array.isArray(lesson.treatment) ? lesson.treatment.slice(0, 3).map((t: string) => ({
      "@type": "MedicalTherapy",
      "name": t,
    })) : [],
  };
}

function buildFAQSD(lesson: any) {
  const faqs: { question: string; answer: string }[] = [];
  const displayTitle = stripTierFromTitle(lesson.title);
  if (lesson.definition) {
    faqs.push({ question: `What is ${displayTitle}?`, answer: lesson.definition });
  }
  if (lesson.pathophysiology) {
    faqs.push({ question: `What is the pathophysiology of ${displayTitle}?`, answer: lesson.pathophysiology.slice(0, 300) });
  }
  if (Array.isArray(lesson.signsSymptoms) && lesson.signsSymptoms.length > 0) {
    faqs.push({ question: `What are the signs and symptoms of ${displayTitle}?`, answer: lesson.signsSymptoms.slice(0, 5).join(", ") });
  }
  if (Array.isArray(lesson.diagnostics) && lesson.diagnostics.length > 0 && faqs.length < 5) {
    faqs.push({ question: `How is ${displayTitle} diagnosed?`, answer: `Key diagnostic findings include: ${lesson.diagnostics.slice(0, 4).join("; ")}.` });
  }
  if (Array.isArray(lesson.treatment) && lesson.treatment.length > 0 && faqs.length < 5) {
    faqs.push({ question: `What is the treatment for ${displayTitle}?`, answer: `Treatment approaches include: ${lesson.treatment.slice(0, 4).join("; ")}.` });
  }
  if (Array.isArray(lesson.nursingInterventions) && lesson.nursingInterventions.length > 0 && faqs.length < 5) {
    faqs.push({ question: `What are the key nursing interventions for ${displayTitle}?`, answer: `Priority nursing interventions: ${lesson.nursingInterventions.slice(0, 4).join("; ")}.` });
  }
  if (Array.isArray(lesson.complications) && lesson.complications.length > 0 && faqs.length < 5) {
    faqs.push({ question: `What are the complications of ${displayTitle}?`, answer: `Potential complications include: ${lesson.complications.slice(0, 4).join("; ")}.` });
  }
  if (faqs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.slice(0, 5).map(f => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": { "@type": "Answer", "text": f.answer },
    })),
  };
}

function buildEducationalSD(lesson: any) {
  const displayTitle = stripTierFromTitle(lesson.title);
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": displayTitle,
    "description": lesson.seoDescription || lesson.summary || `Nursing lesson on ${displayTitle}`,
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
    "courseMode": "online",
    "isAccessibleForFree": lesson.tier === "free",
    "inLanguage": "en",
    "url": `https://www.nursenest.ca/lessons/${lesson.slug}`,
  };
}

function buildArticleSD(lesson: any) {
  const displayTitle = stripTierFromTitle(lesson.title);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": displayTitle,
    "description": lesson.seoDescription || lesson.summary || `Clinical nursing lesson about ${displayTitle}`,
    "author": {
      "@type": "EducationalOrganization",
      "name": "NurseNest",
      "url": "https://www.nursenest.ca",
    },
    "publisher": {
      "@type": "EducationalOrganization",
      "name": "NurseNest",
      "url": "https://www.nursenest.ca",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.nursenest.ca/brand-logo.gif",
      },
    },
    "dateModified": new Date().toISOString().split("T")[0],
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://www.nursenest.ca/lessons/${lesson.slug}`,
    },
    "articleSection": lesson.category || "Nursing Education",
    "inLanguage": "en",
  };
}

interface SeoLessonData {
  id: string;
  slug: string;
  title: string;
  category: string | null;
  subCategory: string | null;
  tier: string;
  status: string;
  summary: string | null;
  definition: string | null;
  pathophysiology: string | null;
  signsSymptoms: string[];
  diagnostics: string[];
  treatment: string[];
  nursingInterventions: string[];
  complications: string[];
  clinicalPearls: string[];
  references: string[];
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string[];
  imageUrl: string | null;
  imageAlt: string | null;
  relatedLessonSlugs: string[];
  isPublicPreview: boolean;
}

function SectionList({ items, icon: Icon, iconColor, bgColor, title, testId }: {
  items: string[];
  icon: any;
  iconColor: string;
  bgColor: string;
  title: string;
  testId: string;
}) {
  if (!items || items.length === 0) return null;
  return (
    <section className="space-y-4" data-testid={testId}>
      <div className="flex items-center gap-3">
        <Icon className={`w-6 h-6 ${iconColor}`} />
        <h2 className="text-xl font-bold text-gray-900 font-['DM_Sans']">{title}</h2>
      </div>
      <Card className={`border-none shadow-sm ${bgColor}`}>
        <CardContent className="p-6">
          <ul className="space-y-2">
            {items.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-700">
                <ChevronRight className="w-4 h-4 mt-1 shrink-0 text-gray-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </section>
  );
}

export function SeoLessonDetail({ lesson, related }: { lesson: SeoLessonData; related: any[] }) {
  const { user } = useAuth();
  const displayTitle = stripTierFromTitle(lesson.title);
  const isLocked = lesson.isPublicPreview === true;
  const hasAccess = !isLocked;

  const seoTitle = lesson.seoTitle || `${displayTitle} - NurseNest Nursing Lesson`;
  const seoDesc = lesson.seoDescription || lesson.summary || `Learn about ${displayTitle}: pathophysiology, signs & symptoms, diagnostics, treatment, and nursing interventions.`;

  const lessonWordCount = [
    lesson.definition || "",
    lesson.pathophysiology || "",
    ...(lesson.signsSymptoms || []),
    ...(lesson.diagnostics || []),
    ...(lesson.treatment || []),
    ...(lesson.nursingInterventions || []),
    ...(lesson.complications || []),
    ...(lesson.clinicalPearls || []),
  ].join(" ").split(/\s+/).filter(Boolean).length;
  const isThin = lessonWordCount < 150 || (!lesson.definition && (!lesson.signsSymptoms || lesson.signsSymptoms.length === 0) && (!lesson.treatment || lesson.treatment.length === 0));

  const structuredData = [
    buildMedicalConditionSD(lesson),
    buildEducationalSD(lesson),
    buildArticleSD(lesson),
  ];
  const faqSD = buildFAQSD(lesson);
  if (faqSD) structuredData.push(faqSD);

  return (
    <div className="min-h-screen bg-[#faf9f7] flex flex-col font-['DM_Sans'] text-gray-900">
      <SEO
        title={seoTitle}
        description={seoDesc}
        keywords={lesson.seoKeywords?.join(", ")}
        canonicalPath={`/lessons/${lesson.slug}`}
        ogType="article"
        noindex={isThin}
      />
      {structuredData.map((sd, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(sd) }} />
      ))}
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 py-8 w-full space-y-8" data-testid="seo-lesson-detail">
        <LocaleLink href="/lessons">
          <Button variant="ghost" className="mb-2 group text-gray-600 hover:text-gray-900" data-testid="button-back-lessons">
            <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Lessons
          </Button>
        </LocaleLink>

        <div className="space-y-4">
          {lesson.category && (
            <Badge variant="secondary" className="text-xs uppercase tracking-wider" data-testid="badge-category">
              {lesson.category}
            </Badge>
          )}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight" data-testid="text-lesson-title">
            {displayTitle}
          </h1>
          {lesson.summary && (
            <p className="text-lg text-gray-600 leading-relaxed" data-testid="text-lesson-summary">{lesson.summary}</p>
          )}
          {lesson.tier && lesson.tier !== "free" && (
            <Badge className="bg-amber-100 text-amber-800 border-amber-200">
              {lesson.tier.toUpperCase()} Tier
            </Badge>
          )}
        </div>

        {lesson.imageUrl && (
          <div className="rounded-2xl overflow-hidden shadow-sm bg-gray-50" style={{ aspectRatio: "16/9", minHeight: "200px" }} data-testid="img-lesson-header">
            <img
              src={lesson.imageUrl}
              alt={lesson.imageAlt || `Clinical illustration of ${displayTitle}`}
              className="w-full h-full object-contain"
              loading="lazy"
              decoding="async"
            />
          </div>
        )}

        {isLocked && (
          <>
            {lesson.definition && (
              <section className="space-y-4" data-testid="section-definition-preview">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-bold text-gray-900">{t("pages.seoLessonDetail.definition")}</h2>
                </div>
                <Card className="border-none shadow-sm bg-blue-50/60">
                  <CardContent className="p-6">
                    <p className="text-gray-700 leading-relaxed">{lesson.definition}</p>
                  </CardContent>
                </Card>
              </section>
            )}
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-white shadow-lg">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Lock className="w-7 h-7 text-primary/70" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{t("pages.seoLessonDetail.unlockFullLesson")}</h3>
                <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                  Access the complete {displayTitle} lesson including pathophysiology, signs & symptoms, diagnostics, treatment, and nursing interventions with a {getTierLabel(lesson.tier)} subscription.
                </p>
                <LocaleLink href={getTierPricingPath(lesson.tier)}>
                  <Button className="bg-primary hover:brightness-110 text-white rounded-full px-8 gap-2 shadow-lg shadow-primary/20" data-testid="button-upgrade">
                    <Sparkles className="w-4 h-4" />
                    Upgrade to {getTierLabel(lesson.tier)}
                  </Button>
                </LocaleLink>
              </CardContent>
            </Card>
          </>
        )}

        {!isLocked && (
          <div className="space-y-10">
            {lesson.definition && (
              <section className="space-y-4" data-testid="section-definition">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-bold text-gray-900">{t("pages.seoLessonDetail.definition2")}</h2>
                </div>
                <Card className="border-none shadow-sm bg-blue-50/60">
                  <CardContent className="p-6">
                    <p className="text-gray-700 leading-relaxed">{lesson.definition}</p>
                  </CardContent>
                </Card>
              </section>
            )}

            {lesson.pathophysiology && (
              <section className="space-y-4" data-testid="section-pathophysiology">
                <div className="flex items-center gap-3">
                  <Microscope className="w-6 h-6 text-purple-600" />
                  <h2 className="text-xl font-bold text-gray-900">{t("pages.seoLessonDetail.pathophysiology")}</h2>
                </div>
                <Card className="border-none shadow-sm bg-purple-50/60">
                  <CardContent className="p-6">
                    <p className="text-gray-700 leading-relaxed">{lesson.pathophysiology}</p>
                  </CardContent>
                </Card>
              </section>
            )}

            <SectionList
              items={lesson.signsSymptoms}
              icon={AlertCircle}
              iconColor="text-orange-500"
              bgColor="bg-orange-50/60"
              title={t("pages.seoLessonDetail.signsSymptoms")}
              testId="section-signs-symptoms"
            />

            <SectionList
              items={lesson.diagnostics}
              icon={Search}
              iconColor="text-cyan-600"
              bgColor="bg-cyan-50/60"
              title={t("pages.seoLessonDetail.diagnostics")}
              testId="section-diagnostics"
            />

            <SectionList
              items={lesson.treatment}
              icon={Pill}
              iconColor="text-emerald-600"
              bgColor="bg-emerald-50/60"
              title={t("pages.seoLessonDetail.treatment")}
              testId="section-treatment"
            />

            <SectionList
              items={lesson.nursingInterventions}
              icon={Stethoscope}
              iconColor="text-violet-600"
              bgColor="bg-violet-50/60"
              title={t("pages.seoLessonDetail.nursingInterventions")}
              testId="section-nursing-interventions"
            />

            <SectionList
              items={lesson.complications}
              icon={ShieldAlert}
              iconColor="text-red-500"
              bgColor="bg-red-50/60"
              title={t("pages.seoLessonDetail.complications")}
              testId="section-complications"
            />

            {lesson.clinicalPearls && lesson.clinicalPearls.length > 0 && (
              <section className="space-y-4" data-testid="section-clinical-pearls">
                <div className="flex items-center gap-3">
                  <Lightbulb className="w-6 h-6 text-yellow-500" />
                  <h2 className="text-xl font-bold text-gray-900">{t("pages.seoLessonDetail.clinicalPearls")}</h2>
                </div>
                <div className="space-y-3">
                  {lesson.clinicalPearls.map((pearl, i) => (
                    <Card key={i} className="border-none shadow-sm bg-yellow-50/60 border-l-4 border-l-yellow-400">
                      <CardContent className="p-4 flex items-start gap-3">
                        <Lightbulb className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                        <p className="text-gray-700">{pearl}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {lesson.references && lesson.references.length > 0 && (
              <section className="space-y-4" data-testid="section-references">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-gray-500" />
                  <h2 className="text-xl font-bold text-gray-900">{t("pages.seoLessonDetail.references")}</h2>
                </div>
                <Card className="border-none shadow-sm bg-gray-50">
                  <CardContent className="p-6">
                    <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                      {lesson.references.map((ref, i) => (
                        <li key={i}>{ref}</li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
              </section>
            )}
          </div>
        )}

        {related && related.length > 0 && (
          <section className="space-y-4 pt-6 border-t border-gray-200" data-testid="section-related-lessons">
            <div className="flex items-center gap-3">
              <GraduationCap className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">{t("pages.seoLessonDetail.relatedLessons")}</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {related.map((r: any) => (
                <LocaleLink key={r.slug} href={`/lessons/${r.slug}`}>
                  <Card className="border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full" data-testid={`card-related-${r.slug}`}>
                    <CardContent className="p-5 space-y-2">
                      <p className="font-semibold text-gray-900 line-clamp-2">{stripTierFromTitle(r.title)}</p>
                      {r.category && (
                        <Badge variant="outline" className="text-xs">{r.category}</Badge>
                      )}
                      {r.summary && (
                        <p className="text-sm text-gray-500 line-clamp-2">{r.summary}</p>
                      )}
                      <div className="flex items-center text-sm text-blue-600 font-medium pt-1">
                        Read Lesson <ArrowRight className="w-4 h-4 ml-1" />
                      </div>
                    </CardContent>
                  </Card>
                </LocaleLink>
              ))}
            </div>
          </section>
        )}

        <AutoRelatedContent
          slug={lesson.slug}
          contentType="lesson"
          title={lesson.title}
          bodySystem={lesson.category || undefined}
          category={lesson.category || undefined}
          className="pt-6 border-t border-gray-200"
          sectionTitle="Related Lessons, Articles & Practice"
        />

        <section className="space-y-3 pt-4" data-testid="section-internal-links">
          <div className="flex flex-wrap gap-3">
            <LocaleLink href={`/flashcards`}>
              <Button variant="outline" className="gap-2 text-sm" data-testid="link-flashcards">
                <BookOpen className="w-4 h-4" /> Study Flashcards
              </Button>
            </LocaleLink>
            <LocaleLink href={`/practice-questions`}>
              <Button variant="outline" className="gap-2 text-sm" data-testid="link-practice-questions">
                <ClipboardList className="w-4 h-4" /> Practice Questions
              </Button>
            </LocaleLink>
            <LocaleLink href="/lessons">
              <Button variant="outline" className="gap-2 text-sm" data-testid="link-all-lessons">
                <GraduationCap className="w-4 h-4" /> All Lessons
              </Button>
            </LocaleLink>
          </div>
        </section>
      </main>
      <div className="max-w-4xl mx-auto px-4 mt-10">
        <div className="grid sm:grid-cols-2 gap-4">
          <MedicalReviewBadge />
          <MedicalReferences lessonId={lesson.slug} />
        </div>
        <MedicalReviewJsonLd
          title={lesson.title}
          slug={lesson.slug}
          description={lesson.seoDescription || lesson.summary || undefined}
        />
      </div>
      <FixedLessonNav lessonId={lesson.slug} />
      <div className="pb-14" />
      <Footer />
    </div>
  );
}

export default function SeoLessonPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const [lesson, setLesson] = useState<SeoLessonData | null>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/seo-lessons/${slug}`)
      .then(res => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then(data => {
        setLesson(data.lesson);
        setRelated(data.related || []);
        setLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf9f7] flex flex-col font-['DM_Sans']">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </main>
        <Footer />
      </div>
    );
  }

  if (notFound || !lesson) {
    return null;
  }

  return <SeoLessonDetail lesson={lesson} related={related} />;
}
