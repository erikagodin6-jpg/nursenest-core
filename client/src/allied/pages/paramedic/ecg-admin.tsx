import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Plus, Edit2, Trash2, Eye, EyeOff, Activity, Database } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { ECGStrip } from "./ecg-components";

import { useI18n } from "@/lib/i18n";
const CATEGORIES = ["Cardiac Rhythms", "Heart Blocks", "12-Lead Patterns", "Capnography"];
const DIFFICULTIES = ["beginner", "intermediate", "advanced"];
const WAVEFORM_TYPES = ["ecg-rhythm", "ecg-12lead", "capnography"];
const VISIBILITY_TIERS = ["free", "paid"];

export default function ECGAdminPage() {
  const { t } = useI18n();
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [editingWaveform, setEditingWaveform] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);

  const { data: waveforms = [], isLoading } = useQuery({
    queryKey: ["admin-paramedic-waveforms", search, filterCategory, filterStatus],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (filterCategory) params.set("category", filterCategory);
      if (filterStatus) params.set("status", filterStatus);
      const res = await fetch(`/api/admin/paramedic-waveforms?${params.toString()}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load waveforms");
      return res.json();
    },
    enabled: isAdmin,
  });

  const seedMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/admin/paramedic-waveforms/seed", { method: "POST", credentials: "include" });
      if (!res.ok) throw new Error("Failed to seed waveforms");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-paramedic-waveforms"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/paramedic-waveforms/${id}`, { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error("Failed to delete");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-paramedic-waveforms"] }),
  });

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const url = data.id ? `/api/admin/paramedic-waveforms/${data.id}` : "/api/admin/paramedic-waveforms";
      const method = data.id ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-paramedic-waveforms"] });
      setShowForm(false);
      setEditingWaveform(null);
    },
  });

  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-xl font-bold text-gray-900 mb-2">{t("allied.paramedicEcgAdmin.accessDenied")}</h1>
        <p className="text-gray-600">{t("allied.paramedicEcgAdmin.adminAccessRequired")}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8" data-testid="ecg-admin-page">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Activity className="w-6 h-6 text-teal-600" />
            ECG Waveform Manager
          </h1>
          <p className="text-sm text-gray-500 mt-1">{t("allied.paramedicEcgAdmin.manageParamedicEcgRhythms12lead")}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => seedMutation.mutate()}
            disabled={seedMutation.isPending}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50"
            data-testid="button-seed-waveforms"
          >
            <Database className="w-4 h-4" />
            {seedMutation.isPending ? "Seeding..." : "Seed Data"}
          </button>
          <button
            onClick={() => { setEditingWaveform(null); setShowForm(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700"
            data-testid="button-add-waveform"
          >
            <Plus className="w-4 h-4" />
            Add Waveform
          </button>
        </div>
      </div>

      {seedMutation.isSuccess && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm" data-testid="alert-seed-success">
          Waveform data seeded successfully ({(seedMutation.data as any)?.count || 0} entries).
        </div>
      )}

      {showForm && (
        <WaveformForm
          waveform={editingWaveform}
          onSave={(data) => saveMutation.mutate(data)}
          onCancel={() => { setShowForm(false); setEditingWaveform(null); }}
          isSaving={saveMutation.isPending}
          error={saveMutation.error?.message}
        />
      )}

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={t("allied.paramedicEcgAdmin.searchWaveforms")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 text-sm"
            data-testid="input-admin-search"
          />
        </div>
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm" data-testid="select-admin-category">
          <option value="">{t("allied.paramedicEcgAdmin.allCategories")}</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm" data-testid="select-admin-status">
          <option value="">{t("allied.paramedicEcgAdmin.allStatuses")}</option>
          <option value="published">{t("allied.paramedicEcgAdmin.published")}</option>
          <option value="draft">{t("allied.paramedicEcgAdmin.draft")}</option>
        </select>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-3 border-teal-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : waveforms.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl">
          <Activity className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">{t("allied.paramedicEcgAdmin.noWaveformsFoundClickSeed")}</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm" data-testid="table-waveforms">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">{t("allied.paramedicEcgAdmin.preview")}</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">{t("allied.paramedicEcgAdmin.name")}</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">{t("allied.paramedicEcgAdmin.category")}</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">{t("allied.paramedicEcgAdmin.type")}</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">{t("allied.paramedicEcgAdmin.difficulty")}</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">{t("allied.paramedicEcgAdmin.tier")}</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">{t("allied.paramedicEcgAdmin.status")}</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">{t("allied.paramedicEcgAdmin.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {waveforms.map((w: any) => (
                <tr key={w.id} className="hover:bg-gray-50" data-testid={`row-waveform-${w.slug}`}>
                  <td className="px-4 py-3" style={{ width: 160 }}>
                    <ECGStrip svgPathData={w.svgPathData} mode="strip" height={40} showGrid={false} />
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">{w.name}</td>
                  <td className="px-4 py-3 text-gray-600">{w.category}</td>
                  <td className="px-4 py-3 text-gray-600">{w.waveformType}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${w.difficulty === "beginner" ? "bg-green-100 text-green-700" : w.difficulty === "intermediate" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                      {w.difficulty}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{w.visibilityTier}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${w.status === "published" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                      {w.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => { setEditingWaveform(w); setShowForm(true); }}
                        className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-teal-600"
                        title={t("allied.paramedicEcgAdmin.edit")}
                        data-testid={`button-edit-${w.slug}`}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete "${w.name}"?`)) deleteMutation.mutate(w.id);
                        }}
                        className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-red-600"
                        title={t("allied.paramedicEcgAdmin.delete")}
                        data-testid={`button-delete-${w.slug}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function WaveformForm({ waveform, onSave, onCancel, isSaving, error }: {
  waveform: any;
  onSave: (data: any) => void;
  onCancel: () => void;
  isSaving: boolean;
  error?: string;
}) {
  const [name, setName] = useState(waveform?.name || "");
  const [slug, setSlug] = useState(waveform?.slug || "");
  const [category, setCategory] = useState(waveform?.category || "Cardiac Rhythms");
  const [waveformType, setWaveformType] = useState(waveform?.waveformType || "ecg-rhythm");
  const [difficulty, setDifficulty] = useState(waveform?.difficulty || "beginner");
  const [visibilityTier, setVisibilityTier] = useState(waveform?.visibilityTier || "free");
  const [status, setStatus] = useState(waveform?.status || "published");
  const [rate, setRate] = useState(waveform?.rate || "");
  const [regularity, setRegularity] = useState(waveform?.regularity || "");
  const [clinicalSignificance, setClinicalSignificance] = useState(waveform?.clinicalSignificance || "");
  const [treatmentNotes, setTreatmentNotes] = useState(waveform?.treatmentNotes || "");
  const [identifyingFeatures, setIdentifyingFeatures] = useState(waveform?.identifyingFeatures?.join("\n") || "");
  const [associatedConditions, setAssociatedConditions] = useState(waveform?.associatedConditions?.join("\n") || "");
  const [svgPathDataStr, setSvgPathDataStr] = useState(waveform?.svgPathData ? JSON.stringify(waveform.svgPathData, null, 2) : '{\n  "segments": [],\n  "repeatInterval": 70,\n  "totalWidth": 700\n}');
  const [clinicalAnnotationsStr, setClinicalAnnotationsStr] = useState(waveform?.clinicalAnnotations ? JSON.stringify(waveform.clinicalAnnotations, null, 2) : "{}");
  const [sortOrder, setSortOrder] = useState(waveform?.sortOrder?.toString() || "0");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let svgPathData, clinicalAnnotations;
    try { svgPathData = JSON.parse(svgPathDataStr); } catch { alert("Invalid SVG Path Data JSON"); return; }
    try { clinicalAnnotations = JSON.parse(clinicalAnnotationsStr); } catch { alert("Invalid Clinical Annotations JSON"); return; }

    onSave({
      ...(waveform?.id ? { id: waveform.id } : {}),
      name, slug, category, waveformType, difficulty, visibilityTier, status,
      rate, regularity, clinicalSignificance, treatmentNotes,
      identifyingFeatures: identifyingFeatures.split("\n").filter(Boolean),
      associatedConditions: associatedConditions.split("\n").filter(Boolean),
      svgPathData, clinicalAnnotations,
      sortOrder: parseInt(sortOrder) || 0,
      contentDomain: "paramedic",
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6" data-testid="waveform-form">
      <h2 className="text-lg font-bold text-gray-900 mb-4">{waveform ? "Edit Waveform" : "Add Waveform"}</h2>
      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">{t("allied.paramedicEcgAdmin.name2")}</label>
            <input value={name} onChange={(e) => { setName(e.target.value); if (!waveform) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "")); }} className="w-full px-3 py-2 border rounded-lg text-sm" data-testid="input-form-name" required />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">{t("allied.paramedicEcgAdmin.slug")}</label>
            <input value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" data-testid="input-form-slug" required />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">{t("allied.paramedicEcgAdmin.sortOrder")}</label>
            <input type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" data-testid="input-form-sort" />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">{t("allied.paramedicEcgAdmin.category2")}</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" data-testid="select-form-category">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">{t("allied.paramedicEcgAdmin.type2")}</label>
            <select value={waveformType} onChange={(e) => setWaveformType(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" data-testid="select-form-type">
              {WAVEFORM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">{t("allied.paramedicEcgAdmin.difficulty2")}</label>
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" data-testid="select-form-difficulty">
              {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">{t("allied.paramedicEcgAdmin.visibilityTier")}</label>
            <select value={visibilityTier} onChange={(e) => setVisibilityTier(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" data-testid="select-form-tier">
              {VISIBILITY_TIERS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">{t("allied.paramedicEcgAdmin.status2")}</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" data-testid="select-form-status">
              <option value="published">{t("allied.paramedicEcgAdmin.published2")}</option>
              <option value="draft">{t("allied.paramedicEcgAdmin.draft2")}</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">{t("allied.paramedicEcgAdmin.rate")}</label>
            <input value={rate} onChange={(e) => setRate(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="e.g., 60-100 bpm" data-testid="input-form-rate" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">{t("allied.paramedicEcgAdmin.regularity")}</label>
            <input value={regularity} onChange={(e) => setRegularity(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="e.g., Regular" data-testid="input-form-regularity" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">{t("allied.paramedicEcgAdmin.clinicalSignificance")}</label>
          <textarea value={clinicalSignificance} onChange={(e) => setClinicalSignificance(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" rows={2} data-testid="input-form-significance" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">{t("allied.paramedicEcgAdmin.treatmentNotes")}</label>
          <textarea value={treatmentNotes} onChange={(e) => setTreatmentNotes(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" rows={2} data-testid="input-form-treatment" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">{t("allied.paramedicEcgAdmin.identifyingFeaturesOnePerLine")}</label>
            <textarea value={identifyingFeatures} onChange={(e) => setIdentifyingFeatures(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm font-mono" rows={4} data-testid="input-form-features" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">{t("allied.paramedicEcgAdmin.associatedConditionsOnePerLine")}</label>
            <textarea value={associatedConditions} onChange={(e) => setAssociatedConditions(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm font-mono" rows={4} data-testid="input-form-conditions" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">{t("allied.paramedicEcgAdmin.svgPathDataJson")}</label>
          <textarea value={svgPathDataStr} onChange={(e) => setSvgPathDataStr(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm font-mono" rows={6} data-testid="input-form-svg" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">{t("allied.paramedicEcgAdmin.clinicalAnnotationsJson")}</label>
          <textarea value={clinicalAnnotationsStr} onChange={(e) => setClinicalAnnotationsStr(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm font-mono" rows={3} data-testid="input-form-annotations" />
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={isSaving} className="px-6 py-2.5 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 disabled:opacity-50" data-testid="button-save-waveform">
            {isSaving ? "Saving..." : "Save Waveform"}
          </button>
          <button type="button" onClick={onCancel} className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200" data-testid="button-cancel-form">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
