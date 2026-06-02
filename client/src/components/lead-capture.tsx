import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";
import {
  BookOpen,
  FileText,
  ClipboardCheck,
  CheckCircle2,
  ArrowRight,
  Download,
  X,
  Mail,
  Sparkles,
} from "lucide-react";

export type LeadMagnetType = "study_guide" | "practice_questions" | "mock_exam";

interface LeadCaptureProps {
  leadMagnetType: LeadMagnetType;
  professionContext?: string;
  source?: string;
  className?: string;
}

const LEAD_MAGNET_CONFIG: Record<
  LeadMagnetType,
  {
    icon: typeof BookOpen;
    title: string;
    description: string;
    buttonText: string;
    successMessage: string;
    gradient: string;
    iconBg: string;
    iconColor: string;
  }
> = {
  study_guide: {
    icon: BookOpen,
    title: "Download Your Free Study Guide",
    description:
      "Get a comprehensive study guide with key concepts, mnemonics, and exam strategies delivered to your inbox.",
    buttonText: "Get Free Study Guide",
    successMessage:
      "Check your inbox! Your free study guide is on its way.",
    gradient: "from-blue-50 via-white to-blue-50",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  practice_questions: {
    icon: FileText,
    title: "Get Free Practice Questions",
    description:
      "Receive a set of exam-style practice questions with detailed rationales to test your knowledge.",
    buttonText: "Get Free Questions",
    successMessage:
      "Your free practice questions are being sent to your inbox!",
    gradient: "from-emerald-50 via-white to-emerald-50",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
  mock_exam: {
    icon: ClipboardCheck,
    title: "Take a Free Mock Exam",
    description:
      "Get access to a free timed mock exam that simulates real exam conditions with performance analytics.",
    buttonText: "Get Free Mock Exam",
    successMessage:
      "Your free mock exam access link is on its way to your inbox!",
    gradient: "from-purple-50 via-white to-purple-50",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
};

function useLeadCapture(
  leadMagnetType: LeadMagnetType,
  professionContext?: string,
  source?: string
) {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setStatus("error");
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmed,
          frequency: "weekly",
          source: source || "lead_capture",
          leadMagnetType,
          professionContext: professionContext || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Subscription failed.");
      }
      setStatus("success");
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    }
  }

  return { email, setEmail, status, setStatus, errorMsg, handleSubmit };
}

export function InlineLeadCapture({
  leadMagnetType,
  professionContext,
  source,
  className = "",
}: LeadCaptureProps) {
  const config = LEAD_MAGNET_CONFIG[leadMagnetType];
  const Icon = config.icon;
  const { email, setEmail, status, setStatus, errorMsg, handleSubmit } =
    useLeadCapture(leadMagnetType, professionContext, source || "inline_cta");

  return (
    <Card
      className={`border border-primary/15 overflow-hidden ${className}`}
      data-testid={`lead-capture-inline-${leadMagnetType}`}
    >
      <CardContent className="p-0">
        <div className={`bg-gradient-to-r ${config.gradient} p-6 sm:p-8`}>
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div
              className={`w-12 h-12 rounded-xl ${config.iconBg} flex items-center justify-center shrink-0`}
            >
              <Icon className={`w-6 h-6 ${config.iconColor}`} />
            </div>
            <div className="flex-1 min-w-0">
              <h3
                className="text-lg font-bold text-gray-900 mb-1"
                data-testid={`text-lead-title-${leadMagnetType}`}
              >
                {config.title}
              </h3>
              <p className="text-sm text-gray-600 mb-4">{config.description}</p>

              {status === "success" ? (
                <div
                  className="flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl"
                  data-testid={`text-lead-success-${leadMagnetType}`}
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="text-sm font-medium text-emerald-700">
                    {config.successMessage}
                  </span>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col sm:flex-row gap-2"
                >
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="email"
                      placeholder={t("components.leadCapture.enterYourEmailAddress")}
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (status === "error") setStatus("idle");
                      }}
                      className="pl-10 h-11"
                      data-testid={`input-lead-email-${leadMagnetType}`}
                      disabled={status === "loading"}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="h-11 px-6 shrink-0"
                    disabled={status === "loading"}
                    data-testid={`button-lead-submit-${leadMagnetType}`}
                  >
                    {status === "loading" ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </span>
                    ) : (
                      <>
                        {config.buttonText}
                        <Download className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                  {status === "error" && (
                    <p
                      className="text-xs text-red-500 sm:absolute sm:top-full sm:left-0 mt-1"
                      data-testid={`text-lead-error-${leadMagnetType}`}
                    >
                      {errorMsg}
                    </p>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function EndOfContentLeadCapture({
  leadMagnetType,
  professionContext,
  source,
  className = "",
}: LeadCaptureProps) {
  const config = LEAD_MAGNET_CONFIG[leadMagnetType];
  const Icon = config.icon;
  const { email, setEmail, status, setStatus, errorMsg, handleSubmit } =
    useLeadCapture(leadMagnetType, professionContext, source || "end_of_content");

  return (
    <section
      className={`py-12 ${className}`}
      data-testid={`lead-capture-end-${leadMagnetType}`}
    >
      <div className="max-w-2xl mx-auto px-4">
        <div
          className={`bg-gradient-to-br ${config.gradient} border border-primary/10 rounded-2xl p-8 sm:p-10 text-center shadow-sm`}
        >
          <div
            className={`w-16 h-16 rounded-2xl ${config.iconBg} flex items-center justify-center mx-auto mb-5`}
          >
            <Icon className={`w-8 h-8 ${config.iconColor}`} />
          </div>
          <h3
            className="text-2xl font-bold text-gray-900 mb-2"
            data-testid={`text-end-lead-title-${leadMagnetType}`}
          >
            {config.title}
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {config.description}
          </p>

          {status === "success" ? (
            <div
              className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl max-w-sm mx-auto"
              data-testid={`text-end-lead-success-${leadMagnetType}`}
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="text-sm font-medium text-emerald-700">
                {config.successMessage}
              </span>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="max-w-md mx-auto space-y-3"
            >
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="email"
                    placeholder={t("components.leadCapture.enterYourEmailAddress2")}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === "error") setStatus("idle");
                    }}
                    className="pl-10 h-12 text-base"
                    data-testid={`input-end-lead-email-${leadMagnetType}`}
                    disabled={status === "loading"}
                  />
                </div>
                <Button
                  type="submit"
                  className="h-12 px-6 text-base shrink-0"
                  disabled={status === "loading"}
                  data-testid={`button-end-lead-submit-${leadMagnetType}`}
                >
                  {status === "loading" ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    <>
                      {config.buttonText}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
              {status === "error" && (
                <p
                  className="text-xs text-red-500"
                  data-testid={`text-end-lead-error-${leadMagnetType}`}
                >
                  {errorMsg}
                </p>
              )}
              <p className="text-[11px] text-gray-400">
                No spam, ever. Unsubscribe anytime. We respect your privacy.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

const DISMISS_STORAGE_KEY = "nursenest-sticky-banner-dismissed";
const DISMISS_EXPIRY_MS = 24 * 60 * 60 * 1000;

function isBannerDismissed(): boolean {
  try {
    const raw = localStorage.getItem(DISMISS_STORAGE_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw);
    if (data && typeof data.expiry === "number" && Date.now() < data.expiry) {
      return true;
    }
    localStorage.removeItem(DISMISS_STORAGE_KEY);
    return false;
  } catch {
    return false;
  }
}

function persistDismiss(): void {
  try {
    localStorage.setItem(
      DISMISS_STORAGE_KEY,
      JSON.stringify({ expiry: Date.now() + DISMISS_EXPIRY_MS }),
    );
  } catch {}
}

export function StickyLeadBanner({
  leadMagnetType,
  professionContext,
  source,
  className = "",
}: LeadCaptureProps) {
  const config = LEAD_MAGNET_CONFIG[leadMagnetType];
  const Icon = config.icon;
  const [dismissed, setDismissed] = useState(() => isBannerDismissed());
  const { email, setEmail, status, setStatus, errorMsg, handleSubmit } =
    useLeadCapture(leadMagnetType, professionContext, source || "sticky_banner");

  if (dismissed || status === "success") return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 border-t border-primary/15 bg-white/95 backdrop-blur-md shadow-[0_-4px_20px_rgba(0,0,0,0.08)] ${className}`}
      data-testid={`lead-capture-sticky-${leadMagnetType}`}
    >
      <div className="max-w-5xl mx-auto px-4 py-3">
        <div className="flex items-center gap-3">
          <div
            className={`hidden sm:flex w-10 h-10 rounded-lg ${config.iconBg} items-center justify-center shrink-0`}
          >
            <Icon className={`w-5 h-5 ${config.iconColor}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-sm font-bold text-gray-900 truncate">
                {config.title}
              </span>
            </div>
            <p className="text-xs text-gray-500 hidden sm:block truncate">
              {config.description}
            </p>
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 shrink-0"
          >
            <div className="relative">
              <Input
                type="email"
                placeholder={t("components.leadCapture.yourEmail")}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === "error") setStatus("idle");
                }}
                className="h-9 w-40 sm:w-52 text-sm"
                data-testid={`input-sticky-lead-email-${leadMagnetType}`}
                disabled={status === "loading"}
              />
            </div>
            <Button
              type="submit"
              size="sm"
              className="h-9 px-4 text-sm shrink-0"
              disabled={status === "loading"}
              data-testid={`button-sticky-lead-submit-${leadMagnetType}`}
            >
              {status === "loading" ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span className="hidden sm:inline">{config.buttonText}</span>
                  <span className="sm:hidden">{t("components.leadCapture.getFree")}</span>
                </>
              )}
            </Button>
          </form>
          <button
            onClick={() => {
              setDismissed(true);
              persistDismiss();
            }}
            className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors shrink-0"
            data-testid={`button-sticky-lead-dismiss-${leadMagnetType}`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {status === "error" && (
          <p
            className="text-xs text-red-500 mt-1 text-right"
            data-testid={`text-sticky-lead-error-${leadMagnetType}`}
          >
            {errorMsg}
          </p>
        )}
      </div>
    </div>
  );
}

export function BlogInlineLeadCapture({
  professionContext,
}: {
  professionContext?: string;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setStatus("error");
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmed,
          frequency: "weekly",
          source: "blog_inline_cta",
          leadMagnetType: "practice_questions",
          professionContext: professionContext || "nursing",
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Subscription failed.");
      }
      setStatus("success");
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div
        className="my-8 p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center"
        data-testid="lead-capture-blog-inline-success"
      >
        <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
        <p className="text-sm font-medium text-emerald-700">
          Your free practice questions are on their way!
        </p>
      </div>
    );
  }

  return (
    <div
      className="my-8 p-6 bg-gradient-to-r from-primary/5 via-white to-primary/5 border border-primary/15 rounded-xl"
      data-testid="lead-capture-blog-inline"
    >
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <FileText className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h4 className="font-bold text-gray-900">
            Test Your Knowledge
          </h4>
          <p className="text-sm text-gray-600">
            Get free exam-style practice questions with detailed rationales sent to your inbox.
          </p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="email"
            placeholder={t("components.leadCapture.enterYourEmail")}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status === "error") setStatus("idle");
            }}
            className="pl-10 h-10"
            data-testid="input-blog-inline-lead-email"
            disabled={status === "loading"}
          />
        </div>
        <Button
          type="submit"
          size="sm"
          className="h-10 px-5"
          disabled={status === "loading"}
          data-testid="button-blog-inline-lead-submit"
        >
          {status === "loading" ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              Get Free Questions
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </>
          )}
        </Button>
      </form>
      {status === "error" && (
        <p className="text-xs text-red-500 mt-1.5" data-testid="text-blog-inline-lead-error">
          {errorMsg}
        </p>
      )}
    </div>
  );
}
