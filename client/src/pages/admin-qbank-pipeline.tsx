import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { adminFetch } from "@/lib/admin-fetch";
import { useI18n } from "@/lib/i18n";
import {
  Zap, BarChart3, Target, RefreshCw, Pause, Play, AlertTriangle,
  CheckCircle2, TrendingUp, Database, Layers,
} from "lucide-react";

interface PipelineProgress {
  counts: Record<string, {
    total: number;
    target: number;
    byExam: Record<string, number>;
    byTopic: Record<string, number>;
    byFormat: Record<string, number>;
    byStatus: Record<string, number>;
  }>;
  gaps: Array<{
    tier: string;
    target: number;
    current: number;
    gap: number;
    percentComplete: number;
    topicGaps: Array<{ topic: string; current: number; estimated: number; gap: number }>;
  }>;
  targets: Record<string, number>;
}

interface PipelineRun {
  id: string;
  config: {
    tier: string;
    examType: string;
    topic?: string;
    targetCount: number;
  };
  status: string;
  generatedCount: number;
  validCount: number;
  duplicateCount: number;
  errorCount: number;
  startedAt?: string;
  completedAt?: string;
  lastError?: string;
}

const TIER_EXAMS: Record<string, string[]> = {
  rpn: ["REx-PN", "NCLEX-PN"],
  rn: ["NCLEX-RN", "NMC-CBT", "AHPRA"],
  np: ["AANP-FNP", "ANCC-FNP", "AGPCNP-AANP", "AGPCNP-ANCC", "AGACNP", "PMHNP", "PNP", "WHNP", "ENP", "CNPE"],
};

const QUESTION_TYPES = [
  { value: "", label: "All Types" },
  { value: "mcq", label: "MCQ - Single Best Answer" },
  { value: "sata", label: "SATA - Select All That Apply" },
  { value: "bowtie", label: "Bow-Tie / Triage" },
  { value: "matrix", label: "Matrix / Grid" },
  { value: "highlight", label: "Highlight Text" },
  { value: "trend", label: "Trend / Time-Series" },
  { value: "image_based", label: "Image-Based / Clinical Finding" },
  { value: "drag_drop", label: "Drag & Drop / Ordering" },
  { value: "case_study", label: "Case Study / Vignette" },
  { value: "ordered", label: "Ordered Response" },
  { value: "fill-in-blank", label: "Fill-in / Short Answer" },
  { value: "hot-spot", label: "Hotspot / Image-Based" },
];

const BODY_SYSTEMS = [
  "Cardiology", "Respiratory", "Neurology", "Endocrine", "Renal", "GI",
  "Hematology", "Immunology", "Infectious Disease", "Maternal-Newborn",
  "Pediatrics", "Mental Health", "Pharmacology", "Critical Care",
  "Emergency", "Community Health", "Geriatrics",
];

const TIER_LABELS: Record<string, string> = {
  rpn: "RPN / PN / LVN",
  rn: "RN",
  np: "NP Advanced",
};

const TIER_COLORS: Record<string, string> = {
  rpn: "bg-blue-500",
  rn: "bg-purple-500",
  np: "bg-amber-500",
};

const STATUS_STYLES: Record<string, string> = {
  running: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
  paused: "bg-yellow-100 text-yellow-700",
  queued: "bg-gray-100 text-gray-700",
};

export default function AdminQBankPipeline() {
  const { t } = useI18n();
  const [progress, setProgress] = useState<PipelineProgress | null>(null);
  const [runs, setRuns] = useState<{ activeRuns: PipelineRun[]; dbRuns: any[] }>({ activeRuns: [], dbRuns: [] });
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [showTopicGaps, setShowTopicGaps] = useState<string | null>(null);

  const [formTier, setFormTier] = useState("rpn");
  const [formExam, setFormExam] = useState("REx-PN");
  const [formTopic, setFormTopic] = useState("");
  const [formSubtopic, setFormSubtopic] = useState("");
  const [formTargetCount, setFormTargetCount] = useState(100);
  const [formCountry, setFormCountry] = useState("CA");
  const [formQuestionType, setFormQuestionType] = useState("");
  const [formBodySystem, setFormBodySystem] = useState("");

  const fetchProgress = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminFetch("/api/admin/qbank-pipeline/progress");
      if (res.ok) setProgress(await res.json());
    } catch {}
    setLoading(false);
  }, []);

  const fetchRuns = useCallback(async () => {
    try {
      const res = await adminFetch("/api/admin/qbank-pipeline/runs");
      if (res.ok) setRuns(await res.json());
    } catch {}
  }, []);

  useEffect(() => {
    fetchProgress();
    fetchRuns();
    const interval = setInterval(() => {
      fetchRuns();
    }, 10000);
    return () => clearInterval(interval);
  }, [fetchProgress, fetchRuns]);

  useEffect(() => {
    setFormExam((TIER_EXAMS[formTier] || [])[0] || "");
  }, [formTier]);

  async function handleGenerate() {
    setGenerating(true);
    try {
      const res = await adminFetch("/api/admin/qbank-pipeline/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier: formTier,
          examType: formExam,
          topic: formTopic || undefined,
          subtopic: formSubtopic || undefined,
          targetCount: formTargetCount,
          countryCode: formCountry,
          questionType: formQuestionType || undefined,
          bodySystem: formBodySystem || undefined,
        }),
      });
      if (res.ok) {
        await fetchRuns();
      }
    } catch {}
    setGenerating(false);
  }

  async function handlePause(runId: string) {
    try {
      await adminFetch(`/api/admin/qbank-pipeline/runs/${runId}/pause`, { method: "POST" });
      await fetchRuns();
    } catch {}
  }

  return (
    <div className="space-y-6" data-testid="admin-qbank-pipeline">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold" data-testid="text-pipeline-title">{t("pages.adminQbankPipeline.questionGenerationPipeline")}</h2>
          <p className="text-sm text-muted-foreground mt-1">{t("pages.adminQbankPipeline.scaleupTo12kRpn18k")}</p>
        </div>
        <Button variant="outline" onClick={() => { fetchProgress(); fetchRuns(); }} disabled={loading} data-testid="button-refresh-pipeline">
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {progress && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {["rpn", "rn", "np"].map(tier => {
            const data = progress.counts[tier];
            const gap = progress.gaps.find(g => g.tier === tier);
            if (!data) return null;
            const pct = gap?.percentComplete || 0;
            return (
              <Card key={tier} data-testid={`card-tier-progress-${tier}`}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between text-base">
                    <span className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${TIER_COLORS[tier]}`} />
                      {TIER_LABELS[tier] || tier.toUpperCase()}
                    </span>
                    <Badge variant="outline" data-testid={`badge-pct-${tier}`}>{pct}%</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">{t("pages.adminQbankPipeline.progress")}</span>
                        <span className="font-medium" data-testid={`text-count-${tier}`}>
                          {data.total.toLocaleString()} / {(progress.targets[tier] || 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full ${TIER_COLORS[tier]}`}
                          style={{ width: `${Math.min(100, pct)}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Gap: {gap?.gap?.toLocaleString() || 0}</span>
                      <span>Target: {(progress.targets[tier] || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(data.byStatus).slice(0, 4).map(([status, count]) => (
                        <Badge key={status} variant="secondary" className="text-xs" data-testid={`badge-status-${tier}-${status}`}>
                          {status}: {count}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(data.byFormat).slice(0, 5).map(([fmt, count]) => (
                        <Badge key={fmt} variant="outline" className="text-xs">
                          {fmt}: {count}
                        </Badge>
                      ))}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-xs"
                      onClick={() => setShowTopicGaps(showTopicGaps === tier ? null : tier)}
                      data-testid={`button-topic-gaps-${tier}`}
                    >
                      {showTopicGaps === tier ? "Hide" : "Show"} Topic Gaps
                    </Button>
                    {showTopicGaps === tier && gap?.topicGaps && (
                      <div className="max-h-48 overflow-y-auto space-y-1">
                        {gap.topicGaps.slice(0, 15).map(tg => (
                          <div key={tg.topic} className="flex justify-between text-xs">
                            <span className="truncate max-w-[60%]">{tg.topic}</span>
                            <span className={tg.gap > 0 ? "text-red-500 font-medium" : "text-green-500"}>
                              {tg.current}/{tg.estimated} ({tg.gap > 0 ? `-${tg.gap}` : "OK"})
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Card data-testid="card-generate-form">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Zap className="w-4 h-4" />
            Trigger Generation Run
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">{t("pages.adminQbankPipeline.tier")}</label>
              <select
                className="w-full mt-1 border rounded-md p-2 text-sm"
                value={formTier}
                onChange={e => setFormTier(e.target.value)}
                data-testid="select-tier"
              >
                <option value="rpn">{t("pages.adminQbankPipeline.rpnPnLvn")}</option>
                <option value="rn">RN</option>
                <option value="np">{t("pages.adminQbankPipeline.npAdvanced")}</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">{t("pages.adminQbankPipeline.examType")}</label>
              <select
                className="w-full mt-1 border rounded-md p-2 text-sm"
                value={formExam}
                onChange={e => setFormExam(e.target.value)}
                data-testid="select-exam"
              >
                {(TIER_EXAMS[formTier] || []).map(exam => (
                  <option key={exam} value={exam}>{exam}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">{t("pages.adminQbankPipeline.country")}</label>
              <select
                className="w-full mt-1 border rounded-md p-2 text-sm"
                value={formCountry}
                onChange={e => setFormCountry(e.target.value)}
                data-testid="select-country"
              >
                <option value="CA">{t("pages.adminQbankPipeline.canada")}</option>
                <option value="US">{t("pages.adminQbankPipeline.unitedStates")}</option>
                <option value="BOTH">{t("pages.adminQbankPipeline.both")}</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">{t("pages.adminQbankPipeline.questionType")}</label>
              <select
                className="w-full mt-1 border rounded-md p-2 text-sm"
                value={formQuestionType}
                onChange={e => setFormQuestionType(e.target.value)}
                data-testid="select-question-type"
              >
                {QUESTION_TYPES.map(qt => (
                  <option key={qt.value} value={qt.value}>{qt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">{t("pages.adminQbankPipeline.bodySystem")}</label>
              <select
                className="w-full mt-1 border rounded-md p-2 text-sm"
                value={formBodySystem}
                onChange={e => setFormBodySystem(e.target.value)}
                data-testid="select-body-system"
              >
                <option value="">{t("pages.adminQbankPipeline.allSystems")}</option>
                {BODY_SYSTEMS.map(sys => (
                  <option key={sys} value={sys}>{sys}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">{t("pages.adminQbankPipeline.topicOptional")}</label>
              <Input
                placeholder="e.g. Cardiac, Pharmacology"
                value={formTopic}
                onChange={e => setFormTopic(e.target.value)}
                data-testid="input-topic"
              />
            </div>
            <div>
              <label className="text-sm font-medium">{t("pages.adminQbankPipeline.subtopicOptional")}</label>
              <Input
                placeholder="e.g. Heart Failure, Beta Blockers"
                value={formSubtopic}
                onChange={e => setFormSubtopic(e.target.value)}
                data-testid="input-subtopic"
              />
            </div>
            <div>
              <label className="text-sm font-medium">{t("pages.adminQbankPipeline.targetCount")}</label>
              <Input
                type="number"
                min={10}
                max={5000}
                value={formTargetCount}
                onChange={e => setFormTargetCount(Math.max(10, Math.min(5000, parseInt(e.target.value) || 10)))}
                data-testid="input-target-count"
              />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <Button onClick={handleGenerate} disabled={generating || !formExam} data-testid="button-start-generation">
              {generating ? (
                <><RefreshCw className="w-4 h-4 mr-2 animate-spin" />{t("pages.adminQbankPipeline.starting")}</>
              ) : (
                <><Play className="w-4 h-4 mr-2" />{t("pages.adminQbankPipeline.startGeneration")}</>
              )}
            </Button>
            <span className="text-xs text-muted-foreground">
              Will generate {formTargetCount} {formExam} questions for {TIER_LABELS[formTier] || formTier}
              {formQuestionType ? ` (${QUESTION_TYPES.find(t => t.value === formQuestionType)?.label || formQuestionType})` : ""}
              {formBodySystem ? ` - ${formBodySystem}` : ""}
              {formTopic ? ` on "${formTopic}"` : " across all topics"}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card data-testid="card-pipeline-runs">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Database className="w-4 h-4" />
            Generation Runs
          </CardTitle>
        </CardHeader>
        <CardContent>
          {runs.activeRuns.length === 0 && runs.dbRuns.length === 0 ? (
            <p className="text-sm text-muted-foreground" data-testid="text-no-runs">{t("pages.adminQbankPipeline.noGenerationRunsYetStart")}</p>
          ) : (
            <div className="space-y-2">
              {runs.activeRuns.map(run => (
                <div key={run.id} className="flex items-center justify-between p-3 border rounded-lg" data-testid={`run-active-${run.id}`}>
                  <div className="flex items-center gap-3">
                    <Badge className={STATUS_STYLES[run.status] || ""}>{run.status}</Badge>
                    <div>
                      <span className="text-sm font-medium">{run.config.examType}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {run.config.tier.toUpperCase()} {run.config.topic ? `- ${run.config.topic}` : ""}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right text-xs">
                      <div data-testid={`text-run-progress-${run.id}`}>
                        <span className="font-medium">{run.validCount}</span> / {run.config.targetCount}
                      </div>
                      <div className="text-muted-foreground">
                        {run.duplicateCount > 0 && <span className="text-yellow-600">{run.duplicateCount} dupes </span>}
                        {run.errorCount > 0 && <span className="text-red-500">{run.errorCount} errors</span>}
                      </div>
                    </div>
                    {run.status === "running" && (
                      <Button size="sm" variant="outline" onClick={() => handlePause(run.id)} data-testid={`button-pause-${run.id}`}>
                        <Pause className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              {runs.dbRuns.slice(0, 20).map((run: any) => (
                <div key={run.id} className="flex items-center justify-between p-3 border rounded-lg opacity-75" data-testid={`run-db-${run.id}`}>
                  <div className="flex items-center gap-3">
                    <Badge className={STATUS_STYLES[run.status] || ""}>{run.status}</Badge>
                    <div>
                      <span className="text-sm font-medium">{run.tier?.toUpperCase()}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {run.generatedCount || 0} / {run.targetCount}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {run.createdAt ? new Date(run.createdAt).toLocaleString() : ""}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {progress && (
        <Card data-testid="card-blueprint-overview">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Layers className="w-4 h-4" />
              Blueprint Coverage Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {["rpn", "rn", "np"].map(tier => {
                const data = progress.counts[tier];
                if (!data) return null;
                return (
                  <div key={tier}>
                    <h4 className="font-medium text-sm mb-2">{TIER_LABELS[tier]} - Exam Distribution</h4>
                    {Object.entries(data.byExam).length > 0 ? (
                      <div className="space-y-1">
                        {Object.entries(data.byExam).map(([exam, count]) => (
                          <div key={exam} className="flex justify-between text-xs">
                            <span>{exam}</span>
                            <span className="font-medium">{count.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">{t("pages.adminQbankPipeline.noQuestionsYet")}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
      <Card data-testid="card-advanced-question-types">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Target className="w-4 h-4" />
            Advanced Question Type Targets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { tier: "RPN", targets: { MCQ: 3000, SATA: 1200, "Bow-Tie": 600, "Case Study": 400, "Drag-Drop": 400, Matrix: 300, Highlight: 300, Trend: 300, "Image-Based": 300 }, total: 6800 },
              { tier: "RN", targets: { MCQ: 5000, SATA: 2000, "Bow-Tie": 1200, "Case Study": 800, "Drag-Drop": 700, Matrix: 600, Highlight: 600, Trend: 600, "Image-Based": 600 }, total: 12100 },
              { tier: "NP", targets: { MCQ: 6000, SATA: 2500, "Bow-Tie": 1500, "Case Study": 1200, "Drag-Drop": 800, Matrix: 700, Highlight: 700, Trend: 700, "Image-Based": 700 }, total: 14800 },
            ].map(({ tier, targets, total }) => (
              <div key={tier} data-testid={`card-type-targets-${tier.toLowerCase()}`}>
                <h4 className="font-medium text-sm mb-2">{tier} - Type Distribution ({total.toLocaleString()} total)</h4>
                <div className="space-y-1">
                  {Object.entries(targets).map(([type, count]) => {
                    const pct = ((count / total) * 100).toFixed(0);
                    return (
                      <div key={type} className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{type}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-100 rounded-full h-1.5">
                            <div className="h-1.5 rounded-full bg-blue-500" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="font-medium w-12 text-right">{count.toLocaleString()}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
            Total across all tiers: 33,700 questions covering 17 body systems
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
