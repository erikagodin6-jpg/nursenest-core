import { getSentryDsnClient, getSentryDsnServer } from "@/lib/observability/sentry-dsn";

type SentryRuntime = "server" | "edge" | "client";

function readTrimmed(value: string | undefined): string | undefined {
  const next = value?.trim();
  return next ? next : undefined;
}

function clampSampleRate(value: number, fallback: number): number {
  return Number.isFinite(value) && value >= 0 && value <= 1 ? value : fallback;
}

export function isSentryServerRuntimeEnabled(): boolean {
  return process.env.SENTRY_ENABLED === "true" && Boolean(getSentryDsnServer());
}

export function isSentryClientRuntimeEnabled(): boolean {
  return process.env.NEXT_PUBLIC_SENTRY_ENABLED === "true" && Boolean(getSentryDsnClient());
}

export function isSentryClientReplayEnabled(): boolean {
  return process.env.NEXT_PUBLIC_SENTRY_REPLAY_ENABLED === "true";
}

export function getSentryEnvironmentServer(): string | undefined {
  return (
    readTrimmed(process.env.SENTRY_ENVIRONMENT) ||
    readTrimmed(process.env.VERCEL_ENV) ||
    readTrimmed(process.env.NODE_ENV)
  );
}

export function getSentryEnvironmentClient(): string | undefined {
  return (
    readTrimmed(process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT) ||
    readTrimmed(process.env.NEXT_PUBLIC_VERCEL_ENV) ||
    readTrimmed(process.env.NODE_ENV)
  );
}

export function getSentryTraceSampleRate(runtime: SentryRuntime): number {
  const isDev = process.env.NODE_ENV === "development";
  const envValue =
    runtime === "client"
      ? readTrimmed(process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE)
      : readTrimmed(process.env.SENTRY_TRACES_SAMPLE_RATE);
  const fallback =
    runtime === "server" ? (isDev ? 0.2 : 0.05) : runtime === "edge" ? (isDev ? 0.15 : 0.03) : isDev ? 0.1 : 0.01;
  return clampSampleRate(envValue ? Number(envValue) : fallback, fallback);
}

export function getSentryProfilesSampleRate(): number {
  const isDev = process.env.NODE_ENV === "development";
  const fallback = isDev ? 0 : 0;
  const envValue = readTrimmed(process.env.SENTRY_PROFILES_SAMPLE_RATE);
  return clampSampleRate(envValue ? Number(envValue) : fallback, fallback);
}
