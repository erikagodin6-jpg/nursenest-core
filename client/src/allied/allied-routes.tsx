import { Switch, Route, Redirect, useRoute } from "wouter";
import React, { lazy, Suspense } from "react";
import { getCanonicalRoute } from "@shared/careers";
import { PROFESSION_HUB_DATA } from "@/allied/data/profession-hub-data";

const AlliedHome = lazy(() => import("./pages/allied-home"));
const AlliedLessons = lazy(() => import("./pages/allied-lessons"));
const CareerDirectory = lazy(() => import("./pages/career-directory"));
const CareerLanding = lazy(() => import("./pages/career-landing"));
const AlliedQBank = lazy(() => import("./pages/allied-qbank"));
const ProfessionHubPage = lazy(() => import("./pages/profession-hub"));
const ProfessionClusterRedirect = lazy(() => import("./pages/profession-cluster-redirect"));
const AlliedMockExams = lazy(() => import("./pages/allied-mock-exams"));
const AlliedDashboard = lazy(() => import("./pages/allied-dashboard"));
const AlliedStudyPlan = lazy(() => import("./pages/allied-study-plan"));
const AlliedFlashcards = lazy(() => import("./pages/allied-flashcards"));
const AlliedSims = lazy(() => import("./pages/allied-sims"));
const ParamedicScenarioPlayer = lazy(() => import("./pages/paramedic-scenario-player"));
const AlliedTools = lazy(() => import("./pages/allied-tools"));
const AlliedAdmin = lazy(() => import("./pages/allied-admin"));
const MltAdmin = lazy(() => import("./pages/mlt-admin"));
const ParamedicBulkUpload = lazy(() => import("./pages/paramedic-bulk-upload"));
const AlliedSeoLanding = lazy(() => import("./pages/allied-seo-landing"));
const AlliedDiagnostic = lazy(() => import("./pages/allied-diagnostic"));
const AlliedInstitutions = lazy(() => import("./pages/allied-institutions"));
const AlliedInstitutionsFAQ = lazy(() => import("./pages/allied-institutions-faq"));
const AlliedFacultyDashboard = lazy(() => import("./pages/allied-faculty-dashboard"));
const ParamedicLanding = lazy(() => import("./pages/paramedic/paramedic-landing"));
const ParamedicPCP = lazy(() => import("./pages/paramedic/paramedic-pcp"));
const ParamedicACP = lazy(() => import("./pages/paramedic/paramedic-acp"));
const ParamedicNREMT = lazy(() => import("./pages/paramedic/paramedic-nremt"));
const ParamedicLessonsHub = lazy(() => import("./pages/paramedic/paramedic-lessons-hub"));
const ParamedicExamsHub = lazy(() => import("./pages/paramedic/paramedic-exams-hub"));
const ParamedicFlashcardsHub = lazy(() => import("./pages/paramedic/paramedic-flashcards-hub"));
const ParamedicScenariosHub = lazy(() => import("./pages/paramedic/paramedic-scenarios-hub"));
const ParamedicPracticeExamsHub = lazy(() => import("./pages/paramedic/paramedic-practice-exams-hub"));
const ParamedicClusterHub = lazy(() => import("./pages/paramedic/paramedic-cluster-hub"));
const ParamedicClusterIndex = lazy(() => import("./pages/paramedic/paramedic-cluster-hub").then(m => ({ default: m.ParamedicClusterIndex })));
const ParamedicClusterTopic = lazy(() => import("./pages/paramedic/paramedic-cluster-topic"));
const ParamedicBlog = lazy(() => import("./pages/paramedic/paramedic-blog"));
const ParamedicBlogIndex = lazy(() => import("./pages/paramedic/paramedic-blog").then(m => ({ default: m.ParamedicBlogIndex })));
const ParamedicECGLibrary = lazy(() => import("./pages/paramedic/ecg-library"));
const ParamedicECGAdmin = lazy(() => import("./pages/paramedic/ecg-admin"));
const ParamedicQuestionsIndex = lazy(() => import("./pages/paramedic/paramedic-questions-index"));
const ParamedicQuestionSeoPage = lazy(() => import("./pages/paramedic/paramedic-question-seo"));
const ParamedicExamLauncher = lazy(() => import("./pages/paramedic/paramedic-exam-launcher"));
const ParamedicExamSimulator = lazy(() => import("./pages/paramedic/paramedic-exam-simulator"));
const ParamedicExamResults = lazy(() => import("./pages/paramedic/paramedic-exam-results"));
const MltLanding = lazy(() => import("./pages/mlt-landing"));
const MltCountryPage = lazy(() => import("./pages/mlt-country-page"));
const MltBlog = lazy(() => import("./pages/mlt-blog"));
const ParamedicSeoAdmin = lazy(() => import("./pages/paramedic-seo-admin"));
const ParamedicSeoPage = lazy(() => import("./pages/paramedic-seo-page").then(m => ({ default: m.ParamedicTopicPage })));
const ParamedicCategoryPage = lazy(() => import("./pages/paramedic-seo-page").then(m => ({ default: m.ParamedicCategoryPage })));
const ParamedicGlossaryPage = lazy(() => import("./pages/paramedic-seo-page").then(m => ({ default: m.ParamedicGlossaryPage })));
const ParamedicComparisonPage = lazy(() => import("./pages/paramedic-seo-page").then(m => ({ default: m.ParamedicComparisonPage })));
const ParamedicStudyGuidePage = lazy(() => import("./pages/paramedic-seo-page").then(m => ({ default: m.ParamedicStudyGuidePage })));
const ParamedicExamPrepPage = lazy(() => import("./pages/paramedic-seo-page").then(m => ({ default: m.ParamedicExamPrepPage })));
const MltImageLibrary = lazy(() => import("./pages/mlt/mlt-image-library"));
const MltImageDrill = lazy(() => import("./pages/mlt/mlt-image-drill"));
const MltExamHub = lazy(() => import("./pages/mlt/mlt-exam-hub"));
const MltCanadaExam = lazy(() => import("./pages/mlt/mlt-canada-exam"));
const MltUsaCatExam = lazy(() => import("./pages/mlt/mlt-usa-cat-exam"));
const MltAdaptivePractice = lazy(() => import("./pages/mlt/mlt-adaptive-practice"));
const RrtPharmacologyQBank = lazy(() => import("./pages/rrt-pharmacology-qbank"));
const RrtDomainTopicPage = lazy(() => import("./pages/rrt-domain-topic-page").then(m => ({ default: m.RrtDomainTopicPage })));
const MltPracticeExam = lazy(() => import("./pages/mlt/mlt-practice-exam"));
const MltExamResults = lazy(() => import("./pages/mlt/mlt-exam-results"));
const MltExamHistory = lazy(() => import("./pages/mlt/mlt-exam-history"));
const MltAdminCat = lazy(() => import("./pages/mlt/mlt-admin-cat"));

const OccupationalTherapyHub = lazy(() => import("./pages/occupational-therapy-hub"));
const PhysicalTherapyHub = lazy(() => import("./pages/physical-therapy-hub"));
const PharmtechHub = lazy(() => import("./pages/pharmtech-hub"));
const PharmtechLessons = lazy(() => import("./pages/pharmtech-lessons"));
const PharmtechFlashcards = lazy(() => import("./pages/pharmtech-flashcards"));
const PharmtechExams = lazy(() => import("./pages/pharmtech-exams"));
const PharmtechPractice = lazy(() => import("./pages/pharmtech-practice"));
const PharmtechStudyGuide = lazy(() => import("./pages/pharmtech-study-guide"));
const PharmtechAdmin = lazy(() => import("./pages/pharmtech-admin"));
const PharmtechReview = lazy(() => import("./pages/pharmtech-review"));
const PharmtechDrugClassesHub = lazy(() => import("./pages/pharmtech-drug-classes"));
const PharmtechDrugClassDetail = lazy(() => import("./pages/pharmtech-drug-classes").then(m => ({ default: m.PharmtechDrugClassDetail })));
const RrtPharmacologyHub = lazy(() => import("./pages/rrt-pharmacology-hub"));
const RrtPharmacologyTopicPage = lazy(() => import("./pages/rrt-pharmacology-topic").then(m => ({ default: m.RrtPharmacologyTopicPage })));
const RrtPharmQuickSheets = lazy(() => import("./pages/rrt-pharm-study-tools").then(m => ({ default: m.RrtPharmQuickSheets })));
const RrtPharmTraps = lazy(() => import("./pages/rrt-pharm-study-tools").then(m => ({ default: m.RrtPharmTraps })));
const RrtPharmMnemonics = lazy(() => import("./pages/rrt-pharm-study-tools").then(m => ({ default: m.RrtPharmMnemonics })));
const RrtPharmOneMinuteReview = lazy(() => import("./pages/rrt-pharm-study-tools").then(m => ({ default: m.RrtPharmOneMinuteReview })));
const PharmtechPracticeExamSeo = lazy(() => import("./pages/pharmtech-practice-exam-seo"));
const PharmtechMedicationsHub = lazy(() => import("./pages/pharmtech-medication-page").then(m => ({ default: m.PharmTechMedicationsHub })));
const PharmtechMedicationDetail = lazy(() => import("./pages/pharmtech-medication-page").then(m => ({ default: m.PharmTechMedicationDetailRoute })));
const PharmtechCalculationsHub = lazy(() => import("./pages/pharmtech-calculations-page").then(m => ({ default: m.PharmTechCalculationsHub })));
const PharmtechCalculationDetail = lazy(() => import("./pages/pharmtech-calculations-page").then(m => ({ default: m.PharmTechCalculationDetailRoute })));
const PharmtechSigCodesHub = lazy(() => import("./pages/pharmtech-sig-codes-page").then(m => ({ default: m.PharmTechSigCodesHub })));
const PharmtechSigCodeDetail = lazy(() => import("./pages/pharmtech-sig-codes-page").then(m => ({ default: m.PharmTechSigCodeDetailRoute })));
const PharmtechLawHub = lazy(() => import("./pages/pharmtech-law-page").then(m => ({ default: m.PharmTechLawHub })));
const PharmtechLawDetail = lazy(() => import("./pages/pharmtech-law-page").then(m => ({ default: m.PharmTechLawDetailRoute })));
const PharmtechGuidesHub = lazy(() => import("./pages/pharmtech-guides-page").then(m => ({ default: m.PharmTechGuidesHub })));
const PharmtechGuideDetail = lazy(() => import("./pages/pharmtech-guides-page").then(m => ({ default: m.PharmTechGuideDetailRoute })));
const PharmtechAdaptivePractice = lazy(() => import("./pages/pharmtech-adaptive-practice"));
const PharmtechStudyPlan = lazy(() => import("./pages/pharmtech-study-plan"));
const MltStudentDashboard = lazy(() => import("./pages/mlt-student-dashboard"));
const ImagingPhysicsListing = lazy(() => import("./pages/imaging-physics-listing"));
const ImagingPhysicsTopic = lazy(() => import("./pages/imaging-physics-topic"));
const ImagingFlashcardsPage = lazy(() => import("./pages/imaging-flashcards"));
const ImagingSeoLanding = lazy(() => import("./pages/imaging-seo-landing"));
const CareerStudyIndexPage = lazy(() => import("./components/career-study-index-page"));
const CareerFlashcardsIndexPage = lazy(() => import("./components/career-flashcards-index-page"));
const ImagingCareerExamsPage = lazy(() => import("./components/career-exams-page"));
const CareerCareerGuidePage = lazy(() => import("./components/career-career-guide-page"));
import { IMAGING_CAREER_DATA } from "@/allied/data/imaging-career-data";
import { useI18n } from "@/lib/i18n";
const MltSEOPage = lazy(() => import("./pages/mlt-seo-pages").then(m => ({ default: m.MltSEOPage })));
const MltLabValuePage = lazy(() => import("./pages/mlt-lab-value-page").then(m => ({ default: m.MltLabValuePage })));
const MltLabValuesHub = lazy(() => import("./pages/mlt-lab-values-hub").then(m => ({ default: m.MltLabValuesHub })));
const MltLabValuesCompleteChart = lazy(() => import("./pages/mlt-lab-values-viral").then(m => ({ default: m.MltLabValuesCompleteChart })));
const MltLabValuesTop50 = lazy(() => import("./pages/mlt-lab-values-viral").then(m => ({ default: m.MltLabValuesTop50 })));
const MltBloodBankHub = lazy(() => import("./pages/mlt-blood-bank-hub"));
const MltBloodBankTopicPage = lazy(() => import("./pages/mlt-blood-bank-topic"));
const MltBloodBankCheatSheet = lazy(() => import("./pages/mlt-blood-bank-cheat-sheet"));
const MltMicrobiologyHub = lazy(() => import("./pages/mlt-microbiology-hub").then(m => ({ default: m.MltMicrobiologyHub })));
const MltMicrobiologyTopic = lazy(() => import("./pages/mlt-microbiology-topic").then(m => ({ default: m.MltMicrobiologyTopic })));
const MltMicrobiologyQuickGuide = lazy(() => import("./pages/mlt-microbiology-quick-guide").then(m => ({ default: m.MltMicrobiologyQuickGuide })));
const MltContentPage = lazy(() => import("./pages/mlt-seo-content-pages").then(m => ({ default: m.MltContentPage })));
const AlliedQuestionSeoPage = lazy(() => import("./pages/allied-question-seo"));
const PtaTopicBankPage = lazy(() => import("./pages/pta-topic-bank-page"));
const PtaSeoContentPage = lazy(() => import("./pages/pta-seo-content-page"));
const PtaBlogPage = lazy(() => import("./pages/pta-seo-content-page").then(m => ({ default: m.PtaBlogPage })));

const PTA_BLOG_SLUGS = new Set(["how-to-pass-the-pta-exam", "top-50-pta-exam-questions", "common-rehab-mistakes-pta"]);
function PtaGuideRouter() {
  const { t } = useI18n();
  const [, routeParams] = useRoute("/allied-health/physiotherapy-assistant/guide/:slug");
  const slug = routeParams?.slug || "";
  if (PTA_BLOG_SLUGS.has(slug)) {
    return <PtaBlogPage />;
  }
  return <PtaSeoContentPage />;
}
const AlliedQuestionsIndexPage = lazy(() => import("./pages/allied-questions-index"));
const UnderservedSEOPage = lazy(() => import("./pages/underserved-seo-pages").then(m => ({ default: m.UnderservedSEOPage })));
const OTQuestionBankPage = lazy(() => import("./pages/underserved-seo-pages").then(m => ({ default: m.OTQuestionBankPage })));
const OTMockExamsPage = lazy(() => import("./pages/underserved-seo-pages").then(m => ({ default: m.OTMockExamsPage })));
const OTStudyPlanPage = lazy(() => import("./pages/underserved-seo-pages").then(m => ({ default: m.OTStudyPlanPage })));
const EncyclopediaHubPage = lazy(() => import("./pages/encyclopedia-hub-page"));
const EncyclopediaTopicPage = lazy(() => import("./pages/encyclopedia-topic-page"));
const EncyclopediaAdmin = lazy(() => import("./pages/encyclopedia-admin"));
const ProgrammaticSeoPage = lazy(() => import("@/pages/programmatic-seo-page"));
const CareerGuidePage = lazy(() => import("./pages/career-guide-page"));
const CareerStudyPage = lazy(() => import("./pages/career-study-page"));
const CareerFlashcardsPage = lazy(() => import("./pages/career-flashcards-page"));
const CareerExamsPage = lazy(() => import("./pages/career-exams-page"));
const CareerGuideSubpage = lazy(() => import("./pages/career-guide-subpage"));
const AlliedHealthHub = lazy(() => import("./pages/allied-health-hub"));
const AlliedHealthProfessionPage = lazy(() => import("./pages/allied-health-profession"));
const AlliedHealthArticlePage = lazy(() => import("./pages/allied-health-article"));
const AdminAlliedHealthSEO = lazy(() => import("@/pages/admin-allied-health-seo"));
const ArticleListingPage = lazy(() => import("./pages/article-listing"));
const ArticleDetailPage = lazy(() => import("./pages/article-detail"));

const AlliedHealthFAQPage = lazy(() => import("@/pages/allied-health-faq"));
const SeoLandingBySlug = lazy(() => import("@/pages/seo-landing-page").then(m => ({ default: m.SeoLandingBySlug })));
const TestBankPage = lazy(() => import("@/pages/test-bank"));

const QBANK_SLUG_MAP: Record<string, string> = {
  rrt: "rrt",
  "respiratory-therapy": "rrt",
  paramedic: "paramedic",
  "pharmacy-tech": "pharmacy-tech",
  "pharmacy-technician": "pharmacy-tech",
  mlt: "mlt",
  "medical-lab-technologist": "mlt",
  imaging: "imaging",
  "medical-imaging": "imaging",
  ultrasound: "imaging",
  "occupational-therapy": "occupational-therapy",
  "occupational-therapy-assistant": "occupational-therapy",
  "occupational-therapist": "occupational-therapy",
  "physical-therapy": "physical-therapy",
  "physical-therapy-assistant": "physical-therapy",
  "physiotherapy-assistant": "physical-therapy",
};

function TestBankRedirect({ careerSlug }: { careerSlug: string }) {
  const qbankCareer = QBANK_SLUG_MAP[careerSlug];
  if (qbankCareer) {
    return <Redirect to={`/allied-health/qbank?career=${qbankCareer}`} />;
  }
  return <TestBankPage />;
}
const DeckPage = lazy(() => import("@/pages/deck-page"));
const MockExamReportPage = lazy(() => import("@/pages/mock-exam-report"));
const MockExamSessionPage = lazy(() => import("@/pages/mock-exam-session"));
const MockExamsListPage = lazy(() => import("@/pages/mock-exams"));
const StudyPlanPage = lazy(() => import("@/pages/study-plan"));
const DashboardPage = lazy(() => import("@/pages/dashboard"));
const AuthorityContentPage = lazy(() => import("@/pages/authority-content-page"));
const ExamStudyGuidePage = lazy(() => import("@/pages/exam-study-guide"));
const SeoPage = lazy(() => import("@/pages/seo-page"));
const CareerAISimulator = lazy(() => import("@/pages/career-tools/career-ai-simulator"));
const SocialWorkerLessonsPage = lazy(() => import("@/pages/social-worker-lessons"));
const ParamedicPracticeQuestions = lazy(() => import("@/pages/profession-practice-questions").then(m => ({ default: m.ParamedicPracticeQuestions })));
const MltPracticeQuestionsPage = lazy(() => import("@/pages/profession-practice-questions").then(m => ({ default: m.MltPracticeQuestions })));
const ImagingPracticeQuestions = lazy(() => import("@/pages/profession-practice-questions").then(m => ({ default: m.ImagingPracticeQuestions })));
const SocialWorkPracticeQuestions = lazy(() => import("@/pages/profession-practice-questions").then(m => ({ default: m.SocialWorkPracticeQuestions })));
const PsychotherapyPracticeQuestions = lazy(() => import("@/pages/profession-practice-questions").then(m => ({ default: m.PsychotherapyPracticeQuestions })));
const AddictionsPracticeQuestions = lazy(() => import("@/pages/profession-practice-questions").then(m => ({ default: m.AddictionsPracticeQuestions })));
const OccupationalTherapyPracticeQuestions = lazy(() => import("@/pages/profession-practice-questions").then(m => ({ default: m.OccupationalTherapyPracticeQuestions })));
const SocialWorkDomainsPage = lazy(() => import("./pages/social-work-domains"));
const SocialWorkTestBankPage = lazy(() => import("./pages/social-work-domains").then(m => ({ default: m.SocialWorkTestBankPage })));
const MainEncyclopediaHub = lazy(() => import("@/pages/encyclopedia-hub"));

const ParamedicExamPrepLanding = lazy(() => import("@/pages/allied-exam-prep-landing").then(m => ({ default: m.ParamedicExamPrep })));
const RrtExamPrepLanding = lazy(() => import("@/pages/allied-exam-prep-landing").then(m => ({ default: m.RrtExamPrep })));
const MltExamPrepLanding = lazy(() => import("@/pages/allied-exam-prep-landing").then(m => ({ default: m.MltExamPrep })));
const RadiographyExamPrepLanding = lazy(() => import("@/pages/allied-exam-prep-landing").then(m => ({ default: m.RadiographyExamPrep })));
const SocialWorkExamPrepLanding = lazy(() => import("@/pages/allied-exam-prep-landing").then(m => ({ default: m.SocialWorkExamPrep })));
const PsychotherapyExamPrepLanding = lazy(() => import("@/pages/allied-exam-prep-landing").then(m => ({ default: m.PsychotherapyExamPrep })));
const AddictionsCounsellingExamPrepLanding = lazy(() => import("@/pages/allied-exam-prep-landing").then(m => ({ default: m.AddictionsCounsellingExamPrep })));
const OccupationalTherapyExamPrepLanding = lazy(() => import("@/pages/allied-exam-prep-landing").then(m => ({ default: m.OccupationalTherapyExamPrep })));
const PhysicalTherapyExamPrepLanding = lazy(() => import("@/pages/allied-exam-prep-landing").then(m => ({ default: m.PhysicalTherapyExamPrep })));

function CareerRedirect({ careerSlug, subPath }: { careerSlug?: string; subPath?: string }) {
  if (!careerSlug) return null;
  const canonical = getCanonicalRoute(careerSlug);
  const target = subPath ? `${canonical}/${subPath}` : canonical;
  return <Redirect to={target} replace />;
}

function LoadingFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="w-8 h-8 border-3 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-gray-500">Loading…</p>
      </div>
    </div>
  );
}

function SocialWorkDomainDetailWrapper({ slug }: { slug: string }) {
  const [Component, setComponent] = React.useState<React.ComponentType<{ slug: string }> | null>(null);
  React.useEffect(() => {
    import("./pages/social-work-domains").then(m => {
      setComponent(() => (props: { slug: string }) => m.SocialWorkDomainDetailPage(props));
    });
  }, []);
  if (!Component) return <LoadingFallback />;
  return <Component slug={slug} />;
}

export function AlliedRoutes() {
  const { t } = useI18n();
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Switch>
        <Route path="/allied-health/home" component={AlliedHome} />
        <Route path="/allied-health/faq" component={AlliedHealthFAQPage} />
        <Route path="/allied-health/lessons" component={AlliedLessons} />
        <Route path="/allied-health/careers" component={CareerDirectory} />
        <Route path="/allied-health/pricing">{() => <Redirect to="/pricing?section=allied" />}</Route>
        <Route path="/pricing/allied">{() => <Redirect to="/pricing?section=allied" />}</Route>
        <Route path="/allied-health/institutions/faq" component={AlliedInstitutionsFAQ} />
        <Route path="/allied-health/institutions/faculty-dashboard" component={AlliedFacultyDashboard} />
        <Route path="/allied-health/institutions" component={AlliedInstitutions} />
        <Route path="/allied-health/diagnostic" component={AlliedDiagnostic} />
        <Route path="/allied-health/qbank" component={AlliedQBank} />
        <Route path="/admin/allied" component={AlliedAdmin} />
        <Route path="/admin/paramedic-seo" component={ParamedicSeoAdmin} />
        <Route path="/allied-health/paramedic/topic/:slug" component={ParamedicSeoPage} />
        <Route path="/allied-health/paramedic/category/:slug" component={ParamedicCategoryPage} />
        <Route path="/allied-health/paramedic/glossary/:slug" component={ParamedicGlossaryPage} />
        <Route path="/allied-health/paramedic/compare/:slug" component={ParamedicComparisonPage} />
        <Route path="/allied-health/paramedic/study-guide/:slug" component={ParamedicStudyGuidePage} />
        <Route path="/allied-health/paramedic/exam-prep/:slug" component={ParamedicExamPrepPage} />
        <Route path="/admin/mlt" component={MltAdmin} />
        <Route path="/admin/mlt/questions" component={MltAdmin} />
        <Route path="/admin/mlt/flashcards" component={MltAdmin} />
        <Route path="/admin/mlt/lessons" component={MltAdmin} />
        <Route path="/admin/mlt/exams" component={MltAdmin} />
        <Route path="/admin/mlt/uploads" component={MltAdmin} />
        <Route path="/admin/mlt/seo" component={MltAdmin} />
        <Route path="/admin/mlt/publish" component={MltAdmin} />
        <Route path="/admin/mlt/import" component={MltAdmin} />
        <Route path="/admin/mlt/import/history" component={MltAdmin} />
        <Route path="/admin/allied-content/occupational-therapy/questions" component={AlliedAdmin} />
        <Route path="/admin/allied-content/occupational-therapy/lessons" component={AlliedAdmin} />
        <Route path="/admin/allied-content/occupational-therapy/flashcards" component={AlliedAdmin} />
        <Route path="/admin/allied-content/occupational-therapy" component={AlliedAdmin} />
        <Route path="/admin/allied-content/physical-therapy/questions" component={AlliedAdmin} />
        <Route path="/admin/allied-content/physical-therapy/lessons" component={AlliedAdmin} />
        <Route path="/admin/allied-content/physical-therapy/flashcards" component={AlliedAdmin} />
        <Route path="/admin/allied-content/physical-therapy" component={AlliedAdmin} />
        <Route path="/admin/allied-content/pharmacy-technician/questions" component={PharmtechAdmin} />
        <Route path="/admin/allied-content/pharmacy-technician/lessons" component={PharmtechAdmin} />
        <Route path="/admin/allied-content/pharmacy-technician/flashcards" component={PharmtechAdmin} />
        <Route path="/admin/allied-content/pharmacy-technician/exams" component={PharmtechAdmin} />
        <Route path="/admin/allied-content/pharmacy-technician/import" component={PharmtechAdmin} />
        <Route path="/admin/allied-content/pharmacy-technician" component={PharmtechAdmin} />
        <Route path="/admin/paramedic-bulk-upload" component={ParamedicBulkUpload} />
        <Route path="/allied-health/pharmacy-technician/medications/:slug" component={PharmtechMedicationDetail} />
        <Route path="/allied-health/pharmacy-technician/medications" component={PharmtechMedicationsHub} />
        <Route path="/allied-health/pharmacy-technician/calculations/:slug" component={PharmtechCalculationDetail} />
        <Route path="/allied-health/pharmacy-technician/calculations" component={PharmtechCalculationsHub} />
        <Route path="/allied-health/pharmacy-technician/sig-codes/:slug" component={PharmtechSigCodeDetail} />
        <Route path="/allied-health/pharmacy-technician/sig-codes" component={PharmtechSigCodesHub} />
        <Route path="/allied-health/pharmacy-technician/law/:slug" component={PharmtechLawDetail} />
        <Route path="/allied-health/pharmacy-technician/law" component={PharmtechLawHub} />
        <Route path="/allied-health/pharmacy-technician/guides/:slug" component={PharmtechGuideDetail} />
        <Route path="/allied-health/pharmacy-technician/guides" component={PharmtechGuidesHub} />
        <Route path="/allied-health/pharmacy-technician/drug-classes/:slug" component={PharmtechDrugClassDetail} />
        <Route path="/allied-health/pharmacy-technician/drug-classes" component={PharmtechDrugClassesHub} />
        <Route path="/admin/allied-content/pharmacy-technician/study-plans" component={PharmtechAdmin} />
        <Route path="/allied-health/pharmacy-technician/study-plan/:planId" component={PharmtechStudyPlan} />
        <Route path="/allied-health/pharmacy-technician/study-plan" component={PharmtechStudyPlan} />
        <Route path="/allied-health/pharmacy-technician/mock-exams">{() => <Redirect to="/allied-health/pharmacy-technician/exams" replace />}</Route>
        <Route path="/allied-health/pharmacy-technician" component={PharmtechHub} />
        <Route path="/allied-health/pharmacy-technician/lessons/:slug" component={PharmtechLessons} />
        <Route path="/allied-health/pharmacy-technician/lessons" component={PharmtechLessons} />
        <Route path="/allied-health/pharmacy-technician/flashcards/:slug" component={PharmtechFlashcards} />
        <Route path="/allied-health/pharmacy-technician/flashcards" component={PharmtechFlashcards} />
        <Route path="/allied-health/pharmacy-technician/review/:attemptId" component={PharmtechReview} />
        <Route path="/allied-health/pharmacy-technician/exams/:slug" component={PharmtechExams} />
        <Route path="/allied-health/pharmacy-technician/exams" component={PharmtechExams} />
        <Route path="/allied-health/pharmacy-technician/practice-exam-questions" component={PharmtechPracticeExamSeo} />
        <Route path="/allied-health/pharmacy-technician/adaptive-practice" component={PharmtechAdaptivePractice} />
        <Route path="/allied-health/pharmacy-technician/practice-questions" component={PharmtechPractice} />
        <Route path="/allied-health/pharmacy-technician/study-guide" component={PharmtechStudyGuide} />
        <Route path="/allied-health/pharmacy-technician-practice-questions">{() => <AlliedSeoLanding pageSlug="pharmacy-technician-practice-questions" />}</Route>
        <Route path="/allied-health/pharmacy-technician-mock-exam">{() => <AlliedSeoLanding pageSlug="pharmacy-technician-mock-exam" />}</Route>
        <Route path="/allied-health/pharmacy-technician-study-guide">{() => <AlliedSeoLanding pageSlug="pharmacy-technician-study-guide" />}</Route>
        <Route path="/allied-health/pharmacy-technician-top-200-drugs-flashcards">{() => <AlliedSeoLanding pageSlug="pharmacy-technician-top-200-drugs-flashcards" />}</Route>
        <Route path="/allied-health/pharmacy-technician-dosage-calculations-practice">{() => <AlliedSeoLanding pageSlug="pharmacy-technician-dosage-calculations-practice" />}</Route>
        <Route path="/allied-health/pharmacy-technician-dosage-calculations">{() => <AlliedSeoLanding pageSlug="pharmacy-technician-dosage-calculations" />}</Route>
        <Route path="/allied-health/pharmacy-technician-pharmacy-law-and-ethics">{() => <AlliedSeoLanding pageSlug="pharmacy-technician-pharmacy-law-and-ethics" />}</Route>
        <Route path="/allied-health/pharmacy-technician-medication-safety">{() => <AlliedSeoLanding pageSlug="pharmacy-technician-medication-safety" />}</Route>
        <Route path="/allied-health/pharmacy-technician-top-200-drugs">{() => <AlliedSeoLanding pageSlug="pharmacy-technician-top-200-drugs" />}</Route>
        <Route path="/allied-health/rrt-practice-questions">{() => <AlliedSeoLanding pageSlug="rrt-practice-questions" />}</Route>
        <Route path="/allied-health/rrt-mock-exam">{() => <AlliedSeoLanding pageSlug="rrt-mock-exam" />}</Route>
        <Route path="/allied-health/rrt-study-guide">{() => <AlliedSeoLanding pageSlug="rrt-study-guide" />}</Route>
        <Route path="/allied-health/pharmacy-tech-us">{() => <AlliedSeoLanding pageSlug="pharmacy-tech-us" />}</Route>
        <Route path="/allied-health/pharmacy-tech-canada">{() => <AlliedSeoLanding pageSlug="pharmacy-tech-canada" />}</Route>
        <Route path="/allied-health/rrt-us">{() => <AlliedSeoLanding pageSlug="rrt-us" />}</Route>
        <Route path="/allied-health/rrt-canada">{() => <AlliedSeoLanding pageSlug="rrt-canada" />}</Route>
        <Route path="/allied-health/medical-imaging/:country/physics/:topicSlug" component={ImagingPhysicsTopic} />
        <Route path="/allied-health/medical-imaging/:country/physics" component={ImagingPhysicsListing} />
        <Route path="/allied-health/medical-imaging/:country/flashcards" component={ImagingFlashcardsPage} />
        <Route path="/allied-health/medical-imaging/:country/:pageType">{(params) => <ImagingSeoLanding />}</Route>
        <Route path="/allied-health/imaging-us">{() => <AlliedSeoLanding pageSlug="imaging-us" />}</Route>
        <Route path="/allied-health/imaging-canada">{() => <AlliedSeoLanding pageSlug="imaging-canada" />}</Route>
        <Route path="/allied-health/paramedic-us">{() => <AlliedSeoLanding pageSlug="paramedic-us" />}</Route>
        <Route path="/allied-health/paramedic-canada">{() => <AlliedSeoLanding pageSlug="paramedic-canada" />}</Route>
        <Route path="/allied-health/mlt-us">{() => <AlliedSeoLanding pageSlug="mlt-us" />}</Route>
        <Route path="/allied-health/mlt-canada">{() => <AlliedSeoLanding pageSlug="mlt-canada" />}</Route>
        <Route path="/allied-health/dashboard/mlt/canada" component={MltStudentDashboard} />
        <Route path="/allied-health/dashboard/mlt/usa" component={MltStudentDashboard} />
        <Route path="/allied-health/dashboard/mlt/exam" component={MltStudentDashboard} />
        <Route path="/allied-health/dashboard/mlt/flashcards" component={MltStudentDashboard} />
        <Route path="/allied-health/dashboard/mlt/lessons" component={MltStudentDashboard} />
        <Route path="/allied-health/dashboard/mlt/performance" component={MltStudentDashboard} />
        <Route path="/allied-health/dashboard/mlt/wrong-answers" component={MltStudentDashboard} />
        <Route path="/allied-health/dashboard/mlt/study-plan" component={MltStudentDashboard} />
        <Route path="/allied-health/dashboard/mlt" component={MltStudentDashboard} />
        <Route path="/allied-health/mlt/blood-bank/cheat-sheet" component={MltBloodBankCheatSheet} />
        <Route path="/allied-health/mlt/blood-bank/:slug" component={MltBloodBankTopicPage} />
        <Route path="/allied-health/mlt/blood-bank" component={MltBloodBankHub} />
        <Route path="/allied-health/mlt/canada/practice-questions">{() => <MltSEOPage country="canada" pageType="practice-questions" />}</Route>
        <Route path="/allied-health/mlt/usa/practice-questions">{() => <MltSEOPage country="usa" pageType="practice-questions" />}</Route>
        <Route path="/allied-health/mlt/exam-prep">{() => <MltSEOPage country="both" pageType="exam-prep" />}</Route>
        <Route path="/allied-health/mlt/study-guide">{() => <MltSEOPage country="both" pageType="study-guide" />}</Route>
        <Route path="/allied-health/mlt/mock-exam">{() => <MltSEOPage country="both" pageType="mock-exam" />}</Route>
        <Route path="/allied-health/mlt/flashcard-prep">{() => <MltSEOPage country="both" pageType="flashcards" />}</Route>
        <Route path="/allied-health/mlt/clinical-chemistry-questions">{() => <MltContentPage slug="clinical-chemistry-questions" />}</Route>
        <Route path="/allied-health/mlt/hematology-practice-questions">{() => <MltContentPage slug="hematology-practice-questions" />}</Route>
        <Route path="/allied-health/mlt/microbiology-exam-prep">{() => <MltContentPage slug="microbiology-exam-prep" />}</Route>
        <Route path="/allied-health/mlt/blood-banking-immunohematology">{() => <MltContentPage slug="blood-banking-immunohematology" />}</Route>
        <Route path="/allied-health/mlt/urinalysis-body-fluids">{() => <MltContentPage slug="urinalysis-body-fluids" />}</Route>
        <Route path="/allied-health/mlt/laboratory-operations-quality">{() => <MltContentPage slug="laboratory-operations-quality" />}</Route>
        <Route path="/allied-health/mlt/histotechnology-cytology">{() => <MltContentPage slug="histotechnology-cytology" />}</Route>
        <Route path="/allied-health/mlt/molecular-diagnostics-poct">{() => <MltContentPage slug="molecular-diagnostics-poct" />}</Route>
        <Route path="/allied-health/mlt/blog/career-guide">{() => <MltContentPage slug="blog-mlt-career-guide" />}</Route>
        <Route path="/allied-health/mlt/blog/study-strategies">{() => <MltContentPage slug="blog-mlt-study-strategies" />}</Route>
        <Route path="/allied-health/mlt/blog/lab-safety">{() => <MltContentPage slug="blog-mlt-lab-safety" />}</Route>
        <Route path="/admin/mlt/images" component={MltImageLibrary} />
        <Route path="/allied-health/mlt/image-drill" component={MltImageDrill} />
        <Route path="/allied-health/careers/mlt/image-drill">{() => <Redirect to="/allied-health/mlt/image-drill" replace />}</Route>
        <Route path="/allied-health/paramedic/pcp" component={ParamedicPCP} />
        <Route path="/allied-health/paramedic/acp" component={ParamedicACP} />
        <Route path="/allied-health/paramedic/nremt" component={ParamedicNREMT} />
        <Route path="/allied-health/paramedic/lessons" component={ParamedicLessonsHub} />
        <Route path="/allied-health/paramedic/exams" component={ParamedicExamsHub} />
        <Route path="/allied-health/paramedic/flashcards" component={ParamedicFlashcardsHub} />
        <Route path="/allied-health/paramedic/scenarios" component={ParamedicScenariosHub} />
        <Route path="/allied-health/paramedic/exam-simulator/:sessionId" component={ParamedicExamSimulator} />
        <Route path="/allied-health/paramedic/exam-results/:sessionId" component={ParamedicExamResults} />
        <Route path="/allied-health/paramedic/exam-launcher" component={ParamedicExamLauncher} />
        <Route path="/allied-health/paramedic/practice-exams" component={ParamedicPracticeExamsHub} />
        <Route path="/allied-health/paramedic/ecg-library" component={ParamedicECGLibrary} />
        <Route path="/admin/paramedic-waveforms" component={ParamedicECGAdmin} />
        <Route path="/allied-health/paramedic/cluster/:clusterSlug/:topicSlug" component={ParamedicClusterTopic} />
        <Route path="/allied-health/paramedic/cluster/:clusterSlug" component={ParamedicClusterHub} />
        <Route path="/allied-health/paramedic/clusters" component={ParamedicClusterIndex} />
        <Route path="/allied-health/paramedic/blog/:slug" component={ParamedicBlog} />
        <Route path="/allied-health/paramedic/blog" component={ParamedicBlogIndex} />
        <Route path="/allied-health/paramedic/questions/:topicSlug" component={ParamedicQuestionSeoPage} />
        <Route path="/allied-health/paramedic/questions" component={ParamedicQuestionsIndex} />
        <Route path="/allied-health/respiratory-therapy-exam-prep-guide">{() => <SeoLandingBySlug slug="allied-health/respiratory-therapy-exam-prep-guide" />}</Route>
        <Route path="/allied-health/paramedic-exam-prep-guide">{() => <SeoLandingBySlug slug="allied-health/paramedic-exam-prep-guide" />}</Route>
        <Route path="/allied-health/pharmacy-tech-exam-prep-guide">{() => <SeoLandingBySlug slug="allied-health/pharmacy-tech-exam-prep-guide" />}</Route>

        <Route path="/allied-health/paramedic-practice-questions" component={ParamedicPracticeQuestions} />
        <Route path="/allied-health/mlt-practice-questions" component={MltPracticeQuestionsPage} />
        <Route path="/allied-health/imaging-practice-questions" component={ImagingPracticeQuestions} />
        <Route path="/allied-health/social-work-practice-questions" component={SocialWorkPracticeQuestions} />
        <Route path="/allied-health/psychotherapy-practice-questions" component={PsychotherapyPracticeQuestions} />
        <Route path="/allied-health/addictions-practice-questions" component={AddictionsPracticeQuestions} />
        <Route path="/allied-health/occupational-therapy-practice-questions" component={OccupationalTherapyPracticeQuestions} />

        <Route path="/allied-health/nursing-encyclopedia">{() => <MainEncyclopediaHub />}</Route>
        <Route path="/allied-health/pharmacy-tech-encyclopedia">{() => <MainEncyclopediaHub />}</Route>
        <Route path="/allied-health/rrt-encyclopedia">{() => <MainEncyclopediaHub />}</Route>
        <Route path="/allied-health/critical-care-encyclopedia">{() => <MainEncyclopediaHub />}</Route>
        <Route path="/allied-health/emergency-nursing-encyclopedia">{() => <MainEncyclopediaHub />}</Route>

        <Route path="/allied-health/respiratory-therapy/ultimate-respiratory-therapy-study-guide" component={AuthorityContentPage} />
        <Route path="/allied-health/paramedic/top-100-paramedic-exam-questions" component={AuthorityContentPage} />
        <Route path="/allied-health/pharmacy-tech/top-100-pharmacy-technician-exam-questions" component={AuthorityContentPage} />
        <Route path="/allied-health/social-work/ultimate-aswb-exam-study-guide" component={AuthorityContentPage} />
        <Route path="/allied-health/psychotherapy/complete-psychotherapy-licensing-exam-guide" component={AuthorityContentPage} />
        <Route path="/allied-health/addictions/top-100-addictions-counsellor-exam-questions" component={AuthorityContentPage} />
        <Route path="/allied-health/mlt/complete-guide-medical-laboratory-science" component={AuthorityContentPage} />
        <Route path="/allied-health/imaging/definitive-radiography-exam-preparation-guide" component={AuthorityContentPage} />
        <Route path="/allied-health/occupational-therapy/ultimate-nbcot-exam-preparation-guide" component={AuthorityContentPage} />

        <Route path="/allied-health/paramedic-exam-study-guide">{() => <ExamStudyGuidePage slug="paramedic-exam-study-guide" />}</Route>
        <Route path="/allied-health/rrt-exam-study-guide">{() => <ExamStudyGuidePage slug="rrt-exam-study-guide" />}</Route>
        <Route path="/allied-health/mlt-exam-study-guide">{() => <ExamStudyGuidePage slug="mlt-exam-study-guide" />}</Route>
        <Route path="/allied-health/imaging-exam-study-guide">{() => <ExamStudyGuidePage slug="imaging-exam-study-guide" />}</Route>
        <Route path="/allied-health/social-work-exam-study-guide">{() => <ExamStudyGuidePage slug="social-work-exam-study-guide" />}</Route>
        <Route path="/allied-health/psychotherapy-exam-study-guide">{() => <ExamStudyGuidePage slug="psychotherapy-exam-study-guide" />}</Route>
        <Route path="/allied-health/addictions-exam-study-guide">{() => <ExamStudyGuidePage slug="addictions-exam-study-guide" />}</Route>
        <Route path="/allied-health/occupational-therapy-exam-study-guide">{() => <ExamStudyGuidePage slug="occupational-therapy-exam-study-guide" />}</Route>

        <Route path="/allied-health/respiratory-therapy-exam-prep">{() => <Suspense fallback={<div />}><SeoPage /></Suspense>}</Route>
        <Route path="/allied-health/paramedic-exam-prep">{() => <Suspense fallback={<div />}><SeoPage /></Suspense>}</Route>
        <Route path="/allied-health/medical-lab-tech-exam-prep">{() => <Suspense fallback={<div />}><SeoPage /></Suspense>}</Route>
        <Route path="/allied-health/diagnostic-imaging-exam-prep">{() => <Suspense fallback={<div />}><SeoPage /></Suspense>}</Route>
        <Route path="/allied-health/occupational-therapy-exam-prep">{() => <Suspense fallback={<div />}><SeoPage /></Suspense>}</Route>
        <Route path="/allied-health/physical-therapy-exam-prep">{() => <Suspense fallback={<div />}><SeoPage /></Suspense>}</Route>
        <Route path="/allied-health/respiratory-therapy-topics-hub">{() => <Suspense fallback={<div />}><SeoPage /></Suspense>}</Route>
        <Route path="/allied-health/paramedic-topics-hub">{() => <Suspense fallback={<div />}><SeoPage /></Suspense>}</Route>

        <Route path="/allied-health/social-worker/lessons/:slug" component={SocialWorkerLessonsPage} />
        <Route path="/allied-health/social-worker/lessons" component={SocialWorkerLessonsPage} />

        <Route path="/allied-health/rrt/abg-engine">{() => <CareerAISimulator toolId="abg-engine" />}</Route>
        <Route path="/allied-health/rrt/ventilator-sim">{() => <CareerAISimulator toolId="ventilator-sim" />}</Route>
        <Route path="/allied-health/paramedic/trauma-sim">{() => <CareerAISimulator toolId="trauma-sim" />}</Route>
        <Route path="/allied-health/paramedic/ecg-drill">{() => <CareerAISimulator toolId="ecg-drill" />}</Route>
        <Route path="/allied-health/pharmacy-tech/dosage-calc">{() => <CareerAISimulator toolId="dosage-calc" />}</Route>
        <Route path="/allied-health/pharmacy-tech/compounding-sim">{() => <CareerAISimulator toolId="compounding-sim" />}</Route>
        <Route path="/allied-health/mlt/lab-critical">{() => <CareerAISimulator toolId="lab-critical" />}</Route>
        <Route path="/allied-health/mlt/morphology-drill">{() => <CareerAISimulator toolId="morphology-drill" />}</Route>
        <Route path="/allied-health/imaging/anatomy-sim">{() => <CareerAISimulator toolId="anatomy-sim" />}</Route>
        <Route path="/allied-health/imaging/image-recognition">{() => <CareerAISimulator toolId="image-recognition" />}</Route>
        <Route path="/allied-health/psychotherapist/therapeutic-modality-sim">{() => <CareerAISimulator toolId="therapeutic-modality-sim" />}</Route>
        <Route path="/allied-health/psychotherapist/ethics-scenario-drill">{() => <CareerAISimulator toolId="ethics-scenario-drill" />}</Route>
        <Route path="/allied-health/social-worker/dsm5-diagnosis-sim">{() => <CareerAISimulator toolId="dsm5-diagnosis-sim" />}</Route>
        <Route path="/allied-health/social-worker/intervention-matching">{() => <CareerAISimulator toolId="intervention-matching" />}</Route>
        <Route path="/allied-health/addictions-counsellor/mi-practice-sim">{() => <CareerAISimulator toolId="mi-practice-sim" />}</Route>
        <Route path="/allied-health/addictions-counsellor/substance-id-drill">{() => <CareerAISimulator toolId="substance-id-drill" />}</Route>

        <Route path="/allied-health/rrt/questions/:topicSlug">{() => <AlliedQuestionSeoPage professionKey="rrt" />}</Route>
        <Route path="/allied-health/rrt/questions">{() => <AlliedQuestionsIndexPage professionKey="rrt" />}</Route>
        <Route path="/allied-health/mlt/questions/:topicSlug">{() => <AlliedQuestionSeoPage professionKey="mlt" />}</Route>
        <Route path="/allied-health/mlt/questions">{() => <AlliedQuestionsIndexPage professionKey="mlt" />}</Route>
        <Route path="/allied-health/imaging/questions/:topicSlug">{() => <AlliedQuestionSeoPage professionKey="imaging" />}</Route>
        <Route path="/allied-health/imaging/questions">{() => <AlliedQuestionsIndexPage professionKey="imaging" />}</Route>
        <Route path="/allied-health/occupational-therapy/questions/:topicSlug">{() => <AlliedQuestionSeoPage professionKey="occupationalTherapy" />}</Route>
        <Route path="/allied-health/occupational-therapy/questions">{() => <AlliedQuestionsIndexPage professionKey="occupationalTherapy" />}</Route>
        <Route path="/allied-health/physical-therapy/questions/:topicSlug">{() => <AlliedQuestionSeoPage professionKey="physicalTherapy" />}</Route>
        <Route path="/allied-health/physical-therapy/questions">{() => <AlliedQuestionsIndexPage professionKey="physicalTherapy" />}</Route>
        <Route path="/allied-health/surgical-technologist/questions/:topicSlug">{() => <AlliedQuestionSeoPage professionKey="surgicalTechnologist" />}</Route>
        <Route path="/allied-health/surgical-technologist/questions">{() => <AlliedQuestionsIndexPage professionKey="surgicalTechnologist" />}</Route>
        <Route path="/allied-health/health-info-mgmt/questions/:topicSlug">{() => <AlliedQuestionSeoPage professionKey="healthInfoMgmt" />}</Route>
        <Route path="/allied-health/health-info-mgmt/questions">{() => <AlliedQuestionsIndexPage professionKey="healthInfoMgmt" />}</Route>
        <Route path="/allied-health/diagnostic-sonography/questions/:topicSlug">{() => <AlliedQuestionSeoPage professionKey="diagnosticSonography" />}</Route>
        <Route path="/allied-health/diagnostic-sonography/questions">{() => <AlliedQuestionsIndexPage professionKey="diagnosticSonography" />}</Route>
        <Route path="/allied-health/cardiac-sonographer/questions/:topicSlug">{() => <AlliedQuestionSeoPage professionKey="cardiacSonographer" />}</Route>
        <Route path="/allied-health/cardiac-sonographer/questions">{() => <AlliedQuestionsIndexPage professionKey="cardiacSonographer" />}</Route>
        <Route path="/allied-health/paramedic" component={ParamedicLanding} />
        <Route path="/allied-health/mlt/exams" component={MltExamHub} />
        <Route path="/allied-health/mlt/exam/canada_realistic" component={MltCanadaExam} />
        <Route path="/allied-health/mlt/exam/usa_cat" component={MltUsaCatExam} />
        <Route path="/allied-health/mlt/exam/adaptive_practice" component={MltAdaptivePractice} />
        <Route path="/allied-health/mlt/exam/practice_exam" component={MltPracticeExam} />
        <Route path="/allied-health/mlt/exam/results/:sessionId" component={MltExamResults} />
        <Route path="/allied-health/mlt/exam/history" component={MltExamHistory} />
        <Route path="/allied-health/mlt/admin/cat" component={MltAdminCat} />
        <Route path="/allied-health/mlt/blog/:slug">{() => <MltBlog isPost />}</Route>
        <Route path="/allied-health/mlt/blog">{() => <MltBlog />}</Route>
        <Route path="/allied-health/mlt/lab-values/complete-chart" component={MltLabValuesCompleteChart} />
        <Route path="/allied-health/mlt/lab-values/top-50" component={MltLabValuesTop50} />
        <Route path="/allied-health/mlt/lab-values/:slug" component={MltLabValuePage} />
        <Route path="/allied-health/mlt/lab-values" component={MltLabValuesHub} />
        <Route path="/allied-health/mlt/microbiology/quick-guide" component={MltMicrobiologyQuickGuide} />
        <Route path="/allied-health/mlt/microbiology/:slug" component={MltMicrobiologyTopic} />
        <Route path="/allied-health/mlt/microbiology" component={MltMicrobiologyHub} />
        <Route path="/allied-health/mlt/canada/exam-prep">{() => <MltCountryPage country="canada" pageType="exam-prep" />}</Route>
        <Route path="/allied-health/mlt/canada/lessons">{() => <MltCountryPage country="canada" pageType="lessons" />}</Route>
        <Route path="/allied-health/mlt/canada/flashcards">{() => <MltCountryPage country="canada" pageType="flashcards" />}</Route>
        <Route path="/allied-health/mlt/canada/practice-exams">{() => <MltCountryPage country="canada" pageType="practice-exams" />}</Route>
        <Route path="/allied-health/mlt/canada/study-plan">{() => <MltCountryPage country="canada" pageType="study-plan" />}</Route>
        <Route path="/allied-health/mlt/canada/free-questions">{() => <MltCountryPage country="canada" pageType="free-questions" />}</Route>
        <Route path="/allied-health/mlt/canada/faq">{() => <MltCountryPage country="canada" pageType="faq" />}</Route>
        <Route path="/allied-health/mlt/usa/exam-prep">{() => <MltCountryPage country="usa" pageType="exam-prep" />}</Route>
        <Route path="/allied-health/mlt/usa/lessons">{() => <MltCountryPage country="usa" pageType="lessons" />}</Route>
        <Route path="/allied-health/mlt/usa/flashcards">{() => <MltCountryPage country="usa" pageType="flashcards" />}</Route>
        <Route path="/allied-health/mlt/usa/practice-exams">{() => <MltCountryPage country="usa" pageType="practice-exams" />}</Route>
        <Route path="/allied-health/mlt/usa/study-plan">{() => <MltCountryPage country="usa" pageType="study-plan" />}</Route>
        <Route path="/allied-health/mlt/usa/free-questions">{() => <MltCountryPage country="usa" pageType="free-questions" />}</Route>
        <Route path="/allied-health/mlt/usa/faq">{() => <MltCountryPage country="usa" pageType="faq" />}</Route>
        <Route path="/allied-health/mlt" component={MltLanding} />
        <Route path="/allied-health/radiologic-technologist/study">{() => {
          const d = IMAGING_CAREER_DATA["radiologic-technologist"];
          return <CareerStudyIndexPage hubData={PROFESSION_HUB_DATA["radiologic-technologist"]} studyTopics={d.studyTopics} featuredTopics={d.featuredTopics} mostTestedConcepts={d.mostTestedConcepts} studyTips={d.studyTips} />;
        }}</Route>
        <Route path="/allied-health/radiologic-technologist/flashcards">{() => <CareerFlashcardsIndexPage hubData={PROFESSION_HUB_DATA["radiologic-technologist"]} flashcardDecks={IMAGING_CAREER_DATA["radiologic-technologist"].flashcardDecks} />}</Route>
        <Route path="/allied-health/radiologic-technologist/exams">{() => <ImagingCareerExamsPage hubData={PROFESSION_HUB_DATA["radiologic-technologist"]} examEntries={IMAGING_CAREER_DATA["radiologic-technologist"].examEntries} />}</Route>
        <Route path="/allied-health/radiologic-technologist/career-guide">{() => <CareerCareerGuidePage hubData={PROFESSION_HUB_DATA["radiologic-technologist"]} careerGuide={IMAGING_CAREER_DATA["radiologic-technologist"].careerGuide} />}</Route>
        <Route path="/allied-health/radiologic-technologist">{() => <ProfessionHubPage data={PROFESSION_HUB_DATA["radiologic-technologist"]} />}</Route>

        <Route path="/allied-health/diagnostic-sonography/study">{() => {
          const d = IMAGING_CAREER_DATA["diagnostic-sonography"];
          return <CareerStudyIndexPage hubData={PROFESSION_HUB_DATA["diagnostic-sonography"]} studyTopics={d.studyTopics} featuredTopics={d.featuredTopics} mostTestedConcepts={d.mostTestedConcepts} studyTips={d.studyTips} />;
        }}</Route>
        <Route path="/allied-health/diagnostic-sonography/flashcards">{() => <CareerFlashcardsIndexPage hubData={PROFESSION_HUB_DATA["diagnostic-sonography"]} flashcardDecks={IMAGING_CAREER_DATA["diagnostic-sonography"].flashcardDecks} />}</Route>
        <Route path="/allied-health/diagnostic-sonography/exams">{() => <ImagingCareerExamsPage hubData={PROFESSION_HUB_DATA["diagnostic-sonography"]} examEntries={IMAGING_CAREER_DATA["diagnostic-sonography"].examEntries} />}</Route>
        <Route path="/allied-health/diagnostic-sonography/career-guide">{() => <CareerCareerGuidePage hubData={PROFESSION_HUB_DATA["diagnostic-sonography"]} careerGuide={IMAGING_CAREER_DATA["diagnostic-sonography"].careerGuide} />}</Route>
        <Route path="/allied-health/diagnostic-sonography">{() => <ProfessionHubPage data={PROFESSION_HUB_DATA["diagnostic-sonography"]} />}</Route>

        <Route path="/allied-health/cardiac-sonographer/study">{() => {
          const d = IMAGING_CAREER_DATA["cardiac-sonographer"];
          return <CareerStudyIndexPage hubData={PROFESSION_HUB_DATA["cardiac-sonographer"]} studyTopics={d.studyTopics} featuredTopics={d.featuredTopics} mostTestedConcepts={d.mostTestedConcepts} studyTips={d.studyTips} />;
        }}</Route>
        <Route path="/allied-health/cardiac-sonographer/flashcards">{() => <CareerFlashcardsIndexPage hubData={PROFESSION_HUB_DATA["cardiac-sonographer"]} flashcardDecks={IMAGING_CAREER_DATA["cardiac-sonographer"].flashcardDecks} />}</Route>
        <Route path="/allied-health/cardiac-sonographer/exams">{() => <ImagingCareerExamsPage hubData={PROFESSION_HUB_DATA["cardiac-sonographer"]} examEntries={IMAGING_CAREER_DATA["cardiac-sonographer"].examEntries} />}</Route>
        <Route path="/allied-health/cardiac-sonographer/career-guide">{() => <CareerCareerGuidePage hubData={PROFESSION_HUB_DATA["cardiac-sonographer"]} careerGuide={IMAGING_CAREER_DATA["cardiac-sonographer"].careerGuide} />}</Route>
        <Route path="/allied-health/cardiac-sonographer">{() => <ProfessionHubPage data={PROFESSION_HUB_DATA["cardiac-sonographer"]} />}</Route>

        <Route path="/allied-health/rrt/domain/:slug" component={RrtDomainTopicPage} />
        <Route path="/allied-health/rrt/pharmacology-qbank" component={RrtPharmacologyQBank} />
        <Route path="/allied-health/rrt/pharmacology/quick-sheets" component={RrtPharmQuickSheets} />
        <Route path="/allied-health/rrt/pharmacology/traps" component={RrtPharmTraps} />
        <Route path="/allied-health/rrt/pharmacology/mnemonics" component={RrtPharmMnemonics} />
        <Route path="/allied-health/rrt/pharmacology/one-minute-review" component={RrtPharmOneMinuteReview} />
        <Route path="/allied-health/rrt/pharmacology/:slug" component={RrtPharmacologyTopicPage} />
        <Route path="/allied-health/rrt/pharmacology" component={RrtPharmacologyHub} />
        <Route path="/allied-health/rrt">{() => <ProfessionHubPage data={PROFESSION_HUB_DATA["rrt"]} />}</Route>
        <Route path="/allied-health/imaging">{() => <ProfessionHubPage data={PROFESSION_HUB_DATA["imaging"]} />}</Route>
        <Route path="/allied-health/social-work/domains" component={SocialWorkDomainsPage} />
        <Route path="/allied-health/social-work/domain/:slug">{(params) => <SocialWorkDomainDetailWrapper slug={params.slug} />}</Route>
        <Route path="/allied-health/social-work/test-bank" component={SocialWorkTestBankPage} />
        <Route path="/allied-health/social-work">{() => <ProfessionHubPage data={PROFESSION_HUB_DATA["social-work"]} />}</Route>
        <Route path="/allied-health/psychotherapy">{() => <ProfessionHubPage data={PROFESSION_HUB_DATA["psychotherapy"]} />}</Route>
        <Route path="/allied-health/addictions">{() => <ProfessionHubPage data={PROFESSION_HUB_DATA["addictions"]} />}</Route>
        <Route path="/allied-health/occupational-therapy" component={OccupationalTherapyHub} />
        <Route path="/allied-health/physical-therapy" component={PhysicalTherapyHub} />

        <Route path="/allied-health/rrt/lessons">{() => <ProfessionClusterRedirect profession="rrt" clusterType="lessons" />}</Route>
        <Route path="/allied-health/rrt/practice-questions">{() => <ProfessionClusterRedirect profession="rrt" clusterType="practice-questions" />}</Route>
        
        <Route path="/allied-health/rrt/mock-exam">{() => <ProfessionClusterRedirect profession="rrt" clusterType="mock-exam" />}</Route>
        <Route path="/allied-health/rrt/study-guide">{() => <ProfessionClusterRedirect profession="rrt" clusterType="study-guide" />}</Route>

        <Route path="/allied-health/social-work/lessons">{() => <ProfessionClusterRedirect profession="social-work" clusterType="lessons" />}</Route>
        <Route path="/allied-health/social-work/practice-questions">{() => <ProfessionClusterRedirect profession="social-work" clusterType="practice-questions" />}</Route>
        
        <Route path="/allied-health/social-work/mock-exam">{() => <ProfessionClusterRedirect profession="social-work" clusterType="mock-exam" />}</Route>
        <Route path="/allied-health/social-work/study-guide">{() => <ProfessionClusterRedirect profession="social-work" clusterType="study-guide" />}</Route>

        <Route path="/allied-health/psychotherapy/lessons">{() => <ProfessionClusterRedirect profession="psychotherapy" clusterType="lessons" />}</Route>
        <Route path="/allied-health/psychotherapy/practice-questions">{() => <ProfessionClusterRedirect profession="psychotherapy" clusterType="practice-questions" />}</Route>
        
        <Route path="/allied-health/psychotherapy/mock-exam">{() => <ProfessionClusterRedirect profession="psychotherapy" clusterType="mock-exam" />}</Route>
        <Route path="/allied-health/psychotherapy/study-guide">{() => <ProfessionClusterRedirect profession="psychotherapy" clusterType="study-guide" />}</Route>

        <Route path="/allied-health/addictions/lessons">{() => <ProfessionClusterRedirect profession="addictions" clusterType="lessons" />}</Route>
        <Route path="/allied-health/addictions/practice-questions">{() => <ProfessionClusterRedirect profession="addictions" clusterType="practice-questions" />}</Route>
        
        <Route path="/allied-health/addictions/mock-exam">{() => <ProfessionClusterRedirect profession="addictions" clusterType="mock-exam" />}</Route>
        <Route path="/allied-health/addictions/study-guide">{() => <ProfessionClusterRedirect profession="addictions" clusterType="study-guide" />}</Route>

        <Route path="/allied-health/occupational-therapy/lessons">{() => <ProfessionClusterRedirect profession="occupational-therapy" clusterType="lessons" />}</Route>
        <Route path="/allied-health/occupational-therapy/practice-questions">{() => <ProfessionClusterRedirect profession="occupational-therapy" clusterType="practice-questions" />}</Route>
        
        <Route path="/allied-health/occupational-therapy/mock-exam">{() => <ProfessionClusterRedirect profession="occupational-therapy" clusterType="mock-exam" />}</Route>
        <Route path="/allied-health/occupational-therapy/study-guide">{() => <ProfessionClusterRedirect profession="occupational-therapy" clusterType="study-guide" />}</Route>

        <Route path="/allied-health/physical-therapy/lessons">{() => <ProfessionClusterRedirect profession="physical-therapy" clusterType="lessons" />}</Route>
        <Route path="/allied-health/physical-therapy/practice-questions">{() => <ProfessionClusterRedirect profession="physical-therapy" clusterType="practice-questions" />}</Route>
        
        <Route path="/allied-health/physical-therapy/mock-exam">{() => <ProfessionClusterRedirect profession="physical-therapy" clusterType="mock-exam" />}</Route>
        <Route path="/allied-health/physical-therapy/study-guide">{() => <ProfessionClusterRedirect profession="physical-therapy" clusterType="study-guide" />}</Route>

        <Route path="/allied-health/imaging/lessons">{() => <ProfessionClusterRedirect profession="imaging" clusterType="lessons" />}</Route>
        <Route path="/allied-health/imaging/practice-questions">{() => <ProfessionClusterRedirect profession="imaging" clusterType="practice-questions" />}</Route>
        <Route path="/allied-health/imaging/mock-exam">{() => <ProfessionClusterRedirect profession="imaging" clusterType="mock-exam" />}</Route>
        <Route path="/allied-health/imaging/study-guide">{() => <ProfessionClusterRedirect profession="imaging" clusterType="study-guide" />}</Route>

        <Route path="/allied-health/health-info-mgmt/lessons">{() => <ProfessionClusterRedirect profession="health-info-mgmt" clusterType="lessons" />}</Route>
        <Route path="/allied-health/health-info-mgmt/practice-questions">{() => <ProfessionClusterRedirect profession="health-info-mgmt" clusterType="practice-questions" />}</Route>
        <Route path="/allied-health/health-info-mgmt/mock-exam">{() => <ProfessionClusterRedirect profession="health-info-mgmt" clusterType="mock-exam" />}</Route>
        <Route path="/allied-health/health-info-mgmt/study-guide">{() => <ProfessionClusterRedirect profession="health-info-mgmt" clusterType="study-guide" />}</Route>
        <Route path="/allied-health/health-info-mgmt/study">{() => <CareerStudyPage careerSlug="health-info-mgmt" />}</Route>
        <Route path="/allied-health/health-info-mgmt/flashcards">{() => <CareerFlashcardsPage careerSlug="health-info-mgmt" />}</Route>
        <Route path="/allied-health/health-info-mgmt/exams">{() => <CareerExamsPage careerSlug="health-info-mgmt" />}</Route>
        <Route path="/allied-health/health-info-mgmt/career-guide">{() => <CareerGuideSubpage careerSlug="health-info-mgmt" />}</Route>
        <Route path="/allied-health/health-info-mgmt">{() => <ProfessionHubPage data={PROFESSION_HUB_DATA["health-info-mgmt"]} />}</Route>

        <Route path="/allied-health/occupational-therapy-assistant/lessons">{() => <ProfessionClusterRedirect profession="occupational-therapy-assistant" clusterType="lessons" />}</Route>
        <Route path="/allied-health/occupational-therapy-assistant/practice-questions">{() => <ProfessionClusterRedirect profession="occupational-therapy-assistant" clusterType="practice-questions" />}</Route>
        <Route path="/allied-health/occupational-therapy-assistant/mock-exam">{() => <ProfessionClusterRedirect profession="occupational-therapy-assistant" clusterType="mock-exam" />}</Route>
        <Route path="/allied-health/occupational-therapy-assistant/study-guide">{() => <ProfessionClusterRedirect profession="occupational-therapy-assistant" clusterType="study-guide" />}</Route>
        <Route path="/allied-health/occupational-therapy-assistant/study">{() => <CareerStudyPage careerSlug="occupational-therapy-assistant" />}</Route>
        <Route path="/allied-health/occupational-therapy-assistant/flashcards">{() => <CareerFlashcardsPage careerSlug="occupational-therapy-assistant" />}</Route>
        <Route path="/allied-health/occupational-therapy-assistant/exams">{() => <CareerExamsPage careerSlug="occupational-therapy-assistant" />}</Route>
        <Route path="/allied-health/occupational-therapy-assistant/career-guide">{() => <CareerGuideSubpage careerSlug="occupational-therapy-assistant" />}</Route>
        <Route path="/allied-health/occupational-therapy-assistant">{() => <ProfessionHubPage data={PROFESSION_HUB_DATA["occupational-therapy-assistant"]} />}</Route>

        <Route path="/allied-health/physiotherapy-assistant/guide/:slug">{() => <Suspense fallback={<div />}><PtaGuideRouter /></Suspense>}</Route>
        <Route path="/allied-health/physiotherapy-assistant/topic/:slug">{() => <Suspense fallback={<div />}><PtaTopicBankPage /></Suspense>}</Route>
        <Route path="/allied-health/physiotherapy-assistant/lessons">{() => <ProfessionClusterRedirect profession="physiotherapy-assistant" clusterType="lessons" />}</Route>
        <Route path="/allied-health/physiotherapy-assistant/practice-questions">{() => <ProfessionClusterRedirect profession="physiotherapy-assistant" clusterType="practice-questions" />}</Route>
        <Route path="/allied-health/physiotherapy-assistant/mock-exam">{() => <ProfessionClusterRedirect profession="physiotherapy-assistant" clusterType="mock-exam" />}</Route>
        <Route path="/allied-health/physiotherapy-assistant/study-guide">{() => <ProfessionClusterRedirect profession="physiotherapy-assistant" clusterType="study-guide" />}</Route>
        <Route path="/allied-health/physiotherapy-assistant/study">{() => <CareerStudyPage careerSlug="physiotherapy-assistant" />}</Route>
        <Route path="/allied-health/physiotherapy-assistant/flashcards">{() => <CareerFlashcardsPage careerSlug="physiotherapy-assistant" />}</Route>
        <Route path="/allied-health/physiotherapy-assistant/exams">{() => <CareerExamsPage careerSlug="physiotherapy-assistant" />}</Route>
        <Route path="/allied-health/physiotherapy-assistant/career-guide">{() => <CareerGuideSubpage careerSlug="physiotherapy-assistant" />}</Route>
        <Route path="/allied-health/physiotherapy-assistant">{() => <ProfessionHubPage data={PROFESSION_HUB_DATA["physiotherapy-assistant"]} />}</Route>

        <Route path="/allied-health/surgical-technologist/lessons">{() => <ProfessionClusterRedirect profession="surgical-technologist" clusterType="lessons" />}</Route>
        <Route path="/allied-health/surgical-technologist/practice-questions">{() => <ProfessionClusterRedirect profession="surgical-technologist" clusterType="practice-questions" />}</Route>
        <Route path="/allied-health/surgical-technologist/mock-exam">{() => <ProfessionClusterRedirect profession="surgical-technologist" clusterType="mock-exam" />}</Route>
        <Route path="/allied-health/surgical-technologist/study-guide">{() => <ProfessionClusterRedirect profession="surgical-technologist" clusterType="study-guide" />}</Route>
        <Route path="/allied-health/surgical-technologist/study">{() => <CareerStudyPage careerSlug="surgical-technologist" />}</Route>
        <Route path="/allied-health/surgical-technologist/flashcards">{() => <CareerFlashcardsPage careerSlug="surgical-technologist" />}</Route>
        <Route path="/allied-health/surgical-technologist/exams">{() => <CareerExamsPage careerSlug="surgical-technologist" />}</Route>
        <Route path="/allied-health/surgical-technologist/career-guide">{() => <CareerGuideSubpage careerSlug="surgical-technologist" />}</Route>
        <Route path="/allied-health/surgical-technologist">{() => <ProfessionHubPage data={PROFESSION_HUB_DATA["surgical-technologist"]} />}</Route>

        <Route path="/allied-health/paramedic-exam-prep" component={ParamedicExamPrepLanding} />
        <Route path="/allied-health/rrt-exam-prep" component={RrtExamPrepLanding} />
        <Route path="/allied-health/mlt-exam-prep" component={MltExamPrepLanding} />
        <Route path="/allied-health/radiography-exam-prep" component={RadiographyExamPrepLanding} />
        <Route path="/allied-health/social-work-exam-prep" component={SocialWorkExamPrepLanding} />
        <Route path="/allied-health/psychotherapy-exam-prep" component={PsychotherapyExamPrepLanding} />
        <Route path="/allied-health/addictions-counselling-exam-prep" component={AddictionsCounsellingExamPrepLanding} />
        <Route path="/allied-health/occupational-therapy-exam-prep" component={OccupationalTherapyExamPrepLanding} />
        <Route path="/allied-health/physical-therapy-exam-prep" component={PhysicalTherapyExamPrepLanding} />

        <Route path="/allied-health/occupational-therapy-practice-questions">{() => <AlliedSeoLanding pageSlug="occupational-therapy-practice-questions" />}</Route>
        <Route path="/allied-health/occupational-therapy-study-guide">{() => <AlliedSeoLanding pageSlug="occupational-therapy-study-guide" />}</Route>
        <Route path="/allied-health/physical-therapy-practice-questions">{() => <AlliedSeoLanding pageSlug="physical-therapy-practice-questions" />}</Route>
        <Route path="/allied-health/physical-therapy-study-guide">{() => <AlliedSeoLanding pageSlug="physical-therapy-study-guide" />}</Route>

        <Route path="/allied-health/social-worker-exam-prep">{() => <UnderservedSEOPage profession="social-worker" pageType="exam-prep" />}</Route>
        <Route path="/allied-health/social-worker-career-guide">{() => <UnderservedSEOPage profession="social-worker" pageType="career-guide" />}</Route>
        <Route path="/allied-health/social-worker-study-guide">{() => <UnderservedSEOPage profession="social-worker" pageType="study-guide" />}</Route>
        <Route path="/allied-health/social-worker-practice-questions">{() => <UnderservedSEOPage profession="social-worker" pageType="practice-questions" />}</Route>
        <Route path="/allied-health/psychotherapist-exam-prep">{() => <UnderservedSEOPage profession="psychotherapist" pageType="exam-prep" />}</Route>
        <Route path="/allied-health/psychotherapist-career-guide">{() => <UnderservedSEOPage profession="psychotherapist" pageType="career-guide" />}</Route>
        <Route path="/allied-health/psychotherapist-study-guide">{() => <UnderservedSEOPage profession="psychotherapist" pageType="study-guide" />}</Route>
        <Route path="/allied-health/psychotherapist-practice-questions">{() => <UnderservedSEOPage profession="psychotherapist" pageType="practice-questions" />}</Route>
        <Route path="/allied-health/addictions-counsellor-exam-prep">{() => <UnderservedSEOPage profession="addictions-counsellor" pageType="exam-prep" />}</Route>
        <Route path="/allied-health/addictions-counsellor-career-guide">{() => <UnderservedSEOPage profession="addictions-counsellor" pageType="career-guide" />}</Route>
        <Route path="/allied-health/addictions-counsellor-study-guide">{() => <UnderservedSEOPage profession="addictions-counsellor" pageType="study-guide" />}</Route>
        <Route path="/allied-health/addictions-counsellor-practice-questions">{() => <UnderservedSEOPage profession="addictions-counsellor" pageType="practice-questions" />}</Route>
        <Route path="/allied-health/occupational-therapy-career-guide">{() => <UnderservedSEOPage profession="occupational-therapy" pageType="career-guide" />}</Route>
        <Route path="/allied-health/physical-therapy-career-guide">{() => <UnderservedSEOPage profession="physical-therapy" pageType="career-guide" />}</Route>
        <Route path="/allied-health/occupational-therapist/test-bank" component={OTQuestionBankPage} />
        <Route path="/allied-health/occupational-therapist/question-bank">{() => <Redirect to="/allied-health/occupational-therapist/test-bank" />}</Route>
        <Route path="/allied-health/occupational-therapist/mock-exams" component={OTMockExamsPage} />
        <Route path="/allied-health/occupational-therapist/study-plan" component={OTStudyPlanPage} />
        <Route path="/allied-health/:careerSlug/question-bank">{(params) => <TestBankRedirect careerSlug={params.careerSlug} />}</Route>
        <Route path="/allied-health/:careerSlug/test-bank">{(params) => <TestBankRedirect careerSlug={params.careerSlug} />}</Route>
        <Route path="/allied-health/:careerSlug/flashcards/deck/:slug" component={DeckPage} />
        <Route path="/allied-health/:careerSlug/mock-exams/:id/report" component={MockExamReportPage} />
        <Route path="/allied-health/:careerSlug/mock-exams/:id" component={MockExamSessionPage} />
        <Route path="/allied-health/:careerSlug/mock-exams" component={AlliedMockExams} />
        <Route path="/allied-health/:careerSlug/dashboard" component={AlliedDashboard} />
        <Route path="/allied-health/:careerSlug/study-plan" component={AlliedStudyPlan} />
        <Route path="/allied-health/:careerSlug/flashcards" component={AlliedFlashcards} />
        <Route path="/allied-health/:careerSlug/pricing">{() => <Redirect to="/pricing?section=allied" />}</Route>
        <Route path="/allied-health/:careerSlug/sims" component={AlliedSims} />
        <Route path="/allied-health/:careerSlug/tools" component={AlliedTools} />

        <Route path="/allied-health/paramedic/scenarios/:slug" component={ParamedicScenarioPlayer} />
        <Route path="/allied-health/paramedic/scenarios" component={ParamedicScenariosHub} />
        <Route path="/allied-health/careers/paramedic/scenarios/:slug">{(params) => <Redirect to={`/allied-health/paramedic/scenarios/${params.slug}`} replace />}</Route>
        <Route path="/allied-health/careers/paramedic/scenarios">{() => <Redirect to="/allied-health/paramedic/scenarios" replace />}</Route>

        <Route path="/allied-health/careers/:careerSlug/mock-exams">{(params) => <CareerRedirect careerSlug={params.careerSlug} subPath="mock-exams" />}</Route>
        <Route path="/allied-health/careers/:careerSlug/dashboard">{(params) => <CareerRedirect careerSlug={params.careerSlug} subPath="dashboard" />}</Route>
        <Route path="/allied-health/careers/:careerSlug/study-plan">{(params) => <CareerRedirect careerSlug={params.careerSlug} subPath="study-plan" />}</Route>
        <Route path="/allied-health/careers/:careerSlug/flashcards">{(params) => <CareerRedirect careerSlug={params.careerSlug} subPath="flashcards" />}</Route>
        <Route path="/allied-health/careers/:careerSlug/sims">{(params) => <CareerRedirect careerSlug={params.careerSlug} subPath="sims" />}</Route>
        <Route path="/allied-health/careers/:careerSlug/tools">{(params) => <CareerRedirect careerSlug={params.careerSlug} subPath="tools" />}</Route>
        <Route path="/allied-health/careers/:careerSlug">{(params) => <CareerRedirect careerSlug={params.careerSlug} />}</Route>

        {/* Career Guide Pages - "How to become a..." */}
        <Route path="/allied-health/how-to-become-a-paramedic" component={CareerGuidePage} />
        <Route path="/allied-health/how-to-become-a-respiratory-therapist" component={CareerGuidePage} />
        <Route path="/allied-health/how-to-become-a-medical-lab-technologist" component={CareerGuidePage} />
        <Route path="/allied-health/how-to-become-a-radiologic-technologist" component={CareerGuidePage} />
        <Route path="/allied-health/how-to-become-a-social-worker" component={CareerGuidePage} />
        <Route path="/allied-health/how-to-become-a-psychotherapist" component={CareerGuidePage} />
        <Route path="/allied-health/how-to-become-an-addictions-counselor" component={CareerGuidePage} />
        <Route path="/allied-health/how-to-become-an-occupational-therapist" component={CareerGuidePage} />
        <Route path="/allied-health/how-to-become-a-physical-therapist" component={CareerGuidePage} />
        <Route path="/allied-health/how-to-become-a-pharmacy-technician" component={CareerGuidePage} />
        <Route path="/allied-health/how-to-become-a-health-information-manager" component={CareerGuidePage} />

        <Route path="/allied-health/respiratory-therapy-certification-guide">{() => <AlliedSeoLanding pageSlug="respiratory-therapy-certification-guide" />}</Route>
        <Route path="/allied-health/paramedic-certification-study-guide">{() => <AlliedSeoLanding pageSlug="paramedic-certification-study-guide" />}</Route>
        <Route path="/allied-health/mlt-certification-study-guide">{() => <AlliedSeoLanding pageSlug="mlt-certification-study-guide" />}</Route>
        <Route path="/allied-health/diagnostic-imaging-certification-guide">{() => <AlliedSeoLanding pageSlug="diagnostic-imaging-certification-guide" />}</Route>
        <Route path="/allied-health/occupational-therapy-certification-guide">{() => <AlliedSeoLanding pageSlug="occupational-therapy-certification-guide" />}</Route>
        <Route path="/allied-health/physical-therapy-certification-guide">{() => <AlliedSeoLanding pageSlug="physical-therapy-certification-guide" />}</Route>

        <Route path="/allied-health/surgical-technologist-practice-questions">{() => <AlliedSeoLanding pageSlug="surgical-technologist-practice-questions" />}</Route>
        <Route path="/allied-health/surgical-technologist-mock-exam">{() => <AlliedSeoLanding pageSlug="surgical-technologist-mock-exam" />}</Route>
        <Route path="/allied-health/surgical-technologist-study-guide">{() => <AlliedSeoLanding pageSlug="surgical-technologist-study-guide" />}</Route>
        <Route path="/allied-health/surgical-technologist-certification-guide">{() => <AlliedSeoLanding pageSlug="surgical-technologist-certification-guide" />}</Route>
        <Route path="/allied-health/surgical-technologist-sterile-technique-guide">{() => <AlliedSeoLanding pageSlug="surgical-technologist-sterile-technique-guide" />}</Route>
        <Route path="/allied-health/surgical-instruments-identification-guide">{() => <AlliedSeoLanding pageSlug="surgical-instruments-identification-guide" />}</Route>

        <Route path="/allied-health/health-info-mgmt-exam-prep">{() => <AlliedSeoLanding pageSlug="health-info-mgmt-exam-prep" />}</Route>
        <Route path="/allied-health/health-info-mgmt-practice-questions">{() => <AlliedSeoLanding pageSlug="health-info-mgmt-practice-questions" />}</Route>
        <Route path="/allied-health/health-info-mgmt-study-guide">{() => <AlliedSeoLanding pageSlug="health-info-mgmt-study-guide" />}</Route>
        <Route path="/allied-health/health-info-mgmt-career-guide">{() => <UnderservedSEOPage profession="health-info-mgmt" pageType="career-guide" />}</Route>

        <Route path="/allied-health/health-info-mgmt-encyclopedia/:slug">{() => <EncyclopediaTopicPage profession="health-info-mgmt" />}</Route>
        <Route path="/allied-health/health-info-mgmt-encyclopedia">{() => <EncyclopediaHubPage profession="health-info-mgmt" />}</Route>

        <Route path="/allied-health/respiratory-therapy">{() => <Redirect to="/allied-health/rrt" replace />}</Route>
        <Route path="/allied-health/medical-lab-tech">{() => <Redirect to="/allied-health/mlt" replace />}</Route>
        <Route path="/allied-health/pharmacy-tech/test-bank">{() => <Redirect to="/allied-health/pharmacy-technician/test-bank" />}</Route>
        <Route path="/allied-health/pharmacy-tech/mock-exams">{() => <Redirect to="/allied-health/pharmacy-technician/mock-exams" />}</Route>
        <Route path="/allied-health/pharmacy-tech">{() => <Redirect to="/allied-health/pharmacy-technician" replace />}</Route>
        <Route path="/account">{() => <AlliedDashboard />}</Route>
        <Route path="/profile">{() => <Redirect to="/account" />}</Route>

        <Route path="/allied-health/:professionSlug/:articleSlug" component={AlliedHealthArticlePage} />
        <Route path="/allied-health/:professionSlug" component={AlliedHealthProfessionPage} />
        <Route path="/allied-health" component={AlliedHealthHub} />
        <Route path="/admin/allied-health-seo" component={AdminAlliedHealthSEO} />
        <Route path="/admin/encyclopedia" component={EncyclopediaAdmin} />
        <Route path="/allied-health/paramedic-encyclopedia/:slug">{() => <EncyclopediaTopicPage profession="paramedic" />}</Route>
        <Route path="/allied-health/paramedic-encyclopedia">{() => <EncyclopediaHubPage profession="paramedic" />}</Route>
        <Route path="/allied-health/respiratory-therapy-encyclopedia/:slug">{() => <EncyclopediaTopicPage profession="respiratory-therapy" />}</Route>
        <Route path="/allied-health/respiratory-therapy-encyclopedia">{() => <EncyclopediaHubPage profession="respiratory-therapy" />}</Route>
        <Route path="/allied-health/mlt-encyclopedia/:slug">{() => <EncyclopediaTopicPage profession="mlt" />}</Route>
        <Route path="/allied-health/mlt-encyclopedia">{() => <EncyclopediaHubPage profession="mlt" />}</Route>
        <Route path="/allied-health/imaging-encyclopedia/:slug">{() => <EncyclopediaTopicPage profession="imaging" />}</Route>
        <Route path="/allied-health/imaging-encyclopedia">{() => <EncyclopediaHubPage profession="imaging" />}</Route>
        <Route path="/allied-health/social-work-encyclopedia/:slug">{() => <EncyclopediaTopicPage profession="social-work" />}</Route>
        <Route path="/allied-health/social-work-encyclopedia">{() => <EncyclopediaHubPage profession="social-work" />}</Route>
        <Route path="/allied-health/psychotherapy-encyclopedia/:slug">{() => <EncyclopediaTopicPage profession="psychotherapy" />}</Route>
        <Route path="/allied-health/psychotherapy-encyclopedia">{() => <EncyclopediaHubPage profession="psychotherapy" />}</Route>
        <Route path="/allied-health/addictions-encyclopedia/:slug">{() => <EncyclopediaTopicPage profession="addictions" />}</Route>
        <Route path="/allied-health/addictions-encyclopedia">{() => <EncyclopediaHubPage profession="addictions" />}</Route>
        <Route path="/allied-health/occupational-therapy-encyclopedia/:slug">{() => <EncyclopediaTopicPage profession="occupational-therapy" />}</Route>
        <Route path="/allied-health/occupational-therapy-encyclopedia">{() => <EncyclopediaHubPage profession="occupational-therapy" />}</Route>
        <Route path="/allied-health/physical-therapy-encyclopedia/:slug">{() => <EncyclopediaTopicPage profession="physical-therapy" />}</Route>
        <Route path="/allied-health/physical-therapy-encyclopedia">{() => <EncyclopediaHubPage profession="physical-therapy" />}</Route>

        <Route path="/allied-health/:professionSlug/articles" component={ArticleListingPage} />
        <Route path="/allied-health/:professionSlug/:articleSlug" component={ArticleDetailPage} />

        <Route path="/allied-health/:careerSlug/study-guide/:topicSlug">{() => <ProgrammaticSeoPage />}</Route>
        <Route path="/allied-health/:careerSlug/exam-tips/:topicSlug">{() => <ProgrammaticSeoPage />}</Route>
        <Route path="/allied-health/:careerSlug/clinical-scenarios/:topicSlug">{() => <ProgrammaticSeoPage />}</Route>
        <Route path="/allied-health/:careerSlug/practice-questions/:topicSlug">{() => <ProgrammaticSeoPage />}</Route>
        <Route path="/allied-health/:careerSlug/question-detail/:topicSlug">{() => <ProgrammaticSeoPage />}</Route>
        <Route path="/allied-health/:careerSlug/flashcard-detail/:topicSlug">{() => <ProgrammaticSeoPage />}</Route>

        <Route>
          {() => (
            <div className="max-w-2xl mx-auto px-4 py-20 text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("allied.alliedRoutes.pageNotFound")}</h1>
              <p className="text-gray-600">{t("allied.alliedRoutes.thePageYoureLookingFor")}</p>
              <a href="/" className="inline-block mt-4 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:brightness-110" data-testid="link-back-home">{t("allied.alliedRoutes.backToHome")}</a>
            </div>
          )}
        </Route>
      </Switch>
    </Suspense>
  );
}
