/**
 * PM2 process file for NurseNest Core (Droplet).
 * Lives under deploy/droplet/; cwd resolves to the Next.js app root (nursenest-core/).
 */
const path = require("path");

const appDir = path.resolve(__dirname, "..", "..");

module.exports = {
  apps: [
    {
      name: "nursenest-core",
      cwd: appDir,
      // Standalone trace output — not `next start` (incompatible with output: "standalone" in next.config).
      script: path.join(appDir, "scripts", "start-standalone.mjs"),
      interpreter: "node",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_restarts: 20,
      min_uptime: "10s",
      max_memory_restart: "850M",
      env: {
        NODE_ENV: "production",
        PORT: "3000",
        HOSTNAME: "127.0.0.1",
        TMPDIR: "/tmp",
      },
    },
  ],
};
