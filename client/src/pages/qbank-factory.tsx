import { useState, useEffect, useCallback } from "react";
import { Navigation } from "@/components/navigation";
import { SEO } from "@/components/seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { adminFetch, getAdminParams } from "@/lib/admin-fetch";
import { useLocation } from "wouter";
import { useI18n } from "@/lib/i18n";
import {
  Plus,
  Trash2,
  RefreshCw,
  Download,
  Eye,
  Upload,
  CheckCircle2,
  XCircle,
  FileText,
  Settings,
  BarChart3,
  ShoppingCart,
  Layers,
  AlertTriangle,
} from "lucide-react";

const CLINICAL_TOPICS = [
  "Cardiovascular",
  "Respiratory",
  "Neurological",
  "Endocrine",
  "Renal",
  "Gastrointestinal",
  "Mental Health",
  "Maternal/Child",
  "Med-Surg",
  "Geriatrics/LTC",
  "Infection Control",
  "Pharmacology",
  "Ethics/Legal",
  "Community/Home Care",
];

const TOPIC_PRESETS: Record<string, { topic: string; weight: number }[]> = {
  "Mixed Blueprint": [
    { topic: "Cardiovascular", weight: 10 },
    { topic: "Respiratory", weight: 8 },
    { topic: "Neurological", weight: 8 },
    { topic: "Endocrine", weight: 6 },
    { topic: "Renal", weight: 6 },
    { topic: "Gastrointestinal", weight: 6 },
    { topic: "Mental Health", weight: 8 },
    { topic: "Maternal/Child", weight: 8 },
    { topic: "Med-Surg", weight: 10 },
    { topic: "Geriatrics/LTC", weight: 6 },
    { topic: "Infection Control", weight: 6 },
    { topic: "Pharmacology", weight: 8 },
    { topic: "Ethics/Legal", weight: 5 },
    { topic: "Community/Home Care", weight: 5 },
  ],
  "Med-Surg Heavy": [
    { topic: "Med-Surg", weight: 25 },
    { topic: "Cardiovascular", weight: 12 },
    { topic: "Respiratory", weight: 10 },
    { topic: "Neurological", weight: 8 },
    { topic: "Gastrointestinal", weight: 8 },
    { topic: "Renal", weight: 7 },
    { topic: "Endocrine", weight: 6 },
    { topic: "Pharmacology", weight: 8 },
    { topic: "Infection Control", weight: 6 },
    { topic: "Mental Health", weight: 5 },
    { topic: "Ethics/Legal", weight: 5 },
  ],
  "LTC/Community Heavy": [
    { topic: "Geriatrics/LTC", weight: 25 },
    { topic: "Community/Home Care", weight: 20 },
    { topic: "Mental Health", weight: 10 },
    { topic: "Med-Surg", weight: 10 },
    { topic: "Pharmacology", weight: 8 },
    { topic: "Ethics/Legal", weight: 7 },
    { topic: "Infection Control", weight: 7 },
    { topic: "Cardiovascular", weight: 5 },
    { topic: "Respiratory", weight: 4 },
    { topic: "Neurological", weight: 4 },
  ],
  "Mental Health Focus": [
    { topic: "Mental Health", weight: 30 },
    { topic: "Pharmacology", weight: 12 },
    { topic: "Ethics/Legal", weight: 10 },
    { topic: "Community/Home Care", weight: 10 },
    { topic: "Med-Surg", weight: 8 },
    { topic: "Geriatrics/LTC", weight: 8 },
    { topic: "Neurological", weight: 7 },
    { topic: "Maternal/Child", weight: 5 },
    { topic: "Cardiovascular", weight: 5 },
    { topic: "Infection Control", weight: 5 },
  ],
};

const DISTRIBUTION_PRESETS: Record<string, Record<string, number>> = {
  "Standard Mix": { MCQ: 60, SATA: 20, PRIORITY: 10, DELEGATION: 10 },
  "SATA Heavy": { MCQ: 40, SATA: 35, PRIORITY: 15, DELEGATION: 10 },
  "Priority Focus": { MCQ: 45, SATA: 20, PRIORITY: 25, DELEGATION: 10 },
  "Delegation Focus": { MCQ: 45, SATA: 15, PRIORITY: 15, DELEGATION: 25 },
};

type TopicRow = { topic: string; weight: number };

type Draft = {
  id: string;
  title: string;
  slug: string;
  exam: string;
  topic: string;
  mixedBlueprint: boolean;
  requestedCount: number;
  difficulty: string;
  distributionJson: any;
  canadianContext: boolean;
  editionsJson: any;
  questionsJson: any;
  auditJson: any;
  status: string;
  price: number;
  studyEditionPrice: number;
  createdAt: string;
  updatedAt: string;
};

type AuditData = {
  requestedCount: number;
  generatedCount: number;
  countMatch: boolean;
  byType: Record<string, number>;
  byCategory: Record<string, number>;
  topicDistribution?: { requested: Record<string, number>; actual: Record<string, number> };
  attempts: number;
  validationErrors: string[];
};

export default function QBankFactoryPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const [adminChecked, setAdminChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [activeTab, setActiveTab] = useState<"config" | "listing" | "exam-factory">("config");
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [draftsLoading, setDraftsLoading] = useState(false);
  const [selectedDraftId, setSelectedDraftId] = useState<string | null>(null);

  const [title, setTitle] = useState("REx-PN Practice Questions");
  const [exam, setExam] = useState("rex-pn");
  const [topic, setTopic] = useState("Mixed");
  const [mixedBlueprint, setMixedBlueprint] = useState(true);
  const [requestedCount, setRequestedCount] = useState(300);
  const [difficulty, setDifficulty] = useState("medium");
  const [canadianContext, setCanadianContext] = useState(true);
  const [topicMix, setTopicMix] = useState<TopicRow[]>(TOPIC_PRESETS["Mixed Blueprint"]);
  const [distributionPreset, setDistributionPreset] = useState("Standard Mix");
  const [typeDistribution, setTypeDistribution] = useState(DISTRIBUTION_PRESETS["Standard Mix"]);

  const [questionsOnly, setQuestionsOnly] = useState(true);
  const [studyEdition, setStudyEdition] = useState(false);

  const [generating, setGenerating] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [auditData, setAuditData] = useState<AuditData | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewQuestions, setPreviewQuestions] = useState<any[]>([]);

  const [listingData, setListingData] = useState<any>(null);
  const [listingGenerating, setListingGenerating] = useState(false);
  const [priceBasic, setPriceBasic] = useState(1499);
  const [pricePremium, setPricePremium] = useState(2499);
  const [priceBundle, setPriceBundle] = useState(3499);
  const [editionVariant, setEditionVariant] = useState<"questions-only" | "study" | "bundle">("questions-only");

  const [examLength, setExamLength] = useState(90);
  const [formCount, setFormCount] = useState(1);
  const [includeRationales, setIncludeRationales] = useState(false);
  const [formsChecked, setFormsChecked] = useState({ A: true, B: false, C: false });
  const [examDifficultyTarget, setExamDifficultyTarget] = useState("medium");
  const [examTopicMix, setExamTopicMix] = useState<TopicRow[]>(TOPIC_PRESETS["Mixed Blueprint"]);
  const [examGenerating, setExamGenerating] = useState(false);

  useEffect(() => {
    if (!user) return;
    const tier = (user as any)?.tier ?? "";
    const role = (user as any)?.role ?? "";
    const isAdminFlag = (user as any)?.isAdmin;
    if (tier === "admin" || role === "admin" || isAdminFlag === true) {
      setIsAdmin(true);
      setAdminChecked(true);
      return;
    }
    const params = getAdminParams();
    if (!params) {
      setAdminChecked(true);
      return;
    }
    fetch(`/api/admin/dashboard?${params}`)
      .then((r) => {
        setIsAdmin(r.ok);
        setAdminChecked(true);
      })
      .catch(() => setAdminChecked(true));
  }, [user]);

  const loadDrafts = useCallback(async () => {
    setDraftsLoading(true);
    try {
      const res = await adminFetch("/api/admin/qbank-drafts");
      if (res.ok) {
        const data = await res.json();
        setDrafts(Array.isArray(data) ? data : []);
      }
    } catch {
    } finally {
      setDraftsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin && adminChecked) loadDrafts();
  }, [isAdmin, adminChecked, loadDrafts]);

  const totalWeight = topicMix.reduce((s, r) => s + r.weight, 0);
  const topicMixValid = totalWeight === 100;

  const addTopicRow = () => {
    const used = new Set(topicMix.map((r) => r.topic));
    const available = CLINICAL_TOPICS.find((t) => !used.has(t));
    if (available) {
      setTopicMix([...topicMix, { topic: available, weight: 0 }]);
    }
  };

  const removeTopicRow = (idx: number) => {
    setTopicMix(topicMix.filter((_, i) => i !== idx));
  };

  const updateTopicRow = (idx: number, field: "topic" | "weight", value: string | number) => {
    const updated = [...topicMix];
    if (field === "topic") updated[idx] = { ...updated[idx], topic: value as string };
    else updated[idx] = { ...updated[idx], weight: Number(value) };
    setTopicMix(updated);
  };

  const applyTopicPreset = (presetName: string) => {
    const preset = TOPIC_PRESETS[presetName];
    if (preset) setTopicMix([...preset]);
  };

  const applyDistributionPreset = (presetName: string) => {
    setDistributionPreset(presetName);
    const preset = DISTRIBUTION_PRESETS[presetName];
    if (preset) setTypeDistribution({ ...preset });
  };

  const buildDraftPayload = () => ({
    title,
    slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    exam,
    topic,
    mixedBlueprint,
    requestedCount,
    difficulty,
    canadianContext,
    distributionJson: {
      topicMix,
      typeDistribution,
    },
    editionsJson: {
      questionsOnly,
      studyEdition,
    },
    price: priceBasic,
    studyEditionPrice: pricePremium,
  });

  const loadDraftIntoForm = (draft: Draft) => {
    setSelectedDraftId(draft.id);
    setTitle(draft.title);
    setExam(draft.exam);
    setTopic(draft.topic);
    setMixedBlueprint(draft.mixedBlueprint ?? false);
    setRequestedCount(draft.requestedCount);
    setDifficulty(draft.difficulty);
    setCanadianContext(draft.canadianContext ?? true);
    if (draft.distributionJson?.topicMix) {
      setTopicMix(draft.distributionJson.topicMix);
    }
    if (draft.distributionJson?.typeDistribution) {
      setTypeDistribution(draft.distributionJson.typeDistribution);
    }
    if (draft.editionsJson) {
      setQuestionsOnly(draft.editionsJson.questionsOnly ?? true);
      setStudyEdition(draft.editionsJson.studyEdition ?? false);
    }
    setPriceBasic(draft.price ?? 1499);
    setPricePremium(draft.studyEditionPrice ?? 2499);
    if (draft.auditJson) {
      setAuditData(draft.auditJson as AuditData);
    } else {
      setAuditData(null);
    }
    if (draft.questionsJson && Array.isArray(draft.questionsJson)) {
      setPreviewQuestions(draft.questionsJson.slice(0, 10));
    } else {
      setPreviewQuestions([]);
    }
  };

  const saveDraft = async () => {
    setSaving(true);
    try {
      const payload = buildDraftPayload();
      let res;
      if (selectedDraftId) {
        res = await adminFetch(`/api/admin/qbank-drafts/${selectedDraftId}`, {
          method: "PUT",
          body: payload,
        } as any);
      } else {
        res = await adminFetch("/api/admin/qbank-drafts", {
          method: "POST",
          body: payload,
        } as any);
      }
      if (res.ok) {
        const saved = await res.json();
        setSelectedDraftId(saved.id);
        await loadDrafts();
      }
    } catch {
    } finally {
      setSaving(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedDraftId) {
      await saveDraft();
    }
    const draftId = selectedDraftId;
    if (!draftId) return;
    setGenerating(true);
    try {
      const res = await adminFetch(`/api/admin/qbank-drafts/${draftId}/generate`, {
        method: "POST",
        body: {},
      } as any);
      if (res.ok) {
        const data = await res.json();
        if (data.audit) setAuditData(data.audit);
        await loadDrafts();
      }
    } catch {
    } finally {
      setGenerating(false);
    }
  };

  const handleCompleteMissing = async () => {
    if (!selectedDraftId) return;
    setCompleting(true);
    try {
      const res = await adminFetch(`/api/admin/qbank-drafts/${selectedDraftId}/complete-missing`, {
        method: "POST",
        body: {},
      } as any);
      if (res.ok) {
        const data = await res.json();
        if (data.audit) setAuditData(data.audit);
        await loadDrafts();
      }
    } catch {
    } finally {
      setCompleting(false);
    }
  };

  const handlePublish = async () => {
    if (!selectedDraftId) return;
    setPublishing(true);
    try {
      const res = await adminFetch(`/api/admin/qbank-drafts/${selectedDraftId}/publish`, {
        method: "POST",
        body: {},
      } as any);
      if (res.ok) {
        await loadDrafts();
      }
    } catch {
    } finally {
      setPublishing(false);
    }
  };

  const handleExportJson = async () => {
    if (!selectedDraftId) return;
    const res = await adminFetch(`/api/admin/qbank-drafts/${selectedDraftId}`);
    if (res.ok) {
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data.questionsJson || [], null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title.replace(/\s+/g, "-")}-questions.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleExportCsv = async () => {
    if (!selectedDraftId) return;
    const res = await adminFetch(`/api/admin/qbank-drafts/${selectedDraftId}`);
    if (res.ok) {
      const data = await res.json();
      const questions = data.questionsJson || [];
      if (!questions.length) return;
      const headers = ["question", "type", "category", "difficulty", "options", "correctAnswer", "rationale"];
      const rows = questions.map((q: any) => [
        `"${(q.question || "").replace(/"/g, '""')}"`,
        q.type || "",
        q.category || "",
        q.difficulty || "",
        `"${JSON.stringify(q.options || []).replace(/"/g, '""')}"`,
        `"${(q.correctAnswer || "").replace(/"/g, '""')}"`,
        `"${(q.rationale || "").replace(/"/g, '""')}"`,
      ]);
      const csv = [headers.join(","), ...rows.map((r: string[]) => r.join(","))].join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title.replace(/\s+/g, "-")}-questions.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handlePreview = async () => {
    if (!selectedDraftId) return;
    const res = await adminFetch(`/api/admin/qbank-drafts/${selectedDraftId}`);
    if (res.ok) {
      const data = await res.json();
      setPreviewQuestions((data.questionsJson || []).slice(0, 20));
      setPreviewOpen(true);
    }
  };

  const handleGenerateListing = async () => {
    if (!selectedDraftId) return;
    setListingGenerating(true);
    try {
      const res = await adminFetch(`/api/admin/qbank-drafts/${selectedDraftId}/generate-listing`, {
        method: "POST",
        body: {},
      } as any);
      if (res.ok) {
        const data = await res.json();
        setListingData(data);
      }
    } catch {
    } finally {
      setListingGenerating(false);
    }
  };

  const handleGenerateForms = async () => {
    if (!selectedDraftId) return;
    setExamGenerating(true);
    try {
      const res = await adminFetch(`/api/admin/qbank-drafts/${selectedDraftId}/generate-forms`, {
        method: "POST",
        body: {
          formCount,
          formSize: examLength,
          includeRationales,
          forms: Object.entries(formsChecked)
            .filter(([, v]) => v)
            .map(([k]) => k),
          topicMix: examTopicMix,
          difficultyTarget: examDifficultyTarget,
        },
      } as any);
      if (res.ok) {
        await loadDrafts();
      }
    } catch {
    } finally {
      setExamGenerating(false);
    }
  };

  const auditPasses =
    auditData &&
    auditData.countMatch &&
    auditData.validationErrors.length === 0;

  const selectedDraft = drafts.find((d) => d.id === selectedDraftId);

  if (!adminChecked) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <div className="max-w-2xl mx-auto py-20 px-4 text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-4" data-testid="text-access-denied">
            Admin Access Required
          </h1>
          <p className="text-slate-600">{t("pages.qbankFactory.youDoNotHavePermission")}</p>
          <Button
            className="mt-6"
            onClick={() => setLocation("/")}
            data-testid="button-go-home"
          >
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50" data-testid="page-qbank-factory">
      <SEO title={t("pages.qbankFactory.qbankFactoryAdmin")} description={t("pages.qbankFactory.adminQbankFactoryForGenerating")} />
      <Navigation />
      <div className="max-w-[1600px] mx-auto py-6 px-4 flex gap-6">
        <div className="w-72 shrink-0">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">{t("pages.qbankFactory.drafts")}</CardTitle>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedDraftId(null);
                    setTitle("REx-PN Practice Questions");
                    setTopicMix([...TOPIC_PRESETS["Mixed Blueprint"]]);
                    setAuditData(null);
                    setPreviewQuestions([]);
                  }}
                  data-testid="button-new-draft"
                >
                  <Plus className="w-3 h-3 mr-1" /> New
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 max-h-[600px] overflow-y-auto">
              {draftsLoading && <p className="text-xs text-slate-500">{t("pages.qbankFactory.loading")}</p>}
              {drafts.map((draft) => (
                <button
                  key={draft.id}
                  onClick={() => loadDraftIntoForm(draft)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedDraftId === draft.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                  data-testid={`button-draft-${draft.id}`}
                >
                  <div className="text-sm font-medium text-slate-800 truncate">{draft.title}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      variant={
                        draft.status === "published"
                          ? "default"
                          : draft.status === "generating"
                          ? "secondary"
                          : "outline"
                      }
                      className="text-[10px]"
                      data-testid={`badge-status-${draft.id}`}
                    >
                      {draft.status}
                    </Badge>
                    <span className="text-[10px] text-slate-400">
                      {draft.requestedCount}q
                    </span>
                  </div>
                </button>
              ))}
              {!draftsLoading && drafts.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-4">{t("pages.qbankFactory.noDraftsYet")}</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex-1 min-w-0">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            <TabsList className="mb-4">
              <TabsTrigger value="config" data-testid="tab-config">
                <Settings className="w-4 h-4 mr-1" /> Configuration
              </TabsTrigger>
              <TabsTrigger value="listing" data-testid="tab-listing">
                <ShoppingCart className="w-4 h-4 mr-1" /> Listing Builder
              </TabsTrigger>
              <TabsTrigger value="exam-factory" data-testid="tab-exam-factory">
                <Layers className="w-4 h-4 mr-1" /> Exam Factory
              </TabsTrigger>
            </TabsList>

            <TabsContent value="config">
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">{t("pages.qbankFactory.basicConfiguration")}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="title">{t("pages.qbankFactory.title")}</Label>
                          <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            data-testid="input-title"
                          />
                        </div>
                        <div>
                          <Label htmlFor="exam">{t("pages.qbankFactory.exam")}</Label>
                          <select
                            id="exam"
                            value={exam}
                            onChange={(e) => setExam(e.target.value)}
                            className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-sm"
                            data-testid="select-exam"
                          >
                            <option value="rex-pn">{t("pages.qbankFactory.rexpn")}</option>
                            <option value="nclex-rn">{t("pages.qbankFactory.nclexrn")}</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="topic">{t("pages.qbankFactory.topic")}</Label>
                          <Input
                            id="topic"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            data-testid="input-topic"
                          />
                        </div>
                        <div>
                          <Label htmlFor="requestedCount">{t("pages.qbankFactory.requestedCount")}</Label>
                          <Input
                            id="requestedCount"
                            type="number"
                            value={requestedCount}
                            onChange={(e) => setRequestedCount(Number(e.target.value))}
                            data-testid="input-requested-count"
                          />
                        </div>
                        <div>
                          <Label htmlFor="difficulty">{t("pages.qbankFactory.difficulty")}</Label>
                          <select
                            id="difficulty"
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value)}
                            className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-sm"
                            data-testid="select-difficulty"
                          >
                            <option value="easy">{t("pages.qbankFactory.easy")}</option>
                            <option value="medium">{t("pages.qbankFactory.medium")}</option>
                            <option value="hard">{t("pages.qbankFactory.hard")}</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={mixedBlueprint}
                            onCheckedChange={setMixedBlueprint}
                            data-testid="switch-mixed-blueprint"
                          />
                          <Label>{t("pages.qbankFactory.mixedBlueprint")}</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={canadianContext}
                            onCheckedChange={setCanadianContext}
                            data-testid="switch-canadian-context"
                          />
                          <Label>{t("pages.qbankFactory.canadianContext")}</Label>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{t("pages.qbankFactory.topicMixSelector")}</CardTitle>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm font-semibold ${topicMixValid ? "text-green-600" : "text-red-600"}`}
                            data-testid="text-topic-total"
                          >
                            Total: {totalWeight}%
                          </span>
                          {topicMixValid ? (
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {Object.keys(TOPIC_PRESETS).map((preset) => (
                          <Button
                            key={preset}
                            size="sm"
                            variant="outline"
                            onClick={() => applyTopicPreset(preset)}
                            data-testid={`button-preset-${preset.replace(/\s+/g, "-").toLowerCase()}`}
                          >
                            {preset}
                          </Button>
                        ))}
                      </div>
                      <div className="space-y-2">
                        {topicMix.map((row, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <select
                              value={row.topic}
                              onChange={(e) => updateTopicRow(idx, "topic", e.target.value)}
                              className="flex-1 h-8 rounded-md border border-slate-200 bg-white px-2 text-sm"
                              data-testid={`select-topic-${idx}`}
                            >
                              {CLINICAL_TOPICS.map((t) => (
                                <option key={t} value={t}>
                                  {t}
                                </option>
                              ))}
                            </select>
                            <div className="flex items-center gap-1 w-24">
                              <Input
                                type="number"
                                min={0}
                                max={100}
                                value={row.weight}
                                onChange={(e) => updateTopicRow(idx, "weight", Number(e.target.value))}
                                className="h-8 text-sm"
                                data-testid={`input-weight-${idx}`}
                              />
                              <span className="text-xs text-slate-500">%</span>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeTopicRow(idx)}
                              className="h-8 w-8 p-0"
                              data-testid={`button-remove-topic-${idx}`}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      {topicMix.length < CLINICAL_TOPICS.length && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="mt-3"
                          onClick={addTopicRow}
                          data-testid="button-add-topic"
                        >
                          <Plus className="w-3 h-3 mr-1" /> Add Topic
                        </Button>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">{t("pages.qbankFactory.questionTypeDistribution")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {Object.keys(DISTRIBUTION_PRESETS).map((preset) => (
                          <Button
                            key={preset}
                            size="sm"
                            variant={distributionPreset === preset ? "default" : "outline"}
                            onClick={() => applyDistributionPreset(preset)}
                            data-testid={`button-dist-${preset.replace(/\s+/g, "-").toLowerCase()}`}
                          >
                            {preset}
                          </Button>
                        ))}
                      </div>
                      <div className="grid grid-cols-4 gap-4">
                        {Object.entries(typeDistribution).map(([type, pct]) => (
                          <div key={type}>
                            <Label className="text-xs">{type}</Label>
                            <div className="flex items-center gap-1">
                              <Input
                                type="number"
                                min={0}
                                max={100}
                                value={pct}
                                onChange={(e) =>
                                  setTypeDistribution({ ...typeDistribution, [type]: Number(e.target.value) })
                                }
                                className="h-8 text-sm"
                                data-testid={`input-dist-${type.toLowerCase()}`}
                              />
                              <span className="text-xs text-slate-500">%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">{t("pages.qbankFactory.editions")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={questionsOnly}
                            onChange={(e) => setQuestionsOnly(e.target.checked)}
                            className="rounded border-slate-300"
                            data-testid="checkbox-questions-only"
                          />
                          <span className="text-sm">{t("pages.qbankFactory.questionsOnlyAnswerKey")}</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={studyEdition}
                            onChange={(e) => setStudyEdition(e.target.checked)}
                            className="rounded border-slate-300"
                            data-testid="checkbox-study-edition"
                          />
                          <span className="text-sm">{t("pages.qbankFactory.studyEditionRationalesClinicalPearls")}</span>
                        </label>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex flex-wrap gap-3">
                        <Button
                          onClick={saveDraft}
                          disabled={saving}
                          data-testid="button-save-draft"
                        >
                          {saving ? <RefreshCw className="w-4 h-4 mr-1 animate-spin" /> : <FileText className="w-4 h-4 mr-1" />}
                          Save Draft
                        </Button>
                        <Button
                          onClick={handleGenerate}
                          disabled={generating || !topicMixValid}
                          variant="default"
                          data-testid="button-generate"
                        >
                          {generating ? <RefreshCw className="w-4 h-4 mr-1 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-1" />}
                          Generate
                        </Button>
                        <Button
                          onClick={handleCompleteMissing}
                          disabled={completing || !selectedDraftId}
                          variant="secondary"
                          data-testid="button-complete-missing"
                        >
                          {completing ? <RefreshCw className="w-4 h-4 mr-1 animate-spin" /> : null}
                          Complete Missing
                        </Button>
                        <Button
                          onClick={handlePreview}
                          disabled={!selectedDraftId}
                          variant="outline"
                          data-testid="button-preview"
                        >
                          <Eye className="w-4 h-4 mr-1" /> Preview
                        </Button>
                        <Button
                          onClick={handleExportJson}
                          disabled={!auditPasses}
                          variant="outline"
                          data-testid="button-export-json"
                        >
                          <Download className="w-4 h-4 mr-1" /> Export JSON
                        </Button>
                        <Button
                          onClick={handleExportCsv}
                          disabled={!auditPasses}
                          variant="outline"
                          data-testid="button-export-csv"
                        >
                          <Download className="w-4 h-4 mr-1" /> Export CSV
                        </Button>
                        <Button
                          onClick={handlePublish}
                          disabled={publishing || !auditPasses}
                          variant="default"
                          className="bg-green-600 hover:bg-green-700"
                          data-testid="button-publish"
                        >
                          {publishing ? <RefreshCw className="w-4 h-4 mr-1 animate-spin" /> : <Upload className="w-4 h-4 mr-1" />}
                          Publish to Store
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {previewOpen && previewQuestions.length > 0 && (
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">{t("pages.qbankFactory.questionPreviewFirst20")}</CardTitle>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setPreviewOpen(false)}
                            data-testid="button-close-preview"
                          >
                            Close
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4 max-h-[500px] overflow-y-auto">
                          {previewQuestions.map((q: any, i: number) => (
                            <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className="text-[10px]">
                                  {q.type || "MCQ"}
                                </Badge>
                                <Badge variant="secondary" className="text-[10px]">
                                  {q.category || "General"}
                                </Badge>
                              </div>
                              <p className="text-sm text-slate-800" data-testid={`text-preview-question-${i}`}>
                                {i + 1}. {q.question}
                              </p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" /> Audit Panel
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {!auditData ? (
                        <p className="text-sm text-slate-400" data-testid="text-no-audit">
                          No audit data. Generate questions first.
                        </p>
                      ) : (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="text-center p-3 bg-slate-50 rounded-lg">
                              <div className="text-2xl font-bold text-slate-800" data-testid="text-requested-count">
                                {auditData.requestedCount}
                              </div>
                              <div className="text-[10px] text-slate-500 uppercase">{t("pages.qbankFactory.requested")}</div>
                            </div>
                            <div className="text-center p-3 bg-slate-50 rounded-lg">
                              <div className="text-2xl font-bold text-slate-800" data-testid="text-generated-count">
                                {auditData.generatedCount}
                              </div>
                              <div className="text-[10px] text-slate-500 uppercase">{t("pages.qbankFactory.generated")}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-sm">{t("pages.qbankFactory.countMatch")}</span>
                            {auditData.countMatch ? (
                              <Badge className="bg-green-100 text-green-800 text-xs" data-testid="badge-count-match">
                                <CheckCircle2 className="w-3 h-3 mr-1" /> Pass
                              </Badge>
                            ) : (
                              <Badge className="bg-red-100 text-red-800 text-xs" data-testid="badge-count-mismatch">
                                <XCircle className="w-3 h-3 mr-1" /> Fail
                              </Badge>
                            )}
                          </div>

                          {auditData.byType && Object.keys(auditData.byType).length > 0 && (
                            <div>
                              <h4 className="text-xs font-semibold text-slate-600 uppercase mb-2">{t("pages.qbankFactory.byType")}</h4>
                              <div className="space-y-1">
                                {Object.entries(auditData.byType).map(([type, count]) => (
                                  <div key={type} className="flex justify-between text-sm">
                                    <span className="text-slate-600">{type}</span>
                                    <span className="font-medium" data-testid={`text-audit-type-${type.toLowerCase()}`}>
                                      {count}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {auditData.byCategory && Object.keys(auditData.byCategory).length > 0 && (
                            <div>
                              <h4 className="text-xs font-semibold text-slate-600 uppercase mb-2">{t("pages.qbankFactory.byCategory")}</h4>
                              <div className="space-y-1 max-h-48 overflow-y-auto">
                                {Object.entries(auditData.byCategory).map(([cat, count]) => (
                                  <div key={cat} className="flex justify-between text-sm">
                                    <span className="text-slate-600 truncate mr-2">{cat}</span>
                                    <span className="font-medium shrink-0" data-testid={`text-audit-cat-${cat.replace(/\s+/g, "-").toLowerCase()}`}>
                                      {count}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {auditData.topicDistribution && (
                            <div>
                              <h4 className="text-xs font-semibold text-slate-600 uppercase mb-2">{t("pages.qbankFactory.topicDistribution")}</h4>
                              <div className="space-y-2">
                                {Object.entries(auditData.topicDistribution.requested || {}).map(([topicName, reqPct]) => {
                                  const actualPct = auditData.topicDistribution?.actual?.[topicName] ?? 0;
                                  const diff = Math.abs(Number(actualPct) - Number(reqPct));
                                  const ok = diff <= 2;
                                  return (
                                    <div key={topicName} className="text-xs">
                                      <div className="flex justify-between mb-1">
                                        <span className="text-slate-600">{topicName}</span>
                                        <span className={ok ? "text-green-600" : "text-orange-600"}>
                                          {Number(actualPct).toFixed(1)}% / {Number(reqPct)}%
                                        </span>
                                      </div>
                                      <div className="w-full bg-slate-100 rounded-full h-1.5">
                                        <div
                                          className={`h-1.5 rounded-full ${ok ? "bg-green-500" : "bg-orange-500"}`}
                                          style={{ width: `${Math.min(100, Number(actualPct))}%` }}
                                        />
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          <div className="flex items-center gap-2 text-sm">
                            <span>{t("pages.qbankFactory.attempts")}</span>
                            <span className="font-medium" data-testid="text-audit-attempts">{auditData.attempts}</span>
                          </div>

                          {auditData.validationErrors.length > 0 && (
                            <div>
                              <h4 className="text-xs font-semibold text-red-600 uppercase mb-2 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" /> Validation Errors
                              </h4>
                              <ul className="space-y-1">
                                {auditData.validationErrors.map((err, i) => (
                                  <li
                                    key={i}
                                    className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded"
                                    data-testid={`text-validation-error-${i}`}
                                  >
                                    {err}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="listing">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">{t("pages.qbankFactory.autogenerateStoreListing")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-500 mb-4">
                        Generate store copy from the selected draft including headline, description,
                        what you get, who it is for, study plan, edition comparison, FAQ, and selling bullets.
                      </p>
                      <Button
                        onClick={handleGenerateListing}
                        disabled={listingGenerating || !selectedDraftId}
                        data-testid="button-generate-listing"
                      >
                        {listingGenerating ? (
                          <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                        ) : (
                          <FileText className="w-4 h-4 mr-1" />
                        )}
                        Generate Listing Copy
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Pricing ($CAD)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label className="text-xs">{t("pages.qbankFactory.basicQuestionsOnly")}</Label>
                          <div className="flex items-center gap-1">
                            <span className="text-sm text-slate-500">$</span>
                            <Input
                              type="number"
                              value={(priceBasic / 100).toFixed(2)}
                              onChange={(e) => setPriceBasic(Math.round(Number(e.target.value) * 100))}
                              className="h-8 text-sm"
                              data-testid="input-price-basic"
                            />
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs">{t("pages.qbankFactory.premiumStudyEdition")}</Label>
                          <div className="flex items-center gap-1">
                            <span className="text-sm text-slate-500">$</span>
                            <Input
                              type="number"
                              value={(pricePremium / 100).toFixed(2)}
                              onChange={(e) => setPricePremium(Math.round(Number(e.target.value) * 100))}
                              className="h-8 text-sm"
                              data-testid="input-price-premium"
                            />
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs">{t("pages.qbankFactory.bundleBoth")}</Label>
                          <div className="flex items-center gap-1">
                            <span className="text-sm text-slate-500">$</span>
                            <Input
                              type="number"
                              value={(priceBundle / 100).toFixed(2)}
                              onChange={(e) => setPriceBundle(Math.round(Number(e.target.value) * 100))}
                              className="h-8 text-sm"
                              data-testid="input-price-bundle"
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs">{t("pages.qbankFactory.editionVariantForListing")}</Label>
                        <select
                          value={editionVariant}
                          onChange={(e) => setEditionVariant(e.target.value as any)}
                          className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-sm mt-1"
                          data-testid="select-edition-variant"
                        >
                          <option value="questions-only">{t("pages.qbankFactory.questionsOnlyAnswerKey2")}</option>
                          <option value="study">{t("pages.qbankFactory.studyEdition")}</option>
                          <option value="bundle">{t("pages.qbankFactory.bundleBothEditions")}</option>
                        </select>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">{t("pages.qbankFactory.listingPreview")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {!listingData ? (
                        <p className="text-sm text-slate-400" data-testid="text-no-listing">
                          No listing generated yet. Select a draft and click Generate.
                        </p>
                      ) : (
                        <div className="space-y-4" data-testid="listing-preview-content">
                          {listingData.headline && (
                            <div>
                              <h3 className="text-lg font-bold text-slate-800" data-testid="text-listing-headline">
                                {listingData.headline}
                              </h3>
                            </div>
                          )}
                          {listingData.description && (
                            <div>
                              <h4 className="text-xs font-semibold text-slate-500 uppercase mb-1">{t("pages.qbankFactory.description")}</h4>
                              <p className="text-sm text-slate-700" data-testid="text-listing-description">
                                {listingData.description}
                              </p>
                            </div>
                          )}
                          {listingData.whatYouGet && (
                            <div>
                              <h4 className="text-xs font-semibold text-slate-500 uppercase mb-1">{t("pages.qbankFactory.whatYouGet")}</h4>
                              <p className="text-sm text-slate-700" data-testid="text-listing-what-you-get">
                                {listingData.whatYouGet}
                              </p>
                            </div>
                          )}
                          {listingData.whoItsFor && (
                            <div>
                              <h4 className="text-xs font-semibold text-slate-500 uppercase mb-1">{t("pages.qbankFactory.whoItIsFor")}</h4>
                              <p className="text-sm text-slate-700" data-testid="text-listing-who">
                                {listingData.whoItsFor}
                              </p>
                            </div>
                          )}
                          {listingData.studyPlan && (
                            <div>
                              <h4 className="text-xs font-semibold text-slate-500 uppercase mb-1">{t("pages.qbankFactory.howToUseStudyPlan")}</h4>
                              <p className="text-sm text-slate-700" data-testid="text-listing-study-plan">
                                {listingData.studyPlan}
                              </p>
                            </div>
                          )}
                          {listingData.editionComparison && (
                            <div>
                              <h4 className="text-xs font-semibold text-slate-500 uppercase mb-1">{t("pages.qbankFactory.editionComparison")}</h4>
                              <p className="text-sm text-slate-700" data-testid="text-listing-edition-comparison">
                                {listingData.editionComparison}
                              </p>
                            </div>
                          )}
                          {listingData.faqs && Array.isArray(listingData.faqs) && (
                            <div>
                              <h4 className="text-xs font-semibold text-slate-500 uppercase mb-1">FAQ</h4>
                              <div className="space-y-2">
                                {listingData.faqs.map((faq: any, i: number) => (
                                  <div key={i} className="text-sm">
                                    <p className="font-medium text-slate-800" data-testid={`text-faq-q-${i}`}>
                                      {faq.question || faq.q}
                                    </p>
                                    <p className="text-slate-600" data-testid={`text-faq-a-${i}`}>
                                      {faq.answer || faq.a}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {listingData.sellingBullets && Array.isArray(listingData.sellingBullets) && (
                            <div>
                              <h4 className="text-xs font-semibold text-slate-500 uppercase mb-1">{t("pages.qbankFactory.sellingBullets")}</h4>
                              <ul className="list-disc list-inside space-y-1">
                                {listingData.sellingBullets.map((b: string, i: number) => (
                                  <li key={i} className="text-sm text-slate-700" data-testid={`text-bullet-${i}`}>
                                    {b}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {(listingData.seoTitle || listingData.metaDescription) && (
                            <div className="border-t pt-3 mt-3">
                              <h4 className="text-xs font-semibold text-slate-500 uppercase mb-1">SEO</h4>
                              {listingData.seoTitle && (
                                <p className="text-sm text-slate-700" data-testid="text-listing-seo-title">
                                  Title: {listingData.seoTitle}
                                </p>
                              )}
                              {listingData.metaDescription && (
                                <p className="text-sm text-slate-600" data-testid="text-listing-meta-desc">
                                  Meta: {listingData.metaDescription}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="exam-factory">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">{t("pages.qbankFactory.examConfiguration")}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>{t("pages.qbankFactory.examLength")}</Label>
                          <select
                            value={examLength}
                            onChange={(e) => setExamLength(Number(e.target.value))}
                            className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-sm"
                            data-testid="select-exam-length"
                          >
                            <option value={85}>{t("pages.qbankFactory.85Questions")}</option>
                            <option value={90}>{t("pages.qbankFactory.90Questions")}</option>
                          </select>
                        </div>
                        <div>
                          <Label>{t("pages.qbankFactory.formCount")}</Label>
                          <select
                            value={formCount}
                            onChange={(e) => setFormCount(Number(e.target.value))}
                            className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-sm"
                            data-testid="select-form-count"
                          >
                            <option value={1}>{t("pages.qbankFactory.1Form")}</option>
                            <option value={2}>{t("pages.qbankFactory.2Forms")}</option>
                            <option value={3}>{t("pages.qbankFactory.3Forms")}</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Switch
                          checked={includeRationales}
                          onCheckedChange={setIncludeRationales}
                          data-testid="switch-include-rationales"
                        />
                        <Label>{t("pages.qbankFactory.includeRationales")}</Label>
                      </div>

                      <div>
                        <Label className="text-xs mb-2 block">{t("pages.qbankFactory.forms")}</Label>
                        <div className="flex items-center gap-4">
                          {(["A", "B", "C"] as const).map((form) => (
                            <label key={form} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formsChecked[form]}
                                onChange={(e) =>
                                  setFormsChecked({ ...formsChecked, [form]: e.target.checked })
                                }
                                className="rounded border-slate-300"
                                data-testid={`checkbox-form-${form.toLowerCase()}`}
                              />
                              <span className="text-sm">Form {form}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label>{t("pages.qbankFactory.difficultyTarget")}</Label>
                        <select
                          value={examDifficultyTarget}
                          onChange={(e) => setExamDifficultyTarget(e.target.value)}
                          className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-sm"
                          data-testid="select-exam-difficulty"
                        >
                          <option value="easy">{t("pages.qbankFactory.easy2")}</option>
                          <option value="medium">{t("pages.qbankFactory.medium2")}</option>
                          <option value="hard">{t("pages.qbankFactory.hard2")}</option>
                        </select>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{t("pages.qbankFactory.examTopicMix")}</CardTitle>
                        <span
                          className={`text-sm font-semibold ${
                            examTopicMix.reduce((s, r) => s + r.weight, 0) === 100
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                          data-testid="text-exam-topic-total"
                        >
                          Total: {examTopicMix.reduce((s, r) => s + r.weight, 0)}%
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {Object.keys(TOPIC_PRESETS).map((preset) => (
                          <Button
                            key={preset}
                            size="sm"
                            variant="outline"
                            onClick={() => setExamTopicMix([...TOPIC_PRESETS[preset]])}
                            data-testid={`button-exam-preset-${preset.replace(/\s+/g, "-").toLowerCase()}`}
                          >
                            {preset}
                          </Button>
                        ))}
                      </div>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {examTopicMix.map((row, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <select
                              value={row.topic}
                              onChange={(e) => {
                                const u = [...examTopicMix];
                                u[idx] = { ...u[idx], topic: e.target.value };
                                setExamTopicMix(u);
                              }}
                              className="flex-1 h-8 rounded-md border border-slate-200 bg-white px-2 text-sm"
                              data-testid={`select-exam-topic-${idx}`}
                            >
                              {CLINICAL_TOPICS.map((t) => (
                                <option key={t} value={t}>{t}</option>
                              ))}
                            </select>
                            <div className="flex items-center gap-1 w-20">
                              <Input
                                type="number"
                                min={0}
                                max={100}
                                value={row.weight}
                                onChange={(e) => {
                                  const u = [...examTopicMix];
                                  u[idx] = { ...u[idx], weight: Number(e.target.value) };
                                  setExamTopicMix(u);
                                }}
                                className="h-8 text-sm"
                                data-testid={`input-exam-weight-${idx}`}
                              />
                              <span className="text-xs text-slate-500">%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Button
                    onClick={handleGenerateForms}
                    disabled={examGenerating || !selectedDraftId}
                    className="w-full"
                    data-testid="button-generate-forms"
                  >
                    {examGenerating ? (
                      <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                    ) : (
                      <Layers className="w-4 h-4 mr-1" />
                    )}
                    Generate Exam Forms
                  </Button>
                </div>

                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">{t("pages.qbankFactory.blueprintDistribution")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="grid grid-cols-4 gap-3">
                          {Object.entries(typeDistribution).map(([type, pct]) => (
                            <div key={type} className="text-center p-3 bg-slate-50 rounded-lg">
                              <div className="text-lg font-bold text-slate-800">{pct}%</div>
                              <div className="text-[10px] text-slate-500 uppercase">{type}</div>
                              <div className="text-xs text-slate-400">
                                ~{Math.round((pct / 100) * examLength)} q
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="border-t pt-3">
                          <p className="text-sm text-slate-600">
                            Each form will contain {examLength} questions sampled from the master bank
                            ({selectedDraft ? (selectedDraft.questionsJson as any)?.length || 0 : 0} available).
                            Forms are shuffled with a deterministic seed for reproducibility.
                          </p>
                        </div>
                        {selectedDraft && (
                          <div className="border-t pt-3">
                            <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">{t("pages.qbankFactory.currentDraft")}</h4>
                            <div className="text-sm text-slate-700">
                              <p data-testid="text-exam-draft-title">{selectedDraft.title}</p>
                              <p className="text-slate-500">
                                Status: {selectedDraft.status} | Questions: {(selectedDraft.questionsJson as any)?.length || 0}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
