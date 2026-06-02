import React, { createContext, useContext, useMemo } from "react";
import {
  createFlashcardsApi,
  createMobileApiClient,
  createNpCatApi,
  createPracticeTestsApi,
} from "@nursenest/mobile-shared";
import { usePathway } from "./pathway-context";

export type ApiBundle = {
  raw: ReturnType<typeof createMobileApiClient>;
  flashcards: ReturnType<typeof createFlashcardsApi>;
  practice: ReturnType<typeof createPracticeTestsApi>;
  npCat: ReturnType<typeof createNpCatApi>;
};

const ApiCtx = createContext<ApiBundle | null>(null);

export function ApiProvider({ children }: { children: React.ReactNode }) {
  const { pathwayId } = usePathway();
  const bundle = useMemo(() => {
    const baseUrl = process.env.EXPO_PUBLIC_NN_API_ORIGIN?.replace(/\/+$/, "") ?? "https://nursenest.com";
    const bearer = process.env.EXPO_PUBLIC_NN_BEARER?.trim() || null;
    const raw = createMobileApiClient({
      baseUrl,
      getAccessToken: async () => bearer,
      getPathwayId: () => pathwayId,
      credentialsInclude: false,
    });
    return {
      raw,
      flashcards: createFlashcardsApi(raw),
      practice: createPracticeTestsApi(raw),
      npCat: createNpCatApi(raw),
    };
  }, [pathwayId]);

  return <ApiCtx.Provider value={bundle}>{children}</ApiCtx.Provider>;
}

export function useApi(): ApiBundle {
  const v = useContext(ApiCtx);
  if (!v) throw new Error("ApiProvider missing");
  return v;
}
