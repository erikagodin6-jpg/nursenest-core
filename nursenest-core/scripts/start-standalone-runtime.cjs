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

try {
  require(entry);
} catch (err) {
  // Next.js 16+ standalone `server.js` is ESM (`import …`); `require()` throws ERR_REQUIRE_ESM.
  if (!err || err.code !== "ERR_REQUIRE_ESM") throw err;
  const { pathToFileURL } = require("node:url");
  void import(pathToFileURL(entry).href).catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
