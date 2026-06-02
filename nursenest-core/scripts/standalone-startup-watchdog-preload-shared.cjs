const { createStartupWatchdogLogger } = require("./standalone-startup-watchdog-shared.cjs");
const {
  CHILD_BOOTSTRAP_READY_PATH,
  getNormalizedPathname,
  maybeServeBootstrapHealthz,
} = require("./standalone-bootstrap-healthz-shared.cjs");

function isReadinessProbeLikeRequest(req) {
  const rawUrl = typeof req?.url === "string" ? req.url : undefined;
  const normalizedPathname = getNormalizedPathname(req);
  return (
    normalizedPathname === CHILD_BOOTSTRAP_READY_PATH ||
    (typeof rawUrl === "string" && rawUrl.includes("_nn_bootstrap_ready_check__"))
  );
}

/**
 * Patches `http(s).createServer` so bootstrap healthz and `/_nn_bootstrap_ready_check__`
 * run before Next's `requestListener` (which awaits `handlersPromise` and would otherwise
 * stall the parent's internal HEAD probe). We do not patch `Server.prototype.emit`.
 */
function patchServerModule(moduleName, moduleRef, startupState, logger) {
  const label = moduleName.startsWith("node:") ? moduleName.slice("node:".length) : moduleName;
  logger.logPreloadPatchBegin(label);
  try {
    if (typeof moduleRef?.createServer === "function" && !moduleRef.createServer.__nnBootstrapHealthzPatched) {
      const originalCreateServer = moduleRef.createServer;
      function patchedCreateServer(...args) {
        const listenerIndex =
          typeof args[0] === "function" ? 0 : typeof args[1] === "function" ? 1 : -1;

        if (listenerIndex >= 0) {
          const originalListener = args[listenerIndex];
          args[listenerIndex] = function wrappedRequestListener(req, res, ...rest) {
            const rawUrl = typeof req?.url === "string" ? req.url : undefined;
            const method = typeof req?.method === "string" ? req.method : undefined;
            const normalizedPathname = getNormalizedPathname(req);
            const probeLike = isReadinessProbeLikeRequest(req);
            const intercepted = maybeServeBootstrapHealthz(req, res, startupState, logger);
            if (probeLike && typeof logger?.logPreloadProbeSeen === "function") {
              logger.logPreloadProbeSeen({
                via: "create_server_wrap",
                module: label,
                method,
                rawUrl,
                normalizedPathname,
                intercepted,
                forwardingToNext: !intercepted,
              });
            }
            if (intercepted) {
              return;
            }
            return originalListener.call(this, req, res, ...rest);
          };
        }

        return originalCreateServer.apply(moduleRef, args);
      }
      patchedCreateServer.__nnBootstrapHealthzPatched = true;
      moduleRef.createServer = patchedCreateServer;
      logger.logPreloadServerWrapInstalled({
        module: label,
        wrap: "create_server",
      });
    }

    logger.logPreloadPatchDone(label);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.logPreloadPatchFailed(label, { error: message.slice(0, 200) });
    throw error;
  }
}

function installStandaloneStartupWatchdog({
  standaloneEntry = "",
  logger = createStartupWatchdogLogger(),
  requireModule = require,
} = {}) {
  const startupState = { handlersReady: false };

  patchServerModule("http", requireModule("node:http"), startupState, logger);
  patchServerModule("https", requireModule("node:https"), startupState, logger);

  return { logger, startupState };
}

module.exports = {
  installStandaloneStartupWatchdog,
};
