const { formatStartupWatchdogLine } = require("./standalone-startup-watchdog-shared.cjs");

const CHILD_BOOTSTRAP_READY_PATH = "/_nn_bootstrap_ready_check__";
const CHILD_BOOTSTRAP_READY_TOKEN = "_nn_bootstrap_ready_check__";

function trimTrailingSlash(pathname) {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

/**
 * Normalizes `req.url` to a pathname (absolute or relative request-target).
 * No trailing-slash folding — used for the child readiness probe exact match.
 */
function getNormalizedPathname(req) {
  const raw = typeof req?.url === "string" ? req.url : "";
  try {
    return new URL(raw || "/", "http://localhost").pathname;
  } catch {
    try {
      if (raw.startsWith("/")) {
        return new URL(`http://localhost${raw}`, "http://localhost").pathname;
      }
      return new URL(raw, "http://localhost").pathname;
    } catch {
      const base = raw.split("?")[0].split("#")[0];
      return base;
    }
  }
}

/** Trimmed pathname for /healthz and /readyz matching only (not the probe). */
function normalizeBootstrapProbePathname(req) {
  let raw = getNormalizedPathname(req);
  if (raw && !raw.startsWith("/")) {
    try {
      raw = new URL(raw, "http://localhost").pathname;
    } catch {
      const u = typeof req?.url === "string" ? req.url : "";
      raw = u.split("?")[0].split("#")[0] || "";
    }
  }
  return trimTrailingSlash(raw || "") || "/";
}

function isBootstrapHealthzRequest(req) {
  const method = typeof req?.method === "string" ? req.method.toUpperCase() : "";
  if (method !== "GET" && method !== "HEAD") return false;
  const raw = getNormalizedPathname(req);
  if (raw === CHILD_BOOTSTRAP_READY_PATH) return true;
  const pn = trimTrailingSlash(raw || "") || "/";
  if (pn === CHILD_BOOTSTRAP_READY_PATH && raw !== CHILD_BOOTSTRAP_READY_PATH) {
    return false;
  }
  return pn === "/healthz" || pn === "/readyz";
}

function logProbeDebug(line, meta) {
  console.error(`[probe_debug] ${line} ${JSON.stringify(meta)}`);
}

function isReadinessProbeLikeRequest(rawUrl, normalizedPathname) {
  return (
    normalizedPathname === CHILD_BOOTSTRAP_READY_PATH ||
    (typeof rawUrl === "string" && rawUrl.includes(CHILD_BOOTSTRAP_READY_TOKEN))
  );
}

function logBootstrapProbeHelperEval(fields) {
  console.error(formatStartupWatchdogLine("bootstrap_probe_helper_eval", fields));
}

function maybeServeBootstrapHealthz(req, res, state, logger) {
  const method = typeof req?.method === "string" ? req.method.toUpperCase() : "";
  const rawUrl = typeof req?.url === "string" ? req.url : undefined;
  const rawPath = getNormalizedPathname(req);
  const writableEnded = Boolean(res?.writableEnded);
  const finished = Boolean(res?.finished);
  const probeLike = isReadinessProbeLikeRequest(rawUrl, rawPath);

  const flushEval = (extra) => {
    if (!probeLike) return;
    logBootstrapProbeHelperEval({
      method,
      rawUrl,
      normalizedPathname: rawPath,
      writableEnded,
      finished,
      ...extra,
    });
  };

  if (method !== "GET" && method !== "HEAD") {
    flushEval({ matched: false, intercepted: false, outcome: "method_not_allowed" });
    return false;
  }

  if (rawPath === CHILD_BOOTSTRAP_READY_PATH) {
    if (res.writableEnded) {
      flushEval({ matched: true, intercepted: false, outcome: "skipped_already_ended" });
      return true;
    }

    flushEval({ matched: true, intercepted: true, outcome: "intercepted" });

    if (logger && typeof logger.logBootstrapHealthzIntercepted === "function") {
      logger.logBootstrapHealthzIntercepted({
        method,
        url: rawUrl,
        pathname: rawPath,
        handlersReady: Boolean(state?.handlersReady),
      });
    }

    res.statusCode = 200;
    if (typeof res.setHeader === "function") {
      res.setHeader("content-type", "text/plain");
      res.setHeader("cache-control", "no-store");
    }
    if (typeof res.end === "function") {
      if (method === "HEAD") {
        res.end();
      } else {
        res.end("ok");
      }
    }

    if (!res.writableEnded) {
      console.error(
        `[probe_debug] ERROR probe response not writableEnded after end() ${JSON.stringify({ method, pathname: rawPath, rawUrl })}`,
      );
    }

    return true;
  }

  if (probeLike) {
    flushEval({ matched: false, intercepted: false, outcome: "pathname_not_exact" });
  }

  if (state?.handlersReady || !isBootstrapHealthzRequest(req)) {
    return false;
  }

  if (res.writableEnded) {
    return true;
  }

  const pathname = normalizeBootstrapProbePathname(req);

  if (logger && typeof logger.logBootstrapHealthzIntercepted === "function") {
    logger.logBootstrapHealthzIntercepted({
      method,
      url: rawUrl,
      pathname,
      handlersReady: false,
    });
  }

  res.statusCode = 200;
  if (typeof res.setHeader === "function") {
    res.setHeader("content-type", "text/plain; charset=utf-8");
    res.setHeader("cache-control", "no-store");
  }
  if (typeof res.end === "function") {
    if (method === "HEAD") {
      res.end();
    } else {
      res.end("ok");
    }
  }
  return true;
}

module.exports = {
  CHILD_BOOTSTRAP_READY_PATH,
  getNormalizedPathname,
  isBootstrapHealthzRequest,
  maybeServeBootstrapHealthz,
  normalizeBootstrapProbePathname,
};
