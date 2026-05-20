import { LocaleLink } from "@/lib/LocaleLink";
import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Navigation } from "@/components/navigation";
import { AdminEditButton } from "@/components/admin-edit-button";
import { Footer } from "@/components/footer";
import { TrustBadges as TrustBadgesComponent } from "@/components/competitive-differentiation";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { SEO } from "@/components/seo";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Check, Shield, HelpCircle, Clock, X, CreditCard,
  Zap, Award, Trophy, Crown, BookOpen,
  GraduationCap, Lock, Radio, Stethoscope, ChevronDown, ChevronUp,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PayPalButton from "@/components/PayPalButton";
import {
  pricingConfig, durationLabels, durationMonths, tierMeta,
  socialProofStats, featureComparisonRows, studyTimelines,
  type TierKey, type DurationKey,
} from "@shared/pricing-config";

type SectionKey = "nursing" | "allied" | "imaging" | "newgrad";

const SECTIONS: { key: SectionKey; label: string; icon: typeof Shield; color: string }[] = [
  { key: "nursing", label: "Nursing", icon: Stethoscope, color: "text-blue-600" },
  { key: "allied", label: "Allied Health", icon: BookOpen, color: "text-teal-600" },
  { key: "imaging", label: "Medical Imaging", icon: Radio, color: "text-indigo-600" },
  { key: "newgrad", label: "New Grad", icon: GraduationCap, color: "text-cyan-600" },
];

const NURSING_TIERS: TierKey[] = ["rpn", "rn", "np"];
const DURATION_ORDER: DurationKey[] = ["monthly", "3-month", "6-month", "yearly"];

type PricingPlan = {
  id: string;
  tier: string;
  duration: string;
  isLifetime: boolean;
  priceCad: number;
  priceUsd: number;
  isEnabled: boolean;
  isPopular: boolean;
  isFoundingPrice: boolean;
  featureList: string[];
  displayOrder: number;
};

interface ImagingProduct {
  id: string;
  title: string;
  slug: string;
  productType: string;
  description: string;
  features: string[];
  priceCAD: number;
  priceUSD: number;
  compareAtPriceCAD: number | null;
  compareAtPriceUSD: number | null;
  billingInterval: string | null;
  questionCount: number;
  flashcardCount: number;
  examCount: number;
  popular: boolean;
}

const tierIcons: Record<string, typeof Shield> = {
  rpn: Shield,
  rn: Award,
  np: Trophy,
  allied: BookOpen,
  newgrad: GraduationCap,
};

const tierColors: Record<string, { color: string; bgColor: string }> = {
  rpn: { color: "text-blue-600", bgColor: "bg-blue-50 border-blue-200" },
  rn: { color: "text-purple-600", bgColor: "bg-purple-50 border-purple-200" },
  np: { color: "text-amber-600", bgColor: "bg-amber-50 border-amber-200" },
  allied: { color: "text-teal-600", bgColor: "bg-teal-50 border-teal-200" },
  newgrad: { color: "text-cyan-600", bgColor: "bg-cyan-50 border-cyan-200" },
};

function isTrialPlan(plan: PricingPlan): boolean {
  const d = plan.duration.toLowerCase();
  return d.includes("trial") || d.includes("day");
}

function getDefaultImagingProducts(): ImagingProduct[] {
  return [
    {
      id: "default-essential",
      title: "Essential",
      slug: "essential",
      productType: "subscription",
      description: "Core exam prep with practice questions and flashcards",
      features: ["Unlimited practice questions", "Full flashcard access", "3 practice exams per month", "Positioning guides", "Basic analytics"],
      priceCAD: 2999,
      priceUSD: 2199,
      compareAtPriceCAD: null,
      compareAtPriceUSD: null,
      billingInterval: "monthly",
      questionCount: 500,
      flashcardCount: 300,
      examCount: 3,
      popular: false,
    },
    {
      id: "default-pro",
      title: "Professional",
      slug: "professional",
      productType: "subscription",
      description: "Complete exam preparation with all study tools",
      features: ["Everything in Essential", "Unlimited practice exams", "Physics deep-dive modules", "Case studies", "Detailed performance analytics", "Priority support"],
      priceCAD: 4999,
      priceUSD: 3699,
      compareAtPriceCAD: 5999,
      compareAtPriceUSD: 4499,
      billingInterval: "monthly",
      questionCount: 1000,
      flashcardCount: 600,
      examCount: -1,
      popular: true,
    },
  ];
}

const ALLIED_FEATURES = [
  "Question Bank with detailed rationales",
  "Flashcards with spaced repetition",
  "Clinical Lessons library",
  "Performance Analytics dashboard",
  "Adaptive mock exams",
  "Exam simulations",
];

const NEWGRAD_FEATURES = [
  "Resume builder templates",
  "Interview prep with AI coaching",
  "Salary negotiation guides",
  "Clinical reference library",
  "Burnout prevention resources",
  "Professional development tools",
];

const FAQ_ITEMS = [
  { q: "Can I switch between plans?", a: "Yes, you can upgrade or downgrade at any time. When upgrading, you'll receive credit for unused time on your current plan." },
  { q: "Is there a money-back guarantee?", a: "We offer a 7-day satisfaction guarantee. If you're not happy, contact us within 7 days for a full refund." },
  { q: "What's included in all plans?", a: "Every paid plan includes unlimited practice questions, flashcards with spaced repetition, clinical lessons, adaptive mock exams, performance analytics, and exam simulations." },
  { q: "Can I access multiple sections?", a: "Each subscription covers its specific section. You can purchase separate plans for different areas if needed." },
  { q: "Are these real exam questions?", a: "All questions are original, exam-authentic items aligned to published exam blueprints. We do not reproduce copyrighted exam content." },
  { q: "How often is content updated?", a: "New questions, case sims, and flashcards are added weekly. Blueprint weightings are updated as exam specifications change." },
];

export default function PricingPage() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useI18n();
  const sectionRef = useRef<HTMLDivElement>(null);

  const [region, setRegion] = useState<"US" | "CA">(() => {
    return (localStorage.getItem("nursenest-region") as "US" | "CA") || "US";
  });

  const searchParams = new URLSearchParams(window.location.search);
  const initialSection = (searchParams.get("section") as SectionKey) || "nursing";
  const validInitial = SECTIONS.some(s => s.key === initialSection) ? initialSection : "nursing";
  const [activeSection, setActiveSection] = useState<SectionKey>(validInitial);

  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [plansError, setPlansError] = useState(false);
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [paypalAvailable, setPaypalAvailable] = useState(false);
  const [paypalPlan, setPaypalPlan] = useState<string | null>(null);

  const [imagingProducts, setImagingProducts] = useState<ImagingProduct[]>([]);
  const [imagingLoading, setImagingLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  const [selectedNursingTier, setSelectedNursingTier] = useState<TierKey>("rn");

  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/pricing/plans")
      .then((r) => r.json())
      .then((data) => {
        const allPlans = Array.isArray(data) ? data : [];
        setPlans(allPlans.filter((p: PricingPlan) => !isTrialPlan(p)));
        setLoadingPlans(false);
      })
      .catch(() => {
        setPlansError(true);
        setLoadingPlans(false);
      });
  }, []);

  useEffect(() => {
    fetch("/api/imaging/products?country=canada")
      .then(r => r.json())
      .then(data => {
        const subs = (data as ImagingProduct[]).filter(p => p.productType === "subscription" || p.productType === "bundle");
        setImagingProducts(subs.length > 0 ? subs : getDefaultImagingProducts());
        setImagingLoading(false);
      })
      .catch(() => {
        setImagingProducts(getDefaultImagingProducts());
        setImagingLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch("/api/paypal/status")
      .then((r) => r.json())
      .then((d) => setPaypalAvailable(d.configured))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleRegionChange = () => {
      setRegion((localStorage.getItem("nursenest-region") as "US" | "CA") || "US");
    };
    window.addEventListener("regionChange", handleRegionChange);
    return () => window.removeEventListener("regionChange", handleRegionChange);
  }, []);

  const isCAD = region === "CA";

  function handleSectionChange(section: SectionKey) {
    setActiveSection(section);
    const url = new URL(window.location.href);
    url.searchParams.set("section", section);
    window.history.replaceState({}, "", url.toString());
  }

  async function handleSubscribe(plan: PricingPlan) {
    if (!user) {
      navigate("/login");
      return;
    }
    setLoadingTier(plan.id);
    try {
      const endpoint = plan.tier === "allied" ? "/api/allied/checkout" : "/api/stripe/create-checkout";
      const body = plan.tier === "allied"
        ? { planType: plan.duration, userId: user.id }
        : { userId: user.id, tier: plan.tier, duration: plan.duration, region, planId: plan.id };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || t("pricing.checkoutFailed"));
      }
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      toast({ title: t("pricing.checkoutError"), description: err.message, variant: "destructive" });
    } finally {
      setLoadingTier(null);
    }
  }

  async function handleImagingCheckout(product: ImagingProduct) {
    if (!user) {
      navigate("/login");
      return;
    }
    if (product.id.startsWith("default-")) {
      toast({ title: "Coming Soon", description: "This plan is not yet available for purchase. Please check back soon.", variant: "destructive" });
      return;
    }
    setCheckoutLoading(product.id);
    try {
      const res = await fetch("/api/imaging/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, currency: isCAD ? "CAD" : "USD" }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast({ title: "Checkout Error", description: data.error || "Unable to start checkout", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to start checkout", variant: "destructive" });
    } finally {
      setCheckoutLoading(null);
    }
  }

  function getPlansForTier(tier: TierKey) {
    return plans.filter(p => p.tier === tier && p.isEnabled);
  }

  function getMonthlyEquiv(plan: PricingPlan) {
    const price = isCAD ? plan.priceCad : plan.priceUsd;
    const months = durationMonths[plan.duration as DurationKey];
    if (!months) return null;
    return (price / months / 100).toFixed(2);
  }

  function getSavingsPercent(plan: PricingPlan, tierPlans: PricingPlan[]) {
    const monthlyPlan = tierPlans.find(p => p.duration === "monthly");
    if (!monthlyPlan || plan.duration === "monthly") return 0;
    const months = durationMonths[plan.duration as DurationKey];
    if (!months) return 0;
    const monthlyPrice = isCAD ? monthlyPlan.priceCad : monthlyPlan.priceUsd;
    const totalMonthly = monthlyPrice * months;
    const planPrice = isCAD ? plan.priceCad : plan.priceUsd;
    return Math.round(((totalMonthly - planPrice) / totalMonthly) * 100);
  }

  function formatPrice(cents: number) {
    return `$${(cents / 100).toFixed(2)}`;
  }

  function getAlliedSavingsPercent(duration: DurationKey) {
    const monthly = isCAD ? pricingConfig.allied.cad.monthly : pricingConfig.allied.usd.monthly;
    const totalMonths = durationMonths[duration];
    if (totalMonths === 1) return null;
    const fullPrice = monthly * totalMonths;
    const discountedPrice = isCAD ? pricingConfig.allied.cad[duration] : pricingConfig.allied.usd[duration];
    const percent = Math.round(((fullPrice - discountedPrice) / fullPrice) * 100);
    return percent > 0 ? percent : null;
  }

  function getNewGradSavingsPercent(duration: DurationKey) {
    const monthly = isCAD ? pricingConfig.newgrad.cad.monthly : pricingConfig.newgrad.usd.monthly;
    const totalMonths = durationMonths[duration];
    if (totalMonths === 1) return null;
    const fullPrice = monthly * totalMonths;
    const discountedPrice = isCAD ? pricingConfig.newgrad.cad[duration] : pricingConfig.newgrad.usd[duration];
    const percent = Math.round(((fullPrice - discountedPrice) / fullPrice) * 100);
    return percent > 0 ? percent : null;
  }

  function renderNursingSection() {
    const tierPlans = getPlansForTier(selectedNursingTier);
    const monthlyPlan = tierPlans.find(p => p.duration === "monthly");

    return (
      <div data-testid="section-nursing">
        <div className="flex justify-center gap-2 mb-8 flex-wrap" data-testid="nursing-tier-tabs">
          {NURSING_TIERS.map((tierId) => {
            const meta = tierMeta[tierId];
            return (
              <Button
                key={tierId}
                variant={selectedNursingTier === tierId ? "default" : "outline"}
                className={`rounded-full px-6 text-sm font-semibold ${selectedNursingTier === tierId ? "bg-primary text-white" : ""}`}
                onClick={() => setSelectedNursingTier(tierId)}
                data-testid={`tab-nursing-${tierId}`}
              >
                {isCAD ? meta.nameCA : meta.nameUS}
              </Button>
            );
          })}
        </div>

        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-1" data-testid="text-nursing-tier-name">
            {isCAD ? tierMeta[selectedNursingTier].nameCA : tierMeta[selectedNursingTier].nameUS} Plans
          </h3>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">{tierMeta[selectedNursingTier].tagline}</p>
          <p className="text-xs text-gray-400 mt-1">{studyTimelines[selectedNursingTier]}</p>
        </div>

        {loadingPlans ? (
          <div className="text-center py-12 text-gray-500">{t("pricing.loadingPlans")}</div>
        ) : plansError || tierPlans.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-2">{t("pages.pricing.plansAreBeingConfiguredCheck")}</p>
            <Button variant="outline" className="rounded-full" onClick={() => window.location.reload()} data-testid="button-refresh-plans">
              Refresh
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8" data-testid="nursing-plans-grid">
            {tierPlans.map((plan) => renderPlanCard(plan, tierPlans))}
          </div>
        )}
      </div>
    );
  }

  function renderAlliedSection() {
    return (
      <div data-testid="section-allied">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-1" data-testid="text-allied-title">{t("pages.pricing.alliedHealthPlans")}</h3>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">
            Full access to exam-style questions, flashcards, clinical lessons, and performance tools for RRT, Paramedic, Pharmacy Tech, MLT, and more.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8" data-testid="allied-plans-grid">
          {DURATION_ORDER.map((duration) => {
            const price = isCAD ? pricingConfig.allied.cad[duration] : pricingConfig.allied.usd[duration];
            const label = durationLabels[duration];
            const isPopular = duration === "6-month";
            const savings = getAlliedSavingsPercent(duration);
            const monthlyEquiv = durationMonths[duration] > 1
              ? formatPrice(price / durationMonths[duration])
              : null;

            return (
              <Card
                key={duration}
                className={`relative border transition-all duration-300 hover:-translate-y-1 ${
                  isPopular ? "ring-2 ring-teal-400 shadow-xl scale-[1.02]" : "shadow-md hover:shadow-lg"
                }`}
                data-testid={`card-allied-${duration}`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <Badge className="bg-teal-500 text-white px-5 py-1.5 text-sm font-bold shadow-lg" data-testid="badge-allied-popular">
                      <Trophy className="w-4 h-4 mr-1.5 fill-white" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                {savings && (
                  <div className="absolute -top-3 right-3 z-10">
                    <Badge className="bg-green-500 text-white px-3 py-1 text-xs font-semibold shadow-md" data-testid={`badge-allied-save-${duration}`}>
                      Save {savings}%
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-2 pt-8">
                  <CardTitle className="text-lg font-bold" data-testid={`text-allied-plan-${duration}`}>{label}</CardTitle>
                  <div className="mt-3 mb-1">
                    <span className="text-3xl font-bold text-teal-600" data-testid={`text-allied-price-${duration}`}>{formatPrice(price)}</span>
                    <span className="text-gray-400 text-sm ml-1">{isCAD ? "CAD" : "USD"}</span>
                  </div>
                  {monthlyEquiv && (
                    <p className="text-xs text-gray-400 mt-1">≈ {monthlyEquiv} /mo</p>
                  )}
                </CardHeader>
                <CardContent className="pt-2">
                  <ul className="space-y-2 mb-6">
                    {ALLIED_FEATURES.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                        <Check className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full rounded-full font-semibold ${
                      isPopular ? "bg-teal-600 hover:bg-teal-700 text-white shadow-lg" : "bg-gray-900 text-white hover:bg-gray-800"
                    }`}
                    onClick={() => {
                      if (!user) { navigate("/login"); return; }
                      handleSubscribe({ id: `allied-${duration}`, tier: "allied", duration, isLifetime: false, priceCad: pricingConfig.allied.cad[duration], priceUsd: pricingConfig.allied.usd[duration], isEnabled: true, isPopular, isFoundingPrice: false, featureList: ALLIED_FEATURES, displayOrder: 0 });
                    }}
                    disabled={loadingTier === `allied-${duration}`}
                    data-testid={`button-allied-checkout-${duration}`}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    {loadingTier === `allied-${duration}` ? "Processing..." : "Get Started"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  function renderImagingSection() {
    const currencySymbol = "$";
    const getPrice = (p: ImagingProduct) => isCAD ? p.priceCAD : p.priceUSD;
    const getComparePrice = (p: ImagingProduct) => isCAD ? p.compareAtPriceCAD : p.compareAtPriceUSD;

    return (
      <div data-testid="section-imaging">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-1" data-testid="text-imaging-title">{t("pages.pricing.medicalImagingPlans")}</h3>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">
            CAMRT & ARRT exam preparation with practice questions, flashcards, positioning guides, and physics modules.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8" data-testid="imaging-plans-grid">
          <Card className="relative border-2 border-gray-200 bg-white" data-testid="card-imaging-free">
            <CardHeader className="pb-4">
              <Badge variant="secondary" className="text-xs w-fit">{t("pages.pricing.free")}</Badge>
              <CardTitle className="text-xl font-bold text-gray-900">{t("pages.pricing.explorer")}</CardTitle>
              <p className="text-sm text-gray-500 mt-1">{t("pages.pricing.tryBeforeYouBuy")}</p>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">{currencySymbol}0</span>
                <span className="text-gray-500 ml-1">{t("pages.pricing.forever")}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {["5 free practice questions daily", "10 free flashcards daily", "1 free practice exam", "5 positioning guides", "3 physics topics", "Basic progress tracking"].map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full rounded-full" onClick={() => navigate("/medical-imaging/canada")} data-testid="button-imaging-start-free">
                Start Free
              </Button>
            </CardContent>
          </Card>

          {(imagingLoading ? [] : imagingProducts).map((product) => (
            <Card
              key={product.id}
              className={`relative border-2 ${product.popular ? "border-indigo-500 shadow-xl shadow-indigo-100" : "border-gray-200"} bg-white`}
              data-testid={`card-imaging-${product.slug}`}
            >
              {product.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <Badge className="bg-indigo-600 text-white px-4 py-1 text-xs font-semibold shadow-lg">
                    <Trophy className="w-3 h-3 mr-1" /> Most Popular
                  </Badge>
                </div>
              )}
              <CardHeader className="pb-4">
                <Badge variant="secondary" className="text-xs capitalize w-fit">{product.productType}</Badge>
                <CardTitle className="text-xl font-bold text-gray-900">{product.title}</CardTitle>
                <p className="text-sm text-gray-500 mt-1">{product.description}</p>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  {getComparePrice(product) && (
                    <span className="text-lg text-gray-400 line-through mr-2">
                      {formatPrice(getComparePrice(product)!)}
                    </span>
                  )}
                  <span className="text-4xl font-bold text-gray-900">{formatPrice(getPrice(product))}</span>
                  {product.billingInterval && (
                    <span className="text-gray-500 ml-1">/ {product.billingInterval}</span>
                  )}
                </div>
                <ul className="space-y-3 mb-8">
                  {(product.features || []).map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full rounded-full font-semibold ${product.popular ? "bg-indigo-600 hover:bg-indigo-700 text-white" : ""}`}
                  onClick={() => handleImagingCheckout(product)}
                  disabled={checkoutLoading === product.id}
                  data-testid={`button-imaging-checkout-${product.slug}`}
                >
                  {checkoutLoading === product.id ? "Processing..." : (
                    <><CreditCard className="w-4 h-4 mr-2" />Get {product.title}</>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  function renderNewGradSection() {
    return (
      <div data-testid="section-newgrad">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-1" data-testid="text-newgrad-title">{t("pages.pricing.newGradPlans")}</h3>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">
            Career toolkit for new graduate nurses and allied health professionals — interview prep, resume builder, salary guides, and professional development.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8" data-testid="newgrad-plans-grid">
          {DURATION_ORDER.map((duration) => {
            const price = isCAD ? pricingConfig.newgrad.cad[duration] : pricingConfig.newgrad.usd[duration];
            const label = durationLabels[duration];
            const isPopular = duration === "6-month";
            const savings = getNewGradSavingsPercent(duration);
            const monthlyEquiv = durationMonths[duration] > 1
              ? formatPrice(price / durationMonths[duration])
              : null;

            return (
              <Card
                key={duration}
                className={`relative border transition-all duration-300 hover:-translate-y-1 ${
                  isPopular ? "ring-2 ring-cyan-400 shadow-xl scale-[1.02]" : "shadow-md hover:shadow-lg"
                }`}
                data-testid={`card-newgrad-${duration}`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <Badge className="bg-cyan-500 text-white px-5 py-1.5 text-sm font-bold shadow-lg" data-testid="badge-newgrad-popular">
                      <Trophy className="w-4 h-4 mr-1.5 fill-white" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                {savings && (
                  <div className="absolute -top-3 right-3 z-10">
                    <Badge className="bg-green-500 text-white px-3 py-1 text-xs font-semibold shadow-md" data-testid={`badge-newgrad-save-${duration}`}>
                      Save {savings}%
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-2 pt-8">
                  <CardTitle className="text-lg font-bold" data-testid={`text-newgrad-plan-${duration}`}>{label}</CardTitle>
                  <div className="mt-3 mb-1">
                    <span className="text-3xl font-bold text-cyan-600" data-testid={`text-newgrad-price-${duration}`}>{formatPrice(price)}</span>
                    <span className="text-gray-400 text-sm ml-1">{isCAD ? "CAD" : "USD"}</span>
                  </div>
                  {monthlyEquiv && (
                    <p className="text-xs text-gray-400 mt-1">≈ {monthlyEquiv} /mo</p>
                  )}
                </CardHeader>
                <CardContent className="pt-2">
                  <ul className="space-y-2 mb-6">
                    {NEWGRAD_FEATURES.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                        <Check className="w-4 h-4 text-cyan-500 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full rounded-full font-semibold ${
                      isPopular ? "bg-cyan-600 hover:bg-cyan-700 text-white shadow-lg" : "bg-gray-900 text-white hover:bg-gray-800"
                    }`}
                    onClick={() => {
                      if (!user) { navigate("/login"); return; }
                      handleSubscribe({ id: `newgrad-${duration}`, tier: "newgrad" as any, duration, isLifetime: false, priceCad: pricingConfig.newgrad.cad[duration], priceUsd: pricingConfig.newgrad.usd[duration], isEnabled: true, isPopular, isFoundingPrice: false, featureList: NEWGRAD_FEATURES, displayOrder: 0 });
                    }}
                    disabled={loadingTier === `newgrad-${duration}`}
                    data-testid={`button-newgrad-checkout-${duration}`}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    {loadingTier === `newgrad-${duration}` ? "Processing..." : "Get Started"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  function renderPlanCard(plan: PricingPlan, tierPlans: PricingPlan[]) {
    const price = isCAD ? plan.priceCad : plan.priceUsd;
    const displayPrice = (price / 100).toFixed(2);
    const currency = isCAD ? "CAD" : "USD";
    const savings = getSavingsPercent(plan, tierPlans);
    const monthlyEquiv = getMonthlyEquiv(plan);
    const is6Month = plan.duration === "6-month";

    return (
      <Card
        key={plan.id}
        className={`relative border-none transition-all duration-300 hover:-translate-y-1 ${
          is6Month
            ? "ring-2 ring-primary/80 shadow-xl scale-[1.02]"
            : "shadow-md hover:shadow-lg"
        }`}
        data-testid={`card-plan-${plan.duration}`}
      >
        {is6Month && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
            <Badge className="bg-primary text-white px-5 py-1.5 text-sm font-bold shadow-lg" data-testid={`badge-popular-${plan.duration}`}>
              <Trophy className="w-4 h-4 mr-1.5 fill-white" />
              Most Popular
            </Badge>
          </div>
        )}
        {plan.isFoundingPrice && (
          <div className="absolute -top-3 right-3 z-10">
            <Badge className="bg-gradient-to-r from-amber-400 to-amber-500 text-white px-3 py-1 text-xs font-bold shadow-md border-0" data-testid={`badge-founding-${plan.duration}`}>
              <Crown className="w-3 h-3 mr-1" />
              {t("pricing.foundingPrice")}
            </Badge>
          </div>
        )}
        {savings > 0 && (
          <div className={`absolute -top-3 ${plan.isFoundingPrice ? "right-24" : "right-3"} z-10`}>
            <Badge className="bg-green-500 text-white px-3 py-1 text-xs font-semibold shadow-md" data-testid={`badge-save-${plan.duration}`}>
              {t("pricing.save", { percent: String(savings) })}
            </Badge>
          </div>
        )}
        <CardHeader className="text-center pb-2 pt-8">
          <CardTitle className="text-lg font-bold" data-testid={`text-plan-name-${plan.duration}`}>
            {durationLabels[plan.duration as DurationKey] || plan.duration}
          </CardTitle>
          <div className="mt-3 mb-1">
            <span className="text-3xl font-bold text-primary" data-testid={`text-plan-price-${plan.duration}`}>
              ${displayPrice}
            </span>
            <span className="text-gray-400 text-sm ml-1">{currency}</span>
          </div>
          {monthlyEquiv && plan.duration !== "monthly" && (
            <p className="text-xs text-gray-400 mt-1">≈ ${monthlyEquiv} {currency}/mo</p>
          )}
        </CardHeader>
        <CardContent className="pt-2">
          {Array.isArray(plan.featureList) && plan.featureList.length > 0 && (
            <ul className="space-y-2 mb-6">
              {(plan.featureList as string[]).map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          )}
          <Button
            className={`w-full rounded-full font-semibold transition-all ${
              is6Month
                ? "bg-primary hover:brightness-110 text-white shadow-lg shadow-primary/25"
                : "bg-gray-900 text-white hover:bg-gray-800"
            }`}
            onClick={() => handleSubscribe(plan)}
            disabled={loadingTier === plan.id}
            data-testid={`button-subscribe-${plan.duration}`}
          >
            <CreditCard className="w-4 h-4 mr-2" />
            {loadingTier === plan.id ? t("pricing.processing") : t("pricing.unlockFullAccess")}
          </Button>

          <div className="flex items-center justify-center gap-2 mt-2 py-1.5 px-3 bg-gray-50 rounded-full" data-testid={`bnpl-badges-${plan.duration}`}>
            <span className="text-[10px] text-gray-400 font-medium">{t("pricing.alsoAccepted")}</span>
            <span className="text-[10px] font-semibold text-[#FFB3C7]">{t("pages.pricing.klarna")}</span>
            <span className="text-[10px] text-gray-300">|</span>
            <span className="text-[10px] font-semibold text-[#B2FCE4]">{t("pages.pricing.afterpay")}</span>
            <span className="text-[10px] text-gray-300">|</span>
            <span className="text-[10px] font-semibold text-[#4A4AFF]">{t("pages.pricing.affirm")}</span>
          </div>

          {paypalAvailable && (
            <div className="mt-2">
              {paypalPlan === plan.id ? (
                <div className="border rounded-xl p-3 border-[#0070ba]/20 bg-[#0070ba]/5">
                  <p className="text-xs text-gray-500 mb-2 text-center">{t("pricing.completePaypal")}</p>
                  <PayPalButton
                    amount={displayPrice}
                    currency={isCAD ? "CAD" : "USD"}
                    intent="CAPTURE"
                    onSuccess={async (data) => {
                      setPaypalPlan(null);
                      try {
                        const activateRes = await fetch("/api/paypal/activate-subscription", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ userId: user!.id, tier: plan.tier, paypalOrderId: data?.id || data?.orderID || "unknown", username: user!.username, password: (JSON.parse(localStorage.getItem("nursenest-user") || "{}")).password || "" }),
                        });
                        if (activateRes.ok) {
                          toast({ title: t("pricing.paymentSuccessTitle"), description: t("pricing.paymentSuccessDesc") });
                          navigate("/subscription/success?tier=" + plan.tier);
                        }
                      } catch {
                        toast({ title: t("pricing.paymentReceivedTitle"), description: t("pricing.paymentReceivedShortly") });
                        navigate("/subscription/success");
                      }
                    }}
                    onError={() => { toast({ title: t("pricing.paymentErrorTitle"), description: t("pricing.paymentErrorDesc"), variant: "destructive" }); }}
                  />
                  <Button variant="ghost" size="sm" className="w-full mt-1 text-xs text-gray-400" onClick={() => setPaypalPlan(null)} data-testid={`button-paypal-cancel-${plan.duration}`}>{t("pricing.cancel")}</Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="w-full rounded-full font-semibold border-[#0070ba]/30 text-[#003087] hover:bg-[#0070ba]/5"
                  onClick={() => { if (!user) { navigate("/login"); return; } setPaypalPlan(plan.id); }}
                  data-testid={`button-paypal-${plan.duration}`}
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.77.77 0 0 1 .757-.65h6.803c2.252 0 3.856.476 4.765 1.414.418.43.69.92.828 1.474.145.58.147 1.27.003 2.105l-.01.06v.532l.418.236c.356.188.637.404.847.644.314.358.516.802.6 1.326.088.54.06 1.18-.083 1.901-.166.84-.437 1.572-.804 2.17-.34.555-.769 1.01-1.277 1.352-.483.326-1.05.573-1.685.733-.612.155-1.31.234-2.073.234H13.39a.95.95 0 0 0-.938.8l-.038.22-.672 4.26-.03.16a.95.95 0 0 1-.938.8H7.076z"/></svg>
                  {t("pricing.payWithPaypal")}
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="min-h-screen bg-warmwhite flex flex-col font-sans text-gray-900 animate-page-enter">
      <SEO
        title={t("pages.pricing.nursenestPricingAllPlansIn")}
        description={t("pages.pricing.affordableNursingAndHealthcareExam")}
        canonicalPath="/pricing"
      />
      <Navigation />
      <main className="flex-1 px-4" style={{ paddingTop: 'var(--space-section)', paddingBottom: 'var(--space-section)' }}>
        <div className="max-w-6xl mx-auto">
          <BreadcrumbNav />

          <div className="text-center mb-10">
            <h1 className="font-bold mb-4 tracking-tight" style={{ fontSize: 'var(--text-hero)' }} data-testid="text-pricing-title">
              {t("pricing.heroTitle")}
            </h1>
            <p className="text-gray-500 text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed mb-4" data-testid="text-pricing-subtitle">
              {t("pricing.heroSubtitle")}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-3">
              <Button
                className="rounded-full font-semibold bg-primary hover:brightness-110 text-white px-8 h-12 text-base shadow-lg shadow-primary/20"
                onClick={() => navigate(user ? "/dashboard" : "/register")}
                data-testid="button-hero-start-free"
              >
                {t("pricing.startFree")}
              </Button>
              <Button
                variant="outline"
                className="rounded-full font-semibold px-8 h-12 text-base border-gray-300 text-gray-700 hover:bg-gray-50"
                onClick={() => sectionRef.current?.scrollIntoView({ behavior: "smooth" })}
                data-testid="button-hero-explore-plans"
              >
                {t("pricing.explorePlans")}
              </Button>
            </div>
            <p className="text-sm text-gray-400" data-testid="text-hero-subtext">
              {t("pricing.heroSubtext")}
            </p>
            {isCAD && (
              <div className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-50/80 border border-red-200/40 text-sm shadow-sm" data-testid="badge-canadian-pricing">
                <span role="img" aria-label={t("pages.pricing.mapleLeaf")}>🍁</span>
                <span className="text-gray-700">
                  <span className="font-semibold text-gray-900">{t("pricing.canadianPricingTitle")}</span> - {t("pricing.canadianPricingDesc")}
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto mb-12" data-testid="social-proof-metrics">
            {socialProofStats.map((stat, idx) => (
              <div key={idx} className="text-center p-4 rounded-2xl bg-white border border-gray-100/80 shadow-sm" data-testid={`stat-${idx}`}>
                <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-xs sm:text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-10" data-testid="credibility-bar">
            <div className="inline-flex items-center gap-2 bg-emerald-50/80 border border-emerald-200/40 rounded-full px-5 py-2.5 shadow-sm">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-700">{t("pricing.guaranteeBadge")}</span>
            </div>
            <div className="inline-flex items-center gap-2 bg-blue-50/80 border border-blue-200/40 rounded-full px-5 py-2.5 shadow-sm">
              <Zap className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">{t("pricing.instantAccess")}</span>
            </div>
            <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200/60 rounded-full px-5 py-2.5 shadow-sm">
              <Shield className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-600">{t("pricing.cancelAnytime")}</span>
            </div>
          </div>

          <div ref={sectionRef} className="sticky top-[64px] z-30 bg-warmwhite/95 backdrop-blur-sm border-b border-gray-200/60 -mx-4 px-4 py-3 mb-8" data-testid="section-selector">
            <div className="flex justify-center gap-2 flex-wrap max-w-2xl mx-auto">
              {SECTIONS.map(({ key, label, icon: Icon, color }) => (
                <button
                  key={key}
                  onClick={() => handleSectionChange(key)}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                    activeSection === key
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-primary/30 hover:text-primary"
                  }`}
                  data-testid={`tab-section-${key}`}
                >
                  <Icon className={`w-4 h-4 ${activeSection === key ? "text-white" : color}`} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {activeSection === "nursing" && renderNursingSection()}
          {activeSection === "allied" && renderAlliedSection()}
          {activeSection === "imaging" && renderImagingSection()}
          {activeSection === "newgrad" && renderNewGradSection()}

          <div className="mb-16 max-w-2xl mx-auto">
            <Card className="border border-emerald-200/60 shadow-sm bg-gradient-to-br from-emerald-50/80 to-white" data-testid="card-free-pass">
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100/80 flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-emerald-800 mb-1" data-testid="text-free-pass-title">
                  {t("pricing.freePassTitle")}
                </h3>
                <p className="text-sm text-emerald-600 mb-4 max-w-md mx-auto">
                  {t("pricing.freePassDesc")}
                </p>
                <Button
                  className="rounded-full font-semibold bg-emerald-600 hover:bg-emerald-700 text-white px-8"
                  onClick={() => navigate(user ? "/dashboard" : "/register")}
                  data-testid="button-get-free-pass"
                >
                  {user ? t("pricing.startFree") : t("pricing.getFreePass")}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mb-16">
            <div className="text-center mb-8">
              <h2 className="font-bold mb-2" style={{ fontSize: 'var(--text-section)' }} data-testid="text-comparison-title">
                {t("pricing.whatsIncluded")}
              </h2>
              <p className="text-gray-500 text-base max-w-xl mx-auto">
                {t("pricing.whatsIncludedDesc")}
              </p>
            </div>
            <div className="max-w-3xl mx-auto overflow-x-auto">
              <table className="w-full text-sm border-collapse" data-testid="table-feature-comparison">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">{t("pricing.feature")}</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-500">{t("pricing.freePass")}</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">RPN</th>
                    <th className="text-center py-3 px-4 font-bold text-primary bg-primary/5 rounded-t-lg">RN</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">NP</th>
                  </tr>
                </thead>
                <tbody>
                  {featureComparisonRows.map((row, idx) => (
                    <tr key={idx} className="border-b border-gray-100 last:border-0">
                      <td className="py-3 px-4 text-gray-700 font-medium">{row.feature}</td>
                      <td className="py-3 px-4 text-center">
                        {row.free === "No" ? <X className="w-4 h-4 text-gray-300 mx-auto" /> : <span className="text-xs text-gray-400">{row.free}</span>}
                      </td>
                      {(["rpn", "rn", "np"] as const).map((tier) => (
                        <td key={tier} className={`py-3 px-4 text-center ${tier === "rn" ? "bg-primary/5" : ""}`}>
                          {row[tier] === "Full access" ? <Check className="w-5 h-5 text-emerald-500 mx-auto" /> : <span className="text-xs text-gray-400">{row[tier]}</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mb-16 max-w-3xl mx-auto" data-testid="pricing-faq">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">{t("pages.pricing.frequentlyAskedQuestions")}</h2>
            <div className="space-y-3">
              {FAQ_ITEMS.map((faq, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-gray-100 rounded-xl overflow-hidden"
                  data-testid={`faq-item-${idx}`}
                >
                  <button
                    className="w-full flex items-center justify-between p-5 text-left"
                    onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                    data-testid={`faq-toggle-${idx}`}
                  >
                    <span className="font-medium text-gray-900">{faq.q}</span>
                    {expandedFaq === idx ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                  </button>
                  {expandedFaq === idx && (
                    <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed">{faq.a}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <TrustBadgesComponent variant="compact" />

          <div className="flex flex-col items-center gap-8 text-center mt-8 mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto w-full" data-testid="trust-signals">
              <div className="flex flex-col items-center gap-2 p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200/40">
                <Shield className="w-6 h-6 text-emerald-600" />
                <span className="text-sm font-bold text-emerald-800">{t("pricing.guaranteeBadge")}</span>
                <p className="text-xs text-emerald-600/80">{t("pricing.guaranteeDesc")}</p>
              </div>
              <div className="flex flex-col items-center gap-2 p-5 rounded-2xl bg-blue-50/80 border border-blue-200/40">
                <Zap className="w-6 h-6 text-blue-600" />
                <span className="text-sm font-bold text-blue-800">{t("pricing.cancelAnytimeTitle")}</span>
                <p className="text-xs text-blue-600/80">{t("pricing.cancelAnytimeDesc")}</p>
              </div>
              <div className="flex flex-col items-center gap-2 p-5 rounded-2xl bg-purple-50/80 border border-purple-200/40">
                <Lock className="w-6 h-6 text-purple-600" />
                <span className="text-sm font-bold text-purple-800">{t("pricing.secureCheckout")}</span>
                <p className="text-xs text-purple-600/80">{t("pricing.secureCheckoutDesc")}</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-primary/10 to-purple-100/50 rounded-3xl p-8 sm:p-12 max-w-2xl w-full" data-testid="bottom-cta">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">{t("pages.pricing.readyToStartYourExam")}</h2>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">{t("pages.pricing.joinThousandsOfHealthcareProfessionals")}</p>
              <Button
                className="rounded-full font-semibold bg-primary hover:brightness-110 text-white px-10 h-12 text-base shadow-lg shadow-primary/20"
                onClick={() => navigate(user ? "/dashboard" : "/register")}
                data-testid="button-bottom-cta"
              >
                {user ? "Go to Dashboard" : "Start Free Today"}
              </Button>
            </div>

            <LocaleLink href="/faq" className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-medium" data-testid="link-faq">
              <HelpCircle className="w-4 h-4" />
              {t("pricing.faqLink")}
            </LocaleLink>
          </div>
        </div>
      </main>
      <AdminEditButton />
      <Footer />
    </div>
  );
}
