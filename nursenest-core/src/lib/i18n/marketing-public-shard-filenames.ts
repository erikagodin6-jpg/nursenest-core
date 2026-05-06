/**
 * Public marketing i18n shard file stem order under `public/i18n/{locale}/`.
 * Must stay identical to `PUBLIC_I18N_SHARD_FILENAMES` in `shared/i18n-shard-policy.ts`
 * (Next.js Turbopack cannot import from the repo `shared/` tree in server modules).
 */
export const MARKETING_PUBLIC_I18N_SHARD_FILENAMES = [
  "marketing",
  "learner",
  "auth",
  "billing",
  "brand",
  "nav",
  "errors",
  "allied",
  "pages",
  "components",
  "common",
] as const;
