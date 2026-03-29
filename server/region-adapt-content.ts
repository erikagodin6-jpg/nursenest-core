import type { Region } from "../shared/region-config";

function roundTo(val: number, decimals: number): number {
  const mult = Math.pow(10, decimals);
  return Math.round(val * mult) / mult;
}

function fToC(f: number): number {
  return roundTo((f - 32) * 5 / 9, 1);
}

function cToF(c: number): number {
  return roundTo(c * 9 / 5 + 32, 1);
}

interface LabConversion {
  keywords: RegExp;
  factor: number;
  round: number;
  caUnit: string;
}

const MGDL_CONVERSIONS: LabConversion[] = [
  { keywords: /creatinine|cr\b|scr\b/i, factor: 88.4, round: 0, caUnit: "µmol/L" },
  { keywords: /bilirubin|bili\b/i, factor: 17.1, round: 0, caUnit: "µmol/L" },
  { keywords: /uric\s*acid|urate/i, factor: 59.48, round: 0, caUnit: "µmol/L" },
  { keywords: /calcium|ca\b|ca\+\+/i, factor: 0.25, round: 2, caUnit: "mmol/L" },
  { keywords: /magnesium|mag\b/i, factor: 0.4114, round: 2, caUnit: "mmol/L" },
  { keywords: /phosph|phos\b|po4/i, factor: 0.3229, round: 2, caUnit: "mmol/L" },
  { keywords: /cholesterol|ldl|hdl|lipid/i, factor: 0.0259, round: 1, caUnit: "mmol/L" },
  { keywords: /triglyceride/i, factor: 0.0113, round: 2, caUnit: "mmol/L" },
  { keywords: /bun\b|blood\s*urea\s*nitrogen|urea/i, factor: 0.357, round: 1, caUnit: "mmol/L" },
  { keywords: /glucose|sugar|fbs|fasting|a1c|hba1c|blood\s*sugar|bs\b|bg\b|glyc/i, factor: 0.0555, round: 1, caUnit: "mmol/L" },
];

function findSentenceStart(text: string, position: number, maxLookback: number): number {
  const start = Math.max(0, position - maxLookback);
  const segment = text.substring(start, position);
  const lastPeriod = segment.lastIndexOf('. ');
  if (lastPeriod >= 0) {
    return start + lastPeriod + 2;
  }
  return start;
}

function identifyLabType(text: string, matchIndex: number, matchLength: number): LabConversion | null {
  const sentenceStart = findSentenceStart(text, matchIndex, 120);
  const context = text.substring(sentenceStart, matchIndex + matchLength).toLowerCase();
  for (const conv of MGDL_CONVERSIONS) {
    if (conv.keywords.test(context)) {
      return conv;
    }
  }
  return null;
}

function convertMgDlValues(text: string): string {
  const pattern = /(\d+(?:\.\d+)?)(\s*[-–]\s*(\d+(?:\.\d+)?))?\s*mg\/dL/g;

  let result = '';
  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    result += text.substring(lastIndex, match.index);

    const v1 = parseFloat(match[1]);
    const v2 = match[3] ? parseFloat(match[3]) : null;
    const conv = identifyLabType(text, match.index, match[0].length);

    if (!conv) {
      result += match[0];
      lastIndex = pattern.lastIndex;
      continue;
    }

    const c1 = roundTo(v1 * conv.factor, conv.round);
    if (v2 !== null) {
      const c2 = roundTo(v2 * conv.factor, conv.round);
      result += `${c1}-${c2} ${conv.caUnit}`;
    } else {
      result += `${c1} ${conv.caUnit}`;
    }

    lastIndex = pattern.lastIndex;
  }

  result += text.substring(lastIndex);
  return result;
}

const GDL_KEYWORDS = /hemoglobin|hgb\b|hb\b|albumin|alb\b|protein|globulin|fibrinogen/i;

function convertGdlValues(text: string): string {
  const pattern = /(\d+(?:\.\d+)?)(\s*[-–]\s*(\d+(?:\.\d+)?))?\s*g\/dL/g;

  let result = '';
  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    result += text.substring(lastIndex, match.index);

    const sentStart = findSentenceStart(text, match.index, 120);
    const context = text.substring(sentStart, match.index + match[0].length).toLowerCase();

    if (!GDL_KEYWORDS.test(context)) {
      result += match[0];
      lastIndex = pattern.lastIndex;
      continue;
    }

    const c1 = roundTo(parseFloat(match[1]) * 10, 0);
    if (match[3]) {
      const c2 = roundTo(parseFloat(match[3]) * 10, 0);
      result += `${c1}-${c2} g/L`;
    } else {
      result += `${c1} g/L`;
    }

    lastIndex = pattern.lastIndex;
  }

  result += text.substring(lastIndex);
  return result;
}

function convertMeqValues(text: string): string {
  return text.replace(
    /(\d+(?:\.\d+)?)(\s*[-–]\s*(\d+(?:\.\d+)?))?\s*mEq\/L/g,
    (_match, v1Str, _rangePart, v2Str) => {
      if (v2Str) {
        return `${v1Str}-${v2Str} mmol/L`;
      }
      return `${v1Str} mmol/L`;
    }
  );
}

function convertCellsPerUl(text: string): string {
  return text.replace(
    /(\d{1,3}(?:,\d{3})*)(?:\s*[-–]\s*(\d{1,3}(?:,\d{3})*))?\s*cells\/(?:µL|uL|mcL)/g,
    (_match, v1Str, v2Str) => {
      const num1 = parseFloat(v1Str.replace(/,/g, ''));
      const c1 = roundTo(num1 / 1000, 1);
      if (v2Str) {
        const num2 = parseFloat(v2Str.replace(/,/g, ''));
        const c2 = roundTo(num2 / 1000, 1);
        return `${c1}-${c2} ×10⁹/L`;
      }
      return `${c1} ×10⁹/L`;
    }
  );
}

function convertTemperatures(text: string, toRegion: Region): string {
  if (toRegion === "CA") {
    return text.replace(
      /(\d{2,3}(?:\.\d{1,2})?)(\s*[-–]\s*(\d{2,3}(?:\.\d{1,2})?))?\s*°\s*F\b/g,
      (match, v1Str, _rangePart, v2Str) => {
        const v1 = parseFloat(v1Str);
        if (v1 < 85 || v1 > 115) return match;
        const c1 = fToC(v1);
        if (v2Str) {
          const v2 = parseFloat(v2Str);
          if (v2 < 85 || v2 > 115) return match;
          const c2 = fToC(v2);
          return `${c1}-${c2} °C`;
        }
        return `${c1} °C`;
      }
    );
  } else {
    return text.replace(
      /(\d{2}(?:\.\d{1,2})?)(\s*[-–]\s*(\d{2}(?:\.\d{1,2})?))?\s*°\s*C\b/g,
      (match, v1Str, _rangePart, v2Str) => {
        const v1 = parseFloat(v1Str);
        if (v1 < 30 || v1 > 45) return match;
        const f1 = cToF(v1);
        if (v2Str) {
          const v2 = parseFloat(v2Str);
          if (v2 < 30 || v2 > 45) return match;
          const f2 = cToF(v2);
          return `${f1}-${f2} °F`;
        }
        return `${f1} °F`;
      }
    );
  }
}

function convertWeightHeight(text: string): string {
  text = text.replace(/(\d+(?:\.\d+)?)\s*lbs?\b/gi, (_match, val) => {
    const kg = roundTo(parseFloat(val) * 0.4536, 1);
    return `${kg} kg`;
  });
  text = text.replace(/(\d+(?:\.\d+)?)\s*(?:inches|inch)\b/gi, (_match, val) => {
    const cm = roundTo(parseFloat(val) * 2.54, 1);
    return `${cm} cm`;
  });
  return text;
}

function adaptText(text: string, region: Region): string {
  if (!text || typeof text !== "string") return text;

  if (region === "CA") {
    text = convertTemperatures(text, "CA");
    text = convertMgDlValues(text);
    text = convertGdlValues(text);
    text = convertMeqValues(text);
    text = convertCellsPerUl(text);
    text = convertWeightHeight(text);
  }

  return text;
}

function adaptStringArray(arr: any[], region: Region): any[] {
  return arr.map(item => typeof item === "string" ? adaptText(item, region) : item);
}

function adaptMedication(med: any, region: Region): any {
  if (!med || typeof med !== "object") return med;
  const adapted = { ...med };
  if (typeof adapted.action === "string") adapted.action = adaptText(adapted.action, region);
  if (typeof adapted.sideEffects === "string") adapted.sideEffects = adaptText(adapted.sideEffects, region);
  if (typeof adapted.contra === "string") adapted.contra = adaptText(adapted.contra, region);
  if (typeof adapted.pearl === "string") adapted.pearl = adaptText(adapted.pearl, region);
  return adapted;
}

function adaptQuizQuestion(q: any, region: Region): any {
  if (!q || typeof q !== "object") return q;
  const adapted = { ...q };
  if (typeof adapted.question === "string") adapted.question = adaptText(adapted.question, region);
  if (Array.isArray(adapted.options)) {
    adapted.options = adapted.options.map((o: any) => typeof o === "string" ? adaptText(o, region) : o);
  }
  if (typeof adapted.rationale === "string") adapted.rationale = adaptText(adapted.rationale, region);
  return adapted;
}

export function adaptLessonContent(lesson: any, region: Region): any {
  if (!lesson || region === "US") return lesson;

  const adapted = { ...lesson };

  if (adapted.cellular && typeof adapted.cellular === "object") {
    adapted.cellular = {
      ...adapted.cellular,
      content: adaptText(adapted.cellular.content, region),
    };
  }

  if (Array.isArray(adapted.riskFactors)) {
    adapted.riskFactors = adaptStringArray(adapted.riskFactors, region);
  }
  if (Array.isArray(adapted.diagnostics)) {
    adapted.diagnostics = adaptStringArray(adapted.diagnostics, region);
  }
  if (Array.isArray(adapted.management)) {
    adapted.management = adaptStringArray(adapted.management, region);
  }
  if (Array.isArray(adapted.nursingActions)) {
    adapted.nursingActions = adaptStringArray(adapted.nursingActions, region);
  }

  if (adapted.signs && typeof adapted.signs === "object") {
    adapted.signs = { ...adapted.signs };
    if (Array.isArray(adapted.signs.left)) {
      adapted.signs.left = adaptStringArray(adapted.signs.left, region);
    }
    if (Array.isArray(adapted.signs.right)) {
      adapted.signs.right = adaptStringArray(adapted.signs.right, region);
    }
  }

  if (Array.isArray(adapted.medications)) {
    adapted.medications = adapted.medications.map((m: any) => adaptMedication(m, region));
  }

  if (Array.isArray(adapted.pearls)) {
    adapted.pearls = adaptStringArray(adapted.pearls, region);
  }

  if (Array.isArray(adapted.quiz)) {
    adapted.quiz = adapted.quiz.map((q: any) => adaptQuizQuestion(q, region));
  }
  if (Array.isArray(adapted.preTest)) {
    adapted.preTest = adapted.preTest.map((q: any) => adaptQuizQuestion(q, region));
  }
  if (Array.isArray(adapted.postTest)) {
    adapted.postTest = adapted.postTest.map((q: any) => adaptQuizQuestion(q, region));
  }

  return adapted;
}
