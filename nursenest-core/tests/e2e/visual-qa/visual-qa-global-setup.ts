import { execSync } from "node:child_process";
import path from "node:path";

/**
 * Ensures local visual QA does not silently screenshot the sign-in gate with misaligned auth env.
 */
export default async function globalSetup(): Promise<void> {
  const script = path.join(process.cwd(), "scripts", "validate-visual-qa-env.mjs");
  execSync(`node "${script}"`, { stdio: "inherit", env: process.env });
}
