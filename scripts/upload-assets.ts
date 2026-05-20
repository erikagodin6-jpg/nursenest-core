import { Storage } from "@google-cloud/storage";
import fs from "fs";
import path from "path";

const REPLIT_SIDECAR_ENDPOINT = "http://127.0.0.1:1106";

const storageClient = new Storage({
  credentials: {
    audience: "replit",
    subject_token_type: "access_token",
    token_url: `${REPLIT_SIDECAR_ENDPOINT}/token`,
    type: "external_account",
    credential_source: {
      url: `${REPLIT_SIDECAR_ENDPOINT}/credential`,
      format: { type: "json", subject_token_field_name: "access_token" },
    },
    universe_domain: "googleapis.com",
  },
  projectId: "",
});

const publicDir = (process.env.PUBLIC_OBJECT_SEARCH_PATHS || "").split(",")[0]?.trim();
if (!publicDir) {
  console.error("PUBLIC_OBJECT_SEARCH_PATHS not set");
  process.exit(1);
}

const parts = publicDir.replace(/^\//, "").split("/");
const bucketName = parts[0];
const publicPrefix = parts.slice(1).join("/");
const bucket = storageClient.bucket(bucketName);

const CONTENT_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".mp4": "video/mp4",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".gif": "image/gif",
};

async function uploadFile(localPath: string, destName: string): Promise<boolean> {
  const ext = path.extname(localPath).toLowerCase();
  const contentType = CONTENT_TYPES[ext] || "application/octet-stream";

  const objectName = `${publicPrefix}/${destName}`;
  const file = bucket.file(objectName);

  const [exists] = await file.exists();
  if (exists) {
    const localStat = fs.statSync(localPath);
    const [metadata] = await file.getMetadata();
    if (metadata.size && parseInt(String(metadata.size)) === localStat.size) {
      return false;
    }
  }

  await bucket.upload(localPath, {
    destination: objectName,
    metadata: {
      contentType,
      cacheControl: "public, max-age=31536000, immutable",
    },
  });

  return true;
}

async function main() {
  const manifest: Record<string, string> = {};
  let uploaded = 0;
  let skipped = 0;
  let errors = 0;

  const filesToUpload: Array<{ localPath: string; destName: string }> = [];

  const srcAssetsDir = path.resolve("client/src/assets");
  if (fs.existsSync(srcAssetsDir)) {
    const files = fs.readdirSync(srcAssetsDir).filter(f => {
      const ext = path.extname(f).toLowerCase();
      return [".png", ".jpg", ".jpeg", ".mp4", ".webp", ".svg", ".gif"].includes(ext);
    });
    for (const f of files) {
      filesToUpload.push({ localPath: path.join(srcAssetsDir, f), destName: f });
    }
  }

  const srcImagesDir = path.resolve("client/src/assets/images");
  if (fs.existsSync(srcImagesDir)) {
    const files = fs.readdirSync(srcImagesDir).filter(f => {
      const ext = path.extname(f).toLowerCase();
      return [".png", ".jpg", ".jpeg", ".mp4", ".webp", ".svg", ".gif"].includes(ext);
    });
    for (const f of files) {
      filesToUpload.push({ localPath: path.join(srcImagesDir, f), destName: f });
    }
  }

  const attachedDir = path.resolve("attached_assets");
  if (fs.existsSync(attachedDir)) {
    const files = fs.readdirSync(attachedDir).filter(f => {
      const ext = path.extname(f).toLowerCase();
      return [".png", ".jpg", ".jpeg", ".mp4", ".webp", ".svg", ".gif"].includes(ext);
    });
    for (const f of files) {
      filesToUpload.push({ localPath: path.join(attachedDir, f), destName: f });
    }
  }

  const videoDir = path.resolve("client/public/videos");
  if (fs.existsSync(videoDir)) {
    const files = fs.readdirSync(videoDir).filter(f => {
      const ext = path.extname(f).toLowerCase();
      return [".mp4", ".webm", ".ogg"].includes(ext);
    });
    for (const f of files) {
      filesToUpload.push({ localPath: path.join(videoDir, f), destName: f });
    }
  }

  const seen = new Set<string>();
  const deduped: typeof filesToUpload = [];
  for (const item of filesToUpload) {
    if (!seen.has(item.destName)) {
      seen.add(item.destName);
      deduped.push(item);
    }
  }

  console.log(`Found ${deduped.length} unique files to upload`);

  const BATCH_SIZE = 20;
  for (let i = 0; i < deduped.length; i += BATCH_SIZE) {
    const batch = deduped.slice(i, i + BATCH_SIZE);
    const results = await Promise.allSettled(
      batch.map(async ({ localPath, destName }) => {
        try {
          const wasUploaded = await uploadFile(localPath, destName);
          manifest[destName] = `/api/assets/${encodeURIComponent(destName)}`;
          if (wasUploaded) {
            uploaded++;
            process.stdout.write(`✓ ${destName}\n`);
          } else {
            skipped++;
          }
        } catch (err) {
          errors++;
          console.error(`✗ ${destName}: ${err}`);
        }
      })
    );
    if ((i + BATCH_SIZE) % 100 === 0 || i + BATCH_SIZE >= deduped.length) {
      console.log(`Progress: ${Math.min(i + BATCH_SIZE, deduped.length)}/${deduped.length}`);
    }
  }

  fs.writeFileSync("scripts/asset-manifest.json", JSON.stringify(manifest, null, 2));
  console.log(`\nDone! Uploaded: ${uploaded}, Skipped (already exists): ${skipped}, Errors: ${errors}`);
  console.log(`Manifest written to scripts/asset-manifest.json`);
}

main().catch(console.error);
