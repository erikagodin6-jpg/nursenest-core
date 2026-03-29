import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { LocaleLink } from "@/lib/LocaleLink";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  BookOpen,
  AlertTriangle,
  Lightbulb,
  ChevronRight,
  Stethoscope,
  TestTube,
  Pill,
  Scale,
  Target,
  Shield,
  CheckCircle,
  Lock,
} from "lucide-react";
import { useParams, useLocation } from "wouter";
import { useI18n } from "@/lib/i18n";
import {
  getRexPnPageBySlug,
  getFullPath,
  type RexPnPage,
  type RexPnPageType,
} from "@/data/rex-pn-hub-content";

function getTypeIcon(type: RexPnPageType) {

  switch (type) {
    case "condition": return Stethoscope;
    case "lab-value": return TestTube;
    case "medication": return Pill;
    case "comparison": return Scale;
    case "strategy": return Target;
    case "question-bank": return BookOpen;
    default: return BookOpen;
  }
}

function getTypeColor(type: RexPnPageType) {
  switch (type) {
    case "condition": return { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", iconColor: "text-blue-600" };
    case "lab-value": return { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", iconColor: "text-emerald-600" };
    case "medication": return { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700", iconColor: "text-purple-600" };
    case "comparison": return { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", iconColor: "text-amber-600" };
    case "strategy": return { bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-700", iconColor: "text-rose-600" };
    case "question-bank": return { bg: "bg-indigo-50", border: "border-indigo-200", text: "text-indigo-700", iconColor: "text-indigo-600" };
    default: return { bg: "bg-gray-50", border: "border-gray-200", text: "text-gray-700", iconColor: "text-gray-600" };
  }
}

function getTypeLabel(type: RexPnPageType) {
  switch (type) {
    case "condition": return "Clinical Condition";
    case "lab-value": return "Lab Value";
    case "medication": return "Medication Guide";
    case "comparison": return "Comparison";
    case "strategy": return "Study Strategy";
    case "question-bank": return "Practice Questions";
    default: return "REx-PN Resource";
  }
}

function getBreadcrumbParent(type: RexPnPageType): { name: string; url: string } {
  switch (type) {
    case "condition": return { name: "Top Conditions", url: "https://www.nursenest.ca/rex-pn/top-conditions" };
    case "lab-value": return { name: "Lab Values", url: "https://www.nursenest.ca/rex-pn/lab-values" };
    case "medication": return { name: "Medications", url: "https://www.nursenest.ca/rex-pn/medications" };
    case "comparison": return { name: "Top Conditions", url: "https://www.nursenest.ca/rex-pn/top-conditions" };
    default: return { name: "REx-PN Hub", url: "https://www.nursenest.ca/rex-pn" };
  }
}

function ComparisonTable({ page }: { page: RexPnPage }) {
  if (!page.comparisonRows) return null;
  return (
    <div className="overflow-x-auto my-8" data-testid="section-comparison-table">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="text-left p-3 bg-gray-100 border border-gray-200 font-semibold text-gray-700 text-sm">{t("pages.rexPnContentPage.feature")}</th>
            <th className="text-left p-3 bg-blue-50 border border-gray-200 font-semibold text-blue-700 text-sm">{page.comparisonLeftLabel}</th>
            <th className="text-left p-3 bg-emerald-50 border border-gray-200 font-semibold text-emerald-700 text-sm">{page.comparisonRightLabel}</th>
          </tr>
        </thead>
        <tbody>
          {page.comparisonRows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              <td className="p-3 border border-gray-200 font-medium text-gray-900 text-sm" data-testid={`comparison-feature-${i}`}>{row.feature}</td>
              <td className="p-3 border border-gray-200 text-gray-700 text-sm" data-testid={`comparison-left-${i}`}>{row.left}</td>
              <td className="p-3 border border-gray-200 text-gray-700 text-sm" data-testid={`comparison-right-${i}`}>{row.right}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function QuestionPreview({ page }: { page: RexPnPage }) {
  if (!page.questions || page.questions.length === 0) return null;
  return (
    <section className="py-10" data-testid="section-question-preview">
      <h2 className="text-2xl font-bold text-gray-900 mb-6" data-testid="text-preview-questions-heading">{t("pages.rexPnContentPage.freePreviewQuestions")}</h2>
      <div className="space-y-6">
        {page.questions.map((q, i) => (
          <Card key={i} className="border border-gray-200" data-testid={`card-question-${i}`}>
            <CardContent className="p-6">
              <p className="font-semibold text-gray-900 mb-4" data-testid={`text-question-stem-${i}`}>
                <span className="text-primary mr-2">Q{i + 1}.</span>{q.stem}
              </p>
              <div className="space-y-2 mb-4">
                {q.options.map((opt, j) => (
                  <div
                    key={j}
                    className={`p-3 rounded-lg text-sm border ${j === q.correctIndex ? "bg-green-50 border-green-300 text-green-800" : "bg-gray-50 border-gray-200 text-gray-700"}`}
                    data-testid={`option-${i}-${j}`}
                  >
                    <span className="font-medium mr-2">{String.fromCharCode(65 + j)}.</span>
                    {opt}
                    {j === q.correctIndex && <CheckCircle className="inline w-4 h-4 ml-2 text-green-600" />}
                  </div>
                ))}
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-blue-800 mb-1">{t("pages.rexPnContentPage.rationale")}</p>
                <p className="text-sm text-blue-700" data-testid={`text-rationale-${i}`}>{q.rationale}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="mt-6 border-2 border-dashed border-primary/30 bg-primary/5" data-testid="card-premium-cta">
        <CardContent className="p-6 text-center">
          <Lock className="w-8 h-8 text-primary mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">{t("pages.rexPnContentPage.unlockTheFullQuestionBank")}</h3>
          <p className="text-sm text-gray-600 mb-4">{t("pages.rexPnContentPage.accessHundredsMoreRexpnPractice")}</p>
          <LocaleLink href="/free-practice">
            <Button className="gap-2" data-testid="button-unlock-questions">
              Start Free Practice <ArrowRight className="w-4 h-4" />
            </Button>
          </LocaleLink>
        </CardContent>
      </Card>
    </section>
  );
}

function RexPnContentPageView({ page }: { page: RexPnPage }) {
  const [, setLocation] = useLocation();
  const colors = getTypeColor(page.type);
  const TypeIcon = getTypeIcon(page.type);
  const typeLabel = getTypeLabel(page.type);
  const breadcrumbParent = getBreadcrumbParent(page.type);
  const pagePath = getFullPath(page);

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <SEO
        title={page.seoTitle}
        description={page.seoDescription}
        keywords={page.seoKeywords}
        canonicalPath={pagePath}
      />
      <Navigation />

      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BreadcrumbNav items={[
            { name: "Home", url: "https://www.nursenest.ca/" },
            { name: "REx-PN Hub", url: "https://www.nursenest.ca/rex-pn" },
            breadcrumbParent,
            { name: page.title, url: `https://www.nursenest.ca${pagePath}` },
          ]} />

          <LocaleLink href="/rex-pn">
            <span className="inline-flex items-center text-sm text-primary hover:underline mt-4 mb-6 cursor-pointer" data-testid="link-back-to-hub">
              ← Back to REx-PN Hub
            </span>
          </LocaleLink>

          <header className="mb-8" data-testid="section-page-header">
            <Badge className={`${colors.bg} ${colors.text} ${colors.border} border mb-4`} data-testid="badge-page-type">
              <TypeIcon className={`w-3.5 h-3.5 mr-1.5 ${colors.iconColor}`} />
              {typeLabel} · Canadian REx-PN Exam
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-3" data-testid="text-page-heading">
              {page.heading}
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed" data-testid="text-page-subtitle">
              {page.subtitle}
            </p>
            {page.normalRange && (
              <div className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg ${colors.bg} ${colors.border} border`} data-testid="text-normal-range">
                <TestTube className={`w-4 h-4 ${colors.iconColor}`} />
                <span className={`text-sm font-semibold ${colors.text}`}>Normal Range: {page.normalRange}</span>
              </div>
            )}
            {page.drugClass && (
              <div className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg ${colors.bg} ${colors.border} border`} data-testid="text-drug-class">
                <Pill className={`w-4 h-4 ${colors.iconColor}`} />
                <span className={`text-sm font-semibold ${colors.text}`}>Class: {page.drugClass}</span>
              </div>
            )}
          </header>

          {page.type === "comparison" && <ComparisonTable page={page} />}

          <div className="space-y-8" data-testid="section-content-body">
            {page.sections.map((section, i) => (
              <section key={i} data-testid={`section-content-${i}`}>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3" data-testid={`text-section-heading-${i}`}>
                  {section.heading}
                </h2>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line" data-testid={`text-section-content-${i}`}>
                  {section.content}
                </div>
              </section>
            ))}
          </div>

          {page.type === "question-bank" && <QuestionPreview page={page} />}

          {page.examPearls && page.examPearls.length > 0 && (
            <section className="mt-10 bg-amber-50 border border-amber-200 rounded-2xl p-6" data-testid="section-exam-pearls">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-amber-600" />
                <h2 className="text-xl font-bold text-gray-900">{t("pages.rexPnContentPage.examPearls")}</h2>
              </div>
              <ul className="space-y-3">
                {page.examPearls.map((pearl, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-700" data-testid={`text-pearl-${i}`}>
                    <CheckCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>{pearl}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {page.relatedPages.length > 0 && (
            <section className="mt-10" data-testid="section-related-pages">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{t("pages.rexPnContentPage.relatedPages")}</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {page.relatedPages.map((link, i) => (
                  <LocaleLink key={i} href={link.href}>
                    <div
                      className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-xl p-4 border border-gray-100 transition-colors cursor-pointer group"
                      data-testid={`link-related-${i}`}
                    >
                      <span className="font-medium text-gray-900 group-hover:text-primary transition-colors text-sm">{link.title}</span>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors shrink-0 ml-2" />
                    </div>
                  </LocaleLink>
                ))}
              </div>
            </section>
          )}

          <section className="mt-10 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100" data-testid="section-hub-cta">
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-2">{t("pages.rexPnContentPage.continueYourRexpnPreparation")}</h2>
              <p className="text-sm text-gray-600 mb-4">{t("pages.rexPnContentPage.accessPracticeQuestionsMockExams")}</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button onClick={() => setLocation("/free-practice")} className="gap-2" data-testid="button-start-practice">
                  Start Free Practice <ArrowRight className="w-4 h-4" />
                </Button>
                <LocaleLink href="/rex-pn">
                  <Button variant="outline" className="gap-2" data-testid="button-explore-hub">
                    Explore REx-PN Hub <BookOpen className="w-4 h-4" />
                  </Button>
                </LocaleLink>
              </div>
            </div>
          </section>

          <section className="mt-8 mb-4" data-testid="section-medical-review">
            <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4 border border-gray-200">
              <Shield className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-gray-800">{t("pages.rexPnContentPage.medicallyReviewedContent")}</p>
                <p className="text-xs text-gray-500 mt-1">
                  This content has been developed and reviewed by healthcare professionals for accuracy. It is intended for educational purposes only and does not replace professional medical advice. Always consult your regulatory body for official exam information.
                </p>
              </div>
            </div>
          </section>

          <section className="mt-4 mb-8" data-testid="section-disclaimer">
            <div className="flex items-start gap-3 bg-amber-50 rounded-xl p-4 border border-amber-200">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-gray-600">
                NurseNest is not affiliated with, endorsed by, or connected to NCSBN, any provincial or territorial nursing regulatory body, or Pearson VUE. All content is developed independently for educational purposes.
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function RexPnContentPage() {
  const params = useParams();
  const slug = (params as any).slug || (params as any)["0"] || "";
  const page = getRexPnPageBySlug(slug);

  if (!page) {
    return (
      <div className="min-h-screen bg-white flex flex-col font-sans">
        <Navigation />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center" data-testid="section-not-found">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("pages.rexPnContentPage.pageNotFound")}</h1>
            <p className="text-gray-600 mb-4">{t("pages.rexPnContentPage.theRequestedRexpnContentPage")}</p>
            <LocaleLink href="/rex-pn">
              <Button data-testid="button-back-to-hub">{t("pages.rexPnContentPage.backToRexpnHub")}</Button>
            </LocaleLink>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return <RexPnContentPageView page={page} />;
}

export function RexPnConditionPage() {
  const params = useParams();
  const slug = (params as any).slug || "";
  const page = getRexPnPageBySlug(slug);
  if (!page || page.type !== "condition") {
    return <RexPnContentPage />;
  }
  return <RexPnContentPageView page={page} />;
}

export function RexPnLabPage() {
  const params = useParams();
  const slug = (params as any).slug || "";
  const page = getRexPnPageBySlug(slug);
  if (!page || page.type !== "lab-value") {
    return <RexPnContentPage />;
  }
  return <RexPnContentPageView page={page} />;
}

export function RexPnMedicationPage() {
  const params = useParams();
  const slug = (params as any).slug || "";
  const page = getRexPnPageBySlug(slug);
  if (!page || page.type !== "medication") {
    return <RexPnContentPage />;
  }
  return <RexPnContentPageView page={page} />;
}

export function RexPnComparisonPage() {
  const params = useParams();
  const slug = (params as any).slug || "";
  const page = getRexPnPageBySlug(slug);
  if (!page || page.type !== "comparison") {
    return <RexPnContentPage />;
  }
  return <RexPnContentPageView page={page} />;
}
