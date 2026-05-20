import { Navigation } from "@/components/navigation";
import { LocaleLink } from "@/lib/LocaleLink";
import { AdminEditButton } from "@/components/admin-edit-button";
import { SEO } from "@/components/seo";
import {
  BookOpen, ChevronRight, Heart, Moon, Apple, Droplets,
  Activity, Timer, Brain, AlertCircle, Sun
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";

import { useI18n } from "@/lib/i18n";
const wellnessSections = [
  {
    title: "Sleep",
    subtitle: "7-9 hours per night",
    icon: Moon,
    color: "indigo",
    content: [
      "Aim for 7-9 hours of sleep each night during your study period. Sleep is when your brain consolidates information from the day's study sessions into long-term memory.",
      "Maintain a consistent sleep schedule -- go to bed and wake up at roughly the same time each day, including weekends.",
      "Avoid studying in bed. Keep your sleep space separate from your study space to strengthen the association between bed and rest.",
      "Reduce screen exposure for at least 30 minutes before bed. The blue light from phones and laptops can interfere with your body's natural sleep signals.",
      "If you are having difficulty sleeping due to exam-related worry, try a brief relaxation routine: slow breathing, progressive muscle relaxation, or writing down your concerns in a journal before bed.",
    ],
  },
  {
    title: "Nutrition",
    subtitle: "Fuel your brain",
    icon: Apple,
    color: "green",
    content: [
      "Your brain uses a significant amount of energy during focused study. Eating balanced meals supports sustained concentration and recall.",
      "Include protein at each meal (eggs, fish, beans, yogurt) along with complex carbohydrates (whole grains, vegetables) and healthy fats (nuts, avocado, olive oil).",
      "Omega-3 fatty acids, found in salmon, sardines, walnuts, and flaxseed, support brain function. Try to include them regularly in your diet.",
      "Avoid heavy meals right before study sessions. They can make you drowsy. Opt for lighter meals and nutritious snacks instead.",
      "Keep healthy snacks available for study sessions: mixed nuts, fruit, vegetables with hummus, or whole-grain crackers. Avoid relying on sugary snacks that cause energy crashes.",
    ],
  },
  {
    title: "Hydration",
    subtitle: "Stay consistently hydrated",
    icon: Droplets,
    color: "blue",
    content: [
      "Even mild dehydration can reduce concentration, increase fatigue, and impair short-term memory -- all of which affect study quality.",
      "Aim for 6-8 glasses of water per day. Keep a water bottle at your study desk as a visual reminder.",
      "If you rely on caffeine (coffee, tea), consume it in moderation. One to two cups in the morning can support alertness, but excessive caffeine increases anxiety and disrupts sleep.",
      "Limit caffeine after mid-afternoon to avoid interference with your sleep schedule.",
      "On exam day, bring water to the testing centre. You can access it during breaks to stay hydrated throughout the 4-hour exam.",
    ],
  },
  {
    title: "Exercise",
    subtitle: "Even walking helps",
    icon: Activity,
    color: "orange",
    content: [
      "Regular physical activity improves memory, concentration, mood, and sleep quality -- all critical during exam preparation.",
      "You do not need intense workouts. A 20-30 minute walk each day provides meaningful cognitive benefits.",
      "If you were physically active before your study period, continue your routine. If you were not, start with short walks and gradually increase duration.",
      "Use exercise as a study break. After a focused study block, step outside for a walk. You will return to your desk more alert and ready to retain new information.",
      "Stretching and light movement during study breaks also help reduce physical tension from prolonged sitting.",
    ],
  },
  {
    title: "Study Breaks",
    subtitle: "The Pomodoro approach",
    icon: Timer,
    color: "red",
    content: [
      "Studying for long, uninterrupted hours leads to diminishing returns. Your brain needs regular breaks to process and consolidate information.",
      "Try the Pomodoro technique: study for 25 minutes, then take a 5-minute break. After four cycles, take a longer break of 15-30 minutes.",
      "During breaks, step away from your study space. Move, stretch, or get fresh air. Avoid scrolling through social media, which can extend your break and increase distraction.",
      "Schedule one full rest day per week. Complete rest allows your brain to recover and actually improves retention compared to studying every day without pause.",
      "Listen to your body. If you are struggling to concentrate despite effort, a short break or change of activity may be more productive than pushing through.",
    ],
  },
  {
    title: "Mental Health",
    subtitle: "It is normal to feel stressed",
    icon: Heart,
    color: "pink",
    content: [
      "Preparing for a licensing exam is a significant life event. Feeling stressed, anxious, or overwhelmed at times is a normal response.",
      "Acknowledge your feelings without judgment. Telling yourself you 'should not' feel stressed only adds pressure. Accept that this is a demanding period and be compassionate with yourself.",
      "Maintain social connections. Spending time with friends, family, or fellow nursing graduates provides emotional support and perspective. Isolation during study periods increases stress.",
      "If anxiety is significantly interfering with your ability to study, sleep, or function, reach out for professional support. Speak with your family physician, a counsellor, or a mental health professional.",
      "Crisis resources in Canada include: Crisis Services Canada (1-833-456-4566), Kids Help Phone (1-800-668-6868), and 988 Suicide Crisis Helpline (call or text 988).",
      "Remember: preparing for this exam means you have already completed a nursing education program. You have the foundational knowledge. This exam is a confirmation of what you already know.",
    ],
  },
];

const colorClasses: Record<string, { bg: string; border: string; text: string; iconBg: string }> = {
  indigo: { bg: "bg-indigo-50", border: "border-indigo-100", text: "text-indigo-700", iconBg: "bg-indigo-100" },
  green: { bg: "bg-green-50", border: "border-green-100", text: "text-green-700", iconBg: "bg-green-100" },
  blue: { bg: "bg-blue-50", border: "border-blue-100", text: "text-blue-700", iconBg: "bg-blue-100" },
  orange: { bg: "bg-orange-50", border: "border-orange-100", text: "text-orange-700", iconBg: "bg-orange-100" },
  red: { bg: "bg-red-50", border: "border-red-100", text: "text-red-700", iconBg: "bg-red-100" },
  pink: { bg: "bg-pink-50", border: "border-pink-100", text: "text-pink-700", iconBg: "bg-pink-100" },
};

export default function RexPnWellness() {
  const { t } = useI18n();
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <AdminEditButton />
      <SEO
        title={t("pages.rexPnWellness.wellnessDuringRexpnPreparationSelfcare")}
        description={t("pages.rexPnWellness.evidencebasedWellnessTipsForRexpn")}
        canonicalPath="/rex-pn/wellness"
      />

      <main className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        <BreadcrumbNav title={t("pages.rexPnWellness.wellnessDuringRexpnPreparation")} />
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
          <Badge variant="secondary" className="mb-3">{t("pages.rexPnWellness.canadianRexpnExam")}</Badge>
          <h1
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
            data-testid="text-rex-pn-wellness-title"
          >
            Wellness During REx-PN Preparation
          </h1>
          <p className="text-lg text-gray-600" data-testid="text-rex-pn-wellness-subtitle">
            Your physical and mental well-being directly affect how well you study and perform on exam day. Taking care of yourself is part of your exam preparation.
          </p>
        </div>

        <div className="bg-green-50 border border-green-100 rounded-xl p-6 mb-10">
          <div className="flex items-start gap-3">
            <Sun className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-green-900 mb-1" data-testid="text-wellness-intro-heading">
                Self-Care Is Not Optional
              </h3>
              <p className="text-green-800 text-sm leading-relaxed">
                Research consistently shows that sleep, nutrition, exercise, and stress management improve academic performance. Neglecting wellness during intense study periods leads to diminishing returns, burnout, and poorer outcomes.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {wellnessSections.map((section, i) => {
            const Icon = section.icon;
            const colors = colorClasses[section.color] || colorClasses.blue;
            return (
              <Card key={i} className="border border-gray-200 overflow-hidden">
                <CardHeader className={`${colors.bg} ${colors.border} border-b pb-4`}>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className={`${colors.iconBg} rounded-lg p-2`}>
                      <Icon className={`w-5 h-5 ${colors.text}`} />
                    </div>
                    <div>
                      <span data-testid={`text-wellness-title-${i}`}>{section.title}</span>
                      <p className={`text-sm font-normal ${colors.text} mt-0.5`}>{section.subtitle}</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5">
                  <ul className="space-y-3">
                    {section.content.map((item, j) => (
                      <li key={j} className="flex items-start gap-3">
                        <span className="bg-gray-100 text-gray-500 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                          {j + 1}
                        </span>
                        <p
                          className="text-gray-700 text-sm leading-relaxed"
                          data-testid={`text-wellness-${i}-item-${j}`}
                        >
                          {item}
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
                <h3 className="font-semibold text-amber-900 mb-2" data-testid="text-disclaimer-heading">{t("pages.rexPnWellness.disclaimer")}</h3>
                <p className="text-amber-800 text-sm leading-relaxed" data-testid="text-disclaimer-content">
                  This page provides general wellness information for educational purposes. It is not a substitute for professional medical or mental health advice. If you are experiencing significant distress, please reach out to a qualified healthcare professional or crisis service.
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
          <LocaleLink href="/rex-pn/strategies" data-testid="link-rex-pn-strategies-bottom">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
              Test-Taking Strategies <ChevronRight className="w-4 h-4" />
            </span>
          </LocaleLink>
        </div>
      </main>
    </div>
  );
}