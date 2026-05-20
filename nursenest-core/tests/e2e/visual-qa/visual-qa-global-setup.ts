import { execSync } from "node:child_process";
import path from "node:path";

/**
 * Ensures local visual QA does not silently screenshot the sign-in gate with misaligned auth env.
 * HTTP readiness (`wait-for-app-ready`) runs in `setup/auth.setup.ts` when paid auth runs — not here —
 * because globalSetup can execute before Playwright boots `webServer` on cold CI.
 */
export default async function globalSetup(): Promise<void> {
  const script = path.join(process.cwd(), "scripts", "validate-visual-qa-env.mjs");
  execSync(`node "${script}"`, { stdio: "inherit", env: process.env });
}
