import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen, Search, AlertTriangle, CheckCircle2, ChevronRight,
  Play, Square, Clock, Shield, Zap, ArrowLeft, FileText,
  MessageSquare, XCircle, ChevronDown, ChevronUp, ExternalLink,
} from "lucide-react";

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem("nn_admin_access_token") || localStorage.getItem("nursenest-user-token");
  return token ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } : { "Content-Type": "application/json" };
}

const SEVERITY_COLORS: Record<string, string> = {
  critical: "bg-red-100 text-red-800",
  high: "bg-orange-100 text-orange-800",
  medium: "bg-yellow-100 text-yellow-800",
  low: "bg-blue-100 text-blue-800",
};

const CATEGORY_ICONS: Record<string, any> = {
  exams: Zap,
  cat: Shield,
  billing: FileText,
  performance: Clock,
  content: BookOpen,
};

function RunbookCard({ runbook, onSelect }: { runbook: any; onSelect: () => void }) {
  const Icon = CATEGORY_ICONS[runbook.category] || BookOpen;

  return (
    <Card
      className="cursor-pointer hover:border-blue-300 transition-colors"
      onClick={onSelect}
      data-testid={`card-runbook-${runbook.id}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-slate-100 rounded-lg">
            <Icon className="w-5 h-5 text-slate-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-slate-800" data-testid={`text-runbook-title-${runbook.id}`}>
                {runbook.title}
              </span>
              <Badge className={SEVERITY_COLORS[runbook.severity] || "bg-slate-100"}>
                {runbook.severity}
              </Badge>
              <Badge variant="outline">{runbook.category}</Badge>
            </div>
            <div className="mt-1 text-sm text-slate-500">
              {runbook.symptoms.slice(0, 2).join(" · ")}
            </div>
            <div className="mt-2 flex items-center gap-4 text-xs text-slate-400">
              <span>Est. {runbook.estimatedResolutionMinutes} min</span>
              <span>Used {runbook.usageCount} times</span>
              {runbook.lastUsed && (
                <span>Last: {new Date(runbook.lastUsed).toLocaleDateString()}</span>
              )}
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
        </div>
      </CardContent>
    </Card>
  );
}

function RunbookDetail({ runbook, onBack }: { runbook: any; onBack: () => void }) {
  const queryClient = useQueryClient();
  const [activeExecution, setActiveExecution] = useState<any>(null);
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());
  const [stepNotes, setStepNotes] = useState<Record<string, string>>({});

  const startExecution = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/admin/runbooks/${runbook.id}/start-execution`, {
        method: "POST",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to start execution");
      return res.json();
    },
    onSuccess: (data) => {
      setActiveExecution(data.execution);
    },
  });

  const executeStep = useMutation({
    mutationFn: async ({ stepId }: { stepId: string }) => {
      const res = await fetch(`/api/admin/runbooks/${runbook.id}/execute-step`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          executionId: activeExecution?.id,
          stepId,
          note: stepNotes[stepId] || undefined,
        }),
      });
      if (!res.ok) throw new Error("Failed to execute step");
      return res.json();
    },
    onSuccess: (data) => {
      setActiveExecution(data.execution);
      queryClient.invalidateQueries({ queryKey: ["runbooks"] });
    },
  });

  const abortExecution = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/admin/runbooks/${runbook.id}/abort-execution`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ executionId: activeExecution?.id }),
      });
      if (!res.ok) throw new Error("Failed to abort");
      return res.json();
    },
    onSuccess: (data) => {
      setActiveExecution(data.execution);
    },
  });

  const toggleStep = (stepId: string) => {
    const next = new Set(expandedSteps);
    if (next.has(stepId)) next.delete(stepId);
    else next.add(stepId);
    setExpandedSteps(next);
  };

  const isStepCompleted = (stepId: string) =>
    activeExecution?.completedSteps?.includes(stepId) ?? false;

  const isCurrentStep = (stepId: string) =>
    activeExecution?.currentStepId === stepId;

  const allSteps = [
    ...runbook.diagnosisSteps.map((s: any) => ({ ...s, phase: "diagnosis" })),
    ...runbook.actionSteps.map((s: any) => ({ ...s, phase: "action" })),
    ...runbook.verificationSteps.map((s: any) => ({ ...s, phase: "verification" })),
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack} data-testid="button-back-to-runbooks">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <h2 className="text-xl font-bold text-slate-800" data-testid="text-runbook-detail-title">
          {runbook.title}
        </h2>
        <Badge className={SEVERITY_COLORS[runbook.severity]}>{runbook.severity}</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Symptoms</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-1" data-testid="list-symptoms">
              {runbook.symptoms.map((s: string, i: number) => (
                <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                  <AlertTriangle className="w-3 h-3 mt-1 text-amber-500 flex-shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Likely Causes</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-1" data-testid="list-causes">
              {runbook.likelyCauses.map((c: string, i: number) => (
                <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                  <XCircle className="w-3 h-3 mt-1 text-red-400 flex-shrink-0" />
                  {c}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Quick Reference</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm">
              <span className="text-slate-500">Est. Resolution:</span>{" "}
              <span className="font-medium">{runbook.estimatedResolutionMinutes} min</span>
            </div>
            <div className="text-sm">
              <span className="text-slate-500">Kill Switches:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {runbook.killSwitchRefs.map((ks: string) => (
                  <Badge key={ks} variant="outline" className="text-xs">{ks}</Badge>
                ))}
              </div>
            </div>
            <div className="text-sm">
              <span className="text-slate-500">Feature Flags:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {runbook.featureFlagRefs.map((ff: string) => (
                  <Badge key={ff} variant="outline" className="text-xs">{ff}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Step-by-Step Execution</CardTitle>
            {!activeExecution || activeExecution.status !== "in_progress" ? (
              <Button
                size="sm"
                onClick={() => startExecution.mutate()}
                disabled={startExecution.isPending}
                data-testid="button-start-execution"
              >
                <Play className="w-4 h-4 mr-1" /> Start Execution
              </Button>
            ) : (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => abortExecution.mutate()}
                disabled={abortExecution.isPending}
                data-testid="button-abort-execution"
              >
                <Square className="w-4 h-4 mr-1" /> Abort
              </Button>
            )}
          </div>
          {activeExecution && (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Badge className={
                activeExecution.status === "completed" ? "bg-green-100 text-green-800" :
                activeExecution.status === "aborted" ? "bg-red-100 text-red-800" :
                "bg-blue-100 text-blue-800"
              }>
                {activeExecution.status}
              </Badge>
              <span>{activeExecution.completedSteps?.length || 0}/{allSteps.length} steps completed</span>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {["diagnosis", "action", "verification"].map((phase) => {
              const phaseSteps = allSteps.filter((s: any) => s.phase === phase);
              if (phaseSteps.length === 0) return null;

              return (
                <div key={phase}>
                  <h4 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-2 flex items-center gap-2">
                    {phase === "diagnosis" && <Search className="w-4 h-4" />}
                    {phase === "action" && <Zap className="w-4 h-4" />}
                    {phase === "verification" && <CheckCircle2 className="w-4 h-4" />}
                    {phase}
                  </h4>
                  <div className="space-y-2 ml-2">
                    {phaseSteps.map((step: any) => {
                      const completed = isStepCompleted(step.id);
                      const current = isCurrentStep(step.id);
                      const expanded = expandedSteps.has(step.id);

                      return (
                        <div
                          key={step.id}
                          className={`border rounded-lg p-3 transition-colors ${
                            current ? "border-blue-300 bg-blue-50" :
                            completed ? "border-green-200 bg-green-50/50" :
                            "border-slate-200"
                          }`}
                          data-testid={`step-${step.id}`}
                        >
                          <div
                            className="flex items-start gap-3 cursor-pointer"
                            onClick={() => toggleStep(step.id)}
                          >
                            <div className="mt-0.5">
                              {completed ? (
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                              ) : current ? (
                                <Play className="w-5 h-5 text-blue-500" />
                              ) : (
                                <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm text-slate-700">{step.title}</span>
                                {step.warningLevel === "critical" && (
                                  <Badge className="bg-red-100 text-red-800 text-xs">Critical Action</Badge>
                                )}
                                {step.warningLevel === "warning" && (
                                  <Badge className="bg-amber-100 text-amber-800 text-xs">Use Caution</Badge>
                                )}
                              </div>
                            </div>
                            {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                          </div>

                          {expanded && (
                            <div className="mt-3 ml-8 space-y-3">
                              <p className="text-sm text-slate-600">{step.description}</p>
                              {step.apiEndpoint && (
                                <div className="flex items-center gap-2 text-xs">
                                  <ExternalLink className="w-3 h-3 text-slate-400" />
                                  <code className="bg-slate-100 px-2 py-0.5 rounded">{step.apiEndpoint}</code>
                                </div>
                              )}
                              {step.killSwitchRef && (
                                <div className="text-xs text-slate-500">
                                  Kill Switch: <Badge variant="outline" className="text-xs">{step.killSwitchRef}</Badge>
                                </div>
                              )}
                              {step.expectedOutcome && (
                                <div className="text-xs bg-green-50 border border-green-200 rounded p-2">
                                  <span className="font-medium text-green-700">Expected:</span>{" "}
                                  <span className="text-green-600">{step.expectedOutcome}</span>
                                </div>
                              )}
                              {activeExecution?.status === "in_progress" && !completed && (
                                <div className="space-y-2">
                                  <Input
                                    placeholder="Add a note for this step (optional)..."
                                    value={stepNotes[step.id] || ""}
                                    onChange={(e) => setStepNotes({ ...stepNotes, [step.id]: e.target.value })}
                                    className="text-sm"
                                    data-testid={`input-note-${step.id}`}
                                  />
                                  <Button
                                    size="sm"
                                    onClick={() => executeStep.mutate({ stepId: step.id })}
                                    disabled={executeStep.isPending}
                                    data-testid={`button-complete-step-${step.id}`}
                                  >
                                    <CheckCircle2 className="w-3 h-3 mr-1" /> Mark Complete
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageSquare className="w-5 h-5" /> Communication Templates
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-slate-600 mb-1">Subject</h4>
            <div className="bg-slate-50 rounded p-2 text-sm" data-testid="text-comm-subject">
              {runbook.communicationTemplate.subject}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-slate-600 mb-1">Internal Message</h4>
            <div className="bg-slate-50 rounded p-2 text-sm" data-testid="text-comm-internal">
              {runbook.communicationTemplate.internalMessage}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-slate-600 mb-1">External Message (User-Facing)</h4>
            <div className="bg-slate-50 rounded p-2 text-sm" data-testid="text-comm-external">
              {runbook.communicationTemplate.externalMessage}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-slate-600 mb-1">Status Page Update</h4>
            <div className="bg-slate-50 rounded p-2 text-sm" data-testid="text-comm-statuspage">
              {runbook.communicationTemplate.statusPageUpdate}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminRunbooksPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [severityFilter, setSeverityFilter] = useState<string>("");
  const [selectedRunbook, setSelectedRunbook] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["runbooks", searchTerm, categoryFilter, severityFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.set("search", searchTerm);
      if (categoryFilter) params.set("category", categoryFilter);
      if (severityFilter) params.set("severity", severityFilter);
      const res = await fetch(`/api/admin/runbooks?${params}`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error("Failed to load runbooks");
      return res.json();
    },
  });

  if (selectedRunbook) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <RunbookDetail
          runbook={selectedRunbook}
          onBack={() => setSelectedRunbook(null)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2" data-testid="text-page-title">
            <BookOpen className="w-6 h-6" /> Incident Runbooks
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Predefined response procedures for common incidents
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search runbooks by title, symptom, or tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            data-testid="input-search-runbooks"
          />
        </div>
        <select
          className="border rounded px-3 py-2 text-sm bg-white"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          data-testid="select-category-filter"
        >
          <option value="">All Categories</option>
          <option value="exams">Exams</option>
          <option value="cat">CAT</option>
          <option value="billing">Billing</option>
          <option value="performance">Performance</option>
          <option value="content">Content</option>
        </select>
        <select
          className="border rounded px-3 py-2 text-sm bg-white"
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          data-testid="select-severity-filter"
        >
          <option value="">All Severities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-slate-500" data-testid="loading-runbooks">
          Loading runbooks...
        </div>
      ) : data?.runbooks?.length === 0 ? (
        <div className="text-center py-12 text-slate-500" data-testid="text-no-runbooks">
          No runbooks match your search criteria.
        </div>
      ) : (
        <div className="space-y-3" data-testid="list-runbooks">
          {data?.runbooks?.map((rb: any) => (
            <RunbookCard
              key={rb.id}
              runbook={rb}
              onSelect={() => setSelectedRunbook(rb)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
