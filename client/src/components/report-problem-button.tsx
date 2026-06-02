import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { useI18n } from "@/lib/i18n";
import { getPlatformSection } from "@shared/platform-sections";
import { Bug, X, Send, ChevronDown, ImagePlus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PROBLEM_TYPES = [
  { value: "incorrect_info", labelKey: "report.type.incorrectInfo" },
  { value: "question_error", labelKey: "report.type.questionError" },
  { value: "explanation_unclear", labelKey: "report.type.explanationUnclear" },
  { value: "broken_link", labelKey: "report.type.brokenLink" },
  { value: "translation_issue", labelKey: "report.type.translationIssue" },
  { value: "technical_problem", labelKey: "report.type.technicalProblem" },
  { value: "typo_grammar", labelKey: "report.type.typoGrammar" },
  { value: "other", labelKey: "report.type.other" },
] as const;

const SEVERITY_OPTIONS = [
  { value: "low", labelKey: "report.severity.low" },
  { value: "medium", labelKey: "report.severity.medium" },
  { value: "high", labelKey: "report.severity.high" },
] as const;

const DESCRIPTION_MAX_LENGTH = 1000;

function gtagEvent(eventName: string, params: Record<string, any>) {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", eventName, params);
  }
}

function getDeviceType(): string {
  const ua = navigator.userAgent;
  if (/Mobi|Android/i.test(ua)) return "mobile";
  if (/Tablet|iPad/i.test(ua)) return "tablet";
  return "desktop";
}

function detectProblemType(path: string): string {
  const lower = path.toLowerCase();
  if (lower.includes("/flashcard")) return "incorrect_info";
  if (lower.includes("/lesson")) return "incorrect_info";
  if (lower.includes("/exam") || lower.includes("/mock-exam") || lower.includes("/cat-exam")) return "question_error";
  if (lower.includes("/pricing") || lower.includes("/subscription") || lower.includes("/checkout")) return "technical_problem";
  if (lower.includes("/question-bank") || lower.includes("/qbank")) return "question_error";
  return "other";
}

function extractContentId(path: string): string | null {
  const segments = path.split("/").filter(Boolean);
  const contentPrefixes = ["lessons", "flashcards", "question-bank", "mock-exams", "blog", "exam"];
  for (let i = 0; i < segments.length - 1; i++) {
    if (contentPrefixes.includes(segments[i]) && segments[i + 1]) {
      return segments[i + 1];
    }
  }
  if (segments.length > 0) {
    const last = segments[segments.length - 1];
    if (last.includes("-") && last.length > 5) return last;
  }
  return null;
}

export function ReportProblemButton() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useI18n();
  const isMobile = useIsMobile();
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [problemType, setProblemType] = useState("other");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [severity, setSeverity] = useState("medium");
  const [contactPermission, setContactPermission] = useState(false);
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);

  const hiddenPaths = ["/admin", "/login", "/register"];
  const isHidden = hiddenPaths.some((p) => location.startsWith(p)) || /^\/[a-z]{2}(-[a-z]{2})?\/admin/i.test(location);

  useEffect(() => {
    if (open) {
      setProblemType(detectProblemType(location));
      setDescription("");
      setSeverity("medium");
      setContactPermission(false);
      setScreenshotFile(null);
      setScreenshotPreview(null);
      if (user?.email) setEmail(user.email);
    }
  }, [open, location, user]);

  if (isHidden) return null;

  const handleOpen = () => {
    setOpen(true);
    gtagEvent("report_problem_clicked", {
      page_path: location,
      platform_section: getPlatformSection(location),
      event_category: "engagement",
    });
  };

  const handleScreenshotSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: t("report.screenshotError"), variant: "destructive" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: t("report.screenshotTooLarge"), variant: "destructive" });
      return;
    }
    setScreenshotFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setScreenshotPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const removeScreenshot = () => {
    setScreenshotFile(null);
    setScreenshotPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (val.length <= DESCRIPTION_MAX_LENGTH) {
      setDescription(val);
    }
  };

  const handleSubmit = async () => {
    if (!description.trim()) return;
    setSubmitting(true);
    try {
      let screenshotUrl: string | null = null;

      if (screenshotFile) {
        const formData = new FormData();
        formData.append("screenshot", screenshotFile);
        const uploadRes = await fetch("/api/problem-reports/upload-screenshot", {
          method: "POST",
          body: formData,
        });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          screenshotUrl = uploadData.screenshotUrl;
        }
      }

      const body = {
        pageUrl: window.location.href,
        pageTitle: document.title,
        siteSection: getPlatformSection(location),
        contentId: extractContentId(location),
        userId: user?.id || null,
        problemType,
        description: description.trim(),
        email: email.trim() || null,
        severity,
        contactPermission,
        deviceType: getDeviceType(),
        browserInfo: navigator.userAgent.substring(0, 200),
        locale: navigator.language || null,
        screenshotUrl,
      };

      const res = await fetch("/api/problem-reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Failed to submit report");

      gtagEvent("report_problem_submitted", {
        problem_type: problemType,
        platform_section: getPlatformSection(location),
        severity,
        event_category: "engagement",
      });

      toast({
        title: t("report.successTitle"),
        description: t("report.successDescription"),
      });
      setOpen(false);
    } catch {
      toast({ title: t("report.errorTitle"), description: t("report.errorDescription"), variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className={`fixed z-40 bg-primary text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2 group ${
          isMobile
            ? "bottom-20 right-3 w-10 h-10 justify-center"
            : "bottom-6 right-6 px-3 py-2.5"
        }`}
        aria-label={t("report.buttonLabel")}
        data-testid="button-report-problem"
      >
        <Bug className={isMobile ? "w-4 h-4" : "w-4 h-4"} />
        {!isMobile && <span className="text-xs font-medium">{t("report.buttonLabel")}</span>}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto" data-testid="dialog-report-problem">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bug className="w-5 h-5 text-primary" />
              {t("report.title")}
            </DialogTitle>
            <DialogDescription>
              {t("report.subtitle")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <div>
              <Label htmlFor="problem-type">{t("report.problemTypeLabel")}</Label>
              <Select value={problemType} onValueChange={setProblemType}>
                <SelectTrigger id="problem-type" data-testid="select-problem-type">
                  <SelectValue placeholder={t("report.problemTypePlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  {PROBLEM_TYPES.map((pt) => (
                    <SelectItem key={pt.value} value={pt.value} data-testid={`option-problem-type-${pt.value}`}>
                      {t(pt.labelKey)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="description">{t("report.descriptionLabel")} *</Label>
                <span className={`text-xs ${description.length >= DESCRIPTION_MAX_LENGTH ? "text-red-500 font-medium" : "text-muted-foreground"}`} data-testid="text-char-counter">
                  {description.length}/{DESCRIPTION_MAX_LENGTH}
                </span>
              </div>
              <Textarea
                id="description"
                placeholder={t("report.descriptionPlaceholder")}
                value={description}
                onChange={handleDescriptionChange}
                rows={3}
                maxLength={DESCRIPTION_MAX_LENGTH}
                required
                data-testid="input-description"
              />
            </div>

            <div>
              <Label>{t("report.screenshotLabel")}</Label>
              <div className="mt-1">
                {screenshotPreview ? (
                  <div className="relative inline-block">
                    <img
                      src={screenshotPreview}
                      alt={t("components.reportProblemButton.screenshotPreview")}
                      className="max-h-32 rounded border"
                      data-testid="img-screenshot-preview"
                    />
                    <button
                      type="button"
                      onClick={removeScreenshot}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      data-testid="button-remove-screenshot"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    data-testid="button-attach-screenshot"
                  >
                    <ImagePlus className="w-4 h-4 mr-2" />
                    {t("report.attachScreenshot")}
                  </Button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleScreenshotSelect}
                  className="hidden"
                  data-testid="input-screenshot-file"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">{t("report.emailLabel")}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t("report.emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                data-testid="input-email"
              />
            </div>

            <div>
              <Label htmlFor="severity">{t("report.severityLabel")}</Label>
              <Select value={severity} onValueChange={setSeverity}>
                <SelectTrigger id="severity" data-testid="select-severity">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SEVERITY_OPTIONS.map((s) => (
                    <SelectItem key={s.value} value={s.value} data-testid={`option-severity-${s.value}`}>
                      {t(s.labelKey)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="contact"
                checked={contactPermission}
                onCheckedChange={(checked) => setContactPermission(checked === true)}
                data-testid="checkbox-contact-permission"
              />
              <Label htmlFor="contact" className="text-sm text-muted-foreground cursor-pointer">
                {t("report.contactPermission")}
              </Label>
            </div>

            <div className="text-xs text-muted-foreground bg-muted/50 rounded p-2">
              {t("report.pageInfo")}: {location}
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!description.trim() || submitting}
              className="w-full"
              data-testid="button-submit-report"
            >
              {submitting ? t("report.submitting") : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  {t("report.submitButton")}
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
