/** Re-export so legacy `client/src/data/lessons/*` imports of `@/lib/asset-url` resolve in the Next app. */
const ASSET_BASE = "/api/assets";

export function getAssetUrl(filename: string): string {
  return `${ASSET_BASE}/${encodeURIComponent(filename)}`;
}
