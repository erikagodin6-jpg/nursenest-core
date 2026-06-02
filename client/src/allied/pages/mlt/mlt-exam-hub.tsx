import { useState } from "react";
import { useLocation } from "wouter";
import { Microscope, Clock, Brain, Target, BookOpen, Zap, BarChart3, Settings } from "lucide-react";

import { useI18n } from "@/lib/i18n";
const EXAM_MODES = [
  {
    id: "canada_realistic",
    title: "Canada CSMLS Exam",
    subtitle: "Fixed-length realistic exam",
    description: "120 questions, 3 hours. Blueprint-weighted scoring matching CSMLS format.",
    icon: Target,
    color: "bg-red-50 border-red-200",
    iconColor: "text-red-600",
    buttonColor: "bg-red-600 hover:bg-red-700",
    country: "CA",
  },
  {
    id: "usa_cat",
    title: "USA ASCP CAT Exam",
    subtitle: "Computer Adaptive Testing",
    description: "60–130 questions. Adaptive difficulty, one question at a time, no backtracking.",
    icon: Brain,
    color: "bg-blue-50 border-blue-200",
    iconColor: "text-blue-600",
    buttonColor: "bg-blue-600 hover:bg-blue-700",
    country: "US",
  },
  {
    id: "adaptive_practice",
    title: "Adaptive Practice",
    subtitle: "Smart remediation",
    description: "Focused practice adapting to your weak areas. Quick quiz, weak-area drill, or mixed discipline.",
    icon: Zap,
    color: "bg-purple-50 border-purple-200",
    iconColor: "text-purple-600",
    buttonColor: "bg-purple-600 hover:bg-purple-700",
    country: "both",
  },
  {
    id: "practice_exam",
    title: "Practice Exam",
    subtitle: "Customizable practice",
    description: "Topic filtering, timed/tutor/review modes, redo incorrect, save & resume.",
    icon: BookOpen,
    color: "bg-teal-50 border-teal-200",
    iconColor: "text-teal-600",
    buttonColor: "bg-teal-600 hover:bg-teal-700",
    country: "both",
  },
];

export default function MltExamHub() {
  const { t } = useI18n();
  const [, setLocation] = useLocation();

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Microscope className="w-8 h-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900" data-testid="text-mlt-exam-hub-title">{t("allied.mltMltExamHub.mltExamCenter")}</h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto" data-testid="text-mlt-exam-hub-subtitle">
          Comprehensive exam preparation for Medical Laboratory Technologists. Choose your exam mode to get started.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {EXAM_MODES.map((mode) => {
          const Icon = mode.icon;
          return (
            <div
              key={mode.id}
              className={`rounded-2xl border-2 p-6 ${mode.color} transition-all hover:shadow-lg`}
              data-testid={`card-exam-mode-${mode.id}`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl bg-white shadow-sm`}>
                  <Icon className={`w-6 h-6 ${mode.iconColor}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">{mode.title}</h3>
                  <p className="text-sm font-medium text-gray-500 mb-2">{mode.subtitle}</p>
                  <p className="text-sm text-gray-600 mb-4">{mode.description}</p>
                  <div className="flex items-center gap-2">
                    {mode.country === "both" ? (
                      <>
                        <button
                          onClick={() => setLocation(`/allied-health/mlt/exam/${mode.id}?country=CA`)}
                          className={`px-4 py-2 text-sm font-medium text-white rounded-xl ${mode.buttonColor}`}
                          data-testid={`button-start-${mode.id}-ca`}
                        >
                          🇨🇦 Canada
                        </button>
                        <button
                          onClick={() => setLocation(`/allied-health/mlt/exam/${mode.id}?country=US`)}
                          className={`px-4 py-2 text-sm font-medium text-white rounded-xl ${mode.buttonColor}`}
                          data-testid={`button-start-${mode.id}-us`}
                        >
                          🇺🇸 USA
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setLocation(`/allied-health/mlt/exam/${mode.id}?country=${mode.country}`)}
                        className={`px-4 py-2 text-sm font-medium text-white rounded-xl ${mode.buttonColor}`}
                        data-testid={`button-start-${mode.id}`}
                      >
                        Start Exam
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={() => setLocation("/allied-health/mlt/exam/history")}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200"
          data-testid="button-view-history"
        >
          <BarChart3 className="w-4 h-4" />
          View Exam History
        </button>
      </div>
    </div>
  );
}
