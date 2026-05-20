import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { SEO } from "@/components/seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import {
  BarChart3, FileText, Layers, TrendingUp, DollarSign,
  RefreshCw, Plus, Trash2, Edit2, Save, X, Activity
} from "lucide-react";

function getAdminHeaders(): Record<string, string> {

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  try {
    const token = localStorage.getItem("nn_admin_access_token");
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const creds = localStorage.getItem("nursenest-credentials");
    if (creds) {
      const { username, password } = JSON.parse(creds);
      headers["x-username"] = username;
      headers["x-password"] = password;
    }
  } catch {}
  return headers;
}

function MetricCard({ title, value, subtitle, icon: Icon, color = "bg-white" }: {
  title: string; value: string | number; subtitle?: string; icon: any; color?: string;
}) {
  return (
    <Card className={`${color} border-0 shadow-sm hover:shadow-md transition-shadow`} data-testid={`card-metric-${title.toLowerCase().replace(/\s+/g, "-")}`}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{typeof value === "number" ? value.toLocaleString() : value}</p>
            {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#BFA6F6]/10 flex items-center justify-center">
            <Icon className="w-5 h-5 text-[#BFA6F6]" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = total > 0 ? Math.min((current / total) * 100, 100) : 0;
  return (
    <div className="w-full bg-gray-100 rounded-full h-2.5" data-testid="progress-bar">
      <div
        className="h-2.5 rounded-full transition-all bg-[#BFA6F6]"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function CostEntryForm({ onSave, onCancel, initial }: {
  onSave: (data: any) => void; onCancel: () => void;
  initial?: { category: string; label: string; amount: number; currency: string; notes: string };
}) {
  const [category, setCategory] = useState(initial?.category || "");
  const [label, setLabel] = useState(initial?.label || "");
  const [amount, setAmount] = useState(initial?.amount?.toString() || "");
  const [currency, setCurrency] = useState(initial?.currency || "USD");
  const [notes, setNotes] = useState(initial?.notes || "");

  return (
    <div className="flex flex-wrap gap-2 items-end p-3 bg-gray-50 rounded-lg" data-testid="form-cost-entry">
      <div className="flex-1 min-w-[120px]">
        <label className="text-xs text-gray-500 block mb-1">{t("pages.adminContentMetrics.category")}</label>
        <Input value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g. Hosting" className="h-8 text-sm" data-testid="input-cost-category" />
      </div>
      <div className="flex-1 min-w-[120px]">
        <label className="text-xs text-gray-500 block mb-1">{t("pages.adminContentMetrics.label")}</label>
        <Input value={label} onChange={e => setLabel(e.target.value)} placeholder="e.g. Replit Pro" className="h-8 text-sm" data-testid="input-cost-label" />
      </div>
      <div className="w-24">
        <label className="text-xs text-gray-500 block mb-1">{t("pages.adminContentMetrics.amount")}</label>
        <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className="h-8 text-sm" data-testid="input-cost-amount" />
      </div>
      <div className="w-20">
        <label className="text-xs text-gray-500 block mb-1">{t("pages.adminContentMetrics.currency")}</label>
        <Input value={currency} onChange={e => setCurrency(e.target.value)} className="h-8 text-sm" data-testid="input-cost-currency" />
      </div>
      <div className="flex-1 min-w-[120px]">
        <label className="text-xs text-gray-500 block mb-1">{t("pages.adminContentMetrics.notes")}</label>
        <Input value={notes} onChange={e => setNotes(e.target.value)} placeholder={t("pages.adminContentMetrics.optionalNotes")} className="h-8 text-sm" data-testid="input-cost-notes" />
      </div>
      <div className="flex gap-1">
        <Button size="sm" className="h-8 bg-[#BFA6F6] hover:bg-[#a88de8]" onClick={() => onSave({ category, label, amount: parseFloat(amount), currency, notes })} data-testid="button-save-cost">
          <Save className="w-3.5 h-3.5 mr-1" /> Save
        </Button>
        <Button size="sm" variant="ghost" className="h-8" onClick={onCancel} data-testid="button-cancel-cost">
          <X className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}

export default function AdminContentMetrics() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isAdmin = user?.tier === "admin";
  const [showCostForm, setShowCostForm] = useState(false);
  const [editingCost, setEditingCost] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["/api/admin/content-metrics"],
    queryFn: async () => {
      const res = await fetch("/api/admin/content-metrics", { headers: getAdminHeaders() });
      if (!res.ok) throw new Error("Failed to fetch metrics");
      return res.json();
    },
    enabled: isAdmin,
    refetchInterval: 60000,
  });

  const addCostMutation = useMutation({
    mutationFn: async (costData: any) => {
      const res = await fetch("/api/admin/finance", {
        method: "POST",
        headers: getAdminHeaders(),
        body: JSON.stringify(costData),
      });
      if (!res.ok) throw new Error("Failed to add cost");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/content-metrics"] });
      setShowCostForm(false);
    },
  });

  const updateCostMutation = useMutation({
    mutationFn: async ({ id, ...costData }: any) => {
      const res = await fetch(`/api/admin/finance/${id}`, {
        method: "PUT",
        headers: getAdminHeaders(),
        body: JSON.stringify(costData),
      });
      if (!res.ok) throw new Error("Failed to update cost");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/content-metrics"] });
      setEditingCost(null);
    },
  });

  const deleteCostMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/finance/${id}`, {
        method: "DELETE",
        headers: getAdminHeaders(),
      });
      if (!res.ok) throw new Error("Failed to delete cost");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/content-metrics"] });
    },
  });

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#F9FAFB]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <Navigation />
        <div className="max-w-4xl mx-auto p-8 text-center" data-testid="text-access-denied">
          <h1 className="text-2xl font-bold text-gray-900">{t("pages.adminContentMetrics.accessDenied")}</h1>
          <p className="text-gray-500 mt-2">{t("pages.adminContentMetrics.youMustBeAnAdmin")}</p>
        </div>
      </div>
    );
  }

  const tierCounts = data?.questionsByTier || [];
  const flashcards = data?.flashcards || { published: 0, pendingReview: 0, totalDecks: 0 };
  const activeJobs = data?.activeJobs || [];
  const projected = data?.projected || { currentTotal: 0, inProgress: 0, projectedTotal: 0 };
  const financial = data?.financial || { totalSubscribers: 0, totalPurchases: 0, totalRevenue: 0, totalCosts: 0, netProfitLoss: 0, breakEvenPoint: null, costEntries: [] };

  return (
    <div className="min-h-screen bg-[#F9FAFB]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Navigation />
      <SEO title={t("pages.adminContentMetrics.contentMetricsAdmin")} description={t("pages.adminContentMetrics.realtimeContentHealthDashboard")} />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#2E3A59]" data-testid="text-page-title">{t("pages.adminContentMetrics.contentMetrics")}</h1>
            <p className="text-sm text-gray-500 mt-1">{t("pages.adminContentMetrics.realtimeContentHealthAndFinancial")}</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <RefreshCw className="w-3.5 h-3.5" />
            Auto-refreshes every 60s
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center py-16">
            <RefreshCw className="w-8 h-8 animate-spin text-[#BFA6F6]" />
          </div>
        )}

        {!isLoading && data && (
          <div className="space-y-8">
            <section data-testid="section-question-bank">
              <h2 className="text-lg font-semibold text-[#2E3A59] mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#BFA6F6]" /> Question Bank
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {tierCounts.map((t: any) => (
                  <MetricCard
                    key={t.tier}
                    title={t.tier.toUpperCase()}
                    value={t.count}
                    subtitle={t("pages.admin_content_metrics.publishedQuestions")}
                    icon={FileText}
                  />
                ))}
                <MetricCard
                  title={t("pages.adminContentMetrics.totalPublished")}
                  value={data.totalPublished}
                  subtitle={t("pages.admin_content_metrics.allTiersCombined")}
                  icon={BarChart3}
                  color="bg-[#BFA6F6]/5"
                />
              </div>
            </section>

            <section data-testid="section-flashcards">
              <h2 className="text-lg font-semibold text-[#2E3A59] mb-4 flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#AEE3E1]" /> Flashcards
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <MetricCard title={t("pages.adminContentMetrics.publishedFlashcards")} value={flashcards.published} icon={Layers} />
                <MetricCard title={t("pages.adminContentMetrics.pendingReview")} value={flashcards.pendingReview} icon={Layers} />
                <MetricCard title={t("pages.adminContentMetrics.totalDecks")} value={flashcards.totalDecks} icon={Layers} />
              </div>
            </section>

            <section data-testid="section-generation-pipeline">
              <h2 className="text-lg font-semibold text-[#2E3A59] mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#FFD6A5]" /> Active Content Generation
              </h2>
              {activeJobs.length === 0 ? (
                <Card className="border-0 shadow-sm">
                  <CardContent className="py-8 text-center text-gray-500 text-sm">
                    No active generation jobs at the moment.
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-0 shadow-sm overflow-hidden">
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-50 border-b">
                            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">{t("pages.adminContentMetrics.job")}</th>
                            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">{t("pages.adminContentMetrics.contentType")}</th>
                            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">{t("pages.adminContentMetrics.tier")}</th>
                            <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase">{t("pages.adminContentMetrics.progress")}</th>
                            <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase">{t("pages.adminContentMetrics.status")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {activeJobs.map((job: any) => (
                            <tr key={job.id} className="border-b last:border-0 hover:bg-gray-50/50" data-testid={`row-job-${job.id}`}>
                              <td className="py-3 px-4 font-medium text-gray-900">{job.runDate}</td>
                              <td className="py-3 px-4 text-gray-600">{job.contentType.replace(/_/g, " ")}</td>
                              <td className="py-3 px-4">
                                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#BFA6F6]/10 text-[#7c5cc4]">
                                  {job.tier.toUpperCase()}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                  <ProgressBar current={job.generatedCount} total={job.targetCount} />
                                  <span className="text-xs text-gray-500 whitespace-nowrap">
                                    {job.generatedCount}/{job.targetCount}
                                  </span>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-center">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                  job.status === "running" ? "bg-blue-50 text-blue-700" :
                                  job.status === "queued" ? "bg-yellow-50 text-yellow-700" :
                                  "bg-orange-50 text-orange-700"
                                }`}>
                                  {job.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </section>

            <section data-testid="section-projected-growth">
              <h2 className="text-lg font-semibold text-[#2E3A59] mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#AEE3E1]" /> Projected Content Growth
              </h2>
              <Card className="border-0 shadow-sm bg-gradient-to-r from-[#BFA6F6]/5 to-[#AEE3E1]/5">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{t("pages.adminContentMetrics.currentPublished")}</p>
                      <p className="text-3xl font-bold text-[#2E3A59] mt-1" data-testid="text-current-total">{projected.currentTotal.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{t("pages.adminContentMetrics.inProgress")}</p>
                      <p className="text-3xl font-bold text-[#FFD6A5] mt-1" data-testid="text-in-progress">+{projected.inProgress.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{t("pages.adminContentMetrics.projectedTotal")}</p>
                      <p className="text-3xl font-bold text-[#7c5cc4] mt-1" data-testid="text-projected-total">{projected.projectedTotal.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section data-testid="section-financial">
              <h2 className="text-lg font-semibold text-[#2E3A59] mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-[#FFD6A5]" /> Revenue vs Content
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                <MetricCard title={t("pages.adminContentMetrics.subscribers")} value={financial.totalSubscribers} icon={BarChart3} />
                <MetricCard title={t("pages.adminContentMetrics.purchases")} value={financial.totalPurchases} icon={DollarSign} />
                <MetricCard title={t("pages.adminContentMetrics.revenue")} value={`$${financial.totalRevenue.toFixed(2)}`} icon={TrendingUp} />
                <MetricCard title={t("pages.adminContentMetrics.platformCosts")} value={`$${financial.totalCosts.toFixed(2)}`} icon={DollarSign} />
                <MetricCard
                  title={t("pages.adminContentMetrics.netProfitloss")}
                  value={`${financial.netProfitLoss >= 0 ? "+" : ""}$${financial.netProfitLoss.toFixed(2)}`}
                  subtitle={financial.breakEvenPoint ? `Break-even: ${financial.breakEvenPoint} purchases` : undefined}
                  icon={TrendingUp}
                  color={financial.netProfitLoss >= 0 ? "bg-green-50" : "bg-red-50"}
                />
              </div>

              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold text-[#2E3A59]">{t("pages.adminContentMetrics.platformCostEntries")}</CardTitle>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs"
                      onClick={() => setShowCostForm(true)}
                      data-testid="button-add-cost"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" /> Add Cost
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {showCostForm && (
                    <div className="mb-4">
                      <CostEntryForm
                        onSave={(d) => addCostMutation.mutate(d)}
                        onCancel={() => setShowCostForm(false)}
                      />
                    </div>
                  )}

                  {financial.costEntries.length === 0 && !showCostForm ? (
                    <p className="text-sm text-gray-500 text-center py-4">{t("pages.adminContentMetrics.noCostEntriesYetAdd")}</p>
                  ) : (
                    <div className="space-y-2">
                      {financial.costEntries.map((entry: any) => (
                        <div key={entry.id}>
                          {editingCost === entry.id ? (
                            <CostEntryForm
                              initial={entry}
                              onSave={(d) => updateCostMutation.mutate({ id: entry.id, ...d })}
                              onCancel={() => setEditingCost(null)}
                            />
                          ) : (
                            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors" data-testid={`cost-entry-${entry.id}`}>
                              <div className="flex items-center gap-3">
                                <span className="px-2 py-0.5 rounded text-xs font-medium bg-[#FFD6A5]/20 text-[#b8860b]">{entry.category}</span>
                                <span className="text-sm font-medium text-gray-900">{entry.label}</span>
                                {entry.notes && <span className="text-xs text-gray-400">- {entry.notes}</span>}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-gray-900">${entry.amount.toFixed(2)} {entry.currency}</span>
                                <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => setEditingCost(entry.id)} data-testid={`button-edit-cost-${entry.id}`}>
                                  <Edit2 className="w-3.5 h-3.5 text-gray-400" />
                                </Button>
                                <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => deleteCostMutation.mutate(entry.id)} data-testid={`button-delete-cost-${entry.id}`}>
                                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
