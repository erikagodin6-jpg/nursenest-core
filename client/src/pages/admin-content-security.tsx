import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { adminFetch } from "@/lib/admin-fetch";
import { useI18n } from "@/lib/i18n";
import {
  Shield,
  AlertTriangle,
  Eye,
  Ban,
  Activity,
  Users,
  Clock,
  RefreshCw,
  UserX,
  Flag,
  ShieldAlert,
  Unlock,
  Lock,
} from "lucide-react";

interface AbuseOverviewData {
  rateLimitHitsByCategory: Array<{
    category: string;
    hit_count: number;
    last_24h: number;
    last_7d: number;
  }>;
  topOffendingIps: {
    last24h: Array<{
      ip_address: string;
      incident_count: number;
      last_seen: string;
      event_types: string[];
    }>;
    last7d: Array<{
      ip_address: string;
      incident_count: number;
      last_seen: string;
      event_types: string[];
    }>;
  };
  topOffendingUsers: Array<{
    user_id: string;
    incident_count: number;
    last_seen: string;
    event_types: string[];
    username: string;
    email: string;
    tier: string;
  }>;
  recentEscalations: Array<{
    user_id: string;
    ip_address: string;
    endpoint: string;
    event_type: string;
    request_count: number;
    metadata: any;
    created_at: string;
  }>;
  activeBlocks: Array<{
    key: string;
    blockedUntil: number;
    tempBlocks: number;
    rateLimitHits: number;
  }>;
  manualBlocks: Array<{
    key: string;
    until: number;
    reason: string;
  }>;
}

interface DashboardData {
  watermarkSessions: {
    total_sessions: number;
    unique_users: number;
    last_24h: number;
    recent: Array<{
      id: string;
      user_id: string;
      masked_email: string;
      user_id_suffix: string;
      ip_address: string;
      created_at: string;
      username: string;
      tier: string;
    }>;
  };
  scrapingAttempts: {
    total: number;
    last_24h: number;
    last_7d: number;
  };
  blockedIps: Array<{
    ip_address: string;
    incident_count: number;
    last_seen: string;
  }>;
  suspiciousSessions: Array<{
    user_id: string;
    ip_address: string;
    endpoint: string;
    event_type: string;
    request_count: number;
    metadata: any;
    created_at: string;
  }>;
  trialAbuse: Array<{
    user_id: string;
    ip_address: string;
    metadata: any;
    created_at: string;
    username: string;
    email: string;
    tier: string;
  }>;
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

const eventTypeLabels: Record<string, { label: string; color: string }> = {
  rate_limit_exceeded: { label: "Rate Limit", color: "bg-red-100 text-red-700" },
  rapid_request_detected: { label: "Rapid Requests", color: "bg-orange-100 text-orange-700" },
  rate_limit_blocked: { label: "Blocked", color: "bg-red-200 text-red-800" },
  daily_limit_reached: { label: "Daily Limit", color: "bg-yellow-100 text-yellow-700" },
  admin_flag_user: { label: "Flagged", color: "bg-purple-100 text-purple-700" },
  admin_suspend_user: { label: "Suspended", color: "bg-gray-100 text-gray-700" },
  abuse_warning: { label: "Warning", color: "bg-yellow-100 text-yellow-700" },
  abuse_temp_block: { label: "Temp Block", color: "bg-orange-100 text-orange-700" },
  abuse_extended_block: { label: "Extended Block", color: "bg-red-100 text-red-700" },
  bot_heuristic_flag: { label: "Bot Detected", color: "bg-purple-100 text-purple-700" },
  bot_auto_blocked: { label: "Bot Blocked", color: "bg-red-200 text-red-800" },
  admin_unblock: { label: "Unblocked", color: "bg-green-100 text-green-700" },
  admin_block_ip: { label: "IP Blocked", color: "bg-red-200 text-red-800" },
};

export default function AdminContentSecurity() {
  const { t } = useI18n();
  const [data, setData] = useState<DashboardData | null>(null);
  const [abuseData, setAbuseData] = useState<AbuseOverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [subTab, setSubTab] = useState<"overview" | "watermarks" | "scraping" | "blocked" | "sessions" | "abuse" | "rate-limits">("overview");
  const [flaggingUser, setFlaggingUser] = useState<string | null>(null);
  const [unblocking, setUnblocking] = useState<string | null>(null);
  const [abuseTimeRange, setAbuseTimeRange] = useState<"24h" | "7d">("24h");

  async function fetchDashboard() {
    setLoading(true);
    try {
      const [dashRes, abuseRes] = await Promise.all([
        adminFetch("/api/admin/content-security/dashboard"),
        adminFetch("/api/admin/content-security/abuse-overview"),
      ]);
      if (dashRes.ok) {
        setData(await dashRes.json());
      }
      if (abuseRes.ok) {
        setAbuseData(await abuseRes.json());
      }
    } catch (e) {
      console.error("Failed to load content security dashboard:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDashboard();
  }, []);

  async function handleUnblock(target: string, type: "ip" | "user") {
    setUnblocking(target);
    try {
      const res = await adminFetch("/api/admin/content-security/unblock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target, type }),
      });
      if (res.ok) {
        await fetchDashboard();
      }
    } catch {
    } finally {
      setUnblocking(null);
    }
  }

  async function handleFlagUser(userId: string, action: "flag" | "suspend" | "unflag") {
    setFlaggingUser(userId);
    try {
      const res = await adminFetch("/api/admin/content-security/flag-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action }),
      });
      if (res.ok) {
        await fetchDashboard();
      }
    } catch {
    } finally {
      setFlaggingUser(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
        <span className="ml-2 text-gray-500">{t("pages.adminContentSecurity.loadingSecurityData")}</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-8 text-gray-500" data-testid="text-security-error">
        Failed to load content security data.
      </div>
    );
  }

  const subTabs = [
    { key: "overview", label: "Overview", icon: Shield },
    { key: "rate-limits", label: "Abuse & Rate Limiting", icon: ShieldAlert },
    { key: "watermarks", label: "Watermarks", icon: Eye },
    { key: "scraping", label: "Scraping", icon: AlertTriangle },
    { key: "blocked", label: "Blocked IPs", icon: Ban },
    { key: "sessions", label: "Suspicious", icon: Activity },
    { key: "abuse", label: "Trial Abuse", icon: UserX },
  ] as const;

  return (
    <div className="space-y-6" data-testid="container-content-security">
      <div className="flex flex-wrap gap-2">
        {subTabs.map(({ key, label, icon: Icon }) => (
          <Button
            key={key}
            variant={subTab === key ? "default" : "outline"}
            size="sm"
            onClick={() => setSubTab(key)}
            data-testid={`button-security-tab-${key}`}
          >
            <Icon className="w-4 h-4 mr-1" />
            {label}
          </Button>
        ))}
        <Button variant="outline" size="sm" onClick={fetchDashboard} className="ml-auto" data-testid="button-refresh-security">
          <RefreshCw className="w-4 h-4 mr-1" />
          Refresh
        </Button>
      </div>

      {subTab === "overview" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Eye className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-watermark-total">{data.watermarkSessions.total_sessions}</p>
                  <p className="text-xs text-gray-500">{t("pages.adminContentSecurity.watermarkSessions")}</p>
                  <p className="text-xs text-gray-400">{data.watermarkSessions.last_24h} in last 24h</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-8 h-8 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-scraping-total">{data.scrapingAttempts.total}</p>
                  <p className="text-xs text-gray-500">{t("pages.adminContentSecurity.scrapingAttempts")}</p>
                  <p className="text-xs text-gray-400">{data.scrapingAttempts.last_24h} in last 24h</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Ban className="w-8 h-8 text-red-500" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-blocked-ips-count">{data.blockedIps.length}</p>
                  <p className="text-xs text-gray-500">{t("pages.adminContentSecurity.blockedIps")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-unique-users">{data.watermarkSessions.unique_users}</p>
                  <p className="text-xs text-gray-500">{t("pages.adminContentSecurity.uniqueUsersTracked")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {subTab === "rate-limits" && abuseData && (
        <div className="space-y-6" data-testid="container-abuse-overview">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <ShieldAlert className="w-8 h-8 text-orange-500" />
                  <div>
                    <p className="text-2xl font-bold" data-testid="text-total-rate-limit-hits">
                      {abuseData.rateLimitHitsByCategory.reduce((sum, c) => sum + c.hit_count, 0)}
                    </p>
                    <p className="text-xs text-gray-500">Total Rate Limit Hits</p>
                    <p className="text-xs text-gray-400">
                      {abuseData.rateLimitHitsByCategory.reduce((sum, c) => sum + c.last_24h, 0)} in last 24h
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Ban className="w-8 h-8 text-red-500" />
                  <div>
                    <p className="text-2xl font-bold" data-testid="text-active-blocks">
                      {abuseData.activeBlocks.filter(b => b.blockedUntil > Date.now()).length + abuseData.manualBlocks.length}
                    </p>
                    <p className="text-xs text-gray-500">Active Blocks</p>
                    <p className="text-xs text-gray-400">{abuseData.manualBlocks.length} manual</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-8 h-8 text-yellow-500" />
                  <div>
                    <p className="text-2xl font-bold" data-testid="text-top-offenders-count">
                      {abuseData.topOffendingIps.last24h.length}
                    </p>
                    <p className="text-xs text-gray-500">Offending IPs (24h)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Users className="w-8 h-8 text-purple-500" />
                  <div>
                    <p className="text-2xl font-bold" data-testid="text-offending-users-count">
                      {abuseData.topOffendingUsers.length}
                    </p>
                    <p className="text-xs text-gray-500">Offending Users (24h)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" /> Rate Limit Hits by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="p-2">Category</th>
                      <th className="p-2">Total Hits</th>
                      <th className="p-2">Last 24h</th>
                      <th className="p-2">Last 7d</th>
                    </tr>
                  </thead>
                  <tbody>
                    {abuseData.rateLimitHitsByCategory.map((cat) => (
                      <tr key={cat.category} className="border-b hover:bg-gray-50" data-testid={`row-category-${cat.category}`}>
                        <td className="p-2 font-medium">{cat.category}</td>
                        <td className="p-2">
                          <Badge variant={cat.hit_count > 100 ? "destructive" : "outline"}>{cat.hit_count}</Badge>
                        </td>
                        <td className="p-2">{cat.last_24h}</td>
                        <td className="p-2">{cat.last_7d}</td>
                      </tr>
                    ))}
                    {abuseData.rateLimitHitsByCategory.length === 0 && (
                      <tr><td colSpan={4} className="p-4 text-center text-gray-400">No rate limit events recorded</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Ban className="w-5 h-5" /> Top Offending IPs
                  <div className="ml-auto flex gap-1">
                    <Button
                      variant={abuseTimeRange === "24h" ? "default" : "outline"}
                      size="sm"
                      className="h-6 text-xs"
                      onClick={() => setAbuseTimeRange("24h")}
                      data-testid="button-abuse-24h"
                    >24h</Button>
                    <Button
                      variant={abuseTimeRange === "7d" ? "default" : "outline"}
                      size="sm"
                      className="h-6 text-xs"
                      onClick={() => setAbuseTimeRange("7d")}
                      data-testid="button-abuse-7d"
                    >7d</Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {(abuseTimeRange === "24h" ? abuseData.topOffendingIps.last24h : abuseData.topOffendingIps.last7d).map((ip) => (
                    <div key={ip.ip_address} className="flex items-center justify-between p-2 bg-gray-50 rounded" data-testid={`row-offending-ip-${ip.ip_address}`}>
                      <div>
                        <span className="font-mono text-sm">{ip.ip_address}</span>
                        <div className="flex gap-1 mt-1">
                          {ip.event_types?.slice(0, 3).map((et) => {
                            const info = eventTypeLabels[et] || { label: et, color: "bg-gray-100 text-gray-700" };
                            return <Badge key={et} className={`text-xs ${info.color}`}>{info.label}</Badge>;
                          })}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={ip.incident_count > 10 ? "destructive" : "outline"}>{ip.incident_count}</Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => handleUnblock(ip.ip_address, "ip")}
                          disabled={unblocking === ip.ip_address}
                          data-testid={`button-unblock-ip-${ip.ip_address}`}
                        >
                          <Unlock className="w-3 h-3 mr-1" />
                          Unblock
                        </Button>
                      </div>
                    </div>
                  ))}
                  {(abuseTimeRange === "24h" ? abuseData.topOffendingIps.last24h : abuseData.topOffendingIps.last7d).length === 0 && (
                    <p className="text-center text-gray-400 py-4">No offending IPs in this period</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <UserX className="w-5 h-5" /> Top Offending Users (24h)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {abuseData.topOffendingUsers.map((u) => (
                    <div key={u.user_id} className="flex items-center justify-between p-2 bg-gray-50 rounded" data-testid={`row-offending-user-${u.user_id}`}>
                      <div>
                        <span className="font-medium text-sm">{u.username || u.user_id?.slice(0, 8)}</span>
                        <span className="ml-2 text-xs text-gray-500">{u.email || ""}</span>
                        <div className="flex gap-1 mt-1">
                          <Badge variant="outline" className="text-xs">{u.tier || "free"}</Badge>
                          {u.event_types?.slice(0, 2).map((et) => {
                            const info = eventTypeLabels[et] || { label: et, color: "bg-gray-100 text-gray-700" };
                            return <Badge key={et} className={`text-xs ${info.color}`}>{info.label}</Badge>;
                          })}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={u.incident_count > 10 ? "destructive" : "outline"}>{u.incident_count}</Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => handleUnblock(u.user_id, "user")}
                          disabled={unblocking === u.user_id}
                          data-testid={`button-unblock-user-${u.user_id}`}
                        >
                          <Unlock className="w-3 h-3 mr-1" />
                          Unblock
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => handleFlagUser(u.user_id, "suspend")}
                          disabled={flaggingUser === u.user_id}
                          data-testid={`button-suspend-offender-${u.user_id}`}
                        >
                          <UserX className="w-3 h-3 mr-1" />
                          Suspend
                        </Button>
                      </div>
                    </div>
                  ))}
                  {abuseData.topOffendingUsers.length === 0 && (
                    <p className="text-center text-gray-400 py-4">No offending users in the last 24h</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" /> Recent Escalation Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="p-2">User</th>
                      <th className="p-2">IP</th>
                      <th className="p-2">Endpoint</th>
                      <th className="p-2">Event</th>
                      <th className="p-2">Count</th>
                      <th className="p-2">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {abuseData.recentEscalations.map((e, i) => {
                      const evtInfo = eventTypeLabels[e.event_type] || { label: e.event_type, color: "bg-gray-100 text-gray-700" };
                      return (
                        <tr key={i} className="border-b hover:bg-gray-50" data-testid={`row-escalation-${i}`}>
                          <td className="p-2 font-mono text-xs">{e.user_id?.slice(0, 8) || "N/A"}</td>
                          <td className="p-2 font-mono text-xs">{e.ip_address}</td>
                          <td className="p-2 text-xs max-w-[200px] truncate">{e.endpoint}</td>
                          <td className="p-2">
                            <Badge className={evtInfo.color}>{evtInfo.label}</Badge>
                          </td>
                          <td className="p-2">{e.request_count}</td>
                          <td className="p-2 text-gray-500 text-xs">{formatDate(e.created_at)}</td>
                        </tr>
                      );
                    })}
                    {abuseData.recentEscalations.length === 0 && (
                      <tr><td colSpan={6} className="p-4 text-center text-gray-400">No escalation events recorded</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {(abuseData.activeBlocks.length > 0 || abuseData.manualBlocks.length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" /> Currently Active Blocks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {abuseData.activeBlocks.filter(b => b.blockedUntil > Date.now()).map((b) => (
                    <div key={b.key} className="flex items-center justify-between p-2 bg-red-50 rounded" data-testid={`row-active-block-${b.key}`}>
                      <div>
                        <span className="font-mono text-sm">{b.key}</span>
                        <span className="ml-2 text-xs text-gray-500">
                          Expires in {Math.ceil((b.blockedUntil - Date.now()) / 60000)}m
                        </span>
                        <Badge className="ml-2 text-xs bg-orange-100 text-orange-700">{b.tempBlocks} temp blocks</Badge>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => handleUnblock(b.key, "ip")}
                        disabled={unblocking === b.key}
                        data-testid={`button-unblock-active-${b.key}`}
                      >
                        <Unlock className="w-3 h-3 mr-1" />
                        Unblock
                      </Button>
                    </div>
                  ))}
                  {abuseData.manualBlocks.map((b) => (
                    <div key={b.key} className="flex items-center justify-between p-2 bg-red-50 rounded" data-testid={`row-manual-block-${b.key}`}>
                      <div>
                        <span className="font-mono text-sm">{b.key}</span>
                        <Badge className="ml-2 text-xs bg-red-100 text-red-700">Manual: {b.reason}</Badge>
                        {b.until > 0 && (
                          <span className="ml-2 text-xs text-gray-500">
                            Expires in {Math.ceil((b.until - Date.now()) / 60000)}m
                          </span>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => handleUnblock(b.key, "ip")}
                        disabled={unblocking === b.key}
                        data-testid={`button-unblock-manual-${b.key}`}
                      >
                        <Unlock className="w-3 h-3 mr-1" />
                        Unblock
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {subTab === "watermarks" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" /> Recent Watermark Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="p-2">{t("pages.adminContentSecurity.user")}</th>
                    <th className="p-2">{t("pages.adminContentSecurity.maskedEmail")}</th>
                    <th className="p-2">{t("pages.adminContentSecurity.idSuffix")}</th>
                    <th className="p-2">IP</th>
                    <th className="p-2">{t("pages.adminContentSecurity.tier")}</th>
                    <th className="p-2">{t("pages.adminContentSecurity.time")}</th>
                  </tr>
                </thead>
                <tbody>
                  {data.watermarkSessions.recent.map((ws) => (
                    <tr key={ws.id} className="border-b hover:bg-gray-50" data-testid={`row-watermark-${ws.id}`}>
                      <td className="p-2 font-medium">{ws.username || ws.user_id.slice(0, 8)}</td>
                      <td className="p-2 text-gray-500 font-mono text-xs">{ws.masked_email}</td>
                      <td className="p-2 font-mono text-xs">{ws.user_id_suffix}</td>
                      <td className="p-2 font-mono text-xs">{ws.ip_address}</td>
                      <td className="p-2">
                        <Badge variant="outline" className="text-xs">{ws.tier || "free"}</Badge>
                      </td>
                      <td className="p-2 text-gray-500 text-xs">{formatDate(ws.created_at)}</td>
                    </tr>
                  ))}
                  {data.watermarkSessions.recent.length === 0 && (
                    <tr><td colSpan={6} className="p-4 text-center text-gray-400">{t("pages.adminContentSecurity.noWatermarkSessionsYet")}</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {subTab === "scraping" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" /> Scraping Detection Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-3xl font-bold text-orange-600">{data.scrapingAttempts.total}</p>
                <p className="text-sm text-gray-500">{t("pages.adminContentSecurity.totalIncidents")}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-3xl font-bold text-orange-600">{data.scrapingAttempts.last_24h}</p>
                <p className="text-sm text-gray-500">{t("pages.adminContentSecurity.last24Hours")}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-3xl font-bold text-orange-600">{data.scrapingAttempts.last_7d}</p>
                <p className="text-sm text-gray-500">{t("pages.adminContentSecurity.last7Days")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {subTab === "blocked" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ban className="w-5 h-5" /> Blocked IP Addresses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="p-2">{t("pages.adminContentSecurity.ipAddress")}</th>
                    <th className="p-2">{t("pages.adminContentSecurity.incidentCount")}</th>
                    <th className="p-2">{t("pages.adminContentSecurity.lastSeen")}</th>
                  </tr>
                </thead>
                <tbody>
                  {data.blockedIps.map((ip) => (
                    <tr key={ip.ip_address} className="border-b hover:bg-gray-50" data-testid={`row-blocked-ip-${ip.ip_address}`}>
                      <td className="p-2 font-mono">{ip.ip_address}</td>
                      <td className="p-2">
                        <Badge variant={ip.incident_count > 5 ? "destructive" : "outline"}>
                          {ip.incident_count}
                        </Badge>
                      </td>
                      <td className="p-2 text-gray-500">{formatDate(ip.last_seen)}</td>
                    </tr>
                  ))}
                  {data.blockedIps.length === 0 && (
                    <tr><td colSpan={3} className="p-4 text-center text-gray-400">{t("pages.adminContentSecurity.noBlockedIps")}</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {subTab === "sessions" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" /> Suspicious Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="p-2">{t("pages.adminContentSecurity.userId")}</th>
                    <th className="p-2">IP</th>
                    <th className="p-2">{t("pages.adminContentSecurity.endpoint")}</th>
                    <th className="p-2">{t("pages.adminContentSecurity.type")}</th>
                    <th className="p-2">{t("pages.adminContentSecurity.count")}</th>
                    <th className="p-2">{t("pages.adminContentSecurity.time2")}</th>
                    <th className="p-2">{t("pages.adminContentSecurity.actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {data.suspiciousSessions.map((s, i) => {
                    const evtInfo = eventTypeLabels[s.event_type] || { label: s.event_type, color: "bg-gray-100 text-gray-700" };
                    return (
                      <tr key={i} className="border-b hover:bg-gray-50" data-testid={`row-suspicious-${i}`}>
                        <td className="p-2 font-mono text-xs">{s.user_id?.slice(0, 8) || "N/A"}</td>
                        <td className="p-2 font-mono text-xs">{s.ip_address}</td>
                        <td className="p-2 text-xs max-w-[200px] truncate">{s.endpoint}</td>
                        <td className="p-2">
                          <Badge className={evtInfo.color}>{evtInfo.label}</Badge>
                        </td>
                        <td className="p-2">{s.request_count}</td>
                        <td className="p-2 text-gray-500 text-xs">{formatDate(s.created_at)}</td>
                        <td className="p-2">
                          {s.user_id && (
                            <div className="flex gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs"
                                onClick={() => handleFlagUser(s.user_id, "flag")}
                                disabled={flaggingUser === s.user_id}
                                data-testid={`button-flag-${s.user_id}`}
                              >
                                <Flag className="w-3 h-3 mr-1" />
                                Flag
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                className="h-7 text-xs"
                                onClick={() => handleFlagUser(s.user_id, "suspend")}
                                disabled={flaggingUser === s.user_id}
                                data-testid={`button-suspend-${s.user_id}`}
                              >
                                <UserX className="w-3 h-3 mr-1" />
                                Suspend
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {data.suspiciousSessions.length === 0 && (
                    <tr><td colSpan={7} className="p-4 text-center text-gray-400">{t("pages.adminContentSecurity.noSuspiciousSessionsDetected")}</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {subTab === "abuse" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserX className="w-5 h-5" /> Trial / Free Tier Abuse
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="p-2">{t("pages.adminContentSecurity.username")}</th>
                    <th className="p-2">{t("pages.adminContentSecurity.email")}</th>
                    <th className="p-2">{t("pages.adminContentSecurity.tier2")}</th>
                    <th className="p-2">IP</th>
                    <th className="p-2">{t("pages.adminContentSecurity.details")}</th>
                    <th className="p-2">{t("pages.adminContentSecurity.time3")}</th>
                    <th className="p-2">{t("pages.adminContentSecurity.actions2")}</th>
                  </tr>
                </thead>
                <tbody>
                  {data.trialAbuse.map((ta, i) => (
                    <tr key={i} className="border-b hover:bg-gray-50" data-testid={`row-trial-abuse-${i}`}>
                      <td className="p-2 font-medium">{ta.username || "N/A"}</td>
                      <td className="p-2 text-xs text-gray-500">{ta.email || "N/A"}</td>
                      <td className="p-2">
                        <Badge variant="outline">{ta.tier || "free"}</Badge>
                      </td>
                      <td className="p-2 font-mono text-xs">{ta.ip_address}</td>
                      <td className="p-2 text-xs">
                        {ta.metadata?.contentType && (
                          <span>Hit {ta.metadata.contentType} limit ({ta.metadata.limit})</span>
                        )}
                      </td>
                      <td className="p-2 text-gray-500 text-xs">{formatDate(ta.created_at)}</td>
                      <td className="p-2">
                        {ta.user_id && (
                          <Button
                            variant="destructive"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => handleFlagUser(ta.user_id, "suspend")}
                            disabled={flaggingUser === ta.user_id}
                            data-testid={`button-suspend-abuse-${ta.user_id}`}
                          >
                            <UserX className="w-3 h-3 mr-1" />
                            Suspend
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {data.trialAbuse.length === 0 && (
                    <tr><td colSpan={7} className="p-4 text-center text-gray-400">{t("pages.adminContentSecurity.noTrialAbuseDetected")}</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
