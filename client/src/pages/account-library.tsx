import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { useAuth } from "@/lib/auth";
import { LocaleLink } from "@/lib/LocaleLink";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useTrialStatus } from "@/hooks/use-trial-status";
import {
  Download, Package, BookOpen, Shield, Crown,
  Calendar, RefreshCw, Library, ShoppingBag, ArrowRight,
} from "lucide-react";
import type { DigitalProduct, ProductPurchase } from "@shared/schema";

import { useI18n } from "@/lib/i18n";
type PurchaseWithProduct = ProductPurchase & { product: DigitalProduct };

function formatPrice(cents: number) {

  return `$${(cents / 100).toFixed(2)}`;
}

function formatDate(dateStr: string | Date) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function PurchaseCard({ purchase, onDownload, isOnTrial }: { purchase: PurchaseWithProduct; onDownload: (id: string) => void; isOnTrial?: boolean }) {
  const product = purchase.product;
  const downloadsUsed = purchase.downloadCount ?? 0;
  const maxDownloads = purchase.maxDownloads ?? 5;
  const downloadsRemaining = Math.max(0, maxDownloads - downloadsUsed);

  return (
    <Card className="hover:shadow-md transition-shadow" data-testid={`card-purchase-${purchase.id}`}>
      <CardContent className="p-5">
        <div className="flex flex-col sm:flex-row gap-4">
          {product.coverImageUrl && (
            <div className="w-full sm:w-32 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              <img
                src={product.coverImageUrl}
                alt={product.title}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
                data-testid={`img-purchase-${purchase.id}`}
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="secondary" className="text-xs" data-testid={`badge-category-${purchase.id}`}>
                {product.category}
              </Badge>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1" data-testid={`text-purchase-title-${purchase.id}`}>
              {product.title}
            </h3>
            {product.shortDescription && (
              <p className="text-sm text-gray-500 mb-2 line-clamp-2" data-testid={`text-purchase-desc-${purchase.id}`}>
                {product.shortDescription}
              </p>
            )}
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1" data-testid={`text-purchase-date-${purchase.id}`}>
                <Calendar className="w-3 h-3" />
                Purchased {formatDate(purchase.purchaseDate)}
              </span>
              <span data-testid={`text-downloads-remaining-${purchase.id}`}>
                {downloadsRemaining} / {maxDownloads} downloads remaining
              </span>
            </div>
          </div>
          <div className="flex sm:flex-col items-center sm:items-end gap-2 sm:justify-center">
            {isOnTrial ? (
              <Button size="sm" variant="outline" disabled data-testid={`button-download-trial-locked-${purchase.id}`}>
                <Shield className="w-4 h-4 mr-1" />
                Upgrade to Download
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => onDownload(purchase.id)}
                disabled={downloadsRemaining <= 0}
                data-testid={`button-download-${purchase.id}`}
              >
                <Download className="w-4 h-4 mr-1" />
                Download
              </Button>
            )}
            {downloadsRemaining <= 0 && (
              <span className="text-xs text-red-500" data-testid={`text-no-downloads-${purchase.id}`}>
                Download limit reached
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-16" data-testid="empty-state">
      <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
      <h3 className="text-xl font-semibold text-gray-700 mb-2">{t("pages.accountLibrary.noPurchasesYet")}</h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        Your purchased study materials and exam prep resources will appear here.
        Browse the store to find study guides, question banks, and more.
      </p>
      <LocaleLink href="/shop">
        <Button data-testid="button-browse-store">
          <ShoppingBag className="w-4 h-4 mr-2" />
          Browse Study Store
        </Button>
      </LocaleLink>
    </div>
  );
}

function PremiumUpsellCard() {
  return (
    <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10" data-testid="card-premium-upsell">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Crown className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1" data-testid="text-upsell-title">
              Upgrade to Premium
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Get unlimited access to all study materials, question banks, and exam simulations.
              Premium members save up to 70% compared to individual purchases.
            </p>
            <LocaleLink href="/pricing">
              <Button size="sm" data-testid="button-upgrade-premium">
                View Plans
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </LocaleLink>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SubscriptionMeter({ tier }: { tier: string }) {
  const isActive = tier === "premium" || tier === "pro";
  const totalUnlocks = tier === "pro" ? 999 : 10;
  const usedUnlocks = 0;
  const remaining = totalUnlocks - usedUnlocks;
  const percentage = Math.min(100, (usedUnlocks / totalUnlocks) * 100);

  const now = new Date();
  const resetDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  if (!isActive) return null;

  return (
    <Card className="border-green-200 bg-green-50/50" data-testid="card-subscription-meter">
      <CardContent className="p-5">
        <div className="flex items-center gap-3 mb-3">
          <Shield className="w-5 h-5 text-green-600" />
          <h3 className="font-semibold text-gray-900" data-testid="text-subscription-status">
            {tier === "pro" ? "Pro" : "Premium"} Subscription Active
          </h3>
        </div>
        <div className="mb-2">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600" data-testid="text-unlocks-remaining">
              Unlocks remaining this period: {tier === "pro" ? "Unlimited" : remaining}
            </span>
            {tier !== "pro" && (
              <span className="text-gray-400">{usedUnlocks} / {totalUnlocks}</span>
            )}
          </div>
          {tier !== "pro" && (
            <div className="w-full bg-gray-200 rounded-full h-2" data-testid="progress-unlocks">
              <div
                className="bg-green-500 h-2 rounded-full transition-all"
                style={{ width: `${100 - percentage}%` }}
              />
            </div>
          )}
        </div>
        <p className="text-xs text-gray-400 flex items-center gap-1" data-testid="text-reset-date">
          <RefreshCw className="w-3 h-3" />
          Next reset: {formatDate(resetDate)}
        </p>
      </CardContent>
    </Card>
  );
}

export default function AccountLibraryPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { isOnTrial } = useTrialStatus();
  const [purchases, setPurchases] = useState<PurchaseWithProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    fetchPurchases();
  }, [user]);

  async function fetchPurchases() {
    try {
      setLoading(true);
      const res = await fetch(`/api/shop/my-purchases?userId=${encodeURIComponent(user!.id)}`);
      if (!res.ok) throw new Error("Failed to load purchases");
      const data = await res.json();
      setPurchases(data);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  async function handleDownload(purchaseId: string) {
    try {
      const res = await fetch(`/api/shop/download/${purchaseId}?userId=${encodeURIComponent(user!.id)}`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Download failed" }));
        throw new Error(err.error || "Download failed");
      }
      const data = await res.json();
      if (data.url) {
        window.open(data.url, "_blank");
        fetchPurchases();
      }
    } catch (e: any) {
      toast({ title: "Download Error", description: e.message, variant: "destructive" });
    }
  }

  const isPremium = user?.tier === "premium" || user?.tier === "pro";

  if (!user) {
    return (
      <>
        <SEO title={t("pages.accountLibrary.myLibraryNursenest")} description={t("pages.accountLibrary.accessYourPurchasedStudyMaterials")} />
        <Navigation />
        <main className="min-h-screen bg-gray-50 pt-24">
          <div className="max-w-4xl mx-auto px-4 py-16 text-center">
            <Library className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2" data-testid="text-login-required">
              Sign in to access your library
            </h2>
            <p className="text-gray-500 mb-6">
              Log in to view your purchased study materials, download resources, and manage your account.
            </p>
            <LocaleLink href="/login">
              <Button data-testid="button-sign-in">{t("pages.accountLibrary.signIn")}</Button>
            </LocaleLink>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SEO title={t("pages.accountLibrary.myLibraryNursenest2")} description={t("pages.accountLibrary.accessYourPurchasedStudyMaterials2")} />
      <Navigation />
      <main className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-gray-900" data-testid="text-page-title">{t("pages.accountLibrary.myLibrary")}</h1>
          </div>

          <div className="space-y-6">
            {isPremium && <SubscriptionMeter tier={user.tier} />}
            {!isPremium && <PremiumUpsellCard />}

            {loading ? (
              <div className="space-y-4" data-testid="loading-skeleton">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-5">
                      <div className="animate-pulse flex gap-4">
                        <div className="w-32 h-24 bg-gray-200 rounded-lg" />
                        <div className="flex-1 space-y-3">
                          <div className="h-4 bg-gray-200 rounded w-1/3" />
                          <div className="h-4 bg-gray-200 rounded w-2/3" />
                          <div className="h-3 bg-gray-200 rounded w-1/4" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : purchases.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="space-y-4" data-testid="purchases-list">
                <p className="text-sm text-gray-500" data-testid="text-purchase-count">
                  {purchases.length} {purchases.length === 1 ? "product" : "products"} in your library
                </p>
                {purchases.map((purchase) => (
                  <PurchaseCard
                    key={purchase.id}
                    purchase={purchase}
                    onDownload={handleDownload}
                    isOnTrial={isOnTrial}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
