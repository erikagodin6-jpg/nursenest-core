const assert = require("node:assert/strict");
const test = require("node:test");

const {
  isBootstrapHealthzRequest,
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
});

test("serves /healthz directly while handlers are not ready", () => {
  const res = createFakeResponse();
  const served = maybeServeBootstrapHealthz(
    { method: "GET", url: "/healthz" },
    res,
    { handlersReady: false },
  );

  assert.equal(served, true);
  assert.equal(res.statusCode, 200);
  assert.equal(res.headers["content-type"], "text/plain; charset=utf-8");
  assert.equal(res.headers["cache-control"], "no-store");
  assert.equal(res.body, "ok");
  assert.equal(res.ended, true);
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
