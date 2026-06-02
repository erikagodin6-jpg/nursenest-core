/**
 * link-shared-react.mjs
 *
 * Ensures nursenest-core/node_modules/{react,react-dom} are symlinks pointing
 * to the root workspace copies, so both the client/ Vite app and the
 * nursenest-core/ Next.js app resolve the SAME React runtime object.
 *
 * Without this, react-dom/server (loaded from nursenest-core/node_modules)
 * uses a different React dispatcher than client/src components (which resolve
 * from root/node_modules), causing "Invalid hook call" errors during SSR tests.
 *
 * Run automatically via "postinstall" in package.json after every npm install.
 * Safe to run manually: `node scripts/link-shared-react.mjs`
 */
import { symlinkSync, rmSync, lstatSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const nnCoreDir = resolve(__dirname, ".."); // nursenest-core/
const rootNodeModules = resolve(nnCoreDir, "..", "node_modules"); // root/node_modules

const PACKAGES = ["react", "react-dom"];

let changed = 0;
for (const pkg of PACKAGES) {
  const src = resolve(rootNodeModules, pkg); // absolute target
  const dest = resolve(nnCoreDir, "node_modules", pkg);

  // Remove existing real directory (installed by npm) or stale symlink
  let needsLink = true;
  if (existsSync(dest)) {
    try {
      const stat = lstatSync(dest); // lstat doesn't follow symlinks
      if (stat.isSymbolicLink()) {
        // Already a symlink — skip (could be pointing elsewhere, but accept it)
        needsLink = false;
      } else {
        // Real directory installed by npm — remove and replace with symlink
        rmSync(dest, { recursive: true, force: true });
      }
    } catch {
      // dest doesn't exist or unreadable — will create fresh symlink
    }
  }

  if (needsLink) {
    symlinkSync(src, dest, "dir");
    console.log(`[link-shared-react] linked ${dest} → ${src}`);
    changed++;
  }
}

if (changed === 0) {
  console.log("[link-shared-react] symlinks already in place — nothing to do");
}
