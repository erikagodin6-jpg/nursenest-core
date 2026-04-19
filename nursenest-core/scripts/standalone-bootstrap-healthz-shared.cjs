/** Keep in sync with `standalone-bootstrap-probe-pathname.mjs` (parent bootstrap listener). */
function normalizeBootstrapProbePathname(req) {
  const raw = typeof req?.url === "string" ? req.url : "";
  const noQueryHash = raw.split("?")[0].split("#")[0];
  let pathname = noQueryHash;
  if (!pathname.startsWith("/")) {
    const abs = /^https?:\/\/[^/]+(\/.*)?$/i.exec(pathname);
    pathname = abs && abs[1] && abs[1].length > 0 ? abs[1] : abs ? "/" : pathname;
  }
  if (pathname.length > 1 && pathname.endsWith("/")) {
    pathname = pathname.slice(0, -1);
  }
  return pathname;
}

const CHILD_BOOTSTRAP_READY_PATH = "/_nn_bootstrap_ready_check__";

function isBootstrapHealthzRequest(req) {
  const method = typeof req?.method === "string" ? req.method.toUpperCase() : "";
  if (method !== "GET" && method !== "HEAD") return false;
  const pathname = normalizeBootstrapProbePathname(req);
  return pathname === "/healthz" || pathname === "/readyz" || pathname === CHILD_BOOTSTRAP_READY_PATH;
}

function maybeServeBootstrapHealthz(req, res, state, logger) {
  const method = typeof req?.method === "string" ? req.method.toUpperCase() : "";
  if (method !== "GET" && method !== "HEAD") return false;

  const pathname = normalizeBootstrapProbePathname(req);

  // Internal child probe: must answer before Next's requestListener (which awaits handlersPromise).
  // Match normalized pathname only; ignore handlersReady so this never falls through to Next.
  if (pathname === CHILD_BOOTSTRAP_READY_PATH) {
    console.error(
      `[bootstrap_probe] intercepted request ${JSON.stringify({ method, pathname, url: typeof req?.url === "string" ? req.url : undefined })}`,
    );
    if (logger && typeof logger.logBootstrapHealthzIntercepted === "function") {
      logger.logBootstrapHealthzIntercepted({
        method,
        url: typeof req?.url === "string" ? req.url : undefined,
        pathname,
        handlersReady: Boolean(state?.handlersReady),
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

  if (state?.handlersReady || !isBootstrapHealthzRequest(req)) {
    return false;
  }

  if (logger && typeof logger.logBootstrapHealthzIntercepted === "function") {
    logger.logBootstrapHealthzIntercepted({
      method,
      url: typeof req?.url === "string" ? req.url : undefined,
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
};
