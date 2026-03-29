import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, GripVertical, ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import type {
  MatrixQuestion,
  HighlightQuestion,
  TrendQuestion,
  ImageBasedQuestion,
  DragDropQuestion,
  CaseStudyQuestion,
  CaseStudySubQuestion,
} from "@/data/exam-questions/types";

interface RendererProps<T> {
  question: T;
  onAnswer?: (result: { correct: boolean; pointsEarned: number; maxPoints: number; selected: any }) => void;
  readOnly?: boolean;
}

export function MatrixRenderer({ question, onAnswer, readOnly }: RendererProps<MatrixQuestion>) {
  const { t } = useI18n();
  const [selections, setSelections] = useState<Record<string, string[]>>({});
  const [submitted, setSubmitted] = useState(false);

  const toggleCell = (rowId: string, colId: string) => {
    if (submitted || readOnly) return;
    setSelections((prev) => {
      const current = prev[rowId] || [];
      if (question.selectionMode === "single") {
        return { ...prev, [rowId]: current.includes(colId) ? [] : [colId] };
      }
      return {
        ...prev,
        [rowId]: current.includes(colId)
          ? current.filter((c) => c !== colId)
          : [...current, colId],
      };
    });
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const correct = question.correctCells;
    let totalCells = 0;
    let correctCells = 0;
    for (const row of question.rows) {
      const expected = correct[row.id] || [];
      const selected = selections[row.id] || [];
      totalCells += expected.length;
      for (const e of expected) {
        if (selected.includes(e)) correctCells++;
      }
      for (const s of selected) {
        if (!expected.includes(s)) correctCells = Math.max(0, correctCells - 1);
      }
    }
    const maxPoints = totalCells;
    const pointsEarned = Math.max(0, correctCells);
    onAnswer?.({ correct: pointsEarned === maxPoints, pointsEarned, maxPoints, selected: selections });
  };

  return (
    <div className="space-y-4" data-testid={`question-matrix-${question.id}`}>
      <p className="text-sm font-medium text-gray-800 leading-relaxed">{question.stem}</p>
      {question.scenario && <p className="text-xs text-gray-600 italic">{question.scenario}</p>}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border border-gray-300 bg-gray-50 p-2 text-left text-xs font-semibold"></th>
              {question.columns.map((col) => (
                <th key={col.id} className="border border-gray-300 bg-gray-50 p-2 text-center text-xs font-semibold">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {question.rows.map((row) => (
              <tr key={row.id}>
                <td className="border border-gray-300 p-2 text-xs font-medium bg-gray-50">{row.label}</td>
                {question.columns.map((col) => {
                  const isSelected = (selections[row.id] || []).includes(col.id);
                  const isCorrect = submitted && (question.correctCells[row.id] || []).includes(col.id);
                  const isWrong = submitted && isSelected && !isCorrect;
                  let cellCls = "bg-white hover:bg-blue-50 cursor-pointer";
                  if (submitted) {
                    if (isCorrect && isSelected) cellCls = "bg-green-100";
                    else if (isCorrect) cellCls = "bg-green-50";
                    else if (isWrong) cellCls = "bg-red-100";
                    else cellCls = "bg-white";
                  } else if (isSelected) {
                    cellCls = "bg-blue-100";
                  }
                  return (
                    <td
                      key={col.id}
                      onClick={() => toggleCell(row.id, col.id)}
                      className={`border border-gray-300 p-2 text-center ${cellCls} ${submitted ? "cursor-default" : "cursor-pointer"}`}
                      data-testid={`cell-${question.id}-${row.id}-${col.id}`}
                    >
                      {isSelected && !submitted && <div className="w-4 h-4 bg-blue-500 rounded-full mx-auto" />}
                      {submitted && isCorrect && isSelected && <CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" />}
                      {submitted && isCorrect && !isSelected && <div className="w-4 h-4 border-2 border-green-400 rounded-full mx-auto" />}
                      {submitted && isWrong && <XCircle className="w-4 h-4 text-red-500 mx-auto" />}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!submitted && !readOnly && (
        <Button
          onClick={handleSubmit}
          disabled={Object.keys(selections).length === 0 || Object.values(selections).every(v => v.length === 0)}
          className="w-full bg-gray-900 hover:bg-gray-800 text-white"
          data-testid={`button-submit-matrix-${question.id}`}
        >
          Submit Answer
        </Button>
      )}
      {submitted && (
        <div className="p-3 rounded-lg text-xs leading-relaxed bg-blue-50 border border-blue-200 text-blue-800" data-testid={`text-rationale-matrix-${question.id}`}>
          <p className="font-semibold mb-1">{t("components.advancedQuestionRenderers.rationale")}</p>
          <p>{question.rationale}</p>
        </div>
      )}
    </div>
  );
}

export function HighlightRenderer({ question, onAnswer, readOnly }: RendererProps<HighlightQuestion>) {
  const [selectedSpans, setSelectedSpans] = useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = useState(false);

  const toggleSpan = (spanId: string) => {
    if (submitted || readOnly) return;
    setSelectedSpans((prev) => {
      const next = new Set(prev);
      if (next.has(spanId)) {
        next.delete(spanId);
      } else if (next.size < question.maxSelections) {
        next.add(spanId);
      }
      return next;
    });
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const correctSet = new Set(question.correctSpanIds);
    const selected = Array.from(selectedSpans);
    let correctCount = 0;
    for (const s of selected) {
      if (correctSet.has(s)) correctCount++;
    }
    const wrongCount = selected.length - correctCount;
    const maxPoints = correctSet.size;
    const pointsEarned = Math.max(0, correctCount - wrongCount);
    onAnswer?.({ correct: pointsEarned === maxPoints, pointsEarned, maxPoints, selected });
  };

  const renderPassage = () => {
    const spans = [...question.highlightSpans].sort((a, b) => a.start - b.start);
    const parts: JSX.Element[] = [];
    let lastEnd = 0;

    for (const span of spans) {
      if (span.start > lastEnd) {
        parts.push(<span key={`text-${lastEnd}`}>{question.passage.slice(lastEnd, span.start)}</span>);
      }
      const isSelected = selectedSpans.has(span.spanId);
      const isCorrect = submitted && question.correctSpanIds.includes(span.spanId);
      const isWrong = submitted && isSelected && !isCorrect;
      let cls = "px-1 rounded cursor-pointer transition-colors";
      if (submitted) {
        if (isCorrect && isSelected) cls += " bg-green-200 border-b-2 border-green-500";
        else if (isCorrect) cls += " bg-green-100 border-b-2 border-green-300";
        else if (isWrong) cls += " bg-red-200 border-b-2 border-red-500";
        else cls += " bg-gray-100";
      } else if (isSelected) {
        cls += " bg-yellow-200 border-b-2 border-yellow-500";
      } else {
        cls += " bg-gray-100 hover:bg-yellow-100";
      }

      parts.push(
        <span
          key={span.spanId}
          onClick={() => toggleSpan(span.spanId)}
          className={cls}
          data-testid={`span-${question.id}-${span.spanId}`}
        >
          {span.text}
        </span>
      );
      lastEnd = span.end;
    }
    if (lastEnd < question.passage.length) {
      parts.push(<span key={`text-end`}>{question.passage.slice(lastEnd)}</span>);
    }
    return parts;
  };

  return (
    <div className="space-y-4" data-testid={`question-highlight-${question.id}`}>
      <p className="text-sm font-medium text-gray-800 leading-relaxed">{question.stem}</p>
      <p className="text-xs text-gray-500">Select up to {question.maxSelections} highlighted sections</p>
      <div className="p-4 bg-white border border-gray-200 rounded-lg text-sm leading-relaxed">
        {renderPassage()}
      </div>
      {!submitted && !readOnly && (
        <Button
          onClick={handleSubmit}
          disabled={selectedSpans.size === 0}
          className="w-full bg-gray-900 hover:bg-gray-800 text-white"
          data-testid={`button-submit-highlight-${question.id}`}
        >
          Submit Answer
        </Button>
      )}
      {submitted && (
        <div className="p-3 rounded-lg text-xs leading-relaxed bg-blue-50 border border-blue-200 text-blue-800" data-testid={`text-rationale-highlight-${question.id}`}>
          <p className="font-semibold mb-1">{t("components.advancedQuestionRenderers.rationale2")}</p>
          <p>{question.rationale}</p>
        </div>
      )}
    </div>
  );
}

export function TrendRenderer({ question, onAnswer, readOnly }: RendererProps<TrendQuestion>) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    const isCorrect = selected === question.correctAnswer;
    onAnswer?.({ correct: isCorrect, pointsEarned: isCorrect ? 1 : 0, maxPoints: 1, selected });
  };

  return (
    <div className="space-y-4" data-testid={`question-trend-${question.id}`}>
      <p className="text-sm font-medium text-gray-800 leading-relaxed">{question.stem}</p>
      {question.scenario && <p className="text-xs text-gray-600 italic mb-2">{question.scenario}</p>}
      <div className="space-y-2">
        {question.timepoints.map((tp, idx) => (
          <div key={idx} className="p-3 bg-white border border-gray-200 rounded-lg">
            <p className="text-xs font-semibold text-gray-700 mb-1">{tp.timeLabel}</p>
            {tp.vitals && (
              <div className="flex flex-wrap gap-2 mb-1">
                {Object.entries(tp.vitals).map(([k, v]) => (
                  <span key={k} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                    {k}: {v}
                  </span>
                ))}
              </div>
            )}
            {tp.labs && (
              <div className="flex flex-wrap gap-2 mb-1">
                {Object.entries(tp.labs).map(([k, v]) => (
                  <span key={k} className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded">
                    {k}: {v}
                  </span>
                ))}
              </div>
            )}
            {tp.nurseNotes && <p className="text-xs text-gray-600 italic">{tp.nurseNotes}</p>}
            {tp.medications && tp.medications.length > 0 && (
              <p className="text-xs text-gray-500">Meds: {tp.medications.join(", ")}</p>
            )}
          </div>
        ))}
      </div>
      <p className="text-sm font-medium text-gray-800">{question.interpretationQuestion}</p>
      <div className="space-y-2">
        {question.options.map((opt, idx) => {
          const isSelected = selected === idx;
          const isCorrectAnswer = question.correctAnswer === idx;
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
              onClick={() => !submitted && !readOnly && setSelected(idx)}
              disabled={submitted || readOnly}
              className={`w-full text-left p-3 rounded-lg border text-sm transition-all ${cls}`}
              data-testid={`button-option-trend-${question.id}-${idx}`}
            >
              <div className="flex items-center gap-2">
                {submitted && isCorrectAnswer && <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />}
                {submitted && isSelected && !isCorrectAnswer && <XCircle className="w-4 h-4 text-red-500 shrink-0" />}
                <span>{String.fromCharCode(65 + idx)}. {opt}</span>
              </div>
            </button>
          );
        })}
      </div>
      {!submitted && !readOnly && (
        <Button
          onClick={handleSubmit}
          disabled={selected === null}
          className="w-full bg-gray-900 hover:bg-gray-800 text-white"
          data-testid={`button-submit-trend-${question.id}`}
        >
          Submit Answer
        </Button>
      )}
      {submitted && (
        <div className="p-3 rounded-lg text-xs leading-relaxed bg-blue-50 border border-blue-200 text-blue-800" data-testid={`text-rationale-trend-${question.id}`}>
          <p className="font-semibold mb-1">{t("components.advancedQuestionRenderers.rationale3")}</p>
          <p>{question.rationale}</p>
        </div>
      )}
    </div>
  );
}

export function ImageBasedRenderer({ question, onAnswer, readOnly }: RendererProps<ImageBasedQuestion>) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const imageTypeLabels: Record<string, string> = {
    ecg: "ECG/EKG Reading",
    xray: "X-Ray Description",
    wound: "Wound Assessment",
    skin: "Skin Condition",
    lab_result: "Lab Result Interpretation",
    assessment: "Clinical Assessment",
    other: "Clinical Finding",
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const isCorrect = selected === question.correctAnswer;
    onAnswer?.({ correct: isCorrect, pointsEarned: isCorrect ? 1 : 0, maxPoints: 1, selected });
  };

  return (
    <div className="space-y-4" data-testid={`question-image-${question.id}`}>
      <p className="text-sm font-medium text-gray-800 leading-relaxed">{question.stem}</p>
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-xs font-semibold text-amber-700 mb-1">{imageTypeLabels[question.imageType] || "Clinical Finding"}</p>
        <p className="text-sm text-gray-800 italic">{question.imageDescription}</p>
        {question.clinicalFindings.length > 0 && (
          <ul className="mt-2 space-y-1">
            {question.clinicalFindings.map((f, i) => (
              <li key={i} className="text-xs text-gray-700 flex items-center gap-1">
                <ArrowRight className="w-3 h-3 text-amber-600" /> {f}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="space-y-2">
        {question.options.map((opt, idx) => {
          const isSelected = selected === idx;
          const isCorrectAnswer = question.correctAnswer === idx;
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
              onClick={() => !submitted && !readOnly && setSelected(idx)}
              disabled={submitted || readOnly}
              className={`w-full text-left p-3 rounded-lg border text-sm transition-all ${cls}`}
              data-testid={`button-option-image-${question.id}-${idx}`}
            >
              <div className="flex items-center gap-2">
                {submitted && isCorrectAnswer && <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />}
                {submitted && isSelected && !isCorrectAnswer && <XCircle className="w-4 h-4 text-red-500 shrink-0" />}
                <span>{String.fromCharCode(65 + idx)}. {opt}</span>
              </div>
            </button>
          );
        })}
      </div>
      {!submitted && !readOnly && (
        <Button
          onClick={handleSubmit}
          disabled={selected === null}
          className="w-full bg-gray-900 hover:bg-gray-800 text-white"
          data-testid={`button-submit-image-${question.id}`}
        >
          Submit Answer
        </Button>
      )}
      {submitted && (
        <div className="p-3 rounded-lg text-xs leading-relaxed bg-blue-50 border border-blue-200 text-blue-800" data-testid={`text-rationale-image-${question.id}`}>
          <p className="font-semibold mb-1">{t("components.advancedQuestionRenderers.rationale4")}</p>
          <p>{question.rationale}</p>
        </div>
      )}
    </div>
  );
}

export function DragDropRenderer({ question, onAnswer, readOnly }: RendererProps<DragDropQuestion>) {
  const [orderedItems, setOrderedItems] = useState<string[]>([]);
  const [availableItems, setAvailableItems] = useState<string[]>(question.items.map((i) => i.id));
  const [submitted, setSubmitted] = useState(false);

  const addItem = (itemId: string) => {
    if (submitted || readOnly) return;
    setOrderedItems((prev) => [...prev, itemId]);
    setAvailableItems((prev) => prev.filter((id) => id !== itemId));
  };

  const removeItem = (itemId: string) => {
    if (submitted || readOnly) return;
    setOrderedItems((prev) => prev.filter((id) => id !== itemId));
    setAvailableItems((prev) => [...prev, itemId]);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const isCorrect =
      orderedItems.length === question.correctOrder.length &&
      orderedItems.every((id, i) => id === question.correctOrder[i]);
    onAnswer?.({
      correct: isCorrect,
      pointsEarned: isCorrect ? 1 : 0,
      maxPoints: 1,
      selected: orderedItems,
    });
  };

  const getLabel = (id: string) => question.items.find((i) => i.id === id)?.label || id;

  return (
    <div className="space-y-4" data-testid={`question-dragdrop-${question.id}`}>
      <p className="text-sm font-medium text-gray-800 leading-relaxed">{question.stem}</p>
      {question.scenario && <p className="text-xs text-gray-600 italic">{question.scenario}</p>}
      <p className="text-xs text-gray-500">
        {question.mode === "order" ? "Click items in the correct order:" : "Categorize the following items:"}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-xs font-semibold text-gray-600 mb-2">{t("components.advancedQuestionRenderers.availableItems")}</p>
          <div className="space-y-1 min-h-[100px] p-2 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            {availableItems.map((id) => (
              <button
                key={id}
                onClick={() => addItem(id)}
                disabled={submitted || readOnly}
                className="w-full text-left p-2 rounded bg-white border border-gray-200 text-sm hover:bg-blue-50 hover:border-blue-300 transition-colors flex items-center gap-2"
                data-testid={`button-dragdrop-add-${question.id}-${id}`}
              >
                <GripVertical className="w-3 h-3 text-gray-400" />
                {getLabel(id)}
              </button>
            ))}
            {availableItems.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-4">{t("components.advancedQuestionRenderers.allItemsPlaced")}</p>
            )}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-600 mb-2">{t("components.advancedQuestionRenderers.yourOrder")}</p>
          <div className="space-y-1 min-h-[100px] p-2 bg-blue-50 rounded-lg border border-dashed border-blue-300">
            {orderedItems.map((id, idx) => {
              const isCorrectPos = submitted && question.correctOrder[idx] === id;
              const isWrongPos = submitted && question.correctOrder[idx] !== id;
              let cls = "bg-white border-blue-200";
              if (isCorrectPos) cls = "bg-green-50 border-green-300";
              if (isWrongPos) cls = "bg-red-50 border-red-300";
              return (
                <div
                  key={id}
                  className={`p-2 rounded border text-sm flex items-center justify-between ${cls}`}
                  data-testid={`item-dragdrop-placed-${question.id}-${idx}`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-500">{idx + 1}.</span>
                    {getLabel(id)}
                  </span>
                  {!submitted && !readOnly && (
                    <button
                      onClick={() => removeItem(id)}
                      className="text-red-400 hover:text-red-600 text-xs"
                      data-testid={`button-dragdrop-remove-${question.id}-${id}`}
                    >
                      Remove
                    </button>
                  )}
                  {submitted && isCorrectPos && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                  {submitted && isWrongPos && <XCircle className="w-4 h-4 text-red-500" />}
                </div>
              );
            })}
            {orderedItems.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-4">{t("components.advancedQuestionRenderers.clickItemsToAddThem")}</p>
            )}
          </div>
        </div>
      </div>
      {!submitted && !readOnly && (
        <Button
          onClick={handleSubmit}
          disabled={orderedItems.length !== question.items.length}
          className="w-full bg-gray-900 hover:bg-gray-800 text-white"
          data-testid={`button-submit-dragdrop-${question.id}`}
        >
          Submit Answer
        </Button>
      )}
      {submitted && (
        <div className="space-y-2">
          <div className="p-3 rounded-lg text-xs leading-relaxed bg-blue-50 border border-blue-200 text-blue-800" data-testid={`text-rationale-dragdrop-${question.id}`}>
            <p className="font-semibold mb-1">{t("components.advancedQuestionRenderers.rationale5")}</p>
            <p>{question.rationale}</p>
          </div>
          <div className="p-2 rounded-lg text-xs bg-gray-50 border border-gray-200">
            <p className="font-semibold mb-1 text-gray-700">{t("components.advancedQuestionRenderers.correctOrder")}</p>
            {question.correctOrder.map((id, i) => (
              <p key={i} className="text-gray-600">{i + 1}. {getLabel(id)}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function CaseStudyRenderer({ question, onAnswer, readOnly }: RendererProps<CaseStudyQuestion>) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [completed, setCompleted] = useState(false);

  const totalQuestions = question.questions.length;
  const currentQ = question.questions[currentStep];

  const handleStepAnswer = (stepAnswer: any) => {
    setAnswers((prev) => ({ ...prev, [currentQ.id]: stepAnswer }));
    if (currentStep < totalQuestions - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      setCompleted(true);
      const totalPoints = question.questions.reduce((sum, q) => sum + q.points, 0);
      const earnedPoints = Object.values({ ...answers, [currentQ.id]: stepAnswer }).reduce(
        (sum: number, a: any) => sum + (a?.pointsEarned || 0),
        0
      );
      onAnswer?.({
        correct: earnedPoints === totalPoints,
        pointsEarned: earnedPoints,
        maxPoints: totalPoints,
        selected: { ...answers, [currentQ.id]: stepAnswer },
      });
    }
  };

  return (
    <div className="space-y-4" data-testid={`question-casestudy-${question.id}`}>
      <div className="p-4 bg-white border border-gray-200 rounded-lg">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">{t("components.advancedQuestionRenderers.patientProfile")}</span>
          <span className="text-xs text-gray-500">{question.bodySystem}</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs mb-2">
          <p><span className="font-semibold">{t("components.advancedQuestionRenderers.name")}</span> {question.patientProfile.name}</p>
          <p><span className="font-semibold">{t("components.advancedQuestionRenderers.age")}</span> {question.patientProfile.age}</p>
          <p><span className="font-semibold">{t("components.advancedQuestionRenderers.gender")}</span> {question.patientProfile.gender}</p>
          <p><span className="font-semibold">{t("components.advancedQuestionRenderers.chiefComplaint")}</span> {question.patientProfile.chiefComplaint}</p>
        </div>
        <p className="text-xs text-gray-700">{question.patientProfile.history}</p>
      </div>

      {question.vitals && Object.keys(question.vitals).length > 0 && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs font-semibold text-blue-700 mb-1">{t("components.advancedQuestionRenderers.vitalSigns")}</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(question.vitals).map(([k, v]) => (
              <span key={k} className="text-xs bg-white px-2 py-0.5 rounded border border-blue-200">
                {k}: {v}
              </span>
            ))}
          </div>
        </div>
      )}

      {question.labs && Object.keys(question.labs).length > 0 && (
        <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
          <p className="text-xs font-semibold text-purple-700 mb-1">{t("components.advancedQuestionRenderers.labResults")}</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(question.labs).map(([k, v]) => (
              <span key={k} className="text-xs bg-white px-2 py-0.5 rounded border border-purple-200">
                {k}: {v}
              </span>
            ))}
          </div>
        </div>
      )}

      {question.medications && question.medications.length > 0 && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-xs font-semibold text-green-700 mb-1">{t("components.advancedQuestionRenderers.currentMedications")}</p>
          <p className="text-xs text-gray-700">{question.medications.join(", ")}</p>
        </div>
      )}

      {question.nurseNotes && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-xs font-semibold text-amber-700 mb-1">{t("components.advancedQuestionRenderers.nurseNotes")}</p>
          <p className="text-xs text-gray-700 italic">{question.nurseNotes}</p>
        </div>
      )}

      <div className="flex items-center gap-2 text-xs text-gray-500">
        <span>Question {currentStep + 1} of {totalQuestions}</span>
        <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 transition-all"
            style={{ width: `${((currentStep + (completed ? 1 : 0)) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {!completed && (
        <CaseStudySubQuestionRenderer
          key={currentQ.id}
          question={currentQ}
          onAnswer={handleStepAnswer}
          readOnly={readOnly}
        />
      )}

      {completed && (
        <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg" data-testid={`text-overall-rationale-${question.id}`}>
          <p className="text-sm font-semibold text-indigo-700 mb-2">{t("components.advancedQuestionRenderers.caseStudySummary")}</p>
          <p className="text-xs text-gray-700 leading-relaxed">{question.overallRationale}</p>
        </div>
      )}
    </div>
  );
}

function CaseStudySubQuestionRenderer({
  question,
  onAnswer,
  readOnly,
}: {
  question: CaseStudySubQuestion;
  onAnswer: (result: any) => void;
  readOnly?: boolean;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [multiSelected, setMultiSelected] = useState<Set<number>>(new Set());
  const [textAnswer, setTextAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const options = question.answerOptions || [];
  const correct = question.correctAnswer;
  const qType = question.questionType;

  const handleSubmit = () => {
    setSubmitted(true);
    let isCorrect = false;
    let pointsEarned = 0;
    const maxPoints = question.points || 1;

    if (qType === "multiple_choice") {
      isCorrect = correct === selected;
      pointsEarned = isCorrect ? maxPoints : 0;
    } else if (qType === "multiple_response") {
      const selectedArr = Array.from(multiSelected);
      const correctArr = Array.isArray(correct) ? correct : [correct];
      const correctSet = new Set(correctArr);
      const correctCount = selectedArr.filter((s) => correctSet.has(s)).length;
      isCorrect = correctCount === correctSet.size && selectedArr.length === correctSet.size;
      pointsEarned = isCorrect ? maxPoints : 0;
    } else if (qType === "fill_blank") {
      const correctArr = Array.isArray(correct) ? correct : [correct];
      isCorrect = correctArr.some((c: any) => String(c).toLowerCase().trim() === textAnswer.toLowerCase().trim());
      pointsEarned = isCorrect ? maxPoints : 0;
    }

    onAnswer({ questionId: question.id, selected: selected ?? Array.from(multiSelected), correct: isCorrect, pointsEarned, maxPoints });
  };

  if (qType === "multiple_choice") {
    return (
      <div className="space-y-3" data-testid={`subquestion-${question.id}`}>
        <p className="text-sm text-gray-800 font-medium">{question.questionText}</p>
        <div className="space-y-2">
          {options.map((opt, idx) => {
            const isSelected = selected === idx;
            const isCorrectAnswer = correct === idx;
            let cls = "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50";
            if (submitted) {
              if (isCorrectAnswer) cls = "border-green-500 bg-green-50";
              else if (isSelected && !isCorrectAnswer) cls = "border-red-400 bg-red-50";
              else cls = "border-gray-200 opacity-50";
            } else if (isSelected) cls = "border-blue-500 bg-blue-50";
            return (
              <button
                key={idx}
                onClick={() => !submitted && !readOnly && setSelected(idx)}
                disabled={submitted || readOnly}
                className={`w-full text-left p-3 rounded-lg border text-sm transition-all ${cls}`}
                data-testid={`button-sub-option-${question.id}-${idx}`}
              >
                {String.fromCharCode(65 + idx)}. {opt}
              </button>
            );
          })}
        </div>
        {!submitted && !readOnly && (
          <Button onClick={handleSubmit} disabled={selected === null} className="w-full bg-gray-900 hover:bg-gray-800 text-white" data-testid={`button-submit-sub-${question.id}`}>
            Submit & Continue
          </Button>
        )}
        {submitted && question.rationale && (
          <div className="p-3 rounded-lg text-xs bg-blue-50 border border-blue-200 text-blue-800">
            <p className="font-semibold mb-1">{t("components.advancedQuestionRenderers.rationale6")}</p>
            <p>{question.rationale}</p>
          </div>
        )}
      </div>
    );
  }

  if (qType === "multiple_response") {
    return (
      <div className="space-y-3" data-testid={`subquestion-${question.id}`}>
        <p className="text-sm text-gray-800 font-medium">{question.questionText}</p>
        <p className="text-xs text-gray-500">{t("components.advancedQuestionRenderers.selectAllThatApply")}</p>
        <div className="space-y-2">
          {options.map((opt, idx) => {
            const isSelected = multiSelected.has(idx);
            let cls = "border-gray-200 hover:border-blue-300";
            if (isSelected) cls = "border-blue-500 bg-blue-50";
            return (
              <button
                key={idx}
                onClick={() => {
                  if (submitted || readOnly) return;
                  const next = new Set(multiSelected);
                  if (next.has(idx)) next.delete(idx); else next.add(idx);
                  setMultiSelected(next);
                }}
                disabled={submitted || readOnly}
                className={`w-full text-left p-3 rounded-lg border text-sm transition-all ${cls}`}
                data-testid={`button-sub-option-${question.id}-${idx}`}
              >
                {String.fromCharCode(65 + idx)}. {opt}
              </button>
            );
          })}
        </div>
        {!submitted && !readOnly && (
          <Button onClick={handleSubmit} disabled={multiSelected.size === 0} className="w-full bg-gray-900 hover:bg-gray-800 text-white" data-testid={`button-submit-sub-${question.id}`}>
            Submit & Continue
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3" data-testid={`subquestion-${question.id}`}>
      <p className="text-sm text-gray-800 font-medium">{question.questionText}</p>
      <input
        type="text"
        value={textAnswer}
        onChange={(e) => setTextAnswer(e.target.value)}
        disabled={submitted || readOnly}
        className="w-full p-2 border border-gray-300 rounded text-sm"
        placeholder={t("components.advancedQuestionRenderers.typeYourAnswer")}
        data-testid={`input-sub-fill-${question.id}`}
      />
      {!submitted && !readOnly && (
        <Button onClick={handleSubmit} disabled={!textAnswer.trim()} className="w-full bg-gray-900 hover:bg-gray-800 text-white" data-testid={`button-submit-sub-${question.id}`}>
          Submit & Continue
        </Button>
      )}
    </div>
  );
}
