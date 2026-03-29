import { useState, useEffect } from "react";
import { Link } from "wouter";
import { SEO } from "@/components/seo";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart, FileText, Zap, Brain, Radio, CreditCard,
  BookOpen, Star, Filter, Search, Package, Crown
} from "lucide-react";
import { Input } from "@/components/ui/input";

import { useI18n } from "@/lib/i18n";
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
  country: string | null;
  popular: boolean;
}

function formatPrice(cents: number) {

  return `$${(cents / 100).toFixed(2)}`;
}

const PRODUCT_TYPE_LABELS: Record<string, { label: string; icon: typeof FileText; color: string }> = {
  study_pack: { label: "Study Pack", icon: Package, color: "bg-blue-100 text-blue-700" },
  question_pack: { label: "Question Pack", icon: FileText, color: "bg-green-100 text-green-700" },
  flashcard_deck: { label: "Flashcard Deck", icon: Zap, color: "bg-yellow-100 text-yellow-700" },
  exam_bundle: { label: "Exam Bundle", icon: Brain, color: "bg-purple-100 text-purple-700" },
  subscription: { label: "Subscription", icon: Crown, color: "bg-indigo-100 text-indigo-700" },
  bundle: { label: "Bundle", icon: Package, color: "bg-pink-100 text-pink-700" },
};

export default function ImagingStorePage() {
  const [products, setProducts] = useState<ImagingProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetch("/api/imaging/products")
      .then(r => r.json())
      .then(data => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleCheckout(product: ImagingProduct) {
    if (!user) {
      toast({ title: "Login Required", description: "Please log in to make a purchase.", variant: "destructive" });
      return;
    }
    setCheckoutLoading(product.id);
    try {
      const res = await fetch("/api/imaging/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, currency: "USD" }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else toast({ title: "Error", description: data.error || "Checkout failed", variant: "destructive" });
    } catch {
      toast({ title: "Error", description: "Failed to start checkout", variant: "destructive" });
    } finally {
      setCheckoutLoading(null);
    }
  }

  const filteredProducts = products
    .filter(p => filter === "all" || p.productType === filter)
    .filter(p => !search || p.title.toLowerCase().includes(search.toLowerCase()) || (p.description || "").toLowerCase().includes(search.toLowerCase()));

  const productTypes = [...new Set(products.map(p => p.productType))];

  return (
    <div data-testid="imaging-store-page">
      <SEO
        title={t("pages.imagingStore.medicalImagingStudyStorePractice")}
        description={t("pages.imagingStore.browseAndPurchaseRadiographyExam")}
        canonicalPath="/medical-imaging/store"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <BreadcrumbNav items={[
          { name: "Home", url: "/" },
          { name: "Medical Imaging", url: "/medical-imaging" },
          { name: "Store", url: "/medical-imaging/store" },
        ]} />
      </div>

      <section className="relative overflow-hidden py-12 mb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50/50 to-white" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-100/80 text-indigo-700 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
            <ShoppingCart className="w-4 h-4" />
            Study Materials Store
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3" data-testid="text-store-title">
            Premium Study <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">{t("pages.imagingStore.materials")}</span>
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto" data-testid="text-store-subtitle">
            Browse our collection of study packs, question banks, flashcard decks, and exam bundles designed for radiography certification success.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder={t("pages.imagingStore.searchStudyMaterials")}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10"
              data-testid="input-store-search"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
              data-testid="button-filter-all"
            >
              All
            </Button>
            {productTypes.map(type => {
              const config = PRODUCT_TYPE_LABELS[type] || { label: type, color: "bg-gray-100 text-gray-700" };
              return (
                <Button
                  key={type}
                  variant={filter === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(type)}
                  data-testid={`button-filter-${type}`}
                >
                  {config.label}
                </Button>
              );
            })}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-80 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("pages.imagingStore.noProductsFound")}</h3>
            <p className="text-gray-500">
              {search ? "Try adjusting your search terms" : "Check back soon for new study materials"}
            </p>
            <div className="mt-6 flex gap-3 justify-center">
              <Link href="/medical-imaging/canada/pricing">
                <Button variant="outline" data-testid="link-canada-pricing">
                  {"\u{1F1E8}\u{1F1E6}"} Canada Pricing
                </Button>
              </Link>
              <Link href="/medical-imaging/usa/pricing">
                <Button variant="outline" data-testid="link-usa-pricing">
                  {"\u{1F1FA}\u{1F1F8}"} USA Pricing
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => {
              const typeConfig = PRODUCT_TYPE_LABELS[product.productType] || { label: product.productType, icon: Package, color: "bg-gray-100 text-gray-700" };
              const TypeIcon = typeConfig.icon;
              return (
                <Card key={product.id} className={`relative overflow-hidden ${product.popular ? "border-indigo-300 shadow-lg" : "border-gray-200"}`} data-testid={`card-product-${product.slug}`}>
                  {product.popular && (
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-indigo-600 text-white text-xs"><Star className="w-3 h-3 mr-1" />{t("pages.imagingStore.popular")}</Badge>
                    </div>
                  )}
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={`${typeConfig.color} text-xs`}>
                        <TypeIcon className="w-3 h-3 mr-1" />{typeConfig.label}
                      </Badge>
                      {product.country && (
                        <Badge variant="outline" className="text-xs">
                          {product.country === "canada" ? "\u{1F1E8}\u{1F1E6}" : "\u{1F1FA}\u{1F1F8}"} {product.country === "canada" ? "CAMRT" : "ARRT"}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg">{product.title}</CardTitle>
                    <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                      {product.questionCount > 0 && <span className="flex items-center gap-1"><FileText className="w-3 h-3" />{product.questionCount} Qs</span>}
                      {product.flashcardCount > 0 && <span className="flex items-center gap-1"><Zap className="w-3 h-3" />{product.flashcardCount} Cards</span>}
                      {product.examCount > 0 && <span className="flex items-center gap-1"><Brain className="w-3 h-3" />{product.examCount} Exams</span>}
                    </div>

                    <div className="flex items-baseline gap-2 mb-4">
                      {product.compareAtPriceUSD && (
                        <span className="text-sm text-gray-400 line-through">{formatPrice(product.compareAtPriceUSD)}</span>
                      )}
                      <span className="text-2xl font-bold text-gray-900">{formatPrice(product.priceUSD)}</span>
                      <span className="text-xs text-gray-500">USD</span>
                      {product.billingInterval && <span className="text-xs text-gray-500">/ {product.billingInterval}</span>}
                    </div>

                    <Button
                      className="w-full"
                      onClick={() => handleCheckout(product)}
                      disabled={checkoutLoading === product.id}
                      data-testid={`button-buy-${product.slug}`}
                    >
                      {checkoutLoading === product.id ? "Processing..." : (
                        <><CreditCard className="w-4 h-4 mr-2" />{t("pages.imagingStore.purchase")}</>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <div className="mt-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 sm:p-12 text-center text-white" data-testid="cta-full-access">
          <Crown className="w-10 h-10 mx-auto mb-4 opacity-90" />
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">{t("pages.imagingStore.wantFullAccess")}</h2>
          <p className="text-indigo-100 max-w-lg mx-auto mb-6">
            Get unlimited access to all study materials, practice exams, and premium features with a subscription plan.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/medical-imaging/canada/pricing">
              <Button variant="secondary" size="lg" data-testid="button-cta-canada-pricing">
                {"\u{1F1E8}\u{1F1E6}"} Canada Plans
              </Button>
            </Link>
            <Link href="/medical-imaging/usa/pricing">
              <Button variant="secondary" size="lg" data-testid="button-cta-usa-pricing">
                {"\u{1F1FA}\u{1F1F8}"} USA Plans
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
