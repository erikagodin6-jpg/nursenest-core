/**
 * Resolve the user's preferred display name from available name fields.
 * Priority: displayName > firstName > first word of name > null.
 */
export function resolveDisplayName(user: {
  displayName?: string | null;
  firstName?: string | null;
  name?: string | null;
}): string | null {
  if (user.displayName?.trim()) return user.displayName.trim();
  if (user.firstName?.trim()) return user.firstName.trim();
  if (user.name?.trim()) {
    const first = user.name.trim().split(/\s+/)[0];
    return first || null;
  }
  return null;
}
