import React, { useCallback } from "react";

interface ProtectedImageProps {
  src: string;
  alt: string;
  title?: string;
  className?: string;
  loading?: "lazy" | "eager";
  width?: number;
  height?: number;
  "data-testid"?: string;
}

export function ProtectedImage({
  src,
  alt,
  title,
  className = "",
  loading = "lazy",
  width,
  height,
  "data-testid": testId,
}: ProtectedImageProps) {
  const preventAction = useCallback((e: React.SyntheticEvent) => {
    e.preventDefault();
    return false;
  }, []);

  return (
    <div className="protected-image-wrapper" style={{ position: "relative", display: "inline-block", width: "100%", height: "100%" }}>
      <img
        src={src}
        alt={alt}
        title={title || alt}
        className={`protected-image ${className}`}
        loading={loading}
        width={width}
        height={height}
        data-testid={testId}
        onContextMenu={preventAction}
        onDragStart={preventAction}
        onMouseDown={(e) => { if (e.button === 2) e.preventDefault(); }}
        onTouchStart={(e) => {
          if (e.touches.length > 1) e.preventDefault();
        }}
        draggable={false}
        crossOrigin="anonymous"
        itemProp="image"
      />
      <div
        className="protected-image-shield"
        onContextMenu={preventAction}
        onDragStart={preventAction}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          background: "transparent",
          userSelect: "none",
          WebkitUserSelect: "none",
          pointerEvents: "auto",
          WebkitTouchCallout: "none",
        }}
      />
    </div>
  );
}

export default ProtectedImage;
