type SharedLoader<T> = () => Promise<T>;

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

/** In-flight dedupe for marketing shard loads — failures resolve to `{}` so RSC never rejects on i18n. */
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
      try {
        console.error(
          JSON.stringify({
            scope: "i18n",
            event: "marketing_shared_message_load_failed",
            cacheKey: key.slice(0, 240),
            errorName: error instanceof Error ? error.name.slice(0, 80) : "non_error",
          }),
        );
      } catch {
        /* noop */
      }
      return {};
    });

  marketingShardMessageDedupe.set(key, pending);
  return pending;
}
