#!/usr/bin/env node
import {
  formatScriptEnvDiagnostics,
  loadScriptEnv,
} from "./bootstrap-env.mjs";

const telemetry = loadScriptEnv({
  purpose: "env:check",
  requireDatabaseUrl: false,
  quiet: true,
});

console.log(formatScriptEnvDiagnostics(telemetry));

if (!telemetry.databaseUrlSet) {
  process.exitCode = 1;
}
