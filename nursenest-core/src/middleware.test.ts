import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const dir = dirname(fileURLToPath(import.meta.url));

function read(p: string) {
  return readFileSync(join(dir, p), "utf8");
}

function mustContain(src: string, needle: string, label?: string) {
  assert.ok(src.includes(needle), label ?? needle);
}

function mustNotContain(src: string, needle: string, label?: string) {
  assert.ok(!src.includes(needle), label ?? needle);
}

test("flashcards subdomain routing is wired", () => {
  const proxy = read("proxy.ts");

  [
    "isFlashcardsSubdomainHost",
    "rewriteFlashcardsSubdomainRequest",
    "flashcards.nursenest.ca",
    '"/flashcards/:path*"',
    '"/set/:path*"',
    '"x-nn-flashcards-subdomain"',
    "pathname.startsWith(\"/set/\")",
  ].forEach((m) => mustContain(proxy, m));
});

test("proxy matcher coverage and auth wiring are correct", () => {
  const proxy = read("proxy.ts");

  [
    '"/",',
    '/app",',
    '/admin",',
    '/flashcards",',
    '/set/:path*",',
  ].forEach((m) => mustContain(proxy, m, m));

  mustContain(proxy, "matcher");

  const am = read("lib/auth-middleware.ts");
  mustContain(am, "authorized");
  mustContain(am, "/app");
});

test("proxy keeps heavy modules lazy", () => {
  const proxy = read("proxy.ts");

  [
    "@/lib/auth-middleware",
    "@/lib/server/rate-limit",
  ].forEach((mod) => {
    mustNotContain(proxy, `from \"${mod}\"`, mod);
  });

  mustContain(proxy, "loadAuthProxyDeps");
});