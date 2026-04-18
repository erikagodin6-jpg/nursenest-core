function isBootstrapHealthzRequest(req) {
  const method = typeof req?.method === "string" ? req.method.toUpperCase() : "";
  const url = typeof req?.url === "string" ? req.url : "";
  return (method === "GET" || method === "HEAD") && (url === "/healthz" || url.startsWith("/healthz?"));
}

function isBootstrapReadyzRequest(req) {
  const method = typeof req?.method === "string" ? req.method.toUpperCase() : "";
  const url = typeof req?.url === "string" ? req.url : "";
  return (method === "GET" || method === "HEAD") && (url === "/readyz" || url.startsWith("/readyz?"));
}

function maybeServeBootstrapHealthz(req, res, state, logger) {
  if (!isBootstrapHealthzRequest(req)) {
    return false;
  }

  if (logger && typeof logger.logBootstrapHealthzIntercepted === "function") {
    logger.logBootstrapHealthzIntercepted({
      method: typeof req?.method === "string" ? req.method.toUpperCase() : undefined,
      url: typeof req?.url === "string" ? req.url : undefined,
      handlersReady: false,
    });
  }

  res.statusCode = 200;
  if (typeof res.setHeader === "function") {
    res.setHeader("content-type", "text/plain; charset=utf-8");
    res.setHeader("cache-control", "no-store");
  }
  if (typeof res.end === "function") {
    if ((req?.method ?? "").toUpperCase() === "HEAD") {
      res.end();
    } else {
      res.end("ok");
    }
  }
  return true;
}

module.exports = {
  isBootstrapHealthzRequest,
  isBootstrapReadyzRequest,
  maybeServeBootstrapHealthz,
};
