import { useState, useEffect, useCallback } from "react";
import { useAuth, getAdminAccessToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/lib/i18n";
import {
  Plus, Trash2, Edit3, Save, ChevronDown, ChevronUp, GripVertical,
  Eye, EyeOff, ArrowLeft, X, FileText
} from "lucide-react";

async function adminFetch(url: string, options?: RequestInit) {
  const { t } = useI18n();
  const token = getAdminAccessToken() || "";
  const storedUser = JSON.parse(localStorage.getItem("nursenest-user") || "{}");
  const adminId = storedUser?.id || "";
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options?.headers as Record<string, string> || {}),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (adminId) headers["x-admin-id"] = adminId;
  return fetch(url, { ...options, headers, credentials: "include" });
}

interface CaseStudy {
  id: string; title: string; tier: string; difficulty: string; bodySystem: string | null;
  category: string | null; scenarioIntro: string; status: string; regionScope: string;
  createdAt: string;
}

interface Step {
  id: string; caseId: string; stepNumber: number; clinicalUpdateText: string; exhibitData: any;
}

interface Question {
  id: string; caseStepId: string; questionText: string; questionType: string;
  answerOptions: any[]; correctAnswer: any; rationale: string | null; points: number;
}

export default function AdminCaseStudiesPage() {
  const { isAdmin } = useAuth();
  const { toast } = useToast();

  const [studies, setStudies] = useState<CaseStudy[]>([]);
  const [activeStudy, setActiveStudy] = useState<CaseStudy | null>(null);
  const [steps, setSteps] = useState<(Step & { questions: Question[] })[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editTitle, setEditTitle] = useState("");
  const [editTier, setEditTier] = useState("rpn");
  const [editDifficulty, setEditDifficulty] = useState("moderate");
  const [editBodySystem, setEditBodySystem] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editScenarioIntro, setEditScenarioIntro] = useState("");
  const [editRegionScope, setEditRegionScope] = useState("BOTH");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());

  const loadStudies = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminFetch("/api/case-studies");
      if (res.ok) setStudies(await res.json());
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { loadStudies(); }, [loadStudies]);

  const loadFullCase = async (id: string) => {
    try {
      const res = await adminFetch(`/api/case-studies/${id}/full`);
      if (res.ok) {
        const data = await res.json();
        setActiveStudy(data.study);
        setSteps(data.steps);
        setEditTitle(data.study.title);
        setEditTier(data.study.tier);
        setEditDifficulty(data.study.difficulty);
        setEditBodySystem(data.study.bodySystem || "");
        setEditCategory(data.study.category || "");
        setEditScenarioIntro(data.study.scenarioIntro);
        setEditRegionScope(data.study.regionScope || "BOTH");
        setExpandedSteps(new Set());
      }
    } catch {}
  };

  const createStudy = async () => {
    if (!editTitle || !editScenarioIntro) {
      toast({ title: "Missing fields", description: "Title and scenario intro are required", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const res = await adminFetch("/api/case-studies", {
        method: "POST",
        body: JSON.stringify({ title: editTitle, tier: editTier, difficulty: editDifficulty, bodySystem: editBodySystem || null, category: editCategory || null, scenarioIntro: editScenarioIntro, status: "draft", regionScope: editRegionScope }),
      });
      if (res.ok) {
        const study = await res.json();
        toast({ title: "Case study created" });
        setShowCreateForm(false);
        loadStudies();
        loadFullCase(study.id);
      }
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
    setSaving(false);
  };

  const saveStudyMeta = async () => {
    if (!activeStudy) return;
    setSaving(true);
    try {
      const res = await adminFetch(`/api/case-studies/${activeStudy.id}`, {
        method: "PATCH",
        body: JSON.stringify({ title: editTitle, tier: editTier, difficulty: editDifficulty, bodySystem: editBodySystem || null, category: editCategory || null, scenarioIntro: editScenarioIntro, regionScope: editRegionScope }),
      });
      if (res.ok) {
        const updated = await res.json();
        setActiveStudy(updated);
        toast({ title: "Saved" });
        loadStudies();
      }
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
    setSaving(false);
  };

  const togglePublish = async () => {
    if (!activeStudy) return;
    const newStatus = activeStudy.status === "published" ? "draft" : "published";
    try {
      const res = await adminFetch(`/api/case-studies/${activeStudy.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const updated = await res.json();
        setActiveStudy(updated);
        toast({ title: newStatus === "published" ? "Published" : "Unpublished" });
        loadStudies();
      }
    } catch {}
  };

  const deleteStudy = async (id: string) => {
    if (!confirm("Delete this case study and all its steps/questions?")) return;
    try {
      await adminFetch(`/api/case-studies/${id}`, { method: "DELETE" });
      toast({ title: "Deleted" });
      if (activeStudy?.id === id) { setActiveStudy(null); setSteps([]); }
      loadStudies();
    } catch {}
  };

  const addStep = async () => {
    if (!activeStudy) return;
    const nextNum = steps.length > 0 ? Math.max(...steps.map(s => s.stepNumber)) + 1 : 1;
    try {
      const res = await adminFetch(`/api/case-studies/${activeStudy.id}/steps`, {
        method: "POST",
        body: JSON.stringify({ stepNumber: nextNum, clinicalUpdateText: "New clinical update...", exhibitData: {} }),
      });
      if (res.ok) {
        toast({ title: "Step added" });
        loadFullCase(activeStudy.id);
      }
    } catch {}
  };

  const updateStep = async (stepId: string, updates: any) => {
    try {
      await adminFetch(`/api/case-study-steps/${stepId}`, {
        method: "PATCH",
        body: JSON.stringify(updates),
      });
    } catch {}
  };

  const deleteStep = async (stepId: string) => {
    if (!confirm("Delete this step and its questions?")) return;
    try {
      await adminFetch(`/api/case-study-steps/${stepId}`, { method: "DELETE" });
      toast({ title: "Step deleted" });
      if (activeStudy) loadFullCase(activeStudy.id);
    } catch {}
  };

  const addQuestion = async (stepId: string) => {
    try {
      const res = await adminFetch(`/api/case-study-steps/${stepId}/questions`, {
        method: "POST",
        body: JSON.stringify({
          questionText: "New question...",
          questionType: "multiple_choice",
          answerOptions: ["Option A", "Option B", "Option C", "Option D"],
          correctAnswer: [0],
          rationale: "",
          points: 1,
        }),
      });
      if (res.ok) {
        toast({ title: "Question added" });
        if (activeStudy) loadFullCase(activeStudy.id);
      }
    } catch {}
  };

  const updateQuestion = async (qId: string, updates: any) => {
    try {
      await adminFetch(`/api/case-study-questions/${qId}`, {
        method: "PATCH",
        body: JSON.stringify(updates),
      });
    } catch {}
  };

  const deleteQuestion = async (qId: string) => {
    if (!confirm("Delete this question?")) return;
    try {
      await adminFetch(`/api/case-study-questions/${qId}`, { method: "DELETE" });
      toast({ title: "Question deleted" });
      if (activeStudy) loadFullCase(activeStudy.id);
    } catch {}
  };

  const toggleStep = (stepId: string) => {
    setExpandedSteps(prev => {
      const next = new Set(prev);
      if (next.has(stepId)) next.delete(stepId); else next.add(stepId);
      return next;
    });
  };

  if (!isAdmin) return <div className="p-8 text-center text-gray-500">{t("pages.adminCaseStudies.adminAccessRequired")}</div>;

  if (activeStudy) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => { setActiveStudy(null); setSteps([]); }} data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Button>
            <h1 className="text-xl font-bold text-gray-900 flex-1" data-testid="text-builder-title">{t("pages.adminCaseStudies.caseStudyBuilder")}</h1>
            <Button size="sm" variant={activeStudy.status === "published" ? "outline" : "default"} onClick={togglePublish} data-testid="button-toggle-publish">
              {activeStudy.status === "published" ? <><EyeOff className="w-3 h-3 mr-1" /> {t("pages.adminCaseStudies.unpublish")}</> : <><Eye className="w-3 h-3 mr-1" /> {t("pages.adminCaseStudies.publish")}</>}
            </Button>
          </div>

          <Card data-testid="card-case-meta">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-gray-700">{t("pages.adminCaseStudies.caseStudyDetails")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-500">{t("pages.adminCaseStudies.title")}</label>
                  <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} data-testid="input-title" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">{t("pages.adminCaseStudies.tier")}</label>
                  <select value={editTier} onChange={(e) => setEditTier(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm" data-testid="select-tier">
                    <option value="rpn">RPN</option>
                    <option value="rn">RN</option>
                    <option value="np">NP</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">{t("pages.adminCaseStudies.difficulty")}</label>
                  <select value={editDifficulty} onChange={(e) => setEditDifficulty(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm" data-testid="select-difficulty">
                    <option value="easy">{t("pages.adminCaseStudies.easy")}</option>
                    <option value="moderate">{t("pages.adminCaseStudies.moderate")}</option>
                    <option value="hard">{t("pages.adminCaseStudies.hard")}</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">{t("pages.adminCaseStudies.bodySystem")}</label>
                  <Input value={editBodySystem} onChange={(e) => setEditBodySystem(e.target.value)} placeholder="e.g. Cardiac" data-testid="input-body-system" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">{t("pages.adminCaseStudies.category")}</label>
                  <Input value={editCategory} onChange={(e) => setEditCategory(e.target.value)} placeholder="e.g. Maternal" data-testid="input-category" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">{t("pages.adminCaseStudies.regionScope")}</label>
                  <select value={editRegionScope} onChange={(e) => setEditRegionScope(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm" data-testid="select-region">
                    <option value="BOTH">{t("pages.adminCaseStudies.bothUsCa")}</option>
                    <option value="US">{t("pages.adminCaseStudies.usOnly")}</option>
                    <option value="CA">{t("pages.adminCaseStudies.canadaOnly")}</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">{t("pages.adminCaseStudies.scenarioIntroduction")}</label>
                <textarea
                  value={editScenarioIntro}
                  onChange={(e) => setEditScenarioIntro(e.target.value)}
                  rows={3}
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  data-testid="textarea-scenario"
                />
              </div>
              <Button size="sm" onClick={saveStudyMeta} disabled={saving} data-testid="button-save-meta">
                <Save className="w-3 h-3 mr-1" /> Save Details
              </Button>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Steps ({steps.length})</h2>
            <Button size="sm" onClick={addStep} data-testid="button-add-step">
              <Plus className="w-3 h-3 mr-1" /> Add Step
            </Button>
          </div>

          {steps.map((step) => (
            <StepEditor
              key={step.id}
              step={step}
              expanded={expandedSteps.has(step.id)}
              onToggle={() => toggleStep(step.id)}
              onUpdateStep={updateStep}
              onDeleteStep={deleteStep}
              onAddQuestion={addQuestion}
              onUpdateQuestion={updateQuestion}
              onDeleteQuestion={deleteQuestion}
              onRefresh={() => activeStudy && loadFullCase(activeStudy.id)}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900" data-testid="text-admin-title">{t("pages.adminCaseStudies.caseStudyBuilder2")}</h1>
            <p className="text-sm text-gray-500">{t("pages.adminCaseStudies.createAndManageClinicalCase")}</p>
          </div>
          <Button onClick={() => {
            setShowCreateForm(true);
            setEditTitle(""); setEditTier("rpn"); setEditDifficulty("moderate");
            setEditBodySystem(""); setEditCategory(""); setEditScenarioIntro("");
            setEditRegionScope("BOTH");
          }} data-testid="button-create-new">
            <Plus className="w-4 h-4 mr-1" /> New Case Study
          </Button>
        </div>

        {showCreateForm && (
          <Card className="border-blue-200" data-testid="card-create-form">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">{t("pages.adminCaseStudies.newCaseStudy")}</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowCreateForm(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-500">{t("pages.adminCaseStudies.title2")}</label>
                  <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder={t("pages.adminCaseStudies.caseStudyTitle")} data-testid="input-create-title" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">{t("pages.adminCaseStudies.tier2")}</label>
                  <select value={editTier} onChange={(e) => setEditTier(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm" data-testid="select-create-tier">
                    <option value="rpn">RPN</option>
                    <option value="rn">RN</option>
                    <option value="np">NP</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">{t("pages.adminCaseStudies.difficulty2")}</label>
                  <select value={editDifficulty} onChange={(e) => setEditDifficulty(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm" data-testid="select-create-difficulty">
                    <option value="easy">{t("pages.adminCaseStudies.easy2")}</option>
                    <option value="moderate">{t("pages.adminCaseStudies.moderate2")}</option>
                    <option value="hard">{t("pages.adminCaseStudies.hard2")}</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">{t("pages.adminCaseStudies.bodySystem2")}</label>
                  <Input value={editBodySystem} onChange={(e) => setEditBodySystem(e.target.value)} placeholder="e.g. Cardiac" data-testid="input-create-body-system" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">{t("pages.adminCaseStudies.scenarioIntroduction2")}</label>
                <textarea
                  value={editScenarioIntro}
                  onChange={(e) => setEditScenarioIntro(e.target.value)}
                  rows={3}
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  placeholder={t("pages.adminCaseStudies.describeThePatientScenario")}
                  data-testid="textarea-create-scenario"
                />
              </div>
              <Button onClick={createStudy} disabled={saving} data-testid="button-submit-create">
                Create Case Study
              </Button>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <div className="text-center py-8 text-gray-500">{t("pages.adminCaseStudies.loading")}</div>
        ) : studies.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">{t("pages.adminCaseStudies.noCaseStudiesYetCreate")}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {studies.map((cs) => (
              <Card key={cs.id} className="hover:shadow-sm transition-shadow" data-testid={`card-study-${cs.id}`}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={`text-[10px] ${cs.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {cs.status}
                      </Badge>
                      <Badge variant="outline" className="text-[10px] uppercase">{cs.tier}</Badge>
                      <Badge variant="outline" className="text-[10px]">{cs.difficulty}</Badge>
                    </div>
                    <p className="font-medium text-sm text-gray-900 truncate">{cs.title}</p>
                    <p className="text-xs text-gray-500 truncate">{cs.scenarioIntro}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button size="sm" variant="outline" onClick={() => loadFullCase(cs.id)} data-testid={`button-edit-${cs.id}`}>
                      <Edit3 className="w-3 h-3 mr-1" /> Edit
                    </Button>
                    <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700" onClick={() => deleteStudy(cs.id)} data-testid={`button-delete-${cs.id}`}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StepEditor({
  step,
  expanded,
  onToggle,
  onUpdateStep,
  onDeleteStep,
  onAddQuestion,
  onUpdateQuestion,
  onDeleteQuestion,
  onRefresh,
}: {
  step: Step & { questions: Question[] };
  expanded: boolean;
  onToggle: () => void;
  onUpdateStep: (id: string, updates: any) => Promise<void>;
  onDeleteStep: (id: string) => Promise<void>;
  onAddQuestion: (stepId: string) => Promise<void>;
  onUpdateQuestion: (id: string, updates: any) => Promise<void>;
  onDeleteQuestion: (id: string) => Promise<void>;
  onRefresh: () => void;
}) {
  const { toast } = useToast();
  const [clinText, setClinText] = useState(step.clinicalUpdateText);
  const [exhibitJson, setExhibitJson] = useState(JSON.stringify(step.exhibitData || {}, null, 2));
  const [saving, setSaving] = useState(false);

  const saveStep = async () => {
    setSaving(true);
    let exhibit = {};
    try { exhibit = JSON.parse(exhibitJson); } catch { toast({ title: "Invalid JSON in exhibit data", variant: "destructive" }); setSaving(false); return; }
    await onUpdateStep(step.id, { clinicalUpdateText: clinText, exhibitData: exhibit });
    toast({ title: "Step saved" });
    setSaving(false);
  };

  return (
    <Card className="border" data-testid={`card-step-${step.id}`}>
      <CardContent className="p-0">
        <button onClick={onToggle} className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50" data-testid={`button-toggle-step-${step.id}`}>
          <div className="flex items-center gap-3">
            <GripVertical className="w-4 h-4 text-gray-400" />
            <span className="font-medium text-sm text-gray-900">Step {step.stepNumber}</span>
            <span className="text-xs text-gray-500 truncate max-w-[300px]">{step.clinicalUpdateText.substring(0, 60)}...</span>
            <Badge variant="outline" className="text-[10px]">{step.questions.length} Q</Badge>
          </div>
          {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </button>

        {expanded && (
          <div className="border-t p-4 space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-500">{t("pages.adminCaseStudies.clinicalUpdateText")}</label>
              <textarea
                value={clinText}
                onChange={(e) => setClinText(e.target.value)}
                rows={3}
                className="w-full border rounded-md px-3 py-2 text-sm mt-1"
                data-testid={`textarea-step-text-${step.id}`}
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500">
                Exhibit Data (JSON) — vitals, labs, notes, medications, orders
              </label>
              <textarea
                value={exhibitJson}
                onChange={(e) => setExhibitJson(e.target.value)}
                rows={8}
                className="w-full border rounded-md px-3 py-2 text-xs font-mono mt-1"
                data-testid={`textarea-exhibit-${step.id}`}
              />
              <p className="text-[10px] text-gray-400 mt-1">
                Example: {`{"vitals": [{"name": "HR", "value": "112 bpm", "status": "abnormal"}], "labs": [{"name": "K+", "value": "6.2", "reference": "3.5-5.0"}]}`}
              </p>
            </div>

            <div className="flex gap-2">
              <Button size="sm" onClick={saveStep} disabled={saving} data-testid={`button-save-step-${step.id}`}>
                <Save className="w-3 h-3 mr-1" /> Save Step
              </Button>
              <Button size="sm" variant="ghost" className="text-red-500" onClick={() => onDeleteStep(step.id)} data-testid={`button-delete-step-${step.id}`}>
                <Trash2 className="w-3 h-3 mr-1" /> Delete Step
              </Button>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-gray-700">Questions ({step.questions.length})</h4>
                <Button size="sm" variant="outline" onClick={() => onAddQuestion(step.id)} data-testid={`button-add-question-${step.id}`}>
                  <Plus className="w-3 h-3 mr-1" /> Add Question
                </Button>
              </div>

              <div className="space-y-3">
                {step.questions.map((q) => (
                  <QuestionEditor key={q.id} question={q} onUpdate={onUpdateQuestion} onDelete={onDeleteQuestion} onRefresh={onRefresh} />
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function QuestionEditor({
  question,
  onUpdate,
  onDelete,
  onRefresh,
}: {
  question: Question;
  onUpdate: (id: string, updates: any) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onRefresh: () => void;
}) {
  const { toast } = useToast();
  const [qText, setQText] = useState(question.questionText);
  const [qType, setQType] = useState(question.questionType);
  const [optionsStr, setOptionsStr] = useState(JSON.stringify(question.answerOptions || [], null, 2));
  const [correctStr, setCorrectStr] = useState(JSON.stringify(question.correctAnswer || [], null, 2));
  const [rationale, setRationale] = useState(question.rationale || "");
  const [points, setPoints] = useState(question.points || 1);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    let opts: any[], corr: any;
    try { opts = JSON.parse(optionsStr); } catch { toast({ title: "Invalid options JSON", variant: "destructive" }); setSaving(false); return; }
    try { corr = JSON.parse(correctStr); } catch { toast({ title: "Invalid correct answer JSON", variant: "destructive" }); setSaving(false); return; }

    await onUpdate(question.id, { questionText: qText, questionType: qType, answerOptions: opts, correctAnswer: corr, rationale, points });
    toast({ title: "Question saved" });
    setEditing(false);
    setSaving(false);
    onRefresh();
  };

  if (!editing) {
    return (
      <div className="bg-gray-50 rounded-lg p-3 border" data-testid={`card-question-${question.id}`}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-[10px]">{question.questionType}</Badge>
              <Badge variant="outline" className="text-[10px]">{question.points} pts</Badge>
            </div>
            <p className="text-xs text-gray-700 truncate">{question.questionText}</p>
          </div>
          <div className="flex gap-1 shrink-0">
            <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => setEditing(true)} data-testid={`button-edit-question-${question.id}`}>
              <Edit3 className="w-3 h-3" />
            </Button>
            <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-500" onClick={() => onDelete(question.id)} data-testid={`button-delete-question-${question.id}`}>
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4 border-2 border-blue-200 space-y-3" data-testid={`card-question-edit-${question.id}`}>
      <div>
        <label className="text-xs font-medium text-gray-500">{t("pages.adminCaseStudies.questionText")}</label>
        <textarea value={qText} onChange={(e) => setQText(e.target.value)} rows={2} className="w-full border rounded-md px-3 py-2 text-sm mt-1" data-testid={`textarea-question-${question.id}`} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-gray-500">{t("pages.adminCaseStudies.type")}</label>
          <select value={qType} onChange={(e) => setQType(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm" data-testid={`select-question-type-${question.id}`}>
            <option value="multiple_choice">{t("pages.adminCaseStudies.multipleChoice")}</option>
            <option value="multiple_response">{t("pages.adminCaseStudies.multipleResponseSata")}</option>
            <option value="bowtie">{t("pages.adminCaseStudies.bowtie")}</option>
            <option value="priority">{t("pages.adminCaseStudies.priorityordering")}</option>
            <option value="drag_drop">{t("pages.adminCaseStudies.dragDrop")}</option>
            <option value="fill_blank">{t("pages.adminCaseStudies.fillInTheBlank")}</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500">{t("pages.adminCaseStudies.points")}</label>
          <Input type="number" value={points} onChange={(e) => setPoints(parseInt(e.target.value) || 1)} min={1} data-testid={`input-points-${question.id}`} />
        </div>
      </div>
      <div>
        <label className="text-xs font-medium text-gray-500">{t("pages.adminCaseStudies.answerOptionsJsonArray")}</label>
        <textarea value={optionsStr} onChange={(e) => setOptionsStr(e.target.value)} rows={4} className="w-full border rounded-md px-3 py-2 text-xs font-mono mt-1" data-testid={`textarea-options-${question.id}`} />
      </div>
      <div>
        <label className="text-xs font-medium text-gray-500">{t("pages.adminCaseStudies.correctAnswerJson")}</label>
        <textarea value={correctStr} onChange={(e) => setCorrectStr(e.target.value)} rows={2} className="w-full border rounded-md px-3 py-2 text-xs font-mono mt-1" data-testid={`textarea-correct-${question.id}`} />
      </div>
      <div>
        <label className="text-xs font-medium text-gray-500">{t("pages.adminCaseStudies.rationale")}</label>
        <textarea value={rationale} onChange={(e) => setRationale(e.target.value)} rows={2} className="w-full border rounded-md px-3 py-2 text-sm mt-1" data-testid={`textarea-rationale-${question.id}`} />
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={save} disabled={saving} data-testid={`button-save-question-${question.id}`}>
          <Save className="w-3 h-3 mr-1" /> Save
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>{t("pages.adminCaseStudies.cancel")}</Button>
      </div>
    </div>
  );
}
