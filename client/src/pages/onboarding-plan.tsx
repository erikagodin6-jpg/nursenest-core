import { useState } from "react";
import { useLocation } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { getPracticalNurseExamName } from "@shared/constants";
import { useRegion } from "@/hooks/use-region";
import { useI18n } from "@/lib/i18n";
import { trackEvent } from "@/lib/analytics";
import {
  ArrowRight, ArrowLeft, Check, Clock, BookOpen, Target,
  GraduationCap, Brain, Loader2, ChevronRight
} from "lucide-react";

const rpnDomains = [
  "Fundamentals & Safety", "Infection Control", "Pharmacology Basics",
  "Fluid & Electrolytes", "Cardiovascular", "Respiratory", "Neurological",
  "Renal & GI", "Endocrine", "Maternity & Neonatal", "Pediatrics",
  "Mental Health", "Wound Care", "Delegation"
];

const rnDomains = [
  ...rpnDomains.filter(d => d !== "Delegation"),
  "Leadership & Management", "Complex Care", "Delegation & Prioritization",
  "Community Health"
];

const npDomains = [
  "Advanced Pathophysiology", "Diagnostic Reasoning", "Pharmacology & Prescribing",
  "Cardiovascular", "Respiratory", "Neurological", "Endocrine & Metabolic",
  "Renal & GI", "Hematology & Oncology", "Maternity & Women's Health",
  "Pediatrics", "Mental Health", "Dermatology & HEENT",
  "Musculoskeletal", "Infectious Disease", "Health Promotion & Screening",
  "Leadership & Health Systems", "Cultural Safety & Ethics"
];

function getDomainsForTier(tier: string): string[] {

  if (tier === "np") return npDomains;
  if (tier === "rn") return rnDomains;
  return rpnDomains;
}

const onboardingQuestions: Record<string, { question: string; options: string[]; correct: number; domain: string }[]> = {
  general: [
    { question: "A client is prescribed digoxin. Which assessment is most important before administration?", options: ["Blood pressure", "Apical pulse for one full minute", "Respiratory rate", "Temperature"], correct: 1, domain: "Pharmacology Basics" },
    { question: "Which action takes highest priority when a fire is discovered in a healthcare facility?", options: ["Close all doors", "Pull the fire alarm", "Rescue clients in immediate danger", "Use the fire extinguisher"], correct: 2, domain: "Fundamentals & Safety" },
    { question: "A client with a potassium level of 6.2 mEq/L is at greatest risk for which complication?", options: ["Seizures", "Cardiac dysrhythmias", "Respiratory depression", "Renal failure"], correct: 1, domain: "Fluid & Electrolytes" },
    { question: "Which type of isolation precautions should be implemented for a client with tuberculosis?", options: ["Contact precautions", "Droplet precautions", "Airborne precautions", "Standard precautions only"], correct: 2, domain: "Infection Control" },
    { question: "A client's blood pressure is 88/52 mmHg with a heart rate of 120. Which intervention is the priority?", options: ["Administer pain medication", "Place client in Trendelenburg position and notify provider", "Encourage oral fluids", "Recheck vitals in 30 minutes"], correct: 1, domain: "Cardiovascular" },
    { question: "Which finding in a postoperative client requires immediate nursing intervention?", options: ["Pain rated 4/10", "Urine output of 15 mL/hr over 2 hours", "Temperature of 37.2C", "Mild incisional redness"], correct: 1, domain: "Renal & GI" },
  ],
  weak: [
    { question: "A client receiving IV heparin has an aPTT of 120 seconds (therapeutic range 60-80). What is the priority action?", options: ["Continue the infusion", "Stop the infusion and notify the provider", "Increase the infusion rate", "Administer vitamin K"], correct: 1, domain: "Pharmacology Basics" },
    { question: "Which assessment finding is most concerning in a client 2 hours post-thyroidectomy?", options: ["Sore throat", "Hoarseness", "Tingling around the mouth and fingers", "Mild neck swelling"], correct: 2, domain: "Endocrine" },
    { question: "A laboring client has late decelerations on the fetal monitor. What is the priority nursing action?", options: ["Prepare for cesarean delivery", "Turn the client to left lateral position", "Increase oxytocin rate", "Document findings"], correct: 1, domain: "Maternity & Neonatal" },
    { question: "A 4-year-old is admitted with suspected epiglottitis. Which action should the nurse avoid?", options: ["Keeping the child calm", "Inspecting the throat with a tongue depressor", "Maintaining the child in an upright position", "Having emergency airway equipment nearby"], correct: 1, domain: "Pediatrics" },
    { question: "A client with major depressive disorder states 'I have a plan to end it all tonight.' What is the priority response?", options: ["Ask the client to describe the plan", "Leave to notify the provider immediately", "Ask the client to sign a no-harm contract", "Stay with the client and activate safety protocols"], correct: 3, domain: "Mental Health" },
    { question: "Which breath sound finding indicates a potential pneumothorax?", options: ["Crackles bilaterally", "Absent breath sounds on one side", "Expiratory wheezing", "Stridor on inspiration"], correct: 1, domain: "Respiratory" },
  ],
};

export default function OnboardingPlanPage() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const region = useRegion();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [generating, setGenerating] = useState(false);

  const effectiveTier = user?.tier === "admin" ? "np" : (user?.tier || "rpn");

  const [preferences, setPreferences] = useState({
    examType: effectiveTier === "np" ? "FNP" : effectiveTier === "rn" ? "NCLEX-RN" : getPracticalNurseExamName(region),
    timeframeWeeks: 4,
    minutesPerDay: 30,
    stylePreference: "read_then_practice" as "read_then_practice" | "practice_then_review",
    weakAreas: [] as string[],
  });

  const [domainRatings, setDomainRatings] = useState<Record<string, number>>({});
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);

  const domains = getDomainsForTier(effectiveTier);

  const quizQuestions = [
    ...onboardingQuestions.general,
    ...onboardingQuestions.weak.slice(0, 6),
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-warmwhite flex flex-col font-sans text-gray-900">
        <Navigation />
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <Card className="w-full max-w-md border-none shadow-xl">
            <CardContent className="p-8 text-center space-y-4">
              <GraduationCap className="w-12 h-12 text-primary mx-auto" />
              <h2 className="text-2xl font-bold">{t("pages.onboardingPlan.signInRequired")}</h2>
              <p className="text-gray-500">{t("pages.onboardingPlan.pleaseLogInToCreate")}</p>
              <Button onClick={() => navigate("/login")} className="rounded-full px-8" data-testid="button-login-redirect">
                Log In
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  async function handleGenerate() {
    setGenerating(true);
    try {
      const quizResults: Record<string, { correct: number; total: number }> = {};
      quizQuestions.forEach((q, idx) => {
        const domain = q.domain;
        if (!quizResults[domain]) quizResults[domain] = { correct: 0, total: 0 };
        quizResults[domain].total++;
        if (quizAnswers[idx] === q.correct) quizResults[domain].correct++;
      });

      const res = await fetch("/api/study-plan/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user!.id,
          username: user!.username,
          password: "",
          tier: effectiveTier,
          examType: preferences.examType,
          timeframeWeeks: preferences.timeframeWeeks,
          minutesPerDay: preferences.minutesPerDay,
          stylePreference: preferences.stylePreference,
          domainRatings,
          quizResults,
          weakAreas: preferences.weakAreas,
        }),
      });
      if (!res.ok) throw new Error("Failed to generate study plan");
      const data = await res.json();
      trackEvent("onboarding_completed");
      toast({ title: "Study Plan Created", description: "Your personalized study plan is ready." });
      navigate("/study-plan");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  }

  const steps = [
    { title: "Goal & Timeline", icon: Target },
    { title: "Comfort Ratings", icon: Brain },
    { title: "Knowledge Check", icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-warmwhite flex flex-col font-sans text-gray-900">
      <Navigation />
      <main className="flex-1 px-4 py-8 sm:py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2" data-testid="text-onboarding-title">
              Build Your Study Plan
            </h1>
            <p className="text-gray-500">{t("pages.onboardingPlan.takesAbout3MinutesWe")}</p>
          </div>

          <div className="flex items-center justify-center gap-2 mb-8">
            {steps.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div key={idx} className="flex items-center gap-2">
                  <div
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      step === idx ? "bg-primary text-white" : step > idx ? "bg-primary/20 text-primary" : "bg-gray-100 text-gray-400"
                    }`}
                    data-testid={`step-indicator-${idx}`}
                  >
                    {step > idx ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                    <span className="hidden sm:inline">{s.title}</span>
                  </div>
                  {idx < steps.length - 1 && <ChevronRight className="w-4 h-4 text-gray-300" />}
                </div>
              );
            })}
          </div>

          {step === 0 && (
            <Card className="border-none shadow-lg" data-testid="card-step-goal">
              <CardContent className="p-6 sm:p-8 space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">{t("pages.onboardingPlan.examType")}</label>
                  <div className="flex flex-wrap gap-2">
                    {(effectiveTier === "np"
                      ? ["FNP", "AGPCNP", "PMHNP", "Other NP"]
                      : effectiveTier === "rn"
                      ? ["NCLEX-RN", "REx-RN"]
                      : ["REx-PN", "NCLEX-PN"]
                    ).map((exam) => (
                      <button
                        key={exam}
                        onClick={() => setPreferences({ ...preferences, examType: exam })}
                        className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                          preferences.examType === exam
                            ? "bg-primary text-white border-primary"
                            : "bg-white text-gray-600 border-gray-200 hover:border-primary"
                        }`}
                        data-testid={`button-exam-${exam}`}
                      >
                        {exam}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">{t("pages.onboardingPlan.studyTimeframe")}</label>
                  <div className="flex flex-wrap gap-2">
                    {[2, 4, 6, 8].map((weeks) => (
                      <button
                        key={weeks}
                        onClick={() => setPreferences({ ...preferences, timeframeWeeks: weeks })}
                        className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                          preferences.timeframeWeeks === weeks
                            ? "bg-primary text-white border-primary"
                            : "bg-white text-gray-600 border-gray-200 hover:border-primary"
                        }`}
                        data-testid={`button-weeks-${weeks}`}
                      >
                        {weeks} Weeks
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">{t("pages.onboardingPlan.dailyStudyTime")}</label>
                  <div className="flex flex-wrap gap-2">
                    {[15, 30, 60, 90].map((min) => (
                      <button
                        key={min}
                        onClick={() => setPreferences({ ...preferences, minutesPerDay: min })}
                        className={`px-4 py-2 rounded-full text-sm font-medium border transition-all flex items-center gap-1.5 ${
                          preferences.minutesPerDay === min
                            ? "bg-primary text-white border-primary"
                            : "bg-white text-gray-600 border-gray-200 hover:border-primary"
                        }`}
                        data-testid={`button-minutes-${min}`}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        {min} min
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">{t("pages.onboardingPlan.learningStyle")}</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { id: "read_then_practice" as const, label: "Learn first, then practice", desc: "Read lessons before attempting questions" },
                      { id: "practice_then_review" as const, label: "Practice first, then review", desc: "Jump into questions and review weak areas" },
                    ].map((style) => (
                      <button
                        key={style.id}
                        onClick={() => setPreferences({ ...preferences, stylePreference: style.id })}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          preferences.stylePreference === style.id
                            ? "border-primary bg-primary/5 ring-1 ring-primary"
                            : "border-gray-200 hover:border-primary/50"
                        }`}
                        data-testid={`button-style-${style.id}`}
                      >
                        <div className="font-medium text-sm">{style.label}</div>
                        <div className="text-xs text-gray-500 mt-1">{style.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <Button onClick={() => setStep(1)} className="w-full rounded-full" data-testid="button-next-step-1">
                  Continue <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          )}

          {step === 1 && (
            <Card className="border-none shadow-lg" data-testid="card-step-comfort">
              <CardContent className="p-6 sm:p-8 space-y-4">
                <p className="text-sm text-gray-500 mb-4">
                  Rate your comfort level in each domain from 1 (not confident) to 5 (very confident).
                </p>
                <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
                  {domains.map((domain) => (
                    <div key={domain} className="flex items-center justify-between gap-3 py-2 border-b border-gray-50 last:border-0">
                      <span className="text-sm font-medium flex-1 min-w-0 truncate">{domain}</span>
                      <div className="flex gap-1.5 flex-shrink-0">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            onClick={() => setDomainRatings({ ...domainRatings, [domain]: rating })}
                            className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${
                              domainRatings[domain] === rating
                                ? rating <= 2 ? "bg-red-500 text-white" : rating === 3 ? "bg-amber-500 text-white" : "bg-emerald-500 text-white"
                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                            }`}
                            data-testid={`button-rating-${domain}-${rating}`}
                          >
                            {rating}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 pt-4">
                  <Button variant="outline" onClick={() => setStep(0)} className="rounded-full" data-testid="button-back-step-0">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                  </Button>
                  <Button onClick={() => { setCurrentQuizIdx(0); setStep(2); }} className="flex-1 rounded-full" data-testid="button-next-step-2">
                    Continue <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card className="border-none shadow-lg" data-testid="card-step-quiz">
              <CardContent className="p-6 sm:p-8 space-y-6">
                {currentQuizIdx < quizQuestions.length ? (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs">{quizQuestions[currentQuizIdx].domain}</Badge>
                      <span className="text-xs text-gray-400">{currentQuizIdx + 1} of {quizQuestions.length}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div
                        className="bg-primary h-1.5 rounded-full transition-all"
                        style={{ width: `${((currentQuizIdx + 1) / quizQuestions.length) * 100}%` }}
                      />
                    </div>
                    <p className="font-medium text-sm leading-relaxed" data-testid="text-quiz-question">
                      {quizQuestions[currentQuizIdx].question}
                    </p>
                    <div className="space-y-2">
                      {quizQuestions[currentQuizIdx].options.map((option, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setQuizAnswers({ ...quizAnswers, [currentQuizIdx]: idx });
                            setTimeout(() => setCurrentQuizIdx(currentQuizIdx + 1), 300);
                          }}
                          className={`w-full text-left p-3 rounded-xl border text-sm transition-all ${
                            quizAnswers[currentQuizIdx] === idx
                              ? "border-primary bg-primary/5 font-medium"
                              : "border-gray-200 hover:border-primary/50 hover:bg-gray-50"
                          }`}
                          data-testid={`button-quiz-option-${idx}`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-3 pt-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          if (currentQuizIdx > 0) setCurrentQuizIdx(currentQuizIdx - 1);
                          else setStep(1);
                        }}
                        className="rounded-full"
                        data-testid="button-quiz-back"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back
                      </Button>
                      {quizAnswers[currentQuizIdx] !== undefined && (
                        <Button
                          onClick={() => setCurrentQuizIdx(currentQuizIdx + 1)}
                          className="flex-1 rounded-full"
                          data-testid="button-quiz-next"
                        >
                          Next <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                      <Check className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">{t("pages.onboardingPlan.assessmentComplete")}</h3>
                    <p className="text-gray-500 text-sm">
                      You answered {Object.keys(quizAnswers).length} of {quizQuestions.length} questions.
                      We are ready to build your personalized study plan.
                    </p>
                    <Button
                      onClick={handleGenerate}
                      disabled={generating}
                      size="lg"
                      className="rounded-full px-8"
                      data-testid="button-generate-plan"
                    >
                      {generating ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {t("pages.onboardingPlan.buildingYourPlan")}</>
                      ) : (
                        <>Generate My Study Plan <ArrowRight className="w-4 h-4 ml-2" /></>
                      )}
                    </Button>
                    <button
                      onClick={() => { setCurrentQuizIdx(0); setStep(1); }}
                      className="block mx-auto text-sm text-gray-400 hover:text-gray-600 mt-2"
                      data-testid="button-retake-quiz"
                    >
                      Retake assessment
                    </button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
