import { useState, useRef, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Target, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import type {
  ImageHotspotPayload,
  ImageHotspotResponse,
} from "@/lib/ngn-question-types";

interface ImageHotspotRendererProps {
  payload: ImageHotspotPayload;
  response: ImageHotspotResponse;
  onResponseChange: (response: ImageHotspotResponse) => void;
  disabled?: boolean;
}

export function ImageHotspotRenderer({
  payload,
  response,
  onResponseChange,
  disabled = false,
}: ImageHotspotRendererProps) {
  const { t } = useI18n();
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleRegion = useCallback(
    (regionId: string) => {
      if (disabled) return;
      let next: string[];
      if (response.selectedRegionIds.includes(regionId)) {
        next = response.selectedRegionIds.filter((id) => id !== regionId);
      } else {
        if (response.selectedRegionIds.length >= payload.maxSelections) {
          next = [...response.selectedRegionIds.slice(1), regionId];
        } else {
          next = [...response.selectedRegionIds, regionId];
        }
      }
      onResponseChange({ selectedRegionIds: next });
    },
    [disabled, response, payload.maxSelections, onResponseChange]
  );

  return (
    <div className="space-y-3" data-testid="renderer-image-hotspot">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-slate-600" />
          <span className="text-sm font-semibold text-slate-700">
            Select the correct region{payload.maxSelections > 1 ? "s" : ""}
          </span>
          {payload.maxSelections > 1 && (
            <Badge variant="outline" className="text-xs">
              {response.selectedRegionIds.length} / {payload.maxSelections}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setScale((s) => Math.max(0.5, s - 0.25))} data-testid="button-hotspot-zoom-out">
            <ZoomOut className="w-3.5 h-3.5" />
          </Button>
          <span className="text-xs text-gray-500 min-w-[3rem] text-center font-mono">{Math.round(scale * 100)}%</span>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setScale((s) => Math.min(3, s + 0.25))} data-testid="button-hotspot-zoom-in">
            <ZoomIn className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setScale(1)} data-testid="button-hotspot-zoom-reset">
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative bg-gray-100 rounded-xl border border-slate-200 overflow-hidden"
        style={{ maxHeight: "500px" }}
        data-testid="hotspot-image-container"
      >
        <div style={{ transform: `scale(${scale})`, transformOrigin: "top left", position: "relative" }}>
          <img
            src={payload.imageUrl}
            alt={payload.imageAlt}
            className="w-full h-auto block"
            draggable={false}
            data-testid="img-hotspot"
          />
          {payload.regions.map((region) => {
            const isSelected = response.selectedRegionIds.includes(region.id);
            const style: React.CSSProperties = {
              position: "absolute",
              left: `${region.x}%`,
              top: `${region.y}%`,
              width: `${region.width}%`,
              height: `${region.height}%`,
              cursor: disabled ? "default" : "pointer",
            };

            const cls = `transition-all ${
              isSelected
                ? "bg-indigo-400/30 border-2 border-indigo-500 shadow-lg"
                : "bg-transparent border-2 border-transparent hover:bg-indigo-200/20 hover:border-indigo-300/50"
            }`;

            if (region.shape === "circle" || region.shape === "ellipse") {
              return (
                <div
                  key={region.id}
                  onClick={() => toggleRegion(region.id)}
                  style={{ ...style, borderRadius: "50%" }}
                  className={cls}
                  data-testid={`hotspot-region-${region.id}`}
                  title={region.label}
                />
              );
            }

            return (
              <div
                key={region.id}
                onClick={() => toggleRegion(region.id)}
                style={{ ...style, borderRadius: "4px" }}
                className={cls}
                data-testid={`hotspot-region-${region.id}`}
                title={region.label}
              />
            );
          })}
        </div>
      </div>

      {response.selectedRegionIds.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {response.selectedRegionIds.map((id) => {
            const region = payload.regions.find((r) => r.id === id);
            return (
              <Badge
                key={id}
                className="bg-indigo-100 text-indigo-700 border-0 text-xs cursor-pointer hover:bg-indigo-200"
                onClick={() => !disabled && toggleRegion(id)}
                data-testid={`badge-selected-region-${id}`}
              >
                {region?.label || id}
                {!disabled && <span className="ml-1">{t("components.ngnRenderersImageHotspotRenderer.times")}</span>}
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}
