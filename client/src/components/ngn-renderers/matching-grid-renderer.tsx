import { Badge } from "@/components/ui/badge";
import { Link2, X } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import type {
  MatchingGridPayload,
  MatchingGridResponse,
} from "@/lib/ngn-question-types";

interface MatchingGridRendererProps {
  payload: MatchingGridPayload;
  response: MatchingGridResponse;
  onResponseChange: (response: MatchingGridResponse) => void;
  disabled?: boolean;
}

export function MatchingGridRenderer({
  payload,
  response,
  onResponseChange,
  disabled = false,
}: MatchingGridRendererProps) {
  const { t } = useI18n();
  const handleMatch = (aId: string, bId: string) => {
    if (disabled) return;

    if (!payload.allowReuse) {
      const alreadyUsedBy = Object.entries(response.matches).find(
        ([key, val]) => val === bId && key !== aId
      );
      if (alreadyUsedBy) return;
    }

    const next = { ...response.matches, [aId]: bId };
    onResponseChange({ matches: next });
  };

  const clearMatch = (aId: string) => {
    if (disabled) return;
    const next = { ...response.matches };
    delete next[aId];
    onResponseChange({ matches: next });
  };

  const usedBIds = new Set(Object.values(response.matches));

  return (
    <div className="space-y-4" data-testid="renderer-matching-grid">
      <div className="flex items-center gap-2 mb-1">
        <Link2 className="w-4 h-4 text-slate-600" />
        <span className="text-sm font-semibold text-slate-700">
          Match each item on the left with the correct item on the right
        </span>
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse" data-testid="table-matching-grid">
          <thead>
            <tr>
              <th className="text-left px-4 py-2 bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600 uppercase w-1/3">
                Item
              </th>
              <th className="text-left px-4 py-2 bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600 uppercase">
                Match
              </th>
            </tr>
          </thead>
          <tbody>
            {payload.columnA.map((itemA) => {
              const matchedBId = response.matches[itemA.id];
              return (
                <tr key={itemA.id} data-testid={`row-match-${itemA.id}`}>
                  <td className="px-4 py-3 border border-slate-200 font-medium text-sm text-slate-800 align-top bg-white">
                    {itemA.label}
                  </td>
                  <td className="px-4 py-3 border border-slate-200 bg-white">
                    {matchedBId ? (
                      <div className="flex items-center gap-2">
                        <Badge className="bg-indigo-100 text-indigo-700 border-0 text-sm py-1 px-3" data-testid={`badge-matched-${itemA.id}`}>
                          {payload.columnB.find((b) => b.id === matchedBId)?.label || matchedBId}
                        </Badge>
                        {!disabled && (
                          <button
                            onClick={() => clearMatch(itemA.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                            data-testid={`button-clear-match-${itemA.id}`}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {payload.columnB.map((itemB) => {
                          const isUsed = !payload.allowReuse && usedBIds.has(itemB.id);
                          return (
                            <button
                              key={itemB.id}
                              onClick={() => handleMatch(itemA.id, itemB.id)}
                              disabled={disabled || isUsed}
                              className={`px-3 py-1.5 rounded-lg border text-xs transition-all ${
                                isUsed
                                  ? "border-gray-100 text-gray-300 cursor-not-allowed bg-gray-50"
                                  : "border-gray-200 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50 cursor-pointer"
                              }`}
                              data-testid={`button-match-${itemA.id}-${itemB.id}`}
                            >
                              {itemB.label}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-3">
        {payload.columnA.map((itemA) => {
          const matchedBId = response.matches[itemA.id];
          return (
            <div
              key={itemA.id}
              className="bg-white rounded-xl border border-slate-200 p-3"
              data-testid={`card-match-mobile-${itemA.id}`}
            >
              <p className="text-sm font-semibold text-slate-800 mb-2">{itemA.label}</p>
              {matchedBId ? (
                <div className="flex items-center gap-2">
                  <Badge className="bg-indigo-100 text-indigo-700 border-0 text-xs">
                    {payload.columnB.find((b) => b.id === matchedBId)?.label || matchedBId}
                  </Badge>
                  {!disabled && (
                    <button
                      onClick={() => clearMatch(itemA.id)}
                      className="text-gray-400 hover:text-red-500"
                      data-testid={`button-clear-match-mobile-${itemA.id}`}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {payload.columnB.map((itemB) => {
                    const isUsed = !payload.allowReuse && usedBIds.has(itemB.id);
                    return (
                      <button
                        key={itemB.id}
                        onClick={() => handleMatch(itemA.id, itemB.id)}
                        disabled={disabled || isUsed}
                        className={`px-2.5 py-1 rounded-lg border text-xs transition-all ${
                          isUsed
                            ? "border-gray-100 text-gray-300 cursor-not-allowed"
                            : "border-gray-200 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50"
                        }`}
                        data-testid={`button-match-mobile-${itemA.id}-${itemB.id}`}
                      >
                        {itemB.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
        <span>
          {Object.keys(response.matches).length} / {payload.columnA.length} matched
        </span>
        {!payload.allowReuse && (
          <span className="italic">{t("components.ngnRenderersMatchingGridRenderer.eachRightsideItemCanOnly")}</span>
        )}
      </div>
    </div>
  );
}
