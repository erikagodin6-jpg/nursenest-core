/**
 * Single follow-up attempt on network failure (no retry storms).
 * Does not retry HTTP error responses — only thrown fetch errors.
 */
export async function fetchWithOptionalRetry(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  try {
    return await fetch(input, init);
  } catch {
    await new Promise((r) => setTimeout(r, 350));
    return await fetch(input, init);
  }
}
