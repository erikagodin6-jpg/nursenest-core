import { describe, expect, it } from "vitest";
import { splitMarkdownBodyIntoChunks } from "./markdown-chunks.js";

describe("splitMarkdownBodyIntoChunks", () => {
  it("returns single chunk for short text", () => {
    expect(splitMarkdownBodyIntoChunks("hello", 100)).toEqual(["hello"]);
  });

  it("splits on paragraph boundary when possible", () => {
    const a = "x".repeat(50);
    const b = "y".repeat(50);
    const body = `${a}\n\n${b}`;
    const chunks = splitMarkdownBodyIntoChunks(body, 60);
    expect(chunks.length).toBeGreaterThanOrEqual(2);
    expect(chunks.join("\n\n").replace(/\n\n/g, "")).toContain("x");
    expect(chunks.join("")).toContain("y");
  });
});
