/**
 * Guardrail: selected “chip” rows in the header must use --nav-on-active-fg so light --nav-active
 * tints never pair with inherited white --nav-fg (e.g. .nn-header-utility-dark).
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const globalsCss = path.join(__dirname, "../../app/globals.css");

describe("nav-on-active-fg (header selected-state contrast)", () => {
  it("defines --nav-on-active-fg in globals and overrides it on the light-theme brand utility bar", () => {
    const css = fs.readFileSync(globalsCss, "utf8");
    assert.match(css, /--nav-on-active-fg:\s*var\(--nav-link-active\)/, "base pairing should chain to nav-link-active");
    assert.ok(
      /\.nn-header-utility-dark\s*\{[^}]*--nav-on-active-fg:\s*var\(--theme-heading-text/s.test(css),
      "utility-dark must force dark foreground on light selected chips",
    );
    assert.ok(
      /\.nn-header-logo-row\s*\{[^}]*--nav-on-active-fg:\s*var\(--nav-link-active\)/s.test(css),
      "logo row should bind on-active text to the same emphasis as header-link-active",
    );
  });

  it("header language selected row uses nav-on-active-fg (not nav-fg)", async () => {
    const { readFile } = await import("node:fs/promises");
    const strip = await readFile(
      path.join(__dirname, "../../components/layout/marketing-header-utility-strip.tsx"),
      "utf8",
    );
    assert.match(strip, /bg-\[var\(--nav-active\)\][^\n]*text-\[var\(--nav-on-active-fg\)\]/);
    assert.doesNotMatch(
      strip,
      /code === locale \? "bg-\[var\(--nav-active\)\][^\n]*text-\[var\(--nav-fg\)\]/,
      "selected language chip must not use nav-fg (often white on the brand bar)",
    );
  });
});
