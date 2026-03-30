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
      script: path.join(appDir, "node_modules", "next", "dist", "bin", "next"),
      args: "start -H 127.0.0.1 -p 3000",
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
        TMPDIR: "/tmp",
      },
    },
  ],
};
