const { createStartupWatchdogLogger } = require("./standalone-startup-watchdog-shared.cjs");
const { installStandaloneStartupWatchdog } = require("./standalone-startup-watchdog-preload-shared.cjs");

const logger = createStartupWatchdogLogger();
const standaloneEntry = typeof process.argv[1] === "string" ? process.argv[1] : "";
logger.logPreloadFileEntered({
  entry: standaloneEntry || undefined,
  pid: process.pid,
  ppid: typeof process.ppid === "number" ? process.ppid : undefined,
  execPath: process.execPath,
  execArgv: [...process.execArgv],
  argv: [...process.argv],
});
const installation = installStandaloneStartupWatchdog({
  standaloneEntry,
  logger,
});
logger.logPreloadInstalled({
  entry: standaloneEntry || undefined,
  pid: process.pid,
});

module.exports = installation;
