import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

import { useI18n } from "@/lib/i18n";
interface BuildStatus {
  targetQuestions: number;
  currentQuestions: number;
  percentComplete: number;
  simulationsTarget: number;
  simulationsCurrent: number;
  mockTestsTarget: number;
  mockTestsCurrent: number;
}

interface SimulationStat {
  id: string;
  title: string;
  questionCount: number;
  difficulty: string;
  category: string;
  estimatedMinutes: number;
  starQuestions: number;
}

interface MockTestStat {
  id: string;
  title: string;
  questionCount: number;
  difficulty: string;
  timeLimit: number;
}

interface AnalyticsData {
  totalQuestions: number;
  categoryBreakdown: Record<string, { total: number; subcategories: Record<string, number>; difficulties: Record<string, number> }>;
  difficultyBreakdown: Record<string, number>;
  formatBreakdown: Record<string, number>;
  uncategorizedCount: number;
  simulationSets: { total: number; totalQuestions: number; sets: SimulationStat[] };
  mockTests: { total: number; totalQuestions: number; tests: MockTestStat[] };
  activeBuildPriority: string[];
  categoryGroups: number;
  buildStatus: BuildStatus;
}

interface CoverageData {
  coverage: Record<string, Record<string, { count: number; difficulties: string[] }>>;
  gaps: Array<{ group: string; subcategory: string; count: number; missingDifficulties: string[] }>;
  totalGaps: number;
}

const CATEGORY_LABELS: Record<string, string> = {
  interview_preparation: "Interview Preparation",
  workplace_scenarios: "Workplace Scenarios",
  clinical_transition: "Clinical Transition",
  professional_development: "Professional Development",
  career_navigation: "Career Navigation",
};

export default function AdminNewGradAnalytics() {
  const { t } = useI18n();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [coverage, setCoverage] = useState<CoverageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/new-grad/scenario-analytics").then(r => r.json()),
      fetch("/api/admin/new-grad/coverage-report").then(r => r.json()),
    ])
      .then(([analyticsData, coverageData]) => {
        setAnalytics(analyticsData);
        setCoverage(coverageData);
        setLoading(false);
      })
      .catch(e => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="p-8" data-testid="loading-analytics">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="p-8" data-testid="error-analytics">
        <Card>
          <CardContent className="p-6">
            <p className="text-red-600">Error loading analytics: {error || "Unknown error"}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const bs = analytics.buildStatus;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6" data-testid="admin-new-grad-analytics">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold" data-testid="text-page-title">{t("pages.adminNewGradAnalytics.newGradContentAnalytics")}</h1>
        <Badge variant="outline" className="text-sm" data-testid="badge-total-questions">
          {analytics.totalQuestions.toLocaleString()} Total Questions
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card data-testid="card-build-progress">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">{t("pages.adminNewGradAnalytics.questionBuildProgress")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-question-count">{bs.currentQuestions.toLocaleString()}</div>
            <p className="text-xs text-gray-500">of {bs.targetQuestions.toLocaleString()} target</p>
            <Progress value={bs.percentComplete} className="mt-2" />
            <p className="text-xs mt-1 text-gray-500">{bs.percentComplete}% complete</p>
          </CardContent>
        </Card>

        <Card data-testid="card-simulation-count">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">{t("pages.adminNewGradAnalytics.simulationSets")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.simulationSets.total}</div>
            <p className="text-xs text-gray-500">of {bs.simulationsTarget} target ({analytics.simulationSets.totalQuestions} questions)</p>
            <Progress value={(analytics.simulationSets.total / bs.simulationsTarget) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card data-testid="card-mock-test-count">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">{t("pages.adminNewGradAnalytics.mockInterviewTests")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.mockTests.total}</div>
            <p className="text-xs text-gray-500">of {bs.mockTestsTarget} target ({analytics.mockTests.totalQuestions} questions)</p>
            <Progress value={(analytics.mockTests.total / bs.mockTestsTarget) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card data-testid="card-uncategorized">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">{t("pages.adminNewGradAnalytics.contentQuality")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.uncategorizedCount}</div>
            <p className="text-xs text-gray-500">{t("pages.adminNewGradAnalytics.uncategorizedQuestions")}</p>
            <div className="mt-2">
              <Badge variant={analytics.uncategorizedCount === 0 ? "default" : "destructive"} data-testid="badge-quality-status">
                {analytics.uncategorizedCount === 0 ? "All Categorized" : "Needs Attention"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card data-testid="card-category-breakdown">
          <CardHeader>
            <CardTitle className="text-lg">{t("pages.adminNewGradAnalytics.categoryDistribution")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(analytics.categoryBreakdown).map(([cat, data]) => {
                const count = data.total;
                const pct = Math.round((count / analytics.totalQuestions) * 100);
                return (
                  <div key={cat} data-testid={`category-row-${cat}`}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{CATEGORY_LABELS[cat] || cat}</span>
                      <span className="text-gray-500">{count} ({pct}%)</span>
                    </div>
                    <Progress value={pct} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-difficulty-breakdown">
          <CardHeader>
            <CardTitle className="text-lg">{t("pages.adminNewGradAnalytics.difficultyDistribution")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(analytics.difficultyBreakdown).map(([diff, count]) => {
                const pct = Math.round((count / analytics.totalQuestions) * 100);
                const colors: Record<string, string> = {
                  beginner: "bg-green-100 text-green-800",
                  intermediate: "bg-yellow-100 text-yellow-800",
                  advanced: "bg-red-100 text-red-800",
                };
                return (
                  <div key={diff} className="flex items-center justify-between" data-testid={`difficulty-row-${diff}`}>
                    <div className="flex items-center gap-2">
                      <Badge className={colors[diff] || ""} variant="outline">{diff}</Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600">{count} questions ({pct}%)</span>
                      <div className="w-32">
                        <Progress value={pct} className="h-2" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {analytics.activeBuildPriority && analytics.activeBuildPriority.length > 0 && (
        <Card data-testid="card-build-priority">
          <CardHeader>
            <CardTitle className="text-lg">{t("pages.adminNewGradAnalytics.activeBuildPriority")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {analytics.activeBuildPriority.map((p, i) => (
                <Badge key={i} variant="secondary" data-testid={`badge-priority-${i}`}>{p}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card data-testid="card-simulation-details">
          <CardHeader>
            <CardTitle className="text-lg">{t("pages.adminNewGradAnalytics.interviewSimulationSets")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analytics.simulationSets.sets.map(s => (
                <div key={s.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm" data-testid={`sim-row-${s.id}`}>
                  <div>
                    <div className="font-medium">{s.title}</div>
                    <div className="text-xs text-gray-500">{s.questionCount} questions · {s.estimatedMinutes} min · {s.starQuestions} STAR</div>
                  </div>
                  <Badge variant="outline">{s.difficulty}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-mock-test-details">
          <CardHeader>
            <CardTitle className="text-lg">{t("pages.adminNewGradAnalytics.mockInterviewTests2")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analytics.mockTests.tests.map(t => (
                <div key={t.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm" data-testid={`mock-row-${t.id}`}>
                  <div>
                    <div className="font-medium">{t.title}</div>
                    <div className="text-xs text-gray-500">{t.questionCount} questions · {t.timeLimit} min limit</div>
                  </div>
                  <Badge variant="outline">{t.difficulty}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {coverage && (
        <Card data-testid="card-coverage-report">
          <CardHeader>
            <CardTitle className="text-lg">
              Coverage Report
              {coverage.totalGaps > 0 && (
                <Badge variant="destructive" className="ml-2" data-testid="badge-gap-count">{coverage.totalGaps} gaps</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {coverage.totalGaps === 0 ? (
              <p className="text-green-600 font-medium" data-testid="text-full-coverage">{t("pages.adminNewGradAnalytics.fullCoverageAcrossAllCategories")}</p>
            ) : (
              <div className="space-y-2">
                {coverage.gaps.slice(0, 20).map((gap, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-yellow-50 rounded text-sm" data-testid={`gap-row-${i}`}>
                    <div>
                      <span className="font-medium">{CATEGORY_LABELS[gap.group] || gap.group}</span>
                      <span className="text-gray-500"> → {gap.subcategory.replace(/_/g, " ")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">{gap.count} questions</span>
                      {gap.missingDifficulties.length > 0 && (
                        <Badge variant="outline" className="text-xs">Missing: {gap.missingDifficulties.join(", ")}</Badge>
                      )}
                    </div>
                  </div>
                ))}
                {coverage.gaps.length > 20 && (
                  <p className="text-sm text-gray-500">... and {coverage.gaps.length - 20} more gaps</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
