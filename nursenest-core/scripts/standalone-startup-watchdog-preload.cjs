const {
  createStartupWatchdogLogger,
  resolveStandaloneNextModulePath,
} = require("./standalone-startup-watchdog-shared.cjs");
const { maybeServeBootstrapHealthz } = require("./standalone-bootstrap-healthz-shared.cjs");

const logger = createStartupWatchdogLogger();
const startupState = { handlersReady: false };
const standaloneEntry = typeof process.argv[1] === "string" ? process.argv[1] : "";

function requireStandaloneNextInternal(moduleRelativePath) {
  const resolved = resolveStandaloneNextModulePath(standaloneEntry, moduleRelativePath);
  return resolved ? require(resolved) : null;
}

function patchServerFactory(moduleRef) {
  const originalCreateServer = moduleRef.createServer;
  if (typeof originalCreateServer !== "function" || originalCreateServer.__nnBootstrapHealthzPatched) return;

  function patchedCreateServer(...args) {
    const listenerIndex =
      typeof args[0] === "function" ? 0 : typeof args[1] === "function" ? 1 : -1;

    if (listenerIndex >= 0) {
      const originalListener = args[listenerIndex];
      args[listenerIndex] = function wrappedRequestListener(req, res, ...rest) {
        if (maybeServeBootstrapHealthz(req, res, startupState)) {
          return;
        }
        return originalListener.call(this, req, res, ...rest);
      };
    }

    return originalCreateServer.apply(this, args);
  }

  patchedCreateServer.__nnBootstrapHealthzPatched = true;
  moduleRef.createServer = patchedCreateServer;
}

for (const mod of ["http", "node:http", "https", "node:https"]) {
  patchServerFactory(require(mod));
}

console.error(
  `[nursenest-core] startup_watchdog preload_installed ${JSON.stringify({
    entry: standaloneEntry || undefined,
  })}`,
);

const appInfoLog =
  requireStandaloneNextInternal("dist/server/lib/app-info-log") || require("next/dist/server/lib/app-info-log");
const originalLogStartInfo = appInfoLog.logStartInfo;
appInfoLog.logStartInfo = function patchedLogStartInfo(...args) {
  const info = args[0] ?? {};
  logger.logServerListening({
    appUrl: typeof info.appUrl === "string" ? info.appUrl : undefined,
    networkUrl: typeof info.networkUrl === "string" ? info.networkUrl : undefined,
  });
  return originalLogStartInfo.apply(this, args);
};

const routerServer =
  requireStandaloneNextInternal("dist/server/lib/router-server") || require("next/dist/server/lib/router-server");
const originalInitialize = routerServer.initialize;
routerServer.initialize = async function patchedInitialize(...args) {
  logger.logHandlersInitStart();
  try {
    const result = await originalInitialize.apply(this, args);
    startupState.handlersReady = true;
    logger.logHandlersReady();
    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.logHandlersInitFailed({ error: message.slice(0, 200) });
    throw error;
  }
};
