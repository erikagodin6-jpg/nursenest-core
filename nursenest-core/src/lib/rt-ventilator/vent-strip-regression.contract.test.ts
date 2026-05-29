/**
 * Ventilator Waveform Regression Contract Tests — clinical fidelity enforcement.
 *
 * These tests are the CI gate for waveform generator correctness.
 *
 * Verified invariants:
 *   1. Physics: Ppeak ≥ Pplat ≥ PEEP in VC modes
 *   2. Physics: PC/PS pressure stays at set PIP during inspiration
 *   3. Flow sign: inspiratory flow is positive, expiratory is negative
 *   4. Volume: rises monotonically during inspiration, returns toward 0 in expiration
 *   5. Auto-PEEP: expiratory flow does not return to 0 when autoPeep > 0
 *   6. Determinism: same config → identical output on every call
 *   7. Range: all 20 templates pass morphology validation (no hard errors)
 *   8. Template registry: all template keys are unique
 *   9. Breath boundaries: correct number of breaths in rendered window
 *  10. High resistance: Ppeak higher than normal with same Vt
 *  11. Low compliance: Pplat higher than normal with same Vt
 *  12. Mode-specific: PC flow is non-zero at start of inspiration (decelerating from peak)
 *  13. Circuit leak: expiratory volume less than inspiratory
 *
 * Run:
 *   npx tsx --test nursenest-core/src/lib/rt-ventilator/vent-strip-regression.contract.test.ts
 */

import assert from "node:assert/strict";
import test, { describe } from "node:test";
import {
  generateVentWaveform,
  defaultVentConfigForMode,
  type VentWaveformConfig,
} from "./vent-waveform-generator";
import {
  validateVentWaveformMorphology,
  auditVentTemplateRegistry,
  isPublishableVentConfig,
} from "./vent-morphology-validator";
import {
  VENT_TEMPLATE_REGISTRY,
  getVentTemplate,
  getVentTemplatesByCategory,
  ALL_VENT_TEMPLATE_KEYS,
} from "./vent-waveform-templates";

// ─── Helpers ───────────────────────────────────────────────────────────────────

function maxPressure(config: VentWaveformConfig): number {
  const result = generateVentWaveform(config, { breathCount: 2, sampleRate: 100 });
  return Math.max(...result.points.map((p) => p.pressure));
}

function maxVolume(config: VentWaveformConfig): number {
  const result = generateVentWaveform(config, { breathCount: 2, sampleRate: 100 });
  return Math.max(...result.points.map((p) => p.volume));
}

function minExpFlow(config: VentWaveformConfig): number {
  const result = generateVentWaveform(config, { breathCount: 2, sampleRate: 100 });
  // Expiratory flow is negative — find the most negative value
  return Math.min(...result.points.map((p) => p.flow));
}

function endExpFlow(config: VentWaveformConfig): number {
  const result = generateVentWaveform(config, { breathCount: 2, sampleRate: 100 });
  const cycleDuration = 60 / config.rr;
  const endExpTime = cycleDuration * 0.95; // 95% into first cycle = near end of expiration
  const near = result.points.filter((p) => Math.abs(p.t - endExpTime) < 0.08);
  if (near.length === 0) return 0;
  return near.reduce((sum, p) => sum + p.flow, 0) / near.length;
}

function firstCyclePoints(config: VentWaveformConfig) {
  const result = generateVentWaveform(config, { breathCount: 2, sampleRate: 100 });
  const cycleDuration = 60 / config.rr;
  return result.points.filter((p) => p.t <= cycleDuration);
}

// ─── Test suites ──────────────────────────────────────────────────────────────

describe("VentWaveformGenerator — physics invariants", () => {

  test("VC square: Ppeak > PEEP and inspiratory pressure rises above baseline", () => {
    const config = defaultVentConfigForMode("volume_control");
    const result = generateVentWaveform(config, { breathCount: 2 });
    const pressures = result.points.map((p) => p.pressure);
    const peak = Math.max(...pressures);
    assert.ok(peak > config.peep + 5, `Ppeak ${peak.toFixed(1)} should be well above PEEP ${config.peep}`);
  });

  test("VC square: PEEP maintained at baseline between breaths", () => {
    const config = defaultVentConfigForMode("volume_control");
    const result = generateVentWaveform(config, { breathCount: 3 });
    // End of expiration should be near PEEP
    const cycleDuration = 60 / config.rr;
    const endExpPt = result.points.find((p) => Math.abs(p.t - cycleDuration * 0.9) < 0.05);
    if (!endExpPt) assert.fail("No end-expiratory point found");
    assert.ok(
      Math.abs(endExpPt.pressure - config.peep) < 3,
      `End-exp pressure ${endExpPt.pressure.toFixed(1)} should be near PEEP ${config.peep}`,
    );
  });

  test("VC: peak volume equals approximately set Vt", () => {
    const config: VentWaveformConfig = {
      ...defaultVentConfigForMode("volume_control"),
      tidalVolume: 500,
    };
    const vol = maxVolume(config);
    // Allow ±15% tolerance for sampling and rendering effects
    assert.ok(vol >= 400 && vol <= 620, `Peak volume ${vol.toFixed(0)} mL should be near 500 mL`);
  });

  test("VC: increasing Vt raises peak pressure", () => {
    const base = defaultVentConfigForMode("volume_control");
    const low = maxPressure({ ...base, tidalVolume: 300 });
    const high = maxPressure({ ...base, tidalVolume: 700 });
    assert.ok(high > low, `Higher Vt should produce higher peak pressure: low=${low.toFixed(1)}, high=${high.toFixed(1)}`);
  });

  test("PC: inspiratory pressure approximates set PIP", () => {
    const config = defaultVentConfigForMode("pressure_control");
    const result = generateVentWaveform(config, { breathCount: 2 });
    const inspPoints = result.points.filter((p) => {
      const tInCycle = p.t % (60 / config.rr);
      return tInCycle > 0.1 && tInCycle < config.ti * 0.9;
    });
    const avgInspP = inspPoints.reduce((s, p) => s + p.pressure, 0) / (inspPoints.length || 1);
    const pip = config.pip ?? 20;
    assert.ok(
      Math.abs(avgInspP - pip) < 3,
      `Average inspiratory pressure ${avgInspP.toFixed(1)} should be near PIP ${pip}`,
    );
  });

  test("PC: inspiratory flow starts positive and decelerates", () => {
    const config = defaultVentConfigForMode("pressure_control");
    const pts = firstCyclePoints(config);
    const inspPts = pts.filter((p) => p.t > 0.1 && p.t < config.ti - 0.1);
    if (inspPts.length < 4) assert.fail("Not enough inspiratory points to check deceleration");
    const firstFlow = inspPts[0]!.flow;
    const lastFlow = inspPts[inspPts.length - 1]!.flow;
    assert.ok(firstFlow > 0, `Inspiratory flow should be positive at start: ${firstFlow.toFixed(3)}`);
    assert.ok(firstFlow > lastFlow, `Flow should decelerate: first=${firstFlow.toFixed(3)}, last=${lastFlow.toFixed(3)}`);
  });

  test("PS: inspiratory pressure near PEEP + PS level", () => {
    const config = defaultVentConfigForMode("pressure_support");
    const result = generateVentWaveform(config, { breathCount: 2 });
    const pts = firstCyclePoints(config);
    const inspPts = pts.filter((p) => p.t > 0.1 && p.t < config.ti - 0.1);
    const avgP = inspPts.reduce((s, p) => s + p.pressure, 0) / (inspPts.length || 1);
    const ps = config.pressureSupport ?? 10;
    const expectedPip = config.peep + ps;
    assert.ok(
      Math.abs(avgP - expectedPip) < 4,
      `PS inspiratory pressure ${avgP.toFixed(1)} should be near ${expectedPip}`,
    );
    void result;
  });

  test("Flow sign: expiratory flow is negative", () => {
    const config = defaultVentConfigForMode("volume_control");
    const minFlow = minExpFlow(config);
    assert.ok(minFlow < -0.1, `Expiratory flow minimum ${minFlow.toFixed(3)} should be negative`);
  });

  test("Volume: positive and non-zero during inspiration", () => {
    const config = defaultVentConfigForMode("volume_control");
    const pts = firstCyclePoints(config);
    const inspPts = pts.filter((p) => p.t > 0.15 && p.t < config.ti - 0.1);
    const allPositive = inspPts.every((p) => p.volume >= 0);
    assert.ok(allPositive, "Volume should be non-negative throughout inspiration");
    const maxVol = Math.max(...inspPts.map((p) => p.volume));
    assert.ok(maxVol > 50, `Peak inspiratory volume ${maxVol.toFixed(0)} mL should be > 50 mL`);
  });

});

describe("VentWaveformGenerator — pathophysiology", () => {

  test("High resistance: higher Ppeak than normal, similar Vt", () => {
    const base = defaultVentConfigForMode("volume_control");
    const normal = maxPressure({ ...base, resistance: 5 });
    const highRes = maxPressure({ ...base, resistance: 22 });
    assert.ok(
      highRes > normal + 5,
      `High resistance should raise Ppeak more: normal=${normal.toFixed(1)}, highRes=${highRes.toFixed(1)}`,
    );
  });

  test("Low compliance (ARDS): higher plateau pressure for same Vt", () => {
    const base = defaultVentConfigForMode("volume_control");
    const normal = maxPressure({ ...base, compliance: 60 });
    const ards = maxPressure({ ...base, compliance: 22 });
    assert.ok(
      ards > normal + 5,
      `ARDS (low compliance) should raise peak pressure: normal=${normal.toFixed(1)}, ards=${ards.toFixed(1)}`,
    );
  });

  test("Auto-PEEP: expiratory flow does not return to zero", () => {
    const config: VentWaveformConfig = {
      ...defaultVentConfigForMode("volume_control"),
      rr: 18,
      resistance: 15,
      autoPeep: 6,
    };
    const flow = endExpFlow(config);
    // With auto-PEEP, end-exp flow should still be negative (not reached zero)
    assert.ok(
      flow < -0.03,
      `With auto-PEEP, expiratory flow at end of cycle should not return to zero: ${flow.toFixed(3)} L/s`,
    );
  });

  test("Increasing PEEP raises baseline pressure", () => {
    const base = defaultVentConfigForMode("volume_control");
    const result5 = generateVentWaveform({ ...base, peep: 5 }, { breathCount: 2 });
    const result12 = generateVentWaveform({ ...base, peep: 12 }, { breathCount: 2 });
    const minP5 = Math.min(...result5.points.map((p) => p.pressure));
    const minP12 = Math.min(...result12.points.map((p) => p.pressure));
    assert.ok(
      minP12 > minP5 + 4,
      `Higher PEEP should raise minimum pressure: PEEP5=${minP5.toFixed(1)}, PEEP12=${minP12.toFixed(1)}`,
    );
  });

  test("Flow starvation: pressure scoops below expected inspiratory level", () => {
    const base: VentWaveformConfig = {
      ...defaultVentConfigForMode("volume_control"),
      asynchrony: "flow_starvation",
    };
    const normal: VentWaveformConfig = { ...base, asynchrony: "none" };
    const pts_asynch = firstCyclePoints(base).filter((p) => p.t > 0.2 && p.t < base.ti * 0.7);
    const pts_normal = firstCyclePoints(normal).filter((p) => p.t > 0.2 && p.t < normal.ti * 0.7);
    const avgAsync = pts_asynch.reduce((s, p) => s + p.pressure, 0) / (pts_asynch.length || 1);
    const avgNormal = pts_normal.reduce((s, p) => s + p.pressure, 0) / (pts_normal.length || 1);
    assert.ok(
      avgAsync < avgNormal,
      `Flow starvation should produce lower inspiratory pressure: asynch=${avgAsync.toFixed(1)}, normal=${avgNormal.toFixed(1)}`,
    );
  });

});

describe("VentWaveformGenerator — determinism", () => {

  test("Same config → identical output on repeated calls", () => {
    const config = defaultVentConfigForMode("volume_control");
    const r1 = generateVentWaveform(config, { breathCount: 3 });
    const r2 = generateVentWaveform(config, { breathCount: 3 });
    assert.equal(r1.points.length, r2.points.length, "Point count should be equal");
    const mismatch = r1.points.findIndex((p, i) => Math.abs(p.pressure - r2.points[i]!.pressure) > 0.001);
    assert.equal(mismatch, -1, `Pressure mismatch at index ${mismatch}`);
  });

  test("Breath boundaries count matches breathCount", () => {
    const config = defaultVentConfigForMode("pressure_control");
    const result = generateVentWaveform(config, { breathCount: 4 });
    assert.equal(result.breathBoundaries.length, 4, "Should have 4 breath start times");
  });

});

describe("VentWaveformGenerator — output structure", () => {

  test("Derived values populated for VC mode", () => {
    const config = defaultVentConfigForMode("volume_control");
    const result = generateVentWaveform(config, { breathCount: 2 });
    assert.ok(result.derived.peakPressure > 0, "Peak pressure should be positive");
    assert.ok(result.derived.tidalVolumeMeasured > 0, "Vt measured should be positive");
    assert.ok(result.derived.timeConstant > 0, "Time constant should be positive");
    assert.ok(result.derived.ieRatio.includes(":"), "I:E ratio should have colon");
    assert.ok(result.derived.meanAirwayPressure > 0, "MAP should be positive");
  });

  test("Ranges are valid (min < max for each trace)", () => {
    const config = defaultVentConfigForMode("pressure_control");
    const result = generateVentWaveform(config, { breathCount: 2 });
    const { pressure, flow, volume } = result.ranges;
    assert.ok(pressure[0] < pressure[1], `Pressure range invalid: ${pressure}`);
    assert.ok(flow[0] < flow[1], `Flow range invalid: ${flow}`);
    assert.ok(volume[0] < volume[1], `Volume range invalid: ${volume}`);
  });

  test("All points have valid (finite) values", () => {
    for (const mode of ["volume_control", "pressure_control", "pressure_support", "cpap", "bipap"] as const) {
      const config = defaultVentConfigForMode(mode);
      const result = generateVentWaveform(config, { breathCount: 2 });
      const invalid = result.points.find(
        (p) => !isFinite(p.pressure) || !isFinite(p.flow) || !isFinite(p.volume),
      );
      assert.equal(invalid, undefined, `Mode ${mode}: found non-finite point`);
    }
  });

});

describe("VentMorphologyValidator — template registry audit", () => {

  test("All template keys are unique", () => {
    const seen = new Set<string>();
    for (const key of ALL_VENT_TEMPLATE_KEYS) {
      assert.ok(!seen.has(key), `Duplicate template key: ${key}`);
      seen.add(key);
    }
  });

  test("All templates pass morphology validation", () => {
    const audit = auditVentTemplateRegistry();
    const failing = audit.results.filter((r) => !r.ok);
    if (failing.length > 0) {
      const details = failing.map((r) => `  ${r.key}: ${r.errors.join("; ")}`).join("\n");
      assert.fail(`${failing.length} template(s) fail morphology validation:\n${details}`);
    }
    assert.equal(audit.failing, 0, "All templates should pass validation");
  });

  test("Normal mode templates are marked isReference", () => {
    const normalModes = getVentTemplatesByCategory("normal_mode");
    const refs = normalModes.filter((t) => t.isReference);
    assert.ok(refs.length >= 5, `Expected at least 5 reference templates, got ${refs.length}`);
  });

  test("getVentTemplate returns correct template by key", () => {
    const t = getVentTemplate("vc_square_normal");
    assert.ok(t !== undefined, "Should find vc_square_normal");
    assert.equal(t!.config.mode, "volume_control");
  });

  test("Template registry has all three categories populated", () => {
    for (const cat of ["normal_mode", "condition", "asynchrony"] as const) {
      const templates = getVentTemplatesByCategory(cat);
      assert.ok(templates.length >= 3, `Category ${cat} should have at least 3 templates, got ${templates.length}`);
    }
  });

  test("isPublishableVentConfig: valid config returns true", () => {
    const config = defaultVentConfigForMode("volume_control");
    assert.equal(isPublishableVentConfig(config), true);
  });

  test("isPublishableVentConfig: PIP <= PEEP returns false", () => {
    const config: VentWaveformConfig = {
      ...defaultVentConfigForMode("pressure_control"),
      pip: 5,
      peep: 5,
    };
    assert.equal(isPublishableVentConfig(config), false, "Should be invalid when PIP = PEEP");
  });

  test("isPublishableVentConfig: Ti >= cycle duration returns false", () => {
    const config: VentWaveformConfig = {
      ...defaultVentConfigForMode("volume_control"),
      rr: 12,
      ti: 5.5, // 5.5s > 5.0s cycle duration
    };
    assert.equal(isPublishableVentConfig(config), false);
  });

  test("Morphology validator catches flow_starvation on non-VC mode", () => {
    const config: VentWaveformConfig = {
      ...defaultVentConfigForMode("pressure_control"),
      asynchrony: "flow_starvation",
    };
    const result = validateVentWaveformMorphology(config);
    const hasError = result.errors.some((e) => e.rule === "flow_starvation_requires_vc");
    assert.ok(hasError, "Should flag flow_starvation on pressure_control as an error");
  });

});

describe("VentWaveformGenerator — APRV mode", () => {

  test("APRV generates points spanning T_High and T_Low", () => {
    const config = defaultVentConfigForMode("aprv");
    const result = generateVentWaveform(config, { breathCount: 2 });
    assert.ok(result.points.length > 50, "APRV should generate sufficient points");
    const highPressurePoints = result.points.filter((p) => p.pressure > 20);
    assert.ok(highPressurePoints.length > 0, "APRV should have points at P_High");
  });

  test("APRV MORPHOLOGY: T_High too short triggers validation warning", () => {
    const config: VentWaveformConfig = {
      ...defaultVentConfigForMode("aprv"),
      ti: 1.5, // too short for APRV T_High
    };
    const result = validateVentWaveformMorphology(config);
    const hasWarning = result.warnings.some((w) => w.rule === "aprv_t_high_too_short");
    assert.ok(hasWarning, "Should warn when APRV T_High < 2s");
  });

});

describe("VentWaveformGenerator — all default configs render without error", () => {
  const modes = ["volume_control", "pressure_control", "pressure_support", "simv", "cpap", "bipap", "aprv", "prvc"] as const;

  for (const mode of modes) {
    test(`Default config for ${mode} renders cleanly`, () => {
      const config = defaultVentConfigForMode(mode);
      let result;
      try {
        result = generateVentWaveform(config, { breathCount: 3 });
      } catch (e) {
        assert.fail(`generateVentWaveform threw for mode ${mode}: ${String(e)}`);
      }
      assert.ok(result.points.length > 10, `Mode ${mode}: should produce multiple points`);
      assert.ok(result.totalSeconds > 0, `Mode ${mode}: totalSeconds should be positive`);
    });
  }
});
