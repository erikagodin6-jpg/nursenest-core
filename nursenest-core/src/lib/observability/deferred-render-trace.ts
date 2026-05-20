/**
 * Lazy entry to `render-trace` so shared layouts never static-import Sentry-adjacent tracing.
 */
export type RenderTraceModule = typeof import("@/lib/observability/render-trace");

let renderTraceModulePromise: Promise<RenderTraceModule> | null = null;

export function loadRenderTrace(): Promise<RenderTraceModule> {
  if (!renderTraceModulePromise) {
    renderTraceModulePromise = import("@/lib/observability/render-trace");
  }
  return renderTraceModulePromise;
}
