import { Navigation } from "@/components/navigation";
import { LocaleLink } from "@/lib/LocaleLink";
import { AdminEditButton } from "@/components/admin-edit-button";
import { SEO } from "@/components/seo";
import {
  BookOpen, ChevronRight, Target, Brain, Clock, Shield,
  AlertCircle, Lightbulb, CheckCircle, Heart
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";

import { useI18n } from "@/lib/i18n";
const strategies = [
  {
    title: "Reading the Stem",
    icon: BookOpen,
    tips: [
      "Read the entire question carefully before looking at the answer options.",
      "Identify what is being asked -- look for keywords like 'priority,' 'first,' 'best,' 'most appropriate,' or 'immediately.'",
      "Determine whether the question asks for the correct action or the action to avoid.",
      "Pay attention to the client's age, diagnosis, and specific clinical context in the scenario.",
      "Restate the question in your own words to confirm your understanding before selecting an answer.",
    ],
  },
  {
    title: "Process of Elimination",
    icon: Target,
    tips: [
      "Eliminate options that are clearly incorrect or unsafe before considering remaining choices.",
      "If two options seem similar, look for subtle differences that make one more appropriate for the specific scenario.",
      "Remove options that are outside the RPN scope of practice -- delegation to an RN or physician may be more appropriate.",
      "Watch for absolute terms like 'always,' 'never,' or 'only' -- these are frequently incorrect in clinical nursing.",
      "When unsure, choose the option that promotes patient safety and aligns with established clinical guidelines.",
    ],
  },
  {
    title: "Safety-First Thinking (ABCs, Maslow)",
    icon: Shield,
    tips: [
      "Apply the ABC framework: Airway first, then Breathing, then Circulation. Address life-threatening concerns before anything else.",
      "Use Maslow's hierarchy: physiological needs before safety, safety before belonging, belonging before esteem, esteem before self-actualization.",
      "When multiple patients need attention, prioritize the most unstable or deteriorating patient.",
      "Assess before intervening unless the situation is immediately life-threatening (e.g., cardiac arrest, active hemorrhage).",
      "Remember: the safest answer is usually the correct answer when in doubt.",
    ],
  },
  {
    title: "Pacing and Time Management",
    icon: Clock,
    tips: [
      "You have 4 hours for up to 150 questions. That is approximately 1.5 minutes per question on average.",
      "Do not spend more than 2 minutes on any single question. Make your best decision and move forward.",
      "Remember that you cannot go back to change previous answers in the CAT format. Commit to your answer and proceed.",
      "Take the optional break offered after 2 hours if you need to reset mentally.",
      "If you are running low on time, maintain your pace rather than rushing -- accuracy matters more than speed.",
    ],
  },
  {
    title: "Handling SATA Questions",
    icon: CheckCircle,
    tips: [
      "Treat each option as a true/false statement -- evaluate it independently against the clinical scenario.",
      "Do not assume there is a set number of correct answers. There may be two correct options or five.",
      "Select all options that are appropriate for the given scenario. Partial credit is not awarded -- you must select every correct option and no incorrect options.",
      "If unsure about one option, re-read the stem and evaluate whether that specific action is clinically appropriate.",
      "Common errors include selecting too few options out of caution or selecting too many by overthinking.",
    ],
  },
  {
    title: "Approaching Calculation Questions",
    icon: Target,
    tips: [
      "Read the question carefully and identify the given values: dose ordered, dose on hand, volume on hand.",
      "Use a consistent calculation method (dimensional analysis or ratio-proportion) and show your work on the provided note board.",
      "Double-check your units -- ensure consistency between mg, mcg, mL, and L. Metric units are used throughout.",
      "Use the on-screen calculator provided at the testing centre for arithmetic. Do not rely on mental math for complex calculations.",
      "Round according to question instructions. If no rounding direction is given, round to the nearest tenth for most medications.",
    ],
  },
  {
    title: "Managing Test Anxiety",
    icon: Heart,
    tips: [
      "Some anxiety is normal and can improve performance. Excessive anxiety impairs concentration and recall.",
      "If you feel overwhelmed during the exam, pause and take several slow, deep breaths before continuing.",
      "Focus on the current question only. Do not worry about previous questions or how many remain.",
      "The number of questions you receive does not indicate pass or fail. Stay focused regardless of question count.",
      "Prepare mentally in the days before the exam: visualize yourself completing the exam calmly and confidently.",
      "If you have a diagnosed anxiety condition, speak with your healthcare provider about strategies and consider requesting testing accommodations.",
    ],
  },
];

export default function RexPnStrategies() {
  const { t } = useI18n();
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <AdminEditButton />
      <SEO
        title={t("pages.rexPnStrategies.testtakingStrategiesForTheRexpn")}
        description={t("pages.rexPnStrategies.provenTesttakingStrategiesForThe")}
        canonicalPath="/rex-pn/strategies"
      />

      <main className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        <BreadcrumbNav title={t("pages.rexPnStrategies.testtakingStrategiesForTheRexpn2")} />
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
          <Badge variant="secondary" className="mb-3">{t("pages.rexPnStrategies.canadianRexpnExam")}</Badge>
          <h1
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
            data-testid="text-rex-pn-strategies-title"
          >
            Test-Taking Strategies for the REx-PN
          </h1>
          <p className="text-lg text-gray-600" data-testid="text-rex-pn-strategies-subtitle">
            Practical, evidence-informed strategies to help you approach the Canadian REx-PN exam with confidence and clarity.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-10">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1" data-testid="text-strategies-intro-heading">
                Strategies Are a Supplement, Not a Substitute
              </h3>
              <p className="text-blue-800 text-sm leading-relaxed">
                No test-taking strategy replaces solid content knowledge. These strategies are designed to help you apply what you know more effectively under exam conditions. Combine them with thorough content review and consistent practice.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {strategies.map((strategy, i) => {
            const Icon = strategy.icon;
            return (
              <Card key={i} className="border border-gray-200 overflow-hidden">
                <CardHeader className="bg-gray-50 border-b border-gray-100 pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="bg-primary/10 rounded-lg p-2">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <span data-testid={`text-strategy-title-${i}`}>{strategy.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5">
                  <ul className="space-y-3">
                    {strategy.tips.map((tip, j) => (
                      <li key={j} className="flex items-start gap-3">
                        <span className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                          {j + 1}
                        </span>
                        <p
                          className="text-gray-700 text-sm leading-relaxed"
                          data-testid={`text-strategy-${i}-tip-${j}`}
                        >
                          {tip}
                        </p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <section className="mt-12 mb-12">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-900 mb-2" data-testid="text-disclaimer-heading">{t("pages.rexPnStrategies.disclaimer")}</h3>
                <p className="text-amber-800 text-sm leading-relaxed" data-testid="text-disclaimer-content">
                  This is a training resource designed to help you prepare. It does not guarantee exam results. These strategies reflect general best practices for standardized nursing exams and should complement your personal study plan.
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
          <LocaleLink href="/rex-pn/exam-format" data-testid="link-rex-pn-exam-format-bottom">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
              Exam Format <ChevronRight className="w-4 h-4" />
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