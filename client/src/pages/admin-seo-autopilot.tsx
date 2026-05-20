import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  FileText,
  Image,
  Link2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Loader2,
  Plus,
  Play,
  Search,
  Globe,
  Layers,
  Settings,
  Send,
  PinIcon,
  ShieldCheck,
  LayoutDashboard,
  Upload,
  Workflow,
  BookTemplate,
  RefreshCw,
  ArrowRight,
} from "lucide-react";
import { adminFetch, adminJson } from "@/lib/admin-fetch";
import { ApiError, getAdminOpsMessageForCode } from "@/lib/api-error";
import { useToast } from "@/hooks/use-toast";

import { useI18n } from "@/lib/i18n";
const STATUS_COLORS: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  generating: "bg-blue-100 text-blue-700",
  qc: "bg-yellow-100 text-yellow-700",
  queued: "bg-purple-100 text-purple-700",
  publishing: "bg-indigo-100 text-indigo-700",
  published: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
  needs_review: "bg-orange-100 text-orange-700",
  ready: "bg-emerald-100 text-emerald-700",
  blocked: "bg-red-100 text-red-700",
};

function StatusBadge({ status }: { status: string }) {
  const { t } = useI18n();
  return (
    <Badge className={`${STATUS_COLORS[status] || "bg-gray-100 text-gray-700"} text-xs font-medium`} data-testid={`badge-status-${status}`}>
      {status.replace(/_/g, " ")}
    </Badge>
  );
}

function OverviewTab({ siteContext, careerTrack }: { siteContext: string; careerTrack: string | null }) {
  const { t } = useI18n();
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/admin/seo-engine/stats", siteContext, careerTrack],
    queryFn: () => adminFetch(`/api/admin/seo-engine/stats?siteContext=${siteContext}${careerTrack ? `&careerTrack=${careerTrack}` : ""}`).then(r => r.json()),
    refetchInterval: 30000,
  });

  if (isLoading) return <div className="flex items-center gap-2 py-8"><Loader2 className="animate-spin" /> {t("pages.adminSeoAutopilot.loadingStats")}</div>;

  const s = stats || { clusters: {}, articles: {}, infographics: {}, pins: {}, qc: {} };

  return (
    <div className="space-y-6" data-testid="tab-overview">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card data-testid="stat-clusters">
          <CardContent className="py-4 text-center">
            <div className="text-2xl font-bold text-[#BFA6F6]">{s.clusters?.total || 0}</div>
            <div className="text-xs text-gray-500">{t("pages.adminSeoAutopilot.topicClusters")}</div>
            <div className="text-xs text-green-600 mt-1">{s.clusters?.published || 0} published</div>
          </CardContent>
        </Card>
        <Card data-testid="stat-articles">
          <CardContent className="py-4 text-center">
            <div className="text-2xl font-bold text-[#AEE3E1]">{s.articles?.total || 0}</div>
            <div className="text-xs text-gray-500">{t("pages.adminSeoAutopilot.articles")}</div>
            <div className="text-xs text-gray-400">{s.articles?.pillars || 0} pillars, {s.articles?.supports || 0} supports</div>
          </CardContent>
        </Card>
        <Card data-testid="stat-words">
          <CardContent className="py-4 text-center">
            <div className="text-2xl font-bold text-[#FFD6A5]">{(s.articles?.total_words || 0).toLocaleString()}</div>
            <div className="text-xs text-gray-500">{t("pages.adminSeoAutopilot.totalWords")}</div>
          </CardContent>
        </Card>
        <Card data-testid="stat-infographics">
          <CardContent className="py-4 text-center">
            <div className="text-2xl font-bold text-[#2E3A59]">{s.infographics?.total || 0}</div>
            <div className="text-xs text-gray-500">{t("pages.adminSeoAutopilot.infographics")}</div>
            <div className="text-xs text-green-600 mt-1">{s.infographics?.ready || 0} ready</div>
          </CardContent>
        </Card>
        <Card data-testid="stat-pins">
          <CardContent className="py-4 text-center">
            <div className="text-2xl font-bold text-red-400">{s.pins?.total || 0}</div>
            <div className="text-xs text-gray-500">{t("pages.adminSeoAutopilot.pinterestPins")}</div>
            <div className="text-xs text-green-600 mt-1">{s.pins?.ready || 0} ready</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card data-testid="card-article-status">
          <CardHeader><CardTitle className="text-sm">{t("pages.adminSeoAutopilot.articleStatusBreakdown")}</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              {[
                { label: "Draft", value: s.articles?.draft || 0, color: "bg-gray-200" },
                { label: "Published", value: s.articles?.published || 0, color: "bg-green-400" },
                { label: "Needs Review", value: s.articles?.needs_review || 0, color: "bg-orange-400" },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="flex-1">{item.label}</span>
                  <span className="font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card data-testid="card-qc-summary">
          <CardHeader><CardTitle className="text-sm">{t("pages.adminSeoAutopilot.qualityControl")}</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="flex-1">{t("pages.adminSeoAutopilot.qcPassed")}</span>
                <span className="font-semibold text-green-600">{s.qc?.passed || 0}</span>
              </div>
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <span className="flex-1">{t("pages.adminSeoAutopilot.qcFailed")}</span>
                <span className="font-semibold text-red-600">{s.qc?.failed || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ClustersTab({ siteContext, careerTrack }: { siteContext: string; careerTrack: string | null }) {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("all");
  const [newKeyword, setNewKeyword] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newCountry, setNewCountry] = useState("BOTH");
  const [newExamTier, setNewExamTier] = useState("ALL");
  const [expandedCluster, setExpandedCluster] = useState<string | null>(null);

  const { data: clusters, isLoading } = useQuery({
    queryKey: ["/api/admin/seo-engine/clusters", siteContext, careerTrack, statusFilter],
    queryFn: () => adminFetch(`/api/admin/seo-engine/clusters?siteContext=${siteContext}${careerTrack ? `&careerTrack=${careerTrack}` : ""}${statusFilter !== "all" ? `&status=${statusFilter}` : ""}`).then(r => r.json()),
  });

  const createMutation = useMutation({
    mutationFn: () => adminFetch("/api/admin/seo-engine/clusters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keyword: newKeyword, pillarSlug: newSlug, countryMode: newCountry, examTier: newExamTier, siteContext, careerTrack }),
    }).then(r => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/seo-engine/clusters"] });
      setNewKeyword(""); setNewSlug("");
    },
  });

  const { data: clusterArticles } = useQuery({
    queryKey: ["/api/admin/seo-engine/articles", "cluster", expandedCluster],
    queryFn: () => expandedCluster ? adminFetch(`/api/admin/seo-engine/articles?clusterId=${expandedCluster}&limit=100`).then(r => r.json()) : Promise.resolve([]),
    enabled: !!expandedCluster,
  });

  const clusterList = Array.isArray(clusters) ? clusters : [];

  return (
    <div className="space-y-6" data-testid="tab-clusters">
      <Card data-testid="card-create-cluster">
        <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Plus className="w-4 h-4" /> {t("pages.adminSeoAutopilot.createNewCluster")}</CardTitle></CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-3">
            <Input placeholder={t("pages.adminSeoAutopilot.keywordEgEcgRhythms")} value={newKeyword} onChange={e => { setNewKeyword(e.target.value); setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")); }} data-testid="input-cluster-keyword" />
            <Input placeholder={t("pages.adminSeoAutopilot.pillarSlug")} value={newSlug} onChange={e => setNewSlug(e.target.value)} data-testid="input-cluster-slug" />
            <Select value={newCountry} onValueChange={setNewCountry}>
              <SelectTrigger data-testid="select-cluster-country"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="BOTH">{t("pages.adminSeoAutopilot.bothCaus")}</SelectItem>
                <SelectItem value="CA">{t("pages.adminSeoAutopilot.canadaOnly")}</SelectItem>
                <SelectItem value="US">{t("pages.adminSeoAutopilot.usOnly")}</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => createMutation.mutate()} disabled={!newKeyword || !newSlug || createMutation.isPending} className="bg-[#BFA6F6] hover:bg-[#A88DE0] text-white" data-testid="button-create-cluster">
              {createMutation.isPending ? <Loader2 className="animate-spin w-4 h-4" /> : "Create Cluster"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2 items-center">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40" data-testid="select-cluster-status-filter"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("pages.adminSeoAutopilot.allStatus")}</SelectItem>
            <SelectItem value="draft">{t("pages.adminSeoAutopilot.draft")}</SelectItem>
            <SelectItem value="generating">{t("pages.adminSeoAutopilot.generating")}</SelectItem>
            <SelectItem value="published">{t("pages.adminSeoAutopilot.published")}</SelectItem>
            <SelectItem value="failed">{t("pages.adminSeoAutopilot.failed")}</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-gray-500">{clusterList.length} cluster{clusterList.length !== 1 ? "s" : ""}</span>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 py-4"><Loader2 className="animate-spin" /> {t("pages.adminSeoAutopilot.loadingClusters")}</div>
      ) : clusterList.length === 0 ? (
        <p className="text-gray-500 text-sm py-4">{t("pages.adminSeoAutopilot.noClustersFoundCreateOne")}</p>
      ) : (
        <div className="space-y-3">
          {clusterList.map((c: any) => (
            <Card key={c.id} className="cursor-pointer hover:shadow-md transition-shadow" data-testid={`cluster-card-${c.id}`}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between" onClick={() => setExpandedCluster(expandedCluster === c.id ? null : c.id)}>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-[#2E3A59]">{c.keyword}</h3>
                      <StatusBadge status={c.status} />
                      <Badge variant="outline" className="text-xs">{c.countryMode}</Badge>
                      {c.careerTrack && <Badge variant="outline" className="text-xs">{c.careerTrack}</Badge>}
                    </div>
                    <p className="text-xs text-gray-500">/{c.pillarSlug}</p>
                  </div>
                </div>
                {expandedCluster === c.id && (
                  <div className="mt-4 pt-4 border-t space-y-2">
                    <h4 className="text-sm font-semibold text-gray-600">{t("pages.adminSeoAutopilot.articlesInCluster")}</h4>
                    {(clusterArticles || []).map((a: any) => (
                      <div key={a.id} className="flex items-center gap-2 text-sm p-2 rounded bg-gray-50">
                        <Badge variant={a.type === "pillar" ? "default" : "outline"} className="text-xs">{a.type}</Badge>
                        <span className="flex-1">{a.title}</span>
                        <StatusBadge status={a.status} />
                        <span className="text-xs text-gray-400">{a.wordCount} words</span>
                      </div>
                    ))}
                    {(clusterArticles || []).length === 0 && <p className="text-xs text-gray-400">{t("pages.adminSeoAutopilot.noArticlesYet")}</p>}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function ArticlesTab({ siteContext, careerTrack }: { siteContext: string; careerTrack: string | null }) {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const { data: articles, isLoading } = useQuery({
    queryKey: ["/api/admin/seo-engine/articles", siteContext, careerTrack, statusFilter, typeFilter],
    queryFn: () => {
      let url = `/api/admin/seo-engine/articles?siteContext=${siteContext}`;
      if (careerTrack) url += `&careerTrack=${careerTrack}`;
      if (statusFilter !== "all") url += `&status=${statusFilter}`;
      if (typeFilter !== "all") url += `&type=${typeFilter}`;
      return adminFetch(url).then(r => r.json());
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      adminFetch(`/api/admin/seo-engine/articles/${id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      }).then(r => r.json()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/admin/seo-engine/articles"] }),
  });

  const articleList = Array.isArray(articles) ? articles : [];

  return (
    <div className="space-y-4" data-testid="tab-articles">
      <div className="flex gap-2 items-center flex-wrap">
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-36" data-testid="select-article-type"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("pages.adminSeoAutopilot.allTypes")}</SelectItem>
            <SelectItem value="pillar">{t("pages.adminSeoAutopilot.pillar")}</SelectItem>
            <SelectItem value="support">{t("pages.adminSeoAutopilot.support")}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36" data-testid="select-article-status"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("pages.adminSeoAutopilot.allStatus2")}</SelectItem>
            <SelectItem value="draft">{t("pages.adminSeoAutopilot.draft2")}</SelectItem>
            <SelectItem value="generating">{t("pages.adminSeoAutopilot.generating2")}</SelectItem>
            <SelectItem value="needs_review">{t("pages.adminSeoAutopilot.needsReview")}</SelectItem>
            <SelectItem value="published">{t("pages.adminSeoAutopilot.published2")}</SelectItem>
            <SelectItem value="failed">{t("pages.adminSeoAutopilot.failed2")}</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-gray-500">{articleList.length} article{articleList.length !== 1 ? "s" : ""}</span>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 py-4"><Loader2 className="animate-spin" /> {t("pages.adminSeoAutopilot.loadingArticles")}</div>
      ) : articleList.length === 0 ? (
        <p className="text-gray-500 text-sm py-4">{t("pages.adminSeoAutopilot.noArticlesFound")}</p>
      ) : (
        <div className="space-y-2">
          {articleList.map((a: any) => (
            <Card key={a.id} data-testid={`article-card-${a.id}`}>
              <CardContent className="py-3">
                <div className="flex items-center gap-3">
                  <Badge variant={a.type === "pillar" ? "default" : "outline"} className="text-xs flex-shrink-0">{a.type}</Badge>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-[#2E3A59] truncate">{a.title}</h4>
                    <p className="text-xs text-gray-400 truncate">/{a.slug} | {a.targetKeyword} | {a.searchIntent}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-gray-400">{a.wordCount} words</span>
                    <StatusBadge status={a.status} />
                    <Badge variant="outline" className="text-xs">{a.gatingLevel}</Badge>
                    {a.status === "draft" && (
                      <Button size="sm" variant="outline" onClick={() => statusMutation.mutate({ id: a.id, status: "published" })} data-testid={`button-publish-${a.id}`}>
                        Publish
                      </Button>
                    )}
                    {a.status === "needs_review" && (
                      <>
                        <Button size="sm" variant="outline" onClick={() => statusMutation.mutate({ id: a.id, status: "draft" })} data-testid={`button-approve-${a.id}`}>
                          Approve
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function InfographicsTab({ siteContext, careerTrack }: { siteContext: string; careerTrack: string | null }) {
  const { t } = useI18n();
  const { data: infographics, isLoading } = useQuery({
    queryKey: ["/api/admin/seo-engine/infographics", siteContext, careerTrack],
    queryFn: () => adminFetch(`/api/admin/seo-engine/infographics?siteContext=${siteContext}${careerTrack ? `&careerTrack=${careerTrack}` : ""}`).then(r => r.json()),
  });

  const list = Array.isArray(infographics) ? infographics : [];

  return (
    <div className="space-y-4" data-testid="tab-infographics">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-[#2E3A59]">{t("pages.adminSeoAutopilot.generatedInfographics")}</h3>
        <span className="text-sm text-gray-500">{list.length} infographic{list.length !== 1 ? "s" : ""}</span>
      </div>
      {isLoading ? (
        <div className="flex items-center gap-2 py-4"><Loader2 className="animate-spin" /> {t("pages.adminSeoAutopilot.loading")}</div>
      ) : list.length === 0 ? (
        <Card><CardContent className="py-8 text-center text-gray-500">{t("pages.adminSeoAutopilot.noInfographicsGeneratedYetGenerate")}</CardContent></Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((inf: any) => (
            <Card key={inf.id} data-testid={`infographic-card-${inf.id}`}>
              <CardContent className="py-4">
                <h4 className="font-medium text-sm text-[#2E3A59] mb-1">{inf.title}</h4>
                <div className="flex items-center gap-2 mb-2">
                  <StatusBadge status={inf.status} />
                  <span className="text-xs text-gray-400">{inf.width}x{inf.height}</span>
                  <Badge variant="outline" className="text-xs">{inf.variant}</Badge>
                </div>
                {inf.filePath && <p className="text-xs text-gray-400 truncate">{inf.filePath}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function TemplatesTab({ siteContext, careerTrack }: { siteContext: string; careerTrack: string | null }) {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const [newKey, setNewKey] = useState("");
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newPrompt, setNewPrompt] = useState("");

  const { data: templates, isLoading } = useQuery({
    queryKey: ["/api/admin/seo-engine/templates", siteContext, careerTrack],
    queryFn: () => adminFetch(`/api/admin/seo-engine/templates?siteContext=${siteContext}${careerTrack ? `&careerTrack=${careerTrack}` : ""}`).then(r => r.json()),
  });

  const createMutation = useMutation({
    mutationFn: () => adminFetch("/api/admin/seo-engine/templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ templateKey: newKey, name: newName, category: newCategory, promptText: newPrompt, siteContext, careerTrack }),
    }).then(r => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/seo-engine/templates"] });
      setNewKey(""); setNewName(""); setNewCategory(""); setNewPrompt("");
    },
  });

  const list = Array.isArray(templates) ? templates : [];

  return (
    <div className="space-y-6" data-testid="tab-templates">
      <Card>
        <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Plus className="w-4 h-4" /> {t("pages.adminSeoAutopilot.addInfographicTemplate")}</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="grid md:grid-cols-3 gap-3">
            <Input placeholder={t("pages.adminSeoAutopilot.templateKeyEgEcgv1")} value={newKey} onChange={e => setNewKey(e.target.value)} data-testid="input-template-key" />
            <Input placeholder={t("pages.adminSeoAutopilot.displayName")} value={newName} onChange={e => setNewName(e.target.value)} data-testid="input-template-name" />
            <Input placeholder={t("pages.adminSeoAutopilot.categoryEgCardioLabs")} value={newCategory} onChange={e => setNewCategory(e.target.value)} data-testid="input-template-category" />
          </div>
          <Textarea placeholder={t("pages.adminSeoAutopilot.imageGenerationPrompt")} value={newPrompt} onChange={e => setNewPrompt(e.target.value)} rows={4} data-testid="input-template-prompt" />
          <Button onClick={() => createMutation.mutate()} disabled={!newKey || !newName || !newCategory || !newPrompt} className="bg-[#BFA6F6] hover:bg-[#A88DE0] text-white" data-testid="button-save-template">
            Save Template
          </Button>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex items-center gap-2 py-4"><Loader2 className="animate-spin" /> {t("pages.adminSeoAutopilot.loading2")}</div>
      ) : (
        <div className="space-y-2">
          {list.map((t: any) => (
            <Card key={t.id} data-testid={`template-card-${t.id}`}>
              <CardContent className="py-3">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{t.name}</h4>
                    <p className="text-xs text-gray-400">{t.templateKey} | {t.category} | {t.examTier}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">{t.countryMode}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
          {list.length === 0 && <p className="text-sm text-gray-500">{t("pages.adminSeoAutopilot.noTemplatesYet")}</p>}
        </div>
      )}
    </div>
  );
}

function PinsTab({ siteContext, careerTrack }: { siteContext: string; careerTrack: string | null }) {
  const { t } = useI18n();
  const { data: pins, isLoading } = useQuery({
    queryKey: ["/api/admin/seo-engine/pins", siteContext, careerTrack],
    queryFn: () => adminFetch(`/api/admin/seo-engine/pins?siteContext=${siteContext}${careerTrack ? `&careerTrack=${careerTrack}` : ""}`).then(r => r.json()),
  });

  const list = Array.isArray(pins) ? pins : [];

  return (
    <div className="space-y-4" data-testid="tab-pins">
      <h3 className="font-semibold text-[#2E3A59]">Pinterest Pins ({list.length})</h3>
      {isLoading ? (
        <div className="flex items-center gap-2 py-4"><Loader2 className="animate-spin" /> {t("pages.adminSeoAutopilot.loading3")}</div>
      ) : list.length === 0 ? (
        <Card><CardContent className="py-8 text-center text-gray-500">{t("pages.adminSeoAutopilot.noPinsGeneratedYetPins")}</CardContent></Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((p: any) => (
            <Card key={p.id} data-testid={`pin-card-${p.id}`}>
              <CardContent className="py-4">
                <h4 className="font-medium text-sm mb-1">{p.headline}</h4>
                <div className="flex items-center gap-2">
                  <StatusBadge status={p.status} />
                  <Badge variant="outline" className="text-xs">Pin {p.pinVariant}</Badge>
                  <span className="text-xs text-gray-400">{p.width}x{p.height}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function InternalLinksTab({ siteContext, careerTrack }: { siteContext: string; careerTrack: string | null }) {
  const { t } = useI18n();
  const { data: links, isLoading } = useQuery({
    queryKey: ["/api/admin/seo-engine/internal-links", siteContext, careerTrack],
    queryFn: () => adminFetch(`/api/admin/seo-engine/internal-links`).then(r => r.json()),
  });

  const list = Array.isArray(links) ? links : [];

  return (
    <div className="space-y-4" data-testid="tab-internal-links">
      <h3 className="font-semibold text-[#2E3A59]">Internal Link Map ({list.length})</h3>
      {isLoading ? (
        <div className="flex items-center gap-2 py-4"><Loader2 className="animate-spin" /> {t("pages.adminSeoAutopilot.loading4")}</div>
      ) : list.length === 0 ? (
        <Card><CardContent className="py-8 text-center text-gray-500">{t("pages.adminSeoAutopilot.noInternalLinksGeneratedYet")}</CardContent></Card>
      ) : (
        <div className="space-y-2">
          {list.map((l: any) => (
            <Card key={l.id} data-testid={`link-card-${l.id}`}>
              <CardContent className="py-3">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-[#2E3A59] truncate max-w-[200px]">{l.fromTitle}</span>
                  <span className="text-gray-400">{t("pages.adminSeoAutopilot.gt")}</span>
                  <span className="font-medium text-[#BFA6F6] truncate max-w-[200px]">{l.toTitle}</span>
                  <Badge variant="outline" className="text-xs ml-auto">{l.placement}</Badge>
                  <span className="text-xs text-gray-400">{l.reason}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Anchor: "{l.anchorText}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function PublishQueueTab({ siteContext, careerTrack }: { siteContext: string; careerTrack: string | null }) {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: queue, isLoading } = useQuery({
    queryKey: ["/api/admin/seo-engine/publish-queue", siteContext, careerTrack, statusFilter],
    queryFn: () => {
      let url = `/api/admin/seo-engine/publish-queue?siteContext=${siteContext}`;
      if (careerTrack) url += `&careerTrack=${careerTrack}`;
      if (statusFilter !== "all") url += `&status=${statusFilter}`;
      return adminFetch(url).then(r => r.json());
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      adminFetch(`/api/admin/seo-engine/publish-queue/${id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      }).then(r => r.json()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/admin/seo-engine/publish-queue"] }),
  });

  const list = Array.isArray(queue) ? queue : [];

  return (
    <div className="space-y-4" data-testid="tab-publish-queue">
      <div className="flex gap-2 items-center">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40" data-testid="select-queue-status"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("pages.adminSeoAutopilot.all")}</SelectItem>
            <SelectItem value="queued">{t("pages.adminSeoAutopilot.queued")}</SelectItem>
            <SelectItem value="publishing">{t("pages.adminSeoAutopilot.publishing")}</SelectItem>
            <SelectItem value="published">{t("pages.adminSeoAutopilot.published3")}</SelectItem>
            <SelectItem value="blocked">{t("pages.adminSeoAutopilot.blocked")}</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-gray-500">{list.length} item{list.length !== 1 ? "s" : ""}</span>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 py-4"><Loader2 className="animate-spin" /> {t("pages.adminSeoAutopilot.loading5")}</div>
      ) : list.length === 0 ? (
        <Card><CardContent className="py-8 text-center text-gray-500">{t("pages.adminSeoAutopilot.publishQueueIsEmpty")}</CardContent></Card>
      ) : (
        <div className="space-y-2">
          {list.map((q: any) => (
            <Card key={q.id} data-testid={`queue-card-${q.id}`}>
              <CardContent className="py-3">
                <div className="flex items-center gap-3">
                  <Badge variant={q.articleType === "pillar" ? "default" : "outline"} className="text-xs">{q.articleType}</Badge>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{q.title}</h4>
                    <p className="text-xs text-gray-400">Priority: {q.priority} | Scheduled: {new Date(q.scheduledFor).toLocaleDateString()}</p>
                  </div>
                  <StatusBadge status={q.status} />
                  {q.status === "queued" && (
                    <Button size="sm" onClick={() => statusMutation.mutate({ id: q.id, status: "published" })} className="bg-green-500 hover:bg-green-600 text-white" data-testid={`button-publish-queue-${q.id}`}>
                      Publish
                    </Button>
                  )}
                  {q.blockedReason && <span className="text-xs text-red-500">{q.blockedReason}</span>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function QcTab({ siteContext, careerTrack }: { siteContext: string; careerTrack: string | null }) {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  const { data: runs, isLoading } = useQuery({
    queryKey: ["/api/admin/seo-engine/qc-runs"],
    queryFn: () => adminFetch("/api/admin/seo-engine/qc-runs").then(r => r.json()),
  });

  const runQcMutation = useMutation({
    mutationFn: (params: any) => adminFetch("/api/admin/seo-engine/qc-runs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    }).then(r => r.json()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/admin/seo-engine/qc-runs"] }),
  });

  const list = Array.isArray(runs) ? runs : [];

  return (
    <div className="space-y-4" data-testid="tab-qc">
      <h3 className="font-semibold text-[#2E3A59]">{t("pages.adminSeoAutopilot.qualityControlRuns")}</h3>
      <p className="text-sm text-gray-500">{t("pages.adminSeoAutopilot.qcChecksValidateContentMeets")}</p>

      {isLoading ? (
        <div className="flex items-center gap-2 py-4"><Loader2 className="animate-spin" /> {t("pages.adminSeoAutopilot.loading6")}</div>
      ) : list.length === 0 ? (
        <Card><CardContent className="py-8 text-center text-gray-500">{t("pages.adminSeoAutopilot.noQcRunsYetRun")}</CardContent></Card>
      ) : (
        <div className="space-y-2">
          {list.map((r: any) => (
            <Card key={r.id} data-testid={`qc-card-${r.id}`}>
              <CardContent className="py-3">
                <div className="flex items-center gap-3">
                  {r.passed ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  )}
                  <Badge variant="outline" className="text-xs">{r.scope}</Badge>
                  <span className="text-sm text-gray-600 flex-1">
                    {r.passed ? "Passed" : `Failed (${(r.errors || []).length} issue${(r.errors || []).length !== 1 ? "s" : ""})`}
                  </span>
                  <span className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                {!r.passed && (r.errors || []).length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {(r.errors as string[]).map((err: string, i: number) => (
                      <li key={i} className="text-xs text-red-600 flex items-start gap-1">
                        <span className="mt-0.5">-</span> {err}
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function PageTemplatesTab() {
  const { t } = useI18n();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newKey, setNewKey] = useState("");
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState("comparison");
  const [newMetaTitle, setNewMetaTitle] = useState("{keyword} | NurseNest");
  const [newMetaDesc, setNewMetaDesc] = useState("Learn about {keyword} with our comprehensive guide.");

  const { data: templates, isLoading } = useQuery({
    queryKey: ["/api/admin/seo-engine/page-templates"],
    queryFn: () => adminFetch("/api/admin/seo-engine/page-templates").then(r => r.json()),
  });

  const createMutation = useMutation({
    mutationFn: () => adminFetch("/api/admin/seo-engine/page-templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ templateKey: newKey, name: newName, pageType: newType, metaTitlePattern: newMetaTitle, metaDescriptionPattern: newMetaDesc }),
    }).then(r => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/seo-engine/page-templates"] });
      setNewKey(""); setNewName("");
    },
  });

  const seedMutation = useMutation({
    mutationFn: () => adminJson("/api/admin/seo-engine/seed-page-templates", { method: "POST" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/admin/seo-engine/page-templates"] }),
    onError: (err) => {
      const description =
        err instanceof ApiError ? getAdminOpsMessageForCode(err.code, err.message) : (err as Error).message;
      toast({ title: "Seed failed", description, variant: "destructive" });
    },
  });

  const list = Array.isArray(templates) ? templates : [];
  const PAGE_TYPES = ["comparison", "how-to", "listicle", "faq", "exam-prep", "study-guide"];

  return (
    <div className="space-y-6" data-testid="tab-page-templates">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-[#2E3A59]">SEO Page Templates ({list.length})</h3>
        <Button size="sm" variant="outline" onClick={() => seedMutation.mutate()} disabled={seedMutation.isPending} data-testid="button-seed-templates">
          {seedMutation.isPending ? <Loader2 className="animate-spin w-4 h-4 mr-1" /> : <Plus className="w-4 h-4 mr-1" />}
          Seed Default Templates
        </Button>
      </div>

      <Card data-testid="card-create-page-template">
        <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Plus className="w-4 h-4" /> {t("pages.adminSeoAutopilot.createPageTemplate")}</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="grid md:grid-cols-3 gap-3">
            <Input placeholder={t("pages.adminSeoAutopilot.templateKeyEgComparison")} value={newKey} onChange={e => setNewKey(e.target.value)} data-testid="input-pt-key" />
            <Input placeholder={t("pages.adminSeoAutopilot.displayName2")} value={newName} onChange={e => setNewName(e.target.value)} data-testid="input-pt-name" />
            <Select value={newType} onValueChange={setNewType}>
              <SelectTrigger data-testid="select-pt-type"><SelectValue /></SelectTrigger>
              <SelectContent>
                {PAGE_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Input placeholder="Meta title pattern (use {keyword})" value={newMetaTitle} onChange={e => setNewMetaTitle(e.target.value)} data-testid="input-pt-meta-title" />
          <Input placeholder="Meta description pattern (use {keyword})" value={newMetaDesc} onChange={e => setNewMetaDesc(e.target.value)} data-testid="input-pt-meta-desc" />
          <Button onClick={() => createMutation.mutate()} disabled={!newKey || !newName || createMutation.isPending} className="bg-[#BFA6F6] hover:bg-[#A88DE0] text-white" data-testid="button-create-pt">
            {createMutation.isPending ? <Loader2 className="animate-spin w-4 h-4" /> : "Save Template"}
          </Button>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex items-center gap-2 py-4"><Loader2 className="animate-spin" /> {t("pages.adminSeoAutopilot.loading7")}</div>
      ) : list.length === 0 ? (
        <Card><CardContent className="py-8 text-center text-gray-500">{t("pages.adminSeoAutopilot.noPageTemplatesYetClick")}</CardContent></Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {list.map((t: any) => (
            <Card key={t.id} data-testid={`pt-card-${t.id}`}>
              <CardContent className="py-4">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-sm text-[#2E3A59]">{t.name}</h4>
                  <Badge variant="outline" className="text-xs">{t.pageType}</Badge>
                  <Badge className="text-xs bg-blue-50 text-blue-700">{t.schemaMarkupType}</Badge>
                </div>
                <p className="text-xs text-gray-500 mb-1">Key: {t.templateKey}</p>
                <p className="text-xs text-gray-400 truncate">Title: {t.metaTitlePattern}</p>
                <p className="text-xs text-gray-400 truncate">Desc: {t.metaDescriptionPattern}</p>
                {t.sectionStructure && Array.isArray(t.sectionStructure) && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {t.sectionStructure.map((s: any, i: number) => (
                      <Badge key={i} variant="outline" className="text-[10px]">{s.type}</Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function BlogTemplatesTab() {
  const { t } = useI18n();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newKey, setNewKey] = useState("");
  const [newName, setNewName] = useState("");
  const [newLayout, setNewLayout] = useState("clinical-deep-dive");

  const { data: templates, isLoading } = useQuery({
    queryKey: ["/api/admin/seo-engine/blog-templates"],
    queryFn: () => adminFetch("/api/admin/seo-engine/blog-templates").then(r => r.json()),
  });

  const createMutation = useMutation({
    mutationFn: () => adminFetch("/api/admin/seo-engine/blog-templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ templateKey: newKey, name: newName, layoutType: newLayout }),
    }).then(r => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/seo-engine/blog-templates"] });
      setNewKey(""); setNewName("");
    },
  });

  const seedMutation = useMutation({
    mutationFn: () => adminJson("/api/admin/seo-engine/seed-blog-templates", { method: "POST" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/admin/seo-engine/blog-templates"] }),
    onError: (err) => {
      const description =
        err instanceof ApiError ? getAdminOpsMessageForCode(err.code, err.message) : (err as Error).message;
      toast({ title: "Seed failed", description, variant: "destructive" });
    },
  });

  const list = Array.isArray(templates) ? templates : [];
  const LAYOUT_TYPES = ["clinical-deep-dive", "exam-tip", "quick-reference", "news-roundup"];

  return (
    <div className="space-y-6" data-testid="tab-blog-templates">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-[#2E3A59]">Blog Post Templates ({list.length})</h3>
        <Button size="sm" variant="outline" onClick={() => seedMutation.mutate()} disabled={seedMutation.isPending} data-testid="button-seed-blog-templates">
          {seedMutation.isPending ? <Loader2 className="animate-spin w-4 h-4 mr-1" /> : <Plus className="w-4 h-4 mr-1" />}
          Seed Default Templates
        </Button>
      </div>

      <Card data-testid="card-create-blog-template">
        <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Plus className="w-4 h-4" /> {t("pages.adminSeoAutopilot.createBlogTemplate")}</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="grid md:grid-cols-3 gap-3">
            <Input placeholder={t("pages.adminSeoAutopilot.templateKey")} value={newKey} onChange={e => setNewKey(e.target.value)} data-testid="input-bt-key" />
            <Input placeholder={t("pages.adminSeoAutopilot.displayName3")} value={newName} onChange={e => setNewName(e.target.value)} data-testid="input-bt-name" />
            <Select value={newLayout} onValueChange={setNewLayout}>
              <SelectTrigger data-testid="select-bt-layout"><SelectValue /></SelectTrigger>
              <SelectContent>
                {LAYOUT_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => createMutation.mutate()} disabled={!newKey || !newName || createMutation.isPending} className="bg-[#BFA6F6] hover:bg-[#A88DE0] text-white" data-testid="button-create-bt">
            {createMutation.isPending ? <Loader2 className="animate-spin w-4 h-4" /> : "Save Template"}
          </Button>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex items-center gap-2 py-4"><Loader2 className="animate-spin" /> {t("pages.adminSeoAutopilot.loading8")}</div>
      ) : list.length === 0 ? (
        <Card><CardContent className="py-8 text-center text-gray-500">{t("pages.adminSeoAutopilot.noBlogTemplatesYetClick")}</CardContent></Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {list.map((t: any) => (
            <Card key={t.id} data-testid={`bt-card-${t.id}`}>
              <CardContent className="py-4">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-sm text-[#2E3A59]">{t.name}</h4>
                  <Badge variant="outline" className="text-xs">{t.layoutType}</Badge>
                </div>
                <p className="text-xs text-gray-500 mb-1">Key: {t.templateKey}</p>
                <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                  <span>{t.tocEnabled ? "TOC" : "No TOC"}</span>
                  <span>{t.faqEnabled ? "FAQ" : "No FAQ"}</span>
                  <span>{t.relatedPostsEnabled ? "Related Posts" : "No Related"}</span>
                </div>
                {t.contentBlocks && Array.isArray(t.contentBlocks) && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {t.contentBlocks.map((b: any, i: number) => (
                      <Badge key={i} variant="outline" className="text-[10px]">{b.type}</Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function BulkGenerationTab({ siteContext, careerTrack }: { siteContext: string; careerTrack: string | null }) {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const [keywordsText, setKeywordsText] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [generateContent, setGenerateContent] = useState(true);
  const [bulkResult, setBulkResult] = useState<any>(null);

  const { data: pageTemplates } = useQuery({
    queryKey: ["/api/admin/seo-engine/page-templates"],
    queryFn: () => adminFetch("/api/admin/seo-engine/page-templates").then(r => r.json()),
  });

  const bulkMutation = useMutation({
    mutationFn: () => {
      const keywords = keywordsText
        .split(/[\n,]/)
        .map(k => k.trim())
        .filter(k => k.length > 0);

      return adminFetch("/api/admin/seo-engine/bulk-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keywords, templateKey: selectedTemplate === "none" ? null : selectedTemplate || null, siteContext, careerTrack, generateContent }),
      }).then(r => r.json());
    },
    onSuccess: (data) => {
      setBulkResult(data);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/seo-engine/articles"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/seo-engine/clusters"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/seo-engine/pipeline-stats"] });
    },
  });

  const templateList = Array.isArray(pageTemplates) ? pageTemplates : [];
  const parsedKeywords = keywordsText.split(/[\n,]/).map(k => k.trim()).filter(k => k.length > 0);

  return (
    <div className="space-y-6" data-testid="tab-bulk-generation">
      <h3 className="font-semibold text-[#2E3A59]">{t("pages.adminSeoAutopilot.bulkKeywordtopageGenerator")}</h3>

      <Card data-testid="card-bulk-input">
        <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Upload className="w-4 h-4" /> {t("pages.adminSeoAutopilot.enterKeywords")}</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs text-gray-500">{t("pages.adminSeoAutopilot.pasteKeywordsSeparatedByCommas")}</p>
          <Textarea
            placeholder={t("pages.adminSeoAutopilot.enterKeywordsOnePerLine")}
            value={keywordsText}
            onChange={e => setKeywordsText(e.target.value)}
            rows={8}
            data-testid="input-bulk-keywords"
          />
          <div className="flex items-center gap-3 flex-wrap">
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
              <SelectTrigger className="w-64" data-testid="select-bulk-template">
                <SelectValue placeholder={t("pages.adminSeoAutopilot.selectTemplateOptional")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">{t("pages.adminSeoAutopilot.noTemplate")}</SelectItem>
                {templateList.map((t: any) => (
                  <SelectItem key={t.templateKey} value={t.templateKey}>{t.name} ({t.pageType})</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <label className="flex items-center gap-2 text-sm cursor-pointer" data-testid="label-generate-content">
              <input type="checkbox" checked={generateContent} onChange={e => setGenerateContent(e.target.checked)} className="rounded" data-testid="checkbox-generate-content" />
              <span className="text-gray-700">{t("pages.adminSeoAutopilot.generateAiContent")}</span>
            </label>
            <div className="flex-1 text-sm text-gray-500">
              {parsedKeywords.length > 0 && <span>{parsedKeywords.length} keyword{parsedKeywords.length !== 1 ? "s" : ""} detected</span>}
            </div>
            <Button
              onClick={() => bulkMutation.mutate()}
              disabled={parsedKeywords.length === 0 || bulkMutation.isPending}
              className="bg-[#BFA6F6] hover:bg-[#A88DE0] text-white"
              data-testid="button-bulk-generate"
            >
              {bulkMutation.isPending ? (
                <><Loader2 className="animate-spin w-4 h-4 mr-2" /> {t("pages.adminSeoAutopilot.generating3")}</>
              ) : (
                <><Play className="w-4 h-4 mr-2" /> Generate {parsedKeywords.length} Page{parsedKeywords.length !== 1 ? "s" : ""}</>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {bulkResult && (
        <Card data-testid="card-bulk-result">
          <CardHeader>
            <CardTitle className="text-sm">{t("pages.adminSeoAutopilot.generationResults")}</CardTitle>
            {bulkResult.generating && (
              <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                <Loader2 className="animate-spin w-3 h-3" /> AI content generation is running in the background. Check the Pipeline tab for progress.
              </p>
            )}
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{bulkResult.created}</div>
                <div className="text-xs text-gray-500">{t("pages.adminSeoAutopilot.created")}</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{bulkResult.skipped}</div>
                <div className="text-xs text-gray-500">{t("pages.adminSeoAutopilot.skipped")}</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{bulkResult.failed}</div>
                <div className="text-xs text-gray-500">{t("pages.adminSeoAutopilot.failed3")}</div>
              </div>
            </div>
            {bulkResult.results && (
              <div className="max-h-60 overflow-y-auto space-y-1">
                {bulkResult.results.map((r: any, i: number) => (
                  <div key={i} className="flex items-center gap-2 text-sm p-2 rounded bg-gray-50">
                    {r.status === "created" ? <CheckCircle2 className="w-4 h-4 text-green-500" /> :
                     r.status === "skipped" ? <Clock className="w-4 h-4 text-yellow-500" /> :
                     <AlertTriangle className="w-4 h-4 text-red-500" />}
                    <span className="flex-1 truncate">{r.keyword}</span>
                    <Badge className={`text-xs ${r.status === "created" ? "bg-green-100 text-green-700" : r.status === "skipped" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                      {r.status}
                    </Badge>
                    {r.error && <span className="text-xs text-red-500">{r.error}</span>}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ContentPipelineTab({ siteContext, careerTrack }: { siteContext: string; careerTrack: string | null }) {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { data: pipelineData, isLoading } = useQuery({
    queryKey: ["/api/admin/seo-engine/pipeline-stats", siteContext, careerTrack],
    queryFn: () => adminFetch(`/api/admin/seo-engine/pipeline-stats?siteContext=${siteContext}${careerTrack ? `&careerTrack=${careerTrack}` : ""}`).then(r => r.json()),
    refetchInterval: 15000,
  });

  const bulkStatusMutation = useMutation({
    mutationFn: ({ articleIds, status }: { articleIds: string[]; status: string }) =>
      adminFetch("/api/admin/seo-engine/bulk-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleIds, status }),
      }).then(r => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/seo-engine/pipeline-stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/seo-engine/articles"] });
      setSelectedIds([]);
    },
  });

  const recomputeLinksMutation = useMutation({
    mutationFn: () => adminFetch("/api/admin/seo-engine/recompute-links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ siteContext }),
    }).then(r => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/seo-engine/internal-links"] });
    },
  });

  if (isLoading) return <div className="flex items-center gap-2 py-8"><Loader2 className="animate-spin" /> {t("pages.adminSeoAutopilot.loadingPipeline")}</div>;

  const p = pipelineData?.pipeline || {};
  const articles = pipelineData?.recentArticles || [];

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const selectAllDrafts = () => {
    const draftIds = articles.filter((a: any) => a.status === "draft").map((a: any) => a.id);
    setSelectedIds(draftIds);
  };

  return (
    <div className="space-y-6" data-testid="tab-content-pipeline">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-[#2E3A59]">{t("pages.adminSeoAutopilot.contentPipeline")}</h3>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => recomputeLinksMutation.mutate()} disabled={recomputeLinksMutation.isPending} data-testid="button-recompute-links">
            {recomputeLinksMutation.isPending ? <Loader2 className="animate-spin w-4 h-4 mr-1" /> : <RefreshCw className="w-4 h-4 mr-1" />}
            Recompute Links
          </Button>
        </div>
      </div>

      {recomputeLinksMutation.isSuccess && recomputeLinksMutation.data && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800" data-testid="notice-links-result">
          Links recomputed: {(recomputeLinksMutation.data as any).linksCreated} new links from {(recomputeLinksMutation.data as any).articlesProcessed} articles
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        {[
          { label: "Drafts", value: p.drafts || 0, color: "bg-gray-100 text-gray-700", icon: "bg-gray-300" },
          { label: "Generating", value: p.generating || 0, color: "bg-blue-50 text-blue-700", icon: "bg-blue-400" },
          { label: "QC Review", value: p.needs_review || 0, color: "bg-orange-50 text-orange-700", icon: "bg-orange-400" },
          { label: "Queued", value: p.queued || 0, color: "bg-purple-50 text-purple-700", icon: "bg-purple-400" },
          { label: "Published", value: p.published || 0, color: "bg-green-50 text-green-700", icon: "bg-green-400" },
          { label: "Failed", value: p.failed || 0, color: "bg-red-50 text-red-700", icon: "bg-red-400" },
        ].map(stage => (
          <Card key={stage.label} className={stage.color} data-testid={`pipeline-stage-${stage.label.toLowerCase()}`}>
            <CardContent className="py-3 text-center">
              <div className={`w-3 h-3 rounded-full ${stage.icon} mx-auto mb-1`} />
              <div className="text-2xl font-bold">{stage.value}</div>
              <div className="text-xs font-medium">{stage.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>{t("pages.adminSeoAutopilot.pipelineFlow")} <ArrowRight className="w-3 h-3 inline" /> {t("pages.adminSeoAutopilot.generating")} <ArrowRight className="w-3 h-3 inline" /> {t("pages.adminSeoAutopilot.qcReview")} <ArrowRight className="w-3 h-3 inline" /> {t("pages.adminSeoAutopilot.queued")} <ArrowRight className="w-3 h-3 inline" /> {t("pages.adminSeoAutopilot.published4")}</span>
      </div>

      <Card>
        <CardContent className="py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-xl font-bold text-[#2E3A59]">{p.total || 0}</div>
              <div className="text-xs text-gray-500">{t("pages.adminSeoAutopilot.totalArticles")}</div>
            </div>
            <div>
              <div className="text-xl font-bold text-[#AEE3E1]">{(p.total_words || 0).toLocaleString()}</div>
              <div className="text-xs text-gray-500">{t("pages.adminSeoAutopilot.totalWords2")}</div>
            </div>
            <div>
              <div className="text-xl font-bold text-green-600">{p.published_this_week || 0}</div>
              <div className="text-xs text-gray-500">{t("pages.adminSeoAutopilot.publishedThisWeek")}</div>
            </div>
            <div>
              <div className="text-xl font-bold text-blue-600">{p.created_this_week || 0}</div>
              <div className="text-xs text-gray-500">{t("pages.adminSeoAutopilot.createdThisWeek")}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="py-4">
          <div className="flex items-center gap-3 text-sm mb-3">
            <span className="text-gray-600">Page Templates: <strong>{pipelineData?.pageTemplates || 0}</strong></span>
            <span className="text-gray-400">|</span>
            <span className="text-gray-600">Blog Templates: <strong>{pipelineData?.blogTemplates || 0}</strong></span>
            <span className="text-gray-400">|</span>
            <span className="text-gray-600">Internal Links: <strong>{pipelineData?.internalLinksCount || 0}</strong></span>
          </div>
        </CardContent>
      </Card>

      {selectedIds.length > 0 && (
        <Card className="border-[#BFA6F6]" data-testid="card-bulk-actions">
          <CardContent className="py-3">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">{selectedIds.length} selected</span>
              <Button size="sm" onClick={() => bulkStatusMutation.mutate({ articleIds: selectedIds, status: "published" })} className="bg-green-500 hover:bg-green-600 text-white" data-testid="button-bulk-publish">
                Publish Selected
              </Button>
              <Button size="sm" variant="outline" onClick={() => bulkStatusMutation.mutate({ articleIds: selectedIds, status: "needs_review" })} data-testid="button-bulk-review">
                Mark for Review
              </Button>
              <Button size="sm" variant="outline" onClick={() => bulkStatusMutation.mutate({ articleIds: selectedIds, status: "queued" })} data-testid="button-bulk-queue">
                Queue for Publishing
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setSelectedIds([])} data-testid="button-clear-selection">
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">{t("pages.adminSeoAutopilot.recentArticles")}</CardTitle>
            <Button size="sm" variant="ghost" onClick={selectAllDrafts} data-testid="button-select-all-drafts">
              Select All Drafts
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {articles.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">{t("pages.adminSeoAutopilot.noArticlesInPipelineYet")}</p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {articles.map((a: any) => (
                <div key={a.id} className={`flex items-center gap-2 text-sm p-2 rounded cursor-pointer ${selectedIds.includes(a.id) ? "bg-[#BFA6F6]/10 border border-[#BFA6F6]" : "bg-gray-50 hover:bg-gray-100"}`} onClick={() => toggleSelect(a.id)} data-testid={`pipeline-article-${a.id}`}>
                  <input type="checkbox" checked={selectedIds.includes(a.id)} onChange={() => toggleSelect(a.id)} className="rounded" data-testid={`checkbox-article-${a.id}`} />
                  <span className="flex-1 truncate font-medium">{a.title}</span>
                  <StatusBadge status={a.status} />
                  <span className="text-xs text-gray-400">{a.wordCount || 0} words</span>
                  {a.careerTrack && <Badge variant="outline" className="text-[10px]">{a.careerTrack}</Badge>}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function SettingsTab() {
  const { t } = useI18n();
  return (
    <div className="space-y-6" data-testid="tab-settings">
      <Card>
        <CardHeader><CardTitle className="text-sm">{t("pages.adminSeoAutopilot.brandPaletteLocked")}</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {[
              { name: "Primary Lavender", hex: "#BFA6F6" },
              { name: "Soft Teal", hex: "#AEE3E1" },
              { name: "Peach Accent", hex: "#FFD6A5" },
              { name: "Highlight Yellow", hex: "#FFF3B0" },
              { name: "Text Dark Slate", hex: "#2E3A59" },
              { name: "Divider Grey", hex: "#E5E7EB" },
            ].map(c => (
              <div key={c.hex} className="text-center">
                <div className="w-full h-12 rounded-lg border" style={{ backgroundColor: c.hex }} />
                <p className="text-xs font-medium mt-1">{c.name}</p>
                <p className="text-xs text-gray-400">{c.hex}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-sm">{t("pages.adminSeoAutopilot.contentStandards")}</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm text-gray-600">
          <p><strong>{t("pages.adminSeoAutopilot.supportArticles")}</strong> {t("pages.adminSeoAutopilot.minimum1200Words")}</p>
          <p><strong>{t("pages.adminSeoAutopilot.pillarArticles")}</strong> {t("pages.adminSeoAutopilot.minimum2500Words")}</p>
          <p><strong>{t("pages.adminSeoAutopilot.infographicSize")}</strong> {t("pages.adminSeoAutopilot.3000X2000Px")}</p>
          <p><strong>{t("pages.adminSeoAutopilot.pinterestPinSize")}</strong> {t("pages.adminSeoAutopilot.1000X1500Px")}</p>
          <p><strong>{t("pages.adminSeoAutopilot.watermark")}</strong> NurseNest.ca (always)</p>
          <p><strong>{t("pages.adminSeoAutopilot.alliedHealthDisclaimer")}</strong> {t("pages.adminSeoAutopilot.educationalContentOnlyFollowLocal")}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-sm">{t("pages.adminSeoAutopilot.urlStructure")}</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm text-gray-600">
          <p><strong>{t("pages.adminSeoAutopilot.nursingArticles")}</strong> nursenest.ca/blog/&#123;slug&#125;</p>
          <p><strong>{t("pages.adminSeoAutopilot.alliedArticles")}</strong> allied.nursenest.ca/&#123;career&#125;/&#123;slug&#125;</p>
          <p><strong>{t("pages.adminSeoAutopilot.nursingSitemap")}</strong> /sitemap.xml</p>
          <p><strong>{t("pages.adminSeoAutopilot.alliedSitemap")}</strong> /sitemap-allied.xml</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminSeoAutopilot() {
  const { t } = useI18n();
  const [siteContext, setSiteContext] = useState("nursing");
  const [careerTrack, setCareerTrack] = useState<string | null>(null);

  const { data: careerTracks } = useQuery({
    queryKey: ["/api/admin/seo-engine/career-tracks"],
    queryFn: () => adminFetch("/api/admin/seo-engine/career-tracks").then(r => r.json()),
  });

  const tracks = Array.isArray(careerTracks) ? careerTracks : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <h1 className="text-2xl font-bold text-[#2E3A59]" data-testid="page-title">
              SEO + Visual Traffic Engine
            </h1>
            <p className="text-sm text-gray-500">{t("pages.adminSeoAutopilot.manageContentClustersInfographicsPins")}</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={siteContext} onValueChange={v => { setSiteContext(v); if (v === "nursing") setCareerTrack(null); }}>
              <SelectTrigger className="w-36" data-testid="select-site-context">
                <Globe className="w-4 h-4 mr-1" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nursing">{t("pages.adminSeoAutopilot.nursing")}</SelectItem>
                <SelectItem value="allied">{t("pages.adminSeoAutopilot.alliedHealth")}</SelectItem>
              </SelectContent>
            </Select>
            {siteContext === "allied" && (
              <Select value={careerTrack || ""} onValueChange={v => setCareerTrack(v || null)}>
                <SelectTrigger className="w-52" data-testid="select-career-track">
                  <SelectValue placeholder={t("pages.adminSeoAutopilot.selectCareerTrack")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{t("pages.adminSeoAutopilot.allCareers")}</SelectItem>
                  {tracks.map((track: any) => (
                    <SelectItem key={track.slug} value={track.slug}>{track.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="flex flex-wrap gap-1 bg-white border rounded-lg p-1 h-auto">
            <TabsTrigger value="overview" className="gap-1.5 text-xs" data-testid="tab-trigger-overview"><LayoutDashboard className="w-3.5 h-3.5" /> {t("pages.adminSeoAutopilot.overview")}</TabsTrigger>
            <TabsTrigger value="pipeline" className="gap-1.5 text-xs" data-testid="tab-trigger-pipeline"><Workflow className="w-3.5 h-3.5" /> {t("pages.adminSeoAutopilot.pipeline")}</TabsTrigger>
            <TabsTrigger value="bulk" className="gap-1.5 text-xs" data-testid="tab-trigger-bulk"><Upload className="w-3.5 h-3.5" /> {t("pages.adminSeoAutopilot.bulkGenerate")}</TabsTrigger>
            <TabsTrigger value="clusters" className="gap-1.5 text-xs" data-testid="tab-trigger-clusters"><Layers className="w-3.5 h-3.5" /> {t("pages.adminSeoAutopilot.clusters")}</TabsTrigger>
            <TabsTrigger value="articles" className="gap-1.5 text-xs" data-testid="tab-trigger-articles"><FileText className="w-3.5 h-3.5" /> {t("pages.adminSeoAutopilot.articles2")}</TabsTrigger>
            <TabsTrigger value="page-templates" className="gap-1.5 text-xs" data-testid="tab-trigger-page-templates"><BookTemplate className="w-3.5 h-3.5" /> {t("pages.adminSeoAutopilot.pageTemplates")}</TabsTrigger>
            <TabsTrigger value="blog-templates" className="gap-1.5 text-xs" data-testid="tab-trigger-blog-templates"><BookTemplate className="w-3.5 h-3.5" /> {t("pages.adminSeoAutopilot.blogTemplates")}</TabsTrigger>
            <TabsTrigger value="infographics" className="gap-1.5 text-xs" data-testid="tab-trigger-infographics"><Image className="w-3.5 h-3.5" /> {t("pages.adminSeoAutopilot.infographics2")}</TabsTrigger>
            <TabsTrigger value="templates" className="gap-1.5 text-xs" data-testid="tab-trigger-templates"><Search className="w-3.5 h-3.5" /> {t("pages.adminSeoAutopilot.infographicTemplates")}</TabsTrigger>
            <TabsTrigger value="pins" className="gap-1.5 text-xs" data-testid="tab-trigger-pins"><PinIcon className="w-3.5 h-3.5" /> {t("pages.adminSeoAutopilot.pins")}</TabsTrigger>
            <TabsTrigger value="links" className="gap-1.5 text-xs" data-testid="tab-trigger-links"><Link2 className="w-3.5 h-3.5" /> {t("pages.adminSeoAutopilot.links")}</TabsTrigger>
            <TabsTrigger value="queue" className="gap-1.5 text-xs" data-testid="tab-trigger-queue"><Send className="w-3.5 h-3.5" /> {t("pages.adminSeoAutopilot.publishQueue")}</TabsTrigger>
            <TabsTrigger value="qc" className="gap-1.5 text-xs" data-testid="tab-trigger-qc"><ShieldCheck className="w-3.5 h-3.5" /> QC</TabsTrigger>
            <TabsTrigger value="settings" className="gap-1.5 text-xs" data-testid="tab-trigger-settings"><Settings className="w-3.5 h-3.5" /> {t("pages.adminSeoAutopilot.settings")}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview"><OverviewTab siteContext={siteContext} careerTrack={careerTrack} /></TabsContent>
          <TabsContent value="pipeline"><ContentPipelineTab siteContext={siteContext} careerTrack={careerTrack} /></TabsContent>
          <TabsContent value="bulk"><BulkGenerationTab siteContext={siteContext} careerTrack={careerTrack} /></TabsContent>
          <TabsContent value="clusters"><ClustersTab siteContext={siteContext} careerTrack={careerTrack} /></TabsContent>
          <TabsContent value="articles"><ArticlesTab siteContext={siteContext} careerTrack={careerTrack} /></TabsContent>
          <TabsContent value="page-templates"><PageTemplatesTab /></TabsContent>
          <TabsContent value="blog-templates"><BlogTemplatesTab /></TabsContent>
          <TabsContent value="infographics"><InfographicsTab siteContext={siteContext} careerTrack={careerTrack} /></TabsContent>
          <TabsContent value="templates"><TemplatesTab siteContext={siteContext} careerTrack={careerTrack} /></TabsContent>
          <TabsContent value="pins"><PinsTab siteContext={siteContext} careerTrack={careerTrack} /></TabsContent>
          <TabsContent value="links"><InternalLinksTab siteContext={siteContext} careerTrack={careerTrack} /></TabsContent>
          <TabsContent value="queue"><PublishQueueTab siteContext={siteContext} careerTrack={careerTrack} /></TabsContent>
          <TabsContent value="qc"><QcTab siteContext={siteContext} careerTrack={careerTrack} /></TabsContent>
          <TabsContent value="settings"><SettingsTab /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
