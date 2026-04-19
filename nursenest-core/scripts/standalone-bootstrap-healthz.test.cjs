const assert = require("node:assert/strict");
const test = require("node:test");

const {
  isBootstrapHealthzRequest,
  maybeServeBootstrapHealthz,
  normalizeBootstrapProbePathname,
} = require("./standalone-bootstrap-healthz-shared.cjs");

function createFakeResponse() {
  return {
    statusCode: 0,
    headers: {},
    ended: false,
    writableEnded: false,
    finished: false,
    body: undefined,
    setHeader(name, value) {
      this.headers[name.toLowerCase()] = value;
    },
    end(body) {
      this.ended = true;
      this.writableEnded = true;
      this.finished = true;
      this.body = body;
    },
  };
}

test("matches GET and HEAD bootstrap probe requests only", () => {
  assert.equal(isBootstrapHealthzRequest({ method: "GET", url: "/healthz" }), true);
  assert.equal(isBootstrapHealthzRequest({ method: "HEAD", url: "/healthz?check=1" }), true);
  assert.equal(isBootstrapHealthzRequest({ method: "GET", url: "/_nn_bootstrap_ready_check__" }), true);
  assert.equal(isBootstrapHealthzRequest({ method: "HEAD", url: "/_nn_bootstrap_ready_check__?check=1" }), true);
  assert.equal(isBootstrapHealthzRequest({ method: "GET", url: "/readyz" }), true);
  assert.equal(isBootstrapHealthzRequest({ method: "HEAD", url: "/readyz?check=1" }), true);
  assert.equal(isBootstrapHealthzRequest({ method: "POST", url: "/healthz" }), false);
  assert.equal(isBootstrapHealthzRequest({ method: "POST", url: "/_nn_bootstrap_ready_check__" }), false);
  assert.equal(isBootstrapHealthzRequest({ method: "GET", url: "/api/health" }), false);
  assert.equal(
    isBootstrapHealthzRequest({ method: "HEAD", url: "http://127.0.0.1:3005/_nn_bootstrap_ready_check__" }),
    true,
  );
  assert.equal(
    isBootstrapHealthzRequest({ method: "GET", url: "http://127.0.0.1:9/_nn_bootstrap_ready_check__?ts=1" }),
    true,
  );
});

test("normalizeBootstrapProbePathname: query and trailing slash for probe", () => {
  assert.equal(normalizeBootstrapProbePathname({ url: "/_nn_bootstrap_ready_check__?ts=1" }), "/_nn_bootstrap_ready_check__");
  assert.equal(
    normalizeBootstrapProbePathname({ url: "/_nn_bootstrap_ready_check__/" }),
    "/_nn_bootstrap_ready_check__",
  );
  assert.equal(
    normalizeBootstrapProbePathname({ url: "http://127.0.0.1:3000/_nn_bootstrap_ready_check__/?x=1" }),
    "/_nn_bootstrap_ready_check__",
  );
});

test("serves /healthz directly while handlers are not ready", () => {
  const res = createFakeResponse();
  const intercepted = [];
  const served = maybeServeBootstrapHealthz(
    { method: "GET", url: "/healthz" },
    res,
    { handlersReady: false },
    {
      logBootstrapHealthzIntercepted(meta) {
        intercepted.push(meta);
      },
    },
  );

  assert.equal(served, true);
  assert.equal(res.statusCode, 200);
  assert.equal(res.headers["content-type"], "text/plain; charset=utf-8");
  assert.equal(res.headers["cache-control"], "no-store");
  assert.equal(res.body, "ok");
  assert.equal(res.ended, true);
  assert.deepEqual(intercepted, [
    { method: "GET", url: "/healthz", pathname: "/healthz", handlersReady: false },
  ]);
});

test("serves HEAD /healthz without a body while handlers are not ready", () => {
  const res = createFakeResponse();
  const served = maybeServeBootstrapHealthz(
    { method: "HEAD", url: "/healthz" },
    res,
    { handlersReady: false },
  );

  assert.equal(served, true);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body, undefined);
  assert.equal(res.ended, true);
});

test("serves the internal bootstrap ready probe directly while handlers are not ready", () => {
  const res = createFakeResponse();
  const intercepted = [];
  const served = maybeServeBootstrapHealthz(
    { method: "GET", url: "/_nn_bootstrap_ready_check__" },
    res,
    { handlersReady: false },
    {
      logBootstrapHealthzIntercepted(meta) {
        intercepted.push(meta);
      },
    },
  );

  assert.equal(served, true);
  assert.equal(res.statusCode, 200);
  assert.equal(res.headers["content-type"], "text/plain");
  assert.equal(res.headers["cache-control"], "no-store");
  assert.equal(res.body, "ok");
  assert.equal(res.ended, true);
  assert.equal(res.writableEnded, true);
  assert.deepEqual(intercepted, [
    {
      method: "GET",
      url: "/_nn_bootstrap_ready_check__",
      pathname: "/_nn_bootstrap_ready_check__",
      handlersReady: false,
    },
  ]);
});

test("serves internal bootstrap probe for absolute-form request-target (HEAD)", () => {
  const res = createFakeResponse();
  const served = maybeServeBootstrapHealthz(
    { method: "HEAD", url: "http://127.0.0.1:4444/_nn_bootstrap_ready_check__" },
    res,
    { handlersReady: false },
  );
  assert.equal(served, true);
  assert.equal(res.statusCode, 200);
  assert.equal(res.headers["content-type"], "text/plain");
  assert.equal(res.body, undefined);
  assert.equal(res.ended, true);
  assert.equal(res.writableEnded, true);
});

test("internal bootstrap probe is intercepted even when handlersReady is true", () => {
  const res = createFakeResponse();
  const served = maybeServeBootstrapHealthz(
    { method: "GET", url: "/_nn_bootstrap_ready_check__" },
    res,
    { handlersReady: true },
  );
  assert.equal(served, true);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body, "ok");
  assert.equal(res.ended, true);
  assert.equal(res.writableEnded, true);
});

test("serves HEAD for the internal bootstrap ready probe without a body", () => {
  const res = createFakeResponse();
  const served = maybeServeBootstrapHealthz(
    { method: "HEAD", url: "/_nn_bootstrap_ready_check__" },
    res,
    { handlersReady: false },
  );

  assert.equal(served, true);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body, undefined);
  assert.equal(res.ended, true);
  assert.equal(res.writableEnded, true);
});

test("does not intercept /healthz after handlers are ready", () => {
  const res = createFakeResponse();
  const served = maybeServeBootstrapHealthz(
    { method: "GET", url: "/healthz" },
    res,
    { handlersReady: true },
  );

  assert.equal(served, false);
  assert.equal(res.ended, false);
});
