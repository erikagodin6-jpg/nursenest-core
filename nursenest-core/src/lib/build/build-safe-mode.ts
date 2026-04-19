const NEXT_PRODUCTION_BUILD_PHASE = "phase-production-build";

function truthyEnv(value: string | undefined): boolean {
  const normalized = value?.trim().toLowerCase();
  return normalized === "1" || normalized === "true" || normalized === "yes";
}

export function isBuildSafeModeEnabled(envValue = process.env.NN_BUILD_SAFE_MODE): boolean {
  return truthyEnv(envValue);
}

export function isProductionBuildInvocation({
  nextPhase = process.env.NEXT_PHASE,
  npmLifecycleEvent = process.env.npm_lifecycle_event,
  argv = process.argv,
}: {
  nextPhase?: string | undefined;
  npmLifecycleEvent?: string | undefined;
  argv?: string[] | undefined;
} = {}): boolean {
  if (nextPhase === NEXT_PRODUCTION_BUILD_PHASE) return true;
  if (npmLifecycleEvent === "build") return true;
  const joinedArgv = Array.isArray(argv) ? argv.join(" ") : "";
  return joinedArgv.includes("next build");
}

/**
 * `NN_BUILD_SAFE_MODE=1` is a build-only operational fallback.
 * It should reduce non-critical fan-out during `next build` without changing normal runtime behavior.
 */
export function shouldReduceNonCriticalBuildWork({
  envValue = process.env.NN_BUILD_SAFE_MODE,
  nextPhase = process.env.NEXT_PHASE,
  npmLifecycleEvent = process.env.npm_lifecycle_event,
  argv = process.argv,
}: {
  envValue?: string | undefined;
  nextPhase?: string | undefined;
  npmLifecycleEvent?: string | undefined;
  argv?: string[] | undefined;
} = {}): boolean {
  return (
    isBuildSafeModeEnabled(envValue) &&
    isProductionBuildInvocation({ nextPhase, npmLifecycleEvent, argv })
  );
}
