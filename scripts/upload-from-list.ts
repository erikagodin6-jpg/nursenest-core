import { Storage } from "@google-cloud/storage";
import fs from "fs";
import path from "path";

const storageClient = new Storage({
  credentials: {
    audience: "replit",
    subject_token_type: "access_token",
    token_url: "http://127.0.0.1:1106/token",
    type: "external_account",
    credential_source: {
      url: "http://127.0.0.1:1106/credential",
      format: { type: "json", subject_token_field_name: "access_token" },
    },
    universe_domain: "googleapis.com",
  },
  projectId: "",
});

const publicDir = (process.env.PUBLIC_OBJECT_SEARCH_PATHS || "").split(",")[0]?.trim()!;
const parts = publicDir.replace(/^\//, "").split("/");
const bucketName = parts[0];
const prefix = parts.slice(1).join("/");
const bucket = storageClient.bucket(bucketName);

const CONTENT_TYPES: Record<string, string> = {
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".mp4": "video/mp4", ".webp": "image/webp", ".svg": "image/svg+xml", ".gif": "image/gif",
};

const SEARCH_DIRS = [
  "client/src/assets/images",
  "client/src/assets",
  "attached_assets",
  "client/public/videos",
];

function findFile(filename: string): string | null {
  for (const dir of SEARCH_DIRS) {
    const p = path.join(dir, filename);
    if (fs.existsSync(p)) return p;
  }
  return null;
}

async function uploadOne(filename: string): Promise<"uploaded" | "exists" | "notfound" | "error"> {
  const localPath = findFile(filename);
  if (!localPath) return "notfound";
  
  const objectName = `${prefix}/${filename}`;
  const file = bucket.file(objectName);
  
  try {
    const [exists] = await file.exists();
    if (exists) {
      const localSize = fs.statSync(localPath).size;
      const [meta] = await file.getMetadata();
      if (meta.size && parseInt(String(meta.size)) === localSize) return "exists";
    }
  } catch {}

  const ext = path.extname(filename).toLowerCase();
  const contentType = CONTENT_TYPES[ext] || "application/octet-stream";
  
  try {
    await bucket.upload(localPath, {
      destination: objectName,
      metadata: { contentType, cacheControl: "public, max-age=31536000, immutable" },
      resumable: false,
    });
    return "uploaded";
  } catch {
    return "error";
  }
}

async function main() {
  const filenames = fs.readFileSync("/tmp/referenced-assets.txt", "utf-8").split("\n").filter(Boolean);
  
  const startIdx = parseInt(process.argv[2] || "0");
  const endIdx = parseInt(process.argv[3] || String(filenames.length));
  const slice = filenames.slice(startIdx, endIdx);
  
  console.log(`Uploading ${slice.length} files (${startIdx}-${endIdx} of ${filenames.length})...`);
  
  let uploaded = 0, exists = 0, notfound = 0, errors = 0;
  const BATCH = 30;
  
  for (let i = 0; i < slice.length; i += BATCH) {
    const batch = slice.slice(i, i + BATCH);
    const results = await Promise.allSettled(batch.map(f => uploadOne(f)));
    for (const r of results) {
      if (r.status === "fulfilled") {
        if (r.value === "uploaded") uploaded++;
        else if (r.value === "exists") exists++;
        else if (r.value === "notfound") notfound++;
        else errors++;
      } else errors++;
    }
    console.log(`  ${Math.min(i + BATCH, slice.length)}/${slice.length}: ${uploaded} new, ${exists} exist, ${notfound} missing, ${errors} err`);
  }
  console.log(`Done: ${uploaded} uploaded, ${exists} existed, ${notfound} not found, ${errors} errors`);
}

main().catch(console.error);
