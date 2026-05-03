export type MixedLanguageLocale = "en" | "fr";

export type MixedLanguageFinding = {
  kind: "english-in-french" | "french-in-english" | "placeholder" | "missing-key" | "machine-leftover";
  sample: string;
  score: number;
};

export type MixedLanguageDetectionResult = {
  locale: MixedLanguageLocale;
  findings: MixedLanguageFinding[];
  score: number;
  hasBlockingLeak: boolean;
};

const PROTECTED_TERMS = [
  "NurseNest",
  "REx-PN",
  "NCLEX",
  "CPNRE",
  "OSCE",
  "CAT",
  "RN",
  "RPN",
  "PN",
  "NP",
  "NGN",
  "NCSBN",
  "CASN",
] as const;

const PLACEHOLDER_PATTERNS = [
  /\bpages\.[a-z0-9_.-]+/i,
  /\b(nav|footer|brand|components|common|billing|learner|auth)\.[a-z0-9_.-]+/i,
  /\[missing[:\]]/i,
  /\{\{missing/i,
  /\bTODO\b/i,
  /\bTBD\b/i,
  /lorem ipsum/i,
  /translate this/i,
  /translation needed/i,
  /content unavailable right now/i,
] as const;

const ENGLISH_MARKERS = [
  /\b(the|and|with|your|you|learn|practice|questions|flashcards|pricing|dashboard|subscribe|lesson|lessons|account|sign in|sign up|get started)\b/i,
  /\bclinical judgment\b/i,
  /\bpractice exam\b/i,
  /\bstudy plan\b/i,
] as const;

const FRENCH_MARKERS = [
  /\b(le|la|les|des|avec|votre|vous|apprendre|questions|tarifs|connexion|compte|soins|infirmier|infirmière|abonnement)\b/i,
  /[éèêëàâùûîïôçœ]/i,
] as const;

function stripProtectedTerms(input: string): string {
  let out = input;
  for (const term of PROTECTED_TERMS) {
    out = out.replace(new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi"), " ");
  }
  return out;
}

function compactSample(input: string): string {
  return input.replace(/\s+/g, " ").trim().slice(0, 220);
}

function pushFinding(findings: MixedLanguageFinding[], kind: MixedLanguageFinding["kind"], sample: string, score: number): void {
  const s = compactSample(sample);
  if (!s) return;
  if (findings.some((f) => f.kind === kind && f.sample === s)) return;
  findings.push({ kind, sample: s, score });
}

export function detectMixedLanguageText(
  input: string,
  locale: MixedLanguageLocale,
  options?: { allowProtectedTerms?: readonly string[]; maxFindings?: number },
): MixedLanguageDetectionResult {
  const findings: MixedLanguageFinding[] = [];
  const clean = stripProtectedTerms(input);
  const lines = clean
    .split(/[\n\r]+/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && line.length < 600);

  for (const line of lines) {
    for (const pattern of PLACEHOLDER_PATTERNS) {
      if (pattern.test(line)) {
        const kind = /\[missing|\{\{missing|content unavailable/i.test(line) ? "missing-key" : /translate this|translation needed/i.test(line) ? "machine-leftover" : "placeholder";
        pushFinding(findings, kind, line, 4);
      }
    }

    if (locale === "fr") {
      const hasFrenchSignal = FRENCH_MARKERS.some((pattern) => pattern.test(line));
      const hasEnglishSignal = ENGLISH_MARKERS.some((pattern) => pattern.test(line));
      const mostlyAscii = /^[\x00-\x7F\s.,;:!?'"()/$%&+-]+$/.test(line);
      if (hasEnglishSignal && (mostlyAscii || !hasFrenchSignal)) {
        pushFinding(findings, "english-in-french", line, mostlyAscii ? 3 : 2);
      }
    } else {
      const hasFrenchSignal = FRENCH_MARKERS.some((pattern) => pattern.test(line));
      if (hasFrenchSignal) {
        pushFinding(findings, "french-in-english", line, /[éèêëàâùûîïôçœ]/i.test(line) ? 4 : 2);
      }
    }
  }

  const capped = findings.slice(0, options?.maxFindings ?? 80);
  const score = capped.reduce((sum, finding) => sum + finding.score, 0);
  return {
    locale,
    findings: capped,
    score,
    hasBlockingLeak: score >= (locale === "fr" ? 8 : 4) || capped.some((f) => f.kind === "missing-key" || f.kind === "placeholder"),
  };
}

export function looksLikeI18nPlaceholder(input: string): boolean {
  return PLACEHOLDER_PATTERNS.some((pattern) => pattern.test(input));
}
