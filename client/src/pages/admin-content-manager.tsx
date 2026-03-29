import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminFetch } from "@/lib/admin-fetch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft, CheckCircle, XCircle, Archive, Trash2, Copy, Eye,
  Loader2, Search, ChevronLeft, ChevronRight, Upload, Download,
  AlertTriangle, ShieldCheck, RotateCcw
} from "lucide-react";
import { Link } from "wouter";

import { useI18n } from "@/lib/i18n";
type ContentTab = "questions" | "flashcards" | "quality";

interface QuestionItem {
  id: string;
  tier: string;
  exam: string;
  questionType: string;
  status: string;
  stem: string;
  bodySystem: string | null;
  topic: string | null;
  difficulty: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

interface FlashcardItem {
  id: string;
  front: string;
  back: string;
  category: string | null;
  tier: string | null;
  status: string;
  difficulty: number | null;
  createdAt: string;
  updatedAt: string;
}

interface ManageResponse<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
  statusCounts: Record<string, number>;
}

function StatusBadge({ status }: { status: string }) {
  const { t } = useI18n();
  const colors: Record<string, string> = {
    draft: "bg-yellow-100 text-yellow-800 border-yellow-200",
    published: "bg-green-100 text-green-800 border-green-200",
    approved: "bg-blue-100 text-blue-800 border-blue-200",
    needs_review: "bg-orange-100 text-orange-800 border-orange-200",
    rejected: "bg-red-100 text-red-800 border-red-200",
    archived: "bg-gray-100 text-gray-600 border-gray-200",
    pending: "bg-purple-100 text-purple-800 border-purple-200",
  };
  return (
    <Badge className={`text-xs ${colors[status] || "bg-gray-100 text-gray-800"}`} data-testid={`badge-status-${status}`}>
      {status.replace(/_/g, " ")}
    </Badge>
  );
}

function TierBadge({ tier }: { tier: string | null }) {
  if (!tier) return null;
  const colors: Record<string, string> = {
    rpn: "bg-blue-50 text-blue-700",
    rn: "bg-indigo-50 text-indigo-700",
    np: "bg-purple-50 text-purple-700",
    free: "bg-gray-50 text-gray-700",
  };
  return (
    <Badge className={`text-xs ${colors[tier] || "bg-gray-50 text-gray-700"}`}>
      {tier.toUpperCase()}
    </Badge>
  );
}

function ExamQuestionsTab() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [tierFilter, setTierFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [previewId, setPreviewId] = useState<string | null>(null);

  const buildParams = useCallback(() => {
    const params = new URLSearchParams({ page: String(page), limit: "50" });
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (tierFilter) params.set("tier", tierFilter);
    if (searchTerm) params.set("search", searchTerm);
    return params.toString();
  }, [page, statusFilter, tierFilter, searchTerm]);

  const { data, isLoading } = useQuery<ManageResponse<QuestionItem>>({
    queryKey: ["admin-qbank-manage", page, statusFilter, tierFilter, searchTerm],
    queryFn: () => adminFetch(`/api/admin/qbank/manage?${buildParams()}`).then(r => r.json()),
  });

  const bulkAction = useMutation({
    mutationFn: async ({ action, ids }: { action: string; ids: string[] }) => {
      const res = await adminFetch(`/api/admin/qbank/bulk-${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-qbank-manage"] });
      setSelectedIds(new Set());
    },
  });

  const duplicateMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await adminFetch(`/api/admin/qbank/${id}/duplicate`, { method: "POST" });
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-qbank-manage"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await adminFetch(`/api/admin/qbank/${id}`, { method: "DELETE" });
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-qbank-manage"] }),
  });

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedIds(next);
  };

  const toggleSelectAll = () => {
    if (!data?.items) return;
    if (selectedIds.size === data.items.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(data.items.map(i => i.id)));
    }
  };

  const selected = Array.from(selectedIds);
  const counts = data?.statusCounts || {};

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 text-sm" data-testid="status-summary-questions">
        {Object.entries(counts).map(([s, c]) => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`px-3 py-1 rounded-full border transition ${statusFilter === s ? "bg-[#BFA6F6] text-white border-[#BFA6F6]" : "bg-white text-[#2E3A59] border-gray-200 hover:border-[#BFA6F6]"}`}
            data-testid={`filter-status-${s}`}
          >
            {s.replace(/_/g, " ")}: {c}
          </button>
        ))}
        <button
          onClick={() => { setStatusFilter("all"); setPage(1); }}
          className={`px-3 py-1 rounded-full border transition ${statusFilter === "all" ? "bg-[#BFA6F6] text-white border-[#BFA6F6]" : "bg-white text-[#2E3A59] border-gray-200 hover:border-[#BFA6F6]"}`}
          data-testid="filter-status-all"
        >
          All: {Object.values(counts).reduce((a, b) => a + b, 0)}
        </button>
      </div>

      <div className="flex gap-2 items-center flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={t("pages.adminContentManager.searchQuestionStems")}
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
            className="pl-9"
            data-testid="input-search-questions"
          />
        </div>
        <Select value={tierFilter || "all"} onValueChange={v => { setTierFilter(v === "all" ? "" : v); setPage(1); }}>
          <SelectTrigger className="w-[120px]" data-testid="select-tier-filter">
            <SelectValue placeholder={t("pages.adminContentManager.tier3")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("pages.adminContentManager.allTiers")}</SelectItem>
            <SelectItem value="rpn">RPN</SelectItem>
            <SelectItem value="rn">RN</SelectItem>
            <SelectItem value="np">NP</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {selected.length > 0 && (
        <div className="flex gap-2 items-center bg-[#BFA6F6]/10 p-3 rounded-lg border border-[#BFA6F6]/30" data-testid="bulk-actions-bar">
          <span className="text-sm font-medium text-[#2E3A59]">{selected.length} selected</span>
          <Button
            size="sm"
            onClick={() => bulkAction.mutate({ action: "publish", ids: selected })}
            disabled={bulkAction.isPending}
            className="bg-green-600 hover:bg-green-700 text-white"
            data-testid="btn-bulk-publish"
          >
            <CheckCircle className="h-3 w-3 mr-1" /> Publish
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => bulkAction.mutate({ action: "unpublish", ids: selected })}
            disabled={bulkAction.isPending}
            data-testid="btn-bulk-unpublish"
          >
            <XCircle className="h-3 w-3 mr-1" /> Unpublish
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => bulkAction.mutate({ action: "archive", ids: selected })}
            disabled={bulkAction.isPending}
            data-testid="btn-bulk-archive"
          >
            <Archive className="h-3 w-3 mr-1" /> Archive
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => { if (confirm(`Delete ${selected.length} questions?`)) bulkAction.mutate({ action: "delete", ids: selected }); }}
            disabled={bulkAction.isPending}
            data-testid="btn-bulk-delete"
          >
            <Trash2 className="h-3 w-3 mr-1" /> Delete
          </Button>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-[#BFA6F6]" /></div>
      ) : (
        <>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-3 w-8">
                    <Checkbox
                      checked={data?.items.length ? selectedIds.size === data.items.length : false}
                      onCheckedChange={toggleSelectAll}
                      data-testid="checkbox-select-all"
                    />
                  </th>
                  <th className="p-3 text-left text-[#2E3A59] font-medium">{t("pages.adminContentManager.question")}</th>
                  <th className="p-3 text-left text-[#2E3A59] font-medium w-20">{t("pages.adminContentManager.tier")}</th>
                  <th className="p-3 text-left text-[#2E3A59] font-medium w-28">{t("pages.adminContentManager.status")}</th>
                  <th className="p-3 text-left text-[#2E3A59] font-medium w-32">{t("pages.adminContentManager.bodySystem")}</th>
                  <th className="p-3 text-left text-[#2E3A59] font-medium w-24">{t("pages.adminContentManager.created")}</th>
                  <th className="p-3 text-right text-[#2E3A59] font-medium w-28">{t("pages.adminContentManager.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {data?.items.map(q => (
                  <tr key={q.id} className="border-b hover:bg-gray-50 transition">
                    <td className="p-3">
                      <Checkbox
                        checked={selectedIds.has(q.id)}
                        onCheckedChange={() => toggleSelect(q.id)}
                        data-testid={`checkbox-question-${q.id}`}
                      />
                    </td>
                    <td className="p-3">
                      <div className="max-w-md truncate text-[#2E3A59]" title={q.stem} data-testid={`text-stem-${q.id}`}>
                        {q.stem}
                      </div>
                    </td>
                    <td className="p-3"><TierBadge tier={q.tier} /></td>
                    <td className="p-3"><StatusBadge status={q.status} /></td>
                    <td className="p-3 text-gray-600 text-xs">{q.bodySystem || "-"}</td>
                    <td className="p-3 text-gray-600 text-xs">{new Date(q.createdAt).toLocaleDateString()}</td>
                    <td className="p-3">
                      <div className="flex gap-1 justify-end">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setPreviewId(previewId === q.id ? null : q.id)}
                          data-testid={`btn-preview-${q.id}`}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => duplicateMutation.mutate(q.id)}
                          data-testid={`btn-duplicate-${q.id}`}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => { if (confirm("Delete this question?")) deleteMutation.mutate(q.id); }}
                          data-testid={`btn-delete-${q.id}`}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {(!data?.items || data.items.length === 0) && (
                  <tr><td colSpan={7} className="p-8 text-center text-gray-500">{t("pages.adminContentManager.noQuestionsFound")}</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {previewId && <QuestionPreview id={previewId} onClose={() => setPreviewId(null)} />}

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600" data-testid="text-pagination-info">
              Page {data?.page || 1} of {data?.totalPages || 1} ({data?.total || 0} total)
            </span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={!data || data.page <= 1}
                onClick={() => setPage(p => p - 1)}
                data-testid="btn-prev-page"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={!data || data.page >= data.totalPages}
                onClick={() => setPage(p => p + 1)}
                data-testid="btn-next-page"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function QuestionPreview({ id, onClose }: { id: string; onClose: () => void }) {
  const queryClient = useQueryClient();
  const { data: list } = useQuery<ManageResponse<QuestionItem>>({
    queryKey: ["admin-qbank-manage"],
    enabled: false,
  });
  const q = list?.items.find(i => i.id === id);

  const statusMutation = useMutation({
    mutationFn: async ({ status }: { status: string }) => {
      const res = await adminFetch(`/api/admin/qbank/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-qbank-manage"] }),
  });

  if (!q) return null;

  return (
    <Card className="border-[#BFA6F6] border-2" data-testid="card-question-preview">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex gap-2 items-center">
            <TierBadge tier={q.tier} />
            <StatusBadge status={q.status} />
            <span className="text-xs text-gray-500">{q.bodySystem}</span>
          </div>
          <div className="flex gap-1">
            {q.status !== "published" && (
              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => statusMutation.mutate({ status: "published" })} data-testid="btn-publish-single">
                Publish Now
              </Button>
            )}
            {q.status === "published" && (
              <Button size="sm" variant="outline" onClick={() => statusMutation.mutate({ status: "draft" })} data-testid="btn-unpublish-single">
                Unpublish
              </Button>
            )}
            <Button size="sm" variant="outline" onClick={() => statusMutation.mutate({ status: "archived" })} data-testid="btn-archive-single">
              Archive
            </Button>
            <Button size="sm" variant="ghost" onClick={onClose}>{t("pages.adminContentManager.close")}</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-[#2E3A59] mb-2 font-medium" data-testid="text-preview-stem">{q.stem}</p>
        <div className="text-xs text-gray-500 space-y-1">
          <p>Exam: {q.exam} | Type: {q.questionType} | Difficulty: {q.difficulty}</p>
          {q.publishedAt && <p>Published: {new Date(q.publishedAt).toLocaleString()}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

function FlashcardBankTab() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [tierFilter, setTierFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const buildParams = useCallback(() => {
    const params = new URLSearchParams({ page: String(page), limit: "50" });
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (tierFilter) params.set("tier", tierFilter);
    if (searchTerm) params.set("search", searchTerm);
    return params.toString();
  }, [page, statusFilter, tierFilter, searchTerm]);

  const { data, isLoading } = useQuery<ManageResponse<FlashcardItem>>({
    queryKey: ["admin-flashcard-manage", page, statusFilter, tierFilter, searchTerm],
    queryFn: () => adminFetch(`/api/admin/flashcard-bank/manage?${buildParams()}`).then(r => r.json()),
  });

  const bulkAction = useMutation({
    mutationFn: async ({ action, ids }: { action: string; ids: string[] }) => {
      const res = await adminFetch(`/api/admin/flashcard-bank/bulk-${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-flashcard-manage"] });
      setSelectedIds(new Set());
    },
  });

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedIds(next);
  };

  const toggleSelectAll = () => {
    if (!data?.items) return;
    if (selectedIds.size === data.items.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(data.items.map(i => i.id)));
  };

  const selected = Array.from(selectedIds);
  const counts = data?.statusCounts || {};

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 text-sm" data-testid="status-summary-flashcards">
        {Object.entries(counts).map(([s, c]) => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`px-3 py-1 rounded-full border transition ${statusFilter === s ? "bg-[#BFA6F6] text-white border-[#BFA6F6]" : "bg-white text-[#2E3A59] border-gray-200 hover:border-[#BFA6F6]"}`}
            data-testid={`filter-fc-status-${s}`}
          >
            {s.replace(/_/g, " ")}: {c}
          </button>
        ))}
        <button
          onClick={() => { setStatusFilter("all"); setPage(1); }}
          className={`px-3 py-1 rounded-full border transition ${statusFilter === "all" ? "bg-[#BFA6F6] text-white border-[#BFA6F6]" : "bg-white text-[#2E3A59] border-gray-200 hover:border-[#BFA6F6]"}`}
          data-testid="filter-fc-status-all"
        >
          All: {Object.values(counts).reduce((a, b) => a + b, 0)}
        </button>
      </div>

      <div className="flex gap-2 items-center flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={t("pages.adminContentManager.searchFlashcards")}
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
            className="pl-9"
            data-testid="input-search-flashcards"
          />
        </div>
        <Select value={tierFilter || "all"} onValueChange={v => { setTierFilter(v === "all" ? "" : v); setPage(1); }}>
          <SelectTrigger className="w-[120px]" data-testid="select-fc-tier-filter">
            <SelectValue placeholder={t("pages.adminContentManager.tier4")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("pages.adminContentManager.allTiers2")}</SelectItem>
            <SelectItem value="free">{t("pages.adminContentManager.free")}</SelectItem>
            <SelectItem value="rpn">RPN</SelectItem>
            <SelectItem value="rn">RN</SelectItem>
            <SelectItem value="np">NP</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {selected.length > 0 && (
        <div className="flex gap-2 items-center bg-[#BFA6F6]/10 p-3 rounded-lg border border-[#BFA6F6]/30" data-testid="bulk-actions-bar-fc">
          <span className="text-sm font-medium text-[#2E3A59]">{selected.length} selected</span>
          <Button size="sm" onClick={() => bulkAction.mutate({ action: "publish", ids: selected })} disabled={bulkAction.isPending} className="bg-green-600 hover:bg-green-700 text-white" data-testid="btn-fc-bulk-publish">
            <CheckCircle className="h-3 w-3 mr-1" /> Publish
          </Button>
          <Button size="sm" variant="outline" onClick={() => bulkAction.mutate({ action: "unpublish", ids: selected })} disabled={bulkAction.isPending} data-testid="btn-fc-bulk-unpublish">
            <XCircle className="h-3 w-3 mr-1" /> Unpublish
          </Button>
          <Button size="sm" variant="outline" onClick={() => bulkAction.mutate({ action: "archive", ids: selected })} disabled={bulkAction.isPending} data-testid="btn-fc-bulk-archive">
            <Archive className="h-3 w-3 mr-1" /> Archive
          </Button>
          <Button size="sm" variant="destructive" onClick={() => { if (confirm(`Delete ${selected.length} flashcards?`)) bulkAction.mutate({ action: "delete", ids: selected }); }} disabled={bulkAction.isPending} data-testid="btn-fc-bulk-delete">
            <Trash2 className="h-3 w-3 mr-1" /> Delete
          </Button>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-[#BFA6F6]" /></div>
      ) : (
        <>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-3 w-8">
                    <Checkbox
                      checked={data?.items.length ? selectedIds.size === data.items.length : false}
                      onCheckedChange={toggleSelectAll}
                      data-testid="checkbox-fc-select-all"
                    />
                  </th>
                  <th className="p-3 text-left text-[#2E3A59] font-medium">{t("pages.adminContentManager.front")}</th>
                  <th className="p-3 text-left text-[#2E3A59] font-medium w-32">{t("pages.adminContentManager.category")}</th>
                  <th className="p-3 text-left text-[#2E3A59] font-medium w-20">{t("pages.adminContentManager.tier2")}</th>
                  <th className="p-3 text-left text-[#2E3A59] font-medium w-28">{t("pages.adminContentManager.status2")}</th>
                  <th className="p-3 text-left text-[#2E3A59] font-medium w-24">{t("pages.adminContentManager.created2")}</th>
                </tr>
              </thead>
              <tbody>
                {data?.items.map(fc => (
                  <tr key={fc.id} className="border-b hover:bg-gray-50 transition">
                    <td className="p-3">
                      <Checkbox
                        checked={selectedIds.has(fc.id)}
                        onCheckedChange={() => toggleSelect(fc.id)}
                        data-testid={`checkbox-fc-${fc.id}`}
                      />
                    </td>
                    <td className="p-3">
                      <div className="max-w-md truncate text-[#2E3A59]" title={fc.front} data-testid={`text-fc-front-${fc.id}`}>
                        {fc.front}
                      </div>
                    </td>
                    <td className="p-3 text-gray-600 text-xs">{fc.category || "-"}</td>
                    <td className="p-3"><TierBadge tier={fc.tier} /></td>
                    <td className="p-3"><StatusBadge status={fc.status} /></td>
                    <td className="p-3 text-gray-600 text-xs">{new Date(fc.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
                {(!data?.items || data.items.length === 0) && (
                  <tr><td colSpan={6} className="p-8 text-center text-gray-500">{t("pages.adminContentManager.noFlashcardsFound")}</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600" data-testid="text-fc-pagination-info">
              Page {data?.page || 1} of {data?.totalPages || 1} ({data?.total || 0} total)
            </span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" disabled={!data || data.page <= 1} onClick={() => setPage(p => p - 1)} data-testid="btn-fc-prev-page">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" disabled={!data || data.page >= data.totalPages} onClick={() => setPage(p => p + 1)} data-testid="btn-fc-next-page">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

interface QualityFlaggedItem {
  id: string;
  type: "question" | "flashcard";
  stem?: string;
  front?: string;
  back?: string;
  tier?: string;
  topic?: string;
  difficulty?: number;
  qualityScores?: any[];
  qualityFeedback?: { revisionFeedback?: string[]; overallScore?: number; override?: any };
  qualityScore?: number;
  createdAt?: string;
}

function QualityScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? "bg-green-100 text-green-800" : score >= 65 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800";
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${color}`} data-testid={`badge-quality-score-${score}`}>{score}%</span>;
}

function QualityReviewTab() {
  const queryClient = useQueryClient();
  const [contentFilter, setContentFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [overrideId, setOverrideId] = useState<string | null>(null);
  const [overrideType, setOverrideType] = useState<string>("");
  const [justification, setJustification] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["/api/admin/quality-gate/flagged", contentFilter, page],
    queryFn: async () => {
      const res = await adminFetch(`/api/admin/quality-gate/flagged?contentType=${contentFilter}&page=${page}&limit=25`);
      if (!res.ok) throw new Error("Failed to fetch flagged items");
      return res.json();
    },
  });

  const overrideMutation = useMutation({
    mutationFn: async ({ entityType, id, justification: just }: { entityType: string; id: string; justification: string }) => {
      const res = await adminFetch(`/api/admin/quality-gate/override/${entityType}/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ justification: just, newStatus: "draft" }),
      });
      if (!res.ok) throw new Error("Override failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/quality-gate/flagged"] });
      setOverrideId(null);
      setJustification("");
    },
  });

  const recheckMutation = useMutation({
    mutationFn: async ({ entityType, id }: { entityType: string; id: string }) => {
      const res = await adminFetch(`/api/admin/quality-gate/recheck/${entityType}/${id}`, { method: "POST" });
      if (!res.ok) throw new Error("Recheck failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/quality-gate/flagged"] });
    },
  });

  const allItems: QualityFlaggedItem[] = [
    ...(data?.questions || []).map((q: any) => ({ ...q, type: "question" as const })),
    ...(data?.flashcards || []).map((f: any) => ({ ...f, type: "flashcard" as const })),
  ];

  return (
    <div className="space-y-4" data-testid="quality-review-tab">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Select value={contentFilter} onValueChange={v => { setContentFilter(v); setPage(1); }}>
            <SelectTrigger className="w-40" data-testid="select-quality-filter">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("pages.adminContentManager.allTypes")}</SelectItem>
              <SelectItem value="question">{t("pages.adminContentManager.questionsOnly")}</SelectItem>
              <SelectItem value="flashcard">{t("pages.adminContentManager.flashcardsOnly")}</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-500" data-testid="text-flagged-count">
            {data?.total || 0} flagged items ({data?.totalQuestions || 0} questions, {data?.totalFlashcards || 0} flashcards)
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : allItems.length === 0 ? (
        <div className="text-center py-12 text-gray-500" data-testid="text-no-flagged">
          <ShieldCheck className="h-12 w-12 mx-auto mb-3 text-green-400" />
          <p className="font-medium">{t("pages.adminContentManager.allContentPassedQualityChecks")}</p>
          <p className="text-sm mt-1">{t("pages.adminContentManager.noItemsNeedRevision")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {allItems.map((item) => {
            const isExpanded = expandedId === item.id;
            const isOverriding = overrideId === item.id;
            const feedback = item.qualityFeedback as any;
            const score = feedback?.overallScore || item.qualityScore || 0;
            const revisionFeedback: string[] = feedback?.revisionFeedback || [];
            const scores: any[] = item.qualityScores || [];

            return (
              <div key={item.id} className="border rounded-lg bg-white" data-testid={`card-flagged-${item.id}`}>
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  data-testid={`row-flagged-${item.id}`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0" />
                    <Badge variant="outline" className="flex-shrink-0" data-testid={`badge-type-${item.id}`}>
                      {item.type === "question" ? "Q" : "FC"}
                    </Badge>
                    <span className="text-sm truncate" data-testid={`text-preview-${item.id}`}>
                      {item.type === "question" ? (item.stem || "").substring(0, 120) : (item.front || "").substring(0, 120)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {item.tier && <Badge variant="secondary" data-testid={`badge-tier-${item.id}`}>{item.tier}</Badge>}
                    <QualityScoreBadge score={score} />
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t p-4 space-y-4 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-semibold mb-2 text-gray-700">{t("pages.adminContentManager.contentPreview")}</h4>
                        <div className="bg-white p-3 rounded border text-sm" data-testid={`text-content-${item.id}`}>
                          {item.type === "question" ? (
                            <p>{item.stem}</p>
                          ) : (
                            <>
                              <p className="font-medium">Front: {item.front}</p>
                              <p className="mt-1 text-gray-600">Back: {item.back}</p>
                            </>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold mb-2 text-gray-700">{t("pages.adminContentManager.qualityScores")}</h4>
                        <div className="space-y-1">
                          {scores.map((s: any, idx: number) => (
                            <div key={idx} className="flex items-center justify-between text-xs" data-testid={`score-dimension-${item.id}-${idx}`}>
                              <span className={s.passed ? "text-green-700" : "text-red-700"}>
                                {s.passed ? "✓" : "✗"} {s.dimension}
                              </span>
                              <span className="font-mono">{s.score}/{s.maxScore}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {revisionFeedback.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold mb-2 text-amber-700">{t("pages.adminContentManager.revisionFeedback")}</h4>
                        <ul className="list-disc pl-5 space-y-1" data-testid={`list-feedback-${item.id}`}>
                          {revisionFeedback.map((f: string, idx: number) => (
                            <li key={idx} className="text-sm text-gray-700">{f}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-2 border-t">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => { e.stopPropagation(); recheckMutation.mutate({ entityType: item.type, id: item.id }); }}
                        disabled={recheckMutation.isPending}
                        data-testid={`btn-recheck-${item.id}`}
                      >
                        <RotateCcw className="h-3 w-3 mr-1" /> Re-check
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOverrideId(isOverriding ? null : item.id);
                          setOverrideType(item.type);
                          setJustification("");
                        }}
                        data-testid={`btn-override-${item.id}`}
                      >
                        <ShieldCheck className="h-3 w-3 mr-1" /> Override
                      </Button>
                    </div>

                    {isOverriding && (
                      <div className="bg-amber-50 p-3 rounded border border-amber-200 space-y-2" data-testid={`form-override-${item.id}`}>
                        <p className="text-xs text-amber-700 font-medium">{t("pages.adminContentManager.provideJustificationForOverridingQuality")}</p>
                        <Textarea
                          value={justification}
                          onChange={e => setJustification(e.target.value)}
                          placeholder={t("pages.adminContentManager.explainWhyThisItemShould")}
                          className="text-sm"
                          data-testid={`input-justification-${item.id}`}
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            disabled={justification.length < 10 || overrideMutation.isPending}
                            onClick={() => overrideMutation.mutate({ entityType: overrideType, id: item.id, justification })}
                            data-testid={`btn-confirm-override-${item.id}`}
                          >
                            {overrideMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
                            Confirm Override
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setOverrideId(null)} data-testid={`btn-cancel-override-${item.id}`}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4" data-testid="pagination-quality">
          <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage(p => p - 1)} data-testid="btn-quality-prev">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-gray-600">Page {page} of {data.totalPages}</span>
          <Button size="sm" variant="outline" disabled={page >= data.totalPages} onClick={() => setPage(p => p + 1)} data-testid="btn-quality-next">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

export default function AdminContentManager() {
  const [tab, setTab] = useState<ContentTab>("questions");

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/admin">
            <Button variant="ghost" size="sm" data-testid="btn-back-admin">
              <ArrowLeft className="h-4 w-4 mr-1" /> Admin
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-[#2E3A59]" data-testid="heading-content-manager">{t("pages.adminContentManager.contentManager")}</h1>
        </div>

        <Tabs value={tab} onValueChange={v => setTab(v as ContentTab)}>
          <TabsList data-testid="tabs-content-type">
            <TabsTrigger value="questions" data-testid="tab-questions">{t("pages.adminContentManager.examQuestions")}</TabsTrigger>
            <TabsTrigger value="flashcards" data-testid="tab-flashcards">{t("pages.adminContentManager.flashcardBank")}</TabsTrigger>
            <TabsTrigger value="quality" data-testid="tab-quality">
              <AlertTriangle className="h-3.5 w-3.5 mr-1" /> Quality Review
            </TabsTrigger>
          </TabsList>

          <TabsContent value="questions">
            <Card>
              <CardHeader>
                <CardTitle className="text-[#2E3A59]">{t("pages.adminContentManager.examQuestionManagement")}</CardTitle>
              </CardHeader>
              <CardContent>
                <ExamQuestionsTab />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="flashcards">
            <Card>
              <CardHeader>
                <CardTitle className="text-[#2E3A59]">{t("pages.adminContentManager.flashcardBankManagement")}</CardTitle>
              </CardHeader>
              <CardContent>
                <FlashcardBankTab />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quality">
            <Card>
              <CardHeader>
                <CardTitle className="text-[#2E3A59] flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Quality Review
                </CardTitle>
              </CardHeader>
              <CardContent>
                <QualityReviewTab />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
