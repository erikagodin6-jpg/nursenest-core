const path = require("node:path");

function formatStartupWatchdogLine(event, meta) {
  return `[nursenest-core] startup_watchdog ${event} ${JSON.stringify(meta)}`;
}

function resolveStandaloneNextModulePath(entryScript, moduleRelativePath) {
  if (typeof entryScript !== "string" || entryScript.length === 0) return null;
  return path.join(path.dirname(entryScript), "node_modules", "next", moduleRelativePath);
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
    logStandaloneSpawn(meta = {}) {
      emit("standalone_spawn", { ...meta, msSinceBoot: now() - bootAt });
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
  createStartupWatchdogLogger,
  formatStartupWatchdogLine,
  resolveStandaloneNextModulePath,
};
