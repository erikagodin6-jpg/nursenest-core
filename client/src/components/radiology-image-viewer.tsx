import { useState, useRef, useCallback, useEffect } from "react";
import {
  ZoomIn, ZoomOut, Maximize2, Minimize2, RotateCcw
} from "lucide-react";

interface ImageViewerProps {
  src: string;
  alt?: string;
  className?: string;
}

export function RadiologyImageViewer({ src, alt = "Radiology image", className = "" }: ImageViewerProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const zoomIn = useCallback(() => setZoom(z => Math.min(z + 0.25, 5)), []);
  const zoomOut = useCallback(() => setZoom(z => Math.max(z - 0.25, 0.5)), []);
  const resetView = useCallback(() => { setZoom(1); setPan({ x: 0, y: 0 }); }, []);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      containerRef.current.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }, [isFullscreen]);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "+" || e.key === "=") { e.preventDefault(); zoomIn(); }
      if (e.key === "-") { e.preventDefault(); zoomOut(); }
      if (e.key === "0") { e.preventDefault(); resetView(); }
      if (e.key === "f") { e.preventDefault(); toggleFullscreen(); }
      if (e.key === "Escape" && isFullscreen) { document.exitFullscreen?.(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [zoomIn, zoomOut, resetView, toggleFullscreen, isFullscreen]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  }, [zoom, pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) zoomIn();
    else zoomOut();
  }, [zoomIn, zoomOut]);

  return (
    <div
      ref={containerRef}
      className={`relative bg-black rounded-xl overflow-hidden group ${isFullscreen ? "w-screen h-screen" : ""} ${className}`}
      data-testid="radiology-image-viewer"
    >
      <div
        className={`w-full h-full overflow-hidden ${zoom > 1 ? "cursor-move" : "cursor-zoom-in"}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="w-full h-full object-contain select-none"
          style={{
            transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
            transition: isDragging ? "none" : "transform 0.15s ease",
          }}
          draggable={false}
          data-testid="viewer-image"
        />
      </div>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={zoomOut} className="p-1.5 text-white/70 hover:text-white rounded" data-testid="button-zoom-out">
          <ZoomOut className="w-4 h-4" />
        </button>
        <span className="text-white/80 text-xs font-mono w-12 text-center">{Math.round(zoom * 100)}%</span>
        <button onClick={zoomIn} className="p-1.5 text-white/70 hover:text-white rounded" data-testid="button-zoom-in">
          <ZoomIn className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-white/20 mx-1" />
        <button onClick={resetView} className="p-1.5 text-white/70 hover:text-white rounded" data-testid="button-reset-view">
          <RotateCcw className="w-4 h-4" />
        </button>
        <button onClick={toggleFullscreen} className="p-1.5 text-white/70 hover:text-white rounded" data-testid="button-fullscreen">
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

interface ComparisonViewerProps {
  leftSrc: string;
  rightSrc: string;
  leftAlt?: string;
  rightAlt?: string;
  leftLabel?: string;
  rightLabel?: string;
  className?: string;
}

export function ComparisonViewer({
  leftSrc, rightSrc,
  leftAlt = "Left image", rightAlt = "Right image",
  leftLabel, rightLabel,
  className = ""
}: ComparisonViewerProps) {
  return (
    <div className={`grid grid-cols-2 gap-2 ${className}`} data-testid="comparison-viewer">
      <div className="relative">
        {leftLabel && (
          <div className="absolute top-2 left-2 z-10 bg-black/60 text-white text-xs px-2 py-1 rounded">{leftLabel}</div>
        )}
        <RadiologyImageViewer src={leftSrc} alt={leftAlt} className="h-64 sm:h-80" />
      </div>
      <div className="relative">
        {rightLabel && (
          <div className="absolute top-2 left-2 z-10 bg-black/60 text-white text-xs px-2 py-1 rounded">{rightLabel}</div>
        )}
        <RadiologyImageViewer src={rightSrc} alt={rightAlt} className="h-64 sm:h-80" />
      </div>
    </div>
  );
}
