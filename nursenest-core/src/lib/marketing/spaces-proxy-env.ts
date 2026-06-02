/**
 * DigitalOcean Spaces credentials for `/api/marketing-assets/*`.
 *
 * **Required for HTTP 200 from the proxy:** `SPACES_KEY`, `SPACES_SECRET`
 * **Optional:** `SPACES_BUCKET` (default `nursenest-images`), `SPACES_REGION` (default `tor1`), `SPACES_ENDPOINT`
 *
 * **Browser behavior:** When `NEXT_PUBLIC_MARKETING_USE_SPACES_PROXY=false` (default), images use public CDN URLs
 * and do not hit this route. When `true`, the proxy must be configured or requests return 503 — UI falls back via
 * `getMarketingHeroImageUrlChain` / `getHeaderBrandLogoLoadChain` (public URL → local SVG).
 */
export function getMissingSpacesProxyEnvKeys(): string[] {
  const missing: string[] = [];
  if (!process.env.SPACES_KEY?.trim()) missing.push("SPACES_KEY");
  if (!process.env.SPACES_SECRET?.trim()) missing.push("SPACES_SECRET");
  return missing;
}

export function isSpacesProxyConfigured(): boolean {
  return getMissingSpacesProxyEnvKeys().length === 0;
}
