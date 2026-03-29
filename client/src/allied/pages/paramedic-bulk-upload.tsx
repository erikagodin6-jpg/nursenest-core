import { useState, useEffect, useCallback } from "react";
import {
  Upload, FileText, CheckCircle2, AlertTriangle, AlertCircle, RefreshCw,
  Download, Trash2, Eye, Send, RotateCcw, History, Library, Settings,
  ChevronDown, ChevronRight, Filter, X, Plus, Save, Loader2,
  MapPin, ArrowRight, FileCheck, Package, BookOpen, Zap
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

import { useI18n } from "@/lib/i18n";
const ADMIN_ID = "d9b0e5b3-83c7-4e08-b6b7-6cf9cc33b225";

async function apiFetch(url: string, opts?: RequestInit) {
  const { t } = useI18n();
  const sep = url.includes("?") ? "&" : "?";
  const res = await fetch(`${url}${sep}adminId=${ADMIN_ID}`, {
    ...opts,
    headers: { "Content-Type": "application/json", "x-admin-id": ADMIN_ID, ...(opts?.headers || {}) },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

const CONTENT_TYPES = [
  { id: "question", label: "Questions", icon: BookOpen },
  { id: "flashcard", label: "Flashcards", icon: Zap },
  { id: "lesson", label: "Lessons", icon: FileText },
  { id: "scenario", label: "Scenarios", icon: MapPin },
  { id: "glossary", label: "Glossary", icon: BookOpen },
  { id: "seo_page", label: "SEO Pages", icon: FileText },
  { id: "study_guide", label: "Study Guides", icon: FileCheck },
  { id: "practice_exam", label: "Practice Exams", icon: Package },
];

type Tab = "upload" | "validate" | "preview" | "map" | "publish" | "library" | "errors" | "history" | "templates";

export default function ParamedicBulkUpload() {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>("upload");
  const [loading, setLoading] = useState(false);

  const [rawInput, setRawInput] = useState("");
  const [inputFormat, setInputFormat] = useState<string>("");
  const [contentType, setContentType] = useState("question");
  const [parsedData, setParsedData] = useState<any>(null);

  const [importId, setImportId] = useState<string | null>(null);
  const [importData, setImportData] = useState<any>(null);
  const [validationErrors, setValidationErrors] = useState<any[]>([]);
  const [errorFilter, setErrorFilter] = useState<string>("all");

  const [detectedHeaders, setDetectedHeaders] = useState<string[]>([]);
  const [fieldMappings, setFieldMappings] = useState<Record<string, string>>({});
  const [schemaFields, setSchemaFields] = useState<any>(null);
  const [mappingTemplates, setMappingTemplates] = useState<any[]>([]);
  const [mappingTemplateName, setMappingTemplateName] = useState("");

  const [history, setHistory] = useState<any[]>([]);
  const [historyTotal, setHistoryTotal] = useState(0);

  const [library, setLibrary] = useState<any[]>([]);
  const [libraryTotal, setLibraryTotal] = useState(0);
  const [libraryType, setLibraryType] = useState("");
  const [libraryStatus, setLibraryStatus] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [editingItem, setEditingItem] = useState<any>(null);
  const [editingData, setEditingData] = useState<string>("");

  const loadSchema = useCallback(async (ct: string) => {
    try {
      const data = await apiFetch(`/api/paramedic/bulk/schema/${ct}`);
      setSchemaFields(data);
    } catch {}
  }, []);

  const loadMappingTemplates = useCallback(async () => {
    try {
      const data = await apiFetch(`/api/paramedic/bulk/mapping-templates?contentType=${contentType}`);
      setMappingTemplates(data);
    } catch {}
  }, [contentType]);

  const loadHistory = useCallback(async () => {
    try {
      const data = await apiFetch("/api/paramedic/bulk/history");
      setHistory(data.imports || []);
      setHistoryTotal(data.total || 0);
    } catch {}
  }, []);

  const loadLibrary = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (libraryType) params.set("contentType", libraryType);
      if (libraryStatus) params.set("status", libraryStatus);
      const data = await apiFetch(`/api/paramedic/bulk/library?${params.toString()}`);
      setLibrary(data.items || []);
      setLibraryTotal(data.total || 0);
    } catch {}
  }, [libraryType, libraryStatus]);

  const loadImportDetails = useCallback(async (id: string) => {
    try {
      const data = await apiFetch(`/api/paramedic/bulk/import/${id}`);
      setImportData(data);
      const items = data.items || [];
      const errs: any[] = [];
      items.forEach((item: any) => {
        if (item.validation_errors) {
          const parsed = typeof item.validation_errors === "string" ? JSON.parse(item.validation_errors) : item.validation_errors;
          errs.push(...parsed);
        }
      });
      setValidationErrors(errs);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  }, [toast]);

  useEffect(() => { loadSchema(contentType); loadMappingTemplates(); }, [contentType, loadSchema, loadMappingTemplates]);
  useEffect(() => { if (tab === "history") loadHistory(); }, [tab, loadHistory]);
  useEffect(() => { if (tab === "library") loadLibrary(); }, [tab, loadLibrary, libraryType, libraryStatus]);

  const handleParse = async () => {
    if (!rawInput.trim()) {
      toast({ title: "Input required", description: "Paste or type content data", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const data = await apiFetch("/api/paramedic/bulk/parse", {
        method: "POST",
        body: JSON.stringify({ input: rawInput, format: inputFormat || undefined }),
      });
      setParsedData(data);
      setDetectedHeaders(data.headers || []);
      const autoMap: Record<string, string> = {};
      if (schemaFields) {
        const allFields = [...(schemaFields.required || []), ...(schemaFields.optional || [])];
        data.headers.forEach((h: string) => {
          const lower = h.toLowerCase().replace(/[_\s-]/g, "");
          const match = allFields.find((f: string) => f.toLowerCase().replace(/[_\s-]/g, "") === lower);
          if (match) autoMap[h] = match;
        });
      }
      setFieldMappings(autoMap);
      toast({ title: "Parsed", description: `${data.rowCount} rows detected (${data.detectedFormat})` });
      if (data.rowCount > 0) setTab("map");
    } catch (e: any) {
      toast({ title: "Parse error", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (!rawInput.trim()) return;
    setLoading(true);
    try {
      const hasMappings = Object.keys(fieldMappings).length > 0;
      const data = await apiFetch("/api/paramedic/bulk/import", {
        method: "POST",
        body: JSON.stringify({
          input: rawInput,
          format: inputFormat || undefined,
          contentType,
          mappings: hasMappings ? fieldMappings : undefined,
        }),
      });
      setImportId(data.importId);
      setValidationErrors(data.validationErrors || []);
      toast({
        title: "Import validated",
        description: `${data.validItems} valid, ${data.errorItems} errors out of ${data.totalItems} items`,
      });
      loadImportDetails(data.importId);
      setTab("validate");
    } catch (e: any) {
      toast({ title: "Import error", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleRevalidate = async () => {
    if (!importId) return;
    setLoading(true);
    try {
      const data = await apiFetch(`/api/paramedic/bulk/import/${importId}/revalidate`, { method: "POST" });
      setValidationErrors(data.validationErrors || []);
      loadImportDetails(importId);
      toast({ title: "Revalidated", description: `${data.validItems} valid, ${data.errorItems} errors` });
    } catch (e: any) {
      toast({ title: "Revalidation failed", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (itemIds?: string[]) => {
    if (!importId) return;
    setLoading(true);
    try {
      const data = await apiFetch(`/api/paramedic/bulk/import/${importId}/publish`, {
        method: "POST",
        body: JSON.stringify({ itemIds }),
      });
      toast({ title: "Published!", description: `${data.published} items published successfully` });
      loadImportDetails(importId);
      setTab("preview");
    } catch (e: any) {
      toast({ title: "Publish failed", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleRollback = async (id: string) => {
    setLoading(true);
    try {
      const data = await apiFetch(`/api/paramedic/bulk/import/${id}/rollback`, { method: "POST" });
      toast({ title: "Rolled back", description: `${data.rolledBack} items removed` });
      loadHistory();
    } catch (e: any) {
      toast({ title: "Rollback failed", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMapping = async () => {
    if (!mappingTemplateName.trim()) {
      toast({ title: "Name required", variant: "destructive" });
      return;
    }
    try {
      await apiFetch("/api/paramedic/bulk/mapping-templates", {
        method: "POST",
        body: JSON.stringify({ name: mappingTemplateName, contentType, mappings: fieldMappings }),
      });
      toast({ title: "Mapping saved" });
      setMappingTemplateName("");
      loadMappingTemplates();
    } catch (e: any) {
      toast({ title: "Save failed", description: e.message, variant: "destructive" });
    }
  };

  const handleLoadMapping = (template: any) => {
    const mappings = typeof template.mappings === "string" ? JSON.parse(template.mappings) : template.mappings;
    setFieldMappings(mappings);
    toast({ title: "Mapping loaded", description: template.name });
  };

  const handleUpdateItem = async (itemId: string) => {
    if (!importId) return;
    try {
      const data = JSON.parse(editingData);
      const result = await apiFetch(`/api/paramedic/bulk/import/${importId}/item/${itemId}`, {
        method: "PUT",
        body: JSON.stringify({ data }),
      });
      toast({ title: "Item updated", description: `Validation: ${result.validationStatus}` });
      setEditingItem(null);
      loadImportDetails(importId);
    } catch (e: any) {
      toast({ title: "Update failed", description: e.message, variant: "destructive" });
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedIds.size === 0) {
      toast({ title: "Select items first", variant: "destructive" });
      return;
    }
    const ct = libraryType || "question";
    try {
      const data = await apiFetch("/api/paramedic/bulk/library/bulk-action", {
        method: "POST",
        body: JSON.stringify({ action, contentType: ct, ids: Array.from(selectedIds) }),
      });
      toast({ title: `${action} complete`, description: `${data.affected} items affected` });
      setSelectedIds(new Set());
      loadLibrary();
    } catch (e: any) {
      toast({ title: "Action failed", description: e.message, variant: "destructive" });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      setRawInput(text);
      if (file.name.endsWith(".json")) setInputFormat("json");
      else if (file.name.endsWith(".csv")) setInputFormat("csv");
      else setInputFormat("");
      toast({ title: "File loaded", description: `${file.name} (${(file.size / 1024).toFixed(1)} KB)` });
    };
    reader.readAsText(file);
  };

  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2" data-testid="text-access-denied">{t("allied.paramedicBulkUpload.adminAccessRequired")}</h1>
        <p className="text-gray-600">{t("allied.paramedicBulkUpload.youNeedAdminPrivilegesTo")}</p>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: "upload", label: "Upload", icon: Upload },
    { id: "map", label: "Map Fields", icon: ArrowRight },
    { id: "validate", label: "Validate", icon: CheckCircle2 },
    { id: "preview", label: "Preview", icon: Eye },
    { id: "publish", label: "Publish Queue", icon: Send },
    { id: "library", label: "Content Library", icon: Library },
    { id: "errors", label: "Errors", icon: AlertCircle },
    { id: "history", label: "Import History", icon: History },
    { id: "templates", label: "Templates", icon: Settings },
  ];

  const filteredErrors = validationErrors.filter(e => {
    if (errorFilter === "all") return true;
    return e.severity === errorFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8" data-testid="paramedic-bulk-upload-page">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Upload className="w-7 h-7 text-red-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900" data-testid="text-bulk-title">{t("allied.paramedicBulkUpload.paramedicBulkUploadManager")}</h1>
            <p className="text-sm text-gray-500">{t("allied.paramedicBulkUpload.importValidateAndPublishParamedic")}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 text-xs font-medium bg-red-50 text-red-700 rounded-full" data-testid="badge-domain">{t("allied.paramedicBulkUpload.contentdomainParamedic")}</span>
        </div>
      </div>

      <div className="flex bg-gray-100 rounded-lg p-0.5 mb-6 flex-wrap gap-0.5">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              tab === t.id ? "bg-white text-red-700 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
            data-testid={`tab-${t.id}`}
          >
            <t.icon className="w-3.5 h-3.5" /> {t.label}
          </button>
        ))}
      </div>

      {tab === "upload" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5 text-red-500" /> Input Content
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">{t("allied.paramedicBulkUpload.contentType")}</label>
                <select
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  data-testid="select-content-type"
                >
                  {CONTENT_TYPES.map(ct => (
                    <option key={ct.id} value={ct.id}>{ct.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">{t("allied.paramedicBulkUpload.inputFormatAutodetected")}</label>
                <select
                  value={inputFormat}
                  onChange={(e) => setInputFormat(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  data-testid="select-format"
                >
                  <option value="">{t("allied.paramedicBulkUpload.autodetect")}</option>
                  <option value="json">JSON</option>
                  <option value="csv">CSV</option>
                  <option value="tabular">{t("allied.paramedicBulkUpload.tabularTabPipe")}</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-600 mb-1">{t("allied.paramedicBulkUpload.uploadFile")}</label>
              <input
                type="file"
                accept=".json,.csv,.txt,.tsv"
                onChange={handleFileUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                data-testid="input-file-upload"
              />
            </div>

            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-600 mb-1">{t("allied.paramedicBulkUpload.orPasteContentJsonCsv")}</label>
              <textarea
                value={rawInput}
                onChange={(e) => setRawInput(e.target.value)}
                placeholder={`Paste your ${contentType} data here...\n\nJSON example: [{"stem": "...", "options": [...]}]\nCSV example: stem,options,correctAnswer,...\nTabular: stem\\toptions\\tcorrectAnswer`}
                className="w-full h-48 px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono resize-y"
                data-testid="textarea-raw-input"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleParse}
                disabled={loading || !rawInput.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 disabled:opacity-50"
                data-testid="button-parse"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
                Parse & Preview
              </button>
              <button
                onClick={handleImport}
                disabled={loading || !rawInput.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
                data-testid="button-import"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                Import & Validate
              </button>
            </div>
          </div>

          {parsedData && (
            <div className="bg-white rounded-xl border border-gray-100 p-6" data-testid="parsed-preview">
              <h4 className="font-medium text-gray-900 mb-3">Parsed Preview ({parsedData.rowCount} rows, {parsedData.detectedFormat})</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-50">
                      {parsedData.headers?.map((h: string, i: number) => (
                        <th key={i} className="px-3 py-2 text-left font-medium text-gray-600">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {parsedData.sampleRows?.map((row: any, i: number) => (
                      <tr key={i} className="border-t border-gray-50">
                        {parsedData.headers?.map((h: string, j: number) => (
                          <td key={j} className="px-3 py-2 text-gray-700 max-w-[200px] truncate">
                            {typeof row[h] === "object" ? JSON.stringify(row[h]).substring(0, 60) : String(row[h] || "").substring(0, 60)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "map" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-red-500" /> Field Mapping
            </h3>
            <p className="text-sm text-gray-600 mb-4">Map your input columns to the expected schema fields for <strong>{contentType}</strong> {t("allied.paramedicBulkUpload.content")}</p>

            {mappingTemplates.length > 0 && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs font-medium text-gray-600 mb-2">{t("allied.paramedicBulkUpload.loadSavedTemplate")}</p>
                <div className="flex flex-wrap gap-2">
                  {mappingTemplates.map((t: any) => (
                    <button
                      key={t.id}
                      onClick={() => handleLoadMapping(t)}
                      className="px-3 py-1 text-xs bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                      data-testid={`button-load-mapping-${t.id}`}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3 mb-6">
              {detectedHeaders.map((header) => {
                const allFields = schemaFields ? [...(schemaFields.required || []), ...(schemaFields.optional || [])] : [];
                return (
                  <div key={header} className="flex items-center gap-3">
                    <span className="w-48 text-sm font-mono text-gray-700 truncate" title={header}>{header}</span>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                    <select
                      value={fieldMappings[header] || ""}
                      onChange={(e) => setFieldMappings(prev => ({ ...prev, [header]: e.target.value }))}
                      className={`flex-1 px-3 py-1.5 border rounded-lg text-sm ${
                        fieldMappings[header] ? "border-green-300 bg-green-50" : "border-gray-200"
                      }`}
                      data-testid={`mapping-${header}`}
                    >
                      <option value="">{t("allied.paramedicBulkUpload.skipNotMapped")}</option>
                      {allFields.map((f: string) => (
                        <option key={f} value={f}>{f} {schemaFields?.required?.includes(f) ? "(required)" : ""}</option>
                      ))}
                    </select>
                    {schemaFields?.required?.includes(fieldMappings[header]) && (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                );
              })}
            </div>

            {schemaFields && (
              <div className="p-3 bg-amber-50 rounded-lg mb-4">
                <p className="text-xs font-medium text-amber-700 mb-1">{t("allied.paramedicBulkUpload.unmappedRequiredFields")}</p>
                <div className="flex flex-wrap gap-1">
                  {(schemaFields.required || [])
                    .filter((f: string) => !Object.values(fieldMappings).includes(f))
                    .map((f: string) => (
                      <span key={f} className="px-2 py-0.5 text-xs bg-amber-100 text-amber-800 rounded">{f}</span>
                    ))}
                  {(schemaFields.required || []).every((f: string) => Object.values(fieldMappings).includes(f)) && (
                    <span className="text-xs text-green-700">{t("allied.paramedicBulkUpload.allRequiredFieldsMapped")}</span>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <input
                type="text"
                value={mappingTemplateName}
                onChange={(e) => setMappingTemplateName(e.target.value)}
                placeholder={t("allied.paramedicBulkUpload.templateName")}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
                data-testid="input-mapping-name"
              />
              <button
                onClick={handleSaveMapping}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                data-testid="button-save-mapping"
              >
                <Save className="w-3.5 h-3.5" /> Save Mapping
              </button>
              <div className="flex-1" />
              <button
                onClick={handleImport}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
                data-testid="button-import-mapped"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                Import with Mapping
              </button>
            </div>
          </div>
        </div>
      )}

      {tab === "validate" && (
        <div className="space-y-6">
          {importData && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl border border-gray-100 p-4" data-testid="stat-total">
                <div className="text-2xl font-bold text-gray-900">{importData.import?.total_items || 0}</div>
                <div className="text-xs text-gray-500">{t("allied.paramedicBulkUpload.totalItems")}</div>
              </div>
              <div className="bg-white rounded-xl border border-green-100 p-4" data-testid="stat-valid">
                <div className="text-2xl font-bold text-green-700">{importData.import?.valid_items || 0}</div>
                <div className="text-xs text-gray-500">{t("allied.paramedicBulkUpload.valid")}</div>
              </div>
              <div className="bg-white rounded-xl border border-red-100 p-4" data-testid="stat-errors">
                <div className="text-2xl font-bold text-red-700">{importData.import?.error_items || 0}</div>
                <div className="text-xs text-gray-500">{t("allied.paramedicBulkUpload.errors")}</div>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-4" data-testid="stat-status">
                <div className="text-lg font-bold text-gray-900 capitalize">{importData.import?.status || "—"}</div>
                <div className="text-xs text-gray-500">{t("allied.paramedicBulkUpload.status")}</div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-red-500" /> Validation Results
              </h3>
              <div className="flex items-center gap-2">
                <select
                  value={errorFilter}
                  onChange={(e) => setErrorFilter(e.target.value)}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs"
                  data-testid="select-error-filter"
                >
                  <option value="all">All ({validationErrors.length})</option>
                  <option value="error">Errors ({validationErrors.filter(e => e.severity === "error").length})</option>
                  <option value="warning">Warnings ({validationErrors.filter(e => e.severity === "warning").length})</option>
                </select>
                <button
                  onClick={handleRevalidate}
                  disabled={loading}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  data-testid="button-revalidate"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Revalidate
                </button>
              </div>
            </div>

            {filteredErrors.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-2" />
                <p className="font-medium">{t("allied.paramedicBulkUpload.allItemsPassValidation")}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs" data-testid="validation-table">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-3 py-2 text-left font-medium text-gray-600">{t("allied.paramedicBulkUpload.row")}</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-600">{t("allied.paramedicBulkUpload.status2")}</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-600">{t("allied.paramedicBulkUpload.field")}</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-600">{t("allied.paramedicBulkUpload.problem")}</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-600">{t("allied.paramedicBulkUpload.suggestedFix")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredErrors.map((err, i) => (
                      <tr key={i} className={`border-t border-gray-50 ${err.severity === "error" ? "bg-red-50/50" : "bg-amber-50/50"}`}>
                        <td className="px-3 py-2">{err.row}</td>
                        <td className="px-3 py-2">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                            err.severity === "error" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                          }`}>
                            {err.severity}
                          </span>
                        </td>
                        <td className="px-3 py-2 font-mono">{err.field}</td>
                        <td className="px-3 py-2 text-gray-700 max-w-[300px]">{err.message}</td>
                        <td className="px-3 py-2 text-gray-500 max-w-[200px]">{err.suggestedFix || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {importData?.items && (
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Import Items ({importData.items.length})</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {importData.items.map((item: any) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      item.validation_status === "error" ? "border-red-200 bg-red-50/30" :
                      item.validation_status === "warning" ? "border-amber-200 bg-amber-50/30" :
                      "border-green-200 bg-green-50/30"
                    }`}
                    data-testid={`import-item-${item.row_index}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium text-gray-500">#{item.row_index}</span>
                      {item.validation_status === "pass" && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                      {item.validation_status === "warning" && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                      {item.validation_status === "error" && <AlertCircle className="w-4 h-4 text-red-500" />}
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                        item.status === "published" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                      }`}>
                        {item.status}
                      </span>
                      <span className="text-xs text-gray-600 max-w-[400px] truncate">
                        {(() => {
                          const d = item.normalized_data || item.mapped_data || item.raw_data;
                          return d?.title || d?.stem || d?.front || d?.term || JSON.stringify(d).substring(0, 80);
                        })()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingItem(item);
                          setEditingData(JSON.stringify(item.normalized_data || item.mapped_data || item.raw_data, null, 2));
                        }}
                        className="px-2 py-1 text-[10px] bg-gray-100 rounded hover:bg-gray-200"
                        data-testid={`button-edit-${item.row_index}`}
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => handlePublish()}
                  disabled={loading || !importData.items.some((i: any) => i.validation_status !== "error" && i.status === "draft")}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
                  data-testid="button-publish-all"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Publish Valid Items
                </button>
              </div>
            </div>
          )}

          {editingItem && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" data-testid="edit-modal">
              <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Edit Item #{editingItem.row_index}</h3>
                  <button onClick={() => setEditingItem(null)} data-testid="button-close-edit"><X className="w-5 h-5" /></button>
                </div>
                <textarea
                  value={editingData}
                  onChange={(e) => setEditingData(e.target.value)}
                  className="w-full h-64 px-3 py-2 border border-gray-200 rounded-lg text-xs font-mono resize-y"
                  data-testid="textarea-edit-item"
                />
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => handleUpdateItem(editingItem.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
                    data-testid="button-save-edit"
                  >
                    <Save className="w-4 h-4" /> Save & Revalidate
                  </button>
                  <button onClick={() => setEditingItem(null)} className="px-4 py-2 bg-gray-100 rounded-lg text-sm" data-testid="button-cancel-edit">{t("allied.paramedicBulkUpload.cancel")}</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "preview" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-red-500" /> Content Preview
            </h3>
            {importData?.items ? (
              <div className="space-y-4">
                {importData.items.filter((i: any) => i.status === "published" || i.status === "draft").slice(0, 10).map((item: any) => {
                  const data = item.normalized_data || item.mapped_data || item.raw_data;
                  return (
                    <div key={item.id} className="p-4 border border-gray-200 rounded-lg" data-testid={`preview-item-${item.row_index}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                          item.status === "published" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                        }`}>{item.status}</span>
                        <span className="text-xs text-gray-500">Row #{item.row_index} · {item.content_type}</span>
                      </div>
                      {item.content_type === "question" && (
                        <div>
                          <p className="text-sm font-medium text-gray-900 mb-2">{data.stem}</p>
                          {data.options && (
                            <div className="space-y-1 ml-4">
                              {(typeof data.options === "string" ? JSON.parse(data.options) : data.options).map((opt: string, i: number) => (
                                <p key={i} className={`text-xs ${i === Number(data.correctAnswer) ? "text-green-700 font-medium" : "text-gray-600"}`}>
                                  {String.fromCharCode(65 + i)}. {opt}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                      {item.content_type === "flashcard" && (
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 bg-gray-50 rounded">
                            <p className="text-[10px] text-gray-500 mb-1">{t("allied.paramedicBulkUpload.front")}</p>
                            <p className="text-sm">{data.front}</p>
                          </div>
                          <div className="p-3 bg-green-50 rounded">
                            <p className="text-[10px] text-gray-500 mb-1">{t("allied.paramedicBulkUpload.back")}</p>
                            <p className="text-sm">{data.back}</p>
                          </div>
                        </div>
                      )}
                      {item.content_type === "lesson" && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-1">{data.title}</h4>
                          <p className="text-xs text-gray-600 line-clamp-3">{typeof data.content === "string" ? data.content.substring(0, 300) : JSON.stringify(data.content).substring(0, 300)}</p>
                        </div>
                      )}
                      {item.content_type === "scenario" && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-1">{data.title}</h4>
                          <p className="text-xs text-gray-600"><strong>{t("allied.paramedicBulkUpload.dispatch")}</strong> {data.dispatchInfo}</p>
                          <p className="text-xs text-gray-600"><strong>{t("allied.paramedicBulkUpload.category")}</strong> {data.category}</p>
                        </div>
                      )}
                      {!["question", "flashcard", "lesson", "scenario"].includes(item.content_type) && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-1">{data.title || data.term || "Untitled"}</h4>
                          <pre className="text-[10px] text-gray-600 bg-gray-50 p-2 rounded overflow-x-auto">{JSON.stringify(data, null, 2).substring(0, 500)}</pre>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-8">{t("allied.paramedicBulkUpload.noImportDataUploadAnd")}</p>
            )}
          </div>
        </div>
      )}

      {tab === "publish" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Send className="w-5 h-5 text-red-500" /> Publish Queue
            </h3>
            {importData?.items ? (
              <>
                <div className="space-y-2 max-h-96 overflow-y-auto mb-4">
                  {importData.items.filter((i: any) => i.status === "draft" && i.validation_status !== "error").map((item: any) => {
                    const data = item.normalized_data || item.mapped_data;
                    return (
                      <div key={item.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg" data-testid={`publish-item-${item.row_index}`}>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          <span className="text-xs text-gray-600">#{item.row_index}</span>
                          <span className="text-sm text-gray-900">{data?.title || data?.stem || data?.front || "Item"}</span>
                        </div>
                        <button
                          onClick={() => handlePublish([item.id])}
                          className="px-2 py-1 text-[10px] bg-red-50 text-red-700 rounded hover:bg-red-100"
                          data-testid={`button-publish-${item.row_index}`}
                        >
                          Publish
                        </button>
                      </div>
                    );
                  })}
                </div>
                <button
                  onClick={() => handlePublish()}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
                  data-testid="button-publish-all-queue"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Publish All Valid
                </button>
              </>
            ) : (
              <p className="text-sm text-gray-500 text-center py-8">{t("allied.paramedicBulkUpload.noItemsInPublishQueue")}</p>
            )}
          </div>
        </div>
      )}

      {tab === "library" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Library className="w-5 h-5 text-red-500" /> Content Library
              </h3>
              <span className="text-xs text-gray-500">{libraryTotal} items total</span>
            </div>

            <div className="flex flex-wrap gap-3 mb-4">
              <select
                value={libraryType}
                onChange={(e) => { setLibraryType(e.target.value); setSelectedIds(new Set()); }}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs"
                data-testid="select-library-type"
              >
                <option value="">{t("allied.paramedicBulkUpload.allTypes")}</option>
                {CONTENT_TYPES.map(ct => (
                  <option key={ct.id} value={ct.id}>{ct.label}</option>
                ))}
              </select>
              <select
                value={libraryStatus}
                onChange={(e) => setLibraryStatus(e.target.value)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs"
                data-testid="select-library-status"
              >
                <option value="">{t("allied.paramedicBulkUpload.allStatuses")}</option>
                <option value="draft">{t("allied.paramedicBulkUpload.draft")}</option>
                <option value="published">{t("allied.paramedicBulkUpload.published")}</option>
                <option value="archived">{t("allied.paramedicBulkUpload.archived")}</option>
              </select>
              <div className="flex-1" />
              {selectedIds.size > 0 && (
                <div className="flex gap-2">
                  <button onClick={() => handleBulkAction("publish")} className="px-3 py-1.5 text-xs bg-green-50 text-green-700 rounded-lg hover:bg-green-100" data-testid="button-bulk-publish">
                    Publish ({selectedIds.size})
                  </button>
                  <button onClick={() => handleBulkAction("unpublish")} className="px-3 py-1.5 text-xs bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100" data-testid="button-bulk-unpublish">
                    Unpublish
                  </button>
                  <button onClick={() => handleBulkAction("archive")} className="px-3 py-1.5 text-xs bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100" data-testid="button-bulk-archive">
                    Archive
                  </button>
                  <button onClick={() => handleBulkAction("delete")} className="px-3 py-1.5 text-xs bg-red-50 text-red-700 rounded-lg hover:bg-red-100" data-testid="button-bulk-delete">
                    Delete
                  </button>
                </div>
              )}
            </div>

            {library.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">{t("allied.paramedicBulkUpload.noContentFoundImportSome")}</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs" data-testid="library-table">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-3 py-2 text-left">
                        <input
                          type="checkbox"
                          onChange={(e) => {
                            if (e.target.checked) setSelectedIds(new Set(library.map((i: any) => i.id)));
                            else setSelectedIds(new Set());
                          }}
                          data-testid="checkbox-select-all"
                        />
                      </th>
                      <th className="px-3 py-2 text-left font-medium text-gray-600">ID</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-600">{t("allied.paramedicBulkUpload.type")}</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-600">{t("allied.paramedicBulkUpload.created")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {library.map((item: any) => (
                      <tr key={item.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                        <td className="px-3 py-2">
                          <input
                            type="checkbox"
                            checked={selectedIds.has(item.id)}
                            onChange={(e) => {
                              const next = new Set(selectedIds);
                              if (e.target.checked) next.add(item.id);
                              else next.delete(item.id);
                              setSelectedIds(next);
                            }}
                            data-testid={`checkbox-${item.id}`}
                          />
                        </td>
                        <td className="px-3 py-2 font-mono text-gray-500">{item.id?.substring(0, 8)}...</td>
                        <td className="px-3 py-2">
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600">{item.content_type}</span>
                        </td>
                        <td className="px-3 py-2 text-gray-500">{item.created_at ? new Date(item.created_at).toLocaleDateString() : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "errors" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" /> Error Details
            </h3>
            {validationErrors.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">{t("allied.paramedicBulkUpload.noErrorsToDisplay")}</p>
            ) : (
              <>
                <div className="mb-4 flex items-center gap-4">
                  <span className="text-xs text-gray-600">{validationErrors.filter(e => e.severity === "error").length} errors, {validationErrors.filter(e => e.severity === "warning").length} warnings</span>
                  <button
                    onClick={() => {
                      const csv = "Row,Severity,Field,Message,SuggestedFix\n" +
                        validationErrors.map(e => `${e.row},"${e.severity}","${e.field}","${e.message}","${e.suggestedFix || ""}"`).join("\n");
                      const blob = new Blob([csv], { type: "text/csv" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url; a.download = "validation-errors.csv"; a.click();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    data-testid="button-download-errors"
                  >
                    <Download className="w-3.5 h-3.5" /> Download CSV
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-3 py-2 text-left font-medium text-gray-600">{t("allied.paramedicBulkUpload.row2")}</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-600">{t("allied.paramedicBulkUpload.severity")}</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-600">{t("allied.paramedicBulkUpload.field2")}</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-600">{t("allied.paramedicBulkUpload.message")}</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-600">{t("allied.paramedicBulkUpload.fix")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {validationErrors.map((err, i) => (
                        <tr key={i} className={`border-t border-gray-50 ${err.severity === "error" ? "bg-red-50/50" : "bg-amber-50/50"}`}>
                          <td className="px-3 py-2">{err.row}</td>
                          <td className="px-3 py-2">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${err.severity === "error" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                              {err.severity}
                            </span>
                          </td>
                          <td className="px-3 py-2 font-mono">{err.field}</td>
                          <td className="px-3 py-2">{err.message}</td>
                          <td className="px-3 py-2 text-gray-500">{err.suggestedFix || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {tab === "history" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <History className="w-5 h-5 text-red-500" /> Import History
              </h3>
              <button
                onClick={loadHistory}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                data-testid="button-refresh-history"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Refresh
              </button>
            </div>

            {history.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">{t("allied.paramedicBulkUpload.noImportHistoryYet")}</p>
            ) : (
              <div className="space-y-3">
                {history.map((imp: any) => (
                  <div key={imp.id} className="p-4 border border-gray-200 rounded-lg" data-testid={`history-item-${imp.id}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                          imp.status === "published" ? "bg-green-100 text-green-700" :
                          imp.status === "rolled_back" ? "bg-gray-100 text-gray-600" :
                          imp.status === "error" ? "bg-red-100 text-red-700" :
                          "bg-amber-100 text-amber-700"
                        }`}>{imp.status}</span>
                        <span className="text-xs font-medium text-gray-900">{imp.content_type}</span>
                        <span className="text-xs text-gray-500">by {imp.admin_name || "admin"}</span>
                      </div>
                      <span className="text-xs text-gray-500">{imp.created_at ? new Date(imp.created_at).toLocaleString() : "—"}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-3 text-center text-xs mb-3">
                      <div><div className="font-bold text-gray-900">{imp.total_items}</div><div className="text-gray-500">{t("allied.paramedicBulkUpload.total")}</div></div>
                      <div><div className="font-bold text-green-700">{imp.valid_items}</div><div className="text-gray-500">{t("allied.paramedicBulkUpload.valid2")}</div></div>
                      <div><div className="font-bold text-red-700">{imp.error_items}</div><div className="text-gray-500">{t("allied.paramedicBulkUpload.errors2")}</div></div>
                      <div><div className="font-bold text-blue-700">{imp.published_items}</div><div className="text-gray-500">{t("allied.paramedicBulkUpload.published2")}</div></div>
                    </div>
                    <div className="flex gap-2">
                      {imp.status === "published" && imp.rollback_data && (
                        <button
                          onClick={() => handleRollback(imp.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100"
                          data-testid={`button-rollback-${imp.id}`}
                        >
                          <RotateCcw className="w-3.5 h-3.5" /> Rollback
                        </button>
                      )}
                      <button
                        onClick={() => { setImportId(imp.id); loadImportDetails(imp.id); setTab("validate"); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100"
                        data-testid={`button-view-${imp.id}`}
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "templates" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-red-500" /> Download Templates
            </h3>
            <p className="text-sm text-gray-600 mb-4">{t("allied.paramedicBulkUpload.downloadEmptyTemplatesForEach")}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {CONTENT_TYPES.map(ct => (
                <button
                  key={ct.id}
                  onClick={async () => {
                    try {
                      const data = await apiFetch(`/api/paramedic/bulk/templates/${ct.id}`);
                      const json = JSON.stringify([data.template], null, 2);
                      const blob = new Blob([json], { type: "application/json" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url; a.download = `paramedic-${ct.id}-template.json`; a.click();
                    } catch (e: any) {
                      toast({ title: "Error", description: e.message, variant: "destructive" });
                    }
                  }}
                  className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  data-testid={`button-template-${ct.id}`}
                >
                  <ct.icon className="w-6 h-6 text-red-500" />
                  <span className="text-xs font-medium">{ct.label}</span>
                  <span className="text-[10px] text-gray-500">{t("allied.paramedicBulkUpload.downloadJson")}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">{t("allied.paramedicBulkUpload.savedFieldMappingTemplates")}</h3>
            {mappingTemplates.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">{t("allied.paramedicBulkUpload.noSavedMappingTemplatesYet")}</p>
            ) : (
              <div className="space-y-2">
                {mappingTemplates.map((t: any) => (
                  <div key={t.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <span className="text-sm font-medium text-gray-900">{t.name}</span>
                      <span className="text-xs text-gray-500 ml-2">({t.content_type})</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleLoadMapping(t)}
                        className="px-2 py-1 text-[10px] bg-gray-100 rounded hover:bg-gray-200"
                        data-testid={`button-load-template-${t.id}`}
                      >
                        Load
                      </button>
                      <button
                        onClick={async () => {
                          await apiFetch(`/api/paramedic/bulk/mapping-templates/${t.id}`, { method: "DELETE" });
                          loadMappingTemplates();
                        }}
                        className="px-2 py-1 text-[10px] bg-red-50 text-red-700 rounded hover:bg-red-100"
                        data-testid={`button-delete-template-${t.id}`}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
