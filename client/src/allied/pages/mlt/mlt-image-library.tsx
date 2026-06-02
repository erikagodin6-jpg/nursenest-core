import { useState, useCallback, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Upload, Search, Filter, Edit, Trash2, Eye, Check, X, ChevronDown, Image as ImageIcon, Microscope, ArrowLeft } from "lucide-react";
import { LabImageViewer } from "../../components/lab-image-viewer";

import { useI18n } from "@/lib/i18n";
const DISCIPLINE_LABELS: Record<string, string> = {
  hematology: "Hematology",
  microbiology: "Microbiology",
  urinalysis: "Urinalysis",
  blood_banking: "Blood Banking",
  clinical_chemistry: "Clinical Chemistry",
  coagulation: "Coagulation",
  parasitology: "Parasitology",
  mycology: "Mycology",
  body_fluids: "Body Fluids",
  immunology: "Immunology",
  molecular: "Molecular",
  specimen_processing: "Specimen Processing",
};

const IMAGE_TYPE_LABELS: Record<string, string> = {
  hematology_cell_morphology: "Cell Morphology",
  microbiology_gram_stain: "Gram Stain",
  microbiology_colony_morphology: "Colony Morphology",
  urinalysis_sediment: "Urinalysis Sediment",
  urinalysis_chemical: "Urinalysis Chemical",
  blood_bank_reactions: "Blood Bank Reactions",
  blood_bank_antibody_panel: "Antibody Panel",
  clinical_chemistry_qc: "QC Chart",
  clinical_chemistry_electrophoresis: "Electrophoresis",
  coagulation: "Coagulation",
  parasitology: "Parasitology",
  mycology: "Mycology",
  body_fluid_analysis: "Body Fluid Analysis",
  immunology_serology: "Immunology/Serology",
  molecular_diagnostics: "Molecular Diagnostics",
  specimen_processing: "Specimen Processing",
};

const STATUS_OPTIONS = ["pending", "approved", "rejected", "archived"];

function getAdminCredentials() {

  try {
    const raw = localStorage.getItem("nursenest-credentials");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

async function apiRequest(url: string, options: RequestInit = {}) {
  const creds = getAdminCredentials();
  const headers: Record<string, string> = { "Content-Type": "application/json", ...(options.headers as Record<string, string> || {}) };
  if (creds) {
    headers["x-admin-id"] = creds.userId || "";
  }
  const res = await fetch(url, { ...options, headers, credentials: "include" });
  if (!res.ok) {
    const data = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(data.error || "Request failed");
  }
  return res.json();
}

function MltImageLibrary() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState("");
  const [filterDiscipline, setFilterDiscipline] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [editingImage, setEditingImage] = useState<any | null>(null);
  const [previewImage, setPreviewImage] = useState<any | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadDiscipline, setUploadDiscipline] = useState("hematology");
  const [uploadImageType, setUploadImageType] = useState("hematology_cell_morphology");
  const [uploadAltText, setUploadAltText] = useState("");
  const [uploadCaption, setUploadCaption] = useState("");

  const { data: images = [], isLoading } = useQuery({
    queryKey: ["mlt-lab-images", filterDiscipline, filterType, filterStatus],
    queryFn: () => {
      const params = new URLSearchParams();
      if (filterDiscipline) params.set("discipline", filterDiscipline);
      if (filterType) params.set("imageType", filterType);
      if (filterStatus) params.set("status", filterStatus);
      return apiRequest(`/api/mlt/lab-images?${params}`);
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const creds = getAdminCredentials();
      const formData = new FormData();
      formData.append("image", file);
      formData.append("discipline", uploadDiscipline);
      formData.append("imageType", uploadImageType);
      if (uploadAltText) formData.append("altText", uploadAltText);
      if (uploadCaption) formData.append("caption", uploadCaption);
      const headers: Record<string, string> = {};
      if (creds) headers["x-admin-id"] = creds.userId || "";
      const res = await fetch("/api/mlt/lab-images/upload", { method: "POST", body: formData, headers, credentials: "include" });
      if (!res.ok) throw new Error((await res.json()).error || "Upload failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mlt-lab-images"] });
      setShowUploadForm(false);
      setUploadAltText("");
      setUploadCaption("");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) => apiRequest(`/api/mlt/lab-images/${id}`, { method: "PATCH", body: JSON.stringify(updates) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mlt-lab-images"] });
      setEditingImage(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/mlt/lab-images/${id}`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["mlt-lab-images"] }),
  });

  const bulkUpdateMutation = useMutation({
    mutationFn: ({ ids, updates }: { ids: string[]; updates: any }) => apiRequest("/api/mlt/lab-images/bulk-update", { method: "POST", body: JSON.stringify({ ids, updates }) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mlt-lab-images"] });
      setSelectedIds(new Set());
    },
  });

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) uploadMutation.mutate(file);
    },
    [uploadMutation]
  );

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const filteredImages = images.filter((img: any) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      img.altText?.toLowerCase().includes(q) ||
      img.caption?.toLowerCase().includes(q) ||
      img.fileName?.toLowerCase().includes(q) ||
      img.organism?.toLowerCase().includes(q) ||
      img.cellType?.toLowerCase().includes(q) ||
      img.specimen?.toLowerCase().includes(q) ||
      img.tags?.some((t: string) => t.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <a href="/admin/allied" className="p-2 hover:bg-gray-200 rounded-lg" data-testid="link-back-admin">
            <ArrowLeft className="w-5 h-5" />
          </a>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2" data-testid="text-page-title">
              <Microscope className="w-6 h-6 text-teal-600" /> MLT Lab Image Library
            </h1>
            <p className="text-sm text-gray-500">{images.length} images in library</p>
          </div>
          <button onClick={() => setShowUploadForm(!showUploadForm)} className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium" data-testid="button-upload-image">
            <Upload className="w-4 h-4" /> Upload Image
          </button>
        </div>

        {showUploadForm && (
          <div className="bg-white rounded-xl border p-6 mb-6 shadow-sm" data-testid="upload-form">
            <h3 className="text-lg font-semibold mb-4">{t("allied.mltMltImageLibrary.uploadLabImage")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("allied.mltMltImageLibrary.discipline")}</label>
                <select value={uploadDiscipline} onChange={(e) => setUploadDiscipline(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" data-testid="select-upload-discipline">
                  {Object.entries(DISCIPLINE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("allied.mltMltImageLibrary.imageType")}</label>
                <select value={uploadImageType} onChange={(e) => setUploadImageType(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" data-testid="select-upload-type">
                  {Object.entries(IMAGE_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("allied.mltMltImageLibrary.altText")}</label>
                <input type="text" value={uploadAltText} onChange={(e) => setUploadAltText(e.target.value)} placeholder={t("allied.mltMltImageLibrary.describeTheImage")} className="w-full border rounded-lg px-3 py-2 text-sm" data-testid="input-upload-alt" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("allied.mltMltImageLibrary.caption")}</label>
                <input type="text" value={uploadCaption} onChange={(e) => setUploadCaption(e.target.value)} placeholder={t("allied.mltMltImageLibrary.optionalCaption")} className="w-full border rounded-lg px-3 py-2 text-sm" data-testid="input-upload-caption" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/tiff" onChange={handleFileSelect} className="hidden" data-testid="input-file-upload" />
              <button onClick={() => fileInputRef.current?.click()} disabled={uploadMutation.isPending} className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 disabled:opacity-50 text-sm" data-testid="button-select-file">
                <ImageIcon className="w-4 h-4" />
                {uploadMutation.isPending ? "Uploading..." : "Select File"}
              </button>
              <span className="text-xs text-gray-400">{t("allied.mltMltImageLibrary.max20mbJpegPngWebp")}</span>
              {uploadMutation.isError && <span className="text-xs text-red-500">{(uploadMutation.error as Error).message}</span>}
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl border shadow-sm mb-6">
          <div className="p-4 border-b flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("allied.mltMltImageLibrary.searchImages")} className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm" data-testid="input-search-images" />
            </div>
            <select value={filterDiscipline} onChange={(e) => setFilterDiscipline(e.target.value)} className="border rounded-lg px-3 py-2 text-sm" data-testid="select-filter-discipline">
              <option value="">{t("allied.mltMltImageLibrary.allDisciplines")}</option>
              {Object.entries(DISCIPLINE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="border rounded-lg px-3 py-2 text-sm" data-testid="select-filter-type">
              <option value="">{t("allied.mltMltImageLibrary.allTypes")}</option>
              {Object.entries(IMAGE_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="border rounded-lg px-3 py-2 text-sm" data-testid="select-filter-status">
              <option value="">{t("allied.mltMltImageLibrary.allStatuses")}</option>
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
          </div>

          {selectedIds.size > 0 && (
            <div className="p-3 bg-teal-50 border-b flex items-center gap-3" data-testid="bulk-actions">
              <span className="text-sm font-medium text-teal-800">{selectedIds.size} selected</span>
              <button onClick={() => bulkUpdateMutation.mutate({ ids: Array.from(selectedIds), updates: { status: "approved" } })} className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700" data-testid="button-bulk-approve">
                Approve
              </button>
              <button onClick={() => bulkUpdateMutation.mutate({ ids: Array.from(selectedIds), updates: { approvalExam: true } })} className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700" data-testid="button-bulk-exam">
                Allow Exam
              </button>
              <button onClick={() => bulkUpdateMutation.mutate({ ids: Array.from(selectedIds), updates: { approvalLesson: true } })} className="text-xs bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700" data-testid="button-bulk-lesson">
                Allow Lesson
              </button>
              <button onClick={() => setSelectedIds(new Set())} className="text-xs text-gray-500 hover:text-gray-700 ml-auto" data-testid="button-clear-selection">
                Clear
              </button>
            </div>
          )}

          {isLoading ? (
            <div className="p-8 text-center text-gray-400 text-sm">{t("allied.mltMltImageLibrary.loadingImages")}</div>
          ) : filteredImages.length === 0 ? (
            <div className="p-8 text-center" data-testid="empty-state">
              <Microscope className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">{t("allied.mltMltImageLibrary.noImagesFound")}</p>
              <p className="text-gray-400 text-sm mt-1">{t("allied.mltMltImageLibrary.uploadMicroscopyImagesToBuild")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
              {filteredImages.map((img: any) => (
                <div key={img.id} className={`relative group rounded-xl border overflow-hidden bg-white hover:shadow-md transition-shadow ${selectedIds.has(img.id) ? "ring-2 ring-teal-500" : ""}`} data-testid={`card-image-${img.id}`}>
                  <div className="absolute top-2 left-2 z-10">
                    <input type="checkbox" checked={selectedIds.has(img.id)} onChange={() => toggleSelect(img.id)} className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500" data-testid={`checkbox-image-${img.id}`} />
                  </div>
                  <div className="aspect-square bg-gray-100 cursor-pointer" onClick={() => setPreviewImage(img)}>
                    {img.imageUrl ? (
                      <img src={img.thumbnailUrl || img.imageUrl} alt={img.altText || `Laboratory reference image - NurseNest allied health education`} title={img.altText || img.fileName || "Laboratory reference image"} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <ImageIcon className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-medium text-gray-800 truncate">{img.altText || img.fileName || "Untitled"}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${img.status === "approved" ? "bg-green-100 text-green-700" : img.status === "rejected" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
                        {img.status}
                      </span>
                      <span className="text-[10px] text-gray-400">{DISCIPLINE_LABELS[img.discipline] || img.discipline}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setPreviewImage(img)} className="p-1 hover:bg-gray-100 rounded" title={t("allied.mltMltImageLibrary.preview")} data-testid={`button-preview-${img.id}`}>
                        <Eye className="w-3.5 h-3.5 text-gray-500" />
                      </button>
                      <button onClick={() => setEditingImage(img)} className="p-1 hover:bg-gray-100 rounded" title={t("allied.mltMltImageLibrary.edit")} data-testid={`button-edit-${img.id}`}>
                        <Edit className="w-3.5 h-3.5 text-gray-500" />
                      </button>
                      <button onClick={() => { if (confirm("Delete this image?")) deleteMutation.mutate(img.id); }} className="p-1 hover:bg-red-50 rounded" title={t("allied.mltMltImageLibrary.delete")} data-testid={`button-delete-${img.id}`}>
                        <Trash2 className="w-3.5 h-3.5 text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {previewImage && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setPreviewImage(null)} data-testid="image-preview-modal">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold">{previewImage.altText || previewImage.fileName || "Image Preview"}</h3>
              <button onClick={() => setPreviewImage(null)} className="p-1 hover:bg-gray-100 rounded" data-testid="button-close-preview"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-4">
              <LabImageViewer src={previewImage.imageUrl} alt={previewImage.altText} caption={previewImage.caption} />
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-gray-500">{t("allied.mltMltImageLibrary.discipline2")}</span> <span className="font-medium">{DISCIPLINE_LABELS[previewImage.discipline]}</span></div>
                <div><span className="text-gray-500">{t("allied.mltMltImageLibrary.type")}</span> <span className="font-medium">{IMAGE_TYPE_LABELS[previewImage.imageType]}</span></div>
                <div><span className="text-gray-500">{t("allied.mltMltImageLibrary.status")}</span> <span className="font-medium">{previewImage.status}</span></div>
                <div><span className="text-gray-500">{t("allied.mltMltImageLibrary.quality")}</span> <span className="font-medium">{previewImage.qualityScore}/100</span></div>
                {previewImage.stainType && <div><span className="text-gray-500">{t("allied.mltMltImageLibrary.stain")}</span> <span className="font-medium">{previewImage.stainType}</span></div>}
                {previewImage.organism && <div><span className="text-gray-500">{t("allied.mltMltImageLibrary.organism")}</span> <span className="font-medium">{previewImage.organism}</span></div>}
                {previewImage.cellType && <div><span className="text-gray-500">{t("allied.mltMltImageLibrary.cellType")}</span> <span className="font-medium">{previewImage.cellType}</span></div>}
                {previewImage.magnification && <div><span className="text-gray-500">{t("allied.mltMltImageLibrary.magnification")}</span> <span className="font-medium">{previewImage.magnification}</span></div>}
                {previewImage.specimen && <div><span className="text-gray-500">{t("allied.mltMltImageLibrary.specimen")}</span> <span className="font-medium">{previewImage.specimen}</span></div>}
                {previewImage.normalAbnormal && <div><span className="text-gray-500">{t("allied.mltMltImageLibrary.normalabnormal")}</span> <span className="font-medium">{previewImage.normalAbnormal}</span></div>}
              </div>
              <div className="mt-3 flex gap-2">
                {previewImage.approvalExam && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{t("allied.mltMltImageLibrary.exam")}</span>}
                {previewImage.approvalLesson && <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">{t("allied.mltMltImageLibrary.lesson")}</span>}
                {previewImage.approvalFlashcard && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">{t("allied.mltMltImageLibrary.flashcard")}</span>}
                {previewImage.approvalPublic && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">{t("allied.mltMltImageLibrary.public")}</span>}
              </div>
            </div>
          </div>
        </div>
      )}

      {editingImage && (
        <ImageMetadataEditor
          image={editingImage}
          onSave={(updates: any) => updateMutation.mutate({ id: editingImage.id, updates })}
          onClose={() => setEditingImage(null)}
          saving={updateMutation.isPending}
        />
      )}
    </div>
  );
}

function ImageMetadataEditor({ image, onSave, onClose, saving }: { image: any; onSave: (u: any) => void; onClose: () => void; saving: boolean }) {
  const [form, setForm] = useState({ ...image });
  const update = (key: string, value: any) => setForm((f: any) => ({ ...f, [key]: value }));

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" data-testid="metadata-editor-modal">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold">{t("allied.mltMltImageLibrary.editImageMetadata")}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded" data-testid="button-close-editor"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("allied.mltMltImageLibrary.altText2")}</label>
              <input type="text" value={form.altText || ""} onChange={(e) => update("altText", e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" data-testid="input-edit-alt" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("allied.mltMltImageLibrary.caption2")}</label>
              <input type="text" value={form.caption || ""} onChange={(e) => update("caption", e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" data-testid="input-edit-caption" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("allied.mltMltImageLibrary.discipline3")}</label>
              <select value={form.discipline} onChange={(e) => update("discipline", e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" data-testid="select-edit-discipline">
                {Object.entries(DISCIPLINE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("allied.mltMltImageLibrary.imageType2")}</label>
              <select value={form.imageType} onChange={(e) => update("imageType", e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" data-testid="select-edit-type">
                {Object.entries(IMAGE_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("allied.mltMltImageLibrary.status2")}</label>
              <select value={form.status} onChange={(e) => update("status", e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" data-testid="select-edit-status">
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("allied.mltMltImageLibrary.qualityScore0100")}</label>
              <input type="number" min={0} max={100} value={form.qualityScore || 0} onChange={(e) => update("qualityScore", parseInt(e.target.value))} className="w-full border rounded-lg px-3 py-2 text-sm" data-testid="input-edit-quality" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("allied.mltMltImageLibrary.stainType")}</label>
              <input type="text" value={form.stainType || ""} onChange={(e) => update("stainType", e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" data-testid="input-edit-stain" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("allied.mltMltImageLibrary.organism2")}</label>
              <input type="text" value={form.organism || ""} onChange={(e) => update("organism", e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" data-testid="input-edit-organism" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("allied.mltMltImageLibrary.cellType2")}</label>
              <input type="text" value={form.cellType || ""} onChange={(e) => update("cellType", e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" data-testid="input-edit-cell" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("allied.mltMltImageLibrary.crystalType")}</label>
              <input type="text" value={form.crystalType || ""} onChange={(e) => update("crystalType", e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" data-testid="input-edit-crystal" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("allied.mltMltImageLibrary.castType")}</label>
              <input type="text" value={form.castType || ""} onChange={(e) => update("castType", e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" data-testid="input-edit-cast" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("allied.mltMltImageLibrary.specimen2")}</label>
              <input type="text" value={form.specimen || ""} onChange={(e) => update("specimen", e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" data-testid="input-edit-specimen" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("allied.mltMltImageLibrary.magnification2")}</label>
              <input type="text" value={form.magnification || ""} onChange={(e) => update("magnification", e.target.value)} placeholder="e.g., 100x, 1000x oil" className="w-full border rounded-lg px-3 py-2 text-sm" data-testid="input-edit-magnification" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("allied.mltMltImageLibrary.normalAbnormal")}</label>
              <select value={form.normalAbnormal || "abnormal"} onChange={(e) => update("normalAbnormal", e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" data-testid="select-edit-normal">
                <option value="normal">{t("allied.mltMltImageLibrary.normal")}</option>
                <option value="abnormal">{t("allied.mltMltImageLibrary.abnormal")}</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("allied.mltMltImageLibrary.clinicalSignificance")}</label>
            <textarea value={form.clinicalSignificance || ""} onChange={(e) => update("clinicalSignificance", e.target.value)} rows={2} className="w-full border rounded-lg px-3 py-2 text-sm" data-testid="input-edit-significance" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t("allied.mltMltImageLibrary.approvalFlags")}</label>
            <div className="flex flex-wrap gap-3">
              {[
                { key: "approvalExam", label: "Exam" },
                { key: "approvalLesson", label: "Lesson" },
                { key: "approvalFlashcard", label: "Flashcard" },
                { key: "approvalPublic", label: "Public" },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-1.5 text-sm">
                  <input type="checkbox" checked={form[key] || false} onChange={(e) => update(key, e.target.checked)} className="rounded text-teal-600" data-testid={`checkbox-${key}`} />
                  {label}
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={onClose} className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50" data-testid="button-cancel-edit">{t("allied.mltMltImageLibrary.cancel")}</button>
            <button onClick={() => {
              const { id, createdAt, updatedAt, ...updates } = form;
              onSave(updates);
            }} disabled={saving} className="px-4 py-2 text-sm bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50" data-testid="button-save-edit">
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MltImageLibrary;
