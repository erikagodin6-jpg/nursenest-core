import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { useI18n } from "@/lib/i18n";
import {
  BarChart3, FileText, Globe, Brain, BookOpen, Mail,
  Users, CheckCircle2, AlertTriangle, ArrowLeft, Layers,
  Target, TrendingUp, Search, MessageSquare, RefreshCw
} from "lucide-react";

interface ProgressReport {
  summary: {
    totalProfessions: number;
    activeProfessions: number;
    launchedProfessions: number;
    draftProfessions: number;
  };
  content: {
    blogPosts: { total: number; published: number };
    seoPages: { total: number };
    seoArticles: { total: number; published: number };
    imagingSeoPages: { total: number };
    practicePages: { total: number };
    programmaticSeoPages: { total: number };
    encyclopediaEntries: { total: number };
    contentByType: Record<string, { total: number; published: number }>;
  };
  questions: {
    examQuestions: { total: number; published: number };
    alliedQuestions: Record<string, { total: number; approved: number }>;
    imagingQuestions: { total: number };
    totalAllQuestions: number;
  };
  flashcards: {
    flashcardBank: { total: number };
    imagingFlashcards: { total: number };
  };
  studyGuides: {
    total: number;
    byCategory: Record<string, number>;
  };
  emailCapture: {
    subscribers: { total: number };
    imagingLeads: { total: number };
    nurtureSequences: { total: number };
  };
  seoClusters: {
    topicClusters: { total: number };
    blogClusters: { total: number };
  };
  professionCoverage: Array<{
    id: string;
    slug: string;
    name: string;
    shortName: string;
    status: string;
    color: string;
    questionCount: number;
    alliedQuestions: number;
    alliedApproved: number;
    enabledModules: Record<string, boolean>;
    contentTypes: Record<string, string>;
  }>;
  generatedAt: string;
}

function StatCard({ label, value, sub, icon: Icon, color = "teal" }: {
  label: string; value: number | string; sub?: string; icon: any; color?: string;
}) {
  const { t } = useI18n();
  const colorClasses: Record<string, string> = {
    teal: "bg-teal-50 text-teal-600",
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    green: "bg-green-50 text-green-600",
    orange: "bg-orange-50 text-orange-600",
    red: "bg-red-50 text-red-600",
    indigo: "bg-indigo-50 text-indigo-600",
    pink: "bg-pink-50 text-pink-600",
  };
  return (
    <div className="bg-white border rounded-xl p-5 hover:shadow-sm transition-shadow" data-testid={`stat-${label.toLowerCase().replace(/\s+/g, "-")}`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[color] || colorClasses.teal}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="text-2xl font-bold text-gray-900">{typeof value === "number" ? value.toLocaleString() : value}</div>
      <div className="text-sm text-gray-500 mt-1">{label}</div>
      {sub && <div className="text-xs text-gray-400 mt-0.5">{sub}</div>}
    </div>
  );
}

function SectionHeader({ title, icon: Icon }: { title: string; icon: any }) {
  return (
    <div className="flex items-center gap-2 mb-4 mt-8">
      <Icon className="w-5 h-5 text-gray-700" />
      <h2 className="text-lg font-bold text-gray-900">{title}</h2>
    </div>
  );
}

function CoverageRow({ profession }: { profession: ProgressReport["professionCoverage"][0] }) {
  const statusBadge: Record<string, { label: string; className: string }> = {
    draft: { label: "Draft", className: "bg-gray-100 text-gray-600" },
    active: { label: "Active", className: "bg-blue-100 text-blue-700" },
    launched: { label: "Launched", className: "bg-green-100 text-green-700" },
  };
  const badge = statusBadge[profession.status] || statusBadge.draft;
  const modules = profession.enabledModules || {};
  const moduleKeys = ["lessons", "flashcards", "practiceExams", "adaptiveExams", "seoPages", "studyPacks"];

  return (
    <div className="bg-white border rounded-xl p-5 hover:shadow-sm transition-shadow" data-testid={`coverage-${profession.slug}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: profession.color || "#6C63FF" }}>
          {(profession.shortName || profession.name).substring(0, 2)}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900">{profession.name}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge.className}`}>{badge.label}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
        <div className="text-sm">
          <span className="text-gray-500">{t("pages.adminSeoProgress.questions")} </span>
          <span className="font-semibold text-gray-900">{profession.questionCount.toLocaleString()}</span>
        </div>
        <div className="text-sm">
          <span className="text-gray-500">{t("pages.adminSeoProgress.alliedQ")} </span>
          <span className="font-semibold text-gray-900">{profession.alliedQuestions.toLocaleString()}</span>
          {profession.alliedApproved > 0 && (
            <span className="text-xs text-green-600 ml-1">({profession.alliedApproved} approved)</span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {moduleKeys.map((key) => {
          const enabled = modules[key];
          return (
            <span
              key={key}
              className={`text-xs px-2 py-1 rounded-full font-medium ${enabled ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-400"}`}
              data-testid={`module-${profession.slug}-${key}`}
            >
              {enabled ? <CheckCircle2 className="w-3 h-3 inline mr-1" /> : <AlertTriangle className="w-3 h-3 inline mr-1" />}
              {key.replace(/([A-Z])/g, " $1").trim()}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default function AdminSeoProgressPage() {
  const { isAdmin } = useAuth();
  const [, navigate] = useLocation();

  const { data: report, isLoading, refetch, isFetching } = useQuery<ProgressReport>({
    queryKey: ["/api/admin/seo-progress"],
    enabled: isAdmin,
  });

  if (!isAdmin) {
    return <div className="p-8 text-center text-gray-500">{t("pages.adminSeoProgress.adminAccessRequired")}</div>;
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-16 text-gray-500">{t("pages.adminSeoProgress.loadingSeoProgressReport")}</div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-16 text-gray-500">{t("pages.adminSeoProgress.failedToLoadReportData")}</div>
      </div>
    );
  }

  const totalContent =
    report.content.blogPosts.total +
    report.content.seoArticles.total +
    report.content.imagingSeoPages.total +
    report.content.practicePages.total +
    report.content.programmaticSeoPages.total +
    report.content.encyclopediaEntries.total;

  const totalFlashcards =
    report.flashcards.flashcardBank.total +
    report.flashcards.imagingFlashcards.total;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8" data-testid="admin-seo-progress-page">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin")}
            className="p-2 hover:bg-gray-100 rounded-lg"
            data-testid="button-back-admin"
          >
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900" data-testid="text-page-title">{t("pages.adminSeoProgress.seoImplementationProgress")}</h1>
            <p className="text-gray-500 mt-1">
              Comprehensive report of content creation and SEO infrastructure status
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">
            Generated: {new Date(report.generatedAt).toLocaleString()}
          </span>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm font-medium disabled:opacity-50"
            data-testid="button-refresh-report"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      <SectionHeader title={t("pages.adminSeoProgress.platformOverview")} icon={BarChart3} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label={t("pages.adminSeoProgress.totalProfessions")} value={report.summary.totalProfessions} icon={Layers} color="purple" />
        <StatCard label={t("pages.adminSeoProgress.activeLaunched")} value={report.summary.activeProfessions} sub={`${report.summary.launchedProfessions} launched`} icon={CheckCircle2} color="green" />
        <StatCard label={t("pages.adminSeoProgress.draftProfessions")} value={report.summary.draftProfessions} icon={AlertTriangle} color="orange" />
        <StatCard label={t("pages.adminSeoProgress.totalContentPages")} value={totalContent} icon={Globe} color="blue" />
      </div>

      <SectionHeader title={t("pages.adminSeoProgress.contentSeoPages")} icon={FileText} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label={t("pages.adminSeoProgress.blogPosts")} value={report.content.blogPosts.total} sub={`${report.content.blogPosts.published} published`} icon={FileText} color="blue" />
        <StatCard label={t("pages.adminSeoProgress.seoArticles")} value={report.content.seoArticles.total} sub={`${report.content.seoArticles.published} published`} icon={Search} color="teal" />
        <StatCard label={t("pages.adminSeoProgress.seoLandingPages")} value={report.content.seoPages.total} icon={Globe} color="purple" />
        <StatCard label={t("pages.adminSeoProgress.imagingSeoPages")} value={report.content.imagingSeoPages.total} icon={Target} color="indigo" />
        <StatCard label={t("pages.adminSeoProgress.practicePages")} value={report.content.practicePages.total} icon={BookOpen} color="green" />
        <StatCard label={t("pages.adminSeoProgress.programmaticSeo")} value={report.content.programmaticSeoPages.total} icon={TrendingUp} color="orange" />
        <StatCard label={t("pages.adminSeoProgress.encyclopediaEntries")} value={report.content.encyclopediaEntries.total} icon={BookOpen} color="pink" />
        <StatCard label={t("pages.adminSeoProgress.topicClusters")} value={report.seoClusters.topicClusters.total} sub={`${report.seoClusters.blogClusters.total} blog clusters`} icon={Layers} color="indigo" />
      </div>

      {Object.keys(report.content.contentByType).length > 0 && (
        <div className="mt-4 bg-white border rounded-xl p-5" data-testid="content-by-type-breakdown">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">{t("pages.adminSeoProgress.contentItemsByType")}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(report.content.contentByType).map(([type, counts]) => (
              <div key={type} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600 capitalize">{type}</span>
                <div className="text-right">
                  <span className="text-sm font-semibold text-gray-900">{counts.total}</span>
                  <span className="text-xs text-gray-400 ml-1">({counts.published} pub)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <SectionHeader title={t("pages.adminSeoProgress.questionsPractice")} icon={Brain} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label={t("pages.adminSeoProgress.totalQuestions")} value={report.questions.totalAllQuestions} icon={Brain} color="purple" />
        <StatCard label={t("pages.adminSeoProgress.examQuestions")} value={report.questions.examQuestions.total} sub={`${report.questions.examQuestions.published} published`} icon={Target} color="blue" />
        <StatCard label={t("pages.adminSeoProgress.imagingQuestions")} value={report.questions.imagingQuestions.total} icon={Search} color="indigo" />
        <StatCard label={t("pages.adminSeoProgress.flashcards")} value={totalFlashcards} sub={`${report.flashcards.flashcardBank.total} bank + ${report.flashcards.imagingFlashcards.total} imaging`} icon={Brain} color="green" />
      </div>

      {Object.keys(report.questions.alliedQuestions).length > 0 && (
        <div className="mt-4 bg-white border rounded-xl p-5" data-testid="allied-questions-breakdown">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">{t("pages.adminSeoProgress.alliedQuestionsByCareerType")}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(report.questions.alliedQuestions).map(([careerType, counts]) => (
              <div key={careerType} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600 capitalize">{careerType.replace(/([A-Z])/g, " $1").trim()}</span>
                <div className="text-right">
                  <span className="text-sm font-semibold text-gray-900">{counts.total}</span>
                  <span className="text-xs text-green-600 ml-1">({counts.approved} approved)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <SectionHeader title={t("pages.adminSeoProgress.studyGuides")} icon={BookOpen} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label={t("pages.adminSeoProgress.studyGuides2")} value={report.studyGuides.total} icon={BookOpen} color="teal" />
      </div>
      {Object.keys(report.studyGuides.byCategory).length > 0 && (
        <div className="mt-4 bg-white border rounded-xl p-5" data-testid="study-guides-breakdown">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">{t("pages.adminSeoProgress.studyGuidesByCategory")}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(report.studyGuides.byCategory).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600 capitalize">{category}</span>
                <span className="text-sm font-semibold text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <SectionHeader title={t("pages.adminSeoProgress.emailCaptureFunnels")} icon={Mail} />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard label={t("pages.adminSeoProgress.emailSubscribers")} value={report.emailCapture.subscribers.total} icon={Mail} color="blue" />
        <StatCard label={t("pages.adminSeoProgress.imagingLeads")} value={report.emailCapture.imagingLeads.total} icon={Users} color="purple" />
        <StatCard label={t("pages.adminSeoProgress.nurtureSequences")} value={report.emailCapture.nurtureSequences.total} icon={MessageSquare} color="green" />
      </div>

      <SectionHeader title={t("pages.adminSeoProgress.perprofessionCoverage")} icon={Layers} />
      {report.professionCoverage.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <Layers className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">{t("pages.adminSeoProgress.noProfessionsConfiguredYet")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {report.professionCoverage.map((p) => (
            <CoverageRow key={p.id} profession={p} />
          ))}
        </div>
      )}

      <div className="mt-8 bg-white border rounded-xl p-5" data-testid="quick-links">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">{t("pages.adminSeoProgress.quickLinks")}</h3>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Admin Dashboard", path: "/admin" },
            { label: "SEO Dashboard", path: "/admin/seo" },
            { label: "Content Manager", path: "/admin/content-manager" },
            { label: "Professions", path: "/admin/professions" },
            { label: "Allied Marketing", path: "/admin/allied-marketing" },
            { label: "Programmatic SEO", path: "/admin/programmatic-seo" },
            { label: "Blog Manager", path: "/admin?tab=content-engine" },
            { label: "QBank Import", path: "/admin/qbank/import" },
          ].map((link) => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className="text-xs px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 font-medium"
              data-testid={`link-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
