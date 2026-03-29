import { Link, useLocation } from "wouter";
import { SEO } from "@/components/seo";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ContentGate } from "@/components/content-gate";
import { useAuth } from "@/lib/auth";
import { useNewGradEntitlements } from "./premium-cta";
import { getNewGradGuideBySlug, type NewGradGuide, type NewGradGuideSection } from "@/data/newgrad/guide-content";
import { RESUME_TEMPLATES, INTERVIEW_QUESTION_BANK, SALARY_DATA, CAREER_FRAMEWORKS, PORTFOLIO_SECTIONS } from "@/data/newgrad/premium-toolkit";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { buildFaqStructuredData, PARENT_EDUCATIONAL_ORG } from "@/lib/structured-data";
import {
  ArrowRight, BookOpen, FileText, MessageSquare, Users, Heart,
  DollarSign, Award, TrendingUp, Star, CheckCircle2, Lock,
  Sparkles, GraduationCap, ChevronDown, ChevronRight,
  Target, AlertTriangle, Lightbulb, Eye, Zap, Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

import { useI18n } from "@/lib/i18n";
const ICON_MAP: Record<string, any> = {
  BookOpen, FileText, MessageSquare, Users, Heart,
  DollarSign, Award, TrendingUp, Target, Briefcase,
};

function GuideSection({ section, color }: { section: NewGradGuideSection; color: string }) {
  const { t } = useI18n();
  const [showScenarios, setShowScenarios] = useState(false);

  return (
    <section id={section.id} className="mb-12 scroll-mt-24" data-testid={`section-${section.id}`}>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
        <div className="w-1.5 h-8 rounded-full" style={{ backgroundColor: color }} />
        {section.title}
      </h2>

      <p className="text-gray-600 leading-relaxed mb-6" data-testid={`text-overview-${section.id}`}>
        {section.overview}
      </p>

      {section.clinicalScenarios.length > 0 && (
        <div className="mb-6">
          <button
            onClick={() => setShowScenarios(!showScenarios)}
            className="flex items-center gap-2 text-sm font-semibold mb-3 hover:text-blue-600 transition-colors"
            style={{ color }}
            data-testid={`button-scenarios-${section.id}`}
          >
            <Lightbulb className="w-4 h-4" />
            Real Clinical Scenarios ({section.clinicalScenarios.length})
            <ChevronDown className={`w-4 h-4 transition-transform ${showScenarios ? "rotate-180" : ""}`} />
          </button>
          {showScenarios && (
            <div className="space-y-4">
              {section.clinicalScenarios.map((s, i) => (
                <Card key={i} className="border-gray-100" data-testid={`card-scenario-${section.id}-${i}`}>
                  <CardContent className="p-5">
                    <h4 className="font-semibold text-gray-900 text-sm mb-2">{s.title}</h4>
                    <div className="mb-3">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{t("pages.newgrad.newgradGuidePage.scenario")}</span>
                      <p className="text-sm text-gray-600 mt-1">{s.scenario}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3">
                      <span className="text-xs font-medium text-green-700 uppercase tracking-wide">{t("pages.newgrad.newgradGuidePage.strategy")}</span>
                      <p className="text-sm text-green-800 mt-1">{s.strategy}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {section.strategies.length > 0 && (
        <div className="mb-6">
          <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Target className="w-4 h-4" style={{ color }} /> Step-by-Step Strategies
          </h3>
          <div className="space-y-3">
            {section.strategies.map((s, i) => (
              <div key={i} className="flex gap-3" data-testid={`text-strategy-${section.id}-${i}`}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5" style={{ backgroundColor: color }}>
                  {i + 1}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 text-sm">{s.title}</h4>
                  <p className="text-sm text-gray-500 mt-0.5">{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {section.tips.length > 0 && (
        <div className="mb-6">
          <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4" style={{ color }} /> Practical Tips
          </h3>
          <div className="bg-gray-50 rounded-xl p-5">
            <ul className="space-y-2">
              {section.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600" data-testid={`text-tip-${section.id}-${i}`}>
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color }} />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {section.commonMistakes.length > 0 && (
        <div className="mb-6">
          <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500" /> Common Mistakes to Avoid
          </h3>
          <div className="space-y-3">
            {section.commonMistakes.map((m, i) => (
              <div key={i} className="border border-gray-100 rounded-lg p-4" data-testid={`card-mistake-${section.id}-${i}`}>
                <div className="flex items-start gap-2 mb-2">
                  <span className="text-red-500 text-xs font-bold uppercase">{t("pages.newgrad.newgradGuidePage.mistake")}</span>
                  <span className="text-sm text-gray-700">{m.mistake}</span>
                </div>
                <div className="flex items-start gap-2 bg-green-50 rounded p-2">
                  <span className="text-green-700 text-xs font-bold uppercase">{t("pages.newgrad.newgradGuidePage.better")}</span>
                  <span className="text-sm text-green-800">{m.correction}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {section.professionalInsights.length > 0 && (
        <div className="mb-6">
          <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Star className="w-4 h-4" style={{ color }} /> Professional Insights
          </h3>
          <div className="space-y-2">
            {section.professionalInsights.map((insight, i) => (
              <div key={i} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg" data-testid={`text-insight-${section.id}-${i}`}>
                <Eye className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-sm text-blue-800">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {section.careerTips.length > 0 && (
        <div className="mb-6">
          <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Briefcase className="w-4 h-4" style={{ color }} /> Career Tips
          </h3>
          <ul className="space-y-1.5">
            {section.careerTips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600" data-testid={`text-career-tip-${section.id}-${i}`}>
                <ArrowRight className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color }} />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

function PremiumToolkitSection({ slug, hasAccess }: { slug: string; hasAccess: boolean }) {
  if (slug === "resume") {
    return (
      <section className="mb-12 scroll-mt-24" data-testid="section-premium-resume">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
          <div className="w-1.5 h-8 rounded-full bg-purple-500" />
          <Star className="w-5 h-5 text-amber-500" /> Premium Resume Templates
        </h2>
        <ContentGate visibility="preview" requiredTier="newgrad" featureName="resume templates">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {RESUME_TEMPLATES.map((t) => (
              <Card key={t.id} className="border-gray-200" data-testid={`card-resume-${t.id}`}>
                <CardContent className="p-5">
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">{t.title}</h3>
                  <Badge variant="outline" className="text-[10px] mb-2">{t.targetRole}</Badge>
                  <p className="text-xs text-gray-500 mb-3">{t.description}</p>
                  <div className="bg-gray-50 rounded p-3">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">{t("pages.newgrad.newgradGuidePage.preview")}</span>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-3">{t.preview}</p>
                  </div>
                  <div className="mt-3">
                    <span className="text-[10px] text-gray-400">{t("pages.newgrad.newgradGuidePage.sections")} </span>
                    <span className="text-[10px] text-gray-500">{t.sections.join(" • ")}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ContentGate>
      </section>
    );
  }

  if (slug === "interview") {
    return (
      <section className="mb-12 scroll-mt-24" data-testid="section-premium-interview">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
          <div className="w-1.5 h-8 rounded-full bg-amber-500" />
          <Star className="w-5 h-5 text-amber-500" /> Premium Interview Question Bank
        </h2>
        <ContentGate visibility="preview" requiredTier="newgrad" featureName="interview question bank">
          <div className="space-y-4">
            {INTERVIEW_QUESTION_BANK.map((q) => (
              <Card key={q.id} className="border-gray-200" data-testid={`card-interview-${q.id}`}>
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-[10px]">{q.category}</Badge>
                    <Badge className={`text-[10px] ${q.difficulty === "beginner" ? "bg-green-100 text-green-700" : q.difficulty === "intermediate" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                      {q.difficulty}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-3">{q.question}</h3>
                  <div className="bg-blue-50 rounded-lg p-3 mb-3">
                    <span className="text-[10px] font-bold text-blue-600 uppercase">{t("pages.newgrad.newgradGuidePage.sampleStarAnswer")}</span>
                    <p className="text-xs text-blue-800 mt-1">{q.sampleAnswer}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase">{t("pages.newgrad.newgradGuidePage.tips")}</span>
                    <ul className="mt-1 space-y-1">
                      {q.tips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-xs text-gray-500">
                          <CheckCircle2 className="w-3 h-3 text-green-500 shrink-0 mt-0.5" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ContentGate>
      </section>
    );
  }

  if (slug === "salary") {
    return (
      <section className="mb-12 scroll-mt-24" data-testid="section-premium-salary">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
          <div className="w-1.5 h-8 rounded-full bg-green-500" />
          <Star className="w-5 h-5 text-amber-500" /> Premium Salary Comparison Data
        </h2>
        <ContentGate visibility="preview" requiredTier="newgrad" featureName="salary data and negotiation guides">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse" data-testid="table-salary-data">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-3 font-semibold text-gray-700 border-b">{t("pages.newgrad.newgradGuidePage.region")}</th>
                  <th className="text-left p-3 font-semibold text-gray-700 border-b">{t("pages.newgrad.newgradGuidePage.specialty")}</th>
                  <th className="text-left p-3 font-semibold text-gray-700 border-b">{t("pages.newgrad.newgradGuidePage.entryLevel")}</th>
                  <th className="text-left p-3 font-semibold text-gray-700 border-b">{t("pages.newgrad.newgradGuidePage.midCareer")}</th>
                  <th className="text-left p-3 font-semibold text-gray-700 border-b">{t("pages.newgrad.newgradGuidePage.experienced")}</th>
                </tr>
              </thead>
              <tbody>
                {SALARY_DATA.map((row, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-3 text-gray-900 font-medium text-xs">{row.region}</td>
                    <td className="p-3 text-gray-600 text-xs">{row.specialty}</td>
                    <td className="p-3 text-green-700 font-medium text-xs">{row.entryLevel}</td>
                    <td className="p-3 text-green-700 font-medium text-xs">{row.midCareer}</td>
                    <td className="p-3 text-green-700 font-medium text-xs">{row.experienced}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ContentGate>
      </section>
    );
  }

  if (slug === "professional-development" || slug === "career") {
    return (
      <section className="mb-12 scroll-mt-24" data-testid="section-premium-frameworks">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
          <div className="w-1.5 h-8 rounded-full bg-blue-500" />
          <Star className="w-5 h-5 text-amber-500" /> Premium Career Planning Frameworks
        </h2>
        <ContentGate visibility="preview" requiredTier="newgrad" featureName="career planning frameworks and portfolio templates">
          <div className="space-y-6">
            {CAREER_FRAMEWORKS.map((fw) => (
              <Card key={fw.id} className="border-gray-200" data-testid={`card-framework-${fw.id}`}>
                <CardContent className="p-5">
                  <h3 className="font-semibold text-gray-900 mb-1">{fw.title}</h3>
                  <p className="text-sm text-gray-500 mb-4">{fw.description}</p>
                  <div className="space-y-3">
                    {fw.steps.map((step, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                          {i + 1}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 text-sm">{step.title}</h4>
                          <p className="text-xs text-gray-500 mt-0.5">{step.description}</p>
                          <span className="text-[10px] text-blue-600 font-medium">{step.timeline}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card className="border-gray-200" data-testid="card-portfolio-template">
              <CardContent className="p-5">
                <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-blue-600" /> Professional Portfolio Template
                </h3>
                <p className="text-sm text-gray-500 mb-4">{t("pages.newgrad.newgradGuidePage.buildAComprehensiveProfessionalPortfolio")}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {PORTFOLIO_SECTIONS.map((ps, i) => (
                    <div key={i} className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                      <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-medium text-gray-900">{ps.title}</span>
                        <p className="text-[10px] text-gray-500">{ps.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </ContentGate>
      </section>
    );
  }

  return null;
}

function TableOfContents({ guide }: { guide: NewGradGuide }) {
  return (
    <nav className="bg-white rounded-xl border border-gray-200 p-5 sticky top-24" data-testid="nav-guide-toc">
      <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <BookOpen className="w-4 h-4" style={{ color: guide.color }} /> Contents
      </h3>
      <ul className="space-y-1.5">
        {guide.sections.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors block py-0.5 border-l-2 border-transparent hover:border-gray-400 pl-3"
              data-testid={`toc-link-${s.id}`}
            >
              {s.title}
            </a>
          </li>
        ))}
      </ul>
      <div className="mt-4 pt-4 border-t">
        <Link href="/newgrad">
          <span className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer">
            <ArrowRight className="w-3 h-3 rotate-180" /> Back to Career Hub
          </span>
        </Link>
      </div>
    </nav>
  );
}

export default function NewGradGuidePage() {
  const [location] = useLocation();
  const slug = location.split("/newgrad/")[1]?.split("/")[0] || "guides";
  const guide = getNewGradGuideBySlug(slug);
  const { effectiveTier, user } = useAuth();
  const { hasAnyPremium: hasAccess } = useNewGradEntitlements();

  if (!guide) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4" data-testid="text-guide-not-found">{t("pages.newgrad.newgradGuidePage.guideNotFound")}</h1>
          <p className="text-gray-600 mb-6">{t("pages.newgrad.newgradGuidePage.theGuideYouAreLooking")}</p>
          <Link href="/newgrad">
            <Button data-testid="button-back-to-hub">{t("pages.newgrad.newgradGuidePage.returnToCareerHub")}</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const IconComponent = ICON_MAP[guide.icon] || BookOpen;

  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.metaDescription,
    author: {
      "@type": "EducationalOrganization",
      name: "NurseNest",
      url: "https://www.nursenest.ca",
    },
    publisher: {
      "@type": "EducationalOrganization",
      name: "NurseNest",
      url: "https://www.nursenest.ca",
      logo: {
        "@type": "ImageObject",
        url: "https://www.nursenest.ca/brand-logo.gif",
      },
      parentOrganization: {
        "@type": "EducationalOrganization",
        name: PARENT_EDUCATIONAL_ORG.name,
        url: PARENT_EDUCATIONAL_ORG.url,
      },
    },
    datePublished: "2025-06-01",
    dateModified: new Date().toISOString().split("T")[0],
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.nursenest.ca/newgrad/${guide.slug}`,
    },
  };

  return (
    <div className="min-h-screen bg-gray-50" data-testid={`newgrad-guide-${slug}`}>
      <Navigation />
      <SEO
        title={guide.metaTitle}
        description={guide.metaDescription}
        keywords={guide.keywords}
        canonicalPath={`/newgrad/${guide.slug}`}
        structuredData={articleStructuredData}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "New Grad Career Hub", url: "https://www.nursenest.ca/newgrad" },
          { name: guide.title, url: `https://www.nursenest.ca/newgrad/${guide.slug}` },
        ]}
      />

      <section className="relative py-14 sm:py-18 overflow-hidden" data-testid="section-guide-hero">
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${guide.colorAccent}40, white, ${guide.colorAccent}20)` }} />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <BreadcrumbNav
            items={[
              { name: "Home", url: "https://www.nursenest.ca/" },
              { name: "New Grad Career Hub", url: "https://www.nursenest.ca/newgrad" },
              { name: guide.title, url: `https://www.nursenest.ca/newgrad/${guide.slug}` },
            ]}
          />
          <div className="mt-6 max-w-3xl">
            <Badge className="mb-4 text-white" style={{ backgroundColor: guide.color }} data-testid="badge-guide-type">
              <IconComponent className="w-3 h-3 mr-1" /> New Grad Guide
            </Badge>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight" data-testid="text-guide-title">
              {guide.title}
            </h1>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed" data-testid="text-guide-subtitle">
              {guide.heroSubtitle}
            </p>
          </div>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="hidden lg:block lg:w-64 shrink-0">
            <TableOfContents guide={guide} />
          </div>

          <div className="flex-1 min-w-0">
            {guide.sections.map((section) => (
              <GuideSection key={section.id} section={section} color={guide.color} />
            ))}

            <PremiumToolkitSection slug={slug} hasAccess={hasAccess} />

            <section className="mb-12" data-testid="section-guide-cta">
              <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: guide.color }}>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                  Continue Your Career Journey
                </h2>
                <p className="text-white/80 text-sm sm:text-base mb-6 max-w-2xl mx-auto">
                  Explore more career resources and tools designed for new graduate nurses.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link href="/newgrad">
                    <Button className="bg-white text-gray-900 hover:bg-gray-100 px-6 py-2.5 font-semibold" data-testid="button-back-hub">
                      Back to Career Hub <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  {!hasAccess && (
                    <Link href="/subscribe/newgrad">
                      <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 px-6 py-2.5" data-testid="button-upgrade-guide">
                        <Sparkles className="w-4 h-4 mr-2" /> Get the Success Toolkit
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
