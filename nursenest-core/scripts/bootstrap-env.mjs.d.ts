export type ScriptEnvTelemetry = {
  cwd: string;
  appRoot: string;
  repoRoot: string;
  files: Array<{ label: string; path: string; exists: boolean }>;
  databaseUrlSet: boolean;
  directUrlSet: boolean;
  databaseUrlSource: string;
  directUrlSource: string;
};

export function loadScriptEnv(options?: {
  requireDatabaseUrl?: boolean;
  log?: boolean;
  quiet?: boolean;
  prefix?: string;
}): ScriptEnvTelemetry;

export function requireScriptDatabaseUrl(options?: {
  log?: boolean;
  quiet?: boolean;
  prefix?: string;
}): ScriptEnvTelemetry;

export function formatScriptEnvDiagnostics(telemetry: ScriptEnvTelemetry): string;
