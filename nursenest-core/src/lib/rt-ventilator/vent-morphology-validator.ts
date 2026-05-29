/**
 * Ventilator Waveform Morphology Validator
 *
 * Runtime validation of clinical invariants in VentWaveformConfig.
 * Prevents physiologically impossible or educationally misleading configurations
 * from being used in learner-facing content.
 *
 * Design principles (mirror ecg-morphology-validator.ts):
 *   - Each validator checks one clinically meaningful invariant
 *   - Pure functions: VentWaveformConfig → VentMorphologyViolation[]
 *   - Hard errors for publishable content; warnings for draft/preview
 */

import type { VentWaveformConfig, VentMode } from "./vent-waveform-generator";
import { VENT_TEMPLATE_REGISTRY } from "./vent-waveform-templates";

// ─── Types ─────────────────────────────────────────────────────────────────────

export type VentMorphologyViolationSeverity = "error" | "warning";

export type VentMorphologyViolation = {
  rule: string;
  message: string;
  severity: VentMorphologyViolationSeverity;
  /** Why this matters clinically / educationally */
  clinicalRationale: string;
};

export type VentMorphologyValidationResult = {
  ok: boolean;
  mode: VentMode;
  violations: VentMorphologyViolation[];
  errors: VentMorphologyViolation[];
  warnings: VentMorphologyViolation[];
};

// ─── Individual validators ─────────────────────────────────────────────────────

function validatePeepRange(config: VentWaveformConfig): VentMorphologyViolation[] {
  const v: VentMorphologyViolation[] = [];
  if (config.peep < 0) {
    v.push({
      rule: "peep_non_negative",
      message: `PEEP ${config.peep} cmH₂O is negative — not physiologically possible.`,
      severity: "error",
      clinicalRationale: "PEEP cannot be negative on a mechanical ventilator. Minimum is 0 cmH₂O.",
    });
  }
  if (config.peep > 25) {
    v.push({
      rule: "peep_excessive",
      message: `PEEP ${config.peep} cmH₂O exceeds 25 cmH₂O — extremely high, rarely used clinically.`,
      severity: "warning",
      clinicalRationale:
        "PEEP above 20–25 cmH₂O is rarely used outside extreme ARDS protocols and risks hemodynamic compromise.",
    });
  }
  return v;
}

function validatePipExceedsPeep(config: VentWaveformConfig): VentMorphologyViolation[] {
  const v: VentMorphologyViolation[] = [];
  const pip = config.pip;
  if (pip !== undefined && pip <= config.peep) {
    v.push({
      rule: "pip_must_exceed_peep",
      message: `PIP (${pip}) must be greater than PEEP (${config.peep}) — no driving pressure.`,
      severity: "error",
      clinicalRationale:
        "Inspiratory pressure must exceed PEEP to create a pressure gradient that drives inspiratory flow. " +
        "PIP ≤ PEEP means zero or reversed driving pressure — no ventilation occurs.",
    });
  }
  return v;
}

function validatePlateuSafetyLimit(config: VentWaveformConfig): VentMorphologyViolation[] {
  const v: VentMorphologyViolation[] = [];
  // Estimate plateau for VC modes
  if ((config.mode === "volume_control" || config.mode === "simv") && config.tidalVolume != null) {
    const estimatedPplat = config.peep + config.tidalVolume / config.compliance;
    if (estimatedPplat > 35) {
      v.push({
        rule: "plateau_pressure_vili_risk",
        message: `Estimated Pplat ${estimatedPplat.toFixed(1)} cmH₂O exceeds 35 cmH₂O — VILI risk.`,
        severity: "warning",
        clinicalRationale:
          "ARDSNet and standard lung-protective guidelines target Pplat ≤ 30 cmH₂O (never > 35). " +
          "This combination of Vt and compliance will produce supra-therapeutic plateau pressures. " +
          "Only appropriate if the template is deliberately demonstrating a non-protective strategy.",
      });
    }
  }
  return v;
}

function validateTidalVolumeRange(config: VentWaveformConfig): VentMorphologyViolation[] {
  const v: VentMorphologyViolation[] = [];
  const vt = config.tidalVolume;
  if (vt === undefined) return v;
  if (vt < 200) {
    v.push({
      rule: "tidal_volume_too_small",
      message: `Tidal volume ${vt} mL is below 200 mL — clinically unrealistic for adult ventilation.`,
      severity: "error",
      clinicalRationale: "Adult tidal volumes below 200 mL do not provide meaningful gas exchange in standard ventilation.",
    });
  }
  if (vt > 1200) {
    v.push({
      rule: "tidal_volume_too_large",
      message: `Tidal volume ${vt} mL exceeds 1200 mL — dangerous, risks barotrauma and VILI.`,
      severity: "error",
      clinicalRationale: "Tidal volumes above 10–12 mL/kg IBW cause volutrauma. 1200 mL is far above safe limits for any adult.",
    });
  }
  return v;
}

function validateRespiratoryRate(config: VentWaveformConfig): VentMorphologyViolation[] {
  const v: VentMorphologyViolation[] = [];
  if (config.rr < 4) {
    v.push({
      rule: "rr_too_low",
      message: `RR ${config.rr} breaths/min is below 4 — not clinically meaningful.`,
      severity: "error",
      clinicalRationale: "Respiratory rates below 4 breaths/min are non-physiological for adult ventilation scenarios.",
    });
  }
  if (config.rr > 40) {
    v.push({
      rule: "rr_too_high",
      message: `RR ${config.rr} breaths/min exceeds 40 — auto-PEEP risk, waveform will be distorted.`,
      severity: "warning",
      clinicalRationale:
        "Rates above 35–40 provide insufficient expiratory time (especially with increased resistance/compliance), " +
        "causing guaranteed auto-PEEP and waveform distortion.",
    });
  }
  return v;
}

function validateInspiratoryTimeFeasibility(config: VentWaveformConfig): VentMorphologyViolation[] {
  const v: VentMorphologyViolation[] = [];
  const cycleDuration = 60 / config.rr;
  if (config.ti >= cycleDuration) {
    v.push({
      rule: "ti_exceeds_cycle",
      message: `Ti (${config.ti}s) ≥ cycle duration (${cycleDuration.toFixed(2)}s) — no expiratory time.`,
      severity: "error",
      clinicalRationale:
        "Inspiratory time must be shorter than the breath cycle. No expiratory time means no passive exhalation — " +
        "a configuration that would immediately cause severe air trapping and is impossible in clinical practice.",
    });
  }
  const ie = config.ti / (cycleDuration - config.ti);
  if (ie > 2.5 && config.mode !== "aprv") {
    v.push({
      rule: "inverse_ratio_warning",
      message: `I:E ratio is ${ie.toFixed(1)}:1 (inverse ratio). Requires specific clinical indication.`,
      severity: "warning",
      clinicalRationale:
        "Inverse ratio ventilation (I:E > 1:1) increases mean airway pressure but is rarely used outside " +
        "specialized ARDS protocols. Must be explicitly intended — not an accidental configuration.",
    });
  }
  return v;
}

function validateComplianceRange(config: VentWaveformConfig): VentMorphologyViolation[] {
  const v: VentMorphologyViolation[] = [];
  if (config.compliance < 5) {
    v.push({
      rule: "compliance_too_low",
      message: `Compliance ${config.compliance} mL/cmH₂O below 5 — not physiologically possible in living tissue.`,
      severity: "error",
      clinicalRationale:
        "Clinically measured static compliance is never below ~10 mL/cmH₂O even in severe ARDS. " +
        "Values below 5 represent a calculation error or impossible configuration.",
    });
  }
  if (config.compliance > 200) {
    v.push({
      rule: "compliance_too_high",
      message: `Compliance ${config.compliance} mL/cmH₂O exceeds 200 — unrealistically high.`,
      severity: "warning",
      clinicalRationale:
        "Normal adult compliance is ~60 mL/cmH₂O. Values above 150–200 are not clinically encountered " +
        "and will produce unrealistic waveforms.",
    });
  }
  return v;
}

function validateResistanceRange(config: VentWaveformConfig): VentMorphologyViolation[] {
  const v: VentMorphologyViolation[] = [];
  if (config.resistance < 1) {
    v.push({
      rule: "resistance_too_low",
      message: `Resistance ${config.resistance} cmH₂O/L/s is below 1 — the ETT alone adds ~4–5 cmH₂O/L/s.`,
      severity: "warning",
      clinicalRationale:
        "The ETT contributes 4–6 cmH₂O/L/s of resistance. A value below 1 is unrealistic for any " +
        "intubated patient and will produce pressure waveforms that underrepresent resistive loading.",
    });
  }
  if (config.resistance > 40) {
    v.push({
      rule: "resistance_too_high",
      message: `Resistance ${config.resistance} cmH₂O/L/s exceeds 40 — extreme, consider if teaching severe bronchospasm.`,
      severity: "warning",
      clinicalRationale:
        "Resistance above 30–40 cmH₂O/L/s represents near-complete airway obstruction. " +
        "Appropriate only for demonstrating severe bronchospasm or tube obstruction.",
    });
  }
  return v;
}

function validateAutoPeepConsistency(config: VentWaveformConfig): VentMorphologyViolation[] {
  const v: VentMorphologyViolation[] = [];
  const autoPeep = config.autoPeep ?? 0;
  if (autoPeep > 0) {
    const cycleDuration = 60 / config.rr;
    const te = cycleDuration - config.ti;
    const tau = config.resistance * (config.compliance / 1000);
    const theoreticalResidue = Math.exp(-te / tau);
    if (theoreticalResidue < 0.05 && autoPeep > 2) {
      v.push({
        rule: "auto_peep_physics_inconsistency",
        message: `autoPeep ${autoPeep} cmH₂O set but time constant (${tau.toFixed(2)}s) and Te (${te.toFixed(2)}s) suggest complete emptying.`,
        severity: "warning",
        clinicalRationale:
          "Auto-PEEP requires that Te < 3τ for incomplete emptying. With the current resistance and compliance, " +
          "the lungs would empty completely, making the stated auto-PEEP value inconsistent. " +
          "To represent auto-PEEP, increase resistance, decrease compliance, shorten Te, or increase RR.",
      });
    }
    if (autoPeep > config.peep) {
      v.push({
        rule: "auto_peep_exceeds_set_peep",
        message: `auto-PEEP (${autoPeep}) exceeds set PEEP (${config.peep}) — unusual but possible in severe obstruction.`,
        severity: "warning",
        clinicalRationale:
          "When auto-PEEP exceeds set PEEP, the effective PEEP is the auto-PEEP level. " +
          "This is clinically possible in severe asthma/COPD and should be labeled clearly in teaching content.",
      });
    }
  }
  return v;
}

function validateModeSpecificRequirements(config: VentWaveformConfig): VentMorphologyViolation[] {
  const v: VentMorphologyViolation[] = [];

  if ((config.mode === "pressure_control" || config.mode === "prvc") && config.pip == null) {
    v.push({
      rule: "pc_requires_pip",
      message: `Mode '${config.mode}' requires pip to be set.`,
      severity: "error",
      clinicalRationale: "Pressure-targeted modes must have a set PIP (peak inspiratory pressure) value.",
    });
  }

  if ((config.mode === "pressure_support" || config.mode === "bipap") && config.pressureSupport == null) {
    v.push({
      rule: "ps_requires_pressure_support",
      message: `Mode '${config.mode}' requires pressureSupport to be set.`,
      severity: "error",
      clinicalRationale: "Pressure support and BiPAP modes require a pressure support level above PEEP.",
    });
  }

  if (config.mode === "volume_control" && config.tidalVolume == null) {
    v.push({
      rule: "vc_requires_tidal_volume",
      message: "Volume control mode requires tidalVolume to be set.",
      severity: "error",
      clinicalRationale: "Volume-targeted modes must specify a tidal volume — it is the controlled variable.",
    });
  }

  if (config.mode === "aprv") {
    if (config.ti < 2.0) {
      v.push({
        rule: "aprv_t_high_too_short",
        message: `APRV T_High (ti) ${config.ti}s is shorter than 2s — insufficient for alveolar recruitment.`,
        severity: "warning",
        clinicalRationale:
          "APRV T_High should be 4–6 seconds to maintain mean airway pressure and promote recruitment. " +
          "Values below 2s do not achieve the therapeutic goal of APRV.",
      });
    }
    if (60 / config.rr - config.ti > 1.5) {
      v.push({
        rule: "aprv_t_low_too_long",
        message: `APRV T_Low (${(60 / config.rr - config.ti).toFixed(2)}s) exceeds 1.5s — de-recruitment risk.`,
        severity: "warning",
        clinicalRationale:
          "APRV T_Low should be short (0.4–0.8s), terminated when expiratory flow reaches 75% of peak. " +
          "Long T_Low allows de-recruitment and defeats the purpose of APRV.",
      });
    }
  }

  return v;
}

function validateAsynchronyModeCompatibility(config: VentWaveformConfig): VentMorphologyViolation[] {
  const v: VentMorphologyViolation[] = [];
  const asynchrony = config.asynchrony ?? "none";

  if (asynchrony === "flow_starvation" && config.mode !== "volume_control" && config.mode !== "simv") {
    v.push({
      rule: "flow_starvation_requires_vc",
      message: "Flow starvation only occurs in volume-control modes — not applicable in pressure-targeted modes.",
      severity: "error",
      clinicalRationale:
        "Flow starvation is a VC-specific asynchrony caused by a fixed flow rate that is insufficient " +
        "for patient demand. Pressure-targeted modes auto-adjust flow, eliminating the mechanism.",
    });
  }

  if (asynchrony === "delayed_cycling" && config.mode !== "pressure_support" && config.mode !== "bipap") {
    v.push({
      rule: "delayed_cycling_ps_only",
      message: "Delayed cycling is a PS/BiPAP-specific asynchrony — occurs when flow-cycling criterion is too low.",
      severity: "warning",
      clinicalRationale:
        "Delayed cycling is caused by the PS flow-cycling mechanism. It does not apply to time-cycled " +
        "modes (VC, PC) in the same way. Label content appropriately.",
    });
  }

  return v;
}

// ─── Aggregator ────────────────────────────────────────────────────────────────

export function validateVentWaveformMorphology(config: VentWaveformConfig): VentMorphologyValidationResult {
  const violations: VentMorphologyViolation[] = [
    ...validatePeepRange(config),
    ...validatePipExceedsPeep(config),
    ...validatePlateuSafetyLimit(config),
    ...validateTidalVolumeRange(config),
    ...validateRespiratoryRate(config),
    ...validateInspiratoryTimeFeasibility(config),
    ...validateComplianceRange(config),
    ...validateResistanceRange(config),
    ...validateAutoPeepConsistency(config),
    ...validateModeSpecificRequirements(config),
    ...validateAsynchronyModeCompatibility(config),
  ];

  const errors = violations.filter((v) => v.severity === "error");
  const warnings = violations.filter((v) => v.severity === "warning");

  return {
    ok: errors.length === 0,
    mode: config.mode,
    violations,
    errors,
    warnings,
  };
}

/**
 * Gate for publishable learner-facing content.
 * Returns true only if there are zero errors (warnings are acceptable).
 */
export function isPublishableVentConfig(config: VentWaveformConfig): boolean {
  const result = validateVentWaveformMorphology(config);
  return result.ok;
}

/**
 * Validates all registered templates against the morphology validator.
 * Returns a summary of any invalid templates for CI enforcement.
 */
export function auditVentTemplateRegistry(): {
  total: number;
  passing: number;
  failing: number;
  results: Array<{ key: string; ok: boolean; errors: string[] }>;
} {
  const results = VENT_TEMPLATE_REGISTRY.map((template) => {
    const validation = validateVentWaveformMorphology(template.config);
    return {
      key: template.key,
      ok: validation.ok,
      errors: validation.errors.map((e) => e.message),
    };
  });

  return {
    total: results.length,
    passing: results.filter((r) => r.ok).length,
    failing: results.filter((r) => !r.ok).length,
    results,
  };
}
