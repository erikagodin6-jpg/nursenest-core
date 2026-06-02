import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { adminFetch } from "@/lib/admin-fetch";
import { useI18n } from "@/lib/i18n";
import {
  Activity,
  Clock,
  CheckCircle2,
  XCircle,
  Ban,
  RefreshCw,
  Search,
  TrendingUp,
  AlertTriangle,
  Users,
  Shield,
  Settings,
  Save,
} from "lucide-react";

interface TrialAnalyticsData {
  stats: {
    total: number;
    active: number;
    expired: number;
    canceled: number;
    blocked: number;
    pending: number;
  };
  tierBreakdown: { selected_tier: string; count: number }[];
  recentFraudFlags: {
    id: string;
    user_id: string;
    abuse_flags: string[];
    signup_ip: string;
    device_fingerprint_hash: string;
    created_at: string;
  }[];
}

interface TrialEntitlement {
  id: string;
  user_id: string;
  username: string;
  email: string;
  selected_tier: string;
  trial_status: string;
  trial_started_at: string;
  trial_ends_at: string;
  signup_ip: string;
  abuse_flags: string[];
  created_at: string;
}

function formatDate(d: string | null) {

  if (!d) return "N/A";
  const date = new Date(d);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  expired: "bg-gray-100 text-gray-600",
  canceled: "bg-yellow-100 text-yellow-700",
  blocked: "bg-red-100 text-red-700",
  pending_payment: "bg-blue-100 text-blue-700",
  converted: "bg-purple-100 text-purple-700",
};

export function AdminTrialAnalytics() {
  const [analytics, setAnalytics] = useState<TrialAnalyticsData | null>(null);
  const [entitlements, setEntitlements] = useState<TrialEntitlement[]>([]);
  const [loading, setLoading] = useState(true);
  const [entitlementsLoading, setEntitlementsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [tierFilter, setTierFilter] = useState<string>("");
  const [ipFilter, setIpFilter] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [subTab, setSubTab] = useState<"analytics" | "audit" | "fraud-settings">("analytics");

  async function fetchAnalytics() {
    setLoading(true);
    try {
      const res = await adminFetch("/api/admin/trial-entitlements/analytics");
      if (res.ok) setAnalytics(await res.json());
    } catch (e) {
      console.error("Failed to load trial analytics:", e);
    } finally {
      setLoading(false);
    }
  }

  async function fetchEntitlements() {
    setEntitlementsLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set("status", statusFilter);
      params.set("limit", "100");
      const res = await adminFetch(`/api/admin/trial-entitlements?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setEntitlements(data.entitlements || []);
      }
    } catch (e) {
      console.error("Failed to load trial entitlements:", e);
    } finally {
      setEntitlementsLoading(false);
    }
  }

  useEffect(() => {
    fetchAnalytics();
    fetchEntitlements();
  }, []);

  useEffect(() => {
    fetchEntitlements();
  }, [statusFilter]);

  const filteredEntitlements = entitlements.filter((e) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        e.username?.toLowerCase().includes(q) ||
        e.email?.toLowerCase().includes(q) ||
        e.signup_ip?.includes(q);
      if (!matchesSearch) return false;
    }
    if (tierFilter && e.selected_tier !== tierFilter) return false;
    if (ipFilter && !e.signup_ip?.includes(ipFilter)) return false;
    if (dateFrom) {
      const from = new Date(dateFrom);
      if (new Date(e.trial_started_at) < from) return false;
    }
    if (dateTo) {
      const to = new Date(dateTo);
      to.setDate(to.getDate() + 1);
      if (new Date(e.trial_started_at) >= to) return false;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
        <span className="ml-2 text-gray-500">{t("components.adminTrialAnalytics.loadingTrialAnalytics")}</span>
      </div>
    );
  }

  const stats = analytics?.stats || { total: 0, active: 0, expired: 0, canceled: 0, blocked: 0, pending: 0 };
  const converted = stats.total - stats.active - stats.expired - stats.canceled - stats.blocked - stats.pending;

  return (
    <div className="space-y-6" data-testid="container-trial-analytics">
      <div className="flex flex-wrap gap-2">
        {[
          { key: "analytics", label: "Trial Analytics", icon: TrendingUp },
          { key: "audit", label: "Trial Audit Log", icon: Activity },
          { key: "fraud-settings", label: "Fraud Settings", icon: Settings },
        ].map(({ key, label, icon: Icon }) => (
          <Button
            key={key}
            variant={subTab === key ? "default" : "outline"}
            size="sm"
            onClick={() => setSubTab(key as "analytics" | "audit" | "fraud-settings")}
            data-testid={`button-trial-subtab-${key}`}
          >
            <Icon className="w-4 h-4 mr-1" />
            {label}
          </Button>
        ))}
        <Button variant="outline" size="sm" onClick={() => { fetchAnalytics(); fetchEntitlements(); }} className="ml-auto" data-testid="button-refresh-trial-analytics">
          <RefreshCw className="w-4 h-4 mr-1" />
          Refresh
        </Button>
      </div>

      {subTab === "analytics" && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4" data-testid="section-trial-stats-cards">
            {[
              { label: "Active Trials", value: stats.active, icon: Activity, color: "text-green-600", bg: "bg-green-50" },
              { label: "Expired", value: stats.expired, icon: Clock, color: "text-gray-600", bg: "bg-gray-50" },
              { label: "Converted", value: Math.max(0, converted), icon: CheckCircle2, color: "text-purple-600", bg: "bg-purple-50" },
              { label: "Canceled", value: stats.canceled, icon: XCircle, color: "text-yellow-600", bg: "bg-yellow-50" },
              { label: "Blocked", value: stats.blocked, icon: Ban, color: "text-red-600", bg: "bg-red-50" },
              { label: "Total", value: stats.total, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
            ].map(({ label, value, icon: Icon, color, bg }) => (
              <Card key={label} className="border border-primary/10" data-testid={`card-trial-stat-${label.toLowerCase().replace(/\s/g, "-")}`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${color}`} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{value}</p>
                      <p className="text-xs text-gray-500">{label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {analytics?.tierBreakdown && analytics.tierBreakdown.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">{t("components.adminTrialAnalytics.trialsByTier")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {analytics.tierBreakdown.map((tb) => (
                    <div key={tb.selected_tier} className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
                      <Badge variant="outline" className="uppercase">{tb.selected_tier}</Badge>
                      <span className="font-bold">{tb.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {analytics?.recentFraudFlags && analytics.recentFraudFlags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  Recent Fraud Flags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="p-2">ID</th>
                        <th className="p-2">{t("components.adminTrialAnalytics.user")}</th>
                        <th className="p-2">IP</th>
                        <th className="p-2">{t("components.adminTrialAnalytics.flags")}</th>
                        <th className="p-2">{t("components.adminTrialAnalytics.date")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.recentFraudFlags.map((ff) => (
                        <tr key={ff.id} className="border-b hover:bg-gray-50" data-testid={`row-fraud-${ff.id}`}>
                          <td className="p-2 font-mono text-xs">{ff.id.slice(0, 8)}</td>
                          <td className="p-2 font-mono text-xs">{ff.user_id.slice(0, 8)}</td>
                          <td className="p-2 font-mono text-xs">{ff.signup_ip}</td>
                          <td className="p-2">
                            <div className="flex flex-wrap gap-1">
                              {(Array.isArray(ff.abuse_flags) ? ff.abuse_flags : []).map((flag, i) => (
                                <Badge key={i} variant="destructive" className="text-xs">{flag}</Badge>
                              ))}
                            </div>
                          </td>
                          <td className="p-2 text-gray-500 text-xs">{formatDate(ff.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {subTab === "audit" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Trial Audit Table
            </CardTitle>
            <div className="flex flex-wrap gap-2 mt-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder={t("components.adminTrialAnalytics.searchByUserEmailIp")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9"
                  data-testid="input-trial-audit-search"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 px-3 rounded-md border text-sm bg-white"
                data-testid="select-trial-status-filter"
              >
                <option value="">{t("components.adminTrialAnalytics.allStatuses")}</option>
                <option value="active">{t("components.adminTrialAnalytics.active")}</option>
                <option value="expired">{t("components.adminTrialAnalytics.expired")}</option>
                <option value="canceled">{t("components.adminTrialAnalytics.canceled")}</option>
                <option value="blocked">{t("components.adminTrialAnalytics.blocked")}</option>
                <option value="pending_payment">{t("components.adminTrialAnalytics.pendingPayment")}</option>
                <option value="converted">{t("components.adminTrialAnalytics.converted")}</option>
              </select>
              <select
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value)}
                className="h-9 px-3 rounded-md border text-sm bg-white"
                data-testid="select-trial-tier-filter"
              >
                <option value="">{t("components.adminTrialAnalytics.allTiers")}</option>
                <option value="rpn">RPN</option>
                <option value="rn">RN</option>
                <option value="np">NP</option>
              </select>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              <Input
                placeholder={t("components.adminTrialAnalytics.filterByIpAddress")}
                value={ipFilter}
                onChange={(e) => setIpFilter(e.target.value)}
                className="h-9 w-[180px]"
                data-testid="input-trial-ip-filter"
              />
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-gray-500">{t("components.adminTrialAnalytics.from")}</span>
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="h-9 w-[150px]"
                  data-testid="input-trial-date-from"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-gray-500">{t("components.adminTrialAnalytics.to")}</span>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="h-9 w-[150px]"
                  data-testid="input-trial-date-to"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {entitlementsLoading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="w-5 h-5 animate-spin text-gray-400" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm" data-testid="table-trial-audit">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="p-2">{t("components.adminTrialAnalytics.user2")}</th>
                      <th className="p-2">{t("components.adminTrialAnalytics.email")}</th>
                      <th className="p-2">{t("components.adminTrialAnalytics.tier")}</th>
                      <th className="p-2">{t("components.adminTrialAnalytics.status")}</th>
                      <th className="p-2">IP</th>
                      <th className="p-2">{t("components.adminTrialAnalytics.started")}</th>
                      <th className="p-2">{t("components.adminTrialAnalytics.ends")}</th>
                      <th className="p-2">{t("components.adminTrialAnalytics.flags2")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEntitlements.map((ent) => (
                      <tr key={ent.id} className="border-b hover:bg-gray-50" data-testid={`row-trial-${ent.id}`}>
                        <td className="p-2 font-medium">{ent.username || ent.user_id?.slice(0, 8)}</td>
                        <td className="p-2 text-xs text-gray-500">{ent.email || "N/A"}</td>
                        <td className="p-2">
                          <Badge variant="outline" className="uppercase text-xs">{ent.selected_tier}</Badge>
                        </td>
                        <td className="p-2">
                          <Badge className={statusColors[ent.trial_status] || "bg-gray-100 text-gray-600"}>
                            {ent.trial_status}
                          </Badge>
                        </td>
                        <td className="p-2 font-mono text-xs">{ent.signup_ip || "N/A"}</td>
                        <td className="p-2 text-gray-500 text-xs">{formatDate(ent.trial_started_at)}</td>
                        <td className="p-2 text-gray-500 text-xs">{formatDate(ent.trial_ends_at)}</td>
                        <td className="p-2">
                          {Array.isArray(ent.abuse_flags) && ent.abuse_flags.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {ent.abuse_flags.map((f: string, i: number) => (
                                <Badge key={i} variant="destructive" className="text-xs">{f}</Badge>
                              ))}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">{t("components.adminTrialAnalytics.none")}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {filteredEntitlements.length === 0 && (
                      <tr>
                        <td colSpan={8} className="p-4 text-center text-gray-400">
                          No trial entitlements found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {subTab === "fraud-settings" && <FraudSettingsPanel />}
    </div>
  );
}

type FraudSettings = {
  maxDeviceAttempts: number;
  maxIpAttempts: number;
  ipWindowHours: number;
  maxQuestions: number;
  maxFlashcards: number;
  maxLessons: number;
  maxMockExams: number;
  trialDurationHours: number;
};

function FraudSettingsPanel() {
  const [settings, setSettings] = useState<FraudSettings>({
    maxDeviceAttempts: 3,
    maxIpAttempts: 5,
    ipWindowHours: 24,
    maxQuestions: 50,
    maxFlashcards: 30,
    maxLessons: 5,
    maxMockExams: 2,
    trialDurationHours: 24,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    adminFetch("/api/admin/trial-fraud-settings")
      .then((r) => {
        if (r.ok) return r.json();
        return null;
      })
      .then((data) => {
        if (data) setSettings(data);
      })
      .catch(() => {});
  }, []);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      const res = await adminFetch("/api/admin/trial-fraud-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (e) {
      console.error("Failed to save fraud settings:", e);
    } finally {
      setSaving(false);
    }
  }

  const fields: { key: keyof FraudSettings; label: string; description: string }[] = [
    { key: "trialDurationHours", label: "Trial Duration (hours)", description: "How long the free trial lasts" },
    { key: "maxDeviceAttempts", label: "Max Device Attempts", description: "Maximum trial activations per device fingerprint" },
    { key: "maxIpAttempts", label: "Max IP Attempts", description: "Maximum trial activations per IP address within the window" },
    { key: "ipWindowHours", label: "IP Window (hours)", description: "Time window for IP-based rate limiting" },
    { key: "maxQuestions", label: "Max Questions", description: "Maximum questions accessible during trial" },
    { key: "maxFlashcards", label: "Max Flashcards", description: "Maximum flashcards accessible during trial" },
    { key: "maxLessons", label: "Max Lessons", description: "Maximum lessons accessible during trial" },
    { key: "maxMockExams", label: "Max Mock Exams", description: "Maximum mock exams accessible during trial" },
  ];

  return (
    <Card data-testid="panel-fraud-settings">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-amber-600" />
          Trial Fraud Prevention Settings
        </CardTitle>
        <p className="text-xs text-gray-500 mt-1">
          Configure thresholds for fraud detection and content consumption limits during trial periods.
          Changes take effect immediately via environment variables.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map(({ key, label, description }) => (
            <div key={key} className="space-y-1" data-testid={`field-fraud-${key}`}>
              <label className="text-sm font-medium text-gray-700">{label}</label>
              <Input
                type="number"
                min={1}
                value={settings[key]}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    [key]: parseInt(e.target.value, 10) || 0,
                  }))
                }
                className="h-9"
                data-testid={`input-fraud-${key}`}
              />
              <p className="text-xs text-gray-400">{description}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button
            onClick={handleSave}
            disabled={saving}
            data-testid="button-save-fraud-settings"
          >
            <Save className="w-4 h-4 mr-1" />
            {saving ? "Saving..." : "Save Settings"}
          </Button>
          {saved && (
            <span className="text-sm text-green-600 font-medium" data-testid="text-fraud-settings-saved">
              Settings saved successfully
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
