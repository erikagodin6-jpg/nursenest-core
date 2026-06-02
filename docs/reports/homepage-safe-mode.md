# Homepage Safe Mode

Generated: 2026-06-01

## Objective

The homepage must return HTTP 200 even when optional dependencies are slow or unavailable.

## Changes Applied

### Default Marketing Layout

File:

- `nursenest-core/src/app/(marketing)/(default)/layout.tsx`

Change:

- The homepage `/` now always uses the minimal static marketing shell.
- The minimal shell avoids the full marketing chrome shard path for `/`.
- It still renders a real page shell, region provider, feedback shell, header bridge, and footer.

Avoided on `/`:

- Full marketing chrome message load.
- Public content override load.
- Staff session server probe.
- Main page shard layering.

### Homepage Page Body

File:

- `nursenest-core/src/app/(marketing)/(default)/page.tsx`

Change:

- Homepage stats now run with `skipOptionalDbReads: true`.
- The stats component is wrapped in a 1200 ms timeout.
- Blog teaser remains wrapped in a 1000 ms timeout.
- If optional modules fail, the emergency fallback renders instead of throwing.

## Dependency Failure Behavior

| Dependency Failure | Homepage Behavior |
|---|---|
| DB unavailable | render homepage with degraded stats |
| cache unavailable | render shell |
| analytics unavailable | no render impact |
| blog teaser unavailable | render empty blog teaser shell |
| region cookies unavailable | default to Canada |
| marketing messages unavailable | use empty/default messages |

## Expected Result

Googlebot and anonymous visitors should receive HTTP 200 for `/` rather than 504 when optional dynamic dependencies fail.

## Deployment Status

The patch requires deployment before production crawl validation.

