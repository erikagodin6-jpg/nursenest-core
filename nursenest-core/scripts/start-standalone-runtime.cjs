const path = require("node:path");

const entry = typeof process.argv[2] === "string" ? path.resolve(process.argv[2]) : "";

if (!entry) {
  console.error(
    `[nursenest-core] FATAL: missing standalone entry for bootstrap runtime ${JSON.stringify({
      pid: process.pid,
      argv: [...process.argv],
    })}`,
  );
  process.exit(1);
}

process.argv[1] = entry;

require("./standalone-startup-watchdog-preload.cjs");

require(entry);
