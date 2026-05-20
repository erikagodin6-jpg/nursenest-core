import type { BedsideMonitorChannel, BedsideMonitorWaveformKind } from "@/lib/hemodynamics/bedside-monitor-types";

export function bedsideMonitorStrokeClass(kind: BedsideMonitorWaveformKind): string {
  if (kind === "ecg") return "stroke-emerald-300";
  if (kind === "arterial") return "stroke-rose-300";
  if (kind === "spo2") return "stroke-cyan-300";
  if (kind === "etco2") return "stroke-violet-300";
  return "stroke-amber-200";
}

export function bedsideMonitorStatusClass(status: BedsideMonitorChannel["status"]): string {
  if (status === "critical") return "text-rose-300 border-rose-400/35 bg-rose-500/10";
  if (status === "watch") return "text-amber-200 border-amber-400/30 bg-amber-500/10";
  return "text-emerald-200 border-emerald-400/25 bg-emerald-500/10";
}

export function bedsideMonitorWaveformPath(channel: BedsideMonitorChannel): string {
  if (channel.kind === "ecg") {
    return "M0 35 L18 35 L22 31 L26 35 L31 35 L35 10 L40 56 L45 35 L58 35 L64 29 L72 35 L100 35 L118 35 L122 31 L126 35 L131 35 L135 10 L140 56 L145 35 L158 35 L164 29 L172 35 L200 35";
  }
  if (channel.kind === "arterial") {
    if (channel.waveformQuality === "damped") {
      return "M0 48 C16 47 22 28 36 22 C50 18 58 28 66 38 C82 56 102 49 120 47 C138 46 148 29 162 23 C176 19 184 29 192 38 C198 45 200 47 200 48";
    }
    if (channel.waveformQuality === "underdamped") {
      return "M0 50 L12 50 C18 45 20 12 30 8 C36 5 38 15 42 28 C45 18 49 25 52 34 C59 52 72 51 88 50 L112 50 C118 45 120 12 130 8 C136 5 138 15 142 28 C145 18 149 25 152 34 C159 52 172 51 200 50";
    }
    return "M0 50 L10 50 C16 48 20 22 32 14 C42 8 47 20 51 35 L58 31 C67 51 78 53 96 50 L110 50 C116 48 120 22 132 14 C142 8 147 20 151 35 L158 31 C167 51 178 53 200 50";
  }
  if (channel.kind === "spo2") {
    return channel.waveformQuality === "low-perfusion"
      ? "M0 46 C12 42 16 40 24 44 C32 49 42 48 50 45 C62 40 68 41 76 45 C86 50 96 48 104 45 C116 40 122 41 130 45 C140 50 152 48 160 45 C172 40 180 42 200 46"
      : "M0 48 C8 47 14 34 22 20 C30 8 42 16 44 32 C46 48 62 52 78 48 C86 47 92 34 100 20 C108 8 120 16 122 32 C124 48 140 52 156 48 C164 47 170 34 178 20 C186 8 194 18 200 42";
  }
  if (channel.kind === "etco2") {
    if (channel.waveformQuality === "sharkfin") return "M0 56 L18 56 C26 54 34 36 44 24 C56 10 78 12 94 14 L100 56 L118 56 C126 54 134 36 144 24 C156 10 178 12 194 14 L200 56";
    if (channel.waveformQuality === "apnea") return "M0 56 L200 56";
    return "M0 56 L20 56 L24 20 L82 20 L88 56 L120 56 L124 20 L182 20 L188 56 L200 56";
  }
  return "M0 38 C12 18 28 18 40 38 C52 58 68 58 80 38 C92 18 108 18 120 38 C132 58 148 58 160 38 C172 18 188 18 200 38";
}
