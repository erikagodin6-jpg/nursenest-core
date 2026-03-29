import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  PartyPopper, Clock, Heart, CalendarClock, X, ArrowRight,
  CheckCircle2, BookOpen, GraduationCap, Briefcase, FileText,
  Stethoscope, Target, Brain, Sparkles, RefreshCw, Calendar,
  ChevronRight, Star, Shield, TrendingUp, Loader2
} from "lucide-react";

interface PostExamFollowupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (status: string) => void;
}

export function PostExamFollowupModal({ isOpen, onClose, onSubmit }: PostExamFollowupModalProps) {
  const { t } = useI18n();
  const options = [
    {
      id: "passed",
      label: "I passed!",
      icon: PartyPopper,
      color: "text-emerald-600",
      bg: "bg-emerald-50 hover:bg-emerald-100 border-emerald-200",
      description: "Congratulations are in order!",
    },
    {
      id: "waiting",
      label: "Waiting for results",
      icon: Clock,
      color: "text-blue-600",
      bg: "bg-blue-50 hover:bg-blue-100 border-blue-200",
      description: "Results aren't in yet",
    },
    {
      id: "didnt_pass",
      label: "I didn't pass this time",
      icon: Heart,
      color: "text-amber-600",
      bg: "bg-amber-50 hover:bg-amber-100 border-amber-200",
      description: "We're here to help you succeed",
    },
    {
      id: "postponed",
      label: "I postponed my exam",
      icon: CalendarClock,
      color: "text-purple-600",
      bg: "bg-purple-50 hover:bg-purple-100 border-purple-200",
      description: "No problem — let's adjust your plan",
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md" data-testid="post-exam-modal">
        <DialogHeader>
          <DialogTitle className="text-xl text-center" data-testid="text-post-exam-title">
            How did your exam go?
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-muted-foreground">
            We'd love to know how things went so we can support your next steps.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2.5 mt-2">
          {options.map((opt) => {
            const Icon = opt.icon;
            return (
              <button
                key={opt.id}
                className={`w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all ${opt.bg}`}
                onClick={() => onSubmit(opt.id)}
                data-testid={`button-exam-result-${opt.id}`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${opt.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-medium text-sm">{opt.label}</p>
                  <p className="text-xs text-muted-foreground">{opt.description}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            );
          })}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full mt-2 text-muted-foreground"
          onClick={() => onSubmit("skipped")}
          data-testid="button-exam-result-skip"
        >
          Skip for now
        </Button>
      </DialogContent>
    </Dialog>
  );
}

interface NewGradTransitionCardProps {
  user: any;
  careerType?: string;
}

export function NewGradTransitionCard({ user, careerType }: NewGradTransitionCardProps) {
  const [, navigate] = useLocation();
  const isNursing = !careerType || careerType === "nursing";

  const resources = isNursing ? [
    { label: "Clinical Survival Guide", icon: Stethoscope, desc: "Navigate your first shifts with confidence" },
    { label: "Charting & Documentation", icon: FileText, desc: "Master EHR documentation from day one" },
    { label: "Patient Prioritization", icon: Target, desc: "Learn to manage multiple patients safely" },
    { label: "Interview & Resume Prep", icon: Briefcase, desc: "Land your dream nursing position" },
    { label: "First-Year Transition", icon: GraduationCap, desc: "What to expect in your first year" },
  ] : [
    { label: "Clinical Onboarding Guide", icon: Stethoscope, desc: "Start your clinical role with confidence" },
    { label: "Documentation Best Practices", icon: FileText, desc: "Professional documentation from day one" },
    { label: "Workload Management", icon: Target, desc: "Prioritize and manage your caseload" },
    { label: "Interview & Resume Prep", icon: Briefcase, desc: "Stand out in your job search" },
    { label: "First-Year Success Guide", icon: GraduationCap, desc: "Thrive in your new career" },
  ];

  return (
    <div data-testid="widget-content-new-grad-transition">
      <div className="text-center mb-5">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 mb-3 shadow-lg shadow-emerald-200">
          <PartyPopper className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-lg font-bold text-foreground" data-testid="text-congrats-heading">
          Congratulations, {user?.username || "Graduate"}!
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          {isNursing
            ? "You've earned your license — welcome to the profession! Here's what comes next."
            : "You've passed your exam — welcome to your new career! Here's what comes next."}
        </p>
      </div>

      <div className="space-y-2 mb-4">
        {resources.map((r, i) => {
          const Icon = r.icon;
          return (
            <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg border border-emerald-100 bg-emerald-50/40" data-testid={`new-grad-resource-${i}`}>
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <Icon className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{r.label}</p>
                <p className="text-xs text-muted-foreground">{r.desc}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border-2 border-dashed border-emerald-300 bg-gradient-to-br from-emerald-50 to-teal-50 p-4 mb-4" data-testid="new-grad-offer-card">
        <div className="flex items-center gap-2 mb-2">
          <Star className="h-4 w-4 text-amber-500" />
          <p className="text-sm font-bold text-emerald-800">{t("components.postExamFollowup.newGradSpecialOffer")}</p>
        </div>
        <p className="text-xs text-emerald-700 mb-3">
          Get early access to our New Grad resources at a special rate.
          Available for a limited time only.
        </p>
        <div className="flex gap-2">
          <Button
            size="sm"
            className="flex-1 bg-emerald-600 hover:bg-emerald-700"
            onClick={() => navigate("/pricing")}
            data-testid="button-claim-new-grad-offer"
          >
            <Sparkles className="h-3.5 w-3.5 mr-1" /> Explore New Grad Plan
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
            data-testid="button-maybe-later-offer"
          >
            Maybe Later
          </Button>
        </div>
      </div>
    </div>
  );
}

interface RecoveryPlanCardProps {
  user: any;
  readinessData?: {
    topWeakDomains: string[];
    weaknessVector: Record<string, number>;
    readinessScore: number;
    passProbability: number;
  };
  weakAreas?: string[];
}

export function RecoveryPlanCard({ user, readinessData, weakAreas: initialWeakAreas }: RecoveryPlanCardProps) {
  const [, navigate] = useLocation();
  const defaultWeakAreas = readinessData?.topWeakDomains || initialWeakAreas || [];
  const [selectedAreas, setSelectedAreas] = useState<string[]>(defaultWeakAreas.slice(0, 5));
  const [generating, setGenerating] = useState(false);
  const [planGenerated, setPlanGenerated] = useState(false);

  const allDomains = [
    "Cardiovascular", "Respiratory", "Neurological", "Gastrointestinal",
    "Renal", "Endocrine", "Hematology", "Musculoskeletal",
    "Maternity", "Pediatrics", "Mental Health", "Pharmacology",
    "Infection Control", "Safety", "Leadership"
  ];

  const toggleArea = (area: string) => {
    setSelectedAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  const generatePlan = async () => {
    if (selectedAreas.length === 0) return;
    setGenerating(true);
    try {
      const res = await fetch("/api/post-exam/generate-recovery-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-user-id": user.id },
        body: JSON.stringify({ weakAreas: selectedAreas, minutesPerDay: 30 }),
      });
      if (res.ok) {
        setPlanGenerated(true);
      }
    } catch {
    } finally {
      setGenerating(false);
    }
  };

  if (planGenerated) {
    return (
      <div data-testid="widget-content-recovery-plan-generated" className="text-center py-4">
        <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
          <CheckCircle2 className="h-7 w-7 text-blue-600" />
        </div>
        <h3 className="font-bold text-foreground mb-1">{t("components.postExamFollowup.yourRecoveryPlanIsReady")}</h3>
        <p className="text-sm text-muted-foreground mb-4">
          We've created a personalized study plan focused on your areas for improvement.
        </p>
        <Button size="sm" onClick={() => navigate("/study-plan")} data-testid="button-view-recovery-plan">
          <BookOpen className="h-4 w-4 mr-1.5" /> View Your Study Plan
        </Button>
      </div>
    );
  }

  return (
    <div data-testid="widget-content-recovery-plan">
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-5 w-5 text-blue-500" />
          <h3 className="font-bold text-foreground" data-testid="text-recovery-heading">{t("components.postExamFollowup.yourNextSteps")}</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Not passing doesn't define you — it's a stepping stone. Many successful professionals
          needed more than one attempt. Let's build a focused plan based on your performance data.
        </p>
      </div>

      {readinessData && readinessData.readinessScore > 0 && (
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="p-2.5 rounded-lg bg-blue-50 text-center">
            <p className="text-lg font-bold text-blue-700">{readinessData.readinessScore}%</p>
            <p className="text-[10px] text-muted-foreground">{t("components.postExamFollowup.readinessScore")}</p>
          </div>
          <div className="p-2.5 rounded-lg bg-amber-50 text-center">
            <p className="text-lg font-bold text-amber-700">{selectedAreas.length}</p>
            <p className="text-[10px] text-muted-foreground">{t("components.postExamFollowup.focusAreas")}</p>
          </div>
        </div>
      )}

      <div className="mb-4">
        <p className="text-xs font-medium text-muted-foreground mb-2">
          Select the areas you'd like to focus on (pre-filled from your performance data):
        </p>
        <div className="flex flex-wrap gap-1.5">
          {allDomains.map((domain) => (
            <button
              key={domain}
              onClick={() => toggleArea(domain)}
              className={`text-xs px-2.5 py-1.5 rounded-full border transition-all ${
                selectedAreas.includes(domain)
                  ? "bg-blue-100 border-blue-300 text-blue-700 font-medium"
                  : "bg-muted/50 border-transparent text-muted-foreground hover:border-blue-200"
              }`}
              data-testid={`button-toggle-area-${domain.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {selectedAreas.includes(domain) && <CheckCircle2 className="h-3 w-3 inline mr-1" />}
              {domain}
            </button>
          ))}
        </div>
      </div>

      <Button
        size="sm"
        className="w-full"
        onClick={generatePlan}
        disabled={generating || selectedAreas.length === 0}
        data-testid="button-generate-recovery-plan"
      >
        {generating ? (
          <><Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> {t("components.postExamFollowup.generatingPlan")}</>
        ) : (
          <><RefreshCw className="h-4 w-4 mr-1.5" /> {t("components.postExamFollowup.generateRecoveryStudyPlan")}</>
        )}
      </Button>
    </div>
  );
}

interface ResultsPendingCardProps {
  user: any;
  onUpdateResult: () => void;
}

export function ResultsPendingCard({ user, onUpdateResult }: ResultsPendingCardProps) {
  const [, navigate] = useLocation();

  return (
    <div data-testid="widget-content-results-pending">
      <div className="text-center mb-4">
        <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
          <Clock className="h-7 w-7 text-blue-500" />
        </div>
        <h3 className="font-bold text-foreground mb-1" data-testid="text-waiting-heading">{t("components.postExamFollowup.resultsPending")}</h3>
        <p className="text-sm text-muted-foreground">
          Waiting is the hardest part. While you wait, here are some things you can do.
        </p>
      </div>

      <div className="space-y-2 mb-4">
        <button
          className="w-full flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors text-left"
          onClick={() => navigate("/lessons")}
          data-testid="button-light-review"
        >
          <BookOpen className="h-5 w-5 text-blue-500" />
          <div className="flex-1">
            <p className="text-sm font-medium">{t("components.postExamFollowup.lightReview")}</p>
            <p className="text-xs text-muted-foreground">{t("components.postExamFollowup.browseLessonsAtYourOwn")}</p>
          </div>
        </button>
        <button
          className="w-full flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors text-left"
          onClick={() => navigate("/flashcard-study")}
          data-testid="button-revisit-weak-areas"
        >
          <Brain className="h-5 w-5 text-purple-500" />
          <div className="flex-1">
            <p className="text-sm font-medium">{t("components.postExamFollowup.revisitKeyTopics")}</p>
            <p className="text-xs text-muted-foreground">{t("components.postExamFollowup.refreshYourKnowledgeWithFlashcards")}</p>
          </div>
        </button>
        <button
          className="w-full flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors text-left"
          onClick={() => navigate("/new-grad")}
          data-testid="button-preview-next-steps"
        >
          <GraduationCap className="h-5 w-5 text-emerald-500" />
          <div className="flex-1">
            <p className="text-sm font-medium">{t("components.postExamFollowup.previewNextSteps")}</p>
            <p className="text-xs text-muted-foreground">{t("components.postExamFollowup.exploreWhatComesAfterPassing")}</p>
          </div>
        </button>
      </div>

      <Button
        variant="outline"
        size="sm"
        className="w-full"
        onClick={onUpdateResult}
        data-testid="button-update-result-later"
      >
        <TrendingUp className="h-4 w-4 mr-1.5" /> Update Result When Ready
      </Button>
    </div>
  );
}

interface PostponedCountdownCardProps {
  user: any;
  newExamDate?: string | null;
  onDateChange?: () => void;
}

export function PostponedCountdownCard({ user, newExamDate, onDateChange }: PostponedCountdownCardProps) {
  const [, navigate] = useLocation();
  const [dateInput, setDateInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [currentDate, setCurrentDate] = useState(newExamDate || null);

  const examDate = currentDate ? new Date(currentDate) : null;
  const now = new Date();
  const daysRemaining = examDate ? Math.max(0, Math.ceil((examDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))) : null;

  const handleUpdateDate = async () => {
    if (!dateInput) return;
    setSaving(true);
    try {
      const res = await fetch("/api/post-exam/update-exam-date", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-user-id": user.id },
        body: JSON.stringify({ newExamDate: dateInput }),
      });
      if (res.ok) {
        setCurrentDate(dateInput);
        setDateInput("");
        onDateChange?.();
      }
    } catch {
    } finally {
      setSaving(false);
    }
  };

  if (!currentDate) {
    return (
      <div data-testid="widget-content-postponed-no-date" className="text-center py-4">
        <CalendarClock className="h-10 w-10 mx-auto text-purple-500 mb-3" />
        <h3 className="font-bold text-foreground mb-1">{t("components.postExamFollowup.setYourNewExamDate")}</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Choose a new date and we'll reactivate your study plan.
        </p>
        <div className="flex gap-2">
          <input
            type="date"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
            min={new Date(Date.now() + 86400000).toISOString().split("T")[0]}
            className="flex-1 rounded-lg border px-3 py-2 text-sm"
            data-testid="input-new-exam-date"
          />
          <Button
            size="sm"
            onClick={handleUpdateDate}
            disabled={!dateInput || saving}
            data-testid="button-set-exam-date"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Set Date"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="widget-content-postponed-countdown">
      <div className="text-center mb-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-purple-200">
          <Calendar className="h-8 w-8 text-white" />
        </div>
        <p className="text-3xl font-bold text-foreground" data-testid="text-days-remaining">
          {daysRemaining}
        </p>
        <p className="text-sm text-muted-foreground">
          days until your exam ({examDate?.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })})
        </p>
      </div>

      <p className="text-sm text-muted-foreground text-center mb-4">
        Your study plan and all progress have been preserved. Keep going — you've got this!
      </p>

      <div className="flex gap-2">
        <Button
          size="sm"
          className="flex-1"
          onClick={() => navigate("/study-plan")}
          data-testid="button-resume-study-plan"
        >
          <BookOpen className="h-4 w-4 mr-1.5" /> Resume Study Plan
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="flex-1"
          onClick={() => navigate("/mock-exams")}
          data-testid="button-practice-exams"
        >
          Practice Exams
        </Button>
      </div>

      <div className="mt-3">
        <p className="text-xs text-muted-foreground mb-1.5">{t("components.postExamFollowup.needToChangeYourDate")}</p>
        <div className="flex gap-2">
          <input
            type="date"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
            min={new Date(Date.now() + 86400000).toISOString().split("T")[0]}
            className="flex-1 rounded-lg border px-3 py-1.5 text-xs"
            data-testid="input-update-exam-date"
          />
          <Button
            size="sm"
            variant="ghost"
            onClick={handleUpdateDate}
            disabled={!dateInput || saving}
            data-testid="button-update-exam-date"
          >
            {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : "Update"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function usePostExamCheck(userId: string | undefined) {
  const [shouldShowModal, setShouldShowModal] = useState(false);
  const [postExamStatus, setPostExamStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const checkPostExam = useCallback(async () => {
    if (!userId) { setLoading(false); return; }
    try {
      const checkRes = await fetch("/api/post-exam/check", {
        headers: { "x-user-id": userId },
      });
      if (checkRes.ok) {
        const checkData = await checkRes.json();
        if (checkData.shouldShow) {
          setShouldShowModal(true);
        }
      }

      const statusRes = await fetch("/api/post-exam/status", {
        headers: { "x-user-id": userId },
      });
      if (statusRes.ok) {
        const statusData = await statusRes.json();
        if (statusData.hasResult) {
          setPostExamStatus(statusData);
        }
      }
    } catch {
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    checkPostExam();
  }, [checkPostExam]);

  const submitResult = async (status: string) => {
    if (!userId) return;
    try {
      const res = await fetch("/api/post-exam/submit-result", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-user-id": userId },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setShouldShowModal(false);
        const statusRes = await fetch("/api/post-exam/status", {
          headers: { "x-user-id": userId },
        });
        if (statusRes.ok) {
          const statusData = await statusRes.json();
          setPostExamStatus(statusData);
        }
      }
    } catch {
    }
  };

  const reopenModal = () => {
    setShouldShowModal(true);
  };

  return {
    shouldShowModal,
    postExamStatus,
    loading,
    submitResult,
    setShouldShowModal,
    reopenModal,
    refresh: checkPostExam,
  };
}
