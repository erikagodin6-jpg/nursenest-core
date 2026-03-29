import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/lib/auth";
import { SEO } from "@/components/seo";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { useI18n } from "@/lib/i18n";
import {
  Image, Plus, Trash2, Edit2, Check, X, Filter,
  Layers, Target, GitCompare, Bone, Atom, FileText,
  ChevronDown, ChevronUp, BarChart3, Clock, AlertTriangle,
  Crosshair, Database
} from "lucide-react";

type Tab = "positioning" | "assets" | "artifacts" | "comparisons" | "anatomy" | "physics-visuals" | "briefs";

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-blue-100 text-blue-700",
  published: "bg-green-100 text-green-700",
  in_progress: "bg-indigo-100 text-indigo-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const TABS: { key: Tab; label: string; icon: typeof Image }[] = [
  { key: "positioning", label: "Positioning", icon: Crosshair },
  { key: "assets", label: "Image Assets", icon: Image },
  { key: "artifacts", label: "Artifacts", icon: AlertTriangle },
  { key: "comparisons", label: "Comparisons", icon: GitCompare },
  { key: "anatomy", label: "Anatomy", icon: Bone },
  { key: "physics-visuals", label: "Physics Visuals", icon: Atom },
  { key: "briefs", label: "Image Briefs", icon: FileText },
];

const ASSET_CATEGORIES = [
  "positioning_diagram", "anatomy_diagram", "exam_image", "artifact_example",
  "quality_control_example", "comparison_image", "physics_visual",
  "lesson_illustration", "study_pack_cover", "thumbnail_preview",
];

const ARTIFACT_TYPES = [
  "motion_artifact", "grid_cutoff", "quantum_mottle", "underexposure",
  "overexposure", "rotation", "poor_collimation", "clipped_anatomy",
  "noise", "marker_issues",
];

const COMPARISON_TYPES = [
  "collimation", "positioning", "exposure", "motion", "anatomy_coverage",
  "marker_placement", "grid_alignment", "shielding", "rotation", "technique",
];

const BODY_REGIONS = [
  "chest", "abdomen", "pelvis", "cervical_spine", "thoracic_spine",
  "lumbar_spine", "hand", "wrist", "forearm", "elbow", "shoulder",
  "knee", "ankle", "foot", "skull", "sinus", "upper_extremity", "lower_extremity",
];

const BRIEF_CATEGORIES = [...ASSET_CATEGORIES];
const PRIORITIES = ["low", "medium", "high", "urgent"];

export default function AdminImageLibrary() {
  const { t } = useI18n();
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("positioning");
  const [statusFilter, setStatusFilter] = useState("");
  const queryClient = useQueryClient();

  const { data: stats } = useQuery({
    queryKey: ["/api/imaging/library-stats"],
    queryFn: () => apiRequest("GET", "/api/imaging/library-stats").then(r => r.json()),
  });

  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("pages.adminImageLibrary.accessDenied")}</h1>
        <p className="text-gray-600">{t("pages.adminImageLibrary.youNeedAdminAccessTo")}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="admin-image-library-page">
      <SEO title={t("pages.adminImageLibrary.adminImagingLibrary")} description={t("pages.adminImageLibrary.manageRadiographyImageAndDiagram")} noindex />

      <BreadcrumbNav items={[
        { name: "Home", url: "/" },
        { name: "Admin", url: "/admin" },
        { name: "Image Library", url: "/admin/image-library" },
      ]} />

      <div className="flex items-center gap-3 mb-6">
        <Layers className="w-8 h-8 text-indigo-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900" data-testid="text-image-library-title">{t("pages.adminImageLibrary.radiographyImageDiagramLibrary")}</h1>
          <p className="text-sm text-gray-500">{t("pages.adminImageLibrary.manageImageAssetsArtifactsComparisons")}</p>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
          {[
            { label: "Positioning", value: stats.positioningEntries, color: "text-rose-600" },
            { label: "Assets", value: stats.imageAssets, color: "text-blue-600" },
            { label: "Artifacts", value: stats.artifactImages, color: "text-orange-600" },
            { label: "Comparisons", value: stats.comparisonSets, color: "text-purple-600" },
            { label: "Anatomy", value: stats.anatomyImages, color: "text-green-600" },
            { label: "Visuals", value: stats.physicsVisuals, color: "text-cyan-600" },
            { label: "Briefs", value: stats.imageBriefs, color: "text-yellow-600" },
            { label: "Total", value: stats.totalAssets, color: "text-indigo-600" },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-lg border p-3 text-center" data-testid={`stat-${s.label.toLowerCase()}`}>
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-6">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.key ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            data-testid={`tab-${tab.key}`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
          data-testid="select-status-filter"
        >
          <option value="">{t("pages.adminImageLibrary.allStatuses")}</option>
          <option value="draft">{t("pages.adminImageLibrary.draft")}</option>
          <option value="pending">{t("pages.adminImageLibrary.pending")}</option>
          <option value="approved">{t("pages.adminImageLibrary.approved")}</option>
          <option value="published">{t("pages.adminImageLibrary.published")}</option>
        </select>
      </div>

      {activeTab === "positioning" && <PositioningEntriesTab statusFilter={statusFilter} />}
      {activeTab === "assets" && <ImageAssetsTab statusFilter={statusFilter} />}
      {activeTab === "artifacts" && <ArtifactImagesTab statusFilter={statusFilter} />}
      {activeTab === "comparisons" && <ComparisonSetsTab statusFilter={statusFilter} />}
      {activeTab === "anatomy" && <AnatomyImagesTab statusFilter={statusFilter} />}
      {activeTab === "physics-visuals" && <PhysicsVisualsTab statusFilter={statusFilter} />}
      {activeTab === "briefs" && <ImageBriefsTab statusFilter={statusFilter} />}
    </div>
  );
}

function PositioningEntriesTab({ statusFilter }: { statusFilter: string }) {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [bodyRegionFilter, setBodyRegionFilter] = useState("");
  const [form, setForm] = useState({
    projectionName: "", bodyPart: "", bodyRegion: "", patientPosition: "",
    detectorPlacement: "", centralRay: "", filmSize: "", sid: "",
    anatomyDemonstrated: "", tips: "", imageUrl: "",
    teachingImageUrl: "", examImageUrl: "", status: "draft",
    commonErrors: "",
  });

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["/api/imaging/positioning-entries", statusFilter, bodyRegionFilter],
    queryFn: () => {
      const params = new URLSearchParams();
      if (statusFilter) params.set("status", statusFilter);
      if (bodyRegionFilter) params.set("bodyRegion", bodyRegionFilter);
      const qs = params.toString();
      return apiRequest("GET", `/api/imaging/positioning-entries${qs ? `?${qs}` : ""}`).then(r => r.json());
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/imaging/positioning-entries", data).then(r => r.json()),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/imaging/positioning-entries"] }); queryClient.invalidateQueries({ queryKey: ["/api/imaging/library-stats"] }); setShowForm(false); resetForm(); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => apiRequest("PATCH", `/api/imaging/positioning-entries/${id}`, data).then(r => r.json()),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/imaging/positioning-entries"] }); setEditId(null); resetForm(); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/imaging/positioning-entries/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/imaging/positioning-entries"] }); queryClient.invalidateQueries({ queryKey: ["/api/imaging/library-stats"] }); },
  });

  const seedMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/imaging/seed-library", {}).then(r => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/imaging/positioning-entries"] });
      queryClient.invalidateQueries({ queryKey: ["/api/imaging/artifact-images"] });
      queryClient.invalidateQueries({ queryKey: ["/api/imaging/comparison-sets"] });
      queryClient.invalidateQueries({ queryKey: ["/api/imaging/anatomy-images"] });
      queryClient.invalidateQueries({ queryKey: ["/api/imaging/library-stats"] });
    },
  });

  function resetForm() {
    setForm({ projectionName: "", bodyPart: "", bodyRegion: "", patientPosition: "", detectorPlacement: "", centralRay: "", filmSize: "", sid: "", anatomyDemonstrated: "", tips: "", imageUrl: "", teachingImageUrl: "", examImageUrl: "", status: "draft", commonErrors: "" });
  }

  function startEdit(item: any) {
    setEditId(item.id);
    setForm({
      projectionName: item.projectionName || "", bodyPart: item.bodyPart || "",
      bodyRegion: item.bodyRegion || "", patientPosition: item.patientPosition || "",
      detectorPlacement: item.detectorPlacement || "", centralRay: item.centralRay || "",
      filmSize: item.filmSize || "", sid: item.sid || "",
      anatomyDemonstrated: item.anatomyDemonstrated || "", tips: item.tips || "",
      imageUrl: item.imageUrl || "", teachingImageUrl: item.teachingImageUrl || "",
      examImageUrl: item.examImageUrl || "", status: item.status || "draft",
      commonErrors: Array.isArray(item.commonErrors) ? item.commonErrors.join(", ") : "",
    });
    setShowForm(true);
  }

  function handleSubmit() {
    const data: any = { ...form, commonErrors: form.commonErrors ? form.commonErrors.split(",").map((s: string) => s.trim()).filter(Boolean) : [] };
    if (editId) { updateMutation.mutate({ id: editId, data }); } else { createMutation.mutate(data); }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <h2 className="text-lg font-semibold" data-testid="text-positioning-heading">Positioning Entries ({items.length})</h2>
        <div className="flex gap-2">
          <select value={bodyRegionFilter} onChange={e => setBodyRegionFilter(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm" data-testid="select-positioning-body-region-filter">
            <option value="">{t("pages.adminImageLibrary.allRegions")}</option>
            {BODY_REGIONS.map(r => <option key={r} value={r}>{r.replace(/_/g, " ")}</option>)}
          </select>
          <button onClick={() => seedMutation.mutate()}
            disabled={seedMutation.isPending}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 disabled:opacity-50"
            data-testid="button-seed-library">
            <Database className="w-4 h-4" /> {seedMutation.isPending ? "Seeding..." : "Seed All Libraries"}
          </button>
          <button onClick={() => { setShowForm(!showForm); setEditId(null); resetForm(); }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
            data-testid="button-add-positioning">
            <Plus className="w-4 h-4" /> Add Entry
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white border rounded-lg p-4 mb-4 space-y-3" data-testid="form-positioning">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <input placeholder={t("pages.adminImageLibrary.projectionName")} value={form.projectionName} onChange={e => setForm({ ...form, projectionName: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" data-testid="input-positioning-projection-name" />
            <input placeholder={t("pages.adminImageLibrary.bodyPart")} value={form.bodyPart} onChange={e => setForm({ ...form, bodyPart: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" data-testid="input-positioning-body-part" />
            <select value={form.bodyRegion} onChange={e => setForm({ ...form, bodyRegion: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" data-testid="select-positioning-body-region">
              <option value="">{t("pages.adminImageLibrary.selectBodyRegion")}</option>
              {BODY_REGIONS.map(r => <option key={r} value={r}>{r.replace(/_/g, " ")}</option>)}
            </select>
            <input placeholder={t("pages.adminImageLibrary.filmSize")} value={form.filmSize} onChange={e => setForm({ ...form, filmSize: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" data-testid="input-positioning-film-size" />
            <input placeholder="SID" value={form.sid} onChange={e => setForm({ ...form, sid: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" data-testid="input-positioning-sid" />
            <input placeholder={t("pages.adminImageLibrary.imageUrl")} value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" data-testid="input-positioning-image-url" />
            <input placeholder={t("pages.adminImageLibrary.teachingImageUrl")} value={form.teachingImageUrl} onChange={e => setForm({ ...form, teachingImageUrl: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" data-testid="input-positioning-teaching-url" />
            <input placeholder={t("pages.adminImageLibrary.examImageUrl")} value={form.examImageUrl} onChange={e => setForm({ ...form, examImageUrl: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" data-testid="input-positioning-exam-url" />
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" data-testid="select-positioning-status">
              <option value="draft">{t("pages.adminImageLibrary.draft2")}</option>
              <option value="published">{t("pages.adminImageLibrary.published2")}</option>
            </select>
          </div>
          <textarea placeholder={t("pages.adminImageLibrary.patientPosition2")} value={form.patientPosition} onChange={e => setForm({ ...form, patientPosition: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" rows={2} data-testid="input-positioning-patient-position" />
          <textarea placeholder={t("pages.adminImageLibrary.detectorPlacement2")} value={form.detectorPlacement} onChange={e => setForm({ ...form, detectorPlacement: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" rows={2} data-testid="input-positioning-detector-placement" />
          <textarea placeholder={t("pages.adminImageLibrary.centralRay2")} value={form.centralRay} onChange={e => setForm({ ...form, centralRay: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" rows={2} data-testid="input-positioning-central-ray" />
          <textarea placeholder={t("pages.adminImageLibrary.anatomyDemonstrated2")} value={form.anatomyDemonstrated} onChange={e => setForm({ ...form, anatomyDemonstrated: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" rows={2} data-testid="input-positioning-anatomy-demonstrated" />
          <textarea placeholder={t("pages.adminImageLibrary.commonErrorsCommaseparated")} value={form.commonErrors} onChange={e => setForm({ ...form, commonErrors: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" rows={2} data-testid="input-positioning-common-errors" />
          <textarea placeholder={t("pages.adminImageLibrary.tips2")} value={form.tips} onChange={e => setForm({ ...form, tips: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" rows={2} data-testid="input-positioning-tips" />
          <div className="flex gap-2">
            <button onClick={handleSubmit}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700" data-testid="button-save-positioning">
              <Check className="w-4 h-4 inline mr-1" /> {editId ? "Update" : "Create"}
            </button>
            <button onClick={() => { setShowForm(false); setEditId(null); resetForm(); }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300" data-testid="button-cancel-positioning">
              <X className="w-4 h-4 inline mr-1" /> Cancel
            </button>
          </div>
        </div>
      )}

      {isLoading ? <p className="text-gray-500">{t("pages.adminImageLibrary.loading")}</p> : (
        <div className="space-y-2">
          {items.map((item: any) => (
            <div key={item.id} className="bg-white border rounded-lg p-4" data-testid={`positioning-item-${item.id}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm">{item.projectionName}</span>
                    <span className={`px-2 py-0.5 rounded text-xs ${STATUS_COLORS[item.status] || "bg-gray-100 text-gray-700"}`}>{item.status}</span>
                    <span className="px-2 py-0.5 rounded text-xs bg-rose-50 text-rose-700">{item.bodyPart}</span>
                    {item.bodyRegion && <span className="px-2 py-0.5 rounded text-xs bg-blue-50 text-blue-700">{item.bodyRegion.replace(/_/g, " ")}</span>}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {item.filmSize && <span className="mr-3">Film: {item.filmSize}</span>}
                    {item.sid && <span className="mr-3">SID: {item.sid}</span>}
                    <span className="text-indigo-500">{expandedId === item.id ? "Click to collapse" : "Click to expand"}</span>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => startEdit(item)} className="p-1.5 text-gray-500 hover:text-indigo-600" data-testid={`button-edit-positioning-${item.id}`}><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => deleteMutation.mutate(item.id)} className="p-1.5 text-gray-500 hover:text-red-600" data-testid={`button-delete-positioning-${item.id}`}><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              {expandedId === item.id && (
                <div className="mt-3 pt-3 border-t space-y-2 text-xs text-gray-700">
                  {item.patientPosition && <div><span className="font-medium">{t("pages.adminImageLibrary.patientPosition")}</span> {item.patientPosition}</div>}
                  {item.detectorPlacement && <div><span className="font-medium">{t("pages.adminImageLibrary.detectorPlacement")}</span> {item.detectorPlacement}</div>}
                  {item.centralRay && <div><span className="font-medium">{t("pages.adminImageLibrary.centralRay")}</span> {item.centralRay}</div>}
                  {item.anatomyDemonstrated && <div><span className="font-medium">{t("pages.adminImageLibrary.anatomyDemonstrated")}</span> {item.anatomyDemonstrated}</div>}
                  {item.commonErrors && item.commonErrors.length > 0 && <div><span className="font-medium">{t("pages.adminImageLibrary.commonErrors")}</span> {item.commonErrors.join(", ")}</div>}
                  {item.tips && <div><span className="font-medium">{t("pages.adminImageLibrary.tips")}</span> {item.tips}</div>}
                  {item.teachingImageUrl && <div><span className="font-medium">{t("pages.adminImageLibrary.teachingUrl")}</span> <a href={item.teachingImageUrl} className="text-indigo-600 underline" target="_blank" rel="noreferrer">{item.teachingImageUrl}</a></div>}
                  {item.examImageUrl && <div><span className="font-medium">{t("pages.adminImageLibrary.examUrl")}</span> <a href={item.examImageUrl} className="text-indigo-600 underline" target="_blank" rel="noreferrer">{item.examImageUrl}</a></div>}
                </div>
              )}
            </div>
          ))}
          {items.length === 0 && <p className="text-sm text-gray-500 py-8 text-center">{t("pages.adminImageLibrary.noPositioningEntriesFoundClick")}</p>}
        </div>
      )}
    </div>
  );
}

function ImageAssetsTab({ statusFilter }: { statusFilter: string }) {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "", category: "exam_image", country: "canada", modality: "",
    bodyRegion: "", projection: "", teachingUrl: "", examUrl: "",
    description: "", approvalStatus: "pending",
  });

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["/api/imaging/assets", statusFilter],
    queryFn: () => apiRequest("GET", `/api/imaging/assets${statusFilter ? `?approvalStatus=${statusFilter}` : ""}`).then(r => r.json()),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/imaging/assets", data).then(r => r.json()),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/imaging/assets"] }); queryClient.invalidateQueries({ queryKey: ["/api/imaging/library-stats"] }); setShowForm(false); resetForm(); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => apiRequest("PATCH", `/api/imaging/assets/${id}`, data).then(r => r.json()),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/imaging/assets"] }); setEditId(null); resetForm(); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/imaging/assets/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/imaging/assets"] }); queryClient.invalidateQueries({ queryKey: ["/api/imaging/library-stats"] }); },
  });

  function resetForm() {
    setForm({ title: "", category: "exam_image", country: "canada", modality: "", bodyRegion: "", projection: "", teachingUrl: "", examUrl: "", description: "", approvalStatus: "pending" });
  }

  function startEdit(item: any) {
    setEditId(item.id);
    setForm({
      title: item.title || "", category: item.category || "exam_image", country: item.country || "canada",
      modality: item.modality || "", bodyRegion: item.bodyRegion || "", projection: item.projection || "",
      teachingUrl: item.teachingUrl || "", examUrl: item.examUrl || "", description: item.description || "",
      approvalStatus: item.approvalStatus || "pending",
    });
    setShowForm(true);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold" data-testid="text-assets-heading">Image Assets ({items.length})</h2>
        <button onClick={() => { setShowForm(!showForm); setEditId(null); resetForm(); }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
          data-testid="button-add-asset">
          <Plus className="w-4 h-4" /> Add Asset
        </button>
      </div>

      {showForm && (
        <div className="bg-white border rounded-lg p-4 mb-4 space-y-3" data-testid="form-asset">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <input placeholder={t("pages.adminImageLibrary.title")} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" data-testid="input-asset-title" />
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" data-testid="select-asset-category">
              {ASSET_CATEGORIES.map(c => <option key={c} value={c}>{c.replace(/_/g, " ")}</option>)}
            </select>
            <select value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" data-testid="select-asset-country">
              <option value="canada">{t("pages.adminImageLibrary.canada")}</option>
              <option value="usa">USA</option>
            </select>
            <input placeholder={t("pages.adminImageLibrary.modality")} value={form.modality} onChange={e => setForm({ ...form, modality: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" data-testid="input-asset-modality" />
            <select value={form.bodyRegion} onChange={e => setForm({ ...form, bodyRegion: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" data-testid="select-asset-body-region">
              <option value="">{t("pages.adminImageLibrary.selectBodyRegion2")}</option>
              {BODY_REGIONS.map(r => <option key={r} value={r}>{r.replace(/_/g, " ")}</option>)}
            </select>
            <input placeholder={t("pages.adminImageLibrary.projection")} value={form.projection} onChange={e => setForm({ ...form, projection: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" data-testid="input-asset-projection" />
            <input placeholder={t("pages.adminImageLibrary.teachingVersionUrl")} value={form.teachingUrl} onChange={e => setForm({ ...form, teachingUrl: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" data-testid="input-asset-teaching-url" />
            <input placeholder={t("pages.adminImageLibrary.examVersionUrl")} value={form.examUrl} onChange={e => setForm({ ...form, examUrl: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" data-testid="input-asset-exam-url" />
            <select value={form.approvalStatus} onChange={e => setForm({ ...form, approvalStatus: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" data-testid="select-asset-status">
              <option value="pending">{t("pages.adminImageLibrary.pending2")}</option>
              <option value="approved">{t("pages.adminImageLibrary.approved2")}</option>
              <option value="published">{t("pages.adminImageLibrary.published3")}</option>
              <option value="draft">{t("pages.adminImageLibrary.draft3")}</option>
            </select>
          </div>
          <textarea placeholder={t("pages.adminImageLibrary.description")} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" rows={2} data-testid="input-asset-description" />
          <div className="flex gap-2">
            <button onClick={() => editId ? updateMutation.mutate({ id: editId, data: form }) : createMutation.mutate(form)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700" data-testid="button-save-asset">
              <Check className="w-4 h-4 inline mr-1" /> {editId ? "Update" : "Create"}
            </button>
            <button onClick={() => { setShowForm(false); setEditId(null); resetForm(); }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300" data-testid="button-cancel-asset">
              <X className="w-4 h-4 inline mr-1" /> Cancel
            </button>
          </div>
        </div>
      )}

      {isLoading ? <p className="text-gray-500">{t("pages.adminImageLibrary.loading2")}</p> : (
        <div className="space-y-2">
          {items.map((item: any) => (
            <div key={item.id} className="bg-white border rounded-lg p-4 flex items-start justify-between gap-3" data-testid={`asset-item-${item.id}`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-sm">{item.title || "Untitled"}</span>
                  <span className={`px-2 py-0.5 rounded text-xs ${STATUS_COLORS[item.approvalStatus] || "bg-gray-100 text-gray-700"}`}>{item.approvalStatus}</span>
                  <span className="px-2 py-0.5 rounded text-xs bg-indigo-50 text-indigo-700">{(item.category || "").replace(/_/g, " ")}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {item.bodyRegion && <span className="mr-2">Region: {item.bodyRegion}</span>}
                  {item.modality && <span className="mr-2">Modality: {item.modality}</span>}
                  {item.projection && <span>Projection: {item.projection}</span>}
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => startEdit(item)} className="p-1.5 text-gray-500 hover:text-indigo-600" data-testid={`button-edit-asset-${item.id}`}><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => deleteMutation.mutate(item.id)} className="p-1.5 text-gray-500 hover:text-red-600" data-testid={`button-delete-asset-${item.id}`}><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-sm text-gray-500 py-8 text-center">{t("pages.adminImageLibrary.noImageAssetsFoundClick")}</p>}
        </div>
      )}
    </div>
  );
}

function ArtifactImagesTab({ statusFilter }: { statusFilter: string }) {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    artifactName: "", artifactType: "motion_artifact", description: "",
    cause: "", correction: "", severity: "moderate",
    teachingVersionUrl: "", examVersionUrl: "", correctedComparisonUrl: "",
    bodyRegion: "", modality: "", status: "draft",
  });

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["/api/imaging/artifact-images", statusFilter],
    queryFn: () => apiRequest("GET", `/api/imaging/artifact-images${statusFilter ? `?status=${statusFilter}` : ""}`).then(r => r.json()),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/imaging/artifact-images", data).then(r => r.json()),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/imaging/artifact-images"] }); queryClient.invalidateQueries({ queryKey: ["/api/imaging/library-stats"] }); setShowForm(false); resetForm(); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => apiRequest("PATCH", `/api/imaging/artifact-images/${id}`, data).then(r => r.json()),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/imaging/artifact-images"] }); setEditId(null); resetForm(); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/imaging/artifact-images/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/imaging/artifact-images"] }); queryClient.invalidateQueries({ queryKey: ["/api/imaging/library-stats"] }); },
  });

  function resetForm() {
    setForm({ artifactName: "", artifactType: "motion_artifact", description: "", cause: "", correction: "", severity: "moderate", teachingVersionUrl: "", examVersionUrl: "", correctedComparisonUrl: "", bodyRegion: "", modality: "", status: "draft" });
  }

  function startEdit(item: any) {
    setEditId(item.id);
    setForm({
      artifactName: item.artifactName || "", artifactType: item.artifactType || "motion_artifact",
      description: item.description || "", cause: item.cause || "", correction: item.correction || "",
      severity: item.severity || "moderate", teachingVersionUrl: item.teachingVersionUrl || "",
      examVersionUrl: item.examVersionUrl || "", correctedComparisonUrl: item.correctedComparisonUrl || "",
      bodyRegion: item.bodyRegion || "", modality: item.modality || "", status: item.status || "draft",
    });
    setShowForm(true);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold" data-testid="text-artifacts-heading">Artifact Images ({items.length})</h2>
        <button onClick={() => { setShowForm(!showForm); setEditId(null); resetForm(); }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
          data-testid="button-add-artifact">
          <Plus className="w-4 h-4" /> Add Artifact
        </button>
      </div>

      {showForm && (
        <div className="bg-white border rounded-lg p-4 mb-4 space-y-3" data-testid="form-artifact">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <input placeholder={t("pages.adminImageLibrary.artifactName")} value={form.artifactName} onChange={e => setForm({ ...form, artifactName: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" data-testid="input-artifact-name" />
            <select value={form.artifactType} onChange={e => setForm({ ...form, artifactType: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" data-testid="select-artifact-type">
              {ARTIFACT_TYPES.map(t => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}
            </select>
            <select value={form.severity} onChange={e => setForm({ ...form, severity: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" data-testid="select-artifact-severity">
              <option value="minor">{t("pages.adminImageLibrary.minor")}</option>
              <option value="moderate">{t("pages.adminImageLibrary.moderate")}</option>
              <option value="severe">{t("pages.adminImageLibrary.severe")}</option>
            </select>
            <input placeholder={t("pages.adminImageLibrary.teachingVersionUrl2")} value={form.teachingVersionUrl} onChange={e => setForm({ ...form, teachingVersionUrl: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" data-testid="input-artifact-teaching-url" />
            <input placeholder={t("pages.adminImageLibrary.examVersionUrl2")} value={form.examVersionUrl} onChange={e => setForm({ ...form, examVersionUrl: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" data-testid="input-artifact-exam-url" />
            <input placeholder={t("pages.adminImageLibrary.correctedComparisonUrl")} value={form.correctedComparisonUrl} onChange={e => setForm({ ...form, correctedComparisonUrl: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" data-testid="input-artifact-corrected-url" />
            <select value={form.bodyRegion} onChange={e => setForm({ ...form, bodyRegion: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" data-testid="select-artifact-body-region">
              <option value="">{t("pages.adminImageLibrary.selectBodyRegion3")}</option>
              {BODY_REGIONS.map(r => <option key={r} value={r}>{r.replace(/_/g, " ")}</option>)}
            </select>
            <input placeholder={t("pages.adminImageLibrary.modality2")} value={form.modality} onChange={e => setForm({ ...form, modality: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" data-testid="input-artifact-modality" />
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" data-testid="select-artifact-status">
              <option value="draft">{t("pages.adminImageLibrary.draft4")}</option>
              <option value="published">{t("pages.adminImageLibrary.published4")}</option>
            </select>
          </div>
          <textarea placeholder={t("pages.adminImageLibrary.description2")} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" rows={2} data-testid="input-artifact-description" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <textarea placeholder={t("pages.adminImageLibrary.cause")} value={form.cause} onChange={e => setForm({ ...form, cause: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" rows={2} data-testid="input-artifact-cause" />
            <textarea placeholder={t("pages.adminImageLibrary.correction")} value={form.correction} onChange={e => setForm({ ...form, correction: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" rows={2} data-testid="input-artifact-correction" />
          </div>
          <div className="flex gap-2">
            <button onClick={() => editId ? updateMutation.mutate({ id: editId, data: form }) : createMutation.mutate(form)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700" data-testid="button-save-artifact">
              <Check className="w-4 h-4 inline mr-1" /> {editId ? "Update" : "Create"}
            </button>
            <button onClick={() => { setShowForm(false); setEditId(null); resetForm(); }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300" data-testid="button-cancel-artifact">
              <X className="w-4 h-4 inline mr-1" /> Cancel
            </button>
          </div>
        </div>
      )}

      {isLoading ? <p className="text-gray-500">{t("pages.adminImageLibrary.loading3")}</p> : (
        <div className="space-y-2">
          {items.map((item: any) => (
            <div key={item.id} className="bg-white border rounded-lg p-4 flex items-start justify-between gap-3" data-testid={`artifact-item-${item.id}`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-sm">{item.artifactName}</span>
                  <span className={`px-2 py-0.5 rounded text-xs ${STATUS_COLORS[item.status] || "bg-gray-100 text-gray-700"}`}>{item.status}</span>
                  <span className="px-2 py-0.5 rounded text-xs bg-orange-50 text-orange-700">{(item.artifactType || "").replace(/_/g, " ")}</span>
                  <span className="px-2 py-0.5 rounded text-xs bg-red-50 text-red-700">{item.severity}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">{item.description && item.description.substring(0, 120)}</div>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => startEdit(item)} className="p-1.5 text-gray-500 hover:text-indigo-600" data-testid={`button-edit-artifact-${item.id}`}><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => deleteMutation.mutate(item.id)} className="p-1.5 text-gray-500 hover:text-red-600" data-testid={`button-delete-artifact-${item.id}`}><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-sm text-gray-500 py-8 text-center">{t("pages.adminImageLibrary.noArtifactImagesFoundClick")}</p>}
        </div>
      )}
    </div>
  );
}

function ComparisonSetsTab({ statusFilter }: { statusFilter: string }) {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "", comparisonType: "collimation", description: "",
    acceptableImageUrl: "", unacceptableImageUrl: "",
    acceptableLabel: "Acceptable", unacceptableLabel: "Unacceptable",
    bodyRegion: "", modality: "", category: "", status: "draft",
  });

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["/api/imaging/comparison-sets", statusFilter],
    queryFn: () => apiRequest("GET", `/api/imaging/comparison-sets${statusFilter ? `?status=${statusFilter}` : ""}`).then(r => r.json()),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/imaging/comparison-sets", data).then(r => r.json()),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/imaging/comparison-sets"] }); queryClient.invalidateQueries({ queryKey: ["/api/imaging/library-stats"] }); setShowForm(false); resetForm(); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => apiRequest("PATCH", `/api/imaging/comparison-sets/${id}`, data).then(r => r.json()),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/imaging/comparison-sets"] }); setEditId(null); resetForm(); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/imaging/comparison-sets/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/imaging/comparison-sets"] }); queryClient.invalidateQueries({ queryKey: ["/api/imaging/library-stats"] }); },
  });

  function resetForm() {
    setForm({ title: "", comparisonType: "collimation", description: "", acceptableImageUrl: "", unacceptableImageUrl: "", acceptableLabel: "Acceptable", unacceptableLabel: "Unacceptable", bodyRegion: "", modality: "", category: "", status: "draft" });
  }

  function startEdit(item: any) {
    setEditId(item.id);
    setForm({
      title: item.title || "", comparisonType: item.comparisonType || "collimation",
      description: item.description || "", acceptableImageUrl: item.acceptableImageUrl || "",
      unacceptableImageUrl: item.unacceptableImageUrl || "",
      acceptableLabel: item.acceptableLabel || "Acceptable",
      unacceptableLabel: item.unacceptableLabel || "Unacceptable",
      bodyRegion: item.bodyRegion || "", modality: item.modality || "",
      category: item.category || "", status: item.status || "draft",
    });
    setShowForm(true);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold" data-testid="text-comparisons-heading">Comparison Sets ({items.length})</h2>
        <button onClick={() => { setShowForm(!showForm); setEditId(null); resetForm(); }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
          data-testid="button-add-comparison">
          <Plus className="w-4 h-4" /> Add Comparison
        </button>
      </div>

      {showForm && (
        <div className="bg-white border rounded-lg p-4 mb-4 space-y-3" data-testid="form-comparison">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <input placeholder={t("pages.adminImageLibrary.title2")} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" data-testid="input-comparison-title" />
            <select value={form.comparisonType} onChange={e => setForm({ ...form, comparisonType: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" data-testid="select-comparison-type">
              {COMPARISON_TYPES.map(t => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}
            </select>
            <select value={form.bodyRegion} onChange={e => setForm({ ...form, bodyRegion: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" data-testid="select-comparison-body-region">
              <option value="">{t("pages.adminImageLibrary.selectBodyRegion4")}</option>
              {BODY_REGIONS.map(r => <option key={r} value={r}>{r.replace(/_/g, " ")}</option>)}
            </select>
            <input placeholder={t("pages.adminImageLibrary.acceptableImageUrl")} value={form.acceptableImageUrl} onChange={e => setForm({ ...form, acceptableImageUrl: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" data-testid="input-comparison-acceptable-url" />
            <input placeholder={t("pages.adminImageLibrary.unacceptableImageUrl")} value={form.unacceptableImageUrl} onChange={e => setForm({ ...form, unacceptableImageUrl: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" data-testid="input-comparison-unacceptable-url" />
            <input placeholder={t("pages.adminImageLibrary.modality3")} value={form.modality} onChange={e => setForm({ ...form, modality: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" data-testid="input-comparison-modality" />
            <input placeholder={t("pages.adminImageLibrary.acceptableLabel")} value={form.acceptableLabel} onChange={e => setForm({ ...form, acceptableLabel: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" data-testid="input-comparison-acceptable-label" />
            <input placeholder={t("pages.adminImageLibrary.unacceptableLabel")} value={form.unacceptableLabel} onChange={e => setForm({ ...form, unacceptableLabel: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" data-testid="input-comparison-unacceptable-label" />
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" data-testid="select-comparison-status">
              <option value="draft">{t("pages.adminImageLibrary.draft5")}</option>
              <option value="published">{t("pages.adminImageLibrary.published5")}</option>
            </select>
          </div>
          <textarea placeholder={t("pages.adminImageLibrary.description3")} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" rows={2} data-testid="input-comparison-description" />
          <div className="flex gap-2">
            <button onClick={() => editId ? updateMutation.mutate({ id: editId, data: form }) : createMutation.mutate(form)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700" data-testid="button-save-comparison">
              <Check className="w-4 h-4 inline mr-1" /> {editId ? "Update" : "Create"}
            </button>
            <button onClick={() => { setShowForm(false); setEditId(null); resetForm(); }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300" data-testid="button-cancel-comparison">
              <X className="w-4 h-4 inline mr-1" /> Cancel
            </button>
          </div>
        </div>
      )}

      {isLoading ? <p className="text-gray-500">{t("pages.adminImageLibrary.loading4")}</p> : (
        <div className="space-y-2">
          {items.map((item: any) => (
            <div key={item.id} className="bg-white border rounded-lg p-4 flex items-start justify-between gap-3" data-testid={`comparison-item-${item.id}`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-sm">{item.title}</span>
                  <span className={`px-2 py-0.5 rounded text-xs ${STATUS_COLORS[item.status] || "bg-gray-100 text-gray-700"}`}>{item.status}</span>
                  <span className="px-2 py-0.5 rounded text-xs bg-purple-50 text-purple-700">{(item.comparisonType || "").replace(/_/g, " ")}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {item.acceptableLabel} vs {item.unacceptableLabel}
                  {item.bodyRegion && <span className="ml-2">| {item.bodyRegion}</span>}
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => startEdit(item)} className="p-1.5 text-gray-500 hover:text-indigo-600" data-testid={`button-edit-comparison-${item.id}`}><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => deleteMutation.mutate(item.id)} className="p-1.5 text-gray-500 hover:text-red-600" data-testid={`button-delete-comparison-${item.id}`}><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-sm text-gray-500 py-8 text-center">{t("pages.adminImageLibrary.noComparisonSetsFoundClick")}</p>}
        </div>
      )}
    </div>
  );
}

function AnatomyImagesTab({ statusFilter }: { statusFilter: string }) {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "", bodyRegion: "chest", bodyPart: "", modality: "",
    projection: "", labeledTeachingUrl: "", cleanExamUrl: "", status: "draft",
  });

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["/api/imaging/anatomy-images", statusFilter],
    queryFn: () => apiRequest("GET", `/api/imaging/anatomy-images${statusFilter ? `?status=${statusFilter}` : ""}`).then(r => r.json()),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/imaging/anatomy-images", data).then(r => r.json()),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/imaging/anatomy-images"] }); queryClient.invalidateQueries({ queryKey: ["/api/imaging/library-stats"] }); setShowForm(false); resetForm(); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => apiRequest("PATCH", `/api/imaging/anatomy-images/${id}`, data).then(r => r.json()),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/imaging/anatomy-images"] }); setEditId(null); resetForm(); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/imaging/anatomy-images/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/imaging/anatomy-images"] }); queryClient.invalidateQueries({ queryKey: ["/api/imaging/library-stats"] }); },
  });

  function resetForm() {
    setForm({ title: "", bodyRegion: "chest", bodyPart: "", modality: "", projection: "", labeledTeachingUrl: "", cleanExamUrl: "", status: "draft" });
  }

  function startEdit(item: any) {
    setEditId(item.id);
    setForm({
      title: item.title || "", bodyRegion: item.bodyRegion || "chest", bodyPart: item.bodyPart || "",
      modality: item.modality || "", projection: item.projection || "",
      labeledTeachingUrl: item.labeledTeachingUrl || "", cleanExamUrl: item.cleanExamUrl || "",
      status: item.status || "draft",
    });
    setShowForm(true);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold" data-testid="text-anatomy-heading">Anatomy Images ({items.length})</h2>
        <button onClick={() => { setShowForm(!showForm); setEditId(null); resetForm(); }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
          data-testid="button-add-anatomy">
          <Plus className="w-4 h-4" /> Add Anatomy Image
        </button>
      </div>

      {showForm && (
        <div className="bg-white border rounded-lg p-4 mb-4 space-y-3" data-testid="form-anatomy">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <input placeholder={t("pages.adminImageLibrary.title3")} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" data-testid="input-anatomy-title" />
            <select value={form.bodyRegion} onChange={e => setForm({ ...form, bodyRegion: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" data-testid="select-anatomy-body-region">
              {BODY_REGIONS.map(r => <option key={r} value={r}>{r.replace(/_/g, " ")}</option>)}
            </select>
            <input placeholder={t("pages.adminImageLibrary.bodyPart2")} value={form.bodyPart} onChange={e => setForm({ ...form, bodyPart: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" data-testid="input-anatomy-body-part" />
            <input placeholder={t("pages.adminImageLibrary.modality4")} value={form.modality} onChange={e => setForm({ ...form, modality: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" data-testid="input-anatomy-modality" />
            <input placeholder={t("pages.adminImageLibrary.projection2")} value={form.projection} onChange={e => setForm({ ...form, projection: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" data-testid="input-anatomy-projection" />
            <input placeholder={t("pages.adminImageLibrary.labeledTeachingUrl")} value={form.labeledTeachingUrl} onChange={e => setForm({ ...form, labeledTeachingUrl: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" data-testid="input-anatomy-teaching-url" />
            <input placeholder={t("pages.adminImageLibrary.cleanExamUrl")} value={form.cleanExamUrl} onChange={e => setForm({ ...form, cleanExamUrl: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" data-testid="input-anatomy-exam-url" />
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" data-testid="select-anatomy-status">
              <option value="draft">{t("pages.adminImageLibrary.draft6")}</option>
              <option value="published">{t("pages.adminImageLibrary.published6")}</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={() => editId ? updateMutation.mutate({ id: editId, data: form }) : createMutation.mutate(form)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700" data-testid="button-save-anatomy">
              <Check className="w-4 h-4 inline mr-1" /> {editId ? "Update" : "Create"}
            </button>
            <button onClick={() => { setShowForm(false); setEditId(null); resetForm(); }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300" data-testid="button-cancel-anatomy">
              <X className="w-4 h-4 inline mr-1" /> Cancel
            </button>
          </div>
        </div>
      )}

      {isLoading ? <p className="text-gray-500">{t("pages.adminImageLibrary.loading5")}</p> : (
        <div className="space-y-2">
          {items.map((item: any) => (
            <div key={item.id} className="bg-white border rounded-lg p-4 flex items-start justify-between gap-3" data-testid={`anatomy-item-${item.id}`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-sm">{item.title}</span>
                  <span className={`px-2 py-0.5 rounded text-xs ${STATUS_COLORS[item.status] || "bg-gray-100 text-gray-700"}`}>{item.status}</span>
                  <span className="px-2 py-0.5 rounded text-xs bg-green-50 text-green-700">{(item.bodyRegion || "").replace(/_/g, " ")}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {item.bodyPart && <span className="mr-2">Part: {item.bodyPart}</span>}
                  {item.modality && <span className="mr-2">Modality: {item.modality}</span>}
                  {item.projection && <span>Projection: {item.projection}</span>}
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => startEdit(item)} className="p-1.5 text-gray-500 hover:text-indigo-600" data-testid={`button-edit-anatomy-${item.id}`}><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => deleteMutation.mutate(item.id)} className="p-1.5 text-gray-500 hover:text-red-600" data-testid={`button-delete-anatomy-${item.id}`}><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-sm text-gray-500 py-8 text-center">{t("pages.adminImageLibrary.noAnatomyImagesFoundClick")}</p>}
        </div>
      )}
    </div>
  );
}

function PhysicsVisualsTab({ statusFilter }: { statusFilter: string }) {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "", concept: "", description: "", category: "",
    imageUrl: "", animationUrl: "", status: "draft",
  });

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["/api/imaging/physics-visuals", statusFilter],
    queryFn: () => apiRequest("GET", `/api/imaging/physics-visuals${statusFilter ? `?status=${statusFilter}` : ""}`).then(r => r.json()),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/imaging/physics-visuals", data).then(r => r.json()),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/imaging/physics-visuals"] }); queryClient.invalidateQueries({ queryKey: ["/api/imaging/library-stats"] }); setShowForm(false); resetForm(); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => apiRequest("PATCH", `/api/imaging/physics-visuals/${id}`, data).then(r => r.json()),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/imaging/physics-visuals"] }); setEditId(null); resetForm(); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/imaging/physics-visuals/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/imaging/physics-visuals"] }); queryClient.invalidateQueries({ queryKey: ["/api/imaging/library-stats"] }); },
  });

  function resetForm() {
    setForm({ title: "", concept: "", description: "", category: "", imageUrl: "", animationUrl: "", status: "draft" });
  }

  function startEdit(item: any) {
    setEditId(item.id);
    setForm({
      title: item.title || "", concept: item.concept || "", description: item.description || "",
      category: item.category || "", imageUrl: item.imageUrl || "",
      animationUrl: item.animationUrl || "", status: item.status || "draft",
    });
    setShowForm(true);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold" data-testid="text-physics-visuals-heading">Physics Visuals ({items.length})</h2>
        <button onClick={() => { setShowForm(!showForm); setEditId(null); resetForm(); }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
          data-testid="button-add-physics-visual">
          <Plus className="w-4 h-4" /> Add Physics Visual
        </button>
      </div>

      {showForm && (
        <div className="bg-white border rounded-lg p-4 mb-4 space-y-3" data-testid="form-physics-visual">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <input placeholder={t("pages.adminImageLibrary.title4")} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" data-testid="input-physics-visual-title" />
            <input placeholder={t("pages.adminImageLibrary.concept")} value={form.concept} onChange={e => setForm({ ...form, concept: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" data-testid="input-physics-visual-concept" />
            <input placeholder={t("pages.adminImageLibrary.category")} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" data-testid="input-physics-visual-category" />
            <input placeholder={t("pages.adminImageLibrary.imageUrl2")} value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" data-testid="input-physics-visual-image-url" />
            <input placeholder={t("pages.adminImageLibrary.animationUrl")} value={form.animationUrl} onChange={e => setForm({ ...form, animationUrl: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" data-testid="input-physics-visual-animation-url" />
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" data-testid="select-physics-visual-status">
              <option value="draft">{t("pages.adminImageLibrary.draft7")}</option>
              <option value="published">{t("pages.adminImageLibrary.published7")}</option>
            </select>
          </div>
          <textarea placeholder={t("pages.adminImageLibrary.description4")} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" rows={2} data-testid="input-physics-visual-description" />
          <div className="flex gap-2">
            <button onClick={() => editId ? updateMutation.mutate({ id: editId, data: form }) : createMutation.mutate(form)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700" data-testid="button-save-physics-visual">
              <Check className="w-4 h-4 inline mr-1" /> {editId ? "Update" : "Create"}
            </button>
            <button onClick={() => { setShowForm(false); setEditId(null); resetForm(); }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300" data-testid="button-cancel-physics-visual">
              <X className="w-4 h-4 inline mr-1" /> Cancel
            </button>
          </div>
        </div>
      )}

      {isLoading ? <p className="text-gray-500">{t("pages.adminImageLibrary.loading6")}</p> : (
        <div className="space-y-2">
          {items.map((item: any) => (
            <div key={item.id} className="bg-white border rounded-lg p-4 flex items-start justify-between gap-3" data-testid={`physics-visual-item-${item.id}`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-sm">{item.title}</span>
                  <span className={`px-2 py-0.5 rounded text-xs ${STATUS_COLORS[item.status] || "bg-gray-100 text-gray-700"}`}>{item.status}</span>
                  {item.category && <span className="px-2 py-0.5 rounded text-xs bg-cyan-50 text-cyan-700">{item.category}</span>}
                </div>
                <div className="text-xs text-gray-500 mt-1">{item.concept}</div>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => startEdit(item)} className="p-1.5 text-gray-500 hover:text-indigo-600" data-testid={`button-edit-physics-visual-${item.id}`}><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => deleteMutation.mutate(item.id)} className="p-1.5 text-gray-500 hover:text-red-600" data-testid={`button-delete-physics-visual-${item.id}`}><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-sm text-gray-500 py-8 text-center">{t("pages.adminImageLibrary.noPhysicsVisualsFoundClick")}</p>}
        </div>
      )}
    </div>
  );
}

function ImageBriefsTab({ statusFilter }: { statusFilter: string }) {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "", briefType: "new_asset", targetCategory: "exam_image",
    description: "", bodyRegion: "", modality: "",
    priority: "medium", status: "pending", assignedTo: "", notes: "",
  });

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["/api/imaging/image-briefs", statusFilter],
    queryFn: () => apiRequest("GET", `/api/imaging/image-briefs${statusFilter ? `?status=${statusFilter}` : ""}`).then(r => r.json()),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/imaging/image-briefs", data).then(r => r.json()),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/imaging/image-briefs"] }); queryClient.invalidateQueries({ queryKey: ["/api/imaging/library-stats"] }); setShowForm(false); resetForm(); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => apiRequest("PATCH", `/api/imaging/image-briefs/${id}`, data).then(r => r.json()),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/imaging/image-briefs"] }); setEditId(null); resetForm(); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/imaging/image-briefs/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/imaging/image-briefs"] }); queryClient.invalidateQueries({ queryKey: ["/api/imaging/library-stats"] }); },
  });

  function resetForm() {
    setForm({ title: "", briefType: "new_asset", targetCategory: "exam_image", description: "", bodyRegion: "", modality: "", priority: "medium", status: "pending", assignedTo: "", notes: "" });
  }

  function startEdit(item: any) {
    setEditId(item.id);
    setForm({
      title: item.title || "", briefType: item.briefType || "new_asset",
      targetCategory: item.targetCategory || "exam_image",
      description: item.description || "", bodyRegion: item.bodyRegion || "",
      modality: item.modality || "", priority: item.priority || "medium",
      status: item.status || "pending", assignedTo: item.assignedTo || "",
      notes: item.notes || "",
    });
    setShowForm(true);
  }

  const PRIORITY_COLORS: Record<string, string> = {
    low: "bg-gray-100 text-gray-700",
    medium: "bg-blue-100 text-blue-700",
    high: "bg-orange-100 text-orange-700",
    urgent: "bg-red-100 text-red-700",
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold" data-testid="text-briefs-heading">Image Briefs ({items.length})</h2>
        <button onClick={() => { setShowForm(!showForm); setEditId(null); resetForm(); }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
          data-testid="button-add-brief">
          <Plus className="w-4 h-4" /> Add Brief
        </button>
      </div>

      {showForm && (
        <div className="bg-white border rounded-lg p-4 mb-4 space-y-3" data-testid="form-brief">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <input placeholder={t("pages.adminImageLibrary.title5")} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" data-testid="input-brief-title" />
            <select value={form.briefType} onChange={e => setForm({ ...form, briefType: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" data-testid="select-brief-type">
              <option value="new_asset">{t("pages.adminImageLibrary.newAsset")}</option>
              <option value="replacement">{t("pages.adminImageLibrary.replacement")}</option>
              <option value="update">{t("pages.adminImageLibrary.update")}</option>
              <option value="variation">{t("pages.adminImageLibrary.variation")}</option>
            </select>
            <select value={form.targetCategory} onChange={e => setForm({ ...form, targetCategory: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" data-testid="select-brief-target-category">
              {BRIEF_CATEGORIES.map(c => <option key={c} value={c}>{c.replace(/_/g, " ")}</option>)}
            </select>
            <select value={form.bodyRegion} onChange={e => setForm({ ...form, bodyRegion: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" data-testid="select-brief-body-region">
              <option value="">{t("pages.adminImageLibrary.selectBodyRegion5")}</option>
              {BODY_REGIONS.map(r => <option key={r} value={r}>{r.replace(/_/g, " ")}</option>)}
            </select>
            <input placeholder={t("pages.adminImageLibrary.modality5")} value={form.modality} onChange={e => setForm({ ...form, modality: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" data-testid="input-brief-modality" />
            <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" data-testid="select-brief-priority">
              {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <input placeholder={t("pages.adminImageLibrary.assignedTo")} value={form.assignedTo} onChange={e => setForm({ ...form, assignedTo: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" data-testid="input-brief-assigned-to" />
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" data-testid="select-brief-status">
              <option value="pending">{t("pages.adminImageLibrary.pending3")}</option>
              <option value="in_progress">{t("pages.adminImageLibrary.inProgress")}</option>
              <option value="completed">{t("pages.adminImageLibrary.completed")}</option>
              <option value="cancelled">{t("pages.adminImageLibrary.cancelled")}</option>
            </select>
          </div>
          <textarea placeholder={t("pages.adminImageLibrary.descriptionWhatTheImageShould")} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" rows={3} data-testid="input-brief-description" />
          <textarea placeholder={t("pages.adminImageLibrary.notes")} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" rows={2} data-testid="input-brief-notes" />
          <div className="flex gap-2">
            <button onClick={() => editId ? updateMutation.mutate({ id: editId, data: form }) : createMutation.mutate(form)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700" data-testid="button-save-brief">
              <Check className="w-4 h-4 inline mr-1" /> {editId ? "Update" : "Create"}
            </button>
            <button onClick={() => { setShowForm(false); setEditId(null); resetForm(); }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300" data-testid="button-cancel-brief">
              <X className="w-4 h-4 inline mr-1" /> Cancel
            </button>
          </div>
        </div>
      )}

      {isLoading ? <p className="text-gray-500">{t("pages.adminImageLibrary.loading7")}</p> : (
        <div className="space-y-2">
          {items.map((item: any) => (
            <div key={item.id} className="bg-white border rounded-lg p-4 flex items-start justify-between gap-3" data-testid={`brief-item-${item.id}`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-sm">{item.title}</span>
                  <span className={`px-2 py-0.5 rounded text-xs ${STATUS_COLORS[item.status] || "bg-gray-100 text-gray-700"}`}>{item.status}</span>
                  <span className={`px-2 py-0.5 rounded text-xs ${PRIORITY_COLORS[item.priority] || "bg-gray-100 text-gray-700"}`}>{item.priority}</span>
                  <span className="px-2 py-0.5 rounded text-xs bg-indigo-50 text-indigo-700">{(item.targetCategory || "").replace(/_/g, " ")}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {item.briefType && <span className="mr-2">Type: {item.briefType}</span>}
                  {item.assignedTo && <span className="mr-2">Assigned: {item.assignedTo}</span>}
                  {item.bodyRegion && <span>Region: {item.bodyRegion}</span>}
                </div>
                {item.description && <div className="text-xs text-gray-400 mt-1">{item.description.substring(0, 100)}{item.description.length > 100 ? "..." : ""}</div>}
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => startEdit(item)} className="p-1.5 text-gray-500 hover:text-indigo-600" data-testid={`button-edit-brief-${item.id}`}><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => deleteMutation.mutate(item.id)} className="p-1.5 text-gray-500 hover:text-red-600" data-testid={`button-delete-brief-${item.id}`}><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-sm text-gray-500 py-8 text-center">{t("pages.adminImageLibrary.noImageBriefsFoundClick")}</p>}
        </div>
      )}
    </div>
  );
}
