/**
 * Stub feature flags until server-driven flags are wired (PostHog / dedicated service).
 */
export function getFeatureFlag(key: string): boolean {
  const trace =
    __DEV__ &&
    (process.env.EXPO_PUBLIC_FEATURE_FLAGS_STUB === "1" ||
      process.env.EXPO_PUBLIC_FEATURE_FLAGS_STUB?.toLowerCase() === "true");
  if (trace) {
    console.debug("[nn:flags] stub", key);
  }
  void key;
  return false;
}
