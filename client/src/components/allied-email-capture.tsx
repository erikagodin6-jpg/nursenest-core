import { useState } from "react";
import { Mail, CheckCircle, Loader2, BookOpen, FileText, ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useI18n } from "@/lib/i18n";
const PROFESSION_CONFIG: Record<string, { title: string; subtitle: string; buttonText: string; icon: string }> = {
  "pharmacy-tech": {
    title: "Get Free Pharmacy Tech Practice Questions",
    subtitle: "Weekly PTCB/ExCPT exam prep tips, dosage calculation practice, and clinical pearls.",
    buttonText: "Get Free Questions",
    icon: "pill",
  },
  "respiratory-therapy": {
    title: "Get Free Respiratory Therapy Practice Questions",
    subtitle: "Weekly RRT/TMC exam prep, ABG interpretation tips, and ventilator management guides.",
    buttonText: "Get Free Questions",
    icon: "wind",
  },
  "paramedic": {
    title: "Get Free Paramedic Practice Questions",
    subtitle: "Weekly NREMT exam prep, trauma assessment tips, and prehospital care guides.",
    buttonText: "Get Free Questions",
    icon: "ambulance",
  },
  "medical-lab-technologist": {
    title: "Get Free MLT Practice Questions",
    subtitle: "Weekly ASCP exam prep, lab value interpretation, and hematology case studies.",
    buttonText: "Get Free Questions",
    icon: "flask",
  },
  "medical-imaging": {
    title: "Get Free Radiography Practice Questions",
    subtitle: "Weekly ARRT/CAMRT exam prep, positioning guides, and image quality tips.",
    buttonText: "Get Free Questions",
    icon: "scan",
  },
  "ultrasound": {
    title: "Get Free Ultrasound Practice Questions",
    subtitle: "Weekly ARDMS exam prep, scanning protocols, and sonographic anatomy reviews.",
    buttonText: "Get Free Questions",
    icon: "monitor",
  },
  "physical-therapy-assistant": {
    title: "Get Free PTA Practice Questions",
    subtitle: "Weekly NPTE exam prep, therapeutic exercise guides, and modality reviews.",
    buttonText: "Get Free Questions",
    icon: "activity",
  },
  "occupational-therapy-assistant": {
    title: "Get Free OTA Practice Questions",
    subtitle: "Weekly NBCOT exam prep, ADL assessment guides, and intervention strategies.",
    buttonText: "Get Free Questions",
    icon: "hand",
  },
};

interface AlliedEmailCaptureProps {
  profession: string;
  variant?: "card" | "banner" | "inline" | "sidebar";
  source?: string;
  className?: string;
}

export function AlliedEmailCapture({
  profession,
  variant = "card",
  source = "allied_page",
  className = "",
}: AlliedEmailCaptureProps) {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const config = PROFESSION_CONFIG[profession] || {
    title: "Get Free Practice Questions",
    subtitle: "Weekly exam prep tips and clinical pearls delivered to your inbox.",
    buttonText: "Subscribe",
    icon: "book",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/allied-marketing/email-capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, profession, source, trigger: "email_capture" }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
        trackEmailCapture(profession, source);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className={`flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl ${className}`} data-testid="allied-email-success">
        <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
        <p className="text-sm text-emerald-800 font-medium">{t("components.alliedEmailCapture.youAreSubscribedCheckYour")}</p>
      </div>
    );
  }

  if (variant === "banner") {
    return (
      <div className={`bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50 border border-indigo-100 rounded-2xl p-6 ${className}`} data-testid="allied-email-banner">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
              <Mail className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">{config.title}</h3>
              <p className="text-xs text-gray-500">{config.subtitle}</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="flex gap-2 w-full sm:w-auto">
            <Input
              type="email"
              placeholder={t("components.alliedEmailCapture.youremailcom")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-9 text-sm min-w-[200px]"
              required
              data-testid="input-allied-email"
            />
            <Button type="submit" size="sm" disabled={status === "loading"} className="shrink-0 bg-indigo-600 hover:bg-indigo-700" data-testid="button-allied-subscribe">
              {status === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : config.buttonText}
            </Button>
          </form>
        </div>
        {status === "error" && <p className="text-xs text-red-500 mt-2" data-testid="text-allied-signup-error">{t("components.alliedEmailCapture.somethingWentWrongPleaseTry")}</p>}
      </div>
    );
  }

  if (variant === "sidebar") {
    return (
      <div className={`bg-white border border-gray-200 rounded-xl p-5 shadow-sm ${className}`} data-testid="allied-email-sidebar">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="w-5 h-5 text-indigo-600" />
          <h3 className="font-semibold text-gray-900 text-sm">{config.title}</h3>
        </div>
        <p className="text-xs text-gray-500 mb-3">{config.subtitle}</p>
        <form onSubmit={handleSubmit} className="space-y-2">
          <Input
            type="email"
            placeholder={t("components.alliedEmailCapture.youremailcom2")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-9 text-sm"
            required
            data-testid="input-allied-email"
          />
          <Button type="submit" size="sm" disabled={status === "loading"} className="w-full bg-indigo-600 hover:bg-indigo-700" data-testid="button-allied-subscribe">
            {status === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : config.buttonText}
          </Button>
        </form>
        {status === "error" && <p className="text-xs text-red-500 mt-1">{t("components.alliedEmailCapture.somethingWentWrong")}</p>}
        <p className="text-xs text-gray-400 mt-2">{t("components.alliedEmailCapture.noSpamUnsubscribeAnytime")}</p>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`} data-testid="allied-email-inline">
        <Input
          type="email"
          placeholder={t("components.alliedEmailCapture.youremailcom3")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-10 text-sm"
          required
          data-testid="input-allied-email"
        />
        <Button type="submit" disabled={status === "loading"} className="shrink-0 bg-indigo-600 hover:bg-indigo-700" data-testid="button-allied-subscribe">
          {status === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : config.buttonText}
        </Button>
      </form>
    );
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-2xl p-6 shadow-sm ${className}`} data-testid="allied-email-card">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{config.title}</h3>
          <p className="text-sm text-gray-500">{config.subtitle}</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="email"
          placeholder={t("components.alliedEmailCapture.youremailcom4")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-10 text-sm"
          required
          data-testid="input-allied-email"
        />
        <Button type="submit" disabled={status === "loading"} className="shrink-0 bg-indigo-600 hover:bg-indigo-700" data-testid="button-allied-subscribe">
          {status === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : config.buttonText}
        </Button>
      </form>
      {status === "error" && <p className="text-xs text-red-500 mt-2">{t("components.alliedEmailCapture.somethingWentWrongPleaseTry2")}</p>}
      <p className="text-xs text-gray-400 mt-2">{t("components.alliedEmailCapture.noSpamUnsubscribeAnytime2")}</p>
    </div>
  );
}

function trackEmailCapture(profession: string, source: string) {
  try {
    const body = JSON.stringify({
      eventType: "email_capture",
      profession,
      page: window.location.pathname,
      sessionId: sessionStorage.getItem("allied_session_id") || `as_${Date.now()}`,
      metadata: { source },
    });
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/allied-marketing/track-event", new Blob([body], { type: "application/json" }));
    } else {
      fetch("/api/allied-marketing/track-event", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }).catch(() => {});
    }
  } catch {}
}
