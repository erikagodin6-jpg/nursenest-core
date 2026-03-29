import { useParams, Link } from "wouter";
import { getCareerByRouteSlug, getCanonicalRoute } from "@shared/careers";
import { Wrench, ChevronRight, ArrowRight, Lock, Zap, Calculator, Activity, Microscope, Radio } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { AlliedSEO } from "@/allied/allied-seo";
import { ComingSoonFallback } from "@/allied/components/coming-soon-fallback";

import { useI18n } from "@/lib/i18n";
const TOOL_ICONS: Record<string, any> = {
  "abg-engine": Activity, "ventilator-sim": Zap, "trauma-algorithm": Activity, "ecg-drill": Activity,
  "dosage-calc": Calculator, "compounding-sim": Calculator, "lab-critical": Microscope, "morphology-drill": Microscope,
  "anatomy-sim": Radio, "image-recognition": Radio,
};

const EXTRA_TOOLS: Record<string, { name: string; description: string; id: string }[]> = {
  rrt: [{ id: "oxygen-device", name: "Oxygen Device Selector", description: "Match the right O2 delivery device to patient needs" }],
  paramedic: [{ id: "drug-calc", name: "Emergency Drug Calculator", description: "Calculate field medication doses by weight and protocol" }],
  "pharmacy-tech": [{ id: "iv-drip", name: "IV Drip Rate Calculator", description: "Calculate IV flow rates, drip factors, and infusion times" }],
  mlt: [{ id: "micro-id", name: "Micro ID Decision Tree", description: "Identify microorganisms through systematic testing pathways" }],
  imaging: [{ id: "positioning", name: "Positioning Technique Engine", description: "Learn proper patient positioning for radiographic procedures" }],
};

export default function AlliedToolsPage() {
  const { t } = useI18n();
  const params = useParams<{ careerSlug: string }>();
  const career = getCareerByRouteSlug(params.careerSlug || "");
  const { user } = useAuth();
  const isPro = user?.tier === "admin" || user?.subscriptionStatus === "active";

  if (!career) {
    return <div className="max-w-2xl mx-auto px-4 py-20 text-center"><h1 className="text-2xl font-bold">{t("allied.alliedTools.careerNotFound")}</h1></div>;
  }

  const extras = EXTRA_TOOLS[career.slug] || [];

  if (career.aiTools.length === 0 && extras.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16" data-testid="allied-tools-page">
        <AlliedSEO
          title={`${career.name} AI Study Tools`}
          description={`AI-powered study tools for ${career.name} are being developed.`}
          keywords={`${career.name} study tools`}
          canonicalPath={`${getCanonicalRoute(career.slug)}/tools`}
        />
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href={getCanonicalRoute(career.slug)} className="hover:text-teal-600">{career.shortName}</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-teal-700 font-medium">{t("allied.alliedTools.aiTools")}</span>
        </div>
        <ComingSoonFallback
          title={`${career.shortName} AI Tools — In Development`}
          description={`Interactive AI-powered study tools for ${career.shortName} exam preparation are being developed by our team of certified professionals.`}
          careerSlug={career.slug}
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8" data-testid="allied-tools-page">
      <AlliedSEO
        title={`${career.name} AI Study Tools - Interactive Learning`}
        description={`Career-specific AI-powered study tools for ${career.name} exam prep. Interactive calculators, simulators, and practice engines designed for ${career.examNames[0]} certification success.`}
        keywords={`${career.name} study tools, ${career.name} AI tools, ${career.examNames[0]} interactive tools, ${career.name} calculators, ${career.name} simulators`}
        canonicalPath={`${getCanonicalRoute(career.slug)}/tools`}
      />
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href={getCanonicalRoute(career.slug)} className="hover:text-teal-600">{career.shortName}</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-teal-700 font-medium">{t("allied.alliedTools.aiTools2")}</span>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-2" data-testid="text-tools-title">{career.shortName} AI-Powered Tools</h1>
      <p className="text-gray-600 mb-8">{t("allied.alliedTools.interactiveCareerspecificSimulatorsAndCalcula")}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {career.aiTools.map(tool => {
          const IconComp = TOOL_ICONS[tool.id] || Wrench;
          return (
            <div key={tool.id} className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-teal-200 hover:shadow-md transition-all" data-testid={`tool-card-${tool.id}`}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center flex-shrink-0">
                  <IconComp className="w-6 h-6 text-teal-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{tool.name}</h3>
                  <p className="text-sm text-gray-500 mb-4">{tool.description}</p>
                  {isPro ? (
                    <Link href={tool.route} className="inline-flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700" data-testid={`button-launch-${tool.id}`}>
                      Launch Tool <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : (
                    <Link href="/allied-health/pricing" className="inline-flex items-center gap-1 text-sm font-medium text-gray-400" data-testid={`button-locked-${tool.id}`}>
                      <Lock className="w-3.5 h-3.5" /> PRO Only
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {extras.map(tool => (
          <div key={tool.id} className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-teal-200 hover:shadow-md transition-all" data-testid={`tool-card-${tool.id}`}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center flex-shrink-0">
                <Wrench className="w-6 h-6 text-gray-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{tool.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{tool.description}</p>
                <span className="text-xs text-gray-400 font-medium">{t("allied.alliedTools.inDevelopment")}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
