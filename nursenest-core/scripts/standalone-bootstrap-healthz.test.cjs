const assert = require("node:assert/strict");
const test = require("node:test");

const {
  isBootstrapHealthzRequest,
  isBootstrapReadyzRequest,
  maybeServeBootstrapHealthz,
} = require("./standalone-bootstrap-healthz-shared.cjs");

function createFakeResponse() {
  return {
    statusCode: 0,
    headers: {},
    ended: false,
    body: undefined,
    setHeader(name, value) {
      this.headers[name.toLowerCase()] = value;
    },
    end(body) {
      this.ended = true;
      this.body = body;
    },
  };
}

test("matches GET and HEAD /healthz requests only", () => {
  assert.equal(isBootstrapHealthzRequest({ method: "GET", url: "/healthz" }), true);
  assert.equal(isBootstrapHealthzRequest({ method: "HEAD", url: "/healthz?check=1" }), true);
  assert.equal(isBootstrapHealthzRequest({ method: "POST", url: "/healthz" }), false);
  assert.equal(isBootstrapHealthzRequest({ method: "GET", url: "/api/health" }), false);
  assert.equal(isBootstrapReadyzRequest({ method: "GET", url: "/readyz" }), true);
  assert.equal(isBootstrapReadyzRequest({ method: "HEAD", url: "/readyz?check=1" }), true);
  assert.equal(isBootstrapReadyzRequest({ method: "POST", url: "/readyz" }), false);
  assert.equal(isBootstrapReadyzRequest({ method: "GET", url: "/api/health/ready" }), false);
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
  assert.deepEqual(intercepted, [{ method: "GET", url: "/healthz", handlersReady: false }]);
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

test("still serves /healthz directly after handlers are ready", () => {
  const res = createFakeResponse();
  const served = maybeServeBootstrapHealthz(
    { method: "GET", url: "/healthz" },
    res,
    { handlersReady: true },
  );

  assert.equal(served, true);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body, "ok");
  assert.equal(res.ended, true);
});
