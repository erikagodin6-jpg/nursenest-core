import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/navigation";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { useI18n } from "@/lib/i18n";
import {
  MessageCircle, Trash2, CheckCircle, Flag, Loader2,
  ArrowLeft, AlertTriangle, RefreshCw
} from "lucide-react";

interface FlaggedComment {
  id: string;
  questionId: string;
  userId: string;
  username: string;
  content: string;
  thumbsUpCount: number;
  thumbsDownCount: number;
  isFlagged: boolean;
  createdAt: string;
}

interface RecentComment {
  id: string;
  questionId: string;
  userId: string;
  username: string;
  content: string;
  thumbsUpCount: number;
  thumbsDownCount: number;
  isFlagged: boolean;
  createdAt: string;
}

export default function AdminCommentModeration() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [flaggedComments, setFlaggedComments] = useState<FlaggedComment[]>([]);
  const [recentComments, setRecentComments] = useState<RecentComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [tab, setTab] = useState<"flagged" | "recent">("flagged");

  useEffect(() => {
    if (user?.tier !== "admin") {
      setLocation("/admin");
      return;
    }
    loadComments();
  }, [user]);

  async function loadComments() {
    setLoading(true);
    try {
      const [flaggedRes, recentRes] = await Promise.all([
        fetch("/api/admin/flagged-comments"),
        fetch("/api/admin/recent-comments"),
      ]);
      if (flaggedRes.ok) {
        setFlaggedComments(await flaggedRes.json());
      }
      if (recentRes.ok) {
        setRecentComments(await recentRes.json());
      }
    } catch {}
    setLoading(false);
  }

  async function handleAction(commentId: string, action: "dismiss" | "delete") {
    setProcessingId(commentId);
    try {
      const res = await fetch(`/api/admin/flagged-comments/${commentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        setFlaggedComments(prev => prev.filter(c => c.id !== commentId));
        if (action === "delete") {
          setRecentComments(prev => prev.filter(c => c.id !== commentId));
        }
      }
    } catch {}
    setProcessingId(null);
  }

  async function handleDeleteRecent(commentId: string) {
    setProcessingId(commentId);
    try {
      const res = await fetch(`/api/admin/flagged-comments/${commentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete" }),
      });
      if (res.ok) {
        setRecentComments(prev => prev.filter(c => c.id !== commentId));
        setFlaggedComments(prev => prev.filter(c => c.id !== commentId));
      }
    } catch {}
    setProcessingId(null);
  }

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleString("en-CA", {
      month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
    });
  }

  if (user?.tier !== "admin") return null;

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-warmwhite">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation("/admin")}
                className="gap-1"
                data-testid="button-back-admin"
              >
                <ArrowLeft className="h-4 w-4" /> Admin
              </Button>
              <h1 className="text-2xl font-bold text-gray-900" data-testid="text-page-title">
                Comment Moderation
              </h1>
            </div>
            <Button variant="outline" size="sm" onClick={loadComments} className="gap-1.5" data-testid="button-refresh">
              <RefreshCw className="h-4 w-4" /> Refresh
            </Button>
          </div>

          <div className="flex gap-2 mb-6">
            <Button
              variant={tab === "flagged" ? "default" : "outline"}
              size="sm"
              onClick={() => setTab("flagged")}
              className="gap-1.5 rounded-xl"
              data-testid="button-tab-flagged"
            >
              <Flag className="h-4 w-4" />
              Flagged
              {flaggedComments.length > 0 && (
                <Badge variant="destructive" className="text-xs px-1.5 ml-1">{flaggedComments.length}</Badge>
              )}
            </Button>
            <Button
              variant={tab === "recent" ? "default" : "outline"}
              size="sm"
              onClick={() => setTab("recent")}
              className="gap-1.5 rounded-xl"
              data-testid="button-tab-recent"
            >
              <MessageCircle className="h-4 w-4" />
              Recent Comments
            </Button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : tab === "flagged" ? (
            flaggedComments.length === 0 ? (
              <Card className="border-0 shadow-md" data-testid="card-no-flagged">
                <CardContent className="py-12 text-center">
                  <CheckCircle className="h-12 w-12 text-emerald-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-1">{t("pages.adminCommentModeration.noFlaggedComments")}</h3>
                  <p className="text-sm text-gray-500">{t("pages.adminCommentModeration.allClearNoCommentsNeed")}</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {flaggedComments.map((comment) => (
                  <Card key={comment.id} className="border border-red-100 shadow-sm" data-testid={`flagged-comment-${comment.id}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-xs font-bold text-red-600 shrink-0">
                          <AlertTriangle className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-gray-800" data-testid={`text-flagged-author-${comment.id}`}>
                              {comment.username || "Anonymous"}
                            </span>
                            <span className="text-xs text-gray-400">{formatDate(comment.createdAt)}</span>
                            <Badge variant="outline" className="text-[10px]">
                              Q: {comment.questionId.slice(0, 20)}...
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap mb-3" data-testid={`text-flagged-content-${comment.id}`}>
                            {comment.content}
                          </p>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAction(comment.id, "dismiss")}
                              disabled={processingId === comment.id}
                              className="gap-1.5 text-emerald-600 border-emerald-200 hover:bg-emerald-50 rounded-xl"
                              data-testid={`button-dismiss-${comment.id}`}
                            >
                              <CheckCircle className="h-3.5 w-3.5" /> Dismiss Flag
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAction(comment.id, "delete")}
                              disabled={processingId === comment.id}
                              className="gap-1.5 text-red-600 border-red-200 hover:bg-red-50 rounded-xl"
                              data-testid={`button-delete-${comment.id}`}
                            >
                              <Trash2 className="h-3.5 w-3.5" /> Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )
          ) : (
            recentComments.length === 0 ? (
              <Card className="border-0 shadow-md" data-testid="card-no-recent">
                <CardContent className="py-12 text-center">
                  <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-1">{t("pages.adminCommentModeration.noRecentComments")}</h3>
                  <p className="text-sm text-gray-500">{t("pages.adminCommentModeration.noCommentsHaveBeenPosted")}</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {recentComments.map((comment) => (
                  <Card key={comment.id} className="border-0 shadow-sm" data-testid={`recent-comment-${comment.id}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 shrink-0">
                          {(comment.username || "?").slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-gray-800">
                              {comment.username || "Anonymous"}
                            </span>
                            <span className="text-xs text-gray-400">{formatDate(comment.createdAt)}</span>
                            {comment.isFlagged && (
                              <Badge variant="destructive" className="text-[10px]">{t("pages.adminCommentModeration.flagged")}</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap mb-2">
                            {comment.content}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-gray-400">
                            <span>Q: {comment.questionId.slice(0, 30)}{comment.questionId.length > 30 ? "..." : ""}</span>
                            <span>+{comment.thumbsUpCount} / -{comment.thumbsDownCount}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteRecent(comment.id)}
                              disabled={processingId === comment.id}
                              className="gap-1 text-red-500 hover:text-red-600 hover:bg-red-50 h-7 px-2"
                              data-testid={`button-delete-recent-${comment.id}`}
                            >
                              <Trash2 className="h-3 w-3" /> Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )
          )}
        </div>
      </main>
    </>
  );
}
