type RenderTraceMeta = Record<string, string | number | boolean | undefined>;

export function renderTrace(label: string, meta?: RenderTraceMeta): void {
  const payload =
    meta && Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : "";
  console.error(`[trace] ${label}${payload}`);
}
