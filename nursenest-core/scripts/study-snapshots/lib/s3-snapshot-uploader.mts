/**
 * S3-compatible snapshot uploader for DigitalOcean Spaces.
 *
 * Required env vars:
 *   SPACES_ENDPOINT   — e.g. https://tor1.digitaloceanspaces.com
 *   SPACES_BUCKET     — e.g. nursenest-resilience
 *   SPACES_KEY        — DigitalOcean Spaces access key
 *   SPACES_SECRET     — DigitalOcean Spaces secret key
 *   SPACES_REGION     — default "us-east-1" (Spaces uses this for signing)
 *
 * Optional:
 *   SPACES_PREFIX     — key prefix, default "content-snapshots"
 *   SPACES_ACL        — default "public-read"
 *   SPACES_DRY_RUN    — if "true", logs upload without actually uploading
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  S3Client,
  PutObjectCommand,
  type PutObjectCommandInput,
} from "@aws-sdk/client-s3";

function requireEnv(name: string): string {
  const v = process.env[name]?.trim();
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

function buildClient(): S3Client {
  const endpoint = requireEnv("SPACES_ENDPOINT");
  const region = process.env.SPACES_REGION?.trim() || "us-east-1";
  const key = requireEnv("SPACES_KEY");
  const secret = requireEnv("SPACES_SECRET");

  return new S3Client({
    endpoint,
    region,
    credentials: { accessKeyId: key, secretAccessKey: secret },
    forcePathStyle: false,
  });
}

let _client: S3Client | null = null;
function getClient(): S3Client {
  if (!_client) _client = buildClient();
  return _client;
}

export interface UploadResult {
  localPath: string;
  s3Key: string;
  bucket: string;
  dryRun: boolean;
  ok: boolean;
  error?: string;
}

/**
 * Upload a local JSON snapshot file to Spaces.
 * @param localPath — absolute path to the JSON file on disk
 * @param relativeKey — relative key within the prefix, e.g. "flashcards/hub-bootstrap-US-RN.json"
 */
export async function uploadSnapshotToSpaces(
  localPath: string,
  relativeKey: string,
): Promise<UploadResult> {
  const bucket = requireEnv("SPACES_BUCKET");
  const prefix = (process.env.SPACES_PREFIX?.trim() || "content-snapshots").replace(/\/$/, "");
  const dryRun = process.env.SPACES_DRY_RUN?.trim() === "true";
  const acl = (process.env.SPACES_ACL?.trim() || "public-read") as PutObjectCommandInput["ACL"];
  const s3Key = `${prefix}/${relativeKey.replace(/^\/+/, "")}`;

  if (dryRun) {
    console.log(`[spaces] DRY RUN — would upload: ${localPath} → s3://${bucket}/${s3Key}`);
    return { localPath, s3Key, bucket, dryRun: true, ok: true };
  }

  try {
    const body = await readFile(localPath);
    const cmd = new PutObjectCommand({
      Bucket: bucket,
      Key: s3Key,
      Body: body,
      ContentType: "application/json; charset=utf-8",
      CacheControl: "public, max-age=3600, stale-while-revalidate=86400",
      ACL: acl,
    });
    await getClient().send(cmd);
    console.log(`[spaces] Uploaded: s3://${bucket}/${s3Key} (${body.length} bytes)`);
    return { localPath, s3Key, bucket, dryRun: false, ok: true };
  } catch (err: unknown) {
    const msg = String(err instanceof Error ? err.message : err);
    console.error(`[spaces] Upload failed: ${s3Key} — ${msg}`);
    return { localPath, s3Key, bucket, dryRun: false, ok: false, error: msg };
  }
}

/**
 * Upload a JSON string directly (without an on-disk file).
 */
export async function uploadJsonToSpaces(
  relativeKey: string,
  jsonContent: string,
): Promise<UploadResult> {
  const bucket = requireEnv("SPACES_BUCKET");
  const prefix = (process.env.SPACES_PREFIX?.trim() || "content-snapshots").replace(/\/$/, "");
  const dryRun = process.env.SPACES_DRY_RUN?.trim() === "true";
  const acl = (process.env.SPACES_ACL?.trim() || "public-read") as PutObjectCommandInput["ACL"];
  const s3Key = `${prefix}/${relativeKey.replace(/^\/+/, "")}`;
  const localPath = `(in-memory) ${relativeKey}`;

  if (dryRun) {
    console.log(`[spaces] DRY RUN — would upload in-memory JSON → s3://${bucket}/${s3Key}`);
    return { localPath, s3Key, bucket, dryRun: true, ok: true };
  }

  try {
    const body = Buffer.from(jsonContent, "utf8");
    const cmd = new PutObjectCommand({
      Bucket: bucket,
      Key: s3Key,
      Body: body,
      ContentType: "application/json; charset=utf-8",
      CacheControl: "public, max-age=3600, stale-while-revalidate=86400",
      ACL: acl,
    });
    await getClient().send(cmd);
    console.log(`[spaces] Uploaded: s3://${bucket}/${s3Key} (${body.length} bytes)`);
    return { localPath, s3Key, bucket, dryRun: false, ok: true };
  } catch (err: unknown) {
    const msg = String(err instanceof Error ? err.message : err);
    console.error(`[spaces] Upload failed: ${s3Key} — ${msg}`);
    return { localPath, s3Key, bucket, dryRun: false, ok: false, error: msg };
  }
}

/** Upload a manifest.json string to the root of the prefix. */
export async function uploadManifestToSpaces(manifestJson: string): Promise<UploadResult> {
  return uploadJsonToSpaces("manifest.json", manifestJson);
}

export function spacesConfigured(): boolean {
  const required = ["SPACES_ENDPOINT", "SPACES_BUCKET", "SPACES_KEY", "SPACES_SECRET"];
  return required.every((k) => !!process.env[k]?.trim());
}

export function spacesPublicUrl(relativeKey: string): string | null {
  const endpoint = process.env.SPACES_ENDPOINT?.trim();
  const bucket = process.env.SPACES_BUCKET?.trim();
  const prefix = (process.env.SPACES_PREFIX?.trim() || "content-snapshots").replace(/\/$/, "");
  if (!endpoint || !bucket) return null;
  const base = endpoint.replace("://", `://${bucket}.`);
  return `${base}/${prefix}/${relativeKey}`;
}
