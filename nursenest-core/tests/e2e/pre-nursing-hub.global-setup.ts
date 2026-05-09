import { spawnSync } from "node:child_process";

function exitCodeFromSignal(signal: NodeJS.Signals | null): number {
  if (signal === "SIGTERM") return 143;
  if (signal === "SIGINT") return 130;
  return 1;
}

export default async function globalSetup() {
  const mode = process.env.APP_READY_MODE?.trim() || "guest";
  console.log(
    `[pre-nursing-hub.global-setup] wait-for-app-ready APP_READY_MODE=${mode} (guest: /app may 302→login; authenticated: set APP_READY_STORAGE_STATE + APP_READY_MODE=authenticated)`,
  );

  const env = {
    ...process.env,
    APP_READY_MODE: mode,
    APP_READY_PATHS: process.env.APP_READY_PATHS || "/,/login,/app,/pre-nursing",
    APP_READY_TIMEOUT_MS: process.env.APP_READY_TIMEOUT_MS || "300000",
    APP_READY_AUTH_CSRF: process.env.APP_READY_AUTH_CSRF || "1",
  };

  const result = spawnSync(process.execPath, ["scripts/qa/wait-for-app-ready.mjs"], {
    cwd: process.cwd(),
    env,
    stdio: "inherit",
  });

  if (result.signal) {
    process.exit(exitCodeFromSignal(result.signal));
  }
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
