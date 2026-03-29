import { PostHog } from "posthog-node";

let posthogSingleton: PostHog | null = null;

function getPostHog(): PostHog | null {
  const key = process.env.POSTHOG_KEY?.trim() || process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim();
  if (!key) return null;
  if (!posthogSingleton) {
    const host = process.env.POSTHOG_HOST?.trim() || "https://us.i.posthog.com";
    posthogSingleton = new PostHog(key, { host, flushAt: 1, flushInterval: 0 });
  }
  return posthogSingleton;
}

export { analyticsDistinctId } from "@/lib/observability/posthog-distinct-id";

export async function captureServerEvent(
  distinctId: string,
  event: string,
  properties: Record<string, string | number | boolean | undefined>,
): Promise<void> {
  const client = getPostHog();
  if (!client) return;
  try {
    client.capture({
      distinctId,
      event,
      properties: {
        ...properties,
        env: process.env.NODE_ENV,
      },
    });
    await client.flush();
  } catch {
    // never throw from analytics
  }
}
