import "@happy-dom/global-registrator/register";

import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { AdminAiGenerationProvider } from "@/components/admin/admin-ai-generation-context";
import { AdminAiAssistantClient } from "@/components/admin/admin-ai-assistant-client";
import type { AdminAiGenerationGate } from "@/lib/ai/admin-ai-policy";

afterEach(() => {
  cleanup();
});

const enabledGate: AdminAiGenerationGate = {
  mode: "enabled",
  runnable: true,
  flagEnabled: true,
  openAiKeyPresent: true,
  summaryLine: "AI generation enabled",
  diagnostics: {
    aiAdminGenerationEnvPresent: true,
    aiAdminGenerationFlagClass: "enabled",
    aiIntegrationsOpenAiKeyPresent: true,
    legacyOpenAiKeyPresent: true,
    adminAiGenerationFlagNormalized: true,
  },
};

describe("AdminAiAssistantClient", () => {
  it("renders all requested task types and output controls", () => {
    render(
      <AdminAiGenerationProvider value={enabledGate}>
        <AdminAiAssistantClient />
      </AdminAiGenerationProvider>,
    );

    assert.ok(screen.getByRole("button", { name: /Draft Blog Post/ }));
    assert.ok(screen.getByRole("button", { name: /Draft Support Reply/ }));
    assert.ok(screen.getByRole("button", { name: /Summarize Error \/ Logs/ }));
    assert.ok(screen.getByRole("button", { name: /Suggest Lesson Title Cleanup/ }));
    assert.ok(screen.getByRole("button", { name: /Suggest Lesson Category Cleanup/ }));
    assert.ok(screen.getByRole("button", { name: /Generate Draft/i }));
    assert.ok(screen.getByRole("button", { name: /Copy/i }));
    assert.ok(screen.getByText(/Draft preview will appear here/i));
  });
});
