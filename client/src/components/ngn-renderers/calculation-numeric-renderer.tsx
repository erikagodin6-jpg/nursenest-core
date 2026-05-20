import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Calculator, Info } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import type {
  CalculationNumericPayload,
  CalculationNumericResponse,
} from "@/lib/ngn-question-types";

interface CalculationNumericRendererProps {
  payload: CalculationNumericPayload;
  response: CalculationNumericResponse;
  onResponseChange: (response: CalculationNumericResponse) => void;
  disabled?: boolean;
}

export function CalculationNumericRenderer({
  payload,
  response,
  onResponseChange,
  disabled = false,
}: CalculationNumericRendererProps) {
  const { t } = useI18n();
  const units = payload.availableUnits && payload.availableUnits.length > 0
    ? payload.availableUnits
    : [payload.unit];

  const effectiveUnit = response.selectedUnit || payload.unit || units[0];

  const [inputValue, setInputValue] = useState<string>(
    response.numericAnswer !== null && response.numericAnswer !== undefined
      ? String(response.numericAnswer)
      : ""
  );

  useEffect(() => {
    if (!response.selectedUnit && effectiveUnit) {
      onResponseChange({
        numericAnswer: response.numericAnswer,
        selectedUnit: effectiveUnit,
      });
    }
  }, []);

  const handleInputChange = (val: string) => {
    setInputValue(val);
    const parsed = parseFloat(val);
    onResponseChange({
      numericAnswer: isNaN(parsed) ? null : parsed,
      selectedUnit: effectiveUnit,
    });
  };

  const handleUnitChange = (unit: string) => {
    onResponseChange({
      numericAnswer: response.numericAnswer,
      selectedUnit: unit,
    });
  };

  return (
    <div className="space-y-4" data-testid="renderer-calculation-numeric">
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Calculator className="w-4 h-4 text-amber-600" />
          <h3 className="text-sm font-bold text-amber-900 uppercase tracking-wide">{t("components.ngnRenderersCalculationNumericRenderer.calculationProblem")}</h3>
        </div>
        <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap" data-testid="text-calc-problem">
          {payload.problemStatement}
        </p>
        {payload.formula && (
          <div className="mt-3 bg-white/70 rounded-lg border border-amber-100 px-3 py-2">
            <div className="flex items-center gap-1.5 mb-1">
              <Info className="w-3 h-3 text-amber-500" />
              <span className="text-xs text-amber-700 font-semibold">{t("components.ngnRenderersCalculationNumericRenderer.formula")}</span>
            </div>
            <p className="text-sm font-mono text-gray-700" data-testid="text-calc-formula">{payload.formula}</p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <label className="text-sm font-semibold text-gray-700 mb-3 block">{t("components.ngnRenderersCalculationNumericRenderer.yourAnswer")}</label>
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <input
              type="number"
              step="any"
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              disabled={disabled}
              placeholder={t("components.ngnRenderersCalculationNumericRenderer.enterNumericValue")}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-lg font-mono focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              data-testid="input-calc-answer"
            />
          </div>
          {units.length === 1 ? (
            <Badge className="bg-gray-100 text-gray-700 border-0 text-sm px-3 py-2" data-testid="badge-calc-unit">
              {units[0]}
            </Badge>
          ) : (
            <select
              value={response.selectedUnit}
              onChange={(e) => handleUnitChange(e.target.value)}
              disabled={disabled}
              className="px-3 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 bg-white disabled:opacity-60"
              data-testid="select-calc-unit"
            >
              {units.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
    </div>
  );
}
