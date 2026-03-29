import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  BookOpen,
  Target,
  Stethoscope,
  CheckCircle2,
  ArrowRight,
  GraduationCap,
  Briefcase,
} from "lucide-react";
import { useExitIntent } from "@/hooks/use-exit-intent";
import { useLocation } from "wouter";

import { useI18n } from "@/lib/i18n";
type SubscriptionCategory = "exam_prep" | "new_grad_tips" | "job_alerts" | "general";

interface SectionConfig {
  heading: string;
  description: string;
  defaultCategory: SubscriptionCategory;
  valueProps: { icon: any; text: string }[];
  ctaText: string;
}

const SECTION_CONFIGS: Record<string, SectionConfig> = {
  exam_prep: {
    heading: "Don't leave without your study edge!",
    description: "Get exam prep tips, practice questions, and study strategies sent to your inbox.",
    defaultCategory: "exam_prep",
    valueProps: [
      { icon: Target, text: "Weekly practice questions with detailed rationales" },
      { icon: BookOpen, text: "Study strategies from top-scoring students" },
      { icon: Stethoscope, text: "Clinical pearls to ace your exam" },
    ],
    ctaText: "Get Free Exam Prep Tips",
  },
  new_grad: {
    heading: "Starting your career? We've got your back!",
    description: "Get survival tips, clinical confidence builders, and career advice for new graduates.",
    defaultCategory: "new_grad_tips",
    valueProps: [
      { icon: GraduationCap, text: "New grad survival tips from experienced nurses" },
      { icon: Stethoscope, text: "Clinical confidence builders for your first year" },
      { icon: Briefcase, text: "Career development advice and mentorship resources" },
    ],
    ctaText: "Get New Grad Tips",
  },
  career: {
    heading: "Looking for your next opportunity?",
    description: "Get healthcare job alerts, career tips, and industry insights delivered weekly.",
    defaultCategory: "job_alerts",
    valueProps: [
      { icon: Briefcase, text: "Curated healthcare job alerts in your specialty" },
      { icon: Target, text: "Resume and interview tips for healthcare professionals" },
      { icon: GraduationCap, text: "Career growth strategies and certifications guide" },
    ],
    ctaText: "Get Job Alerts",
  },
  default: {
    heading: "Wait — don't leave empty-handed!",
    description: "Get a personalized study plan and free diagnostic exam sent straight to your inbox.",
    defaultCategory: "general",
    valueProps: [
      { icon: Target, text: "Free diagnostic exam to find your weak areas" },
      { icon: BookOpen, text: "Access to pathophysiology study resources" },
      { icon: Stethoscope, text: "Clinical practice questions with rationales" },
    ],
    ctaText: "Get Your Free Study Plan",
  },
};

function detectSection(pathname: string): string {
  if (pathname.includes("/new-grad") || pathname.includes("survival-guide") || pathname.includes("first-year")) {
    return "new_grad";
  }
  if (pathname.includes("/career") || pathname.includes("how-to-become") || pathname.includes("/job")) {
    return "career";
  }
  if (
    pathname.includes("/lessons") || pathname.includes("/flashcards") || pathname.includes("/qbank") ||
    pathname.includes("/mock-exam") || pathname.includes("/exam") || pathname.includes("/study") ||
    pathname.includes("/diagnostic") || pathname.includes("/med-math") || pathname.includes("/lab-values")
  ) {
    return "exam_prep";
  }
  return "default";
}

const CATEGORY_LABELS: Record<SubscriptionCategory, string> = {
  exam_prep: "Exam Prep Tips",
  new_grad_tips: "New Grad Survival Tips",
  job_alerts: "Healthcare Job Alerts",
  general: "General Updates",
};

export function ExitIntentModal() {
  const { t } = useI18n();
  const { showModal, dismiss, dismissForToday, dismissPermanently } = useExitIntent();
  const [location] = useLocation();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [dontShowToday, setDontShowToday] = useState(false);

  const section = detectSection(location);
  const config = SECTION_CONFIGS[section] || SECTION_CONFIGS.default;

  const [selectedCategories, setSelectedCategories] = useState<SubscriptionCategory[]>([config.defaultCategory]);

  const toggleCategory = (cat: SubscriptionCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

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
          categories: selectedCategories.length > 0 ? selectedCategories : [config.defaultCategory],
          source: `exit_intent_${section}`,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Subscription failed.");
      }
      setStatus("success");
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    }
  }

  return (
    <Dialog open={showModal} onOpenChange={(open) => { if (!open) { dontShowToday ? dismissForToday() : dismiss(); } }}>
      <DialogContent
        className="sm:max-w-md p-0 overflow-hidden"
        data-testid="exit-intent-modal"
      >
        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent px-6 pt-6 pb-4">
          <DialogHeader>
            <DialogTitle
              className="text-xl font-bold text-gray-900"
              data-testid="text-exit-intent-heading"
            >
              {config.heading}
            </DialogTitle>
            <DialogDescription
              className="text-sm text-gray-600 mt-1"
              data-testid="text-exit-intent-description"
            >
              {config.description}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-6 py-4 space-y-4">
          {status === "success" ? (
            <div className="text-center py-4 space-y-3" data-testid="exit-intent-success">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <p className="text-lg font-semibold text-gray-900">{t("components.exitIntentModal.youreIn")}</p>
              <p className="text-sm text-gray-600">
                Check your inbox for your personalized content.
              </p>
              <Button
                variant="outline"
                className="mt-2"
                onClick={() => { dontShowToday ? dismissForToday() : dismiss(); }}
                data-testid="button-exit-intent-close-success"
              >
                Continue Browsing
              </Button>
            </div>
          ) : (
            <>
              <ul className="space-y-2.5">
                {config.valueProps.map((prop) => {
                  const Icon = prop.icon;
                  return (
                    <li key={prop.text} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-sm text-gray-700">{prop.text}</span>
                    </li>
                  );
                })}
              </ul>

              <div className="space-y-2 pt-1" data-testid="exit-intent-categories">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{t("components.exitIntentModal.alsoSubscribeTo")}</p>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(CATEGORY_LABELS) as SubscriptionCategory[]).map((cat) => (
                    <div key={cat} className="flex items-center gap-2">
                      <Checkbox
                        id={`exit-cat-${cat}`}
                        checked={selectedCategories.includes(cat)}
                        onCheckedChange={() => toggleCategory(cat)}
                        data-testid={`checkbox-exit-category-${cat}`}
                      />
                      <Label htmlFor={`exit-cat-${cat}`} className="text-xs cursor-pointer">
                        {CATEGORY_LABELS[cat]}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3 pt-2">
                <Input
                  type="email"
                  placeholder={t("components.exitIntentModal.enterYourEmailAddress")}
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
                  className="h-11"
                  data-testid="input-exit-intent-email"
                  disabled={status === "loading"}
                />
                {status === "error" && (
                  <p className="text-xs text-red-500" data-testid="text-exit-intent-error">
                    {errorMsg}
                  </p>
                )}
                <Button
                  type="submit"
                  className="w-full h-11 text-sm font-medium"
                  disabled={status === "loading"}
                  data-testid="button-exit-intent-submit"
                >
                  {status === "loading" ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Subscribing...
                    </span>
                  ) : (
                    <>
                      {config.ctaText}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>

              <div className="flex items-center justify-center gap-2 py-1">
                <Checkbox
                  id="exit-dont-show-today"
                  checked={dontShowToday}
                  onCheckedChange={(checked) => setDontShowToday(checked === true)}
                  data-testid="checkbox-exit-dont-show-today"
                />
                <Label htmlFor="exit-dont-show-today" className="text-xs text-gray-400 cursor-pointer">
                  Don't show again today
                </Label>
              </div>

              <button
                className="w-full text-center text-xs text-gray-400 hover:text-gray-600 transition-colors py-1"
                onClick={dismissPermanently}
                data-testid="button-exit-intent-dont-show"
              >
                Don't show this again
              </button>

              <p className="text-[10px] text-gray-400 text-center leading-relaxed">
                No spam, ever. Unsubscribe anytime. We respect your privacy.
              </p>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
