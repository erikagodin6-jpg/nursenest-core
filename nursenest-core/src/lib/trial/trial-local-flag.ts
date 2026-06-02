const TRIAL_FLAG_KEY = "nn_trial_used";

export function hasLocalTrialFlag(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(TRIAL_FLAG_KEY) === "1";
  } catch {
    return false;
  }
}

export function setLocalTrialFlag(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(TRIAL_FLAG_KEY, "1");
  } catch {
    // Private browsing or quota exceeded
  }
}
