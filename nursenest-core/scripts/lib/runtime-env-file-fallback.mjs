import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

import { STRIPE_RUNTIME_ENV_KEYS } from "./stripe-runtime-env-keys.mjs";

export const DEFAULT_RUNTIME_ENV_FILE = "/app/nursenest-core/.runtime/env.production";
export const RUNTIME_ENV_FILE_ENV_KEY = "NN_RUNTIME_ENV_FILE";

const CORE_RUNTIME_ENV_FILE_KEYS = Object.freeze([
  "DATABASE_URL",
  "AUTH_SECRET",
  "NEXTAUTH_SECRET",
  "AUTH_URL",
  "NEXTAUTH_URL",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
]);

export const RUNTIME_ENV_FILE_ALLOWLIST = Object.freeze(
  [...new Set([...CORE_RUNTIME_ENV_FILE_KEYS, ...STRIPE_RUNTIME_ENV_KEYS])].sort(),
);

export class RuntimeEnvFileFallbackError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = "RuntimeEnvFileFallbackError";
    this.code = code;
    this.details = details;
  }
}

function normalizeRuntimeEnvFilePath(runtimeEnvFile) {
  const candidate = String(runtimeEnvFile ?? "").trim();
  if (!candidate) return DEFAULT_RUNTIME_ENV_FILE;
  return path.resolve(candidate);
}

function isCommentOnly(text) {
  return text.trim().length === 0 || text.trimStart().startsWith("#");
}

function decodeQuotedValue(rawValue, lineNumber) {
  const quote = rawValue[0];
  let value = "";
  let escaped = false;

  for (let index = 1; index < rawValue.length; index += 1) {
    const character = rawValue[index];
    if (escaped) {
      switch (character) {
        case "n":
          value += "\n";
          break;
        case "r":
          value += "\r";
          break;
        case "t":
          value += "\t";
          break;
        case "\\":
          value += "\\";
          break;
        case "'":
          value += "'";
          break;
        case '"':
          value += '"';
          break;
        default:
          value += character;
          break;
      }
      escaped = false;
      continue;
    }

    if (character === "\\") {
      escaped = true;
      continue;
    }

    if (character === quote) {
      const trailing = rawValue.slice(index + 1).trim();
      if (trailing && !trailing.startsWith("#")) {
        throw new RuntimeEnvFileFallbackError(
          "RUNTIME_ENV_FILE_INVALID",
          `Malformed runtime env file at line ${lineNumber}: unexpected trailing content after quoted value.`,
          { lineNumber },
        );
      }
      return value;
    }

    value += character;
  }

  throw new RuntimeEnvFileFallbackError(
    "RUNTIME_ENV_FILE_INVALID",
    `Malformed runtime env file at line ${lineNumber}: missing closing quote.`,
    { lineNumber },
  );
}

function decodeUnquotedValue(rawValue) {
  const commentIndex = rawValue.search(/\s#/);
  if (commentIndex >= 0) {
    return rawValue.slice(0, commentIndex).trim();
  }
  return rawValue.trim();
}

export function parseRuntimeEnvFile(text) {
  const values = new Map();
  const lines = String(text).replace(/\r\n?/g, "\n").split("\n");

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const lineNumber = index + 1;
    if (isCommentOnly(line)) continue;

    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!match) {
      throw new RuntimeEnvFileFallbackError(
        "RUNTIME_ENV_FILE_INVALID",
        `Malformed runtime env file at line ${lineNumber}: expected KEY=value.`,
        { lineNumber },
      );
    }

    const [, key, rawValue] = match;
    const value =
      rawValue.startsWith('"') || rawValue.startsWith("'")
        ? decodeQuotedValue(rawValue, lineNumber)
        : decodeUnquotedValue(rawValue);

    values.set(key, value);
  }

  return { values };
}

export function resolveRuntimeEnvFilePath(env = process.env) {
  return normalizeRuntimeEnvFilePath(env?.[RUNTIME_ENV_FILE_ENV_KEY]);
}

export function validateRuntimeEnvFilePermissions(runtimeEnvFile) {
  const stats = statSync(runtimeEnvFile);
  if (!stats.isFile()) {
    throw new RuntimeEnvFileFallbackError(
      "RUNTIME_ENV_FILE_INVALID",
      "Runtime env file path must point to a regular file.",
      { runtimeEnvFile },
    );
  }

  const mode = stats.mode & 0o777;
  if ((mode & 0o077) !== 0) {
    throw new RuntimeEnvFileFallbackError(
      "RUNTIME_ENV_FILE_PERMISSIONS",
      `Runtime env file permissions are too open (${mode.toString(8)}). Expected owner-only access such as 600.`,
      { runtimeEnvFile, mode },
    );
  }

  return mode;
}

export function loadRuntimeEnvFileFallback(options = {}) {
  const {
    env = process.env,
    logger = console,
    runtimeEnvFile = resolveRuntimeEnvFilePath(env),
  } = options;

  const normalizedPath = normalizeRuntimeEnvFilePath(runtimeEnvFile);
  if (!existsSync(normalizedPath)) {
    return {
      runtimeEnvFile: normalizedPath,
      filePresent: false,
      loadedKeys: [],
      ignoredKeys: [],
      skippedExistingKeys: [],
    };
  }

  const rawText = readFileSync(normalizedPath, "utf8");
  const { values } = parseRuntimeEnvFile(rawText);
  const allowlist = new Set(RUNTIME_ENV_FILE_ALLOWLIST);
  const preExistingKeys = new Set(Object.keys(env ?? {}));
  const loadedKeys = [];
  const ignoredKeys = [];
  const skippedExistingKeys = [];

  for (const [key, value] of values.entries()) {
    if (!allowlist.has(key)) {
      ignoredKeys.push(key);
      continue;
    }

    if (preExistingKeys.has(key)) {
      skippedExistingKeys.push(key);
      continue;
    }

    env[key] = value;
    loadedKeys.push(key);
  }

  const sortedLoadedKeys = [...loadedKeys].sort();
  const sortedIgnoredKeys = [...ignoredKeys].sort();
  const sortedSkippedExistingKeys = [...skippedExistingKeys].sort();

  logger.error(
    `[runtime-env-file] runtime_env_file_loaded:true runtime_env_file_path:${JSON.stringify(normalizedPath)} loaded_keys:${JSON.stringify(sortedLoadedKeys)}${sortedIgnoredKeys.length ? ` ignored_keys:${JSON.stringify(sortedIgnoredKeys)}` : ""}${sortedSkippedExistingKeys.length ? ` skipped_existing_keys:${JSON.stringify(sortedSkippedExistingKeys)}` : ""}`,
  );

  return {
    runtimeEnvFile: normalizedPath,
    filePresent: true,
    loadedKeys: sortedLoadedKeys,
    ignoredKeys: sortedIgnoredKeys,
    skippedExistingKeys: sortedSkippedExistingKeys,
  };
}
