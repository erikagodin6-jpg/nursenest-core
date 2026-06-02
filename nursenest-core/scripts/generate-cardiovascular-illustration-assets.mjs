#!/usr/bin/env node
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "public", "clinical-illustrations", "cardiovascular");

const illustrations = [
  ["heart-failure", "Heart Failure", "pulmonary congestion", "reduced forward flow", "#0f766e", "#2563eb", "LV"],
  ["acute-coronary-syndrome", "Acute Coronary Syndrome", "unstable plaque", "ischemic pain pathway", "#b91c1c", "#f97316", "ACS"],
  ["myocardial-infarction", "Myocardial Infarction", "occluded artery", "troponin release", "#dc2626", "#7c2d12", "MI"],
  ["coronary-artery-disease", "Coronary Artery Disease", "plaque narrowing", "supply-demand mismatch", "#d97706", "#b45309", "CAD"],
  ["hypertension", "Hypertension", "high afterload", "end-organ strain", "#1d4ed8", "#0891b2", "BP"],
  ["atrial-fibrillation", "Atrial Fibrillation", "irregular atrial impulses", "stroke risk", "#7c3aed", "#2563eb", "AF"],
  ["cardiac-output-hemodynamics", "Cardiac Output", "preload · afterload", "contractility · heart rate", "#0f766e", "#3730a3", "CO"],
  ["shock-states", "Shock States", "low perfusion", "compensation failing", "#e11d48", "#d97706", "MAP"],
  ["valve-disorders", "Valve Disorders", "stenosis / regurgitation", "pressure-volume overload", "#0891b2", "#3730a3", "AV"],
  ["ecg-interpretation-basics", "ECG Basics", "P-QRS-T sequence", "rhythm recognition", "#2563eb", "#0f766e", "ECG"],
  ["cardiac-conduction-system", "Conduction System", "SA node to Purkinje", "rate and rhythm control", "#7c3aed", "#0891b2", "SA"],
  ["heart-anatomy-blood-flow", "Heart Blood Flow", "right heart to lungs", "left heart to body", "#0f766e", "#2563eb", "O2"],
  ["raas-activation", "RAAS Activation", "renin · angiotensin II", "aldosterone volume retention", "#d97706", "#059669", "RAAS"],
  ["cardiac-medication-mechanisms", "Cardiac Medications", "rate · preload · afterload", "ischemia and rhythm safety", "#db2777", "#2563eb", "Rx"],
  ["perfusion-disorders", "Perfusion Disorders", "oxygen delivery gap", "cool skin · low urine", "#475569", "#e11d48", "DO2"],
];

function safeId(raw) {
  return raw.replace(/[^a-z0-9-]/gi, "-").toLowerCase();
}

function svg([id, title, labelA, labelB, accentA, accentB, monogram]) {
  const gid = safeId(id);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720" role="img" aria-labelledby="${gid}-title ${gid}-desc">
  <title id="${gid}-title">${title} cardiovascular clinical illustration</title>
  <desc id="${gid}-desc">Premium educational cardiovascular diagram showing ${labelA} and ${labelB}.</desc>
  <defs>
    <linearGradient id="${gid}-bg" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#f8fafc"/>
      <stop offset="0.48" stop-color="#eef9fb"/>
      <stop offset="1" stop-color="#fff7ed"/>
    </linearGradient>
    <linearGradient id="${gid}-heart" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#fda4af"/>
      <stop offset="0.52" stop-color="#fb7185"/>
      <stop offset="1" stop-color="#be123c"/>
    </linearGradient>
    <linearGradient id="${gid}-accent" x1="0" x2="1">
      <stop offset="0" stop-color="${accentA}"/>
      <stop offset="1" stop-color="${accentB}"/>
    </linearGradient>
    <filter id="${gid}-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="18" stdDeviation="20" flood-color="#0f172a" flood-opacity="0.16"/>
    </filter>
  </defs>
  <rect width="1280" height="720" rx="56" fill="url(#${gid}-bg)"/>
  <circle cx="1060" cy="126" r="192" fill="${accentA}" opacity="0.08"/>
  <circle cx="206" cy="596" r="228" fill="${accentB}" opacity="0.08"/>
  <g filter="url(#${gid}-shadow)">
    <rect x="92" y="82" width="1096" height="556" rx="44" fill="#ffffff" opacity="0.88"/>
    <rect x="116" y="106" width="1048" height="508" rx="34" fill="none" stroke="${accentA}" stroke-opacity="0.18" stroke-width="2"/>
  </g>
  <g transform="translate(430 156)">
    <path d="M201 407C81 308 33 248 33 161C33 91 82 43 144 43C181 43 211 60 231 88C251 60 282 43 319 43C381 43 430 91 430 161C430 248 381 308 261 407L231 432L201 407Z" fill="url(#${gid}-heart)" stroke="#8f1236" stroke-opacity="0.18" stroke-width="8"/>
    <path d="M230 87C204 130 201 181 223 236C247 296 233 348 202 407" fill="none" stroke="#fff1f2" stroke-width="14" stroke-linecap="round" opacity="0.92"/>
    <path d="M267 82C303 132 303 189 275 249C251 302 259 354 292 388" fill="none" stroke="#7f1d1d" stroke-width="10" stroke-linecap="round" opacity="0.32"/>
    <path d="M145 49C130 14 152 -14 184 7C212 26 221 59 223 98" fill="none" stroke="${accentA}" stroke-width="16" stroke-linecap="round"/>
    <path d="M318 49C333 14 311 -14 279 7C251 26 242 59 240 98" fill="none" stroke="${accentB}" stroke-width="16" stroke-linecap="round"/>
    <circle cx="231" cy="238" r="60" fill="#ffffff" opacity="0.18"/>
    <text x="231" y="258" text-anchor="middle" font-family="DM Sans, Arial, sans-serif" font-size="58" font-weight="800" fill="#ffffff">${monogram}</text>
  </g>
  <g font-family="DM Sans, Arial, sans-serif">
    <text x="156" y="172" font-size="46" font-weight="800" fill="#0f172a">${title}</text>
    <text x="157" y="215" font-size="22" font-weight="650" fill="#475569">Cardiovascular clinical visual</text>
    <g transform="translate(154 266)">
      <rect width="318" height="88" rx="24" fill="${accentA}" opacity="0.11" stroke="${accentA}" stroke-opacity="0.28"/>
      <circle cx="44" cy="44" r="16" fill="${accentA}"/>
      <text x="76" y="39" font-size="20" font-weight="800" fill="#0f172a">${labelA}</text>
      <text x="76" y="64" font-size="15" font-weight="600" fill="#64748b">assessment cue</text>
    </g>
    <g transform="translate(154 374)">
      <rect width="318" height="88" rx="24" fill="${accentB}" opacity="0.11" stroke="${accentB}" stroke-opacity="0.28"/>
      <circle cx="44" cy="44" r="16" fill="${accentB}"/>
      <text x="76" y="39" font-size="20" font-weight="800" fill="#0f172a">${labelB}</text>
      <text x="76" y="64" font-size="15" font-weight="600" fill="#64748b">clinical reasoning link</text>
    </g>
    <g transform="translate(840 468)">
      <rect width="256" height="74" rx="22" fill="url(#${gid}-accent)" opacity="0.95"/>
      <text x="128" y="46" text-anchor="middle" font-size="20" font-weight="800" fill="#ffffff">Exam-ready mechanism</text>
    </g>
  </g>
  <path d="M472 316C373 300 314 308 237 321" fill="none" stroke="${accentA}" stroke-width="9" stroke-linecap="round" stroke-dasharray="2 18" opacity="0.64"/>
  <path d="M789 383C892 393 944 425 968 468" fill="none" stroke="${accentB}" stroke-width="9" stroke-linecap="round" stroke-dasharray="2 18" opacity="0.64"/>
</svg>
`;
}

await mkdir(outDir, { recursive: true });
await Promise.all(
  illustrations.map((item) => writeFile(path.join(outDir, `${item[0]}.svg`), svg(item), "utf8")),
);
console.log(`[cardio-illustrations] wrote ${illustrations.length} SVG assets to ${outDir}`);
