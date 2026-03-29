import { Navigation } from "@/components/navigation";
import { LocaleLink } from "@/lib/LocaleLink";
import { AdminEditButton } from "@/components/admin-edit-button";
import { SEO } from "@/components/seo";
import {
  BookOpen, Clock, FileText, ChevronRight, Target, BarChart,
  CheckCircle, HelpCircle, AlertCircle
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";

import { useI18n } from "@/lib/i18n";
const questionFormats = [
  {
    title: "Multiple-Choice (MCQ) -- Single Best Answer",
    description: "Four answer options with one correct answer. Questions are written at the application and analysis cognitive levels, requiring you to apply nursing knowledge to realistic clinical scenarios rather than simply recalling facts.",
    icon: CheckCircle,
  },
  {
    title: "Select All That Apply (SATA)",
    description: "Multiple correct options from a list. You must identify all correct options without partial credit -- every correct option must be selected and no incorrect options can be selected for the item to be scored as correct.",
    icon: CheckCircle,
  },
  {
    title: "Numeric Fill-In (Dosage Calculations)",
    description: "Requires you to perform dosage calculations and enter a numerical answer. Calculations use metric units (mg, mL, kg). An on-screen calculator is provided at the testing centre.",
    icon: Target,
  },
  {
    title: "Graphic / Exhibit Items",
    description: "Questions that present images, diagrams, charts, or exhibits. You may need to identify anatomical structures, interpret assessment findings on images, or use visual data to answer questions.",
    icon: FileText,
  },
  {
    title: "Bowtie Items",
    description: "A newer item format that tests clinical reasoning across multiple dimensions. You identify the condition, select appropriate nursing actions, and determine parameters to monitor -- all connected through a central clinical scenario.",
    icon: Target,
  },
];

export default function RexPnExamFormat() {
  const { t } = useI18n();
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <AdminEditButton />
      <SEO
        title={t("pages.rexPnExamFormat.rexpnExamFormatAndStructure")}
        description={t("pages.rexPnExamFormat.completeGuideToTheRexpn")}
        canonicalPath="/rex-pn/exam-format"
      />

      <main className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        <BreadcrumbNav title={t("pages.rexPnExamFormat.rexpnExamFormatAndStructure2")} />
        <div className="mb-6">
          <LocaleLink
            href="/rex-pn"
            className="text-primary hover:underline text-sm flex items-center gap-1"
            data-testid="link-back-rex-pn-hub"
          >
            <ChevronRight className="w-4 h-4 rotate-180" /> Back to REx-PN Hub
          </LocaleLink>
        </div>

        <div className="mb-10">
          <Badge variant="secondary" className="mb-3">{t("pages.rexPnExamFormat.canadianRexpnExam")}</Badge>
          <h1
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
            data-testid="text-rex-pn-exam-format-title"
          >
            REx-PN Exam Format and Structure
          </h1>
          <p className="text-lg text-gray-600" data-testid="text-rex-pn-exam-format-subtitle">
            Everything you need to know about the structure, question types, timing, adaptive testing, and scoring of the Canadian REx-PN licensing exam.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-6 h-6 text-primary" />
            Exam Overview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <Card className="bg-blue-50 border-blue-100">
              <CardContent className="p-5 text-center">
                <p className="text-3xl font-bold text-blue-700" data-testid="text-exam-questions-range">90 - 150</p>
                <p className="text-sm text-blue-600 mt-1">{t("pages.rexPnExamFormat.questions")}</p>
              </CardContent>
            </Card>
            <Card className="bg-green-50 border-green-100">
              <CardContent className="p-5 text-center">
                <p className="text-3xl font-bold text-green-700" data-testid="text-exam-time-limit">{t("pages.rexPnExamFormat.4Hours")}</p>
                <p className="text-sm text-green-600 mt-1">{t("pages.rexPnExamFormat.maximumTime")}</p>
              </CardContent>
            </Card>
            <Card className="bg-purple-50 border-purple-100">
              <CardContent className="p-5 text-center">
                <p className="text-3xl font-bold text-purple-700" data-testid="text-exam-format-type">CAT</p>
                <p className="text-sm text-purple-600 mt-1">{t("pages.rexPnExamFormat.computerAdaptive")}</p>
              </CardContent>
            </Card>
          </div>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-4">
              The Regulatory Exam -- Practical Nurse (REx-PN) is the Canadian licensing examination for practical nurse candidates seeking registration as a Registered Practical Nurse (RPN). The exam is administered at Pearson VUE testing centres across Canada and is available in both English and French.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              The REx-PN replaced the Canadian Practical Nurse Registration Examination (CPNRE) as the national entry-to-practice exam. Candidates receive between 90 and 150 questions over a maximum of 4 hours. The actual number of questions depends on when the Computer Adaptive Testing (CAT) algorithm reaches a pass/fail decision with sufficient statistical confidence.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            Question Formats
          </h2>
          <div className="space-y-4">
            {questionFormats.map((format, i) => {
              const Icon = format.icon;
              return (
                <Card key={i} className="border border-gray-200">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 rounded-lg p-2 mt-1 flex-shrink-0">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3
                          className="font-semibold text-gray-900 mb-1"
                          data-testid={`text-question-format-${i}`}
                        >
                          {format.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{format.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart className="w-6 h-6 text-primary" />
            How Computer Adaptive Testing (CAT) Works
          </h2>
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="bg-primary text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
                <p className="text-gray-700" data-testid="text-cat-step-1">
                  The exam starts with a question at a moderate difficulty level. After you answer, the computer recalculates your estimated ability.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-primary text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
                <p className="text-gray-700" data-testid="text-cat-step-2">
                  If you answer correctly, the next question will generally be more difficult. If you answer incorrectly, the next question will generally be easier.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-primary text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
                <p className="text-gray-700" data-testid="text-cat-step-3">
                  This adaptive process continues until the algorithm has enough statistical confidence to determine whether you meet the passing standard, or you reach the maximum number of questions.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-primary text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold flex-shrink-0">4</span>
                <p className="text-gray-700" data-testid="text-cat-step-4">
                  You cannot go back and change previous answers. Each subsequent question depends on your response to the previous one.
                </p>
              </div>
            </div>
          </div>
          <p className="text-gray-700 leading-relaxed">
            CAT is more efficient than traditional fixed-length exams because it focuses on questions near your ability level, providing a precise measurement with fewer questions. The number of questions you receive does not indicate whether you passed or failed -- it reflects how long the algorithm needed to reach a confident decision.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-primary" />
            Scoring: Pass / Fail
          </h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-4">
              The REx-PN uses a criterion-referenced passing standard. This means the pass/fail decision is based on whether you demonstrate the minimum competency required for safe entry-level practical nursing practice -- not on how other candidates perform. There is no curve.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Results are reported as pass or fail only. The exact passing standard (logit value) is not publicly disclosed. Candidates who do not pass receive a Candidate Performance Report (CPR) showing performance in each content area relative to the passing standard.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Results are typically available within 2-4 business days after the exam through your provincial or territorial nursing regulatory body. In Ontario, the College of Nurses of Ontario (CNO) communicates results directly to candidates.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-900 mb-2" data-testid="text-disclaimer-heading">{t("pages.rexPnExamFormat.disclaimer")}</h3>
                <p className="text-amber-800 text-sm leading-relaxed" data-testid="text-disclaimer-content">
                  This page provides general information about the REx-PN exam format for educational purposes. It is not affiliated with or endorsed by NCSBN, Pearson VUE, or any Canadian nursing regulatory body. For official exam information, contact your provincial or territorial nursing regulatory body directly.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="flex flex-wrap gap-3">
          <LocaleLink href="/rex-pn" data-testid="link-rex-pn-hub-bottom">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium">
              <BookOpen className="w-4 h-4" /> Back to REx-PN Hub
            </span>
          </LocaleLink>
          <LocaleLink href="/rex-pn/strategies" data-testid="link-rex-pn-strategies-bottom">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
              Test-Taking Strategies <ChevronRight className="w-4 h-4" />
            </span>
          </LocaleLink>
          <LocaleLink href="/rex-pn/wellness" data-testid="link-rex-pn-wellness-bottom">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
              Wellness Tips <ChevronRight className="w-4 h-4" />
            </span>
          </LocaleLink>
        </div>
      </main>
    </div>
  );
}