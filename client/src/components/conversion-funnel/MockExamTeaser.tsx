import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LocaleLink } from "@/lib/LocaleLink";
import { useAuth } from "@/lib/auth";
import { getMockExamCountByExamCode } from "@/lib/flagship-mock-exam-configs";
import { useI18n } from "@/lib/i18n";
import {
  GraduationCap,
  Clock,
  Brain,
  BarChart3,
  Target,
  ArrowRight,
  Shield,
  FileText,
} from "lucide-react";

interface MockExamTeaserProps {
  profession?: string;
  examCode?: string;
}

const PROFESSION_TO_EXAM_CODE: Record<string, string[]> = {
  nursing: ["NCLEX-RN", "NCLEX-PN", "REX-PN"],
  rn: ["NCLEX-RN"],
  rpn: ["NCLEX-PN", "REX-PN"],
  np: ["AANP", "ANCC", "AGNP", "ACNP"],
  fnp: ["AANP", "ANCC"],
};

function useMockExamCounts(): Record<string, number> {
  const { t } = useI18n();
  const [counts, setCounts] = useState<Record<string, number>>(getMockExamCountByExamCode());

  useEffect(() => {
    fetch("/api/mock-exam-templates/counts/by-exam")
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data && Object.keys(data).length > 0) {
          setCounts(data);
        }
      })
      .catch(() => {});
  }, []);

  return counts;
}

export function MockExamTeaser({ profession, examCode }: MockExamTeaserProps) {
  const { user } = useAuth();
  const counts = useMockExamCounts();

  let mockExamCount = 0;
  if (examCode && counts[examCode]) {
    mockExamCount = counts[examCode];
  } else if (profession) {
    const codes = PROFESSION_TO_EXAM_CODE[profession.toLowerCase()] || [];
    mockExamCount = codes.reduce((sum, code) => sum + (counts[code] || 0), 0);
  } else {
    mockExamCount = Object.values(counts).reduce((sum, c) => sum + c, 0);
  }

  const examLink = profession ? `/careers/${profession}/mock-exams` : "/mock-exams";
  const title = profession
    ? `${profession.charAt(0).toUpperCase() + profession.slice(1)} Mock Exam`
    : "Nursing Mock Exam";

  return (
    <div className="space-y-4" data-testid="mock-exam-teaser">
      <div className="flex items-center gap-2">
        <GraduationCap className="w-5 h-5 text-amber-600" />
        <h3 className="text-lg font-bold text-gray-900">{t("components.conversionFunnelMockExamTeaser.testYourReadiness")}</h3>
      </div>

      <Card className="border-amber-200/60 bg-gradient-to-br from-amber-50/80 to-orange-50/30 overflow-hidden" data-testid="card-mock-exam-teaser">
        <CardContent className="p-0">
          <div className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-600" />
                <span className="font-bold text-gray-900">{title}</span>
              </div>
              {mockExamCount > 0 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold" data-testid="text-mock-exam-count">
                  <FileText className="w-3 h-3" />
                  {mockExamCount} Full Mock Exams
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-5 leading-relaxed">
              Simulate real exam conditions with timed questions, adaptive difficulty, and detailed performance analytics. Know exactly where you stand before test day.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              <div className="bg-white/80 rounded-xl p-3 text-center border border-amber-100">
                <Clock className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                <p className="text-xs font-semibold text-gray-700">{t("components.conversionFunnelMockExamTeaser.timed")}</p>
                <p className="text-[10px] text-gray-500">{t("components.conversionFunnelMockExamTeaser.realExamPacing")}</p>
              </div>
              <div className="bg-white/80 rounded-xl p-3 text-center border border-amber-100">
                <Brain className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                <p className="text-xs font-semibold text-gray-700">{t("components.conversionFunnelMockExamTeaser.adaptive")}</p>
                <p className="text-[10px] text-gray-500">{t("components.conversionFunnelMockExamTeaser.adjustsDifficulty")}</p>
              </div>
              <div className="bg-white/80 rounded-xl p-3 text-center border border-amber-100">
                <BarChart3 className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                <p className="text-xs font-semibold text-gray-700">{t("components.conversionFunnelMockExamTeaser.analytics")}</p>
                <p className="text-[10px] text-gray-500">{t("components.conversionFunnelMockExamTeaser.scoreBreakdown")}</p>
              </div>
              <div className="bg-white/80 rounded-xl p-3 text-center border border-amber-100">
                <Target className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                <p className="text-xs font-semibold text-gray-700">{t("components.conversionFunnelMockExamTeaser.domains")}</p>
                <p className="text-[10px] text-gray-500">{t("components.conversionFunnelMockExamTeaser.byBodySystem")}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <LocaleLink href={examLink}>
                <Button className="rounded-xl gap-2 bg-amber-600 hover:bg-amber-700 text-white w-full sm:w-auto" data-testid="button-start-mock-exam">
                  <GraduationCap className="w-4 h-4" />
                  {user ? "Start Mock Exam" : "Try a Free Exam"}
                </Button>
              </LocaleLink>
              {!user && (
                <LocaleLink href="/start-free">
                  <Button variant="outline" className="rounded-xl gap-2 border-amber-300 text-amber-700 w-full sm:w-auto" data-testid="button-mock-exam-signup">
                    Create Free Account <ArrowRight className="w-4 h-4" />
                  </Button>
                </LocaleLink>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
