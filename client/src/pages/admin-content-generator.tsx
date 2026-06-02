import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useI18n } from "@/lib/i18n";
import {
  HelpCircle,
  Layers,
  BookOpen,
  FileText,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Activity,
} from "lucide-react";

interface TierOption {
  id: string;
  label: string;
  group: string;
  examCode: string;
}

interface GeneratorConfig {
  tiers: {
    nursing: { id: string; label: string }[];
    npSpecialties: { id: string; label: string }[];
    alliedHealth: { id: string; label: string; slug: string }[];
    certificationPrep: { id: string; label: string }[];
  };
  contentTypes: { id: string; label: string; icon: string }[];
  blogTemplates: {
    allied_health: { id: string; label: string }[];
    new_grad: { id: string; label: string }[];
  };
  defaults: {
    batchSize: { default: number; max: number };
    dailyCaps: Record<string, number>;
  };
  allTiers: TierOption[];
}

interface RunLog {
  id: string;
  topic: string;
  tier: string;
  contentType: string;
  batchSize: number;
  generatedCount: number;
  validatedCount: number;
  insertedCount: number;
  rejectedCount: number;
  duplicatesSkipped: number;
  errors: string[];
  status: string;
  startedAt: string;
  completedAt: string | null;
}

const CONTENT_TYPE_ICONS: Record<string, React.ReactNode> = {
  questions: <HelpCircle className="h-4 w-4" />,
  flashcards: <Layers className="h-4 w-4" />,
  lessons: <BookOpen className="h-4 w-4" />,
  blog_articles: <FileText className="h-4 w-4" />,
};

export default function AdminContentGenerator() {
  const { t } = useI18n();
  const [selectedTierGroup, setSelectedTierGroup] = useState<string>("nursing");
  const [selectedTier, setSelectedTier] = useState<string>("");
  const [selectedContentType, setSelectedContentType] = useState<string>("questions");
  const [topic, setTopic] = useState<string>("");
  const [batchSize, setBatchSize] = useState<number>(5);
  const [template, setTemplate] = useState<string>("");
  const [targetKeyword, setTargetKeyword] = useState<string>("");
  const [bodySystem, setBodySystem] = useState<string>("Multi-system");
  const [region, setRegion] = useState<string>("CA");
  const [generationResult, setGenerationResult] = useState<any>(null);

  const { data: config, isLoading: configLoading } = useQuery<GeneratorConfig>({
    queryKey: ["/api/admin/universal-generator/config"],
  });

  const { data: logsData, refetch: refetchLogs } = useQuery<{ logs: RunLog[] }>({
    queryKey: ["/api/admin/universal-generator/logs"],
    refetchInterval: 10000,
  });

  const { data: dailyData, refetch: refetchDaily } = useQuery<{ counts: any[]; defaults: any }>({
    queryKey: ["/api/admin/universal-generator/daily-counts"],
    refetchInterval: 30000,
  });

  const generateMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await fetch("/api/admin/universal-generator/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: (data) => {
      setGenerationResult(data);
      refetchLogs();
      refetchDaily();
    },
  });

  const tierOptions = (() => {
    if (!config) return [];
    switch (selectedTierGroup) {
      case "nursing": return config.tiers.nursing;
      case "np_specialty": return config.tiers.npSpecialties;
      case "allied_health": return config.tiers.alliedHealth;
      case "certification_prep": return config.tiers.certificationPrep;
      default: return [];
    }
  })();

  useEffect(() => {
    if (tierOptions.length > 0 && !tierOptions.find((t: any) => t.id === selectedTier)) {
      setSelectedTier(tierOptions[0].id);
    }
    setTemplate("");
  }, [selectedTierGroup, tierOptions]);

  const blogTemplates = (() => {
    if (!config) return [];
    if (selectedTierGroup === "allied_health") return config.blogTemplates.allied_health;
    return config.blogTemplates.new_grad;
  })();

  useEffect(() => {
    if (selectedContentType === "blog_articles" && blogTemplates.length > 0 && !template) {
      setTemplate(blogTemplates[0].id);
    }
  }, [selectedContentType, blogTemplates]);

  const handleGenerate = () => {
    if (!topic.trim() || !selectedTier) return;

    generateMutation.mutate({
      contentType: selectedContentType,
      tier: selectedTier,
      topic: topic.trim(),
      batchSize,
      template,
      targetKeyword: targetKeyword || undefined,
      bodySystem: bodySystem || undefined,
      region,
    });
  };

  const logs = logsData?.logs || [];

  if (configLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <RefreshCw className="h-8 w-8 animate-spin text-[#BFA6F6]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto" data-testid="admin-content-generator">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#2E3A59]" data-testid="text-page-title">
            Universal Content Generator
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Generate questions, flashcards, lessons, and blog articles across all tiers
          </p>
        </div>
        <Badge variant="outline" className="border-[#BFA6F6] text-[#BFA6F6]">
          Batch: {config?.defaults.batchSize.default}-{config?.defaults.batchSize.max}
        </Badge>
      </div>

      <Tabs defaultValue="generate" className="space-y-4">
        <TabsList data-testid="tabs-list">
          <TabsTrigger value="generate" data-testid="tab-generate">{t("pages.adminContentGenerator.generate")}</TabsTrigger>
          <TabsTrigger value="logs" data-testid="tab-logs">{t("pages.adminContentGenerator.runLogs")}</TabsTrigger>
          <TabsTrigger value="caps" data-testid="tab-caps">{t("pages.adminContentGenerator.dailyCaps")}</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{t("pages.adminContentGenerator.configuration")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>{t("pages.adminContentGenerator.tierGroup")}</Label>
                  <Select value={selectedTierGroup} onValueChange={setSelectedTierGroup} data-testid="select-tier-group">
                    <SelectTrigger data-testid="select-tier-group-trigger">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nursing">{t("pages.adminContentGenerator.nursing")}</SelectItem>
                      <SelectItem value="np_specialty">{t("pages.adminContentGenerator.npSpecialties")}</SelectItem>
                      <SelectItem value="allied_health">{t("pages.adminContentGenerator.alliedHealth")}</SelectItem>
                      <SelectItem value="certification_prep">{t("pages.adminContentGenerator.certificationPrep")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{t("pages.adminContentGenerator.tierProfession")}</Label>
                  <Select value={selectedTier} onValueChange={setSelectedTier} data-testid="select-tier">
                    <SelectTrigger data-testid="select-tier-trigger">
                      <SelectValue placeholder={t("pages.adminContentGenerator.selectTier")} />
                    </SelectTrigger>
                    <SelectContent>
                      {tierOptions.map((t: any) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{t("pages.adminContentGenerator.contentType")}</Label>
                  <Select value={selectedContentType} onValueChange={setSelectedContentType} data-testid="select-content-type">
                    <SelectTrigger data-testid="select-content-type-trigger">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {config?.contentTypes.map((ct) => (
                        <SelectItem key={ct.id} value={ct.id}>
                          <span className="flex items-center gap-2">
                            {CONTENT_TYPE_ICONS[ct.id]}
                            {ct.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{t("pages.adminContentGenerator.topic")}</Label>
                  <Input
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., Heart Failure Management"
                    data-testid="input-topic"
                  />
                </div>

                {(selectedContentType === "questions" || selectedContentType === "flashcards") && (
                  <div className="space-y-2">
                    <Label>Batch Size (max {config?.defaults.batchSize.max})</Label>
                    <Input
                      type="number"
                      value={batchSize}
                      onChange={(e) => setBatchSize(Math.min(parseInt(e.target.value) || 5, config?.defaults.batchSize.max || 10))}
                      min={1}
                      max={config?.defaults.batchSize.max || 10}
                      data-testid="input-batch-size"
                    />
                  </div>
                )}

                {selectedContentType === "blog_articles" && (
                  <>
                    <div className="space-y-2">
                      <Label>{t("pages.adminContentGenerator.articleTemplate")}</Label>
                      <Select value={template} onValueChange={setTemplate} data-testid="select-template">
                        <SelectTrigger data-testid="select-template-trigger">
                          <SelectValue placeholder={t("pages.adminContentGenerator.selectTemplate")} />
                        </SelectTrigger>
                        <SelectContent>
                          {blogTemplates.map((t: any) => (
                            <SelectItem key={t.id} value={t.id}>
                              {t.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>{t("pages.adminContentGenerator.targetSeoKeywordOptional")}</Label>
                      <Input
                        value={targetKeyword}
                        onChange={(e) => setTargetKeyword(e.target.value)}
                        placeholder="e.g., respiratory therapy career guide"
                        data-testid="input-keyword"
                      />
                    </div>
                  </>
                )}

                {selectedContentType === "lessons" && (
                  <div className="space-y-2">
                    <Label>{t("pages.adminContentGenerator.bodySystem")}</Label>
                    <Select value={bodySystem} onValueChange={setBodySystem} data-testid="select-body-system">
                      <SelectTrigger data-testid="select-body-system-trigger">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["Multi-system", "Cardiac", "Respiratory", "Neuro", "Renal", "Endocrine", "GI", "Hematology", "Immune", "Integumentary", "MSK", "Reproductive"].map((sys) => (
                          <SelectItem key={sys} value={sys}>{sys}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {selectedContentType === "questions" && (
                  <div className="space-y-2">
                    <Label>{t("pages.adminContentGenerator.region")}</Label>
                    <Select value={region} onValueChange={setRegion} data-testid="select-region">
                      <SelectTrigger data-testid="select-region-trigger">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CA">{t("pages.adminContentGenerator.canadaSiUnits")}</SelectItem>
                        <SelectItem value="US">{t("pages.adminContentGenerator.unitedStatesConventional")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <Button
                  onClick={handleGenerate}
                  disabled={generateMutation.isPending || !topic.trim() || !selectedTier}
                  className="w-full bg-[#BFA6F6] hover:bg-[#A78BFA] text-white"
                  data-testid="button-generate"
                >
                  {generateMutation.isPending ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Generating...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      Generate Content
                    </span>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{t("pages.adminContentGenerator.resultPreview")}</CardTitle>
              </CardHeader>
              <CardContent>
                {generateMutation.isPending && (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                    <RefreshCw className="h-12 w-12 animate-spin mb-4 text-[#BFA6F6]" />
                    <p>{t("pages.adminContentGenerator.generatingContent")}</p>
                    <p className="text-xs mt-1">{t("pages.adminContentGenerator.thisMayTake1530Seconds")}</p>
                  </div>
                )}

                {generateMutation.isError && (
                  <div className="p-4 bg-red-50 rounded-lg" data-testid="text-generation-error">
                    <div className="flex items-center gap-2 text-red-700 mb-2">
                      <XCircle className="h-4 w-4" />
                      <span className="font-medium">{t("pages.adminContentGenerator.generationFailed")}</span>
                    </div>
                    <p className="text-sm text-red-600">{(generateMutation.error as Error).message}</p>
                  </div>
                )}

                {generationResult && !generateMutation.isPending && (
                  <div className="space-y-3" data-testid="text-generation-result">
                    <div className="flex items-center gap-2">
                      {generationResult.success ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      <span className="font-medium">
                        {generationResult.success ? "Generation Successful" : "Generation Had Issues"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-gray-50 rounded p-2">
                        <span className="text-gray-500">{t("pages.adminContentGenerator.type")}</span>{" "}
                        <span className="font-medium">{generationResult.contentType}</span>
                      </div>
                      <div className="bg-gray-50 rounded p-2">
                        <span className="text-gray-500">{t("pages.adminContentGenerator.tier")}</span>{" "}
                        <span className="font-medium">{generationResult.tier}</span>
                      </div>
                      {generationResult.itemCount !== undefined && (
                        <div className="bg-gray-50 rounded p-2">
                          <span className="text-gray-500">{t("pages.adminContentGenerator.items")}</span>{" "}
                          <span className="font-medium">{generationResult.itemCount}</span>
                        </div>
                      )}
                      {generationResult.batchSize && (
                        <div className="bg-gray-50 rounded p-2">
                          <span className="text-gray-500">{t("pages.adminContentGenerator.batch")}</span>{" "}
                          <span className="font-medium">{generationResult.batchSize}</span>
                        </div>
                      )}
                    </div>

                    {generationResult.errors?.length > 0 && (
                      <div className="bg-yellow-50 rounded p-3">
                        <div className="flex items-center gap-1 text-yellow-700 mb-1">
                          <AlertTriangle className="h-4 w-4" />
                          <span className="text-sm font-medium">Warnings ({generationResult.errors.length})</span>
                        </div>
                        <ul className="text-xs text-yellow-600 space-y-1">
                          {generationResult.errors.slice(0, 5).map((e: string, i: number) => (
                            <li key={i}>- {e}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {generationResult.items && generationResult.items.length > 0 && (
                      <div className="border rounded p-3 max-h-[300px] overflow-y-auto">
                        <p className="text-xs text-gray-500 mb-2">{t("pages.adminContentGenerator.previewFirstItem")}</p>
                        <pre className="text-xs bg-gray-50 p-2 rounded whitespace-pre-wrap">
                          {JSON.stringify(generationResult.items[0], null, 2).substring(0, 500)}
                        </pre>
                      </div>
                    )}

                    {generationResult.lesson && (
                      <div className="border rounded p-3 max-h-[300px] overflow-y-auto">
                        <p className="text-xs text-gray-500 mb-2">Lesson: {generationResult.lesson.title}</p>
                        <p className="text-sm">{generationResult.lesson.summary}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {generationResult.lesson.sections?.length || 0} sections
                        </p>
                      </div>
                    )}

                    {generationResult.article && (
                      <div className="border rounded p-3 max-h-[300px] overflow-y-auto">
                        <p className="text-xs text-gray-500 mb-2">Article: {generationResult.article.title}</p>
                        <p className="text-sm">{generationResult.article.summary}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {generationResult.article.wordCount || 0} words | Slug: {generationResult.article.slug}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {!generationResult && !generateMutation.isPending && !generateMutation.isError && (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-300">
                    <Activity className="h-12 w-12 mb-4" />
                    <p className="text-gray-400">{t("pages.adminContentGenerator.configureAndGenerateToSee")}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-lg">{t("pages.adminContentGenerator.generationRunLogs")}</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetchLogs()}
                data-testid="button-refresh-logs"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh
              </Button>
            </CardHeader>
            <CardContent>
              {logs.length === 0 ? (
                <p className="text-gray-400 text-center py-8" data-testid="text-no-logs">{t("pages.adminContentGenerator.noGenerationRunsYet")}</p>
              ) : (
                <div className="space-y-2" data-testid="list-run-logs">
                  {logs.map((log) => (
                    <div
                      key={log.id}
                      className="border rounded-lg p-3 flex flex-col md:flex-row md:items-center gap-2 md:gap-4"
                      data-testid={`log-entry-${log.id}`}
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        {log.status === "completed" && <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />}
                        {log.status === "failed" && <XCircle className="h-4 w-4 text-red-500 shrink-0" />}
                        {log.status === "running" && <RefreshCw className="h-4 w-4 text-blue-500 animate-spin shrink-0" />}
                        <span className="font-medium truncate text-sm">{log.topic}</span>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        <Badge variant="outline" className="text-xs">
                          {CONTENT_TYPE_ICONS[log.contentType]}
                          <span className="ml-1">{log.contentType}</span>
                        </Badge>
                        <Badge variant="secondary" className="text-xs">{log.tier}</Badge>
                      </div>

                      <div className="flex gap-3 text-xs text-gray-500">
                        <span>Gen: {log.generatedCount}</span>
                        <span>Val: {log.validatedCount}</span>
                        <span>In: {log.insertedCount}</span>
                        {log.rejectedCount > 0 && (
                          <span className="text-red-500">Rej: {log.rejectedCount}</span>
                        )}
                        {log.duplicatesSkipped > 0 && (
                          <span className="text-yellow-500">Dup: {log.duplicatesSkipped}</span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 text-xs text-gray-400 shrink-0">
                        <Clock className="h-3 w-3" />
                        {new Date(log.startedAt).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="caps" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{t("pages.adminContentGenerator.dailyGenerationCaps")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4" data-testid="grid-daily-caps">
                {Object.entries(dailyData?.defaults?.dailyCaps || {}).map(([type, cap]) => {
                  const current = dailyData?.counts?.filter((c: any) => c.contentType === type)
                    .reduce((sum: number, c: any) => sum + (c.count || 0), 0) || 0;
                  const pct = cap ? Math.round((current / Number(cap)) * 100) : 0;

                  return (
                    <div key={type} className="bg-gray-50 rounded-lg p-4" data-testid={`cap-${type}`}>
                      <div className="flex items-center gap-2 mb-2">
                        {CONTENT_TYPE_ICONS[type]}
                        <span className="font-medium text-sm capitalize">{type.replace("_", " ")}</span>
                      </div>
                      <div className="text-2xl font-bold text-[#2E3A59]">
                        {current} <span className="text-sm font-normal text-gray-400">/ {String(cap)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="h-2 rounded-full transition-all"
                          style={{
                            width: `${Math.min(pct, 100)}%`,
                            backgroundColor: pct >= 90 ? "#EF4444" : pct >= 70 ? "#F59E0B" : "#BFA6F6",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
