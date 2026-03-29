import { useAuth } from "@/lib/auth";
import { useMemo } from "react";

interface WatermarkOverlayProps {
  opacity?: number;
  fontSize?: string;
  color?: string;
  className?: string;
}

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return email.slice(0, 2) + "***";
  const masked = local.slice(0, 2) + "***";
  return `${masked}@${domain}`;
}

function getUserIdSuffix(id: string): string {
  return id.slice(-4).toUpperCase();
}

export function WatermarkOverlay({
  opacity = 0.06,
  fontSize = "14px",
  color = "#6B7280",
  className = "",
}: WatermarkOverlayProps) {
  const { user } = useAuth();

  const watermarkText = useMemo(() => {
    if (!user) return "";
    const name = user.username || "";
    const emailPart = user.email ? maskEmail(user.email) : name;
    const idSuffix = getUserIdSuffix(user.id);
    const timestamp = new Date().toISOString().slice(0, 16).replace("T", " ");
    return `${emailPart} #${idSuffix} ${timestamp}`;
  }, [user]);

  if (!user || !watermarkText) return null;

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none ${className}`}
      aria-hidden="true"
      data-testid="watermark-overlay"
      style={{ zIndex: 10 }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(
            `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='200'>
              <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
                font-family='Inter, system-ui, sans-serif' font-size='${fontSize}' fill='${color}'
                opacity='${opacity}' transform='rotate(-30, 200, 100)'>
                ${watermarkText}
              </text>
            </svg>`
          )}")`,
          backgroundRepeat: "repeat",
          backgroundSize: "400px 200px",
        }}
      />
    </div>
  );
}
