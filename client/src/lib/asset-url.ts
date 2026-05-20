const ASSET_BASE = "/api/assets";

export function getAssetUrl(filename: string): string {
  return `${ASSET_BASE}/${encodeURIComponent(filename)}`;
}
