"use client";

import { Suspense, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { AuthExperienceShell } from "@/components/auth/auth-experience/auth-experience-shell";
import { AuthStoryPanel } from "@/components/auth/auth-experience/auth-story-panel";
import { AuthPreviewLoginForm } from "@/components/ui-preview/auth-preview-mock-forms";
import { NURSENEST_DEFAULT_THEME, THEME_OPTIONS, normalizeThemeId } from "@/lib/theme/theme-registry";

const THEME_IDS = new Set(THEME_OPTIONS.map((o) => o.id));

function resolveThemeParam(raw: string | null): string {
  const t = raw?.trim() ?? "";
  const normalized = normalizeThemeId(t);
  return THEME_IDS.has(normalized) ? normalized : NURSENEST_DEFAULT_THEME;
}

function AuthLoginLivePreviewInner() {
  const sp = useSearchParams();
  const theme = useMemo(() => resolveThemeParam(sp.get("theme")), [sp]);

  useEffect(() => {
    const prev = document.documentElement.getAttribute("data-theme");
    document.documentElement.setAttribute("data-theme", theme);
    return () => {
      if (prev) document.documentElement.setAttribute("data-theme", prev);
      else document.documentElement.removeAttribute("data-theme");
    };
  }, [theme]);

  const themeLabel =
    {
      "sea-glass": "Sea Glass",
      blossom: "Blossom",
      ocean: "Ocean",
      midnight: "Midnight",
    }[theme] ?? theme;

  return (
    <div className="min-h-0 min-w-0 px-4 py-6 sm:px-6">
      <p className="mb-4 text-center text-xs font-medium text-[var(--semantic-text-muted)]">
        QA preview · login split · theme <span className="tabular-nums">{themeLabel}</span>
      </p>
      <div data-theme={theme} className="contents min-h-0 min-w-0">
        <AuthExperienceShell
          mode="login"
          layout="split-editorial"
          theme={theme === "ocean" ? "ocean" : "blossom"}
          title="Sign in"
          subtitle="Continue your adaptive study session — lessons, flashcards, and CAT in one calm loop."
          termsHref="/terms"
          privacyHref="/privacy"
          contactHref="/contact"
          mobileEyebrow={`NurseNest · ${themeLabel}`}
          visualPanel={<AuthStoryPanel />}
        >
          <AuthPreviewLoginForm />
        </AuthExperienceShell>
      </div>
    </div>
  );
}

export function AuthLoginLivePreview() {
  return (
    <Suspense
      fallback={<div className="px-6 py-16 text-center text-sm text-[var(--semantic-text-muted)]">Loading preview…</div>}
    >
      <AuthLoginLivePreviewInner />
    </Suspense>
  );
}
