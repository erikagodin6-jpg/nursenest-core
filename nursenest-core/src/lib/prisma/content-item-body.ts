import type { Prisma } from "@prisma/client";

export function bodyStringFromContentJson(content: Prisma.JsonValue): string {
  if (content === null || content === undefined) return "";
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((block: unknown) => {
        if (block && typeof block === "object" && "content" in block) {
          return String((block as { content?: unknown }).content ?? "");
        }
        return "";
      })
      .join("\n");
  }
  return JSON.stringify(content);
}

export function bodyStringToContentJson(body: string): Prisma.InputJsonValue {
  return [{ sectionTitle: "Body", content: body }];
}
