import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminFetch } from "@/lib/admin-fetch";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import {
  RefreshCw, Shield, AlertTriangle, CheckCircle, XCircle,
  Globe, Activity, BarChart3, Languages, ArrowLeft, Clock,
  ChevronDown, ChevronUp,
} from "lucide-react";

type TabId = "overview" | "events" | "coverage" | "missing-keys";

function StatCard({ title, value, icon: Icon, color, subtitle }: {
  title: string;
  value: number | string;
  icon: any;
  color: string;
  subtitle?: string;
}) {
  return (
    <Card data-testid={`stat-card-${title.toLowerCase().replace(/\s+/g, "-")}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
          </div>
          <Icon className={`w-8 h-8 ${color} opacity-50`} />
        </div>
      </CardContent>
    </Card>
  );
}

function EventTypeBadge({ type }: { type: string }) {
  const config: Record<string, { bg: string; label: string }> = {
    validation_failure: { bg: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400", label: "Validation Failure" },
    language_mismatch: { bg: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400", label: "Language Mismatch" },
    fallback_activation: { bg: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400", label: "Fallback Activated" },
    retry: { bg: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400", label: "Retry" },
    scanner_violation: { bg: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400", label: "Scanner Violation" },
    isolation_enforced: { bg: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400", label: "Isolation Enforced" },
  };
  const c = config[type] || { bg: "bg-gray-100 text-gray-800", label: type };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${c.bg}`} data-testid={`badge-event-type-${type}`}>
      {c.label}
    </span>
  );
}

function OverviewTab({ stats, isLoading }: { stats: any; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12" data-testid="loading-overview">
        <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!stats) return <p className="text-muted-foreground py-8 text-center">No data available</p>;

  const healthScore = stats.totalEvents === 0
    ? 100
    : Math.max(0, Math.round(100 - ((stats.validationFailures + stats.languageMismatches) / Math.max(stats.totalEvents, 1)) * 100));

  const healthColor = healthScore >= 90 ? "text-green-600" : healthScore >= 70 ? "text-yellow-600" : "text-red-600";

  const hourlyData = (stats.byHour || []).reduce((acc: Record<string, number>, item: any) => {
    acc[item.hour] = (acc[item.hour] || 0) + item.count;
    return acc;
  }, {});
  const sortedHours = Object.entries(hourlyData)
    .sort(([a], [b]) => b.localeCompare(a))
    .slice(0, 24);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Health Score" value={`${healthScore}%`} icon={Shield} color={healthColor} subtitle="Last 24 hours" />
        <StatCard title="Total Events" value={stats.totalEvents} icon={Activity} color="text-blue-600" />
        <StatCard title="Validation Failures" value={stats.validationFailures} icon={XCircle} color="text-red-600" />
        <StatCard title="Language Mismatches" value={stats.languageMismatches} icon={AlertTriangle} color="text-orange-600" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Fallback Activations" value={stats.fallbackActivations} icon={Globe} color="text-yellow-600" />
        <StatCard title="Retries" value={stats.retries} icon={RefreshCw} color="text-blue-600" />
        <StatCard title="Scanner Violations" value={stats.scannerViolations} icon={AlertTriangle} color="text-purple-600" />
        <StatCard title="Isolation Enforced" value={stats.isolationEnforced} icon={Shield} color="text-green-600" />
      </div>

      {sortedHours.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Events Over Time (Hourly)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {sortedHours.map(([hour, count]) => {
                const maxCount = Math.max(...sortedHours.map(([, c]) => c as number), 1);
                const width = Math.max(((count as number) / maxCount) * 100, 2);
                return (
                  <div key={hour} className="flex items-center gap-2 text-xs">
                    <span className="w-32 text-muted-foreground font-mono">{hour}</span>
                    <div className="flex-1 bg-muted rounded-full h-4 overflow-hidden">
                      <div
                        className="bg-blue-500 h-full rounded-full transition-all"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                    <span className="w-8 text-right font-mono">{count as number}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {(stats.topContentTypes || []).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Top Content Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {stats.topContentTypes.map((item: any) => (
                  <div key={item.contentType} className="flex items-center justify-between text-sm">
                    <span className="font-mono text-muted-foreground">{item.contentType}</span>
                    <span className="font-bold">{item.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {(stats.topLanguages || []).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Top Languages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {stats.topLanguages.map((item: any) => (
                  <div key={item.language} className="flex items-center justify-between text-sm">
                    <span className="font-mono text-muted-foreground">{item.language}</span>
                    <span className="font-bold">{item.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function EventsTab() {
  const { data, isLoading } = useQuery({
    queryKey: ["/api/admin/language-health/events"],
    queryFn: () => adminFetch("/api/admin/language-health/events?limit=100").then(r => r.json()),
  });

  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12" data-testid="loading-events">
        <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const events = data?.events || [];

  if (events.length === 0) {
    return <p className="text-muted-foreground py-8 text-center" data-testid="text-no-events">No language enforcement events recorded yet.</p>;
  }

  return (
    <div className="space-y-2">
      {events.map((event: any) => (
        <Card key={event.id} className="overflow-hidden">
          <div
            className="p-3 flex items-center gap-3 cursor-pointer hover:bg-muted/50"
            onClick={() => setExpandedId(expandedId === event.id ? null : event.id)}
            data-testid={`event-row-${event.id}`}
          >
            <EventTypeBadge type={event.event_type} />
            <span className="text-xs font-mono text-muted-foreground">{event.expected_language}</span>
            {event.detected_language && (
              <>
                <span className="text-xs text-muted-foreground">→</span>
                <span className="text-xs font-mono text-muted-foreground">{event.detected_language}</span>
              </>
            )}
            <span className="flex-1 text-xs text-muted-foreground truncate">{event.detail || ""}</span>
            <span className="text-xs text-muted-foreground">{new Date(event.created_at).toLocaleString()}</span>
            {expandedId === event.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
          {expandedId === event.id && (
            <div className="px-3 pb-3 pt-1 border-t bg-muted/20 text-xs space-y-1">
              {event.content_type && <div><strong>Content Type:</strong> {event.content_type}</div>}
              {event.content_id && <div><strong>Content ID:</strong> {event.content_id}</div>}
              {event.source && <div><strong>Source:</strong> {event.source}</div>}
              {event.detail && <div><strong>Detail:</strong> {event.detail}</div>}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}

function CoverageTab() {
  const { data, isLoading } = useQuery({
    queryKey: ["/api/admin/language-health/translation-coverage"],
    queryFn: () => adminFetch("/api/admin/language-health/translation-coverage").then(r => r.json()),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12" data-testid="loading-coverage">
        <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const coverage = data?.coverage || [];

  if (coverage.length === 0) {
    return <p className="text-muted-foreground py-8 text-center" data-testid="text-no-coverage">No translation coverage data available.</p>;
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-medium">Language</th>
                  <th className="text-right p-3 font-medium">Total</th>
                  <th className="text-right p-3 font-medium">Auto</th>
                  <th className="text-right p-3 font-medium">Reviewed</th>
                  <th className="text-right p-3 font-medium">Failed</th>
                  <th className="text-right p-3 font-medium">Quality</th>
                </tr>
              </thead>
              <tbody>
                {coverage.map((row: any) => {
                  const qualityPct = row.total_translations > 0
                    ? Math.round((row.reviewed_count / row.total_translations) * 100)
                    : 0;
                  const qualityColor = qualityPct >= 80 ? "text-green-600" : qualityPct >= 50 ? "text-yellow-600" : "text-red-600";
                  return (
                    <tr key={row.language_code} className="border-b" data-testid={`row-coverage-${row.language_code}`}>
                      <td className="p-3 font-mono">{row.language_code}</td>
                      <td className="p-3 text-right">{row.total_translations}</td>
                      <td className="p-3 text-right text-blue-600">{row.auto_count}</td>
                      <td className="p-3 text-right text-green-600">{row.reviewed_count}</td>
                      <td className="p-3 text-right text-red-600">{row.failed_count}</td>
                      <td className={`p-3 text-right font-bold ${qualityColor}`}>{qualityPct}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MissingKeysTab() {
  const { data, isLoading } = useQuery({
    queryKey: ["/api/admin/language-health/missing-keys-summary"],
    queryFn: () => adminFetch("/api/admin/language-health/missing-keys-summary").then(r => r.json()),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12" data-testid="loading-missing-keys">
        <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const summary = data?.summary || [];

  if (summary.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground" data-testid="text-no-missing-keys">
        <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
        No missing translation keys reported.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-medium">Language</th>
                  <th className="text-right p-3 font-medium">Missing Keys</th>
                  <th className="text-right p-3 font-medium">Last Seen</th>
                </tr>
              </thead>
              <tbody>
                {summary.map((row: any) => (
                  <tr key={row.language} className="border-b" data-testid={`row-missing-${row.language}`}>
                    <td className="p-3 font-mono">{row.language}</td>
                    <td className="p-3 text-right font-bold text-orange-600">{row.missing_count}</td>
                    <td className="p-3 text-right text-muted-foreground text-xs">
                      {row.last_seen ? new Date(row.last_seen).toLocaleString() : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminLanguageHealthPage() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [timeRange, setTimeRange] = useState(24);

  const { data: stats, isLoading, refetch } = useQuery({
    queryKey: ["/api/admin/language-health/stats", timeRange],
    queryFn: () => adminFetch(`/api/admin/language-health/stats?hours=${timeRange}`).then(r => r.json()),
    refetchInterval: 60000,
  });

  useEffect(() => {
    adminFetch("/api/admin/language-health/init", { method: "POST" }).catch(() => {});
  }, []);

  const tabs: { id: TabId; label: string; icon: any }[] = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "events", label: "Events Log", icon: Activity },
    { id: "coverage", label: "Translation Coverage", icon: Languages },
    { id: "missing-keys", label: "Missing Keys", icon: AlertTriangle },
  ];

  return (
    <div className="min-h-screen bg-background" data-testid="page-admin-language-health">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.history.back()}
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2" data-testid="heading-language-health">
              <Globe className="w-6 h-6 text-blue-600" />
              Language Health Monitor
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Runtime language safety, enforcement events, and translation health
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(parseInt(e.target.value))}
              className="text-sm border rounded px-2 py-1 bg-background"
              data-testid="select-time-range"
            >
              <option value={1}>Last 1 hour</option>
              <option value={6}>Last 6 hours</option>
              <option value={24}>Last 24 hours</option>
              <option value={72}>Last 3 days</option>
              <option value={168}>Last 7 days</option>
            </select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              data-testid="button-refresh"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Refresh
            </Button>
          </div>
        </div>

        <div className="flex gap-1 mb-6 border-b">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
              data-testid={`tab-${tab.id}`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "overview" && <OverviewTab stats={stats} isLoading={isLoading} />}
        {activeTab === "events" && <EventsTab />}
        {activeTab === "coverage" && <CoverageTab />}
        {activeTab === "missing-keys" && <MissingKeysTab />}
      </div>
    </div>
  );
}
