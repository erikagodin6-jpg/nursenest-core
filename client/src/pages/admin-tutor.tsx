import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminFetch } from "@/lib/admin-fetch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/lib/i18n";
import {
  MessageSquare, Shield, Settings, BarChart3, Eye, Save,
  Loader2, AlertTriangle, CheckCircle, XCircle, Flag,
  TrendingUp, Users, Zap, BookOpen, Trophy, Clock, Target,
  ChevronDown, ChevronUp,
} from "lucide-react";

const SAFETY_CATEGORIES = [
  { key: "explicit_content", label: "Explicit Content", description: "Block sexually explicit or graphic content" },
  { key: "violence", label: "Violence", description: "Block violent or harmful content" },
  { key: "political_opinions", label: "Political Opinions", description: "Block political commentary and opinions" },
  { key: "medical_diagnosis", label: "Medical Diagnosis", description: "Block attempts to provide clinical diagnoses" },
  { key: "prescription_advice", label: "Prescription Advice", description: "Block specific medication recommendations" },
  { key: "legal_advice", label: "Legal Advice", description: "Block legal guidance and recommendations" },
  { key: "self_harm", label: "Self-Harm", description: "Block self-harm or suicide-related content" },
  { key: "exam_cheating", label: "Exam Cheating", description: "Block requests for actual exam answers" },
];

function TutorConfigPanel() {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const { data: config, isLoading } = useQuery({
    queryKey: ["/api/admin/tutor/config"],
    queryFn: () => adminFetch("/api/admin/tutor/config").then(r => r.json()),
  });

  const [systemPrompt, setSystemPrompt] = useState<string | null>(null);
  const [blockedTopics, setBlockedTopics] = useState<string[] | null>(null);
  const [dailyFreeLimit, setDailyFreeLimit] = useState<number | null>(null);

  const effectivePrompt = systemPrompt ?? config?.systemPrompt ?? "";
  const effectiveBlocked = blockedTopics ?? config?.blockedTopics ?? [];
  const effectiveLimit = dailyFreeLimit ?? config?.dailyFreeLimit ?? 10;

  const saveMutation = useMutation({
    mutationFn: (data: any) => adminFetch("/api/admin/tutor/config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/tutor/config"] });
      setSystemPrompt(null);
      setBlockedTopics(null);
      setDailyFreeLimit(null);
    },
  });

  const hasChanges = systemPrompt !== null || blockedTopics !== null || dailyFreeLimit !== null;

  if (isLoading) return <div className="flex items-center gap-2 py-4"><Loader2 className="animate-spin w-4 h-4" /> {t("pages.adminTutor.loadingConfig")}</div>;

  function toggleTopic(key: string) {
    const current = blockedTopics ?? config?.blockedTopics ?? [];
    if (current.includes(key)) {
      setBlockedTopics(current.filter((t: string) => t !== key));
    } else {
      setBlockedTopics([...current, key]);
    }
  }

  return (
    <div className="space-y-6">
      <Card data-testid="card-tutor-system-prompt">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Settings className="w-4 h-4 text-blue-600" />
            System Prompt Template
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={effectivePrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            rows={6}
            className="font-mono text-sm"
            placeholder={t("pages.adminTutor.enterTheTutorSystemPrompt")}
            data-testid="input-system-prompt"
          />
          <p className="text-xs text-gray-500 mt-2">{t("pages.adminTutor.thisPromptIsSentAs")}</p>
        </CardContent>
      </Card>

      <Card data-testid="card-tutor-safety-filters">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Shield className="w-4 h-4 text-red-600" />
            Safety Filter Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {SAFETY_CATEGORIES.map((cat) => (
              <div key={cat.key} className="flex items-center justify-between py-2 border-b last:border-0" data-testid={`toggle-safety-${cat.key}`}>
                <div>
                  <div className="text-sm font-medium">{cat.label}</div>
                  <div className="text-xs text-gray-500">{cat.description}</div>
                </div>
                <Switch
                  checked={effectiveBlocked.includes(cat.key)}
                  onCheckedChange={() => toggleTopic(cat.key)}
                  data-testid={`switch-safety-${cat.key}`}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card data-testid="card-tutor-daily-limit">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600" />
            Daily Free-Tier Limit
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Input
              type="number"
              min={1}
              max={100}
              value={effectiveLimit}
              onChange={(e) => setDailyFreeLimit(parseInt(e.target.value) || 1)}
              className="w-32"
              data-testid="input-daily-free-limit"
            />
            <span className="text-sm text-gray-600">{t("pages.adminTutor.questionsPerDayForFreetier")}</span>
          </div>
        </CardContent>
      </Card>

      {hasChanges && (
        <div className="flex gap-2">
          <Button
            onClick={() => saveMutation.mutate({
              systemPrompt: effectivePrompt,
              blockedTopics: effectiveBlocked,
              dailyFreeLimit: effectiveLimit,
            })}
            disabled={saveMutation.isPending}
            data-testid="button-save-tutor-config"
          >
            {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Save className="w-4 h-4 mr-1" />}
            Save Configuration
          </Button>
          <Button variant="outline" onClick={() => { setSystemPrompt(null); setBlockedTopics(null); setDailyFreeLimit(null); }} data-testid="button-discard-changes">
            Discard
          </Button>
        </div>
      )}

      {saveMutation.isSuccess && (
        <div className="flex items-center gap-2 text-green-600 text-sm" data-testid="text-save-success">
          <CheckCircle className="w-4 h-4" /> Configuration saved successfully
        </div>
      )}
    </div>
  );
}

function TutorAnalyticsPanel() {
  const [days, setDays] = useState(30);
  const { data: analytics, isLoading } = useQuery({
    queryKey: ["/api/admin/tutor/analytics", days],
    queryFn: () => adminFetch(`/api/admin/tutor/analytics?days=${days}`).then(r => r.json()),
    refetchInterval: 60000,
  });

  if (isLoading) return <div className="flex items-center gap-2 py-4"><Loader2 className="animate-spin w-4 h-4" /> {t("pages.adminTutor.loadingAnalytics")}</div>;
  if (!analytics) return null;

  const maxTopicCount = Math.max(1, ...(analytics.topTopics || []).map((t: any) => t.count));
  const maxExplCount = Math.max(1, ...(analytics.explanationTypes || []).map((t: any) => t.count));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">{t("pages.adminTutor.usageOverview")}</h3>
        <div className="flex gap-1">
          {[7, 30, 90].map((d) => (
            <Button key={d} variant={days === d ? "default" : "outline"} size="sm" onClick={() => setDays(d)} data-testid={`button-period-${d}`}>
              {d}d
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card data-testid="stat-daily-questions">
          <CardContent className="py-3 text-center">
            <MessageSquare className="w-4 h-4 mx-auto text-blue-600 mb-1" />
            <div className="text-lg font-bold">{analytics.dailyQuestions}</div>
            <div className="text-xs text-gray-500">{t("pages.adminTutor.today")}</div>
          </CardContent>
        </Card>
        <Card data-testid="stat-weekly-questions">
          <CardContent className="py-3 text-center">
            <TrendingUp className="w-4 h-4 mx-auto text-green-600 mb-1" />
            <div className="text-lg font-bold">{analytics.weeklyQuestions}</div>
            <div className="text-xs text-gray-500">{t("pages.adminTutor.thisWeek")}</div>
          </CardContent>
        </Card>
        <Card data-testid="stat-monthly-questions">
          <CardContent className="py-3 text-center">
            <BarChart3 className="w-4 h-4 mx-auto text-purple-600 mb-1" />
            <div className="text-lg font-bold">{analytics.monthlyQuestions}</div>
            <div className="text-xs text-gray-500">{t("pages.adminTutor.thisMonth")}</div>
          </CardContent>
        </Card>
        <Card data-testid="stat-pending-reviews">
          <CardContent className="py-3 text-center">
            <AlertTriangle className="w-4 h-4 mx-auto text-red-500 mb-1" />
            <div className="text-lg font-bold">{analytics.pendingReviews}</div>
            <div className="text-xs text-gray-500">{t("pages.adminTutor.pendingReviews")}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card data-testid="card-top-topics">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              Most Discussed Topics
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(analytics.topTopics || []).length === 0 ? (
              <p className="text-xs text-gray-400 py-4 text-center">{t("pages.adminTutor.noTopicDataYet")}</p>
            ) : (
              <div className="space-y-2">
                {analytics.topTopics.slice(0, 10).map((topic: any, i: number) => (
                  <div key={topic.topic} className="flex items-center gap-2" data-testid={`row-topic-${i}`}>
                    <span className="text-xs text-gray-500 w-5">{i + 1}.</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-medium truncate">{topic.topic}</span>
                        <span className="text-xs text-gray-500">{topic.count}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${(topic.count / maxTopicCount) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card data-testid="card-explanation-types">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-600" />
              Explanation Types Requested
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(analytics.explanationTypes || []).length === 0 ? (
              <p className="text-xs text-gray-400 py-4 text-center">{t("pages.adminTutor.noExplanationTypeDataYet")}</p>
            ) : (
              <div className="space-y-2">
                {analytics.explanationTypes.map((type: any, i: number) => (
                  <div key={type.explanation_type} className="flex items-center gap-2" data-testid={`row-explanation-${i}`}>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-medium capitalize">{type.explanation_type}</span>
                        <span className="text-xs text-gray-500">{type.count}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${(type.count / maxExplCount) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card data-testid="card-tier-usage">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-600" />
            Usage by Tier
          </CardTitle>
        </CardHeader>
        <CardContent>
          {(analytics.tierUsage || []).length === 0 ? (
            <p className="text-xs text-gray-400 py-4 text-center">{t("pages.adminTutor.noTierUsageDataYet")}</p>
          ) : (
            <div className="flex gap-4 flex-wrap">
              {analytics.tierUsage.map((tier: any) => (
                <div key={tier.user_tier} className="bg-gray-50 rounded-lg px-4 py-3 text-center min-w-[100px]" data-testid={`stat-tier-${tier.user_tier}`}>
                  <div className="text-lg font-bold">{tier.count}</div>
                  <div className="text-xs text-gray-500 capitalize">{tier.user_tier || "unknown"}</div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {(analytics.dailyTrend || []).length > 0 && (
        <Card data-testid="card-daily-trend">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              Daily Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-1 h-32">
              {analytics.dailyTrend.slice(0, 30).reverse().map((day: any, i: number) => {
                const maxCount = Math.max(1, ...analytics.dailyTrend.map((d: any) => d.count));
                const height = Math.max(4, (day.count / maxCount) * 100);
                return (
                  <div key={day.day} className="flex-1 flex flex-col items-center justify-end" data-testid={`bar-trend-${i}`}>
                    <div
                      className="w-full bg-blue-400 rounded-t hover:bg-blue-600 transition-colors"
                      style={{ height: `${height}%` }}
                      title={`${new Date(day.day).toLocaleDateString()}: ${day.count} questions`}
                    />
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>{analytics.dailyTrend.length > 0 ? new Date(analytics.dailyTrend[analytics.dailyTrend.length - 1].day).toLocaleDateString() : ""}</span>
              <span>{t("pages.adminTutor.today2")}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ConversationReviewPanel() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<"all" | "flagged" | "unreviewed">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["/api/admin/tutor/conversations", filter],
    queryFn: () => adminFetch(`/api/admin/tutor/conversations?filter=${filter}&limit=50`).then(r => r.json()),
    refetchInterval: 30000,
  });

  const flagMutation = useMutation({
    mutationFn: ({ id, ...body }: any) => adminFetch(`/api/admin/tutor/conversations/${id}/flag`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/admin/tutor/conversations"] }),
  });

  if (isLoading) return <div className="flex items-center gap-2 py-4"><Loader2 className="animate-spin w-4 h-4" /> {t("pages.adminTutor.loadingConversations")}</div>;

  const conversations = data?.conversations || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Conversation Review ({data?.total || 0} total)</h3>
        <div className="flex gap-1">
          {(["all", "flagged", "unreviewed"] as const).map((f) => (
            <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)} data-testid={`button-filter-${f}`}>
              {f === "all" ? "All" : f === "flagged" ? "Flagged" : "Unreviewed"}
            </Button>
          ))}
        </div>
      </div>

      {conversations.length === 0 ? (
        <div className="text-center text-gray-400 py-8 text-sm" data-testid="text-no-conversations">
          No conversations found. Tutor conversations will appear here once students start using the AI tutor.
        </div>
      ) : (
        <div className="space-y-2">
          {conversations.map((conv: any) => (
            <Card key={conv.id} className={conv.flagged ? "border-red-200 bg-red-50/30" : ""} data-testid={`card-conversation-${conv.id}`}>
              <CardContent className="py-3 px-4">
                <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpandedId(expandedId === conv.id ? null : conv.id)}>
                  <div className="flex items-center gap-3">
                    {conv.flagged ? (
                      <Flag className="w-4 h-4 text-red-500" />
                    ) : (
                      <MessageSquare className="w-4 h-4 text-gray-400" />
                    )}
                    <div>
                      <div className="text-sm font-medium flex items-center gap-2">
                        {conv.username || "Anonymous"}
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 capitalize">{conv.userTier}</Badge>
                        {conv.topic && <Badge className="text-[10px] px-1.5 py-0 bg-blue-100 text-blue-700">{conv.topic}</Badge>}
                        {conv.explanationType && <Badge className="text-[10px] px-1.5 py-0 bg-amber-100 text-amber-700">{conv.explanationType}</Badge>}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(conv.createdAt).toLocaleString()} — {(conv.messages || []).length} messages
                        {conv.flagReason && <span className="text-red-500 ml-2">Flag: {conv.flagReason}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {conv.adminReviewed && <CheckCircle className="w-4 h-4 text-green-500" />}
                    {expandedId === conv.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>

                {expandedId === conv.id && (
                  <div className="mt-3 space-y-3">
                    <div className="bg-white border rounded-lg p-3 max-h-80 overflow-y-auto space-y-2">
                      {(conv.messages || []).length === 0 ? (
                        <p className="text-xs text-gray-400 text-center">{t("pages.adminTutor.noMessages")}</p>
                      ) : (
                        conv.messages.map((msg: any, i: number) => (
                          <div
                            key={i}
                            className={`text-sm rounded-lg p-2 ${msg.role === "user" ? "bg-blue-50 text-blue-900 ml-8" : "bg-gray-50 text-gray-800 mr-8"}`}
                            data-testid={`msg-${conv.id}-${i}`}
                          >
                            <div className="text-[10px] font-medium mb-0.5 uppercase text-gray-500">{msg.role}</div>
                            <div className="whitespace-pre-wrap text-xs">{msg.content}</div>
                          </div>
                        ))
                      )}
                    </div>

                    {conv.adminNotes && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 text-xs" data-testid={`notes-${conv.id}`}>
                        <span className="font-medium">{t("pages.adminTutor.adminNotes")}</span> {conv.adminNotes}
                      </div>
                    )}

                    <div className="flex gap-2">
                      {!conv.flagged ? (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => flagMutation.mutate({ id: conv.id, flagged: true, flagReason: "Admin flagged for review" })}
                          disabled={flagMutation.isPending}
                          data-testid={`button-flag-${conv.id}`}
                        >
                          <Flag className="w-3.5 h-3.5 mr-1" /> Flag
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => flagMutation.mutate({ id: conv.id, flagged: false })}
                          disabled={flagMutation.isPending}
                          data-testid={`button-unflag-${conv.id}`}
                        >
                          <CheckCircle className="w-3.5 h-3.5 mr-1" /> Unflag
                        </Button>
                      )}
                      {!conv.adminReviewed && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => flagMutation.mutate({ id: conv.id, markReviewed: true, adminNotes: "Reviewed — OK" })}
                          disabled={flagMutation.isPending}
                          data-testid={`button-mark-reviewed-${conv.id}`}
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" /> Mark Reviewed
                        </Button>
                      )}
                    </div>
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

function TutorRoadmapPanel() {
  const { data, isLoading } = useQuery({
    queryKey: ["/api/admin/tutor/roadmap"],
    queryFn: () => adminFetch("/api/admin/tutor/roadmap").then(r => r.json()),
  });

  if (isLoading) return <div className="flex items-center gap-2 py-4"><Loader2 className="animate-spin w-4 h-4" /> {t("pages.adminTutor.loadingRoadmap")}</div>;

  const roadmap = data?.roadmap || [];

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium flex items-center gap-2">
        <Target className="w-4 h-4 text-purple-600" />
        Content Expansion Roadmap — AI Tutor
      </h3>

      <div className="space-y-3">
        {roadmap.map((item: any) => (
          <Card key={item.rank} data-testid={`card-roadmap-${item.rank}`}>
            <CardContent className="py-4 px-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-sm font-bold">
                    {item.rank}
                  </span>
                  <span className="font-semibold text-gray-900">{item.title}</span>
                </div>
                <Badge className="bg-gray-100 text-gray-600 capitalize">{item.status}</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-3 ml-10">{item.description}</p>
              <div className="ml-10 grid grid-cols-3 gap-2">
                <div className="bg-gray-50 rounded px-3 py-2 text-center">
                  <div className="text-xs text-gray-500 mb-0.5">{t("pages.adminTutor.engagementImpact")}</div>
                  <div className="flex items-center justify-center gap-1">
                    <div className="text-lg font-bold text-blue-600">{item.engagementImpact}</div>
                    <span className="text-[10px] text-gray-400">/10</span>
                  </div>
                </div>
                <div className="bg-gray-50 rounded px-3 py-2 text-center">
                  <div className="text-xs text-gray-500 mb-0.5">{t("pages.adminTutor.conversionPotential")}</div>
                  <div className="flex items-center justify-center gap-1">
                    <div className="text-lg font-bold text-green-600">{item.conversionPotential}</div>
                    <span className="text-[10px] text-gray-400">/10</span>
                  </div>
                </div>
                <div className="bg-gray-50 rounded px-3 py-2 text-center">
                  <div className="text-xs text-gray-500 mb-0.5">{t("pages.adminTutor.learningEffectiveness")}</div>
                  <div className="flex items-center justify-center gap-1">
                    <div className="text-lg font-bold text-purple-600">{item.learningEffectiveness}</div>
                    <span className="text-[10px] text-gray-400">/10</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function AdminTutorManagement() {
  const [activeTab, setActiveTab] = useState<"config" | "analytics" | "conversations" | "roadmap">("config");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <MessageSquare className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold" data-testid="text-tutor-management-title">{t("pages.adminTutor.aiTutorManagement")}</h2>
          <p className="text-xs text-gray-500">{t("pages.adminTutor.configureTutorBehaviorReviewConversations")}</p>
        </div>
      </div>

      <div className="flex gap-1 bg-white rounded-lg border border-gray-200 p-1">
        {([
          { key: "config" as const, label: "Configuration", icon: Settings },
          { key: "analytics" as const, label: "Analytics", icon: BarChart3 },
          { key: "conversations" as const, label: "Conversation Review", icon: Eye },
          { key: "roadmap" as const, label: "Roadmap", icon: Trophy },
        ]).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === key ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-50"
            }`}
            data-testid={`tab-tutor-${key}`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {activeTab === "config" && <TutorConfigPanel />}
      {activeTab === "analytics" && <TutorAnalyticsPanel />}
      {activeTab === "conversations" && <ConversationReviewPanel />}
      {activeTab === "roadmap" && <TutorRoadmapPanel />}
    </div>
  );
}
