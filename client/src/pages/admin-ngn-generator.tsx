import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminFetch } from "@/lib/admin-fetch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft, Play, CheckCircle, XCircle, Clock, AlertTriangle,
  Loader2, BarChart3, Database, Calendar as CalendarIcon, FileText,
  ChevronDown, ChevronRight, Trash2, Power, Plus, Settings, Zap
} from "lucide-react";
import { Link } from "wouter";

import { useI18n } from "@/lib/i18n";
const CATEGORIES = [
  { value: "nursing_ngn", label: "Nursing NGN" },
  { value: "allied", label: "Allied Health" },
  { value: "np_canada", label: "Canadian NP" },
  { value: "np_us", label: "US NP" },
] as const;

const BATCH_SIZES = [10, 25, 50, 100];

const TYPE_PRESETS = [
  { value: "balanced", label: "Balanced (All Formats)" },
  { value: "heavy_case", label: "Heavy Case-Based" },
  { value: "assessment", label: "Assessment Focus" },
  { value: "clinical_judgment", label: "Clinical Judgment Mix" },
  { value: "custom", label: "Custom" },
] as const;

const ALL_QUESTION_FORMATS = [
  { value: "MCQ", label: "MCQ", category: "core" },
  { value: "SATA", label: "SATA", category: "core" },
  { value: "BOWTIE", label: "Bowtie", category: "ngn" },
  { value: "CASE_STUDY_SERIES", label: "Case Study Series", category: "clinical" },
  { value: "MATRIX", label: "Matrix", category: "ngn" },
  { value: "TREND", label: "Trend Analysis", category: "clinical" },
  { value: "DRAG_DROP", label: "Drag & Drop", category: "ngn" },
  { value: "HIGHLIGHT_TEXT", label: "Highlight Text", category: "ngn" },
  { value: "LAB_INTERPRETATION", label: "Lab Interpretation", category: "clinical" },
  { value: "IMAGE_HOTSPOT", label: "Image Hotspot", category: "clinical" },
  { value: "CALCULATION_NUMERIC", label: "Calculation/Numeric", category: "clinical" },
  { value: "MATCHING_GRID", label: "Matching Grid", category: "clinical" },
] as const;

const TARGET_DISTRIBUTION: Record<string, Record<string, number>> = {
  balanced: {
    MCQ: 45, SATA: 15, BOWTIE: 10, CASE_STUDY_SERIES: 10, MATRIX: 5,
    TREND: 5, DRAG_DROP: 3, HIGHLIGHT_TEXT: 1, LAB_INTERPRETATION: 1,
    IMAGE_HOTSPOT: 2, CALCULATION_NUMERIC: 2, MATCHING_GRID: 1,
  },
  heavy_case: {
    MCQ: 25, SATA: 10, BOWTIE: 15, CASE_STUDY_SERIES: 20, MATRIX: 5,
    TREND: 10, DRAG_DROP: 3, HIGHLIGHT_TEXT: 1, LAB_INTERPRETATION: 3,
    IMAGE_HOTSPOT: 3, CALCULATION_NUMERIC: 3, MATCHING_GRID: 2,
  },
  assessment: {
    MCQ: 50, SATA: 20, BOWTIE: 5, CASE_STUDY_SERIES: 5, MATRIX: 5,
    TREND: 3, DRAG_DROP: 2, HIGHLIGHT_TEXT: 2, LAB_INTERPRETATION: 2,
    IMAGE_HOTSPOT: 2, CALCULATION_NUMERIC: 2, MATCHING_GRID: 2,
  },
  clinical_judgment: {
    MCQ: 30, SATA: 10, BOWTIE: 12, CASE_STUDY_SERIES: 15, MATRIX: 5,
    TREND: 8, DRAG_DROP: 3, HIGHLIGHT_TEXT: 2, LAB_INTERPRETATION: 5,
    IMAGE_HOTSPOT: 3, CALCULATION_NUMERIC: 4, MATCHING_GRID: 3,
  },
};

function StatusBadge({ status }: { status: string }) {
  const { t } = useI18n();
  const colors: Record<string, string> = {
    queued: "bg-yellow-100 text-yellow-800",
    running: "bg-blue-100 text-blue-800",
    validating: "bg-purple-100 text-purple-800",
    completed: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
    cancelled: "bg-gray-100 text-gray-800",
  };
  return (
    <Badge className={colors[status] || "bg-gray-100 text-gray-800"} data-testid={`badge-status-${status}`}>
      {status}
    </Badge>
  );
}

function ValidationIndicator({ passed, label, detail }: { passed: boolean; label: string; detail?: string }) {
  return (
    <div className="flex items-center gap-2 text-sm" data-testid={`validation-${label.toLowerCase().replace(/\s+/g, "-")}`}>
      {passed ? (
        <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
      ) : (
        <XCircle className="h-4 w-4 text-red-500 shrink-0" />
      )}
      <span className={passed ? "text-green-700" : "text-red-700"}>{label}</span>
      {detail && <span className="text-xs text-gray-500 ml-auto">{detail}</span>}
    </div>
  );
}

function GenerateTab() {
  const queryClient = useQueryClient();
  const [category, setCategory] = useState("");
  const [variantKey, setVariantKey] = useState("");
  const [batchSize, setBatchSize] = useState(25);
  const [typePreset, setTypePreset] = useState("balanced");
  const [rationaleMinWords, setRationaleMinWords] = useState(250);
  const [isDryRun, setIsDryRun] = useState(true);
  const [autoIngest, setAutoIngest] = useState(false);

  const { data: templates } = useQuery({
    queryKey: ["/api/admin/qbank/prompt-templates"],
    queryFn: () => adminFetch("/api/admin/qbank/prompt-templates").then(r => r.json()),
  });

  const selectedTemplate = useMemo(() => {
    if (!templates || !category) return null;
    const all = Array.isArray(templates) ? templates : [];
    return all.find((t: any) => t.category === category) || null;
  }, [templates, category]);

  const variants = useMemo(() => {
    if (!selectedTemplate) return [];
    return selectedTemplate.variants || [];
  }, [selectedTemplate]);

  const selectedVariant = useMemo(() => {
    return variants.find((v: any) => v.variantKey === variantKey) || null;
  }, [variants, variantKey]);

  const generateMutation = useMutation({
    mutationFn: async () => {
      if (!selectedTemplate || !selectedVariant) throw new Error("Select category and variant");
      const res = await adminFetch("/api/admin/qbank/generate-ngn-batch", {
        method: "POST",
        body: {
          templateKey: selectedTemplate.key,
          variantKey: selectedVariant.variantKey,
          count: batchSize,
          rationaleMinWords,
          dryRun: isDryRun,
          ingest: autoIngest && !isDryRun,
          model: "gpt-4o-mini",
        },
      });
      if (!res.ok) throw new Error("Generation failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/qbank/generation-runs"] });
    },
  });

  const ingestMutation = useMutation({
    mutationFn: async (runId: string) => {
      const res = await adminFetch(`/api/admin/qbank/generation-runs/${runId}/ingest`, { method: "POST" });
      if (!res.ok) throw new Error("Ingestion failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/qbank/generation-runs"] });
    },
  });

  const result = generateMutation.data as any;
  const validationReport = result?.validationReport;

  return (
    <div className="space-y-6">
      <Card data-testid="card-generate-config">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="h-5 w-5" /> Batch Generation Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm mb-1 block">{t("pages.adminNgnGenerator.examCategory")}</Label>
              <Select value={category} onValueChange={(v) => { setCategory(v); setVariantKey(""); }} data-testid="select-category">
                <SelectTrigger data-testid="select-category-trigger">
                  <SelectValue placeholder={t("pages.adminNgnGenerator.selectCategory")} />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(c => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm mb-1 block">{t("pages.adminNgnGenerator.variantSubexam")}</Label>
              <Select value={variantKey} onValueChange={setVariantKey} disabled={!category} data-testid="select-variant">
                <SelectTrigger data-testid="select-variant-trigger">
                  <SelectValue placeholder={category ? "Select variant" : "Select category first"} />
                </SelectTrigger>
                <SelectContent>
                  {variants.map((v: any) => (
                    <SelectItem key={v.variantKey} value={v.variantKey}>
                      {v.examKey} ({v.region})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm mb-1 block">{t("pages.adminNgnGenerator.batchSize")}</Label>
              <Select value={String(batchSize)} onValueChange={(v) => setBatchSize(Number(v))} data-testid="select-batch-size">
                <SelectTrigger data-testid="select-batch-size-trigger">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BATCH_SIZES.map(s => (
                    <SelectItem key={s} value={String(s)}>{s} questions</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm mb-1 block">{t("pages.adminNgnGenerator.typeMixPreset")}</Label>
              <Select value={typePreset} onValueChange={setTypePreset} data-testid="select-type-preset">
                <SelectTrigger data-testid="select-type-preset-trigger">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TYPE_PRESETS.map(p => (
                    <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-1 md:col-span-2">
              <Label className="text-sm mb-2 block">Rationale Minimum Words: {rationaleMinWords}</Label>
              <Slider
                value={[rationaleMinWords]}
                onValueChange={(v) => setRationaleMinWords(v[0])}
                min={250}
                max={600}
                step={50}
                className="mt-2"
                data-testid="slider-rationale-words"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>250</span>
                <span>600</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <Switch
                checked={isDryRun}
                onCheckedChange={setIsDryRun}
                data-testid="switch-dry-run"
              />
              <Label className="text-sm">{t("pages.adminNgnGenerator.dryRun")}</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={autoIngest}
                onCheckedChange={setAutoIngest}
                disabled={isDryRun}
                data-testid="switch-auto-ingest"
              />
              <Label className="text-sm text-gray-500">Auto-Ingest {isDryRun && "(disabled in dry run)"}</Label>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => generateMutation.mutate()}
              disabled={generateMutation.isPending || !category || !variantKey}
              data-testid="button-generate-batch"
            >
              {generateMutation.isPending ? (
                <><Loader2 className="animate-spin mr-2 h-4 w-4" /> {t("pages.adminNgnGenerator.generating")}</>
              ) : (
                <><Play className="mr-2 h-4 w-4" /> {t("pages.adminNgnGenerator.generateBatch")}</>
              )}
            </Button>
          </div>

          {generateMutation.isError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700" data-testid="text-generate-error">
              <AlertTriangle className="inline h-4 w-4 mr-1" />
              {(generateMutation.error as Error).message}
            </div>
          )}
        </CardContent>
      </Card>

      {result && (
        <Card data-testid="card-generate-results">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5" /> Generation Results
              <StatusBadge status={result.status || "completed"} />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg" data-testid="stat-generated">
                <div className="text-2xl font-bold">{result.totalGenerated || 0}</div>
                <div className="text-xs text-gray-500">{t("pages.adminNgnGenerator.generated")}</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg" data-testid="stat-accepted">
                <div className="text-2xl font-bold text-green-700">{result.totalAccepted || 0}</div>
                <div className="text-xs text-green-600">{t("pages.adminNgnGenerator.accepted")}</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg" data-testid="stat-rejected">
                <div className="text-2xl font-bold text-red-700">{result.totalRejected || 0}</div>
                <div className="text-xs text-red-600">{t("pages.adminNgnGenerator.rejected")}</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg" data-testid="stat-run-id">
                <div className="text-xs font-mono text-blue-700 truncate">{result.runId || "N/A"}</div>
                <div className="text-xs text-blue-600">{t("pages.adminNgnGenerator.runId")}</div>
              </div>
            </div>

            {validationReport && (
              <div className="space-y-3 p-4 bg-gray-50 rounded-lg" data-testid="validation-dashboard">
                <h4 className="font-medium text-sm">{t("pages.adminNgnGenerator.validationReport")}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <ValidationIndicator
                    passed={!validationReport.errors?.some((e: string) => e.includes("domain"))}
                    label={t("pages.adminNgnGenerator.domainDistribution2")}
                    detail={validationReport.domainReport ? "Within tolerance" : undefined}
                  />
                  <ValidationIndicator
                    passed={!validationReport.errors?.some((e: string) => e.includes("format"))}
                    label={t("pages.adminNgnGenerator.formatMix")}
                    detail={validationReport.formatReport ? "Matches requirements" : undefined}
                  />
                  <ValidationIndicator
                    passed={!validationReport.errors?.some((e: string) => e.includes("rationale"))}
                    label={t("pages.adminNgnGenerator.rationaleLength")}
                    detail={validationReport.rationaleStats ? `Avg: ${validationReport.rationaleStats.avg || validationReport.rationaleStats.avgWords || 0} words` : undefined}
                  />
                  <ValidationIndicator
                    passed={!validationReport.errors?.some((e: string) => e.includes("scope"))}
                    label={t("pages.adminNgnGenerator.scopeCompliance")}
                  />
                </div>
                {validationReport.errors?.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {validationReport.errors.map((err: string, i: number) => (
                      <div key={i} className="text-xs text-red-600 flex items-center gap-1">
                        <XCircle className="h-3 w-3 shrink-0" /> {err}
                      </div>
                    ))}
                  </div>
                )}
                {validationReport.warnings?.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {validationReport.warnings.map((w: string, i: number) => (
                      <div key={i} className="text-xs text-yellow-600 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3 shrink-0" /> {w}
                      </div>
                    ))}
                  </div>
                )}

                {validationReport.domainReport && (
                  <div className="mt-3">
                    <h5 className="text-xs font-medium text-gray-600 mb-1">{t("pages.adminNgnGenerator.domainDistribution")}</h5>
                    <div className="space-y-1">
                      {Object.entries(validationReport.domainReport as Record<string, any>).map(([domain, data]: [string, any]) => (
                        <div key={domain} className="flex items-center gap-2 text-xs">
                          <span className="w-40 truncate text-gray-600">{domain}</span>
                          <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 rounded-full"
                              style={{ width: `${Math.min(100, typeof data === "number" ? data : data.actual || 0)}%` }}
                            />
                          </div>
                          <span className="w-14 text-right text-gray-700">
                            {(typeof data === "number" ? data : data.actual || 0).toFixed(1)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {validationReport.formatReport && (
                  <div className="mt-3">
                    <h5 className="text-xs font-medium text-gray-600 mb-1">{t("pages.adminNgnGenerator.formatDistribution")}</h5>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(validationReport.formatReport as Record<string, any>).map(([fmt, val]) => (
                        <Badge key={fmt} variant="outline" className="text-xs">
                          {fmt}: {typeof val === "object" ? `${val.actual}/${val.expected}` : val}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {result.previewItems?.length > 0 && (
              <div data-testid="preview-table">
                <h4 className="font-medium text-sm mb-2">Preview Items ({result.previewItems.length})</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-xs text-gray-500">
                        <th className="py-2 px-2">#</th>
                        <th className="py-2 px-2">{t("pages.adminNgnGenerator.type")}</th>
                        <th className="py-2 px-2">{t("pages.adminNgnGenerator.domain")}</th>
                        <th className="py-2 px-2">{t("pages.adminNgnGenerator.difficulty")}</th>
                        <th className="py-2 px-2">{t("pages.adminNgnGenerator.tags")}</th>
                        <th className="py-2 px-2">{t("pages.adminNgnGenerator.rationaleWords")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.previewItems.map((item: any, i: number) => (
                        <tr key={i} className="border-b hover:bg-gray-50" data-testid={`preview-row-${i}`}>
                          <td className="py-2 px-2 text-gray-400">{i + 1}</td>
                          <td className="py-2 px-2">
                            <Badge variant="outline" className="text-xs">{item.questionType}</Badge>
                          </td>
                          <td className="py-2 px-2 text-xs">{item.clientNeedDomain || item.domain}</td>
                          <td className="py-2 px-2">
                            <span className="text-xs font-medium">{item.difficulty}/5</span>
                          </td>
                          <td className="py-2 px-2">
                            <div className="flex flex-wrap gap-1">
                              {(item.tags || []).slice(0, 3).map((tag: string, j: number) => (
                                <span key={j} className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">{tag}</span>
                              ))}
                            </div>
                          </td>
                          <td className="py-2 px-2 text-xs">
                            {item.rationale ? item.rationale.split(/\s+/).length : 0}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              {result.runId && isDryRun && (
                <Button
                  onClick={() => ingestMutation.mutate(result.runId)}
                  disabled={ingestMutation.isPending || validationReport?.errors?.length > 0}
                  variant="default"
                  data-testid="button-ingest-to-bank"
                >
                  {ingestMutation.isPending ? (
                    <><Loader2 className="animate-spin mr-2 h-4 w-4" /> {t("pages.adminNgnGenerator.ingesting")}</>
                  ) : (
                    <><Database className="mr-2 h-4 w-4" /> {t("pages.adminNgnGenerator.ingestToBank")}</>
                  )}
                </Button>
              )}
              <Button variant="outline" disabled data-testid="button-create-mock-exam">
                <FileText className="mr-2 h-4 w-4" /> Create Mock Exam Set from Batch
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function RunHistoryTab() {
  const [templateFilter, setTemplateFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedRun, setExpandedRun] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const params = new URLSearchParams();
  if (templateFilter !== "all") params.set("templateKey", templateFilter);
  if (statusFilter !== "all") params.set("status", statusFilter);
  params.set("limit", "25");

  const { data: runs, isLoading } = useQuery({
    queryKey: ["/api/admin/qbank/generation-runs", templateFilter, statusFilter],
    queryFn: () => adminFetch(`/api/admin/qbank/generation-runs?${params}`).then(r => r.json()),
  });

  const ingestMutation = useMutation({
    mutationFn: async (runId: string) => {
      const res = await adminFetch(`/api/admin/qbank/generation-runs/${runId}/ingest`, { method: "POST" });
      if (!res.ok) throw new Error("Ingestion failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/qbank/generation-runs"] });
    },
  });

  const items = Array.isArray(runs) ? runs : runs?.runs || [];

  return (
    <div className="space-y-4">
      <div className="flex gap-3 items-center flex-wrap">
        <Select value={templateFilter} onValueChange={setTemplateFilter}>
          <SelectTrigger className="w-44" data-testid="select-history-template">
            <SelectValue placeholder={t("pages.adminNgnGenerator.allTemplates2")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("pages.adminNgnGenerator.allTemplates")}</SelectItem>
            <SelectItem value="ngn_batch_v1">{t("pages.adminNgnGenerator.ngnNursing")}</SelectItem>
            <SelectItem value="allied_batch_v1">{t("pages.adminNgnGenerator.alliedHealth")}</SelectItem>
            <SelectItem value="cnpe_v1">{t("pages.adminNgnGenerator.canadianNp")}</SelectItem>
            <SelectItem value="np_us_v1">{t("pages.adminNgnGenerator.usNp")}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40" data-testid="select-history-status">
            <SelectValue placeholder={t("pages.adminNgnGenerator.allStatus2")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("pages.adminNgnGenerator.allStatus")}</SelectItem>
            <SelectItem value="queued">{t("pages.adminNgnGenerator.queued")}</SelectItem>
            <SelectItem value="running">{t("pages.adminNgnGenerator.running")}</SelectItem>
            <SelectItem value="completed">{t("pages.adminNgnGenerator.completed")}</SelectItem>
            <SelectItem value="failed">{t("pages.adminNgnGenerator.failed")}</SelectItem>
            <SelectItem value="cancelled">{t("pages.adminNgnGenerator.cancelled")}</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground ml-auto">{items.length} runs</span>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 py-8"><Loader2 className="animate-spin" /> {t("pages.adminNgnGenerator.loadingRunHistory")}</div>
      ) : items.length === 0 ? (
        <p className="text-muted-foreground py-8 text-center">{t("pages.adminNgnGenerator.noGenerationRunsFound")}</p>
      ) : (
        <div className="space-y-2">
          {items.map((run: any) => (
            <Card key={run.id} data-testid={`card-run-${run.id}`}>
              <CardContent className="py-3 px-4">
                <div
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => setExpandedRun(expandedRun === run.id ? null : run.id)}
                  data-testid={`row-run-${run.id}`}
                >
                  {expandedRun === run.id ? (
                    <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-400 shrink-0" />
                  )}
                  <div className="flex items-center gap-2 flex-1 flex-wrap">
                    <span className="text-xs text-gray-400">
                      {run.createdAt ? new Date(run.createdAt).toLocaleString() : "N/A"}
                    </span>
                    <Badge variant="outline" className="text-xs">{run.templateKey}</Badge>
                    <Badge variant="outline" className="text-xs">{run.variantKey}</Badge>
                    <span className="text-xs text-gray-600">
                      {run.acceptedCount || 0}/{run.targetCount || 0}
                    </span>
                    <StatusBadge status={run.status} />
                    {run.ingested && <Badge className="bg-green-100 text-green-800 text-xs">{t("pages.adminNgnGenerator.ingested")}</Badge>}
                    {run.isDryRun && <Badge variant="outline" className="text-xs">{t("pages.adminNgnGenerator.dryRun2")}</Badge>}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-gray-400">{run.tokenCost || 0} tokens</span>
                    {run.status === "completed" && run.isDryRun && !run.ingested && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => { e.stopPropagation(); ingestMutation.mutate(run.id); }}
                        disabled={ingestMutation.isPending}
                        data-testid={`button-reingest-${run.id}`}
                      >
                        <Database className="h-3 w-3 mr-1" /> Ingest
                      </Button>
                    )}
                  </div>
                </div>

                {expandedRun === run.id && (
                  <div className="mt-3 pt-3 border-t border-gray-100 space-y-3">
                    {run.errorMessage && (
                      <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                        <AlertTriangle className="inline h-3 w-3 mr-1" /> {run.errorMessage}
                      </div>
                    )}
                    {run.validationReport && (
                      <div className="space-y-2">
                        <h5 className="text-xs font-medium text-gray-600">{t("pages.adminNgnGenerator.validationReport2")}</h5>
                        {run.validationReport.errors?.length > 0 && (
                          <div className="space-y-1">
                            {run.validationReport.errors.map((e: string, i: number) => (
                              <div key={i} className="text-xs text-red-600"><XCircle className="inline h-3 w-3 mr-1" />{e}</div>
                            ))}
                          </div>
                        )}
                        {run.validationReport.domainReport && (
                          <div className="text-xs">
                            <span className="font-medium">{t("pages.adminNgnGenerator.domain2")} </span>
                            {Object.entries(run.validationReport.domainReport).map(([k, v]: [string, any]) => (
                              <span key={k} className="mr-2">{k}: {(typeof v === "number" ? v : v?.actual || 0).toFixed(1)}%</span>
                            ))}
                          </div>
                        )}
                        {run.validationReport.rationaleStats && (
                          <div className="text-xs">
                            <span className="font-medium">{t("pages.adminNgnGenerator.rationale")} </span>
                            Avg {run.validationReport.rationaleStats.avg || run.validationReport.rationaleStats.avgWords || 0} words,
                            Min {run.validationReport.rationaleStats.min || run.validationReport.rationaleStats.minWords || 0} words,
                            Max {run.validationReport.rationaleStats.max || run.validationReport.rationaleStats.maxWords || 0} words
                          </div>
                        )}
                      </div>
                    )}
                    <div className="text-xs text-gray-400 space-y-0.5">
                      <div>Model: {run.model || "gpt-4o-mini"}</div>
                      <div>Triggered by: {run.triggeredBy || "manual"}</div>
                      {run.startedAt && <div>Started: {new Date(run.startedAt).toLocaleString()}</div>}
                      {run.completedAt && <div>Completed: {new Date(run.completedAt).toLocaleString()}</div>}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function SchedulesTab() {
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formName, setFormName] = useState("");
  const [formTemplateKey, setFormTemplateKey] = useState("");
  const [formVariantKey, setFormVariantKey] = useState("");
  const [formExamKey, setFormExamKey] = useState("");
  const [formRegion, setFormRegion] = useState("Canada");
  const [formFrequency, setFormFrequency] = useState("daily");
  const [formCustomDays, setFormCustomDays] = useState<number[]>([]);
  const [formRunTimeHour, setFormRunTimeHour] = useState(3);
  const [formQuestionsPerRun, setFormQuestionsPerRun] = useState(25);
  const [formRationaleMinWords, setFormRationaleMinWords] = useState(250);
  const [formAutoIngest, setFormAutoIngest] = useState(false);
  const [formMaxDailyRuns, setFormMaxDailyRuns] = useState(1);

  const { data: schedules, isLoading } = useQuery({
    queryKey: ["/api/admin/qbank/schedules"],
    queryFn: () => adminFetch("/api/admin/qbank/schedules").then(r => r.json()),
  });

  const { data: calendarData } = useQuery({
    queryKey: ["/api/admin/qbank/schedules/calendar"],
    queryFn: () => adminFetch("/api/admin/qbank/schedules/calendar").then(r => r.json()),
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const res = await adminFetch("/api/admin/qbank/schedules", {
        method: "POST",
        body: {
          name: formName,
          templateKey: formTemplateKey,
          variantKey: formVariantKey,
          examKey: formExamKey,
          region: formRegion,
          questionsPerRun: formQuestionsPerRun,
          rationaleMinWords: formRationaleMinWords,
          frequency: formFrequency,
          customCronDays: formFrequency === "custom" ? formCustomDays : undefined,
          runTimeHour: formRunTimeHour,
          enabled: false,
          autoIngest: formAutoIngest,
          maxDailyRuns: formMaxDailyRuns,
        },
      });
      if (!res.ok) throw new Error("Failed to create schedule");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/qbank/schedules"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/qbank/schedules/calendar"] });
      resetForm();
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, enabled }: { id: string; enabled: boolean }) => {
      const res = await adminFetch(`/api/admin/qbank/schedules/${id}/toggle`, {
        method: "PUT",
        body: { enabled },
      });
      if (!res.ok) throw new Error("Toggle failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/qbank/schedules"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/qbank/schedules/calendar"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await adminFetch(`/api/admin/qbank/schedules/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/qbank/schedules"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/qbank/schedules/calendar"] });
    },
  });

  function resetForm() {
    setShowAddForm(false);
    setEditingId(null);
    setFormName("");
    setFormTemplateKey("");
    setFormVariantKey("");
    setFormExamKey("");
    setFormRegion("Canada");
    setFormFrequency("daily");
    setFormCustomDays([]);
    setFormRunTimeHour(3);
    setFormQuestionsPerRun(25);
    setFormRationaleMinWords(250);
    setFormAutoIngest(false);
    setFormMaxDailyRuns(1);
  }

  const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const scheduleItems = Array.isArray(schedules) ? schedules : schedules?.schedules || [];
  const calendarItems = Array.isArray(calendarData) ? calendarData : calendarData?.items || [];

  const EXAM_COLOR_MAP: Record<string, string> = {
    "REx-PN": "bg-blue-100 text-blue-800",
    "NCLEX-PN": "bg-indigo-100 text-indigo-800",
    "NCLEX-RN": "bg-purple-100 text-purple-800",
    "CNPE": "bg-red-100 text-red-800",
    "AANP-FNP": "bg-green-100 text-green-800",
    "ANCC-FNP": "bg-teal-100 text-teal-800",
    "AGNP": "bg-orange-100 text-orange-800",
    "PMHNP": "bg-pink-100 text-pink-800",
    "MLT": "bg-amber-100 text-amber-800",
    "Paramedic": "bg-cyan-100 text-cyan-800",
  };

  const next30Days = useMemo(() => {
    const days: { date: string; label: string; items: any[] }[] = [];
    const now = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split("T")[0];
      const matching = calendarItems.filter((c: any) => c.date === dateStr);
      days.push({
        date: dateStr,
        label: d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" }),
        items: matching,
      });
    }
    return days;
  }, [calendarItems]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{t("pages.adminNgnGenerator.generationSchedules")}</h3>
        <Button onClick={() => setShowAddForm(!showAddForm)} data-testid="button-add-schedule">
          <Plus className="h-4 w-4 mr-1" /> Add Schedule
        </Button>
      </div>

      {showAddForm && (
        <Card data-testid="card-schedule-form">
          <CardHeader>
            <CardTitle className="text-base">{editingId ? "Edit Schedule" : "New Schedule"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm mb-1 block">{t("pages.adminNgnGenerator.name")}</Label>
                <Input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder={t("pages.adminNgnGenerator.dailyRexpnQuestions")} data-testid="input-schedule-name" />
              </div>
              <div>
                <Label className="text-sm mb-1 block">{t("pages.adminNgnGenerator.templateKey")}</Label>
                <Select value={formTemplateKey} onValueChange={setFormTemplateKey}>
                  <SelectTrigger data-testid="select-schedule-template">
                    <SelectValue placeholder={t("pages.adminNgnGenerator.selectTemplate")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ngn_batch_v1">{t("pages.adminNgnGenerator.ngnNursing2")}</SelectItem>
                    <SelectItem value="allied_batch_v1">{t("pages.adminNgnGenerator.alliedHealth2")}</SelectItem>
                    <SelectItem value="cnpe_v1">{t("pages.adminNgnGenerator.canadianNp2")}</SelectItem>
                    <SelectItem value="np_us_v1">{t("pages.adminNgnGenerator.usNp2")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm mb-1 block">{t("pages.adminNgnGenerator.variantKey")}</Label>
                <Input value={formVariantKey} onChange={(e) => setFormVariantKey(e.target.value)} placeholder="rexpn_can" data-testid="input-schedule-variant" />
              </div>
              <div>
                <Label className="text-sm mb-1 block">{t("pages.adminNgnGenerator.examKey")}</Label>
                <Input value={formExamKey} onChange={(e) => setFormExamKey(e.target.value)} placeholder={t("pages.adminNgnGenerator.rexpn")} data-testid="input-schedule-exam" />
              </div>
              <div>
                <Label className="text-sm mb-1 block">{t("pages.adminNgnGenerator.region")}</Label>
                <Select value={formRegion} onValueChange={setFormRegion}>
                  <SelectTrigger data-testid="select-schedule-region">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Canada">{t("pages.adminNgnGenerator.canada")}</SelectItem>
                    <SelectItem value="US">US</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm mb-1 block">{t("pages.adminNgnGenerator.frequency")}</Label>
                <Select value={formFrequency} onValueChange={setFormFrequency}>
                  <SelectTrigger data-testid="select-schedule-frequency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">{t("pages.adminNgnGenerator.daily")}</SelectItem>
                    <SelectItem value="weekly">{t("pages.adminNgnGenerator.weekly")}</SelectItem>
                    <SelectItem value="custom">{t("pages.adminNgnGenerator.custom")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formFrequency === "custom" && (
                <div className="col-span-full">
                  <Label className="text-sm mb-1 block">{t("pages.adminNgnGenerator.customDays")}</Label>
                  <div className="flex gap-2">
                    {DAY_NAMES.map((day, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setFormCustomDays(prev =>
                            prev.includes(i) ? prev.filter(d => d !== i) : [...prev, i]
                          );
                        }}
                        className={`px-3 py-1.5 text-xs rounded-md border ${
                          formCustomDays.includes(i)
                            ? "bg-blue-100 border-blue-300 text-blue-800"
                            : "bg-white border-gray-200 text-gray-600"
                        }`}
                        data-testid={`button-day-${i}`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <Label className="text-sm mb-1 block">{t("pages.adminNgnGenerator.runTimeUtcHour")}</Label>
                <Input
                  type="number"
                  value={formRunTimeHour}
                  onChange={(e) => setFormRunTimeHour(Math.max(0, Math.min(23, parseInt(e.target.value) || 0)))}
                  min={0}
                  max={23}
                  data-testid="input-schedule-hour"
                />
              </div>
              <div>
                <Label className="text-sm mb-1 block">{t("pages.adminNgnGenerator.questionsPerRun")}</Label>
                <Input
                  type="number"
                  value={formQuestionsPerRun}
                  onChange={(e) => setFormQuestionsPerRun(Math.max(10, Math.min(100, parseInt(e.target.value) || 25)))}
                  min={10}
                  max={100}
                  data-testid="input-schedule-count"
                />
              </div>
              <div>
                <Label className="text-sm mb-1 block">{t("pages.adminNgnGenerator.rationaleMinWords")}</Label>
                <Input
                  type="number"
                  value={formRationaleMinWords}
                  onChange={(e) => setFormRationaleMinWords(Math.max(250, Math.min(600, parseInt(e.target.value) || 250)))}
                  min={250}
                  max={600}
                  data-testid="input-schedule-rationale"
                />
              </div>
              <div>
                <Label className="text-sm mb-1 block">{t("pages.adminNgnGenerator.maxDailyRuns")}</Label>
                <Input
                  type="number"
                  value={formMaxDailyRuns}
                  onChange={(e) => setFormMaxDailyRuns(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                  min={1}
                  max={10}
                  data-testid="input-schedule-max-runs"
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={formAutoIngest} onCheckedChange={setFormAutoIngest} data-testid="switch-schedule-auto-ingest" />
                <Label className="text-sm">{t("pages.adminNgnGenerator.autoingest")}</Label>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => createMutation.mutate()}
                disabled={createMutation.isPending || !formName || !formTemplateKey || !formVariantKey}
                data-testid="button-save-schedule"
              >
                {createMutation.isPending ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                {editingId ? "Update Schedule" : "Create Schedule"}
              </Button>
              <Button variant="outline" onClick={resetForm} data-testid="button-cancel-schedule">
                Cancel
              </Button>
            </div>
            {createMutation.isError && (
              <div className="text-sm text-red-600">{(createMutation.error as Error).message}</div>
            )}
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="flex items-center gap-2 py-8"><Loader2 className="animate-spin" /> {t("pages.adminNgnGenerator.loadingSchedules")}</div>
      ) : scheduleItems.length === 0 ? (
        <p className="text-muted-foreground py-8 text-center">{t("pages.adminNgnGenerator.noSchedulesConfigured")}</p>
      ) : (
        <div className="space-y-2">
          {scheduleItems.map((s: any) => (
            <Card key={s.id} data-testid={`card-schedule-${s.id}`}>
              <CardContent className="py-3 px-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <Switch
                    checked={s.enabled}
                    onCheckedChange={(checked) => toggleMutation.mutate({ id: s.id, enabled: checked })}
                    data-testid={`switch-schedule-${s.id}`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm">{s.name}</span>
                      <Badge variant="outline" className="text-xs">{s.examKey}</Badge>
                      <Badge variant="outline" className="text-xs">{s.frequency}</Badge>
                      {s.enabled ? (
                        <Badge className="bg-green-100 text-green-800 text-xs">{t("pages.adminNgnGenerator.active")}</Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800 text-xs">{t("pages.adminNgnGenerator.disabled")}</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                      <span>Next: {s.nextRunAt ? new Date(s.nextRunAt).toLocaleString() : "Not scheduled"}</span>
                      <span>{s.questionsPerRun} Qs/run</span>
                      <span>{s.autoIngest ? "Auto-ingest ON" : "Manual ingest"}</span>
                      <span>{s.totalQuestionsGenerated || 0} total generated</span>
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-500"
                      onClick={() => deleteMutation.mutate(s.id)}
                      disabled={deleteMutation.isPending}
                      data-testid={`button-delete-schedule-${s.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card data-testid="card-calendar-view">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" /> 30-Day Schedule Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 md:grid-cols-7 gap-1">
            {next30Days.map((day) => (
              <div
                key={day.date}
                className={`p-2 border rounded text-xs min-h-[60px] ${
                  day.items.length > 0 ? "border-blue-200 bg-blue-50" : "border-gray-100"
                }`}
                data-testid={`calendar-cell-${day.date}`}
              >
                <div className="text-gray-400 text-[10px] mb-1">{day.label}</div>
                {day.items.map((item: any, i: number) => (
                  <div
                    key={i}
                    className={`text-[10px] px-1 py-0.5 rounded mb-0.5 ${
                      EXAM_COLOR_MAP[item.examKey] || "bg-gray-100 text-gray-700"
                    }`}
                    title={`${item.scheduleName}: ${item.expectedCount} questions`}
                  >
                    {item.examKey?.substring(0, 6)} ({item.expectedCount})
                  </div>
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TemplatesTab() {
  const [expandedTemplate, setExpandedTemplate] = useState<string | null>(null);

  const { data: templates, isLoading } = useQuery({
    queryKey: ["/api/admin/qbank/prompt-templates"],
    queryFn: () => adminFetch("/api/admin/qbank/prompt-templates").then(r => r.json()),
  });

  const items = Array.isArray(templates) ? templates : [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{t("pages.adminNgnGenerator.promptTemplatesReadonly")}</h3>
        <span className="text-xs text-gray-500">{t("pages.adminNgnGenerator.templatesAreCodemanaged")}</span>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 py-8"><Loader2 className="animate-spin" /> {t("pages.adminNgnGenerator.loadingTemplates")}</div>
      ) : items.length === 0 ? (
        <p className="text-muted-foreground py-8 text-center">{t("pages.adminNgnGenerator.noTemplatesFound")}</p>
      ) : (
        <div className="space-y-2">
          {items.map((t: any) => (
            <Card key={t.key || t.id} data-testid={`card-template-${t.key}`}>
              <CardContent className="py-3 px-4">
                <div
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => setExpandedTemplate(expandedTemplate === t.key ? null : t.key)}
                  data-testid={`row-template-${t.key}`}
                >
                  {expandedTemplate === t.key ? (
                    <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-400 shrink-0" />
                  )}
                  <div className="flex items-center gap-2 flex-1 flex-wrap">
                    <span className="font-medium text-sm">{t.name}</span>
                    <Badge variant="outline" className="text-xs">{t.key}</Badge>
                    <Badge variant="outline" className="text-xs">{t.category}</Badge>
                    <Badge variant="outline" className="text-xs">v{t.version || 1}</Badge>
                    <span className="text-xs text-gray-500">
                      {(t.variants || []).length} variant{(t.variants || []).length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  {t.isActive !== false && <Badge className="bg-green-100 text-green-800 text-xs">{t("pages.adminNgnGenerator.active2")}</Badge>}
                </div>

                {expandedTemplate === t.key && (
                  <div className="mt-3 pt-3 border-t border-gray-100 space-y-3">
                    <div>
                      <h5 className="text-xs font-medium text-gray-600 mb-1">{t("pages.adminNgnGenerator.variants")}</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {(t.variants || []).map((v: any) => (
                          <div key={v.variantKey} className="p-2 bg-gray-50 rounded text-xs space-y-1" data-testid={`variant-${v.variantKey}`}>
                            <div className="font-medium">{v.examKey} ({v.region})</div>
                            <div className="text-gray-500">Key: {v.variantKey}</div>
                            <div className="text-gray-500">Default count: {v.defaultCount}</div>
                            {v.domainWeights && Object.keys(v.domainWeights).length > 0 && (
                              <div className="text-gray-500">
                                Domains: {Object.keys(v.domainWeights).length}
                              </div>
                            )}
                            {v.formatRules?.allowed && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {v.formatRules.allowed.map((f: string) => (
                                  <span key={f} className="bg-white px-1 py-0.5 rounded text-[10px] border">{f}</span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    {t.validationRules && (
                      <div>
                        <h5 className="text-xs font-medium text-gray-600 mb-1">{t("pages.adminNgnGenerator.validationRules")}</h5>
                        <div className="text-xs text-gray-500 space-y-0.5">
                          <div>Rationale min words: {t.validationRules.rationaleMinWords}</div>
                          <div>Domain tolerance: +-{((t.validationRules.domainTolerance || 0.03) * 100).toFixed(0)}%</div>
                          <div>Scope checks: {(t.validationRules.scopeChecks || []).join(", ")}</div>
                        </div>
                      </div>
                    )}
                    {t.metadata && (
                      <div>
                        <h5 className="text-xs font-medium text-gray-600 mb-1">{t("pages.adminNgnGenerator.metadata")}</h5>
                        <pre className="text-xs text-gray-500 bg-gray-50 p-2 rounded overflow-x-auto">
                          {JSON.stringify(t.metadata, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminNgnGenerator() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin">
            <Button variant="ghost" size="sm" data-testid="button-back-admin">
              <ArrowLeft className="h-4 w-4 mr-1" /> Admin
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2" data-testid="text-ngn-generator-title">
              <Settings className="h-6 w-6" /> NGN Question Generator
            </h1>
            <p className="text-sm text-muted-foreground">{t("pages.adminNgnGenerator.batchGenerationWithBlueprintValidation")}</p>
          </div>
        </div>

        <Tabs defaultValue="generate">
          <TabsList className="mb-4" data-testid="tabs-ngn-generator">
            <TabsTrigger value="generate" data-testid="tab-generate">{t("pages.adminNgnGenerator.generate")}</TabsTrigger>
            <TabsTrigger value="history" data-testid="tab-run-history">{t("pages.adminNgnGenerator.runHistory")}</TabsTrigger>
            <TabsTrigger value="schedules" data-testid="tab-schedules">{t("pages.adminNgnGenerator.schedules")}</TabsTrigger>
            <TabsTrigger value="templates" data-testid="tab-templates">{t("pages.adminNgnGenerator.templates")}</TabsTrigger>
          </TabsList>

          <TabsContent value="generate"><GenerateTab /></TabsContent>
          <TabsContent value="history"><RunHistoryTab /></TabsContent>
          <TabsContent value="schedules"><SchedulesTab /></TabsContent>
          <TabsContent value="templates"><TemplatesTab /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}