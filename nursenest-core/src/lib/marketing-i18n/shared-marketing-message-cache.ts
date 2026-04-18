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

const sharedMarketingMessageCache = createSharedMarketingMessageCache<Record<string, string>>();

export function loadSharedMarketingMessagesOnce(
  key: string,
  load: SharedLoader<Record<string, string>>,
): Promise<Record<string, string>> {
  return sharedMarketingMessageCache.get(key, load);
}
