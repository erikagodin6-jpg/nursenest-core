#!/usr/bin/env node
/**
 * Recursively upload a local folder to DigitalOcean Spaces (S3-compatible).
 *
 * Env (required): SPACES_KEY, SPACES_SECRET
 * Env (optional):
 *   REPLIT_EXPORT_DIR — absolute or relative path to folder to upload (default: ./replit-export)
 *   SPACES_BUCKET     — default: nursenest-images
 *   SPACES_REGION     — default: tor1
 *   SPACES_PREFIX     — optional key prefix (no leading slash; trailing slash optional)
 *
 * Idempotency: skips when HeadObject reports same size and ETag matches MD5 (single-part objects).
 *
 * CDN URL shape: https://<bucket>.<region>.cdn.digitaloceanspaces.com/<key>
 *
 * Env (optional): SPACES_UPLOAD_MANIFEST — if set, write JSON summary + per-file rows here.
 */

import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import fs from "node:fs";
import path from "node:path";

import { HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import mime from "mime-types";

const PROGRESS_EVERY = Number(process.env.SPACES_PROGRESS_EVERY || "50") || 50;

function requireEnv(name) {
  const v = process.env[name];
  if (!v) {
    console.error(`Missing required environment variable: ${name}`);
    process.exit(1);
  }
  return v;
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

async function main() {
  const accessKeyId = requireEnv("SPACES_KEY");
  const secretAccessKey = requireEnv("SPACES_SECRET");
  const bucket = process.env.SPACES_BUCKET || "nursenest-images";
  const region = process.env.SPACES_REGION || "tor1";
  const prefixRaw = process.env.SPACES_PREFIX || "";
  const prefix =
    prefixRaw === ""
      ? ""
      : prefixRaw.replace(/^\/+/, "").replace(/\/+$/, "") + "/";

  const localRoot = path.resolve(
    process.cwd(),
    process.env.REPLIT_EXPORT_DIR || "./replit-export",
  );

  if (!fs.existsSync(localRoot) || !fs.statSync(localRoot).isDirectory()) {
    console.error(`Not a directory: ${localRoot}`);
    process.exit(1);
  }

  const endpoint = `https://${region}.digitaloceanspaces.com`;
  const client = new S3Client({
    region,
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
  console.log(`Bucket: ${bucket}  Region: ${region}`);
  console.log(`Endpoint: ${endpoint}`);
  console.log(`Files found: ${files.length}`);
  if (prefix) console.log(`Key prefix: ${prefix}`);
  console.log(`CDN base: https://${bucket}.${region}.cdn.digitaloceanspaces.com/`);

  for (const filePath of files) {
    const relKey = toObjectKey(localRoot, filePath);
    const Key = prefix + relKey;
    const stat = fs.statSync(filePath);
    const ContentType = contentTypeFor(filePath);
    const ContentLength = stat.size;

    let shouldUpload = true;
    let rowStatus = "pending";

    try {
      const head = await client.send(
        new HeadObjectCommand({ Bucket: bucket, Key }),
      );
      const remoteLen = head.ContentLength ?? -1;
      const etagNorm = normalizeEtag(head.ETag);

      if (
        remoteLen === ContentLength &&
        etagNorm &&
        !etagLooksMultipart(etagNorm)
      ) {
        const localMd5 = await md5HexOfFile(filePath);
        if (localMd5 === etagNorm) {
          shouldUpload = false;
        }
      }
      // Multipart ETags are not raw MD5; re-upload those objects if you need a strict match.
    } catch (e) {
      const status = e?.$metadata?.httpStatusCode;
      const name = e?.name || "";
      if (name !== "NotFound" && name !== "NoSuchKey" && status !== 404) {
        console.error(`HeadObject failed for ${Key}:`, e?.message || e);
        failed += 1;
        rowStatus = "failed_head";
        processed += 1;
        manifestRows.push({ objectKey: Key, localPath: filePath, contentType: ContentType, status: rowStatus });
        if (processed % PROGRESS_EVERY === 0) {
          console.log(
            `[${processed}/${files.length}] uploaded=${uploaded} skipped=${skipped} failed=${failed} — last: ${Key}`,
          );
        }
        continue;
      }
    }

    if (!shouldUpload) {
      skipped += 1;
      rowStatus = "skipped";
      processed += 1;
      manifestRows.push({ objectKey: Key, localPath: filePath, contentType: ContentType, status: rowStatus });
      if (processed % PROGRESS_EVERY === 0) {
        console.log(
          `[${processed}/${files.length}] uploaded=${uploaded} skipped=${skipped} failed=${failed} — last: ${Key}`,
        );
      }
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
        }),
      );
      uploaded += 1;
      rowStatus = "uploaded";
    } catch (e) {
      console.error(`PutObject failed for ${Key}:`, e?.message || e);
      failed += 1;
      rowStatus = "failed_put";
    }
    processed += 1;
    manifestRows.push({ objectKey: Key, localPath: filePath, contentType: ContentType, status: rowStatus });
    if (processed % PROGRESS_EVERY === 0) {
      console.log(
        `[${processed}/${files.length}] uploaded=${uploaded} skipped=${skipped} failed=${failed} — last: ${Key}`,
      );
    }
  }

  console.log("Done.");
  console.log(`Uploaded: ${uploaded}  Skipped (unchanged): ${skipped}  Failed: ${failed}`);

  if (manifestPath) {
    const report = {
      generatedAt: new Date().toISOString(),
      localRoot,
      bucket,
      region,
      summary: { total: files.length, uploaded, skipped, failed },
      files: manifestRows,
    };
    fs.writeFileSync(manifestPath, JSON.stringify(report, null, 2), "utf8");
    console.log(`Wrote manifest: ${manifestPath}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
