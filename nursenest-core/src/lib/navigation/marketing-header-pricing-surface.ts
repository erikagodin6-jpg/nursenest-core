/**
 * Whether the marketing site header should show secondary exam tracks (New Grad, Allied)
 * inline instead of collapsing them behind "More Tracks".
 *
 * Kept as a pure helper so layout intent is testable without mounting the full header.
 */
export function marketingHeaderExposeSecondaryTracksInline(strippedPathname: string): boolean {
  if (strippedPathname === "/pricing") return true;
  return strippedPathname.startsWith("/pricing/");
}
