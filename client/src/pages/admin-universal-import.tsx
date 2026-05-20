import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { useI18n } from "@/lib/i18n";
import {
  Upload, FileText, FileJson, Table2, CheckCircle2, AlertTriangle,
  XCircle, Clock, ChevronDown, ChevronRight, Download, Play, Ban,
  Eye, History, ArrowLeft, Loader2, SkipForward, RefreshCw, Copy
} from "lucide-react";

interface ImportJob {
  id: string;
  fileName: string;
  fileFormat: string;
  fileSize: number;
  professionSlug: string | null;
  status: string;
  totalRows: number;
  validRows: number;
  errorRows: number;
  warningRows: number;
  duplicateRows: number;
  importedRows: number;
  skippedRows: number;
  duplicateStrategy: string;
  validationReport: { errors: any[]; warnings: any[] };
  previewData: any[];
  mappedTopics: string[];
  importedBy: string;
  importedByUsername: string;
  createdAt: string;
  completedAt: string | null;
}

interface ImportRow {
  id: string;
  importId: string;
  rowNumber: number;
  status: string;
  questionId: string;
  profession: string;
  topic: string;
  subtopic: string;
  difficulty: number;
  questionType: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  rationale: string;
  errors: any[];
  warnings: any[];
  duplicateOf: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; Icon: any }> = {
  pending: { label: "Pending", color: "text-gray-500 bg-gray-100", Icon: Clock },
  validating: { label: "Validating", color: "text-blue-600 bg-blue-100", Icon: Loader2 },
  validated: { label: "Validated", color: "text-teal-600 bg-teal-100", Icon: CheckCircle2 },
  importing: { label: "Importing...", color: "text-blue-600 bg-blue-100", Icon: Loader2 },
  completed: { label: "Completed", color: "text-green-600 bg-green-100", Icon: CheckCircle2 },
  failed: { label: "Failed", color: "text-red-600 bg-red-100", Icon: XCircle },
  cancelled: { label: "Cancelled", color: "text-gray-500 bg-gray-100", Icon: Ban },
};

const FORMAT_ICONS: Record<string, any> = {
  csv: Table2,
  json: FileJson,
  xlsx: FileText,
  xls: FileText,
};

export default function AdminUniversalImportPage() {
  const { t } = useI18n();
  const { isAdmin } = useAuth();
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeView, setActiveView] = useState<"upload" | "detail" | "history">("upload");
  const [selectedImportId, setSelectedImportId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [duplicateStrategy, setDuplicateStrategy] = useState("skip");
  const [selectedProfession, setSelectedProfession] = useState("");
  const [expandedErrors, setExpandedErrors] = useState(false);
  const [expandedWarnings, setExpandedWarnings] = useState(false);

  const { data: imports = [] } = useQuery<ImportJob[]>({
    queryKey: ["/api/admin/imports"],
    enabled: isAdmin,
    refetchInterval: 10000,
  });

  const { data: importDetail } = useQuery<{ import: ImportJob; rows: ImportRow[] }>({
    queryKey: [`/api/admin/imports/${selectedImportId}`],
    enabled: isAdmin && !!selectedImportId,
  });

  const { data: professions = [] } = useQuery<any[]>({
    queryKey: ["/api/professions/all"],
    enabled: isAdmin,
  });

  const executeMutation = useMutation({
    mutationFn: ({ id, strategy }: { id: string; strategy: string }) =>
      apiRequest("POST", `/api/admin/imports/${id}/execute`, { duplicateStrategy: strategy }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/imports"] });
      if (selectedImportId) queryClient.invalidateQueries({ queryKey: [`/api/admin/imports/${selectedImportId}`] });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => apiRequest("POST", `/api/admin/imports/${id}/cancel`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/admin/imports"] }),
  });

  if (!isAdmin) {
    return <div className="p-8 text-center text-gray-500">{t("pages.adminUniversalImport.adminAccessRequired")}</div>;
  }

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      if (selectedProfession) formData.append("profession", selectedProfession);

      const response = await fetch("/api/admin/imports/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Upload failed");
      }

      const result = await response.json();
      setSelectedImportId(result.import.id);
      setActiveView("detail");
      queryClient.invalidateQueries({ queryKey: ["/api/admin/imports"] });
    } catch (e: any) {
      alert(`Upload error: ${e.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const viewDetail = (id: string) => {
    setSelectedImportId(id);
    setActiveView("detail");
  };

  const imp = importDetail?.import;
  const rows = importDetail?.rows || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8" data-testid="admin-universal-import-page">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          {activeView !== "upload" && (
            <button onClick={() => setActiveView("upload")} className="p-2 hover:bg-gray-100 rounded-lg" data-testid="button-back">
              <ArrowLeft className="w-5 h-5 text-gray-500" />
            </button>
          )}
          <div>
            <h1 className="text-3xl font-bold text-gray-900" data-testid="text-page-title">{t("pages.adminUniversalImport.universalQuestionImporter")}</h1>
            <p className="text-gray-500 mt-1">{t("pages.adminUniversalImport.uploadCsvJsonOrXlsx")}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate("/en/admin/professions")} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium" data-testid="button-go-professions">
            Profession Manager
          </button>
          <button onClick={() => setActiveView("history")} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${activeView === "history" ? "bg-teal-100 text-teal-700" : "bg-white border border-gray-200 hover:bg-gray-50"}`} data-testid="button-history">
            <History className="w-4 h-4" /> Import History
          </button>
        </div>
      </div>

      {activeView === "upload" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white border rounded-xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg"><Table2 className="w-5 h-5 text-blue-600" /></div>
                <div>
                  <h3 className="font-semibold text-sm">CSV</h3>
                  <p className="text-xs text-gray-500">{t("pages.adminUniversalImport.commaseparatedValues")}</p>
                </div>
              </div>
              <a href="/api/admin/imports/template/csv" className="text-xs text-teal-600 hover:underline flex items-center gap-1" data-testid="link-csv-template">
                <Download className="w-3 h-3" /> Download Template
              </a>
            </div>
            <div className="bg-white border rounded-xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-100 rounded-lg"><FileJson className="w-5 h-5 text-purple-600" /></div>
                <div>
                  <h3 className="font-semibold text-sm">JSON</h3>
                  <p className="text-xs text-gray-500">{t("pages.adminUniversalImport.arrayOfQuestionObjects")}</p>
                </div>
              </div>
              <a href="/api/admin/imports/template/json" className="text-xs text-teal-600 hover:underline flex items-center gap-1" data-testid="link-json-template">
                <Download className="w-3 h-3" /> Download Template
              </a>
            </div>
            <div className="bg-white border rounded-xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 rounded-lg"><FileText className="w-5 h-5 text-green-600" /></div>
                <div>
                  <h3 className="font-semibold text-sm">XLSX</h3>
                  <p className="text-xs text-gray-500">{t("pages.adminUniversalImport.excelSpreadsheet")}</p>
                </div>
              </div>
              <p className="text-xs text-gray-400">{t("pages.adminUniversalImport.firstSheetWillBeRead")}</p>
            </div>
          </div>

          <div className="bg-white border rounded-xl p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("pages.adminUniversalImport.targetProfessionOptional")}</label>
              <select value={selectedProfession} onChange={(e) => setSelectedProfession(e.target.value)} className="w-full max-w-sm px-3 py-2 border rounded-lg text-sm" data-testid="select-profession">
                <option value="">{t("pages.adminUniversalImport.autodetectFromFile")}</option>
                {professions.map((p: any) => (
                  <option key={p.id || p.slug} value={p.slug}>{p.name}</option>
                ))}
              </select>
            </div>

            <div
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${uploading ? "border-teal-300 bg-teal-50" : "border-gray-200 hover:border-teal-300 hover:bg-teal-50/30"}`}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              data-testid="drop-zone"
            >
              {uploading ? (
                <div className="space-y-3">
                  <Loader2 className="w-12 h-12 text-teal-500 mx-auto animate-spin" />
                  <p className="text-sm text-teal-600 font-medium">{t("pages.adminUniversalImport.uploadingAndValidating")}</p>
                </div>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-base font-medium text-gray-700 mb-1">{t("pages.adminUniversalImport.dragDropYourFileHere")}</p>
                  <p className="text-sm text-gray-500 mb-4">{t("pages.adminUniversalImport.orClickToBrowseCsv")}</p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm font-medium"
                    data-testid="button-browse-files"
                  >
                    Browse Files
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.json,.xlsx,.xls"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file);
                    }}
                    data-testid="input-file"
                  />
                </>
              )}
            </div>
          </div>

          <div className="bg-white border rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-3">{t("pages.adminUniversalImport.importSchema")}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              {[
                { field: "question_id", req: false, desc: "Unique ID" },
                { field: "profession", req: false, desc: "Target profession" },
                { field: "country", req: false, desc: "US, CA, ALL" },
                { field: "exam_type", req: false, desc: "Target exam" },
                { field: "topic", req: false, desc: "Main topic" },
                { field: "subtopic", req: false, desc: "Sub-topic" },
                { field: "difficulty", req: false, desc: "1-5 scale" },
                { field: "question_type", req: false, desc: "single_best_answer, etc." },
                { field: "question_text", req: true, desc: "Question stem" },
                { field: "option_a - option_e", req: false, desc: "Answer options" },
                { field: "correct_answer", req: true, desc: "A, B, C, D, E" },
                { field: "rationale", req: false, desc: "Explanation" },
                { field: "image_reference", req: false, desc: "Image URL/path" },
                { field: "tags", req: false, desc: "Comma-separated" },
                { field: "eligibility_flags", req: false, desc: "Comma-separated" },
              ].map(({ field, req, desc }) => (
                <div key={field} className="flex items-start gap-1.5 p-2 bg-gray-50 rounded-lg">
                  <span className={`font-mono font-medium ${req ? "text-red-600" : "text-gray-700"}`}>{field}{req ? "*" : ""}</span>
                  <span className="text-gray-400">- {desc}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">{t("pages.adminUniversalImport.requiredField")}</p>
          </div>

          {imports.length > 0 && (
            <div className="bg-white border rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-3">{t("pages.adminUniversalImport.recentImports")}</h3>
              <div className="space-y-2">
                {imports.slice(0, 5).map((imp) => {
                  const status = STATUS_CONFIG[imp.status] || STATUS_CONFIG.pending;
                  const FormatIcon = FORMAT_ICONS[imp.fileFormat] || FileText;
                  return (
                    <button key={imp.id} onClick={() => viewDetail(imp.id)} className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg border text-left" data-testid={`import-row-${imp.id}`}>
                      <div className="flex items-center gap-3">
                        <FormatIcon className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{imp.fileName}</p>
                          <p className="text-xs text-gray-500">{imp.totalRows} rows - {new Date(imp.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium inline-flex items-center gap-1 ${status.color}`}>
                          <status.Icon className="w-3 h-3" /> {status.label}
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {activeView === "detail" && imp && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: "Total Rows", value: imp.totalRows, color: "text-gray-900" },
              { label: "Valid", value: imp.validRows, color: "text-green-600" },
              { label: "Errors", value: imp.errorRows, color: "text-red-600" },
              { label: "Warnings", value: imp.warningRows, color: "text-amber-600" },
              { label: "Duplicates", value: imp.duplicateRows, color: "text-purple-600" },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-white border rounded-xl p-4 text-center">
                <p className={`text-2xl font-bold ${color}`} data-testid={`stat-${label.toLowerCase()}`}>{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            ))}
          </div>

          <div className="bg-white border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">{imp.fileName}</h3>
                <p className="text-sm text-gray-500">Format: {imp.fileFormat.toUpperCase()} - {(imp.fileSize / 1024).toFixed(1)} KB - Uploaded by {imp.importedByUsername}</p>
              </div>
              {(() => {
                const s = STATUS_CONFIG[imp.status] || STATUS_CONFIG.pending;
                return (
                  <span className={`text-sm px-3 py-1.5 rounded-full font-medium inline-flex items-center gap-1 ${s.color}`} data-testid="badge-import-status">
                    <s.Icon className="w-4 h-4" /> {s.label}
                  </span>
                );
              })()}
            </div>

            {imp.status === "validated" && (
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-4">
                <p className="text-sm font-medium text-teal-700 mb-3">Ready to import {imp.validRows} valid questions</p>
                <div className="flex items-center gap-4">
                  <div>
                    <label className="block text-xs font-medium text-teal-600 mb-1">Duplicate Strategy ({imp.duplicateRows} found)</label>
                    <select value={duplicateStrategy} onChange={(e) => setDuplicateStrategy(e.target.value)} className="px-3 py-1.5 border rounded-lg text-sm" data-testid="select-duplicate-strategy">
                      <option value="skip">{t("pages.adminUniversalImport.skipDuplicates")}</option>
                      <option value="replace">{t("pages.adminUniversalImport.replaceExisting")}</option>
                      <option value="variant">{t("pages.adminUniversalImport.createAsVariant")}</option>
                    </select>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => executeMutation.mutate({ id: imp.id, strategy: duplicateStrategy })}
                      disabled={executeMutation.isPending}
                      className="flex items-center gap-2 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm font-medium disabled:opacity-50"
                      data-testid="button-execute-import"
                    >
                      {executeMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                      Execute Import
                    </button>
                    <button
                      onClick={() => cancelMutation.mutate(imp.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 text-sm"
                      data-testid="button-cancel-import"
                    >
                      <Ban className="w-4 h-4" /> Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {imp.status === "completed" && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-sm font-medium text-green-700">Import complete: {imp.importedRows} imported, {imp.skippedRows} skipped</p>
              </div>
            )}
          </div>

          {imp.validationReport?.errors?.length > 0 && (
            <div className="bg-white border rounded-xl p-6">
              <button onClick={() => setExpandedErrors(!expandedErrors)} className="flex items-center justify-between w-full" data-testid="toggle-errors">
                <div className="flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-500" />
                  <h3 className="font-semibold text-red-700">Errors ({imp.validationReport.errors.length})</h3>
                </div>
                {expandedErrors ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              {expandedErrors && (
                <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
                  {imp.validationReport.errors.map((err: any, i: number) => (
                    <div key={i} className="flex items-start gap-2 text-sm p-2 bg-red-50 rounded-lg">
                      <span className="font-mono text-xs text-red-500 whitespace-nowrap">Row {err.row}</span>
                      <span className="text-red-700">{err.field}: {err.message}</span>
                      {err.suggestedFix && <span className="text-red-400 text-xs italic ml-auto">{err.suggestedFix}</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {imp.validationReport?.warnings?.length > 0 && (
            <div className="bg-white border rounded-xl p-6">
              <button onClick={() => setExpandedWarnings(!expandedWarnings)} className="flex items-center justify-between w-full" data-testid="toggle-warnings">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  <h3 className="font-semibold text-amber-700">Warnings ({imp.validationReport.warnings.length})</h3>
                </div>
                {expandedWarnings ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              {expandedWarnings && (
                <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
                  {imp.validationReport.warnings.map((w: any, i: number) => (
                    <div key={i} className="flex items-start gap-2 text-sm p-2 bg-amber-50 rounded-lg">
                      <span className="font-mono text-xs text-amber-500 whitespace-nowrap">Row {w.row}</span>
                      <span className="text-amber-700">{w.field}: {w.message}</span>
                      {w.suggestedFix && <span className="text-amber-400 text-xs italic ml-auto">{w.suggestedFix}</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {imp.previewData && imp.previewData.length > 0 && (
            <div className="bg-white border rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><Eye className="w-4 h-4" /> Preview (first {imp.previewData.length} rows)</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-2 py-2 text-left font-medium text-gray-500">{t("pages.adminUniversalImport.row")}</th>
                      {Object.keys(imp.previewData[0]?.fields || {}).slice(0, 8).map((h) => (
                        <th key={h} className="px-2 py-2 text-left font-medium text-gray-500">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {imp.previewData.map((row: any) => (
                      <tr key={row.rowNumber} className="border-t">
                        <td className="px-2 py-2 font-mono text-gray-400">{row.rowNumber}</td>
                        {Object.values(row.fields || {}).slice(0, 8).map((v: any, i: number) => (
                          <td key={i} className="px-2 py-2 max-w-[200px] truncate text-gray-700">{String(v || "")}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {imp.mappedTopics && imp.mappedTopics.length > 0 && (
            <div className="bg-white border rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Mapped Topics ({imp.mappedTopics.length})</h3>
              <div className="flex flex-wrap gap-2">
                {imp.mappedTopics.map((t: string) => (
                  <span key={t} className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">{t}</span>
                ))}
              </div>
            </div>
          )}

          {rows.length > 0 && (
            <div className="bg-white border rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Row Details ({rows.length} rows)</h3>
              <div className="overflow-x-auto max-h-96 overflow-y-auto">
                <table className="w-full text-xs" data-testid="table-import-rows">
                  <thead className="sticky top-0 bg-gray-50 z-10">
                    <tr>
                      <th className="px-2 py-2 text-left">{t("pages.adminUniversalImport.row2")}</th>
                      <th className="px-2 py-2 text-left">{t("pages.adminUniversalImport.status")}</th>
                      <th className="px-2 py-2 text-left">{t("pages.adminUniversalImport.type")}</th>
                      <th className="px-2 py-2 text-left">{t("pages.adminUniversalImport.topic")}</th>
                      <th className="px-2 py-2 text-left">{t("pages.adminUniversalImport.question")}</th>
                      <th className="px-2 py-2 text-left">{t("pages.adminUniversalImport.answer")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.slice(0, 100).map((r) => (
                      <tr key={r.id} className={`border-t ${r.status === "error" ? "bg-red-50" : r.status === "duplicate" ? "bg-purple-50" : r.status === "imported" ? "bg-green-50" : ""}`}>
                        <td className="px-2 py-2 font-mono text-gray-400">{r.rowNumber}</td>
                        <td className="px-2 py-2">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                            r.status === "valid" ? "bg-green-100 text-green-700" :
                            r.status === "error" ? "bg-red-100 text-red-700" :
                            r.status === "duplicate" ? "bg-purple-100 text-purple-700" :
                            r.status === "imported" ? "bg-teal-100 text-teal-700" :
                            r.status === "skipped" ? "bg-gray-100 text-gray-600" :
                            "bg-gray-100 text-gray-600"
                          }`}>{r.status}</span>
                        </td>
                        <td className="px-2 py-2 text-gray-600">{r.questionType || "-"}</td>
                        <td className="px-2 py-2 text-gray-600">{r.topic || "-"}</td>
                        <td className="px-2 py-2 max-w-[300px] truncate text-gray-700">{r.questionText || "-"}</td>
                        <td className="px-2 py-2 text-gray-600">{r.correctAnswer || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {activeView === "history" && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900" data-testid="text-history-title">{t("pages.adminUniversalImport.importHistory")}</h2>
          {imports.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <History className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">{t("pages.adminUniversalImport.noImportsYet")}</h3>
              <p className="text-gray-500">{t("pages.adminUniversalImport.uploadYourFirstFileTo")}</p>
            </div>
          ) : (
            <div className="bg-white border rounded-xl overflow-hidden">
              <table className="w-full text-sm" data-testid="table-import-history">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">{t("pages.adminUniversalImport.file")}</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">{t("pages.adminUniversalImport.profession")}</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">{t("pages.adminUniversalImport.status2")}</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">{t("pages.adminUniversalImport.rows")}</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">{t("pages.adminUniversalImport.imported")}</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">By</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">{t("pages.adminUniversalImport.date")}</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500"></th>
                  </tr>
                </thead>
                <tbody>
                  {imports.map((imp) => {
                    const s = STATUS_CONFIG[imp.status] || STATUS_CONFIG.pending;
                    return (
                      <tr key={imp.id} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">{imp.fileName}</td>
                        <td className="px-4 py-3 text-gray-600">{imp.professionSlug || "—"}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium inline-flex items-center gap-1 ${s.color}`}>
                            <s.Icon className="w-3 h-3" /> {s.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{imp.totalRows}</td>
                        <td className="px-4 py-3 text-gray-600">{imp.importedRows || 0}</td>
                        <td className="px-4 py-3 text-gray-600">{imp.importedByUsername || "—"}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs">{new Date(imp.createdAt).toLocaleDateString()}</td>
                        <td className="px-4 py-3">
                          <button onClick={() => viewDetail(imp.id)} className="text-teal-600 hover:underline text-xs font-medium" data-testid={`button-view-import-${imp.id}`}>
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
