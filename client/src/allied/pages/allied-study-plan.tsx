import { useState } from "react";
import { useParams, Link } from "wouter";
import { getCareerByRouteSlug, getCanonicalRoute } from "@shared/careers";
import { AlliedSEO } from "@/allied/allied-seo";
import { GraduationCap, Calendar, Clock, Target, ChevronRight, CheckCircle2, BookOpen, Brain, FileText, Zap } from "lucide-react";

import { useI18n } from "@/lib/i18n";
export default function AlliedStudyPlanPage() {
  const { t } = useI18n();
  const params = useParams<{ careerSlug: string }>();
  const career = getCareerByRouteSlug(params.careerSlug || "");

  const [examDate, setExamDate] = useState("");
  const [hoursPerWeek, setHoursPerWeek] = useState("10");
  const [baselineScore, setBaselineScore] = useState("50");
  const [focusTopics, setFocusTopics] = useState<string[]>([]);
  const [planGenerated, setPlanGenerated] = useState(false);

  if (!career) {
    return <div className="max-w-2xl mx-auto px-4 py-20 text-center"><h1 className="text-2xl font-bold">{t("allied.alliedStudyPlan.careerNotFound")}</h1></div>;
  }

  const toggleTopic = (topic: string) => {
    setFocusTopics(prev => prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]);
  };

  const generatePlan = () => {
    setPlanGenerated(true);
  };

  const weeksUntilExam = examDate ? Math.max(1, Math.ceil((new Date(examDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 7))) : 4;

  const mockPlan = Array.from({ length: Math.min(weeksUntilExam, 8) }, (_, weekIdx) => ({
    week: weekIdx + 1,
    focus: career.domains[weekIdx % career.domains.length],
    tasks: [
      { type: "qbank", label: `Practice ${20 + weekIdx * 5} questions on ${career.domains[weekIdx % career.domains.length]}`, icon: BookOpen },
      { type: "flashcards", label: `Review flashcard deck: ${career.domains[(weekIdx + 1) % career.domains.length]}`, icon: Brain },
      { type: "mock", label: weekIdx % 2 === 0 ? "Take a mini mock exam" : "Review previous mock exam results", icon: FileText },
      { type: "sim", label: `Complete 1 case simulation`, icon: Zap },
    ],
  }));

  return (
    <>
    <AlliedSEO
      title={`${career.name} Study Plan - AI-Powered Exam Preparation`}
      description={`Get a personalized AI-generated ${career.name} study plan. Daily targets, weak-area focus, and domain-level scheduling optimized for your ${career.examNames[0]} exam date.`}
      keywords={`${career.name} study plan, ${career.name} study schedule, ${career.examNames[0]} exam prep plan, AI study planner, ${career.name} exam preparation`}
      canonicalPath={`/career/${params.careerSlug}/study-plan`}
    />
    <div className="max-w-4xl mx-auto px-4 py-8" data-testid="allied-study-plan-page">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href={getCanonicalRoute(career.slug)} className="hover:text-teal-600">{career.shortName}</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-teal-700 font-medium">{t("allied.alliedStudyPlan.studyPlan")}</span>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-2" data-testid="text-study-title">{career.shortName} AI Study Planner</h1>
      <p className="text-gray-600 mb-8">{t("allied.alliedStudyPlan.enterYourExamDetailsTo")}</p>

      {!planGenerated ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8" data-testid="study-plan-form">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">{t("allied.alliedStudyPlan.examDate")}</label>
              <input type="date" value={examDate} onChange={e => setExamDate(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-300" data-testid="input-exam-date" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">{t("allied.alliedStudyPlan.hoursPerWeek")}</label>
              <input type="number" min="1" max="40" value={hoursPerWeek} onChange={e => setHoursPerWeek(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-300" data-testid="input-hours" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">{t("allied.alliedStudyPlan.baselineDiagnosticScore")}</label>
              <input type="number" min="0" max="100" value={baselineScore} onChange={e => setBaselineScore(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-300" data-testid="input-baseline" />
            </div>
          </div>
          <div className="mb-6">
            <label className="text-sm font-medium text-gray-700 mb-2 block">{t("allied.alliedStudyPlan.focusTopicsOptional")}</label>
            <div className="flex flex-wrap gap-2">
              {career.domains.map(domain => (
                <button key={domain} onClick={() => toggleTopic(domain)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${focusTopics.includes(domain) ? "bg-teal-100 text-teal-700 border border-teal-300" : "bg-gray-100 text-gray-600 border border-transparent hover:bg-gray-200"}`} data-testid={`topic-${domain}`}>
                  {domain}
                </button>
              ))}
            </div>
          </div>
          <button onClick={generatePlan} className="w-full sm:w-auto px-8 py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-colors flex items-center justify-center gap-2" data-testid="button-generate-plan">
            <GraduationCap className="w-5 h-5" /> Generate My Study Plan
          </button>
        </div>
      ) : (
        <div data-testid="study-plan-result">
          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl border border-teal-100 p-6 mb-8 flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2"><Calendar className="w-5 h-5 text-teal-600" /><span className="text-sm"><strong>{weeksUntilExam}</strong> {t("allied.alliedStudyPlan.weeksUntilExam")}</span></div>
            <div className="flex items-center gap-2"><Clock className="w-5 h-5 text-teal-600" /><span className="text-sm"><strong>{hoursPerWeek}</strong> {t("allied.alliedStudyPlan.hoursweek")}</span></div>
            <div className="flex items-center gap-2"><Target className="w-5 h-5 text-teal-600" /><span className="text-sm">Baseline: <strong>{baselineScore}%</strong></span></div>
            <button onClick={() => setPlanGenerated(false)} className="ml-auto text-sm text-teal-600 font-medium hover:underline" data-testid="button-edit-plan">{t("allied.alliedStudyPlan.editPlan")}</button>
          </div>

          <div className="space-y-6">
            {mockPlan.map(week => (
              <div key={week.week} className="bg-white rounded-xl border border-gray-100 p-6" data-testid={`week-${week.week}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Week {week.week}</h3>
                  <span className="px-3 py-1 bg-teal-50 text-teal-700 rounded-lg text-xs font-medium">Focus: {week.focus}</span>
                </div>
                <div className="space-y-2">
                  {week.tasks.map((task, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-gray-700">
                      <div className="w-5 h-5 rounded border-2 border-gray-200 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-3 h-3 text-gray-300" />
                      </div>
                      <task.icon className="w-4 h-4 text-teal-500 flex-shrink-0" />
                      {task.label}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
    </>
  );
}
