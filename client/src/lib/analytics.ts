type EventProperties = Record<string, string | number | boolean | undefined>;

type AnalyticsProvider = (eventName: string, properties?: EventProperties) => void;

const DEDUP_WINDOW_MS = 1000;

const recentEvents = new Map<string, number>();

let provider: AnalyticsProvider | null = null;

export function setAnalyticsProvider(p: AnalyticsProvider) {
  provider = p;
}

export function trackEvent(name: string, properties?: EventProperties) {
  const now = Date.now();
  const lastFired = recentEvents.get(name);
  if (lastFired && now - lastFired < DEDUP_WINDOW_MS) {
    return;
  }
  recentEvents.set(name, now);

  if (provider) {
    provider(name, properties);
  } else {
    if (import.meta.env.DEV) {
      console.log(`[analytics] ${name}`, properties ?? "");
    }
  }
}
