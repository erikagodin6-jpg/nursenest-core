import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useI18n } from "@/lib/i18n";
import { ArrowRight } from "lucide-react";

export default function HomeCareerCta() {
  const [, setLocation] = useLocation();
  const { t } = useI18n();

  return (
    <section className="border-t border-gray-100" style={{ paddingTop: 'var(--space-block)', paddingBottom: 'var(--space-block)' }} data-testid="section-career-journey-cta">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <div className="bg-gradient-to-r from-blue-50/60 via-indigo-50/40 to-purple-50/30 rounded-3xl border border-blue-100/60 p-8 sm:p-12 shadow-[var(--shadow-card)]">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-blue-200/60 shadow-[var(--shadow-card)] mb-5">
            <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-xs sm:text-sm font-medium text-blue-700">{t("home.career.journeyBadge")}</span>
          </div>
          <h2 className="font-bold text-gray-900 mb-3" style={{ fontSize: 'var(--text-section)' }}>{t("home.career.journeyTitle")}</h2>
          <p className="text-gray-500 max-w-2xl mx-auto mb-8 text-base lg:text-lg">{t("home.career.journeySubtitle")}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold shadow-[var(--shadow-card)]"
              onClick={() => setLocation("/career-journey")}
              data-testid="button-career-journey-home"
            >
              {t("home.career.exploreJourney")}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              variant="outline"
              className="border-blue-200 text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-full font-medium"
              onClick={() => setLocation("/career-journey/nursing")}
              data-testid="button-career-journey-nursing"
            >
              {t("home.career.rnPath")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
