import * as fs from "node:fs";

/**
 * Stream-parse a top-level JSON array file without loading the whole file into memory.
 * Suitable for large legacy exports (one object per yielded value).
 */
export async function* streamJsonArray(filePath: string): AsyncGenerator<unknown, void, void> {
  const stream = fs.createReadStream(filePath, { encoding: "utf8", highWaterMark: 64 * 1024 });
  let inArray = false;
  let inString = false;
  let escaping = false;
  let depth = 0;
  let objectBuffer = "";
  let collectingObject = false;

  for await (const chunk of stream) {
    for (const char of chunk) {
      if (!inArray) {
        if (char === "[") inArray = true;
        continue;
      }

      if (!collectingObject) {
        if (char === "{") {
          collectingObject = true;
          depth = 1;
          objectBuffer = "{";
          inString = false;
          escaping = false;
        } else if (char === "]") {
          return;
        }
        continue;
      }

      objectBuffer += char;
      if (inString) {
        if (escaping) {
          escaping = false;
          continue;
        }
        if (char === "\\") {
          escaping = true;
          continue;
        }
        if (char === "\"") {
          inString = false;
        }
        continue;
      }

      if (char === "\"") {
        inString = true;
        continue;
      }

      if (char === "{") depth += 1;
      if (char === "}") depth -= 1;

      if (depth === 0) {
        yield JSON.parse(objectBuffer);
        objectBuffer = "";
        collectingObject = false;
      }
    }
  }
}
