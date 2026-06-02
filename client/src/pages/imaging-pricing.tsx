import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { SEO } from "@/components/seo";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";
import {
  Check, X, Star, Shield, Zap, BookOpen, FileText, Brain,
  ArrowRight, CreditCard, Radio, Lock, Crown, Sparkles
} from "lucide-react";

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

const COUNTRY_CONFIG: Record<string, { name: string; flag: string; currency: string; currencySymbol: string; exam: string; color: string; gradient: string }> = {
  canada: { name: "Canada", flag: "\u{1F1E8}\u{1F1E6}", currency: "CAD", currencySymbol: "$", exam: "CAMRT", color: "red", gradient: "from-red-500 to-red-600" },
  usa: { name: "USA", flag: "\u{1F1FA}\u{1F1F8}", currency: "USD", currencySymbol: "$", exam: "ARRT", color: "blue", gradient: "from-blue-500 to-blue-600" },
};

const FREE_FEATURES = [
  "5 free practice questions daily",
  "10 free flashcards daily",
  "1 free practice exam",
  "5 positioning guides",
  "3 physics topics",
  "Basic progress tracking",
];

function formatPrice(cents: number, symbol: string) {

  return `${symbol}${(cents / 100).toFixed(2)}`;
}

export function ImagingPricingCanada() {
  return <ImagingPricingPage country="canada" />;
}

export function ImagingPricingUSA() {
  return <ImagingPricingPage country="usa" />;
}

function ImagingPricingPage({ country }: { country: string }) {
  const config = COUNTRY_CONFIG[country];
  const [products, setProducts] = useState<ImagingProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetch(`/api/imaging/products?country=${country}`)
      .then(r => r.json())
      .then(data => {
        const subscriptions = (data as ImagingProduct[]).filter(p => p.productType === "subscription" || p.productType === "bundle");
        setProducts(subscriptions.length > 0 ? subscriptions : getDefaultProducts(country));
        setLoading(false);
      })
      .catch(() => {
        setProducts(getDefaultProducts(country));
        setLoading(false);
      });
  }, [country]);

  async function handleCheckout(product: ImagingProduct) {
    if (!user) {
      toast({ title: "Login Required", description: "Please log in to purchase a plan.", variant: "destructive" });
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
        body: JSON.stringify({ productId: product.id, currency: config?.currency || "USD" }),
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

  if (!config) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">{t("pages.imagingPricing.countryNotFound")}</h1>
        <Link href="/medical-imaging" className="text-indigo-600 mt-4 inline-block" data-testid="link-back-imaging">{t("pages.imagingPricing.backToMedicalImaging")}</Link>
      </div>
    );
  }

  const price = (product: ImagingProduct) => config.currency === "CAD" ? product.priceCAD : product.priceUSD;
  const comparePrice = (product: ImagingProduct) => config.currency === "CAD" ? product.compareAtPriceCAD : product.compareAtPriceUSD;

  return (
    <div data-testid="imaging-pricing-page">
      <SEO
        title={`${config.exam} Exam Prep Pricing - Medical Imaging ${config.name}`}
        description={`Choose your ${config.exam} exam preparation plan. Affordable study packs, practice exams, and full access subscriptions for radiography certification.`}
        canonicalPath={`/medical-imaging/${country}/pricing`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <BreadcrumbNav items={[
          { name: "Home", url: "/" },
          { name: "Medical Imaging", url: "/medical-imaging" },
          { name: config.name, url: `/medical-imaging/${country}` },
          { name: "Pricing", url: `/medical-imaging/${country}/pricing` },
        ]} />
      </div>

      <section className="relative overflow-hidden py-16" data-testid="pricing-hero">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50/50 to-white" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-100/80 text-indigo-700 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Radio className="w-4 h-4" />
            {config.flag} {config.exam} Exam Prep
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4" data-testid="text-pricing-title">
            Invest in Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">{t("pages.imagingPricing.radiographyCareer")}</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto" data-testid="text-pricing-subtitle">
            Choose the plan that fits your study needs. All plans include access to {config.exam}-specific content with detailed rationales and analytics.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 -mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          <Card className="relative border-2 border-gray-200 bg-white" data-testid="card-free-plan">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary" className="text-xs">{t("pages.imagingPricing.free")}</Badge>
              </div>
              <CardTitle className="text-xl font-bold text-gray-900">{t("pages.imagingPricing.explorer")}</CardTitle>
              <p className="text-sm text-gray-500 mt-1">{t("pages.imagingPricing.tryBeforeYouBuy")}</p>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">{config.currencySymbol}0</span>
                <span className="text-gray-500 ml-1">{t("pages.imagingPricing.forever")}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {FREE_FEATURES.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href={`/medical-imaging/${country}`}>
                <Button variant="outline" className="w-full" data-testid="button-start-free">
                  Start Free
                </Button>
              </Link>
            </CardContent>
          </Card>

          {(loading ? [] : products).map((product) => (
            <Card
              key={product.id}
              className={`relative border-2 ${product.popular ? "border-indigo-500 shadow-xl shadow-indigo-100" : "border-gray-200"} bg-white`}
              data-testid={`card-plan-${product.slug}`}
            >
              {product.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <Badge className="bg-indigo-600 text-white px-4 py-1 text-xs font-semibold shadow-lg">
                    <Star className="w-3 h-3 mr-1" /> Most Popular
                  </Badge>
                </div>
              )}
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="text-xs capitalize">{product.productType}</Badge>
                  {product.billingInterval && (
                    <span className="text-xs text-gray-500">{product.billingInterval}</span>
                  )}
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">{product.title}</CardTitle>
                <p className="text-sm text-gray-500 mt-1">{product.description}</p>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  {comparePrice(product) && (
                    <span className="text-lg text-gray-400 line-through mr-2">
                      {formatPrice(comparePrice(product)!, config.currencySymbol)}
                    </span>
                  )}
                  <span className="text-4xl font-bold text-gray-900">
                    {formatPrice(price(product), config.currencySymbol)}
                  </span>
                  {product.billingInterval && (
                    <span className="text-gray-500 ml-1">/ {product.billingInterval}</span>
                  )}
                </div>

                <div className="flex gap-4 text-xs text-gray-500 mb-4">
                  {product.questionCount > 0 && (
                    <span className="flex items-center gap-1"><FileText className="w-3 h-3" />{product.questionCount} Questions</span>
                  )}
                  {product.flashcardCount > 0 && (
                    <span className="flex items-center gap-1"><Zap className="w-3 h-3" />{product.flashcardCount} Cards</span>
                  )}
                  {product.examCount > 0 && (
                    <span className="flex items-center gap-1"><Brain className="w-3 h-3" />{product.examCount} Exams</span>
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
                  className={`w-full ${product.popular ? "bg-indigo-600 hover:bg-indigo-700" : ""}`}
                  onClick={() => handleCheckout(product)}
                  disabled={checkoutLoading === product.id}
                  data-testid={`button-checkout-${product.slug}`}
                >
                  {checkoutLoading === product.id ? "Processing..." : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Get {product.title}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 max-w-3xl mx-auto" data-testid="pricing-faq">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">{t("pages.imagingPricing.frequentlyAskedQuestions")}</h2>
          <div className="space-y-4">
            {[
              { q: "Can I switch plans later?", a: "Yes, you can upgrade or downgrade your plan at any time. When upgrading, you'll receive credit for any unused time on your current plan." },
              { q: "Is there a money-back guarantee?", a: "We offer a 7-day satisfaction guarantee. If you're not happy with your purchase, contact us within 7 days for a full refund." },
              { q: "Do study packs expire?", a: "Individual study pack purchases never expire. Subscription plans remain active as long as your subscription is current." },
              { q: "Can I access content from both countries?", a: "Plans are country-specific to ensure exam-relevant content. You can purchase separate plans for different country exams if needed." },
            ].map((item, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="font-semibold text-gray-900 mb-2">{item.q}</h3>
                <p className="text-sm text-gray-600">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function getDefaultProducts(country: string): ImagingProduct[] {
  const isCanada = country === "canada";
  return [
    {
      id: "default-essential",
      title: "Essential",
      slug: "essential",
      productType: "subscription",
      description: `Core ${isCanada ? "CAMRT" : "ARRT"} exam prep with practice questions and flashcards`,
      features: [
        "Unlimited practice questions",
        "Full flashcard access",
        "3 practice exams per month",
        "Positioning guides",
        "Basic analytics",
      ],
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
      description: `Complete ${isCanada ? "CAMRT" : "ARRT"} exam preparation with all study tools`,
      features: [
        "Everything in Essential",
        "Unlimited practice exams",
        "Physics deep-dive modules",
        "Case studies",
        "Detailed performance analytics",
        "Priority support",
      ],
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

export default function ImagingPricingDefault() {
  const [, params] = useRoute("/medical-imaging/:country/pricing");
  const country = params?.country || "canada";
  return <ImagingPricingPage country={country} />;
}
