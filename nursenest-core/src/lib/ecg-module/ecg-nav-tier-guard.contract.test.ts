/**
 * Contract tests — ECG nav tier gating.
 *
 * Invariants:
 *   1. RPN/LVN_LPN must never see ECG items in the Clinical Modules nav.
 *   2. RN/NP must see all ECG items (ECG Fundamentals, Advanced ECG, ECG Practice Drills,
 *      Pediatric ECG, Telemetry Mastery).
 *   3. The standalone ECG nav item exists only when ecgNavEnabled = true.
 *   4. Non-ECG items (Lab Values, Med Calculations, etc.) are always present regardless of tier.
 *   5. The ECG_SHELL_NAV_ID constant is stable — route contract depends on it.
 */

import test from "node:test";
import assert from "node:assert/strict";
import {
  buildClinicalModulesNavLinks,
  buildClinicalModulesShellNavItem,
  buildEcgShellNavItem,
  ECG_SHELL_NAV_ID,
} from "@/lib/navigation/learner-primary-nav";

const ECG_GROUPS = new Set(["cardiology", "telemetry"]);
const NON_ECG_KEYS = new Set(["lab-values", "abg-interpretation", "med-calculations", "hemodynamics"]);

// ─── RPN restrictions ────────────────────────────────────────────────────────

test("buildClinicalModulesNavLinks(ecgNavEnabled=false): no cardiology or telemetry items", () => {
  const links = buildClinicalModulesNavLinks(null, false);
  const ecgLinks = links.filter((l) => ECG_GROUPS.has(l.group));
  assert.equal(
    ecgLinks.length,
    0,
    `Expected 0 ECG/telemetry links for RPN but got ${ecgLinks.length}: ${ecgLinks.map((l) => l.key).join(", ")}`,
  );
});

test("buildClinicalModulesNavLinks(ecgNavEnabled=false): non-ECG items still present", () => {
  const links = buildClinicalModulesNavLinks(null, false);
  const keys = new Set(links.map((l) => l.key));
  for (const nonEcgKey of NON_ECG_KEYS) {
    assert.ok(keys.has(nonEcgKey), `Expected non-ECG key "${nonEcgKey}" to be present for RPN`);
  }
});

test("buildClinicalModulesShellNavItem(ecgNavEnabled=false): flyout links contain no ECG groups", () => {
  const item = buildClinicalModulesShellNavItem(null, false);
  const ecgLinks = item.links.filter((l) => ECG_GROUPS.has(l.group));
  assert.equal(ecgLinks.length, 0, "Clinical Modules flyout must not expose ECG items to RPN");
});

// ─── RN/NP access ────────────────────────────────────────────────────────────

test("buildClinicalModulesNavLinks(ecgNavEnabled=true): ecg-fundamentals present", () => {
  const links = buildClinicalModulesNavLinks(null, true);
  assert.ok(links.some((l) => l.key === "ecg-fundamentals"), "ecg-fundamentals must be present for RN/NP");
});

test("buildClinicalModulesNavLinks(ecgNavEnabled=true): advanced-ecg present", () => {
  const links = buildClinicalModulesNavLinks(null, true);
  assert.ok(links.some((l) => l.key === "advanced-ecg"), "advanced-ecg must be present for RN/NP");
});

test("buildClinicalModulesNavLinks(ecgNavEnabled=true): ecg-drills present", () => {
  const links = buildClinicalModulesNavLinks(null, true);
  assert.ok(links.some((l) => l.key === "ecg-drills"), "ecg-drills must be present for RN/NP");
});

test("buildClinicalModulesNavLinks(ecgNavEnabled=true): pediatric-ecg present", () => {
  const links = buildClinicalModulesNavLinks(null, true);
  assert.ok(links.some((l) => l.key === "pediatric-ecg"), "pediatric-ecg must be present for RN/NP");
});

test("buildClinicalModulesNavLinks(ecgNavEnabled=true): telemetry-mastery present", () => {
  const links = buildClinicalModulesNavLinks(null, true);
  assert.ok(links.some((l) => l.key === "telemetry-mastery"), "telemetry-mastery must be present for RN/NP");
});

test("buildClinicalModulesNavLinks(ecgNavEnabled=true): non-ECG items also present", () => {
  const links = buildClinicalModulesNavLinks(null, true);
  const keys = new Set(links.map((l) => l.key));
  for (const nonEcgKey of NON_ECG_KEYS) {
    assert.ok(keys.has(nonEcgKey), `Non-ECG key "${nonEcgKey}" missing when ecgNavEnabled=true`);
  }
});

// ─── Default param (backwards compat) ────────────────────────────────────────

test("buildClinicalModulesNavLinks(): default param is ecgNavEnabled=true (backwards compat)", () => {
  const withDefault = buildClinicalModulesNavLinks(null);
  const withExplicit = buildClinicalModulesNavLinks(null, true);
  assert.deepEqual(withDefault, withExplicit, "Default param must behave identically to ecgNavEnabled=true");
});

test("buildClinicalModulesShellNavItem(): default param includes ECG items", () => {
  const item = buildClinicalModulesShellNavItem(null);
  assert.ok(item.links.some((l) => l.key === "ecg-fundamentals"), "Default buildClinicalModulesShellNavItem must include ECG Fundamentals");
});

// ─── Standalone ECG nav item ──────────────────────────────────────────────────

test("buildEcgShellNavItem: id is ECG_SHELL_NAV_ID", () => {
  const item = buildEcgShellNavItem(null);
  assert.equal(item.id, ECG_SHELL_NAV_ID);
});

test("buildEcgShellNavItem: href points to /modules/ecg", () => {
  const item = buildEcgShellNavItem(null);
  assert.equal(item.href, "/modules/ecg");
});

test("buildEcgShellNavItem: matchPrefix is /modules/ecg", () => {
  const item = buildEcgShellNavItem(null);
  assert.equal(item.matchPrefix, "/modules/ecg");
});

test("buildEcgShellNavItem: pathwayId is appended as query param", () => {
  const item = buildEcgShellNavItem("us-rn-nclex-rn");
  assert.equal(item.href, "/modules/ecg?pathwayId=us-rn-nclex-rn");
});

test("ECG_SHELL_NAV_ID constant is stable", () => {
  assert.equal(ECG_SHELL_NAV_ID, "ecg", "ECG_SHELL_NAV_ID must equal 'ecg' — route contracts depend on this");
});

// ─── Pediatric ECG nav link ───────────────────────────────────────────────────

test("buildClinicalModulesNavLinks(ecgNavEnabled=true): pediatric-ecg href points to /modules/ecg/pediatric", () => {
  const links = buildClinicalModulesNavLinks(null, true);
  const ped = links.find((l) => l.key === "pediatric-ecg");
  assert.ok(ped, "pediatric-ecg link must exist");
  assert.equal(ped!.href, "/modules/ecg/pediatric");
});

test("buildClinicalModulesNavLinks(ecgNavEnabled=true): pediatric-ecg status is new", () => {
  const links = buildClinicalModulesNavLinks(null, true);
  const ped = links.find((l) => l.key === "pediatric-ecg");
  assert.ok(ped, "pediatric-ecg link must exist");
  assert.equal(ped!.status, "new", "pediatric-ecg must carry 'new' badge");
});

test("buildClinicalModulesNavLinks(ecgNavEnabled=false): pediatric-ecg absent for RPN", () => {
  const links = buildClinicalModulesNavLinks(null, false);
  assert.equal(
    links.find((l) => l.key === "pediatric-ecg"),
    undefined,
    "pediatric-ecg must not appear in nav for RPN",
  );
});
