/**
 * Contract tests: marketing header server/client boundary and bundle safety.
 *
 * Guards against:
 * - @prisma/client leaking into the browser bundle through SiteHeader
 * - node:* modules (fs, path) entering client components via header imports
 * - "use client" accidentally added to the server wrapper
 * - Mobile drawer bundle being eagerly loaded (not lazy)
 * - Static nav precomputed data passing mechanism regressing
 */

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const headerPath = path.join(__dirname, "site-header.tsx");
const serverWrapperPath = path.join(__dirname, "site-header-server.tsx");
const defaultLayoutPath = path.join(__dirname, "../../app/(marketing)/(default)/layout.tsx");

function source(p: string) {
  return fs.readFileSync(p, "utf8");
}

describe("SiteHeader bundle safety and server/client boundary", () => {
  it("does not import @prisma/client (eliminates Prisma enum from browser bundle)", () => {
    const src = source(headerPath);
    assert.doesNotMatch(
      src,
      /@prisma\/client/,
      "SiteHeader must not import @prisma/client — Prisma enums must not enter the browser bundle",
    );
  });

  it("replaces Prisma CountryCode enum with string literals (CA, US, GB, AU, PH)", () => {
    const src = source(headerPath);
    assert.doesNotMatch(src, /CountryCode\.\w+/, "CountryCode.X enum references must be replaced with string literals");
    // Verify the string literals that replaced the enum are present
    assert.match(src, /country === "CA"/, "must compare country to 'CA' string literal");
    assert.match(src, /country === "US"/, "must compare country to 'US' string literal");
    assert.match(src, /country === "GB"/, "must compare country to 'GB' string literal");
  });

  it("does not import node:fs or node:path (these are server-only modules)", () => {
    const src = source(headerPath);
    assert.doesNotMatch(src, /import.*["']node:fs["']/, "SiteHeader must not import node:fs");
    assert.doesNotMatch(src, /import.*["']node:path["']/, "SiteHeader must not import node:path");
    assert.doesNotMatch(src, /require\(["']node:fs["']\)/, "SiteHeader must not require node:fs");
  });

  it("SiteHeaderServer wrapper has no use-client directive (it is a server component)", () => {
    const src = source(serverWrapperPath);
    assert.doesNotMatch(
      src,
      /["']use client["']/,
      "SiteHeaderServer must NOT have 'use client' — it is a Server Component that wraps the client SiteHeader",
    );
  });

  it("SiteHeaderServer imports SiteHeader (client) and not vice versa", () => {
    const serverSrc = source(serverWrapperPath);
    const clientSrc = source(headerPath);

    // Server wrapper must import the client SiteHeader
    assert.match(serverSrc, /SiteHeader/, "SiteHeaderServer must reference SiteHeader");
    // Client SiteHeader must NOT import the server wrapper (would create circular deps)
    assert.doesNotMatch(clientSrc, /site-header-server/, "SiteHeader must not import site-header-server");
  });

  it("SiteHeader accepts precomputedNavData prop for server-provided static labels", () => {
    const src = source(headerPath);
    assert.match(src, /SiteHeaderPrecomputedNav/, "SiteHeader must define SiteHeaderPrecomputedNav type");
    assert.match(src, /precomputedNavData/, "SiteHeader must accept precomputedNavData prop");
    assert.match(src, /precomputedNavData\?\.brandNavLinks/, "SiteHeader must use precomputed brand links when provided");
    assert.match(src, /precomputedNavData\?\.pathwayNavLinks/, "SiteHeader must use precomputed pathway links when provided");
  });

  it("SiteHeaderServer builds precomputed nav data with all 6 static more-links", () => {
    const src = source(serverWrapperPath);
    // Verify all static nav keys are computed server-side
    assert.match(src, /key: "pricing"/, "server wrapper must precompute pricing link");
    assert.match(src, /key: "about"/, "server wrapper must precompute about link");
    assert.match(src, /key: "blog"/, "server wrapper must precompute blog link");
    assert.match(src, /key: "faq"/, "server wrapper must precompute faq link");
    assert.match(src, /key: "pre-nursing"/, "server wrapper must precompute pre-nursing link");
    assert.match(src, /key: "tools"/, "server wrapper must precompute tools link");
  });

  it("mobile context drawer is lazy-loaded only on first open (not in initial bundle)", () => {
    const src = source(headerPath);
    // Drawer must only load when mobileContextOpen is true
    assert.match(
      src,
      /import\s*\(\s*["']@\/components\/layout\/mobile-context-drawer["']\s*\)/,
      "mobile-context-drawer must be a dynamic import (not a static import)",
    );
    // Must NOT be a static runtime import (type-only imports are erased at build time — allowed)
    assert.doesNotMatch(
      src,
      /^import\s+(?!type\s)\S.*mobile-context-drawer/m,
      "mobile-context-drawer must not be a static runtime import (type-only imports are fine — erased at build)",
    );
    // Import must be conditional on mobileContextOpen state
    assert.match(
      src,
      /mobileContextOpen[\s\S]{0,200}import\s*\(\s*["']@\/components\/layout\/mobile-context-drawer/s,
      "mobile-context-drawer dynamic import must be guarded by mobileContextOpen state",
    );
  });

  it("mobile main menu is rendered via createPortal (not in header DOM subtree)", () => {
    const src = source(headerPath);
    assert.match(
      src,
      /createPortal/,
      "mobile menu overlay must use createPortal to avoid fixed-position containment block from sticky header",
    );
    assert.match(
      src,
      /document\.body/,
      "createPortal must target document.body so mobile drawers are not clipped by the sticky containing block",
    );
  });

  it("scroll listener uses requestAnimationFrame for paint-safe batching", () => {
    const src = source(headerPath);
    assert.match(src, /requestAnimationFrame/, "scroll listener must use requestAnimationFrame to batch state updates");
    assert.match(src, /passive:\s*true/, "scroll listener must be passive to avoid blocking paint");
  });

  it("default marketing layout uses SiteHeaderServer instead of direct SiteHeader", () => {
    const layoutSrc = source(defaultLayoutPath);
    // Default layout must import SiteHeaderServer
    assert.match(
      layoutSrc,
      /SiteHeaderServer/,
      "default marketing layout must use SiteHeaderServer (server component) instead of client SiteHeader directly",
    );
    // Default layout must NOT import the client SiteHeader directly for the header slot
    assert.doesNotMatch(
      layoutSrc,
      /import.*SiteHeader[^S]/,
      "default marketing layout must not import client SiteHeader directly — use SiteHeaderServer",
    );
  });
});
