import { Switch, Route } from "wouter";
import { lazy, Suspense } from "react";

const AdminPage = lazy(() => import("@/pages/admin"));
const AdminProblemReportsPage = lazy(() => import("@/pages/admin-problem-reports"));
const AdminAiJobs = lazy(() => import("@/pages/admin-ai-jobs"));
const AdminBusinessHealth = lazy(() => import("@/pages/admin-business-health"));
const AdminContentCoverage = lazy(() => import("@/pages/admin-content-coverage"));
const AdminNewGradAnalytics = lazy(() => import("@/pages/admin-new-grad-analytics"));
const AdminSiteHealth = lazy(() => import("@/pages/admin-site-health"));
const AdminExamHealth = lazy(() => import("@/pages/admin-exam-health"));
const AdminResilience = lazy(() => import("@/pages/admin-resilience"));
const AdminReliability = lazy(() => import("@/pages/admin-reliability"));
const AdminOpsDashboard = lazy(() => import("@/pages/admin-ops-dashboard"));
const AdminOpsEmergency = lazy(() => import("@/pages/admin-ops-emergency"));
const AdminReleaseGate = lazy(() => import("@/pages/admin-release-gate"));
const AdminResilienceReport = lazy(() => import("@/pages/admin-resilience-report"));
const AdminVipStatus = lazy(() => import("@/pages/admin-vip-status"));
const AdminIncidentDetail = lazy(() => import("@/pages/admin-incident-detail"));
const AdminWeeklyReport = lazy(() => import("@/pages/admin-weekly-report"));
const AdminIncidentResponse = lazy(() => import("@/pages/admin-incident-response"));
const AdminSubscriberRescue = lazy(() => import("@/pages/admin-subscriber-rescue"));
const AdminBillingSupport = lazy(() => import("@/pages/admin-billing-support"));
const AdminPerformance = lazy(() => import("@/pages/admin-performance"));
const AdminIncidents = lazy(() => import("@/pages/admin-incidents"));
const AdminOpsIncidents = lazy(() => import("@/pages/admin-ops-incidents"));
const AdminOpsIncidentDetail = lazy(() => import("@/pages/admin-ops-incident-detail"));
const AdminRunbooks = lazy(() => import("@/pages/admin-runbooks"));
const AdminPreviewMode = lazy(() => import("@/pages/admin-preview-mode"));
const AdminSocialContent = lazy(() => import("@/pages/admin-social-content"));
const AdminQuestionBankPage = lazy(() => import("@/pages/admin-question-bank"));
const AdminCommentModeration = lazy(() => import("@/pages/admin-comment-moderation"));
const AdminDataMigration = lazy(() => import("@/pages/admin-data-migration"));
const AdminNotifications = lazy(() => import("@/pages/admin-notifications"));
const GeneratorV2Page = lazy(() => import("@/pages/generator-v2"));
const AdminTaxonomyReview = lazy(() => import("@/pages/admin-taxonomy-review"));
const AdminSeoDashboard = lazy(() => import("@/pages/admin-seo-dashboard"));
const AdminSeoPerformance = lazy(() => import("@/pages/admin-seo-performance"));
const AdminTranslationDashboard = lazy(() => import("@/pages/admin-translation-dashboard"));
const AdminTranslationCoverage = lazy(() => import("@/pages/admin-translation-coverage"));
const AdminTranslationHealth = lazy(() => import("@/pages/admin-translation-health"));
const AdminI18nDiagnostics = lazy(() => import("@/pages/admin-i18n-diagnostics"));
const AdminLanguageHealth = lazy(() => import("@/pages/admin-language-health"));
const AdminSeoInspector = lazy(() => import("@/pages/admin-seo-inspector"));
const AdminContentIntelligence = lazy(() => import("@/pages/admin-content-intelligence"));
const AdminCatDashboard = lazy(() => import("@/pages/admin-cat-dashboard"));
const AdminRevenueDashboard = lazy(() => import("@/pages/admin-revenue-dashboard"));
const AdminTelemetry = lazy(() => import("@/pages/admin-telemetry"));
const AdminSessionReplay = lazy(() => import("@/pages/admin-session-replay"));
const AdminRevenueProtection = lazy(() => import("@/pages/admin-revenue-protection"));
const AdminPipelineDashboard = lazy(() => import("@/pages/admin-pipeline-dashboard"));
const AdminContentMetrics = lazy(() => import("@/pages/admin-content-metrics"));
const AdminContentManager = lazy(() => import("@/pages/admin-content-manager"));
const AdminContentAudit = lazy(() => import("@/pages/admin-content-audit"));
const AdminContentAnalytics = lazy(() => import("@/pages/admin-content-analytics"));
const AdminTierHealth = lazy(() => import("@/pages/admin-tier-health"));
const AdminQBankImport = lazy(() => import("@/pages/admin-qbank-import"));
const AdminQBankManage = lazy(() => import("@/pages/admin-qbank-manage"));
const AdminFlashcardStudio = lazy(() => import("@/pages/admin-flashcard-studio"));
const AdminExplanationsPage = lazy(() => import("@/pages/admin-explanations"));
const AdminNgnGenerator = lazy(() => import("@/pages/admin-ngn-generator"));
const AdminAutopilot = lazy(() => import("@/pages/admin-autopilot"));
const AdminAiOps = lazy(() => import("@/pages/admin-ai-ops"));
const AdminContentExpansion = lazy(() => import("@/pages/admin-content-expansion"));
const AdminContentIntegrity = lazy(() => import("@/pages/admin-content-integrity"));
const AdminPageviews = lazy(() => import("@/pages/admin-pageviews"));
const AdminSeoAutopilot = lazy(() => import("@/pages/admin-seo-autopilot"));
const AdminAlliedHealthArticles = lazy(() => import("@/pages/admin-allied-health-articles"));
const AdminContentGenerator = lazy(() => import("@/pages/admin-content-generator"));
const AdminSeoDebug = lazy(() => import("@/pages/admin-seo-debug"));
const AdminAlliedMarketing = lazy(() => import("@/pages/admin-allied-marketing"));
const AdminProfessionAnalytics = lazy(() => import("@/pages/admin-profession-analytics"));
const AdminSeoProgress = lazy(() => import("@/pages/admin-seo-progress"));
const AdminWeeklyReports = lazy(() => import("@/pages/admin-weekly-reports"));
const AdminSearchPerformance = lazy(() => import("@/pages/admin-search-performance"));
const AdminCrossPlatformAnalytics = lazy(() => import("@/pages/admin-cross-platform-analytics"));
const AdminProgrammaticSeo = lazy(() => import("@/pages/admin-programmatic-seo"));
const AdminSeoLessonsPage = lazy(() => import("@/pages/admin-seo-lessons"));
const AdminInstitutions = lazy(() => import("@/pages/admin-institutions"));
const AdminMedicalImaging = lazy(() => import("@/pages/admin-medical-imaging"));
const AdminImageLibrary = lazy(() => import("@/pages/admin-image-library"));
const AdminBackups = lazy(() => import("@/pages/admin-backups"));
const AdminDisasterRecovery = lazy(() => import("@/pages/admin-disaster-recovery"));
const AdminDatabaseStatus = lazy(() => import("@/pages/admin-database-status"));
const AdminEnvironmentAudit = lazy(() => import("@/pages/admin-environment-audit"));
const AdminEnvironmentDiagnostic = lazy(() => import("@/pages/admin-environment-diagnostic"));
const AdminRnLessonAudit = lazy(() => import("@/pages/admin-rn-lesson-audit"));
const AdminDemoProgress = lazy(() => import("@/pages/admin-demo-progress"));
const AdminMockResults = lazy(() => import("@/pages/admin-mock-results"));
const AdminMockExamTemplates = lazy(() => import("@/pages/admin-mock-exam-templates"));
const DemoAdaptiveReport = lazy(() => import("@/pages/demo-adaptive-report"));
const DemoScreenshotStudio = lazy(() => import("@/pages/demo-screenshot-studio"));
const DemoExamReview = lazy(() => import("@/pages/demo-exam-review"));
const DemoFlashcardMastery = lazy(() => import("@/pages/demo-flashcard-mastery"));
const DemoStudyPlanScreenshot = lazy(() => import("@/pages/demo-study-plan-screenshot"));
const DemoLessonRationale = lazy(() => import("@/pages/demo-lesson-rationale"));
const DemoStudentOverview = lazy(() => import("@/pages/demo-student-overview"));
const DemoHeatmapGrid = lazy(() => import("@/pages/demo-heatmap-grid"));
const DemoCatExam = lazy(() => import("@/pages/demo-cat-exam"));
const DemoNgnCaseStudy = lazy(() => import("@/pages/demo-ngn-case-study"));
const DemoPremiumValue = lazy(() => import("@/pages/demo-premium-value"));
const DemoStreakAnalytics = lazy(() => import("@/pages/demo-streak-analytics"));
const DemoSessionComparison = lazy(() => import("@/pages/demo-session-comparison"));
const DemoHeroShowcase = lazy(() => import("@/pages/demo-hero-showcase"));
const AdminCaseStudiesPage = lazy(() => import("@/pages/admin-case-studies"));
const ImagingMarketingDashboard = lazy(() => import("@/pages/imaging-marketing-dashboard"));
const DemoWeakAreas = lazy(() => import("@/pages/demo-weak-areas"));
const DemoStudyPlanPage = lazy(() => import("@/pages/demo-study-plan"));
const AdminStudyAnalytics = lazy(() => import("@/pages/admin-study-analytics"));
const AdminReadinessAnalytics = lazy(() => import("@/pages/admin-readiness-analytics"));
const QBankFactoryPage = lazy(() => import("@/pages/qbank-factory"));
const ProductBuilderPage = lazy(() => import("@/pages/product-builder"));
const AdminTrustShowcase = lazy(() => import("@/pages/admin-trust-showcase"));
const AdminCareersPage = lazy(() => import("@/pages/admin-careers"));
const AdminProfessionsPage = lazy(() => import("@/pages/admin-professions"));
const AdminUniversalImport = lazy(() => import("@/pages/admin-universal-import"));
const AdminAlliedHealthSEO = lazy(() => import("@/pages/admin-allied-health-seo"));
const AdminObservability = lazy(() => import("@/pages/admin-observability"));
const ExamReadinessDemo = lazy(() => import("@/pages/exam-readiness-demo"));
const DemoLearningProgress = lazy(() => import("@/pages/demo-learning-progress"));
const ContentEditorPage = lazy(() => import("@/pages/content-editor"));
const InstructorDashboard = lazy(() => import("@/pages/instructor-dashboard"));

function AdminLoadingFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center" data-testid="admin-loading">
      <div className="text-center space-y-3">
        <div className="w-8 h-8 border-3 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-gray-500">Loading admin…</p>
      </div>
    </div>
  );
}

function AdminNotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-8" data-testid="admin-not-found">
      <div className="max-w-md text-center space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Admin Page Not Found</h2>
        <p className="text-sm text-gray-500">The admin page you're looking for doesn't exist.</p>
        <a
          href="/admin"
          className="inline-block mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
          data-testid="link-admin-home"
        >
          Go to Admin Dashboard
        </a>
      </div>
    </div>
  );
}

export function AdminRoutes() {
  return (
    <Suspense fallback={<AdminLoadingFallback />}>
      <Switch>
        <Route path="/admin" component={AdminPage} />
        <Route path="/admin/ai-jobs" component={AdminAiJobs} />
        <Route path="/admin/business-health" component={AdminBusinessHealth} />
        <Route path="/admin/problem-reports" component={AdminProblemReportsPage} />
        <Route path="/admin/content-coverage" component={AdminContentCoverage} />
        <Route path="/admin/new-grad-analytics" component={AdminNewGradAnalytics} />
        <Route path="/admin/site-health" component={AdminSiteHealth} />
        <Route path="/admin/exam-health" component={AdminExamHealth} />
        <Route path="/admin/resilience" component={AdminResilience} />
        <Route path="/admin/reliability" component={AdminReliability} />
        <Route path="/admin/ops" component={AdminOpsDashboard} />
        <Route path="/admin/ops/emergency" component={AdminOpsEmergency} />
        <Route path="/admin/release-gate" component={AdminReleaseGate} />
        <Route path="/admin/resilience-report" component={AdminResilienceReport} />
        <Route path="/admin/vip-status" component={AdminVipStatus} />
        <Route path="/admin/incidents/:id" component={AdminIncidentDetail} />
        <Route path="/admin/weekly-report" component={AdminWeeklyReport} />
        <Route path="/admin/incident-response" component={AdminIncidentResponse} />
        <Route path="/admin/subscriber-rescue" component={AdminSubscriberRescue} />
        <Route path="/admin/billing-support" component={AdminBillingSupport} />
        <Route path="/admin-performance" component={AdminPerformance} />
        <Route path="/admin/incidents" component={AdminIncidents} />
        <Route path="/admin/ops/incidents/:id" component={AdminOpsIncidentDetail} />
        <Route path="/admin/ops/incidents" component={AdminOpsIncidents} />
        <Route path="/admin/runbooks" component={AdminRunbooks} />
        <Route path="/admin/preview-mode" component={AdminPreviewMode} />
        <Route path="/admin/social-content" component={AdminSocialContent} />
        <Route path="/admin/question-bank" component={AdminQuestionBankPage} />
        <Route path="/admin/comment-moderation" component={AdminCommentModeration} />
        <Route path="/admin/data-migration" component={AdminDataMigration} />
        <Route path="/admin/notifications" component={AdminNotifications} />
        <Route path="/admin/generator-v2" component={GeneratorV2Page} />
        <Route path="/admin/taxonomy-review" component={AdminTaxonomyReview} />
        <Route path="/admin/seo" component={AdminSeoDashboard} />
        <Route path="/admin/seo-performance" component={AdminSeoPerformance} />
        <Route path="/admin/translations" component={AdminTranslationDashboard} />
        <Route path="/admin/translation-coverage" component={AdminTranslationCoverage} />
        <Route path="/admin/translation-health" component={AdminTranslationHealth} />
        <Route path="/admin/i18n" component={AdminI18nDiagnostics} />
        <Route path="/admin/language-health" component={AdminLanguageHealth} />
        <Route path="/admin/seo-inspector" component={AdminSeoInspector} />
        <Route path="/admin/content-intelligence" component={AdminContentIntelligence} />
        <Route path="/admin/cat" component={AdminCatDashboard} />
        <Route path="/admin/revenue" component={AdminRevenueDashboard} />
        <Route path="/admin/telemetry" component={AdminTelemetry} />
        <Route path="/admin/session-replay" component={AdminSessionReplay} />
        <Route path="/admin/revenue-protection" component={AdminRevenueProtection} />
        <Route path="/admin/pipeline" component={AdminPipelineDashboard} />
        <Route path="/admin/content-metrics" component={AdminContentMetrics} />
        <Route path="/admin/content-manager" component={AdminContentManager} />
        <Route path="/admin/content-audit" component={AdminContentAudit} />
        <Route path="/admin/content-analytics" component={AdminContentAnalytics} />
        <Route path="/admin/tier-health" component={AdminTierHealth} />
        <Route path="/admin/qbank/import" component={AdminQBankImport} />
        <Route path="/admin/qbank/manage" component={AdminQBankManage} />
        <Route path="/admin/flashcard-studio" component={AdminFlashcardStudio} />
        <Route path="/admin/explanations" component={AdminExplanationsPage} />
        <Route path="/admin/qbank/ngn-generator" component={AdminNgnGenerator} />
        <Route path="/admin/autopilot" component={AdminAutopilot} />
        <Route path="/admin/ai-ops" component={AdminAiOps} />
        <Route path="/admin/content-expansion" component={AdminContentExpansion} />
        <Route path="/admin/content-integrity" component={AdminContentIntegrity} />
        <Route path="/admin/pageviews" component={AdminPageviews} />
        <Route path="/admin/seo-visual-autopilot" component={AdminSeoAutopilot} />
        <Route path="/admin/allied-health-articles" component={AdminAlliedHealthArticles} />
        <Route path="/admin/content-generator" component={AdminContentGenerator} />
        <Route path="/admin/seo-debug" component={AdminSeoDebug} />
        <Route path="/admin/allied-marketing" component={AdminAlliedMarketing} />
        <Route path="/admin/profession-analytics" component={AdminProfessionAnalytics} />
        <Route path="/admin/seo-progress" component={AdminSeoProgress} />
        <Route path="/admin/weekly-reports" component={AdminWeeklyReports} />
        <Route path="/admin/search-performance" component={AdminSearchPerformance} />
        <Route path="/admin/cross-platform" component={AdminCrossPlatformAnalytics} />
        <Route path="/admin/programmatic-seo" component={AdminProgrammaticSeo} />
        <Route path="/admin/seo-lessons" component={AdminSeoLessonsPage} />
        <Route path="/admin/institutions" component={AdminInstitutions} />
        <Route path="/admin/medical-imaging" component={AdminMedicalImaging} />
        <Route path="/admin/image-library" component={AdminImageLibrary} />
        <Route path="/admin/backups" component={AdminBackups} />
        <Route path="/admin/disaster-recovery" component={AdminDisasterRecovery} />
        <Route path="/admin/database-status" component={AdminDatabaseStatus} />
        <Route path="/admin/environment-audit" component={AdminEnvironmentAudit} />
        <Route path="/admin/environment-diagnostic" component={AdminEnvironmentDiagnostic} />
        <Route path="/admin/rn-lesson-audit" component={AdminRnLessonAudit} />
        <Route path="/admin/demo-progress" component={AdminDemoProgress} />
        <Route path="/admin/mock-results" component={AdminMockResults} />
        <Route path="/admin/mock-exam-templates" component={AdminMockExamTemplates} />
        <Route path="/admin/demo-adaptive-report" component={DemoAdaptiveReport} />
        <Route path="/admin/demo-screenshot-studio" component={DemoScreenshotStudio} />
        <Route path="/admin/demo-exam-review" component={DemoExamReview} />
        <Route path="/admin/demo-flashcard-mastery" component={DemoFlashcardMastery} />
        <Route path="/admin/demo-study-plan-screenshot" component={DemoStudyPlanScreenshot} />
        <Route path="/admin/demo-lesson-rationale" component={DemoLessonRationale} />
        <Route path="/admin/demo-student-overview" component={DemoStudentOverview} />
        <Route path="/admin/demo-heatmap-grid" component={DemoHeatmapGrid} />
        <Route path="/admin/demo-cat-exam" component={DemoCatExam} />
        <Route path="/admin/demo-ngn-case-study" component={DemoNgnCaseStudy} />
        <Route path="/admin/demo-premium-value" component={DemoPremiumValue} />
        <Route path="/admin/demo-streak-analytics" component={DemoStreakAnalytics} />
        <Route path="/admin/demo-session-comparison" component={DemoSessionComparison} />
        <Route path="/admin/demo-hero-showcase" component={DemoHeroShowcase} />
        <Route path="/admin/case-studies" component={AdminCaseStudiesPage} />
        <Route path="/admin/imaging-marketing" component={ImagingMarketingDashboard} />
        <Route path="/admin/demo-weak-areas" component={DemoWeakAreas} />
        <Route path="/admin/demo-study-plan" component={DemoStudyPlanPage} />
        <Route path="/admin/study-analytics" component={AdminStudyAnalytics} />
        <Route path="/admin/readiness-analytics" component={AdminReadinessAnalytics} />
        <Route path="/admin/qbank-factory" component={QBankFactoryPage} />
        <Route path="/admin/product-builder/:id" component={ProductBuilderPage} />
        <Route path="/admin/product-builder" component={ProductBuilderPage} />
        <Route path="/admin/trust-showcase" component={AdminTrustShowcase} />
        <Route path="/admin/careers" component={AdminCareersPage} />
        <Route path="/admin/professions" component={AdminProfessionsPage} />
        <Route path="/admin/universal-import" component={AdminUniversalImport} />
        <Route path="/admin/allied-health-seo" component={AdminAlliedHealthSEO} />
        <Route path="/admin/observability" component={AdminObservability} />
        <Route path="/content-editor" component={ContentEditorPage} />
        <Route path="/instructor" component={InstructorDashboard} />
        <Route path="/demo/exam-readiness" component={ExamReadinessDemo} />
        <Route path="/demo/learning-progress" component={DemoLearningProgress} />
        <Route path="/:locale/admin" component={AdminPage} />
        <Route path="/:locale/admin/problem-reports" component={AdminProblemReportsPage} />
        <Route path="/:locale/admin/resilience" component={AdminResilience} />
        <Route path="/:locale/admin/reliability" component={AdminReliability} />
        <Route path="/:locale/admin/ops" component={AdminOpsDashboard} />
        <Route path="/:locale/admin/ops/emergency" component={AdminOpsEmergency} />
        <Route path="/:locale/admin/release-gate" component={AdminReleaseGate} />
        <Route path="/:locale/admin/resilience-report" component={AdminResilienceReport} />
        <Route path="/:locale/admin/vip-status" component={AdminVipStatus} />
        <Route path="/:locale/admin/incidents/:id" component={AdminIncidentDetail} />
        <Route path="/:locale/admin/weekly-report" component={AdminWeeklyReport} />
        <Route path="/:locale/admin/incident-response" component={AdminIncidentResponse} />
        <Route path="/:locale/admin/subscriber-rescue" component={AdminSubscriberRescue} />
        <Route path="/:locale/admin/billing-support" component={AdminBillingSupport} />
        <Route path="/:locale/admin-performance" component={AdminPerformance} />
        <Route path="/:locale/admin/incidents" component={AdminIncidents} />
        <Route path="/:locale/admin/ops/incidents/:id" component={AdminOpsIncidentDetail} />
        <Route path="/:locale/admin/ops/incidents" component={AdminOpsIncidents} />
        <Route path="/:locale/admin/runbooks" component={AdminRunbooks} />
        <Route path="/:locale/admin/preview-mode" component={AdminPreviewMode} />
        <Route path="/:locale/admin/data-migration" component={AdminDataMigration} />
        <Route path="/:locale/admin/generator-v2" component={GeneratorV2Page} />
        <Route path="/:locale/admin/taxonomy-review" component={AdminTaxonomyReview} />
        <Route path="/:locale/admin/i18n" component={AdminI18nDiagnostics} />
        <Route>{() => <AdminNotFound />}</Route>
      </Switch>
    </Suspense>
  );
}
