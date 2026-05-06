import * as SecureStore from "expo-secure-store";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { pathwaySelectionKey } from "@nursenest/mobile-shared";

type Ctx = {
  pathwayId: string | null;
  setPathwayId: (id: string | null) => Promise<void>;
};

const PathwayContext = createContext<Ctx | null>(null);

export function PathwayProvider({ children }: { children: React.ReactNode }) {
  const [pathwayId, setPathwayState] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const stored = await SecureStore.getItemAsync(pathwaySelectionKey());
        const envDefault = process.env.EXPO_PUBLIC_DEFAULT_PATHWAY_ID?.trim() || null;
        setPathwayState(stored?.trim() || envDefault);
      } catch {
        setPathwayState(process.env.EXPO_PUBLIC_DEFAULT_PATHWAY_ID?.trim() || null);
      }
    })();
  }, []);

  const setPathwayId = useCallback(async (id: string | null) => {
    setPathwayState(id);
    if (id) await SecureStore.setItemAsync(pathwaySelectionKey(), id);
    else await SecureStore.deleteItemAsync(pathwaySelectionKey());
  }, []);

  const v = useMemo(() => ({ pathwayId, setPathwayId }), [pathwayId, setPathwayId]);
  return <PathwayContext.Provider value={v}>{children}</PathwayContext.Provider>;
}

export function usePathway(): Ctx {
  const c = useContext(PathwayContext);
  if (!c) throw new Error("PathwayProvider missing");
  return c;
}
