import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = fileURLToPath(new URL("..", import.meta.url));

export function getExpectedStandaloneServerPath(root = packageRoot) {
  return path.join(root, ".next", "standalone", "nursenest-core", "server.js");
}

export function verifyStandaloneArtifact(root = packageRoot) {
  const standaloneServerPath = getExpectedStandaloneServerPath(root);
  if (!existsSync(standaloneServerPath)) {
    throw new Error(
      `standalone server.js not found at ${standaloneServerPath}. Run \`npm run build:deploy\` from nursenest-core to generate a fresh standalone build.`,
    );
  }
  return standaloneServerPath;
}

const scriptPath = fileURLToPath(import.meta.url);
const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === scriptPath;

if (isDirectRun) {
  try {
    const standaloneServerPath = verifyStandaloneArtifact();
    console.log(`[verify-standalone-artifact] verified ${standaloneServerPath}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[nursenest-core] FATAL: ${message}`);
    process.exit(1);
  }
}
