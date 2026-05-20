import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminFetch } from "@/lib/admin-fetch";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";
import {
  RefreshCw,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  ArrowLeft,
  BarChart3,
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  ShoppingCart,
  CreditCard,
  Target,
  PieChart,
  Calendar,
  Shield,
  AlertTriangle,
} from "lucide-react";

const EXPENSE_CATEGORIES = [
  { value: "replit", label: "Replit Spend" },
  { value: "domain", label: "Domain" },
  { value: "software", label: "Software / Subscriptions" },
  { value: "ads", label: "Ads / Marketing" },
  { value: "contractor", label: "Contractor / Freelancer" },
  { value: "ai_generation", label: "AI Generation" },
  { value: "other", label: "Other" },
];

const CURRENCIES = ["CAD", "USD"];

function fmt(n: number, decimals = 2): string {
  const { t } = useI18n();
  return n.toLocaleString("en-CA", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export default function AdminBusinessHealth() {
  const queryClient = useQueryClient();
  const [activeSection, setActiveSection] = useState<"financial" | "subscribers" | "provisional">("financial");
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<any>(null);
  const [expenseForm, setExpenseForm] = useState({
    category: "other",
    vendor: "",
    description: "",
    amount: "",
    currency: "CAD",
    date: new Date().toISOString().slice(0, 10),
    recurring: false,
  });
  const [showUSD, setShowUSD] = useState(false);

  const { data: summary, isLoading: summaryLoading, error: summaryError } = useQuery({
    queryKey: ["bh-summary"],
    queryFn: async () => {
      const res = await adminFetch("/api/admin/business-health/summary");
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as any).error || "Failed to load summary");
      }
      return res.json();
    },
    refetchInterval: 60000,
    retry: 1,
  });

  const { data: expenses, isLoading: expensesLoading, error: expensesError } = useQuery({
    queryKey: ["bh-expenses"],
    queryFn: async () => {
      const res = await adminFetch("/api/admin/business-health/expenses");
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as any).error || "Failed to load expenses");
      }
      return res.json();
    },
    retry: 1,
  });

  const { data: subscribers, isLoading: subscribersLoading, error: subscribersError } = useQuery({
    queryKey: ["bh-subscribers"],
    queryFn: async () => {
      const res = await adminFetch("/api/admin/business-health/subscribers");
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as any).error || "Failed to load subscribers");
      }
      return res.json();
    },
    refetchInterval: 60000,
    retry: 1,
  });

  const createExpense = useMutation({
    mutationFn: async (data: any) => {
      const res = await adminFetch("/api/admin/business-health/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create expense");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bh-expenses"] });
      queryClient.invalidateQueries({ queryKey: ["bh-summary"] });
      resetForm();
    },
  });

  const updateExpense = useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      const res = await adminFetch(`/api/admin/business-health/expenses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update expense");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bh-expenses"] });
      queryClient.invalidateQueries({ queryKey: ["bh-summary"] });
      resetForm();
    },
  });

  const deleteExpense = useMutation({
    mutationFn: async (id: string) => {
      const res = await adminFetch(`/api/admin/business-health/expenses/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete expense");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bh-expenses"] });
      queryClient.invalidateQueries({ queryKey: ["bh-summary"] });
    },
  });

  function resetForm() {
    setExpenseForm({ category: "other", vendor: "", description: "", amount: "", currency: "CAD", date: new Date().toISOString().slice(0, 10), recurring: false });
    setShowExpenseForm(false);
    setEditingExpense(null);
  }

  function startEdit(exp: any) {
    setEditingExpense(exp);
    setExpenseForm({
      category: exp.category,
      vendor: exp.vendor,
      description: exp.description || "",
      amount: String(exp.amount),
      currency: exp.currency,
      date: exp.date,
      recurring: exp.recurring,
    });
    setShowExpenseForm(true);
  }

  function handleSubmit() {
    const data = { ...expenseForm, amount: parseFloat(expenseForm.amount) };
    if (editingExpense) {
      updateExpense.mutate({ id: editingExpense.id, ...data });
    } else {
      createExpense.mutate(data);
    }
  }

  const fin = summary?.financials || {};
  const spend = summary?.spend || {};
  const subs = subscribers?.subscribers || {};
  const purchases = subscribers?.purchases || {};
  const salesByDate = subscribers?.salesByDateRange || [];

  const isLoading = summaryLoading || expensesLoading || subscribersLoading;
  const anyError = summaryError || expensesError || subscribersError;

  if (isLoading && !summary && !subscribers) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const profitColor = (fin.grossProfitLossCAD || 0) >= 0 ? "text-green-600" : "text-red-600";
  const breakEvenColor = (fin.breakEvenRemainingCAD || 0) > 0 ? "text-yellow-600" : "text-green-600";

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {anyError && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm" data-testid="banner-error">
            {(anyError as Error).message || "Failed to load data. Some metrics may be unavailable."}
          </div>
        )}
        {(createExpense.error || updateExpense.error || deleteExpense.error) && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm" data-testid="banner-mutation-error">
            {((createExpense.error || updateExpense.error || deleteExpense.error) as Error)?.message || "Operation failed"}
          </div>
        )}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <a href="/admin" className="text-gray-500 hover:text-gray-700" data-testid="link-back-admin">
              <ArrowLeft className="w-5 h-5" />
            </a>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">{t("pages.adminBusinessHealth.businessHealthDashboard")}</h1>
          </div>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1.5 text-sm text-gray-500 cursor-pointer">
              <input
                type="checkbox"
                checked={showUSD}
                onChange={(e) => setShowUSD(e.target.checked)}
                className="rounded"
                data-testid="toggle-usd"
              />
              Show USD
            </label>
            <div className="flex bg-white rounded-lg border p-0.5">
              <button
                onClick={() => setActiveSection("financial")}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeSection === "financial" ? "bg-primary text-white" : "text-gray-600"}`}
                data-testid="tab-financial"
              >
                Financials
              </button>
              <button
                onClick={() => setActiveSection("subscribers")}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeSection === "subscribers" ? "bg-primary text-white" : "text-gray-600"}`}
                data-testid="tab-subscribers"
              >
                Subscribers & Purchases
              </button>
              <button
                onClick={() => setActiveSection("provisional")}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeSection === "provisional" ? "bg-primary text-white" : "text-gray-600"}`}
                data-testid="tab-provisional-access"
              >
                Provisional Access
              </button>
            </div>
          </div>
        </div>

        {activeSection === "financial" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" data-testid="section-financial-cards">
              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <DollarSign className="w-4 h-4" />
                    <span>{t("pages.adminBusinessHealth.totalInvested")}</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600" data-testid="text-total-invested">
                    ${fmt(fin.totalInvestedCAD || 0)} CAD
                  </p>
                  {showUSD && <p className="text-sm text-gray-400">${fmt(fin.totalInvestedUSD || 0)} USD</p>}
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <TrendingUp className="w-4 h-4" />
                    <span>{t("pages.adminBusinessHealth.totalRevenue")}</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600" data-testid="text-total-revenue">
                    ${fmt(fin.totalRevenueCAD || 0)} CAD
                  </p>
                  {showUSD && <p className="text-sm text-gray-400">${fmt(fin.totalRevenueUSD || 0)} USD</p>}
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-yellow-500">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <Target className="w-4 h-4" />
                    <span>{t("pages.adminBusinessHealth.breakevenRemaining")}</span>
                  </div>
                  <p className={`text-2xl font-bold ${breakEvenColor}`} data-testid="text-breakeven">
                    ${fmt(fin.breakEvenRemainingCAD || 0)} CAD
                  </p>
                  {showUSD && <p className="text-sm text-gray-400">${fmt(fin.breakEvenRemainingUSD || 0)} USD</p>}
                </CardContent>
              </Card>

              <Card className={`border-l-4 ${(fin.grossProfitLossCAD || 0) >= 0 ? "border-l-green-500" : "border-l-red-500"}`}>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    {(fin.grossProfitLossCAD || 0) >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    <span>{t("pages.adminBusinessHealth.grossProfitloss")}</span>
                  </div>
                  <p className={`text-2xl font-bold ${profitColor}`} data-testid="text-profit-loss">
                    {(fin.grossProfitLossCAD || 0) >= 0 ? "+" : ""}${fmt(fin.grossProfitLossCAD || 0)} CAD
                  </p>
                  {showUSD && <p className="text-sm text-gray-400">${fmt(fin.grossProfitLossUSD || 0)} USD</p>}
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Revenue Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium">{t("pages.adminBusinessHealth.subscriptionRevenue")}</span>
                      <span className="font-bold text-green-600" data-testid="text-sub-revenue">
                        ${fmt(fin.subscriptionRevenueCAD || 0)} CAD
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium">{t("pages.adminBusinessHealth.onetimePurchaseRevenue")}</span>
                      <span className="font-bold text-blue-600" data-testid="text-onetime-revenue">
                        ${fmt(fin.oneTimeRevenueCAD || 0)} CAD
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span className="text-sm font-medium">{t("pages.adminBusinessHealth.revenueThisMonth")}</span>
                      <span className="font-bold text-purple-600" data-testid="text-revenue-month">
                        ${fmt(fin.revenueThisMonthCAD || 0)} CAD
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Spend Tracking
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                      <span className="text-sm font-medium">{t("pages.adminBusinessHealth.replitSpendTotal")}</span>
                      <span className="font-bold text-orange-600" data-testid="text-replit-spend">
                        ${fmt(spend.replitSpendCAD || 0)} CAD
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                      <span className="text-sm font-medium">{t("pages.adminBusinessHealth.aiGenerationSpend")}</span>
                      <span className="font-bold text-amber-600" data-testid="text-ai-spend">
                        ${fmt(spend.aiGenerationSpendCAD || 0)} CAD
                        <span className="text-xs text-gray-400 ml-1">(${fmt(spend.aiGenerationSpendUSD || 0)} USD)</span>
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                      <span className="text-sm font-medium">{t("pages.adminBusinessHealth.manualExpensesTotal")}</span>
                      <span className="font-bold text-red-600" data-testid="text-manual-expenses">
                        ${fmt(spend.manualExpensesCAD || 0)} CAD
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg border-t-2 border-gray-300">
                      <span className="text-sm font-semibold">{t("pages.adminBusinessHealth.spendThisMonth")}</span>
                      <span className="font-bold" data-testid="text-spend-month">
                        ${fmt(spend.spendThisMonthCAD || 0)} CAD
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {spend.categoryTotals && Object.keys(spend.categoryTotals).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-5 h-5" />
                    Expenses by Category
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.entries(spend.categoryTotals as Record<string, number>).map(([cat, total]) => {
                      const label = EXPENSE_CATEGORIES.find(c => c.value === cat)?.label || cat;
                      return (
                        <div key={cat} className="p-3 bg-gray-50 rounded-lg text-center">
                          <p className="text-xs text-gray-500 mb-1">{label}</p>
                          <p className="font-bold text-lg" data-testid={`text-cat-${cat}`}>${fmt(total)}</p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Manual Expense Entries
                  </CardTitle>
                  <Button
                    size="sm"
                    onClick={() => { resetForm(); setShowExpenseForm(true); }}
                    data-testid="button-add-expense"
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add Expense
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {showExpenseForm && (
                  <div className="mb-6 p-4 border rounded-lg bg-gray-50 space-y-3" data-testid="form-expense">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs font-medium text-gray-500 mb-1 block">{t("pages.adminBusinessHealth.category")}</label>
                        <select
                          value={expenseForm.category}
                          onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                          className="w-full border rounded-md px-3 py-2 text-sm"
                          data-testid="select-expense-category"
                        >
                          {EXPENSE_CATEGORIES.map(c => (
                            <option key={c.value} value={c.value}>{c.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 mb-1 block">{t("pages.adminBusinessHealth.vendor")}</label>
                        <Input
                          placeholder="e.g. Replit, Namecheap..."
                          value={expenseForm.vendor}
                          onChange={(e) => setExpenseForm({ ...expenseForm, vendor: e.target.value })}
                          data-testid="input-expense-vendor"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 mb-1 block">{t("pages.adminBusinessHealth.description")}</label>
                        <Input
                          placeholder={t("pages.adminBusinessHealth.optionalDescription")}
                          value={expenseForm.description}
                          onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                          data-testid="input-expense-description"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div>
                        <label className="text-xs font-medium text-gray-500 mb-1 block">{t("pages.adminBusinessHealth.amount")}</label>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={expenseForm.amount}
                          onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                          data-testid="input-expense-amount"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 mb-1 block">{t("pages.adminBusinessHealth.currency")}</label>
                        <select
                          value={expenseForm.currency}
                          onChange={(e) => setExpenseForm({ ...expenseForm, currency: e.target.value })}
                          className="w-full border rounded-md px-3 py-2 text-sm"
                          data-testid="select-expense-currency"
                        >
                          {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 mb-1 block">{t("pages.adminBusinessHealth.date")}</label>
                        <Input
                          type="date"
                          value={expenseForm.date}
                          onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
                          data-testid="input-expense-date"
                        />
                      </div>
                      <div className="flex items-end gap-3">
                        <label className="flex items-center gap-1.5 text-sm cursor-pointer pb-2">
                          <input
                            type="checkbox"
                            checked={expenseForm.recurring}
                            onChange={(e) => setExpenseForm({ ...expenseForm, recurring: e.target.checked })}
                            className="rounded"
                            data-testid="checkbox-expense-recurring"
                          />
                          Recurring
                        </label>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-1">
                      <Button
                        size="sm"
                        onClick={handleSubmit}
                        disabled={!expenseForm.vendor || !expenseForm.amount}
                        data-testid="button-save-expense"
                      >
                        <Save className="w-4 h-4 mr-1" /> {editingExpense ? "Update" : "Save"}
                      </Button>
                      <Button size="sm" variant="outline" onClick={resetForm} data-testid="button-cancel-expense">
                        <X className="w-4 h-4 mr-1" /> Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {(expenses || []).length === 0 ? (
                  <p className="text-gray-400 text-center py-6">{t("pages.adminBusinessHealth.noExpensesRecordedYet")}</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm" data-testid="table-expenses">
                      <thead>
                        <tr className="border-b text-left text-gray-500">
                          <th className="pb-2 pr-3">{t("pages.adminBusinessHealth.date2")}</th>
                          <th className="pb-2 pr-3">{t("pages.adminBusinessHealth.category2")}</th>
                          <th className="pb-2 pr-3">{t("pages.adminBusinessHealth.vendor2")}</th>
                          <th className="pb-2 pr-3">{t("pages.adminBusinessHealth.description2")}</th>
                          <th className="pb-2 pr-3 text-right">{t("pages.adminBusinessHealth.amount2")}</th>
                          <th className="pb-2 pr-3">{t("pages.adminBusinessHealth.recurring")}</th>
                          <th className="pb-2">{t("pages.adminBusinessHealth.actions")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(expenses || []).map((exp: any) => (
                          <tr key={exp.id} className="border-b hover:bg-gray-50" data-testid={`row-expense-${exp.id}`}>
                            <td className="py-2 pr-3 whitespace-nowrap">{exp.date}</td>
                            <td className="py-2 pr-3">
                              <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium">
                                {EXPENSE_CATEGORIES.find(c => c.value === exp.category)?.label || exp.category}
                              </span>
                            </td>
                            <td className="py-2 pr-3 font-medium">{exp.vendor}</td>
                            <td className="py-2 pr-3 text-gray-500 max-w-48 truncate">{exp.description || "—"}</td>
                            <td className="py-2 pr-3 text-right font-mono font-bold">
                              ${fmt(exp.amount)} {exp.currency}
                            </td>
                            <td className="py-2 pr-3">
                              {exp.recurring ? (
                                <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">{t("pages.adminBusinessHealth.yes")}</span>
                              ) : (
                                <span className="text-xs text-gray-400">No</span>
                              )}
                            </td>
                            <td className="py-2">
                              <div className="flex gap-1">
                                <button
                                  onClick={() => startEdit(exp)}
                                  className="p-1 text-gray-400 hover:text-blue-600"
                                  data-testid={`button-edit-expense-${exp.id}`}
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => { if (confirm("Delete this expense?")) deleteExpense.mutate(exp.id); }}
                                  className="p-1 text-gray-400 hover:text-red-600"
                                  data-testid={`button-delete-expense-${exp.id}`}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeSection === "subscribers" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" data-testid="section-subscriber-cards">
              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <Users className="w-4 h-4" />
                    <span>{t("pages.adminBusinessHealth.totalUsers")}</span>
                  </div>
                  <p className="text-2xl font-bold" data-testid="text-total-users">{subs.totalUsers || 0}</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <Users className="w-4 h-4" />
                    <span>{t("pages.adminBusinessHealth.activeSubscribers")}</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600" data-testid="text-active-subs">{subs.activeSubscribers || 0}</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-red-500">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <Users className="w-4 h-4" />
                    <span>{t("pages.adminBusinessHealth.cancelledSubscribers")}</span>
                  </div>
                  <p className="text-2xl font-bold text-red-600" data-testid="text-cancelled-subs">{subs.cancelledSubscribers || 0}</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <BarChart3 className="w-4 h-4" />
                    <span>{t("pages.adminBusinessHealth.conversionRate")}</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-600" data-testid="text-conversion-rate">{subs.conversionRate || "0.0"}%</p>
                  <p className="text-xs text-gray-400 mt-1">{subs.paidUsers || 0} paid / {subs.freeUsers || 0} free</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Subscriber Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">{t("pages.adminBusinessHealth.freeUsers")}</span>
                      <span className="font-bold text-gray-600" data-testid="text-free-users">{subs.freeUsers || 0}</span>
                    </div>
                    {subs.byTier && Object.entries(subs.byTier as Record<string, number>).map(([tier, count]) => {
                      const colors: Record<string, string> = {
                        rpn: "text-blue-600 bg-blue-50",
                        rn: "text-purple-600 bg-purple-50",
                        np: "text-amber-600 bg-amber-50",
                        admin: "text-red-600 bg-red-50",
                      };
                      const labels: Record<string, string> = { rpn: "RPN/LVN", rn: "RN", np: "NP Advanced", admin: "Admin" };
                      const [textColor, bgColor] = (colors[tier] || "text-gray-600 bg-gray-50").split(" ");
                      return (
                        <div key={tier} className={`flex justify-between items-center p-3 ${bgColor} rounded-lg`}>
                          <span className="text-sm font-medium">{labels[tier] || tier.toUpperCase()}</span>
                          <span className={`font-bold ${textColor}`} data-testid={`text-tier-${tier}`}>{count}</span>
                        </div>
                      );
                    })}
                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                      <span className="text-sm font-medium">{t("pages.adminBusinessHealth.pastDue")}</span>
                      <span className="font-bold text-yellow-600" data-testid="text-past-due">{subs.pastDueSubscribers || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                      <span className="text-sm font-medium">{t("pages.adminBusinessHealth.inactive")}</span>
                      <span className="font-bold text-gray-500" data-testid="text-inactive">{subs.inactiveUsers || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Purchase Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium">{t("pages.adminBusinessHealth.totalPurchases")}</span>
                      <span className="font-bold text-green-600" data-testid="text-total-purchases">{purchases.totalPurchases || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium">{t("pages.adminBusinessHealth.totalSales")}</span>
                      <span className="font-bold text-blue-600" data-testid="text-total-sales">${fmt(purchases.totalSales || 0)}</span>
                    </div>
                  </div>

                  {purchases.byProduct && purchases.byProduct.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-2">{t("pages.adminBusinessHealth.byProduct")}</p>
                      <div className="space-y-2">
                        {purchases.byProduct.map((p: any, i: number) => (
                          <div key={i} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded" data-testid={`row-product-${i}`}>
                            <span className="truncate max-w-48">{p.title}</span>
                            <div className="text-right">
                              <span className="font-medium">{p.purchaseCount} sales</span>
                              <span className="text-gray-400 ml-2">${fmt(p.revenue)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {purchases.byTier && purchases.byTier.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-2">{t("pages.adminBusinessHealth.byTier")}</p>
                      <div className="space-y-2">
                        {purchases.byTier.map((t: any, i: number) => (
                          <div key={i} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded" data-testid={`row-tier-purchase-${i}`}>
                            <span>{t.tier || "All"}</span>
                            <div className="text-right">
                              <span className="font-medium">{t.purchaseCount} sales</span>
                              <span className="text-gray-400 ml-2">${fmt(t.revenue)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {salesByDate && salesByDate.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Sales by Month
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm" data-testid="table-sales-by-month">
                      <thead>
                        <tr className="border-b text-left text-gray-500">
                          <th className="pb-2 pr-4">{t("pages.adminBusinessHealth.month")}</th>
                          <th className="pb-2 pr-4 text-right">{t("pages.adminBusinessHealth.purchases")}</th>
                          <th className="pb-2 text-right">{t("pages.adminBusinessHealth.revenue")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {salesByDate.map((s: any, i: number) => (
                          <tr key={i} className="border-b hover:bg-gray-50" data-testid={`row-sales-month-${i}`}>
                            <td className="py-2 pr-4 font-medium">{s.month}</td>
                            <td className="py-2 pr-4 text-right">{s.purchaseCount}</td>
                            <td className="py-2 text-right font-bold">${fmt(s.revenue)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeSection === "provisional" && (
          <ProvisionalAccessPanel />
        )}
      </div>
    </div>
  );
}

function ProvisionalAccessPanel() {
  const { data: provisionalData, isLoading } = useQuery({
    queryKey: ["provisional-access"],
    queryFn: async () => {
      const res = await adminFetch("/api/admin/incident-response/provisional-access");
      if (!res.ok) return { grants: [] };
      return res.json();
    },
    refetchInterval: 30000,
  });

  const grants = provisionalData?.grants || [];
  const activeGrants = grants.filter((g: any) => new Date(g.expiresAt) > new Date());

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-500" />
            Provisional Access Grants
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-amber-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-amber-700" data-testid="text-active-grants">{activeGrants.length}</p>
              <p className="text-sm text-amber-600">Active Grants</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-blue-700" data-testid="text-total-grants">{grants.length}</p>
              <p className="text-sm text-blue-600">Total Grants</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-green-700" data-testid="text-auto-grants">
                {grants.filter((g: any) => g.grantedBy === "system").length}
              </p>
              <p className="text-sm text-green-600">Auto-Granted</p>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : activeGrants.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Shield className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p>No active provisional access grants</p>
              <p className="text-sm">Users with billing issues will appear here automatically</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-gray-500">
                    <th className="pb-2 pr-4">User</th>
                    <th className="pb-2 pr-4">Reason</th>
                    <th className="pb-2 pr-4">Granted By</th>
                    <th className="pb-2 pr-4">Expires</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {activeGrants.map((grant: any, i: number) => {
                    const isExpiringSoon = new Date(grant.expiresAt).getTime() - Date.now() < 1800000;
                    return (
                      <tr key={grant.id || i} className="border-b hover:bg-gray-50" data-testid={`row-provisional-${i}`}>
                        <td className="py-2 pr-4 font-medium">{grant.userId}</td>
                        <td className="py-2 pr-4">
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">{grant.reason}</span>
                        </td>
                        <td className="py-2 pr-4">{grant.grantedBy || "system"}</td>
                        <td className="py-2 pr-4 text-xs">
                          {new Date(grant.expiresAt).toLocaleString()}
                        </td>
                        <td className="py-2">
                          {isExpiringSoon ? (
                            <Badge variant="destructive" className="text-xs" data-testid={`badge-expiring-${i}`}>
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Expiring Soon
                            </Badge>
                          ) : (
                            <Badge className="bg-green-100 text-green-800 text-xs" data-testid={`badge-active-${i}`}>Active</Badge>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
