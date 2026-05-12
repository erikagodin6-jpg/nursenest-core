/**
 * SSR test shim for @/lib/i18n — nursenest-core test context only.
 *
 * WHY THIS EXISTS:
 *   client/src components (loaded via @legacy-client/*) call `useI18n()` from
 *   "@/lib/i18n".  In the nursenest-core test runner, "@/" resolves to
 *   nursenest-core/src/ — so tsx finds this file instead of the real client
 *   i18n module (client/src/lib/i18n.tsx).
 *
 *   The real useI18n calls React.useContext, which requires an <I18nProvider>
 *   ancestor in the tree.  renderToStaticMarkup renders bare components with
 *   no provider, so useContext returns undefined → crash.  This shim returns a
 *   safe no-op `t` function that passes keys through unchanged, which is
 *   sufficient for structural SSR assertions.
 *
 * WHY IT STAYS after React unification:
 *   Unifying React fixed the dual-dispatcher crash (hooks now fire from the
 *   correct React copy).  But it did NOT add a React context Provider to the
 *   test tree.  The context requirement is orthogonal to React identity.
 *
 * SAFE TO KEEP:
 *   No nursenest-core production code imports from "@/lib/i18n" as a leaf path
 *   (verified by grep — only sub-paths like "@/lib/i18n/..." are used).
 *   This file is unreachable from production Next.js and Vite builds.
 */
export function useI18n() {
  return {
    t: (key: string, _params?: Record<string, unknown>) => key,
    locale: "en" as const,
  };
}
