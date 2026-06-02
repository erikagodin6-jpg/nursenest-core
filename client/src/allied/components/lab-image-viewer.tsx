import { useState, useRef, useCallback, useEffect } from "react";
import { ZoomIn, ZoomOut, Maximize2, RotateCcw, X, Loader2 } from "lucide-react";

import { useI18n } from "@/lib/i18n";
interface LabImageViewerProps {
  src: string;
  alt?: string;
  caption?: string;
  thumbnailSrc?: string;
  className?: string;
  allowZoom?: boolean;
  showControls?: boolean;
  aspectRatio?: string;
  onLoad?: () => void;
  onClick?: () => void;
}

export function LabImageViewer({
  src,
  alt = "Lab image",
  caption,
  thumbnailSrc,
  className = "",
  allowZoom = true,
  showControls = true,
  aspectRatio,
  onLoad,
  onClick,
}: LabImageViewerProps) {
  const { t } = useI18n();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
  }, []);

  const handleZoomIn = useCallback(() => setZoom((z) => Math.min(z + 0.5, 5)), []);
  const handleZoomOut = useCallback(() => {
    setZoom((z) => {
      const newZ = Math.max(z - 0.5, 1);
      if (newZ === 1) setPan({ x: 0, y: 0 });
      return newZ;
    });
  }, []);
  const handleReset = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (!allowZoom) return;
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.25 : 0.25;
      setZoom((z) => {
        const newZ = Math.max(1, Math.min(z + delta, 5));
        if (newZ === 1) setPan({ x: 0, y: 0 });
        return newZ;
      });
    },
    [allowZoom]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (zoom <= 1 || !allowZoom) return;
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [zoom, pan, allowZoom]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    },
    [isDragging, dragStart]
  );

  const handlePointerUp = useCallback(() => setIsDragging(false), []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFullscreen) return;
      if (e.key === "Escape") setIsFullscreen(false);
      if (e.key === "+" || e.key === "=") handleZoomIn();
      if (e.key === "-") handleZoomOut();
      if (e.key === "0") handleReset();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen, handleZoomIn, handleZoomOut, handleReset]);

  const imageContent = (
    <div
      ref={containerRef}
      className={`relative overflow-hidden bg-gray-100 dark:bg-gray-800 rounded-lg select-none ${className}`}
      style={{ aspectRatio: aspectRatio || "auto" }}
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      data-testid="lab-image-container"
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10" data-testid="lab-image-loading">
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="text-xs">{t("allied.labImageViewer.loadingImage")}</span>
          </div>
        </div>
      )}
      {hasError ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-900" data-testid="lab-image-error">
          <div className="text-center text-gray-400 p-4">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gray-200 flex items-center justify-center">
              <X className="w-6 h-6" />
            </div>
            <p className="text-sm">{t("allied.labImageViewer.imageUnavailable")}</p>
            <p className="text-xs mt-1">{t("allied.labImageViewer.thisImageHasNotBeen")}</p>
          </div>
        </div>
      ) : (
        <img
          ref={imgRef}
          src={isFullscreen ? src : thumbnailSrc || src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={`w-full h-full object-contain transition-transform ${isLoading ? "opacity-0" : "opacity-100"} ${isDragging ? "cursor-grabbing" : zoom > 1 ? "cursor-grab" : ""}`}
          style={{ transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)` }}
          draggable={false}
          data-testid="lab-image"
          onClick={!allowZoom && onClick ? onClick : undefined}
        />
      )}
      {showControls && allowZoom && !hasError && !isLoading && (
        <div className="absolute bottom-2 right-2 flex gap-1 bg-black/60 rounded-lg p-1 z-20" data-testid="lab-image-controls">
          <button onClick={handleZoomOut} className="p-1 text-white hover:bg-white/20 rounded" title={t("allied.labImageViewer.zoomOut")} data-testid="button-zoom-out">
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-white text-xs flex items-center px-1 min-w-[2rem] justify-center">{Math.round(zoom * 100)}%</span>
          <button onClick={handleZoomIn} className="p-1 text-white hover:bg-white/20 rounded" title={t("allied.labImageViewer.zoomIn")} data-testid="button-zoom-in">
            <ZoomIn className="w-4 h-4" />
          </button>
          <button onClick={handleReset} className="p-1 text-white hover:bg-white/20 rounded" title={t("allied.labImageViewer.reset")} data-testid="button-zoom-reset">
            <RotateCcw className="w-4 h-4" />
          </button>
          {!isFullscreen && (
            <button onClick={() => setIsFullscreen(true)} className="p-1 text-white hover:bg-white/20 rounded" title={t("allied.labImageViewer.fullscreen")} data-testid="button-fullscreen">
              <Maximize2 className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div>
      {isFullscreen ? (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col" data-testid="lab-image-fullscreen">
          <div className="flex justify-between items-center p-4">
            <span className="text-white text-sm">{alt}</span>
            <button onClick={() => { setIsFullscreen(false); handleReset(); }} className="text-white p-2 hover:bg-white/10 rounded-lg" data-testid="button-close-fullscreen">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center p-4">
            {imageContent}
          </div>
          {caption && <p className="text-white/70 text-center text-sm pb-4 px-4">{caption}</p>}
        </div>
      ) : (
        <div>
          {imageContent}
          {caption && <p className="text-xs text-gray-500 mt-1 text-center italic" data-testid="lab-image-caption">{caption}</p>}
        </div>
      )}
    </div>
  );
}

interface SideBySideViewerProps {
  leftImage: { src: string; alt?: string; label?: string };
  rightImage: { src: string; alt?: string; label?: string };
  className?: string;
}

export function SideBySideViewer({ leftImage, rightImage, className = "" }: SideBySideViewerProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`} data-testid="side-by-side-viewer">
      <div>
        {leftImage.label && <p className="text-sm font-medium text-gray-700 mb-1 text-center" data-testid="text-left-label">{leftImage.label}</p>}
        <LabImageViewer src={leftImage.src} alt={leftImage.alt || "Left image"} />
      </div>
      <div>
        {rightImage.label && <p className="text-sm font-medium text-gray-700 mb-1 text-center" data-testid="text-right-label">{rightImage.label}</p>}
        <LabImageViewer src={rightImage.src} alt={rightImage.alt || "Right image"} />
      </div>
    </div>
  );
}

interface ImageLayoutProps {
  images: Array<{ src: string; alt?: string; caption?: string }>;
  layout: "single" | "side-by-side" | "stacked" | "image-plus-table";
  tableContent?: React.ReactNode;
  className?: string;
}

export function ImageLayout({ images, layout, tableContent, className = "" }: ImageLayoutProps) {
  if (layout === "single" && images[0]) {
    return (
      <div className={`max-w-lg mx-auto ${className}`} data-testid="image-layout-single">
        <LabImageViewer src={images[0].src} alt={images[0].alt} caption={images[0].caption} />
      </div>
    );
  }
  if (layout === "side-by-side" && images.length >= 2) {
    return (
      <div className={className} data-testid="image-layout-side-by-side">
        <SideBySideViewer leftImage={images[0]} rightImage={images[1]} />
      </div>
    );
  }
  if (layout === "stacked") {
    return (
      <div className={`space-y-4 max-w-lg mx-auto ${className}`} data-testid="image-layout-stacked">
        {images.map((img, i) => (
          <LabImageViewer key={i} src={img.src} alt={img.alt} caption={img.caption} />
        ))}
      </div>
    );
  }
  if (layout === "image-plus-table" && images[0]) {
    return (
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${className}`} data-testid="image-layout-table">
        <LabImageViewer src={images[0].src} alt={images[0].alt} caption={images[0].caption} />
        <div>{tableContent}</div>
      </div>
    );
  }
  return null;
}

export default LabImageViewer;
