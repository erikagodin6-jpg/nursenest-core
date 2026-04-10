/**
 * Server-side HogQL for admin analytics. Requires a PostHog *personal* API key (not the project token).
 * @see https://posthog.com/docs/api/queries
 */

export type HogqlQueryResult = {
  ok: boolean;
  /** First numeric cell of the first row, when the query returns a single scalar. */
  scalar: number | null;
  error?: string;
};

export type HogqlTableResult = {
  ok: boolean;
  /** Ordered column names returned by PostHog. */
  columns: string[];
  /** Array of rows; each row is an array of primitives matching `columns`. */
  rows: (string | number | null)[][];
  error?: string;
};

function posthogApiBase(): string | null {
  const host = process.env.POSTHOG_HOST?.trim() || process.env.NEXT_PUBLIC_POSTHOG_HOST?.trim() || "https://us.i.posthog.com";
  if (!host) return null;
  return host.replace(/\/$/, "");
}

export function posthogProjectConfigured(): boolean {
  return Boolean(process.env.POSTHOG_PERSONAL_API_KEY?.trim() && process.env.POSTHOG_PROJECT_ID?.trim());
}

/**
 * Runs a HogQL query that returns a single numeric aggregate (e.g. uniq(person_id)).
 */
export async function posthogHogqlScalar(query: string): Promise<HogqlQueryResult> {
  const base = posthogApiBase();
  const key = process.env.POSTHOG_PERSONAL_API_KEY?.trim();
  const projectId = process.env.POSTHOG_PROJECT_ID?.trim();
  if (!base || !key || !projectId) {
    return { ok: false, scalar: null, error: "PostHog query API not configured" };
  }

  try {
    const res = await fetch(`${base}/api/projects/${projectId}/query/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: { kind: "HogQLQuery", query },
      }),
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return { ok: false, scalar: null, error: `HTTP ${res.status} ${text.slice(0, 200)}` };
    }

    const json = (await res.json()) as {
      results?: unknown[];
      columns?: string[];
    };

    const row = Array.isArray(json.results) ? json.results[0] : undefined;
    if (!row) {
      return { ok: true, scalar: 0 };
    }

    const cell = Array.isArray(row) ? row[0] : row;
    const n = typeof cell === "number" ? cell : typeof cell === "string" ? Number(cell) : Number(cell);
    if (!Number.isFinite(n)) {
      return { ok: false, scalar: null, error: "Unexpected HogQL result shape" };
    }
    return { ok: true, scalar: n };
  } catch (e) {
    return { ok: false, scalar: null, error: e instanceof Error ? e.message : String(e) };
  }
}
