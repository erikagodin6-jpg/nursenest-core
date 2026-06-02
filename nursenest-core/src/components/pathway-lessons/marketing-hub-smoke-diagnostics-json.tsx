import type { ReactElement } from "react";

/**
 * Server-rendered JSON blob for production / Playwright smoke: read with
 * `page.locator("#nn-marketing-hub-smoke-diagnostics").textContent()` then `JSON.parse`.
 */
export function MarketingHubSmokeDiagnosticsJson(props: {
  /** Keep stable for E2E selectors. */
  id?: string;
  payload: Record<string, unknown>;
}): ReactElement {
  const json = JSON.stringify(props.payload).replace(/</g, "\\u003c");
  return (
    <script
      type="application/json"
      id={props.id ?? "nn-marketing-hub-smoke-diagnostics"}
      // eslint-disable-next-line react/no-danger -- bounded JSON for smoke diagnostics only
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
