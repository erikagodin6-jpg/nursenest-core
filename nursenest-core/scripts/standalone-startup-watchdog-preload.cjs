const { createStartupWatchdogLogger } = require("./standalone-startup-watchdog-shared.cjs");

const logger = createStartupWatchdogLogger();

const appInfoLog = require("next/dist/server/lib/app-info-log");
const originalLogStartInfo = appInfoLog.logStartInfo;
appInfoLog.logStartInfo = function patchedLogStartInfo(...args) {
  const info = args[0] ?? {};
  logger.logServerListening({
    appUrl: typeof info.appUrl === "string" ? info.appUrl : undefined,
    networkUrl: typeof info.networkUrl === "string" ? info.networkUrl : undefined,
  });
  return originalLogStartInfo.apply(this, args);
};

const routerServer = require("next/dist/server/lib/router-server");
const originalInitialize = routerServer.initialize;
routerServer.initialize = async function patchedInitialize(...args) {
  logger.logHandlersInitStart();
  try {
    const result = await originalInitialize.apply(this, args);
    logger.logHandlersReady();
    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.logHandlersInitFailed({ error: message.slice(0, 200) });
    throw error;
  }
};
