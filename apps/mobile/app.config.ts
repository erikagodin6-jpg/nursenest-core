import type { ConfigContext, ExpoConfig } from "expo/config";

/**
 * Dynamic Expo config — keeps secrets out of the repo.
 * - `EAS_PROJECT_ID`: set automatically by EAS Build; for local dev use `eas init` once.
 * - Never commit API keys or Sentry auth tokens; use EAS Secrets / env only.
 */
export default ({ config }: ConfigContext): ExpoConfig => {
  const easProjectId =
    process.env.EAS_PROJECT_ID?.trim() || "00000000-0000-4000-8000-000000000001";

  return {
    ...config,
    name: config.name ?? "NurseNest",
    slug: config.slug ?? "nursenest-mobile",
    version: config.version ?? "0.1.0",
    plugins: [
      ...(config.plugins ?? []),
      ["expo-notifications", { sounds: [], enableBackgroundRemoteNotifications: false }],
    ],
    extra: {
      ...config.extra,
      eas: {
        ...(typeof config.extra?.eas === "object" ? config.extra?.eas : {}),
        projectId: easProjectId,
      },
    },
  };
};
