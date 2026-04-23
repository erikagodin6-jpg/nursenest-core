import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@": path.join(rootDir, "nursenest-core", "src"),
    },
  },
  test: {
    include: ["server/**/*.test.ts", "scripts/**/*.test.ts"],
    environment: "node",
  },
});
