import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, CheckCircle2, XCircle, AlertTriangle, RotateCcw, Clock } from "lucide-react";

interface ReleaseCheck {
  name: string;
  category: string;
  status: "pass" | "fail" | "warn" | "skip";
  message: string;
  details?: any;
  required: boolean;
}

interface GateResult {
  overallStatus: string;
  checks: ReleaseCheck[];
  passCount: number;
  failCount: number;
  warnCount: number;
  skipCount: number;
  timestamp: string;
  canDeploy: boolean;
  canPublish: boolean;
}

function StatusIcon({ status }: { status: string }) {
  if (status === "pass") return <CheckCircle2 className="h-5 w-5 text-green-500" />;
  if (status === "fail") return <XCircle className="h-5 w-5 text-red-500" />;
  if (status === "warn") return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
  return <Clock className="h-5 w-5 text-gray-400" />;
}

function StatusBadge({ status }: { status: string }) {
  const variant = status === "pass" ? "default" : status === "fail" ? "destructive" : "secondary";
  return <Badge variant={variant} data-testid={`badge-status-${status}`}>{status.toUpperCase()}</Badge>;
}

export default function AdminReleaseGate() {
  const queryClient = useQueryClient();
  const [checkType, setCheckType] = useState<"all" | "deploy" | "content">("all");
  const [justification, setJustification] = useState("");
  const [showOverride, setShowOverride] = useState(false);

  const { data: gateResult, isLoading, refetch } = useQuery<GateResult>({
    queryKey: ["/api/admin/release-gate/check", checkType],
    queryFn: async () => {
      const res = await fetch(`/api/admin/release-gate/check?type=${checkType}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load");
      return res.json();
    },
  });

  const { data: overrides } = useQuery({
    queryKey: ["/api/admin/release-gate/overrides"],
    queryFn: async () => {
      const res = await fetch("/api/admin/release-gate/overrides", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load");
      return res.json();
    },
  });

  const overrideMutation = useMutation({
    mutationFn: async () => {
      const failedChecks = gateResult?.checks.filter(c => c.status === "fail").map(c => c.name) || [];
      const res = await fetch("/api/admin/release-gate/override", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ justification, checksOverridden: failedChecks }),
      });
      if (!res.ok) throw new Error("Override failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/release-gate/overrides"] });
      setShowOverride(false);
      setJustification("");
    },
  });

  return (
    <div className="container mx-auto p-6 max-w-5xl" data-testid="page-release-gate">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-page-title">Release Gate</h1>
          <p className="text-muted-foreground">Pre-deploy and pre-publish safety checks</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {(["all", "deploy", "content"] as const).map(t => (
          <Button key={t} variant={checkType === t ? "default" : "outline"} onClick={() => setCheckType(t)} data-testid={`button-type-${t}`}>
            {t === "all" ? "All Checks" : t === "deploy" ? "Deploy Checks" : "Content Checks"}
          </Button>
        ))}
        <Button variant="outline" onClick={() => refetch()} data-testid="button-rerun">
          <RotateCcw className="h-4 w-4 mr-1" /> Re-run
        </Button>
      </div>

      {isLoading && <p className="text-muted-foreground">Running checks...</p>}

      {gateResult && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-4 text-center">
                <div className="text-3xl font-bold text-green-600" data-testid="text-pass-count">{gateResult.passCount}</div>
                <div className="text-sm text-muted-foreground">Passed</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 text-center">
                <div className="text-3xl font-bold text-red-600" data-testid="text-fail-count">{gateResult.failCount}</div>
                <div className="text-sm text-muted-foreground">Failed</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 text-center">
                <div className="text-3xl font-bold text-yellow-600" data-testid="text-warn-count">{gateResult.warnCount}</div>
                <div className="text-sm text-muted-foreground">Warnings</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 text-center">
                <div className={`text-3xl font-bold ${gateResult.canDeploy && gateResult.canPublish ? "text-green-600" : "text-red-600"}`} data-testid="text-overall-status">
                  {gateResult.overallStatus.toUpperCase()}
                </div>
                <div className="text-sm text-muted-foreground">Overall</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <Alert variant={gateResult.canDeploy ? "default" : "destructive"}>
              <AlertDescription className="flex items-center gap-2" data-testid="text-deploy-status">
                {gateResult.canDeploy ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5" />}
                {gateResult.canDeploy ? "Deploy is SAFE" : "Deploy is BLOCKED"}
              </AlertDescription>
            </Alert>
            <Alert variant={gateResult.canPublish ? "default" : "destructive"}>
              <AlertDescription className="flex items-center gap-2" data-testid="text-publish-status">
                {gateResult.canPublish ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5" />}
                {gateResult.canPublish ? "Publish is SAFE" : "Publish is BLOCKED"}
              </AlertDescription>
            </Alert>
          </div>

          <Card className="mb-6">
            <CardHeader><CardTitle>Check Results</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {gateResult.checks.map((check, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border" data-testid={`row-check-${i}`}>
                    <div className="flex items-center gap-3">
                      <StatusIcon status={check.status} />
                      <div>
                        <div className="font-medium">{check.name}</div>
                        <div className="text-sm text-muted-foreground">{check.message}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {check.required && <Badge variant="outline">Required</Badge>}
                      <StatusBadge status={check.status} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {gateResult.failCount > 0 && (
            <Card className="mb-6">
              <CardHeader><CardTitle>Override</CardTitle></CardHeader>
              <CardContent>
                {!showOverride ? (
                  <Button variant="destructive" onClick={() => setShowOverride(true)} data-testid="button-show-override">
                    Override Failed Checks
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Justification for override (min 10 characters)..."
                      value={justification}
                      onChange={e => setJustification(e.target.value)}
                      data-testid="input-justification"
                    />
                    <div className="flex gap-2">
                      <Button variant="destructive" disabled={justification.trim().length < 10 || overrideMutation.isPending} onClick={() => overrideMutation.mutate()} data-testid="button-submit-override">
                        Confirm Override
                      </Button>
                      <Button variant="outline" onClick={() => setShowOverride(false)} data-testid="button-cancel-override">Cancel</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}

      {overrides?.overrides?.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Recent Overrides</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {overrides.overrides.slice(0, 10).map((o: any, i: number) => (
                <div key={i} className="p-3 rounded-lg border text-sm" data-testid={`row-override-${i}`}>
                  <div className="flex justify-between">
                    <span className="font-medium">{o.actor_username || o.adminUsername || "admin"}</span>
                    <span className="text-muted-foreground">{new Date(o.created_at || o.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="text-muted-foreground mt-1">
                    {(() => { try { return typeof o.after_json === "string" ? JSON.parse(o.after_json)?.justification : o.justification; } catch { return o.justification; } })() || "No justification"}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
