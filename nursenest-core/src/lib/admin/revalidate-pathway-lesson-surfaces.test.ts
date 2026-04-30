import { beforeEach, describe, expect, test, vi } from "vitest";

const revalidatePath = vi.fn();
const revalidateTag = vi.fn();

vi.mock("next/cache", () => ({
  revalidatePath,
  revalidateTag,
}));

describe("revalidateSurfacesAfterPathwayLessonMutation", () => {
  beforeEach(() => {
    revalidatePath.mockClear();
    revalidateTag.mockClear();
  });

  test("revalidates app lesson paths", async () => {
    const { revalidateSurfacesAfterPathwayLessonMutation } = await import(
      "@/lib/admin/revalidate-pathway-lesson-surfaces"
    );
    revalidateSurfacesAfterPathwayLessonMutation({
      pathwayLessonId: "pl_1",
      pathwayId: "unknown-pathway",
      slug: "fluid-balance",
      indexingImpact: false,
    });
    expect(revalidatePath).toHaveBeenCalledWith("/app/lessons");
    expect(revalidatePath).toHaveBeenCalledWith("/app/lessons/pl_1");
  });

  test("revalidates sitemap when indexingImpact", async () => {
    const { revalidateSurfacesAfterPathwayLessonMutation } = await import(
      "@/lib/admin/revalidate-pathway-lesson-surfaces"
    );
    revalidateSurfacesAfterPathwayLessonMutation({
      pathwayLessonId: "pl_1",
      pathwayId: "unknown-pathway",
      slug: "x",
      indexingImpact: true,
    });
    expect(revalidatePath).toHaveBeenCalledWith("/sitemap.xml");
    expect(revalidateTag).toHaveBeenCalled();
  });
});
