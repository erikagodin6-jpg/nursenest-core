import { useMemo } from "react";

import { useI18n } from "@/lib/i18n";
interface WaveformSegment {
  type: string;
  path: string;
}

interface SvgPathData {
  segments: WaveformSegment[];
  repeatInterval: number;
  totalWidth: number;
  irregularSpacing?: boolean;
  twistingAxis?: boolean;
  leads?: string[];
  reciprocalChanges?: string[];
  etco2?: string;
}

interface ECGStripProps {
  svgPathData: SvgPathData;
  mode?: "strip" | "monitor";
  width?: number;
  height?: number;
  showGrid?: boolean;
  className?: string;
  label?: string;
}

function generateRepeatedPath(segments: WaveformSegment[], repeatInterval: number, totalWidth: number, irregularSpacing?: boolean): string {
  const { t } = useI18n();
  const paths: string[] = [];
  let offset = 0;
  let iteration = 0;
  const maxIterations = Math.ceil(totalWidth / repeatInterval) + 1;

  while (offset < totalWidth && iteration < maxIterations) {
    const jitter = irregularSpacing ? (Math.sin(iteration * 2.7) * repeatInterval * 0.15) : 0;
    for (const seg of segments) {
      const translated = seg.path.replace(/([ML])\s*([\d.]+),([\d.]+)/g, (_match, cmd, x, y) => {
        return `${cmd} ${parseFloat(x) + offset + jitter},${y}`;
      }).replace(/Q\s*([\d.]+),([\d.]+)\s+([\d.]+),([\d.]+)/g, (_match, cx, cy, ex, ey) => {
        return `Q ${parseFloat(cx) + offset + jitter},${cy} ${parseFloat(ex) + offset + jitter},${ey}`;
      });
      paths.push(translated);
    }
    offset += repeatInterval;
    iteration++;
  }
  return paths.join(" ");
}

function ECGPaperGrid({ width, height }: { width: number; height: number }) {
  const smallStep = 5;
  const largeStep = 25;

  const smallLines = [];
  const largeLines = [];

  for (let x = 0; x <= width; x += smallStep) {
    if (x % largeStep === 0) {
      largeLines.push(<line key={`vl-${x}`} x1={x} y1={0} x2={x} y2={height} stroke="#e8b4b4" strokeWidth={0.5} />);
    } else {
      smallLines.push(<line key={`vs-${x}`} x1={x} y1={0} x2={x} y2={height} stroke="#f2d4d4" strokeWidth={0.3} />);
    }
  }
  for (let y = 0; y <= height; y += smallStep) {
    if (y % largeStep === 0) {
      largeLines.push(<line key={`hl-${y}`} x1={0} y1={y} x2={width} y2={y} stroke="#e8b4b4" strokeWidth={0.5} />);
    } else {
      smallLines.push(<line key={`hs-${y}`} x1={0} y1={y} x2={width} y2={y} stroke="#f2d4d4" strokeWidth={0.3} />);
    }
  }

  return (
    <g>
      <rect width={width} height={height} fill="#fff5f5" />
      {smallLines}
      {largeLines}
    </g>
  );
}

function MonitorBackground({ width, height }: { width: number; height: number }) {
  const gridLines = [];
  const step = 25;

  for (let x = 0; x <= width; x += step) {
    gridLines.push(<line key={`mv-${x}`} x1={x} y1={0} x2={x} y2={height} stroke="#1a3a2a" strokeWidth={0.5} />);
  }
  for (let y = 0; y <= height; y += step) {
    gridLines.push(<line key={`mh-${y}`} x1={0} y1={y} x2={width} y2={y} stroke="#1a3a2a" strokeWidth={0.5} />);
  }

  return (
    <g>
      <rect width={width} height={height} fill="#0a1a10" rx={4} />
      {gridLines}
    </g>
  );
}

export function ECGStrip({ svgPathData, mode = "strip", width = 700, height = 100, showGrid = true, className = "", label }: ECGStripProps) {
  const fullPath = useMemo(() => {
    return generateRepeatedPath(svgPathData.segments, svgPathData.repeatInterval, svgPathData.totalWidth, svgPathData.irregularSpacing);
  }, [svgPathData]);

  const strokeColor = mode === "monitor" ? "#00ff41" : "#1a1a1a";
  const strokeWidth = mode === "monitor" ? 2 : 1.5;

  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`} data-testid="ecg-strip">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        className="w-full"
        style={{ maxHeight: mode === "monitor" ? "120px" : "150px" }}
      >
        {showGrid && mode === "strip" && <ECGPaperGrid width={width} height={height} />}
        {showGrid && mode === "monitor" && <MonitorBackground width={width} height={height} />}
        {!showGrid && <rect width={width} height={height} fill={mode === "monitor" ? "#0a1a10" : "#fff5f5"} />}
        <path
          d={fullPath}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {label && (
        <div className={`absolute top-2 left-3 text-xs font-mono ${mode === "monitor" ? "text-green-400" : "text-gray-500"}`}>
          {label}
        </div>
      )}
    </div>
  );
}

interface MonitorPanelProps {
  svgPathData: SvgPathData;
  heartRate?: number;
  spo2?: number;
  bp?: string;
  etco2?: number;
  respRate?: number;
  rhythmName?: string;
  className?: string;
}

export function MonitorPanel({ svgPathData, heartRate = 75, spo2 = 98, bp = "120/80", etco2 = 38, respRate = 16, rhythmName, className = "" }: MonitorPanelProps) {
  return (
    <div className={`bg-gray-950 rounded-xl p-4 border border-gray-800 ${className}`} data-testid="monitor-panel">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <ECGStrip svgPathData={svgPathData} mode="monitor" showGrid={true} label={rhythmName || "Lead II"} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
          <div className="bg-gray-900 rounded-lg p-3 text-center" data-testid="vital-hr">
            <div className="text-[10px] text-green-500 font-mono uppercase tracking-wider">HR</div>
            <div className="text-2xl font-mono font-bold text-green-400">{heartRate}</div>
            <div className="text-[10px] text-green-600 font-mono">{t("allied.paramedicEcgComponents.bpm")}</div>
          </div>
          <div className="bg-gray-900 rounded-lg p-3 text-center" data-testid="vital-spo2">
            <div className="text-[10px] text-cyan-500 font-mono uppercase tracking-wider">{t("allied.paramedicEcgComponents.spo2")}</div>
            <div className="text-2xl font-mono font-bold text-cyan-400">{spo2}%</div>
          </div>
          <div className="bg-gray-900 rounded-lg p-3 text-center" data-testid="vital-bp">
            <div className="text-[10px] text-red-500 font-mono uppercase tracking-wider">BP</div>
            <div className="text-xl font-mono font-bold text-red-400">{bp}</div>
          </div>
          <div className="bg-gray-900 rounded-lg p-3 text-center" data-testid="vital-etco2">
            <div className="text-[10px] text-yellow-500 font-mono uppercase tracking-wider">{t("allied.paramedicEcgComponents.etco2")}</div>
            <div className="text-2xl font-mono font-bold text-yellow-400">{etco2}</div>
            <div className="text-[10px] text-yellow-600 font-mono">mmHg</div>
          </div>
          <div className="bg-gray-900 rounded-lg p-3 text-center" data-testid="vital-rr">
            <div className="text-[10px] text-purple-500 font-mono uppercase tracking-wider">RR</div>
            <div className="text-2xl font-mono font-bold text-purple-400">{respRate}</div>
            <div className="text-[10px] text-purple-600 font-mono">/min</div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface WaveformDetailCardProps {
  waveform: {
    id: string;
    name: string;
    slug: string;
    waveformType: string;
    category: string;
    svgPathData: SvgPathData;
    clinicalAnnotations: any;
    identifyingFeatures: string[];
    associatedConditions: string[];
    treatmentNotes: string;
    rate: string;
    regularity: string;
    clinicalSignificance: string;
    difficulty: string;
  };
  onClose?: () => void;
}

export function WaveformDetailCard({ waveform, onClose }: WaveformDetailCardProps) {
  const difficultyColors: Record<string, string> = {
    beginner: "bg-green-100 text-green-700",
    intermediate: "bg-yellow-100 text-yellow-700",
    advanced: "bg-red-100 text-red-700",
  };

  const isCapnography = waveform.waveformType === "capnography";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden" data-testid={`waveform-detail-${waveform.slug}`}>
      {onClose && (
        <div className="flex items-center justify-between px-6 pt-5 pb-2">
          <h2 className="text-xl font-bold text-gray-900">{waveform.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg font-bold" data-testid="button-close-detail">{t("allied.paramedicEcgComponents.times")}</button>
        </div>
      )}
      {!onClose && (
        <div className="px-6 pt-5 pb-2">
          <h2 className="text-xl font-bold text-gray-900">{waveform.name}</h2>
        </div>
      )}

      <div className="px-6 pb-3 flex flex-wrap gap-2">
        <span className="px-2.5 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">{waveform.category}</span>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${difficultyColors[waveform.difficulty] || "bg-gray-100 text-gray-700"}`}>
          {waveform.difficulty.charAt(0).toUpperCase() + waveform.difficulty.slice(1)}
        </span>
        <span className="px-2.5 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">{waveform.waveformType.replace("-", " ").toUpperCase()}</span>
      </div>

      <div className="px-6 pb-4">
        <ECGStrip svgPathData={waveform.svgPathData} mode="strip" />
      </div>

      <div className="px-6 pb-4">
        <ECGStrip svgPathData={waveform.svgPathData} mode="monitor" label={waveform.name} />
      </div>

      <div className="px-6 pb-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {waveform.rate && (
            <div className="bg-teal-50 rounded-xl p-3" data-testid="info-rate">
              <div className="text-xs font-semibold text-teal-700 uppercase tracking-wider mb-1">{t("allied.paramedicEcgComponents.rate")}</div>
              <div className="text-sm text-gray-900 font-medium">{waveform.rate}</div>
            </div>
          )}
          {waveform.regularity && (
            <div className="bg-purple-50 rounded-xl p-3" data-testid="info-regularity">
              <div className="text-xs font-semibold text-purple-700 uppercase tracking-wider mb-1">{t("allied.paramedicEcgComponents.regularity")}</div>
              <div className="text-sm text-gray-900 font-medium">{waveform.regularity}</div>
            </div>
          )}
          {isCapnography && waveform.svgPathData.etco2 && (
            <div className="bg-yellow-50 rounded-xl p-3" data-testid="info-etco2">
              <div className="text-xs font-semibold text-yellow-700 uppercase tracking-wider mb-1">{t("allied.paramedicEcgComponents.etco22")}</div>
              <div className="text-sm text-gray-900 font-medium">{waveform.svgPathData.etco2}</div>
            </div>
          )}
        </div>

        {waveform.clinicalSignificance && (
          <div data-testid="section-significance">
            <h3 className="text-sm font-semibold text-gray-900 mb-1.5">{t("allied.paramedicEcgComponents.clinicalSignificance")}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{waveform.clinicalSignificance}</p>
          </div>
        )}

        {waveform.identifyingFeatures?.length > 0 && (
          <div data-testid="section-features">
            <h3 className="text-sm font-semibold text-gray-900 mb-1.5">{t("allied.paramedicEcgComponents.keyIdentifyingFeatures")}</h3>
            <ul className="space-y-1">
              {waveform.identifyingFeatures.map((f: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-teal-500 mt-0.5 flex-shrink-0">•</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        )}

        {waveform.clinicalAnnotations && Object.keys(waveform.clinicalAnnotations).length > 0 && (
          <div data-testid="section-annotations">
            <h3 className="text-sm font-semibold text-gray-900 mb-1.5">{t("allied.paramedicEcgComponents.ecgIntervalsAnnotations")}</h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(waveform.clinicalAnnotations).map(([key, value]) => (
                <div key={key} className="bg-gray-50 rounded-lg px-3 py-2">
                  <div className="text-xs text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                  <div className="text-sm font-medium text-gray-900">{String(value)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {waveform.associatedConditions?.length > 0 && (
          <div data-testid="section-conditions">
            <h3 className="text-sm font-semibold text-gray-900 mb-1.5">{t("allied.paramedicEcgComponents.associatedConditions")}</h3>
            <div className="flex flex-wrap gap-1.5">
              {waveform.associatedConditions.map((c: string, i: number) => (
                <span key={i} className="px-2.5 py-1 bg-red-50 text-red-700 rounded-lg text-xs">{c}</span>
              ))}
            </div>
          </div>
        )}

        {waveform.treatmentNotes && (
          <div className="bg-teal-50 border border-teal-100 rounded-xl p-4" data-testid="section-treatment">
            <h3 className="text-sm font-semibold text-teal-800 mb-1.5">{t("allied.paramedicEcgComponents.treatmentNotes")}</h3>
            <p className="text-sm text-teal-700 leading-relaxed">{waveform.treatmentNotes}</p>
          </div>
        )}

        {waveform.svgPathData.leads && (
          <div data-testid="section-leads">
            <h3 className="text-sm font-semibold text-gray-900 mb-1.5">{t("allied.paramedicEcgComponents.12leadInformation")}</h3>
            <div className="flex flex-wrap gap-2">
              <div>
                <span className="text-xs text-gray-500 mr-1">{t("allied.paramedicEcgComponents.stElevationIn")}</span>
                {waveform.svgPathData.leads.map((l: string) => (
                  <span key={l} className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-mono mx-0.5">{l}</span>
                ))}
              </div>
              {waveform.svgPathData.reciprocalChanges && (
                <div>
                  <span className="text-xs text-gray-500 mr-1">{t("allied.paramedicEcgComponents.reciprocalChanges")}</span>
                  {waveform.svgPathData.reciprocalChanges.map((l: string) => (
                    <span key={l} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-mono mx-0.5">{l}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
