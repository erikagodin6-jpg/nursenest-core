import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { SocialShareCards } from "@/components/new-grad/social-share-cards";
import { InternalLinks } from "@/components/new-grad/internal-links";
import { NEW_GRAD_PROFESSIONS } from "@shared/new-grad-professions";
import { ChevronRight, BookOpen, AlertTriangle, CheckCircle2, MessageSquare, Brain, Lightbulb } from "lucide-react";

import { useI18n } from "@/lib/i18n";
export default function ClinicalScenarioPage() {
  const { t } = useI18n();
  const params = useParams<{ slug: string }>();

  const { data: guide, isLoading } = useQuery({
    queryKey: ["/api/new-grad/guides", params.slug],
    queryFn: async () => {
      const res = await fetch(`/api/new-grad/guides/${params.slug}`);
      return res.ok ? res.json() : null;
    },
    enabled: !!params.slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4" data-testid="text-scenario-not-found">{t("pages.newGrad.clinicalScenarioPage.clinicalScenarioNotFound")}</h1>
            <Link href="/new-grad" className="text-blue-600 hover:underline">{t("pages.newGrad.clinicalScenarioPage.backToNewGradHub")}</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const profession = NEW_GRAD_PROFESSIONS[guide.profession];
  const color = profession?.color || "#3b82f6";
  const sections = (guide.sections || []) as any[];

  const actionSteps = sections.filter((s: any) => s.type === "action");
  const reasoningSteps = sections.filter((s: any) => s.type === "reasoning");
  const communicationTips = sections.filter((s: any) => s.type === "communication");
  const generalSections = sections.filter((s: any) => !s.type || !["action", "reasoning", "communication"].includes(s.type));

  return (
    <div className="min-h-screen flex flex-col" data-testid={`clinical-scenario-${params.slug}`}>
      <Navigation />
      <SEO
        title={`${guide.title} | Clinical Scenario | NurseNest`}
        description={guide.summary || guide.seo_description || `Clinical scenario walkthrough: ${guide.title}`}
        keywords={guide.seo_keywords?.join(", ") || `clinical scenario, ${guide.profession}, clinical reasoning`}
        canonicalPath={`/new-grad/scenario/${params.slug}`}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "New Grad Hub", url: "https://www.nursenest.ca/new-grad" },
          { name: "Clinical Scenarios", url: "https://www.nursenest.ca/new-grad" },
          { name: guide.title, url: `https://www.nursenest.ca/new-grad/scenario/${params.slug}` },
        ]}
      />

      <section className="relative py-16 sm:py-20 overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50/50 to-white" data-testid="section-scenario-hero">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-blue-600">{t("pages.newGrad.clinicalScenarioPage.home")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/new-grad" className="hover:text-blue-600">{t("pages.newGrad.clinicalScenarioPage.newGradHub")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-amber-700 font-medium">{t("pages.newGrad.clinicalScenarioPage.clinicalScenario")}</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4 bg-amber-100 text-amber-700">
            <Brain className="w-4 h-4" />
            Clinical Scenario Walkthrough
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4" data-testid="text-scenario-title">
            {guide.title}
          </h1>
          {guide.summary && <p className="text-lg text-gray-600">{guide.summary}</p>}
          {guide.tags && guide.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {guide.tags.map((tag: string) => (
                <span key={tag} className="px-2 py-1 text-xs rounded-full bg-white border border-gray-200 text-gray-600">{tag}</span>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16" data-testid="section-scenario-content">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {generalSections.length > 0 && generalSections.map((section: any, i: number) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3">{section.title}</h2>
              <div className="text-gray-600 whitespace-pre-line">{section.content}</div>
            </div>
          ))}

          {actionSteps.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6" data-testid="section-action-steps">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
                Step-by-Step Actions
              </h2>
              <div className="space-y-4">
                {actionSteps.map((step: any, i: number) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold text-sm flex-shrink-0">{i + 1}</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{step.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{step.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {reasoningSteps.length > 0 && (
            <div className="bg-blue-50 rounded-2xl p-6" data-testid="section-clinical-reasoning">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Brain className="w-6 h-6 text-blue-500" />
                Clinical Reasoning
              </h2>
              <div className="space-y-4">
                {reasoningSteps.map((step: any, i: number) => (
                  <div key={i} className="bg-white rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-1">{step.title}</h3>
                    <p className="text-sm text-gray-600">{step.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {communicationTips.length > 0 && (
            <div className="bg-purple-50 rounded-2xl p-6" data-testid="section-communication-tips">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-purple-500" />
                Professional Communication Tips
              </h2>
              <div className="space-y-3">
                {communicationTips.map((tip: any, i: number) => (
                  <div key={i} className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">{tip.title}</h3>
                      <p className="text-sm text-gray-600">{tip.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {sections.length === 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">{t("pages.newGrad.clinicalScenarioPage.contentComingSoon")}</h2>
              <p className="text-gray-600">{t("pages.newGrad.clinicalScenarioPage.thisClinicalScenarioWalkthroughIs")}</p>
            </div>
          )}
        </div>
      </section>

      <SocialShareCards title={guide.title} description={guide.summary || ""} url={`/new-grad/scenario/${params.slug}`} tags={guide.tags || []} />
      <InternalLinks currentPath={`/new-grad/scenario/${params.slug}`} profession={guide.profession} professionName={profession?.name || "Healthcare"} />
      <Footer />
    </div>
  );
}
