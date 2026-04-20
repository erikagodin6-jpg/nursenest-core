const path = require("node:path");
const { createRequire } = require("node:module");

function formatStartupWatchdogLine(event, meta) {
  return `[nursenest-core] startup_watchdog ${event} ${JSON.stringify(meta)}`;
}

function resolveStandaloneNextModulePath(entryScript, moduleRelativePath) {
  if (typeof entryScript !== "string" || entryScript.length === 0) return null;
  return path.join(path.dirname(entryScript), "node_modules", "next", moduleRelativePath);
}

function createStandaloneRequire(entryScript) {
  if (typeof entryScript !== "string" || entryScript.length === 0) return null;
  return createRequire(entryScript);
}

/**
 * Legacy helper kept intentionally hard-disabled so old test imports stay stable.
 * Bootstrap readiness must come only from the internal child HTTP probe in
 * `scripts/start-standalone.mjs`, never from parsing child stdout/stderr.
 */
function childOutputIndicatesReady(text) {
  return false;
}

function createStartupWatchdogLogger({
  now = Date.now,
  write = (line) => console.error(line),
} = {}) {
  const bootAt = now();
  let listeningAt = null;

  function emit(event, meta = {}) {
    write(formatStartupWatchdogLine(event, meta));
  }

  return {
    emit,
    logStandaloneSpawn(meta = {}) {
      emit("standalone_spawn", { ...meta, msSinceBoot: now() - bootAt });
    },
    logPreloadFileEntered(meta = {}) {
      emit("preload_file_entered", { ...meta, msSinceBoot: now() - bootAt });
    },
    logPreloadInstalled(meta = {}) {
      emit("preload_installed", { ...meta, msSinceBoot: now() - bootAt });
    },
    logPreloadPatchBegin(module) {
      emit(`preload_patch_${module}_begin`, { msSinceBoot: now() - bootAt });
    },
    logPreloadPatchDone(module) {
      emit(`preload_patch_${module}_done`, { msSinceBoot: now() - bootAt });
    },
    logPreloadPatchFailed(module, meta = {}) {
      emit(`preload_patch_${module}_failed`, { ...meta, msSinceBoot: now() - bootAt });
    },
    logPreloadServerWrapInstalled(meta = {}) {
      emit("preload_server_wrap_installed", { ...meta, msSinceBoot: now() - bootAt });
    },
    logPreloadProbeSeen(meta = {}) {
      emit("preload_probe_seen", { ...meta, msSinceBoot: now() - bootAt });
    },
    logBootstrapHealthzIntercepted(meta = {}) {
      emit("bootstrap_healthz_intercepted", { ...meta, msSinceBoot: now() - bootAt });
    },
    logServerListening(meta = {}) {
      listeningAt = now();
      emit("server_listening", { ...meta, msSinceBoot: listeningAt - bootAt });
    },
    logHandlersInitStart(meta = {}) {
      const current = now();
      emit("handlers_init_start", {
        ...meta,
        msSinceBoot: current - bootAt,
        msSinceListening: listeningAt == null ? undefined : current - listeningAt,
      });
    },
    logHandlersReady(meta = {}) {
      const current = now();
      emit("handlers_ready", {
        ...meta,
        msSinceBoot: current - bootAt,
        msSinceListening: listeningAt == null ? undefined : current - listeningAt,
      });
    },
    logHandlersInitFailed(meta = {}) {
      const current = now();
      emit("handlers_init_failed", {
        ...meta,
        msSinceBoot: current - bootAt,
        msSinceListening: listeningAt == null ? undefined : current - listeningAt,
      });
    },
  };
}

module.exports = {
  childOutputIndicatesReady,
  createStartupWatchdogLogger,
  createStandaloneRequire,
  formatStartupWatchdogLine,
  resolveStandaloneNextModulePath,
};
