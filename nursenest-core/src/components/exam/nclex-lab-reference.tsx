"use client";

// ─────────────────────────────────────────────────────────────────────────────
// NCLEX Lab Values Reference Panel
// Slide-in overlay with common clinical laboratory reference ranges.
// Mirrors what NCLEX provides in the real exam interface.
// ─────────────────────────────────────────────────────────────────────────────

type LabEntry = {
  name: string;
  abbrev: string;
  range: string;
  unit: string;
  critical?: string;
};

type LabSection = {
  title: string;
  entries: LabEntry[];
};

const LAB_SECTIONS: LabSection[] = [
  {
    title: "Serum Electrolytes",
    entries: [
      { name: "Sodium", abbrev: "Na⁺", range: "136–145", unit: "mEq/L", critical: "<120 or >160" },
      { name: "Potassium", abbrev: "K⁺", range: "3.5–5.0", unit: "mEq/L", critical: "<2.5 or >6.5" },
      { name: "Chloride", abbrev: "Cl⁻", range: "98–106", unit: "mEq/L" },
      { name: "Bicarbonate", abbrev: "HCO₃⁻", range: "22–26", unit: "mEq/L" },
      { name: "Calcium (total)", abbrev: "Ca²⁺", range: "8.5–10.2", unit: "mg/dL", critical: "<7 or >12" },
      { name: "Magnesium", abbrev: "Mg²⁺", range: "1.8–2.6", unit: "mg/dL", critical: "<1.2 or >4.9" },
      { name: "Phosphorus", abbrev: "PO₄", range: "2.5–4.5", unit: "mg/dL" },
    ],
  },
  {
    title: "Renal / Metabolic",
    entries: [
      { name: "BUN", abbrev: "BUN", range: "8–20", unit: "mg/dL", critical: ">100" },
      { name: "Creatinine", abbrev: "Cr", range: "0.6–1.3", unit: "mg/dL", critical: ">10" },
      { name: "Glucose (fasting)", abbrev: "Glu", range: "70–99", unit: "mg/dL", critical: "<40 or >500" },
      { name: "Uric Acid", abbrev: "UA", range: "3.5–7.2", unit: "mg/dL" },
    ],
  },
  {
    title: "Complete Blood Count",
    entries: [
      { name: "Hemoglobin (M)", abbrev: "Hgb M", range: "13.5–17.5", unit: "g/dL", critical: "<7 or >20" },
      { name: "Hemoglobin (F)", abbrev: "Hgb F", range: "12.0–16.0", unit: "g/dL", critical: "<7 or >20" },
      { name: "Hematocrit (M)", abbrev: "Hct M", range: "41–53", unit: "%", critical: "<21 or >65" },
      { name: "Hematocrit (F)", abbrev: "Hct F", range: "36–46", unit: "%", critical: "<21 or >65" },
      { name: "WBC", abbrev: "WBC", range: "4.5–11.0", unit: "×10³/µL", critical: "<2 or >30" },
      { name: "Platelets", abbrev: "Plt", range: "150–400", unit: "×10³/µL", critical: "<50 or >1000" },
      { name: "MCV", abbrev: "MCV", range: "80–100", unit: "fL" },
    ],
  },
  {
    title: "Coagulation",
    entries: [
      { name: "PT", abbrev: "PT", range: "11–13.5", unit: "sec", critical: ">20 (no anticoag)" },
      { name: "INR (therapeutic)", abbrev: "INR", range: "2.0–3.5", unit: "", critical: ">4.0" },
      { name: "aPTT (heparin)", abbrev: "aPTT", range: "60–100", unit: "sec", critical: ">100 non-therap." },
    ],
  },
  {
    title: "Liver Function",
    entries: [
      { name: "AST (SGOT)", abbrev: "AST", range: "10–40", unit: "U/L" },
      { name: "ALT (SGPT)", abbrev: "ALT", range: "7–56", unit: "U/L" },
      { name: "Total Bilirubin", abbrev: "T. Bili", range: "0.2–1.2", unit: "mg/dL", critical: ">12" },
      { name: "Albumin", abbrev: "Alb", range: "3.5–5.0", unit: "g/dL", critical: "<1.5" },
      { name: "Total Protein", abbrev: "TP", range: "6.0–8.3", unit: "g/dL" },
    ],
  },
  {
    title: "Arterial Blood Gas",
    entries: [
      { name: "pH", abbrev: "pH", range: "7.35–7.45", unit: "", critical: "<7.2 or >7.6" },
      { name: "PaCO₂", abbrev: "PaCO₂", range: "35–45", unit: "mmHg", critical: "<20 or >70" },
      { name: "PaO₂", abbrev: "PaO₂", range: "80–100", unit: "mmHg", critical: "<40" },
      { name: "SaO₂", abbrev: "SaO₂", range: "≥95", unit: "%" },
      { name: "HCO₃⁻", abbrev: "HCO₃⁻", range: "22–26", unit: "mEq/L" },
    ],
  },
  {
    title: "Cardiac Markers",
    entries: [
      { name: "Troponin I", abbrev: "TnI", range: "<0.04", unit: "ng/mL", critical: ">0.4" },
      { name: "BNP", abbrev: "BNP", range: "<100", unit: "pg/mL" },
      { name: "CK-MB", abbrev: "CK-MB", range: "<5", unit: "% of total CK" },
    ],
  },
  {
    title: "Thyroid",
    entries: [
      { name: "TSH", abbrev: "TSH", range: "0.5–4.5", unit: "mU/L" },
      { name: "Free T4", abbrev: "fT4", range: "0.8–1.8", unit: "ng/dL" },
    ],
  },
];

export function NclexLabReference({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-y-0 right-0 z-[90] flex flex-col shadow-2xl"
      style={{
        width: "min(420px, 100vw)",
        background: "var(--semantic-surface)",
        borderLeft: "1px solid var(--semantic-border-soft)",
      }}
    >
      {/* Header */}
      <div
        className="flex shrink-0 items-center justify-between px-5 py-4"
        style={{
          background: "color-mix(in srgb, var(--semantic-info) 6%, var(--semantic-surface))",
          borderBottom: "1px solid var(--semantic-border-soft)",
        }}
      >
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: "var(--semantic-info)" }}>
            Reference
          </p>
          <h2 className="mt-0.5 text-[15px] font-bold" style={{ color: "var(--semantic-text-primary)" }}>
            Laboratory Values
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-bold transition-colors"
          style={{
            background: "color-mix(in srgb, var(--semantic-text-muted) 10%, transparent)",
            color: "var(--semantic-text-muted)",
          }}
        >
          ✕
        </button>
      </div>

      {/* Note */}
      <div
        className="shrink-0 px-5 py-2.5 text-[11px] leading-snug"
        style={{
          background: "color-mix(in srgb, var(--semantic-warning) 8%, var(--semantic-surface))",
          borderBottom: "1px solid var(--semantic-border-soft)",
          color: "var(--semantic-text-muted)",
        }}
      >
        Reference ranges vary by laboratory. Critical values (↑↓) marked in red are approximate.
        Use clinical context on exam questions.
      </div>

      {/* Scrollable table */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <div className="space-y-5">
          {LAB_SECTIONS.map((section) => (
            <div key={section.title}>
              <h3
                className="mb-2 text-[11px] font-bold uppercase tracking-widest"
                style={{ color: "var(--semantic-info)" }}
              >
                {section.title}
              </h3>
              <div
                className="overflow-hidden rounded-xl"
                style={{ border: "1px solid var(--semantic-border-soft)" }}
              >
                <table className="w-full text-[12px]">
                  <thead>
                    <tr
                      style={{
                        background: "color-mix(in srgb, var(--semantic-text-muted) 5%, var(--semantic-surface))",
                        borderBottom: "1px solid var(--semantic-border-soft)",
                      }}
                    >
                      <th className="px-3 py-2 text-left font-semibold" style={{ color: "var(--semantic-text-muted)" }}>
                        Test
                      </th>
                      <th className="px-2 py-2 text-right font-semibold" style={{ color: "var(--semantic-text-muted)" }}>
                        Range
                      </th>
                      <th className="px-3 py-2 text-left font-semibold" style={{ color: "var(--semantic-text-muted)" }}>
                        Unit
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {section.entries.map((entry, i) => (
                      <tr
                        key={entry.abbrev}
                        style={{
                          background:
                            i % 2 === 0
                              ? "transparent"
                              : "color-mix(in srgb, var(--semantic-text-muted) 3%, transparent)",
                          borderBottom:
                            i < section.entries.length - 1
                              ? "1px solid var(--semantic-border-soft)"
                              : "none",
                        }}
                      >
                        <td className="px-3 py-2">
                          <div className="font-medium" style={{ color: "var(--semantic-text-primary)" }}>
                            {entry.abbrev}
                          </div>
                          <div className="text-[10px]" style={{ color: "var(--semantic-text-muted)" }}>
                            {entry.name}
                          </div>
                        </td>
                        <td className="px-2 py-2 text-right font-mono font-semibold tabular-nums" style={{ color: "var(--semantic-text-primary)" }}>
                          {entry.range}
                        </td>
                        <td className="px-3 py-2">
                          <div style={{ color: "var(--semantic-text-secondary)" }}>{entry.unit}</div>
                          {entry.critical ? (
                            <div className="text-[10px] font-medium" style={{ color: "var(--semantic-danger)" }}>
                              Critical: {entry.critical}
                            </div>
                          ) : null}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-[10px]" style={{ color: "var(--semantic-text-muted)" }}>
          For NCLEX simulation use only. Not clinical guidance.
        </p>
      </div>
    </div>
  );
}
