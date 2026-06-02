#!/usr/bin/env node
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
const dir = path.dirname(fileURLToPath(import.meta.url));
const body = await readFile(path.join(dir, "homepage-body.html"), "utf8");
const leaf = `<div class="nn-leaf-layer nn-leaf--tr"><svg viewBox="0 0 50 44"><path class="nn-leaf-fill" d="M6 40 C6 29 14.5 21 25 21 S44 29 44 40 Z"/></svg></div>`;
const wrap = (theme, extra = "") => `<!DOCTYPE html><html lang="en" data-theme="${theme}"><head><meta charset="utf-8"/><link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800&display=swap" rel="stylesheet"/><link rel="stylesheet" href="homepage-layout.css"/><link rel="stylesheet" href="token-homepage-themes.css"/><link rel="stylesheet" href="token-homepage-bridge.css"/><style>${extra}</style></head><body class="nn-surface nn-leaf-radial">${leaf}${body}</body></html>`;
const list = [["v3-01-homepage-ocean-tokens.html","ocean"],["v3-02-homepage-blossom-tokens.html","blossom"],["v3-03-homepage-mint-blossom-tokens.html","mint-blossom"],["v3-04-homepage-aurora-tokens.html","aurora"],["v3-05-homepage-ocean-mobile.html","ocean","body{max-width:390px;margin:0 auto}"],["v3-06-homepage-mint-blossom-mobile.html","mint-blossom","body{max-width:390px;margin:0 auto}"]];
for (const [n,t,e] of list) await writeFile(path.join(dir,n),wrap(t,e),"utf8");
console.log("ok", list.length);
