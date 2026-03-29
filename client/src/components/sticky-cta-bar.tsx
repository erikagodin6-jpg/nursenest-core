import { useState, useCallback } from "react";
import { useLocation } from "wouter";
import { LocaleLink } from "@/lib/LocaleLink";
import { useAuth } from "@/lib/auth";
import { X, ArrowRight, Sparkles, BookOpen, FileText, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useI18n } from "@/lib/i18n";
const SESSION_DISMISS_KEY = "nursenest-cta-bar-session-dismissed";

type CtaContext = "questions" | "content" | "blueprint" | "tools" | "default";

function getCtaContext(pathname: string): CtaContext {

  const questionPatterns = [
    "/question", "/qbank", "/test-bank", "/mock-exam",
    "/practice-questions", "/free-practice", "/free-demo-exam",
    "/adaptive-study", "/quick-study",
  ];
  if (questionPatterns.some((p) => pathname.startsWith(p))) return "questions";

  const blueprintPatterns = [
    "/rexpn-", "/nclex-", "/allied-", "/exam-blueprint",
  ];
  if (blueprintPatterns.some((p) => pathname.includes(p))) return "blueprint";

  const toolPatterns = [
    "/med-math", "/lab-values", "/si-to-conventional",
    "/anatomy", "/pharmacology",
  ];
  if (toolPatterns.some((p) => pathname.startsWith(p))) return "tools";

  const contentPatterns = [
    "/lesson", "/flashcard", "/lecture", "/clinical-clarity",
    "/medication-mastery", "/osce", "/content",
    "/blog", "/glossary", "/deck",
  ];
  if (contentPatterns.some((p) => pathname.startsWith(p))) return "content";

  return "default";
}

const CTA_CONFIG: Record<CtaContext, { text: string; buttonText: string; href: string; icon: typeof Sparkles }> = {
  questions: { text: "Unlock Full Test Bank — 2,000+ Practice Questions", buttonText: "View Plans", href: "/pricing", icon: FileText },
  content: { text: "Start Free Practice — Study Smarter Today", buttonText: "Get Started", href: "/start-free", icon: BookOpen },
  blueprint: { text: "Practice Exam Questions Aligned to This Blueprint", buttonText: "Start Free", href: "/start-free", icon: GraduationCap },
  tools: { text: "Get Full Access to All Study Tools", buttonText: "Explore Plans", href: "/pricing", icon: Sparkles },
  default: { text: "Get Exam Ready — Try Free Practice", buttonText: "Start Free", href: "/start-free", icon: Sparkles },
};

const HIDDEN_ROUTES = ["/login", "/pricing", "/start-free", "/subscribe", "/admin", "/dashboard", "/profile", "/reports"];

export function StickyCtaBar() {
  const { t } = useI18n();
  const { user, effectiveTier, isAdmin } = useAuth();
  const [location] = useLocation();
  const [dismissed, setDismissed] = useState(() => {
    try {
      return sessionStorage.getItem(SESSION_DISMISS_KEY) === "true";
    } catch {
      return false;
    }
  });

  const handleDismiss = useCallback(() => {
    setDismissed(true);
    try {
      sessionStorage.setItem(SESSION_DISMISS_KEY, "true");
    } catch {}
  }, []);

  const isPaid = user && effectiveTier && effectiveTier !== "free";
  if (isPaid || isAdmin) return null;
  if (dismissed) return null;
  if (HIDDEN_ROUTES.some((r) => location.startsWith(r))) return null;

  const ctx = getCtaContext(location);
  const { text, buttonText, href, icon: Icon } = CTA_CONFIG[ctx];

  return (
    <div
      className="sticky top-0 z-[9998] w-full bg-gradient-to-r from-primary/95 to-blue-600/95 backdrop-blur-sm text-white shadow-sm"
      data-testid="sticky-cta-bar"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 px-4 py-2 relative">
        <Icon className="w-4 h-4 flex-shrink-0 hidden sm:block" />
        <span className="text-sm font-medium truncate" data-testid="text-cta-message">
          {text}
        </span>
        <LocaleLink href={href}>
          <Button
            size="sm"
            variant="secondary"
            className="rounded-full px-4 py-1 h-7 text-xs font-semibold bg-white text-primary hover:bg-white/90 shadow-sm"
            data-testid="button-cta-bar-action"
          >
            {buttonText} <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </LocaleLink>
        <button
          onClick={handleDismiss}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/20 transition-colors"
          aria-label={t("components.stickyCtaBar.dismiss")}
          data-testid="button-cta-bar-dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
