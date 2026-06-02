import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { urlToObjectKey } from "./url-to-object-key";

describe("urlToObjectKey", () => {
  const bases = ["https://nursenest-images.tor1.cdn.digitaloceanspaces.com"];

  it("parses CDN URL to key", () => {
    assert.equal(
      urlToObjectKey("https://nursenest-images.tor1.cdn.digitaloceanspaces.com/uploads/images/x.webp", bases),
      "uploads/images/x.webp",
    );
  });

  it("accepts raw key prefix", () => {
    assert.equal(urlToObjectKey("uploads/pdfs/doc.pdf", bases), "uploads/pdfs/doc.pdf");
  });

  it("maps marketing proxy path to key", () => {
    assert.equal(
      urlToObjectKey("https://placeholder.local/api/marketing-assets/screenshots/a.webp", bases),
      "screenshots/a.webp",
    );
  });
});
