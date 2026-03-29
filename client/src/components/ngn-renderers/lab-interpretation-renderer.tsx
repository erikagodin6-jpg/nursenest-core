import { Badge } from "@/components/ui/badge";
import { FlaskConical, AlertTriangle, ArrowUp, ArrowDown } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import type {
  LabInterpretationPayload,
  LabInterpretationResponse,
} from "@/lib/ngn-question-types";

interface LabInterpretationRendererProps {
  payload: LabInterpretationPayload;
  response: LabInterpretationResponse;
  onResponseChange: (response: LabInterpretationResponse) => void;
  disabled?: boolean;
}

function FlagBadge({ flag }: { flag?: string }) {
  const { t } = useI18n();
  if (!flag) return null;
  const isHigh = flag === "HIGH" || flag === "CRITICAL_HIGH";
  const isCritical = flag === "CRITICAL_HIGH" || flag === "CRITICAL_LOW";
  return (
    <Badge
      className={`text-[10px] px-1.5 py-0 border-0 ${
        isCritical
          ? "bg-red-100 text-red-700"
          : isHigh
          ? "bg-amber-100 text-amber-700"
          : "bg-blue-100 text-blue-700"
      }`}
      data-testid={`badge-lab-flag-${flag}`}
    >
      {isHigh ? <ArrowUp className="w-2.5 h-2.5 mr-0.5" /> : <ArrowDown className="w-2.5 h-2.5 mr-0.5" />}
      {flag.replace("_", " ")}
    </Badge>
  );
}

export function LabInterpretationRenderer({
  payload,
  response,
  onResponseChange,
  disabled = false,
}: LabInterpretationRendererProps) {
  const isSATA = payload.embeddedQuestion.questionType === "SATA";
  const maxSelect = payload.embeddedQuestion.selectCount || (isSATA ? undefined : 1);

  const toggleOption = (optId: string) => {
    if (disabled) return;
    let next: string[];
    if (isSATA) {
      if (response.selectedOptionIds.includes(optId)) {
        next = response.selectedOptionIds.filter((id) => id !== optId);
      } else {
        if (maxSelect && response.selectedOptionIds.length >= maxSelect) return;
        next = [...response.selectedOptionIds, optId];
      }
    } else {
      next = [optId];
    }
    onResponseChange({ selectedOptionIds: next });
  };

  return (
    <div className="space-y-4" data-testid="renderer-lab-interpretation">
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 px-4 py-3 border-b border-slate-200 flex items-center gap-2">
          <FlaskConical className="w-4 h-4 text-purple-600" />
          <h3 className="text-sm font-bold text-purple-900 uppercase tracking-wide">
            {payload.panelName}
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm" data-testid="table-lab-values">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-2.5 font-semibold text-slate-600 text-xs uppercase tracking-wide">{t("components.ngnRenderersLabInterpretationRenderer.test")}</th>
                <th className="text-right px-4 py-2.5 font-semibold text-slate-600 text-xs uppercase tracking-wide">{t("components.ngnRenderersLabInterpretationRenderer.result")}</th>
                <th className="text-center px-4 py-2.5 font-semibold text-slate-600 text-xs uppercase tracking-wide">{t("components.ngnRenderersLabInterpretationRenderer.unit")}</th>
                <th className="text-center px-4 py-2.5 font-semibold text-slate-600 text-xs uppercase tracking-wide">{t("components.ngnRenderersLabInterpretationRenderer.reference")}</th>
                <th className="text-center px-4 py-2.5 font-semibold text-slate-600 text-xs uppercase tracking-wide">{t("components.ngnRenderersLabInterpretationRenderer.status")}</th>
              </tr>
            </thead>
            <tbody>
              {payload.labValues.map((lab) => (
                <tr
                  key={lab.id}
                  className={`border-b border-slate-100 ${
                    lab.isAbnormal ? "bg-red-50/40" : ""
                  }`}
                  data-testid={`row-lab-${lab.id}`}
                >
                  <td className="px-4 py-2.5 font-medium text-slate-800">{lab.name}</td>
                  <td className={`px-4 py-2.5 text-right font-mono font-semibold ${
                    lab.isAbnormal ? "text-red-700" : "text-slate-700"
                  }`}>
                    {lab.value}
                  </td>
                  <td className="px-4 py-2.5 text-center text-slate-500">{lab.unit}</td>
                  <td className="px-4 py-2.5 text-center text-slate-500">{lab.normalRangeDisplay}</td>
                  <td className="px-4 py-2.5 text-center">
                    {lab.isAbnormal ? (
                      <div className="flex items-center justify-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                        <FlagBadge flag={lab.flag} />
                      </div>
                    ) : (
                      <span className="text-xs text-emerald-600 font-medium">{t("components.ngnRenderersLabInterpretationRenderer.normal")}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <p className="text-base font-medium text-gray-900 leading-relaxed mb-3" data-testid="text-lab-question-stem">
          {payload.embeddedQuestion.stem}
        </p>
        {isSATA && maxSelect && (
          <p className="text-xs text-gray-500 mb-2">Select {maxSelect} answer(s)</p>
        )}
        <div className="space-y-2">
          {payload.embeddedQuestion.options.map((opt) => {
            const isSelected = response.selectedOptionIds.includes(opt.id);
            return (
              <button
                key={opt.id}
                onClick={() => toggleOption(opt.id)}
                disabled={disabled}
                className={`w-full text-left p-3 rounded-lg border text-sm transition-all ${
                  isSelected
                    ? "border-indigo-500 bg-indigo-50 text-indigo-900"
                    : "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/30 text-gray-700"
                } ${disabled ? "cursor-default opacity-70" : "cursor-pointer"}`}
                data-testid={`button-lab-option-${opt.id}`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-4 h-4 rounded ${isSATA ? "" : "rounded-full"} border-2 flex items-center justify-center shrink-0 ${
                    isSelected ? "border-indigo-500 bg-indigo-500" : "border-gray-300"
                  }`}>
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </span>
                  {opt.label}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
