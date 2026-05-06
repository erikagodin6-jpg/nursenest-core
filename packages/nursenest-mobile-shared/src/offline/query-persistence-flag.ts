/**
 * React Query persistence (expo-sqlite / MMKV) is Phase 2.
 * Gate behind EXPO_PUBLIC_ENABLE_QUERY_PERSISTENCE on the client.
 */
export const QUERY_PERSISTENCE_PHASE = "phase-2" as const;

export function parseQueryPersistenceFlag(value: string | undefined): boolean {
  return value === "1" || value?.toLowerCase() === "true";
}
