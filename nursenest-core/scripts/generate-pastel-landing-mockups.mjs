#!/usr/bin/env node
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.join(root, "public/landing-polish-preview");

const LEAF = `<svg viewBox="0 0 50 44"><path class="nn-leaf-fill" d="M6 40 C6 29 14.5 21 25 21 S44 29 44 40 Z"/><path class="nn-leaf-vein" d="M11 40 C11 32.5 17 27 25 27 S39 32.5 39 40 Z"/></svg>`;
const leaf = `<div class="nn-leaf-layer nn-leaf--tr">${LEAF}</div><div class="nn-leaf-layer nn-leaf--bl">${LEAF}</div>`;

const body = await readFile(path.join(dir, "homepage-body.html"), "utf8");

function page(title, palette, extraStyle = "") {
  return `<!DOCTYPE html>
<html lang="en" data-theme="${palette}" data-theme-palette="${palette}">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${title}</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800&display=swap" rel="stylesheet"/>
<link rel="stylesheet" href="homepage-layout.css"/>
<link rel="stylesheet" href="pastel-themes.css"/>
<style>${extraStyle}</style>
</head>
<body class="nn-surface nn-leaf-radial">
${leaf}
${body}
</body></html>`;
}

const files = [
  { name: "v2-01-homepage-ocean-pastel.html", html: page("Ocean pastel", "ocean") },
  { name: "v2-02-homepage-blossom-pastel.html", html: page("Blossom pastel", "blossom") },
  { name: "v2-03-homepage-aurora-pastel.html", html: page("Aurora pastel", "aurora") },
  {
    name: "v2-04-homepage-depth-optional.html",
    html: page("Depth optional theme", "depth"),
  },
  {
    name: "v2-05-homepage-ocean-mobile.html",
    html: page(
      "Ocean mobile",
      "ocean",
      "body{max-width:390px;margin:0 auto} .hero{padding:2.5rem 0 2rem}",
    ),
  },
  {
    name: "v2-06-homepage-blossom-mobile.html",
    html: page(
      "Blossom mobile",
      "blossom",
      "body{max-width:390px;margin:0 auto} .hero{padding:2.5rem 0 2rem}",
    ),
  },
  {
    name: "v2-07-homepage-aurora-mobile.html",
    html: page(
      "Aurora mobile",
      "aurora",
      "body{max-width:390px;margin:0 auto} .hero{padding:2.5rem 0 2rem}",
    ),
  },
];

await mkdir(dir, { recursive: true });
for (const f of files) {
  await writeFile(path.join(dir, f.name), f.html, "utf8");
}
console.log("wrote", files.length, "pastel homepage mockups (layout unchanged)");
