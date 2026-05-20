import { useState } from "react";
import { Mail, CheckCircle, Loader2, ArrowRight, BookOpen, Brain, FileText, Download, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";

import { useI18n } from "@/lib/i18n";
interface ChecklistGateProps {
  title?: string;
  description?: string;
  checklistName?: string;
  className?: string;
}

export function ChecklistGate({
  title = "Download Your Shift Survival Checklist",
  description = "A printable day-by-day checklist for your first 90 days. Enter your email to get instant access.",
  checklistName = "shift-survival-checklist",
  className = "",
}: ChecklistGateProps) {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/email-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: `checklist-${checklistName}` }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className={`bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center ${className}`} data-testid="checklist-gate-success">
        <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
        <h3 className="font-bold text-emerald-900 mb-1">{t("components.marketingCta.checkYourInbox")}</h3>
        <p className="text-sm text-emerald-700">{t("components.marketingCta.yourChecklistIsOnThe")}</p>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 ${className}`} data-testid="checklist-gate">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
          <Download className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 mb-1" data-testid="text-checklist-title">{title}</h3>
          <p className="text-sm text-gray-600 mb-4">{description}</p>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              type="email"
              placeholder={t("components.marketingCta.youremailcom")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 text-sm bg-white"
              required
              data-testid="input-checklist-email"
            />
            <Button type="submit" disabled={status === "loading"} className="shrink-0 gap-2" data-testid="button-checklist-download">
              {status === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Download className="w-4 h-4" /> {t("components.marketingCta.getItFree")}</>}
            </Button>
          </form>
          {status === "error" && <p className="text-xs text-red-500 mt-2" data-testid="text-checklist-error">{t("components.marketingCta.somethingWentWrongPleaseTry")}</p>}
          <p className="text-xs text-gray-400 mt-2">{t("components.marketingCta.noSpamUnsubscribeAnytime")}</p>
        </div>
      </div>
    </div>
  );
}

interface FlashcardCTAProps {
  profession?: string;
  href?: string;
  variant?: "inline" | "sidebar" | "banner";
  className?: string;
}

export function FlashcardCTA({
  profession = "nursing",
  href = "/flashcards",
  variant = "inline",
  className = "",
}: FlashcardCTAProps) {
  if (variant === "sidebar") {
    return (
      <div className={`bg-white border border-gray-200 rounded-2xl p-5 shadow-sm ${className}`} data-testid="flashcard-cta-sidebar">
        <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center mb-3">
          <Brain className="w-5 h-5 text-indigo-600" />
        </div>
        <h3 className="font-bold text-gray-900 mb-1 text-sm">{t("components.marketingCta.freeFlashcards")}</h3>
        <p className="text-xs text-gray-500 mb-4">
          Start reviewing {profession} concepts with our spaced repetition flashcard system. Free access to starter decks.
        </p>
        <Link href={href}>
          <Button size="sm" className="w-full gap-2" data-testid="button-flashcard-cta">
            <Brain className="w-4 h-4" /> Try Free Flashcards
          </Button>
        </Link>
      </div>
    );
  }

  if (variant === "banner") {
    return (
      <div className={`bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-6 ${className}`} data-testid="flashcard-cta-banner">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
              <Brain className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{t("components.marketingCta.studyWithFreeFlashcards")}</h3>
              <p className="text-sm text-gray-500">Spaced repetition for {profession} concepts</p>
            </div>
          </div>
          <Link href={href}>
            <Button className="gap-2 shrink-0" data-testid="button-flashcard-cta">
              Start Reviewing <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-4 p-4 bg-indigo-50 border border-indigo-100 rounded-xl ${className}`} data-testid="flashcard-cta-inline">
      <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
        <Brain className="w-5 h-5 text-indigo-600" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-900 text-sm">Free {profession} Flashcards</h4>
        <p className="text-xs text-gray-500">{t("components.marketingCta.reviewKeyConceptsWithSpaced")}</p>
      </div>
      <Link href={href}>
        <Button size="sm" variant="outline" className="shrink-0 gap-1" data-testid="button-flashcard-cta">
          Try Free <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </Link>
    </div>
  );
}

interface PracticeQuestionCTAProps {
  profession?: string;
  href?: string;
  variant?: "inline" | "sidebar" | "banner";
  className?: string;
}

export function PracticeQuestionCTA({
  profession = "nursing",
  href = "/free-practice",
  variant = "inline",
  className = "",
}: PracticeQuestionCTAProps) {
  if (variant === "sidebar") {
    return (
      <div className={`bg-white border border-gray-200 rounded-2xl p-5 shadow-sm ${className}`} data-testid="practice-q-cta-sidebar">
        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center mb-3">
          <FileText className="w-5 h-5 text-emerald-600" />
        </div>
        <h3 className="font-bold text-gray-900 mb-1 text-sm">{t("components.marketingCta.freePracticeQuestions")}</h3>
        <p className="text-xs text-gray-500 mb-4">
          Test your {profession} knowledge with free practice questions. Detailed rationales included.
        </p>
        <Link href={href}>
          <Button size="sm" variant="outline" className="w-full gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50" data-testid="button-practice-q-cta">
            <FileText className="w-4 h-4" /> Start Practicing
          </Button>
        </Link>
      </div>
    );
  }

  if (variant === "banner") {
    return (
      <div className={`bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-6 ${className}`} data-testid="practice-q-cta-banner">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
              <FileText className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{t("components.marketingCta.freePracticeQuestions2")}</h3>
              <p className="text-sm text-gray-500">Test your {profession} knowledge with rationales</p>
            </div>
          </div>
          <Link href={href}>
            <Button className="gap-2 shrink-0 bg-emerald-600 hover:bg-emerald-700" data-testid="button-practice-q-cta">
              Start Practicing <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-4 p-4 bg-emerald-50 border border-emerald-100 rounded-xl ${className}`} data-testid="practice-q-cta-inline">
      <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
        <FileText className="w-5 h-5 text-emerald-600" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-900 text-sm">Free {profession} Practice Questions</h4>
        <p className="text-xs text-gray-500">{t("components.marketingCta.examstyleQuestionsWithDetailedRationales")}</p>
      </div>
      <Link href={href}>
        <Button size="sm" variant="outline" className="shrink-0 gap-1 border-emerald-200 text-emerald-700 hover:bg-emerald-50" data-testid="button-practice-q-cta">
          Try Free <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </Link>
    </div>
  );
}
