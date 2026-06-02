/**
 * Non-PII learner continuation hints for marketing auth surfaces.
 * Derived only from safe callback paths — never from session or profile data.
 */

export type AuthContinuationHint = {
  headline: string;
  detail: string | null;
};

const PATHWAY_LABELS: Record<string, string> = {
  "us-rn-nclex-rn": "NCLEX-RN",
  "ca-rn-nclex-rn": "NCLEX-RN",
  "us-lpn-nclex-pn": "NCLEX-PN",
  "ca-pn-rex-pn": "REx-PN",
};

function pathnameFromCallback(raw: string): string | null {
  try {
    const u = new URL(raw.trim(), "http://localhost");
    return u.pathname;
  } catch {
    return null;
  }
}

function pathwayLabelFromCallback(raw: string): string | null {
  try {
    const u = new URL(raw.trim(), "http://localhost");
    const pid = u.searchParams.get("pathwayId")?.trim() ?? "";
    return PATHWAY_LABELS[pid] ?? null;
  } catch {
    return null;
  }
}

/**
 * Lightweight study-context line for OAuth continuation and session recovery.
 * Returns null for marketing-only callbacks (pricing, blog, home).
 */
export function resolveAuthContinuationHint(callbackUrl: string | null): AuthContinuationHint | null {
  if (!callbackUrl?.trim()) return null;

  const pathname = pathnameFromCallback(callbackUrl);
  if (!pathname?.startsWith("/app/")) return null;

  const pathway = pathwayLabelFromCallback(callbackUrl);
  const pathwaySuffix = pathway ? ` (${pathway})` : "";

  if (pathname.startsWith("/app/flashcards")) {
    return {
      headline: `Continue your flashcard study session${pathwaySuffix}`,
      detail: "We will return you to your deck after sign-in.",
    };
  }
  if (pathname.startsWith("/app/practice-tests") || pathname.startsWith("/app/practice-exams")) {
    if (pathname.includes("cat")) {
      return {
        headline: `Continue your adaptive CAT session${pathwaySuffix}`,
        detail: "Your exam simulation will resume on the same pathway.",
      };
    }
    return {
      headline: `Continue your practice exam session${pathwaySuffix}`,
      detail: "Pick up where you left off after sign-in.",
    };
  }
  if (pathname.startsWith("/app/questions")) {
    return {
      headline: `Continue your question bank session${pathwaySuffix}`,
      detail: "Your practice queue will stay on the same exam track.",
    };
  }
  if (pathname.startsWith("/app/cat")) {
    return {
      headline: `Continue your CAT readiness session${pathwaySuffix}`,
      detail: "Adaptive testing resumes after sign-in.",
    };
  }
  if (pathname.startsWith("/app/lessons")) {
    return {
      headline: `Continue your lesson study session${pathwaySuffix}`,
      detail: "Return to the same lesson hub after sign-in.",
    };
  }
  if (pathname.includes("/ecg")) {
    return {
      headline: "Continue your ECG interpretation module",
      detail: "Telemetry learning picks up on the same track.",
    };
  }
  if (pathname.startsWith("/app/labs")) {
    return {
      headline: "Continue your lab values study session",
      detail: "Clinical interpretation practice resumes after sign-in.",
    };
  }

  return {
    headline: "Continue where you left off",
    detail: "Your study session will reopen after sign-in.",
  };
}
