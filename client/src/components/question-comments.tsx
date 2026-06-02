import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/lib/i18n";
import {
  MessageCircle, ThumbsUp, ThumbsDown, Flag, ChevronDown, ChevronUp,
  Send, AlertTriangle, Loader2,
} from "lucide-react";

interface Comment {
  id: string;
  questionId: string;
  userId: string;
  username: string;
  content: string;
  thumbsUpCount: number;
  thumbsDownCount: number;
  isFlagged: boolean;
  createdAt: string;
  userVote: "up" | "down" | null;
}

function formatRelativeTime(dateStr: string): string {

  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return date.toLocaleDateString();
}

function getInitials(username: string): string {
  return username.slice(0, 2).toUpperCase();
}

interface QuestionCommentsProps {
  questionId: string;
}

export function QuestionComments({ questionId }: QuestionCommentsProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [expanded, setExpanded] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [posting, setPosting] = useState(false);
  const [sort, setSort] = useState<"helpful" | "newest">("helpful");

  const fetchCount = useCallback(async () => {
    try {
      const res = await fetch(`/api/question-comments/count/${encodeURIComponent(questionId)}`);
      if (res.ok) {
        const data = await res.json();
        setCommentCount(data.count);
      }
    } catch {}
  }, [questionId]);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/question-comments/${encodeURIComponent(questionId)}?sort=${sort}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch {
      toast({ title: "Failed to load comments", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [questionId, sort]);

  useEffect(() => {
    fetchCount();
  }, [fetchCount]);

  useEffect(() => {
    if (expanded) {
      fetchComments();
    }
  }, [expanded, fetchComments]);

  const handlePost = async () => {
    if (!newComment.trim() || !user) return;
    setPosting(true);
    try {
      const res = await fetch("/api/question-comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId, content: newComment.trim() }),
      });
      if (res.ok) {
        const comment = await res.json();
        setComments(prev => [comment, ...prev]);
        setNewComment("");
        setCommentCount(prev => prev + 1);
        toast({ title: "Comment posted" });
      } else {
        const err = await res.json();
        toast({ title: err.error || "Failed to post comment", variant: "destructive" });
      }
    } catch {
      toast({ title: "Failed to post comment", variant: "destructive" });
    } finally {
      setPosting(false);
    }
  };

  const handleVote = async (commentId: string, voteType: "up" | "down") => {
    if (!user) return;
    try {
      const res = await fetch(`/api/question-comments/${commentId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voteType }),
      });
      if (res.ok) {
        const updated = await res.json();
        setComments(prev => prev.map(c => c.id === commentId ? updated : c));
      }
    } catch {
      toast({ title: "Vote failed", variant: "destructive" });
    }
  };

  const handleFlag = async (commentId: string) => {
    if (!user) return;
    try {
      const res = await fetch(`/api/question-comments/${commentId}/flag`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        setComments(prev => prev.filter(c => c.id !== commentId));
        setCommentCount(prev => prev - 1);
        toast({ title: "Comment reported. Thank you for helping keep the community safe." });
      }
    } catch {
      toast({ title: "Failed to report comment", variant: "destructive" });
    }
  };

  return (
    <div className="mt-4" data-testid="section-question-comments">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors w-full py-2"
        data-testid="button-toggle-comments"
      >
        <MessageCircle className="h-4 w-4" />
        <span>{t("components.questionComments.discussion")}</span>
        {commentCount > 0 && (
          <Badge variant="secondary" className="text-xs px-1.5 py-0 h-5" data-testid="badge-comment-count">
            {commentCount}
          </Badge>
        )}
        <span className="ml-auto">
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </span>
      </button>

      {expanded && (
        <div className="mt-3 space-y-4 animate-fade-in-up" data-testid="panel-comments">
          {user && (
            <div className="flex gap-3" data-testid="form-new-comment">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                {getInitials(user.username)}
              </div>
              <div className="flex-1">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={t("components.questionComments.shareYourInsightOrAsk")}
                  rows={2}
                  maxLength={1000}
                  className="resize-none text-sm border-gray-200 rounded-xl"
                  data-testid="input-comment-text"
                />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-400">{newComment.length}/1000</span>
                  <Button
                    size="sm"
                    onClick={handlePost}
                    disabled={!newComment.trim() || posting}
                    className="rounded-xl gap-1.5"
                    data-testid="button-post-comment"
                  >
                    {posting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                    Post
                  </Button>
                </div>
              </div>
            </div>
          )}

          {!user && (
            <p className="text-sm text-gray-500 text-center py-2" data-testid="text-login-to-comment">
              Log in to join the discussion.
            </p>
          )}

          {comments.length > 0 && (
            <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
              <span className="text-xs text-gray-400">{t("components.questionComments.sortBy")}</span>
              <button
                onClick={() => setSort("helpful")}
                className={`text-xs px-2 py-0.5 rounded-lg transition-colors ${sort === "helpful" ? "bg-primary/10 text-primary font-medium" : "text-gray-500 hover:text-gray-700"}`}
                data-testid="button-sort-helpful"
              >
                Most Helpful
              </button>
              <button
                onClick={() => setSort("newest")}
                className={`text-xs px-2 py-0.5 rounded-lg transition-colors ${sort === "newest" ? "bg-primary/10 text-primary font-medium" : "text-gray-500 hover:text-gray-700"}`}
                data-testid="button-sort-newest"
              >
                Newest
              </button>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
            </div>
          ) : comments.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4" data-testid="text-no-comments">
              No comments yet. Be the first to share your thoughts!
            </p>
          ) : (
            <div className="space-y-3">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3 group" data-testid={`comment-${comment.id}`}>
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 shrink-0">
                    {getInitials(comment.username || "?")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-medium text-gray-800" data-testid={`text-comment-author-${comment.id}`}>
                        {comment.username || "Anonymous"}
                      </span>
                      <span className="text-xs text-gray-400" data-testid={`text-comment-time-${comment.id}`}>
                        {formatRelativeTime(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap break-words" data-testid={`text-comment-content-${comment.id}`}>
                      {comment.content}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <button
                        onClick={() => handleVote(comment.id, "up")}
                        disabled={!user}
                        className={`flex items-center gap-1 text-xs transition-colors ${
                          comment.userVote === "up"
                            ? "text-emerald-600 font-medium"
                            : "text-gray-400 hover:text-emerald-600"
                        } disabled:opacity-50`}
                        data-testid={`button-vote-up-${comment.id}`}
                      >
                        <ThumbsUp className="h-3.5 w-3.5" />
                        {comment.thumbsUpCount > 0 && <span>{comment.thumbsUpCount}</span>}
                      </button>
                      <button
                        onClick={() => handleVote(comment.id, "down")}
                        disabled={!user}
                        className={`flex items-center gap-1 text-xs transition-colors ${
                          comment.userVote === "down"
                            ? "text-red-500 font-medium"
                            : "text-gray-400 hover:text-red-500"
                        } disabled:opacity-50`}
                        data-testid={`button-vote-down-${comment.id}`}
                      >
                        <ThumbsDown className="h-3.5 w-3.5" />
                        {comment.thumbsDownCount > 0 && <span>{comment.thumbsDownCount}</span>}
                      </button>
                      {user && user.id !== comment.userId && (
                        <button
                          onClick={() => handleFlag(comment.id)}
                          className="flex items-center gap-1 text-xs text-gray-300 hover:text-amber-500 opacity-0 group-hover:opacity-100 transition-all"
                          title={t("components.questionComments.reportInappropriateComment")}
                          data-testid={`button-flag-${comment.id}`}
                        >
                          <Flag className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function CommentCountBadge({ questionId }: { questionId: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetch(`/api/question-comments/count/${encodeURIComponent(questionId)}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setCount(data.count); })
      .catch(() => {});
  }, [questionId]);

  if (count === 0) return null;

  return (
    <span className="inline-flex items-center gap-1 text-xs text-gray-500" data-testid={`badge-comments-${questionId}`}>
      <MessageCircle className="h-3 w-3" />
      {count}
    </span>
  );
}
