import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { LocaleLink } from "@/lib/LocaleLink";
import { AdminEditButton } from "@/components/admin-edit-button";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  ShoppingBag, Star, Download, Shield, BookOpen, ArrowLeft,
  ArrowRight, CheckCircle, FileText, Clock, Crown, Package, Palette,
} from "lucide-react";
import type { DigitalProduct } from "@shared/schema";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";

const DOWNLOAD_THEMES = [
  { id: "soft-clinical", name: "Soft Clinical", colors: ["#7c3aed", "#06b6d4", "#f59e0b"] },
  { id: "structured-academic", name: "Academic", colors: ["#1e40af", "#0f766e", "#b45309"] },
  { id: "bold-modern", name: "Bold Modern", colors: ["#dc2626", "#7c3aed", "#eab308"] },
  { id: "minimal-clean", name: "Minimal", colors: ["#0f172a", "#64748b", "#0ea5e9"] },
  { id: "navy-medical", name: "Navy Medical", colors: ["#1e3a5f", "#2563eb", "#10b981"] },
  { id: "blush-rose", name: "Blush Rose", colors: ["#be185d", "#9333ea", "#f59e0b"] },
  { id: "pastel-lavender", name: "Lavender", colors: ["#a78bfa", "#c4b5fd", "#ddd6fe"] },
  { id: "pastel-mint", name: "Mint", colors: ["#6ee7b7", "#a7f3d0", "#d1fae5"] },
  { id: "mono-slate", name: "Slate", colors: ["#475569", "#94a3b8", "#cbd5e1"] },
  { id: "mono-graphite", name: "Graphite", colors: ["#404040", "#737373", "#a3a3a3"] },
];

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function ShopProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useI18n();
  const { user } = useAuth();
  const { toast } = useToast();
  const [product, setProduct] = useState<DigitalProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<DigitalProduct[]>([]);
  const [purchase, setPurchase] = useState<any>(null);
  const [downloadingFile, setDownloadingFile] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState("soft-clinical");
  const [showThemePicker, setShowThemePicker] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/shop/products/${slug}`)
      .then(r => { if (!r.ok) throw new Error("Not found"); return r.json(); })
      .then(data => { setProduct(data); setLoading(false); })
      .catch(() => setLoading(false));

    fetch("/api/shop/products")
      .then(r => r.json())
      .then(data => {
        const others = (data as DigitalProduct[]).filter(p => p.slug !== slug).slice(0, 3);
        setRelatedProducts(others);
      })
      .catch(() => {});
  }, [slug]);

  useEffect(() => {
    if (!user) return;
    const params = new URLSearchParams(window.location.search);
    const justPurchased = params.get("purchased") === "true";
    if (justPurchased || user) {
      fetch(`/api/shop/my-purchases?userId=${user.id}`)
        .then(r => r.json())
        .then((data: any[]) => {
          if (product) {
            const found = data.find((p: any) => p.productId === product.id);
            if (found) setPurchase(found);
          }
        })
        .catch(() => {});
    }
  }, [user, product]);

  const handleDownloadFile = async (themeId?: string) => {
    if (!purchase || !user) return;
    setDownloadingFile(true);
    try {
      const themeParam = themeId ? `&themeId=${encodeURIComponent(themeId)}` : "";
      const res = await fetch(`/api/shop/download/${purchase.id}?userId=${user.id}${themeParam}`);
      if (!res.ok) {
        const err = await res.json();
        toast({ title: "Download Error", description: err.error, variant: "destructive" });
        return;
      }
      const { downloadUrl, downloadsRemaining } = await res.json();
      setPurchase({ ...purchase, downloadCount: (purchase.downloadCount || 0) + 1 });
      if (downloadUrl) {
        window.open(downloadUrl, "_blank");
      }
      toast({ title: `Download started. ${downloadsRemaining} downloads remaining.` });
    } catch {
      toast({ title: "Download failed", variant: "destructive" });
    } finally {
      setDownloadingFile(false);
    }
  };

  const handleCheckout = async () => {
    if (!product) return;
    setCheckingOut(true);
    try {
      const res = await fetch("/api/shop/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          userId: user?.id,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        toast({ title: "Checkout Error", description: err.error, variant: "destructive" });
        return;
      }
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setCheckingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-warmwhite flex flex-col font-sans text-gray-900">
        <Navigation />
        <main className="flex-1 max-w-4xl mx-auto px-4 py-20 w-full">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-64 bg-gray-200 rounded-xl" />
          </div>
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-warmwhite flex flex-col font-sans text-gray-900">
        <SEO title={t("pages.shopProduct.productNotFoundNursenestStore")} description={t("pages.shopProduct.theRequestedProductCouldNot")} />
        <Navigation />
        <main className="flex-1 max-w-2xl mx-auto px-4 py-20 w-full text-center space-y-6">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto" />
          <h1 className="text-2xl font-bold" data-testid="text-product-not-found">{t("pages.shopProduct.productNotFound")}</h1>
          <p className="text-gray-500">{t("pages.shopProduct.thisProductDoesntExistOr")}</p>
          <LocaleLink href="/shop">
            <Button data-testid="button-back-to-shop"><ArrowLeft className="w-4 h-4 mr-2" /> {t("pages.shopProduct.backToStore")}</Button>
          </LocaleLink>
        </main>
        <Footer />
      </div>
    );
  }

  const now = new Date();
  const saleActive = product.salePrice && product.saleStartsAt && product.saleEndsAt
    && now >= new Date(product.saleStartsAt) && now <= new Date(product.saleEndsAt);
  const effectivePrice = saleActive ? product.salePrice! : product.price;
  const hasDiscount = saleActive ? true : (product.compareAtPrice && product.compareAtPrice > product.price);
  const savings = saleActive ? (product.price - effectivePrice) : (product.compareAtPrice && product.compareAtPrice > product.price ? product.compareAtPrice! - product.price : 0);
  const strikethroughPrice = saleActive ? product.price : (product.compareAtPrice && product.compareAtPrice > product.price ? product.compareAtPrice! : 0);

  return (
    <div className="min-h-screen bg-warmwhite flex flex-col font-sans text-gray-900">
      <AdminEditButton />
      <SEO
        title={(product as any).seoTitle || `${product.title} - NurseNest Store`}
        description={(product as any).seoDescription || product.shortDescription || product.description.slice(0, 160)}
        canonicalPath={`/shop/${product.slug}`}
        keywords={(product as any).seoKeywords || `nursing study guide, ${product.category}, ${product.examTarget || "nursing exam prep"}`}
      />
      <Navigation />

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <BreadcrumbNav title={product.title} />
          <LocaleLink href="/shop" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary mb-6 transition-colors" data-testid="link-back-shop">
            <ArrowLeft className="w-4 h-4" /> Back to Store
          </LocaleLink>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {product.coverImageUrl && (
              <div className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm" style={{ aspectRatio: "16/10" }} data-testid="div-product-image">
                <img
                  src={product.coverImageUrl}
                  alt={`${product.title} - NurseNest study resource`}
                  title={product.title}
                  className="w-full h-full object-cover"
                  loading="eager"
                  decoding="async"
                  data-testid="img-product-detail"
                />
              </div>
            )}

            <div className={product.coverImageUrl ? "" : "lg:col-span-2 max-w-2xl"}>
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <Badge variant="secondary" data-testid="badge-product-category">{product.category}</Badge>
                {product.featured && (
                  <Badge className="bg-amber-100 text-amber-700" data-testid="badge-product-featured">
                    <Star className="w-3 h-3 mr-1" /> Popular
                  </Badge>
                )}
                {product.tierTarget && product.tierTarget !== "all" && (
                  <Badge variant="outline" data-testid="badge-product-tier">{product.tierTarget.toUpperCase()}</Badge>
                )}
                {product.examTarget && (
                  <Badge variant="outline" className="text-primary border-primary/30" data-testid="badge-product-exam">{product.examTarget}</Badge>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold mb-3" data-testid="text-product-detail-title">{product.title}</h1>

              {product.shortDescription && (
                <p className="text-gray-600 mb-4 text-lg" data-testid="text-product-short-desc">{product.shortDescription}</p>
              )}

              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-bold text-primary" data-testid="text-product-detail-price">
                  {formatPrice(effectivePrice)}
                </span>
                {hasDiscount && strikethroughPrice > 0 && (
                  <>
                    <span className="text-lg text-gray-400 line-through" data-testid="text-product-compare-price">
                      {formatPrice(strikethroughPrice)}
                    </span>
                    <Badge className="bg-green-100 text-green-700" data-testid="badge-savings">
                      Save {formatPrice(savings)}
                    </Badge>
                  </>
                )}
                {saleActive && (
                  <Badge className="bg-red-100 text-red-700 text-xs" data-testid="badge-sale">
                    Sale
                  </Badge>
                )}
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Download className="w-4 h-4 text-primary" /> Instant PDF download after purchase
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="w-4 h-4 text-primary" /> Clinically verified content
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <BookOpen className="w-4 h-4 text-primary" /> Exam-aligned study material
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FileText className="w-4 h-4 text-primary" /> Up to 5 downloads per purchase
                </div>
              </div>

              {purchase ? (() => {
                const downloadsUsed = purchase.downloadCount || 0;
                const maxDl = purchase.maxDownloads || 5;
                const remaining = maxDl - downloadsUsed;
                const limitReached = remaining <= 0;
                return (
                  <div className="space-y-3" data-testid="div-purchased-section">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                        <span className="font-semibold text-emerald-700" data-testid="text-purchased-badge">{t("pages.shopProduct.purchased")}</span>
                      </div>
                      <p className="text-sm text-emerald-600">{t("pages.shopProduct.thankYouForYourPurchase")}</p>
                    </div>
                    <div className="border rounded-xl p-4 space-y-3" data-testid="div-theme-picker">
                      <button
                        onClick={() => setShowThemePicker(!showThemePicker)}
                        className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-primary transition w-full"
                        data-testid="button-toggle-theme-picker"
                      >
                        <Palette className="w-4 h-4" />
                        <span>Choose Color Theme: {DOWNLOAD_THEMES.find(t => t.id === selectedTheme)?.name || "Default"}</span>
                        <div className="flex gap-0.5 ml-auto">
                          {(DOWNLOAD_THEMES.find(t => t.id === selectedTheme)?.colors || []).map((c, i) => (
                            <div key={i} className="w-4 h-4 rounded-full border border-white shadow-sm" style={{ backgroundColor: c }} />
                          ))}
                        </div>
                      </button>
                      {showThemePicker && (
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2" data-testid="grid-theme-options">
                          {DOWNLOAD_THEMES.map(theme => (
                            <button
                              key={theme.id}
                              onClick={() => { setSelectedTheme(theme.id); setShowThemePicker(false); }}
                              className={`p-2 rounded-lg border-2 transition text-center ${selectedTheme === theme.id ? "border-primary ring-1 ring-primary/30" : "border-gray-200 hover:border-gray-300"}`}
                              data-testid={`button-theme-${theme.id}`}
                            >
                              <div className="flex justify-center gap-0.5 mb-1">
                                {theme.colors.map((c, i) => (
                                  <div key={i} className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: c }} />
                                ))}
                              </div>
                              <span className="text-[10px] text-gray-600 font-medium">{theme.name}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <Button
                      size="lg"
                      className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-3 text-base gap-2"
                      onClick={() => handleDownloadFile(selectedTheme)}
                      disabled={limitReached || downloadingFile}
                      data-testid="button-download-file"
                    >
                      <Download className="w-5 h-5" />
                      {downloadingFile ? "Downloading..." : limitReached ? "Download Limit Reached" : "Download Your File"}
                    </Button>
                    <p className="text-xs text-gray-500 flex items-center gap-1" data-testid="text-downloads-info">
                      <FileText className="w-3 h-3" />
                      {limitReached
                        ? "Download limit reached. Contact support for assistance."
                        : `${remaining} of ${maxDl} downloads remaining`}
                    </p>
                  </div>
                );
              })() : (
                <>
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white px-10 py-3 text-base gap-2"
                    onClick={handleCheckout}
                    disabled={checkingOut}
                    data-testid="button-buy-now"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    {checkingOut ? "Processing..." : `Buy Now — ${formatPrice(effectivePrice)}`}
                  </Button>

                  <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Secure checkout powered by Stripe
                  </p>
                </>
              )}
            </div>
          </div>

          {product.previewUrl && (
            <section className="mt-10" data-testid="section-preview">
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" /> Preview
              </h2>
              <p className="text-sm text-gray-500 mb-4">{t("pages.shopProduct.browseASampleOfThis")}</p>
              <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                <iframe
                  src={`/api/products/${product.slug}/preview`}
                  className="w-full border-0"
                  style={{ height: 700, borderRadius: 12 }}
                  title={`${product.title} Preview`}
                  data-testid="iframe-product-preview"
                />
              </div>
              <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                <Shield className="w-3 h-3" /> Watermarked preview — {product.previewPageCount || 3} of total pages shown
              </p>
            </section>
          )}

          {product.description && (
            <section className="mt-12" data-testid="section-product-description">
              <h2 className="text-xl font-bold mb-4">{t("pages.shopProduct.whatsIncluded")}</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="prose prose-gray max-w-none text-gray-700 whitespace-pre-line" data-testid="text-product-full-desc">
                    {product.description}
                  </div>
                </CardContent>
              </Card>
            </section>
          )}

          <section className="mt-12 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-8" data-testid="section-trust-block">
            <h2 className="text-xl font-bold mb-4 text-center">{t("pages.shopProduct.whyStudentsTrustNursenest")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="text-center">
                <CheckCircle className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold mb-1">{t("pages.shopProduct.clinicallyVerified")}</h3>
                <p className="text-sm text-gray-600">{t("pages.shopProduct.contentCreatedAndReviewedBy")}</p>
              </div>
              <div className="text-center">
                <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold mb-1">{t("pages.shopProduct.examaligned")}</h3>
                <p className="text-sm text-gray-600">{t("pages.shopProduct.mappedToNclexpnRexpnNclexrn")}</p>
              </div>
              <div className="text-center">
                <Crown className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold mb-1">{t("pages.shopProduct.instantAccess")}</h3>
                <p className="text-sm text-gray-600">{t("pages.shopProduct.downloadImmediatelyAfterPurchaseAnd")}</p>
              </div>
            </div>
          </section>

          {relatedProducts.length > 0 && (
            <section className="mt-12" data-testid="section-related-products">
              <h2 className="text-xl font-bold mb-6">{t("pages.shopProduct.youMayAlsoLike")}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {relatedProducts.map(p => (
                  <LocaleLink key={p.id} href={`/shop/${p.slug}`}>
                    <Card className="group hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer h-full" data-testid={`card-related-${p.slug}`}>
                      {p.coverImageUrl && (
                        <div className="aspect-[16/10] overflow-hidden rounded-t-lg bg-gray-100">
                          <img src={p.coverImageUrl} alt={`${p.title} - NurseNest study resource`} title={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
                        </div>
                      )}
                      <CardContent className="p-4">
                        <Badge variant="secondary" className="text-xs mb-2">{p.category}</Badge>
                        <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">{p.title}</h3>
                        <span className="text-primary font-bold mt-2 block">{formatPrice(p.price)}</span>
                      </CardContent>
                    </Card>
                  </LocaleLink>
                ))}
              </div>
            </section>
          )}
        </div>

        <section className="py-12 px-4 bg-gradient-to-r from-primary/5 to-primary/10 mt-12" data-testid="section-product-cta">
          <div className="max-w-2xl mx-auto text-center">
            <Package className="w-8 h-8 text-primary mx-auto mb-3" />
            <h2 className="text-2xl font-bold mb-3" data-testid="text-product-cta-title">{t("pages.shopProduct.wantFullAccessToAll")}</h2>
            <p className="text-gray-600 mb-6">{t("pages.shopProduct.subscribeToNursenestForUnlimited")}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <LocaleLink href="/pricing">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8" data-testid="button-product-pricing">
                  See Plans <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </LocaleLink>
              <LocaleLink href="/shop">
                <Button size="lg" variant="outline" className="px-8" data-testid="button-product-more">
                  Browse More Products
                </Button>
              </LocaleLink>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
