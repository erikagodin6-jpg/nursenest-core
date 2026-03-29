import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { SEO } from "@/components/seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import {
  DollarSign, TrendingUp, Users, Target, ShoppingBag,
  RefreshCw, BarChart3, Globe, Layers, Zap
} from "lucide-react";

export default function AdminRevenueDashboard() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"funnel" | "segments" | "packs" | "offers">("funnel");

  const isAdmin = user?.tier === "admin";

  useEffect(() => {
    if (!isAdmin) return;
    loadData();
  }, [isAdmin]);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/revenue-analytics");
      if (res.ok) setData(await res.json());
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto p-8 text-center">
          <h1 className="text-2xl font-bold">{t("pages.adminRevenueDashboard.accessDenied")}</h1>
        </div>
      </div>
    );
  }

  const tabs = [
    { key: "funnel", label: "Conversion Funnel", icon: TrendingUp },
    { key: "segments", label: "User Segments", icon: Users },
    { key: "packs", label: "Study Packs", icon: ShoppingBag },
    { key: "offers", label: "Pricing Offers", icon: DollarSign },
  ] as const;

  const funnelByLang = data?.funnelByLanguage || [];
  const langGroups = funnelByLang.reduce((acc: any, row: any) => {
    if (!acc[row.language_code]) acc[row.language_code] = [];
    acc[row.language_code].push(row);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <SEO title={t("pages.adminRevenueDashboard.revenueIntelligenceAdmin")} description={t("pages.adminRevenueDashboard.revenueAnalyticsAndConversionOptimization")} />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900" data-testid="text-page-title">{t("pages.adminRevenueDashboard.revenueIntelligence")}</h1>
            <p className="text-gray-600 mt-1">{t("pages.adminRevenueDashboard.conversionFunnelsUserSegmentsStudy")}</p>
          </div>
          <Button data-testid="btn-refresh" onClick={loadData} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-1" /> Refresh
          </Button>
        </div>

        <div className="flex gap-1 mb-6 bg-white rounded-lg p-1 border">
          {tabs.map(tab => (
            <button
              key={tab.key}
              data-testid={`tab-${tab.key}`}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === tab.key ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {loading && <div className="flex justify-center py-12"><RefreshCw className="w-8 h-8 animate-spin text-blue-500" /></div>}

        {!loading && activeTab === "funnel" && (
          <div className="space-y-6">
            {Object.keys(langGroups).length === 0 ? (
              <Card><CardContent className="py-8 text-center text-gray-500">{t("pages.adminRevenueDashboard.noFunnelEventsRecordedYet")}</CardContent></Card>
            ) : (
              Object.entries(langGroups).map(([lang, events]: [string, any]) => (
                <Card key={lang}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Globe className="w-5 h-5" /> {lang.toUpperCase()} Funnel</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {events.map((e: any) => (
                        <div key={e.event_name} className="p-3 border rounded-lg text-center" data-testid={`funnel-${lang}-${e.event_name}`}>
                          <div className="text-xl font-bold">{e.count}</div>
                          <div className="text-xs text-gray-600">{e.event_name.replace(/_/g, " ")}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {!loading && activeTab === "segments" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" /> {t("pages.adminRevenueDashboard.userSegments")}</CardTitle>
            </CardHeader>
            <CardContent>
              {(!data?.segments || data.segments.length === 0) ? (
                <div className="text-center py-8 text-gray-500">{t("pages.adminRevenueDashboard.noUserSegmentsComputedYet")}</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.segments.map((s: any) => (
                    <div key={s.segment} className="p-4 border rounded-lg" data-testid={`segment-${s.segment}`}>
                      <div className="font-semibold text-sm capitalize">{s.segment.replace(/_/g, " ")}</div>
                      <div className="text-2xl font-bold mt-1">{s.count} users</div>
                      <div className="text-xs text-gray-600 mt-2">
                        <div>Avg Propensity: {Number(s.avg_propensity || 0).toFixed(2)}</div>
                        <div>Avg Price Sensitivity: {Number(s.avg_sensitivity || 0).toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {!loading && activeTab === "packs" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ShoppingBag className="w-5 h-5" /> {t("pages.adminRevenueDashboard.studyPackRevenue")}</CardTitle>
            </CardHeader>
            <CardContent>
              {(!data?.packRevenue || data.packRevenue.length === 0) ? (
                <div className="text-center py-8 text-gray-500">{t("pages.adminRevenueDashboard.noStudyPacksCreatedYet")}</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-3">{t("pages.adminRevenueDashboard.packName")}</th>
                        <th className="text-center py-2 px-3">{t("pages.adminRevenueDashboard.type")}</th>
                        <th className="text-center py-2 px-3">{t("pages.adminRevenueDashboard.purchases")}</th>
                        <th className="text-center py-2 px-3">{t("pages.adminRevenueDashboard.revenue")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.packRevenue.map((p: any) => (
                        <tr key={p.title} className="border-b hover:bg-gray-50">
                          <td className="py-2 px-3 font-medium">{p.title}</td>
                          <td className="text-center py-2 px-3"><Badge variant="outline" className="text-xs">{p.pack_type}</Badge></td>
                          <td className="text-center py-2 px-3">{p.purchases || 0}</td>
                          <td className="text-center py-2 px-3 font-medium">${Number(p.revenue || 0).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {!loading && activeTab === "offers" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><DollarSign className="w-5 h-5" /> {t("pages.adminRevenueDashboard.activePricingOffers")}</CardTitle>
            </CardHeader>
            <CardContent>
              {(!data?.offers || data.offers.length === 0) ? (
                <div className="text-center py-8 text-gray-500">{t("pages.adminRevenueDashboard.noPricingOffersConfiguredYet")}</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.offers.map((o: any) => (
                    <div key={o.id} className="p-4 border rounded-lg" data-testid={`offer-${o.id}`}>
                      <div className="flex items-center justify-between">
                        <Badge className="text-xs">{o.offer_type}</Badge>
                        <Badge variant="outline" className="text-xs">{o.tier}</Badge>
                      </div>
                      <div className="text-2xl font-bold mt-2">${Number(o.price).toFixed(2)} <span className="text-sm font-normal text-gray-500">{o.currency}</span></div>
                      {o.discount_percent > 0 && <div className="text-sm text-green-600 mt-1">{o.discount_percent}% discount</div>}
                      {o.duration_days && <div className="text-xs text-gray-500 mt-1">{o.duration_days}-day trial</div>}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
