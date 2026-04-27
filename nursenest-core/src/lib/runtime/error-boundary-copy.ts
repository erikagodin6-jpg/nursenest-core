"use client";

const TRANSIENT_ERROR_PATTERNS = [
  /abort/i,
  /chunkloaderror/i,
  /connection/i,
  /failed to fetch/i,
  /loading chunk/i,
  /network/i,
  /temporar/i,
  /timeout/i,
  /timed out/i,
];

export function isLikelyTransientBoundaryError(error: Error & { digest?: string }): boolean {
  const haystack = [error.name, error.message, error.digest].filter(Boolean).join(" ");
  return TRANSIENT_ERROR_PATTERNS.some((pattern) => pattern.test(haystack));
}

export function errorBoundaryDescription({
  error,
  fallback,
}: {
  error: Error & { digest?: string };
  fallback: string;
}): string {
  if (process.env.NODE_ENV !== "development") return fallback;
  const message = error.message?.trim();
  return message ? `${fallback} Dev error: ${message}` : fallback;
}
