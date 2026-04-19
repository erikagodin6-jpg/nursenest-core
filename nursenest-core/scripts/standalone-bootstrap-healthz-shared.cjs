const CHILD_BOOTSTRAP_READY_PATH = "/_nn_bootstrap_ready_check__";

function trimTrailingSlash(pathname) {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

/**
 * Pathname for bootstrap matching: `new URL` handles relative and absolute-form request-targets.
 * Keep behavior aligned with parent `standalone-bootstrap-probe-pathname.mjs` where possible.
 */
function normalizeBootstrapProbePathname(req) {
  const raw = typeof req?.url === "string" ? req.url : "";
  if (!raw) return "";
  try {
    const parsed = new URL(raw, "http://localhost");
    return trimTrailingSlash(parsed.pathname || "/");
  } catch {
    const noQueryHash = raw.split("?")[0].split("#")[0];
    let pathname = noQueryHash;
    if (!pathname.startsWith("/")) {
      const abs = /^https?:\/\/[^/]+(\/.*)?$/i.exec(pathname);
      pathname = abs && abs[1] && abs[1].length > 0 ? abs[1] : abs ? "/" : pathname;
    }
    return trimTrailingSlash(pathname);
  }
}

function isBootstrapHealthzRequest(req) {
  const method = typeof req?.method === "string" ? req.method.toUpperCase() : "";
  if (method !== "GET" && method !== "HEAD") return false;
  const pathname = normalizeBootstrapProbePathname(req);
  return pathname === "/healthz" || pathname === "/readyz" || pathname === CHILD_BOOTSTRAP_READY_PATH;
}

function logProbeDebug(line, meta) {
  console.error(`[probe_debug] ${line} ${JSON.stringify(meta)}`);
}

function maybeServeBootstrapHealthz(req, res, state, logger) {
  const method = typeof req?.method === "string" ? req.method.toUpperCase() : "";
  const rawUrl = typeof req?.url === "string" ? req.url : undefined;
  const pathname = normalizeBootstrapProbePathname(req);
  const writableEnded = Boolean(res?.writableEnded);
  const finished = Boolean(res?.finished);

  logProbeDebug("incoming request", {
    method,
    rawUrl,
    pathname,
    writableEnded,
    finished,
  });

  if (method !== "GET" && method !== "HEAD") {
    logProbeDebug("no match", { reason: "method", method, pathname });
    return false;
  }

  if (pathname === CHILD_BOOTSTRAP_READY_PATH) {
    if (writableEnded || finished) {
      logProbeDebug("matched probe path", { method, pathname, rawUrl, alreadyEnded: true });
      return true;
    }

    logProbeDebug("matched probe path", { method, pathname, rawUrl });

    if (logger && typeof logger.logBootstrapHealthzIntercepted === "function") {
      logger.logBootstrapHealthzIntercepted({
        method,
        url: rawUrl,
        pathname,
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
        `[probe_debug] ERROR probe response not writableEnded after end() ${JSON.stringify({ method, pathname, rawUrl })}`,
      );
    }

    return true;
  }

  logProbeDebug("no match", { method, pathname, reason: "not_probe_path" });

  if (state?.handlersReady || !isBootstrapHealthzRequest(req)) {
    return false;
  }

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
  isBootstrapHealthzRequest,
  maybeServeBootstrapHealthz,
  normalizeBootstrapProbePathname,
};
