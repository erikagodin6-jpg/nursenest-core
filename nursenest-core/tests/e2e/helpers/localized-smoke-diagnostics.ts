import type { TestInfo } from "@playwright/test";
import type { PageObservers } from "./attach-observers";
import { logObserverDiagnostics } from "./attach-observers";

export type LocalizedSmokeCapture = {
  locale: string;
  finalUrl: string;
  consoleErrors: string[];
  failedRequests: string[];
};

/**
 * Logs observers, attaches JSON (always), and returns capture for assertions.
 */
export async function recordLocalizedSmoke(
  observers: PageObservers,
  testInfo: TestInfo,
  routeLabel: string,
  pageUrl: string,
  locale: string,
): Promise<LocalizedSmokeCapture> {
  await logObserverDiagnostics(observers, routeLabel);
  const capture: LocalizedSmokeCapture = {
    locale,
    finalUrl: pageUrl,
    consoleErrors: [...observers.consoleErrors],
    failedRequests: [...observers.failedRequests],
  };
  await testInfo.attach(`localized-smoke-${locale}.json`, {
    body: Buffer.from(JSON.stringify(capture, null, 2)),
    contentType: "application/json",
  });
  return capture;
}

/** Same filter as `tests/e2e/public/smoke.spec.ts` seriousPublicSmokeConsoleErrors — dev auth noise. */
export function seriousLocalizedGuestConsoleErrors(errors: string[]): string[] {
  const hasAuthMisconfigNoise = errors.some(
    (t) =>
      /assertConfig|@auth_core|authjs\.dev#autherror/i.test(t) ||
      /ClientFetchError:.*server configuration|There was a problem with the server configuration/i.test(t),
  );
  return errors.filter((t) => {
    if (/assertConfig|@auth_core|authjs\.dev#autherror/i.test(t)) return false;
    if (/ClientFetchError:.*server configuration|There was a problem with the server configuration/i.test(t)) {
      return false;
    }
    if (
      hasAuthMisconfigNoise &&
      /Failed to load resource: the server responded with a status of 500/i.test(t)
    ) {
      return false;
    }
    if (/background:.*light-dark.*Server\s*$/i.test(t) || /at Auth \(.*@auth_core/i.test(t)) return false;
    return true;
  });
}
