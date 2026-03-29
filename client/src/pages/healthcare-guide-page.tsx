import { useParams } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { useState, useMemo } from "react";
import { LocaleLink } from "@/lib/LocaleLink";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { buildFaqStructuredData, PARENT_EDUCATIONAL_ORG } from "@/lib/structured-data";
import { renderTextWithContextualLinks, createContextualLinkTracker } from "@/lib/contextual-links";
import {
  getHealthcareGuideBySlug,
  HEALTHCARE_GUIDES,
  type HealthcareGuide,
} from "@shared/healthcare-guide-data";

const GUIDE_TO_PREVIEW_SLUG: Record<string, string> = {
  "icu-nursing-ultimate-guide": "icu",
  "nicu-nursing-ultimate-guide": "nicu",
  "trauma-nursing-ultimate-guide": "emergency-nursing",
  "med-surg-nursing-ultimate-guide": "med-surg",
  "mental-health-nursing-ultimate-guide": "mental-health",
  "orthopedic-nursing-ultimate-guide": "orthopedic",
  "nephrology-nursing-ultimate-guide": "renal",
  "palliative-care-nursing-ultimate-guide": "palliative-care",
};
import { AUTHORITY_GUIDES } from "@shared/guide-data";
import { getClusterPagesForParent } from "@/data/icu-cluster-data";
import { EndOfContentLeadCapture } from "@/components/lead-capture";
import {
  BookOpen, ChevronDown, ArrowRight, HelpCircle,
  Stethoscope, Activity, FileText, Brain, Pill,
  Briefcase, Award, Target, Heart, Image,
  GraduationCap, Users, Layers, ClipboardList,
  AlertTriangle, Star, MapPin, DollarSign, TrendingUp,
  Play, Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { useI18n } from "@/lib/i18n";
function TableOfContents({ guide, hasClusterPages }: { guide: HealthcareGuide; hasClusterPages?: boolean }) {
  const { t } = useI18n();
  const sections = [
    { id: "introduction", title: "Introduction" },
    ...(guide.whatYouWillLearn && guide.whatYouWillLearn.length > 0 ? [{ id: "what-you-will-learn", title: "What You Will Learn" }] : []),
    ...(guide.spokeGuides && guide.spokeGuides.length > 0 ? [{ id: "topic-guides", title: "In-Depth Topic Guides" }] : []),
    ...(hasClusterPages ? [{ id: "cluster-topics", title: "Deep Dive Topics" }] : []),
    ...(guide.conditions.length > 0 ? [{ id: "conditions", title: "Key Conditions & Clinical Topics" }] : []),
    ...(guide.clinicalSkills.length > 0 ? [{ id: "clinical-skills", title: "Important Clinical Skills" }] : []),
    ...(guide.procedures.length > 0 ? [{ id: "procedures", title: "Common Procedures & Equipment" }] : []),
    ...(guide.medications.length > 0 ? [{ id: "medications", title: "Medications Frequently Used" }] : []),
    ...(guide.subSections?.map(s => ({ id: s.id, title: s.title })) || []),
    ...(guide.scenarios.length > 0 ? [{ id: "scenarios", title: "Clinical Scenarios" }] : []),
    ...(guide.practiceQuestionsLinks && guide.practiceQuestionsLinks.length > 0 ? [{ id: "practice-questions", title: "Practice Questions" }] : []),
    ...(guide.flashcardLinks && guide.flashcardLinks.length > 0 ? [{ id: "flashcard-review", title: "Flashcard Review" }] : []),
    { id: "career-overview", title: "Career Overview" },
    { id: "faq", title: "Frequently Asked Questions" },
    ...(guide.relatedGuides.length > 0 ? [{ id: "related-guides", title: "Related Nursing Specialties" }] : []),
  ];

  return (
    <nav className="bg-white rounded-xl border border-gray-200 p-5 sticky top-24" data-testid="nav-healthcare-guide-toc">
      <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <BookOpen className="w-4 h-4" style={{ color: guide.color }} /> Table of Contents
      </h3>
      <ul className="space-y-1.5">
        {sections.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors block py-0.5 border-l-2 border-transparent hover:border-gray-400 pl-3"
              data-testid={`toc-link-${item.id}`}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function SectionHeading({ id, title, icon: Icon, color }: { id: string; title: string; icon: any; color: string }) {
  return (
    <h2 id={id} className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3 scroll-mt-24" data-testid={`heading-${id}`}>
      <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}15` }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      {title}
    </h2>
  );
}

function ImagePlaceholder({ alt, caption }: { alt: string; caption: string }) {
  return (
    <div className="my-6 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-8 text-center" data-testid="img-placeholder">
      <Image className="w-10 h-10 mx-auto mb-3 text-gray-300" />
      <p className="text-sm text-gray-400 italic mb-1">{alt}</p>
      <p className="text-xs text-gray-400">{caption}</p>
    </div>
  );
}

function CtaBanner({ variant, color, guideSlug }: { variant: "questions" | "flashcards" | "signup"; color: string; guideSlug?: string }) {
  const previewSlug = guideSlug ? GUIDE_TO_PREVIEW_SLUG[guideSlug] : undefined;
  const questionsHref = previewSlug ? `/preview/${previewSlug}` : "/free-practice";
  const configs = {
    questions: {
      title: "Ready to Test Your Knowledge?",
      description: "Practice with exam-style questions and detailed clinical rationales.",
      buttonText: "Start Practice Questions",
      href: questionsHref,
    },
    flashcards: {
      title: "Review Key Concepts",
      description: "Reinforce your learning with spaced-repetition flashcards.",
      buttonText: "Review Flashcards",
      href: "/flashcards",
    },
    signup: {
      title: "Create a Free Account",
      description: "Access practice questions, flashcards, and personalized study tools.",
      buttonText: "Get Started Free",
      href: "/start-free",
    },
  };
  const config = configs[variant];

  return (
    <div className="my-8 rounded-xl p-6 text-center" style={{ backgroundColor: `${color}10`, borderLeft: `4px solid ${color}` }} data-testid={`cta-${variant}`}>
      <h3 className="text-lg font-bold text-gray-900 mb-1">{config.title}</h3>
      <p className="text-sm text-gray-600 mb-4">{config.description}</p>
      <LocaleLink href={config.href}>
        <Button className="text-white" style={{ backgroundColor: color }} data-testid={`button-cta-${variant}`}>
          {config.buttonText} <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </LocaleLink>
    </div>
  );
}

export default function HealthcareGuidePage() {
  const params = useParams<{ slug: string }>();
  const guide = getHealthcareGuideBySlug(params.slug || "");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  if (!guide) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4" data-testid="text-guide-not-found">{t("pages.healthcareGuidePage.guideNotFound")}</h1>
          <p className="text-gray-600 mb-6">{t("pages.healthcareGuidePage.theGuideYouAreLooking")}</p>
          <LocaleLink href="/guides">
            <Button data-testid="button-back-to-guides">{t("pages.healthcareGuidePage.browseAllGuides")}</Button>
          </LocaleLink>
        </div>
        <Footer />
      </div>
    );
  }

  const linkTracker = useMemo(() => createContextualLinkTracker(), [guide.slug]);

  const sectionImages = guide.imagePlaceholders.reduce((acc, img) => {
    if (!acc[img.section]) acc[img.section] = [];
    acc[img.section].push(img);
    return acc;
  }, {} as Record<string, typeof guide.imagePlaceholders>);

  const faqStructuredData = buildFaqStructuredData(
    guide.faqs.map(f => ({ question: f.question, answer: f.answer }))
  );

  const medicalWebPageData = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "headline": guide.title,
    "description": guide.metaDescription,
    "author": {
      "@type": "EducationalOrganization",
      "name": "NurseNest",
      "url": "https://www.nursenest.ca",
    },
    "publisher": {
      "@type": "EducationalOrganization",
      "name": "NurseNest",
      "url": "https://www.nursenest.ca",
      "parentOrganization": {
        "@type": "EducationalOrganization",
        "name": PARENT_EDUCATIONAL_ORG.name,
        "url": PARENT_EDUCATIONAL_ORG.url,
      },
    },
    "datePublished": "2025-06-01",
    "dateModified": new Date().toISOString().split("T")[0],
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://www.nursenest.ca/guides/${guide.slug}`,
    },
    "medicalAudience": {
      "@type": "MedicalAudience",
      "audienceType": guide.category === "nursing-specialty" ? "Nurse" : "HealthcareProfessional",
    },
    "specialty": guide.category === "nursing-specialty" ? "Nursing" : "Allied Health",
  };

  const hubGuide = guide.hubGuideSlug ? getHealthcareGuideBySlug(guide.hubGuideSlug) : null;
  const isSpokePage = !!guide.hubGuideSlug;

  const breadcrumbItems = isSpokePage && hubGuide
    ? [
        { name: "Home", url: "https://www.nursenest.ca" },
        { name: "Guides", url: "https://www.nursenest.ca/guides" },
        { name: hubGuide.title, url: `https://www.nursenest.ca/guides/${hubGuide.slug}` },
        { name: guide.title, url: `https://www.nursenest.ca/guides/${guide.slug}` },
      ]
    : [
        { name: "Home", url: "https://www.nursenest.ca" },
        { name: "Guides", url: "https://www.nursenest.ca/guides" },
        { name: guide.title, url: `https://www.nursenest.ca/guides/${guide.slug}` },
      ];

  const relatedGuides = HEALTHCARE_GUIDES.filter(g => guide.relatedGuides.includes(g.slug));
  const previewSlug = GUIDE_TO_PREVIEW_SLUG[guide.slug];
  const clusterPages = getClusterPagesForParent(guide.slug);

  const ctaBaseGuide = hubGuide || guide;
  const specialtySlug = ctaBaseGuide.slug.replace(/-ultimate-guide$/, "").replace(/-guide$/, "").replace(/-nursing$/, "");

  return (
    <div className="min-h-screen bg-gray-50" data-testid={`healthcare-guide-${guide.slug}`}>
      <Navigation />
      <SEO
        title={guide.metaTitle}
        description={guide.metaDescription}
        keywords={guide.keywords}
        canonicalPath={`/guides/${guide.slug}`}
        structuredData={medicalWebPageData}
        additionalStructuredData={[faqStructuredData]}
        breadcrumbs={breadcrumbItems}
      />

      <section className="relative py-14 sm:py-18 overflow-hidden" data-testid="section-hero">
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${guide.colorAccent}60, white, ${guide.colorAccent}30)` }} />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <BreadcrumbNav items={breadcrumbItems} />
          <div className="mt-6 max-w-3xl">
            <Badge className="mb-4 text-white" style={{ backgroundColor: guide.color }} data-testid="badge-guide-category">
              {guide.category === "nursing-specialty" ? (
                <><Stethoscope className="w-3 h-3 mr-1" /> {t("pages.healthcareGuidePage.nursingSpecialtyGuide")}</>
              ) : (
                <><Briefcase className="w-3 h-3 mr-1" /> {t("pages.healthcareGuidePage.alliedHealthCareerGuide")}</>
              )}
            </Badge>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight" data-testid="text-guide-title">
              {guide.title}
            </h1>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed" data-testid="text-guide-subtitle">
              {guide.metaDescription}
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              {previewSlug && (
                <LocaleLink href={`/preview/${previewSlug}`}>
                  <Button className="text-white" style={{ backgroundColor: guide.color }} data-testid="button-hero-practice-questions">
                    Start Practice Questions <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </LocaleLink>
              )}
              {previewSlug && (
                <LocaleLink href={`/lessons/${previewSlug}`}>
                  <Button variant="outline" className="border-gray-300" data-testid="button-hero-explore-lessons">
                    <FileText className="w-4 h-4 mr-2" /> Explore Lessons
                  </Button>
                </LocaleLink>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <Badge variant="outline" className="text-xs border-gray-300">
                <ClipboardList className="w-3 h-3 mr-1" /> Clinical Conditions
              </Badge>
              <Badge variant="outline" className="text-xs border-gray-300">
                <Activity className="w-3 h-3 mr-1" /> Skills & Procedures
              </Badge>
              <Badge variant="outline" className="text-xs border-gray-300">
                <Pill className="w-3 h-3 mr-1" /> Medications
              </Badge>
              <Badge variant="outline" className="text-xs border-gray-300">
                <Brain className="w-3 h-3 mr-1" /> Clinical Scenarios
              </Badge>
              <Badge variant="outline" className="text-xs border-gray-300">
                <Briefcase className="w-3 h-3 mr-1" /> Career Overview
              </Badge>
            </div>
            <div className="flex flex-wrap gap-3 mt-8">
              <LocaleLink href={`/preview/${specialtySlug}`}>
                <Button className="text-white px-5 py-2.5 font-semibold" style={{ backgroundColor: guide.color }} data-testid="button-hero-preview">
                  <Play className="w-4 h-4 mr-2" /> Try Free Preview
                </Button>
              </LocaleLink>
              <LocaleLink href={`/lessons/${specialtySlug}`}>
                <Button variant="outline" className="px-5 py-2.5 font-semibold border-gray-300 hover:bg-white" data-testid="button-hero-lessons">
                  <Sparkles className="w-4 h-4 mr-2" /> Browse Lessons
                </Button>
              </LocaleLink>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="hidden lg:block lg:w-64 shrink-0">
            <TableOfContents guide={guide} hasClusterPages={clusterPages.length > 0} />
          </div>

          <div className="flex-1 min-w-0">
            {isSpokePage && hubGuide && (
              <div className="mb-6 bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-center gap-3" data-testid="link-back-to-hub">
                <ArrowRight className="w-4 h-4 text-blue-600 rotate-180 shrink-0" />
                <p className="text-sm text-blue-800">
                  This guide is part of our{" "}
                  <LocaleLink href={`/guides/${hubGuide.slug}`} className="font-semibold text-blue-700 underline hover:text-blue-900" data-testid="link-hub-guide">
                    {hubGuide.title}
                  </LocaleLink>
                  {" "}topic cluster.
                </p>
              </div>
            )}

            <section id="introduction" className="mb-12 scroll-mt-24" data-testid="section-introduction">
              {guide.seoIntro && (
                <p className="text-gray-700 leading-relaxed text-base font-medium mb-4">
                  {renderTextWithContextualLinks(guide.seoIntro, guide.contextualLinks, linkTracker)}
                </p>
              )}
              <p className="text-gray-700 leading-relaxed text-base">
                {renderTextWithContextualLinks(guide.introduction, guide.contextualLinks, linkTracker)}
              </p>
            </section>

            {guide.whatYouWillLearn && guide.whatYouWillLearn.length > 0 && (
            <section id="what-you-will-learn" className="mb-12 scroll-mt-24" data-testid="section-what-you-will-learn">
              <SectionHeading id="what-you-will-learn-heading" title={t("pages.healthcareGuidePage.whatYouWillLearnIn")} icon={GraduationCap} color={guide.color} />
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <ul className="space-y-3">
                  {guide.whatYouWillLearn.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-700" data-testid={`learn-item-${i}`}>
                      <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: `${guide.color}15` }}>
                        <Target className="w-3.5 h-3.5" style={{ color: guide.color }} />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
            )}

            {guide.spokeGuides && guide.spokeGuides.length > 0 && (
              <section id="topic-guides" className="mb-12 scroll-mt-24" data-testid="section-spoke-guides">
                <SectionHeading id="topic-guides-heading" title={t("pages.healthcareGuidePage.indepthTopicGuides")} icon={BookOpen} color={guide.color} />
                <p className="text-sm text-gray-600 mb-4">
                  Explore detailed sub-topic guides that dive deeper into key areas of {guide.title.replace(" Ultimate Guide", "")} practice.
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {guide.spokeGuides.map((spoke) => (
                    <LocaleLink key={spoke.slug} href={`/guides/${spoke.slug}`}>
                      <Card className="h-full hover:shadow-md hover:border-gray-300 transition-all cursor-pointer group" data-testid={`card-spoke-${spoke.slug}`}>
                        <CardContent className="p-5">
                          <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: `${guide.color}15` }}>
                              <BookOpen className="w-4 h-4" style={{ color: guide.color }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-blue-700 transition-colors">
                                {spoke.title}
                              </h3>
                              <p className="text-xs text-gray-500 line-clamp-2">{spoke.description}</p>
                              <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 mt-2">
                                Read Guide <ArrowRight className="w-3 h-3" />
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </LocaleLink>
                  ))}
                </div>
              </section>
            )}

            {clusterPages.length > 0 && (
              <section id="cluster-topics" className="mb-12 scroll-mt-24" data-testid="section-cluster-topics">
                <SectionHeading id="cluster-heading" title={t("pages.healthcareGuidePage.deepDiveTopics")} icon={Layers} color={guide.color} />
                <p className="text-sm text-gray-600 mb-4">{t("pages.healthcareGuidePage.exploreIndepthGuidesOnSpecific")}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {clusterPages.map((cp) => (
                    <LocaleLink key={cp.slug} href={`/guides/${guide.slug}/${cp.slug}`}>
                      <Card className="h-full hover:shadow-md hover:border-gray-300 transition-all cursor-pointer group" data-testid={`card-cluster-${cp.slug}`}>
                        <CardContent className="p-4 flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${guide.color}15` }}>
                            <Layers className="w-4 h-4" style={{ color: guide.color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 group-hover:text-blue-700 transition-colors">{cp.title}</p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 shrink-0" />
                        </CardContent>
                      </Card>
                    </LocaleLink>
                  ))}
                </div>
              </section>
            )}

            {guide.conditions.length > 0 && (
              <section id="conditions" className="mb-12 scroll-mt-24" data-testid="section-conditions">
                <SectionHeading id="conditions-heading" title={t("pages.healthcareGuidePage.keyConditionsClinicalTopics")} icon={ClipboardList} color={guide.color} />
                <div className="space-y-6">
                  {guide.conditions.map((condition, i) => (
                    <Card key={i} className="overflow-hidden" data-testid={`card-condition-${i}`}>
                      <CardContent className="p-5">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{condition.name}</h3>
                        <p className="text-sm text-gray-600 mb-3">{renderTextWithContextualLinks(condition.description, guide.contextualLinks, linkTracker)}</p>
                        <ul className="space-y-1.5">
                          {condition.keyPoints.map((point, j) => (
                            <li key={j} className="flex items-start gap-2 text-sm text-gray-700">
                              <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ backgroundColor: guide.color }} />
                              {point}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {sectionImages["conditions"]?.map((img, i) => (
                  <ImagePlaceholder key={i} alt={img.alt} caption={img.caption} />
                ))}
              </section>
            )}

            <CtaBanner variant="questions" color={guide.color} guideSlug={guide.slug} />

            {guide.clinicalSkills.length > 0 && (
              <section id="clinical-skills" className="mb-12 scroll-mt-24" data-testid="section-clinical-skills">
                <SectionHeading id="skills-heading" title={t("pages.healthcareGuidePage.importantClinicalSkills")} icon={Activity} color={guide.color} />
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <ol className="space-y-3">
                    {guide.clinicalSkills.map((skill, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-gray-700" data-testid={`skill-item-${i}`}>
                        <span className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold text-white shrink-0 mt-0.5" style={{ backgroundColor: guide.color }}>
                          {i + 1}
                        </span>
                        {skill}
                      </li>
                    ))}
                  </ol>
                </div>
                {sectionImages["clinicalSkills"]?.map((img, i) => (
                  <ImagePlaceholder key={i} alt={img.alt} caption={img.caption} />
                ))}
              </section>
            )}

            {guide.procedures.length > 0 && (
              <section id="procedures" className="mb-12 scroll-mt-24" data-testid="section-procedures">
                <SectionHeading id="procedures-heading" title={t("pages.healthcareGuidePage.commonProceduresEquipment")} icon={Target} color={guide.color} />
                <div className="grid gap-4">
                  {guide.procedures.map((proc, i) => (
                    <div key={i} className="bg-white rounded-xl border border-gray-200 p-5" data-testid={`card-procedure-${i}`}>
                      <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: guide.color }} />
                        {proc.name}
                      </h3>
                      <p className="text-sm text-gray-600">{renderTextWithContextualLinks(proc.description, guide.contextualLinks, linkTracker)}</p>
                    </div>
                  ))}
                </div>
                {sectionImages["procedures"]?.map((img, i) => (
                  <ImagePlaceholder key={i} alt={img.alt} caption={img.caption} />
                ))}
              </section>
            )}

            {guide.medications.length > 0 && (
              <section id="medications" className="mb-12 scroll-mt-24" data-testid="section-medications">
                <SectionHeading id="medications-heading" title={t("pages.healthcareGuidePage.medicationsFrequentlyUsed")} icon={Pill} color={guide.color} />
                <div className="space-y-4">
                  {guide.medications.map((med, i) => (
                    <Card key={i} data-testid={`card-medication-${i}`}>
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <h3 className="font-bold text-gray-900">{med.drugClass}</h3>
                          <Badge variant="outline" className="text-xs shrink-0">{med.examples.split(",").length} drugs</Badge>
                        </div>
                        <p className="text-sm text-gray-500 mb-2"><span className="font-medium text-gray-700">{t("pages.healthcareGuidePage.examples")}</span> {med.examples}</p>
                        <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
                          <p className="text-sm text-amber-800"><span className="font-semibold">{t("pages.healthcareGuidePage.nursingConsiderations")}</span> {med.nursingConsiderations}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {sectionImages["medications"]?.map((img, i) => (
                  <ImagePlaceholder key={i} alt={img.alt} caption={img.caption} />
                ))}
              </section>
            )}

            {guide.subSections && guide.subSections.length > 0 && (
              <>
                {guide.subSections.map((sub) => (
                  <section key={sub.id} id={sub.id} className="mb-12 scroll-mt-24" data-testid={`section-${sub.id}`}>
                    <SectionHeading id={`${sub.id}-heading`} title={sub.title} icon={Star} color={guide.color} />
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      {sub.content.split("\n\n").map((paragraph, i) => (
                        <p key={i} className="text-sm text-gray-700 leading-relaxed mb-4 last:mb-0">
                          {renderTextWithContextualLinks(paragraph, guide.contextualLinks, linkTracker)}
                        </p>
                      ))}
                    </div>
                    {sectionImages[sub.id]?.map((img, i) => (
                      <ImagePlaceholder key={i} alt={img.alt} caption={img.caption} />
                    ))}
                  </section>
                ))}
              </>
            )}

            <CtaBanner variant="signup" color={guide.color} guideSlug={guide.slug} />

            {guide.scenarios.length > 0 && (
              <section id="scenarios" className="mb-12 scroll-mt-24" data-testid="section-scenarios">
                <SectionHeading id="scenarios-heading" title={t("pages.healthcareGuidePage.clinicalScenarios")} icon={Brain} color={guide.color} />
                <div className="space-y-6">
                  {guide.scenarios.map((scenario, i) => (
                    <Card key={i} className="overflow-hidden border-l-4" style={{ borderLeftColor: guide.color }} data-testid={`card-scenario-${i}`}>
                      <CardContent className="p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <AlertTriangle className="w-4 h-4" style={{ color: guide.color }} />
                          <h3 className="font-bold text-gray-900">{scenario.title}</h3>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                          <p className="text-sm font-medium text-gray-800 mb-1">{t("pages.healthcareGuidePage.patientPresentation")}</p>
                          <p className="text-sm text-gray-600">{scenario.presentation}</p>
                        </div>
                        <p className="text-sm font-medium text-gray-800 mb-2">{t("pages.healthcareGuidePage.priorityNursingActions")}</p>
                        <ol className="space-y-2">
                          {scenario.keyActions.map((action, j) => (
                            <li key={j} className="flex items-start gap-2 text-sm text-gray-700">
                              <span className="flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold text-white shrink-0 mt-0.5" style={{ backgroundColor: guide.color }}>
                                {j + 1}
                              </span>
                              {action}
                            </li>
                          ))}
                        </ol>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {guide.practiceQuestionsLinks && guide.practiceQuestionsLinks.length > 0 && (
            <section id="practice-questions" className="mb-12 scroll-mt-24" data-testid="section-practice-questions">
              <SectionHeading id="practice-heading" title={t("pages.healthcareGuidePage.practiceQuestions")} icon={FileText} color={guide.color} />
              {guide.practiceQuestionsIntro && <p className="text-sm text-gray-600 mb-4">{guide.practiceQuestionsIntro}</p>}
              <div className="grid sm:grid-cols-2 gap-3">
                {guide.practiceQuestionsLinks.map((link, i) => (
                  <LocaleLink key={i} href={link.href}>
                    <Card className="h-full hover:shadow-md hover:border-gray-300 transition-all cursor-pointer group" data-testid={`link-practice-${i}`}>
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${guide.color}15` }}>
                          <FileText className="w-4 h-4" style={{ color: guide.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 group-hover:text-blue-700 transition-colors truncate">{link.label}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 shrink-0" />
                      </CardContent>
                    </Card>
                  </LocaleLink>
                ))}
              </div>
              <CtaBanner variant="questions" color={guide.color} guideSlug={guide.slug} />
            </section>
            )}

            {guide.flashcardLinks && guide.flashcardLinks.length > 0 && (
            <section id="flashcard-review" className="mb-12 scroll-mt-24" data-testid="section-flashcard-review">
              <SectionHeading id="flashcards-heading" title={t("pages.healthcareGuidePage.flashcardReview")} icon={Layers} color={guide.color} />
              {guide.flashcardReviewIntro && <p className="text-sm text-gray-600 mb-4">{guide.flashcardReviewIntro}</p>}
              <div className="grid sm:grid-cols-2 gap-3">
                {guide.flashcardLinks.map((link, i) => (
                  <LocaleLink key={i} href={link.href}>
                    <Card className="h-full hover:shadow-md hover:border-gray-300 transition-all cursor-pointer group" data-testid={`link-flashcard-${i}`}>
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${guide.color}15` }}>
                          <Layers className="w-4 h-4" style={{ color: guide.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 group-hover:text-blue-700 transition-colors truncate">{link.label}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 shrink-0" />
                      </CardContent>
                    </Card>
                  </LocaleLink>
                ))}
              </div>
              <CtaBanner variant="flashcards" color={guide.color} guideSlug={guide.slug} />
            </section>
            )}

            <section id="career-overview" className="mb-12 scroll-mt-24" data-testid="section-career-overview">
              <SectionHeading id="career-heading" title={t("pages.healthcareGuidePage.careerOverview")} icon={Briefcase} color={guide.color} />
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <p className="text-sm text-gray-700 leading-relaxed mb-6">{renderTextWithContextualLinks(guide.careerOverview.description, guide.contextualLinks, linkTracker)}</p>

                  <div className="grid sm:grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-4 h-4" style={{ color: guide.color }} />
                        <h4 className="text-sm font-semibold text-gray-900">{t("pages.healthcareGuidePage.salaryRange")}</h4>
                      </div>
                      <p className="text-sm text-gray-600">{guide.careerOverview.salaryRange}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4" style={{ color: guide.color }} />
                        <h4 className="text-sm font-semibold text-gray-900">{t("pages.healthcareGuidePage.jobOutlook")}</h4>
                      </div>
                      <p className="text-sm text-gray-600">{guide.careerOverview.outlook}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Award className="w-4 h-4" style={{ color: guide.color }} /> Certifications
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {guide.careerOverview.certifications.map((cert, i) => (
                        <Badge key={i} variant="outline" className="text-xs" data-testid={`badge-cert-${i}`}>{cert}</Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <MapPin className="w-4 h-4" style={{ color: guide.color }} /> Work Settings
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {guide.careerOverview.workSettings.map((setting, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: guide.color }} />
                          {setting}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="faq" className="mb-12 scroll-mt-24" data-testid="section-faq">
              <SectionHeading id="faq-heading" title={t("pages.healthcareGuidePage.frequentlyAskedQuestions")} icon={HelpCircle} color={guide.color} />
              <div className="space-y-3">
                {guide.faqs.map((faq, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                    data-testid={`faq-item-${i}`}
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-gray-50 transition-colors"
                      data-testid={`button-faq-${i}`}
                    >
                      <div className="flex items-start gap-3">
                        <HelpCircle className="w-5 h-5 mt-0.5 shrink-0" style={{ color: guide.color }} />
                        <span className="font-medium text-gray-900 text-sm">{faq.question}</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                    </button>
                    {openFaq === i && (
                      <div className="px-4 pb-4 pl-12" data-testid={`text-faq-answer-${i}`}>
                        <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {relatedGuides.length > 0 && (
              <section id="related-guides" className="mb-12 scroll-mt-24" data-testid="section-related-guides">
                <SectionHeading id="related-guides-heading" title={t("pages.healthcareGuidePage.relatedNursingSpecialties")} icon={Stethoscope} color={guide.color} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relatedGuides.map((rg) => (
                    <LocaleLink key={rg.slug} href={`/guides/${rg.slug}`}>
                      <Card className="h-full hover:shadow-md transition-all cursor-pointer group" data-testid={`card-related-${rg.slug}`}>
                        <CardContent className="p-5">
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: rg.colorAccent }}>
                            <BookOpen className="w-5 h-5" style={{ color: rg.color }} />
                          </div>
                          <h3 className="font-semibold text-gray-900 text-sm mb-2 group-hover:text-blue-700 transition-colors">
                            {rg.title}
                          </h3>
                          <p className="text-xs text-gray-500 line-clamp-2">{rg.metaDescription}</p>
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 mt-3">
                            Read Guide <ArrowRight className="w-3 h-3" />
                          </span>
                        </CardContent>
                      </Card>
                    </LocaleLink>
                  ))}
                </div>
                {guide.category === "nursing-specialty" && (
                  <div className="mt-6 text-center">
                    <LocaleLink href="/nursing-specialties">
                      <span className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors" data-testid="link-all-specialties">
                        View All Nursing Specialties <ArrowRight className="w-4 h-4" />
                      </span>
                    </LocaleLink>
                  </div>
                )}
              </section>
            )}

            <section className="mb-12" data-testid="section-guide-cta">
              <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: guide.color }}>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                  Ready to Start Your Journey?
                </h2>
                <p className="text-white/80 text-sm sm:text-base mb-6 max-w-2xl mx-auto">
                  Access practice questions, flashcards, and personalized study tools to excel in your healthcare career.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <LocaleLink href={`/preview/${GUIDE_TO_PREVIEW_SLUG[guide.slug] || "med-surg"}`}>
                    <Button className="bg-white text-gray-900 hover:bg-gray-100 px-6 py-2.5 font-semibold" data-testid="button-guide-start-questions">
                      Start Practicing Questions <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </LocaleLink>
                  <LocaleLink href="/start-free">
                    <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 px-6 py-2.5" data-testid="button-guide-create-account">
                      Create a Free Account
                    </Button>
                  </LocaleLink>
                </div>
              </div>
            </section>

            <EndOfContentLeadCapture leadMagnetType="study_guide" source={`healthcare-guide-${guide.slug}`} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export function HealthcareGuidesIndex() {
  const nursingGuides = HEALTHCARE_GUIDES.filter(g => g.category === "nursing-specialty");
  const alliedGuides = HEALTHCARE_GUIDES.filter(g => g.category === "allied-health");

  return (
    <div className="min-h-screen bg-gray-50" data-testid="healthcare-guides-index">
      <Navigation />
      <SEO
        title={t("pages.healthcareGuidePage.healthcareUltimateGuidesSpecialtyCareer")}
        description={t("pages.healthcareGuidePage.comprehensiveHealthcareGuidesCoveringNursing")}
        keywords="healthcare guides, nursing specialty guides, ICU nursing guide, paramedic career guide, respiratory therapy guide, occupational therapy guide, physical therapy guide"
        canonicalPath="/guides"
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "Healthcare Guides", url: "https://www.nursenest.ca/guides" },
        ]}
      />

      <section className="relative py-14 sm:py-18 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-white" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <BreadcrumbNav
            items={[
              { name: "Home", url: "https://www.nursenest.ca/" },
              { name: "Healthcare Guides", url: "https://www.nursenest.ca/guides" },
            ]}
          />
          <div className="mt-6 max-w-3xl">
            <Badge className="mb-4 bg-blue-100 text-blue-700" data-testid="badge-guides-hub">
              <BookOpen className="w-3 h-3 mr-1" /> Ultimate Guides
            </Badge>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4" data-testid="text-guides-title">
              Healthcare Ultimate Guides
            </h1>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed" data-testid="text-guides-subtitle">
              In-depth clinical guides covering nursing specialties and allied health professions. Each guide includes key conditions, clinical skills, procedures, medications, scenarios, practice questions, flashcards, and career overviews.
            </p>
          </div>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2" data-testid="heading-nursing-specialties">
            <Stethoscope className="w-5 h-5 text-blue-600" /> Nursing Specialty Guides
          </h2>
          <p className="text-sm text-gray-500 mb-6">{t("pages.healthcareGuidePage.deepClinicalKnowledgeForNursing")}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {nursingGuides.map((guide) => (
              <LocaleLink key={guide.slug} href={`/guides/${guide.slug}`}>
                <Card className="h-full hover:shadow-lg transition-all cursor-pointer group" data-testid={`card-guide-${guide.slug}`}>
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: guide.colorAccent }}>
                      <Stethoscope className="w-6 h-6" style={{ color: guide.color }} />
                    </div>
                    <h3 className="font-bold text-gray-900 text-base mb-2 group-hover:text-blue-700 transition-colors" data-testid={`text-guide-card-title-${guide.slug}`}>
                      {guide.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-3">{guide.metaDescription}</p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-50 text-red-600 font-medium">{t("pages.healthcareGuidePage.conditions")}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-medium">{t("pages.healthcareGuidePage.skills")}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 font-medium">{t("pages.healthcareGuidePage.medications")}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-50 text-green-600 font-medium">{t("pages.healthcareGuidePage.career")}</span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-sm text-blue-600 font-medium">
                      Read Guide <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </CardContent>
                </Card>
              </LocaleLink>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2" data-testid="heading-allied-health">
            <Briefcase className="w-5 h-5 text-indigo-600" /> Allied Health Career Guides
          </h2>
          <p className="text-sm text-gray-500 mb-6">{t("pages.healthcareGuidePage.careerPathwaysAndClinicalKnowledge")}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {alliedGuides.map((guide) => (
              <LocaleLink key={guide.slug} href={`/guides/${guide.slug}`}>
                <Card className="h-full hover:shadow-lg transition-all cursor-pointer group" data-testid={`card-guide-${guide.slug}`}>
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: guide.colorAccent }}>
                      <Briefcase className="w-6 h-6" style={{ color: guide.color }} />
                    </div>
                    <h3 className="font-bold text-gray-900 text-base mb-2 group-hover:text-indigo-700 transition-colors" data-testid={`text-guide-card-title-${guide.slug}`}>
                      {guide.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-3">{guide.metaDescription}</p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-50 text-red-600 font-medium">{t("pages.healthcareGuidePage.clinical")}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-medium">{t("pages.healthcareGuidePage.skills2")}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 font-medium">{t("pages.healthcareGuidePage.career2")}</span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-sm text-indigo-600 font-medium">
                      Read Guide <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </CardContent>
                </Card>
              </LocaleLink>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2" data-testid="heading-career-guides">
            <GraduationCap className="w-5 h-5 text-purple-600" /> Career Path Guides
          </h2>
          <p className="text-sm text-gray-500 mb-6">{t("pages.healthcareGuidePage.completeCareerGuidesFromExam")}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {AUTHORITY_GUIDES.map((guide) => (
              <LocaleLink key={guide.slug} href={`/guides/${guide.slug}`}>
                <Card className="h-full hover:shadow-lg transition-all cursor-pointer group" data-testid={`card-guide-${guide.slug}`}>
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: guide.colorAccent }}>
                      <BookOpen className="w-6 h-6" style={{ color: guide.color }} />
                    </div>
                    <h3 className="font-bold text-gray-900 text-base mb-2 group-hover:text-purple-700 transition-colors" data-testid={`text-guide-card-title-${guide.slug}`}>
                      {guide.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-3">{guide.heroSubtitle}</p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 font-medium">{t("pages.healthcareGuidePage.examPrep")}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-medium">{t("pages.healthcareGuidePage.clinical2")}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 font-medium">{t("pages.healthcareGuidePage.career3")}</span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-sm text-purple-600 font-medium">
                      Read Guide <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </CardContent>
                </Card>
              </LocaleLink>
            ))}
          </div>
        </div>

        <section className="mt-16 mb-8" data-testid="section-guides-cta">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
              Start Practicing Today
            </h2>
            <p className="text-blue-100 text-sm sm:text-base mb-6 max-w-2xl mx-auto">
              Access practice questions, flashcards, and study tools for all healthcare specialties and professions.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <LocaleLink href="/free-practice">
                <Button className="bg-white text-blue-700 hover:bg-blue-50 px-6 py-2.5 font-semibold" data-testid="button-explore-questions">
                  Start Practice Questions <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </LocaleLink>
              <LocaleLink href="/start-free">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 px-6 py-2.5" data-testid="button-create-account">
                  Create Free Account
                </Button>
              </LocaleLink>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
