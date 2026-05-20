import { getPreNursingModuleComponent } from "@/content/pre-nursing/pre-nursing-module-map";
import { ATPPathwayInteractiveModule } from "@/content/pre-nursing/modules/pre-nursing-atp-pathway-interactive";

describe("pre-nursing module map contracts", () => {
  it("wires ATP pathway lessons to the interactive module", () => {
    expect(getPreNursingModuleComponent("atp-pathway")).toBe(
      ATPPathwayInteractiveModule,
    );
  });

  it("keeps the ATP pathway route available", () => {
    expect(getPreNursingModuleComponent("atp-pathway")).not.toBeNull();
  });
});
