#!/usr/bin/env node
/**
 * Migrate public images from a Google Cloud Storage HTTP base URL to DigitalOcean Spaces.
 *
 * - Streams download + upload (no full-file memory buffering).
 * - Idempotent: skips upload if the object already exists (HeadObject).
 * - Retries failed download/upload up to 3 times with backoff.
 *
 * Prerequisites: npm install (see devDependencies for migrate:images).
 *
 * Manifest (MIGRATION_MANIFEST):
 *   - JSON: array of object paths, or { "paths": ["a/b.png", ...] }
 *   - Text: one path per line; # starts a comment; blank lines ignored
 *
 * Security: use .env from .env.example; rotate any credentials that were ever exposed.
 */

import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import { Readable, Writable } from "node:stream";
import axios from "axios";
import mime from "mime-types";
import { S3Client, HeadObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

const RESULTS_FILE =
  process.env.MIGRATION_RESULTS_FILE || path.join(process.cwd(), "migration-results.json");
const MAX_ATTEMPTS = 3;
const BASE_BACKOFF_MS = 400;

function requireEnv(name) {
  const v = process.env[name];
  if (!v || !String(v).trim()) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return String(v).trim();
}

function normalizeBaseUrl(base) {
  const b = base.trim();
  if (!b.endsWith("/")) return `${b}/`;
  return b;
}

function normalizeObjectPath(p) {
  return String(p).trim().replace(/^\/+/, "");
}

function sourceUrl(baseUrl, objectPath) {
  const rel = normalizeObjectPath(objectPath);
  return new URL(rel, baseUrl).href;
}

function destKey(objectPath) {
  const prefix = (process.env.SPACES_KEY_PREFIX || "").replace(/^\/+/, "").replace(/\/+$/, "");
  const rel = normalizeObjectPath(objectPath);
  return prefix ? `${prefix}/${rel}` : rel;
}

async function sleep(ms) {
  await new Promise((r) => setTimeout(r, ms));
}

async function withRetry(label, fn) {
  let lastErr;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      return await fn(attempt);
    } catch (e) {
      lastErr = e;
      const msg = e instanceof Error ? e.message : String(e);
      console.warn(`[retry] ${label} attempt ${attempt}/${MAX_ATTEMPTS} failed: ${msg}`);
      if (attempt < MAX_ATTEMPTS) {
        await sleep(BASE_BACKOFF_MS * attempt);
      }
    }
  }
  throw lastErr;
}

async function loadManifest(manifestPath) {
  const abs = path.isAbsolute(manifestPath)
    ? manifestPath
    : path.join(process.cwd(), manifestPath);
  const raw = await fs.readFile(abs, "utf8");
  const trimmed = raw.trim();
  if (trimmed.startsWith("[")) {
    const data = JSON.parse(trimmed);
    if (!Array.isArray(data)) throw new Error("Manifest JSON must be an array of paths");
    return data.map(String);
  }
  if (trimmed.startsWith("{")) {
    const data = JSON.parse(trimmed);
    const paths = data.paths;
    if (!Array.isArray(paths)) throw new Error('Manifest JSON object must have a "paths" array');
    return paths.map(String);
  }
  return trimmed
    .split("\n")
    .map((line) => line.replace(/#.*$/, "").trim())
    .filter(Boolean);
}

async function objectExists(client, bucket, key) {
  try {
    await client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
    return true;
  } catch (e) {
    const status = e?.$metadata?.httpStatusCode;
    const name = e?.name || "";
    if (status === 404 || name === "NotFound") return false;
    throw e;
  }
}

function createDevNullWritable() {
  return new Writable({
    write(_chunk, _enc, cb) {
      cb();
    },
  });
}

/** Stream from axios response into S3 multipart upload without buffering whole file. */
async function streamUploadToSpaces({ client, bucket, key, contentType, bodyStream }) {
  const upload = new Upload({
    client,
    params: {
      Bucket: bucket,
      Key: key,
      Body: bodyStream,
      ContentType: contentType || "application/octet-stream",
      ...(process.env.SPACES_OBJECT_ACL
        ? { ACL: process.env.SPACES_OBJECT_ACL }
        : {}),
    },
    queueSize: 4,
    partSize: 8 * 1024 * 1024,
    leavePartsOnError: false,
  });
  await upload.done();
}

async function migrateOne({
  s3,
  bucket,
  baseUrl,
  objectPath,
  dryRun,
}) {
  const originalUrl = sourceUrl(baseUrl, objectPath);
  const key = destKey(objectPath);
  const contentType = mime.lookup(objectPath) || "application/octet-stream";

  const entry = {
    object_path: normalizeObjectPath(objectPath),
    original_url: originalUrl,
    dest_key: key,
    status: "pending",
    error: null,
    attempts: 0,
  };

  try {
    if (!dryRun && (await objectExists(s3, bucket, key))) {
      entry.status = "skipped";
      entry.note = "already_exists";
      return entry;
    }

    await withRetry(`download+upload ${key}`, async (attempt) => {
      entry.attempts = attempt;
      const response = await axios.get(originalUrl, {
        responseType: "stream",
        timeout: Number(process.env.DOWNLOAD_TIMEOUT_MS || 120_000),
        validateStatus: (s) => s >= 200 && s < 300,
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });

      const stream = response.data;
      if (!Readable.isReadable(stream)) {
        throw new Error("Download response is not a readable stream");
      }

      if (dryRun) {
        await pipeline(stream, createDevNullWritable());
        return;
      }

      await streamUploadToSpaces({
        client: s3,
        bucket,
        key,
        contentType,
        bodyStream: stream,
      });
    });

    entry.status = dryRun ? "dry_run" : "uploaded";
  } catch (e) {
    entry.status = "failed";
    entry.error = e instanceof Error ? e.message : String(e);
  }

  return entry;
}

async function main() {
  const baseUrl = normalizeBaseUrl(requireEnv("GOOGLE_BUCKET_BASE_URL"));
  const manifestPath = requireEnv("MIGRATION_MANIFEST");
  const region = requireEnv("SPACES_REGION");
  const bucket = requireEnv("SPACES_BUCKET");
  const accessKeyId = requireEnv("SPACES_KEY");
  const secretAccessKey = requireEnv("SPACES_SECRET");
  const dryRun = ["1", "true", "yes"].includes(String(process.env.DRY_RUN || "").toLowerCase());

  const endpoint =
    process.env.SPACES_ENDPOINT || `https://${region}.digitaloceanspaces.com`;

  const s3 = new S3Client({
    region,
    endpoint,
    credentials: { accessKeyId, secretAccessKey },
    forcePathStyle: false,
  });

  const paths = await loadManifest(manifestPath);
  const startedAt = new Date().toISOString();
  const items = [];

  console.log(`Manifest: ${paths.length} path(s), dryRun=${dryRun}`);
  console.log(`Source base: ${baseUrl}`);
  console.log(`Destination: ${endpoint} / ${bucket}`);

  for (const p of paths) {
    const item = await migrateOne({ s3, bucket, baseUrl, objectPath: p, dryRun });
    items.push(item);
    console.log(`[${item.status}] ${item.dest_key}`);
  }

  const finishedAt = new Date().toISOString();
  const report = {
    startedAt,
    finishedAt,
    dryRun,
    baseUrl,
    bucket,
    region,
    endpoint,
    itemCount: items.length,
    items,
  };

  await fs.writeFile(RESULTS_FILE, JSON.stringify(report, null, 2), "utf8");
  console.log(`Wrote ${RESULTS_FILE}`);

  const failed = items.filter((i) => i.status === "failed").length;
  if (failed) process.exitCode = 1;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
