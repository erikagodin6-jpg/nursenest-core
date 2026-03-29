import { useI18n } from "@/lib/i18n";
import { useEffect, useRef, useState } from "react";
import { brandLogo } from "@/lib/theme-logos";

interface ThemedLogoProps {
  width?: number;
  className?: string;
}

let cachedDataUrl: string | null = null;
let cachedColor: string = "";

const DEFAULT_PRIMARY = "#9d82dd";

function parseColor(color: string): [number, number, number] {
  const hex = color.replace("#", "").trim();
  if (hex.length === 6) {
    return [
      parseInt(hex.substring(0, 2), 16),
      parseInt(hex.substring(2, 4), 16),
      parseInt(hex.substring(4, 6), 16),
    ];
  }
  if (hex.length === 3) {
    return [
      parseInt(hex[0] + hex[0], 16),
      parseInt(hex[1] + hex[1], 16),
      parseInt(hex[2] + hex[2], 16),
    ];
  }
  const rgb = color.match(/[\d.]+/g);
  if (rgb && rgb.length >= 3) {
    return [parseInt(rgb[0]), parseInt(rgb[1]), parseInt(rgb[2])];
  }
  return [59, 130, 246];
}

function getCurrentThemeColor(): string {
  try {
    const style = getComputedStyle(document.documentElement);
    const color = style.getPropertyValue("--theme-primary").trim();
    return color || DEFAULT_PRIMARY;
  } catch {
    return DEFAULT_PRIMARY;
  }
}

export function ThemedLogo({ width = 220, className = "" }: ThemedLogoProps) {
  const { t } = useI18n();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dataUrl, setDataUrl] = useState<string | null>(cachedDataUrl);
  const [primaryColor, setPrimaryColor] = useState(cachedColor || getCurrentThemeColor());
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const computeColor = () => {
      const color = getCurrentThemeColor();
      if (color && color !== primaryColor) {
        setPrimaryColor(color);
      }
    };

    const observer = new MutationObserver(() => {
      requestAnimationFrame(computeColor);
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style", "data-theme"],
    });

    const interval = setInterval(computeColor, 500);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, [primaryColor]);

  useEffect(() => {
    if (!primaryColor) {
      setFallback(true);
      return;
    }

    setFallback(false);

    if (primaryColor === cachedColor && cachedDataUrl) {
      setDataUrl(cachedDataUrl);
      return;
    }

    const [tr, tg, tb] = parseColor(primaryColor);

    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onerror = () => {
      setFallback(true);
    };

    img.onload = () => {
      try {
        const canvas = canvasRef.current;
        if (!canvas) {
          setFallback(true);
          return;
        }

        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          setFallback(true);
          return;
        }

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const w = canvas.width;
        const h = canvas.height;

        let minX = w, maxX = 0, minY = h, maxY = 0;

        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const i = (y * w + x) * 4;
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const brightness = (r + g + b) / 3;

            if (brightness < 200) {
              const darkness = 1 - brightness / 255;
              data[i] = Math.round(tr * darkness + 255 * (1 - darkness));
              data[i + 1] = Math.round(tg * darkness + 255 * (1 - darkness));
              data[i + 2] = Math.round(tb * darkness + 255 * (1 - darkness));

              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
              if (y < minY) minY = y;
              if (y > maxY) maxY = y;
            } else {
              data[i + 3] = 0;
            }
          }
        }

        if (minX > maxX || minY > maxY) {
          setFallback(true);
          return;
        }

        ctx.putImageData(imageData, 0, 0);

        const pad = 4;
        const cy = Math.max(0, minY - pad);
        const ch = Math.min(h - cy, maxY - minY + 1 + pad * 2);

        const colHasContent: boolean[] = new Array(w).fill(false);
        for (let x = minX; x <= maxX; x++) {
          for (let y = minY; y <= maxY; y++) {
            const a = data[(y * w + x) * 4 + 3];
            if (a > 0) {
              colHasContent[x] = true;
              break;
            }
          }
        }

        let gapStart = -1;
        let gapEnd = -1;
        let longestGapStart = -1;
        let longestGapLen = 0;
        for (let x = minX; x <= maxX; x++) {
          if (!colHasContent[x]) {
            if (gapStart === -1) gapStart = x;
            gapEnd = x;
          } else {
            if (gapStart !== -1) {
              const gapLen = gapEnd - gapStart + 1;
              if (gapLen > longestGapLen) {
                longestGapLen = gapLen;
                longestGapStart = gapStart;
              }
            }
            gapStart = -1;
          }
        }

        const desiredGap = 6;
        let result: string;

        if (longestGapLen > desiredGap && longestGapStart > minX) {
          const leftEnd = longestGapStart;
          const rightStart = longestGapStart + longestGapLen;
          const leftWidth = leftEnd - minX;
          const rightWidth = maxX - rightStart + 1;
          const totalWidth = leftWidth + desiredGap + rightWidth;

          const cropCanvas = document.createElement("canvas");
          cropCanvas.width = totalWidth + pad * 2;
          cropCanvas.height = ch;
          const cropCtx = cropCanvas.getContext("2d");
          if (!cropCtx) {
            setFallback(true);
            return;
          }

          cropCtx.drawImage(canvas, minX, cy, leftWidth, ch, pad, 0, leftWidth, ch);
          cropCtx.drawImage(canvas, rightStart, cy, rightWidth, ch, pad + leftWidth + desiredGap, 0, rightWidth, ch);

          result = cropCanvas.toDataURL("image/png");
        } else {
          const cx = Math.max(0, minX - pad);
          const cw = Math.min(w - cx, maxX - minX + 1 + pad * 2);

          const cropCanvas = document.createElement("canvas");
          cropCanvas.width = cw;
          cropCanvas.height = ch;
          const cropCtx = cropCanvas.getContext("2d");
          if (!cropCtx) {
            setFallback(true);
            return;
          }
          cropCtx.drawImage(canvas, cx, cy, cw, ch, 0, 0, cw, ch);

          result = cropCanvas.toDataURL("image/png");
        }

        cachedDataUrl = result;
        cachedColor = primaryColor;
        setDataUrl(result);
      } catch {
        setFallback(true);
      }
    };
    img.src = brandLogo;
  }, [primaryColor]);

  if (dataUrl) {
    return (
      <>
        <canvas ref={canvasRef} style={{ display: "none" }} />
        <img
          src={dataUrl}
          alt={t("components.themed_logo.nursenest")}
          className={`max-w-none ${className}`}
          width={width}
          height={Math.round(width * 0.28)}
          style={{ width: `${width}px`, height: "auto" }}
          data-testid="img-nursenest-logo"
        />
      </>
    );
  }

  if (fallback) {
    return (
      <img
        src={brandLogo}
        alt={t("components.themed_logo.nursenest")}
        className={`max-w-none ${className}`}
        width={width}
        style={{ width: `${width}px`, height: "auto" }}
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
        }}
        data-testid="img-nursenest-logo-fallback"
      />
    );
  }

  return (
    <>
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <img
        src={brandLogo}
        alt={t("components.themed_logo.nursenest")}
        className={`max-w-none ${className}`}
        width={width}
        style={{ width: `${width}px`, height: "auto" }}
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
        }}
        data-testid="img-nursenest-logo-loading"
      />
    </>
  );
}
