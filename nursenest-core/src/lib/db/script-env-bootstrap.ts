import { createRequire } from "node:module";
import { requireScriptDatabaseUrl } from "../../../scripts/bootstrap-env.mjs";

const require = createRequire(import.meta.url);

if (process.env.NN_LOG_DIRECT_URL === undefined) {
  process.env.NN_LOG_DIRECT_URL = "0";
}

try {
  requireScriptDatabaseUrl({ prefix: "[script-env-bootstrap]" });
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}

require("./env-bootstrap.ts");
