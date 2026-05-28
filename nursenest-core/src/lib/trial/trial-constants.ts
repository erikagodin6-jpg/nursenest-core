/** Publicly advertised free-trial length. Keep this aligned with Stripe checkout and marketing copy. */
export const TRIAL_DURATION_DAYS = 3;
export const TRIAL_DURATION_MS = TRIAL_DURATION_DAYS * 24 * 60 * 60 * 1000;

/** HttpOnly cookie storing opaque device id for trial abuse prevention. */
export const TRIAL_DEVICE_COOKIE = "nn_device_fp";
