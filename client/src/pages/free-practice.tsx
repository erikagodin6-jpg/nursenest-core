import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import {
  ArrowRight, CheckCircle2, XCircle, Heart, Brain, Wind, Droplets,
  Activity, Pill, Baby, Stethoscope, Target, BookOpen, Shield,
  ChevronRight, RotateCcw,
} from "lucide-react";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";

import { useI18n } from "@/lib/i18n";
type Question = {
  id: number;
  system: string;
  icon: typeof Heart;
  color: string;
  question: string;
  options: string[];
  correct: number;
  rationale: string;
};

const FREE_QUESTIONS: Question[] = [
  {
    id: 1, system: "Cardiovascular", icon: Heart, color: "text-red-500",
    question: "A patient with acute ST-elevation myocardial infarction (STEMI) arrives in the emergency department. Which intervention takes highest priority?",
    options: [
      "Administer oral aspirin 325 mg",
      "Obtain a 12-lead ECG within 10 minutes",
      "Activate the cardiac catheterization lab for percutaneous coronary intervention",
      "Start a heparin infusion at 18 units/kg/hour"
    ],
    correct: 2,
    rationale: "For STEMI, the primary goal is reperfusion. Activating the cardiac catheterization lab for PCI (door-to-balloon time < 90 minutes) is the highest priority intervention. While aspirin and ECG are important early steps, definitive reperfusion therapy takes precedence once STEMI is confirmed."
  },
  {
    id: 2, system: "Respiratory", icon: Wind, color: "text-blue-500",
    question: "A patient with COPD presents with an SpO2 of 86% on room air. The nurse initiates oxygen therapy. What is the target oxygen saturation for this patient?",
    options: [
      "92-96%",
      "88-92%",
      "95-100%",
      "85-88%"
    ],
    correct: 1,
    rationale: "For patients with COPD, the target SpO2 is 88-92%. Higher oxygen levels can suppress the hypoxic drive in CO2-retaining COPD patients, leading to hypoventilation and worsening respiratory acidosis. Controlled low-flow oxygen (1-2 L/min via nasal cannula) is recommended."
  },
  {
    id: 3, system: "Neurology", icon: Brain, color: "text-purple-500",
    question: "A patient presents with sudden onset left-sided weakness, facial droop, and slurred speech. CT scan is negative for hemorrhage. Time since symptom onset is 2 hours. What is the priority nursing action?",
    options: [
      "Position the patient flat with the head of bed at 0 degrees",
      "Prepare for IV alteplase (tPA) administration per protocol",
      "Administer aspirin 325 mg orally immediately",
      "Obtain a repeat CT scan in 6 hours"
    ],
    correct: 1,
    rationale: "With symptoms < 4.5 hours and CT negative for hemorrhage, this patient is a candidate for IV tPA (alteplase). Time is critical - the sooner thrombolytics are administered, the better the outcome. Aspirin is contraindicated for 24 hours after tPA. The head of bed should be elevated to 30 degrees, not flat."
  },
  {
    id: 4, system: "Electrolytes", icon: Droplets, color: "text-cyan-500",
    question: "A patient's lab results show potassium of 6.2 mmol/L. The ECG shows peaked T waves. Which intervention should the nurse anticipate first?",
    options: [
      "Administer oral kayexalate (sodium polystyrene sulfonate)",
      "Administer IV calcium gluconate",
      "Prepare for emergent hemodialysis",
      "Administer insulin 10 units with 50 mL of D50W"
    ],
    correct: 1,
    rationale: "IV calcium gluconate is the first-line treatment for hyperkalemia with ECG changes because it stabilizes the cardiac membrane within 1-3 minutes, protecting against lethal arrhythmias. It does not lower potassium but buys time. Insulin/dextrose shifts potassium intracellularly but takes 15-30 minutes to work."
  },
  {
    id: 5, system: "Pharmacology", icon: Pill, color: "text-emerald-500",
    question: "A patient on warfarin presents with an INR of 8.5 and no active bleeding. What is the most appropriate nursing action?",
    options: [
      "Administer vitamin K 10 mg IV immediately",
      "Hold warfarin and recheck INR in 24-48 hours",
      "Administer fresh frozen plasma",
      "Continue warfarin at the current dose and recheck INR in one week"
    ],
    correct: 1,
    rationale: "For an INR > 5 without active bleeding, the recommended approach is to hold warfarin and monitor. Vitamin K IV is reserved for INR > 10 or active bleeding. Fresh frozen plasma is for life-threatening hemorrhage. The INR should be rechecked in 24-48 hours and warfarin restarted at a reduced dose once INR is therapeutic."
  },
  {
    id: 6, system: "Cardiac Monitoring", icon: Activity, color: "text-red-600",
    question: "A nurse observes the following on the cardiac monitor: no P waves, irregularly irregular rhythm, and a ventricular rate of 142 bpm. Which arrhythmia should the nurse suspect?",
    options: [
      "Atrial flutter with variable block",
      "Atrial fibrillation with rapid ventricular response",
      "Ventricular tachycardia",
      "Supraventricular tachycardia"
    ],
    correct: 1,
    rationale: "Atrial fibrillation is characterized by the absence of P waves, an irregularly irregular rhythm, and variable ventricular rate. A rate > 100 bpm indicates rapid ventricular response (RVR). Atrial flutter shows sawtooth flutter waves. Ventricular tachycardia has wide QRS complexes. SVT is regular, not irregular."
  },
  {
    id: 7, system: "Maternal Health", icon: Baby, color: "text-pink-500",
    question: "A 32-week pregnant patient presents with BP 162/108 mmHg, 3+ proteinuria, and a severe headache. What is the priority intervention?",
    options: [
      "Administer magnesium sulfate IV loading dose",
      "Prepare for immediate cesarean delivery",
      "Administer labetalol IV for blood pressure control",
      "Order a 24-hour urine protein collection"
    ],
    correct: 0,
    rationale: "This patient has severe preeclampsia (BP >= 160/110 + proteinuria + symptoms). Magnesium sulfate is the priority to prevent eclamptic seizures. While BP control with labetalol is also important, seizure prophylaxis takes precedence. The 24-hour urine collection delays treatment and is not needed when diagnosis is clear."
  },
  {
    id: 8, system: "Assessment", icon: Stethoscope, color: "text-indigo-500",
    question: "During a focused respiratory assessment, the nurse auscultates bilateral fine crackles at the lung bases. This finding is most consistent with which condition?",
    options: [
      "Pneumothorax",
      "Pulmonary edema / heart failure",
      "Asthma exacerbation",
      "Pleural effusion"
    ],
    correct: 1,
    rationale: "Bilateral fine crackles (rales) at the lung bases are the hallmark finding of pulmonary edema, commonly caused by heart failure. Fluid accumulates in the alveoli due to elevated pulmonary capillary pressure. Pneumothorax presents with absent breath sounds. Asthma presents with wheezing. Pleural effusion presents with decreased breath sounds and dullness to percussion."
  },
  {
    id: 9, system: "Neurology", icon: Brain, color: "text-purple-500",
    question: "A nurse is caring for a patient with increased intracranial pressure (ICP). Which of the following findings represents Cushing's triad?",
    options: [
      "Tachycardia, hypotension, and tachypnea",
      "Hypertension, bradycardia, and irregular respirations",
      "Hypotension, tachycardia, and irregular respirations",
      "Hypertension, tachycardia, and Kussmaul respirations"
    ],
    correct: 1,
    rationale: "Cushing's triad (hypertension, bradycardia, and irregular/abnormal respirations) is a late and ominous sign of critically elevated ICP indicating brainstem herniation. It occurs due to the body's attempt to maintain cerebral perfusion through systemic hypertension, with reflex bradycardia. This is a neurosurgical emergency."
  },
  {
    id: 10, system: "Pharmacology", icon: Pill, color: "text-emerald-500",
    question: "A patient receiving IV vancomycin develops a diffuse erythematous rash on the face, neck, and trunk during the infusion. What should the nurse do first?",
    options: [
      "Stop the infusion permanently and document an allergy",
      "Slow the infusion rate and notify the prescriber",
      "Administer epinephrine 0.3 mg IM",
      "Continue the infusion and apply a cool compress"
    ],
    correct: 1,
    rationale: "This describes Red Man Syndrome (vancomycin flushing reaction), which is a histamine-mediated reaction related to rapid infusion rate, NOT a true allergy. The appropriate action is to slow or temporarily stop the infusion, administer diphenhydramine if needed, and notify the prescriber. The infusion can usually be resumed at a slower rate. True anaphylaxis would present with hypotension, airway compromise, and angioedema."
  },
];

export default function FreePractice() {
  const { t } = useI18n();
  const [, setLocation] = useLocation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showRationale, setShowRationale] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [completed, setCompleted] = useState(false);

  const current = FREE_QUESTIONS[currentIndex];

  const handleAnswer = (optionIndex: number) => {
    if (showRationale) return;
    setSelectedAnswer(optionIndex);
    setShowRationale(true);
    setAnswered(a => a + 1);
    if (optionIndex === current.correct) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < FREE_QUESTIONS.length - 1) {
      setCurrentIndex(i => i + 1);
      setSelectedAnswer(null);
      setShowRationale(false);
    } else {
      setCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowRationale(false);
    setScore(0);
    setAnswered(0);
    setCompleted(false);
  };

  return (
    <div className="min-h-screen bg-warmwhite flex flex-col font-sans text-gray-900">
      <SEO
        title={t("pages.freePractice.freeNursingPracticeQuestionsNclex")}
        description={t("pages.freePractice.practice10FreeNclexNclexpn")}
        keywords="free NCLEX practice questions, free NCLEX-PN questions, free REx-PN questions, nursing practice test free, sample nursing exam questions"
        canonicalPath="/free-practice"
      />
      <Navigation />
      <main className="flex-1">
        <section className="bg-gradient-to-b from-primary/5 via-white to-white py-12 px-4">
          <div className="max-w-3xl mx-auto">
            <BreadcrumbNav />
            <div className="text-center mb-8">
              <Badge className="bg-primary/10 text-primary mb-3 px-4 py-1.5" data-testid="badge-free-practice">
                <Target className="w-3 h-3 mr-1.5" /> Free Practice
              </Badge>
              <h1 className="text-3xl sm:text-4xl font-bold mb-3" data-testid="text-free-practice-title">
                Test Your Nursing Knowledge
              </h1>
              <p className="text-gray-600 max-w-xl mx-auto" data-testid="text-free-practice-subtitle">
                10 exam-style questions covering high-yield topics. Instant feedback with detailed rationales. No account required.
              </p>
            </div>

            <div className="flex items-center justify-between mb-6 bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-center gap-4 text-sm">
                <span className="font-medium text-gray-700" data-testid="text-progress">
                  Question {currentIndex + 1} of {FREE_QUESTIONS.length}
                </span>
                <span className="text-gray-400">|</span>
                <span className="text-emerald-600 font-medium" data-testid="text-score">
                  Score: {score}/{answered}
                </span>
              </div>
              <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${((currentIndex + (showRationale ? 1 : 0)) / FREE_QUESTIONS.length) * 100}%` }}
                  data-testid="progress-bar"
                />
              </div>
            </div>

            {!completed ? (
              <Card className="border border-gray-100 shadow-lg" data-testid="card-question">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <div className={`w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center ${current.color}`}>
                      <current.icon className="w-4 h-4" />
                    </div>
                    <Badge variant="outline" className="text-xs" data-testid="badge-system">
                      {current.system}
                    </Badge>
                  </div>

                  <h2 className="text-lg font-semibold text-gray-900 mb-6 leading-relaxed" data-testid="text-question">
                    {current.question}
                  </h2>

                  <div className="space-y-3 mb-6">
                    {current.options.map((option, i) => {
                      let borderColor = "border-gray-200 hover:border-primary/40";
                      let bgColor = "bg-white hover:bg-primary/5";
                      let icon = null;

                      if (showRationale) {
                        if (i === current.correct) {
                          borderColor = "border-emerald-400";
                          bgColor = "bg-emerald-50";
                          icon = <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />;
                        } else if (i === selectedAnswer && i !== current.correct) {
                          borderColor = "border-red-400";
                          bgColor = "bg-red-50";
                          icon = <XCircle className="w-5 h-5 text-red-500 shrink-0" />;
                        } else {
                          borderColor = "border-gray-100";
                          bgColor = "bg-gray-50";
                        }
                      } else if (selectedAnswer === i) {
                        borderColor = "border-primary";
                        bgColor = "bg-primary/5";
                      }

                      return (
                        <button
                          key={i}
                          onClick={() => handleAnswer(i)}
                          disabled={showRationale}
                          className={`w-full text-left p-4 rounded-xl border-2 ${borderColor} ${bgColor} transition-all duration-200 flex items-start gap-3`}
                          data-testid={`button-option-${i}`}
                        >
                          <span className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600 shrink-0 mt-0.5">
                            {String.fromCharCode(65 + i)}
                          </span>
                          <span className="flex-1 text-sm leading-relaxed">{option}</span>
                          {icon}
                        </button>
                      );
                    })}
                  </div>

                  {showRationale && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6" data-testid="section-rationale">
                      <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                        <BookOpen className="w-4 h-4" /> Rationale
                      </h3>
                      <p className="text-sm text-blue-800 leading-relaxed">{current.rationale}</p>
                    </div>
                  )}

                  {showRationale && (
                    <Button
                      onClick={handleNext}
                      className="w-full h-12 bg-primary hover:brightness-110 text-white rounded-xl"
                      data-testid="button-next-question"
                    >
                      {currentIndex < FREE_QUESTIONS.length - 1 ? "Next Question" : "View Results"}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="border border-gray-100 shadow-lg" data-testid="card-results">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <Target className="w-10 h-10 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2" data-testid="text-final-score">
                    You scored {score} out of {FREE_QUESTIONS.length}
                  </h2>
                  <p className="text-gray-600 mb-2">
                    {score >= 8 ? "Excellent work! You have strong clinical knowledge." :
                     score >= 6 ? "Good foundation! Keep practicing to strengthen weak areas." :
                     "Keep studying! Focused review will help you improve."}
                  </p>
                  <p className="text-sm text-gray-500 mb-8">
                    These questions represent a small sample. Access thousands more with detailed rationales.
                  </p>

                  <div className="grid sm:grid-cols-2 gap-4 mb-8">
                    <div className="bg-emerald-50 rounded-xl p-4 text-center">
                      <p className="text-3xl font-bold text-emerald-600">{Math.round((score / FREE_QUESTIONS.length) * 100)}%</p>
                      <p className="text-sm text-emerald-700">{t("pages.freePractice.accuracy")}</p>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-4 text-center">
                      <p className="text-3xl font-bold text-blue-600">{FREE_QUESTIONS.length}</p>
                      <p className="text-sm text-blue-700">{t("pages.freePractice.questionsCompleted")}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button
                      onClick={() => setLocation("/mock-exams")}
                      className="w-full h-12 bg-primary hover:brightness-110 text-white rounded-xl"
                      data-testid="button-try-mock-exams"
                    >
                      Try Full Mock Exams <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => setLocation("/free-practice")}
                      variant="outline"
                      className="w-full h-12 rounded-xl"
                      data-testid="button-browse-qbank"
                    >
                      Browse Test Bank <ChevronRight className="ml-2 w-4 h-4" />
                    </Button>
                    <Button
                      onClick={handleRestart}
                      variant="ghost"
                      className="w-full h-12 rounded-xl text-gray-600"
                      data-testid="button-restart"
                    >
                      <RotateCcw className="mr-2 w-4 h-4" /> Try Again
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="mt-12 grid sm:grid-cols-3 gap-4">
              <Card className="border border-gray-100 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setLocation("/mock-exams")} data-testid="card-cta-mock-exams">
                <CardContent className="p-5 text-center">
                  <Target className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold text-sm mb-1">{t("pages.freePractice.timedMockExams")}</h3>
                  <p className="text-xs text-gray-500">{t("pages.freePractice.simulateRealExamPressure")}</p>
                </CardContent>
              </Card>
              <Card className="border border-gray-100 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setLocation("/flashcards")} data-testid="card-cta-flashcards">
                <CardContent className="p-5 text-center">
                  <BookOpen className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold text-sm mb-1">{t("pages.freePractice.flashcardDecks")}</h3>
                  <p className="text-xs text-gray-500">{t("pages.freePractice.highyieldRecallPractice")}</p>
                </CardContent>
              </Card>
              <Card className="border border-gray-100 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setLocation("/shop")} data-testid="card-cta-store">
                <CardContent className="p-5 text-center">
                  <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold text-sm mb-1">{t("pages.freePractice.printableExamPacks")}</h3>
                  <p className="text-xs text-gray-500">{t("pages.freePractice.250questionPdfBundles")}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
