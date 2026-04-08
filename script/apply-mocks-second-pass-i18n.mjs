/**
 * Second-pass: normalize "mocks" → "practice exams" in JSON values (marketing + locale overlays).
 * Skips nav.mockResults and nav.allied.mockExams entirely.
 */
import { readFileSync, writeFileSync, readdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const SKIP = new Set(["nav.mockResults", "nav.allied.mockExams"]);

/** Longer / more specific patterns first where order matters. */
const REPLACEMENTS = [
  [/CAT-style mocks/g, "CAT-style practice exams"],
  [/Full-length mocks with/g, "Full-length practice exams with"],
  [/Full-length mocks/g, "Full-length practice exams"],
  [/full-length timed mocks/g, "full-length timed practice exams"],
  [/Advanced practice mocks are/g, "Advanced practice exams are"],
  [/new mock attempts/g, "new practice exam attempts"],
  [/No mock attempts yet\./g, "No practice exam attempts yet."],
  [/Saved mocks tied/g, "Saved practice exam attempts tied"],
  [/Timed mocks draw/g, "Timed practice exams draw"],
  [/Reports, mocks, and planners/g, "Reports, practice exams, and planners"],
  [/run a mock when/g, "run a practice exam when"],
  [/Questions, decks, mocks, and lessons/g, "Questions, decks, practice exams, and lessons"],
  [/questions, decks, mocks, lessons/g, "questions, decks, practice exams, lessons"],
  [/rehearse a mock/g, "rehearse a practice exam"],
  [
    /A deep bank of items, decks, lessons, and mocks for/g,
    "A deep bank of items, decks, lessons, and practice exams for",
  ],
  [/scope, rationales, mocks, and whether/g, "scope, rationales, practice exams, and whether"],
  [/Questions, lessons, mocks in one rail/g, "Questions, lessons, practice exams in one rail"],
  [/Sign in to save a mock when/g, "Sign in to save a practice exam when"],
  [/practice tests, and mocks\./g, "practice tests, and practice exams."],
  [/Finish a bank or mock block/g, "Finish a bank or practice exam block"],
  [/RN \/ PN: Mocks and drills/g, "RN / PN: Practice exams and drills"],
  [/full bank, lessons, mocks, and server/g, "full bank, lessons, practice exams, and server"],
  [/question → lesson → mock rhythm/g, "question → lesson → practice exam rhythm"],
  [/Use mock pacing/g, "Use practice exam pacing"],
  [/to full mocks when/g, "to full practice exams when"],
  [/lessons, and mocks—/g, "lessons, and practice exams—"],
  [/and at least one full mock in/g, "and at least one full practice exam in"],
  [
    /^Practice exams and computer-adaptive/g,
    "Practice exams (mock tests) and computer-adaptive",
  ],
];

function transformValue(s) {
  if (typeof s !== "string") return s;
  let o = s;
  for (const [re, rep] of REPLACEMENTS) {
    o = o.replace(re, rep);
  }
  return o;
}

function patchFile(fp) {
  const j = JSON.parse(readFileSync(fp, "utf8"));
  let changed = false;
  for (const [k, v] of Object.entries(j)) {
    if (SKIP.has(k)) continue;
    const n = transformValue(v);
    if (n !== v) {
      j[k] = n;
      changed = true;
    }
  }
  if (changed) {
    writeFileSync(fp, `${JSON.stringify(j, null, 2)}\n`, "utf8");
  }
  return changed;
}

const marketingEn = path.join(ROOT, "tools/i18n/marketing/marketing-en.json");
const localeDir = path.join(ROOT, "tools/i18n/marketing/locale");

let n = 0;
if (patchFile(marketingEn)) n++;
for (const f of readdirSync(localeDir)) {
  if (!/^marketing-[a-z]{2}(-[a-z]{2})?\.json$/i.test(f)) continue;
  if (patchFile(path.join(localeDir, f))) n++;
}
console.log(`Second-pass i18n: updated ${n} file(s).`);
