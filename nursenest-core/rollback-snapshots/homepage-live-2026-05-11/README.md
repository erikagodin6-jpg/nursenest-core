# Homepage rollback snapshot

Created: 2026-05-11
Purpose: Preserve the current live homepage source files before redesign work so the homepage can be restored directly if needed.

Included:
- `src/app/(marketing)/(default)/page.tsx`
- `src/app/premium-redesign-2026.css`
- `src/components/marketing/home-restored-client.tsx`
- `src/components/marketing/home-restored-with-deferred-stats.server.tsx`
- `src/components/marketing/home-blog-teaser-section.server.tsx`
- `src/components/marketing/home-hero-screenshot-section.tsx`
- `src/components/marketing/home/premium-homepage-routes.ts`
- all files under `src/components/marketing/home/` at snapshot time

Restore approach:
1. Compare the live file to the matching file under this snapshot.
2. Copy the snapshot version back into its original path.
3. Re-run focused homepage verification after restore.
