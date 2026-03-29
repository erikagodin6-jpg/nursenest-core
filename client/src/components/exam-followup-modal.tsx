import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  PartyPopper, Clock, BookOpen, CalendarClock, X,
  CheckCircle2, Heart, Sparkles, Copy, ArrowRight,
  GraduationCap, Target, RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { useI18n } from "@/lib/i18n";
const WEAK_AREA_OPTIONS = [
  "Pharmacology",
  "Prioritization & Delegation",
  "Fundamentals of Care",
  "Health Assessment",
  "Safety & Infection Control",
  "Mental Health Nursing",
  "Maternal-Child Nursing",
  "Medical-Surgical Nursing",
  "Pathophysiology",
  "Lab Values & Diagnostics",
  "Nutrition & Fluid Balance",
  "Ethics & Legal",
];

type FollowupStep = "ask" | "passed" | "waiting" | "failed" | "postponed" | "postponed_confirmed" | "failed_areas";

interface ExamFollowupModalProps {
  user: any;
  onComplete: (status: string) => void;
}

export function ExamFollowupModal({ user, onComplete }: ExamFollowupModalProps) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<FollowupStep>("ask");
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [newExamDate, setNewExamDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [couponExpiry, setCouponExpiry] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [, navigate] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (!user?.id) return;
    fetch(`/api/exam-followup/status/${user.id}`, { credentials: "include" })
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.shouldShow) {
          setOpen(true);
        }
      })
      .catch(() => {});
  }, [user?.id]);

  const submitResponse = async (status: string, weakAreas?: string[], examDate?: string) => {
    setSubmitting(true);
    try {
      const resp = await fetch("/api/exam-followup/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          examResultStatus: status,
          examWeakAreas: weakAreas || [],
          newExamDate: examDate || null,
        }),
      });
      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({}));
        toast({ title: "Error", description: errData.error || "Could not save your response.", variant: "destructive" });
        return null;
      }
      const data = await resp.json();
      if (data.couponCode) {
        setCouponCode(data.couponCode);
        setCouponExpiry(data.couponExpiresAt);
      }
      return data;
    } catch {
      toast({ title: "Error", description: "Could not save your response. Please try again.", variant: "destructive" });
      return null;
    } finally {
      setSubmitting(false);
    }
  };

  const handleChoice = async (choice: string) => {
    if (choice === "passed") {
      const data = await submitResponse("passed");
      if (data?.success) {
        setStep("passed");
        setShowConfetti(true);
        setCouponCode(data.couponCode);
        setCouponExpiry(data.couponExpiresAt);
      }
    } else if (choice === "waiting") {
      const data = await submitResponse("waiting");
      if (data?.success) setStep("waiting");
    } else if (choice === "failed") {
      setStep("failed_areas");
    } else if (choice === "postponed") {
      setStep("postponed");
    }
  };

  const handleFailedSubmit = async () => {
    const data = await submitResponse("failed", selectedAreas);
    if (data?.success) setStep("failed");
  };

  const handlePostponedSubmit = async () => {
    if (!newExamDate) {
      toast({ title: "Please select a date", description: "Choose your new exam date to continue." });
      return;
    }
    const data = await submitResponse("postponed", [], newExamDate);
    if (data?.success) setStep("postponed_confirmed");
  };

  const handleSkip = async () => {
    await submitResponse("skipped");
    setOpen(false);
    onComplete("skipped");
  };

  const handleClose = () => {
    setOpen(false);
    onComplete(step === "ask" ? "skipped" : step);
  };

  const copyCoupon = () => {
    if (couponCode) {
      navigator.clipboard.writeText(couponCode);
      toast({ title: "Copied!", description: "Coupon code copied to clipboard." });
    }
  };

  const toggleArea = (area: string) => {
    setSelectedAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto" data-testid="modal-exam-followup">
        {showConfetti && <ConfettiOverlay />}

        {step === "ask" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl text-center" data-testid="text-followup-title">
                How Did Your Exam Go? 🎯
              </DialogTitle>
              <DialogDescription className="text-center text-muted-foreground">
                We're cheering for you! Let us know how it went so we can guide your next step.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 mt-4">
              <Button
                className="w-full justify-start gap-3 h-auto py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200"
                variant="outline"
                onClick={() => handleChoice("passed")}
                disabled={submitting}
                data-testid="button-followup-passed"
              >
                <PartyPopper className="w-5 h-5 flex-shrink-0" />
                <div className="text-left">
                  <p className="font-medium">{t("components.examFollowupModal.iPassed")}</p>
                  <p className="text-xs text-emerald-600">{t("components.examFollowupModal.timeToCelebrateAndLaunch")}</p>
                </div>
              </Button>

              <Button
                className="w-full justify-start gap-3 h-auto py-3 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200"
                variant="outline"
                onClick={() => handleChoice("waiting")}
                disabled={submitting}
                data-testid="button-followup-waiting"
              >
                <Clock className="w-5 h-5 flex-shrink-0" />
                <div className="text-left">
                  <p className="font-medium">{t("components.examFollowupModal.waitingForResults")}</p>
                  <p className="text-xs text-blue-600">{t("components.examFollowupModal.illUpdateWhenIHear")}</p>
                </div>
              </Button>

              <Button
                className="w-full justify-start gap-3 h-auto py-3 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200"
                variant="outline"
                onClick={() => handleChoice("failed")}
                disabled={submitting}
                data-testid="button-followup-failed"
              >
                <BookOpen className="w-5 h-5 flex-shrink-0" />
                <div className="text-left">
                  <p className="font-medium">{t("components.examFollowupModal.didntPassThisTime")}</p>
                  <p className="text-xs text-amber-600">{t("components.examFollowupModal.letsBuildAStrongerPlan")}</p>
                </div>
              </Button>

              <Button
                className="w-full justify-start gap-3 h-auto py-3 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200"
                variant="outline"
                onClick={() => handleChoice("postponed")}
                disabled={submitting}
                data-testid="button-followup-postponed"
              >
                <CalendarClock className="w-5 h-5 flex-shrink-0" />
                <div className="text-left">
                  <p className="font-medium">{t("components.examFollowupModal.iPostponedMyExam")}</p>
                  <p className="text-xs text-purple-600">{t("components.examFollowupModal.updateMyExamDate")}</p>
                </div>
              </Button>

              <Button
                variant="ghost"
                className="w-full text-muted-foreground text-sm"
                onClick={handleSkip}
                disabled={submitting}
                data-testid="button-followup-skip"
              >
                Skip for now
              </Button>
            </div>
          </>
        )}

        {step === "passed" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl text-center" data-testid="text-followup-passed-title">
                🎉 Congratulations! You Did It!
              </DialogTitle>
              <DialogDescription className="text-center">
                All your hard work has paid off. You should be incredibly proud!
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                  <GraduationCap className="w-8 h-8 text-emerald-600" />
                </div>
                <p className="text-sm text-muted-foreground">
                  You've completed your exam prep journey. Now it's time to launch your healthcare career!
                </p>
              </div>

              {couponCode && (
                <Card className="border-emerald-200 bg-emerald-50/50">
                  <CardContent className="p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">{t("components.examFollowupModal.yourExclusiveNewGradDiscount")}</p>
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Badge className="text-lg px-4 py-1 bg-emerald-600" data-testid="text-coupon-code">
                        {couponCode}
                      </Badge>
                      <Button size="sm" variant="ghost" onClick={copyCoupon} data-testid="button-copy-coupon">
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-emerald-700">
                      20% off New Grad resources
                      {couponExpiry && ` · Expires ${new Date(couponExpiry).toLocaleDateString()}`}
                    </p>
                  </CardContent>
                </Card>
              )}

              <Button
                className="w-full gap-2"
                onClick={() => { handleClose(); navigate("/newgrad"); }}
                data-testid="button-explore-newgrad"
              >
                <Sparkles className="w-4 h-4" /> Explore New Grad Resources
                <ArrowRight className="w-4 h-4 ml-auto" />
              </Button>
              <Button variant="outline" className="w-full" onClick={handleClose} data-testid="button-followup-close">
                Close
              </Button>
            </div>
          </>
        )}

        {step === "waiting" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl text-center" data-testid="text-followup-waiting-title">
                Hang Tight! 💪
              </DialogTitle>
              <DialogDescription className="text-center">
                Waiting is the hardest part. We're confident in you!
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-sm text-muted-foreground">
                  While you wait, keep your knowledge fresh with some light review. You can update your result anytime from your dashboard.
                </p>
              </div>

              <Button
                className="w-full gap-2"
                variant="outline"
                onClick={() => { handleClose(); navigate("/flashcard-study"); }}
                data-testid="button-review-flashcards"
              >
                <BookOpen className="w-4 h-4" /> Review Flashcards
              </Button>
              <Button variant="outline" className="w-full" onClick={handleClose} data-testid="button-followup-close">
                Close
              </Button>
            </div>
          </>
        )}

        {step === "failed_areas" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl text-center" data-testid="text-followup-areas-title">
                Let's Build Your Comeback Plan 💪
              </DialogTitle>
              <DialogDescription className="text-center">
                Many successful nurses didn't pass on their first try. Select areas you found challenging so we can create a targeted study plan.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-2">
                {WEAK_AREA_OPTIONS.map((area) => (
                  <Button
                    key={area}
                    variant={selectedAreas.includes(area) ? "default" : "outline"}
                    className={`h-auto py-2 px-3 text-xs text-left justify-start ${
                      selectedAreas.includes(area)
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-amber-50 hover:border-amber-200"
                    }`}
                    onClick={() => toggleArea(area)}
                    data-testid={`button-weak-area-${area.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                  >
                    {selectedAreas.includes(area) && <CheckCircle2 className="w-3 h-3 mr-1.5 flex-shrink-0" />}
                    {area}
                  </Button>
                ))}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setStep("ask")}
                  data-testid="button-followup-back"
                >
                  Back
                </Button>
                <Button
                  className="flex-1 gap-2"
                  onClick={handleFailedSubmit}
                  disabled={submitting}
                  data-testid="button-submit-weak-areas"
                >
                  <Target className="w-4 h-4" />
                  {submitting ? "Saving..." : "Create My Plan"}
                </Button>
              </div>
            </div>
          </>
        )}

        {step === "failed" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl text-center" data-testid="text-followup-failed-title">
                Your Comeback Starts Now 🌟
              </DialogTitle>
              <DialogDescription className="text-center">
                You have what it takes. A focused study plan makes all the difference.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-3">
                  <Target className="w-8 h-8 text-amber-600" />
                </div>
                {selectedAreas.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-muted-foreground mb-2">{t("components.examFollowupModal.wellFocusOn")}</p>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {selectedAreas.map((area) => (
                        <Badge key={area} variant="secondary" className="text-xs" data-testid={`badge-weak-area-${area.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}>
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                <p className="text-sm text-muted-foreground">
                  We've saved your focus areas and will tailor your study experience. You've got this!
                </p>
              </div>

              <Button
                className="w-full gap-2"
                onClick={() => { handleClose(); navigate("/study-plan"); }}
                data-testid="button-view-study-plan"
              >
                <BookOpen className="w-4 h-4" /> View Your Study Plan
                <ArrowRight className="w-4 h-4 ml-auto" />
              </Button>
              <Button variant="outline" className="w-full" onClick={handleClose} data-testid="button-followup-close">
                Close
              </Button>
            </div>
          </>
        )}

        {step === "postponed" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl text-center" data-testid="text-followup-postponed-title">
                No Problem! Let's Update Your Plan 📅
              </DialogTitle>
              <DialogDescription className="text-center">
                Taking more time to prepare is a smart decision. When is your new exam date?
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
                  <CalendarClock className="w-8 h-8 text-purple-600" />
                </div>
              </div>
              <input
                type="date"
                className="w-full border rounded-lg p-3 text-sm"
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setNewExamDate(e.target.value)}
                value={newExamDate}
                data-testid="input-new-exam-date"
              />
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setStep("ask")} data-testid="button-followup-back">
                  Back
                </Button>
                <Button
                  className="flex-1 gap-2"
                  onClick={handlePostponedSubmit}
                  disabled={submitting || !newExamDate}
                  data-testid="button-submit-new-date"
                >
                  <RefreshCw className="w-4 h-4" />
                  {submitting ? "Saving..." : "Update Date"}
                </Button>
              </div>
            </div>
          </>
        )}

        {step === "postponed_confirmed" && (
          <PostponedConfirmation newExamDate={newExamDate} onClose={handleClose} navigate={navigate} />
        )}
      </DialogContent>
    </Dialog>
  );
}

function PostponedConfirmation({ newExamDate, onClose, navigate }: { newExamDate: string; onClose: () => void; navigate: (path: string) => void }) {
  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-xl text-center">{t("components.examFollowupModal.youreAllSet")}</DialogTitle>
        <DialogDescription className="text-center">
          Your exam date has been updated. Your study plan will adjust automatically.
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 mt-4">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-8 h-8 text-purple-600" />
          </div>
          <p className="text-sm font-medium">New exam date: {new Date(newExamDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
        </div>
        <Button className="w-full gap-2" onClick={() => { onClose(); navigate("/study-plan"); }} data-testid="button-view-updated-plan">
          <BookOpen className="w-4 h-4" /> View Updated Study Plan
          <ArrowRight className="w-4 h-4 ml-auto" />
        </Button>
        <Button variant="outline" className="w-full" onClick={onClose} data-testid="button-followup-close">
          Close
        </Button>
      </div>
    </>
  );
}

function ConfettiOverlay() {
  const [particles] = useState(() =>
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 2,
      color: ["#10b981", "#f59e0b", "#3b82f6", "#8b5cf6", "#ef4444", "#ec4899"][Math.floor(Math.random() * 6)],
      size: 6 + Math.random() * 6,
    }))
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden" data-testid="confetti-overlay">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-sm animate-bounce"
          style={{
            left: `${p.left}%`,
            top: "-10px",
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            animation: `confettiFall ${p.duration}s ease-in ${p.delay}s forwards`,
          }}
        />
      ))}
      <style>{`
        @keyframes confettiFall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export function ExamFollowupDashboardCard({ user }: { user: any }) {
  const [followupData, setFollowupData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [, navigate] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (!user?.id) { setLoading(false); return; }
    fetch(`/api/exam-followup/${user.id}`, { credentials: "include" })
      .then((r) => r.ok ? r.json() : null)
      .then(setFollowupData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user?.id]);

  if (loading || !followupData?.hasResponse) return null;

  const { examResultStatus, examWeakAreas, couponCode, couponExpiresAt } = followupData;

  if (examResultStatus === "passed") {
    const isExpired = couponExpiresAt && new Date(couponExpiresAt) < new Date();
    return (
      <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-white" data-testid="card-followup-passed">
        <CardContent className="p-5">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <GraduationCap className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-semibold text-emerald-800" data-testid="text-career-launch-title">{t("components.examFollowupModal.launchYourHealthcareCareer")}</h3>
              <p className="text-xs text-emerald-600">{t("components.examFollowupModal.congratulationsOnPassingExploreResources")}</p>
            </div>
          </div>
          {couponCode && !isExpired && (
            <div className="bg-emerald-100/50 rounded-lg p-3 mb-3 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">{t("components.examFollowupModal.yourDiscountCode")}</p>
                <p className="font-mono font-bold text-emerald-700" data-testid="text-dashboard-coupon">{couponCode}</p>
              </div>
              <Button size="sm" variant="ghost" onClick={() => {
                navigator.clipboard.writeText(couponCode);
                toast({ title: "Copied!" });
              }} data-testid="button-dashboard-copy-coupon">
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          )}
          <Button size="sm" className="w-full gap-2" onClick={() => navigate("/newgrad")} data-testid="button-dashboard-newgrad">
            <Sparkles className="w-4 h-4" /> Explore New Grad Resources
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (examResultStatus === "failed") {
    const weakAreas = Array.isArray(examWeakAreas) ? examWeakAreas : [];
    return (
      <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-white" data-testid="card-followup-failed">
        <CardContent className="p-5">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
              <Target className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-amber-800" data-testid="text-study-plan-title">{t("components.examFollowupModal.yourNextStudyPlan")}</h3>
              <p className="text-xs text-amber-600">{t("components.examFollowupModal.focusedPreparationForYourComeback")}</p>
            </div>
          </div>
          {weakAreas.length > 0 && (
            <div className="mb-3">
              <p className="text-xs text-muted-foreground mb-1.5">{t("components.examFollowupModal.focusAreas")}</p>
              <div className="flex flex-wrap gap-1">
                {weakAreas.map((area: string) => (
                  <Badge key={area} variant="secondary" className="text-xs bg-amber-100 text-amber-700">
                    {area}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          <Button size="sm" className="w-full gap-2" onClick={() => navigate("/study-plan")} data-testid="button-dashboard-study-plan">
            <BookOpen className="w-4 h-4" /> View Study Plan
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (examResultStatus === "waiting") {
    return (
      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white" data-testid="card-followup-waiting">
        <CardContent className="p-5">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-800" data-testid="text-waiting-title">{t("components.examFollowupModal.waitingForResults2")}</h3>
              <p className="text-xs text-blue-600">{t("components.examFollowupModal.keepYourSkillsSharpWhile")}</p>
            </div>
          </div>
          <Button size="sm" variant="outline" className="w-full gap-2" onClick={() => navigate("/flashcard-study")} data-testid="button-dashboard-review">
            <BookOpen className="w-4 h-4" /> Light Review
          </Button>
        </CardContent>
      </Card>
    );
  }

  return null;
}
