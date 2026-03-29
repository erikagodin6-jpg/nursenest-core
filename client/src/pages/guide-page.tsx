import { useParams, Link } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { useState } from "react";
import { LocaleLink } from "@/lib/LocaleLink";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { buildFaqStructuredData, PARENT_EDUCATIONAL_ORG } from "@/lib/structured-data";
import { getGuideBySlug, AUTHORITY_GUIDES, type AuthorityGuide, type GuideResource } from "@shared/guide-data";
import { EndOfContentLeadCapture } from "@/components/lead-capture";
import { AITutorWidget } from "@/components/ai-tutor-widget";
import {
  BookOpen, ChevronRight, ChevronDown, ArrowRight, HelpCircle,
  GraduationCap, Briefcase, Stethoscope, Award, Target,
  FileText, Brain, Users, Star, ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { useI18n } from "@/lib/i18n";
function TableOfContents({ guide }: { guide: AuthorityGuide }) {
  const { t } = useI18n();
  const sections = [
    { id: guide.examPrepSection.id, title: guide.examPrepSection.title },
    { id: guide.clinicalTransitionSection.id, title: guide.clinicalTransitionSection.title },
    { id: guide.careerPlacementSection.id, title: guide.careerPlacementSection.title },
    ...guide.additionalSections.map(s => ({ id: s.id, title: s.title })),
    { id: "resources", title: "Resources Across NurseNest" },
    { id: "faq", title: "Frequently Asked Questions" },
    { id: "related-guides", title: "Related Guides" },
  ];

  return (
    <nav className="bg-white rounded-xl border border-gray-200 p-5 sticky top-24" data-testid="nav-guide-toc">
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

function GuideSection({ section, color }: { section: { id: string; title: string; content: string }; color: string }) {
  return (
    <section id={section.id} className="mb-12 scroll-mt-24" data-testid={`section-${section.id}`}>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
        <div className="w-1.5 h-8 rounded-full" style={{ backgroundColor: color }} />
        {section.title}
      </h2>
      <div className="prose prose-gray max-w-none">
        {section.content.split("\n\n").map((paragraph, i) => (
          <p key={i} className="text-gray-600 leading-relaxed mb-4" data-testid={`text-${section.id}-p${i}`}>
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}

function PlatformBadge({ platform }: { platform: GuideResource["platform"] }) {
  const config = {
    nursenest: { label: "NurseNest", icon: Stethoscope, bg: "bg-purple-100", text: "text-purple-700" },
    newgrad: { label: "New Grad", icon: GraduationCap, bg: "bg-blue-100", text: "text-blue-700" },
    applynest: { label: "ApplyNest", icon: Briefcase, bg: "bg-indigo-100", text: "text-indigo-700" },
  }[platform];
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${config.bg} ${config.text}`} data-testid={`badge-platform-${platform}`}>
      <Icon className="w-2.5 h-2.5" />
      {config.label}
    </span>
  );
}

function ResourcesSection({ resources, color }: { resources: GuideResource[]; color: string }) {
  const grouped = {
    nursenest: resources.filter(r => r.platform === "nursenest"),
    newgrad: resources.filter(r => r.platform === "newgrad"),
    applynest: resources.filter(r => r.platform === "applynest"),
  };

  return (
    <section id="resources" className="mb-12 scroll-mt-24" data-testid="section-resources">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
        <div className="w-1.5 h-8 rounded-full" style={{ backgroundColor: color }} />
        Resources Across NurseNest
      </h2>
      <p className="text-gray-600 mb-6">
        Access exam prep, clinical transition, and career tools from across the NurseNest ecosystem.
      </p>

      <div className="space-y-6">
        {grouped.nursenest.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Stethoscope className="w-4 h-4 text-purple-600" />
              <h3 className="text-sm font-semibold text-purple-700">{t("pages.guidePage.examPrepNursenest")}</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {grouped.nursenest.map((r, i) => (
                <LocaleLink key={i} href={r.href}>
                  <Card className="h-full hover:shadow-md hover:border-purple-200 transition-all cursor-pointer group" data-testid={`card-resource-nursenest-${i}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900 text-sm group-hover:text-purple-700 transition-colors">{r.label}</h4>
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-purple-500 shrink-0 mt-0.5" />
                      </div>
                      <p className="text-xs text-gray-500">{r.description}</p>
                    </CardContent>
                  </Card>
                </LocaleLink>
              ))}
            </div>
          </div>
        )}

        {grouped.newgrad.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <GraduationCap className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-semibold text-blue-700">{t("pages.guidePage.clinicalTransitionNewGradHub")}</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {grouped.newgrad.map((r, i) => (
                <LocaleLink key={i} href={r.href}>
                  <Card className="h-full hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group" data-testid={`card-resource-newgrad-${i}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900 text-sm group-hover:text-blue-700 transition-colors">{r.label}</h4>
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 shrink-0 mt-0.5" />
                      </div>
                      <p className="text-xs text-gray-500">{r.description}</p>
                    </CardContent>
                  </Card>
                </LocaleLink>
              ))}
            </div>
          </div>
        )}

        {grouped.applynest.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Briefcase className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-semibold text-indigo-700">{t("pages.guidePage.careerToolsApplynest")}</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {grouped.applynest.map((r, i) => (
                <LocaleLink key={i} href={r.href}>
                  <Card className="h-full hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group" data-testid={`card-resource-applynest-${i}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900 text-sm group-hover:text-indigo-700 transition-colors">{r.label}</h4>
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-500 shrink-0 mt-0.5" />
                      </div>
                      <p className="text-xs text-gray-500">{r.description}</p>
                    </CardContent>
                  </Card>
                </LocaleLink>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function FAQSection({ faqs, color }: { faqs: { question: string; answer: string }[]; color: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="mb-12 scroll-mt-24" data-testid="section-faq">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
        <div className="w-1.5 h-8 rounded-full" style={{ backgroundColor: color }} />
        Frequently Asked Questions
      </h2>
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden"
            data-testid={`faq-item-${i}`}
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-gray-50 transition-colors"
              data-testid={`button-faq-${i}`}
            >
              <div className="flex items-start gap-3">
                <HelpCircle className="w-5 h-5 mt-0.5 shrink-0" style={{ color }} />
                <span className="font-medium text-gray-900 text-sm">{faq.question}</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${openIndex === i ? "rotate-180" : ""}`} />
            </button>
            {openIndex === i && (
              <div className="px-4 pb-4 pl-12" data-testid={`text-faq-answer-${i}`}>
                <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function RelatedGuides({ slugs, currentSlug }: { slugs: string[]; currentSlug: string }) {
  const related = AUTHORITY_GUIDES.filter(g => slugs.includes(g.slug) && g.slug !== currentSlug);
  if (related.length === 0) return null;

  return (
    <section id="related-guides" className="mb-12 scroll-mt-24" data-testid="section-related-guides">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">{t("pages.guidePage.relatedGuides")}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {related.map((guide) => (
          <LocaleLink key={guide.slug} href={`/guides/${guide.slug}`}>
            <Card className="h-full hover:shadow-md transition-all cursor-pointer group" data-testid={`card-related-${guide.slug}`}>
              <CardContent className="p-5">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: guide.colorAccent }}>
                  <BookOpen className="w-5 h-5" style={{ color: guide.color }} />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-2 group-hover:text-blue-700 transition-colors">
                  {guide.title}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2">{guide.heroSubtitle}</p>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 mt-3">
                  Read Guide <ArrowRight className="w-3 h-3" />
                </span>
              </CardContent>
            </Card>
          </LocaleLink>
        ))}
      </div>
    </section>
  );
}

export default function GuidePage() {
  const params = useParams<{ slug: string }>();
  const guide = getGuideBySlug(params.slug || "");

  if (!guide) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4" data-testid="text-guide-not-found">{t("pages.guidePage.guideNotFound")}</h1>
          <p className="text-gray-600 mb-6">{t("pages.guidePage.theGuideYouAreLooking")}</p>
          <LocaleLink href="/">
            <Button data-testid="button-guide-go-home">{t("pages.guidePage.returnToHome")}</Button>
          </LocaleLink>
        </div>
        <Footer />
      </div>
    );
  }

  const faqStructuredData = buildFaqStructuredData(guide.faqs);

  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
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
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.nursenest.ca/brand-logo.gif",
      },
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
    "isPartOf": {
      "@type": "WebSite",
      "name": PARENT_EDUCATIONAL_ORG.name,
      "url": PARENT_EDUCATIONAL_ORG.url,
    },
    "articleSection": [
      guide.examPrepSection.title,
      guide.clinicalTransitionSection.title,
      guide.careerPlacementSection.title,
      ...guide.additionalSections.map(s => s.title),
    ],
    "wordCount": [
      guide.introduction,
      guide.examPrepSection.content,
      guide.clinicalTransitionSection.content,
      guide.careerPlacementSection.content,
      ...guide.additionalSections.map(s => s.content),
    ].join(" ").split(/\s+/).length,
  };

  return (
    <div className="min-h-screen bg-gray-50" data-testid={`guide-page-${guide.slug}`}>
      <Navigation />
      <SEO
        title={guide.metaTitle}
        description={guide.metaDescription}
        keywords={guide.keywords}
        canonicalPath={`/guides/${guide.slug}`}
        structuredData={articleStructuredData}
        additionalStructuredData={[faqStructuredData]}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "Career Guides", url: "https://www.nursenest.ca/guides" },
          { name: guide.title, url: `https://www.nursenest.ca/guides/${guide.slug}` },
        ]}
      />

      <section className="relative py-14 sm:py-18 overflow-hidden" data-testid="section-guide-hero">
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${guide.colorAccent}40, white, ${guide.colorAccent}20)` }} />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <BreadcrumbNav
            items={[
              { name: "Home", url: "https://www.nursenest.ca/" },
              { name: "Career Guides", url: "https://www.nursenest.ca/guides" },
              { name: guide.title, url: `https://www.nursenest.ca/guides/${guide.slug}` },
            ]}
          />
          <div className="mt-6 max-w-3xl">
            <Badge className="mb-4 text-white" style={{ backgroundColor: guide.color }} data-testid="badge-guide-type">
              <BookOpen className="w-3 h-3 mr-1" /> Authority Guide
            </Badge>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight" data-testid="text-guide-title">
              {guide.title}
            </h1>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed" data-testid="text-guide-subtitle">
              {guide.heroSubtitle}
            </p>
            <div className="flex flex-wrap gap-2 mt-6">
              <Badge variant="outline" className="text-xs border-gray-300">
                <Stethoscope className="w-3 h-3 mr-1" /> Exam Prep
              </Badge>
              <Badge variant="outline" className="text-xs border-gray-300">
                <GraduationCap className="w-3 h-3 mr-1" /> Clinical Transition
              </Badge>
              <Badge variant="outline" className="text-xs border-gray-300">
                <Briefcase className="w-3 h-3 mr-1" /> Career Placement
              </Badge>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="hidden lg:block lg:w-64 shrink-0">
            <TableOfContents guide={guide} />
          </div>

          <div className="flex-1 min-w-0">
            <section className="mb-12" data-testid="section-introduction">
              <p className="text-gray-700 leading-relaxed text-base" data-testid="text-guide-introduction">
                {guide.introduction}
              </p>
            </section>

            <GuideSection section={guide.examPrepSection} color={guide.color} />
            <GuideSection section={guide.clinicalTransitionSection} color={guide.color} />
            <GuideSection section={guide.careerPlacementSection} color={guide.color} />

            {guide.additionalSections.map((section) => (
              <GuideSection key={section.id} section={section} color={guide.color} />
            ))}

            <ResourcesSection resources={guide.resources} color={guide.color} />
            <FAQSection faqs={guide.faqs} color={guide.color} />
            <RelatedGuides slugs={guide.relatedGuides} currentSlug={guide.slug} />

            <section className="mb-12" data-testid="section-guide-cta">
              <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: guide.color }}>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                  Ready to Start Your Journey?
                </h2>
                <p className="text-white/80 text-sm sm:text-base mb-6 max-w-2xl mx-auto">
                  Use the resources above to prepare for your exam, build clinical confidence, and launch your career.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <LocaleLink href={guide.resources[0]?.href || "/"}>
                    <Button className="bg-white text-gray-900 hover:bg-gray-100 px-6 py-2.5 font-semibold" data-testid="button-guide-start-prep">
                      Start Exam Prep <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </LocaleLink>
                  <LocaleLink href="/new-grad">
                    <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 px-6 py-2.5" data-testid="button-guide-new-grad">
                      Explore New Grad Hub
                    </Button>
                  </LocaleLink>
                </div>
              </div>
            </section>

            <EndOfContentLeadCapture leadMagnetType="study_guide" source={`authority-guide-${guide.slug}`} />
          </div>
        </div>
      </main>

      <AITutorWidget context={{
        type: "study_guide",
        id: guide.slug,
        data: {
          title: guide.title,
          section: guide.examPrepSection.title,
          content: guide.introduction,
        },
        title: guide.title,
      }} />
      <Footer />
    </div>
  );
}

export function GuidesIndex() {
  return (
    <div className="min-h-screen bg-gray-50" data-testid="guides-index-page">
      <Navigation />
      <SEO
        title={t("pages.guidePage.careerGuidesCompletePathsFrom")}
        description={t("pages.guidePage.comprehensiveCareerGuidesCoveringComplete")}
        keywords="healthcare career guides, nursing career path, respiratory therapy guide, paramedic career guide, MLT career guide, healthcare exam prep, clinical transition, healthcare job placement"
        canonicalPath="/guides"
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "Career Guides", url: "https://www.nursenest.ca/guides" },
        ]}
      />

      <section className="relative py-14 sm:py-18 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-white" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <BreadcrumbNav
            items={[
              { name: "Home", url: "https://www.nursenest.ca/" },
              { name: "Career Guides", url: "https://www.nursenest.ca/guides" },
            ]}
          />
          <div className="mt-6 max-w-3xl">
            <Badge className="mb-4 bg-blue-100 text-blue-700" data-testid="badge-guides-hub">
              <BookOpen className="w-3 h-3 mr-1" /> Authority Guides
            </Badge>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4" data-testid="text-guides-title">
              Complete Career Guides
            </h1>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed" data-testid="text-guides-subtitle">
              In-depth guides covering every step of your healthcare career — from exam preparation and licensing through first-year clinical practice to job placement and career advancement.
            </p>
          </div>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {AUTHORITY_GUIDES.map((guide) => (
            <LocaleLink key={guide.slug} href={`/guides/${guide.slug}`}>
              <Card className="h-full hover:shadow-lg transition-all cursor-pointer group" data-testid={`card-guide-${guide.slug}`}>
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: guide.colorAccent }}>
                    <BookOpen className="w-6 h-6" style={{ color: guide.color }} />
                  </div>
                  <h2 className="font-bold text-gray-900 text-base mb-2 group-hover:text-blue-700 transition-colors" data-testid={`text-guide-card-title-${guide.slug}`}>
                    {guide.title}
                  </h2>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-3">{guide.heroSubtitle}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 font-medium">{t("pages.guidePage.examPrep")}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-medium">{t("pages.guidePage.clinical")}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 font-medium">{t("pages.guidePage.career")}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-sm text-blue-600 font-medium">
                    Read Full Guide <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </CardContent>
              </Card>
            </LocaleLink>
          ))}
        </div>

        <section className="mt-16 mb-8" data-testid="section-guides-cta">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
              Find the Right Path for You
            </h2>
            <p className="text-blue-100 text-sm sm:text-base mb-6 max-w-2xl mx-auto">
              Not sure which career path is right for you? Explore all healthcare careers and find your perfect fit.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <LocaleLink href="/healthcare-careers">
                <Button className="bg-white text-blue-700 hover:bg-blue-50 px-6 py-2.5 font-semibold" data-testid="button-explore-careers">
                  Explore Healthcare Careers <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </LocaleLink>
              <LocaleLink href="/career-journey">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 px-6 py-2.5" data-testid="button-career-journey">
                  View Career Journeys
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
