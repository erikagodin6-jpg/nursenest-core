import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { useI18n } from "@/lib/i18n";
type AuscultationSite = {
  id: string;
  label: string;
  shortLabel: string;
  cx: number;
  cy: number;
  description: string;
  normalSound: string;
  abnormalFindings: string[];
};

const ANTERIOR_SITES: AuscultationSite[] = [
  { id: "ant-apex-l", label: "Left Apex", shortLabel: "1L", cx: 175, cy: 85, description: "Above the clavicle, over the lung apex", normalSound: "Vesicular - soft, low-pitched", abnormalFindings: ["Diminished sounds (pleural effusion)", "Bronchial sounds (consolidation)"] },
  { id: "ant-apex-r", label: "Right Apex", shortLabel: "1R", cx: 255, cy: 85, description: "Above the clavicle, over the lung apex", normalSound: "Vesicular - soft, low-pitched", abnormalFindings: ["Diminished sounds (pleural effusion)", "Bronchial sounds (TB, consolidation)"] },
  { id: "ant-upper-l", label: "Left Upper Lobe", shortLabel: "2L", cx: 170, cy: 140, description: "2nd intercostal space, midclavicular line", normalSound: "Bronchovesicular near sternum, vesicular laterally", abnormalFindings: ["Wheezes (asthma)", "Crackles (pneumonia)"] },
  { id: "ant-upper-r", label: "Right Upper Lobe", shortLabel: "2R", cx: 260, cy: 140, description: "2nd intercostal space, midclavicular line", normalSound: "Bronchovesicular near sternum, vesicular laterally", abnormalFindings: ["Wheezes (bronchospasm)", "Crackles (infection)"] },
  { id: "ant-mid-l", label: "Left Middle", shortLabel: "3L", cx: 160, cy: 200, description: "4th intercostal space, anterior axillary line", normalSound: "Vesicular - soft inspiratory, shorter expiratory", abnormalFindings: ["Friction rub (pleurisy)", "Diminished sounds (effusion)"] },
  { id: "ant-mid-r", label: "Right Middle Lobe", shortLabel: "3R", cx: 270, cy: 200, description: "4th intercostal space, anterior axillary line", normalSound: "Vesicular", abnormalFindings: ["Crackles (right middle lobe pneumonia)", "Wheezes (obstruction)"] },
  { id: "ant-base-l", label: "Left Lower Lobe", shortLabel: "4L", cx: 170, cy: 270, description: "6th intercostal space, midclavicular line", normalSound: "Vesicular", abnormalFindings: ["Fine crackles (pulmonary edema, CHF)", "Coarse crackles (pneumonia)"] },
  { id: "ant-base-r", label: "Right Lower Lobe", shortLabel: "4R", cx: 260, cy: 270, description: "6th intercostal space, midclavicular line", normalSound: "Vesicular", abnormalFindings: ["Fine crackles (pulmonary edema)", "Absent sounds (pleural effusion)"] },
  { id: "tracheal", label: "Tracheal", shortLabel: "T", cx: 215, cy: 60, description: "Over the trachea, suprasternal notch", normalSound: "Bronchial - loud, high-pitched, hollow", abnormalFindings: ["Stridor (upper airway obstruction - EMERGENCY)", "Inspiratory stridor (croup, epiglottitis)"] },
];

const POSTERIOR_SITES: AuscultationSite[] = [
  { id: "post-apex-l", label: "Left Posterior Apex", shortLabel: "1L", cx: 170, cy: 90, description: "Above the scapula, C7-T1 level", normalSound: "Vesicular", abnormalFindings: ["Diminished sounds (apical fibrosis)", "Bronchial sounds (TB cavitation)"] },
  { id: "post-apex-r", label: "Right Posterior Apex", shortLabel: "1R", cx: 260, cy: 90, description: "Above the scapula, C7-T1 level", normalSound: "Vesicular", abnormalFindings: ["Bronchial sounds (consolidation)", "Diminished sounds (pneumothorax)"] },
  { id: "post-upper-l", label: "Left Posterior Upper", shortLabel: "2L", cx: 165, cy: 140, description: "Between scapulae, T3-T4 level", normalSound: "Bronchovesicular (near spine)", abnormalFindings: ["Crackles (interstitial lung disease)", "Wheezes (asthma)"] },
  { id: "post-upper-r", label: "Right Posterior Upper", shortLabel: "2R", cx: 265, cy: 140, description: "Between scapulae, T3-T4 level", normalSound: "Bronchovesicular (near spine)", abnormalFindings: ["Crackles (pneumonia)", "Diminished sounds"] },
  { id: "post-mid-l", label: "Left Posterior Middle", shortLabel: "3L", cx: 155, cy: 195, description: "Below scapula, T5-T6 level", normalSound: "Vesicular", abnormalFindings: ["Fine crackles (fibrosis)", "Friction rub (pleurisy)"] },
  { id: "post-mid-r", label: "Right Posterior Middle", shortLabel: "3R", cx: 275, cy: 195, description: "Below scapula, T5-T6 level", normalSound: "Vesicular", abnormalFindings: ["Crackles (pneumonia)", "Absent sounds (effusion)"] },
  { id: "post-lower-l", label: "Left Posterior Lower", shortLabel: "4L", cx: 165, cy: 250, description: "T9-T10 level, below scapular tip", normalSound: "Vesicular", abnormalFindings: ["Bilateral fine crackles (pulmonary edema/CHF)", "Coarse crackles (bronchiectasis)"] },
  { id: "post-lower-r", label: "Right Posterior Lower", shortLabel: "4R", cx: 265, cy: 250, description: "T9-T10 level, below scapular tip", normalSound: "Vesicular", abnormalFindings: ["Fine crackles (atelectasis, edema)", "Absent sounds (large pleural effusion)"] },
];

function TorsoSVG({ sites, view, selectedSite, onSelectSite }: {
  sites: AuscultationSite[];
  view: "anterior" | "posterior";
  selectedSite: string | null;
  onSelectSite: (id: string) => void;
}) {
  return (
    <svg viewBox="0 0 430 340" className="w-full max-w-md mx-auto" data-testid={`svg-torso-${view}`}>
      {view === "anterior" ? (
        <g>
          <ellipse cx="215" cy="30" rx="40" ry="30" fill="#f5e6d3" stroke="#c4a882" strokeWidth="1.5" />
          <path d="M160,55 Q140,60 120,90 Q100,130 100,180 Q100,230 110,280 Q115,310 140,320 L290,320 Q315,310 320,280 Q330,230 330,180 Q330,130 310,90 Q290,60 270,55 Q250,50 215,48 Q180,50 160,55Z" fill="#f5e6d3" stroke="#c4a882" strokeWidth="1.5" />
          <line x1="215" y1="55" x2="215" y2="310" stroke="#e2cdb5" strokeWidth="0.8" strokeDasharray="4,4" />
          <line x1="110" y1="180" x2="320" y2="180" stroke="#e2cdb5" strokeWidth="0.8" strokeDasharray="4,4" />
          <path d="M160,55 Q140,70 120,90 Q100,110 90,140 L90,180 Q90,170 100,160" fill="none" stroke="#c4a882" strokeWidth="1" />
          <path d="M270,55 Q290,70 310,90 Q330,110 340,140 L340,180 Q340,170 330,160" fill="none" stroke="#c4a882" strokeWidth="1" />
          <ellipse cx="190" cy="108" rx="4" ry="3" fill="#c4a882" opacity="0.5" />
          <ellipse cx="240" cy="108" rx="4" ry="3" fill="#c4a882" opacity="0.5" />
        </g>
      ) : (
        <g>
          <ellipse cx="215" cy="30" rx="40" ry="30" fill="#f5e6d3" stroke="#c4a882" strokeWidth="1.5" />
          <path d="M160,55 Q140,60 120,90 Q100,130 100,180 Q100,230 110,280 Q115,310 140,320 L290,320 Q315,310 320,280 Q330,230 330,180 Q330,130 310,90 Q290,60 270,55 Q250,50 215,48 Q180,50 160,55Z" fill="#f5e6d3" stroke="#c4a882" strokeWidth="1.5" />
          <line x1="215" y1="55" x2="215" y2="310" stroke="#e2cdb5" strokeWidth="1" strokeDasharray="4,4" />
          <path d="M170,95 Q200,130 215,140 L215,140 Q230,130 260,95 L280,80 Q260,75 250,85 Q235,100 215,105 Q195,100 180,85 Q170,75 150,80 Z" fill="#f0dcc8" stroke="#c4a882" strokeWidth="1" />
          <path d="M215,95 L215,55" stroke="#d4b896" strokeWidth="2" />
          <circle cx="215" cy="68" r="3" fill="#d4b896" />
          <circle cx="215" cy="80" r="2.5" fill="#d4b896" />
          <circle cx="215" cy="90" r="2" fill="#d4b896" />
        </g>
      )}
      {sites.map(site => {
        const isSelected = selectedSite === site.id;
        return (
          <g key={site.id} onClick={() => onSelectSite(site.id)} style={{ cursor: "pointer" }} data-testid={`site-${site.id}`}>
            <circle cx={site.cx} cy={site.cy} r={isSelected ? 16 : 12} fill={isSelected ? "#3b82f6" : "#60a5fa"} opacity={isSelected ? 0.9 : 0.6} stroke={isSelected ? "#1d4ed8" : "#3b82f6"} strokeWidth={isSelected ? 2.5 : 1.5}>
              <animate attributeName="r" values={isSelected ? "16;18;16" : "12;12;12"} dur="2s" repeatCount="indefinite" />
            </circle>
            <text x={site.cx} y={site.cy + 4} textAnchor="middle" fontSize="10" fontWeight="bold" fill="white" style={{ pointerEvents: "none" }}>{site.shortLabel}</text>
          </g>
        );
      })}
      <text x="215" y="335" textAnchor="middle" fontSize="12" fill="#6b7280" fontWeight="600">
        {view === "anterior" ? "Anterior (Front) View" : "Posterior (Back) View"}
      </text>
    </svg>
  );
}

function SiteInfoPanel({ site }: { site: AuscultationSite }) {
  const { t } = useI18n();
  return (
    <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 space-y-3" data-testid={`panel-site-${site.id}`}>
      <h4 className="font-bold text-blue-900 text-base">{site.label}</h4>
      <p className="text-sm text-gray-700">{site.description}</p>
      <div className="space-y-1">
        <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider">{t("components.auscultationSitesDiagram.normalSound")}</p>
        <p className="text-sm text-gray-800">{site.normalSound}</p>
      </div>
      <div className="space-y-1">
        <p className="text-xs font-semibold text-red-600 uppercase tracking-wider">{t("components.auscultationSitesDiagram.abnormalFindings")}</p>
        <ul className="space-y-1">
          {site.abnormalFindings.map((f, i) => (
            <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
              <span className="text-red-400 mt-0.5">-</span>
              {f}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function AuscultationSitesDiagram() {
  const [view, setView] = useState<"anterior" | "posterior">("anterior");
  const [selectedSite, setSelectedSite] = useState<string | null>(null);

  const sites = view === "anterior" ? ANTERIOR_SITES : POSTERIOR_SITES;
  const activeSite = sites.find(s => s.id === selectedSite) || null;

  return (
    <Card className="border-blue-200 bg-gradient-to-b from-blue-50/50 to-white" data-testid="card-auscultation-diagram">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">{t("components.auscultationSitesDiagram.auscultationSites")}</h3>
          <div className="flex gap-1">
            <Button
              variant={view === "anterior" ? "default" : "outline"}
              size="sm"
              onClick={() => { setView("anterior"); setSelectedSite(null); }}
              data-testid="button-view-anterior"
            >
              Anterior
            </Button>
            <Button
              variant={view === "posterior" ? "default" : "outline"}
              size="sm"
              onClick={() => { setView("posterior"); setSelectedSite(null); }}
              data-testid="button-view-posterior"
            >
              Posterior
            </Button>
          </div>
        </div>
        <p className="text-sm text-gray-500">{t("components.auscultationSitesDiagram.tapANumberedSiteTo")}</p>
        <div className="grid md:grid-cols-2 gap-4 items-start">
          <TorsoSVG
            sites={sites}
            view={view}
            selectedSite={selectedSite}
            onSelectSite={(id) => setSelectedSite(selectedSite === id ? null : id)}
          />
          <div className="space-y-3">
            {activeSite ? (
              <SiteInfoPanel site={activeSite} />
            ) : (
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-center">
                <p className="text-sm text-gray-500">{t("components.auscultationSitesDiagram.selectASiteOnThe")}</p>
                <div className="mt-3 text-xs text-gray-400 space-y-1">
                  <p>Anterior: {ANTERIOR_SITES.length} sites (including tracheal)</p>
                  <p>Posterior: {POSTERIOR_SITES.length} sites</p>
                  <p className="mt-2 font-medium">{t("components.auscultationSitesDiagram.alwaysAuscultateSidetosideForComparison")}</p>
                </div>
              </div>
            )}
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-xs font-semibold text-amber-800 mb-1">{t("components.auscultationSitesDiagram.techniqueReminders")}</p>
              <ul className="text-xs text-amber-700 space-y-1">
                <li>{t("components.auscultationSitesDiagram.useTheDiaphragmOfThe")}</li>
                <li>{t("components.auscultationSitesDiagram.patientUprightBreathingDeeplyThrough")}</li>
                <li>{t("components.auscultationSitesDiagram.listenForAtLeastOne")}</li>
                <li>{t("components.auscultationSitesDiagram.compareBilateralLungFieldsSidetoside")}</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
