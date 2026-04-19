const { createStartupWatchdogLogger, createStandaloneRequire } = require("./standalone-startup-watchdog-shared.cjs");
const { maybeServeBootstrapHealthz } = require("./standalone-bootstrap-healthz-shared.cjs");

/**
 * Patches `http(s).createServer` and `Server.prototype.emit` so bootstrap healthz
 * and `/_nn_bootstrap_ready_check__` run before Next's `requestListener` (which awaits
 * `handlersPromise` and would otherwise stall the parent's internal HEAD probe).
 */
function patchServerModule(moduleName, moduleRef, startupState, logger) {
  const label = moduleName.startsWith("node:") ? moduleName.slice("node:".length) : moduleName;
  logger.logPreloadPatchBegin(label);
  try {
    if (
      moduleRef?.Server?.prototype &&
      typeof moduleRef.Server.prototype.emit === "function" &&
      !moduleRef.Server.prototype.emit.__nnBootstrapHealthzPatched
    ) {
      const originalEmit = moduleRef.Server.prototype.emit;
      function patchedEmit(event, ...args) {
        if (event === "request" && args.length >= 2) {
          const req = args[0];
          const res = args[1];
          const rawUrl = typeof req?.url === "string" ? req.url : undefined;
          const method = typeof req?.method === "string" ? req.method : undefined;
          console.error(
            `[probe_debug] emit hook triggered ${JSON.stringify({ module: label, event, method, rawUrl })}`,
          );
          if (maybeServeBootstrapHealthz(req, res, startupState, logger)) {
            console.error(
              `[probe_debug] short-circuit before Next ${JSON.stringify({ via: "server_emit", module: label, method, rawUrl })}`,
            );
            return true;
          }
        }
        return originalEmit.apply(this, arguments);
      }
      patchedEmit.__nnBootstrapHealthzPatched = true;
      moduleRef.Server.prototype.emit = patchedEmit;
      logger.logPreloadServerWrapInstalled({
        module: label,
        wrap: "server_emit",
      });
    }

    if (typeof moduleRef?.createServer === "function" && !moduleRef.createServer.__nnBootstrapHealthzPatched) {
      const originalCreateServer = moduleRef.createServer;
      function patchedCreateServer(...args) {
        const listenerIndex =
          typeof args[0] === "function" ? 0 : typeof args[1] === "function" ? 1 : -1;

        if (listenerIndex >= 0) {
          const originalListener = args[listenerIndex];
          args[listenerIndex] = function wrappedRequestListener(req, res, ...rest) {
            if (maybeServeBootstrapHealthz(req, res, startupState, logger)) {
              console.error(
                `[probe_debug] short-circuit before Next ${JSON.stringify({
                  via: "create_server_wrap",
                  module: label,
                  method: typeof req?.method === "string" ? req.method : undefined,
                  rawUrl: typeof req?.url === "string" ? req.url : undefined,
                })}`,
              );
              return;
            }
            console.error(
              `[probe_debug] forwarding to Next ${JSON.stringify({
                module: label,
                method: typeof req?.method === "string" ? req.method : undefined,
                rawUrl: typeof req?.url === "string" ? req.url : undefined,
              })}`,
            );
            return originalListener.call(this, req, res, ...rest);
          };
        }

        return originalCreateServer.apply(this, args);
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

function patchNextInternals(standaloneEntry, requireModule, startupState, logger) {
  logger.logPreloadPatchNextBegin({
    standaloneEntry: standaloneEntry || undefined,
  });
  try {
    const standaloneRequire = createStandaloneRequire(standaloneEntry);
    if (!standaloneRequire) {
      throw new Error("missing standalone entry for createRequire");
    }

    const appInfoLog = standaloneRequire("next/dist/server/lib/app-info-log");
    const appInfoLogPath = standaloneRequire.resolve("next/dist/server/lib/app-info-log");
    const appInfoDescriptor = Object.getOwnPropertyDescriptor(appInfoLog, "logStartInfo");

    const routerServer = standaloneRequire("next/dist/server/lib/router-server");
    const routerServerPath = standaloneRequire.resolve("next/dist/server/lib/router-server");
    const routerDescriptor = Object.getOwnPropertyDescriptor(routerServer, "initialize");

    logger.logPreloadPatchNextDone({
      standaloneEntry: standaloneEntry || undefined,
      appInfoLogPath,
      routerServerPath,
      logStartInfoWritable: Boolean(appInfoDescriptor?.writable || typeof appInfoDescriptor?.set === "function"),
      initializeWritable: Boolean(routerDescriptor?.writable || typeof routerDescriptor?.set === "function"),
      strategy: "observe_only",
      pid: process.pid,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.logPreloadPatchNextFailed({
      standaloneEntry: standaloneEntry || undefined,
      error: message.slice(0, 200),
      pid: process.pid,
    });
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
  patchNextInternals(standaloneEntry, requireModule, startupState, logger);

  return { logger, startupState };
}

module.exports = {
  installStandaloneStartupWatchdog,
};
