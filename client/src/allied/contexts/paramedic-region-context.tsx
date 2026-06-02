import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

export type ParamedicRegion = "CA" | "US";

interface ParamedicRegionContextValue {
  region: ParamedicRegion;
  setRegion: (region: ParamedicRegion) => void;
  isCanada: boolean;
  isUS: boolean;
  regionLabel: string;
}

const ParamedicRegionContext = createContext<ParamedicRegionContextValue>({
  region: "US",
  setRegion: () => {},
  isCanada: false,
  isUS: true,
  regionLabel: "United States",
});

const STORAGE_KEY = "paramedic_region";

export function ParamedicRegionProvider({ children }: { children: ReactNode }) {
  const [region, setRegionState] = useState<ParamedicRegion>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "CA" || stored === "US") return stored;
    } catch {}
    return "US";
  });

  const setRegion = useCallback((r: ParamedicRegion) => {
    setRegionState(r);
    try {
      localStorage.setItem(STORAGE_KEY, r);
    } catch {}
  }, []);

  const value: ParamedicRegionContextValue = {
    region,
    setRegion,
    isCanada: region === "CA",
    isUS: region === "US",
    regionLabel: region === "CA" ? "Canada" : "United States",
  };

  return (
    <ParamedicRegionContext.Provider value={value}>
      {children}
    </ParamedicRegionContext.Provider>
  );
}

export function useParamedicRegion() {
  return useContext(ParamedicRegionContext);
}
