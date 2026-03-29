import { useEffect, useRef, useState, type ReactNode } from "react";
import { useAuth } from "@/lib/auth";
import { useTrialStatus, ENABLE_COPY_PROTECTION } from "@/hooks/use-trial-status";
import { WatermarkOverlay } from "./watermark-overlay";

interface WatermarkData {
  enabled: boolean;
  text: string;
  opacity: number;
  rotation: number;
  fontSize: number;
  spacing: number;
  hash: string;
}

interface ProtectedContentProps {
  children: ReactNode;
  className?: string;
  showWatermark?: boolean;
}

export function ProtectedContent({ children, className = "", showWatermark = true }: ProtectedContentProps) {
  const { user } = useAuth();
  const { isOnTrial } = useTrialStatus();
  const containerRef = useRef<HTMLDivElement>(null);
  const [watermark, setWatermark] = useState<WatermarkData | null>(null);
  const [serverProtectionEnabled, setServerProtectionEnabled] = useState(false);

  const trialProtectionActive = isOnTrial && ENABLE_COPY_PROTECTION;
  const shouldApplyDeterrents = trialProtectionActive || (serverProtectionEnabled && isOnTrial);

  useEffect(() => {
    fetch("/api/content-security/config")
      .then((r) => r.json())
      .then((data) => setServerProtectionEnabled(data.featureEnabled))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!user || !showWatermark || !serverProtectionEnabled) return;

    const headers: Record<string, string> = {};
    const userToken = localStorage.getItem("nursenest-user-token");
    if (userToken) headers["x-user-token"] = userToken;
    const adminToken = localStorage.getItem("nn_admin_access_token");
    if (adminToken) headers["Authorization"] = `Bearer ${adminToken}`;

    fetch("/api/content-security/watermark", { headers })
      .then((r) => r.json())
      .then((data) => {
        if (data.enabled) setWatermark(data);
      })
      .catch(() => {});
  }, [user, showWatermark, serverProtectionEnabled]);

  useEffect(() => {
    if (!shouldApplyDeterrents) return;
    const el = containerRef.current;
    if (!el) return;

    function handleContextMenu(e: MouseEvent) {
      e.preventDefault();
      return false;
    }

    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && (e.key === "c" || e.key === "C")) {
        e.preventDefault();
        return false;
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === "a" || e.key === "A")) {
        e.preventDefault();
        return false;
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === "p" || e.key === "P")) {
        e.preventDefault();
        return false;
      }
    }

    function handleCopy(e: ClipboardEvent) {
      e.preventDefault();
      return false;
    }

    el.addEventListener("contextmenu", handleContextMenu);
    el.addEventListener("copy", handleCopy);
    el.addEventListener("keydown", handleKeyDown);

    return () => {
      el.removeEventListener("contextmenu", handleContextMenu);
      el.removeEventListener("copy", handleCopy);
      el.removeEventListener("keydown", handleKeyDown);
    };
  }, [shouldApplyDeterrents]);

  if (!shouldApplyDeterrents) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{ userSelect: "none", WebkitUserSelect: "none" }}
      data-testid="container-protected-content"
      tabIndex={-1}
    >
      <style>{`
        @media print {
          [data-testid="container-protected-content"] {
            display: none !important;
          }
          body::after {
            content: "Printing is disabled for protected content.";
            display: block;
            text-align: center;
            padding: 2rem;
            font-size: 1.2rem;
            color: #666;
          }
        }
      `}</style>
      <div style={{ userSelect: "none", WebkitUserSelect: "none" }}>
        {children}
      </div>
      {trialProtectionActive && user && (
        <WatermarkOverlay />
      )}
      {watermark && watermark.enabled && (
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden z-10"
          aria-hidden="true"
          data-testid="overlay-watermark"
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `repeating-linear-gradient(
                ${watermark.rotation}deg,
                transparent,
                transparent ${watermark.spacing - 40}px,
                rgba(0,0,0,${watermark.opacity}) ${watermark.spacing - 40}px,
                transparent ${watermark.spacing}px
              )`,
            }}
          />
          <svg
            width="100%"
            height="100%"
            className="absolute inset-0"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id={`wm-${watermark.hash}`}
                patternUnits="userSpaceOnUse"
                width={watermark.spacing * 2.5}
                height={watermark.spacing}
                patternTransform={`rotate(${watermark.rotation})`}
              >
                <text
                  x="10"
                  y={watermark.spacing / 2}
                  fill={`rgba(0,0,0,${watermark.opacity})`}
                  fontSize={watermark.fontSize}
                  fontFamily="monospace"
                >
                  {watermark.text}
                </text>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#wm-${watermark.hash})`} />
          </svg>
        </div>
      )}
    </div>
  );
}
