/**
 * Shared DigitalOcean Spaces (S3-compatible) settings for uploads, reporting, and cleanup.
 */

export function getSpacesBucket(): string {
  return process.env.SPACES_BUCKET?.trim() || "nursenest-images";
}

export function getSpacesRegion(): string {
  return process.env.SPACES_REGION?.trim() || "tor1";
}

export function getSpacesEndpoint(): string {
  const override = process.env.SPACES_ENDPOINT?.trim();
  if (override) return override;
  const region = getSpacesRegion();
  return `https://${region}.digitaloceanspaces.com`;
}

/** Public CDN bases used to build browser-facing URLs and to parse DB-stored URLs back to object keys. */
export function getSpacesPublicBaseUrls(): string[] {
  const bucket = getSpacesBucket();
  const region = getSpacesRegion();
  const extras = (process.env.SPACES_EXTRA_PUBLIC_BASES ?? "")
    .split(",")
    .map((s) => s.trim().replace(/\/$/, ""))
    .filter(Boolean);
  return [
    `https://${bucket}.${region}.cdn.digitaloceanspaces.com`,
    `https://${bucket}.${region}.digitaloceanspaces.com`,
    ...extras,
  ];
}

export function publicCdnUrlForKey(objectKey: string): string {
  const key = objectKey.replace(/^\/+/, "");
  const [base] = getSpacesPublicBaseUrls();
  return `${base}/${key}`;
}

export function isSpacesUploadConfigured(): boolean {
  return Boolean(process.env.SPACES_KEY?.trim() && process.env.SPACES_SECRET?.trim());
}
