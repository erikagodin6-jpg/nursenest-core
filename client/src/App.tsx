import { Switch, Route, Router, Redirect, useLocation } from "wouter";
import { useBrowserLocation, navigate as wouterNavigate } from "wouter/use-browser-location";
import { useEffect, useState, lazy, Suspense, type ReactNode } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { AuthProvider, useAuth } from "@/lib/auth";
import { I18nProvider } from "@/lib/i18n";
import { CareerProvider } from "@/lib/career-context";
import { SiteImagesProvider } from "@/components/admin-image-overlay";
import { getLocaleFromPath, isValidLocale, DEFAULT_LOCALE, deLocalizeSlug } from "@/lib/locale-utils";
import { ParamedicRegionProvider } from "@/allied/contexts/paramedic-region-context";
import { RouteErrorBoundary } from "@/components/route-error-boundary";
const AlliedLayout = lazy(() => import("@/allied/allied-layout").then(m => ({ default: m.AlliedLayout })));
const AlliedRoutes = lazy(() => import("@/allied/allied-routes").then(m => ({ default: m.AlliedRoutes })));
const TesterBanner = lazy(() => import("@/components/tester-banner").then(m => ({ default: m.TesterBanner })));
const UpgradePrompt = lazy(() => import("@/components/upgrade-prompt").then(m => ({ default: m.UpgradePrompt })));
const PWAInstallPrompt = lazy(() => import("@/components/pwa-install-prompt").then(m => ({ default: m.PWAInstallPrompt })));
const OfflineStatusBanner = lazy(() => import("@/components/offline-status-banner").then(m => ({ default: m.OfflineStatusBanner })));
const ExitIntentModal = lazy(() => import("@/components/exit-intent-modal").then(m => ({ default: m.ExitIntentModal })));
const StickyCtaBar = lazy(() => import("@/components/sticky-cta-bar").then(m => ({ default: m.StickyCtaBar })));
const MobileBottomNav = lazy(() => import("@/components/mobile-study-shell").then(m => ({ default: m.MobileBottomNav })));
const LazyAnalyticsTracker = lazy(() => import("@/components/analytics-tracker"));
const ReportProblemButton = lazy(() => import("@/components/report-problem-button").then(m => ({ default: m.ReportProblemButton })));
import { ExamErrorBoundary, ExamLoadingFallback } from "@/components/exam-error-boundary";
import { PlatformErrorBoundary } from "@/components/platform-error-boundary";
import { AppErrorBoundary } from "@/components/app-error-boundary";
import { PremiumFeatureErrorBoundary } from "@/components/premium-error-boundary";
import { LanguageGuard } from "@/lib/language-guard";
import { ProtectedRoute } from "@/components/protected-route";
import { SafeExamFallback, SafeFlashcardFallback, SafeLessonFallback, SafeDownloadFallback } from "@/components/safe-mode-fallbacks";
import { ProtectedAccessBoundary, type ProtectedRouteContext, type ContentCategory } from "@/components/protected-access-recovery";
const IncidentBanner = lazy(() => import("@/components/incident-banner").then(m => ({ default: m.IncidentBanner })));

function PreviewBanner() {
  const { previewTier, setPreviewTier, isAdmin } = useAuth();
  if (!isAdmin || !previewTier) return null;
  const tierLabels: Record<string, string> = { free: "Free", rpn: "RPN Paid", rn: "RN Paid", np: "NP Paid" };
  return (
    <div className="w-full bg-amber-500 text-white text-center py-1.5 px-4 text-sm font-semibold shadow-md flex items-center justify-center gap-3 relative z-[9999]" data-testid="banner-preview-mode">
      <span>Preview Mode: {tierLabels[previewTier] || previewTier}</span>
      <button
        onClick={() => setPreviewTier(null)}
        className="bg-white text-amber-700 px-3 py-0.5 rounded-full text-xs font-bold hover:bg-amber-50 transition-colors"
        data-testid="button-exit-preview"
      >
        Exit Preview
      </button>
    </div>
  );
}

const Home = lazy(() => import("@/pages/home"));
const LanguagesPage = lazy(() => import("@/pages/languages"));
import { usePageTracker } from "@/hooks/use-page-tracker";

const NotFound = lazy(() => import("@/pages/not-found"));
const Lessons = lazy(() => import("@/pages/lessons"));
const LessonDetail = lazy(() => import("@/pages/lesson-detail"));
const Flashcards = lazy(() => import("@/pages/flashcards"));
const PublicFlashcards = lazy(() => import("@/pages/public-flashcards"));
const AdaptiveStudyPage = lazy(() => import("@/pages/adaptive-study-page"));
const TestBank = lazy(() => import("@/pages/test-bank"));
const UpgradePage = lazy(() => import("@/pages/upgrade"));
const Reports = lazy(() => import("@/pages/reports"));
const LoginPage = lazy(() => import("@/pages/login"));
const ResetPasswordPage = lazy(() => import("@/pages/reset-password"));
const ProfilePage = lazy(() => import("@/pages/profile"));
const SubscriptionSuccess = lazy(() => import("@/pages/subscription-success"));
const PricingPage = lazy(() => import("@/pages/pricing"));
const ReferPage = lazy(() => import("@/pages/refer"));
const FAQPage = lazy(() => import("@/pages/faq"));
const AlliedHealthFAQPage = lazy(() => import("@/pages/allied-health-faq"));
const NewGradFAQPage = lazy(() => import("@/pages/new-grad-faq"));
const AnatomyPage = lazy(() => import("@/pages/anatomy"));
const TermsPage = lazy(() => import("@/pages/terms"));
const PrivacyPage = lazy(() => import("@/pages/privacy"));
const DisclaimerPage = lazy(() => import("@/pages/disclaimer"));
const RefundPolicyPage = lazy(() => import("@/pages/refund-policy"));
const StartFreePage = lazy(() => import("@/pages/start-free"));
const LazyAdminRoutes = lazy(() => import("@/admin-routes").then(m => ({ default: m.AdminRoutes })));
const QBankExamPage = lazy(() => import("@/pages/qbank-exam"));
const QBankStudyPage = lazy(() => import("@/pages/qbank-study"));
const QBankPreviewPage = lazy(() => import("@/pages/qbank-preview"));
const SpecialtyPreviewPage = lazy(() => import("@/pages/specialty-preview"));
const DashboardPage = lazy(() => import("@/pages/dashboard"));
const MltStudentDashboard = lazy(() => import("@/allied/pages/mlt-student-dashboard"));
const MedMathPage = lazy(() => import("@/pages/med-math"));
const LabValuesPage = lazy(() => import("@/pages/lab-values"));
const SIConventionalConverterPage = lazy(() => import("@/pages/si-conventional-converter"));
const ConversionClusterWrapper = lazy(() => import("@/pages/conversion-cluster-wrapper"));
const ContentPage = lazy(() => import("@/pages/content-page"));
const BlogPage = lazy(() => import("@/pages/blog"));
const ClinicalClarityIndex = lazy(() => import("@/pages/clinical-clarity"));
const ClinicalClarityDetail = lazy(() => import("@/pages/clinical-clarity-detail"));
const CaseSimulationPage = lazy(() => import("@/pages/case-simulation"));
const MedicationMasteryPage = lazy(() => import("@/pages/medication-mastery"));
const SimulatorsPage = lazy(() => import("@/pages/simulators"));
const OSCESkillsPage = lazy(() => import("@/pages/osce-skills"));
const PreNursingPage = lazy(() => import("@/pages/pre-nursing"));
const MockExamsPage = lazy(() => import("@/pages/mock-exams"));
const MockExamSession = lazy(() => import("@/pages/mock-exam-session"));
const MockExamReport = lazy(() => import("@/pages/mock-exam-report"));
const ContactPage = lazy(() => import("@/pages/contact"));
const AboutPage = lazy(() => import("@/pages/about"));
const MedicalReviewTeamPage = lazy(() => import("@/pages/medical-review-team"));
const FeedbackPage = lazy(() => import("@/pages/feedback"));
const QuestionOfTheDay = lazy(() => import("@/pages/question-of-the-day"));
const QuestionBank = lazy(() => import("@/pages/question-bank"));
const SocialWorkerLessonsPage = lazy(() => import("@/pages/social-worker-lessons"));
const PerioperativeLessonsPage = lazy(() => import("@/allied/pages/perioperative-lessons"));
const FirstActionSimulatorPage = lazy(() => import("@/pages/first-action-simulator"));
const SafetyHazardSimulatorPage = lazy(() => import("@/pages/safety-hazard-simulator"));
const IVComplicationsSimulatorPage = lazy(() => import("@/pages/iv-complications-simulator"));
const ElectrolyteABGSimulatorPage = lazy(() => import("@/pages/electrolyte-abg-simulator"));
const DeterioratingPatientSimulatorPage = lazy(() => import("@/pages/deteriorating-patient-simulator"));
const BloodTransfusionSimulatorPage = lazy(() => import("@/pages/blood-transfusion-simulator"));
const LectureViewer = lazy(() => import("@/pages/lecture-viewer"));
const LecturesPage = lazy(() => import("@/pages/lectures"));
const DeckPage = lazy(() => import("@/pages/deck-page"));
const ProbabilitySimulatorPage = lazy(() => import("@/pages/probability-simulator"));
const SeoPage = lazy(() => import("@/pages/seo-page"));
const ComparePage = lazy(() => import("@/pages/compare"));
const ClinicalConditionPage = lazy(() => import("@/pages/clinical-seo/condition-page"));
const ClinicalSymptomPage = lazy(() => import("@/pages/clinical-seo/symptom-page"));
const ClinicalMedicationPage = lazy(() => import("@/pages/clinical-seo/medication-page"));
const ClinicalLabValuePage = lazy(() => import("@/pages/clinical-seo/lab-value-page"));
const ClinicalSeoComparisonPage = lazy(() => import("@/pages/clinical-seo/comparison-page"));
const NpExamPrepPillar = lazy(() => import("@/pages/np-exam-prep-pillar"));
const NpExamHub = lazy(() => import("@/pages/np-exam-hub"));
const SeoHubPage = lazy(() => import("@/pages/seo-hub-page"));
const NpExamHubPage = lazy(() => import("@/pages/np-exam-pages").then(m => ({ default: m.NpExamHubPage })));
const AanpExamPage = lazy(() => import("@/pages/np-exam-pages").then(m => ({ default: m.AanpExamPage })));
const AnccExamPage = lazy(() => import("@/pages/np-exam-pages").then(m => ({ default: m.AnccExamPage })));
const UpcomingCanadaNpExamPage = lazy(() => import("@/pages/np-exam-pages").then(m => ({ default: m.UpcomingCanadaNpExamPage })));
const AgpcnpExamPage = lazy(() => import("@/pages/np-exam-pages").then(m => ({ default: m.AgpcnpExamPage })));
const AgacnpExamPage = lazy(() => import("@/pages/np-exam-pages").then(m => ({ default: m.AgacnpExamPage })));
const PmhnpExamPage = lazy(() => import("@/pages/np-exam-pages").then(m => ({ default: m.PmhnpExamPage })));
const PnpExamPage = lazy(() => import("@/pages/np-exam-pages").then(m => ({ default: m.PnpExamPage })));
const WhnpExamPage = lazy(() => import("@/pages/np-exam-pages").then(m => ({ default: m.WhnpExamPage })));
const EnpExamPage = lazy(() => import("@/pages/np-exam-pages").then(m => ({ default: m.EnpExamPage })));
const ShopPage = lazy(() => import("@/pages/shop"));
const ShopProductPage = lazy(() => import("@/pages/shop-product"));
const PathwaysPage = lazy(() => import("@/pages/pathways"));
const RexPnGuide = lazy(() => import("@/pages/rex-pn-guide"));
const NclexRnGuide = lazy(() => import("@/pages/nclex-rn-guide"));
const DiagnosticAssessmentPage = lazy(() => import("@/pages/diagnostic-assessment"));
const EmailPreferencesPage = lazy(() => import("@/pages/email-preferences"));
const AccountLibraryPage = lazy(() => import("@/pages/account-library"));
const FreePracticePage = lazy(() => import("@/pages/free-practice"));
const FreeDemoExamPage = lazy(() => import("@/pages/free-demo-exam"));
const QuickStudyPage = lazy(() => import("@/pages/quick-study"));
const PracticeQuestionsPage = lazy(() => import("@/pages/practice-questions"));
const SubscribePage = lazy(() => import("@/pages/subscribe"));
const OnboardingPlanPage = lazy(() => import("@/pages/onboarding-plan"));
const StudyPlanPage = lazy(() => import("@/pages/study-plan"));
const NclexRnPracticePage = lazy(() => import("@/pages/exam-practice-landing").then(m => ({ default: m.NclexRnPractice })));
const NclexPnPracticePage = lazy(() => import("@/pages/exam-practice-landing").then(m => ({ default: m.NclexPnPractice })));
const RexPnPracticePage = lazy(() => import("@/pages/exam-practice-landing").then(m => ({ default: m.RexPnPractice })));
const NpExamPracticePage = lazy(() => import("@/pages/exam-practice-landing").then(m => ({ default: m.NpExamPractice })));
const NursingExamPrepPage = lazy(() => import("@/pages/allied-exam-prep-landing").then(m => ({ default: m.NursingExamPrep })));
const GlossaryPage = lazy(() => import("@/pages/glossary"));
const MedicalAbbreviationsHub = lazy(() => import("@/pages/medical-abbreviations-hub"));
const MedicalAbbreviationDetail = lazy(() => import("@/pages/medical-abbreviation-detail"));
const NursingSkillChecklistsHub = lazy(() => import("@/pages/nursing-skill-checklists-hub"));
const NursingSkillChecklistDetail = lazy(() => import("@/pages/nursing-skill-checklist-detail"));
const ApplyNestLanding = lazy(() => import("@/pages/applynest-landing"));
const ApplyNestCareerPage = lazy(() => import("@/pages/applynest-career"));
const ApplyNestResumeTemplates = lazy(() => import("@/pages/applynest-resume-templates"));
const ApplyNestInterviewPrep = lazy(() => import("@/pages/applynest-interview-prep"));
const ApplyNestJobSearchGuide = lazy(() => import("@/pages/applynest-job-search-guide"));
const CareerAISimulator = lazy(() => import("@/pages/career-tools/career-ai-simulator"));
const SeoHubNewGrad = lazy(() => import("@/pages/seo-hub-new-grad"));
const SeoHubResumes = lazy(() => import("@/pages/seo-hub-resumes"));
const SeoHubInterview = lazy(() => import("@/pages/seo-hub-interview"));
const SeoHubPersonalStatements = lazy(() => import("@/pages/seo-hub-personal-statements"));
const SeoHubResources = lazy(() => import("@/pages/seo-hub-resources"));
const SeoResumeArticle = lazy(() => import("@/pages/seo-content-article").then(m => ({ default: () => { const { ResumeArticlePage } = m; return <ResumeArticlePage />; } })));
const SeoInterviewArticle = lazy(() => import("@/pages/seo-content-article").then(m => ({ default: () => { const { InterviewArticlePage } = m; return <InterviewArticlePage />; } })));
const SeoCareerArticle = lazy(() => import("@/pages/seo-content-article").then(m => ({ default: () => { const { CareerArticlePage } = m; return <CareerArticlePage />; } })));
const SeoPersonalStatementArticle = lazy(() => import("@/pages/seo-content-article").then(m => ({ default: () => { const { PersonalStatementArticlePage } = m; return <PersonalStatementArticlePage />; } })));
const NewGradHub = lazy(() => import("@/pages/newgrad/newgrad-hub"));
const NewGradProfessionHub = lazy(() => import("@/pages/new-grad/profession-hub-page"));
const FirstYearGuidePage = lazy(() => import("@/pages/new-grad/first-year-guide-page"));
const ClinicalSkillsGuidePage = lazy(() => import("@/pages/new-grad/clinical-skills-guide-page"));
const ClinicalSkillsHub = lazy(() => import("@/pages/clinical-skills-hub"));
const ClinicalSkillsGuideDetail = lazy(() => import("@/pages/clinical-skills-guide"));
const UnitGuidePage = lazy(() => import("@/pages/new-grad/unit-guide-page"));
const CareerDevelopmentPage = lazy(() => import("@/pages/new-grad/career-development-page"));
const ClinicalScenarioPage = lazy(() => import("@/pages/new-grad/clinical-scenario-page"));

const NewGradClinicalReferencesPage = lazy(() => import("@/pages/newgrad/clinical-references-page"));
const NewGradClinicalReferenceDetail = lazy(() => import("@/pages/newgrad/clinical-reference-detail"));
const NewGradGuidesPage = lazy(() => import("@/pages/newgrad/guides-page"));
const NewGradCareerPage = lazy(() => import("@/pages/newgrad/career-page"));
const NewGradInterviewPage = lazy(() => import("@/pages/newgrad/interview-page"));
const NewGradMockInterviewPage = lazy(() => import("@/pages/newgrad/mock-interview-page"));
const NewGradSimulationSetsPage = lazy(() => import("@/pages/newgrad/simulation-sets-page"));
const NewGradResumePage = lazy(() => import("@/pages/newgrad/resume-page"));
const NewGradWorkplacePage = lazy(() => import("@/pages/newgrad/workplace-page"));
const NewGradScenariosPage = lazy(() => import("@/pages/newgrad/scenarios-page"));
const NewGradBurnoutPage = lazy(() => import("@/pages/newgrad/burnout-page"));
const NewGradSalaryPage = lazy(() => import("@/pages/newgrad/salary-page"));
const NewGradProfDevPage = lazy(() => import("@/pages/newgrad/professional-development-page"));
const NewGradSurvivalGuideLanding = lazy(() => import("@/pages/newgrad/survival-guide-landing"));
const NewGradGuidePage = lazy(() => import("@/pages/new-grad/new-grad-guide-template"));
const SeoGuidePage = lazy(() => import("@/pages/new-grad/seo-guide-page"));
const NewGradCertificationPage = lazy(() => import("@/pages/new-grad-certification-page"));
const JobsHub = lazy(() => import("@/pages/jobs-hub"));
const JobDetail = lazy(() => import("@/pages/job-detail"));
const NewGradCertificationsHub = lazy(() => import("@/pages/newgrad/certifications-hub"));
const NewGradCertificationDetail = lazy(() => import("@/pages/newgrad/certification-detail"));
const CertificationPrepPage = lazy(() => import("@/pages/certification-prep-page"));
const CertificationExamPrepHub = lazy(() => import("@/pages/certification-exam-prep-hub"));
const CertificationExamDetail = lazy(() => import("@/pages/certification-exam-detail"));
const CertificationPractice = lazy(() => import("@/pages/certification-practice"));
const CertificationRenewalPage = lazy(() => import("@/pages/certification-renewal-page"));
const NursingHub = lazy(() => import("@/pages/nursing-hub"));
const NursingSchoolsHub = lazy(() => import("@/pages/nursing-schools-hub"));
const NursingSchoolsCountry = lazy(() => import("@/pages/nursing-schools-country"));
const NurseResidencyHub = lazy(() => import("@/pages/nurse-residency-hub"));
const NurseResidencyCountry = lazy(() => import("@/pages/nurse-residency-country"));
const NursingRegulatoryHub = lazy(() => import("@/pages/nursing-regulatory-hub"));
const NursingRegulatoryDetail = lazy(() => import("@/pages/nursing-regulatory-detail"));
const NursingLicensingExamsHub = lazy(() => import("@/pages/nursing-licensing-exams-hub"));
const LicensingExamDetail = lazy(() => import("@/pages/licensing-exam-detail"));
const NurseSalaryGuideHub = lazy(() => import("@/pages/nurse-salary-guide-hub"));
const NurseSalaryCountryPage = lazy(() => import("@/pages/nurse-salary-country"));
const TrackLandingPage = lazy(() => import("@/pages/marketing/TrackLandingPage"));
const NclexLandingPage = lazy(() => import("@/pages/marketing/NclexLandingPage"));
const NursingSpecialtiesHub = lazy(() => import("@/pages/nursing-specialties-hub"));
const NursingSpecialtyDetail = lazy(() => import("@/pages/nursing-specialty-detail"));
const SpecialtyHubPage = lazy(() => import("@/pages/specialty-hub-page"));
const SpecialtyHubBySlug = lazy(() => import("@/pages/specialty-hub-page").then(m => ({ default: m.SpecialtyHubBySlug })));
const SpecialtySeoPage = lazy(() => import("@/pages/specialty-seo-page"));
const SpecialtySeoBySlug = lazy(() => import("@/pages/specialty-seo-page").then(m => ({ default: m.SpecialtySeoBySlug })));
const NursingCertificationsHub = lazy(() => import("@/pages/nursing-certifications-hub"));
const HealthcareCertificationsHub = lazy(() => import("@/pages/healthcare-certifications-hub"));
const HealthcareCertificationDetail = lazy(() => import("@/pages/healthcare-certification-detail"));
const StudyPathwaysHub = lazy(() => import("@/pages/study-pathways-hub"));
const NursingHubPage = lazy(() => import("@/pages/nursing-hub-page"));
const RexPnHub = lazy(() => import("@/pages/rex-pn-hub"));
const RexPnExamFormat = lazy(() => import("@/pages/rex-pn-exam-format"));
const RexPnStrategies = lazy(() => import("@/pages/rex-pn-strategies"));
const RexPnWellness = lazy(() => import("@/pages/rex-pn-wellness"));
const RexPnCategoryTemplate = lazy(() => import("@/pages/rex-pn-content-hub").then(m => ({ default: m.RexPnCategoryTemplate })));
const RexPnConditionTemplate = lazy(() => import("@/pages/rex-pn-content-hub").then(m => ({ default: m.RexPnConditionTemplate })));
const RexPnMedicationTemplate = lazy(() => import("@/pages/rex-pn-content-hub").then(m => ({ default: m.RexPnMedicationTemplate })));
const RexPnLabValueTemplate = lazy(() => import("@/pages/rex-pn-content-hub").then(m => ({ default: m.RexPnLabValueTemplate })));
const RexPnComparisonTemplate = lazy(() => import("@/pages/rex-pn-content-hub").then(m => ({ default: m.RexPnComparisonTemplate })));
const RexPnStrategyTemplate = lazy(() => import("@/pages/rex-pn-content-hub").then(m => ({ default: m.RexPnStrategyTemplate })));
const NclexRnCategoryTemplate = lazy(() => import("@/pages/nclex-rn-content-hub").then(m => ({ default: m.NclexRnCategoryTemplate })));
const NclexRnConditionTemplate = lazy(() => import("@/pages/nclex-rn-content-hub").then(m => ({ default: m.NclexRnConditionTemplate })));
const NclexRnMedicationTemplate = lazy(() => import("@/pages/nclex-rn-content-hub").then(m => ({ default: m.NclexRnMedicationTemplate })));
const NclexRnLabValueTemplate = lazy(() => import("@/pages/nclex-rn-content-hub").then(m => ({ default: m.NclexRnLabValueTemplate })));
const NclexRnComparisonTemplate = lazy(() => import("@/pages/nclex-rn-content-hub").then(m => ({ default: m.NclexRnComparisonTemplate })));
const NclexRnStrategyTemplate = lazy(() => import("@/pages/nclex-rn-content-hub").then(m => ({ default: m.NclexRnStrategyTemplate })));
const NpExamCategoryTemplate = lazy(() => import("@/pages/np-exam-content-hub").then(m => ({ default: m.NpExamCategoryTemplate })));
const NpExamConditionTemplate = lazy(() => import("@/pages/np-exam-content-hub").then(m => ({ default: m.NpExamConditionTemplate })));
const NpExamMedicationTemplate = lazy(() => import("@/pages/np-exam-content-hub").then(m => ({ default: m.NpExamMedicationTemplate })));
const NpExamLabValueTemplate = lazy(() => import("@/pages/np-exam-content-hub").then(m => ({ default: m.NpExamLabValueTemplate })));
const NpExamComparisonTemplate = lazy(() => import("@/pages/np-exam-content-hub").then(m => ({ default: m.NpExamComparisonTemplate })));
const NpExamStrategyTemplate = lazy(() => import("@/pages/np-exam-content-hub").then(m => ({ default: m.NpExamStrategyTemplate })));
const NpExamCaseStudyTemplate = lazy(() => import("@/pages/np-exam-content-hub").then(m => ({ default: m.NpExamCaseStudyTemplate })));
const PharmacologyHub = lazy(() => import("@/pages/pharmacology-hub"));
const DailyQuestionPage = lazy(() => import("@/pages/daily-question"));
const ProfessionHubPage = lazy(() => import("@/pages/profession-hub"));
const StudyCoachingDashboard = lazy(() => import("@/pages/study-coaching-dashboard"));
const AlliedHealthHub = lazy(() => import("@/pages/allied-health-hub"));
const AlliedHealthProfessionPage = lazy(() => import("@/pages/allied-health-profession"));
const AlliedHealthArticlePage = lazy(() => import("@/pages/allied-health-article"));
const OrderOfTheDraw = lazy(() => import("@/pages/order-of-the-draw"));
const NursingQuestionSeoPage = lazy(() => import("@/pages/nursing-question-seo-page"));
const NursingQuestionsIndexPage = lazy(() => import("@/pages/nursing-question-seo-page").then(m => ({ default: m.NursingQuestionsIndexPage })));
const QuestionPreviewPage = lazy(() => import("@/pages/question-preview"));
const NursingCareerPage = lazy(() => import("@/pages/nursing-career-pages"));
const TrialLanding = lazy(() => import("@/pages/trial-landing"));
const TrialSession = lazy(() => import("@/pages/trial-session"));
const TrialResults = lazy(() => import("@/pages/trial-results"));
const TrialUpgrade = lazy(() => import("@/pages/trial-upgrade"));
const AlliedHomePage = lazy(() => import("@/allied/pages/allied-home"));
const ForInstitutions = lazy(() => import("@/pages/for-institutions"));
const ExamLandingPage = lazy(() => import("@/pages/exam-landing"));
const ExamHubPage = lazy(() => import("@/pages/exam-hub"));
const ConditionPage = lazy(() => import("@/pages/condition-page"));
const TopicsIndex = lazy(() => import("@/pages/topics"));
const TopicDetail = lazy(() => import("@/pages/topic-detail"));
const MedicationPage = lazy(() => import("@/pages/medication-page"));
const HerbalSupplementsHub = lazy(() => import("@/pages/herbal-supplements-hub"));
const HerbalSupplementPage = lazy(() => import("@/pages/herbal-supplement-page"));
const LabValuePage = lazy(() => import("@/pages/lab-value-page"));
const ClinicalComparisonPage = lazy(() => import("@/pages/clinical-comparison-page"));
const SymptomAssessmentPage = lazy(() => import("@/pages/symptom-assessment-page"));
const NursingPhysiologyHub = lazy(() => import("@/pages/nursing-physiology-hub"));
const MedicalImagingHub = lazy(() => import("@/pages/medical-imaging-hub"));
const MedicalImagingCanadaPage = lazy(() => import("@/pages/medical-imaging-country").then(m => ({ default: m.MedicalImagingCanada })));
const MedicalImagingUSAPage = lazy(() => import("@/pages/medical-imaging-country").then(m => ({ default: m.MedicalImagingUSA })));
const ImagingLessonsPage = lazy(() => import("@/pages/imaging-lessons"));
const ImagingPositioningPage = lazy(() => import("@/pages/imaging-positioning"));
const ImagingPositioningDetailPage = lazy(() => import("@/pages/imaging-positioning-detail"));
const ImagingPhysicsPage = lazy(() => import("@/pages/imaging-physics"));
const ImagingPhysicsTopicPage = lazy(() => import("@/pages/imaging-physics-topic"));
const ImagingFlashcardsPage = lazy(() => import("@/pages/imaging-flashcards"));
const ImagingPracticeExamPage = lazy(() => import("@/pages/imaging-practice-exam"));
const ImagingExamSimulatorPage = lazy(() => import("@/pages/imaging-exam-simulator"));
const ImagingPricingPage = lazy(() => import("@/pages/imaging-pricing"));
const ImagingPricingCanadaPage = lazy(() => import("@/pages/imaging-pricing").then(m => ({ default: m.ImagingPricingCanada })));
const ImagingPricingUSAPage = lazy(() => import("@/pages/imaging-pricing").then(m => ({ default: m.ImagingPricingUSA })));
const ImagingStorePage = lazy(() => import("@/pages/imaging-store"));
const ImagingAccountPage = lazy(() => import("@/pages/imaging-account"));
const ImagingPurchaseSuccessPage = lazy(() => import("@/components/imaging-paywall").then(m => ({ default: m.ImagingPurchaseSuccess })));
const ClinicalCaseStudyPage = lazy(() => import("@/pages/clinical-case-study"));
const ImagingSeoPage = lazy(() => import("@/pages/imaging-seo-page"));
const ImagingBlog = lazy(() => import("@/pages/imaging-blog"));
const RadiographyPracticeQuestionsLanding = lazy(() => import("@/pages/imaging-seo-landing").then(m => ({ default: m.RadiographyPracticeQuestions })));
const RadiographyPositioningGuideLanding = lazy(() => import("@/pages/imaging-seo-landing").then(m => ({ default: m.RadiographyPositioningGuide })));
const RadiographyArtifactRecognitionLanding = lazy(() => import("@/pages/imaging-seo-landing").then(m => ({ default: m.RadiographyArtifactRecognition })));
const ImagingStudyPlanGenerator = lazy(() => import("@/pages/imaging-study-plan-generator"));
const RadiographyReadinessQuiz = lazy(() => import("@/pages/radiography-readiness-quiz"));
const ExamBlueprintPage = lazy(() => import("@/pages/exam-blueprint-page"));
const ExamReadinessDemo = lazy(() => import("@/pages/exam-readiness-demo"));
const ExamReadinessPage = lazy(() => import("@/pages/exam-readiness"));
const SeoPracticeQuiz = lazy(() => import("@/pages/seo-practice-quiz"));
const ExamPrepCornerstonePage = lazy(() => import("@/pages/exam-prep-cornerstone-pages"));
const AuthorityGuidePage = lazy(() => import("@/pages/authority-guide-pages"));
const ClinicalCalculatorsPage = lazy(() => import("@/pages/clinical-calculators"));
const NursingStudyGuidesPage = lazy(() => import("@/pages/nursing-study-guides"));
const NursingClinicalScenariosHubPage = lazy(() => import("@/pages/nursing-clinical-scenarios-hub"));
const ParamedicPracticeQuestions = lazy(() => import("@/pages/profession-practice-questions").then(m => ({ default: m.ParamedicPracticeQuestions })));
const RrtPracticeQuestions = lazy(() => import("@/pages/profession-practice-questions").then(m => ({ default: m.RrtPracticeQuestions })));
const MltPracticeQuestionsPage = lazy(() => import("@/pages/profession-practice-questions").then(m => ({ default: m.MltPracticeQuestions })));
const ImagingPracticeQuestions = lazy(() => import("@/pages/profession-practice-questions").then(m => ({ default: m.ImagingPracticeQuestions })));
const SocialWorkPracticeQuestions = lazy(() => import("@/pages/profession-practice-questions").then(m => ({ default: m.SocialWorkPracticeQuestions })));
const PsychotherapyPracticeQuestions = lazy(() => import("@/pages/profession-practice-questions").then(m => ({ default: m.PsychotherapyPracticeQuestions })));
const AddictionsPracticeQuestions = lazy(() => import("@/pages/profession-practice-questions").then(m => ({ default: m.AddictionsPracticeQuestions })));
const OccupationalTherapyPracticeQuestions = lazy(() => import("@/pages/profession-practice-questions").then(m => ({ default: m.OccupationalTherapyPracticeQuestions })));
const BookmarksPage = lazy(() => import("@/pages/bookmarks"));
const CustomPracticePage = lazy(() => import("@/pages/custom-practice"));
const PerformanceAnalyticsPage = lazy(() => import("@/pages/performance-analytics"));
const OfflineStudyPage = lazy(() => import("@/pages/offline-study"));
const EncyclopediaLanding = lazy(() => import("@/pages/encyclopedia-landing"));
const EncyclopediaHub = lazy(() => import("@/pages/encyclopedia-hub"));
const EncyclopediaEntry = lazy(() => import("@/pages/encyclopedia-entry"));
const ProgrammaticSeoPage = lazy(() => import("@/pages/programmatic-seo-page"));
const NursingAuthorityHub = lazy(() => import("@/pages/authority-hubs").then(m => ({ default: m.NursingAuthorityHub })));
const ParamedicAuthorityHub = lazy(() => import("@/pages/authority-hubs").then(m => ({ default: m.ParamedicAuthorityHub })));
const RespiratoryTherapyAuthorityHub = lazy(() => import("@/pages/authority-hubs").then(m => ({ default: m.RespiratoryTherapyAuthorityHub })));
const MltAuthorityHub = lazy(() => import("@/pages/authority-hubs").then(m => ({ default: m.MltAuthorityHub })));
const ImagingAuthorityHub = lazy(() => import("@/pages/authority-hubs").then(m => ({ default: m.ImagingAuthorityHub })));
const SocialWorkAuthorityHub = lazy(() => import("@/pages/authority-hubs").then(m => ({ default: m.SocialWorkAuthorityHub })));
const PsychotherapyAuthorityHub = lazy(() => import("@/pages/authority-hubs").then(m => ({ default: m.PsychotherapyAuthorityHub })));
const AddictionsAuthorityHub = lazy(() => import("@/pages/authority-hubs").then(m => ({ default: m.AddictionsAuthorityHub })));
const OccupationalTherapyAuthorityHub = lazy(() => import("@/pages/authority-hubs").then(m => ({ default: m.OccupationalTherapyAuthorityHub })));
const CareerGuidePage = lazy(() => import("@/allied/pages/career-guide-page"));
const AuthorityContentPage = lazy(() => import("@/pages/authority-content-page"));
const PerioperativeNursingHub = lazy(() => import("@/pages/perioperative-hub-pages"));
const PreoperativeCareHub = lazy(() => import("@/pages/perioperative-hub-pages").then(m => ({ default: m.PreoperativeCareHub })));
const PreoperativeNursingGuide = lazy(() => import("@/pages/perioperative-hub-pages").then(m => ({ default: m.PreoperativeNursingGuide })));
const PerioperativeNurseCareer = lazy(() => import("@/pages/perioperative-hub-pages").then(m => ({ default: m.PerioperativeNurseCareer })));
const HealthcareGuidesIndex = lazy(() => import("@/pages/healthcare-guide-page").then(m => ({ default: m.HealthcareGuidesIndex })));
const UnifiedGuidePage = lazy(() => import("@/pages/unified-guide-page"));
const ClusterGuidePage = lazy(() => import("@/pages/cluster-guide-page"));
const WhyNurseNestPage = lazy(() => import("@/pages/why-nursenest"));
const ExamPrepHub = lazy(() => import("@/pages/exam-prep-hub"));
const NewGraduateSupportHub = lazy(() => import("@/pages/new-graduate-support-hub"));
const HealthcareCareersHub = lazy(() => import("@/pages/healthcare-careers-hub"));
const HealthcareCareerDetail = lazy(() => import("@/pages/healthcare-career-detail"));
const GenericCareerJourney = lazy(() => import("@/pages/career-journey"));
const ProfessionCareerJourney = lazy(() => import("@/pages/career-journey").then(m => ({ default: m.ProfessionCareerJourney })));
const NclexReadinessScore = lazy(() => import("@/pages/nclex-readiness-score"));
const SeoLandingPage = lazy(() => import("@/pages/seo-landing-page"));
const SeoLandingBySlug = lazy(() => import("@/pages/seo-landing-page").then(m => ({ default: m.SeoLandingBySlug })));
const ExamBlueprintHub = lazy(() => import("@/pages/exam-blueprint-hub"));
const ExamBlueprintCategory = lazy(() => import("@/pages/exam-blueprint-category"));
const TopicClusterPage = lazy(() => import("@/pages/topic-cluster-page"));
const TopicClusterBySlug = lazy(() => import("@/pages/topic-cluster-page").then(m => ({ default: m.TopicClusterBySlug })));
const NursingPhysiologyHubPage = lazy(() => import("@/pages/nursing-physiology-hub-page"));
const ClinicalNursingSkillsHubPage = lazy(() => import("@/pages/clinical-nursing-skills-hub-page"));
const CardiologyHub = lazy(() => import("@/pages/category-hub-page").then(m => ({ default: m.CardiologyHub })));
const RespiratoryHub = lazy(() => import("@/pages/category-hub-page").then(m => ({ default: m.RespiratoryHub })));
const EndocrineHub = lazy(() => import("@/pages/category-hub-page").then(m => ({ default: m.EndocrineHub })));
const NeurologyNursingHub = lazy(() => import("@/pages/category-hub-page").then(m => ({ default: m.NeurologyHub })));
const ElectrolytesHub = lazy(() => import("@/pages/category-hub-page").then(m => ({ default: m.ElectrolytesHub })));
const PharmacologyNursingHub = lazy(() => import("@/pages/category-hub-page").then(m => ({ default: m.PharmacologyNursingHub })));
const InternationalNursingHub = lazy(() => import("@/pages/international-nursing-hub"));
const InternationalNursingCountry = lazy(() => import("@/pages/international-nursing-country"));
const InternationalNursingMigration = lazy(() => import("@/pages/international-nursing-migration"));
const InternationalNursingExam = lazy(() => import("@/pages/international-nursing-exam"));
const InternationalNursingComparison = lazy(() => import("@/pages/international-nursing-comparison"));
const InternationalNursingTools = lazy(() => import("@/pages/international-nursing-tools"));
const InternationalNursingContent = lazy(() => import("@/pages/international-nursing-content"));
const InternationalNursingCluster = lazy(() => import("@/pages/international-nursing-cluster"));
const HealthcarePolicyHub = lazy(() => import("@/pages/healthcare-policy-hub"));
const LicensingPolicyChanges = lazy(() => import("@/pages/healthcare-policy-pages").then(m => ({ default: m.LicensingPolicyChanges })));
const InternationalNursingRecruitmentPolicy = lazy(() => import("@/pages/healthcare-policy-pages").then(m => ({ default: m.InternationalNursingRecruitment })));
const ExamFormatUpdates = lazy(() => import("@/pages/healthcare-policy-pages").then(m => ({ default: m.ExamFormatUpdates })));
const RegulatoryChanges = lazy(() => import("@/pages/healthcare-policy-pages").then(m => ({ default: m.RegulatoryChanges })));

function ProtectedTestBankRoute({ children }: { children: ReactNode }) {
  const { user, isLoading, hasAccess } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      navigate("/login?redirect=" + encodeURIComponent(window.location.pathname));
      return;
    }
    if (!hasAccess("rpn")) {
      navigate("/pricing");
      return;
    }
  }, [user, isLoading, hasAccess, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user || !hasAccess("rpn")) {
    return null;
  }

  return (
    <ProtectedAccessBoundary context={{ contentCategory: "question-bank", fallbackPath: "/dashboard", label: "question bank" }}>
      {children}
    </ProtectedAccessBoundary>
  );
}

function ProtectedPremiumRoute({ children, category, label, fallbackPath, requiredTier }: { children: ReactNode; category: ContentCategory; label?: string; fallbackPath?: string; requiredTier?: string }) {
  const { user, hasAccess } = useAuth();
  const context: ProtectedRouteContext = { contentCategory: category, label, fallbackPath: fallbackPath || "/dashboard", tier: requiredTier };

  if (!user || !hasAccess(requiredTier || "rpn")) {
    return <>{children}</>;
  }

  return (
    <ProtectedAccessBoundary context={context}>
      {children}
    </ProtectedAccessBoundary>
  );
}


function PageTracker() {
  usePageTracker();
  return null;
}

function CopyProtection() {
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (isAdmin) {
      document.body.classList.add("admin-selectable");
      return () => {
        document.body.classList.remove("admin-selectable");
      };
    }

    document.body.classList.remove("admin-selectable");

    function isEditableTarget(target: EventTarget | null): boolean {
      if (!target || !(target instanceof HTMLElement)) return false;
      const tag = target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return true;
      if (target.isContentEditable) return true;
      if (target.closest(".allow-select")) return true;
      return false;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "PrintScreen") {
        e.preventDefault();
        document.body.style.filter = "blur(20px)";
        setTimeout(() => { document.body.style.filter = ""; }, 1500);
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "s" || e.key === "S" || e.key === "i" || e.key === "I")) {
        const imgs = document.querySelectorAll(".protected-image");
        imgs.forEach((img) => { (img as HTMLElement).style.visibility = "hidden"; });
        setTimeout(() => {
          imgs.forEach((img) => { (img as HTMLElement).style.visibility = "visible"; });
        }, 2000);
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === "s" || e.key === "S") && !e.shiftKey) {
        e.preventDefault();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === "c" || e.key === "C" || e.key === "x" || e.key === "X" || e.key === "a" || e.key === "A") && !isEditableTarget(e.target)) {
        e.preventDefault();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === "u" || e.key === "U")) {
        e.preventDefault();
      }
    };

    const handleCopy = (e: ClipboardEvent) => {
      if (!isEditableTarget(e.target)) {
        e.preventDefault();
      }
    };

    const handleCut = (e: ClipboardEvent) => {
      if (!isEditableTarget(e.target)) {
        e.preventDefault();
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      if (!isEditableTarget(e.target)) {
        e.preventDefault();
      }
    };

    const handleDragStart = (e: DragEvent) => {
      if (!isEditableTarget(e.target)) {
        e.preventDefault();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        const imgs = document.querySelectorAll(".protected-image");
        imgs.forEach((img) => { (img as HTMLElement).style.visibility = "hidden"; });
        setTimeout(() => {
          if (document.visibilityState === "visible") {
            const imgs2 = document.querySelectorAll(".protected-image");
            imgs2.forEach((img) => { (img as HTMLElement).style.visibility = "visible"; });
          }
        }, 300);
      } else {
        const imgs = document.querySelectorAll(".protected-image");
        imgs.forEach((img) => { (img as HTMLElement).style.visibility = "visible"; });
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("copy", handleCopy);
    document.addEventListener("cut", handleCut);
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("dragstart", handleDragStart);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("cut", handleCut);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("dragstart", handleDragStart);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isAdmin]);

  return null;
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center space-y-3">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    </div>
  );
}

function AppRoutes() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Switch>
        <Route path="/">{() => <RouteErrorBoundary groupName="home"><Home /></RouteErrorBoundary>}</Route>
        <Route path="/languages" component={LanguagesPage} />
        <Route path="/dashboard">{() => <PremiumFeatureErrorBoundary featureName="dashboard" fallbackPath="/en/lessons"><ProtectedRoute contentType="general" fallbackPath="/en/lessons"><DashboardPage /></ProtectedRoute></PremiumFeatureErrorBoundary>}</Route>
        <Route path="/start-free" component={StartFreePage} />
        <Route path="/pathways">{() => <RouteErrorBoundary groupName="content"><PathwaysPage /></RouteErrorBoundary>}</Route>
        <Route path="/med-math">{() => <RouteErrorBoundary groupName="tools"><MedMathPage /></RouteErrorBoundary>}</Route>
        <Route path="/lab-values">{() => <RouteErrorBoundary groupName="tools"><LabValuesPage /></RouteErrorBoundary>}</Route>
        <Route path="/si-to-conventional-units-converter" component={SIConventionalConverterPage} />
        <Route path="/canadian-vs-american-lab-values" component={ConversionClusterWrapper} />
        <Route path="/glucose-mmol-l-to-mg-dl" component={ConversionClusterWrapper} />
        <Route path="/creatinine-umol-l-to-mg-dl" component={ConversionClusterWrapper} />
        <Route path="/hemoglobin-g-l-to-g-dl" component={ConversionClusterWrapper} />
        <Route path="/bilirubin-umol-l-to-mg-dl" component={ConversionClusterWrapper} />
        <Route path="/calcium-mmol-l-to-mg-dl" component={ConversionClusterWrapper} />
        <Route path="/urea-to-bun-conversion-nursing" component={ConversionClusterWrapper} />
        <Route path="/cholesterol-triglyceride-unit-conversion" component={ConversionClusterWrapper} />
        <Route path="/kg-to-lb-nursing" component={ConversionClusterWrapper} />
        <Route path="/celsius-to-fahrenheit-nursing" component={ConversionClusterWrapper} />
        <Route path="/admin">{() => <RouteErrorBoundary groupName="admin"><LazyAdminRoutes /></RouteErrorBoundary>}</Route>
        <Route path="/admin/:rest*">{() => <RouteErrorBoundary groupName="admin"><LazyAdminRoutes /></RouteErrorBoundary>}</Route>
        <Route path="/:locale/admin">{() => <RouteErrorBoundary groupName="admin"><LazyAdminRoutes /></RouteErrorBoundary>}</Route>
        <Route path="/:locale/admin/:rest*">{() => <RouteErrorBoundary groupName="admin"><LazyAdminRoutes /></RouteErrorBoundary>}</Route>
        <Route path="/admin-performance">{() => <RouteErrorBoundary groupName="admin"><LazyAdminRoutes /></RouteErrorBoundary>}</Route>
        <Route path="/:locale/admin-performance">{() => <RouteErrorBoundary groupName="admin"><LazyAdminRoutes /></RouteErrorBoundary>}</Route>
        <Route path="/content-editor">{() => <RouteErrorBoundary groupName="admin"><LazyAdminRoutes /></RouteErrorBoundary>}</Route>
        <Route path="/instructor">{() => <RouteErrorBoundary groupName="admin"><LazyAdminRoutes /></RouteErrorBoundary>}</Route>
        <Route path="/demo/exam-readiness">{() => <RouteErrorBoundary groupName="admin"><LazyAdminRoutes /></RouteErrorBoundary>}</Route>
        <Route path="/demo/learning-progress">{() => <RouteErrorBoundary groupName="admin"><LazyAdminRoutes /></RouteErrorBoundary>}</Route>
        <Route path="/study/:mode">{() => <PremiumFeatureErrorBoundary featureName="study" fallbackPath="/en/dashboard"><ProtectedRoute contentType="exam" killSwitchKey="cat"><AdaptiveStudyPage /></ProtectedRoute></PremiumFeatureErrorBoundary>}</Route>
        <Route path="/study">{() => <PremiumFeatureErrorBoundary featureName="study" fallbackPath="/en/dashboard"><ProtectedRoute contentType="exam" killSwitchKey="cat"><AdaptiveStudyPage /></ProtectedRoute></PremiumFeatureErrorBoundary>}</Route>
        <Route path="/qbank/exam">{() => <PremiumFeatureErrorBoundary featureName="question bank" fallbackPath="/en/dashboard"><ProtectedRoute contentType="exam" killSwitchKey="qbank" safeModeRenderer={() => <SafeExamFallback onBack={() => window.location.href = "/en/dashboard"} />}><QBankExamPage /></ProtectedRoute></PremiumFeatureErrorBoundary>}</Route>
        <Route path="/qbank/study">{() => <PremiumFeatureErrorBoundary featureName="question bank" fallbackPath="/en/dashboard"><ProtectedRoute contentType="exam" killSwitchKey="qbank"><QBankStudyPage /></ProtectedRoute></PremiumFeatureErrorBoundary>}</Route>
        <Route path="/qbank/browse">{() => <PremiumFeatureErrorBoundary featureName="question bank" fallbackPath="/en/dashboard"><ProtectedRoute contentType="exam" killSwitchKey="qbank"><QBankPreviewPage /></ProtectedRoute></PremiumFeatureErrorBoundary>}</Route>
        <Route path="/case-simulations">{() => <ProtectedPremiumRoute category="premium-tool" label="case simulation" fallbackPath="/dashboard"><CaseSimulationPage /></ProtectedPremiumRoute>}</Route>
        <Route path="/first-action-simulator" component={FirstActionSimulatorPage} />
        <Route path="/safety-hazard-simulator" component={SafetyHazardSimulatorPage} />
        <Route path="/iv-complications-simulator" component={IVComplicationsSimulatorPage} />
        <Route path="/electrolyte-abg-simulator" component={ElectrolyteABGSimulatorPage} />
        <Route path="/deteriorating-patient-simulator" component={DeterioratingPatientSimulatorPage} />
        <Route path="/blood-transfusion-simulator" component={BloodTransfusionSimulatorPage} />
        <Route path="/simulators/clinical-skills" component={SimulatorsPage} />
        <Route path="/simulators/osce" component={SimulatorsPage} />
        <Route path="/simulators/clinical-lab" component={SimulatorsPage} />
        <Route path="/osce-skills" component={OSCESkillsPage} />
        <Route path="/jobs/:slug">{() => <RouteErrorBoundary groupName="content"><JobDetail /></RouteErrorBoundary>}</Route>
        <Route path="/jobs">{() => <RouteErrorBoundary groupName="content"><JobsHub /></RouteErrorBoundary>}</Route>
        <Route path="/newgrad/certifications/:slug" component={NewGradCertificationDetail} />
        <Route path="/newgrad/certifications" component={NewGradCertificationsHub} />
        <Route path="/new-grad/certifications/:slug">{(params: any) => <Redirect to={`/newgrad/certifications/${params.slug}`} />}</Route>
        <Route path="/new-grad/certifications">{() => <Redirect to="/newgrad/certifications" />}</Route>
        <Route path="/new-grad/clinical-references/:slug">{(params: any) => <Redirect to={`/newgrad/clinical-references/${params.slug}`} />}</Route>
        <Route path="/new-grad/clinical-references">{() => <Redirect to="/newgrad/clinical-references" />}</Route>
        <Route path="/new-grad/clinical-skills/:skill" component={ClinicalSkillsGuidePage} />
        <Route path="/new-grad/unit-guide/:unit" component={UnitGuidePage} />
        <Route path="/new-grad/career/:path" component={CareerDevelopmentPage} />
        <Route path="/new-grad/scenario/:slug" component={ClinicalScenarioPage} />

        <Route path="/newgrad/survival-guide" component={NewGradSurvivalGuideLanding} />
        <Route path="/newgrad/clinical-references/:slug" component={NewGradClinicalReferenceDetail} />
        <Route path="/newgrad/clinical-references" component={NewGradClinicalReferencesPage} />
        <Route path="/newgrad/guides" component={NewGradGuidesPage} />
        <Route path="/newgrad/career" component={NewGradCareerPage} />
        <Route path="/newgrad/interview" component={NewGradInterviewPage} />
        <Route path="/newgrad/mock-interview" component={NewGradMockInterviewPage} />
        <Route path="/newgrad/simulation-sets" component={NewGradSimulationSetsPage} />
        <Route path="/newgrad/resume" component={NewGradResumePage} />
        <Route path="/newgrad/workplace" component={NewGradWorkplacePage} />
        <Route path="/newgrad/scenarios" component={NewGradScenariosPage} />
        <Route path="/newgrad/burnout" component={NewGradBurnoutPage} />
        <Route path="/newgrad/salary" component={NewGradSalaryPage} />
        <Route path="/newgrad/professional-development" component={NewGradProfDevPage} />
        <Route path="/newgrad" component={NewGradHub} />
        <Route path="/new-grad/faq" component={NewGradFAQPage} />
        <Route path="/new-grad/first-year-nurse-survival-guide">{() => <SeoLandingBySlug slug="new-grad/first-year-nurse-survival-guide" />}</Route>
        <Route path="/new-grad/new-nurse-orientation-tips">{() => <SeoLandingBySlug slug="new-grad/new-nurse-orientation-tips" />}</Route>
        <Route path="/new-grad/:profession/:guideSlug" component={SeoGuidePage} />
        <Route path="/new-grad/:profession">{(params: any) => {
          const prof = params.profession || "";
          if (prof.endsWith("-first-year-guide")) {
            return <FirstYearGuidePage />;
          }
          return <NewGradProfessionHub />;
        }}</Route>
        <Route path="/new-grad" component={SeoHubNewGrad} />

        <Route path="/resumes-cover-letters/:slug" component={SeoResumeArticle} />
        <Route path="/resumes-cover-letters" component={SeoHubResumes} />

        <Route path="/interview-prep/:slug" component={SeoInterviewArticle} />
        <Route path="/interview-prep" component={SeoHubInterview} />

        <Route path="/personal-statements/:slug" component={SeoPersonalStatementArticle} />
        <Route path="/personal-statements" component={SeoHubPersonalStatements} />

        <Route path="/resources/:slug" component={SeoCareerArticle} />
        <Route path="/resources" component={SeoHubResources} />

        <Route path="/exam-prep" component={ExamPrepHub} />
        <Route path="/new-graduate-support" component={NewGraduateSupportHub} />
        <Route path="/healthcare-careers" component={HealthcareCareersHub} />
        <Route path="/healthcare-careers/:slug" component={HealthcareCareerDetail} />
        <Route path="/career-guides/how-to-become-an-icu-nurse">{() => <SeoLandingBySlug slug="career-guides/how-to-become-an-icu-nurse" />}</Route>
        <Route path="/career-guides/how-to-become-an-er-nurse">{() => <SeoLandingBySlug slug="career-guides/how-to-become-an-er-nurse" />}</Route>
        <Route path="/career-guides/how-to-become-a-pediatric-nurse">{() => <SeoLandingBySlug slug="career-guides/how-to-become-a-pediatric-nurse" />}</Route>

        {/* Allied health routes handled by catch-all AlliedRoutes below */}

        <Route path="/nurse-first-year-survival-guide" component={NewGradGuidePage} />
        <Route path="/paramedic-first-year-survival-guide" component={NewGradGuidePage} />
        <Route path="/respiratory-therapist-first-year-survival-guide" component={NewGradGuidePage} />
        <Route path="/mlt-first-year-survival-guide" component={NewGradGuidePage} />
        <Route path="/imaging-tech-first-year-survival-guide" component={NewGradGuidePage} />
        <Route path="/social-work-first-year-survival-guide" component={NewGradGuidePage} />
        <Route path="/psychotherapy-first-year-survival-guide" component={NewGradGuidePage} />
        <Route path="/addictions-counselor-first-year-survival-guide" component={NewGradGuidePage} />
        <Route path="/addictions-counseling-first-year-survival-guide" component={NewGradGuidePage} />
        <Route path="/ot-first-year-survival-guide" component={NewGradGuidePage} />
        <Route path="/applynest/careers/:profession" component={ApplyNestCareerPage} />
        <Route path="/applynest/resume-templates" component={ApplyNestResumeTemplates} />
        <Route path="/applynest/interview-prep" component={ApplyNestInterviewPrep} />
        <Route path="/applynest/job-search-guide" component={ApplyNestJobSearchGuide} />
        <Route path="/applynest" component={ApplyNestLanding} />
        <Route path="/clinical-skills">{() => <RouteErrorBoundary groupName="content"><ClinicalSkillsHub /></RouteErrorBoundary>}</Route>
        <Route path="/clinical-skills/:slug">{() => <RouteErrorBoundary groupName="content"><ClinicalSkillsGuideDetail /></RouteErrorBoundary>}</Route>
        <Route path="/unit-guides/:slug" component={NewGradGuidePage} />
        <Route path="/career-development/:slug" component={NewGradGuidePage} />
        <Route path="/clinical-scenarios/:slug" component={NewGradGuidePage} />
        <Route path="/questions/:slug">{() => <RouteErrorBoundary groupName="content"><QuestionPreviewPage /></RouteErrorBoundary>}</Route>
        <Route path="/rpn/exams">{() => <PremiumFeatureErrorBoundary featureName="exams" fallbackPath="/en/dashboard"><ProtectedRoute contentType="exam" killSwitchKey="mockExams"><MockExamsPage /></ProtectedRoute></PremiumFeatureErrorBoundary>}</Route>
        <Route path="/rn/exams">{() => <PremiumFeatureErrorBoundary featureName="exams" fallbackPath="/en/dashboard"><ProtectedRoute contentType="exam" killSwitchKey="mockExams"><MockExamsPage /></ProtectedRoute></PremiumFeatureErrorBoundary>}</Route>
        <Route path="/rpn/questions/:topicSlug">{() => <NursingQuestionSeoPage tier="rpn" />}</Route>
        <Route path="/rpn/questions">{() => <NursingQuestionsIndexPage tier="rpn" />}</Route>
        <Route path="/rn/questions/:topicSlug">{() => <NursingQuestionSeoPage tier="rn" />}</Route>
        <Route path="/rn/questions">{() => <NursingQuestionsIndexPage tier="rn" />}</Route>
        <Route path="/np-exam-prep" component={NpExamPrepPillar} />
        <Route path="/np/exams" component={NpExamHubPage} />
        <Route path="/np/aanp-exam" component={AanpExamPage} />
        <Route path="/np/ancc-exam" component={AnccExamPage} />
        <Route path="/np/upcoming-canada-np-exam" component={UpcomingCanadaNpExamPage} />
        <Route path="/np/agpcnp-exam" component={AgpcnpExamPage} />
        <Route path="/np/agacnp-exam" component={AgacnpExamPage} />
        <Route path="/np/pmhnp-exam" component={PmhnpExamPage} />
        <Route path="/np/pnp-exam" component={PnpExamPage} />
        <Route path="/np/whnp-exam" component={WhnpExamPage} />
        <Route path="/np/enp-exam" component={EnpExamPage} />
        <Route path="/np/questions/:topicSlug">{() => <NursingQuestionSeoPage tier="np" />}</Route>
        <Route path="/np/questions">{() => <NursingQuestionsIndexPage tier="np" />}</Route>
        <Route path="/career-journey/:slug" component={ProfessionCareerJourney} />
        <Route path="/career-journey" component={GenericCareerJourney} />
        <Route path="/how-to-become-a-nurse/:track" component={NursingCareerPage} />
        <Route path="/pass-nclex-first-time" component={NclexLandingPage} />
        <Route path="/rpn">{() => <TrackLandingPage track="rpn" />}</Route>
        <Route path="/rn">{() => <TrackLandingPage track="rn" />}</Route>
        <Route path="/np">{() => <TrackLandingPage track="np" />}</Route>
        <Route path="/nursing/top-100-nclex-practice-questions" component={AuthorityContentPage} />
        <Route path="/nursing/rex-pn-practice-questions">{() => <SeoLandingBySlug slug="nursing/rex-pn-practice-questions" />}</Route>
        <Route path="/nursing/rex-pn-study-guide">{() => <SeoLandingBySlug slug="nursing/rex-pn-study-guide" />}</Route>
        <Route path="/nursing/rex-pn-flashcards">{() => <SeoLandingBySlug slug="nursing/rex-pn-flashcards" />}</Route>
        <Route path="/nursing/rex-pn-mock-exam">{() => <SeoLandingBySlug slug="nursing/rex-pn-mock-exam" />}</Route>
        <Route path="/nursing/nclex-rn-practice-questions">{() => <SeoLandingBySlug slug="nursing/nclex-rn-practice-questions" />}</Route>
        <Route path="/nursing/nclex-rn-study-guide">{() => <SeoLandingBySlug slug="nursing/nclex-rn-study-guide" />}</Route>
        <Route path="/nursing/nclex-pn-practice-questions">{() => <SeoLandingBySlug slug="nursing/nclex-pn-practice-questions" />}</Route>
        <Route path="/nursing/nclex-pn-flashcards">{() => <SeoLandingBySlug slug="nursing/nclex-pn-flashcards" />}</Route>
        <Route path="/nursing/np-exam-prep">{() => { window.location.replace("/np-exam-prep"); return null; }}</Route>
        <Route path="/nursing" component={NursingAuthorityHub} />
        <Route path="/nursing-schools/:country" component={NursingSchoolsCountry} />
        <Route path="/nursing-schools" component={NursingSchoolsHub} />
        <Route path="/nurse-residency-programs/:country" component={NurseResidencyCountry} />
        <Route path="/nurse-residency-programs" component={NurseResidencyHub} />
        <Route path="/nursing-regulatory-bodies/:slug" component={NursingRegulatoryDetail} />
        <Route path="/nursing-regulatory-bodies" component={NursingRegulatoryHub} />
        <Route path="/nursing-licensing-exams/:slug" component={LicensingExamDetail} />
        <Route path="/nursing-licensing-exams" component={NursingLicensingExamsHub} />
        <Route path="/nurse-salary-guide" component={NurseSalaryGuideHub} />
        <Route path="/nurse-salary-canada" component={NurseSalaryCountryPage} />
        <Route path="/nurse-salary-united-states" component={NurseSalaryCountryPage} />
        <Route path="/nurse-salary-united-kingdom" component={NurseSalaryCountryPage} />
        <Route path="/nurse-salary-australia" component={NurseSalaryCountryPage} />
        <Route path="/nursing-specialties" component={NursingSpecialtiesHub} />
        <Route path="/nursing-specialties/:slug" component={NursingSpecialtyDetail} />

        {/* 16 Specialty Hub Pages */}
        <Route path="/icu">{() => <SpecialtyHubBySlug slug="icu" />}</Route>
        <Route path="/pediatric-icu">{() => <SpecialtyHubBySlug slug="pediatric-icu" />}</Route>
        <Route path="/nicu">{() => <SpecialtyHubBySlug slug="nicu" />}</Route>
        <Route path="/med-surg">{() => <SpecialtyHubBySlug slug="med-surg" />}</Route>
        <Route path="/orthopedics">{() => <SpecialtyHubBySlug slug="orthopedics" />}</Route>
        <Route path="/mental-health">{() => <SpecialtyHubBySlug slug="mental-health" />}</Route>
        <Route path="/nephrology">{() => <SpecialtyHubBySlug slug="nephrology" />}</Route>
        <Route path="/labor-and-delivery">{() => <SpecialtyHubBySlug slug="labor-and-delivery" />}</Route>
        <Route path="/postpartum">{() => <SpecialtyHubBySlug slug="postpartum" />}</Route>
        <Route path="/neurology">{() => <SpecialtyHubBySlug slug="neurology" />}</Route>
        <Route path="/palliative-care">{() => <SpecialtyHubBySlug slug="palliative-care" />}</Route>
        <Route path="/trauma">{() => <SpecialtyHubBySlug slug="trauma" />}</Route>
        <Route path="/public-health">{() => <SpecialtyHubBySlug slug="public-health" />}</Route>
        <Route path="/community-nursing">{() => <SpecialtyHubBySlug slug="community-nursing" />}</Route>
        <Route path="/long-term-care">{() => <SpecialtyHubBySlug slug="long-term-care" />}</Route>
        <Route path="/rehabilitation">{() => <SpecialtyHubBySlug slug="rehabilitation" />}</Route>
        <Route path="/emergency-nursing-specialty">{() => <SpecialtyHubBySlug slug="emergency-nursing-specialty" />}</Route>
        <Route path="/oncology-nursing-specialty">{() => <SpecialtyHubBySlug slug="oncology-nursing-specialty" />}</Route>
        <Route path="/perioperative-nursing-specialty">{() => <SpecialtyHubBySlug slug="perioperative-nursing-specialty" />}</Route>
        <Route path="/critical-care-specialty">{() => <SpecialtyHubBySlug slug="critical-care-specialty" />}</Route>

        {/* 20 Specialty SEO Landing Pages */}
        <Route path="/icu-nursing-guide">{() => <SpecialtySeoBySlug slug="icu-nursing-guide" />}</Route>
        <Route path="/pediatric-icu-nursing-guide">{() => <SpecialtySeoBySlug slug="pediatric-icu-nursing-guide" />}</Route>
        <Route path="/nicu-nursing-guide">{() => <SpecialtySeoBySlug slug="nicu-nursing-guide" />}</Route>
        <Route path="/med-surg-nursing-guide">{() => <SpecialtySeoBySlug slug="med-surg-nursing-guide" />}</Route>
        <Route path="/orthopedic-nursing-guide">{() => <SpecialtySeoBySlug slug="orthopedic-nursing-guide" />}</Route>
        <Route path="/mental-health-nursing-guide">{() => <SpecialtySeoBySlug slug="mental-health-nursing-guide" />}</Route>
        <Route path="/nephrology-nursing-guide">{() => <SpecialtySeoBySlug slug="nephrology-nursing-guide" />}</Route>
        <Route path="/labor-and-delivery-nursing-guide">{() => <SpecialtySeoBySlug slug="labor-and-delivery-nursing-guide" />}</Route>
        <Route path="/postpartum-nursing-guide">{() => <SpecialtySeoBySlug slug="postpartum-nursing-guide" />}</Route>
        <Route path="/neurology-nursing-guide">{() => <SpecialtySeoBySlug slug="neurology-nursing-guide" />}</Route>
        <Route path="/palliative-care-nursing-guide">{() => <SpecialtySeoBySlug slug="palliative-care-nursing-guide" />}</Route>
        <Route path="/trauma-nursing-guide">{() => <SpecialtySeoBySlug slug="trauma-nursing-guide" />}</Route>
        <Route path="/public-health-nursing-guide">{() => <SpecialtySeoBySlug slug="public-health-nursing-guide" />}</Route>
        <Route path="/community-nursing-guide">{() => <SpecialtySeoBySlug slug="community-nursing-guide" />}</Route>
        <Route path="/long-term-care-nursing-guide">{() => <SpecialtySeoBySlug slug="long-term-care-nursing-guide" />}</Route>
        <Route path="/rehabilitation-nursing-guide">{() => <SpecialtySeoBySlug slug="rehabilitation-nursing-guide" />}</Route>
        <Route path="/emergency-nursing-specialty-guide">{() => <SpecialtySeoBySlug slug="emergency-nursing-specialty-guide" />}</Route>
        <Route path="/oncology-nursing-specialty-guide">{() => <SpecialtySeoBySlug slug="oncology-nursing-specialty-guide" />}</Route>
        <Route path="/perioperative-nursing-specialty-guide">{() => <SpecialtySeoBySlug slug="perioperative-nursing-specialty-guide" />}</Route>
        <Route path="/critical-care-specialty-guide">{() => <SpecialtySeoBySlug slug="critical-care-specialty-guide" />}</Route>

        {/* Certification Exam Prep */}
        <Route path="/certification-exam-prep/:slug/practice" component={CertificationPractice} />
        <Route path="/certification-exam-prep/:slug" component={CertificationExamDetail} />
        <Route path="/certification-exam-prep" component={CertificationExamPrepHub} />

        {/* Nursing Content Hub */}
        <Route path="/nursing-certifications" component={NursingCertificationsHub} />
        <Route path="/nursing-certifications-hub">{() => <Redirect to="/newgrad/certifications" />}</Route>
        <Route path="/healthcare-certifications/:slug" component={HealthcareCertificationDetail} />
        <Route path="/healthcare-certifications" component={HealthcareCertificationsHub} />
        <Route path="/study-pathways" component={StudyPathwaysHub} />
        <Route path="/certifications/bls-prep" component={CertificationPrepPage} />
        <Route path="/certifications/acls-prep" component={CertificationPrepPage} />
        <Route path="/certifications/pals-prep" component={CertificationPrepPage} />
        <Route path="/certifications/nrp-prep" component={CertificationPrepPage} />
        <Route path="/certifications/tncc-prep" component={CertificationPrepPage} />
        <Route path="/certifications/enpc-prep" component={CertificationPrepPage} />
        <Route path="/certifications/ccrn-prep" component={CertificationPrepPage} />
        <Route path="/certifications/emergency-nursing-prep" component={CertificationPrepPage} />
        <Route path="/certifications/oncology-nursing-prep" component={CertificationPrepPage} />
        <Route path="/certifications/pediatric-nursing-prep" component={CertificationPrepPage} />
        <Route path="/certifications/perioperative-nursing-prep" component={CertificationPrepPage} />
        <Route path="/certifications/bls-renewal-prep" component={CertificationRenewalPage} />
        <Route path="/certifications/acls-renewal-prep" component={CertificationRenewalPage} />
        <Route path="/certifications/pals-renewal-prep" component={CertificationRenewalPage} />
        <Route path="/certifications/nrp-renewal-prep" component={CertificationRenewalPage} />
        <Route path="/certifications/tncc-renewal-prep" component={CertificationRenewalPage} />
        <Route path="/certifications/enpc-renewal-prep" component={CertificationRenewalPage} />
        <Route path="/certifications/ccrn-exam-prep">{() => <SeoLandingBySlug slug="certifications/ccrn-exam-prep" />}</Route>
        <Route path="/certifications/cen-exam-prep">{() => <SeoLandingBySlug slug="certifications/cen-exam-prep" />}</Route>
        <Route path="/certifications/tncc-overview">{() => <SeoLandingBySlug slug="certifications/tncc-overview" />}</Route>
        <Route path="/certifications/acls-overview">{() => <SeoLandingBySlug slug="certifications/acls-overview" />}</Route>
        <Route path="/certifications/pals-overview">{() => <SeoLandingBySlug slug="certifications/pals-overview" />}</Route>
        <Route path="/certifications/:slug">{() => <NursingHubPage pageType="certification" />}</Route>
        <Route path="/specialties/:slug">{() => <NursingHubPage pageType="specialty" />}</Route>
        <Route path="/study-pathways/:slug">{() => <NursingHubPage pageType="study-pathway" />}</Route>
        <Route path="/pre-nursing" component={PreNursingPage} />
        <Route path="/mock-exams/:id/report">{() => <PremiumFeatureErrorBoundary featureName="exams" fallbackPath="/en/mock-exams"><ProtectedRoute contentType="exam" killSwitchKey="mockExams"><MockExamReport /></ProtectedRoute></PremiumFeatureErrorBoundary>}</Route>
        <Route path="/mock-exams/:id">{() => <PremiumFeatureErrorBoundary featureName="exams" fallbackPath="/en/mock-exams"><ProtectedRoute contentType="exam" killSwitchKey="mockExams" safeModeRenderer={() => <SafeExamFallback onBack={() => window.location.href = "/en/mock-exams"} />}><ExamErrorBoundary examContext={{ examType: "mock-exam" }}><Suspense fallback={<ExamLoadingFallback />}><MockExamSession /></Suspense></ExamErrorBoundary></ProtectedRoute></PremiumFeatureErrorBoundary>}</Route>
        <Route path="/mock-exams">{() => <PremiumFeatureErrorBoundary featureName="exams" fallbackPath="/en/dashboard"><ProtectedRoute contentType="exam" killSwitchKey="mockExams"><MockExamsPage /></ProtectedRoute></PremiumFeatureErrorBoundary>}</Route>
        <Route path="/probability-simulator" component={ProbabilitySimulatorPage} />
        <Route path="/shop/:slug">{() => <ProtectedRoute contentType="download" safeModeRenderer={() => <SafeDownloadFallback onBack={() => window.location.href = "/en/shop"} />}><ShopProductPage /></ProtectedRoute>}</Route>
        <Route path="/shop">{() => <ProtectedRoute contentType="download" safeModeRenderer={() => <SafeDownloadFallback onBack={() => window.location.href = "/en/dashboard"} />}><ShopPage /></ProtectedRoute>}</Route>
        <Route path="/compare/best-nclex-question-bank">{() => <SeoLandingBySlug slug="compare/best-nclex-question-bank" />}</Route>
        <Route path="/compare/best-rex-pn-prep">{() => <SeoLandingBySlug slug="compare/best-rex-pn-prep" />}</Route>
        <Route path="/compare/uworld-alternative-nursing">{() => <SeoLandingBySlug slug="compare/uworld-alternative-nursing" />}</Route>
        <Route path="/compare/:slug" component={ComparePage} />
        <Route path="/nclex-rn/mock-exam" component={ExamLandingPage} />
        <Route path="/nclex-rn/conditions/:slug" component={NclexRnConditionTemplate} />
        <Route path="/nclex-rn/medications/:slug" component={NclexRnMedicationTemplate} />
        <Route path="/nclex-rn/lab-values/:slug" component={NclexRnLabValueTemplate} />
        <Route path="/nclex-rn/compare/:slug" component={NclexRnComparisonTemplate} />
        <Route path="/nclex-rn/strategy/:slug" component={NclexRnStrategyTemplate} />
        <Route path="/nclex-rn/practice-questions">{() => <NclexRnCategoryTemplate params={{ slug: "practice-questions" }} />}</Route>
        <Route path="/nclex-rn/ngn">{() => <NclexRnCategoryTemplate params={{ slug: "ngn" }} />}</Route>
        <Route path="/nclex-rn/prioritization-and-delegation">{() => <NclexRnCategoryTemplate params={{ slug: "prioritization-and-delegation" }} />}</Route>
        <Route path="/nclex-rn/pharmacology">{() => <NclexRnCategoryTemplate params={{ slug: "pharmacology" }} />}</Route>
        <Route path="/nclex-rn/adult-health">{() => <NclexRnCategoryTemplate params={{ slug: "adult-health" }} />}</Route>
        <Route path="/nclex-rn/maternal-child">{() => <NclexRnCategoryTemplate params={{ slug: "maternal-child" }} />}</Route>
        <Route path="/nclex-rn/mental-health">{() => <NclexRnCategoryTemplate params={{ slug: "mental-health" }} />}</Route>
        <Route path="/nclex-rn/exam-strategy">{() => <NclexRnCategoryTemplate params={{ slug: "exam-strategy" }} />}</Route>
        <Route path="/nclex-rn/top-conditions">{() => <NclexRnCategoryTemplate params={{ slug: "top-conditions" }} />}</Route>
        <Route path="/nclex-rn/lab-values">{() => <NclexRnCategoryTemplate params={{ slug: "lab-values" }} />}</Route>
        <Route path="/nclex-rn/medications">{() => <NclexRnCategoryTemplate params={{ slug: "medications" }} />}</Route>
        <Route path="/nclex-rn/*" component={SeoHubPage} />
        <Route path="/np-exam-prep/:rest*" component={SeoHubPage} />
        <Route path="/np-exam/conditions/:slug" component={NpExamConditionTemplate} />
        <Route path="/np-exam/medications/:slug" component={NpExamMedicationTemplate} />
        <Route path="/np-exam/lab-values/:slug" component={NpExamLabValueTemplate} />
        <Route path="/np-exam/compare/:slug" component={NpExamComparisonTemplate} />
        <Route path="/np-exam/strategy/:slug" component={NpExamStrategyTemplate} />
        <Route path="/np-exam/case-studies/:slug" component={NpExamCaseStudyTemplate} />
        <Route path="/np-exam/practice-questions">{() => <NpExamCategoryTemplate params={{ slug: "practice-questions" }} />}</Route>
        <Route path="/np-exam/differential-diagnosis">{() => <NpExamCategoryTemplate params={{ slug: "differential-diagnosis" }} />}</Route>
        <Route path="/np-exam/primary-care">{() => <NpExamCategoryTemplate params={{ slug: "primary-care" }} />}</Route>
        <Route path="/np-exam/pharmacology">{() => <NpExamCategoryTemplate params={{ slug: "pharmacology" }} />}</Route>
        <Route path="/np-exam/diagnostics">{() => <NpExamCategoryTemplate params={{ slug: "diagnostics" }} />}</Route>
        <Route path="/np-exam/chronic-disease-management">{() => <NpExamCategoryTemplate params={{ slug: "chronic-disease-management" }} />}</Route>
        <Route path="/np-exam/case-studies">{() => <NpExamCategoryTemplate params={{ slug: "case-studies" }} />}</Route>
        <Route path="/np-exam/exam-strategy">{() => <NpExamCategoryTemplate params={{ slug: "exam-strategy" }} />}</Route>
        <Route path="/np-exam/top-conditions">{() => <NpExamCategoryTemplate params={{ slug: "top-conditions" }} />}</Route>
        <Route path="/np-exam/lab-values">{() => <NpExamCategoryTemplate params={{ slug: "lab-values" }} />}</Route>
        <Route path="/np-exam/medications">{() => <NpExamCategoryTemplate params={{ slug: "medications" }} />}</Route>
        <Route path="/np-exam-prep/*" component={SeoHubPage} />
        <Route path="/np-exam/*" component={SeoHubPage} />
        <Route path="/np-exam-guide/:slug" component={NpExamHub} />
        <Route path="/np-exam-guide" component={NpExamHub} />
        <Route path="/rex-pn/exam-format" component={RexPnExamFormat} />
        <Route path="/rex-pn/test-taking-strategies" component={RexPnStrategies} />
        <Route path="/rex-pn/strategies" component={RexPnStrategies} />
        <Route path="/rex-pn/wellness" component={RexPnWellness} />
        <Route path="/rex-pn/practice-tests" component={MockExamsPage} />
        <Route path="/rex-pn/mock-exam" component={ExamLandingPage} />
        <Route path="/rex-pn/conditions/:slug" component={RexPnConditionTemplate} />
        <Route path="/rex-pn/medications/:slug" component={RexPnMedicationTemplate} />
        <Route path="/rex-pn/lab-values/:slug" component={RexPnLabValueTemplate} />
        <Route path="/rex-pn/compare/:slug" component={RexPnComparisonTemplate} />
        <Route path="/rex-pn/strategy/:slug" component={RexPnStrategyTemplate} />
        <Route path="/rex-pn/practice-questions">{() => <RexPnCategoryTemplate params={{ slug: "practice-questions" }} />}</Route>
        <Route path="/rex-pn/fundamentals">{() => <RexPnCategoryTemplate params={{ slug: "fundamentals" }} />}</Route>
        <Route path="/rex-pn/pharmacology">{() => <RexPnCategoryTemplate params={{ slug: "pharmacology" }} />}</Route>
        <Route path="/rex-pn/safety-and-infection-control">{() => <RexPnCategoryTemplate params={{ slug: "safety-and-infection-control" }} />}</Route>
        <Route path="/rex-pn/clinical-judgment">{() => <RexPnCategoryTemplate params={{ slug: "clinical-judgment" }} />}</Route>
        <Route path="/rex-pn/exam-tips">{() => <RexPnCategoryTemplate params={{ slug: "exam-tips" }} />}</Route>
        <Route path="/rex-pn/study-plan">{() => <RexPnCategoryTemplate params={{ slug: "study-plan" }} />}</Route>
        <Route path="/rex-pn/*" component={SeoHubPage} />
        <Route path="/rex-pn" component={RexPnHub} />
        <Route path="/rex-pn-guide/:slug" component={RexPnGuide} />
        <Route path="/rex-pn-guide" component={RexPnGuide} />
        <Route path="/nclex-rn-guide/:slug" component={NclexRnGuide} />
        <Route path="/nclex-rn-guide" component={NclexRnGuide} />
        <Route path="/study-guide/:slug" component={SeoPage} />
        <Route path="/clinical-case-studies">{() => <RouteErrorBoundary groupName="content"><ClinicalCaseStudyPage /></RouteErrorBoundary>}</Route>
        <Route path="/for-institutions" component={ForInstitutions} />
        <Route path="/healthcare-policy-and-updates/licensing-policy-changes" component={LicensingPolicyChanges} />
        <Route path="/healthcare-policy-and-updates/international-nursing-recruitment" component={InternationalNursingRecruitmentPolicy} />
        <Route path="/healthcare-policy-and-updates/exam-format-updates" component={ExamFormatUpdates} />
        <Route path="/healthcare-policy-and-updates/regulatory-changes-affecting-nurses" component={RegulatoryChanges} />
        <Route path="/healthcare-policy-and-updates" component={HealthcarePolicyHub} />
        {/* International Nursing Hub — specific slugs BEFORE catch-all :country */}
        <Route path="/international-nurses" component={InternationalNursingHub} />
        <Route path="/international-nurses/tools" component={InternationalNursingTools} />
        <Route path="/international-nurses/philippines-to-canada" component={InternationalNursingMigration} />
        <Route path="/international-nurses/india-to-canada" component={InternationalNursingMigration} />
        <Route path="/international-nurses/philippines-to-usa" component={InternationalNursingMigration} />
        <Route path="/international-nurses/india-to-uk" component={InternationalNursingMigration} />
        <Route path="/international-nurses/philippines-to-uk" component={InternationalNursingMigration} />
        <Route path="/international-nurses/india-to-australia" component={InternationalNursingMigration} />
        <Route path="/international-nurses/nigeria-to-canada" component={InternationalNursingMigration} />
        <Route path="/international-nurses/nepal-to-uk" component={InternationalNursingMigration} />
        <Route path="/philippines-to-canada">{() => <Redirect to="/international-nurses/philippines-to-canada" />}</Route>
        <Route path="/india-to-canada">{() => <Redirect to="/international-nurses/india-to-canada" />}</Route>
        <Route path="/philippines-to-usa">{() => <Redirect to="/international-nurses/philippines-to-usa" />}</Route>
        <Route path="/india-to-uk">{() => <Redirect to="/international-nurses/india-to-uk" />}</Route>
        <Route path="/philippines-to-uk">{() => <Redirect to="/international-nurses/philippines-to-uk" />}</Route>
        <Route path="/india-to-australia">{() => <Redirect to="/international-nurses/india-to-australia" />}</Route>
        <Route path="/nigeria-to-canada">{() => <Redirect to="/international-nurses/nigeria-to-canada" />}</Route>
        <Route path="/nepal-to-uk">{() => <Redirect to="/international-nurses/nepal-to-uk" />}</Route>
        <Route path="/nclex-for-international-nurses" component={InternationalNursingExam} />
        <Route path="/rex-pn-for-international-nurses" component={InternationalNursingExam} />
        <Route path="/ielts-for-nurses" component={InternationalNursingExam} />
        <Route path="/oet-for-nurses" component={InternationalNursingExam} />
        <Route path="/nursing-credential-assessment-explained" component={InternationalNursingExam} />
        <Route path="/how-to-transfer-nursing-license" component={InternationalNursingExam} />
        <Route path="/canada-vs-usa-nursing" component={InternationalNursingComparison} />
        <Route path="/canada-vs-uk-nursing" component={InternationalNursingComparison} />
        <Route path="/australia-vs-new-zealand-nursing" component={InternationalNursingComparison} />
        <Route path="/nursing-bridging-programs-explained" component={InternationalNursingContent} />
        <Route path="/international-nurse-salary-comparison" component={InternationalNursingContent} />
        <Route path="/nursing-visa-sponsorship-guide" component={InternationalNursingContent} />
        <Route path="/working-as-a-nurse-in-canada" component={InternationalNursingContent} />
        <Route path="/nnas-application-guide" component={InternationalNursingContent} />
        <Route path="/cgfns-certification-guide" component={InternationalNursingContent} />
        <Route path="/nmc-registration-guide-international-nurses" component={InternationalNursingContent} />
        <Route path="/nursing-recruitment-agencies-guide" component={InternationalNursingContent} />
        <Route path="/cultural-adjustment-international-nurses" component={InternationalNursingContent} />
        <Route path="/international-nurse-interview-tips" component={InternationalNursingContent} />
        <Route path="/international-nurses/compare-canada-vs-united-states" component={InternationalNursingComparison} />
        <Route path="/international-nurses/compare-canada-vs-united-kingdom" component={InternationalNursingComparison} />
        <Route path="/international-nurses/compare-australia-vs-new-zealand" component={InternationalNursingComparison} />
        <Route path="/international-nurses/nursing-english-requirements" component={InternationalNursingCluster} />
        <Route path="/international-nurses/ielts-vs-oet" component={InternationalNursingCluster} />
        <Route path="/international-nurses/bridging-programs" component={InternationalNursingCluster} />
        <Route path="/international-nurses/credential-evaluation" component={InternationalNursingCluster} />
        <Route path="/international-nurses/required-documents" component={InternationalNursingCluster} />
        <Route path="/international-nurses/common-delays" component={InternationalNursingCluster} />
        <Route path="/international-nurses/registration-timelines" component={InternationalNursingCluster} />
        <Route path="/international-nurses/best-countries" component={InternationalNursingCluster} />
        <Route path="/international-nurses/highest-paying-countries" component={InternationalNursingCluster} />
        <Route path="/international-nurses/visa-sponsorship-jobs" component={InternationalNursingCluster} />
        <Route path="/international-nurses/:country" component={InternationalNursingCountry} />

        <Route path="/medical-imaging/study-plan-generator" component={ImagingStudyPlanGenerator} />
        <Route path="/radiography-readiness-quiz" component={RadiographyReadinessQuiz} />
        <Route path="/nclex-readiness-score" component={NclexReadinessScore} />
        <Route path="/study-coach" component={StudyCoachingDashboard} />
        <Route path="/radiography-practice-questions" component={RadiographyPracticeQuestionsLanding} />
        <Route path="/radiography-positioning-guide" component={RadiographyPositioningGuideLanding} />
        <Route path="/radiography-artifact-recognition" component={RadiographyArtifactRecognitionLanding} />
        <Route path="/medical-imaging/blog/:slug" component={ImagingBlog} />
        <Route path="/medical-imaging/blog" component={ImagingBlog} />
        <Route path="/medical-imaging/:country/seo/:slug" component={ImagingSeoPage} />
        <Route path="/medical-imaging/purchase-success" component={ImagingPurchaseSuccessPage} />
        <Route path="/medical-imaging/store" component={ImagingStorePage} />
        <Route path="/medical-imaging/account" component={ImagingAccountPage} />
        <Route path="/medical-imaging/:country/pricing">{() => <Redirect to="/pricing?section=imaging" />}</Route>
        <Route path="/medical-imaging/:country/lessons" component={ImagingLessonsPage} />
        <Route path="/medical-imaging/:country/positioning/:projectionSlug" component={ImagingPositioningDetailPage} />
        <Route path="/medical-imaging/:country/positioning" component={ImagingPositioningPage} />
        <Route path="/medical-imaging/:country/physics/:topicSlug" component={ImagingPhysicsTopicPage} />
        <Route path="/medical-imaging/:country/physics" component={ImagingPhysicsPage} />
        <Route path="/medical-imaging/:country/flashcards" component={ImagingFlashcardsPage} />
        <Route path="/medical-imaging/:country/practice-exams" component={ImagingPracticeExamPage} />
        <Route path="/medical-imaging/:country/exam-simulator" component={ImagingExamSimulatorPage} />
        <Route path="/medical-imaging/canada" component={MedicalImagingCanadaPage} />
        <Route path="/medical-imaging/usa" component={MedicalImagingUSAPage} />
        <Route path="/medical-imaging" component={MedicalImagingHub} />
        <Route path="/order-of-the-draw" component={OrderOfTheDraw} />
        <Route path="/exam-readiness">{() => <RouteErrorBoundary groupName="content"><ExamReadinessPage /></RouteErrorBoundary>}</Route>
        <Route path="/diagnostic-assessment">{() => <ProtectedPremiumRoute category="premium-tool" label="diagnostic assessment" fallbackPath="/dashboard"><DiagnosticAssessmentPage /></ProtectedPremiumRoute>}</Route>
        <Route path="/account/library">{() => <ProtectedRoute contentType="download" safeModeRenderer={() => <SafeDownloadFallback onBack={() => window.location.href = "/en/dashboard"} />}><AccountLibraryPage /></ProtectedRoute>}</Route>
        <Route path="/medication-mastery">{() => <ProtectedPremiumRoute category="premium-tool" label="medication mastery" fallbackPath="/dashboard"><MedicationMasteryPage /></ProtectedPremiumRoute>}</Route>
        <Route path="/clinical-clarity/:slug" component={ClinicalClarityDetail} />
        <Route path="/clinical-clarity" component={ClinicalClarityIndex} />
        <Route path="/blog">{() => <RouteErrorBoundary groupName="content"><BlogPage /></RouteErrorBoundary>}</Route>
        <Route path="/learn/:slug">{() => <RouteErrorBoundary groupName="content"><ContentPage /></RouteErrorBoundary>}</Route>
        <Route path="/anatomy/:systemId" component={AnatomyPage} />
        <Route path="/anatomy" component={AnatomyPage} />
        <Route path="/lessons">{() => <PremiumFeatureErrorBoundary featureName="lessons" fallbackPath="/en/dashboard"><ProtectedRoute contentType="lesson" killSwitchKey="lessons" safeModeRenderer={() => <SafeLessonFallback onBack={() => window.location.href = "/en/dashboard"} />}><Lessons /></ProtectedRoute></PremiumFeatureErrorBoundary>}</Route>
        <Route path="/lectures" component={LecturesPage} />
        <Route path="/lectures/:slug" component={LectureViewer} />
        <Route path="/lessons/:id">{() => <PremiumFeatureErrorBoundary featureName="lessons" fallbackPath="/en/lessons"><ProtectedRoute contentType="lesson" killSwitchKey="lessons" safeModeRenderer={() => <SafeLessonFallback onBack={() => window.location.href = "/en/lessons"} />}><LessonDetail /></ProtectedRoute></PremiumFeatureErrorBoundary>}</Route>
        <Route path="/flashcards/deck/:slug">{() => <PremiumFeatureErrorBoundary featureName="flashcards" fallbackPath="/en/flashcards"><ProtectedRoute contentType="flashcard" killSwitchKey="flashcards" safeModeRenderer={() => <SafeFlashcardFallback onBack={() => window.location.href = "/en/flashcards"} />}><DeckPage /></ProtectedRoute></PremiumFeatureErrorBoundary>}</Route>
        <Route path="/flashcards">{() => <PremiumFeatureErrorBoundary featureName="flashcards" fallbackPath="/en/dashboard"><ProtectedRoute contentType="flashcard" killSwitchKey="flashcards" safeModeRenderer={() => <SafeFlashcardFallback onBack={() => window.location.href = "/en/dashboard"} />}><PublicFlashcards /></ProtectedRoute></PremiumFeatureErrorBoundary>}</Route>

        {/* Specialty Preview Pages (public) */}
        <Route path="/preview/:specialty" component={SpecialtyPreviewPage} />

        {/* Tier-specific Test Bank routes (auth-guarded) */}
        <Route path="/rpn/test-bank">{() => <PremiumFeatureErrorBoundary featureName="question bank" fallbackPath="/en/dashboard"><ProtectedTestBankRoute><TestBank /></ProtectedTestBankRoute></PremiumFeatureErrorBoundary>}</Route>
        <Route path="/rn/test-bank">{() => <PremiumFeatureErrorBoundary featureName="question bank" fallbackPath="/en/dashboard"><ProtectedTestBankRoute><TestBank /></ProtectedTestBankRoute></PremiumFeatureErrorBoundary>}</Route>
        <Route path="/np/test-bank">{() => <PremiumFeatureErrorBoundary featureName="question bank" fallbackPath="/en/dashboard"><ProtectedTestBankRoute><TestBank /></ProtectedTestBankRoute></PremiumFeatureErrorBoundary>}</Route>
        {/* Legacy tier flashcard routes → redirect to test-bank */}
        <Route path="/rpn/flashcards">{() => <Redirect to="/rpn/test-bank" />}</Route>
        <Route path="/rn/flashcards">{() => <Redirect to="/rn/test-bank" />}</Route>
        <Route path="/np/flashcards">{() => <Redirect to="/np/test-bank" />}</Route>
        <Route path="/upgrade">{() => <ProtectedRoute contentType="general"><UpgradePage /></ProtectedRoute>}</Route>
        <Route path="/upgrade/success">{() => <ProtectedRoute contentType="general"><UpgradePage /></ProtectedRoute>}</Route>
        <Route path="/reports" component={Reports} />
        <Route path="/login">{() => <ProtectedRoute contentType="general"><LoginPage /></ProtectedRoute>}</Route>
        <Route path="/reset-password" component={ResetPasswordPage} />
        <Route path="/profile">{() => <PlatformErrorBoundary fallbackPath="/en/dashboard"><ProfilePage /></PlatformErrorBoundary>}</Route>
        <Route path="/subscription/success">{() => <PlatformErrorBoundary fallbackPath="/en/dashboard"><SubscriptionSuccess /></PlatformErrorBoundary>}</Route>
        <Route path="/pricing/allied">{() => <Redirect to="/pricing?section=allied" />}</Route>
        <Route path="/pricing/rpn">{() => <Redirect to="/pricing?section=nursing" />}</Route>
        <Route path="/pricing/rn">{() => <Redirect to="/pricing?section=nursing" />}</Route>
        <Route path="/pricing/np">{() => <Redirect to="/pricing?section=nursing" />}</Route>
        <Route path="/pricing/newgrad">{() => <Redirect to="/pricing?section=newgrad" />}</Route>
        <Route path="/pricing/imaging">{() => <Redirect to="/pricing?section=imaging" />}</Route>
        <Route path="/pricing/:tier">{() => <Redirect to="/pricing?section=nursing" />}</Route>
        <Route path="/pricing">{() => <RouteErrorBoundary groupName="content"><ProtectedRoute contentType="general"><PricingPage /></ProtectedRoute></RouteErrorBoundary>}</Route>
        <Route path="/refer" component={ReferPage} />
        <Route path="/signup">{() => <Redirect to={`/login${window.location.search}`} />}</Route>
        <Route path="/register">{() => <Redirect to={`/login${window.location.search}`} />}</Route>
        <Route path="/trial/session/:id" component={TrialSession} />
        <Route path="/trial/results/:id" component={TrialResults} />
        <Route path="/trial/upgrade">{() => <ProtectedRoute contentType="general"><TrialUpgrade /></ProtectedRoute>}</Route>
        <Route path="/trial" component={TrialLanding} />
        <Route path="/faq" component={FAQPage} />
        <Route path="/terms" component={TermsPage} />
        <Route path="/privacy" component={PrivacyPage} />
        <Route path="/disclaimer" component={DisclaimerPage} />
        <Route path="/refund-policy" component={RefundPolicyPage} />
        <Route path="/email-preferences" component={EmailPreferencesPage} />
        <Route path="/question-of-the-day" component={QuestionOfTheDay} />
        <Route path="/daily-question" component={DailyQuestionPage} />
        <Route path="/test-bank">{() => <PremiumFeatureErrorBoundary featureName="question bank" fallbackPath="/en/dashboard"><ProtectedTestBankRoute><QuestionBank /></ProtectedTestBankRoute></PremiumFeatureErrorBoundary>}</Route>
        <Route path="/question-bank">{() => <Redirect to="/test-bank" />}</Route>
        <Route path="/contact" component={ContactPage} />
        <Route path="/about" component={AboutPage} />
        <Route path="/why-nursenest" component={WhyNurseNestPage} />
        <Route path="/medical-review-team" component={MedicalReviewTeamPage} />
        <Route path="/feedback" component={FeedbackPage} />
        <Route path="/bookmarks">{() => <ProtectedPremiumRoute category="premium-tool" label="bookmarks" fallbackPath="/dashboard"><BookmarksPage /></ProtectedPremiumRoute>}</Route>
        <Route path="/practice">{() => <ProtectedPremiumRoute category="premium-tool" label="custom practice" fallbackPath="/dashboard"><CustomPracticePage /></ProtectedPremiumRoute>}</Route>
        <Route path="/performance-analytics">{() => <ProtectedPremiumRoute category="analytics" label="performance analytics" fallbackPath="/dashboard"><PerformanceAnalyticsPage /></ProtectedPremiumRoute>}</Route>
        <Route path="/free-practice" component={FreePracticePage} />
        <Route path="/free-demo-exam" component={FreeDemoExamPage} />
        <Route path="/quick-study" component={QuickStudyPage} />
        <Route path="/practice-questions/:tier/:system" component={PracticeQuestionsPage} />
        <Route path="/practice-questions" component={PracticeQuestionsPage} />
        <Route path="/subscribe/:tier">{() => <PlatformErrorBoundary fallbackPath="/en/pricing"><SubscribePage /></PlatformErrorBoundary>}</Route>
        <Route path="/onboarding/plan" component={OnboardingPlanPage} />
        <Route path="/study-plan">{() => <ProtectedPremiumRoute category="premium-tool" label="study plan" fallbackPath="/dashboard"><StudyPlanPage /></ProtectedPremiumRoute>}</Route>
        <Route path="/pharmacology/curriculum" component={PharmacologyHub} />
        <Route path="/pharmacology/pricing">{() => <Redirect to="/pricing?section=nursing" />}</Route>
        <Route path="/pharmacology/faq" component={PharmacologyHub} />
        <Route path="/pharmacology" component={PharmacologyHub} />
        <Route path="/nclex/cardiac-questions" component={ExamBlueprintPage} />
        <Route path="/nclex/pharmacology-practice" component={ExamBlueprintPage} />
        <Route path="/nclex/respiratory-questions" component={ExamBlueprintPage} />
        <Route path="/nclex/mental-health-questions" component={ExamBlueprintPage} />
        <Route path="/rex-pn/pharmacology-practice" component={ExamBlueprintPage} />
        <Route path="/rex-pn/clinical-practice-questions" component={ExamBlueprintPage} />
        <Route path="/rex-pn/professional-practice-questions" component={ExamBlueprintPage} />
        <Route path="/np-exam/primary-care-questions" component={ExamBlueprintPage} />
        <Route path="/np-exam/pharmacology-advanced" component={ExamBlueprintPage} />
        <Route path="/np-exam/differential-diagnosis" component={ExamBlueprintPage} />
        <Route path="/nclex-rn/mock-exam" component={ExamLandingPage} />
        <Route path="/nclex-pn/mock-exam" component={ExamLandingPage} />
        <Route path="/rex-pn/mock-exam" component={ExamLandingPage} />
        <Route path="/canada-np/mock-exam" component={ExamLandingPage} />
        <Route path="/us-np/mock-exam" component={ExamLandingPage} />
        <Route path="/nclex-rn" component={ExamHubPage} />
        <Route path="/nclex-pn" component={ExamHubPage} />
        <Route path="/canada-np" component={ExamHubPage} />
        <Route path="/us-np" component={ExamHubPage} />
        <Route path="/rexpn-exam-blueprint" component={ExamBlueprintHub} />
        <Route path="/nclex-rn-exam-blueprint" component={ExamBlueprintHub} />
        <Route path="/nclex-pn-exam-blueprint" component={ExamBlueprintHub} />
        <Route path="/allied-health-exam-blueprint" component={ExamBlueprintHub} />
        <Route path="/rexpn-foundations-of-practice" component={ExamBlueprintCategory} />
        <Route path="/rexpn-collaborative-practice" component={ExamBlueprintCategory} />
        <Route path="/rexpn-professional-practice" component={ExamBlueprintCategory} />
        <Route path="/rexpn-ethical-practice" component={ExamBlueprintCategory} />
        <Route path="/rexpn-legal-practice" component={ExamBlueprintCategory} />
        <Route path="/rexpn-safety-and-infection-control" component={ExamBlueprintCategory} />
        <Route path="/rexpn-health-promotion" component={ExamBlueprintCategory} />
        <Route path="/rexpn-pharmacological-therapies" component={ExamBlueprintCategory} />
        <Route path="/nclex-management-of-care" component={ExamBlueprintCategory} />
        <Route path="/nclex-safety-and-infection-control" component={ExamBlueprintCategory} />
        <Route path="/nclex-health-promotion" component={ExamBlueprintCategory} />
        <Route path="/nclex-psychosocial-integrity" component={ExamBlueprintCategory} />
        <Route path="/nclex-basic-care-and-comfort" component={ExamBlueprintCategory} />
        <Route path="/nclex-pharmacology" component={ExamBlueprintCategory} />
        <Route path="/nclex-reduction-of-risk" component={ExamBlueprintCategory} />
        <Route path="/nclex-physiological-adaptation" component={ExamBlueprintCategory} />
        <Route path="/nclex-pn-coordinated-care" component={ExamBlueprintCategory} />
        <Route path="/nclex-pn-safety-infection-control" component={ExamBlueprintCategory} />
        <Route path="/nclex-pn-health-promotion" component={ExamBlueprintCategory} />
        <Route path="/nclex-pn-psychosocial-integrity" component={ExamBlueprintCategory} />
        <Route path="/nclex-pn-basic-care" component={ExamBlueprintCategory} />
        <Route path="/nclex-pn-pharmacology" component={ExamBlueprintCategory} />
        <Route path="/nclex-pn-reduction-of-risk" component={ExamBlueprintCategory} />
        <Route path="/nclex-pn-physiological-adaptation" component={ExamBlueprintCategory} />
        <Route path="/allied-respiratory-therapy" component={ExamBlueprintCategory} />
        <Route path="/allied-medical-lab-tech" component={ExamBlueprintCategory} />
        <Route path="/allied-radiography" component={ExamBlueprintCategory} />
        <Route path="/allied-paramedic" component={ExamBlueprintCategory} />
        <Route path="/allied-occupational-therapy" component={ExamBlueprintCategory} />
        <Route path="/allied-social-work" component={ExamBlueprintCategory} />
        <Route path="/allied-pharmacy-tech" component={ExamBlueprintCategory} />
        <Route path="/allied-psychotherapy-addictions" component={ExamBlueprintCategory} />
        <Route path="/topics" component={TopicsIndex} />
        <Route path="/topics/:slug" component={TopicDetail} />
        <Route path="/nclex/:system/:slug" component={ClinicalConditionPage} />
        <Route path="/symptoms/:slug" component={ClinicalSymptomPage} />
        <Route path="/meds/:slug" component={ClinicalMedicationPage} />
        <Route path="/labs/:slug" component={ClinicalLabValuePage} />
        <Route path="/clinical-compare/:slug" component={ClinicalSeoComparisonPage} />
        <Route path="/conditions/:slug" component={ConditionPage} />
        <Route path="/medications/:slug" component={MedicationPage} />
        <Route path="/herbal-supplements/:slug" component={HerbalSupplementPage} />
        <Route path="/herbal-supplements" component={HerbalSupplementsHub} />
        <Route path="/lab-values/:slug" component={LabValuePage} />
        <Route path="/clinical-comparisons/:slug" component={ClinicalComparisonPage} />
        <Route path="/symptoms/:slug" component={SymptomAssessmentPage} />
        <Route path="/nclex-rn-practice-questions" component={NclexRnPracticePage} />
        <Route path="/nclex-pn-practice-questions" component={NclexPnPracticePage} />
        <Route path="/rex-pn-practice-questions" component={RexPnPracticePage} />
        <Route path="/np-exam-practice-questions" component={NpExamPracticePage} />
        <Route path="/nursing-exam-prep" component={NursingExamPrepPage} />
        <Route path="/quiz/:slug" component={SeoPracticeQuiz} />
        <Route path="/offline-study">{() => <ProtectedPremiumRoute category="download" label="offline study" fallbackPath="/dashboard"><OfflineStudyPage /></ProtectedPremiumRoute>}</Route>
        <Route path="/glossary/:term" component={GlossaryPage} />
        <Route path="/glossary" component={GlossaryPage} />
        <Route path="/medical-abbreviations-for-nurses/:slug" component={MedicalAbbreviationDetail} />
        <Route path="/medical-abbreviations-for-nurses" component={MedicalAbbreviationsHub} />
        <Route path="/nursing-skill-checklists/:slug" component={NursingSkillChecklistDetail} />
        <Route path="/nursing-skill-checklists" component={NursingSkillChecklistsHub} />

        <Route path="/encyclopedia/:profession/:slug" component={EncyclopediaEntry} />
        <Route path="/encyclopedia" component={EncyclopediaLanding} />
        <Route path="/nursing-encyclopedia">{() => <EncyclopediaHub />}</Route>
        <Route path="/critical-care-encyclopedia">{() => <EncyclopediaHub />}</Route>
        <Route path="/emergency-nursing-encyclopedia">{() => <EncyclopediaHub />}</Route>

        <Route path="/nclex-pharmacology-hub">{() => <Suspense fallback={<div />}><SeoPage /></Suspense>}</Route>
        <Route path="/cardiac-nursing-hub">{() => <Suspense fallback={<div />}><SeoPage /></Suspense>}</Route>

        {/* Phase 3: Advanced Clinical & Specialist Certifications */}
        <Route path="/critical-care/question-bank">{() => <Redirect to="/critical-care/test-bank" />}</Route>
        <Route path="/critical-care/test-bank">{() => <PremiumFeatureErrorBoundary featureName="question bank" fallbackPath="/en/critical-care"><ProtectedTestBankRoute><TestBank /></ProtectedTestBankRoute></PremiumFeatureErrorBoundary>}</Route>
        <Route path="/critical-care/flashcards/deck/:slug">{() => <ProtectedRoute contentType="flashcard" killSwitchKey="flashcards" safeModeRenderer={() => <SafeFlashcardFallback onBack={() => window.location.href = "/en/critical-care"} />}><DeckPage /></ProtectedRoute>}</Route>
        <Route path="/critical-care/flashcards">{() => <Redirect to="/critical-care/test-bank" />}</Route>
        <Route path="/critical-care/mock-exams/:id/report">{() => <PremiumFeatureErrorBoundary featureName="exams" fallbackPath="/en/critical-care/mock-exams"><ProtectedRoute contentType="exam" killSwitchKey="mockExams"><MockExamReport /></ProtectedRoute></PremiumFeatureErrorBoundary>}</Route>
        <Route path="/critical-care/mock-exams/:id">{() => <PremiumFeatureErrorBoundary featureName="exams" fallbackPath="/en/critical-care/mock-exams"><ProtectedRoute contentType="exam" killSwitchKey="mockExams" safeModeRenderer={() => <SafeExamFallback onBack={() => window.location.href = "/en/critical-care/mock-exams"} />}><ExamErrorBoundary examContext={{ examType: "critical-care" }}><MockExamSession /></ExamErrorBoundary></ProtectedRoute></PremiumFeatureErrorBoundary>}</Route>
        <Route path="/critical-care/mock-exams">{() => <PremiumFeatureErrorBoundary featureName="exams" fallbackPath="/en/critical-care"><ProtectedRoute contentType="exam" killSwitchKey="mockExams"><MockExamsPage /></ProtectedRoute></PremiumFeatureErrorBoundary>}</Route>
        <Route path="/critical-care/study-plan" component={StudyPlanPage} />
        <Route path="/critical-care/pricing">{() => <Redirect to="/pricing?section=nursing" />}</Route>
        <Route path="/critical-care/dashboard">{() => <ProtectedPremiumRoute category="analytics" label="dashboard" fallbackPath="/critical-care"><DashboardPage /></ProtectedPremiumRoute>}</Route>
        <Route path="/critical-care" component={AlliedHomePage} />

        <Route path="/emergency-nursing/question-bank">{() => <Redirect to="/emergency-nursing/test-bank" />}</Route>
        <Route path="/emergency-nursing/test-bank">{() => <PremiumFeatureErrorBoundary featureName="question bank" fallbackPath="/en/emergency-nursing"><ProtectedTestBankRoute><TestBank /></ProtectedTestBankRoute></PremiumFeatureErrorBoundary>}</Route>
        <Route path="/emergency-nursing/flashcards/deck/:slug">{() => <ProtectedRoute contentType="flashcard" killSwitchKey="flashcards" safeModeRenderer={() => <SafeFlashcardFallback onBack={() => window.location.href = "/en/emergency-nursing"} />}><DeckPage /></ProtectedRoute>}</Route>
        <Route path="/emergency-nursing/flashcards">{() => <Redirect to="/emergency-nursing/test-bank" />}</Route>
        <Route path="/emergency-nursing/mock-exams/:id/report">{() => <PremiumFeatureErrorBoundary featureName="exams" fallbackPath="/en/emergency-nursing/mock-exams"><ProtectedRoute contentType="exam" killSwitchKey="mockExams"><MockExamReport /></ProtectedRoute></PremiumFeatureErrorBoundary>}</Route>
        <Route path="/emergency-nursing/mock-exams/:id">{() => <PremiumFeatureErrorBoundary featureName="exams" fallbackPath="/en/emergency-nursing/mock-exams"><ProtectedRoute contentType="exam" killSwitchKey="mockExams" safeModeRenderer={() => <SafeExamFallback onBack={() => window.location.href = "/en/emergency-nursing/mock-exams"} />}><ExamErrorBoundary examContext={{ examType: "emergency-nursing" }}><MockExamSession /></ExamErrorBoundary></ProtectedRoute></PremiumFeatureErrorBoundary>}</Route>
        <Route path="/emergency-nursing/mock-exams">{() => <PremiumFeatureErrorBoundary featureName="exams" fallbackPath="/en/emergency-nursing"><ProtectedRoute contentType="exam" killSwitchKey="mockExams"><MockExamsPage /></ProtectedRoute></PremiumFeatureErrorBoundary>}</Route>
        <Route path="/emergency-nursing/study-plan" component={StudyPlanPage} />
        <Route path="/emergency-nursing/pricing">{() => <Redirect to="/pricing?section=nursing" />}</Route>
        <Route path="/emergency-nursing/dashboard">{() => <ProtectedPremiumRoute category="analytics" label="dashboard" fallbackPath="/emergency-nursing"><DashboardPage /></ProtectedPremiumRoute>}</Route>
        <Route path="/emergency-nursing" component={AlliedHomePage} />

        <Route path="/perioperative-nursing" component={PerioperativeNursingHub} />
        <Route path="/preoperative-care" component={PreoperativeCareHub} />
        <Route path="/preoperative-nursing-guide" component={PreoperativeNursingGuide} />
        <Route path="/perioperative-nurse-career" component={PerioperativeNurseCareer} />

        <Route path="/perioperative/lessons/:slug" component={PerioperativeLessonsPage} />
        <Route path="/perioperative/lessons" component={PerioperativeLessonsPage} />
        <Route path="/perioperative/question-bank">{() => <Redirect to="/perioperative/test-bank" />}</Route>
        <Route path="/perioperative/test-bank">{() => <PremiumFeatureErrorBoundary featureName="question bank" fallbackPath="/en/perioperative"><ProtectedTestBankRoute><TestBank /></ProtectedTestBankRoute></PremiumFeatureErrorBoundary>}</Route>
        <Route path="/perioperative/flashcards/deck/:slug">{() => <ProtectedRoute contentType="flashcard" killSwitchKey="flashcards" safeModeRenderer={() => <SafeFlashcardFallback onBack={() => window.location.href = "/en/perioperative"} />}><DeckPage /></ProtectedRoute>}</Route>
        <Route path="/perioperative/flashcards">{() => <Redirect to="/perioperative/test-bank" />}</Route>
        <Route path="/perioperative/mock-exams/:id/report">{() => <PremiumFeatureErrorBoundary featureName="exams" fallbackPath="/en/perioperative/mock-exams"><ProtectedRoute contentType="exam" killSwitchKey="mockExams"><MockExamReport /></ProtectedRoute></PremiumFeatureErrorBoundary>}</Route>
        <Route path="/perioperative/mock-exams/:id">{() => <PremiumFeatureErrorBoundary featureName="exams" fallbackPath="/en/perioperative/mock-exams"><ProtectedRoute contentType="exam" killSwitchKey="mockExams" safeModeRenderer={() => <SafeExamFallback onBack={() => window.location.href = "/en/perioperative/mock-exams"} />}><ExamErrorBoundary examContext={{ examType: "perioperative" }}><MockExamSession /></ExamErrorBoundary></ProtectedRoute></PremiumFeatureErrorBoundary>}</Route>
        <Route path="/perioperative/mock-exams">{() => <PremiumFeatureErrorBoundary featureName="exams" fallbackPath="/en/perioperative"><ProtectedRoute contentType="exam" killSwitchKey="mockExams"><MockExamsPage /></ProtectedRoute></PremiumFeatureErrorBoundary>}</Route>
        <Route path="/perioperative/study-plan" component={StudyPlanPage} />
        <Route path="/perioperative/pricing">{() => <Redirect to="/pricing?section=nursing" />}</Route>
        <Route path="/perioperative/dashboard">{() => <ProtectedPremiumRoute category="analytics" label="dashboard" fallbackPath="/perioperative"><DashboardPage /></ProtectedPremiumRoute>}</Route>
        <Route path="/perioperative" component={AlliedHomePage} />

        <Route path="/oncology-nursing/question-bank">{() => <Redirect to="/oncology-nursing/test-bank" />}</Route>
        <Route path="/oncology-nursing/test-bank">{() => <PremiumFeatureErrorBoundary featureName="question bank" fallbackPath="/en/oncology-nursing"><ProtectedTestBankRoute><TestBank /></ProtectedTestBankRoute></PremiumFeatureErrorBoundary>}</Route>
        <Route path="/oncology-nursing/flashcards/deck/:slug">{() => <ProtectedRoute contentType="flashcard" killSwitchKey="flashcards" safeModeRenderer={() => <SafeFlashcardFallback onBack={() => window.location.href = "/en/oncology-nursing"} />}><DeckPage /></ProtectedRoute>}</Route>
        <Route path="/oncology-nursing/flashcards">{() => <Redirect to="/oncology-nursing/test-bank" />}</Route>
        <Route path="/oncology-nursing/mock-exams/:id/report">{() => <PremiumFeatureErrorBoundary featureName="exams" fallbackPath="/en/oncology-nursing/mock-exams"><ProtectedRoute contentType="exam" killSwitchKey="mockExams"><MockExamReport /></ProtectedRoute></PremiumFeatureErrorBoundary>}</Route>
        <Route path="/oncology-nursing/mock-exams/:id">{() => <PremiumFeatureErrorBoundary featureName="exams" fallbackPath="/en/oncology-nursing/mock-exams"><ProtectedRoute contentType="exam" killSwitchKey="mockExams" safeModeRenderer={() => <SafeExamFallback onBack={() => window.location.href = "/en/oncology-nursing/mock-exams"} />}><ExamErrorBoundary examContext={{ examType: "oncology-nursing" }}><MockExamSession /></ExamErrorBoundary></ProtectedRoute></PremiumFeatureErrorBoundary>}</Route>
        <Route path="/oncology-nursing/mock-exams">{() => <ProtectedRoute contentType="exam" killSwitchKey="mockExams"><MockExamsPage /></ProtectedRoute>}</Route>
        <Route path="/oncology-nursing/study-plan" component={StudyPlanPage} />
        <Route path="/oncology-nursing/pricing">{() => <Redirect to="/pricing?section=nursing" />}</Route>
        <Route path="/oncology-nursing/dashboard">{() => <ProtectedPremiumRoute category="analytics" label="dashboard" fallbackPath="/oncology-nursing"><DashboardPage /></ProtectedPremiumRoute>}</Route>
        <Route path="/oncology-nursing" component={AlliedHomePage} />

        <Route path="/pediatric-cert/question-bank">{() => <Redirect to="/pediatric-cert/test-bank" />}</Route>
        <Route path="/pediatric-cert/test-bank">{() => <ProtectedTestBankRoute><TestBank /></ProtectedTestBankRoute>}</Route>
        <Route path="/pediatric-cert/flashcards/deck/:slug">{() => <ProtectedRoute contentType="flashcard" killSwitchKey="flashcards" safeModeRenderer={() => <SafeFlashcardFallback onBack={() => window.location.href = "/en/pediatric-cert"} />}><DeckPage /></ProtectedRoute>}</Route>
        <Route path="/pediatric-cert/flashcards">{() => <Redirect to="/pediatric-cert/test-bank" />}</Route>
        <Route path="/pediatric-cert/mock-exams/:id/report">{() => <ProtectedRoute contentType="exam" killSwitchKey="mockExams"><MockExamReport /></ProtectedRoute>}</Route>
        <Route path="/pediatric-cert/mock-exams/:id">{() => <ProtectedRoute contentType="exam" killSwitchKey="mockExams" safeModeRenderer={() => <SafeExamFallback onBack={() => window.location.href = "/en/pediatric-cert/mock-exams"} />}><ExamErrorBoundary examContext={{ examType: "pediatric-cert" }}><MockExamSession /></ExamErrorBoundary></ProtectedRoute>}</Route>
        <Route path="/pediatric-cert/mock-exams">{() => <ProtectedRoute contentType="exam" killSwitchKey="mockExams"><MockExamsPage /></ProtectedRoute>}</Route>
        <Route path="/pediatric-cert/study-plan" component={StudyPlanPage} />
        <Route path="/pediatric-cert/pricing">{() => <Redirect to="/pricing?section=nursing" />}</Route>
        <Route path="/pediatric-cert/dashboard">{() => <ProtectedPremiumRoute category="analytics" label="dashboard" fallbackPath="/pediatric-cert"><DashboardPage /></ProtectedPremiumRoute>}</Route>
        <Route path="/pediatric-cert" component={AlliedHomePage} />

        <Route path="/profession/:slug" component={ProfessionHubPage} />

        {/* Career AI Tools - Critical Care */}
        <Route path="/critical-care/hemodynamic-sim">{() => <CareerAISimulator toolId="hemodynamic-sim" />}</Route>
        <Route path="/critical-care/icu-case-sim">{() => <CareerAISimulator toolId="icu-case-sim" />}</Route>
        {/* Career AI Tools - Emergency Nursing */}
        <Route path="/emergency-nursing/triage-sim">{() => <CareerAISimulator toolId="triage-sim" />}</Route>
        <Route path="/emergency-nursing/trauma-nursing-sim">{() => <CareerAISimulator toolId="trauma-nursing-sim" />}</Route>
        {/* Career AI Tools - Perioperative */}
        <Route path="/perioperative/sterile-field-sim">{() => <CareerAISimulator toolId="sterile-field-sim" />}</Route>
        <Route path="/perioperative/surgical-count-drill">{() => <CareerAISimulator toolId="surgical-count-drill" />}</Route>
        {/* Career AI Tools - Oncology */}
        <Route path="/oncology-nursing/chemo-safety-sim">{() => <CareerAISimulator toolId="chemo-safety-sim" />}</Route>
        <Route path="/oncology-nursing/staging-drill">{() => <CareerAISimulator toolId="staging-drill" />}</Route>
        {/* Career AI Tools - Pediatric */}
        <Route path="/pediatric-cert/peds-assessment-sim">{() => <CareerAISimulator toolId="peds-assessment-sim" />}</Route>
        <Route path="/pediatric-cert/growth-dev-drill">{() => <CareerAISimulator toolId="growth-dev-drill" />}</Route>
        {/* Career Guides — Healthcare Ultimate Guides + Authority Guides */}
        <Route path="/guides/:parentSlug/:clusterSlug" component={ClusterGuidePage} />
        <Route path="/guides/:slug" component={UnifiedGuidePage} />
        <Route path="/guides" component={HealthcareGuidesIndex} />

        {/* Topic Cluster Pages — Clinical Nursing Topics */}
        <Route path="/sepsis-nursing-interventions">{() => <TopicClusterBySlug slug="sepsis-nursing-interventions" />}</Route>
        <Route path="/ventilator-management-nursing">{() => <TopicClusterBySlug slug="ventilator-management-nursing" />}</Route>
        <Route path="/diabetes-nursing-management">{() => <TopicClusterBySlug slug="diabetes-nursing-management" />}</Route>
        <Route path="/fluid-electrolyte-imbalance-nursing">{() => <TopicClusterBySlug slug="fluid-electrolyte-imbalance-nursing" />}</Route>
        <Route path="/hemodynamic-monitoring-nursing">{() => <TopicClusterBySlug slug="hemodynamic-monitoring-nursing" />}</Route>
        <Route path="/wound-care-nursing">{() => <TopicClusterBySlug slug="wound-care-nursing" />}</Route>
        <Route path="/medication-administration-safety-nursing">{() => <TopicClusterBySlug slug="medication-administration-safety-nursing" />}</Route>
        <Route path="/pain-management-nursing">{() => <TopicClusterBySlug slug="pain-management-nursing" />}</Route>
        <Route path="/cardiac-rhythm-interpretation-nursing">{() => <TopicClusterBySlug slug="cardiac-rhythm-interpretation-nursing" />}</Route>
        <Route path="/infection-control-nursing">{() => <TopicClusterBySlug slug="infection-control-nursing" />}</Route>
        <Route path="/maternal-newborn-nursing">{() => <TopicClusterBySlug slug="maternal-newborn-nursing" />}</Route>
        <Route path="/pediatric-assessment-nursing">{() => <TopicClusterBySlug slug="pediatric-assessment-nursing" />}</Route>
        <Route path="/mental-health-crisis-nursing">{() => <TopicClusterBySlug slug="mental-health-crisis-nursing" />}</Route>
        <Route path="/perioperative-care-nursing">{() => <TopicClusterBySlug slug="perioperative-care-nursing" />}</Route>
        <Route path="/pharmacology-basics-nursing">{() => <TopicClusterBySlug slug="pharmacology-basics-nursing" />}</Route>
        <Route path="/nclex-clinical-judgment-nursing">{() => <TopicClusterBySlug slug="nclex-clinical-judgment-nursing" />}</Route>
        <Route path="/hyperkalemia-effects-on-heart">{() => <TopicClusterBySlug slug="hyperkalemia-effects-on-heart" />}</Route>
        <Route path="/hyperkalemia-vs-hypokalemia-cardiac">{() => <TopicClusterBySlug slug="hyperkalemia-vs-hypokalemia-cardiac" />}</Route>
        <Route path="/barrel-chest-copd">{() => <TopicClusterBySlug slug="barrel-chest-copd" />}</Route>
        <Route path="/question-bank-nursing">{() => <TopicClusterBySlug slug="question-bank-nursing" />}</Route>
        <Route path="/medication-mastery-nursing">{() => <TopicClusterBySlug slug="medication-mastery-nursing" />}</Route>
        <Route path="/nursing-simulation-practice">{() => <TopicClusterBySlug slug="nursing-simulation-practice" />}</Route>
        <Route path="/test-nclex-avec-corrige">{() => <TopicClusterBySlug slug="test-nclex-avec-corrige" />}</Route>

        {/* Category Hub Pages */}
        <Route path="/cardiology-nursing" component={CardiologyHub} />
        <Route path="/respiratory-nursing" component={RespiratoryHub} />
        <Route path="/endocrine-nursing" component={EndocrineHub} />
        <Route path="/neurology-nursing" component={NeurologyNursingHub} />
        <Route path="/electrolytes-nursing" component={ElectrolytesHub} />
        <Route path="/pharmacology-nursing" component={PharmacologyNursingHub} />

        {/* Nursing Physiology Hub & Child Pages */}
        <Route path="/nursing-physiology-explained" component={NursingPhysiologyHubPage} />
        <Route path="/why-burns-cause-hyperkalemia">{() => <TopicClusterBySlug slug="why-burns-cause-hyperkalemia" />}</Route>
        <Route path="/potassium-effects-on-cardiac-conduction">{() => <TopicClusterBySlug slug="potassium-effects-on-cardiac-conduction" />}</Route>
        <Route path="/metabolic-acidosis-in-aki">{() => <TopicClusterBySlug slug="metabolic-acidosis-in-aki" />}</Route>
        <Route path="/pyloric-stenosis-metabolic-alkalosis">{() => <TopicClusterBySlug slug="pyloric-stenosis-metabolic-alkalosis" />}</Route>
        <Route path="/qrs-complex-explained-for-nurses">{() => <TopicClusterBySlug slug="qrs-complex-explained-for-nurses" />}</Route>

        {/* Clinical Nursing Skills Hub & Child Pages */}
        <Route path="/clinical-nursing-skills" component={ClinicalNursingSkillsHubPage} />
        <Route path="/sterile-technique-nursing">{() => <TopicClusterBySlug slug="sterile-technique-nursing" />}</Route>
        <Route path="/wound-irrigation-procedure">{() => <TopicClusterBySlug slug="wound-irrigation-procedure" />}</Route>
        <Route path="/fluid-status-assessment">{() => <TopicClusterBySlug slug="fluid-status-assessment" />}</Route>
        <Route path="/pain-assessment-scales">{() => <TopicClusterBySlug slug="pain-assessment-scales" />}</Route>
        <Route path="/newborn-assessment-guide">{() => <TopicClusterBySlug slug="newborn-assessment-guide" />}</Route>
        <Route path="/neurological-assessment-nursing">{() => <TopicClusterBySlug slug="neurological-assessment-nursing" />}</Route>
        <Route path="/respiratory-assessment-nursing">{() => <TopicClusterBySlug slug="respiratory-assessment-nursing" />}</Route>
        <Route path="/critical-care-nursing-essentials">{() => <TopicClusterBySlug slug="critical-care-nursing-essentials" />}</Route>
        <Route path="/acid-base-balance-nursing">{() => <TopicClusterBySlug slug="acid-base-balance-nursing" />}</Route>

        {/* Clinical Calculators Hub & Child Pages */}
        <Route path="/clinical-calculators/:slug" component={ClinicalCalculatorsPage} />
        <Route path="/clinical-calculators" component={ClinicalCalculatorsPage} />

        {/* Nursing Study Guides Hub & Child Pages */}
        <Route path="/nursing-study-guides/:slug" component={NursingStudyGuidesPage} />
        <Route path="/nursing-study-guides" component={NursingStudyGuidesPage} />

        {/* Nursing Clinical Scenarios Hub & Child Pages */}
        <Route path="/nursing-clinical-scenarios/:slug" component={NursingClinicalScenariosHubPage} />

        {/* Exam Prep Cornerstone Pages */}
        <Route path="/nclex-question-bank">{() => <ExamPrepCornerstonePage slug="nclex-question-bank" />}</Route>
        <Route path="/rex-pn-exam-prep">{() => <ExamPrepCornerstonePage slug="rex-pn-exam-prep" />}</Route>
        <Route path="/nursing-clinical-scenarios">{() => <ExamPrepCornerstonePage slug="nursing-clinical-scenarios" />}</Route>
        <Route path="/nursing-exam-preparation">{() => <ExamPrepCornerstonePage slug="nursing-exam-preparation" />}</Route>

        {/* Exam Prep Topic Clusters (alternate slugs) */}
        <Route path="/nclex-question-bank-guide">{() => <TopicClusterBySlug slug="nclex-question-bank-guide" />}</Route>
        <Route path="/rex-pn-exam-prep-guide">{() => <TopicClusterBySlug slug="rex-pn-exam-prep-guide" />}</Route>
        <Route path="/nursing-clinical-scenarios-guide">{() => <TopicClusterBySlug slug="nursing-clinical-scenarios-guide" />}</Route>

        {/* Authority Guide Pages */}
        <Route path="/electrolytes-nursing-exam-guide">{() => <AuthorityGuidePage slug="electrolytes-nursing-exam-guide" />}</Route>
        <Route path="/acid-base-disorders-nursing-guide">{() => <AuthorityGuidePage slug="acid-base-disorders-nursing-guide" />}</Route>
        <Route path="/nursing-clinical-assessment-guide">{() => <AuthorityGuidePage slug="nursing-clinical-assessment-guide" />}</Route>

        {/* Long-form Cornerstone Study Guides (topic cluster format) */}
        <Route path="/lab-values-complete-nursing-guide">{() => <TopicClusterBySlug slug="lab-values-complete-nursing-guide" />}</Route>
        <Route path="/acid-base-disorders-nursing">{() => <TopicClusterBySlug slug="acid-base-disorders-nursing" />}</Route>
        <Route path="/nursing-clinical-assessment-complete-guide">{() => <TopicClusterBySlug slug="nursing-clinical-assessment-complete-guide" />}</Route>

        {/* Career Guide Pages - "How to become a..." */}
        <Route path="/how-to-become-a-paramedic" component={CareerGuidePage} />
        <Route path="/how-to-become-a-respiratory-therapist" component={CareerGuidePage} />
        <Route path="/how-to-become-a-medical-lab-technologist" component={CareerGuidePage} />
        <Route path="/how-to-become-a-radiologic-technologist" component={CareerGuidePage} />
        <Route path="/how-to-become-a-social-worker" component={CareerGuidePage} />
        <Route path="/how-to-become-a-psychotherapist" component={CareerGuidePage} />
        <Route path="/how-to-become-an-addictions-counselor" component={CareerGuidePage} />
        <Route path="/how-to-become-an-occupational-therapist" component={CareerGuidePage} />
        <Route path="/how-to-become-a-pharmacy-technician" component={CareerGuidePage} />

        <Route path="/:careerSlug/study-guide/:topicSlug">{(params) => <ProgrammaticSeoPage />}</Route>
        <Route path="/:careerSlug/exam-tips/:topicSlug">{(params) => <ProgrammaticSeoPage />}</Route>
        <Route path="/:careerSlug/clinical-scenarios/:topicSlug">{(params) => <ProgrammaticSeoPage />}</Route>
        <Route path="/:careerSlug/practice-questions/:topicSlug">{(params) => <ProgrammaticSeoPage />}</Route>
        <Route path="/:careerSlug/question-detail/:topicSlug">{(params) => <ProgrammaticSeoPage />}</Route>
        <Route path="/:careerSlug/flashcard-detail/:topicSlug">{(params) => <ProgrammaticSeoPage />}</Route>

        {/* Legacy allied career route redirects → canonical /allied-health/... paths */}
        <Route path="/rrt/:rest*">{(params) => <Redirect to={`/allied-health/rrt${params.rest ? `/${params.rest}` : ""}`} />}</Route>
        <Route path="/rrt">{() => <Redirect to="/allied-health/rrt" />}</Route>
        <Route path="/paramedic/:rest*">{(params) => <Redirect to={`/allied-health/paramedic${params.rest ? `/${params.rest}` : ""}`} />}</Route>
        <Route path="/paramedic">{() => <Redirect to="/allied-health/paramedic" />}</Route>
        <Route path="/pharmacy-technician/:rest*">{(params) => <Redirect to={`/allied-health/pharmacy-technician${params.rest ? `/${params.rest}` : ""}`} />}</Route>
        <Route path="/pharmacy-technician">{() => <Redirect to="/allied-health/pharmacy-technician" />}</Route>
        <Route path="/pharmacy-tech/:rest*">{(params) => <Redirect to={`/allied-health/pharmacy-tech${params.rest ? `/${params.rest}` : ""}`} />}</Route>
        <Route path="/pharmacy-tech">{() => <Redirect to="/allied-health/pharmacy-tech" />}</Route>
        <Route path="/mlt/:rest*">{(params) => <Redirect to={`/allied-health/mlt${params.rest ? `/${params.rest}` : ""}`} />}</Route>
        <Route path="/mlt">{() => <Redirect to="/allied-health/mlt" />}</Route>
        <Route path="/imaging/:rest*">{(params) => <Redirect to={`/allied-health/imaging${params.rest ? `/${params.rest}` : ""}`} />}</Route>
        <Route path="/imaging">{() => <Redirect to="/allied-health/imaging" />}</Route>
        <Route path="/social-work/:rest*">{(params) => <Redirect to={`/allied-health/social-work${params.rest ? `/${params.rest}` : ""}`} />}</Route>
        <Route path="/social-work">{() => <Redirect to="/allied-health/social-work" />}</Route>
        <Route path="/social-worker/:rest*">{(params) => <Redirect to={`/allied-health/social-worker${params.rest ? `/${params.rest}` : ""}`} />}</Route>
        <Route path="/social-worker">{() => <Redirect to="/allied-health/social-worker" />}</Route>
        <Route path="/psychotherapy/:rest*">{(params) => <Redirect to={`/allied-health/psychotherapy${params.rest ? `/${params.rest}` : ""}`} />}</Route>
        <Route path="/psychotherapy">{() => <Redirect to="/allied-health/psychotherapy" />}</Route>
        <Route path="/psychotherapist/:rest*">{(params) => <Redirect to={`/allied-health/psychotherapist${params.rest ? `/${params.rest}` : ""}`} />}</Route>
        <Route path="/psychotherapist">{() => <Redirect to="/allied-health/psychotherapist" />}</Route>
        <Route path="/addictions/:rest*">{(params) => <Redirect to={`/allied-health/addictions${params.rest ? `/${params.rest}` : ""}`} />}</Route>
        <Route path="/addictions">{() => <Redirect to="/allied-health/addictions" />}</Route>
        <Route path="/addictions-counsellor/:rest*">{(params) => <Redirect to={`/allied-health/addictions-counsellor${params.rest ? `/${params.rest}` : ""}`} />}</Route>
        <Route path="/addictions-counsellor">{() => <Redirect to="/allied-health/addictions-counsellor" />}</Route>
        <Route path="/occupational-therapy/:rest*">{(params) => <Redirect to={`/allied-health/occupational-therapy${params.rest ? `/${params.rest}` : ""}`} />}</Route>
        <Route path="/occupational-therapy">{() => <Redirect to="/allied-health/occupational-therapy" />}</Route>
        <Route path="/physical-therapy/:rest*">{(params) => <Redirect to={`/allied-health/physical-therapy${params.rest ? `/${params.rest}` : ""}`} />}</Route>
        <Route path="/physical-therapy">{() => <Redirect to="/allied-health/physical-therapy" />}</Route>
        <Route path="/respiratory-therapy/:rest*">{(params) => <Redirect to={`/allied-health/respiratory-therapy${params.rest ? `/${params.rest}` : ""}`} />}</Route>
        <Route path="/respiratory-therapy">{() => <Redirect to="/allied-health/respiratory-therapy" />}</Route>
        <Route path="/health-info-mgmt/:rest*">{(params) => <Redirect to={`/allied-health/health-info-mgmt${params.rest ? `/${params.rest}` : ""}`} />}</Route>
        <Route path="/health-info-mgmt">{() => <Redirect to="/allied-health/health-info-mgmt" />}</Route>
        <Route path="/ultrasound/:rest*">{(params) => <Redirect to={`/allied-health/imaging${params.rest ? `/${params.rest}` : ""}`} />}</Route>
        <Route path="/ultrasound">{() => <Redirect to="/allied-health/imaging" />}</Route>
        <Route path="/physical-therapy-assistant/:rest*">{(params) => <Redirect to={`/allied-health/physiotherapy-assistant${params.rest ? `/${params.rest}` : ""}`} />}</Route>
        <Route path="/physical-therapy-assistant">{() => <Redirect to="/allied-health/physiotherapy-assistant" />}</Route>
        <Route path="/occupational-therapy-assistant/:rest*">{(params) => <Redirect to={`/allied-health/occupational-therapy-assistant${params.rest ? `/${params.rest}` : ""}`} />}</Route>
        <Route path="/occupational-therapy-assistant">{() => <Redirect to="/allied-health/occupational-therapy-assistant" />}</Route>

        <Route>{() => <RouteErrorBoundary groupName="allied"><AlliedLayout><AlliedRoutes /></AlliedLayout></RouteErrorBoundary>}</Route>
      </Switch>
    </Suspense>
  );
}

function useDelocalizedLocation(locale: string): [string, typeof wouterNavigate] {
  const [path] = useBrowserLocation();
  const { pathWithoutLocale } = getLocaleFromPath(path);
  const englishPath = deLocalizeSlug(locale, pathWithoutLocale);
  const effectivePath = `/${locale}${englishPath === "/" ? "" : englishPath}`;
  return [effectivePath, wouterNavigate];
}

function LocaleRouter() {
  const [location] = useLocation();
  const { locale } = getLocaleFromPath(location);
  const segments = location.split("/").filter(Boolean);
  const firstSegment = segments[0] || "";

  if (!firstSegment || !isValidLocale(firstSegment)) {
    const redirectTarget = `/${DEFAULT_LOCALE}${location === "/" ? "" : location}`;
    return <Redirect to={redirectTarget} />;
  }

  const needsDelocalization = locale === "fr" || locale === "es" || locale === "pt" || locale === "de" || locale === "th" || locale === "zh" || locale === "zh-tw" || locale === "id";

  if (needsDelocalization) {
    return (
      <Router base={`/${locale}`} hook={() => useDelocalizedLocation(locale)}>
        <AppRoutes />
      </Router>
    );
  }

  return (
    <Router base={`/${locale}`}>
      <AppRoutes />
    </Router>
  );
}

function handleDevModeSwitch(): void {
  const isDev = window.location.hostname.includes("replit") ||
    window.location.hostname === "localhost" ||
    window.location.hostname.includes("0.0.0.0") ||
    window.location.hostname.includes("webcontainer");
  if (!isDev) return;
  localStorage.removeItem("nursenest_allied_mode");
  const params = new URLSearchParams(window.location.search);
  const mode = params.get("mode");
  const redirect = params.get("redirect");
  if (mode === "allied") {
    localStorage.setItem("nursenest_site_mode", "allied");
    window.location.replace(redirect || window.location.pathname);
    return;
  }
  if (mode === "nursing") {
    localStorage.removeItem("nursenest_site_mode");
    window.location.replace(redirect || window.location.pathname);
    return;
  }
}

handleDevModeSwitch();

(function captureReferralCode() {
  const params = new URLSearchParams(window.location.search);
  const ref = params.get("ref");
  if (ref) {
    sessionStorage.setItem("nursenest-ref", ref);
  }
})();

function DeferredShellComponents() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if ("requestIdleCallback" in window) {
      const id = requestIdleCallback(() => setReady(true), { timeout: 3000 });
      return () => cancelIdleCallback(id);
    }
    const timer = setTimeout(() => setReady(true), 3000);
    return () => clearTimeout(timer);
  }, []);
  if (!ready) return null;
  return (
    <Suspense fallback={null}>
      <TesterBanner />
      <LazyAnalyticsTracker />
      <MobileBottomNav />
      <UpgradePrompt />
      <PWAInstallPrompt />
      <OfflineStatusBanner />
      <ExitIntentModal />
      <ReportProblemButton />
      <IncidentBanner />
      <StickyCtaBar />
    </Suspense>
  );
}

function LanguageGuardWrapper({ children }: { children: ReactNode }) {
  return <LanguageGuard>{children}</LanguageGuard>;
}

function App() {
  return (
    <PlatformErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="data-theme" defaultTheme="clinical-light" enableSystem={false}>
          <I18nProvider>
            <AuthProvider>
              <CareerProvider>
                <ParamedicRegionProvider>
                  <SiteImagesProvider>
                    <TooltipProvider>
                      <Toaster />
                      <PreviewBanner />
                      <PageTracker />
                      <CopyProtection />
                      <AppErrorBoundary>
                        <LanguageGuardWrapper>
                          <LocaleRouter />
                        </LanguageGuardWrapper>
                        <DeferredShellComponents />
                      </AppErrorBoundary>
                    </TooltipProvider>
                  </SiteImagesProvider>
                </ParamedicRegionProvider>
              </CareerProvider>
            </AuthProvider>
          </I18nProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </PlatformErrorBoundary>
  );
}

export default App;
