/** Rough UTF-8 byte size of JSON serialization (for response-size instrumentation only). */
export function estimateJsonUtf8Bytes(value: unknown): number {
  try {
    return new TextEncoder().encode(JSON.stringify(value)).length;
  } catch {
    return 0;
  }
}
