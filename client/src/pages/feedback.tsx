import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { SEO } from "@/components/seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { AdminEditButton } from "@/components/admin-edit-button";
import { MessageSquare, ThumbsUp, Lightbulb, Bug, HelpCircle, Send, CheckCircle } from "lucide-react";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";

import { useI18n } from "@/lib/i18n";
type FeedbackItem = {
  id: string;
  username: string | null;
  type: string;
  category: string | null;
  title: string;
  description: string;
  status: string | null;
  upvotes: number | null;
  createdAt: string;
};

const typeOptions = [
  { value: "feedback", label: "General Feedback", icon: MessageSquare },
  { value: "feature_request", label: "Feature Request", icon: Lightbulb },
  { value: "bug_report", label: "Bug Report", icon: Bug },
  { value: "question", label: "Question", icon: HelpCircle },
];

const categoryOptions = [
  "general",
  "lessons",
  "flashcards",
  "mock-exams",
  "med-math",
  "lab-values",
  "pricing",
  "ui-design",
  "mobile",
  "other",
];

export default function FeedbackPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);
  const [type, setType] = useState("feedback");
  const [category, setCategory] = useState("general");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/feedback").then(r => r.json()).then(setFeedbackList).catch(() => {});
  }, [submitted]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    setLoading(true);
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          username: user?.username || "Anonymous",
          email: email || user?.email || undefined,
          type,
          category,
          title: title.trim(),
          description: description.trim(),
        }),
      });
      setTitle("");
      setDescription("");
      setEmail("");
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch {
    } finally {
      setLoading(false);
    }
  }

  async function handleUpvote(id: string) {
    try {
      await fetch(`/api/feedback/${id}/upvote`, { method: "POST" });
      setFeedbackList(prev =>
        prev.map(f => (f.id === id ? { ...f, upvotes: (f.upvotes || 0) + 1 } : f))
      );
    } catch {}
  }

  const statusLabel: Record<string, string> = {
    new: "Under Review",
    in_progress: "In Progress",
    planned: "Planned",
    completed: "Completed",
    declined: "Declined",
  };

  const statusColor: Record<string, string> = {
    new: "bg-blue-100 text-blue-700",
    in_progress: "bg-yellow-100 text-yellow-700",
    planned: "bg-purple-100 text-purple-700",
    completed: "bg-green-100 text-green-700",
    declined: "bg-gray-100 text-gray-500",
  };

  return (
    <div className="min-h-screen bg-warmwhite flex flex-col font-sans">
      <AdminEditButton />
      <SEO
        title={t("pages.feedback.feedbackFeatureRequestsNursenest")}
        description={t("pages.feedback.shareYourFeedbackAndFeature")}
        canonicalPath="/feedback"
      />
      <Navigation />

      <main className="flex-grow py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <BreadcrumbNav />
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900" data-testid="text-feedback-title">
              Feedback & Feature Requests
            </h1>
            <p className="text-gray-500 mt-2">
              Help us make NurseNest better! Share your ideas, report issues, or request features.
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-2">
              <Card className="border border-primary/10 sticky top-4" data-testid="card-feedback-form">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">{t("pages.feedback.submitFeedback")}</CardTitle>
                </CardHeader>
                <CardContent>
                  {submitted ? (
                    <div className="text-center py-8" data-testid="text-feedback-success">
                      <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                      <p className="font-semibold text-gray-900">{t("pages.feedback.thankYou")}</p>
                      <p className="text-sm text-gray-500 mt-1">{t("pages.feedback.yourFeedbackHasBeenSubmitted")}</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="text-xs font-medium text-gray-600 block mb-1.5">{t("pages.feedback.type")}</label>
                        <div className="grid grid-cols-2 gap-2">
                          {typeOptions.map(opt => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => setType(opt.value)}
                              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-medium transition-colors ${
                                type === opt.value
                                  ? "border-primary bg-primary/5 text-primary"
                                  : "border-gray-200 text-gray-600 hover:border-gray-300"
                              }`}
                              data-testid={`button-feedback-type-${opt.value}`}
                            >
                              <opt.icon className="w-3.5 h-3.5" />
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-medium text-gray-600 block mb-1.5">{t("pages.feedback.category")}</label>
                        <select
                          value={category}
                          onChange={e => setCategory(e.target.value)}
                          className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
                          data-testid="select-feedback-category"
                        >
                          {categoryOptions.map(c => (
                            <option key={c} value={c}>
                              {c.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-medium text-gray-600 block mb-1.5">{t("pages.feedback.title")}</label>
                        <input
                          type="text"
                          value={title}
                          onChange={e => setTitle(e.target.value)}
                          placeholder={t("pages.feedback.briefSummary")}
                          className="w-full border rounded-lg px-3 py-2 text-sm"
                          required
                          data-testid="input-feedback-title"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-medium text-gray-600 block mb-1.5">{t("pages.feedback.description")}</label>
                        <textarea
                          value={description}
                          onChange={e => setDescription(e.target.value)}
                          placeholder={t("pages.feedback.describeInDetail")}
                          rows={4}
                          className="w-full border rounded-lg px-3 py-2 text-sm resize-none"
                          required
                          data-testid="input-feedback-description"
                        />
                      </div>

                      {!user && (
                        <div>
                          <label className="text-xs font-medium text-gray-600 block mb-1.5">{t("pages.feedback.emailOptional")}</label>
                          <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder={t("pages.feedback.youremailcom")}
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                            data-testid="input-feedback-email"
                          />
                        </div>
                      )}

                      <Button type="submit" className="w-full gap-2" disabled={loading} data-testid="button-submit-feedback">
                        <Send className="w-4 h-4" />
                        {loading ? "Submitting..." : "Submit Feedback"}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-3 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">{t("pages.feedback.communityFeedback")}</h2>
              {feedbackList.length === 0 ? (
                <Card className="border border-primary/10">
                  <CardContent className="p-8 text-center text-gray-400">
                    <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-40" />
                    <p className="text-sm">{t("pages.feedback.noFeedbackSubmittedYetBe")}</p>
                  </CardContent>
                </Card>
              ) : (
                feedbackList
                  .filter(f => f.status !== "declined")
                  .map(item => (
                    <Card key={item.id} className="border border-primary/10" data-testid={`card-feedback-${item.id}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => handleUpvote(item.id)}
                            className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg hover:bg-gray-50 transition-colors"
                            data-testid={`button-upvote-${item.id}`}
                          >
                            <ThumbsUp className="w-4 h-4 text-gray-400" />
                            <span className="text-xs font-bold text-gray-600">{item.upvotes || 0}</span>
                          </button>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold text-gray-900 text-sm">{item.title}</h3>
                              {item.status && item.status !== "new" && (
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[item.status] || "bg-gray-100 text-gray-600"}`}>
                                  {statusLabel[item.status] || item.status}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                              <span>{item.username || "Anonymous"}</span>
                              <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                              <span className="capitalize">{(item.type || "").replace(/_/g, " ")}</span>
                              {item.category && item.category !== "general" && (
                                <span className="capitalize">{item.category.replace(/-/g, " ")}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
