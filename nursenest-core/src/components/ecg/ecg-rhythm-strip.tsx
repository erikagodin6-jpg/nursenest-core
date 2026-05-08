import type { EcgRhythmId } from "@/lib/ecg/ecg-rhythm-svg";
import { getEcgRhythmFixture } from "@/lib/ecg/ecg-rhythm-svg";

function strokeForTone(tone: "success" | "info" | "warning" | "danger"): string {
  switch (tone) {
    case "success":
      return "var(--semantic-success)";
    case "info":
      return "var(--semantic-info)";
    case "warning":
      return "var(--semantic-warning)";
    default:
      return "var(--semantic-danger)";
  }
}

export function EcgRhythmStrip({
  rhythmId,
  className = "",
  height = 140,
}: {
  rhythmId: EcgRhythmId;
  className?: string;
  height?: number;
}) {
  const f = getEcgRhythmFixture(rhythmId);
  const stroke = strokeForTone(f.tone);
  return (
    <div className={`rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface-muted)] p-3 ${className}`}>
      <svg
        viewBox="0 0 720 220"
        className="w-full"
        style={{ height }}
        role="img"
        aria-label={`Educational ECG schematic: ${f.id.replaceAll("_", " ")}`}
      >
        <title>Educational ECG schematic — not for diagnosis</title>
        <path d={f.pathD} fill="none" stroke={stroke} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
