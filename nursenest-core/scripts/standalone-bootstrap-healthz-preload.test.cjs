const assert = require("node:assert/strict");
const test = require("node:test");
const http = require("node:http");

const { createStartupWatchdogLogger } = require("./standalone-startup-watchdog-shared.cjs");
const { installStandaloneStartupWatchdog } = require("./standalone-startup-watchdog-preload-shared.cjs");

installStandaloneStartupWatchdog({
  standaloneEntry: "",
  logger: createStartupWatchdogLogger({ write: () => {} }),
});

function request({ port, method, path: reqPath }) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        host: "127.0.0.1",
        port,
        path: reqPath,
        method,
      },
      (res) => {
        let body = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => {
          body += chunk;
        });
        res.on("end", () => {
          resolve({
            statusCode: res.statusCode,
            body,
          });
        });
      },
    );
    req.on("error", reject);
    req.setTimeout(3000, () => {
      req.destroy(new Error("request timeout"));
      reject(new Error("request timeout"));
    });
    req.end();
  });
}

test("patched createServer: HEAD /_nn_bootstrap_ready_check__ returns before hung Next listener", async () => {
  let nextListenerInvoked = false;
  const server = http.createServer(async () => {
    nextListenerInvoked = true;
    await new Promise(() => {});
  });

  await new Promise((resolve, reject) => {
    server.listen(0, "127.0.0.1", (err) => (err ? reject(err) : resolve()));
  });
  const port = server.address().port;
  try {
    const headRes = await request({ port, method: "HEAD", path: "/_nn_bootstrap_ready_check__" });
    assert.equal(headRes.statusCode, 200);
    assert.equal(headRes.body, "");
    assert.equal(nextListenerInvoked, false);

    const getRes = await request({ port, method: "GET", path: "/_nn_bootstrap_ready_check__" });
    assert.equal(getRes.statusCode, 200);
    assert.equal(getRes.body, "ok");
    assert.equal(nextListenerInvoked, false);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
