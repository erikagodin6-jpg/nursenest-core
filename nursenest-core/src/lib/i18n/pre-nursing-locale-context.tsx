"use client";

import * as React from "react";
import type { PreNursingModuleOverlay } from "@/lib/i18n/pre-nursing-overlay-types";

export type PreNursingLocaleContextValue = {
  /** BCP-47 locale code (e.g. "fr", "es"). "en" = default, overlay is null. */
  locale: string;
  /** Prose overlay for the current module. Null means render English TSX content. */
  moduleOverlay: PreNursingModuleOverlay | null;
};

const PreNursingLocaleContext = React.createContext<PreNursingLocaleContextValue>({
  locale: "en",
  moduleOverlay: null,
});

export function PreNursingLocaleProvider({
  locale,
  moduleOverlay,
  children,
}: PreNursingLocaleContextValue & { children: React.ReactNode }) {
  const value = React.useMemo(
    () => ({ locale, moduleOverlay }),
    [locale, moduleOverlay],
  );
  return (
    <PreNursingLocaleContext.Provider value={value}>
      {children}
    </PreNursingLocaleContext.Provider>
  );
}

/** Returns the current pre-nursing locale context, including any module prose overlay. */
export function usePreNursingLocale(): PreNursingLocaleContextValue {
  return React.useContext(PreNursingLocaleContext);
}
