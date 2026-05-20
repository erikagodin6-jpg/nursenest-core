import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { CAREER_CONFIGS, getEnabledCareers, type CareerConfig, type CareerType } from "@shared/careers";
import { useI18n } from "@/lib/i18n";
import {
  BookOpen,
  Users,
  BarChart3,
  TrendingUp,
  Stethoscope,
  Wind,
  Ambulance,
  Pill,
  Microscope,
  ScanLine,
  HeartPulse,
  Siren,
  Scissors,
  Ribbon,
  Baby,
  Brain,
  ShieldCheck,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";

const ICON_MAP: Record<string, any> = {
  Stethoscope,
  Wind,
  Ambulance,
  Pill,
  Microscope,
  ScanLine,
  HeartPulse,
  Siren,
  Scissors,
  Ribbon,
  Baby,
  Brain,
  Users,
  ShieldCheck,
};

export default function AdminCareersPage() {
  const { t } = useI18n();
  const { isAdmin } = useAuth();
  const [, setLocation] = useLocation();
  const [stats, setStats] = useState<Record<string, { questions: number; subscribers: number }>>({});

  useEffect(() => {
    if (!isAdmin) {
      setLocation("/");
      return;
    }
    fetch("/api/admin/career-stats")
      .then(r => r.ok ? r.json() : {})
      .then(setStats)
      .catch(() => {});
  }, [isAdmin]);

  if (!isAdmin) return null;

  const allCareers = Object.values(CAREER_CONFIGS);
  const nursingCareer = CAREER_CONFIGS.nursing;
  const alliedCareers = allCareers.filter(c => c.id !== "nursing");

  const totalQuestions = Object.values(stats).reduce((sum, s) => sum + s.questions, 0);
  const totalSubscribers = Object.values(stats).reduce((sum, s) => sum + s.subscribers, 0);

  return (
    <>
      <SEO title={t("pages.adminCareers.careerManagementAdminNursenest")} description={t("pages.adminCareers.manageCareerVerticalsAndContent")} />
      <Navigation />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Button variant="ghost" className="mb-4" onClick={() => setLocation("/admin")} data-testid="button-back-admin">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Admin
          </Button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900" data-testid="text-admin-careers-heading">
              Career Vertical Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage all {allCareers.length} career verticals, content, and subscriptions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold" data-testid="text-total-careers">{allCareers.length}</p>
                    <p className="text-sm text-gray-500">{t("pages.adminCareers.careerVerticals")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold" data-testid="text-enabled-careers">{getEnabledCareers().length}</p>
                    <p className="text-sm text-gray-500">{t("pages.adminCareers.enabled")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold" data-testid="text-total-questions">{totalQuestions.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">{t("pages.adminCareers.totalQuestions")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Users className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold" data-testid="text-total-subscribers">{totalSubscribers.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">{t("pages.adminCareers.subscribers")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-1">{t("pages.adminCareers.corePlatform")}</h2>
            <p className="text-sm text-gray-500 mb-4">{t("pages.adminCareers.originalNursingExamPreparationPlatform")}</p>
            <CareerCard career={nursingCareer} stats={stats[nursingCareer.id]} />
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-1">{t("pages.adminCareers.alliedHealthCareers")}</h2>
            <p className="text-sm text-gray-500 mb-4">{t("pages.adminCareers.phase14CareerVerticalExpansion")}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {alliedCareers.map(career => (
                <CareerCard key={career.id} career={career} stats={stats[career.id]} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

function CareerCard({ career, stats }: { career: CareerConfig; stats?: { questions: number; subscribers: number } }) {
  const IconComponent = ICON_MAP[career.icon] || BookOpen;
  const questionCount = stats?.questions || 0;
  const subscriberCount = stats?.subscribers || 0;

  const phase = career.id === "nursing" ? "Core" :
    ["rrt", "paramedic", "pharmacyTech", "mlt", "imaging"].includes(career.id) ? "Phase 1-2" :
    ["criticalCare", "emergencyNursing", "perioperative", "oncologyNursing", "pediatricCert"].includes(career.id) ? "Phase 3" :
    "Phase 4";

  return (
    <Card className="hover:shadow-md transition-shadow" data-testid={`card-career-admin-${career.slug}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: career.colorAccent }}
            >
              <IconComponent className="w-5 h-5" style={{ color: career.color }} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">{career.shortName}</h3>
              <p className="text-xs text-gray-500">{career.examNames.slice(0, 2).join(", ")}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">{phase}</Badge>
            {career.enabled ? (
              <Badge className="bg-green-100 text-green-700 text-xs">{t("pages.adminCareers.active")}</Badge>
            ) : (
              <Badge variant="secondary" className="text-xs">{t("pages.adminCareers.disabled")}</Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-gray-50 rounded p-2">
            <p className="text-lg font-bold text-gray-900">{questionCount.toLocaleString()}</p>
            <p className="text-xs text-gray-500">{t("pages.adminCareers.questions")}</p>
          </div>
          <div className="bg-gray-50 rounded p-2">
            <p className="text-lg font-bold text-gray-900">{subscriberCount}</p>
            <p className="text-xs text-gray-500">{t("pages.adminCareers.subscribers2")}</p>
          </div>
          <div className="bg-gray-50 rounded p-2">
            <p className="text-lg font-bold text-gray-900">{career.domains.length}</p>
            <p className="text-xs text-gray-500">{t("pages.adminCareers.domains")}</p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-1">
          {career.tiers.map(tier => (
            <Badge key={tier.id} variant="outline" className="text-xs" style={{ borderColor: career.color + "40", color: career.color }}>
              {tier.name}
            </Badge>
          ))}
        </div>

        <div className="mt-3 pt-3 border-t flex items-center justify-between">
          <span className="text-xs text-gray-500">{career.aiTools.length} AI Tools</span>
          <span className="text-xs text-gray-500">{career.routePrefix}</span>
        </div>
      </CardContent>
    </Card>
  );
}
