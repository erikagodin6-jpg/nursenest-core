import { existsSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const packageRoot = fileURLToPath(new URL("..", import.meta.url));
const nextCacheDir = path.join(packageRoot, ".next", "cache");

if (!existsSync(nextCacheDir)) {
  console.log("[post-build-prune] no .next/cache directory to remove");
  process.exit(0);
}

rmSync(nextCacheDir, { recursive: true, force: true });
console.log("[post-build-prune] removed .next/cache");
