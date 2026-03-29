import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { adminFetch } from "@/lib/admin-fetch";
import { useI18n } from "@/lib/i18n";
import {
  RefreshCw, Trash2, Check, X, ChevronLeft, ChevronRight,
  Filter, Sparkles, Eye, Edit2, Calendar, BarChart3,
  Instagram, Linkedin
} from "lucide-react";

interface SocialContentItem {
  id: string;
  platform: string;
  content_type: string;
  title: string;
  caption: string;
  hashtags: string[];
  image_spec: any;
  source_type: string;
  source_id: string | null;
  source_title: string | null;
  status: string;
  scheduled_at: string | null;
  published_at: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  edit_notes: string | null;
  created_at: string;
}

interface ContentStats {
  total: number;
  recentlyGenerated: number;
  byPlatform: { platform: string; count: number }[];
  byType: { content_type: string; count: number }[];
  byStatus: { status: string; count: number }[];
}

const PLATFORM_COLORS: Record<string, string> = {
  instagram: "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
  tiktok: "bg-black text-white",
  pinterest: "bg-red-600 text-white",
  linkedin: "bg-blue-700 text-white",
};

const PLATFORM_LABELS: Record<string, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  pinterest: "Pinterest",
  linkedin: "LinkedIn",
};

const CONTENT_TYPE_LABELS: Record<string, string> = {
  study_tip: "Study Tip",
  quiz_question: "Quiz Question",
  clinical_pearl: "Clinical Pearl",
  infographic_spec: "Infographic",
};

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  scheduled: "bg-blue-100 text-blue-700",
  published: "bg-purple-100 text-purple-700",
};

export default function AdminSocialContent() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [items, setItems] = useState<SocialContentItem[]>([]);
  const [stats, setStats] = useState<ContentStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filterPlatform, setFilterPlatform] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCaption, setEditCaption] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (filterPlatform) params.set("platform", filterPlatform);
      if (filterType) params.set("contentType", filterType);
      if (filterStatus) params.set("status", filterStatus);

      const res = await adminFetch(`/api/admin/social-content?${params}`);
      if (res.ok) {
        const data = await res.json();
        setItems(data.items);
        setTotalPages(data.totalPages);
        setTotal(data.total);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, [page, filterPlatform, filterType, filterStatus]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await adminFetch("/api/admin/social-content/stats");
      if (res.ok) setStats(await res.json());
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);
  useEffect(() => { fetchStats(); }, [fetchStats]);

  async function generateContent() {
    setGenerating(true);
    try {
      const res = await adminFetch("/api/admin/social-content/generate", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        alert(`Generated ${data.generated} social content items!`);
        fetchItems();
        fetchStats();
      }
    } catch (e) {
      console.error(e);
    }
    setGenerating(false);
  }

  async function updateItem(id: string, updates: any) {
    try {
      const res = await adminFetch(`/api/admin/social-content/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const updated = await res.json();
        setItems(prev => prev.map(item => item.id === id ? updated : item));
        fetchStats();
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function deleteItem(id: string) {
    try {
      const res = await adminFetch(`/api/admin/social-content/${id}`, { method: "DELETE" });
      if (res.ok) {
        setItems(prev => prev.filter(item => item.id !== id));
        setTotal(prev => prev - 1);
        fetchStats();
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function bulkAction(action: string) {
    if (selectedIds.size === 0) return;
    try {
      const res = await adminFetch("/api/admin/social-content/bulk-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selectedIds), action }),
      });
      if (res.ok) {
        setSelectedIds(new Set());
        fetchItems();
        fetchStats();
      }
    } catch (e) {
      console.error(e);
    }
  }

  function toggleSelect(id: string) {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (selectedIds.size === items.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(items.map(i => i.id)));
    }
  }

  if (!user || user.tier !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">{t("pages.adminSocialContent.adminAccessRequired")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900" data-testid="heading-social-content">{t("pages.adminSocialContent.socialContentAutomation")}</h1>
            <p className="text-sm text-gray-500 mt-1">{t("pages.adminSocialContent.autogeneratedSocialMediaContentFrom")}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setLocation("/admin")} data-testid="button-back-admin">
              Back to Admin
            </Button>
            <Button variant="outline" size="sm" onClick={() => { fetchItems(); fetchStats(); }} disabled={loading} data-testid="button-refresh-content">
              <RefreshCw className={`w-4 h-4 mr-1 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button size="sm" onClick={generateContent} disabled={generating} data-testid="button-generate-content">
              <Sparkles className={`w-4 h-4 mr-1 ${generating ? "animate-pulse" : ""}`} />
              {generating ? "Generating..." : "Generate Now"}
            </Button>
          </div>
        </div>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            <Card data-testid="stat-total">
              <CardContent className="p-4">
                <p className="text-xs text-gray-500">{t("pages.adminSocialContent.totalContent")}</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </CardContent>
            </Card>
            <Card data-testid="stat-recent">
              <CardContent className="p-4">
                <p className="text-xs text-gray-500">{t("pages.adminSocialContent.last24h")}</p>
                <p className="text-2xl font-bold text-green-600">{stats.recentlyGenerated}</p>
              </CardContent>
            </Card>
            {stats.byPlatform.slice(0, 3).map(p => (
              <Card key={p.platform} data-testid={`stat-platform-${p.platform}`}>
                <CardContent className="p-4">
                  <p className="text-xs text-gray-500">{PLATFORM_LABELS[p.platform] || p.platform}</p>
                  <p className="text-2xl font-bold">{p.count}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="flex items-center gap-1">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-500 font-medium">{t("pages.adminSocialContent.filters")}</span>
          </div>
          <select
            value={filterPlatform}
            onChange={e => { setFilterPlatform(e.target.value); setPage(1); }}
            className="text-sm border rounded px-2 py-1 bg-white"
            data-testid="filter-platform"
          >
            <option value="">{t("pages.adminSocialContent.allPlatforms")}</option>
            <option value="instagram">{t("pages.adminSocialContent.instagram")}</option>
            <option value="tiktok">{t("pages.adminSocialContent.tiktok")}</option>
            <option value="pinterest">{t("pages.adminSocialContent.pinterest")}</option>
            <option value="linkedin">{t("pages.adminSocialContent.linkedin")}</option>
          </select>
          <select
            value={filterType}
            onChange={e => { setFilterType(e.target.value); setPage(1); }}
            className="text-sm border rounded px-2 py-1 bg-white"
            data-testid="filter-type"
          >
            <option value="">{t("pages.adminSocialContent.allTypes")}</option>
            <option value="study_tip">{t("pages.adminSocialContent.studyTips")}</option>
            <option value="quiz_question">{t("pages.adminSocialContent.quizQuestions")}</option>
            <option value="clinical_pearl">{t("pages.adminSocialContent.clinicalPearls")}</option>
            <option value="infographic_spec">{t("pages.adminSocialContent.infographics")}</option>
          </select>
          <select
            value={filterStatus}
            onChange={e => { setFilterStatus(e.target.value); setPage(1); }}
            className="text-sm border rounded px-2 py-1 bg-white"
            data-testid="filter-status"
          >
            <option value="">{t("pages.adminSocialContent.allStatuses")}</option>
            <option value="draft">{t("pages.adminSocialContent.draft")}</option>
            <option value="approved">{t("pages.adminSocialContent.approved")}</option>
            <option value="rejected">{t("pages.adminSocialContent.rejected")}</option>
            <option value="scheduled">{t("pages.adminSocialContent.scheduled")}</option>
            <option value="published">{t("pages.adminSocialContent.published")}</option>
          </select>
          <span className="text-xs text-gray-400">{total} items</span>
        </div>

        {selectedIds.size > 0 && (
          <div className="flex items-center gap-2 mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200" data-testid="bulk-actions">
            <span className="text-sm font-medium text-blue-700">{selectedIds.size} selected</span>
            <Button size="sm" variant="outline" onClick={() => bulkAction("approve")} data-testid="button-bulk-approve">
              <Check className="w-3 h-3 mr-1" /> Approve
            </Button>
            <Button size="sm" variant="outline" onClick={() => bulkAction("reject")} data-testid="button-bulk-reject">
              <X className="w-3 h-3 mr-1" /> Reject
            </Button>
            <Button size="sm" variant="destructive" onClick={() => bulkAction("delete")} data-testid="button-bulk-delete">
              <Trash2 className="w-3 h-3 mr-1" /> Delete
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setSelectedIds(new Set())} data-testid="button-clear-selection">
              Clear
            </Button>
          </div>
        )}

        <Card className="border border-gray-200">
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <RefreshCw className="w-8 h-8 text-gray-400 animate-spin" />
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-16">
                <Sparkles className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">{t("pages.adminSocialContent.noSocialContentGeneratedYet")}</p>
                <p className="text-gray-400 text-xs mt-1">{t("pages.adminSocialContent.clickGenerateNowToCreate")}</p>
              </div>
            ) : (
              <>
                <div className="border-b border-gray-100 px-4 py-2 flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === items.length && items.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded"
                    data-testid="checkbox-select-all"
                  />
                  <span className="text-xs text-gray-400">{t("pages.adminSocialContent.selectAll")}</span>
                </div>

                <div className="divide-y divide-gray-100">
                  {items.map(item => (
                    <div key={item.id} className="p-4 hover:bg-gray-50/50 transition-colors" data-testid={`card-social-content-${item.id}`}>
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(item.id)}
                          onChange={() => toggleSelect(item.id)}
                          className="rounded mt-1"
                          data-testid={`checkbox-item-${item.id}`}
                        />

                        <div className={`px-2 py-1 rounded text-xs font-bold shrink-0 ${PLATFORM_COLORS[item.platform] || "bg-gray-200 text-gray-700"}`}>
                          {PLATFORM_LABELS[item.platform] || item.platform}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {CONTENT_TYPE_LABELS[item.content_type] || item.content_type}
                            </Badge>
                            <Badge className={`text-xs ${STATUS_COLORS[item.status] || "bg-gray-100"}`}>
                              {item.status}
                            </Badge>
                            {item.source_title && (
                              <span className="text-xs text-gray-400 truncate max-w-[200px]">
                                from: {item.source_title}
                              </span>
                            )}
                          </div>

                          {editingId === item.id ? (
                            <div className="space-y-2">
                              <textarea
                                value={editCaption}
                                onChange={e => setEditCaption(e.target.value)}
                                className="w-full border rounded px-3 py-2 text-sm bg-white resize-none"
                                rows={4}
                                data-testid={`textarea-edit-${item.id}`}
                              />
                              <div className="flex gap-2">
                                <Button size="sm" onClick={() => { updateItem(item.id, { caption: editCaption }); setEditingId(null); }} data-testid={`button-save-edit-${item.id}`}>
                                  Save
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => setEditingId(null)} data-testid={`button-cancel-edit-${item.id}`}>
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <p
                              className={`text-sm text-gray-700 whitespace-pre-wrap ${expandedId === item.id ? "" : "line-clamp-3"} cursor-pointer`}
                              onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                              data-testid={`text-caption-${item.id}`}
                            >
                              {item.caption}
                            </p>
                          )}

                          {expandedId === item.id && item.hashtags?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {item.hashtags.map((tag, i) => (
                                <span key={i} className="text-xs text-blue-500">{tag}</span>
                              ))}
                            </div>
                          )}

                          {expandedId === item.id && item.image_spec && (
                            <div className="mt-2 p-2 bg-gray-100 rounded text-xs text-gray-600">
                              <p className="font-medium">Image Spec: {item.image_spec.width}x{item.image_spec.height}</p>
                              {item.image_spec.elements?.map((el: string, i: number) => (
                                <p key={i} className="ml-2">- {el}</p>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                            <span>{new Date(item.created_at).toLocaleDateString()}</span>
                            {item.scheduled_at && <span>Scheduled: {new Date(item.scheduled_at).toLocaleString()}</span>}
                            {item.source_type && <span className="capitalize">{item.source_type}</span>}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0"
                            onClick={() => { setExpandedId(expandedId === item.id ? null : item.id); }}
                            data-testid={`button-expand-${item.id}`}
                          >
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0"
                            onClick={() => { setEditingId(item.id); setEditCaption(item.caption); }}
                            data-testid={`button-edit-${item.id}`}
                          >
                            <Edit2 className="w-3 h-3" />
                          </Button>
                          {item.status === "draft" && (
                            <>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 w-7 p-0 text-green-600"
                                onClick={() => updateItem(item.id, { status: "approved" })}
                                data-testid={`button-approve-${item.id}`}
                              >
                                <Check className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 w-7 p-0 text-red-600"
                                onClick={() => updateItem(item.id, { status: "rejected" })}
                                data-testid={`button-reject-${item.id}`}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 text-red-400"
                            onClick={() => deleteItem(item.id)}
                            data-testid={`button-delete-${item.id}`}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-4">
            <Button
              size="sm"
              variant="outline"
              disabled={page <= 1}
              onClick={() => setPage(p => p - 1)}
              data-testid="button-prev-page"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </span>
            <Button
              size="sm"
              variant="outline"
              disabled={page >= totalPages}
              onClick={() => setPage(p => p + 1)}
              data-testid="button-next-page"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
