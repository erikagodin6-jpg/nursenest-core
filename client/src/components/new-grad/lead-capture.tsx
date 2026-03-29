import { useState } from "react";
import { Mail, Download, CheckCircle2, ArrowRight } from "lucide-react";

import { useI18n } from "@/lib/i18n";
interface LeadCaptureInlineProps {
  profession: string;
  professionName: string;
  color?: string;
  resourceName?: string;
  resourceType?: string;
}

export function LeadCaptureInline({
  profession,
  professionName,
  color = "#3b82f6",
  resourceName = "Shift Survival Checklist",
  resourceType = "shift-survival-checklist",
}: LeadCaptureInlineProps) {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/new-grad/lead-capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, resourceType, resourceName, profession }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "Check your email for the download link!");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Connection error. Please try again.");
    }
  }

  return (
    <section className="py-16" data-testid="section-lead-capture">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: color + "10" }}>
          <Download className="w-10 h-10 mx-auto mb-4" style={{ color }} />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Get Your Free {resourceName}</h2>
          <p className="text-gray-600 mb-6 max-w-lg mx-auto">
            Download our free {resourceName.toLowerCase()} designed specifically for new {professionName} graduates. Enter your email below.
          </p>

          {status === "success" ? (
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-50 border border-green-200 rounded-xl" data-testid="text-lead-capture-success">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-700">{message}</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  placeholder={t("components.newGradLeadCapture.enterYourEmail")}
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (status === "error") setStatus("idle"); }}
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
                  data-testid="input-lead-capture-email"
                />
              </div>
              <button
                type="submit"
                disabled={status === "loading"}
                className="h-11 px-6 rounded-xl text-white font-semibold text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ backgroundColor: color }}
                data-testid="button-lead-capture-submit"
              >
                {status === "loading" ? "Sending..." : "Get Free Download"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {status === "error" && (
            <p className="text-xs text-red-500 mt-2" data-testid="text-lead-capture-error">{message}</p>
          )}

          <p className="text-xs text-gray-400 mt-4">
            By subscribing, you agree to receive career resources from NurseNest. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
}

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  profession: string;
  professionName: string;
  color?: string;
  resourceName?: string;
  resourceType?: string;
}

export function LeadCaptureModal({
  isOpen,
  onClose,
  profession,
  professionName,
  color = "#3b82f6",
  resourceName = "Study Guide",
  resourceType = "study-guide",
}: LeadCaptureModalProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/new-grad/lead-capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, resourceType, resourceName, profession }),
      });
      if (res.ok) {
        setStatus("success");
        setMessage("Check your email!");
        setEmail("");
        setTimeout(onClose, 2000);
      } else {
        setStatus("error");
        setMessage("Something went wrong.");
      }
    } catch {
      setStatus("error");
      setMessage("Connection error.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" data-testid="modal-lead-capture">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600" data-testid="button-close-modal">{t("components.newGradLeadCapture.times")}</button>
        <Download className="w-10 h-10 mb-4" style={{ color }} />
        <h3 className="text-xl font-bold text-gray-900 mb-2">Download Free {resourceName}</h3>
        <p className="text-sm text-gray-600 mb-4">Get instant access to our {resourceName.toLowerCase()} for {professionName} graduates.</p>

        {status === "success" ? (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-sm font-medium">{message}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              placeholder={t("components.newGradLeadCapture.yourEmailAddress")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-gray-200 focus:border-blue-400 outline-none text-sm"
              data-testid="input-modal-email"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full h-11 rounded-xl text-white font-semibold text-sm"
              style={{ backgroundColor: color }}
              data-testid="button-modal-submit"
            >
              {status === "loading" ? "Sending..." : "Download Now"}
            </button>
            {status === "error" && <p className="text-xs text-red-500">{message}</p>}
          </form>
        )}
      </div>
    </div>
  );
}
