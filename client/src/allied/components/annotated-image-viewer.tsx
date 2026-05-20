import { useState, useCallback } from "react";
import { Eye, EyeOff } from "lucide-react";
import { LabImageViewer } from "./lab-image-viewer";

import { useI18n } from "@/lib/i18n";
interface Annotation {
  id: string;
  x: number;
  y: number;
  label: string;
  description?: string;
  number?: number;
}

interface AnnotatedImageViewerProps {
  src: string;
  alt?: string;
  caption?: string;
  annotations: Annotation[];
  mode?: "lesson" | "exam" | "review";
  showAnnotations?: boolean;
  onAnnotationClick?: (annotation: Annotation) => void;
  className?: string;
}

export function AnnotatedImageViewer({
  src,
  alt = "Annotated lab image",
  caption,
  annotations,
  mode = "lesson",
  showAnnotations: showAnnotationsProp,
  onAnnotationClick,
  className = "",
}: AnnotatedImageViewerProps) {
  const { t } = useI18n();
  const [showAnnotations, setShowAnnotations] = useState(
    showAnnotationsProp !== undefined ? showAnnotationsProp : mode !== "exam"
  );
  const [activeAnnotation, setActiveAnnotation] = useState<string | null>(null);
  const [revealedAnnotations, setRevealedAnnotations] = useState<Set<string>>(new Set());

  const handleAnnotationClick = useCallback(
    (annotation: Annotation) => {
      if (mode === "exam") {
        setRevealedAnnotations((prev) => {
          const next = new Set(prev);
          if (next.has(annotation.id)) next.delete(annotation.id);
          else next.add(annotation.id);
          return next;
        });
      }
      setActiveAnnotation((prev) => (prev === annotation.id ? null : annotation.id));
      onAnnotationClick?.(annotation);
    },
    [mode, onAnnotationClick]
  );

  const isAnnotationVisible = useCallback(
    (annotation: Annotation) => {
      if (mode === "exam") return revealedAnnotations.has(annotation.id);
      return showAnnotations;
    },
    [mode, showAnnotations, revealedAnnotations]
  );

  return (
    <div className={`relative ${className}`} data-testid="annotated-image-viewer">
      <div className="relative">
        <LabImageViewer src={src} alt={alt} caption={caption} allowZoom={mode !== "exam"} showControls={mode !== "exam"} />
        {annotations.map((annotation) => {
          const visible = isAnnotationVisible(annotation);
          return (
            <div key={annotation.id} className="absolute" style={{ left: `${annotation.x}%`, top: `${annotation.y}%`, transform: "translate(-50%, -50%)" }}>
              <button
                onClick={() => handleAnnotationClick(annotation)}
                className={`relative group transition-all duration-200 ${
                  visible ? "scale-100" : "scale-75 opacity-60 hover:opacity-100 hover:scale-100"
                }`}
                title={visible ? annotation.label : mode === "exam" ? "Click to reveal" : annotation.label}
                data-testid={`annotation-pin-${annotation.id}`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 shadow-lg ${
                    activeAnnotation === annotation.id
                      ? "bg-teal-600 border-white text-white ring-2 ring-teal-400"
                      : visible
                      ? "bg-teal-500 border-white text-white"
                      : "bg-gray-400 border-white text-white"
                  }`}
                >
                  {annotation.number || "?"}
                </div>
                {visible && activeAnnotation === annotation.id && (
                  <div
                    className="absolute z-30 bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 min-w-[140px] max-w-[220px] shadow-xl"
                    data-testid={`annotation-tooltip-${annotation.id}`}
                  >
                    <p className="font-semibold">{annotation.label}</p>
                    {annotation.description && <p className="mt-1 text-gray-300 text-[11px]">{annotation.description}</p>}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                  </div>
                )}
              </button>
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-between mt-2">
        {mode !== "exam" && (
          <button
            onClick={() => setShowAnnotations(!showAnnotations)}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-teal-600 transition-colors"
            data-testid="button-toggle-annotations"
          >
            {showAnnotations ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {showAnnotations ? "Hide annotations" : "Show annotations"}
          </button>
        )}
        {mode === "exam" && (
          <p className="text-xs text-gray-400">{t("allied.annotatedImageViewer.clickNumberedPinsToReveal")}</p>
        )}
        {annotations.length > 0 && (
          <span className="text-xs text-gray-400" data-testid="text-annotation-count">
            {mode === "exam"
              ? `${revealedAnnotations.size}/${annotations.length} revealed`
              : `${annotations.length} annotation${annotations.length !== 1 ? "s" : ""}`}
          </span>
        )}
      </div>
      {showAnnotations && mode === "review" && annotations.length > 0 && (
        <div className="mt-3 bg-gray-50 rounded-lg p-3 space-y-2" data-testid="annotation-callouts">
          <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">{t("allied.annotatedImageViewer.annotations")}</p>
          {annotations.map((a) => (
            <div
              key={a.id}
              className={`flex items-start gap-2 text-sm cursor-pointer rounded px-2 py-1 ${activeAnnotation === a.id ? "bg-teal-50" : "hover:bg-gray-100"}`}
              onClick={() => handleAnnotationClick(a)}
              data-testid={`annotation-callout-${a.id}`}
            >
              <span className="w-5 h-5 rounded-full bg-teal-500 text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                {a.number || "?"}
              </span>
              <div>
                <p className="font-medium text-gray-800">{a.label}</p>
                {a.description && <p className="text-xs text-gray-500 mt-0.5">{a.description}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AnnotatedImageViewer;
