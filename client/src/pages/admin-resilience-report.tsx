import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, AlertTriangle, Shield, Activity, ChevronLeft, ChevronRight, TrendingDown, Users, Wrench } from "lucide-react";

function RiskBadge({ level }: { level: string }) {
  const colors: Record<string, string> = {
    low: "bg-green-100 text-green-800",
    moderate: "bg-yellow-100 text-yellow-800",
    high: "bg-orange-100 text-orange-800",
    critical: "bg-red-100 text-red-800",
  };
  return <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors[level] || colors.low}`} data-testid="badge-risk-level">{level.toUpperCase()}</span>;
}

function SectionCard({ title, icon: Icon, count, summary, items, expanded, onToggle }: {
  title: string; icon: any; count: number; summary: string; items: any[]; expanded: boolean; onToggle: () => void;
}) {
  return (
    <Card>
      <CardHeader className="cursor-pointer" onClick={onToggle}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-base">{title}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={count === 0 ? "secondary" : "default"}>{count}</Badge>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{summary}</p>
      </CardHeader>
      {expanded && items.length > 0 && (
        <CardContent>
          <div className="max-h-64 overflow-y-auto space-y-2">
            {items.slice(0, 30).map((item: any, i: number) => (
              <div key={i} className="p-2 rounded border text-sm">
                {item.risk ? (
                  <span className="text-red-700">{item.risk}</span>
                ) : item.reason_code ? (
                  <div>
                    <span className="font-medium">{item.reason_code}</span>
                    {item.reason_detail && <span className="text-muted-foreground ml-2">{String(item.reason_detail).substring(0, 100)}</span>}
                    {item.created_at && <span className="text-xs text-muted-foreground ml-2">{new Date(item.created_at).toLocaleString()}</span>}
                  </div>
                ) : item.type && item.title ? (
                  <div className="flex justify-between">
                    <span>{item.type}: {item.title}</span>
                    {item.score != null && <Badge variant={item.score < 30 ? "destructive" : "secondary"}>{item.score}</Badge>}
                  </div>
                ) : item.action ? (
                  <div className="flex justify-between">
                    <span className="font-medium">{item.action}</span>
                    <span className="text-muted-foreground">{item.actor_username || item.actor_id || ""}</span>
                  </div>
                ) : item.decision_reason ? (
                  <div className="flex justify-between">
                    <span>{item.decision_reason}</span>
                    <Badge variant="outline">{item.cnt}</Badge>
                  </div>
                ) : item.email ? (
                  <div className="flex justify-between">
                    <span>{item.email}</span>
                    <span className="text-muted-foreground">tier: {item.tier}, status: {item.subscriptionStatus || "none"}</span>
                  </div>
                ) : item.endpoint ? (
                  <div className="flex justify-between">
                    <span>{item.endpoint}</span>
                    <Badge variant="destructive">{item.cnt} failures</Badge>
                  </div>
                ) : (
                  <pre className="text-xs overflow-hidden">{JSON.stringify(item, null, 2).substring(0, 200)}</pre>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}

export default function AdminResilienceReport() {
  const [weeksAgo, setWeeksAgo] = useState(0);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["openRisks"]));

  const { data: report, isLoading } = useQuery({
    queryKey: ["/api/admin/resilience-report", weeksAgo],
    queryFn: async () => {
      const res = await fetch(`/api/admin/resilience-report?weeksAgo=${weeksAgo}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load");
      return res.json();
    },
  });

  const toggleSection = (key: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const sectionConfig = [
    { key: "openRisks", icon: AlertTriangle, field: "openRisks" },
    { key: "incidents", icon: Activity, field: "incidents" },
    { key: "fallbackActivations", icon: Shield, field: "fallbackActivations" },
    { key: "rollbackEvents", icon: TrendingDown, field: "rollbackEvents" },
    { key: "quarantinedContent", icon: AlertTriangle, field: "quarantinedContent" },
    { key: "lowHealthContent", icon: TrendingDown, field: "lowHealthContent" },
    { key: "entitlementAnomalies", icon: Users, field: "entitlementAnomalies" },
    { key: "paymentSyncIssues", icon: AlertTriangle, field: "paymentSyncIssues" },
    { key: "topFailingRoutes", icon: Activity, field: "topFailingRoutes" },
    { key: "rescueActions", icon: Wrench, field: "rescueActions" },
  ];

  return (
    <div className="container mx-auto p-6 max-w-5xl" data-testid="page-resilience-report">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="h-8 w-8 text-purple-600" />
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-page-title">Weekly Resilience Report</h1>
          <p className="text-muted-foreground">Incidents, fallbacks, rollbacks, and operational risks</p>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={() => setWeeksAgo(w => w + 1)} data-testid="button-prev-week">
          <ChevronLeft className="h-4 w-4" /> Previous Week
        </Button>
        <span className="text-sm font-medium" data-testid="text-week-label">
          {weeksAgo === 0 ? "Current Week" : `${weeksAgo} week${weeksAgo > 1 ? "s" : ""} ago`}
        </span>
        <Button variant="outline" size="sm" disabled={weeksAgo === 0} onClick={() => setWeeksAgo(w => Math.max(0, w - 1))} data-testid="button-next-week">
          Next Week <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {isLoading && <p className="text-muted-foreground">Generating report...</p>}

      {report && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-4 text-center">
                <RiskBadge level={report.overallRiskLevel} />
                <div className="text-sm text-muted-foreground mt-2">Risk Level</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 text-center">
                <div className="text-3xl font-bold" data-testid="text-incident-count">{report.sections?.incidents?.count || 0}</div>
                <div className="text-sm text-muted-foreground">Incidents</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 text-center">
                <div className="text-3xl font-bold" data-testid="text-affected-users">{report.affectedUsersCount || 0}</div>
                <div className="text-sm text-muted-foreground">Affected Users</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 text-center">
                <div className="text-3xl font-bold" data-testid="text-risk-count">{report.sections?.openRisks?.count || 0}</div>
                <div className="text-sm text-muted-foreground">Open Risks</div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6">
            <CardHeader><CardTitle className="text-base">Week: {new Date(report.weekStart).toLocaleDateString()} – {new Date(report.weekEnd).toLocaleDateString()}</CardTitle></CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground mb-2">Recommended Priorities:</div>
              <ul className="list-disc ml-5 space-y-1">
                {(report.recommendedPriorities || []).map((r: string, i: number) => (
                  <li key={i} className="text-sm" data-testid={`text-priority-${i}`}>{r}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {sectionConfig.map(({ key, icon, field }) => {
              const section = report.sections?.[field];
              if (!section) return null;
              return (
                <SectionCard
                  key={key}
                  title={section.title}
                  icon={icon}
                  count={section.count}
                  summary={section.summary}
                  items={section.items || []}
                  expanded={expandedSections.has(key)}
                  onToggle={() => toggleSection(key)}
                />
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
