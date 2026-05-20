import { Link } from "wouter";
import { SEO } from "@/components/seo";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { PremiumUpgradeCTA } from "./premium-cta";
import { useI18n } from "@/lib/i18n";
import { CLINICAL_REFERENCE_LESSONS } from "@/data/newgrad/clinical-reference-content";
import {
  ArrowRight, BookOpen, Thermometer, Droplets, HeartPulse, Monitor,
  HeartCrack, Calculator, ArrowLeftRight, GraduationCap, AlertTriangle,
  Lightbulb, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import type { LucideIcon } from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Thermometer, Droplets, HeartPulse, Monitor, HeartCrack, Calculator, ArrowLeftRight,
};

export default function ClinicalReferencesPage() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-gray-50" data-testid="clinical-references-page">
      <Navigation />
      <SEO
        title={t("newGrad.clinicalRef.seoTitle")}
        description={t("newGrad.clinicalRef.seoDescription")}
        keywords="new grad clinical reference, sepsis management, DKA protocol, ICU monitoring, cardiac emergencies, medication calculations, clinical handoff, SBAR"
        canonicalPath="/newgrad/clinical-references"
        breadcrumbs={[
          { name: t("newGrad.common.home"), url: "https://www.nursenest.ca" },
          { name: t("newGrad.common.newGradCareerHub"), url: "https://www.nursenest.ca/newgrad" },
          { name: t("newGrad.common.clinicalReferences"), url: "https://www.nursenest.ca/newgrad/clinical-references" },
        ]}
      />

      <section className="relative py-14 sm:py-18 overflow-hidden" data-testid="section-clinical-hero">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-orange-50/30 to-white" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <BreadcrumbNav
            items={[
              { name: t("newGrad.common.home"), url: "https://www.nursenest.ca/" },
              { name: t("newGrad.common.newGradCareerHub"), url: "https://www.nursenest.ca/newgrad" },
              { name: t("newGrad.common.clinicalReferences"), url: "https://www.nursenest.ca/newgrad/clinical-references" },
            ]}
          />
          <div className="mt-6 max-w-3xl">
            <Badge className="mb-4 bg-red-100 text-red-700" data-testid="badge-clinical-ref">
              <AlertTriangle className="w-3 h-3 mr-1" /> {t("newGrad.clinicalRef.badge")}
            </Badge>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight" data-testid="text-clinical-ref-title">
              {t("newGrad.clinicalRef.title")}
            </h1>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-6" data-testid="text-clinical-ref-subtitle">
              {t("newGrad.clinicalRef.subtitle")}
            </p>
            <Link href="/newgrad/survival-guide" className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors text-sm shadow-lg shadow-emerald-200" data-testid="button-survival-guide">
              <BookOpen className="w-4 h-4" /> {t("newGrad.common.viewSurvivalGuide")}
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10" data-testid="section-clinical-topics">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CLINICAL_REFERENCE_LESSONS.map((lesson) => {
            const IconComp = ICON_MAP[lesson.icon] || BookOpen;
            return (
              <Link key={lesson.slug} href={`/newgrad/clinical-references/${lesson.slug}`}>
                <Card className="h-full hover:shadow-lg transition-all cursor-pointer group border-gray-100" data-testid={`card-clinical-${lesson.slug}`}>
                  <CardContent className="p-6">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${lesson.color}15` }}>
                      <IconComp className="w-5.5 h-5.5" style={{ color: lesson.color }} />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors" data-testid={`text-title-${lesson.slug}`}>
                      {lesson.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed mb-3 line-clamp-3">
                      {lesson.overview.substring(0, 150)}...
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px]">
                          <Lightbulb className="w-2.5 h-2.5 mr-0.5" /> {lesson.clinicalPearls.length} {t("newGrad.clinicalRef.pearls")}
                        </Badge>
                        <Badge variant="outline" className="text-[10px]">
                          <Zap className="w-2.5 h-2.5 mr-0.5" /> {lesson.flashcards.length} {t("newGrad.clinicalRef.cards")}
                        </Badge>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PremiumUpgradeCTA requiredEntitlement="toolkit" context="Access premium brain sheets, shift templates, and the full clinical resource library with your New Grad Toolkit subscription." />
      </div>

      <section className="bg-gradient-to-r from-red-600 to-orange-600 py-14" data-testid="section-clinical-cta">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            {t("newGrad.clinicalRef.buildConfidence")}
          </h2>
          <p className="text-red-100 mb-8 max-w-xl mx-auto">
            {t("newGrad.clinicalRef.buildConfidenceDesc")}
          </p>
          <Link href="/newgrad">
            <Button className="bg-white text-red-700 hover:bg-red-50 rounded-full px-8 gap-2" data-testid="button-back-to-hub">
              <GraduationCap className="w-4 h-4" /> {t("newGrad.common.backToCareerHub")}
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
