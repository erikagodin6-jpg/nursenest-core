/**
 * Mounted regression tests for admin AI blog generator submit flow (constraint-free batch/single).
 */
import "@happy-dom/global-registrator/register";

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { afterEach, beforeEach, describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import React from "react";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AdminAiGenerationProvider } from "@/components/admin/admin-ai-generation-context";
import { AdminBlogGenerateClient } from "@/components/admin/admin-blog-generate-client";
import type { AdminAiGenerationGate } from "@/lib/ai/admin-ai-policy";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const COMPONENT_SOURCE_PATH = join(__dirname, "admin-blog-generate-client.tsx");

const originalFetch = globalThis.fetch;
const fetchLog: Array<{ url: string; init?: RequestInit }> = [];

afterEach(() => {
  cleanup();
  globalThis.fetch = originalFetch;
});

const enabledGate = (): AdminAiGenerationGate => ({
  mode: "enabled",
  runnable: true,
  flagEnabled: true,
  openAiKeyPresent: true,
  summaryLine: "AI generation enabled",
  diagnostics: {
    aiAdminGenerationEnvPresent: true,
    aiAdminGenerationFlagClass: "enabled",
    aiIntegrationsOpenAiKeyPresent: true,
    legacyOpenAiKeyPresent: false,
    adminAiGenerationFlagNormalized: true,
  },
});

function renderUnderGate(gate: AdminAiGenerationGate) {
  return render(
    <AdminAiGenerationProvider value={gate}>
      <AdminBlogGenerateClient />
    </AdminAiGenerationProvider>,
  );
}

function ndjsonSuccessResponse(topicCount: number): Response {
  const lines = [
    JSON.stringify({ type: "queued", total: topicCount }),
    JSON.stringify({
      type: "complete",
      ok: true,
      summary: { created: topicCount, skipped: 0, failed: 0, requested: topicCount },
      results: [],
    }),
  ];
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      for (const line of lines) {
        controller.enqueue(encoder.encode(`${line}\n`));
      }
      controller.close();
    },
  });
  return new Response(stream, {
    status: 200,
    headers: { "Content-Type": "application/x-ndjson; charset=utf-8" },
  });
}

describe("admin-blog-generate-client (source)", () => {
  it("does not use native constraint-validation APIs or topic native required/minLength", () => {
    const src = readFileSync(COMPONENT_SOURCE_PATH, "utf8");
    for (const needle of ["setCustomValidity", "reportValidity", "checkValidity"]) {
      assert.ok(
        !src.includes(needle),
        `admin-blog-generate-client.tsx must not call ${needle}() (native validation / pattern-style failures)`,
      );
    }
    assert.ok(!/\brequired=\{/.test(src), "topic input must not use required={...} (app-level validation only)");
    assert.ok(!/\bminLength=\{/.test(src), "topic input must not use minLength={...} (app-level validation only)");
    assert.ok(!/\bpattern=/.test(src), "inputs must not use pattern= (app-level validation only)");
  });
});

describe("AdminBlogGenerateClient (mounted)", () => {
  beforeEach(() => {
    fetchLog.length = 0;
  });

  it("single → batch: slug field unmounts and batch submit omits slug/topic (stale short slug does not block)", async () => {
    const user = userEvent.setup();
    globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
      fetchLog.push({ url: String(input), init });
      return ndjsonSuccessResponse(2);
    }) as typeof fetch;

    renderUnderGate(enabledGate());

    const slugInput = screen.getByPlaceholderText("leave blank to auto-generate");
    await user.clear(slugInput);
    await user.type(slugInput, "ab");

    await user.click(screen.getByRole("checkbox", { name: /batch mode/i }));

    assert.equal(screen.queryByPlaceholderText("leave blank to auto-generate"), null);

    const topicsBox = screen.getByPlaceholderText(/acid-base imbalance/i);
    fireEvent.change(topicsBox, {
      target: { value: "first valid topic line\nsecond valid topic line" },
    });

    await user.click(screen.getByRole("button", { name: /generate blog post/i }));

    await waitFor(() => assert.ok(fetchLog.length >= 1));
    const body = JSON.parse((fetchLog[0]!.init!.body as string) ?? "{}") as Record<string, unknown>;
    assert.equal("slug" in body, false);
    assert.equal("topic" in body, false);
    assert.deepEqual(body.topics, ["first valid topic line", "second valid topic line"]);

    const headers = fetchLog[0]!.init!.headers as Record<string, string> | Headers;
    const accept =
      typeof (headers as Headers).get === "function"
        ? (headers as Headers).get("Accept")
        : (headers as Record<string, string>).Accept;
    assert.match(String(accept ?? ""), /ndjson/i);
  });

  it("short batch lines: app-level error with line numbers and no fetch", async () => {
    const user = userEvent.setup();
    globalThis.fetch = (async () => {
      throw new Error("fetch should not run for invalid batch lines");
    }) as typeof fetch;

    renderUnderGate(enabledGate());
    await user.click(screen.getByRole("checkbox", { name: /batch mode/i }));

    fireEvent.change(screen.getByPlaceholderText(/acid-base imbalance/i), {
      target: { value: "ok line here\nab\n" },
    });

    await user.click(screen.getByRole("button", { name: /generate blog post/i }));

    await waitFor(() => {
      const err = screen.getByText(/Invalid line number/i);
      assert.match(err.textContent ?? "", /\b2\b/);
    });
    assert.equal(fetchLog.length, 0);
  });

  it("invalid structured sources JSON: syntax error message and no fetch", async () => {
    const user = userEvent.setup();
    globalThis.fetch = (async () => {
      throw new Error("fetch should not run for invalid JSON");
    }) as typeof fetch;

    renderUnderGate(enabledGate());
    await user.click(screen.getByRole("checkbox", { name: /batch mode/i }));

    fireEvent.change(screen.getByPlaceholderText(/acid-base imbalance/i), {
      target: { value: "one valid topic line here" },
    });

    const sourcesLabel = screen.getByText(/Structured sources JSON \(optional\)/i).closest("label");
    assert.ok(sourcesLabel);
    const sourcesArea = within(sourcesLabel as HTMLElement).getByRole("textbox");
    fireEvent.change(sourcesArea, { target: { value: "{not-json" } });

    await user.click(screen.getByRole("button", { name: /generate blog post/i }));

    await waitFor(() => {
      screen.getByText(/Structured sources JSON is invalid\. Fix JSON syntax/i);
    });
    assert.equal(fetchLog.length, 0);
  });

  it("invalid structured source URL: app-level message and no fetch", async () => {
    const user = userEvent.setup();
    globalThis.fetch = (async () => {
      throw new Error("fetch should not run for invalid source url");
    }) as typeof fetch;

    renderUnderGate(enabledGate());
    await user.click(screen.getByRole("checkbox", { name: /batch mode/i }));

    fireEvent.change(screen.getByPlaceholderText(/acid-base imbalance/i), {
      target: { value: "one valid topic line here" },
    });

    const sourcesLabel = screen.getByText(/Structured sources JSON \(optional\)/i).closest("label");
    assert.ok(sourcesLabel);
    const sourcesArea = within(sourcesLabel as HTMLElement).getByRole("textbox");
    fireEvent.change(sourcesArea, { target: { value: `[{"title":"x","url":"not-a-url"}]` } });

    await user.click(screen.getByRole("button", { name: /generate blog post/i }));

    await waitFor(() => {
      const err = screen.getByText(/Structured sources JSON is invalid/i);
      assert.match(err.textContent ?? "", /https/i);
    });
    assert.equal(fetchLog.length, 0);
  });

  it("403 ADMIN_AI_DISABLED: shows env-oriented guidance (not browser validation)", async () => {
    const user = userEvent.setup();
    globalThis.fetch = (async () => {
      fetchLog.push({ url: "/api/admin/blog/generate-ai" });
      return new Response(
        JSON.stringify({
          error: "AI admin generation is disabled.",
          code: "ADMIN_AI_DISABLED",
          hint: "Enable AI_ADMIN_GENERATION_ENABLED (true, 1, yes, or on) and set AI_INTEGRATIONS_OPENAI_API_KEY or OPENAI_API_KEY.",
          mode: "disabled",
        }),
        { status: 403, headers: { "Content-Type": "application/json" } },
      );
    }) as typeof fetch;

    renderUnderGate(enabledGate());
    await user.click(screen.getByRole("checkbox", { name: /batch mode/i }));
    fireEvent.change(screen.getByPlaceholderText(/acid-base imbalance/i), {
      target: { value: "alpha topic line\nbeta topic line" },
    });

    await user.click(screen.getByRole("button", { name: /generate blog post/i }));

    await waitFor(() => {
      const err = screen.getByText(/AI admin generation is disabled/i);
      assert.match(err.textContent ?? "", /AI_ADMIN_GENERATION_ENABLED/i);
      assert.match(err.textContent ?? "", /OPENAI_API_KEY|AI_INTEGRATIONS_OPENAI_API_KEY/);
    });
  });
});
