type SharedLoader<T> = () => Promise<T>;

function logSharedMarketingLoadFailure(key: string, error: unknown): void {
  try {
    console.error(
      JSON.stringify({
        scope: "i18n",
        event: "marketing_shared_message_load_failed",
        cacheKey: key.slice(0, 240),
        errorName: error instanceof Error ? error.name.slice(0, 80) : "non_error",
        errorMessage: error instanceof Error ? error.message.slice(0, 240) : String(error).slice(0, 240),
      }),
    );
  } catch {
    /* noop */
  }
}

export function createSharedMarketingMessageCache<T>() {
  const cache = new Map<string, Promise<T>>();

  return {
    get(key: string, load: SharedLoader<T>): Promise<T> {
      const existing = cache.get(key);
      if (existing) return existing;

      const pending = Promise.resolve()
        .then(load)
        .catch((error) => {
          cache.delete(key);
          logSharedMarketingLoadFailure(key, error);
          throw error;
        });

      cache.set(key, pending);
      return pending;
    },

    clear(): void {
      cache.clear();
    },
  };
}

/**
 * In-flight dedupe for marketing shard loads.
 *
 * Important:
 * - NEVER resolves failures to {}
 * - NEVER caches failed promises permanently
 * - Always deletes failed entries so later requests can retry
 */
const marketingShardMessageDedupe = new Map<string, Promise<Record<string, string>>>();

export function loadSharedMarketingMessagesOnce(
  key: string,
  load: SharedLoader<Record<string, string>>,
): Promise<Record<string, string>> {
  const existing = marketingShardMessageDedupe.get(key);
  if (existing) return existing;

  const pending = Promise.resolve()
    .then(load)
    .catch((error) => {
      marketingShardMessageDedupe.delete(key);
      logSharedMarketingLoadFailure(key, error);
      throw error;
    });

  marketingShardMessageDedupe.set(key, pending);
  return pending;
}

export function clearSharedMarketingMessagesForTests(): void {
  marketingShardMessageDedupe.clear();
}