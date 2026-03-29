import { useEffect, useRef, useCallback, type ReactNode } from "react";
import { useI18n } from "@/lib/i18n";

const CJK_RANGE = /[\u3000-\u9fff\uf900-\ufaff]/;
const ARABIC_RANGE = /[\u0600-\u06ff\u0750-\u077f]/;
const DEVANAGARI_RANGE = /[\u0900-\u097f]/;
const GURMUKHI_RANGE = /[\u0a00-\u0a7f]/;
const HANGUL_RANGE = /[\uac00-\ud7af\u1100-\u11ff]/;
const THAI_RANGE = /[\u0e00-\u0e7f]/;
const HIRAGANA_KATAKANA = /[\u3040-\u309f\u30a0-\u30ff]/;
const LATIN_RANGE = /[a-zA-Z]/g;

type ScriptDetection = "latin" | "cjk" | "arabic" | "devanagari" | "gurmukhi" | "hangul" | "thai" | "mixed" | "unknown";

const LANGUAGE_SCRIPTS: Record<string, ScriptDetection[]> = {
  en: ["latin"],
  fr: ["latin"],
  es: ["latin"],
  de: ["latin"],
  pt: ["latin"],
  vi: ["latin"],
  tl: ["latin"],
  tr: ["latin"],
  id: ["latin"],
  ht: ["latin"],
  zh: ["cjk"],
  "zh-tw": ["cjk"],
  ja: ["cjk", "latin"],
  ko: ["hangul", "latin"],
  ar: ["arabic"],
  ur: ["arabic"],
  fa: ["arabic"],
  hi: ["devanagari", "latin"],
  pa: ["gurmukhi", "latin"],
  th: ["thai", "latin"],
};

function detectScript(text: string): ScriptDetection {
  if (!text || text.length < 5) return "unknown";

  const cleaned = text.replace(/[\s\d\p{P}\p{S}]/gu, "");
  if (cleaned.length < 3) return "unknown";

  const latinCount = (cleaned.match(LATIN_RANGE) || []).length;
  const cjkCount = (cleaned.match(/[\u3000-\u9fff\uf900-\ufaff\u3040-\u309f\u30a0-\u30ff]/g) || []).length;
  const arabicCount = (cleaned.match(/[\u0600-\u06ff\u0750-\u077f]/g) || []).length;
  const devanagariCount = (cleaned.match(/[\u0900-\u097f]/g) || []).length;
  const gurmukhiCount = (cleaned.match(/[\u0a00-\u0a7f]/g) || []).length;
  const hangulCount = (cleaned.match(/[\uac00-\ud7af\u1100-\u11ff]/g) || []).length;
  const thaiCount = (cleaned.match(/[\u0e00-\u0e7f]/g) || []).length;

  const total = cleaned.length;
  const threshold = 0.3;

  const counts: [ScriptDetection, number][] = [
    ["latin", latinCount],
    ["cjk", cjkCount],
    ["arabic", arabicCount],
    ["devanagari", devanagariCount],
    ["gurmukhi", gurmukhiCount],
    ["hangul", hangulCount],
    ["thai", thaiCount],
  ];

  counts.sort((a, b) => b[1] - a[1]);

  if (counts[0][1] / total > threshold) {
    return counts[0][0];
  }

  return "unknown";
}

function isScriptCompatible(detectedScript: ScriptDetection, language: string): boolean {
  if (detectedScript === "unknown" || detectedScript === "mixed") return true;

  const expectedScripts = LANGUAGE_SCRIPTS[language];
  if (!expectedScripts) return true;

  return expectedScripts.includes(detectedScript);
}

let reportDebounceTimer: ReturnType<typeof setTimeout> | null = null;
const reportedMismatches = new Set<string>();

function reportMismatchToServer(language: string, detectedScript: string, sampleText: string) {
  const key = `${language}:${detectedScript}:${sampleText.slice(0, 30)}`;
  if (reportedMismatches.has(key)) return;
  reportedMismatches.add(key);

  if (reportedMismatches.size > 200) {
    const first = reportedMismatches.values().next().value;
    if (first) reportedMismatches.delete(first);
  }

  if (reportDebounceTimer) clearTimeout(reportDebounceTimer);
  reportDebounceTimer = setTimeout(() => {
    try {
      fetch("/api/language-health/report-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType: "language_mismatch",
          expectedLanguage: language,
          detectedLanguage: detectedScript,
          detail: `Mixed-language content detected on page: "${sampleText.slice(0, 100)}"`,
        }),
      }).catch(() => {});
    } catch {}
  }, 2000);
}

interface LanguageGuardProps {
  children: ReactNode;
  className?: string;
  onMismatch?: (detectedScript: string, expectedLang: string) => void;
}

export function LanguageGuard({ children, className, onMismatch }: LanguageGuardProps) {
  const { language } = useI18n();
  const containerRef = useRef<HTMLDivElement>(null);

  const checkContent = useCallback(() => {
    if (!containerRef.current || language === "en") return;

    const textContent = containerRef.current.innerText || "";
    if (textContent.length < 20) return;

    const chunks = textContent.split(/\n+/).filter((c) => c.trim().length > 10).slice(0, 5);

    for (const chunk of chunks) {
      const detected = detectScript(chunk);
      if (!isScriptCompatible(detected, language)) {
        reportMismatchToServer(language, detected, chunk);
        onMismatch?.(detected, language);
        break;
      }
    }
  }, [language, onMismatch]);

  useEffect(() => {
    const timer = setTimeout(checkContent, 1500);
    return () => clearTimeout(timer);
  }, [checkContent]);

  return (
    <div ref={containerRef} className={className} data-testid="language-guard-wrapper">
      {children}
    </div>
  );
}

export function useLanguageGuard() {
  const { language } = useI18n();

  const checkText = useCallback(
    (text: string): { compatible: boolean; detectedScript: ScriptDetection } => {
      if (!text || text.length < 10 || language === "en") {
        return { compatible: true, detectedScript: "unknown" };
      }
      const detected = detectScript(text);
      return {
        compatible: isScriptCompatible(detected, language),
        detectedScript: detected,
      };
    },
    [language]
  );

  return { checkText, language };
}
