/**
 * ECG Visual Morphology Review — Strip Generator
 * Phase 1 of the P0 clinical accuracy audit visual sign-off.
 *
 * Generates SVG review strips for every rhythm in the library.
 * Each strip includes: ECG paper grid, waveform path, rhythm label, clinical metadata.
 *
 * Usage (from nursenest-core/):
 *   npx tsx scripts/generate-ecg-visual-review.mts
 *
 * Output: /tmp/ecg-review/<rhythmKey>.svg  (and .png after cairosvg conversion)
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { execSync } from "node:child_process";
import {
  generateEcgWaveform,
  defaultEcgStripConfigForRhythm,
} from "@/lib/ecg-module/ecg-waveform-generator";

const OUT_DIR = "/tmp/ecg-review";
mkdirSync(OUT_DIR, { recursive: true });

// Strip canvas — 720×220 is the production default; display at 1.25× via SVG width attr.
const W = 720;
const H = 220;
const LABEL_H = 32;
const DISPLAY_W = 900;
const DISPLAY_H = Math.round(H * (DISPLAY_W / W)) + LABEL_H;

const GRID_MINOR = "#f7b4b4";
const GRID_MAJOR = "#ee7777";
const WAVE_COLOR = "#111827";
const BG_COLOR = "white";
const LABEL_BG = "#f3f4f6";
const LABEL_COLOR = "#1f2937";
const META_COLOR = "#6b7280";

function formatRate(r: number): string {
  return r === 0 ? "—" : `${r} BPM`;
}

function buildSvg(rhythmKey: string, title: string, seconds = 8): string {
  const config = defaultEcgStripConfigForRhythm(rhythmKey);
  const wf = generateEcgWaveform(config, { width: W, height: H, seconds });
  const minor = wf.grid.minor; // 8
  const major = wf.grid.major; // 40

  const meta = [
    `Rate: ${formatRate(config.rate)}`,
    config.regularity.replace(/_/g, " "),
    `QRS: ${Math.round(config.qrsWidth * 1000)} ms`,
    `P: ${config.pWavePattern.replace(/_/g, " ")}`,
    `PR: ${config.prIntervalPattern.replace(/_/g, " ")}`,
    `${seconds}s strip`,
  ].join("  |  ");

  // Scale factor for rendering inside the fixed viewBox
  const sf = W / DISPLAY_W; // ≈ 0.80

  return `<svg xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 ${W} ${H + LABEL_H}"
  width="${DISPLAY_W}" height="${DISPLAY_H}"
  style="background:${BG_COLOR}">

  <defs>
    <pattern id="p-minor" width="${minor}" height="${minor}" patternUnits="userSpaceOnUse">
      <path d="M${minor} 0L0 0 0 ${minor}" fill="none" stroke="${GRID_MINOR}" stroke-width="0.55"/>
    </pattern>
    <pattern id="p-major" width="${major}" height="${major}" patternUnits="userSpaceOnUse">
      <rect width="${major}" height="${major}" fill="url(#p-minor)"/>
      <path d="M${major} 0L0 0 0 ${major}" fill="none" stroke="${GRID_MAJOR}" stroke-width="1"/>
    </pattern>
  </defs>

  <!-- ECG paper background -->
  <rect width="${W}" height="${H}" fill="url(#p-major)"/>

  <!-- Waveform -->
  <path d="${wf.path}"
    fill="none" stroke="${WAVE_COLOR}"
    stroke-linecap="round" stroke-linejoin="round"
    stroke-width="2.2"/>

  <!-- Label strip -->
  <rect y="${H}" width="${W}" height="${LABEL_H}" fill="${LABEL_BG}"/>
  <line x1="0" y1="${H}" x2="${W}" y2="${H}" stroke="#d1d5db" stroke-width="0.5"/>

  <text x="6" y="${H + 20}"
    font-size="${Math.round(12 * sf)}" font-family="'Courier New',monospace"
    font-weight="700" fill="${LABEL_COLOR}">${title}</text>

  <text x="${W - 6}" y="${H + 20}"
    font-size="${Math.round(10 * sf)}" font-family="'Courier New',monospace"
    text-anchor="end" fill="${META_COLOR}">${meta}</text>

</svg>`;
}

// ── Rhythm list ───────────────────────────────────────────────────────────────
// [rhythmKey, display title, strip seconds]
const REVIEW_RHYTHMS: [string, string, number][] = [
  // Standard 8s
  ["normal_sinus_rhythm",            "Normal Sinus Rhythm",                            8],
  ["sinus_bradycardia",              "Sinus Bradycardia",                               10],
  ["sinus_tachycardia",              "Sinus Tachycardia",                               6],
  ["respiratory_sinus_arrhythmia",   "Sinus Arrhythmia (RSA)",                          10],
  ["pacs",                           "PAC — Premature Atrial Contractions",              8],
  ["pvcs",                           "PVC — Premature Ventricular Contractions",         8],
  ["atrial_fibrillation",            "Atrial Fibrillation",                             8],
  ["atrial_flutter",                 "Atrial Flutter",                                  8],
  ["svt",                            "SVT — Supraventricular Tachycardia",               6],
  ["junctional_rhythm",              "Junctional Rhythm",                               10],
  ["accelerated_junctional_rhythm",  "Accelerated Junctional Rhythm",                   8],
  ["first_degree_av_block",          "1st Degree AV Block",                             8],
  ["second_degree_type_i_av_block",  "Wenckebach — 2nd Degree AV Block (Mobitz I)",     10],
  ["second_degree_type_ii_av_block", "Mobitz II — 2nd Degree AV Block (Mobitz II)",     10],
  ["third_degree_av_block",          "3rd Degree (Complete) AV Block",                  10],
  ["right_bundle_branch_block",      "Right Bundle Branch Block (RBBB)",                8],
  ["left_bundle_branch_block",       "Left Bundle Branch Block (LBBB)",                 8],
  ["idioventricular_rhythm",         "Idioventricular Rhythm (AIVR)",                   8],
  ["ventricular_escape_rhythm",      "Ventricular Escape Rhythm",                       12],
  ["ventricular_tachycardia",        "Ventricular Tachycardia",                         6],
  ["ventricular_fibrillation",       "Ventricular Fibrillation",                        6],
  ["pea",                            "PEA — Pulseless Electrical Activity",              8],
  ["asystole",                       "Asystole",                                        8],
  ["stemi_pattern",                  "STEMI Pattern",                                   8],
  ["nstemi_pattern",                 "NSTEMI Pattern",                                  8],
  ["hyperkalemia_pattern",           "Hyperkalemia ECG Pattern",                        8],
  ["hypokalemia_pattern",            "Hypokalemia ECG Pattern",                         8],
  ["paced_rhythm",                   "Pacemaker Rhythm",                                8],
  ["torsades_de_pointes",            "Torsades de Pointes",                             6],
  ["bundle_branch_block",            "Bundle Branch Block (generic)",                   8],
];

// ── Generate SVGs ─────────────────────────────────────────────────────────────
const generated: string[] = [];

for (const [key, title, secs] of REVIEW_RHYTHMS) {
  try {
    const svg = buildSvg(key, title, secs);
    const svgPath = `${OUT_DIR}/${key}.svg`;
    writeFileSync(svgPath, svg, "utf-8");
    generated.push(key);
    process.stdout.write(`  ✓ ${key}\n`);
  } catch (err) {
    process.stderr.write(`  ✗ ${key}: ${String(err)}\n`);
  }
}

// ── Convert SVGs → PNGs via cairosvg ─────────────────────────────────────────
process.stdout.write(`\nConverting ${generated.length} SVGs to PNG...\n`);

for (const key of generated) {
  const svgPath = `${OUT_DIR}/${key}.svg`;
  const pngPath = `${OUT_DIR}/${key}.png`;
  try {
    execSync(`python3 -c "import cairosvg; cairosvg.svg2png(url='${svgPath}', write_to='${pngPath}', scale=1.0)"`, { stdio: "pipe" });
    process.stdout.write(`  ✓ ${key}.png\n`);
  } catch (err) {
    process.stderr.write(`  ✗ ${key} PNG conversion failed\n`);
  }
}

process.stdout.write(`\nDone. Review strips at: ${OUT_DIR}/\n`);
