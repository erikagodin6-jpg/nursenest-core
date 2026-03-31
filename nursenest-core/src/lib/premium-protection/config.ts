/**
 * Premium content deterrence flags (env-tunable; not cryptographic security).
 * See `ProtectedPremiumContent` and print CSS — browsers cannot prevent screenshots.
 */
export type PremiumProtectionFlags = {
  copyDeterrence: boolean;
  watermark: boolean;
  hideProtectedOnPrint: boolean;
  blurOnHiddenTab: boolean;
};

function envBool(name: string, defaultValue: boolean): boolean {
  const v = process.env[name];
  if (v === undefined || v === "") return defaultValue;
  return v === "1" || v.toLowerCase() === "true" || v.toLowerCase() === "yes";
}

export function getServerPremiumProtectionFlags(): PremiumProtectionFlags {
  return {
    copyDeterrence: envBool("PREMIUM_COPY_DETERRENCE", true),
    watermark: envBool("PREMIUM_WATERMARK", true),
    hideProtectedOnPrint: envBool("PREMIUM_PRINT_HIDE_PROTECTED", true),
    blurOnHiddenTab: envBool("PREMIUM_BLUR_ON_TAB_HIDDEN", false),
  };
}

/** Serialize for client components (passed from server layouts). */
export function serializePremiumFlags(f: PremiumProtectionFlags): PremiumProtectionFlags {
  return { ...f };
}
