const KEY_PREFIX = "popup_suppressed_until_";
const SUPPRESSION_MS = 24 * 60 * 60 * 1000;

export function shouldShowPopup(popupId: string): boolean {
  try {
    const value = localStorage.getItem(KEY_PREFIX + popupId);
    if (!value) return true;
    return Date.now() > Number(value);
  } catch {
    return true;
  }
}

export function suppressPopup(popupId: string): void {
  try {
    localStorage.setItem(KEY_PREFIX + popupId, String(Date.now() + SUPPRESSION_MS));
  } catch {}
}

export function clearPopupSuppression(popupId: string): void {
  try {
    localStorage.removeItem(KEY_PREFIX + popupId);
  } catch {}
}
