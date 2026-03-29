import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText, Plus, Save, Trash2, Eye, RefreshCw,
  ChevronDown, ChevronUp, Settings, BarChart3, Clock,
  Target, Zap, CheckCircle2, AlertTriangle
} from "lucide-react";
import { FLAGSHIP_MOCK_EXAM_TEMPLATES, FLAGSHIP_EXAM_CODES, type MockExamTemplate } from "@/lib/flagship-mock-exam-configs";

import { useI18n } from "@/lib/i18n";
interface DbTemplate {
  id: string;
  templateId: string;
  examCode: string;
  examName: string;
  templateName: string;
  description: string;
  questionCount: number;
  timeLimitMinutes: number;
  difficultyDistribution: { foundational: number; moderate: number; difficult: number };
  domainWeights: { domain: string; weight: number }[];
  formatMix: { mcqSingle: number; selectAllThatApply: number; scenarioBased: number; prioritization: number; delegation: number };
  passingStandard: number;
  seed: number;
  tier: string;
  active: boolean;
}

interface PreviewResult {
  previewQuestions: { id: string; stem: string; domain: string; difficulty: number; questionType: string }[];
  totalAvailable: number;
  domainDistribution: Record<string, number>;
  difficultyDistribution: Record<string, number>;
}

export default function AdminMockExamTemplates() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [templates, setTemplates] = useState<DbTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [preview, setPreview] = useState<PreviewResult | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [filterExam, setFilterExam] = useState<string>("all");
  const [editingTemplate, setEditingTemplate] = useState<Partial<DbTemplate> | null>(null);
  const [saveStatus, setSaveStatus] = useState<string>("");

  const isAdmin = user?.tier === "admin";

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/mock-exam-templates");
      if (res.ok) {
        setTemplates(await res.json());
      }
    } catch (e) {
      console.error("Failed to fetch templates:", e);
    } finally {
      setLoading(false);
    }
  };

  const syncFromConfig = async () => {
    setSyncing(true);
    try {
      const res = await fetch("/api/admin/mock-exam-templates/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-user-id": user?.id || "" },
        body: JSON.stringify({ templates: FLAGSHIP_MOCK_EXAM_TEMPLATES }),
      });
      if (res.ok) {
        const result = await res.json();
        setSaveStatus(`Synced ${result.synced} templates`);
        await fetchTemplates();
        setTimeout(() => setSaveStatus(""), 3000);
      }
    } catch (e) {
      console.error("Sync error:", e);
      setSaveStatus("Sync failed");
    } finally {
      setSyncing(false);
    }
  };

  const previewTemplate = async (templateId: string) => {
    setPreviewLoading(true);
    setPreview(null);
    try {
      const res = await fetch(`/api/mock-exam-templates/${templateId}/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-user-id": user?.id || "" },
      });
      if (res.ok) {
        setPreview(await res.json());
      }
    } catch (e) {
      console.error("Preview error:", e);
    } finally {
      setPreviewLoading(false);
    }
  };

  const saveTemplate = async (template: Partial<DbTemplate>) => {
    try {
      const res = await fetch("/api/admin/mock-exam-templates", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-user-id": user?.id || "" },
        body: JSON.stringify(template),
      });
      if (res.ok) {
        setSaveStatus("Template saved");
        setEditingTemplate(null);
        await fetchTemplates();
        setTimeout(() => setSaveStatus(""), 3000);
      }
    } catch (e) {
      console.error("Save error:", e);
      setSaveStatus("Save failed");
    }
  };

  const deleteTemplate = async (templateId: string) => {
    if (!confirm("Delete this template?")) return;
    try {
      await fetch(`/api/admin/mock-exam-templates/${templateId}`, {
        method: "DELETE",
        headers: { "x-user-id": user?.id || "" },
      });
      await fetchTemplates();
    } catch (e) {
      console.error("Delete error:", e);
    }
  };

  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold" data-testid="text-access-denied">{t("pages.adminMockExamTemplates.adminAccessRequired")}</h1>
      </div>
    );
  }

  const filteredTemplates = filterExam === "all"
    ? templates
    : templates.filter(t => t.examCode === filterExam);

  const examCounts = templates.reduce((acc, t) => {
    if (t.active) acc[t.examCode] = (acc[t.examCode] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8" data-testid="admin-mock-exam-templates">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2" data-testid="text-page-title">
            <FileText className="w-6 h-6 text-teal-600" />
            Mock Exam Templates
          </h1>
          <p className="text-gray-600 mt-1">{t("pages.adminMockExamTemplates.manageFlagshipMockExamBlueprints")}</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={syncFromConfig}
            disabled={syncing}
            variant="outline"
            className="gap-2"
            data-testid="button-sync-templates"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
            {syncing ? "Syncing..." : "Sync from Config"}
          </Button>
          <Button
            onClick={() => setEditingTemplate({
              templateId: "",
              examCode: "NCLEX-RN",
              examName: "",
              templateName: "",
              description: "",
              questionCount: 120,
              timeLimitMinutes: 300,
              difficultyDistribution: { foundational: 0.15, moderate: 0.55, difficult: 0.30 },
              domainWeights: [],
              formatMix: { mcqSingle: 0.50, selectAllThatApply: 0.20, scenarioBased: 0.15, prioritization: 0.10, delegation: 0.05 },
              passingStandard: 65,
              seed: Math.floor(Math.random() * 10000),
              tier: "rn",
              active: true,
            })}
            className="gap-2"
            data-testid="button-new-template"
          >
            <Plus className="w-4 h-4" /> New Template
          </Button>
        </div>
      </div>

      {saveStatus && (
        <div className="mb-4 px-4 py-2 bg-teal-50 text-teal-800 rounded-lg text-sm flex items-center gap-2" data-testid="text-save-status">
          <CheckCircle2 className="w-4 h-4" /> {saveStatus}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
        <button
          onClick={() => setFilterExam("all")}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${filterExam === "all" ? "bg-teal-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          data-testid="filter-all"
        >
          All ({templates.length})
        </button>
        {FLAGSHIP_EXAM_CODES.map(code => (
          <button
            key={code}
            onClick={() => setFilterExam(code)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${filterExam === code ? "bg-teal-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            data-testid={`filter-${code}`}
          >
            {code} ({examCounts[code] || 0})
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card data-testid="stat-total-templates">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-4 h-4 text-teal-500" />
              <span className="text-xs text-gray-500">{t("pages.adminMockExamTemplates.totalTemplates")}</span>
            </div>
            <p className="text-2xl font-bold">{templates.length}</p>
          </CardContent>
        </Card>
        <Card data-testid="stat-active-templates">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span className="text-xs text-gray-500">{t("pages.adminMockExamTemplates.active")}</span>
            </div>
            <p className="text-2xl font-bold">{templates.filter(t => t.active).length}</p>
          </CardContent>
        </Card>
        <Card data-testid="stat-exam-types">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-purple-500" />
              <span className="text-xs text-gray-500">{t("pages.adminMockExamTemplates.examTypes")}</span>
            </div>
            <p className="text-2xl font-bold">{Object.keys(examCounts).length}</p>
          </CardContent>
        </Card>
        <Card data-testid="stat-avg-questions">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="w-4 h-4 text-amber-500" />
              <span className="text-xs text-gray-500">{t("pages.adminMockExamTemplates.avgQuestions")}</span>
            </div>
            <p className="text-2xl font-bold">
              {templates.length > 0 ? Math.round(templates.reduce((s, t) => s + t.questionCount, 0) / templates.length) : 0}
            </p>
          </CardContent>
        </Card>
      </div>

      {editingTemplate && (
        <Card className="mb-6 border-teal-200" data-testid="template-editor">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Settings className="w-5 h-5 text-teal-600" />
              {editingTemplate.templateId ? "Edit Template" : "New Template"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-600">{t("pages.adminMockExamTemplates.templateId")}</label>
                <input
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                  value={editingTemplate.templateId || ""}
                  onChange={e => setEditingTemplate({ ...editingTemplate, templateId: e.target.value })}
                  placeholder="e.g., nclex-rn-mock-8"
                  data-testid="input-template-id"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">{t("pages.adminMockExamTemplates.examCode")}</label>
                <select
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                  value={editingTemplate.examCode || ""}
                  onChange={e => setEditingTemplate({ ...editingTemplate, examCode: e.target.value })}
                  data-testid="select-exam-code"
                >
                  {FLAGSHIP_EXAM_CODES.map(code => (
                    <option key={code} value={code}>{code}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">{t("pages.adminMockExamTemplates.examName")}</label>
                <input
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                  value={editingTemplate.examName || ""}
                  onChange={e => setEditingTemplate({ ...editingTemplate, examName: e.target.value })}
                  data-testid="input-exam-name"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">{t("pages.adminMockExamTemplates.templateName")}</label>
                <input
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                  value={editingTemplate.templateName || ""}
                  onChange={e => setEditingTemplate({ ...editingTemplate, templateName: e.target.value })}
                  data-testid="input-template-name"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-medium text-gray-600">{t("pages.adminMockExamTemplates.description")}</label>
                <textarea
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                  rows={2}
                  value={editingTemplate.description || ""}
                  onChange={e => setEditingTemplate({ ...editingTemplate, description: e.target.value })}
                  data-testid="input-description"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">{t("pages.adminMockExamTemplates.questionCount")}</label>
                <input
                  type="number"
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                  value={editingTemplate.questionCount || 120}
                  onChange={e => setEditingTemplate({ ...editingTemplate, questionCount: parseInt(e.target.value) })}
                  data-testid="input-question-count"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">{t("pages.adminMockExamTemplates.timeLimitMinutes")}</label>
                <input
                  type="number"
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                  value={editingTemplate.timeLimitMinutes || 300}
                  onChange={e => setEditingTemplate({ ...editingTemplate, timeLimitMinutes: parseInt(e.target.value) })}
                  data-testid="input-time-limit"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">{t("pages.adminMockExamTemplates.passingStandard")}</label>
                <input
                  type="number"
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                  value={editingTemplate.passingStandard || 65}
                  onChange={e => setEditingTemplate({ ...editingTemplate, passingStandard: parseInt(e.target.value) })}
                  data-testid="input-passing-standard"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">{t("pages.adminMockExamTemplates.tier")}</label>
                <select
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                  value={editingTemplate.tier || "rn"}
                  onChange={e => setEditingTemplate({ ...editingTemplate, tier: e.target.value })}
                  data-testid="select-tier"
                >
                  <option value="rn">RN</option>
                  <option value="rpn">{t("pages.adminMockExamTemplates.rpnpn")}</option>
                  <option value="np">NP</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={() => saveTemplate(editingTemplate)} className="gap-2" data-testid="button-save-template">
                <Save className="w-4 h-4" /> Save Template
              </Button>
              <Button variant="outline" onClick={() => setEditingTemplate(null)} data-testid="button-cancel-edit">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTemplates.map(template => (
            <Card key={template.templateId} className={`transition-all ${!template.active ? "opacity-60" : ""}`} data-testid={`template-card-${template.templateId}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-2 h-10 rounded-full ${template.active ? "bg-teal-500" : "bg-gray-300"}`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-teal-50 text-teal-700 text-xs font-medium rounded">{template.examCode}</span>
                        <h3 className="font-semibold text-gray-900">{template.templateName}</h3>
                        {!template.active && <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">{t("pages.adminMockExamTemplates.inactive")}</span>}
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5">{template.description}</p>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <BarChart3 className="w-3.5 h-3.5" /> {template.questionCount} Qs
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {template.timeLimitMinutes}m
                      </span>
                      <span className="flex items-center gap-1">
                        <Target className="w-3.5 h-3.5" /> {template.passingStandard}%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => previewTemplate(template.templateId)}
                      data-testid={`button-preview-${template.templateId}`}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingTemplate(template)}
                      data-testid={`button-edit-${template.templateId}`}
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteTemplate(template.templateId)}
                      className="text-red-500 hover:text-red-700"
                      data-testid={`button-delete-${template.templateId}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <button
                      onClick={() => setExpandedId(expandedId === template.templateId ? null : template.templateId)}
                      className="text-gray-400 hover:text-gray-600"
                      data-testid={`button-expand-${template.templateId}`}
                    >
                      {expandedId === template.templateId ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {expandedId === template.templateId && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="text-xs font-semibold text-gray-500 mb-2">{t("pages.adminMockExamTemplates.domainWeights")}</h4>
                        <div className="space-y-1.5">
                          {(template.domainWeights || []).map((dw: any) => (
                            <div key={dw.domain} className="flex items-center gap-2">
                              <div className="w-24 bg-gray-100 rounded-full h-2">
                                <div className="h-2 rounded-full bg-teal-500" style={{ width: `${(dw.weight * 100)}%` }} />
                              </div>
                              <span className="text-xs text-gray-600">{dw.domain} ({Math.round(dw.weight * 100)}%)</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-gray-500 mb-2">{t("pages.adminMockExamTemplates.difficultyDistribution")}</h4>
                        {template.difficultyDistribution && (
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-xs">
                              <span className="text-green-600">{t("pages.adminMockExamTemplates.foundational")}</span>
                              <span>{Math.round((template.difficultyDistribution as any).foundational * 100)}%</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-amber-600">{t("pages.adminMockExamTemplates.moderate")}</span>
                              <span>{Math.round((template.difficultyDistribution as any).moderate * 100)}%</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-red-600">{t("pages.adminMockExamTemplates.difficult")}</span>
                              <span>{Math.round((template.difficultyDistribution as any).difficult * 100)}%</span>
                            </div>
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-gray-500 mb-2">{t("pages.adminMockExamTemplates.formatMix")}</h4>
                        {template.formatMix && (
                          <div className="space-y-1.5 text-xs">
                            <div className="flex justify-between"><span>{t("pages.adminMockExamTemplates.mcqSingle")}</span><span>{Math.round((template.formatMix as any).mcqSingle * 100)}%</span></div>
                            <div className="flex justify-between"><span>SATA</span><span>{Math.round((template.formatMix as any).selectAllThatApply * 100)}%</span></div>
                            <div className="flex justify-between"><span>{t("pages.adminMockExamTemplates.scenario")}</span><span>{Math.round((template.formatMix as any).scenarioBased * 100)}%</span></div>
                            <div className="flex justify-between"><span>{t("pages.adminMockExamTemplates.prioritization")}</span><span>{Math.round((template.formatMix as any).prioritization * 100)}%</span></div>
                            <div className="flex justify-between"><span>{t("pages.adminMockExamTemplates.delegation")}</span><span>{Math.round((template.formatMix as any).delegation * 100)}%</span></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {preview && (
        <Card className="mt-6 border-purple-200" data-testid="preview-panel">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Eye className="w-5 h-5 text-purple-600" />
              Assembly Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="text-xs font-semibold text-gray-500 mb-2">{t("pages.adminMockExamTemplates.domainDistribution")}</h4>
                <div className="space-y-1">
                  {Object.entries(preview.domainDistribution).map(([domain, count]) => (
                    <div key={domain} className="flex justify-between text-sm">
                      <span className="text-gray-600">{domain}</span>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-gray-500 mb-2">{t("pages.adminMockExamTemplates.difficultyDistribution2")}</h4>
                <div className="space-y-1">
                  {Object.entries(preview.difficultyDistribution).map(([level, count]) => (
                    <div key={level} className="flex justify-between text-sm">
                      <span className="text-gray-600 capitalize">{level}</span>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-3">Total available: {preview.totalAvailable} questions</p>
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-gray-500">{t("pages.adminMockExamTemplates.sampleQuestions")}</h4>
              {preview.previewQuestions.map(q => (
                <div key={q.id} className="bg-gray-50 rounded-lg p-3 text-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-1.5 py-0.5 bg-teal-50 text-teal-700 rounded text-[10px]">{q.domain}</span>
                    <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px]">Lvl {q.difficulty}</span>
                    <span className="px-1.5 py-0.5 bg-purple-50 text-purple-600 rounded text-[10px]">{q.questionType}</span>
                  </div>
                  <p className="text-gray-700">{q.stem}</p>
                </div>
              ))}
            </div>
            <Button variant="outline" className="mt-4" onClick={() => setPreview(null)} data-testid="button-close-preview">
              Close Preview
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
