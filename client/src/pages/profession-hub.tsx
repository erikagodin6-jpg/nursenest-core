import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, FileText, Brain, Target, ArrowRight, BarChart3, Calendar } from "lucide-react";
import { EndOfContentLeadCapture } from "@/components/lead-capture";
import { ContextualRelatedResources, CrossPlatformRelatedContent } from "@/components/related-resources";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { SEO } from "@/components/seo";

import { useI18n } from "@/lib/i18n";
interface Profession {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  description: string;
  color: string;
  colorAccent: string;
  routePrefix: string;
  examNames: string[];
  domains: string[];
  modules: Record<string, boolean>;
  questionCount: number;
  hubTitle: string | null;
  hubDescription: string | null;
  status: string;
}

const MODULE_INFO = [
  { key: "lessons", label: "Lessons", desc: "Structured learning content for every exam domain", icon: BookOpen, path: "/lessons" },
  { key: "flashcards", label: "Flashcards", desc: "Spaced repetition cards for key concepts", icon: Brain, path: "/flashcards" },
  { key: "practiceExams", label: "Practice Exams", desc: "Timed mock exams with detailed performance reports", icon: FileText, path: "/mock-exams" },
  { key: "adaptiveExams", label: "Adaptive Exams", desc: "CAT-style exams that adapt to your ability level", icon: Target, path: "/mock-exams" },
  { key: "studyPacks", label: "Study Plans", desc: "Personalized daily study plans targeting weak areas", icon: Calendar, path: "/study-plan" },
];

export default function ProfessionHubPage() {
  const { t } = useI18n();
  const params = useParams<{ slug: string }>();

  const { data: profession, isLoading, error } = useQuery<Profession>({
    queryKey: [`/api/professions/${params.slug}`],
    enabled: !!params.slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profession || error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4" data-testid="text-not-found">{t("pages.professionHub.professionNotFound")}</h1>
        <p className="text-gray-600 mb-6">{t("pages.professionHub.theProfessionYoureLookingFor")}</p>
        <Link href="/" className="text-teal-600 font-medium hover:underline" data-testid="link-home">{t("pages.professionHub.goHome")}</Link>
      </div>
    );
  }

  const enabledModules = MODULE_INFO.filter(m => profession.modules?.[m.key]);

  return (
    <div data-testid={`profession-hub-${profession.slug}`}>
      <SEO
        title={`${profession.hubTitle || profession.name + " Exam Preparation"} | NurseNest`}
        description={profession.hubDescription || profession.description || `Comprehensive exam prep for ${profession.name}.`}
        canonicalPath={`/professions/${profession.slug}`}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca/" },
          { name: profession.name, url: `https://www.nursenest.ca/professions/${profession.slug}` },
        ]}
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <BreadcrumbNav items={[
          { name: "Home", url: "https://www.nursenest.ca/" },
          { name: profession.name, url: `https://www.nursenest.ca/professions/${profession.slug}` },
        ]} />
      </div>
      <section className="relative overflow-hidden py-16 sm:py-20" style={{ background: `linear-gradient(135deg, ${profession.colorAccent} 0%, white 100%)` }}>
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium mb-6" style={{ backgroundColor: profession.color + "20", color: profession.color }}>
            {profession.shortName} Exam Prep
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4" data-testid="text-hub-title">
            {profession.hubTitle || `${profession.name} Exam Preparation`}
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto" data-testid="text-hub-description">
            {profession.hubDescription || profession.description || `Comprehensive exam prep for ${profession.examNames?.join(", ") || profession.name} certification.`}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`${profession.routePrefix}/study-plan`} className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-white rounded-xl text-base font-semibold transition-all shadow-lg" style={{ backgroundColor: profession.color }} data-testid="button-start-studying">
              Start Studying <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href={`${profession.routePrefix}/mock-exams`} className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white rounded-xl text-base font-semibold border transition-all" style={{ color: profession.color, borderColor: profession.color + "40" }} data-testid="button-view-study-plan">
              View Study Plan
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { label: "Practice Questions", value: profession.questionCount > 0 ? `${profession.questionCount}+` : "Coming soon" },
              { label: "Exam Domains", value: profession.domains?.length || 0 },
              { label: "Covered Exams", value: profession.examNames?.length || 0 },
              { label: "Study Modules", value: enabledModules.length },
            ].map(({ label, value }) => (
              <div key={label} className="text-center p-4 bg-gray-50 rounded-xl">
                <p className="text-2xl font-bold" style={{ color: profession.color }} data-testid={`stat-${label.toLowerCase().replace(/\s/g, "-")}`}>{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{t("pages.professionHub.availableStudyModules")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {enabledModules.map((m) => (
              <Link key={m.key} href={`${profession.routePrefix}${m.path}`} className="block p-5 bg-white border rounded-xl hover:shadow-md transition-shadow" data-testid={`module-card-${m.key}`}>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: profession.colorAccent }}>
                    <m.icon className="w-5 h-5" style={{ color: profession.color }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{m.label}</h3>
                    <p className="text-sm text-gray-500 mt-1">{m.desc}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {profession.domains && profession.domains.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{t("pages.professionHub.examDomainsCovered")}</h2>
            <div className="flex flex-wrap gap-2 justify-center">
              {profession.domains.map((d) => (
                <span key={d} className="px-3 py-1.5 text-sm font-medium rounded-full" style={{ backgroundColor: profession.colorAccent, color: profession.color }} data-testid={`domain-badge-${d}`}>
                  {d}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {profession.examNames && profession.examNames.length > 0 && (
        <section className="py-12 bg-white">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("pages.professionHub.coveredExams")}</h2>
            <div className="flex flex-wrap gap-3 justify-center">
              {profession.examNames.map((exam) => (
                <div key={exam} className="px-4 py-2 bg-gray-50 border rounded-lg text-sm font-medium text-gray-700" data-testid={`exam-badge-${exam}`}>
                  {exam}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <ContextualRelatedResources
          pageType="professionHub"
          profession={profession.shortName || profession.name}
          currentPath={`/professions/${profession.slug}`}
          className="border-t border-gray-200"
        />
        <CrossPlatformRelatedContent
          slug={profession.slug}
          source="nursing"
        />
      </div>

      <EndOfContentLeadCapture
        leadMagnetType="study_guide"
        professionContext={profession.shortName || profession.name}
        source={`profession_hub_${profession.slug}`}
      />
    </div>
  );
}
