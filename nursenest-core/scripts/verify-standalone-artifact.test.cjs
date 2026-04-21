const assert = require("node:assert/strict");
const { spawn, spawnSync } = require("node:child_process");
const fs = require("node:fs");
const net = require("node:net");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

async function loadVerifier() {
  return import(pathToFileUrl(path.join(__dirname, "verify-standalone-artifact.mjs")));
}

function pathToFileUrl(filePath) {
  const normalized = path.resolve(filePath).replace(/\\/g, "/");
  return `file://${normalized}`;
}

function createTempScriptRoot(prefix, scriptNames) {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  const scriptsDir = path.join(tempRoot, "scripts");
  fs.mkdirSync(scriptsDir, { recursive: true });
  for (const scriptName of scriptNames) {
    fs.copyFileSync(path.join(__dirname, scriptName), path.join(scriptsDir, scriptName));
  }
  return tempRoot;
}

const STARTUP_RUNTIME_SCRIPTS = [
  "start-standalone.mjs",
  "start-standalone-runtime.cjs",
  "resolve-bootstrap-mode.mjs",
  "standalone-bootstrap-probe-pathname.mjs",
  "standalone-startup-watchdog-preload.cjs",
  "standalone-startup-watchdog-preload-shared.cjs",
  "standalone-startup-watchdog-shared.cjs",
  "standalone-bootstrap-healthz-shared.cjs",
  "verify-standalone-artifact.mjs",
];

function createTempRuntimeRoot(prefix) {
  return createTempScriptRoot(prefix, STARTUP_RUNTIME_SCRIPTS);
}

function waitFor(condition, { timeoutMs = 10_000, intervalMs = 25 } = {}) {
  const startedAt = Date.now();
  return new Promise((resolve, reject) => {
    const tick = () => {
      if (condition()) {
        resolve();
        return;
      }
      if (Date.now() - startedAt > timeoutMs) {
        reject(new Error(`Condition not met within ${timeoutMs}ms`));
        return;
      }
      setTimeout(tick, intervalMs);
    };
    tick();
  });
}

function allocatePort() {
  return new Promise((resolve, reject) => {
    const socket = net.createServer();
    socket.listen(0, "127.0.0.1", () => {
      const address = socket.address();
      const port = typeof address === "object" && address ? address.port : 0;
      socket.close((error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(port);
      });
    });
    socket.on("error", reject);
  });
}

test("verifyStandaloneArtifact returns the expected nested standalone server path", async () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "nn-standalone-artifact-"));
  const standaloneEntry = path.join(tempRoot, ".next", "standalone", "nursenest-core", "server.js");
  fs.mkdirSync(path.dirname(standaloneEntry), { recursive: true });
  fs.writeFileSync(standaloneEntry, "module.exports = {};\n", "utf8");

  try {
    const { getExpectedStandaloneServerPath, verifyStandaloneArtifact } = await loadVerifier();
    assert.equal(getExpectedStandaloneServerPath(tempRoot), standaloneEntry);
    assert.equal(verifyStandaloneArtifact(tempRoot), standaloneEntry);
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});

test("verifyStandaloneArtifact falls back to the top-level standalone server path", async () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "nn-standalone-artifact-top-level-"));
  const standaloneEntry = path.join(tempRoot, ".next", "standalone", "server.js");
  fs.mkdirSync(path.dirname(standaloneEntry), { recursive: true });
  fs.writeFileSync(standaloneEntry, "module.exports = {};\n", "utf8");

  try {
    const { verifyStandaloneArtifact } = await loadVerifier();
    assert.equal(verifyStandaloneArtifact(tempRoot), standaloneEntry);
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});

test("verifyStandaloneArtifact discovers a non-canonical standalone server.js under .next/standalone", async () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "nn-standalone-artifact-deep-"));
  const standaloneEntry = path.join(tempRoot, ".next", "standalone", "packages", "web", "server.js");
  fs.mkdirSync(path.dirname(standaloneEntry), { recursive: true });
  fs.writeFileSync(standaloneEntry, "module.exports = {};\n", "utf8");

  try {
    const { verifyStandaloneArtifact, getStandaloneStaticSyncTargets } = await loadVerifier();
    assert.equal(verifyStandaloneArtifact(tempRoot), standaloneEntry);
    const targets = getStandaloneStaticSyncTargets(tempRoot);
    assert.equal(targets.length, 1);
    assert.equal(targets[0].serverPath, standaloneEntry);
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});

test("verifyStandaloneArtifact prefers nested nursenest-core server when an extra standalone server.js also exists", async () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "nn-standalone-artifact-prefer-nested-"));
  const nestedEntry = path.join(tempRoot, ".next", "standalone", "nursenest-core", "server.js");
  const extraEntry = path.join(tempRoot, ".next", "standalone", "alt", "server.js");
  fs.mkdirSync(path.dirname(nestedEntry), { recursive: true });
  fs.mkdirSync(path.dirname(extraEntry), { recursive: true });
  fs.writeFileSync(nestedEntry, "module.exports = {};\n", "utf8");
  fs.writeFileSync(extraEntry, "module.exports = {};\n", "utf8");

  try {
    const { verifyStandaloneArtifact, getStandaloneStaticSyncTargets } = await loadVerifier();
    assert.equal(verifyStandaloneArtifact(tempRoot), nestedEntry);
    assert.equal(getStandaloneStaticSyncTargets(tempRoot).length, 2);
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});

test("discoverStandaloneServerJsPaths skips node_modules", async () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "nn-standalone-skip-nm-"));
  const good = path.join(tempRoot, ".next", "standalone", "app", "server.js");
  const bad = path.join(tempRoot, ".next", "standalone", "node_modules", "pkg", "server.js");
  fs.mkdirSync(path.dirname(good), { recursive: true });
  fs.mkdirSync(path.dirname(bad), { recursive: true });
  fs.writeFileSync(good, "module.exports = {};\n", "utf8");
  fs.writeFileSync(bad, "module.exports = {};\n", "utf8");

  try {
    const { discoverStandaloneServerJsPaths } = await loadVerifier();
    const paths = discoverStandaloneServerJsPaths(tempRoot);
    assert.equal(paths.length, 1);
    assert.equal(paths[0], good);
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});

test("verifyStandaloneArtifact hard-fails when both standalone server paths are missing", async () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "nn-standalone-artifact-missing-"));

  try {
    const { verifyStandaloneArtifact } = await loadVerifier();
    assert.throws(
      () => verifyStandaloneArtifact(tempRoot),
      /standalone server\.js not found under \.next\/standalone \(excluding node_modules\)\.\nChecked canonical paths:\n  - .*\.next\/standalone\/nursenest-core\/server\.js\n  - .*\.next\/standalone\/server\.js/,
    );
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});

test("verify-standalone-artifact CLI exits 0 and prints the verified nested server path", () => {
  const tempRoot = createTempScriptRoot("nn-standalone-artifact-cli-ok-", ["verify-standalone-artifact.mjs"]);
  const standaloneEntry = path.join(tempRoot, ".next", "standalone", "nursenest-core", "server.js");
  fs.mkdirSync(path.dirname(standaloneEntry), { recursive: true });
  fs.writeFileSync(standaloneEntry, "module.exports = {};\n", "utf8");

  try {
    const result = spawnSync(process.execPath, [path.join(tempRoot, "scripts", "verify-standalone-artifact.mjs")], {
      encoding: "utf8",
      timeout: 5000,
    });

    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, new RegExp(`\\[verify-standalone-artifact\\] verified ${standaloneEntry.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`));
    assert.equal(result.stderr, "");
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});

test("verify-standalone-artifact CLI exits 1 with a clear FATAL when the nested server path is missing", () => {
  const tempRoot = createTempScriptRoot("nn-standalone-artifact-cli-missing-", ["verify-standalone-artifact.mjs"]);

  try {
    const result = spawnSync(process.execPath, [path.join(tempRoot, "scripts", "verify-standalone-artifact.mjs")], {
      encoding: "utf8",
      timeout: 5000,
    });

    assert.equal(result.status, 1);
    assert.match(
      result.stderr,
      /FATAL: standalone server\.js not found under \.next\/standalone \(excluding node_modules\)\.\nChecked canonical paths:\n  - .*\.next\/standalone\/nursenest-core\/server\.js\n  - .*\.next\/standalone\/server\.js\nRun `npm run build` \(or `npm run build:deploy:full`\) from nursenest-core to generate a fresh standalone build\./,
    );
    assert.equal(result.stdout, "");
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});

test("verify-standalone-artifact CLI accepts the top-level standalone server path", () => {
  const tempRoot = createTempScriptRoot("nn-standalone-artifact-cli-top-level-", ["verify-standalone-artifact.mjs"]);
  const standaloneEntry = path.join(tempRoot, ".next", "standalone", "server.js");
  fs.mkdirSync(path.dirname(standaloneEntry), { recursive: true });
  fs.writeFileSync(standaloneEntry, "module.exports = {};\n", "utf8");

  try {
    const result = spawnSync(process.execPath, [path.join(tempRoot, "scripts", "verify-standalone-artifact.mjs")], {
      encoding: "utf8",
      timeout: 5000,
    });

    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, new RegExp(`\\[verify-standalone-artifact\\] verified ${standaloneEntry.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`));
    assert.equal(result.stderr, "");
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});

test("next config keeps standalone output enabled", () => {
  const nextConfig = fs.readFileSync(path.join(__dirname, "..", "next.config.ts"), "utf8");
  assert.match(nextConfig, /output:\s*"standalone"/);
});

test("ensure-standalone-static copies .next/static beside nested standalone server.js", async () => {
  const tempRoot = createTempScriptRoot("nn-ensure-standalone-static-", [
    "ensure-standalone-static.mjs",
    "verify-standalone-artifact.mjs",
  ]);
  const standaloneEntry = path.join(tempRoot, ".next", "standalone", "nursenest-core", "server.js");
  fs.mkdirSync(path.dirname(standaloneEntry), { recursive: true });
  fs.writeFileSync(standaloneEntry, "module.exports = {};\n", "utf8");

  const srcStatic = path.join(tempRoot, ".next", "static");
  fs.mkdirSync(path.join(srcStatic, "css"), { recursive: true });
  fs.mkdirSync(path.join(srcStatic, "chunks"), { recursive: true });
  fs.mkdirSync(path.join(srcStatic, "media"), { recursive: true });
  fs.writeFileSync(path.join(srcStatic, "css", "app.css"), "body{}\n", "utf8");
  fs.writeFileSync(path.join(srcStatic, "chunks", "main.js"), "export {}\n", "utf8");
  fs.writeFileSync(path.join(srcStatic, "media", "x.woff2"), Buffer.from([0, 1, 2, 3]), "utf8");

  try {
    const result = spawnSync(process.execPath, [path.join(tempRoot, "scripts", "ensure-standalone-static.mjs")], {
      encoding: "utf8",
      timeout: 5000,
      cwd: tempRoot,
    });
    assert.equal(result.status, 0, result.stderr + result.stdout);
    const destCss = path.join(tempRoot, ".next", "standalone", "nursenest-core", ".next", "static", "css", "app.css");
    const destJs = path.join(tempRoot, ".next", "standalone", "nursenest-core", ".next", "static", "chunks", "main.js");
    const destFont = path.join(tempRoot, ".next", "standalone", "nursenest-core", ".next", "static", "media", "x.woff2");
    assert.ok(fs.existsSync(destCss));
    assert.ok(fs.existsSync(destJs));
    assert.ok(fs.existsSync(destFont));
    assert.match(result.stdout, /\[ensure-standalone-static\] copied/);
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});

test("ensure-standalone-static copies .next/static beside both nested and top-level standalone server.js", async () => {
  const tempRoot = createTempScriptRoot("nn-ensure-standalone-static-dual-", [
    "ensure-standalone-static.mjs",
    "verify-standalone-artifact.mjs",
  ]);
  const nestedServer = path.join(tempRoot, ".next", "standalone", "nursenest-core", "server.js");
  const topServer = path.join(tempRoot, ".next", "standalone", "server.js");
  fs.mkdirSync(path.dirname(nestedServer), { recursive: true });
  fs.mkdirSync(path.dirname(topServer), { recursive: true });
  fs.writeFileSync(nestedServer, "module.exports = {};\n", "utf8");
  fs.writeFileSync(topServer, "module.exports = {};\n", "utf8");

  const srcStatic = path.join(tempRoot, ".next", "static");
  fs.mkdirSync(path.join(srcStatic, "css"), { recursive: true });
  fs.mkdirSync(path.join(srcStatic, "chunks"), { recursive: true });
  fs.writeFileSync(path.join(srcStatic, "css", "app.css"), "body{}\n", "utf8");
  fs.writeFileSync(path.join(srcStatic, "chunks", "main.js"), "export {}\n", "utf8");

  try {
    const result = spawnSync(process.execPath, [path.join(tempRoot, "scripts", "ensure-standalone-static.mjs")], {
      encoding: "utf8",
      timeout: 5000,
      cwd: tempRoot,
    });
    assert.equal(result.status, 0, result.stderr + result.stdout);
    const nestedCss = path.join(tempRoot, ".next", "standalone", "nursenest-core", ".next", "static", "css", "app.css");
    const topCss = path.join(tempRoot, ".next", "standalone", ".next", "static", "css", "app.css");
    const topStaticDir = path.join(tempRoot, ".next", "standalone", ".next", "static");
    assert.ok(fs.existsSync(nestedCss));
    assert.ok(fs.existsSync(topCss));
    const copied = (result.stdout.match(/\[ensure-standalone-static\] copied/g) || []).length;
    const symlinked = (result.stdout.match(/\[ensure-standalone-static\] symlinked/g) || []).length;
    if (process.platform === "win32") {
      assert.equal(copied, 2);
      assert.equal(symlinked, 0);
    } else {
      assert.equal(copied, 1);
      assert.equal(symlinked, 1);
      assert.ok(fs.lstatSync(topStaticDir).isSymbolicLink());
    }
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});

test("deploy scripts: build:deploy is post-compile only; heroku-postbuild runs compile before cache", () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "package.json"), "utf8"));
  assert.deepEqual(pkg.cacheDirectories, ["node_modules", ".next/cache"]);
  assert.equal(
    pkg.scripts["heroku-postbuild"],
    "node scripts/log-build-cache-hints.mjs && npm run verify:bootstrap-probe-pathname && NN_POSTBUILD_NEXT_BUILD=1 npm run build && node scripts/log-build-cache-hints.mjs --phase=heroku_postbuild_after_compile",
  );
  assert.equal(pkg.scripts.build, "node scripts/run-buildpack-build.mjs");
  assert.equal(pkg.scripts["build:compile"].includes("next build"), true);
  assert.match(
    pkg.scripts["build:compile"],
    /NODE_OPTIONS=\$\{NODE_OPTIONS:-"--max-old-space-size=\$\{BUILD_NODE_MAX_OLD_SPACE_SIZE_MB:-3584\}"\}/,
  );
  assert.equal(pkg.scripts["verify:standalone-artifact"], "node scripts/verify-standalone-artifact.mjs");
  assert.equal(pkg.scripts["build:deploy"], "npm run build:deploy:postbuild");
  assert.equal(pkg.scripts["build:deploy:app-platform"], "npm run build:deploy");
  assert.equal(pkg.scripts["build:deploy:postbuild"].includes("npm run build"), false);
  assert.equal(pkg.scripts["build:deploy:full"], "node scripts/run-build-deploy-full.mjs");
  assert.equal(pkg.scripts.start, "node scripts/start-standalone.mjs");
  assert.match(pkg.scripts["ci:verify"], /node scripts\/ensure-standalone-static\.mjs/);
});

test("active DigitalOcean app spec builds before runtime, starts through npm run start, and routes readiness through /readyz", () => {
  const appSpec = fs.readFileSync(path.join(__dirname, "..", "..", ".do", "app-nursenest-core-next.yaml"), "utf8");
  assert.match(appSpec, /build_command: npm run build:deploy/);
  assert.match(appSpec, /NN_TIMED_INCLUDE_NPM_PRUNE/);
  assert.match(appSpec, /- key: BUILD_WEBPACK_PARALLELISM\n\s+value: "1"/);
  assert.match(appSpec, /run_command: npm run start/);
  assert.match(appSpec, /health_check:\n(?:.*\n)*?\s+http_path: \/readyz/);
  assert.match(appSpec, /liveness_health_check:\n(?:.*\n)*?\s+http_path: \/healthz/);
});

test("runtime startup uses the same standalone artifact resolution as build verification", () => {
  const startupSource = fs.readFileSync(path.join(__dirname, "start-standalone.mjs"), "utf8");
  assert.match(startupSource, /verifyStandaloneArtifact/);
  assert.match(startupSource, /verify-standalone-artifact\.mjs/);
});

test("start-standalone hard-fails immediately when the standalone server artifact is missing", () => {
  const tempRoot = createTempRuntimeRoot("nn-start-standalone-missing-");

  try {
    const result = spawnSync(process.execPath, [path.join(tempRoot, "scripts", "start-standalone.mjs")], {
      encoding: "utf8",
      timeout: 5000,
    });

    assert.equal(result.status, 1);
    assert.match(
      result.stderr,
      /FATAL: standalone server\.js not found under \.next\/standalone \(excluding node_modules\)\.\nChecked canonical paths:\n  - .*\.next\/standalone\/nursenest-core\/server\.js\n  - .*\.next\/standalone\/server\.js\nRun `npm run build` \(or `npm run build:deploy:full`\) from nursenest-core to generate a fresh standalone build\./,
    );
    assert.equal(result.stdout, "");
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});

test("start-standalone accepts the top-level standalone server path", async (t) => {
  const tempRoot = createTempRuntimeRoot("nn-start-standalone-top-level-");
  const standaloneEntry = path.join(tempRoot, ".next", "standalone", "server.js");
  fs.mkdirSync(path.dirname(standaloneEntry), { recursive: true });
  fs.writeFileSync(standaloneEntry, "setInterval(() => {}, 1000);\n", "utf8");

  const port = await allocatePort();
  const combined = [];
  const child = spawn(process.execPath, [path.join(tempRoot, "scripts", "start-standalone.mjs")], {
    cwd: tempRoot,
    env: {
      ...process.env,
      NODE_ENV: "test",
      HOSTNAME: "127.0.0.1",
      PORT: String(port),
      NN_BYPASS_BOOTSTRAP: "1",
    },
    stdio: ["ignore", "pipe", "pipe"],
  });
  const capture = (chunk) => combined.push(String(chunk));
  child.stdout.on("data", capture);
  child.stderr.on("data", capture);

  t.after(async () => {
    if (child.exitCode == null && !child.killed) {
      child.kill("SIGTERM");
      await new Promise((resolve) => child.once("exit", resolve));
    }
    fs.rmSync(tempRoot, { recursive: true, force: true });
  });

  await waitFor(() => combined.join("").includes("startup_watchdog standalone_spawn"));
  assert.match(combined.join(""), new RegExp(`"entry":"${standaloneEntry.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`));

  const readyRes = await fetch(`http://127.0.0.1:${port}/readyz`);
  assert.equal(readyRes.status, 200);
  assert.equal(await readyRes.text(), "ok");
});

test("start-standalone exits fatally on readiness timeout with probe URL, timeout, and child state in the error", async (t) => {
  const tempRoot = createTempRuntimeRoot("nn-start-standalone-timeout-");
  const standaloneEntry = path.join(tempRoot, ".next", "standalone", "server.js");
  fs.mkdirSync(path.dirname(standaloneEntry), { recursive: true });
  fs.writeFileSync(
    standaloneEntry,
    [
      "const net = require('node:net');",
      "const server = net.createServer(() => {});",
      "server.listen(Number(process.env.PORT), process.env.HOSTNAME || '127.0.0.1');",
      "setInterval(() => {}, 1000);",
    ].join("\n"),
    "utf8",
  );

  const port = await allocatePort();
  const combined = [];
  const child = spawn(process.execPath, [path.join(tempRoot, "scripts", "start-standalone.mjs")], {
    cwd: tempRoot,
    env: {
      ...process.env,
      NODE_ENV: "production",
      HOSTNAME: "127.0.0.1",
      PORT: String(port),
      NN_BOOTSTRAP_READY_TIMEOUT_MS: "300",
      NN_CHILD_HEALTH_TIMEOUT_MS: "100",
      NN_BOOTSTRAP_READY_MAX_ATTEMPTS: "2",
    },
    stdio: ["ignore", "pipe", "pipe"],
  });
  const capture = (chunk) => combined.push(String(chunk));
  child.stdout.on("data", capture);
  child.stderr.on("data", capture);

  t.after(() => {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  });

  const exitCode = await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error(`timed out waiting for startup exit\n${combined.join("")}`));
    }, 8000);
    child.once("exit", (code) => {
      clearTimeout(timeout);
      resolve(code);
    });
  });

  assert.equal(exitCode, 1, combined.join(""));
  assert.match(combined.join(""), /startup_watchdog handlers_init_failed/);
  assert.match(
    combined.join(""),
    /probeUrl=http:\/\/127\.0\.0\.1:\d+\/_nn_bootstrap_ready_check__/,
  );
  assert.match(combined.join(""), /readiness_fatal_(timeout|max_attempts)/);
  assert.match(combined.join(""), /FATAL: readiness watchdog/);
  assert.match(combined.join(""), /timeoutMs=300/);
  assert.match(combined.join(""), /"childState":\{"childPid":\d+/);
  assert.match(combined.join(""), /childState=\{\\"childPid\\":\d+/);
});

test("start-standalone reaches ready without bypass; /readyz reflects real child readiness", async (t) => {
  const tempRoot = createTempRuntimeRoot("nn-start-standalone-prod-ignore-bypass-");
  const standaloneEntry = path.join(tempRoot, ".next", "standalone", "server.js");
  fs.mkdirSync(path.dirname(standaloneEntry), { recursive: true });
  fs.writeFileSync(
    standaloneEntry,
    [
      "const http = require('node:http');",
      "const server = http.createServer((req, res) => {",
      "  const isHealth = req.url === '/api/health' || req.url.startsWith('/api/health?');",
      "  res.statusCode = 200;",
      "  res.setHeader('cache-control', 'no-store');",
      "  res.setHeader('content-type', isHealth ? 'application/json; charset=utf-8' : 'text/plain; charset=utf-8');",
      "  if ((req.method || '').toUpperCase() === 'HEAD') {",
      "    res.end();",
      "    return;",
      "  }",
      "  res.end(isHealth ? '{\"ok\":true,\"live\":true}' : 'ok');",
      "});",
      "server.listen(Number(process.env.PORT), process.env.HOSTNAME || '127.0.0.1');",
      "setInterval(() => {}, 1000);",
    ].join("\n"),
    "utf8",
  );

  const port = await allocatePort();
  const combined = [];
  const child = spawn(process.execPath, [path.join(tempRoot, "scripts", "start-standalone.mjs")], {
    cwd: tempRoot,
    env: {
      ...process.env,
      NODE_ENV: "production",
      HOSTNAME: "127.0.0.1",
      PORT: String(port),
      NN_CHILD_HEALTH_TIMEOUT_MS: "100",
      NN_BOOTSTRAP_READY_TIMEOUT_MS: "4000",
      NN_BOOTSTRAP_READY_MAX_ATTEMPTS: "30",
    },
    stdio: ["ignore", "pipe", "pipe"],
  });
  const capture = (chunk) => combined.push(String(chunk));
  child.stdout.on("data", capture);
  child.stderr.on("data", capture);

  t.after(async () => {
    if (child.exitCode == null && !child.killed) {
      child.kill("SIGTERM");
      await new Promise((resolve) => child.once("exit", resolve));
    }
    fs.rmSync(tempRoot, { recursive: true, force: true });
  });

  await waitFor(() => combined.join("").includes("startup_watchdog server_listening"));
  await waitFor(() => combined.join("").includes("startup_watchdog standalone_spawn"));

  const earlyLogs = combined.join("");
  assert.doesNotMatch(earlyLogs, /startup_watchdog watchdog_bypass_enabled/);
  assert.doesNotMatch(earlyLogs, /startup_watchdog handlers_ready/);

  await waitFor(() => combined.join("").includes("startup_watchdog internal_probe_response"), {
    timeoutMs: 10_000,
    intervalMs: 50,
  });
  await waitFor(() => combined.join("").includes("startup_watchdog handlers_ready"), {
    timeoutMs: 10_000,
    intervalMs: 50,
  });

  const finalLogs = combined.join("");
  assert.doesNotMatch(finalLogs, /startup_watchdog watchdog_bypass_enabled/);
  assert.match(finalLogs, /startup_watchdog handlers_ready/);
  assert.match(finalLogs, /"probeUrl":"http:\/\/127\.0\.0\.1:\d+\/_nn_bootstrap_ready_check__"/);
  assert.doesNotMatch(finalLogs, /"probeUrl":"http:\/\/127\.0\.0\.1:\d+\/api\/health"/);

  const readyRes = await fetch(`http://127.0.0.1:${port}/readyz`);
  assert.equal(readyRes.status, 200);
  assert.equal(await readyRes.text(), "ok");

  const readyApiRes = await fetch(`http://127.0.0.1:${port}/api/health`);
  assert.equal(readyApiRes.status, 200);
  assert.equal(await readyApiRes.text(), '{"ok":true,"live":true}');
});
