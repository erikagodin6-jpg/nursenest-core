import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { AdminEditButton } from "@/components/admin-edit-button";
import { getPracticalNurseExamName } from "@shared/constants";
import { useRegion } from "@/hooks/use-region";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Crown, Zap, Shield, Sparkles, BookOpen, Brain, FileText, Loader2, TrendingUp, Clock, Award } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useI18n } from "@/lib/i18n";
import { trackEvent } from "@/lib/analytics";

function PricingCard({ plan, price, period, isPopular, features, onSelect, loading }: {
  plan: string; price: string; period: string; isPopular?: boolean;
  features: string[]; onSelect: () => void; loading: boolean;
}) {
  const { t } = useI18n();
  return (
    <Card className={`relative ${isPopular ? "border-2 border-purple-500 shadow-xl scale-105" : "border"}`} data-testid={`card-plan-${plan}`}>
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-purple-600 text-white px-4 py-1" data-testid="badge-best-value">{t("upgrade.bestValue")}</Badge>
        </div>
      )}
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-xl">{plan === "yearly" ? t("upgrade.proYearly") : t("upgrade.proMonthly")}</CardTitle>
        <div className="mt-2">
          <span className="text-4xl font-bold" data-testid={`text-price-${plan}`}>{price}</span>
          <span className="text-muted-foreground">/{period}</span>
        </div>
        {plan === "yearly" && (
          <p className="text-sm text-green-600 font-medium mt-1" data-testid="text-savings">{t("upgrade.savings")}</p>
        )}
      </CardHeader>
      <CardContent>
        <ul className="space-y-3 mb-6">
          {features.map((f, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
              <span>{f}</span>
            </li>
          ))}
        </ul>
        <Button
          className="w-full bg-purple-600 hover:bg-purple-700"
          size="lg"
          onClick={onSelect}
          disabled={loading}
          data-testid={`button-upgrade-${plan}`}
        >
          {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Crown className="mr-2 h-4 w-4" />}
          {loading ? t("upgrade.processing") : t("upgrade.upgradeNow")}
        </Button>
      </CardContent>
    </Card>
  );
}

function ComparisonTable() {
  const { t } = useI18n();
  const rows = [
    { feature: "Total Flashcards", free: "300", pro: "Unlimited" },
    { feature: "AI Flashcard Generation", free: false, pro: true },
    { feature: "Spaced Repetition", free: false, pro: true },
    { feature: "Exam-Mode Testing", free: false, pro: true },
    { feature: "Export to PDF", free: false, pro: true },
    { feature: "Create Custom Decks", free: true, pro: true },
    { feature: "Browse Public Decks", free: true, pro: true },
    { feature: "Study Modes", free: "Basic", pro: "All Modes" },
    { feature: "Priority Support", free: false, pro: true },
    { feature: "Competitor Context", free: "—", pro: "40% cheaper than Quizlet+" },
  ];

  return (
    <div className="overflow-x-auto" data-testid="comparison-table">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-4">{t("upgrade.featureHeader")}</th>
            <th className="text-center py-3 px-4">{t("upgrade.free")}</th>
            <th className="text-center py-3 px-4 bg-purple-50">{t("upgrade.pro")}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b">
              <td className="py-3 px-4 font-medium">{row.feature}</td>
              <td className="text-center py-3 px-4">
                {typeof row.free === "boolean" ? (
                  row.free ? <Check className="h-4 w-4 text-green-500 mx-auto" /> : <X className="h-4 w-4 text-gray-300 mx-auto" />
                ) : row.free}
              </td>
              <td className="text-center py-3 px-4 bg-purple-50">
                {typeof row.pro === "boolean" ? (
                  row.pro ? <Check className="h-4 w-4 text-green-500 mx-auto" /> : <X className="h-4 w-4 text-gray-300 mx-auto" />
                ) : <span className="font-medium text-purple-700">{row.pro}</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CompetitorComparisonTable() {
  const { t } = useI18n();
  const { user } = useAuth();
  const region = useRegion();
  type CompetitorRow = {
    feature: string;
    nursenest: string;
    uworld: string;
    archer: string;
    quizlet: string;
    highlight?: boolean;
  };

  const rows: CompetitorRow[] = [
    { feature: "Monthly Price", nursenest: "$4.99/mo", uworld: "$69/mo", archer: "$59/quarter", quizlet: "$7.99/mo", highlight: true },
    { feature: "Question Count", nursenest: "4,000+", uworld: "2,300+", archer: "1,700+", quizlet: "User-generated" },
    { feature: "Flashcards", nursenest: "Unlimited", uworld: "Limited", archer: "None", quizlet: "Unlimited" },
    { feature: "Adaptive Testing", nursenest: "Yes", uworld: "Yes", archer: "Yes", quizlet: "No" },
    { feature: `${getPracticalNurseExamName(region)} Support`, nursenest: "Yes", uworld: "Limited", archer: "Limited", quizlet: "No" },
    { feature: "Money-Back Guarantee", nursenest: "30 days", uworld: "None", archer: "None", quizlet: "None" },
  ];

  return (
    <div className="overflow-x-auto" data-testid="competitor-comparison-table">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="text-left py-3 px-3 font-semibold">{t("upgrade.featureColumn")}</th>
            <th className="text-center py-3 px-3 bg-purple-50 font-semibold">
              <span className="flex items-center justify-center gap-1">
                <Crown className="h-4 w-4 text-purple-600" /> NurseNest Pro
              </span>
            </th>
            <th className="text-center py-3 px-3 font-semibold text-gray-600">{t("pages.upgrade.uworld")}</th>
            <th className="text-center py-3 px-3 font-semibold text-gray-600">{t("pages.upgrade.archer")}</th>
            <th className="text-center py-3 px-3 font-semibold text-gray-600">{t("pages.upgrade.quizlet")}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={`border-b ${row.highlight ? "bg-green-50/50" : ""}`} data-testid={`row-competitor-${i}`}>
              <td className="py-3 px-3 font-medium">{row.feature}</td>
              <td className="text-center py-3 px-3 bg-purple-50 font-semibold text-purple-700">{row.nursenest}</td>
              <td className="text-center py-3 px-3 text-gray-600">{row.uworld}</td>
              <td className="text-center py-3 px-3 text-gray-600">{row.archer}</td>
              <td className="text-center py-3 px-3 text-gray-600">{row.quizlet}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function UpgradePage() {
  const { user } = useAuth();
  const region = useRegion();
  const [, navigate] = useLocation();
  const { t } = useI18n();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const paywallTracked = useRef(false);

  useEffect(() => {
    if (!paywallTracked.current) {
      paywallTracked.current = true;
      trackEvent("paywall_viewed");
    }
  }, []);

  const searchParams = new URLSearchParams(window.location.search);
  const sessionId = searchParams.get("session_id");

  const { data: usage } = useQuery({
    queryKey: ["/api/flashcard-usage", user?.id],
    queryFn: () => fetch(`/api/flashcard-usage/${user?.id}`).then(r => r.json()),
    enabled: !!user?.id,
  });

  const verifyMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/flashcard-upgrade/verify", {
        sessionId,
        userId: user?.id,
      });
      return res.json();
    },
    onSuccess: () => {
      navigate("/flashcards");
    },
  });

  const checkoutMutation = useMutation({
    mutationFn: async (plan: string) => {
      trackEvent("upgrade_clicked", { plan });
      setSelectedPlan(plan);
      const res = await apiRequest("POST", "/api/flashcard-upgrade/checkout", {
        userId: user?.id,
        plan,
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      return data;
    },
  });

  if (searchParams.has("session_id") && !verifyMutation.isSuccess) {
    if (!verifyMutation.isPending && !verifyMutation.isError) {
      verifyMutation.mutate();
    }
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 to-white">
        <Card className="max-w-md w-full">
          <CardContent className="py-12 text-center">
            {verifyMutation.isPending ? (
              <>
                <Loader2 className="animate-spin h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h2 className="text-xl font-bold">{t("upgrade.verifying")}</h2>
                <p className="text-muted-foreground mt-2">{t("upgrade.verifyingDesc")}</p>
              </>
            ) : verifyMutation.isError ? (
              <>
                <X className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold">{t("upgrade.verifyFailed")}</h2>
                <p className="text-muted-foreground mt-2">{t("upgrade.verifyFailedDesc")}</p>
                <Button className="mt-4" onClick={() => navigate("/upgrade")}>{t("upgrade.tryAgain")}</Button>
              </>
            ) : null}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (usage?.isPremium) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 to-white">
        <Card className="max-w-md w-full">
          <CardContent className="py-12 text-center">
            <Crown className="h-16 w-16 text-purple-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold" data-testid="text-already-pro">{t("upgrade.alreadyPro")}</h2>
            <p className="text-muted-foreground mt-2">{t("upgrade.alreadyProDesc")}</p>
            <Link href="/flashcards">
              <Button className="mt-6" data-testid="button-go-flashcards">{t("upgrade.goToFlashcards")}</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const proFeatures = [
    "Unlimited flashcards (no 300 limit)",
    "AI-powered flashcard generation",
    "Spaced repetition study mode",
    "Exam-mode testing with scoring",
    "Export decks to PDF",
    "Priority content indexing",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-gray-50">
      <AdminEditButton />
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <Badge className="bg-purple-100 text-purple-700 mb-4" data-testid="badge-upgrade-header">
            <Sparkles className="h-3 w-3 mr-1" /> {t("upgrade.upgradeToPro")}
          </Badge>
          <h1 className="text-4xl font-bold mb-3" data-testid="text-upgrade-title">
            {t("upgrade.title", { examName: getPracticalNurseExamName(region) })}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-upgrade-subtitle">
            {t("upgrade.subtitle")}
          </p>

          {usage && !usage.isPremium && (
            <div className="mt-6 inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2">
              <Zap className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-medium text-amber-800" data-testid="text-usage-banner">
                {t("upgrade.usageNote", { used: String(usage.used), limit: String(usage.limit), percentage: String(usage.percentage) })}
              </span>
            </div>
          )}

          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-purple-700 font-medium" data-testid="text-urgency">
            <Clock className="h-4 w-4" />
            {t("upgrade.startStudying")}
          </div>
        </div>

        <div className="mb-6 text-center">
          <p className="text-sm text-muted-foreground">
            <span className="line-through text-gray-400">Quizlet+ $7.99/month</span>
            <span className="ml-2 text-green-600 font-semibold" data-testid="text-cheaper">{t("upgrade.cheaperNote")}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto mb-16">
          <PricingCard
            plan="monthly"
            price="$4.99"
            period="month"
            features={proFeatures}
            onSelect={() => checkoutMutation.mutate("monthly")}
            loading={checkoutMutation.isPending && selectedPlan === "monthly"}
          />
          <PricingCard
            plan="yearly"
            price="$39"
            period="year"
            isPopular
            features={[...proFeatures, "2 months free vs monthly"]}
            onSelect={() => checkoutMutation.mutate("yearly")}
            loading={checkoutMutation.isPending && selectedPlan === "yearly"}
          />
        </div>

        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-2xl font-bold text-center mb-6">{t("upgrade.freeVsPro")}</h2>
          <ComparisonTable />
        </div>

        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl font-bold text-center mb-2" data-testid="text-competitor-heading">{t("upgrade.howStacksUp")}</h2>
          <p className="text-center text-muted-foreground mb-6">{t("upgrade.howStacksUpDesc")}</p>
          <Card>
            <CardContent className="p-0">
              <CompetitorComparisonTable />
            </CardContent>
          </Card>
          <div className="flex justify-center mt-4">
            <Badge className="bg-green-100 text-green-700 px-3 py-1" data-testid="badge-guarantee">
              <Shield className="h-3 w-3 mr-1" /> {t("upgrade.guarantee")}
            </Badge>
          </div>
        </div>

        <div className="max-w-3xl mx-auto mb-16 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-8" data-testid="section-outcome">
          <div className="flex items-start gap-4">
            <div className="bg-purple-100 rounded-full p-3 shrink-0">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2" data-testid="text-outcome-heading">{t("upgrade.outcomeHeading")}</h2>
              <p className="text-muted-foreground mb-3">
                {t("upgrade.outcomeDesc")}
              </p>
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-purple-500" />
                  <span className="text-sm font-medium">{t("upgrade.questionsFeature")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-500" />
                  <span className="text-sm font-medium">{t("upgrade.adaptiveEngine")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-purple-500" />
                  <span className="text-sm font-medium">{t("upgrade.detailedRationales")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card className="text-center p-6" data-testid="card-feature-nursing">
            <BookOpen className="h-8 w-8 text-purple-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-1">{t("upgrade.builtForNursing")}</h3>
            <p className="text-sm text-muted-foreground">{t("upgrade.builtForNursingDesc")}</p>
          </Card>
          <Card className="text-center p-6" data-testid="card-feature-ai">
            <Brain className="h-8 w-8 text-purple-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-1">{t("upgrade.aiLearning")}</h3>
            <p className="text-sm text-muted-foreground">{t("upgrade.aiLearningDesc")}</p>
          </Card>
          <Card className="text-center p-6" data-testid="card-feature-guarantee">
            <Shield className="h-8 w-8 text-purple-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-1">{t("upgrade.guaranteeTitle")}</h3>
            <p className="text-sm text-muted-foreground">{t("upgrade.guaranteeDesc")}</p>
          </Card>
        </div>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            {t("upgrade.cancelNote")}
          </p>
        </div>
      </div>
    </div>
  );
}
