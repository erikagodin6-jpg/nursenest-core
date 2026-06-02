export const REFERRAL_CODE_COOKIE = "nn_ref";
export const REFERRAL_LANDING_COOKIE = "nn_ref_landing";
export const REFERRAL_UTM_SOURCE_COOKIE = "nn_ref_utm_source";
export const REFERRAL_UTM_MEDIUM_COOKIE = "nn_ref_utm_medium";
export const REFERRAL_UTM_CAMPAIGN_COOKIE = "nn_ref_utm_campaign";
export const REFERRAL_CLICK_PENDING_COOKIE = "nn_ref_click_pending";
export const REFERRAL_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export function referralCodeFromSearchParams(params: URLSearchParams): string | null {
  return (
    params.get("ref")?.trim() ||
    params.get("friendCode")?.trim() ||
    params.get("invite")?.trim() ||
    params.get("utm_ref")?.trim() ||
    null
  );
}
