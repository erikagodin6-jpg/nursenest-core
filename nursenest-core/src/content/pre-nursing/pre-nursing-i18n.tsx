"use client";

import * as React from "react";

type Dict = Record<string, string>;

const Ctx = React.createContext<(key: string) => string>(() => "");
let stringsCache: Dict | null = null;

function getStrings(): Dict {
  if (stringsCache) return stringsCache;
  stringsCache = require("./pre-nursing-strings-en.json") as Dict;
  return stringsCache;
}

export function PreNursingStringsProvider({ children }: { children: React.ReactNode }) {
  const t = React.useCallback((key: string) => {
    const v = getStrings()[key];
    return v ?? key;
  }, []);
  return <Ctx.Provider value={t}>{children}</Ctx.Provider>;
}

/** English strings from the legacy `client` i18n bundle (`pre-nursing-strings-en.json`). */
export function usePreNursingT() {
  const t = React.useContext(Ctx);
  return { t };
}
