import { useState, useEffect, useCallback } from "react";
import { useI18n } from "@/lib/i18n";
import {
  Plus, Edit3, Trash2, Eye, EyeOff, Save, X, ChevronDown, ChevronUp,
  Radio, Loader2, CheckCircle2, AlertTriangle, Search
} from "lucide-react";

interface DecisionPoint {
  id: string;
  prompt: string;
  choices: { label: string; isCorrect: boolean; feedback: string }[];
}

interface ScenarioForm {
  title: string;
  category: string;
  professionTrack: string;
  region: string;
  visibilityTier: string;
  difficulty: number;
  examRelevance: string;
  dispatchInfo: string;
  sceneDescription: string;
  sceneSafety: string;
  primaryAssessment: string;
  secondaryAssessment: string;
  vitalSigns: Record<string, string>;
  history: Record<string, any>;
  decisionPoints: DecisionPoint[];
  correctInterventions: string[];
  commonErrors: string[];
  debrief: string;
  learningObjectives: string[];
  relatedLessonSlugs: string[];
  status: string;
}

const EMPTY_FORM: ScenarioForm = {
  title: "",
  category: "Medical Emergencies",
  professionTrack: "General",
  region: "BOTH",
  visibilityTier: "free",
  difficulty: 3,
  examRelevance: "medium",
  dispatchInfo: "",
  sceneDescription: "",
  sceneSafety: "",
  primaryAssessment: "",
  secondaryAssessment: "",
  vitalSigns: {},
  history: {},
  decisionPoints: [],
  correctInterventions: [],
  commonErrors: [],
  debrief: "",
  learningObjectives: [],
  relatedLessonSlugs: [],
  status: "draft",
};

const CATEGORIES = [
  "Trauma", "Medical Emergencies", "Cardiac/ACLS", "Pediatric/PALS",
  "OB Emergencies", "Pharmacology", "Airway Management", "Assessment", "Operations", "Legal/Ethics"
];

const TRACKS = ["General", "PCP", "ACP", "NREMT", "EMT"];

const VITALS_KEYS = ["hr", "bp", "rr", "spo2", "temp", "gcs", "glucose", "etco2"];

async function apiFetch(url: string, opts?: RequestInit) {
  const { t } = useI18n();
  const adminId = "d9b0e5b3-83c7-4e08-b6b7-6cf9cc33b225";
  const sep = url.includes("?") ? "&" : "?";
  const res = await fetch(`${url}${sep}adminId=${adminId}`, {
    ...opts,
    headers: { "Content-Type": "application/json", "x-admin-id": adminId, ...(opts?.headers || {}) },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

function ArrayEditor({ label, items, onChange }: { label: string; items: string[]; onChange: (items: string[]) => void }) {
  const [newItem, setNewItem] = useState("");
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <div className="space-y-1 mb-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <input
              type="text"
              value={item}
              onChange={(e) => { const copy = [...items]; copy[i] = e.target.value; onChange(copy); }}
              className="flex-1 px-2 py-1 border border-gray-200 rounded text-sm"
            />
            <button onClick={() => onChange(items.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder={`Add ${label.toLowerCase()}`}
          className="flex-1 px-2 py-1 border border-gray-200 rounded text-sm"
          onKeyDown={(e) => { if (e.key === "Enter" && newItem.trim()) { onChange([...items, newItem.trim()]); setNewItem(""); } }}
        />
        <button
          onClick={() => { if (newItem.trim()) { onChange([...items, newItem.trim()]); setNewItem(""); } }}
          className="px-2 py-1 text-xs bg-teal-50 text-teal-700 rounded hover:bg-teal-100"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

function DecisionPointEditor({ dp, onChange, onRemove }: {
  dp: DecisionPoint;
  onChange: (dp: DecisionPoint) => void;
  onRemove: () => void;
}) {
  const [expanded, setExpanded] = useState(true);

  const addChoice = () => {
    onChange({
      ...dp,
      choices: [...dp.choices, { label: "", isCorrect: false, feedback: "" }],
    });
  };

  const updateChoice = (idx: number, field: string, value: any) => {
    const choices = [...dp.choices];
    if (field === "isCorrect" && value === true) {
      choices.forEach((c, i) => { if (i !== idx) c.isCorrect = false; });
    }
    (choices[idx] as any)[field] = value;
    onChange({ ...dp, choices });
  };

  const removeChoice = (idx: number) => {
    onChange({ ...dp, choices: dp.choices.filter((_, i) => i !== idx) });
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-2 text-sm font-medium text-gray-700">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          Decision Point: {dp.prompt.slice(0, 50) || "(empty)"}...
        </button>
        <button onClick={onRemove} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
      </div>
      {expanded && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t("allied.scenarioAdmin.promptQuestion")}</label>
            <textarea
              value={dp.prompt}
              onChange={(e) => onChange({ ...dp, prompt: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-600">{t("allied.scenarioAdmin.choices")}</span>
              <button onClick={addChoice} className="text-xs text-teal-600 hover:text-teal-700 flex items-center gap-1">
                <Plus className="w-3 h-3" /> Add Choice
              </button>
            </div>
            {dp.choices.map((choice, idx) => (
              <div key={idx} className="border border-gray-100 rounded-lg p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-500 w-4">{String.fromCharCode(65 + idx)}</span>
                  <input
                    type="text"
                    value={choice.label}
                    onChange={(e) => updateChoice(idx, "label", e.target.value)}
                    placeholder={t("allied.scenarioAdmin.choiceText")}
                    className="flex-1 px-2 py-1 border border-gray-200 rounded text-sm"
                  />
                  <label className="flex items-center gap-1 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={choice.isCorrect}
                      onChange={(e) => updateChoice(idx, "isCorrect", e.target.checked)}
                      className="accent-teal-600"
                    />
                    <span className={choice.isCorrect ? "text-green-700 font-medium" : "text-gray-500"}>{t("allied.scenarioAdmin.correct")}</span>
                  </label>
                  <button onClick={() => removeChoice(idx)} className="text-red-400 hover:text-red-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <input
                  type="text"
                  value={choice.feedback}
                  onChange={(e) => updateChoice(idx, "feedback", e.target.value)}
                  placeholder={t("allied.scenarioAdmin.feedbackExplanation")}
                  className="w-full px-2 py-1 border border-gray-200 rounded text-sm ml-6"
                  style={{ width: "calc(100% - 1.5rem)" }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function ScenarioAdminPanel() {
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<ScenarioForm>({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadScenarios = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter) params.set("status", statusFilter);
      if (searchQuery) params.set("search", searchQuery);
      const data = await apiFetch(`/api/allied/scenarios/admin/all?${params}`);
      setScenarios(data);
    } catch (e: any) {
      console.error("Failed to load scenarios:", e);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchQuery]);

  useEffect(() => { loadScenarios(); }, [loadScenarios]);

  const startCreate = () => {
    setForm({ ...EMPTY_FORM });
    setCreating(true);
    setEditing(null);
  };

  const startEdit = (sc: any) => {
    setForm({
      title: sc.title || "",
      category: sc.category || "Medical Emergencies",
      professionTrack: sc.professionTrack || "General",
      region: sc.region || "BOTH",
      visibilityTier: sc.visibilityTier || "free",
      difficulty: sc.difficulty || 3,
      examRelevance: sc.examRelevance || "medium",
      dispatchInfo: sc.dispatchInfo || "",
      sceneDescription: sc.sceneDescription || "",
      sceneSafety: sc.sceneSafety || "",
      primaryAssessment: sc.primaryAssessment || "",
      secondaryAssessment: sc.secondaryAssessment || "",
      vitalSigns: sc.vitalSigns || {},
      history: sc.history || {},
      decisionPoints: sc.decisionPoints || [],
      correctInterventions: sc.correctInterventions || [],
      commonErrors: sc.commonErrors || [],
      debrief: sc.debrief || "",
      learningObjectives: sc.learningObjectives || [],
      relatedLessonSlugs: sc.relatedLessonSlugs || [],
      status: sc.status || "draft",
    });
    setEditing(sc.id);
    setCreating(false);
  };

  const cancelEdit = () => {
    setEditing(null);
    setCreating(false);
    setForm({ ...EMPTY_FORM });
  };

  const handleSave = async () => {
    if (!form.title || !form.dispatchInfo || !form.sceneDescription || !form.sceneSafety || !form.primaryAssessment || !form.secondaryAssessment) {
      showToast("Fill in all required fields: title, dispatch, scene, safety, primary & secondary assessment", "error");
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await apiFetch(`/api/allied/scenarios/${editing}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
        showToast("Scenario updated successfully");
      } else {
        await apiFetch("/api/allied/scenarios", {
          method: "POST",
          body: JSON.stringify(form),
        });
        showToast("Scenario created successfully");
      }
      cancelEdit();
      loadScenarios();
    } catch (e: any) {
      showToast(e.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "published" ? "draft" : "published";
    try {
      await apiFetch(`/api/allied/scenarios/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      showToast(`Scenario ${newStatus === "published" ? "published" : "unpublished"}`);
      loadScenarios();
    } catch (e: any) {
      showToast(e.message, "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this scenario permanently?")) return;
    try {
      await apiFetch(`/api/allied/scenarios/${id}`, { method: "DELETE" });
      showToast("Scenario deleted");
      loadScenarios();
    } catch (e: any) {
      showToast(e.message, "error");
    }
  };

  const addDecisionPoint = () => {
    setForm(prev => ({
      ...prev,
      decisionPoints: [
        ...prev.decisionPoints,
        { id: `dp-${Date.now()}`, prompt: "", choices: [
          { label: "", isCorrect: true, feedback: "" },
          { label: "", isCorrect: false, feedback: "" },
          { label: "", isCorrect: false, feedback: "" },
          { label: "", isCorrect: false, feedback: "" },
        ] },
      ],
    }));
  };

  const updateVital = (key: string, value: string) => {
    setForm(prev => ({
      ...prev,
      vitalSigns: { ...prev.vitalSigns, [key]: value },
    }));
  };

  const updateHistory = (key: string, value: any) => {
    setForm(prev => ({
      ...prev,
      history: { ...prev.history, [key]: value },
    }));
  };

  const isFormOpen = creating || editing;

  return (
    <div className="space-y-6" data-testid="scenario-admin-panel">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl text-sm font-medium shadow-lg ${
          toast.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
        }`}>
          {toast.msg}
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Radio className="w-5 h-5 text-red-500" /> Paramedic Scenario Manager
        </h2>
        {!isFormOpen && (
          <button onClick={startCreate} className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700" data-testid="button-create-scenario">
            <Plus className="w-4 h-4" /> New Scenario
          </button>
        )}
      </div>

      {!isFormOpen && (
        <div className="flex gap-3 items-center">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("allied.scenarioAdmin.searchScenarios")}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm"
              data-testid="input-search-scenarios"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
            data-testid="select-status-filter"
          >
            <option value="">{t("allied.scenarioAdmin.allStatus")}</option>
            <option value="draft">{t("allied.scenarioAdmin.draft")}</option>
            <option value="published">{t("allied.scenarioAdmin.published")}</option>
            <option value="archived">{t("allied.scenarioAdmin.archived")}</option>
          </select>
        </div>
      )}

      {isFormOpen && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">{editing ? "Edit Scenario" : "Create New Scenario"}</h3>
            <button onClick={cancelEdit} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">{t("allied.scenarioAdmin.title")}</label>
              <input type="text" value={form.title} onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="e.g., Chest Pain with STEMI Recognition" data-testid="input-scenario-title" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">{t("allied.scenarioAdmin.category")}</label>
              <select value={form.category} onChange={(e) => setForm(p => ({ ...p, category: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" data-testid="select-scenario-category">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">{t("allied.scenarioAdmin.professionTrack")}</label>
              <select value={form.professionTrack} onChange={(e) => setForm(p => ({ ...p, professionTrack: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" data-testid="select-scenario-track">
                {TRACKS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">{t("allied.scenarioAdmin.difficulty15")}</label>
              <select value={form.difficulty} onChange={(e) => setForm(p => ({ ...p, difficulty: parseInt(e.target.value) }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" data-testid="select-scenario-difficulty">
                {[1, 2, 3, 4, 5].map(d => <option key={d} value={d}>{d} - {["Easy", "Moderate", "Intermediate", "Advanced", "Expert"][d - 1]}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">{t("allied.scenarioAdmin.examRelevance")}</label>
              <select value={form.examRelevance} onChange={(e) => setForm(p => ({ ...p, examRelevance: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" data-testid="select-exam-relevance">
                <option value="low">{t("allied.scenarioAdmin.low")}</option>
                <option value="medium">{t("allied.scenarioAdmin.medium")}</option>
                <option value="high">{t("allied.scenarioAdmin.high")}</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">{t("allied.scenarioAdmin.visibilityTier")}</label>
              <select value={form.visibilityTier} onChange={(e) => setForm(p => ({ ...p, visibilityTier: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" data-testid="select-visibility-tier">
                <option value="free">{t("allied.scenarioAdmin.free")}</option>
                <option value="pcp">{t("allied.scenarioAdmin.pcpTier")}</option>
                <option value="acp">{t("allied.scenarioAdmin.acpTier")}</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">{t("allied.scenarioAdmin.region")}</label>
              <select value={form.region} onChange={(e) => setForm(p => ({ ...p, region: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" data-testid="select-region">
                <option value="BOTH">{t("allied.scenarioAdmin.bothUsCa")}</option>
                <option value="US">{t("allied.scenarioAdmin.usOnly")}</option>
                <option value="CA">{t("allied.scenarioAdmin.canadaOnly")}</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">{t("allied.scenarioAdmin.status")}</label>
              <select value={form.status} onChange={(e) => setForm(p => ({ ...p, status: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" data-testid="select-scenario-status">
                <option value="draft">{t("allied.scenarioAdmin.draft2")}</option>
                <option value="published">{t("allied.scenarioAdmin.published2")}</option>
                <option value="archived">{t("allied.scenarioAdmin.archived2")}</option>
              </select>
            </div>
          </div>

          <hr className="border-gray-100" />

          <div className="space-y-4">
            <h4 className="font-medium text-gray-800 text-sm">{t("allied.scenarioAdmin.scenarioContent")}</h4>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">{t("allied.scenarioAdmin.dispatchInformation")}</label>
              <textarea value={form.dispatchInfo} onChange={(e) => setForm(p => ({ ...p, dispatchInfo: e.target.value }))} rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder={t("allied.scenarioAdmin.dispatchCallDetails")} data-testid="textarea-dispatch" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">{t("allied.scenarioAdmin.sceneDescription")}</label>
              <textarea value={form.sceneDescription} onChange={(e) => setForm(p => ({ ...p, sceneDescription: e.target.value }))} rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder={t("allied.scenarioAdmin.whatTheCrewSeesOn")} data-testid="textarea-scene" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">{t("allied.scenarioAdmin.sceneSafety")}</label>
              <textarea value={form.sceneSafety} onChange={(e) => setForm(p => ({ ...p, sceneSafety: e.target.value }))} rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder={t("allied.scenarioAdmin.safetyConsiderations")} data-testid="textarea-safety" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">{t("allied.scenarioAdmin.primaryAssessment")}</label>
              <textarea value={form.primaryAssessment} onChange={(e) => setForm(p => ({ ...p, primaryAssessment: e.target.value }))} rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder={t("allied.scenarioAdmin.abcdeFindings")} data-testid="textarea-primary" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">{t("allied.scenarioAdmin.secondaryAssessment")}</label>
              <textarea value={form.secondaryAssessment} onChange={(e) => setForm(p => ({ ...p, secondaryAssessment: e.target.value }))} rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder={t("allied.scenarioAdmin.headtotoeFocusedFindings")} data-testid="textarea-secondary" />
            </div>
          </div>

          <hr className="border-gray-100" />

          <div>
            <h4 className="font-medium text-gray-800 text-sm mb-3">{t("allied.scenarioAdmin.vitalSigns")}</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {VITALS_KEYS.map(key => (
                <div key={key}>
                  <label className="block text-xs text-gray-500 mb-1">{key.toUpperCase()}</label>
                  <input
                    type="text"
                    value={form.vitalSigns[key] || ""}
                    onChange={(e) => updateVital(key, e.target.value)}
                    className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm"
                    placeholder={key === "hr" ? "88" : key === "bp" ? "120/80" : key === "rr" ? "18" : key === "spo2" ? "98%" : ""}
                    data-testid={`input-vital-${key}`}
                  />
                </div>
              ))}
            </div>
          </div>

          <hr className="border-gray-100" />

          <div>
            <h4 className="font-medium text-gray-800 text-sm mb-3">{t("allied.scenarioAdmin.patientHistory")}</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">{t("allied.scenarioAdmin.chiefComplaint")}</label>
                <input type="text" value={form.history.chiefComplaint || ""} onChange={(e) => updateHistory("chiefComplaint", e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" data-testid="input-chief-complaint" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">{t("allied.scenarioAdmin.historyOfPresentIllness")}</label>
                <textarea value={form.history.hpi || ""} onChange={(e) => updateHistory("hpi", e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" data-testid="textarea-hpi" />
              </div>
              <ArrayEditor label={t("allied.scenarioAdmin.pastMedicalHistory")} items={form.history.pmh || []} onChange={(items) => updateHistory("pmh", items)} />
              <ArrayEditor label={t("allied.scenarioAdmin.medications")} items={form.history.medications || []} onChange={(items) => updateHistory("medications", items)} />
              <ArrayEditor label={t("allied.scenarioAdmin.allergies")} items={form.history.allergies || []} onChange={(items) => updateHistory("allergies", items)} />
              <div>
                <label className="block text-xs text-gray-500 mb-1">{t("allied.scenarioAdmin.socialHistory")}</label>
                <input type="text" value={form.history.socialHistory || ""} onChange={(e) => updateHistory("socialHistory", e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" data-testid="input-social-history" />
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-800 text-sm">{t("allied.scenarioAdmin.decisionPoints")}</h4>
              <button onClick={addDecisionPoint} className="text-xs text-teal-600 hover:text-teal-700 flex items-center gap-1" data-testid="button-add-decision-point">
                <Plus className="w-3 h-3" /> Add Decision Point
              </button>
            </div>
            <div className="space-y-3">
              {form.decisionPoints.map((dp, i) => (
                <DecisionPointEditor
                  key={dp.id}
                  dp={dp}
                  onChange={(updated) => {
                    const copy = [...form.decisionPoints];
                    copy[i] = updated;
                    setForm(prev => ({ ...prev, decisionPoints: copy }));
                  }}
                  onRemove={() => setForm(prev => ({ ...prev, decisionPoints: prev.decisionPoints.filter((_, idx) => idx !== i) }))}
                />
              ))}
              {form.decisionPoints.length === 0 && (
                <p className="text-xs text-gray-400 italic">{t("allied.scenarioAdmin.noDecisionPointsYetAdd")}</p>
              )}
            </div>
          </div>

          <hr className="border-gray-100" />

          <div className="space-y-4">
            <ArrayEditor label={t("allied.scenarioAdmin.correctInterventions")} items={form.correctInterventions} onChange={(items) => setForm(p => ({ ...p, correctInterventions: items }))} />
            <ArrayEditor label={t("allied.scenarioAdmin.commonErrors")} items={form.commonErrors} onChange={(items) => setForm(p => ({ ...p, commonErrors: items }))} />
            <ArrayEditor label={t("allied.scenarioAdmin.learningObjectives")} items={form.learningObjectives} onChange={(items) => setForm(p => ({ ...p, learningObjectives: items }))} />
            <ArrayEditor label={t("allied.scenarioAdmin.relatedLessonSlugs")} items={form.relatedLessonSlugs} onChange={(items) => setForm(p => ({ ...p, relatedLessonSlugs: items }))} />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">{t("allied.scenarioAdmin.debriefSummary")}</label>
            <textarea value={form.debrief} onChange={(e) => setForm(p => ({ ...p, debrief: e.target.value }))} rows={4} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder={t("allied.scenarioAdmin.overallDebriefAndClinicalTakeaways")} data-testid="textarea-debrief" />
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 disabled:opacity-50" data-testid="button-save-scenario">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {editing ? "Update Scenario" : "Create Scenario"}
            </button>
            <button onClick={cancelEdit} className="px-4 py-2.5 text-sm text-gray-600 hover:text-gray-800" data-testid="button-cancel-edit">{t("allied.scenarioAdmin.cancel")}</button>
          </div>
        </div>
      )}

      {!isFormOpen && (
        <div className="space-y-3">
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 text-teal-500 animate-spin" /></div>
          ) : scenarios.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Radio className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm">{t("allied.scenarioAdmin.noScenariosFoundCreateOne")}</p>
            </div>
          ) : (
            scenarios.map((sc) => (
              <div key={sc.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4" data-testid={`admin-scenario-${sc.id}`}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900 truncate">{sc.title}</h4>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      sc.status === "published" ? "bg-green-100 text-green-700" :
                      sc.status === "archived" ? "bg-gray-100 text-gray-500" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>{sc.status}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>{sc.category}</span>
                    <span>Difficulty: {sc.difficulty}</span>
                    <span>{sc.professionTrack}</span>
                    <span>{sc.decisionPoints?.length || 0} decisions</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleToggleStatus(sc.id, sc.status)} className="p-2 text-gray-400 hover:text-teal-600 rounded-lg hover:bg-teal-50" title={sc.status === "published" ? "Unpublish" : "Publish"} data-testid={`button-toggle-${sc.id}`}>
                    {sc.status === "published" ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button onClick={() => startEdit(sc)} className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50" title={t("allied.scenarioAdmin.edit")} data-testid={`button-edit-${sc.id}`}>
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(sc.id)} className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50" title={t("allied.scenarioAdmin.delete")} data-testid={`button-delete-${sc.id}`}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
