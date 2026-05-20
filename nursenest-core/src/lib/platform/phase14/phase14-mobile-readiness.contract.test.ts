import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  MobileBuildChannel,
  MobileReleaseEnvironment,
} from "@/lib/platform/phase14/mobile-platform-contracts";
import { PushNotificationClass } from "@/lib/platform/phase14/mobile-notification-governance";

const __dirname = dirname(fileURLToPath(import.meta.url));

const MOBILE_MODULE_FILES = [
  "mobile-platform-contracts.ts",
  "mobile-capability-boundaries.ts",
  "mobile-session-architecture.ts",
  "mobile-entitlement-safety.ts",
  "mobile-offline-learning.ts",
  "mobile-notification-governance.ts",
  "mobile-observability.ts",
] as const;

function exportedSymbolNamesFromSource(src: string): string[] {
  const names: string[] = [];
  const re =
    /export\s+(?:declare\s+)?(?:type|interface|const|function|enum|class)\s+([A-Za-z0-9_]+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src)) !== null) {
    names.push(m[1]!);
  }
  return names;
}

describe("phase14 mobile readiness contracts", () => {
  it("keeps mobile contract modules under the phase14 directory", () => {
    assert.ok(__dirname.includes(`${join("src", "lib", "platform", "phase14")}`));
    for (const f of MOBILE_MODULE_FILES) {
      assert.ok(f.startsWith("mobile-"), `expected mobile- prefix on ${f}`);
    }
  });

  it("does not declare forbidden purchase-authority symbol names in mobile modules", () => {
    const forbidden = /StripeCheckout|InAppPurchase/;
    for (const f of MOBILE_MODULE_FILES) {
      const abs = join(__dirname, f);
      const src = readFileSync(abs, "utf8");
      assert.ok(abs.includes(`${join("platform", "phase14")}`), "path must include phase14");
      for (const name of exportedSymbolNamesFromSource(src)) {
        assert.match(
          name,
          /^[A-Za-z0-9_]+$/,
          `unexpected export name shape in ${f}: ${name}`,
        );
        assert.ok(
          !forbidden.test(name),
          `forbidden purchase-authority token in export name ${name} (${f})`,
        );
      }
    }
  });

  it("keeps MobileBuildChannel and MobileReleaseEnvironment literals stable", () => {
    assert.deepEqual(
      Object.values(MobileBuildChannel).sort(),
      [
        "mobile.build.app_store",
        "mobile.build.internal_enterprise",
        "mobile.build.play_store",
        "mobile.build.sideload_dev",
        "mobile.build.test_flight",
        "mobile.build.web_pwa",
      ].sort(),
    );
    assert.deepEqual(
      Object.values(MobileReleaseEnvironment).sort(),
      ["mobile.env.development", "mobile.env.production", "mobile.env.staging"].sort(),
    );
  });

  it("scopes PushNotificationClass literals under push.class", () => {
    assert.ok(Object.values(PushNotificationClass).every((v) => v.startsWith("push.class.")));
  });
});
