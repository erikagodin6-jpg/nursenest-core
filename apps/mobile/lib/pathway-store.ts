import { DEFAULT_MOBILE_V1_PATHWAY_ID } from "@nursenest/mobile-shared";
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { secureKeys } from "./secure-keys";

type PathwayState = {
  pathwayId: string;
  hydrated: boolean;
  setPathwayId: (id: string) => Promise<void>;
  hydrate: () => Promise<void>;
};

export const usePathwayStore = create<PathwayState>((set, get) => ({
  pathwayId: DEFAULT_MOBILE_V1_PATHWAY_ID,
  hydrated: false,
  setPathwayId: async (id) => {
    await SecureStore.setItemAsync(secureKeys.pendingPathwayId, id);
    set({ pathwayId: id });
  },
  hydrate: async () => {
    const stored = await SecureStore.getItemAsync(secureKeys.pendingPathwayId).catch(() => null);
    set({
      pathwayId: stored ?? get().pathwayId,
      hydrated: true,
    });
  },
}));
