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
  const stderrLines = [];
  const origErr = console.error;
  console.error = (...args) => {
    stderrLines.push(args.join(" "));
    origErr.apply(console, args);
  };

  let nextListenerInvoked = false;
  const server = http.createServer(async (req, res) => {
    nextListenerInvoked = true;
    const pathOnly = (typeof req.url === "string" ? req.url : "").split("?")[0];
    const normalized =
      pathOnly.length > 1 && pathOnly.endsWith("/") ? pathOnly.slice(0, -1) || "/" : pathOnly;
    if (normalized === "/_nn_bootstrap_ready_check__") {
      await new Promise(() => {});
      return;
    }
    res.statusCode = 200;
    res.end("via-next");
  });

  await new Promise((resolve, reject) => {
    server.listen(0, "127.0.0.1", (err) => (err ? reject(err) : resolve()));
  });
  const port = server.address().port;
  try {
    const joined = () => stderrLines.join("\n");

    const headRes = await request({ port, method: "HEAD", path: "/_nn_bootstrap_ready_check__" });
    assert.equal(headRes.statusCode, 200);
    assert.equal(headRes.body, "");
    assert.equal(nextListenerInvoked, false);
    assert.match(joined(), /\[probe_debug\] emit hook triggered/);
    assert.match(joined(), /\[probe_debug\] matched probe path/);
    assert.match(joined(), /\[probe_debug\] short-circuit before Next/);
    assert.doesNotMatch(joined(), /\[probe_debug\] forwarding to Next/);

    stderrLines.length = 0;

    const getRes = await request({ port, method: "GET", path: "/_nn_bootstrap_ready_check__?probe=1" });
    assert.equal(getRes.statusCode, 200);
    assert.equal(getRes.body, "ok");
    assert.equal(nextListenerInvoked, false);
    assert.match(joined(), /\[probe_debug\] emit hook triggered/);
    assert.match(joined(), /\[probe_debug\] matched probe path/);
    assert.match(joined(), /\[probe_debug\] short-circuit before Next/);

    stderrLines.length = 0;
    nextListenerInvoked = false;

    const absHead = await request({
      port,
      method: "HEAD",
      path: `http://127.0.0.1:${port}/_nn_bootstrap_ready_check__`,
    });
    assert.equal(absHead.statusCode, 200);
    assert.equal(absHead.body, "");
    assert.equal(nextListenerInvoked, false);
    assert.match(joined(), /\[probe_debug\] matched probe path/);
    assert.match(joined(), /\[probe_debug\] short-circuit before Next/);

    stderrLines.length = 0;

    const other = await request({ port, method: "GET", path: "/some-other-path" });
    assert.equal(other.statusCode, 200);
    assert.equal(other.body, "via-next");
    assert.equal(nextListenerInvoked, true);
    assert.match(joined(), /\[probe_debug\] forwarding to Next/);
  } finally {
    console.error = origErr;
    await new Promise((resolve) => server.close(resolve));
  }
});
