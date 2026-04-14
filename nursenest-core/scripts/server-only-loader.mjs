/**
 * Redirects `server-only` imports to an empty stub for CLI tooling (tsx audits).
 * @type {import("node:module").ResolveHook}
 */
export async function resolve(specifier, context, nextResolve) {
  if (specifier === "server-only") {
    return {
      shortCircuit: true,
      url: new URL("./server-only-stub.mjs", import.meta.url).href,
    };
  }
  return nextResolve(specifier, context);
}
