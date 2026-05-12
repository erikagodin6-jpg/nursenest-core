/**
 * Test shim — satisfies `@/lib/i18n` imports from client components loaded
 * into the nursenest-core test context via the @legacy-client/* path alias.
 *
 * No nursenest-core production code imports from this path (verified by grep).
 * This file is only reachable when tsx resolves @/lib/i18n from
 * nursenest-core/tsconfig.json (where @/ → ./src/).
 */
export function useI18n() {
  return {
    t: (key: string, _params?: Record<string, unknown>) => key,
    locale: "en" as const,
  };
}
