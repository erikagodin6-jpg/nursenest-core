export async function safeAwait<T>(
  promise: Promise<T>,
  label: string,
  timeoutMs = 1500,
): Promise<T | null> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const settled = promise.then(
      (v) => v,
      (reason: unknown) => {
        try {
          const msg = reason instanceof Error ? reason.message : String(reason);
          console.error(`[rejected] ${label}: ${msg.slice(0, 200)}`);
        } catch {
          console.error(`[rejected] ${label}`);
        }
        return null as T | null;
      },
    );
    return await Promise.race([
      settled,
      new Promise<null>((resolve) => {
        timer = setTimeout(() => {
          console.error(`[timeout] ${label}`);
          resolve(null);
        }, timeoutMs);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}
