import { useState, useMemo } from "react";
import { Zap, ArrowRight, Minus, Plus } from "lucide-react";

import { useI18n } from "@/lib/i18n";
export function KvpVisualizer() {
  const { t } = useI18n();
  const [kvp, setKvp] = useState(80);
  const minKvp = 40;
  const maxKvp = 120;
  const penetration = ((kvp - minKvp) / (maxKvp - minKvp)) * 100;
  const contrast = 100 - penetration * 0.7;
  const scatterPercent = Math.min(95, penetration * 0.8);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4" data-testid="kvp-visualizer">
      <div className="flex items-center gap-2 mb-2">
        <Zap className="w-5 h-5 text-amber-500" />
        <h3 className="font-bold text-gray-900">{t("allied.physicsVisuals.kvpVisualizer")}</h3>
      </div>
      <p className="text-sm text-gray-600">{t("allied.physicsVisuals.adjustKvpToSeeHow")}</p>
      <div className="flex items-center gap-4">
        <button onClick={() => setKvp(Math.max(minKvp, kvp - 5))} className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200" data-testid="button-kvp-decrease"><Minus className="w-4 h-4" /></button>
        <input type="range" min={minKvp} max={maxKvp} step={5} value={kvp} onChange={e => setKvp(Number(e.target.value))} className="flex-1 accent-amber-500" data-testid="input-kvp-slider" />
        <button onClick={() => setKvp(Math.min(maxKvp, kvp + 5))} className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200" data-testid="button-kvp-increase"><Plus className="w-4 h-4" /></button>
        <span className="text-lg font-bold text-amber-600 w-16 text-right" data-testid="text-kvp-value">{kvp} kVp</span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-blue-50 rounded-xl p-3 text-center">
          <div className="text-xs text-blue-600 mb-1">{t("allied.physicsVisuals.penetration")}</div>
          <div className="h-24 bg-blue-100 rounded-lg relative overflow-hidden">
            <div className="absolute bottom-0 w-full bg-blue-500 transition-all duration-300 rounded-b-lg" style={{ height: `${penetration}%` }} />
          </div>
          <div className="text-sm font-bold text-blue-700 mt-1" data-testid="text-penetration">{penetration.toFixed(0)}%</div>
        </div>
        <div className="bg-purple-50 rounded-xl p-3 text-center">
          <div className="text-xs text-purple-600 mb-1">{t("allied.physicsVisuals.contrast")}</div>
          <div className="h-24 bg-purple-100 rounded-lg relative overflow-hidden">
            <div className="absolute bottom-0 w-full bg-purple-500 transition-all duration-300 rounded-b-lg" style={{ height: `${contrast}%` }} />
          </div>
          <div className="text-sm font-bold text-purple-700 mt-1" data-testid="text-contrast">{contrast.toFixed(0)}%</div>
        </div>
        <div className="bg-red-50 rounded-xl p-3 text-center">
          <div className="text-xs text-red-600 mb-1">{t("allied.physicsVisuals.scatter")}</div>
          <div className="h-24 bg-red-100 rounded-lg relative overflow-hidden">
            <div className="absolute bottom-0 w-full bg-red-400 transition-all duration-300 rounded-b-lg" style={{ height: `${scatterPercent}%` }} />
          </div>
          <div className="text-sm font-bold text-red-700 mt-1" data-testid="text-scatter">{scatterPercent.toFixed(0)}%</div>
        </div>
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800">
        <strong>{t("allied.physicsVisuals.keyConcept")}</strong> Higher kVp = more penetration, lower contrast, more scatter radiation. Lower kVp = less penetration, higher contrast, less scatter.
      </div>
    </div>
  );
}

export function MasSimulator() {
  const [ma, setMa] = useState(200);
  const [time, setTime] = useState(0.1);
  const mas = ma * time;
  const density = Math.min(100, (mas / 50) * 100);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4" data-testid="mas-simulator">
      <div className="flex items-center gap-2 mb-2">
        <Zap className="w-5 h-5 text-teal-500" />
        <h3 className="font-bold text-gray-900">{t("allied.physicsVisuals.masChangeSimulator")}</h3>
      </div>
      <p className="text-sm text-gray-600">{t("allied.physicsVisuals.adjustMaAndTimeTo")}</p>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-gray-500 block mb-1">{t("allied.physicsVisuals.tubeCurrentMa")}</label>
          <input type="range" min={50} max={800} step={50} value={ma} onChange={e => setMa(Number(e.target.value))} className="w-full accent-teal-500" data-testid="input-ma-slider" />
          <span className="text-sm font-bold text-teal-600" data-testid="text-ma-value">{ma} mA</span>
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">{t("allied.physicsVisuals.exposureTimeS")}</label>
          <input type="range" min={0.01} max={1} step={0.01} value={time} onChange={e => setTime(Number(e.target.value))} className="w-full accent-teal-500" data-testid="input-time-slider" />
          <span className="text-sm font-bold text-teal-600" data-testid="text-time-value">{time.toFixed(2)}s</span>
        </div>
      </div>
      <div className="bg-teal-50 rounded-xl p-4 text-center">
        <div className="text-sm text-teal-600">{t("allied.physicsVisuals.masMaTime")}</div>
        <div className="text-3xl font-bold text-teal-700 mt-1" data-testid="text-mas-value">{mas.toFixed(1)} mAs</div>
      </div>
      <div className="bg-gray-100 rounded-xl p-4">
        <div className="text-xs text-gray-500 mb-2">{t("allied.physicsVisuals.imageDensity")}</div>
        <div className="h-8 bg-gray-200 rounded-lg overflow-hidden">
          <div className="h-full bg-gradient-to-r from-gray-800 to-gray-400 transition-all duration-300 rounded-lg" style={{ width: `${density}%` }} />
        </div>
        <div className="text-xs text-gray-600 mt-1">{density > 80 ? "Overexposed" : density > 40 ? "Optimal" : "Underexposed"}</div>
      </div>
      <div className="bg-teal-50 border border-teal-200 rounded-xl p-3 text-sm text-teal-800">
        <strong>{t("allied.physicsVisuals.keyConcept2")}</strong> mAs controls quantity of x-rays (density). Doubling mAs doubles the number of x-ray photons. To change density visibly, change mAs by at least 30%.
      </div>
    </div>
  );
}

export function InverseSquareLawDiagram() {
  const [distance, setDistance] = useState(100);
  const baseIntensity = 100;
  const intensity = baseIntensity * Math.pow(100 / distance, 2);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4" data-testid="inverse-square-law">
      <div className="flex items-center gap-2 mb-2">
        <ArrowRight className="w-5 h-5 text-indigo-500" />
        <h3 className="font-bold text-gray-900">{t("allied.physicsVisuals.inverseSquareLaw")}</h3>
      </div>
      <p className="text-sm text-gray-600">{t("allied.physicsVisuals.seeHowRadiationIntensityDecreases")}</p>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500">{t("allied.physicsVisuals.distance")}</span>
        <input type="range" min={50} max={300} step={10} value={distance} onChange={e => setDistance(Number(e.target.value))} className="flex-1 accent-indigo-500" data-testid="input-distance-slider" />
        <span className="text-sm font-bold text-indigo-600 w-20 text-right" data-testid="text-distance-value">{distance} cm</span>
      </div>
      <div className="relative bg-indigo-50 rounded-xl p-4 h-40">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 bg-yellow-400 rounded-full shadow-lg shadow-yellow-300 animate-pulse" />
        <div className="absolute top-1/2 -translate-y-1/2 flex items-center" style={{ left: `${Math.min(90, (distance / 300) * 90)}%` }}>
          <div className="w-8 h-16 bg-indigo-200 rounded border-2 border-indigo-400 flex items-center justify-center">
            <span className="text-[10px] text-indigo-700 font-bold rotate-90 whitespace-nowrap">{t("allied.physicsVisuals.receptor")}</span>
          </div>
        </div>
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 160" preserveAspectRatio="none">
          <line x1="30" y1="80" x2={Math.min(360, (distance / 300) * 360)} y2="40" stroke="#818cf8" strokeWidth="1" strokeDasharray="4" />
          <line x1="30" y1="80" x2={Math.min(360, (distance / 300) * 360)} y2="120" stroke="#818cf8" strokeWidth="1" strokeDasharray="4" />
        </svg>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-indigo-50 rounded-xl p-3 text-center">
          <div className="text-xs text-indigo-600">{t("allied.physicsVisuals.relativeIntensity")}</div>
          <div className="text-2xl font-bold text-indigo-700" data-testid="text-intensity">{intensity.toFixed(1)}%</div>
        </div>
        <div className="bg-indigo-50 rounded-xl p-3 text-center">
          <div className="text-xs text-indigo-600">{t("allied.physicsVisuals.formula")}</div>
          <div className="text-sm font-mono text-indigo-700">I₁/I₂ = (D₂/D₁)²</div>
        </div>
      </div>
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 text-sm text-indigo-800">
        <strong>{t("allied.physicsVisuals.keyConcept3")}</strong> Doubling the distance reduces intensity to 1/4. Halving the distance increases intensity by 4×. This affects patient dose and image quality.
      </div>
    </div>
  );
}

export function AttenuationLayers() {
  const [tissue, setTissue] = useState<"soft" | "bone" | "metal" | "air">("soft");
  const [thickness, setThickness] = useState(5);
  const attenuationCoefficients: Record<string, number> = { air: 0.01, soft: 0.15, bone: 0.45, metal: 0.95 };
  const mu = attenuationCoefficients[tissue];
  const transmitted = 100 * Math.exp(-mu * thickness);
  const absorbed = 100 - transmitted;
  const colors: Record<string, string> = { air: "#e0f2fe", soft: "#fce7f3", bone: "#fef3c7", metal: "#e5e7eb" };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4" data-testid="attenuation-layers">
      <h3 className="font-bold text-gray-900">{t("allied.physicsVisuals.attenuationBeamInteraction")}</h3>
      <p className="text-sm text-gray-600">{t("allied.physicsVisuals.seeHowDifferentTissuesAbsorb")}</p>
      <div className="flex gap-2">
        {(["air", "soft", "bone", "metal"] as const).map(t => (
          <button key={t} onClick={() => setTissue(t)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${tissue === t ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`} data-testid={`button-tissue-${t}`}>
            {t === "soft" ? "Soft Tissue" : t === "bone" ? "Bone" : t === "metal" ? "Metal (Pb)" : "Air"}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500">{t("allied.physicsVisuals.thickness")}</span>
        <input type="range" min={1} max={20} step={1} value={thickness} onChange={e => setThickness(Number(e.target.value))} className="flex-1 accent-blue-500" data-testid="input-thickness-slider" />
        <span className="text-sm font-bold text-blue-600" data-testid="text-thickness-value">{thickness} cm</span>
      </div>
      <div className="relative bg-gray-50 rounded-xl p-4 h-32 flex items-center">
        <div className="flex items-center w-full">
          <div className="flex-shrink-0 flex flex-col items-center">
            <div className="w-3 h-3 bg-yellow-400 rounded-full" />
            <div className="text-[10px] text-gray-500 mt-1">{t("allied.physicsVisuals.source")}</div>
          </div>
          <div className="flex-1 mx-3 flex items-center">
            {Array.from({ length: Math.min(thickness, 10) }).map((_, i) => (
              <div key={i} className="flex-1 h-20 border-r border-gray-300" style={{ backgroundColor: colors[tissue], opacity: 1 - i * 0.05 }} />
            ))}
          </div>
          <div className="flex-shrink-0 flex flex-col items-center">
            <div className="w-8 h-16 bg-gray-200 rounded border border-gray-300 flex items-center justify-center" style={{ opacity: transmitted / 100 }}>
              <span className="text-[9px] font-bold text-gray-600">IR</span>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-green-50 rounded-xl p-3 text-center">
          <div className="text-xs text-green-600">{t("allied.physicsVisuals.transmitted")}</div>
          <div className="text-2xl font-bold text-green-700" data-testid="text-transmitted">{transmitted.toFixed(1)}%</div>
        </div>
        <div className="bg-red-50 rounded-xl p-3 text-center">
          <div className="text-xs text-red-600">{t("allied.physicsVisuals.absorbed")}</div>
          <div className="text-2xl font-bold text-red-700" data-testid="text-absorbed">{absorbed.toFixed(1)}%</div>
        </div>
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-800">
        <strong>{t("allied.physicsVisuals.keyConcept4")}</strong> I = I₀ × e^(-μx). Higher atomic number and density = more attenuation. This is why bone appears white and air appears black on radiographs.
      </div>
    </div>
  );
}

export function SidMagnificationVisual() {
  const [sid, setSid] = useState(100);
  const [oid, setOid] = useState(10);
  const sod = sid - oid;
  const magnificationFactor = sid / sod;
  const imageSize = 5 * magnificationFactor;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4" data-testid="sid-magnification">
      <h3 className="font-bold text-gray-900">{t("allied.physicsVisuals.sidOidMagnification")}</h3>
      <p className="text-sm text-gray-600">{t("allied.physicsVisuals.adjustSidAndOidTo")}</p>
      <div className="space-y-3">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500 w-12">{t("allied.physicsVisuals.sid")}</span>
          <input type="range" min={72} max={180} step={1} value={sid} onChange={e => setSid(Number(e.target.value))} className="flex-1 accent-emerald-500" data-testid="input-sid-slider" />
          <span className="text-sm font-bold text-emerald-600 w-16 text-right" data-testid="text-sid-value">{sid} cm</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500 w-12">{t("allied.physicsVisuals.oid")}</span>
          <input type="range" min={0} max={Math.min(50, sid - 30)} step={1} value={oid} onChange={e => setOid(Number(e.target.value))} className="flex-1 accent-emerald-500" data-testid="input-oid-slider" />
          <span className="text-sm font-bold text-emerald-600 w-16 text-right" data-testid="text-oid-value">{oid} cm</span>
        </div>
      </div>
      <div className="relative bg-emerald-50 rounded-xl p-4 h-36 flex items-end justify-center">
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-yellow-400 rounded-full shadow-lg shadow-yellow-300" />
        <div className="absolute flex flex-col items-center" style={{ bottom: `${(1 - oid / sid) * 80 + 10}%` }}>
          <div className="w-10 h-3 bg-rose-400 rounded" />
          <span className="text-[9px] text-rose-600 mt-0.5">{t("allied.physicsVisuals.object")}</span>
        </div>
        <div className="absolute bottom-2 flex flex-col items-center">
          <div className="bg-gray-300 rounded h-3 transition-all duration-300" style={{ width: `${Math.min(200, imageSize * 12)}px` }} />
          <span className="text-[9px] text-gray-600 mt-0.5">{t("allied.physicsVisuals.image")}</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="bg-emerald-50 rounded-xl p-3">
          <div className="text-xs text-emerald-600">SOD</div>
          <div className="text-lg font-bold text-emerald-700" data-testid="text-sod-value">{sod} cm</div>
        </div>
        <div className="bg-emerald-50 rounded-xl p-3">
          <div className="text-xs text-emerald-600">{t("allied.physicsVisuals.magnification")}</div>
          <div className="text-lg font-bold text-emerald-700" data-testid="text-magnification">{magnificationFactor.toFixed(2)}×</div>
        </div>
        <div className="bg-emerald-50 rounded-xl p-3">
          <div className="text-xs text-emerald-600">{t("allied.physicsVisuals.imageSize")}</div>
          <div className="text-lg font-bold text-emerald-700" data-testid="text-image-size">{imageSize.toFixed(1)} cm</div>
        </div>
      </div>
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-sm text-emerald-800">
        <strong>{t("allied.physicsVisuals.keyConcept5")}</strong> MF = SID/SOD. Increase SID or decrease OID to reduce magnification. Standard chest x-ray uses 72" (183 cm) SID to minimize heart magnification.
      </div>
    </div>
  );
}
