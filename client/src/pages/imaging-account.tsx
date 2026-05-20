import { useState, useEffect } from "react";
import { Link } from "wouter";
import { SEO } from "@/components/seo";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";
import {
  User, ShoppingBag, Shield, Clock, CheckCircle2, Package,
  Crown, ArrowRight, CreditCard, Radio, BookOpen, Zap, FileText
} from "lucide-react";

interface Entitlement {
  id: string;
  entitlementType: string;
  productTitle: string;
  productType: string;
  status: string;
  expiresAt: string | null;
  createdAt: string;
  contentScope: any;
}

interface Purchase {
  id: string;
  productTitle: string;
  productType: string;
  productDescription: string;
  amount: number;
  currency: string;
  status: string;
  purchasedAt: string;
}

export default function ImagingAccountPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [entitlements, setEntitlements] = useState<Entitlement[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [hasFullAccess, setHasFullAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    Promise.all([
      fetch("/api/imaging/entitlements").then(r => r.json()),
      fetch("/api/imaging/purchases").then(r => r.json()),
    ]).then(([entData, purchData]) => {
      setEntitlements(entData.entitlements || []);
      setHasFullAccess(entData.hasFullAccess || false);
      setPurchases(Array.isArray(purchData) ? purchData : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center" data-testid="imaging-account-login-prompt">
        <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("pages.imagingAccount.signInRequired")}</h1>
        <p className="text-gray-600 mb-6">{t("pages.imagingAccount.pleaseLogInToView")}</p>
        <Link href="/login">
          <Button data-testid="button-login">{t("pages.imagingAccount.signIn")}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div data-testid="imaging-account-page">
      <SEO
        title={t("pages.imagingAccount.myMedicalImagingAccountPurchases")}
        description={t("pages.imagingAccount.viewYourMedicalImagingPurchases")}
        canonicalPath="/medical-imaging/account"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <BreadcrumbNav items={[
          { name: "Home", url: "/" },
          { name: "Medical Imaging", url: "/medical-imaging" },
          { name: "My Account", url: "/medical-imaging/account" },
        ]} />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center">
            <User className="w-7 h-7 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900" data-testid="text-account-title">{t("pages.imagingAccount.myMedicalImagingAccount")}</h1>
            <p className="text-gray-500">{user.username} {user.email ? `(${user.email})` : ""}</p>
          </div>
        </div>

        {hasFullAccess && (
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 mb-8 text-white flex items-center gap-4" data-testid="banner-full-access">
            <Crown className="w-8 h-8 shrink-0" />
            <div>
              <h2 className="text-lg font-bold">{t("pages.imagingAccount.fullAccessActive")}</h2>
              <p className="text-indigo-100 text-sm">{t("pages.imagingAccount.youHaveUnlimitedAccessTo")}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <Card data-testid="stat-entitlements">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t("pages.imagingAccount.activeEntitlements")}</p>
                  <p className="text-2xl font-bold text-gray-900">{entitlements.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card data-testid="stat-purchases">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t("pages.imagingAccount.totalPurchases")}</p>
                  <p className="text-2xl font-bold text-gray-900">{purchases.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card data-testid="stat-access">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <Crown className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t("pages.imagingAccount.accessLevel")}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {hasFullAccess ? "Full" : entitlements.length > 0 ? "Partial" : "Free"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600" />
            Active Content Access
          </h2>
          {loading ? (
            <div className="space-y-3">{[1, 2].map(i => <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse" />)}</div>
          ) : entitlements.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <Package className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 mb-4">{t("pages.imagingAccount.noActiveEntitlementsYetPurchase")}</p>
                <div className="flex gap-3 justify-center">
                  <Link href="/medical-imaging/store">
                    <Button variant="outline" data-testid="link-browse-store">
                      <ShoppingBag className="w-4 h-4 mr-2" />Browse Store
                    </Button>
                  </Link>
                  <Link href="/medical-imaging/canada/pricing">
                    <Button data-testid="link-view-plans">{t("pages.imagingAccount.viewPlans")}</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {entitlements.map(ent => (
                <Card key={ent.id} data-testid={`card-entitlement-${ent.id}`}>
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                          {ent.entitlementType === "full_access" ? <Crown className="w-5 h-5 text-indigo-600" /> : <Package className="w-5 h-5 text-green-600" />}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{ent.productTitle || ent.entitlementType}</p>
                          <p className="text-xs text-gray-500">
                            {ent.entitlementType === "full_access" ? "Full Access" : "Study Pack"} &middot;
                            {ent.expiresAt ? ` Expires ${new Date(ent.expiresAt).toLocaleDateString()}` : " Lifetime access"}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-700">
                        <CheckCircle2 className="w-3 h-3 mr-1" />Active
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            Purchase History
          </h2>
          {loading ? (
            <div className="space-y-3">{[1, 2].map(i => <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />)}</div>
          ) : purchases.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <CreditCard className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">{t("pages.imagingAccount.noPurchasesYet")}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {purchases.map(p => (
                <Card key={p.id} data-testid={`card-purchase-${p.id}`}>
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{p.productTitle || "Product"}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(p.purchasedAt).toLocaleDateString()} &middot; {p.currency} ${(p.amount / 100).toFixed(2)}
                        </p>
                      </div>
                      <Badge variant={p.status === "completed" ? "default" : "secondary"} className={p.status === "completed" ? "bg-green-100 text-green-700" : ""}>
                        {p.status === "completed" ? "Completed" : p.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
