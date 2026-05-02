import assert from "node:assert/strict";
import test from "node:test";
import {
  hasRenderableLessonFigure,
  hasRenderableLessonImage,
  hasRenderableLessonImageUrl,
} from "@/lib/lessons/has-renderable-lesson-image";

test("hasRenderableLessonImageUrl: accepts https CDN-style URLs", () => {
  assert.equal(
    hasRenderableLessonImageUrl("https://cdn.example.com/uploads/lesson-images/foo.webp"),
    true,
  );
});

test("hasRenderableLessonImageUrl: rejects empty and placeholders", () => {
  assert.equal(hasRenderableLessonImageUrl(""), false);
  assert.equal(hasRenderableLessonImageUrl("   "), false);
  assert.equal(hasRenderableLessonImageUrl("https://example.com/placeholder.png"), false);
  assert.equal(hasRenderableLessonImageUrl("https://placehold.co/600x400"), false);
  assert.equal(hasRenderableLessonImageUrl("null"), false);
  assert.equal(hasRenderableLessonImageUrl("data:image/png;base64,abc"), false);
});

test("hasRenderableLessonImageUrl: accepts rooted public image paths", () => {
  assert.equal(hasRenderableLessonImageUrl("/images/lessons/diagram.webp"), true);
  assert.equal(hasRenderableLessonImageUrl("/foo/bar"), false);
});

test("hasRenderableLessonFigure: requires valid url", () => {
  assert.equal(
    hasRenderableLessonFigure({
      id: "1",
      url: "https://cdn.example.com/a.png",
      alt: "x",
    }),
    true,
  );
  assert.equal(
    hasRenderableLessonFigure({
      id: "1",
      url: "",
      alt: "x",
    }),
    false,
  );
});

test("hasRenderableLessonImage: string overload", () => {
  assert.equal(hasRenderableLessonImage("https://ok.example.com/x.jpg"), true);
  assert.equal(hasRenderableLessonImage("http://insecure.example.com/x.jpg"), false);
});
