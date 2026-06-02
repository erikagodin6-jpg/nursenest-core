import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield, Activity, ToggleLeft, ToggleRight, Zap, AlertTriangle,
  RefreshCw, Clock, CheckCircle2, XCircle, ArrowLeft, Power,
  Layers, Timer, Navigation, Gauge, Target
} from "lucide-react";

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem("nn_admin_access_token") || localStorage.getItem("nursenest-user-token");
  return token ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } : { "Content-Type": "application/json" };
}

async function fetchResilienceStatus() {
  const res = await fetch("/api/admin/resilience/status", { headers: getAuthHeaders() });
  if (!res.ok) throw new Error("Failed to fetch resilience status");
  return res.json();
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    healthy: "bg-green-100 text-green-800",
    closed: "bg-green-100 text-green-800",
    degraded: "bg-amber-100 text-amber-800",
    "half-open": "bg-amber-100 text-amber-800",
    down: "bg-red-100 text-red-800",
    open: "bg-red-100 text-red-800",
    normal: "bg-green-100 text-green-800",
    elevated: "bg-amber-100 text-amber-800",
    high: "bg-orange-100 text-orange-800",
    critical: "bg-red-100 text-red-800",
  };
  return <Badge className={colors[status] || "bg-slate-100 text-slate-800"} data-testid={`badge-status-${status}`}>{status}</Badge>;
}

function CircuitBreakersPanel({ breakers, onReset }: { breakers: any[]; onReset: (name: string) => void }) {
  if (!breakers?.length) return <p className="text-slate-500 text-sm">No circuit breakers configured.</p>;
  return (
    <div className="space-y-3">
      {breakers.map((cb: any) => (
        <Card key={cb.name} className="border-slate-200">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-slate-700" data-testid={`text-breaker-name-${cb.name}`}>{cb.name}</span>
                <StatusBadge status={cb.state} />
              </div>
              <div className="flex gap-4 text-xs text-slate-500">
                <span>Failures: {cb.failureCount}/{cb.failureThreshold}</span>
                <span>Trips: {cb.tripCount}</span>
                <span>Cooldown: {cb.cooldownMs / 1000}s</span>
              </div>
            </div>
            {cb.state !== "closed" && (
              <Button size="sm" variant="outline" onClick={() => onReset(cb.name)} data-testid={`button-reset-breaker-${cb.name}`}>
                <RefreshCw className="w-3 h-3 mr-1" /> Reset
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function FeatureFlagsPanel({ flags, onToggle, onResetErrors }: {
  flags: any[];
  onToggle: (key: string, enabled: boolean) => void;
  onResetErrors: (key: string) => void;
}) {
  if (!flags?.length) return <p className="text-slate-500 text-sm">No feature flags configured.</p>;
  return (
    <div className="space-y-3">
      {flags.map((flag: any) => {
        const isOn = flag.adminOverride !== null ? flag.adminOverride : flag.enabled;
        return (
          <Card key={flag.key} className="border-slate-200">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-700" data-testid={`text-flag-key-${flag.key}`}>{flag.key}</span>
                  <Badge className={isOn ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                    {isOn ? "ON" : "OFF"}
                  </Badge>
                  {flag.adminOverride !== null && <Badge className="bg-blue-100 text-blue-800">overridden</Badge>}
                </div>
                <p className="text-xs text-slate-500">{flag.description}</p>
                <div className="flex gap-4 text-xs text-slate-400">
                  <span>Errors: {flag.errorCount}/{flag.errorThreshold}</span>
                  {flag.disabledReason && <span className="text-red-500">Reason: {flag.disabledReason}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {flag.errorCount > 0 && (
                  <Button size="sm" variant="ghost" onClick={() => onResetErrors(flag.key)} data-testid={`button-reset-errors-${flag.key}`}>
                    <RefreshCw className="w-3 h-3" />
                  </Button>
                )}
                <Button
                  size="sm"
                  variant={isOn ? "default" : "outline"}
                  onClick={() => onToggle(flag.key, !isOn)}
                  data-testid={`button-toggle-flag-${flag.key}`}
                >
                  {isOn ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function KillSwitchesPanel({ switches, onToggle }: { switches: any[]; onToggle: (key: string, active: boolean, scope: string, target: string, reason?: string) => void }) {
  const [newKey, setNewKey] = useState("");
  const [newScope, setNewScope] = useState("feature");
  const [newTarget, setNewTarget] = useState("");
  const [newReason, setNewReason] = useState("");

  return (
    <div className="space-y-4">
      {switches?.length > 0 && (
        <div className="space-y-3">
          {switches.map((ks: any) => (
            <Card key={ks.key} className="border-slate-200">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-700" data-testid={`text-killswitch-${ks.key}`}>{ks.key}</span>
                    <Badge className={ks.active ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}>
                      {ks.active ? "ACTIVE" : "INACTIVE"}
                    </Badge>
                    <Badge variant="outline">{ks.scope}: {ks.target}</Badge>
                  </div>
                  {ks.reason && <p className="text-xs text-slate-500">Reason: {ks.reason}</p>}
                  {ks.activatedBy && <p className="text-xs text-slate-400">By: {ks.activatedBy}</p>}
                </div>
                <Button
                  size="sm"
                  variant={ks.active ? "outline" : "destructive"}
                  onClick={() => onToggle(ks.key, !ks.active, ks.scope, ks.target)}
                  data-testid={`button-toggle-killswitch-${ks.key}`}
                >
                  <Power className="w-3 h-3 mr-1" />
                  {ks.active ? "Deactivate" : "Activate"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="border-dashed border-slate-300">
        <CardContent className="p-4 space-y-3">
          <p className="text-sm font-medium text-slate-600">Add Kill Switch</p>
          <div className="grid grid-cols-2 gap-2">
            <Input placeholder="Key" value={newKey} onChange={(e) => setNewKey(e.target.value)} data-testid="input-killswitch-key" />
            <select
              className="border rounded px-2 py-1 text-sm"
              value={newScope}
              onChange={(e) => setNewScope(e.target.value)}
              data-testid="select-killswitch-scope"
            >
              <option value="feature">Feature</option>
              <option value="route">Route</option>
              <option value="exam">Exam</option>
              <option value="language">Language</option>
              <option value="component">Component</option>
              <option value="global">Global</option>
            </select>
          </div>
          <Input placeholder="Target" value={newTarget} onChange={(e) => setNewTarget(e.target.value)} data-testid="input-killswitch-target" />
          <Input placeholder="Reason" value={newReason} onChange={(e) => setNewReason(e.target.value)} data-testid="input-killswitch-reason" />
          <Button
            size="sm"
            variant="destructive"
            disabled={!newKey || !newTarget}
            onClick={() => {
              onToggle(newKey, true, newScope, newTarget, newReason);
              setNewKey(""); setNewTarget(""); setNewReason("");
            }}
            data-testid="button-add-killswitch"
          >
            Activate Kill Switch
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function HealthChecksPanel({ checks }: { checks: any[] }) {
  if (!checks?.length) return <p className="text-slate-500 text-sm">No health data available.</p>;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {checks.map((check: any) => (
        <Card key={check.service} className="border-slate-200">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {check.status === "healthy" ? (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              ) : check.status === "degraded" ? (
                <AlertTriangle className="w-5 h-5 text-amber-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
              <div>
                <span className="font-medium text-slate-700" data-testid={`text-health-service-${check.service}`}>{check.service}</span>
                {check.details && <p className="text-xs text-slate-500">{check.details}</p>}
              </div>
            </div>
            <div className="text-right">
              <StatusBadge status={check.status} />
              <p className="text-xs text-slate-400 mt-1">{check.latencyMs}ms</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function EventsTimeline({ events }: { events: any[] }) {
  if (!events?.length) return <p className="text-slate-500 text-sm">No resilience events recorded.</p>;
  return (
    <div className="space-y-2 max-h-96 overflow-y-auto">
      {events.slice(0, 50).map((event: any) => (
        <div key={event.id} className="flex items-start gap-3 p-2 bg-slate-50 rounded text-sm" data-testid={`event-${event.id}`}>
          <div className="flex-shrink-0 mt-0.5">
            <Clock className="w-3 h-3 text-slate-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-700">{event.type}</span>
              <span className="text-slate-500">{event.source}</span>
            </div>
            <p className="text-xs text-slate-400">
              {new Date(event.timestamp).toLocaleString()}
              {event.data && Object.keys(event.data).length > 0 && (
                <span className="ml-2">{JSON.stringify(event.data)}</span>
              )}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ScopeIsolationPanel({ domains, onKillSwitch, onLiftQuarantine }: {
  domains: any[];
  onKillSwitch: (type: string, value: string, active: boolean, reason?: string) => void;
  onLiftQuarantine: (type: string, value: string) => void;
}) {
  const [newType, setNewType] = useState("profession");
  const [newValue, setNewValue] = useState("");
  const [newReason, setNewReason] = useState("");

  return (
    <div className="space-y-4">
      {domains?.length > 0 ? (
        <div className="space-y-3">
          {domains.map((d: any) => (
            <Card key={`${d.type}:${d.value}`} className="border-slate-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{d.type}</Badge>
                      <span className="font-medium text-slate-700" data-testid={`text-scope-${d.type}-${d.value}`}>{d.value}</span>
                      {d.quarantined && <Badge className="bg-red-100 text-red-800">QUARANTINED</Badge>}
                      {d.killSwitchActive && <Badge className="bg-red-100 text-red-800">KILL SWITCH</Badge>}
                    </div>
                    <div className="flex gap-4 text-xs text-slate-500">
                      <span>Errors: {d.errorCount}/{d.threshold}</span>
                      {d.quarantineReason && <span className="text-red-500">{d.quarantineReason}</span>}
                      {d.killSwitchReason && <span className="text-orange-500">KS: {d.killSwitchReason}</span>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {d.quarantined && (
                      <Button size="sm" variant="outline" onClick={() => onLiftQuarantine(d.type, d.value)} data-testid={`button-lift-quarantine-${d.type}-${d.value}`}>
                        Lift Quarantine
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant={d.killSwitchActive ? "outline" : "destructive"}
                      onClick={() => onKillSwitch(d.type, d.value, !d.killSwitchActive)}
                      data-testid={`button-scope-ks-${d.type}-${d.value}`}
                    >
                      {d.killSwitchActive ? "Disable KS" : "Enable KS"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-slate-500 text-sm">No scoped failure domains active.</p>
      )}

      <Card className="border-dashed border-slate-300">
        <CardContent className="p-4 space-y-3">
          <p className="text-sm font-medium text-slate-600">Add Scoped Kill Switch</p>
          <div className="grid grid-cols-2 gap-2">
            <select className="border rounded px-2 py-1 text-sm" value={newType} onChange={(e) => setNewType(e.target.value)} data-testid="select-scope-type">
              <option value="profession">Profession</option>
              <option value="exam_type">Exam Type</option>
              <option value="language">Language</option>
              <option value="region">Region</option>
            </select>
            <Input placeholder="Value (e.g. nursing, NCLEX)" value={newValue} onChange={(e) => setNewValue(e.target.value)} data-testid="input-scope-value" />
          </div>
          <Input placeholder="Reason" value={newReason} onChange={(e) => setNewReason(e.target.value)} data-testid="input-scope-reason" />
          <Button size="sm" variant="destructive" disabled={!newValue} onClick={() => {
            onKillSwitch(newType, newValue, true, newReason);
            setNewValue(""); setNewReason("");
          }} data-testid="button-add-scope-ks">
            Activate Scoped Kill Switch
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

const LEVEL_COLORS: Record<number, string> = {
  0: "bg-green-500", 1: "bg-lime-500", 2: "bg-yellow-500", 3: "bg-orange-500", 4: "bg-red-500", 5: "bg-red-700",
};

function DegradationPanel({ degradation, onOverride }: { degradation: any; onOverride: (level: number | null) => void }) {
  if (!degradation) return <p className="text-slate-500 text-sm">No degradation data.</p>;

  const levels = [
    { level: 0, name: "Normal", desc: "Full functionality" },
    { level: 1, name: "Disable Animations", desc: "Animations and transitions disabled" },
    { level: 2, name: "Simplify UI", desc: "Complex UI components replaced with simpler versions" },
    { level: 3, name: "Safe Renderer", desc: "Using safe/minimal rendering pipeline" },
    { level: 4, name: "Static Backup", desc: "Serving pre-built static content" },
    { level: 5, name: "Substitute Content", desc: "Fallback substitute content only" },
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-medium text-slate-700">Current Level: <span className="text-lg font-bold">{degradation.level}</span> — {degradation.levelName}</p>
              {degradation.manualOverride !== null && <Badge className="bg-blue-100 text-blue-800">Manual Override</Badge>}
              {degradation.activeSince && <p className="text-xs text-slate-500">Active since: {new Date(degradation.activeSince).toLocaleString()}</p>}
            </div>
            {degradation.manualOverride !== null && (
              <Button size="sm" variant="outline" onClick={() => onOverride(null)} data-testid="button-clear-degradation-override">
                Clear Override
              </Button>
            )}
          </div>

          <div className="flex gap-1 mb-4">
            {[0, 1, 2, 3, 4, 5].map(l => (
              <div key={l} className={`h-3 flex-1 rounded ${l <= degradation.level ? LEVEL_COLORS[l] : "bg-slate-200"}`} />
            ))}
          </div>

          <div className="space-y-2">
            {levels.map(l => (
              <div key={l.level} className={`flex items-center justify-between p-2 rounded text-sm ${l.level === degradation.level ? "bg-slate-100 border border-slate-300" : ""}`}>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${l.level <= degradation.level ? LEVEL_COLORS[l.level] : "bg-slate-200"}`} />
                  <span className="font-medium">{l.name}</span>
                  <span className="text-xs text-slate-500">{l.desc}</span>
                </div>
                <Button size="sm" variant="ghost" onClick={() => onOverride(l.level)} data-testid={`button-set-degradation-${l.level}`}>
                  Set
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {degradation.escalationHistory?.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-sm">Escalation History</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {degradation.escalationHistory.slice(0, 20).map((h: any, i: number) => (
                <div key={i} className="flex items-center justify-between text-xs p-1 bg-slate-50 rounded">
                  <span>Level {h.from} → {h.to} ({h.reason})</span>
                  <span className="text-slate-400">{new Date(h.timestamp).toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function TimeoutsPanel({ timeouts, onUpdate }: { timeouts: any[]; onUpdate: (op: string, updates: any) => void }) {
  if (!timeouts?.length) return <p className="text-slate-500 text-sm">No timeout configurations.</p>;
  return (
    <div className="space-y-3">
      {timeouts.map((tc: any) => (
        <Card key={tc.operation} className="border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Timer className="w-4 h-4 text-slate-500" />
                  <span className="font-medium text-slate-700" data-testid={`text-timeout-${tc.operation}`}>{tc.operation}</span>
                  <Badge className={tc.fallbackEnabled ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-600"}>
                    {tc.fallbackEnabled ? "Fallback ON" : "Fallback OFF"}
                  </Badge>
                </div>
                <div className="flex gap-4 text-xs text-slate-500">
                  <span>Timeout: {tc.timeoutMs}ms</span>
                  <span>Calls: {tc.totalCalls}</span>
                  <span>Timeouts: {tc.timeouts}</span>
                  {tc.lastTimeout && <span>Last: {new Date(tc.lastTimeout).toLocaleTimeString()}</span>}
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => onUpdate(tc.operation, { fallbackEnabled: !tc.fallbackEnabled })} data-testid={`button-toggle-fallback-${tc.operation}`}>
                  {tc.fallbackEnabled ? "Disable Fallback" : "Enable Fallback"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function StuckStatesPanel({ sessions, thresholds }: { sessions: any[]; thresholds: any }) {
  const typeColors: Record<string, string> = {
    infinite_loading: "bg-red-100 text-red-800",
    repeated_retries: "bg-orange-100 text-orange-800",
    stalled_session: "bg-amber-100 text-amber-800",
    navigation_loop: "bg-yellow-100 text-yellow-800",
  };

  return (
    <div className="space-y-4">
      {thresholds && (
        <Card>
          <CardHeader><CardTitle className="text-sm">Detection Thresholds</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div>
                <p className="text-slate-500">Infinite Loading</p>
                <p className="font-medium">{thresholds.infiniteLoadingMs / 1000}s</p>
              </div>
              <div>
                <p className="text-slate-500">Retry Count</p>
                <p className="font-medium">{thresholds.repeatedRetryCount} in {thresholds.repeatedRetryWindowMs / 1000}s</p>
              </div>
              <div>
                <p className="text-slate-500">Stalled Session</p>
                <p className="font-medium">{thresholds.stalledSessionMs / 1000}s</p>
              </div>
              <div>
                <p className="text-slate-500">Navigation Loop</p>
                <p className="font-medium">{thresholds.navigationLoopCount} in {thresholds.navigationLoopWindowMs / 1000}s</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {sessions?.length > 0 ? (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {sessions.map((s: any, i: number) => (
            <Card key={i} className="border-slate-200">
              <CardContent className="p-3 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge className={typeColors[s.stuckType] || "bg-slate-100 text-slate-800"}>{s.stuckType}</Badge>
                    <span className="text-sm text-slate-600">User: {s.userId}</span>
                  </div>
                  <div className="text-xs text-slate-500">
                    <span>Recovery: {s.recoveryAction}</span>
                    <span className="ml-3">{new Date(s.detectedAt).toLocaleString()}</span>
                  </div>
                </div>
                <Badge className={s.recovered ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-600"}>
                  {s.recovered ? "Recovered" : "Pending"}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-slate-500 text-sm">No stuck state sessions detected.</p>
      )}
    </div>
  );
}

function PerformancePanel({ performance }: { performance: any }) {
  if (!performance) return <p className="text-slate-500 text-sm">No performance data.</p>;

  const { routeLatency, scaleProtection, scaleThresholds } = performance;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle className="text-sm">Scale Protection</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div>
              <p className="text-sm text-slate-500">Load Level</p>
              <StatusBadge status={scaleProtection?.loadLevel || "normal"} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Throttled Requests</p>
              <p className="font-medium" data-testid="text-throttled-requests">{scaleProtection?.throttledRequests || 0}</p>
            </div>
            {scaleProtection?.activeThrottles?.length > 0 && (
              <div>
                <p className="text-sm text-slate-500">Active Throttles</p>
                <div className="flex gap-1 flex-wrap">
                  {scaleProtection.activeThrottles.map((t: string) => (
                    <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
          {scaleThresholds && (
            <div className="mt-3 flex gap-4 text-xs text-slate-500">
              <span>Elevated: {scaleThresholds.elevated} RPM</span>
              <span>High: {scaleThresholds.high} RPM</span>
              <span>Critical: {scaleThresholds.critical} RPM</span>
            </div>
          )}
        </CardContent>
      </Card>

      {routeLatency?.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-sm">Route Latency (Top Routes by P95)</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              <div className="grid grid-cols-6 gap-2 text-xs font-medium text-slate-500 px-2">
                <span className="col-span-2">Route</span>
                <span>Calls</span>
                <span>P50</span>
                <span>P95</span>
                <span>P99</span>
              </div>
              {routeLatency.map((r: any) => (
                <div key={r.route} className="grid grid-cols-6 gap-2 text-xs p-2 bg-slate-50 rounded" data-testid={`row-latency-${r.route}`}>
                  <span className="col-span-2 font-medium text-slate-700 truncate">{r.route}</span>
                  <span>{r.totalCalls}</span>
                  <span>{r.p50}ms</span>
                  <span className={r.p95 > 2000 ? "text-red-600 font-medium" : ""}>{r.p95}ms</span>
                  <span className={r.p99 > 5000 ? "text-red-600 font-medium" : ""}>{r.p99}ms</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function AdminResilienceDashboard() {
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-resilience"],
    queryFn: fetchResilienceStatus,
    refetchInterval: 10000,
    retry: 1,
  });

  const toggleFlagMutation = useMutation({
    mutationFn: async ({ key, enabled }: { key: string; enabled: boolean }) => {
      const res = await fetch(`/api/admin/resilience/feature-flags/${key}`, {
        method: "POST", headers: getAuthHeaders(), body: JSON.stringify({ enabled }),
      });
      if (!res.ok) throw new Error("Failed to toggle feature flag");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-resilience"] }),
  });

  const resetErrorsMutation = useMutation({
    mutationFn: async (key: string) => {
      const res = await fetch(`/api/admin/resilience/feature-flags/${key}/reset-errors`, {
        method: "POST", headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to reset errors");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-resilience"] }),
  });

  const resetBreakerMutation = useMutation({
    mutationFn: async (name: string) => {
      const res = await fetch(`/api/admin/resilience/circuit-breaker/${name}/reset`, {
        method: "POST", headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to reset circuit breaker");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-resilience"] }),
  });

  const killSwitchMutation = useMutation({
    mutationFn: async ({ key, active, scope, target, reason }: { key: string; active: boolean; scope: string; target: string; reason?: string }) => {
      const res = await fetch("/api/admin/resilience/kill-switch", {
        method: "POST", headers: getAuthHeaders(),
        body: JSON.stringify({ key, active, scope, target, reason: reason || "admin_action" }),
      });
      if (!res.ok) throw new Error("Failed to update kill switch");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-resilience"] }),
  });

  const emergencyModeMutation = useMutation({
    mutationFn: async ({ active, reason }: { active: boolean; reason?: string }) => {
      const res = await fetch("/api/admin/resilience/emergency-mode", {
        method: "POST", headers: getAuthHeaders(), body: JSON.stringify({ active, reason }),
      });
      if (!res.ok) throw new Error("Failed to update emergency mode");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-resilience"] }),
  });

  const scopeKillSwitchMutation = useMutation({
    mutationFn: async ({ type, value, active, reason }: { type: string; value: string; active: boolean; reason?: string }) => {
      const res = await fetch("/api/admin/resilience/scope-isolation/kill-switch", {
        method: "POST", headers: getAuthHeaders(),
        body: JSON.stringify({ type, value, active, reason }),
      });
      if (!res.ok) throw new Error("Failed to update scoped kill switch");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-resilience"] }),
  });

  const liftQuarantineMutation = useMutation({
    mutationFn: async ({ type, value }: { type: string; value: string }) => {
      const res = await fetch("/api/admin/resilience/scope-isolation/lift-quarantine", {
        method: "POST", headers: getAuthHeaders(), body: JSON.stringify({ type, value }),
      });
      if (!res.ok) throw new Error("Failed to lift quarantine");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-resilience"] }),
  });

  const degradationOverrideMutation = useMutation({
    mutationFn: async (level: number | null) => {
      const res = await fetch("/api/admin/resilience/degradation/override", {
        method: "POST", headers: getAuthHeaders(), body: JSON.stringify({ level }),
      });
      if (!res.ok) throw new Error("Failed to update degradation");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-resilience"] }),
  });

  const timeoutUpdateMutation = useMutation({
    mutationFn: async ({ operation, updates }: { operation: string; updates: any }) => {
      const res = await fetch(`/api/admin/resilience/timeouts/${operation}`, {
        method: "POST", headers: getAuthHeaders(), body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to update timeout");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-resilience"] }),
  });

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="text-admin-required">
        <p className="text-slate-500">Admin access required.</p>
      </div>
    );
  }

  const healthyCount = data?.healthChecks?.filter((h: any) => h.status === "healthy").length ?? 0;
  const totalChecks = data?.healthChecks?.length ?? 0;
  const openBreakers = data?.circuitBreakers?.filter((cb: any) => cb.state !== "closed").length ?? 0;
  const disabledFlags = data?.featureFlags?.filter((f: any) => !(f.adminOverride !== null ? f.adminOverride : f.enabled)).length ?? 0;
  const activeKillSwitches = data?.killSwitches?.filter((ks: any) => ks.active).length ?? 0;
  const quarantinedScopes = data?.scopeIsolation?.filter((d: any) => d.quarantined || d.killSwitchActive).length ?? 0;
  const degradationLevel = data?.degradation?.level ?? 0;

  return (
    <div className="min-h-screen bg-slate-50 p-6" data-testid="admin-resilience-dashboard">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => window.history.back()} data-testid="button-back">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2" data-testid="text-page-title">
                <Shield className="w-6 h-6 text-purple-600" />
                Platform Resilience
              </h1>
              <p className="text-sm text-slate-500">System health, fault tolerance, degradation, and scale protection</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {data?.emergencyMode?.active && (
              <Badge className="bg-red-100 text-red-800 animate-pulse" data-testid="badge-emergency-active">EMERGENCY MODE</Badge>
            )}
            {degradationLevel > 0 && (
              <Badge className="bg-orange-100 text-orange-800" data-testid="badge-degradation-level">DEGRADATION L{degradationLevel}</Badge>
            )}
            <Button size="sm" variant="outline" onClick={() => refetch()} data-testid="button-refresh-resilience">
              <RefreshCw className="w-3 h-3 mr-1" /> Refresh
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-7 gap-3">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-600" data-testid="text-healthy-count">{healthyCount}/{totalChecks}</p>
              <p className="text-xs text-slate-500">Services Healthy</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className={`text-2xl font-bold ${openBreakers > 0 ? "text-red-600" : "text-green-600"}`} data-testid="text-open-breakers">{openBreakers}</p>
              <p className="text-xs text-slate-500">Open Breakers</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className={`text-2xl font-bold ${disabledFlags > 0 ? "text-amber-600" : "text-green-600"}`} data-testid="text-disabled-flags">{disabledFlags}</p>
              <p className="text-xs text-slate-500">Disabled Flags</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className={`text-2xl font-bold ${activeKillSwitches > 0 ? "text-red-600" : "text-green-600"}`} data-testid="text-active-switches">{activeKillSwitches}</p>
              <p className="text-xs text-slate-500">Kill Switches</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className={`text-2xl font-bold ${quarantinedScopes > 0 ? "text-red-600" : "text-green-600"}`} data-testid="text-quarantined-scopes">{quarantinedScopes}</p>
              <p className="text-xs text-slate-500">Quarantined</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className={`text-2xl font-bold ${degradationLevel > 0 ? "text-orange-600" : "text-green-600"}`} data-testid="text-degradation-level">{degradationLevel}</p>
              <p className="text-xs text-slate-500">Degradation</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-slate-600" data-testid="text-event-count">{data?.events?.length ?? 0}</p>
              <p className="text-xs text-slate-500">Events</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-700">Emergency Mode</p>
                <p className="text-xs text-slate-500">Grants all users basic access during outages</p>
              </div>
              <Button
                size="sm"
                variant={data?.emergencyMode?.active ? "outline" : "destructive"}
                onClick={() => emergencyModeMutation.mutate({
                  active: !data?.emergencyMode?.active,
                  reason: "admin_toggle",
                })}
                data-testid="button-toggle-emergency"
              >
                <Zap className="w-3 h-3 mr-1" />
                {data?.emergencyMode?.active ? "Deactivate" : "Activate"} Emergency Mode
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 md:grid-cols-10 w-full">
            <TabsTrigger value="overview" data-testid="tab-overview">
              <Activity className="w-3 h-3 mr-1" /> Health
            </TabsTrigger>
            <TabsTrigger value="breakers" data-testid="tab-breakers">
              <Zap className="w-3 h-3 mr-1" /> Breakers
            </TabsTrigger>
            <TabsTrigger value="flags" data-testid="tab-flags">
              <ToggleRight className="w-3 h-3 mr-1" /> Flags
            </TabsTrigger>
            <TabsTrigger value="killswitches" data-testid="tab-killswitches">
              <Power className="w-3 h-3 mr-1" /> Switches
            </TabsTrigger>
            <TabsTrigger value="scopes" data-testid="tab-scopes">
              <Target className="w-3 h-3 mr-1" /> Scopes
            </TabsTrigger>
            <TabsTrigger value="degradation" data-testid="tab-degradation">
              <Layers className="w-3 h-3 mr-1" /> Degrade
            </TabsTrigger>
            <TabsTrigger value="timeouts" data-testid="tab-timeouts">
              <Timer className="w-3 h-3 mr-1" /> Timeouts
            </TabsTrigger>
            <TabsTrigger value="stuckstates" data-testid="tab-stuckstates">
              <Navigation className="w-3 h-3 mr-1" /> Stuck
            </TabsTrigger>
            <TabsTrigger value="performance" data-testid="tab-performance">
              <Gauge className="w-3 h-3 mr-1" /> Perf
            </TabsTrigger>
            <TabsTrigger value="events" data-testid="tab-events">
              <Clock className="w-3 h-3 mr-1" /> Events
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4">
            <HealthChecksPanel checks={data?.healthChecks || []} />
          </TabsContent>

          <TabsContent value="breakers" className="mt-4">
            <CircuitBreakersPanel
              breakers={data?.circuitBreakers || []}
              onReset={(name) => resetBreakerMutation.mutate(name)}
            />
          </TabsContent>

          <TabsContent value="flags" className="mt-4">
            <FeatureFlagsPanel
              flags={data?.featureFlags || []}
              onToggle={(key, enabled) => toggleFlagMutation.mutate({ key, enabled })}
              onResetErrors={(key) => resetErrorsMutation.mutate(key)}
            />
          </TabsContent>

          <TabsContent value="killswitches" className="mt-4">
            <KillSwitchesPanel
              switches={data?.killSwitches || []}
              onToggle={(key, active, scope, target, reason) => killSwitchMutation.mutate({ key, active, scope, target, reason })}
            />
          </TabsContent>

          <TabsContent value="scopes" className="mt-4">
            <ScopeIsolationPanel
              domains={data?.scopeIsolation || []}
              onKillSwitch={(type, value, active, reason) => scopeKillSwitchMutation.mutate({ type, value, active, reason })}
              onLiftQuarantine={(type, value) => liftQuarantineMutation.mutate({ type, value })}
            />
          </TabsContent>

          <TabsContent value="degradation" className="mt-4">
            <DegradationPanel
              degradation={data?.degradation}
              onOverride={(level) => degradationOverrideMutation.mutate(level)}
            />
          </TabsContent>

          <TabsContent value="timeouts" className="mt-4">
            <TimeoutsPanel
              timeouts={data?.timeouts || []}
              onUpdate={(op, updates) => timeoutUpdateMutation.mutate({ operation: op, updates })}
            />
          </TabsContent>

          <TabsContent value="stuckstates" className="mt-4">
            <StuckStatesPanel
              sessions={data?.stuckStates || []}
              thresholds={data?.stuckStateThresholds}
            />
          </TabsContent>

          <TabsContent value="performance" className="mt-4">
            <PerformancePanel performance={data?.performance} />
          </TabsContent>

          <TabsContent value="events" className="mt-4">
            <EventsTimeline events={data?.events || []} />
          </TabsContent>
        </Tabs>

        {data?.provisionalAccess?.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Provisional Access Grants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {data.provisionalAccess.map((grant: any, i: number) => (
                  <div key={i} className="flex items-center justify-between text-sm p-2 bg-slate-50 rounded">
                    <span className="font-medium">{grant.userId}</span>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>{grant.reason}</span>
                      <span>Expires: {new Date(grant.expiresAt).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {data?.selfHealingLog?.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Self-Healing Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {data.selfHealingLog.map((entry: any, i: number) => (
                  <div key={i} className="flex items-center justify-between text-sm p-2 bg-slate-50 rounded">
                    <div>
                      <span className="font-medium">{entry.action}</span>
                      <span className="text-slate-500 ml-2">({entry.target})</span>
                    </div>
                    <Badge className={entry.result === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {entry.result}
                    </Badge>
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
