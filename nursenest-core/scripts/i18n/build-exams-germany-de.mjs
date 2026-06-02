#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "exams-germany.de.json");
const n = Object.keys(JSON.parse(readFileSync(OUT, "utf8"))).length;
console.log(`exams-germany.de.json keys ${n}`);
