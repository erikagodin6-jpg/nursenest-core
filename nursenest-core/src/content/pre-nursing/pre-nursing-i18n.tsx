"use client";

import * as React from "react";
import strings from "./pre-nursing-strings-en.json";

type Dict = Record<string, string>;

const Ctx = React.createContext<(key: string) => string>(() => "");

export function PreNursingStringsProvider({ children }: { children: React.ReactNode }) {
  const t = React.useCallback((key: string) => {
    const v = (strings as Dict)[key];
    return v ?? key;
  }, []);
  return <Ctx.Provider value={t}>{children}</Ctx.Provider>;
}

/** English strings from the legacy `client` i18n bundle (`pre-nursing-strings-en.json`). */
export function usePreNursingT() {
  const t = React.useContext(Ctx);
  return { t };
}
