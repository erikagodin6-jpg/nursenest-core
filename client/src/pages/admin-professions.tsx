import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { useI18n } from "@/lib/i18n";
import {
  Plus, Settings, Rocket, Trash2, ChevronRight, BarChart3,
  BookOpen, FileText, Brain, Target, Globe, Eye, Pencil, X,
  CheckCircle2, Clock, AlertTriangle, Users, Layers
} from "lucide-react";

interface Profession {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  description: string;
  icon: string;
  color: string;
  colorAccent: string;
  routePrefix: string;
  examNames: string[];
  domains: string[];
  tiers: { id: string; name: string; level: number }[];
  modules: Record<string, boolean>;
  pricing: Record<string, any>;
  country: string;
  status: string;
  sortOrder: number;
  questionCount: number;
  userCount: number;
  imageUrl: string | null;
  hubTitle: string | null;
  hubDescription: string | null;
  createdAt: string;
  launchedAt: string | null;
}

const MODULE_OPTIONS = [
  { key: "lessons", label: "Lessons", icon: BookOpen },
  { key: "flashcards", label: "Flashcards", icon: Brain },
  { key: "practiceExams", label: "Practice Exams", icon: FileText },
  { key: "adaptiveExams", label: "Adaptive Exams", icon: Target },
  { key: "imageAssets", label: "Image Assets", icon: Eye },
  { key: "seoPages", label: "SEO Pages", icon: Globe },
  { key: "studyPacks", label: "Study Packs", icon: Layers },
];

const STATUS_BADGES: Record<string, { label: string; className: string; Icon: any }> = {
  draft: { label: "Draft", className: "bg-gray-100 text-gray-700", Icon: Clock },
  active: { label: "Active", className: "bg-blue-100 text-blue-700", Icon: CheckCircle2 },
  launched: { label: "Launched", className: "bg-green-100 text-green-700", Icon: Rocket },
};

const DEFAULT_PROFESSIONS = [
  { name: "Radiography", shortName: "Rad Tech", slug: "radiography", routePrefix: "/radiography", examNames: ["ARRT", "CAMRT"], domains: ["Radiographic Positioning", "Radiation Physics", "Patient Care", "Image Production"], color: "#8B5CF6", colorAccent: "#EDE9FE" },
  { name: "Respiratory Therapy", shortName: "RRT", slug: "respiratory-therapy", routePrefix: "/respiratory-therapy", examNames: ["NBRC TMC", "NBRC CSE"], domains: ["Patient Assessment", "Airway Management", "Ventilator Management", "ABG Interpretation"], color: "#2196F3", colorAccent: "#E3F2FD" },
  { name: "Pharmacy Technician", shortName: "Pharm Tech", slug: "pharmacy-technician", routePrefix: "/pharmacy-technician", examNames: ["PTCB", "ExCPT"], domains: ["Pharmacology", "Dosage Calculations", "Compounding", "Drug Interactions"], color: "#4CAF50", colorAccent: "#E8F5E9" },
  { name: "Paramedic", shortName: "Paramedic", slug: "paramedic-cert", routePrefix: "/paramedic-cert", examNames: ["NREMT", "COPR"], domains: ["Trauma", "Medical Emergencies", "Cardiac/ACLS", "Pharmacology"], color: "#F44336", colorAccent: "#FFEBEE" },
  { name: "Medical Laboratory Technology", shortName: "MLT", slug: "medical-lab", routePrefix: "/medical-lab", examNames: ["CSMLS", "ASCP"], domains: ["Hematology", "Clinical Chemistry", "Microbiology", "Blood Banking"], color: "#FF9800", colorAccent: "#FFF3E0" },
  { name: "Sonography", shortName: "Sonography", slug: "sonography", routePrefix: "/sonography", examNames: ["ARDMS", "CMA"], domains: ["Abdomen", "OB/GYN", "Vascular", "Physics & Instrumentation"], color: "#E91E63", colorAccent: "#FCE4EC" },
  { name: "Nursing (RPN/RN/NP)", shortName: "Nursing", slug: "nursing-general", routePrefix: "/nursing-general", examNames: ["NCLEX-RN", "NCLEX-PN", "REx-PN"], domains: ["Cardiovascular", "Respiratory", "Neurological", "Pharmacology"], color: "#6C63FF", colorAccent: "#E8E6FF" },
];

export default function AdminProfessionsPage() {
  const { t } = useI18n();
  const { isAdmin } = useAuth();
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Profession>>({});
  const [activeTab, setActiveTab] = useState<"list" | "templates">("list");

  const { data: professions = [], isLoading } = useQuery<Profession[]>({
    queryKey: ["/api/professions/all"],
    enabled: isAdmin,
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<Profession>) => apiRequest("POST", "/api/admin/professions", data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/professions/all"] }); setShowForm(false); setFormData({}); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Profession> }) => apiRequest("PUT", `/api/admin/professions/${id}`, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/professions/all"] }); setEditingId(null); setFormData({}); },
  });

  const launchMutation = useMutation({
    mutationFn: (id: string) => apiRequest("POST", `/api/admin/professions/${id}/launch`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/professions/all"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/professions/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/professions/all"] }),
  });

  if (!isAdmin) {
    return <div className="p-8 text-center text-gray-500">{t("pages.adminProfessions.adminAccessRequired")}</div>;
  }

  const handleSave = () => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const startEdit = (p: Profession) => {
    setEditingId(p.id);
    setFormData({ ...p });
    setShowForm(true);
  };

  const startCreate = (template?: typeof DEFAULT_PROFESSIONS[0]) => {
    setEditingId(null);
    setFormData(template ? {
      ...template,
      description: "",
      tiers: [{ id: "free", name: "Free", level: 0 }, { id: "basic", name: "Basic", level: 1 }, { id: "advanced", name: "Advanced", level: 2 }],
      modules: { lessons: true, flashcards: true, practiceExams: true, adaptiveExams: true, imageAssets: true, seoPages: true, studyPacks: true },
      status: "draft",
    } : {
      modules: { lessons: true, flashcards: true, practiceExams: true, adaptiveExams: true, imageAssets: true, seoPages: true, studyPacks: true },
      status: "draft",
      tiers: [{ id: "free", name: "Free", level: 0 }],
    });
    setShowForm(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8" data-testid="admin-professions-page">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900" data-testid="text-page-title">{t("pages.adminProfessions.professionManagement")}</h1>
          <p className="text-gray-500 mt-1">{t("pages.adminProfessions.addAndConfigureHealthcareProfessions")}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate("/en/admin/universal-import")} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium" data-testid="button-go-importer">
            <FileText className="w-4 h-4" /> Question Importer
          </button>
          <button onClick={() => startCreate()} className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm font-medium" data-testid="button-add-profession">
            <Plus className="w-4 h-4" /> Add Profession
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        <button onClick={() => setActiveTab("list")} className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === "list" ? "bg-teal-100 text-teal-700" : "bg-gray-100 text-gray-600"}`} data-testid="tab-list">
          All Professions ({professions.length})
        </button>
        <button onClick={() => setActiveTab("templates")} className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === "templates" ? "bg-teal-100 text-teal-700" : "bg-gray-100 text-gray-600"}`} data-testid="tab-templates">
          Quick-Add Templates
        </button>
      </div>

      {activeTab === "templates" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {DEFAULT_PROFESSIONS.map((t) => (
            <div key={t.slug} className="border rounded-xl p-5 hover:shadow-md transition-shadow bg-white" data-testid={`template-${t.slug}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: t.color }}>
                  {t.shortName.substring(0, 2)}
                </div>
                <button onClick={() => startCreate(t)} className="text-xs px-3 py-1 bg-teal-50 text-teal-600 rounded-full font-medium hover:bg-teal-100" data-testid={`button-use-template-${t.slug}`}>
                  Use Template
                </button>
              </div>
              <h3 className="font-semibold text-gray-900">{t.name}</h3>
              <p className="text-xs text-gray-500 mt-1">Exams: {t.examNames.join(", ")}</p>
              <p className="text-xs text-gray-500">{t.domains.length} domains configured</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === "list" && (
        <>
          {isLoading ? (
            <div className="text-center py-12 text-gray-500">{t("pages.adminProfessions.loadingProfessions")}</div>
          ) : professions.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <Layers className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">{t("pages.adminProfessions.noProfessionsYet")}</h3>
              <p className="text-gray-500 mb-6">{t("pages.adminProfessions.startByUsingATemplate")}</p>
              <button onClick={() => setActiveTab("templates")} className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm font-medium" data-testid="button-view-templates">
                View Templates
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {professions.map((p) => {
                const badge = STATUS_BADGES[p.status] || STATUS_BADGES.draft;
                return (
                  <div key={p.id} className="bg-white border rounded-xl p-5 hover:shadow-sm transition-shadow" data-testid={`profession-card-${p.slug}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold" style={{ backgroundColor: p.color }}>
                          {p.shortName.substring(0, 2)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900">{p.name}</h3>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1 ${badge.className}`} data-testid={`badge-status-${p.slug}`}>
                              <badge.Icon className="w-3 h-3" /> {badge.label}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">{p.examNames?.join(", ") || "No exams configured"}</p>
                          <div className="flex gap-4 mt-1 text-xs text-gray-400">
                            <span>{p.domains?.length || 0} domains</span>
                            <span>{p.questionCount || 0} questions</span>
                            <span>{p.userCount || 0} users</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => startEdit(p)} className="p-2 hover:bg-gray-100 rounded-lg" title={t("pages.adminProfessions.edit")} data-testid={`button-edit-${p.slug}`}>
                          <Pencil className="w-4 h-4 text-gray-500" />
                        </button>
                        {p.status !== "launched" && (
                          <button onClick={() => launchMutation.mutate(p.id)} className="p-2 hover:bg-green-50 rounded-lg" title={t("pages.adminProfessions.launch")} data-testid={`button-launch-${p.slug}`}>
                            <Rocket className="w-4 h-4 text-green-600" />
                          </button>
                        )}
                        <button onClick={() => { if (confirm(`Delete ${p.name}?`)) deleteMutation.mutate(p.id); }} className="p-2 hover:bg-red-50 rounded-lg" title={t("pages.adminProfessions.delete")} data-testid={`button-delete-${p.slug}`}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" data-testid="profession-form-modal">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">{editingId ? "Edit Profession" : "Add New Profession"}</h2>
              <button onClick={() => { setShowForm(false); setEditingId(null); }} className="p-2 hover:bg-gray-100 rounded-lg" data-testid="button-close-form">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("pages.adminProfessions.name")}</label>
                  <input value={formData.name || ""} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder={t("pages.adminProfessions.respiratoryTherapy")} data-testid="input-name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("pages.adminProfessions.shortName")}</label>
                  <input value={formData.shortName || ""} onChange={(e) => setFormData({ ...formData, shortName: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="RRT" data-testid="input-short-name" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("pages.adminProfessions.urlSlug")}</label>
                  <input value={formData.slug || ""} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="respiratory-therapy" data-testid="input-slug" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("pages.adminProfessions.routePrefix")}</label>
                  <input value={formData.routePrefix || ""} onChange={(e) => setFormData({ ...formData, routePrefix: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="/respiratory-therapy" data-testid="input-route-prefix" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("pages.adminProfessions.description")}</label>
                <textarea value={formData.description || ""} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" rows={2} placeholder={t("pages.adminProfessions.briefDescriptionOfThisProfession")} data-testid="input-description" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("pages.adminProfessions.brandColor")}</label>
                  <div className="flex gap-2">
                    <input type="color" value={formData.color || "#6C63FF"} onChange={(e) => setFormData({ ...formData, color: e.target.value })} className="w-10 h-10 rounded border cursor-pointer" data-testid="input-color" />
                    <input value={formData.color || "#6C63FF"} onChange={(e) => setFormData({ ...formData, color: e.target.value })} className="flex-1 px-3 py-2 border rounded-lg text-sm" data-testid="input-color-hex" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("pages.adminProfessions.country")}</label>
                  <select value={formData.country || "ALL"} onChange={(e) => setFormData({ ...formData, country: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" data-testid="select-country">
                    <option value="ALL">{t("pages.adminProfessions.allCountries")}</option>
                    <option value="US">{t("pages.adminProfessions.unitedStates")}</option>
                    <option value="CA">{t("pages.adminProfessions.canada")}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("pages.adminProfessions.examNamesCommaseparated")}</label>
                <input value={(formData.examNames || []).join(", ")} onChange={(e) => setFormData({ ...formData, examNames: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder={t("pages.adminProfessions.nbrcTmcNbrcCse")} data-testid="input-exam-names" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("pages.adminProfessions.domainsCommaseparated")}</label>
                <input value={(formData.domains || []).join(", ")} onChange={(e) => setFormData({ ...formData, domains: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder={t("pages.adminProfessions.patientAssessmentAirwayManagement")} data-testid="input-domains" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t("pages.adminProfessions.enabledModules")}</label>
                <div className="grid grid-cols-2 gap-2">
                  {MODULE_OPTIONS.map((m) => (
                    <label key={m.key} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" checked={(formData.modules as any)?.[m.key] ?? true} onChange={(e) => setFormData({ ...formData, modules: { ...(formData.modules || {}), [m.key]: e.target.checked } })} className="rounded" data-testid={`checkbox-module-${m.key}`} />
                      <m.icon className="w-4 h-4 text-gray-500" />
                      {m.label}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("pages.adminProfessions.status")}</label>
                <select value={formData.status || "draft"} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" data-testid="select-status">
                  <option value="draft">{t("pages.adminProfessions.draft")}</option>
                  <option value="active">{t("pages.adminProfessions.active")}</option>
                  <option value="launched">{t("pages.adminProfessions.launched")}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("pages.adminProfessions.hubTitleOptional")}</label>
                <input value={formData.hubTitle || ""} onChange={(e) => setFormData({ ...formData, hubTitle: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder={t("pages.adminProfessions.yourRespiratoryTherapyExamPrep")} data-testid="input-hub-title" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("pages.adminProfessions.hubDescriptionOptional")}</label>
                <textarea value={formData.hubDescription || ""} onChange={(e) => setFormData({ ...formData, hubDescription: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" rows={2} data-testid="input-hub-description" />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
              <button onClick={() => { setShowForm(false); setEditingId(null); }} className="px-4 py-2 text-sm text-gray-600 border rounded-lg hover:bg-gray-50" data-testid="button-cancel-form">
                Cancel
              </button>
              <button onClick={handleSave} disabled={!formData.name || !formData.slug || !formData.routePrefix} className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm font-medium disabled:opacity-50" data-testid="button-save-profession">
                {editingId ? "Update Profession" : "Create Profession"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
