import { useRoute } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { LocaleLink } from "@/lib/LocaleLink";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import {
  JOURNEY_CONFIGS, GENERIC_JOURNEY, getAllJourneySlugs,
  type JourneyConfig, type JourneyStep,
} from "@/data/career-journey-data";
import {
  BookOpen, Target, GraduationCap, Briefcase,
  ArrowRight, CheckCircle2, ChevronRight, Sparkles,
  Stethoscope, Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useI18n } from "@/lib/i18n";
const ICON_MAP: Record<string, any> = {
  BookOpen, Target, GraduationCap, Briefcase,
};

const PLATFORM_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  nursenest: { label: "NurseNest", color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
  newgrad: { label: "New Grad Hub", color: "text-indigo-700", bg: "bg-indigo-50 border-indigo-200" },
  applynest: { label: "ApplyNest", color: "text-purple-700", bg: "bg-purple-50 border-purple-200" },
};

const STEP_COLORS: Record<string, { bg: string; border: string; iconBg: string; text: string; accent: string }> = {
  blue: { bg: "bg-blue-50/50", border: "border-blue-200/60", iconBg: "bg-blue-100", text: "text-blue-700", accent: "text-blue-600" },
  emerald: { bg: "bg-emerald-50/50", border: "border-emerald-200/60", iconBg: "bg-emerald-100", text: "text-emerald-700", accent: "text-emerald-600" },
  indigo: { bg: "bg-indigo-50/50", border: "border-indigo-200/60", iconBg: "bg-indigo-100", text: "text-indigo-700", accent: "text-indigo-600" },
  purple: { bg: "bg-purple-50/50", border: "border-purple-200/60", iconBg: "bg-purple-100", text: "text-purple-700", accent: "text-purple-600" },
};

function StepCard({ step, isLast }: { step: JourneyStep; isLast: boolean }) {
  const { t } = useI18n();
  const Icon = ICON_MAP[step.icon] || BookOpen;
  const colors = STEP_COLORS[step.color] || STEP_COLORS.blue;
  const platform = PLATFORM_LABELS[step.platform];

  return (
    <div className="relative" data-testid={`journey-step-${step.id}`}>
      <div className="flex gap-4 sm:gap-6">
        <div className="flex flex-col items-center shrink-0">
          <div className={cn("w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shadow-sm border", colors.iconBg, colors.border)}>
            <Icon className={cn("w-6 h-6 sm:w-7 sm:h-7", colors.text)} />
          </div>
          {!isLast && (
            <div className="w-0.5 flex-1 min-h-[40px] bg-gradient-to-b from-gray-200 to-gray-100 mt-3" />
          )}
        </div>

        <div className="flex-1 pb-10">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={cn("text-xs font-bold uppercase tracking-wider", colors.accent)} data-testid={`step-number-${step.id}`}>
              Step {step.number}
            </span>
            <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border", platform.bg, platform.color)}>
              {step.platform === "applynest" && <Briefcase className="w-2.5 h-2.5" />}
              {step.platform === "nursenest" && <Stethoscope className="w-2.5 h-2.5" />}
              {step.platform === "newgrad" && <GraduationCap className="w-2.5 h-2.5" />}
              {platform.label}
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2" data-testid={`step-title-${step.id}`}>
            {step.title}
          </h3>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
            {step.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {step.links.map((link, idx) => (
              <LocaleLink key={idx} href={link.href}>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "text-xs sm:text-sm h-8 sm:h-9 rounded-lg border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all group",
                  )}
                  data-testid={`link-step-${step.id}-${idx}`}
                >
                  {link.label}
                  <ChevronRight className="w-3 h-3 ml-1 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </Button>
              </LocaleLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfessionPicker({ currentSlug }: { currentSlug: string }) {
  const allSlugs = getAllJourneySlugs();
  const others = allSlugs.filter(s => s !== currentSlug);

  return (
    <section className="py-12 bg-gray-50/50" data-testid="section-profession-picker">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 text-center">{t("pages.careerJourney.exploreOtherCareerPaths")}</h2>
        <p className="text-sm text-gray-500 text-center mb-6">{t("pages.careerJourney.chooseAProfessionToSee")}</p>
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
          {others.map(slug => {
            const journey = JOURNEY_CONFIGS[slug];
            if (!journey) return null;
            return (
              <LocaleLink key={slug} href={`/career-journey/${slug}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full text-xs sm:text-sm border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
                  data-testid={`link-journey-${slug}`}
                >
                  {journey.shortName}
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </LocaleLink>
            );
          })}
          <LocaleLink href="/career-journey">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full text-xs sm:text-sm border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all"
              data-testid="link-journey-generic"
            >
              All Professions
            </Button>
          </LocaleLink>
        </div>
      </div>
    </section>
  );
}

function JourneyPageContent({ journey, isGeneric }: { journey: JourneyConfig; isGeneric: boolean }) {
  const basePath = isGeneric ? "/career-journey" : `/career-journey/${journey.slug}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: journey.heroTitle,
    description: journey.heroDescription,
    step: journey.steps.map(step => ({
      "@type": "HowToStep",
      position: step.number,
      name: step.title,
      text: step.description,
      url: `https://www.nursenest.ca${basePath}#${step.id}`,
    })),
  };

  const breadcrumbItems = [
    { name: "Home", url: "https://www.nursenest.ca" },
    ...(isGeneric
      ? [{ name: "Career Journey", url: "https://www.nursenest.ca/career-journey" }]
      : [
          { name: "Career Journey", url: "https://www.nursenest.ca/career-journey" },
          { name: `${journey.shortName} Path`, url: `https://www.nursenest.ca/career-journey/${journey.slug}` },
        ]),
  ];

  return (
    <div className="min-h-screen bg-white" data-testid="career-journey-page">
      <Navigation />
      <SEO
        title={journey.seoTitle}
        description={journey.seoDescription}
        keywords={journey.seoKeywords}
        canonicalPath={isGeneric ? "/career-journey" : `/career-journey/${journey.slug}`}
        structuredData={structuredData}
        breadcrumbs={breadcrumbItems}
      />

      <section className="relative py-14 sm:py-20 overflow-hidden" data-testid="section-journey-hero">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50/40 to-purple-50/30" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-purple-100/30 blur-3xl -translate-y-1/2 translate-x-1/3 hidden md:block" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
          <BreadcrumbNav items={breadcrumbItems} />

          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-blue-200 shadow-sm mb-4" data-testid="badge-journey-type">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-xs sm:text-sm font-medium text-blue-700">{journey.tagline}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight" data-testid="text-journey-h1">
              {journey.heroTitle}
            </h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed" data-testid="text-journey-description">
              {journey.heroDescription}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-200 text-sm text-gray-600 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
                <span>{t("pages.careerJourney.4stepJourney")}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-200 text-sm text-gray-600 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>{t("pages.careerJourney.linkedResources")}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-200 text-sm text-gray-600 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-purple-500" />
                <span>{t("pages.careerJourney.3PlatformsConnected")}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16" data-testid="section-journey-steps">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-center gap-2 mb-10">
            <Zap className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{t("pages.careerJourney.yourStepbystepPath")}</h2>
          </div>
          {journey.steps.map((step, idx) => (
            <StepCard key={step.id} step={step} isLast={idx === journey.steps.length - 1} />
          ))}
        </div>
      </section>

      <section className="py-10 sm:py-12 bg-white" data-testid="section-applynest-link">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-sm text-gray-600 leading-relaxed">
            Ready to apply? From program applications to scholarship searches, <a href="https://applynest.ca" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-medium hover:underline" data-testid="link-applynest-career-journey">{t("pages.careerJourney.applynestHasTheToolsTo")}</a>.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-gradient-to-br from-[#2E3A59] to-[#1a2236]" data-testid="section-journey-cta">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
            Ready to Start Your {journey.shortName} Journey?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mb-6 max-w-xl mx-auto">
            Begin with free practice to assess your baseline knowledge, then follow the path to exam success and career launch.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <LocaleLink href="/register">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl" data-testid="button-journey-start">
                Start Free Practice
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </LocaleLink>
            <LocaleLink href="/pricing">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 px-6 py-2.5 rounded-xl" data-testid="button-journey-pricing">
                View Plans
              </Button>
            </LocaleLink>
          </div>
        </div>
      </section>

      {!isGeneric && <ProfessionPicker currentSlug={journey.slug} />}

      {isGeneric && (
        <section className="py-12 sm:py-16 bg-gray-50/50" data-testid="section-profession-journeys">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 text-center">{t("pages.careerJourney.professionspecificCareerPaths")}</h2>
            <p className="text-sm text-gray-500 text-center mb-8 max-w-2xl mx-auto">
              Each profession has unique exam requirements, transition challenges, and career opportunities. Explore the journey tailored to your track.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {getAllJourneySlugs().map(slug => {
                const j = JOURNEY_CONFIGS[slug];
                if (!j) return null;
                return (
                  <LocaleLink key={slug} href={`/career-journey/${slug}`}>
                    <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-blue-200 transition-all group cursor-pointer h-full" data-testid={`card-journey-${slug}`}>
                      <h3 className="font-bold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors">{j.professionName}</h3>
                      <p className="text-xs text-gray-500 mb-3 line-clamp-2">{j.tagline}</p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {j.steps.map(s => (
                          <span key={s.id} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">{s.title.split(" ").slice(0, 2).join(" ")}</span>
                        ))}
                      </div>
                      <span className="inline-flex items-center gap-1 text-sm text-blue-600 font-medium">
                        View Journey <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </LocaleLink>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}

export function GenericCareerJourney() {
  return <JourneyPageContent journey={GENERIC_JOURNEY} isGeneric={true} />;
}

export function ProfessionCareerJourney() {
  const [, params] = useRoute("/career-journey/:slug");
  const slug = params?.slug || "";
  const journey = JOURNEY_CONFIGS[slug];

  if (!journey) {
    return (
      <div className="min-h-screen bg-white" data-testid="career-journey-not-found">
        <Navigation />
        <SEO
          title={t("pages.careerJourney.careerPathNotFoundNursenest")}
          description={t("pages.careerJourney.theCareerPathYoureLooking")}
          canonicalPath="/career-journey"
          noindex={true}
        />
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-3" data-testid="text-journey-not-found">{t("pages.careerJourney.careerPathNotFound")}</h1>
          <p className="text-gray-600 mb-6">We don't have a career journey for "{slug}" yet. Explore our available career paths below.</p>
          <LocaleLink href="/career-journey">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl" data-testid="button-journey-browse-all">
              Browse All Career Paths
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </LocaleLink>
        </div>
        <Footer />
      </div>
    );
  }

  return <JourneyPageContent journey={journey} isGeneric={false} />;
}

export default GenericCareerJourney;
