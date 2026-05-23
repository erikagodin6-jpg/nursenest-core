#!/usr/bin/env node

import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgRoot = join(__dirname, "..");

const standaloneServer = join(
  pkgRoot,
  ".next",
  "standalone",
  "server.js",
);

if (!existsSync(standaloneServer)) {
  console.error(
    `[nursenest-core] FATAL: standalone server missing at ${standaloneServer}`,
  );
  process.exit(1);
}

const port = process.env.PORT || "8080";
const hostname = process.env.HOSTNAME || "0.0.0.0";

process.env.NODE_ENV = "production";
process.env.PORT = port;
process.env.HOSTNAME = hostname;

console.error(
  `[nursenest-core] starting standalone server (${hostname}:${port})`,
);

const child = spawn(
  process.execPath,
  [standaloneServer],
  {
    cwd: pkgRoot,
    env: process.env,
    stdio: "inherit",
  },
);

child.on("exit", (code, signal) => {
  if (signal) {
    console.error(
      `[nursenest-core] standalone exited via signal ${signal}`,
    );
    process.kill(process.pid, signal);
    return;
  }

  console.error(
    `[nursenest-core] standalone exited with code ${code ?? 1}`,
  );

  process.exit(code ?? 1);
});

child.on("error", (error) => {
  console.error(
    `[nursenest-core] failed to start standalone server: ${error.message}`,
  );

  process.exit(1);
});