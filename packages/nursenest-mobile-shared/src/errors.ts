export type MobileErrorShape = {
  userMessage: string;
  logContext: string;
  cause?: unknown;
};

export function toMobileError(
  userMessage: string,
  logContext: string,
  cause?: unknown,
): MobileErrorShape {
  return { userMessage, logContext, cause };
}

export function logMobileError(err: MobileErrorShape, log: (msg: string, extra?: Record<string, unknown>) => void) {
  const message = err.cause instanceof Error ? err.cause.message : String(err.cause ?? "");
  log(err.logContext, { userMessage: err.userMessage, causeMessage: message.slice(0, 500) });
}
