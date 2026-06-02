import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Clock, BarChart3, Trophy, Target, Microscope, ArrowRight } from "lucide-react";

import { useI18n } from "@/lib/i18n";
interface ExamHistoryItem {
  id: string;
  mode: string;
  country: string;
  subMode?: string;
  practiceMode?: string;
  totalQuestions: number;
  score: number | null;
  correctCount: number | null;
  abilityEstimate: number;
  status: string;
  startedAt: string;
  completedAt: string | null;
}

const modeLabels: Record<string, string> = {
  canada_realistic: "CSMLS Exam",
  usa_cat: "ASCP CAT",
  adaptive_practice: "Adaptive Practice",
  practice_exam: "Practice Exam",
};

const modeColors: Record<string, string> = {
  canada_realistic: "bg-red-100 text-red-700",
  usa_cat: "bg-blue-100 text-blue-700",
  adaptive_practice: "bg-purple-100 text-purple-700",
  practice_exam: "bg-teal-100 text-teal-700",
};

export default function MltExamHistory() {
  const { t } = useI18n();
  const [, setLocation] = useLocation();
  const [sessions, setSessions] = useState<ExamHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    try {
      const userToken = localStorage.getItem("nursenest-user-token");
      const headers: Record<string, string> = {};
      if (userToken) {
        headers["Authorization"] = `Bearer ${userToken}`;
      }
      const userRes = await fetch("/api/auth/me", { headers });
      if (!userRes.ok) {
        setLoading(false);
        return;
      }
      const user = await userRes.json();
      const res = await fetch(`/api/mlt/exam/history/${user.id}`, { headers });
      if (res.ok) {
        const data = await res.json();
        setSessions(data);
      }
    } catch {}
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Microscope className="w-7 h-7 text-purple-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900" data-testid="text-history-title">{t("allied.mltMltExamHistory.examHistory")}</h1>
          <p className="text-sm text-gray-500">{sessions.length} sessions</p>
        </div>
      </div>

      {sessions.length === 0 ? (
        <div className="text-center py-16">
          <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">{t("allied.mltMltExamHistory.noExamSessionsYetStart")}</p>
          <button
            onClick={() => setLocation("/allied-health/mlt/exams")}
            className="px-6 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700"
            data-testid="button-start-first-exam"
          >
            Go to Exam Hub
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                if (s.status === "completed") setLocation(`/allied-health/mlt/exam/results/${s.id}`);
                else setLocation(`/allied-health/mlt/exam/${s.mode}?resume=${s.id}`);
              }}
              className="w-full text-left bg-white rounded-2xl border p-5 hover:shadow-md transition-all"
              data-testid={`card-session-${s.id}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${modeColors[s.mode] || "bg-gray-100 text-gray-700"}`}>
                    {modeLabels[s.mode] || s.mode}
                  </span>
                  <span className="text-xs text-gray-400">{s.country === "CA" ? "🇨🇦" : "🇺🇸"}</span>
                  {s.subMode && (
                    <span className="text-xs text-gray-400 capitalize">{s.subMode.replace(/_/g, " ")}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {s.status === "completed" ? (
                    <span className={`text-lg font-bold ${(s.score || 0) >= 70 ? "text-green-600" : "text-orange-600"}`}>
                      {s.score}%
                    </span>
                  ) : (
                    <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">{t("allied.mltMltExamHistory.inProgress")}</span>
                  )}
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              <div className="mt-2 flex items-center gap-4 text-xs text-gray-400">
                <span>{new Date(s.startedAt).toLocaleDateString()}</span>
                <span>{s.totalQuestions} questions</span>
                {s.correctCount != null && <span>{s.correctCount} correct</span>}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
