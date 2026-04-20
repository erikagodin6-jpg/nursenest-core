#!/usr/bin/env node
/**
 * Ensures fingerprinted Next assets under `.next/static` exist inside the standalone
 * runtime tree (`…/standalone/…/server.js` sibling `.next/static`).
 *
 * Some monorepo / `outputFileTracingRoot` builds leave `.next/static` only at the package
 * root while the standalone server resolves assets next to `server.js`. Missing copies
 * manifest as production `GET /_next/static/...` returning HTML (the app document) instead
 * of CSS/JS/fonts — browsers show unstyled content.
 */
import { cpSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { verifyStandaloneArtifact } from "./verify-standalone-artifact.mjs";

const packageRoot = fileURLToPath(new URL("..", import.meta.url));
const sourceStatic = path.join(packageRoot, ".next", "static");

function assertNonEmptyCssDir(staticRoot) {
  const cssDir = path.join(staticRoot, "css");
  if (!existsSync(cssDir)) {
    throw new Error(
      `[ensure-standalone-static] expected css output at ${cssDir} — is this a Next build?`,
    );
  }
  const files = readdirSync(cssDir).filter((n) => n.endsWith(".css"));
  if (files.length === 0) {
    throw new Error(`[ensure-standalone-static] no .css files under ${cssDir}`);
  }
}

if (!existsSync(sourceStatic)) {
  throw new Error(
    `[ensure-standalone-static] missing ${sourceStatic} — run next build before build:deploy.`,
  );
}
assertNonEmptyCssDir(sourceStatic);

const serverPath = verifyStandaloneArtifact(packageRoot);
const destStatic = path.join(path.dirname(serverPath), ".next", "static");

mkdirSync(path.dirname(destStatic), { recursive: true });
cpSync(sourceStatic, destStatic, { recursive: true, force: true });
assertNonEmptyCssDir(destStatic);

console.log(`[ensure-standalone-static] synced ${sourceStatic} -> ${destStatic}`);
