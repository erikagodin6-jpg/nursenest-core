import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useI18n } from "@/lib/i18n";
import {
  CheckCircle2, XCircle, ChevronRight, ChevronLeft, ClipboardList,
  Activity, FlaskConical, FileText, Pill, Stethoscope, Trophy,
  ArrowRight, RotateCcw
} from "lucide-react";

interface CaseStudy {
  id: string;
  title: string;
  tier: string;
  difficulty: string;
  bodySystem: string | null;
  category: string | null;
  scenarioIntro: string;
  status: string;
  regionScope: string;
}

interface CaseStudyStep {
  id: string;
  caseId: string;
  stepNumber: number;
  clinicalUpdateText: string;
  exhibitData: any;
  questions: CaseStudyQuestion[];
}

interface CaseStudyQuestion {
  id: string;
  caseStepId: string;
  questionText: string;
  questionType: string;
  answerOptions: any[];
  correctAnswer: any;
  rationale: string | null;
  points: number;
}

interface StepAnswer {
  questionId: string;
  selected: any;
  correct: boolean;
  pointsEarned: number;
  maxPoints: number;
}

function ExhibitPanel({ exhibitData }: { exhibitData: any }) {
  const { t } = useI18n();
  if (!exhibitData || Object.keys(exhibitData).length === 0) return null;

  const tabs: { key: string; label: string; icon: any }[] = [];
  if (exhibitData.vitals) tabs.push({ key: "vitals", label: "Vitals", icon: Activity });
  if (exhibitData.labs) tabs.push({ key: "labs", label: "Labs", icon: FlaskConical });
  if (exhibitData.notes) tabs.push({ key: "notes", label: "Nursing Notes", icon: FileText });
  if (exhibitData.medications) tabs.push({ key: "medications", label: "Medications", icon: Pill });
  if (exhibitData.orders) tabs.push({ key: "orders", label: "Provider Orders", icon: ClipboardList });

  if (tabs.length === 0) return null;

  return (
    <Card className="border-blue-200 bg-blue-50/30" data-testid="card-exhibit-panel">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold text-blue-800 flex items-center gap-2">
          <Stethoscope className="w-4 h-4" />
          Clinical Exhibits
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={tabs[0]?.key} className="w-full">
          <TabsList className="bg-blue-100/50 w-full justify-start flex-wrap h-auto gap-1 p-1">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.key} value={tab.key} className="text-xs data-[state=active]:bg-white" data-testid={`tab-exhibit-${tab.key}`}>
                <tab.icon className="w-3 h-3 mr-1" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {exhibitData.vitals && (
            <TabsContent value="vitals" className="mt-3">
              <div className="bg-white rounded-lg p-3 border border-blue-100">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-1 font-semibold text-gray-600">{t("pages.clinicalCaseStudy.parameter")}</th>
                      <th className="text-left py-1 font-semibold text-gray-600">{t("pages.clinicalCaseStudy.value")}</th>
                      {exhibitData.vitals[0]?.status && <th className="text-left py-1 font-semibold text-gray-600">{t("pages.clinicalCaseStudy.status")}</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {(exhibitData.vitals as any[]).map((v: any, i: number) => (
                      <tr key={i} className="border-b border-gray-50">
                        <td className="py-1.5 font-medium text-gray-700" data-testid={`text-vital-name-${i}`}>{v.name || v.parameter}</td>
                        <td className="py-1.5 text-gray-900" data-testid={`text-vital-value-${i}`}>{v.value}</td>
                        {v.status && <td className="py-1.5">
                          <Badge className={`text-[10px] ${v.status === 'abnormal' || v.status === 'critical' ? 'bg-red-100 text-red-700' : v.status === 'normal' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {v.status}
                          </Badge>
                        </td>}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          )}

          {exhibitData.labs && (
            <TabsContent value="labs" className="mt-3">
              <div className="bg-white rounded-lg p-3 border border-blue-100">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-1 font-semibold text-gray-600">{t("pages.clinicalCaseStudy.test")}</th>
                      <th className="text-left py-1 font-semibold text-gray-600">{t("pages.clinicalCaseStudy.result")}</th>
                      <th className="text-left py-1 font-semibold text-gray-600">{t("pages.clinicalCaseStudy.reference")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(exhibitData.labs as any[]).map((lab: any, i: number) => (
                      <tr key={i} className="border-b border-gray-50">
                        <td className="py-1.5 font-medium text-gray-700" data-testid={`text-lab-name-${i}`}>{lab.name || lab.test}</td>
                        <td className={`py-1.5 ${lab.abnormal ? 'text-red-600 font-bold' : 'text-gray-900'}`} data-testid={`text-lab-value-${i}`}>{lab.value || lab.result}</td>
                        <td className="py-1.5 text-gray-500">{lab.reference || lab.range || ''}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          )}

          {exhibitData.notes && (
            <TabsContent value="notes" className="mt-3">
              <div className="bg-white rounded-lg p-3 border border-blue-100 space-y-2">
                {(Array.isArray(exhibitData.notes) ? exhibitData.notes : [exhibitData.notes]).map((note: any, i: number) => (
                  <div key={i} className="text-xs text-gray-700 leading-relaxed" data-testid={`text-note-${i}`}>
                    {typeof note === 'string' ? note : (
                      <div>
                        {note.time && <span className="font-semibold text-gray-900">{note.time}: </span>}
                        {note.text || note.content}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>
          )}

          {exhibitData.medications && (
            <TabsContent value="medications" className="mt-3">
              <div className="bg-white rounded-lg p-3 border border-blue-100">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-1 font-semibold text-gray-600">{t("pages.clinicalCaseStudy.medication")}</th>
                      <th className="text-left py-1 font-semibold text-gray-600">{t("pages.clinicalCaseStudy.dose")}</th>
                      <th className="text-left py-1 font-semibold text-gray-600">{t("pages.clinicalCaseStudy.routefreq")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(exhibitData.medications as any[]).map((med: any, i: number) => (
                      <tr key={i} className="border-b border-gray-50">
                        <td className="py-1.5 font-medium text-gray-700" data-testid={`text-med-name-${i}`}>{med.name}</td>
                        <td className="py-1.5 text-gray-900">{med.dose}</td>
                        <td className="py-1.5 text-gray-500">{med.route} {med.frequency}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          )}

          {exhibitData.orders && (
            <TabsContent value="orders" className="mt-3">
              <div className="bg-white rounded-lg p-3 border border-blue-100 space-y-1">
                {(exhibitData.orders as any[]).map((order: any, i: number) => (
                  <div key={i} className="text-xs text-gray-700 flex items-start gap-2" data-testid={`text-order-${i}`}>
                    <span className="text-blue-500 mt-0.5">•</span>
                    {typeof order === 'string' ? order : order.text || order.order}
                  </div>
                ))}
              </div>
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
}

function QuestionRenderer({
  question,
  onAnswer,
  answered,
  existingAnswer,
}: {
  question: CaseStudyQuestion;
  onAnswer: (answer: StepAnswer) => void;
  answered: boolean;
  existingAnswer?: StepAnswer;
}) {
  const [selected, setSelected] = useState<any>(existingAnswer?.selected ?? null);
  const [multiSelected, setMultiSelected] = useState<Set<number>>(
    existingAnswer?.selected && Array.isArray(existingAnswer.selected) ? new Set(existingAnswer.selected) : new Set()
  );
  const [textAnswer, setTextAnswer] = useState<string>(existingAnswer?.selected ?? "");
  const [orderedItems, setOrderedItems] = useState<number[]>(
    existingAnswer?.selected && Array.isArray(existingAnswer.selected) ? existingAnswer.selected : []
  );
  const [submitted, setSubmitted] = useState(answered);

  const qType = question.questionType;
  const options = question.answerOptions || [];
  const correct = question.correctAnswer;

  const handleSubmit = () => {
    setSubmitted(true);
    let isCorrect = false;
    let pointsEarned = 0;
    let selectedVal: any = null;
    const maxPoints = question.points || 1;

    if (qType === "multiple_choice") {
      selectedVal = selected;
      isCorrect = Array.isArray(correct) ? correct.includes(selected) : correct === selected;
      pointsEarned = isCorrect ? maxPoints : 0;
    } else if (qType === "multiple_response") {
      selectedVal = Array.from(multiSelected);
      const correctArr = Array.isArray(correct) ? correct : [correct];
      const correctSet = new Set(correctArr);
      if (correctSet.size === 0) {
        pointsEarned = 0;
        isCorrect = false;
      } else {
        const correctCount = selectedVal.filter((s: number) => correctSet.has(s)).length;
        const wrongCount = selectedVal.filter((s: number) => !correctSet.has(s)).length;
        const proportional = (correctCount / correctSet.size) * maxPoints;
        const penalty = wrongCount * (maxPoints / correctSet.size);
        pointsEarned = Math.max(0, Math.min(maxPoints, Math.floor(proportional - penalty)));
        isCorrect = correctCount === correctSet.size && wrongCount === 0;
      }
    } else if (qType === "fill_blank") {
      selectedVal = textAnswer;
      const correctArr = Array.isArray(correct) ? correct : [correct];
      isCorrect = correctArr.some((c: any) => String(c).toLowerCase().trim() === textAnswer.toLowerCase().trim());
      pointsEarned = isCorrect ? maxPoints : 0;
    } else if (qType === "priority" || qType === "drag_drop") {
      selectedVal = orderedItems;
      const correctArr = Array.isArray(correct) ? correct : [];
      isCorrect = orderedItems.length === correctArr.length && orderedItems.every((v, i) => v === correctArr[i]);
      pointsEarned = isCorrect ? maxPoints : 0;
    } else {
      selectedVal = selected;
      isCorrect = Array.isArray(correct) ? correct.includes(selected) : correct === selected;
      pointsEarned = isCorrect ? maxPoints : 0;
    }

    onAnswer({
      questionId: question.id,
      selected: selectedVal,
      correct: isCorrect,
      pointsEarned,
      maxPoints,
    });
  };

  if (qType === "multiple_choice" || qType === "bowtie") {
    return (
      <div className="space-y-3" data-testid={`question-${question.id}`}>
        <p className="text-sm text-gray-800 font-medium leading-relaxed">{question.questionText}</p>
        <div className="space-y-2">
          {options.map((opt: any, idx: number) => {
            const label = typeof opt === 'string' ? opt : opt.text || opt.label;
            const isSelected = selected === idx;
            const isCorrectAnswer = Array.isArray(correct) ? correct.includes(idx) : correct === idx;
            let cls = "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50";
            if (submitted) {
              if (isCorrectAnswer) cls = "border-green-500 bg-green-50";
              else if (isSelected && !isCorrectAnswer) cls = "border-red-400 bg-red-50";
              else cls = "border-gray-200 opacity-50";
            } else if (isSelected) {
              cls = "border-blue-500 bg-blue-50";
            }
            return (
              <button
                key={idx}
                onClick={() => !submitted && setSelected(idx)}
                disabled={submitted}
                className={`w-full text-left p-3 rounded-lg border text-sm transition-all ${cls} ${submitted ? "cursor-default" : "cursor-pointer"}`}
                data-testid={`button-option-${question.id}-${idx}`}
              >
                <div className="flex items-center gap-2">
                  {submitted && isCorrectAnswer && <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />}
                  {submitted && isSelected && !isCorrectAnswer && <XCircle className="w-4 h-4 text-red-500 shrink-0" />}
                  <span>{String.fromCharCode(65 + idx)}. {label}</span>
                </div>
              </button>
            );
          })}
        </div>
        {!submitted && (
          <Button onClick={handleSubmit} disabled={selected === null} className="w-full bg-gray-900 hover:bg-gray-800 text-white" data-testid={`button-submit-${question.id}`}>
            Submit Answer
          </Button>
        )}
        {submitted && question.rationale && (
          <div className={`p-3 rounded-lg text-xs leading-relaxed ${existingAnswer?.correct || (Array.isArray(correct) ? correct.includes(selected) : correct === selected) ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-amber-50 border border-amber-200 text-amber-800'}`} data-testid={`text-rationale-${question.id}`}>
            <p className="font-semibold mb-1">{t("pages.clinicalCaseStudy.rationale")}</p>
            <p>{question.rationale}</p>
          </div>
        )}
      </div>
    );
  }

  if (qType === "multiple_response") {
    const toggleOption = (idx: number) => {
      if (submitted) return;
      const next = new Set(multiSelected);
      if (next.has(idx)) next.delete(idx); else next.add(idx);
      setMultiSelected(next);
    };

    return (
      <div className="space-y-3" data-testid={`question-${question.id}`}>
        <p className="text-sm text-gray-800 font-medium leading-relaxed">{question.questionText}</p>
        <p className="text-xs text-gray-500">{t("pages.clinicalCaseStudy.selectAllThatApply")}</p>
        <div className="space-y-2">
          {options.map((opt: any, idx: number) => {
            const label = typeof opt === 'string' ? opt : opt.text || opt.label;
            const isSelected = multiSelected.has(idx);
            const correctArr = Array.isArray(correct) ? correct : [correct];
            const isCorrectAnswer = correctArr.includes(idx);
            let cls = "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50";
            if (submitted) {
              if (isCorrectAnswer && isSelected) cls = "border-green-500 bg-green-50";
              else if (isCorrectAnswer && !isSelected) cls = "border-green-300 bg-green-50/50";
              else if (!isCorrectAnswer && isSelected) cls = "border-red-400 bg-red-50";
              else cls = "border-gray-200 opacity-50";
            } else if (isSelected) {
              cls = "border-blue-500 bg-blue-50";
            }
            return (
              <button
                key={idx}
                onClick={() => toggleOption(idx)}
                disabled={submitted}
                className={`w-full text-left p-3 rounded-lg border text-sm transition-all ${cls} ${submitted ? "cursor-default" : "cursor-pointer"}`}
                data-testid={`button-option-${question.id}-${idx}`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${submitted && isCorrectAnswer ? 'border-green-500 bg-green-100' : submitted && isSelected && !isCorrectAnswer ? 'border-red-400 bg-red-100' : isSelected ? 'border-blue-500 bg-blue-100' : 'border-gray-300'}`}>
                    {(isSelected || (submitted && isCorrectAnswer)) && <CheckCircle2 className="w-3 h-3 text-current" />}
                  </span>
                  <span>{label}</span>
                </div>
              </button>
            );
          })}
        </div>
        {!submitted && (
          <Button onClick={handleSubmit} disabled={multiSelected.size === 0} className="w-full bg-gray-900 hover:bg-gray-800 text-white" data-testid={`button-submit-${question.id}`}>
            Submit Answer
          </Button>
        )}
        {submitted && question.rationale && (
          <div className="p-3 rounded-lg text-xs leading-relaxed bg-blue-50 border border-blue-200 text-blue-800" data-testid={`text-rationale-${question.id}`}>
            <p className="font-semibold mb-1">{t("pages.clinicalCaseStudy.rationale2")}</p>
            <p>{question.rationale}</p>
          </div>
        )}
      </div>
    );
  }

  if (qType === "fill_blank") {
    return (
      <div className="space-y-3" data-testid={`question-${question.id}`}>
        <p className="text-sm text-gray-800 font-medium leading-relaxed">{question.questionText}</p>
        <input
          type="text"
          value={textAnswer}
          onChange={(e) => !submitted && setTextAnswer(e.target.value)}
          disabled={submitted}
          className="w-full border rounded-lg p-2.5 text-sm"
          placeholder={t("pages.clinicalCaseStudy.typeYourAnswer")}
          data-testid={`input-answer-${question.id}`}
        />
        {!submitted && (
          <Button onClick={handleSubmit} disabled={!textAnswer.trim()} className="w-full bg-gray-900 hover:bg-gray-800 text-white" data-testid={`button-submit-${question.id}`}>
            Submit Answer
          </Button>
        )}
        {submitted && (
          <div className={`p-3 rounded-lg text-xs leading-relaxed ${existingAnswer?.correct ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-amber-50 border border-amber-200 text-amber-800'}`} data-testid={`text-rationale-${question.id}`}>
            <p className="font-semibold mb-1">Correct Answer: {Array.isArray(correct) ? correct.join(', ') : correct}</p>
            {question.rationale && <p>{question.rationale}</p>}
          </div>
        )}
      </div>
    );
  }

  if (qType === "priority" || qType === "drag_drop") {
    const addToOrder = (idx: number) => {
      if (submitted || orderedItems.includes(idx)) return;
      setOrderedItems([...orderedItems, idx]);
    };
    const removeFromOrder = (pos: number) => {
      if (submitted) return;
      setOrderedItems(orderedItems.filter((_, i) => i !== pos));
    };
    const correctArr = Array.isArray(correct) ? correct : [];

    return (
      <div className="space-y-3" data-testid={`question-${question.id}`}>
        <p className="text-sm text-gray-800 font-medium leading-relaxed">{question.questionText}</p>
        <p className="text-xs text-gray-500">{qType === "priority" ? "Click items in priority order (highest first)" : "Click items in the correct order"}</p>
        {orderedItems.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-600">{t("pages.clinicalCaseStudy.yourOrder")}</p>
            {orderedItems.map((itemIdx, pos) => {
              const label = typeof options[itemIdx] === 'string' ? options[itemIdx] : options[itemIdx]?.text || options[itemIdx]?.label;
              let cls = "border-blue-300 bg-blue-50";
              if (submitted) {
                cls = correctArr[pos] === itemIdx ? "border-green-500 bg-green-50" : "border-red-400 bg-red-50";
              }
              return (
                <div key={pos} className={`flex items-center gap-2 p-2 rounded-lg border text-sm ${cls}`}>
                  <span className="font-semibold text-xs w-5 text-center">{pos + 1}</span>
                  <span className="flex-1">{label}</span>
                  {!submitted && (
                    <button onClick={() => removeFromOrder(pos)} className="text-gray-400 hover:text-red-500 text-xs" data-testid={`button-remove-order-${question.id}-${pos}`}>✕</button>
                  )}
                </div>
              );
            })}
          </div>
        )}
        <div className="space-y-1">
          <p className="text-xs font-medium text-gray-600">{t("pages.clinicalCaseStudy.availableItems")}</p>
          {options.map((opt: any, idx: number) => {
            const label = typeof opt === 'string' ? opt : opt.text || opt.label;
            const inOrder = orderedItems.includes(idx);
            if (inOrder) return null;
            return (
              <button key={idx} onClick={() => addToOrder(idx)} disabled={submitted}
                className="w-full text-left p-2 rounded-lg border border-gray-200 text-sm hover:border-blue-300 hover:bg-blue-50/50 transition-all"
                data-testid={`button-option-${question.id}-${idx}`}>
                {label}
              </button>
            );
          })}
        </div>
        {!submitted && (
          <Button onClick={handleSubmit} disabled={orderedItems.length === 0} className="w-full bg-gray-900 hover:bg-gray-800 text-white" data-testid={`button-submit-${question.id}`}>
            Submit Answer
          </Button>
        )}
        {submitted && (
          <div className="p-3 rounded-lg text-xs leading-relaxed bg-blue-50 border border-blue-200 text-blue-800" data-testid={`text-rationale-${question.id}`}>
            <p className="font-semibold mb-1">Correct order: {correctArr.map((i: number) => typeof options[i] === 'string' ? options[i] : options[i]?.text || options[i]?.label).join(' → ')}</p>
            {question.rationale && <p>{question.rationale}</p>}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3" data-testid={`question-${question.id}`}>
      <p className="text-sm text-gray-800 font-medium leading-relaxed">{question.questionText}</p>
      <div className="space-y-2">
        {options.map((opt: any, idx: number) => {
          const label = typeof opt === 'string' ? opt : opt.text || opt.label;
          const isSelected = selected === idx;
          let cls = "border-gray-200 hover:border-blue-300";
          if (submitted) {
            const isCorrectAnswer = Array.isArray(correct) ? correct.includes(idx) : correct === idx;
            if (isCorrectAnswer) cls = "border-green-500 bg-green-50";
            else if (isSelected) cls = "border-red-400 bg-red-50";
          } else if (isSelected) cls = "border-blue-500 bg-blue-50";
          return (
            <button key={idx} onClick={() => !submitted && setSelected(idx)} disabled={submitted}
              className={`w-full text-left p-3 rounded-lg border text-sm transition-all ${cls}`}
              data-testid={`button-option-${question.id}-${idx}`}>
              {label}
            </button>
          );
        })}
      </div>
      {!submitted && (
        <Button onClick={handleSubmit} disabled={selected === null} className="w-full bg-gray-900 hover:bg-gray-800 text-white" data-testid={`button-submit-${question.id}`}>
          Submit Answer
        </Button>
      )}
      {submitted && question.rationale && (
        <div className="p-3 rounded-lg text-xs leading-relaxed bg-blue-50 border border-blue-200 text-blue-800" data-testid={`text-rationale-${question.id}`}>
          <p className="font-semibold mb-1">{t("pages.clinicalCaseStudy.rationale3")}</p>
          <p>{question.rationale}</p>
        </div>
      )}
    </div>
  );
}

export default function ClinicalCaseStudyPage() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [activeCaseId, setActiveCaseId] = useState<string | null>(null);
  const [caseData, setCaseData] = useState<{ study: CaseStudy; steps: CaseStudyStep[] } | null>(null);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [stepAnswers, setStepAnswers] = useState<Map<string, StepAnswer[]>>(new Map());
  const [showScore, setShowScore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tierFilter, setTierFilter] = useState<string>("");
  const [diffFilter, setDiffFilter] = useState<string>("");

  const loadCaseStudies = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("status", "published");
      if (tierFilter) params.set("tier", tierFilter);
      if (diffFilter) params.set("difficulty", diffFilter);
      const res = await fetch(`/api/case-studies?${params}`);
      if (res.ok) setCaseStudies(await res.json());
    } catch {}
    setLoading(false);
  }, [tierFilter, diffFilter]);

  useEffect(() => { loadCaseStudies(); }, [loadCaseStudies]);

  const startCase = async (id: string) => {
    try {
      const res = await fetch(`/api/case-studies/${id}/full`);
      if (res.ok) {
        const data = await res.json();
        setCaseData(data);
        setActiveCaseId(id);
        setCurrentStepIdx(0);
        setStepAnswers(new Map());
        setShowScore(false);
      }
    } catch {}
  };

  const handleStepAnswer = (stepId: string, answer: StepAnswer) => {
    setStepAnswers((prev) => {
      const next = new Map(prev);
      const existing = next.get(stepId) || [];
      const idx = existing.findIndex((a) => a.questionId === answer.questionId);
      if (idx >= 0) existing[idx] = answer;
      else existing.push(answer);
      next.set(stepId, existing);
      return next;
    });
  };

  const currentStep = caseData?.steps?.[currentStepIdx];
  const allQuestionsAnswered = currentStep?.questions?.every((q) => {
    const answers = stepAnswers.get(currentStep.id) || [];
    return answers.some((a) => a.questionId === q.id);
  });

  const goNextStep = () => {
    if (!caseData) return;
    if (currentStepIdx < caseData.steps.length - 1) {
      setCurrentStepIdx(currentStepIdx + 1);
    } else {
      setShowScore(true);
    }
  };

  const totalScore = () => {
    let earned = 0;
    let max = 0;
    stepAnswers.forEach((answers) => {
      answers.forEach((a) => {
        earned += a.pointsEarned;
        max += a.maxPoints;
      });
    });
    return { earned, max, pct: max > 0 ? Math.round((earned / max) * 100) : 0 };
  };

  const resetCase = () => {
    setActiveCaseId(null);
    setCaseData(null);
    setCurrentStepIdx(0);
    setStepAnswers(new Map());
    setShowScore(false);
  };

  if (showScore && caseData) {
    const score = totalScore();
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <Card className="border-0 shadow-lg" data-testid="card-score-summary">
            <CardContent className="p-8 text-center space-y-6">
              <Trophy className="w-16 h-16 mx-auto text-amber-500" />
              <h2 className="text-2xl font-bold text-gray-900">{t("pages.clinicalCaseStudy.caseStudyComplete")}</h2>
              <p className="text-gray-600">{caseData.study.title}</p>
              <div className="bg-gray-100 rounded-2xl p-6 inline-block">
                <div className="text-5xl font-bold text-gray-900" data-testid="text-final-score">{score.pct}%</div>
                <div className="text-sm text-gray-500 mt-1">{score.earned} / {score.max} points</div>
              </div>
              <div className="space-y-3">
                {caseData.steps.map((step, idx) => {
                  const answers = stepAnswers.get(step.id) || [];
                  const stepEarned = answers.reduce((s, a) => s + a.pointsEarned, 0);
                  const stepMax = answers.reduce((s, a) => s + a.maxPoints, 0);
                  return (
                    <div key={step.id} className="flex items-center justify-between text-sm p-3 bg-white rounded-lg border" data-testid={`text-step-score-${idx}`}>
                      <span className="text-gray-700">Step {step.stepNumber}</span>
                      <span className="font-medium">{stepEarned}/{stepMax} pts</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={resetCase} className="flex-1" data-testid="button-back-to-list">
                  <RotateCcw className="w-4 h-4 mr-2" /> Back to Cases
                </Button>
                <Button onClick={() => startCase(caseData.study.id)} className="flex-1 bg-gray-900 hover:bg-gray-800 text-white" data-testid="button-retry">
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (activeCaseId && caseData && currentStep) {
    const stepAnswersList = stepAnswers.get(currentStep.id) || [];
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={resetCase} data-testid="button-exit-case">
              <ChevronLeft className="w-4 h-4 mr-1" /> Exit Case
            </Button>
            <div className="flex items-center gap-2">
              {caseData.steps.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                    idx === currentStepIdx ? 'border-blue-500 bg-blue-500 text-white' :
                    idx < currentStepIdx ? 'border-green-500 bg-green-500 text-white' :
                    'border-gray-300 bg-white text-gray-400'
                  }`}
                  data-testid={`indicator-step-${idx}`}
                >
                  {idx < currentStepIdx ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                </div>
              ))}
            </div>
          </div>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 border-0 text-xs uppercase" data-testid="badge-case-tier">
                  {caseData.study.tier}
                </Badge>
                <Badge variant="outline" className="text-xs" data-testid="badge-case-difficulty">
                  {caseData.study.difficulty}
                </Badge>
                {caseData.study.bodySystem && (
                  <Badge variant="outline" className="text-xs">{caseData.study.bodySystem}</Badge>
                )}
              </div>
              <CardTitle className="text-lg text-gray-900" data-testid="text-case-title">{caseData.study.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentStepIdx === 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800 leading-relaxed" data-testid="text-scenario-intro">
                  <p className="font-semibold mb-1">{t("pages.clinicalCaseStudy.patientScenario")}</p>
                  {caseData.study.scenarioIntro}
                </div>
              )}

              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4" data-testid="text-clinical-update">
                <p className="text-xs font-bold text-indigo-800 mb-1">Step {currentStep.stepNumber} — Clinical Update</p>
                <p className="text-sm text-gray-800 leading-relaxed">{currentStep.clinicalUpdateText}</p>
              </div>
            </CardContent>
          </Card>

          <ExhibitPanel exhibitData={currentStep.exhibitData} />

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-gray-900">Questions — Step {currentStep.stepNumber}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentStep.questions.map((q) => {
                const existing = stepAnswersList.find((a) => a.questionId === q.id);
                return (
                  <QuestionRenderer
                    key={q.id}
                    question={q}
                    onAnswer={(ans) => handleStepAnswer(currentStep.id, ans)}
                    answered={!!existing}
                    existingAnswer={existing}
                  />
                );
              })}
            </CardContent>
          </Card>

          {allQuestionsAnswered && (
            <div className="flex justify-end">
              <Button onClick={goNextStep} className="bg-gray-900 hover:bg-gray-800 text-white px-6" data-testid="button-next-step">
                {currentStepIdx < caseData.steps.length - 1 ? (
                  <>Next Step <ChevronRight className="w-4 h-4 ml-1" /></>
                ) : (
                  <>View Results <ArrowRight className="w-4 h-4 ml-1" /></>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900" data-testid="text-page-title">{t("pages.clinicalCaseStudy.clinicalCaseStudies")}</h1>
          <p className="text-gray-600 mt-1">{t("pages.clinicalCaseStudy.practiceClinicalJudgmentWithMultistep")}</p>
        </div>

        <div className="flex gap-3 flex-wrap">
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm bg-white"
            data-testid="select-tier-filter"
          >
            <option value="">{t("pages.clinicalCaseStudy.allTiers")}</option>
            <option value="rpn">RPN</option>
            <option value="rn">RN</option>
            <option value="np">NP</option>
          </select>
          <select
            value={diffFilter}
            onChange={(e) => setDiffFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm bg-white"
            data-testid="select-difficulty-filter"
          >
            <option value="">{t("pages.clinicalCaseStudy.allDifficulties")}</option>
            <option value="easy">{t("pages.clinicalCaseStudy.easy")}</option>
            <option value="moderate">{t("pages.clinicalCaseStudy.moderate")}</option>
            <option value="hard">{t("pages.clinicalCaseStudy.hard")}</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">{t("pages.clinicalCaseStudy.loadingCaseStudies")}</div>
        ) : caseStudies.length === 0 ? (
          <div className="text-center py-12">
            <ClipboardList className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">{t("pages.clinicalCaseStudy.noCaseStudiesAvailableYet")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {caseStudies.map((cs) => (
              <Card key={cs.id} className="hover:shadow-md transition-shadow cursor-pointer border" data-testid={`card-case-${cs.id}`}>
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 border-0 text-xs uppercase">
                      {cs.tier}
                    </Badge>
                    <Badge variant="outline" className="text-xs">{cs.difficulty}</Badge>
                    {cs.bodySystem && <Badge variant="outline" className="text-xs">{cs.bodySystem}</Badge>}
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm">{cs.title}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2">{cs.scenarioIntro}</p>
                  <Button
                    size="sm"
                    onClick={() => startCase(cs.id)}
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white text-xs"
                    data-testid={`button-start-case-${cs.id}`}
                  >
                    Start Case Study <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
