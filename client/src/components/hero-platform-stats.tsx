import { useQuery } from "@tanstack/react-query";
import type { PlatformProof } from "@shared/lesson-stats";
import {
  HelpCircle,
  FileText,
  Layers,
  BookOpen,
  Stethoscope,
  Globe,
  Languages,
  ClipboardCheck,
} from "lucide-react";

function formatStat(n: number | undefined): string {
  if (!n || n === 0) return "---";
  if (n >= 10000) {
    const thousands = Math.floor(n / 1000);
    return `${thousands.toLocaleString()},000+`;
  }
  if (n >= 1000) {
    const hundreds = Math.floor(n / 100) * 100;
    return `${hundreds.toLocaleString()}+`;
  }
  const tens = Math.floor(n / 10) * 10;
  return `${tens}+`;
}

export default function HeroPlatformStats() {
  const { data: proof } = useQuery<PlatformProof>({
    queryKey: ["/api/public/platform-proof"],
    staleTime: 15 * 60 * 1000,
  });

  const stats = [
    { icon: HelpCircle, label: "Practice Questions", value: formatStat(proof?.totalQuestions), color: "text-blue-600", bg: "bg-blue-50" },
    { icon: ClipboardCheck, label: "Mock Exams", value: "50+", color: "text-indigo-600", bg: "bg-indigo-50" },
    { icon: Layers, label: "Flashcards", value: formatStat(proof?.totalFlashcards), color: "text-violet-600", bg: "bg-violet-50" },
    { icon: BookOpen, label: "Lessons", value: formatStat(proof?.totalLessons), color: "text-emerald-600", bg: "bg-emerald-50" },
    { icon: Stethoscope, label: "Clinical Simulations", value: "25+", color: "text-rose-600", bg: "bg-rose-50" },
    { icon: FileText, label: "Supported Exams", value: "30+", color: "text-amber-600", bg: "bg-amber-50" },
    { icon: Globe, label: "Countries", value: "10+", color: "text-teal-600", bg: "bg-teal-50" },
    { icon: Languages, label: "Languages", value: "20", color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <section
      className="bg-gradient-to-b from-gray-50 to-white border-y border-gray-100"
      style={{ paddingTop: "var(--space-block)", paddingBottom: "var(--space-block)" }}
      data-testid="section-platform-stats"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2
            className="font-bold text-gray-900 mb-2"
            style={{ fontSize: "var(--text-section)" }}
            data-testid="text-platform-stats-heading"
          >
            Your Complete Healthcare Exam Preparation Platform
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-base lg:text-lg">
            Everything you need to pass your nursing, NP, or allied health exam — built by educators, backed by evidence.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl border border-gray-100 shadow-[var(--shadow-card)] p-5 text-center hover:shadow-[var(--shadow-card-hover)] transition-shadow duration-200"
              data-testid={`stat-card-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <div className={`w-11 h-11 rounded-xl ${stat.bg} flex items-center justify-center mx-auto mb-3`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-1" data-testid={`stat-value-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}>
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm font-medium text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
