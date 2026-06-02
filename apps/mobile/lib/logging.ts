const SENSITIVE_KEYS = ["password", "token", "authorization", "access_token", "refresh_token", "email", "phone", "cookie"];

function redactValue(key: string, value: unknown): unknown {
  const lower = key.toLowerCase();
  if (SENSITIVE_KEYS.some((s) => lower.includes(s))) return "[redacted]";
  return value;
}

export function sanitizeContext(ctx?: Record<string, unknown>): Record<string, unknown> | undefined {
  if (!ctx) return undefined;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(ctx)) {
    if (v !== null && typeof v === "object" && !Array.isArray(v)) {
      out[k] = sanitizeContext(v as Record<string, unknown>);
    } else {
      out[k] = redactValue(k, v);
    }
  }
  return out;
}

type RemoteHandler = (level: "debug" | "info" | "warn" | "error", message: string, ctx?: Record<string, unknown>) => void;

const remoteHandlers: RemoteHandler[] = [];

export function registerRemoteLogger(handler: RemoteHandler): () => void {
  remoteHandlers.push(handler);
  return () => {
    const i = remoteHandlers.indexOf(handler);
    if (i >= 0) remoteHandlers.splice(i, 1);
  };
}

function emitRemote(
  level: "debug" | "info" | "warn" | "error",
  message: string,
  ctx?: Record<string, unknown>,
) {
  const safe = __DEV__ ? ctx : sanitizeContext(ctx);
  for (const h of remoteHandlers) {
    try {
      h(level, message, safe);
    } catch {
      /* ignore */
    }
  }
}

export const log = {
  debug(message: string, ctx?: Record<string, unknown>) {
    if (__DEV__) {
      console.log(`[nn:debug] ${message}`, ctx ?? "");
    }
    emitRemote("debug", message, ctx);
  },
  info(message: string, ctx?: Record<string, unknown>) {
    if (__DEV__) {
      console.info(`[nn:info] ${message}`, ctx ?? "");
    } else emitRemote("info", message, sanitizeContext(ctx));
  },
  warn(message: string, ctx?: Record<string, unknown>) {
    if (__DEV__) {
      console.warn(`[nn:warn] ${message}`, ctx ?? "");
    } else emitRemote("warn", message, sanitizeContext(ctx));
  },
  error(message: string, ctx?: Record<string, unknown>) {
    const safe = sanitizeContext(ctx);
    if (__DEV__) {
      console.error(`[nn:error] ${message}`, safe ?? "");
    } else emitRemote("error", message, safe);
  },
};
