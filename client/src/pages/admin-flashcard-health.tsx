/**
 * /admin/flashcard-health
 *
 * Flashcard Health Dashboard — Phase 10 Admin Observability.
 *
 * Displays:
 *  • SRS integrity errors (duplicate rating events)
 *  • Rating distribution (Again / Hard / Good / Easy)
 *  • Confidence distribution
 *  • Average cards per session
 *  • Top weak topics (highest error rate)
 *  • Top mastered topics
 *  • 14-day activity sparkline
 *  • Card state distribution (new / learning / review / mastered)
 *  • Low-quality and duplicate content counts
 */

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/navigation";
import { adminFetch } from "@/lib/admin-fetch";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import {
  AlertTriangle, CheckCircle2, BarChart3, Brain, TrendingUp,
  TrendingDown, Users, RefreshCw, Activity, Target, Layers,
  ShieldAlert, ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface HealthData {
  totalCards: number;
  totalReviews: number;
  activeUsers: number;
  duplicateCount: number;
  lowQualityCount: number;
  generationStats: { source: string; count: number }[];
  stateDistribution: { state: string; count: number }[];
  ratingDistribution: { rating: string; count: number; pct: number }[];
  confidenceDistribution: { confidence: string; count: number; pct: number }[];
  avgCardsPerSession: number;
  completionRate: number;
  topWeakTopics: { topic: string; errorRate: number; totalAnswers: number }[];
  topMasteredTopics: { topic: string; masteredCount: number }[];
  duplicateRatingEvents: number;
  recentActivity: { date: string; reviews: number; uniqueUsers: number }[];
}

const RATING_COLOURS: Record<string, string> = {
  again: "bg-rose-500",
  hard: "bg-orange-400",
  good: "bg-emerald-500",
  easy: "bg-blue-500",
};

const CONF_COLOURS: Record<string, string> = {
  guess: "bg-rose-400",
  unsure: "bg-amber-400",
  confident: "bg-emerald-500",
  guessing: "bg-rose-400",
  somewhat: "bg-amber-400",
  very_confident: "bg-emerald-500",
};

function StatCard({
  label, value, sub, icon: Icon, alert = false, ok = false,
}: {
  label: string; value: string | number; sub?: string;
  icon: React.ElementType; alert?: boolean; ok?: boolean;
}) {
  return (
    <Card className={cn(
      "border",
      alert ? "border-rose-200 bg-rose-50/40" : ok ? "border-emerald-200 bg-emerald-50/30" : "border-border",
    )}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">{label}</p>
            <p className={cn("text-2xl font-bold", alert ? "text-rose-700" : ok ? "text-emerald-700" : "text-foreground")}>
              {value}
            </p>
            {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
          </div>
          <div className={cn(
            "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
            alert ? "bg-rose-100 text-rose-600" : ok ? "bg-emerald-100 text-emerald-600" : "bg-primary/10 text-primary",
          )}>
            <Icon className="w-4 h-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function HorizontalBar({ label, pct, colourClass, count }: {
  label: string; pct: number; colourClass: string; count: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-medium text-foreground/70 w-24 shrink-0 capitalize">{label}</span>
      <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all", colourClass)}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground w-14 text-right">{pct}% ({count.toLocaleString()})</span>
    </div>
  );
}

function ActivitySparkline({ data }: { data: { date: string; reviews: number; uniqueUsers: number }[] }) {
  if (!data.length) return <p className="text-xs text-muted-foreground">No activity data</p>;
  const max = Math.max(...data.map(d => d.reviews), 1);
  return (
    <div className="flex items-end gap-1 h-16">
      {[...data].reverse().map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
          <div
            className="w-full rounded-sm bg-primary/70 hover:bg-primary transition-colors"
            style={{ height: `${Math.round((d.reviews / max) * 100)}%`, minHeight: 2 }}
            title={`${d.date}: ${d.reviews} reviews, ${d.uniqueUsers} users`}
          />
        </div>
      ))}
    </div>
  );
}

export default function AdminFlashcardHealth() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [data, setData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      setRefreshing(true);
      const res = await adminFetch("/api/admin/sm2/analytics");
      if (!res.ok) throw new Error(await res.text());
      setData(await res.json());
      setError(null);
    } catch (e: any) {
      setError(e.message || "Failed to load");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user?.tier !== "admin") { setLocation("/dashboard"); return; }
    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-6xl mx-auto px-4 py-12 flex items-center justify-center gap-3 text-muted-foreground">
          <RefreshCw className="w-4 h-4 animate-spin" /> Loading health data…
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <p className="text-rose-700 text-sm">{error || "Unknown error"}</p>
          </div>
        </div>
      </div>
    );
  }

  const hasIntegrityError = data.duplicateRatingEvents > 0;
  const masteredCount = data.stateDistribution.find(s => s.state === "mastered")?.count ?? 0;
  const totalSRS = data.stateDistribution.reduce((s, d) => s + d.count, 0) || 1;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setLocation("/admin")} className="gap-1.5 text-muted-foreground">
              <ArrowLeft className="w-3.5 h-3.5" /> Admin
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Flashcard Health Dashboard
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">SRS integrity · Rating distribution · Session analytics · Last 30 days</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchData}
            disabled={refreshing}
            className="gap-1.5"
            data-testid="button-refresh-health"
          >
            <RefreshCw className={cn("w-3.5 h-3.5", refreshing && "animate-spin")} />
            Refresh
          </Button>
        </div>

        {/* SRS Integrity Alert */}
        {hasIntegrityError && (
          <div
            className="rounded-xl border border-rose-300 bg-rose-50 p-4 flex items-start gap-3"
            data-testid="alert-srs-integrity"
          >
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-rose-800">
                SRS Integrity Warning — {data.duplicateRatingEvents.toLocaleString()} duplicate rating event{data.duplicateRatingEvents !== 1 ? "s" : ""} detected in the last 7 days
              </p>
              <p className="text-xs text-rose-600 mt-1">
                Same card rated more than once within 5 minutes by the same user. These corrupt interval calculations.
                Check if client-side idempotency guards are functioning correctly.
              </p>
            </div>
          </div>
        )}

        {!hasIntegrityError && (
          <div
            className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-3 flex items-center gap-2.5 text-emerald-700"
            data-testid="badge-srs-ok"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <p className="text-sm font-medium">SRS integrity OK — no duplicate rating events in the last 7 days</p>
          </div>
        )}

        {/* Top-level stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3" data-testid="section-health-stats">
          <StatCard label="Total Cards" value={data.totalCards.toLocaleString()} icon={Brain} />
          <StatCard label="Total Reviews" value={data.totalReviews.toLocaleString()} icon={BarChart3} />
          <StatCard label="Active Learners" value={data.activeUsers.toLocaleString()} icon={Users} sub="last 30 days" />
          <StatCard label="Avg Cards / Day" value={data.avgCardsPerSession} icon={Target} sub="per active user" />
          <StatCard
            label="Duplicate Cards"
            value={data.duplicateCount}
            icon={Layers}
            alert={data.duplicateCount > 0}
            ok={data.duplicateCount === 0}
          />
          <StatCard
            label="Low Quality"
            value={data.lowQualityCount}
            icon={AlertTriangle}
            alert={data.lowQualityCount > 0}
            ok={data.lowQualityCount === 0}
          />
          <StatCard
            label="SRS Integrity Errors"
            value={data.duplicateRatingEvents}
            icon={ShieldAlert}
            alert={hasIntegrityError}
            ok={!hasIntegrityError}
            sub="last 7 days"
          />
          <StatCard
            label="Mastery Rate"
            value={`${Math.round((masteredCount / totalSRS) * 100)}%`}
            icon={TrendingUp}
            sub={`${masteredCount.toLocaleString()} mastered`}
            ok={masteredCount > 0}
          />
        </div>

        {/* Rating + Confidence distribution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card data-testid="section-rating-distribution">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                Rating Distribution
                <Badge variant="secondary" className="ml-auto font-normal text-[10px]">last 30 days</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.ratingDistribution.length === 0 && (
                <p className="text-xs text-muted-foreground">No rating data yet</p>
              )}
              {data.ratingDistribution.map(r => (
                <HorizontalBar
                  key={r.rating}
                  label={r.rating}
                  pct={r.pct}
                  count={r.count}
                  colourClass={RATING_COLOURS[r.rating] ?? "bg-primary/60"}
                />
              ))}
              {data.ratingDistribution.length > 0 && (
                <p className="text-[10px] text-muted-foreground pt-1">
                  Target: Again &lt;20%, Easy &gt;25% indicates healthy retention
                </p>
              )}
            </CardContent>
          </Card>

          <Card data-testid="section-confidence-distribution">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                Confidence Distribution
                <Badge variant="secondary" className="ml-auto font-normal text-[10px]">last 30 days</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.confidenceDistribution.length === 0 && (
                <p className="text-xs text-muted-foreground">No confidence data yet</p>
              )}
              {data.confidenceDistribution.map(c => (
                <HorizontalBar
                  key={c.confidence}
                  label={c.confidence.replace("_", " ")}
                  pct={c.pct}
                  count={c.count}
                  colourClass={CONF_COLOURS[c.confidence] ?? "bg-primary/60"}
                />
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Card state distribution */}
        <Card data-testid="section-state-distribution">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Brain className="w-4 h-4 text-primary" />
              SRS Card State Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(["new", "learning", "review", "mastered"] as const).map(state => {
                const count = data.stateDistribution.find(s => s.state === state)?.count ?? 0;
                const pct = Math.round((count / totalSRS) * 100);
                const colours: Record<string, string> = {
                  new: "text-slate-600 bg-slate-50 border-slate-200",
                  learning: "text-amber-700 bg-amber-50 border-amber-200",
                  review: "text-blue-700 bg-blue-50 border-blue-200",
                  mastered: "text-emerald-700 bg-emerald-50 border-emerald-200",
                };
                return (
                  <div key={state} className={`rounded-lg border p-3 ${colours[state]}`} data-testid={`stat-state-${state}`}>
                    <p className="text-lg font-bold">{count.toLocaleString()}</p>
                    <p className="text-[11px] font-semibold uppercase tracking-wide capitalize mt-0.5">{state}</p>
                    <p className="text-[10px] opacity-70">{pct}% of total</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Weak topics + Mastered topics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card data-testid="section-weak-topics">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-rose-500" />
                Top Weak Topics
                <Badge variant="secondary" className="ml-auto font-normal text-[10px]">highest error rate</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.topWeakTopics.length === 0 && (
                <p className="text-xs text-muted-foreground">No data yet (requires ≥5 answers per topic)</p>
              )}
              <div className="space-y-2">
                {data.topWeakTopics.map((t, i) => (
                  <div key={t.topic} className="flex items-center gap-3">
                    <span className="text-[10px] text-muted-foreground w-4 shrink-0">{i + 1}</span>
                    <span className="text-xs text-foreground flex-1 truncate" title={t.topic}>{t.topic}</span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-xs font-semibold text-rose-700">{t.errorRate}% errors</span>
                      <span className="text-[10px] text-muted-foreground">({t.totalAnswers})</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card data-testid="section-mastered-topics">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                Top Mastered Topics
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.topMasteredTopics.length === 0 && (
                <p className="text-xs text-muted-foreground">No mastered cards yet</p>
              )}
              <div className="space-y-2">
                {data.topMasteredTopics.map((t, i) => (
                  <div key={t.topic} className="flex items-center gap-3">
                    <span className="text-[10px] text-muted-foreground w-4 shrink-0">{i + 1}</span>
                    <span className="text-xs text-foreground flex-1 truncate" title={t.topic}>{t.topic}</span>
                    <span className="text-xs font-semibold text-emerald-700 shrink-0">
                      {t.masteredCount.toLocaleString()} mastered
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 14-day activity */}
        <Card data-testid="section-activity-chart">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              14-Day Review Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ActivitySparkline data={data.recentActivity} />
            <div className="flex items-center justify-between mt-3 text-[10px] text-muted-foreground">
              <span>14 days ago</span>
              <span>Today</span>
            </div>
            {data.recentActivity.length > 0 && (
              <p className="text-[10px] text-muted-foreground mt-2">
                Peak: {Math.max(...data.recentActivity.map(d => d.reviews)).toLocaleString()} reviews ·{" "}
                Total this period: {data.recentActivity.reduce((s, d) => s + d.reviews, 0).toLocaleString()}
              </p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
