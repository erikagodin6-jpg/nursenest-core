import { useState } from "react";
import { useAuth, getAdminAccessToken } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Send, CheckCircle2 } from "lucide-react";

import { useI18n } from "@/lib/i18n";
interface TesterFeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const categories = [
  { value: "bug", label: "Bug Report" },
  { value: "content", label: "Content Issue" },
  { value: "ui", label: "Design / Layout" },
  { value: "feature", label: "Feature Request" },
  { value: "general", label: "General Feedback" },
];

const severities = [
  { value: "low", label: "Low - Minor issue" },
  { value: "medium", label: "Medium - Affects usability" },
  { value: "high", label: "High - Blocking or critical" },
];

export function TesterFeedbackDialog({ open, onOpenChange }: TesterFeedbackDialogProps) {
  const { t } = useI18n();
  const { user } = useAuth();
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    category: "general",
    severity: "medium",
    title: "",
    description: "",
    pageUrl: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      toast({ title: "Missing information", description: "Please provide a title and description.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      const token = getAdminAccessToken();
      if (token) headers["Authorization"] = `Bearer ${token}`;
      if (user) {
        headers["x-username"] = user.username;
      }
      const res = await fetch("/api/tester/feedback", {
        method: "POST",
        headers,
        body: JSON.stringify({
          ...form,
          userId: user?.id,
          username: user?.username,
          pageUrl: form.pageUrl || window.location.href,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as any).error || "Failed to submit feedback");
      }
      setSubmitted(true);
      toast({ title: "Feedback submitted", description: "Thank you for helping improve NurseNest." });
    } catch (err: any) {
      toast({ title: "Submission failed", description: err.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setForm({ category: "general", severity: "medium", title: "", description: "", pageUrl: "" });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) handleReset(); }}>
      <DialogContent className="sm:max-w-lg" data-testid="dialog-tester-feedback">
        <DialogHeader>
          <DialogTitle className="text-[#2E3A59]">{t("components.testerFeedbackDialog.betaTesterFeedback")}</DialogTitle>
          <DialogDescription>
            Help us improve NurseNest by sharing your experience, reporting issues, or suggesting features.
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="text-center py-8 space-y-4" data-testid="feedback-success">
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
            <h3 className="text-lg font-semibold text-[#2E3A59]">{t("components.testerFeedbackDialog.feedbackReceived")}</h3>
            <p className="text-gray-600 text-sm">
              Your feedback has been recorded and our team will review it shortly.
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" size="sm" onClick={handleReset} data-testid="button-send-more-feedback">
                Send More Feedback
              </Button>
              <Button size="sm" onClick={() => onOpenChange(false)} data-testid="button-close-feedback">
                Close
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("components.testerFeedbackDialog.category")}</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger data-testid="select-feedback-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t("components.testerFeedbackDialog.severity")}</Label>
                <Select value={form.severity} onValueChange={(v) => setForm({ ...form, severity: v })}>
                  <SelectTrigger data-testid="select-feedback-severity">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {severities.map((s) => (
                      <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="feedback-title">{t("components.testerFeedbackDialog.title")}</Label>
              <Input
                id="feedback-title"
                placeholder={t("components.testerFeedbackDialog.briefSummaryOfYourFeedback")}
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                data-testid="input-feedback-title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="feedback-description">{t("components.testerFeedbackDialog.description")}</Label>
              <Textarea
                id="feedback-description"
                placeholder={t("components.testerFeedbackDialog.describeTheIssueSuggestionOr")}
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
                data-testid="input-feedback-description"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="feedback-url" className="text-gray-500 text-xs">{t("components.testerFeedbackDialog.pageUrlAutofilled")}</Label>
              <Input
                id="feedback-url"
                placeholder={window.location.href}
                value={form.pageUrl}
                onChange={(e) => setForm({ ...form, pageUrl: e.target.value })}
                data-testid="input-feedback-url"
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting} data-testid="button-submit-feedback">
              <Send className="w-4 h-4 mr-2" />
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
