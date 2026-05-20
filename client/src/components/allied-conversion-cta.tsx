import { Link } from "wouter";
import { Play, Unlock, ClipboardCheck, Download, HelpCircle, Users, ArrowRight, Sparkles, Target, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

const ICON_MAP: Record<string, any> = {
  "play": Play,
  "lock-open": Unlock,
  "clipboard-check": ClipboardCheck,
  "download": Download,
  "help-circle": HelpCircle,
  "users": Users,
  "sparkles": Sparkles,
  "target": Target,
  "trophy": Trophy,
};

const PROFESSION_CTA_CONFIG: Record<string, { primaryCta: string; primaryHref: string; secondaryCta: string; secondaryHref: string }> = {
  "pharmacy-tech": { primaryCta: "Start Pharmacy Tech Practice", primaryHref: "/allied-health/qbank?career=pharmacy-tech", secondaryCta: "Try a Free Mock Exam", secondaryHref: "/allied-health/pharmacy-technician/mock-exams" },
  "respiratory-therapy": { primaryCta: "Start RRT Practice", primaryHref: "/allied-health/qbank?career=rrt", secondaryCta: "Try a Free Mock Exam", secondaryHref: "/allied-health/rrt/mock-exams" },
  "paramedic": { primaryCta: "Start Paramedic Practice", primaryHref: "/allied-health/qbank?career=paramedic", secondaryCta: "Try a Free Mock Exam", secondaryHref: "/allied-health/paramedic/mock-exams" },
  "medical-lab-technologist": { primaryCta: "Start MLT Practice", primaryHref: "/allied-health/qbank?career=mlt", secondaryCta: "Try a Free Mock Exam", secondaryHref: "/allied-health/mlt/mock-exams" },
  "medical-imaging": { primaryCta: "Start Imaging Practice", primaryHref: "/allied-health/qbank?career=imaging", secondaryCta: "Try a Free Mock Exam", secondaryHref: "/allied-health/imaging/mock-exams" },
  "ultrasound": { primaryCta: "Start Ultrasound Practice", primaryHref: "/allied-health/qbank?career=imaging", secondaryCta: "Explore Study Resources", secondaryHref: "/allied-health/imaging" },
  "physical-therapy-assistant": { primaryCta: "Start PTA Practice", primaryHref: "/allied-health/qbank?career=physical-therapy", secondaryCta: "Explore Study Resources", secondaryHref: "/allied-health/physiotherapy-assistant" },
  "occupational-therapy-assistant": { primaryCta: "Start OTA Practice", primaryHref: "/allied-health/qbank?career=occupational-therapy", secondaryCta: "Explore Study Resources", secondaryHref: "/allied-health/occupational-therapy-assistant" },
};

interface AlliedConversionCtaProps {
  profession: string;
  variant?: "hero" | "inline" | "banner" | "floating" | "card";
  abVariant?: "A" | "B";
  className?: string;
}

export function AlliedConversionCta({
  profession,
  variant = "inline",
  abVariant = "A",
  className = "",
}: AlliedConversionCtaProps) {
  const config = PROFESSION_CTA_CONFIG[profession] || {
    primaryCta: "Start Practicing Now",
    primaryHref: "/careers",
    secondaryCta: "Explore Resources",
    secondaryHref: "/careers",
  };

  const trackCtaClick = (ctaType: string) => {
    try {
      const body = JSON.stringify({
        eventType: "cta_click",
        profession,
        page: window.location.pathname,
        sessionId: sessionStorage.getItem("allied_session_id") || `as_${Date.now()}`,
        metadata: { variant, abVariant, ctaType },
      });
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/allied-marketing/track-event", new Blob([body], { type: "application/json" }));
      } else {
        fetch("/api/allied-marketing/track-event", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }).catch(() => {});
      }
    } catch {}
  };

  if (variant === "hero") {
    return (
      <div className={`py-12 px-6 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 rounded-2xl text-center text-white ${className}`} data-testid="allied-cta-hero">
        <Sparkles className="w-8 h-8 mx-auto mb-4 text-yellow-300" />
        <h2 className="text-2xl md:text-3xl font-bold mb-3" data-testid="text-cta-headline">
          {abVariant === "A" ? "Ready to Ace Your Exam?" : "Your Certification Journey Starts Here"}
        </h2>
        <p className="text-indigo-100 mb-6 max-w-md mx-auto" data-testid="text-cta-subheadline">
          {abVariant === "A"
            ? "Join thousands of students who passed their certification exam with NurseNest."
            : "Practice questions, mock exams, and study guides designed for your success."
          }
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href={config.primaryHref} onClick={() => trackCtaClick("primary")}>
            <Button size="lg" className="bg-white text-indigo-700 hover:bg-indigo-50 font-semibold px-8 shadow-lg" data-testid="button-cta-primary">
              <Play className="w-4 h-4 mr-2" />
              {config.primaryCta}
            </Button>
          </Link>
          <Link href={config.secondaryHref} onClick={() => trackCtaClick("secondary")}>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 font-medium px-6" data-testid="button-cta-secondary">
              {config.secondaryCta}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (variant === "banner") {
    return (
      <div className={`flex flex-col sm:flex-row items-center gap-4 p-4 bg-indigo-50 border border-indigo-100 rounded-xl ${className}`} data-testid="allied-cta-banner">
        <div className="flex items-center gap-2 flex-1">
          <Target className="w-5 h-5 text-indigo-600 shrink-0" />
          <span className="text-sm font-medium text-gray-800">
            {abVariant === "A" ? "Start practicing now — free practice questions available." : "Unlock your full question bank and ace your exam."}
          </span>
        </div>
        <Link href={config.primaryHref} onClick={() => trackCtaClick("primary")}>
          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 whitespace-nowrap" data-testid="button-cta-primary">
            {config.primaryCta}
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        </Link>
      </div>
    );
  }

  if (variant === "floating") {
    return (
      <div className={`fixed bottom-4 right-4 z-50 bg-white border border-indigo-200 rounded-2xl p-4 shadow-xl max-w-xs ${className}`} data-testid="allied-cta-floating">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
            <Trophy className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-1">
              {abVariant === "A" ? "Start Your Free Practice" : "Ready to Level Up?"}
            </p>
            <p className="text-xs text-gray-500 mb-3">
              {abVariant === "A" ? "Free practice questions — no sign-up required." : "Unlock premium study tools and mock exams."}
            </p>
            <Link href={config.primaryHref} onClick={() => trackCtaClick("primary")}>
              <Button size="sm" className="w-full bg-indigo-600 hover:bg-indigo-700 text-xs" data-testid="button-cta-primary">
                {config.primaryCta}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className={`bg-white border border-gray-200 rounded-2xl p-6 shadow-sm text-center ${className}`} data-testid="allied-cta-card">
        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-4">
          <ClipboardCheck className="w-6 h-6 text-indigo-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2" data-testid="text-cta-headline">
          {abVariant === "A" ? "Practice Makes Perfect" : "Ace Your Certification Exam"}
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          {abVariant === "A"
            ? "Start with free practice questions and track your progress."
            : "Comprehensive exam prep with practice tests and detailed rationales."
          }
        </p>
        <div className="space-y-2">
          <Link href={config.primaryHref} onClick={() => trackCtaClick("primary")}>
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700" data-testid="button-cta-primary">
              <Play className="w-4 h-4 mr-2" />
              {config.primaryCta}
            </Button>
          </Link>
          <Link href={config.secondaryHref} onClick={() => trackCtaClick("secondary")}>
            <Button variant="outline" className="w-full" data-testid="button-cta-secondary">
              {config.secondaryCta}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col sm:flex-row items-center gap-3 ${className}`} data-testid="allied-cta-inline">
      <Link href={config.primaryHref} onClick={() => trackCtaClick("primary")}>
        <Button className="bg-indigo-600 hover:bg-indigo-700" data-testid="button-cta-primary">
          <Play className="w-4 h-4 mr-2" />
          {config.primaryCta}
        </Button>
      </Link>
      <Link href={config.secondaryHref} onClick={() => trackCtaClick("secondary")}>
        <Button variant="outline" data-testid="button-cta-secondary">
          {config.secondaryCta}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </Link>
    </div>
  );
}
