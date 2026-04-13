import { formatTitleCase } from "@/lib/format/text-case";

const PATHWAY_LABEL_PATTERN = /\b(?:nclex[\s-]?rn|nclex[\s-]?pn|rex[\s-]?pn)\b/i;
const COUNTRY_PATTERN = /\b(?:canada|us|u\.s\.|united states)\b/i;
const MEDICAL_ACRONYMS = new Map<string, string>([
  ["acs", "ACS"],
  ["abg", "ABG"],
  ["cad", "CAD"],
  ["copd", "COPD"],
  ["cva", "CVA"],
  ["dka", "DKA"],
  ["ecg", "ECG"],
  ["ekg", "EKG"],
  ["hr", "HR"],
  ["icu", "ICU"],
  ["iv", "IV"],
  ["mi", "MI"],
  ["nicu", "NICU"],
  ["npo", "NPO"],
  ["o2", "O2"],
  ["pe", "PE"],
  ["pn", "PN"],
  ["rn", "RN"],
  ["spo2", "SpO2"],
  ["uti", "UTI"],
]);

function normalizeSpacing(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function stripPathwaySuffixParentheticals(value: string): string {
  return value.replace(/\s*\(([^)]*)\)/gi, (match, inner: string) => {
    if (PATHWAY_LABEL_PATTERN.test(inner) || COUNTRY_PATTERN.test(inner)) return " ";
    return match;
  });
}

function stripPathwaySegments(value: string): string {
  return value
    .replace(/\s*[-–—,:|]\s*(?:nclex[\s-]?rn|nclex[\s-]?pn|rex[\s-]?pn)\b(?:\s*,?\s*(?:canada|us|u\.s\.|united states))?/gi, " ")
    .replace(/\b(?:nclex[\s-]?rn|nclex[\s-]?pn|rex[\s-]?pn)\b(?:\s*,?\s*(?:canada|us|u\.s\.|united states))?/gi, " ");
}

function restoreAcronymCasing(value: string, sourceTitle: string): string {
  const dynamicAcronyms = new Set(
    [...sourceTitle.matchAll(/\b[A-Z]{2,}(?:\/[A-Z]{2,})*\b/g)]
      .map((match) => match[0])
      .filter((token) => !PATHWAY_LABEL_PATTERN.test(token)),
  );

  let updated = value;
  for (const token of dynamicAcronyms) {
    updated = updated.replace(new RegExp(`\\b${token}\\b`, "gi"), token);
  }

  for (const [lower, token] of MEDICAL_ACRONYMS.entries()) {
    updated = updated.replace(new RegExp(`\\b${lower}\\b`, "gi"), token);
  }

  return updated;
}

export function cleanLessonTitleForDisplay(rawTitle: string): string {
  const source = normalizeSpacing(rawTitle);
  if (!source) return "";

  const stripped = normalizeSpacing(
    stripPathwaySegments(stripPathwaySuffixParentheticals(source))
      .replace(/\(\s*\)/g, " ")
      .replace(/\s+([,;:.!?])/g, "$1")
      .replace(/[-–—,:|]\s*$/g, ""),
  );

  const titleCased = formatTitleCase(stripped);
  return restoreAcronymCasing(titleCased, source);
}

export function compactPathwayLabel(value: string): string {
  if (/nclex[\s-]?rn/i.test(value)) return "RN";
  if (/nclex[\s-]?pn/i.test(value) || /rex[\s-]?pn/i.test(value)) return "PN";
  return value;
}
