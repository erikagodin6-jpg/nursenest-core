import path from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = fileURLToPath(new URL("../../..", import.meta.url));

export const NEXT_PUBLIC_I18N_ROOTS = [
  path.join(packageRoot, "public", "i18n"),
  path.join(packageRoot, "..", "client", "public", "i18n"),
] as const;

export const NEXT_PUBLIC_PRIMARY_I18N_ROOT = NEXT_PUBLIC_I18N_ROOTS[0];

export const ADMIN_ONLY_I18N_ROOTS = [
  path.join(packageRoot, "i18n-admin-only"),
] as const;
