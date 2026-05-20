import { useState } from "react";
import { SEO } from "@/components/seo";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { AdminEditButton } from "@/components/admin-edit-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { canAccessFeature } from "@/lib/entitlements";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { useI18n } from "@/lib/i18n";
import {
  Gauge, Lock, ArrowRight, TrendingUp, AlertTriangle,
  Info, Trophy, Target, BookOpen, Clock, Brain, BarChart3
} from "lucide-react";

type SimulationResult = {
  baseline: { probability: number; confidenceBand: number; riskCategory: string };
  projected: { probability: number; confidenceBand: number; riskCategory: string; lowerBound: number; upperBound: number };
  lift: number;
  topImpactLevers: Array<{ lever: string; impact: number }>;
  disclaimer: string;
};

const SLIDER_CONFIG = [
  {
    key: "domainAccuracyDelta",
    label: "Domain Accuracy Improvement",
    icon: Target,
    min: 0,
    max: 15,
    step: 1,
    suffix: "%",
    prefix: "+",
  },
  {
    key: "sataAccuracyDelta",
    label: "SATA Accuracy Improvement",
    icon: Brain,
    min: 0,
    max: 15,
    step: 1,
    suffix: "%",
    prefix: "+",
  },
  {
    key: "strictMocksAdded",
    label: "Additional Strict Mock Exams",
    icon: BookOpen,
    min: 0,
    max: 3,
    step: 1,
    suffix: "",
    prefix: "",
  },
  {
    key: "questionsAdded",
    label: "Additional Questions",
    icon: BarChart3,
    min: 0,
    max: 800,
    step: 50,
    suffix: "",
    prefix: "+",
  },
  {
    key: "consistencyDelta",
    label: "Consistency Improvement",
    icon: TrendingUp,
    min: 0,
    max: 4,
    step: 1,
    suffix: " weeks",
    prefix: "",
  },
  {
    key: "pacingDelta",
    label: "Time Management Improvement",
    icon: Clock,
    min: 0,
    max: 4,
    step: 1,
    suffix: "",
    prefix: "Level ",
  },
] as const;

function getRiskColor(category: string) {

  const lower = category?.toLowerCase() || "";
  if (lower.includes("low") || lower.includes("ready")) return "text-green-600 bg-green-50 border-green-200";
  if (lower.includes("moderate") || lower.includes("medium")) return "text-yellow-600 bg-yellow-50 border-yellow-200";
  if (lower.includes("high") || lower.includes("critical")) return "text-red-600 bg-red-50 border-red-200";
  return "text-blue-600 bg-blue-50 border-blue-200";
}

function getProbabilityColor(prob: number) {
  if (prob >= 75) return "bg-green-500";
  if (prob >= 55) return "bg-yellow-500";
  return "bg-red-500";
}

export default function ProbabilitySimulatorPage() {
  const { user, effectiveTier } = useAuth();
  const [, navigate] = useLocation();
  const isPremium = canAccessFeature(effectiveTier, "pass_probability_model");

  const [deltas, setDeltas] = useState<Record<string, number>>({
    domainAccuracyDelta: 0,
    sataAccuracyDelta: 0,
    strictMocksAdded: 0,
    questionsAdded: 0,
    consistencyDelta: 0,
    pacingDelta: 0,
  });

  const [result, setResult] = useState<SimulationResult | null>(null);

  const mutation = useMutation({
    mutationFn: async (payload: { userId: string; deltas: Record<string, number> }) => {
      const res = await fetch("/api/probability/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Simulation failed");
      return res.json() as Promise<SimulationResult>;
    },
    onSuccess: (data) => {
      setResult(data);
    },
  });

  function handleSliderChange(key: string, value: number[]) {
    setDeltas((prev) => ({ ...prev, [key]: value[0] }));
  }

  function handleSimulate() {
    if (!user) return;
    mutation.mutate({ userId: user.id, deltas });
  }

  function handleReset() {
    setDeltas({
      domainAccuracyDelta: 0,
      sataAccuracyDelta: 0,
      strictMocksAdded: 0,
      questionsAdded: 0,
      consistencyDelta: 0,
      pacingDelta: 0,
    });
    setResult(null);
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background" data-testid="probability-simulator-page">
        <Navigation />
        <main className="container mx-auto px-4 py-12 max-w-4xl text-center">
          <BreadcrumbNav />
          <p className="text-muted-foreground">{t("pages.probabilitySimulator.pleaseLogInToAccess")}</p>
          <Button className="mt-4" onClick={() => navigate("/login")} data-testid="button-login-redirect">
            Log In
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" data-testid="probability-simulator-page">
      <Navigation />
      <AdminEditButton />
      <main className="container mx-auto px-4 py-6 sm:py-8 max-w-4xl">
        <BreadcrumbNav />
        <header className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Gauge className="h-7 w-7 text-primary" />
            <h1 className="text-2xl sm:text-3xl font-bold" data-testid="text-page-title">
              Probability Improvement Simulator
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-muted-foreground text-sm">
              Simulate how improving different areas would affect your pass probability.
            </p>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="inline-flex" data-testid="button-disclaimer-tooltip">
                  <Info className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs text-xs" data-testid="text-disclaimer">
                Predictions are coaching estimates based on your performance and do not represent official exam scoring.
              </TooltipContent>
            </Tooltip>
          </div>
        </header>

        {!isPremium ? (
          <Card className="relative overflow-hidden" data-testid="card-premium-gate">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90 z-10" />
            <CardContent className="pt-6 pb-4 opacity-40 pointer-events-none">
              <div className="space-y-6">
                {SLIDER_CONFIG.slice(0, 3).map((cfg) => (
                  <div key={cfg.key} className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <cfg.icon className="h-4 w-4" />
                      {cfg.label}
                    </div>
                    <Slider disabled min={cfg.min} max={cfg.max} step={cfg.step} value={[0]} />
                  </div>
                ))}
              </div>
            </CardContent>
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8">
              <div className="bg-background/95 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg border max-w-md">
                <Lock className="h-10 w-10 text-primary mx-auto mb-4" />
                <h2 className="text-xl font-bold mb-2" data-testid="text-premium-gate-title">{t("pages.probabilitySimulator.premiumFeature")}</h2>
                <p className="text-muted-foreground text-sm mb-6">
                  The Probability Improvement Simulator is available on premium plans. Upgrade to unlock predictive analytics and personalized improvement insights.
                </p>
                <Button onClick={() => navigate("/pricing")} data-testid="button-upgrade-cta">
                  Upgrade Now <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            {result && (
              <Card data-testid="card-baseline-stats">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    Current Baseline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground mb-1">{t("pages.probabilitySimulator.currentProbability")}</p>
                      <p className="text-2xl font-bold" data-testid="text-current-probability">
                        {result.baseline.probability}%
                      </p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground mb-1">{t("pages.probabilitySimulator.riskCategory")}</p>
                      <Badge variant="outline" className={getRiskColor(result.baseline.riskCategory)} data-testid="text-current-risk">
                        {result.baseline.riskCategory}
                      </Badge>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground mb-1">{t("pages.probabilitySimulator.confidenceBand")}</p>
                      <p className="text-sm font-medium" data-testid="text-confidence-band">
                        {result.projected.lowerBound}% – {result.projected.upperBound}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card data-testid="card-sliders">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Gauge className="h-4 w-4 text-primary" />
                  Improvement Levers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {SLIDER_CONFIG.map((cfg) => {
                    const Icon = cfg.icon;
                    const val = deltas[cfg.key] ?? 0;
                    return (
                      <div key={cfg.key} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm font-medium">
                            <Icon className="h-4 w-4 text-primary" />
                            {cfg.label}
                          </div>
                          <span className="text-sm font-mono text-primary" data-testid={`text-value-${cfg.key}`}>
                            {cfg.prefix}{val}{cfg.suffix}
                          </span>
                        </div>
                        <Slider
                          min={cfg.min}
                          max={cfg.max}
                          step={cfg.step}
                          value={[val]}
                          onValueChange={(v) => handleSliderChange(cfg.key, v)}
                          data-testid={`slider-${cfg.key}`}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{cfg.prefix}{cfg.min}{cfg.suffix}</span>
                          <span>{cfg.prefix}{cfg.max}{cfg.suffix}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex gap-3 mt-8">
                  <Button
                    onClick={handleSimulate}
                    disabled={mutation.isPending}
                    className="flex-1"
                    data-testid="button-simulate"
                  >
                    {mutation.isPending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Simulating...
                      </>
                    ) : (
                      <>
                        <Gauge className="h-4 w-4 mr-2" />
                        Simulate
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={handleReset} data-testid="button-reset">
                    Reset
                  </Button>
                </div>

                {mutation.isError && (
                  <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2" data-testid="text-error">
                    <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                    Simulation failed. Please try again.
                  </div>
                )}
              </CardContent>
            </Card>

            {result && (
              <>
                <Card data-testid="card-results">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      Simulation Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{t("pages.probabilitySimulator.current")}</span>
                          <span className="font-medium">{result.baseline.probability}%</span>
                        </div>
                        <div className="relative h-4 rounded-full bg-muted overflow-hidden">
                          <div
                            className={`absolute left-0 top-0 h-full rounded-full transition-all duration-700 ${getProbabilityColor(result.baseline.probability)} opacity-40`}
                            style={{ width: `${result.baseline.probability}%` }}
                            data-testid="bar-current-probability"
                          />
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{t("pages.probabilitySimulator.projected")}</span>
                          <span className="font-bold text-primary">{result.projected.probability}%</span>
                        </div>
                        <div className="relative h-4 rounded-full bg-muted overflow-hidden">
                          <div
                            className={`absolute left-0 top-0 h-full rounded-full transition-all duration-700 ${getProbabilityColor(result.projected.probability)}`}
                            style={{ width: `${result.projected.probability}%` }}
                            data-testid="bar-projected-probability"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="text-center p-3 rounded-lg bg-green-50 border border-green-200">
                          <p className="text-xs text-green-600 mb-1">{t("pages.probabilitySimulator.probabilityLift")}</p>
                          <p className="text-xl font-bold text-green-700" data-testid="text-lift">
                            +{result.lift}%
                          </p>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-muted/50">
                          <p className="text-xs text-muted-foreground mb-1">{t("pages.probabilitySimulator.projectedRisk")}</p>
                          <Badge variant="outline" className={getRiskColor(result.projected.riskCategory)} data-testid="text-projected-risk">
                            {result.projected.riskCategory}
                          </Badge>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-muted/50">
                          <p className="text-xs text-muted-foreground mb-1">{t("pages.probabilitySimulator.riskChange")}</p>
                          <p className="text-sm font-medium" data-testid="text-risk-change">
                            {result.baseline.riskCategory === result.projected.riskCategory
                              ? "No change"
                              : `${result.baseline.riskCategory} → ${result.projected.riskCategory}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {result.topImpactLevers && result.topImpactLevers.length > 0 && (
                  <Card data-testid="card-levers">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-primary" />
                        Most Impactful Levers
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {result.topImpactLevers.map((lever, i) => (
                          <div
                            key={lever.lever}
                            className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border"
                            data-testid={`lever-item-${i}`}
                          >
                            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                              {i + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-sm font-medium">{lever.lever}</p>
                                <Badge variant="secondary" className="text-xs flex-shrink-0" data-testid={`text-lever-impact-${i}`}>
                                  +{lever.impact}%
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}