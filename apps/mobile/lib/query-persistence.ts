import { parseQueryPersistenceFlag } from "@nursenest/mobile-shared";

/**
 * Phase 2: `@tanstack/react-query-persist-client` + expo-sqlite or MMKV.
 * Keep disabled until eviction + encryption review.
 */
export function isQueryPersistenceEnabled(): boolean {
  return parseQueryPersistenceFlag(process.env.EXPO_PUBLIC_ENABLE_QUERY_PERSISTENCE);
}
