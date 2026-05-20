import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminFetch } from "@/lib/admin-fetch";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import {
  Activity, AlertTriangle, BarChart3, RefreshCw, TrendingDown,
  Eye, Zap, Target, Clock, ArrowDown
} from "lucide-react";

type TabId = "overview" | "analysis" | "weak-areas";

export default function AdminTelemetry() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [days, setDays] = useState(7);
  const isAdmin = user?.tier === "admin";

  const { data: overview, isLoading: overviewLoading, refetch: refetchOverview } = useQuery({
    queryKey: ["/api/admin/telemetry/overview", days],
    queryFn: () => adminFetch(`/api/admin/telemetry/overview?days=${days}`).then(r => r.json()),
    enabled: isAdmin && activeTab === "overview",
  });

  const { data: analysis, isLoading: analysisLoading, refetch: refetchAnalysis } = useQuery({
    queryKey: ["/api/admin/telemetry/analysis", days],
    queryFn: () => adminFetch(`/api/admin/telemetry/analysis?days=${days}`).then(r => r.json()),
    enabled: isAdmin && (activeTab === "analysis" || activeTab === "weak-areas"),
  });

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto p-8 text-center">
          <h1 className="text-2xl font-bold" data-testid="text-access-denied">Access Denied</h1>
        </div>
      </div>
    );
  }

  const tabs = [
    { key: "overview" as TabId, label: "Overview", icon: Activity },
    { key: "analysis" as TabId, label: "Analysis Engine", icon: BarChart3 },
    { key: "weak-areas" as TabId, label: "Weak Areas", icon: Target },
  ];

  const handleRefresh = () => {
    refetchOverview();
    refetchAnalysis();
  };

  const isLoading = overviewLoading || analysisLoading;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900" data-testid="text-page-title">Behavioral Telemetry</h1>
            <p className="text-gray-600 mt-1">User behavior signals, retry patterns, and failure analysis</p>
          </div>
          <div className="flex items-center gap-2">
            <select
              data-testid="select-days"
              className="border rounded px-3 py-1.5 text-sm"
              value={days}
              onChange={e => setDays(Number(e.target.value))}
            >
              <option value={1}>1 day</option>
              <option value={7}>7 days</option>
              <option value={14}>14 days</option>
              <option value={30}>30 days</option>
              <option value={90}>90 days</option>
            </select>
            <Button data-testid="btn-refresh" onClick={handleRefresh} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-1" /> Refresh
            </Button>
          </div>
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

        {isLoading && <div className="flex justify-center py-12"><RefreshCw className="w-8 h-8 animate-spin text-blue-500" /></div>}

        {!isLoading && activeTab === "overview" && overview && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 text-gray-600 text-sm"><Activity className="w-4 h-4" /> Total Events</div>
                  <div className="text-2xl font-bold mt-1" data-testid="stat-total-events">{overview.summary?.totalEvents || 0}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 text-gray-600 text-sm"><Eye className="w-4 h-4" /> Unique Sessions</div>
                  <div className="text-2xl font-bold mt-1" data-testid="stat-unique-sessions">{overview.summary?.uniqueSessions || 0}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 text-gray-600 text-sm"><AlertTriangle className="w-4 h-4" /> Retry Events</div>
                  <div className="text-2xl font-bold mt-1" data-testid="stat-retry-events">{overview.retryFrequency?.length || 0}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 text-gray-600 text-sm"><TrendingDown className="w-4 h-4" /> Drop-off Points</div>
                  <div className="text-2xl font-bold mt-1" data-testid="stat-dropoff-points">{overview.dropOffPoints?.length || 0}</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Zap className="w-5 h-5" /> Retry Frequency</CardTitle></CardHeader>
              <CardContent>
                {(!overview.retryFrequency || overview.retryFrequency.length === 0) ? (
                  <div className="text-center py-6 text-gray-500">No retry events recorded yet</div>
                ) : (
                  <div className="space-y-2">
                    {overview.retryFrequency.map((r: any, i: number) => (
                      <div key={i} className="flex justify-between items-center p-3 border rounded-lg" data-testid={`retry-${i}`}>
                        <span className="font-medium">{r.feature || "Unknown"}</span>
                        <div className="flex gap-4 text-sm text-gray-600">
                          <span>{r.retry_count} retries</span>
                          <span>{r.unique_sessions} sessions</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><ArrowDown className="w-5 h-5" /> Fallback Usage</CardTitle></CardHeader>
                <CardContent>
                  {(!overview.fallbackUsage || overview.fallbackUsage.length === 0) ? (
                    <div className="text-center py-6 text-gray-500">No fallback events</div>
                  ) : (
                    <div className="space-y-2">
                      {overview.fallbackUsage.map((f: any, i: number) => (
                        <div key={i} className="flex justify-between items-center p-2 border rounded" data-testid={`fallback-${i}`}>
                          <span className="text-sm font-medium">{f.fallback_type || "Unknown"}</span>
                          <div className="flex gap-3 text-xs text-gray-600">
                            <span>{f.usage_count} uses</span>
                            <span>{f.affected_users} users</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><TrendingDown className="w-5 h-5" /> Drop-off Points</CardTitle></CardHeader>
                <CardContent>
                  {(!overview.dropOffPoints || overview.dropOffPoints.length === 0) ? (
                    <div className="text-center py-6 text-gray-500">No drop-off data</div>
                  ) : (
                    <div className="space-y-2">
                      {overview.dropOffPoints.map((d: any, i: number) => (
                        <div key={i} className="flex justify-between items-center p-2 border rounded" data-testid={`dropoff-${i}`}>
                          <span className="text-sm font-medium truncate max-w-[200px]">{d.page || "Unknown"}</span>
                          <Badge variant="destructive">{d.drop_count} drops</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><AlertTriangle className="w-5 h-5" /> Repeated Failures by User</CardTitle></CardHeader>
              <CardContent>
                {(!overview.repeatedFailures || overview.repeatedFailures.length === 0) ? (
                  <div className="text-center py-6 text-gray-500">No repeated failure patterns detected</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-3">User ID</th>
                          <th className="text-left py-2 px-3">Error Type</th>
                          <th className="text-center py-2 px-3">Count</th>
                        </tr>
                      </thead>
                      <tbody>
                        {overview.repeatedFailures.map((f: any, i: number) => (
                          <tr key={i} className="border-b hover:bg-gray-50" data-testid={`repeated-failure-${i}`}>
                            <td className="py-2 px-3 font-mono text-xs">{f.user_id?.slice(0, 12)}...</td>
                            <td className="py-2 px-3">{f.error_type || "Unknown"}</td>
                            <td className="text-center py-2 px-3"><Badge variant="destructive">{f.failure_count}</Badge></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Clock className="w-5 h-5" /> Session Abandonment</CardTitle></CardHeader>
              <CardContent>
                {(!overview.sessionAbandonment || overview.sessionAbandonment.length === 0) ? (
                  <div className="text-center py-6 text-gray-500">No abandonment data</div>
                ) : (
                  <div className="space-y-2">
                    {overview.sessionAbandonment.map((s: any, i: number) => (
                      <div key={i} className="flex justify-between items-center p-2 border rounded" data-testid={`abandon-${i}`}>
                        <span className="text-sm font-medium truncate max-w-[250px]">{s.page || "Unknown"}</span>
                        <div className="flex gap-3 text-xs">
                          <Badge variant="outline">{s.abandonment_count} abandoned</Badge>
                          {s.avg_duration_before_abandon && <span className="text-gray-500">{Math.round(s.avg_duration_before_abandon)}s avg</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Zap className="w-5 h-5" /> Silent Failures</CardTitle></CardHeader>
              <CardContent>
                {(!overview.silentFailures || overview.silentFailures.length === 0) ? (
                  <div className="text-center py-6 text-gray-500">No silent failures detected</div>
                ) : (
                  <div className="space-y-2">
                    {overview.silentFailures.map((sf: any, i: number) => (
                      <div key={i} className="flex justify-between items-center p-3 border rounded-lg" data-testid={`silent-failure-${i}`}>
                        <div>
                          <span className="font-medium">{sf.service || "Unknown service"}</span>
                          {sf.error_code && <span className="ml-2 text-xs text-gray-500">({sf.error_code})</span>}
                        </div>
                        <Badge variant="destructive">{sf.count} occurrences</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {!isLoading && activeTab === "analysis" && analysis && (
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Target className="w-5 h-5" /> Prioritized Fixes</CardTitle></CardHeader>
              <CardContent>
                {(!analysis.prioritizedFixes || analysis.prioritizedFixes.length === 0) ? (
                  <div className="text-center py-6 text-gray-500">No issues to prioritize</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-3">Feature</th>
                          <th className="text-left py-2 px-3">Error Type</th>
                          <th className="text-center py-2 px-3">Occurrences</th>
                          <th className="text-center py-2 px-3">Affected Users</th>
                          <th className="text-center py-2 px-3">Sessions</th>
                          <th className="text-center py-2 px-3">Priority</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analysis.prioritizedFixes.map((fix: any, i: number) => (
                          <tr key={i} className="border-b hover:bg-gray-50" data-testid={`fix-${i}`}>
                            <td className="py-2 px-3 font-medium">{fix.feature || "—"}</td>
                            <td className="py-2 px-3">{fix.error_type || "—"}</td>
                            <td className="text-center py-2 px-3">{fix.occurrence_count}</td>
                            <td className="text-center py-2 px-3">{fix.affected_users}</td>
                            <td className="text-center py-2 px-3">{fix.affected_sessions}</td>
                            <td className="text-center py-2 px-3">
                              <Badge className={
                                fix.priority === "critical" ? "bg-red-100 text-red-800" :
                                fix.priority === "high" ? "bg-orange-100 text-orange-800" :
                                fix.priority === "medium" ? "bg-yellow-100 text-yellow-800" :
                                "bg-gray-100 text-gray-800"
                              }>{fix.priority}</Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><AlertTriangle className="w-5 h-5" /> Silent Failure Detection</CardTitle></CardHeader>
              <CardContent>
                {(!analysis.silentFailureDetection || analysis.silentFailureDetection.length === 0) ? (
                  <div className="text-center py-6 text-gray-500">No silent failures detected</div>
                ) : (
                  <div className="space-y-3">
                    {analysis.silentFailureDetection.map((sf: any, i: number) => (
                      <div key={i} className="p-4 border rounded-lg" data-testid={`silent-detection-${i}`}>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">{sf.service || "Unknown"}</span>
                          <Badge className={
                            sf.severity === "critical" ? "bg-red-100 text-red-800" :
                            sf.severity === "high" ? "bg-orange-100 text-orange-800" :
                            "bg-yellow-100 text-yellow-800"
                          }>{sf.severity}</Badge>
                        </div>
                        <div className="flex gap-4 mt-2 text-sm text-gray-600">
                          <span>{sf.silent_failure_count} failures</span>
                          <span>{sf.affected_users} users affected</span>
                          {sf.last_occurrence && <span>Last: {new Date(sf.last_occurrence).toLocaleString()}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {!isLoading && activeTab === "weak-areas" && analysis && (
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="w-5 h-5" /> Weak Areas Analysis</CardTitle></CardHeader>
            <CardContent>
              {(!analysis.weakAreas || analysis.weakAreas.length === 0) ? (
                <div className="text-center py-6 text-gray-500">No weak areas identified</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-3">Area</th>
                        <th className="text-center py-2 px-3">Errors</th>
                        <th className="text-center py-2 px-3">Retries</th>
                        <th className="text-center py-2 px-3">Fallbacks</th>
                        <th className="text-center py-2 px-3">Drop-offs</th>
                        <th className="text-center py-2 px-3">Error Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analysis.weakAreas.map((area: any, i: number) => (
                        <tr key={i} className="border-b hover:bg-gray-50" data-testid={`weak-area-${i}`}>
                          <td className="py-2 px-3 font-medium truncate max-w-[200px]">{area.area}</td>
                          <td className="text-center py-2 px-3"><Badge variant="destructive">{area.error_count}</Badge></td>
                          <td className="text-center py-2 px-3">{area.retry_count}</td>
                          <td className="text-center py-2 px-3">{area.fallback_count}</td>
                          <td className="text-center py-2 px-3">{area.drop_off_count}</td>
                          <td className="text-center py-2 px-3">
                            <Badge className={
                              Number(area.error_rate) > 20 ? "bg-red-100 text-red-800" :
                              Number(area.error_rate) > 10 ? "bg-orange-100 text-orange-800" :
                              "bg-yellow-100 text-yellow-800"
                            }>{area.error_rate}%</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
