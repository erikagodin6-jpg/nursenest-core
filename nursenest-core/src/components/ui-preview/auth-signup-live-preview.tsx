"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AuthSignupPathwayPanel } from "@/components/auth/auth-experience/auth-signup-pathway-panel";
import { AuthExperienceShell } from "@/components/auth/auth-experience/auth-experience-shell";
import { AuthPreviewSignupForm } from "@/components/ui-preview/auth-preview-mock-forms";
import type { SignupTierValue } from "@/lib/marketing/signup-exam-focus-options";
import { NURSENEST_DEFAULT_THEME, THEME_OPTIONS, normalizeThemeId } from "@/lib/theme/theme-registry";

const THEME_IDS = new Set(THEME_OPTIONS.map((o) => o.id));

function resolveThemeParam(raw: string | null): string {
  const t = raw?.trim() ?? "";
  const normalized = normalizeThemeId(t || "sea-glass");
  if (t === "blossom") return "sea-glass";
  return THEME_IDS.has(normalized) ? normalized : "sea-glass";
}

function AuthSignupLivePreviewInner() {
  const sp = useSearchParams();
  const theme = useMemo(() => resolveThemeParam(sp.get("theme")), [sp]);
  const [tier, setTier] = useState<SignupTierValue>("RN");

  useEffect(() => {
    const prev = document.documentElement.getAttribute("data-theme");
    document.documentElement.setAttribute("data-theme", theme);
    return () => {
      if (prev) document.documentElement.setAttribute("data-theme", prev);
      else document.documentElement.removeAttribute("data-theme");
    };
  }, [theme]);

  const themeLabel = theme === "sea-glass" ? "Sea Glass" : theme === "ocean" ? "Ocean" : theme;

  return (
    <div className="min-h-0 min-w-0 px-4 py-6 sm:px-6">
      <p className="mb-4 text-center text-xs font-medium text-[var(--semantic-text-muted)]">
        QA preview · signup aspirational · theme <span className="tabular-nums">{themeLabel}</span>
      </p>
      <div data-theme={theme} className="contents min-h-0 min-w-0">
        <AuthExperienceShell
          mode="signup"
          layout="signup-aspirational"
          theme="blossom"
          title="Create account"
          subtitle="Choose your pathway and start a connected NurseNest study plan."
          termsHref="/terms"
          privacyHref="/privacy"
          contactHref="/contact"
          mobileEyebrow={`NurseNest · ${themeLabel}`}
          visualPanel={<AuthSignupPathwayPanel tier={tier} onTierSelect={setTier} />}
        >
          <AuthPreviewSignupForm />
        </AuthExperienceShell>
      </div>
    </div>
  );
}

export function AuthSignupLivePreview() {
  return (
    <Suspense
      fallback={<div className="px-6 py-16 text-center text-sm text-[var(--semantic-text-muted)]">Loading preview…</div>}
    >
      <AuthSignupLivePreviewInner />
    </Suspense>
  );
}
