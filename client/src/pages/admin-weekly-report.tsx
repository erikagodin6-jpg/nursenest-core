import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Download, Copy, RefreshCw, AlertTriangle, Activity, Shield, Clock, TrendingUp, CheckCircle, XCircle, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface WeeklyReport {
  reportId: string;
  generatedAt: string;
  weekStart: string;
  weekEnd: string;
  incidents: {
    total: number;
    critical: number;
    warning: number;
    info: number;
    topReasonCodes: { code: string; count: number }[];
  };
  fallbackActivations: number;
  rollbackEvents: number;
  quarantinedContent: number;
  circuitBreakerTrips: number;
  featureFlagChanges: number;
  killSwitchActivations: number;
  emergencyModeActivations: number;
  topFailingRoutes: { route: string; count: number }[];
  affectedUsersCount: number;
  healthSummary: { service: string; uptimePercent: number; avgLatencyMs: number }[];
  openRisks: string[];
  recommendedPriorities: string[];
}

function StatCard({ label, value, icon: Icon, color = "text-gray-900" }: { label: string; value: string | number; icon: any; color?: string }) {
  return (
    <div className="bg-white rounded-lg border p-3 flex items-center gap-3">
      <div className={`p-2 rounded-lg bg-gray-50 ${color}`}><Icon className="w-4 h-4" /></div>
      <div>
        <div className={`text-lg font-bold ${color}`} data-testid={`stat-${label.toLowerCase().replace(/\s+/g, "-")}`}>{value}</div>
        <div className="text-xs text-gray-500">{label}</div>
      </div>
    </div>
  );
}

function UptimeBar({ percent }: { percent: number }) {
  const color = percent >= 99 ? "bg-green-500" : percent >= 95 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.min(percent, 100)}%` }} />
      </div>
      <span className="text-xs font-medium">{percent}%</span>
    </div>
  );
}

export default function AdminWeeklyReport() {
  const [, navigate] = useLocation();
  const [report, setReport] = useState<WeeklyReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const loadLatest = () => {
    setLoading(true);
    fetch("/api/admin/resilience-report/latest", { credentials: "include" })
      .then(r => r.json())
      .then(data => setReport(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadLatest(); }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/admin/resilience-report/generate", { method: "POST", credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setReport(data);
      }
    } catch {}
    setGenerating(false);
  };

  const handleCopy = () => {
    if (!report) return;
    const text = formatReportAsText(report);
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleExport = () => {
    if (!report) return;
    const text = formatReportAsText(report);
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `resilience-report-${report.weekStart?.split("T")[0] || "latest"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto" data-testid="loading-report">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-20 bg-gray-200 rounded" />)}
          </div>
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-4" data-testid="page-weekly-report">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/admin/ops")} data-testid="button-back">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <h1 className="text-xl font-bold" data-testid="text-report-title">Weekly Resilience Report</h1>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button onClick={handleGenerate} disabled={generating} size="sm" variant="outline" data-testid="button-generate">
            <RefreshCw className={`w-3 h-3 mr-1 ${generating ? "animate-spin" : ""}`} /> {generating ? "Generating..." : "Generate New"}
          </Button>
          <Button onClick={handleCopy} size="sm" variant="outline" data-testid="button-copy">
            <Copy className="w-3 h-3 mr-1" /> {copied ? "Copied!" : "Copy"}
          </Button>
          <Button onClick={handleExport} size="sm" variant="outline" data-testid="button-export">
            <Download className="w-3 h-3 mr-1" /> Export
          </Button>
        </div>
      </div>

      {report && (
        <div className="text-xs text-gray-500" data-testid="text-report-period">
          Report period: {new Date(report.weekStart).toLocaleDateString()} - {new Date(report.weekEnd).toLocaleDateString()}
          {" | "}Generated: {new Date(report.generatedAt).toLocaleString()}
        </div>
      )}

      {!report ? (
        <Card>
          <CardContent className="p-6 text-center text-gray-500" data-testid="text-no-report">
            No reports available. Click "Generate New" to create one.
          </CardContent>
        </Card>
      ) : (
        <div ref={reportRef} className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard label="Total Incidents" value={report.incidents.total} icon={AlertTriangle} color={report.incidents.total > 0 ? "text-red-600" : "text-green-600"} />
            <StatCard label="Critical" value={report.incidents.critical} icon={XCircle} color={report.incidents.critical > 0 ? "text-red-600" : "text-green-600"} />
            <StatCard label="Affected Users" value={report.affectedUsersCount} icon={Activity} />
            <StatCard label="Fallback Activations" value={report.fallbackActivations} icon={Shield} />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard label="Circuit Breaker Trips" value={report.circuitBreakerTrips} icon={TrendingUp} color={report.circuitBreakerTrips > 0 ? "text-amber-600" : "text-green-600"} />
            <StatCard label="Feature Flag Changes" value={report.featureFlagChanges} icon={BarChart3} />
            <StatCard label="Kill Switch Activations" value={report.killSwitchActivations} icon={Shield} color={report.killSwitchActivations > 0 ? "text-red-600" : "text-green-600"} />
            <StatCard label="Emergency Mode" value={report.emergencyModeActivations} icon={AlertTriangle} color={report.emergencyModeActivations > 0 ? "text-red-600" : "text-green-600"} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Top Incident Reasons</CardTitle>
              </CardHeader>
              <CardContent>
                {report.incidents.topReasonCodes.length === 0 ? (
                  <p className="text-xs text-gray-500 italic" data-testid="text-no-reasons">No incidents this period</p>
                ) : (
                  <div className="space-y-2">
                    {report.incidents.topReasonCodes.map((r, i) => (
                      <div key={r.code} className="flex items-center justify-between text-sm" data-testid={`row-reason-${i}`}>
                        <span className="font-mono text-xs truncate max-w-[200px]">{r.code}</span>
                        <Badge variant="outline" className="text-xs">{r.count}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Top Failing Routes</CardTitle>
              </CardHeader>
              <CardContent>
                {report.topFailingRoutes.length === 0 ? (
                  <p className="text-xs text-gray-500 italic" data-testid="text-no-routes">No failing routes this period</p>
                ) : (
                  <div className="space-y-2">
                    {report.topFailingRoutes.map((r, i) => (
                      <div key={r.route} className="flex items-center justify-between text-sm" data-testid={`row-route-${i}`}>
                        <span className="font-mono text-xs truncate max-w-[200px]">{r.route}</span>
                        <Badge variant="outline" className="text-xs">{r.count}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Service Health Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {report.healthSummary.length === 0 ? (
                <p className="text-xs text-gray-500 italic" data-testid="text-no-health">No health data available</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {report.healthSummary.map(h => (
                    <div key={h.service} className="flex items-center justify-between p-2 rounded border" data-testid={`row-health-${h.service}`}>
                      <div className="flex items-center gap-2">
                        {h.uptimePercent >= 99 ? <CheckCircle className="w-3 h-3 text-green-500" /> : h.uptimePercent >= 95 ? <Clock className="w-3 h-3 text-amber-500" /> : <XCircle className="w-3 h-3 text-red-500" />}
                        <span className="text-sm font-medium">{h.service}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <UptimeBar percent={h.uptimePercent} />
                        <span className="text-xs text-gray-400">{h.avgLatencyMs}ms</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className={report.openRisks.length > 0 ? "border-red-200" : ""}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" /> Open Risks ({report.openRisks.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {report.openRisks.length === 0 ? (
                  <p className="text-xs text-green-600" data-testid="text-no-risks">No open risks identified</p>
                ) : (
                  <ul className="space-y-2">
                    {report.openRisks.map((risk, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm" data-testid={`text-risk-${i}`}>
                        <span className="text-red-400 mt-0.5">•</span>
                        {risk}
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            <Card className={report.recommendedPriorities.length > 0 ? "border-blue-200" : ""}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-500" /> Recommended Priorities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {report.recommendedPriorities.map((p, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm" data-testid={`text-priority-${i}`}>
                      <span className="text-blue-400 mt-0.5">{i + 1}.</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Additional Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                <div><span className="text-gray-500">Quarantined Content:</span> <span className="font-medium" data-testid="stat-quarantined">{report.quarantinedContent}</span></div>
                <div><span className="text-gray-500">Warning Incidents:</span> <span className="font-medium" data-testid="stat-warnings">{report.incidents.warning}</span></div>
                <div><span className="text-gray-500">Info Incidents:</span> <span className="font-medium" data-testid="stat-info">{report.incidents.info}</span></div>
                <div><span className="text-gray-500">Rollback Events:</span> <span className="font-medium" data-testid="stat-rollbacks">{report.rollbackEvents}</span></div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function formatReportAsText(report: WeeklyReport): string {
  const lines: string[] = [];
  lines.push("=== WEEKLY RESILIENCE REPORT ===");
  lines.push(`Period: ${new Date(report.weekStart).toLocaleDateString()} - ${new Date(report.weekEnd).toLocaleDateString()}`);
  lines.push(`Generated: ${new Date(report.generatedAt).toLocaleString()}`);
  lines.push("");
  lines.push("--- INCIDENTS ---");
  lines.push(`Total: ${report.incidents.total} | Critical: ${report.incidents.critical} | Warning: ${report.incidents.warning} | Info: ${report.incidents.info}`);
  lines.push(`Affected Users: ${report.affectedUsersCount}`);
  lines.push("");
  lines.push("--- SYSTEM EVENTS ---");
  lines.push(`Fallback Activations: ${report.fallbackActivations}`);
  lines.push(`Circuit Breaker Trips: ${report.circuitBreakerTrips}`);
  lines.push(`Feature Flag Changes: ${report.featureFlagChanges}`);
  lines.push(`Kill Switch Activations: ${report.killSwitchActivations}`);
  lines.push(`Emergency Mode Activations: ${report.emergencyModeActivations}`);
  lines.push(`Quarantined Content: ${report.quarantinedContent}`);
  lines.push("");

  if (report.incidents.topReasonCodes.length > 0) {
    lines.push("--- TOP INCIDENT REASONS ---");
    for (const r of report.incidents.topReasonCodes) {
      lines.push(`  ${r.code}: ${r.count}`);
    }
    lines.push("");
  }

  if (report.topFailingRoutes.length > 0) {
    lines.push("--- TOP FAILING ROUTES ---");
    for (const r of report.topFailingRoutes) {
      lines.push(`  ${r.route}: ${r.count}`);
    }
    lines.push("");
  }

  if (report.healthSummary.length > 0) {
    lines.push("--- SERVICE HEALTH ---");
    for (const h of report.healthSummary) {
      lines.push(`  ${h.service}: ${h.uptimePercent}% uptime, ${h.avgLatencyMs}ms avg latency`);
    }
    lines.push("");
  }

  if (report.openRisks.length > 0) {
    lines.push("--- OPEN RISKS ---");
    for (const r of report.openRisks) {
      lines.push(`  - ${r}`);
    }
    lines.push("");
  }

  lines.push("--- RECOMMENDED PRIORITIES ---");
  for (const p of report.recommendedPriorities) {
    lines.push(`  - ${p}`);
  }

  return lines.join("\n");
}
