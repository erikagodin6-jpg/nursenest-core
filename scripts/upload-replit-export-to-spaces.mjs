#!/usr/bin/env node
/**
 * Recursively upload a local folder (e.g. replit-export/) to DigitalOcean Spaces.
 * Preserves directory structure as object key prefixes (public/..., private-products/...).
 *
 * Required env:
 *   SPACES_KEY, SPACES_SECRET
 *
 * Optional env:
 *   REPLIT_EXPORT_DIR     — path to folder to upload (default: ./replit-export)
 *   SPACES_BUCKET         — default: nursenest-images
 *   SPACES_REGION         — default: tor1 (used for endpoint + CDN hostname in logs)
 *   SPACES_ENDPOINT       — override API endpoint (default: https://{SPACES_REGION}.digitaloceanspaces.com)
 *   SPACES_PREFIX         — optional key prefix (no leading slash)
 *   SPACES_PROGRESS_EVERY — log after every N successful uploads (default: 50)
 *   SPACES_FAST_SKIP      — if "1", skip when remote size matches only (no local MD5 read; faster, weaker idempotency)
 *   SPACES_FORCE_UPLOAD   — if "1", always PutObject (no Head skip)
 *   SPACES_UPLOAD_MANIFEST — if set, write JSON report to this path
 *
 * Idempotency (default): HeadObject → same ContentLength + ETag equals local MD5 (single-part uploads only).
 *
 * Public URL shape:
 *   https://nursenest-images.tor1.cdn.digitaloceanspaces.com/<key>
 *
 * Run from nursenest-core:
 *   node scripts/upload-replit-export-to-spaces.mjs
 */

import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import fs from "node:fs";
import path from "node:path";

import { HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import mime from "mime-types";

const PROGRESS_EVERY = Number(process.env.SPACES_PROGRESS_EVERY || "50") || 50;
const FAST_SKIP = ["1", "true", "yes"].includes(String(process.env.SPACES_FAST_SKIP || "").toLowerCase());
const FORCE = ["1", "true", "yes"].includes(String(process.env.SPACES_FORCE_UPLOAD || "").toLowerCase());

function requireEnv(name) {
  const v = process.env[name];
  if (!v?.trim()) {
    console.error(`Missing required environment variable: ${name}`);
    process.exit(1);
  }
  return v.trim();
}

function walkFiles(dir, acc) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walkFiles(full, acc);
    else if (e.isFile()) acc.push(full);
  }
}

function toObjectKey(localRoot, absolutePath) {
  const rel = path.relative(localRoot, absolutePath);
  if (rel.startsWith("..") || path.isAbsolute(rel)) {
    throw new Error(`Path escapes local root: ${absolutePath}`);
  }
  return rel.split(path.sep).join("/");
}

function normalizeEtag(etag) {
  if (!etag) return "";
  return String(etag).replace(/^W\//, "").replaceAll('"', "").trim();
}

function etagLooksMultipart(etagNorm) {
  return etagNorm.includes("-");
}

async function md5HexOfFile(filePath) {
  const hash = createHash("md5");
  const stream = createReadStream(filePath);
  for await (const chunk of stream) {
    hash.update(chunk);
  }
  return hash.digest("hex");
}

function contentTypeFor(filePath) {
  const ct = mime.lookup(filePath);
  return ct || "application/octet-stream";
}

function isNotFoundError(e) {
  const status = e?.$metadata?.httpStatusCode;
  const name = e?.name || "";
  const code = e?.Code || e?.code || "";
  return name === "NotFound" || name === "NoSuchKey" || code === "NoSuchKey" || status === 404;
}

async function main() {
  const accessKeyId = requireEnv("SPACES_KEY");
  const secretAccessKey = requireEnv("SPACES_SECRET");
  const bucket = (process.env.SPACES_BUCKET || "nursenest-images").trim();
  const spacesRegion = (process.env.SPACES_REGION || "tor1").trim();
  const endpoint = (
    process.env.SPACES_ENDPOINT?.trim() || `https://${spacesRegion}.digitaloceanspaces.com`
  ).replace(/\/$/, "");

  const prefixRaw = process.env.SPACES_PREFIX || "";
  const prefix =
    prefixRaw === "" ? "" : prefixRaw.replace(/^\/+/, "").replace(/\/+$/, "") + "/";

  const localRoot = path.resolve(
    process.cwd(),
    process.env.REPLIT_EXPORT_DIR || "./replit-export",
  );

  if (!fs.existsSync(localRoot) || !fs.statSync(localRoot).isDirectory()) {
    console.error(`Not a directory: ${localRoot}`);
    process.exit(1);
  }

  const client = new S3Client({
    region: "us-east-1",
    endpoint,
    credentials: { accessKeyId, secretAccessKey },
    forcePathStyle: false,
  });

  const files = [];
  walkFiles(localRoot, files);
  files.sort();

  let uploaded = 0;
  let skipped = 0;
  let failed = 0;
  let processed = 0;
  const manifestPath = (process.env.SPACES_UPLOAD_MANIFEST || "").trim();
  const manifestRows = [];

  console.log(`Local root: ${localRoot}`);
  console.log(`Bucket: ${bucket}`);
  console.log(`Spaces region (CDN): ${spacesRegion}`);
  console.log(`API endpoint: ${endpoint}`);
  console.log(`Files found: ${files.length}`);
  if (prefix) console.log(`Key prefix: ${prefix}`);
  console.log(`CDN base: https://${bucket}.${spacesRegion}.cdn.digitaloceanspaces.com/`);
  console.log(`Fast skip (size-only): ${FAST_SKIP}  Force upload: ${FORCE}`);
  console.log(`Upload progress log every: ${PROGRESS_EVERY} successful uploads`);
  console.log("---");

  for (const filePath of files) {
    const relKey = toObjectKey(localRoot, filePath);
    const Key = prefix + relKey;
    const stat = fs.statSync(filePath);
    const ContentType = contentTypeFor(filePath);
    const ContentLength = stat.size;

    let shouldUpload = true;
    let rowStatus = "pending";

    if (!FORCE) {
      try {
        const head = await client.send(new HeadObjectCommand({ Bucket: bucket, Key }));
        const remoteLen = head.ContentLength ?? -1;
        const etagNorm = normalizeEtag(head.ETag);

        if (remoteLen === ContentLength) {
          if (FAST_SKIP) {
            shouldUpload = false;
          } else if (etagNorm && !etagLooksMultipart(etagNorm)) {
            const localMd5 = await md5HexOfFile(filePath);
            if (localMd5 === etagNorm) {
              shouldUpload = false;
            }
          }
        }
      } catch (e) {
        if (!isNotFoundError(e)) {
          console.error(`HeadObject failed for ${Key}:`, e?.message || e);
          failed += 1;
          rowStatus = "failed_head";
          processed += 1;
          manifestRows.push({
            objectKey: Key,
            localPath: filePath,
            contentType: ContentType,
            status: rowStatus,
          });
          continue;
        }
      }
    }

    if (!shouldUpload) {
      skipped += 1;
      rowStatus = "skipped";
      processed += 1;
      manifestRows.push({
        objectKey: Key,
        localPath: filePath,
        contentType: ContentType,
        status: rowStatus,
      });
      continue;
    }

    try {
      await client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key,
          Body: createReadStream(filePath),
          ContentLength,
          ContentType,
          ACL: "public-read",
          CacheControl: "public, max-age=31536000, immutable",
        }),
      );
      uploaded += 1;
      rowStatus = "uploaded";
      if (uploaded % PROGRESS_EVERY === 0) {
        console.log(
          `[upload progress] ${uploaded} uploads complete — skipped=${skipped} failed=${failed} — last key: ${Key}`,
        );
      }
    } catch (e) {
      console.error(`PutObject failed for ${Key}:`, e?.message || e);
      failed += 1;
      rowStatus = "failed_put";
    }
    processed += 1;
    manifestRows.push({
      objectKey: Key,
      localPath: filePath,
      contentType: ContentType,
      status: rowStatus,
    });
  }

  console.log("---");
  console.log("Done.");
  console.log(`Uploaded: ${uploaded}  Skipped (unchanged): ${skipped}  Failed: ${failed}`);

  if (manifestPath) {
    const report = {
      generatedAt: new Date().toISOString(),
      localRoot,
      bucket,
      spacesRegion,
      endpoint,
      summary: { total: files.length, uploaded, skipped, failed },
      files: manifestRows,
    };
    fs.writeFileSync(manifestPath, JSON.stringify(report, null, 2), "utf8");
    console.log(`Wrote manifest: ${manifestPath}`);
  }

  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
