import { describe, test, expect, vi, beforeEach } from "vitest";
import { createAccessDeliveryOrchestrator, wrapWithOrchestrator } from "../access-delivery-orchestrator";
import type { Request, Response, NextFunction } from "express";

function mockReq(overrides: any = {}): Request {
  return {
    originalUrl: "/api/content/test-123/deliver",
    url: "/api/content/test-123/deliver",
    params: { contentId: "test-123" },
    user: { id: "user-1" },
    ...overrides,
  } as any;
}

function mockRes(): Response & { _json: any; _status: number; _headersSent: boolean } {
  const res: any = {
    _json: null,
    _status: 200,
    _headersSent: false,
    headersSent: false,
    json(data: any) {
      res._json = data;
      res._headersSent = true;
      res.headersSent = true;
      return res;
    },
    status(code: number) {
      res._status = code;
      return res;
    },
  };
  return res;
}

const mockNext: NextFunction = vi.fn();

vi.mock("../storage", () => ({
  pool: {
    query: vi.fn().mockResolvedValue({ rows: [] }),
  },
}));

vi.mock("../admin-auth", () => ({
  resolveAuthUser: vi.fn().mockResolvedValue({ id: "user-1" }),
}));

describe("Access Delivery Orchestrator", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("primary success delivers without fallback", async () => {
    const req = mockReq();
    const res = mockRes();

    const handler = createAccessDeliveryOrchestrator({
      primaryHandler: async (_req, r) => {
        r.json({ data: "primary content", _deliveryTier: "primary" });
      },
      safeFallback: async () => {
        throw new Error("should not be called");
      },
    });

    await handler(req, res, mockNext);
    expect(res._json).toEqual({ data: "primary content", _deliveryTier: "primary" });
  });

  test("primary failure falls through to safe fallback", async () => {
    const req = mockReq();
    const res = mockRes();

    const handler = createAccessDeliveryOrchestrator({
      primaryHandler: async () => {
        throw new Error("primary failed");
      },
      safeFallback: async (_req, r) => {
        r.json({ data: "fallback content", _deliveryTier: "safe_fallback" });
      },
    });

    await handler(req, res, mockNext);
    expect(res._json).toEqual({ data: "fallback content", _deliveryTier: "safe_fallback" });
  });

  test("falls through to last-known-good when primary and safe fallback fail", async () => {
    const req = mockReq();
    const res = mockRes();

    const handler = createAccessDeliveryOrchestrator({
      primaryHandler: async () => {
        throw new Error("primary failed");
      },
      safeFallback: async () => {
        throw new Error("fallback failed");
      },
      lastKnownGood: async (_req, contentId) => {
        return { id: contentId, title: "cached version" };
      },
      getContentId: (r) => r.params.contentId,
    });

    await handler(req, res, mockNext);
    expect(res._json._deliveryTier).toBe("last_known_good");
    expect(res._json.data.title).toBe("cached version");
  });

  test("falls through to backup snapshot when LKG fails", async () => {
    const req = mockReq();
    const res = mockRes();

    const handler = createAccessDeliveryOrchestrator({
      primaryHandler: async () => {
        throw new Error("primary failed");
      },
      lastKnownGood: async () => null,
      backupSnapshot: async (_req, contentId) => {
        return { id: contentId, backup: true };
      },
      getContentId: (r) => r.params.contentId,
    });

    await handler(req, res, mockNext);
    expect(res._json._deliveryTier).toBe("backup_snapshot");
    expect(res._json.data.backup).toBe(true);
  });

  test("falls through to substitute when backup fails", async () => {
    const req = mockReq();
    const res = mockRes();

    const handler = createAccessDeliveryOrchestrator({
      primaryHandler: async () => {
        throw new Error("primary failed");
      },
      lastKnownGood: async () => null,
      backupSnapshot: async () => null,
      substituteEquivalent: async (_req, contentId) => {
        return { id: "substitute-1", original: contentId };
      },
      getContentId: (r) => r.params.contentId,
    });

    await handler(req, res, mockNext);
    expect(res._json._deliveryTier).toBe("substitute_equivalent");
    expect(res._json._originalContentId).toBe("test-123");
  });

  test("falls through to static fallback when all else fails", async () => {
    const req = mockReq();
    const res = mockRes();

    const handler = createAccessDeliveryOrchestrator({
      primaryHandler: async () => {
        throw new Error("primary failed");
      },
      lastKnownGood: async () => null,
      backupSnapshot: async () => null,
      substituteEquivalent: async () => null,
      staticFallback: () => ({ message: "static content" }),
      getContentId: (r) => r.params.contentId,
    });

    await handler(req, res, mockNext);
    expect(res._json._deliveryTier).toBe("static_fallback");
    expect(res._json.data.message).toBe("static content");
  });

  test("returns 503 with exhausted tier when all tiers fail", async () => {
    const req = mockReq();
    const res = mockRes();

    const handler = createAccessDeliveryOrchestrator({
      primaryHandler: async () => {
        throw new Error("primary failed");
      },
      safeFallback: async () => {
        throw new Error("fallback failed");
      },
      lastKnownGood: async () => null,
      backupSnapshot: async () => null,
      substituteEquivalent: async () => null,
      getContentId: (r) => r.params.contentId,
    });

    await handler(req, res, mockNext);
    expect(res._status).toBe(503);
    expect(res._json._deliveryTier).toBe("exhausted");
    expect(res._json._attemptsExhausted).toBe(true);
  });

  test("quarantine hook is called on primary failure", async () => {
    const req = mockReq();
    const res = mockRes();
    const quarantineFn = vi.fn().mockResolvedValue(undefined);

    const handler = createAccessDeliveryOrchestrator({
      primaryHandler: async () => {
        throw new Error("primary failed");
      },
      staticFallback: () => ({ fallback: true }),
      getContentId: (r) => r.params.contentId,
      quarantineHook: quarantineFn,
    });

    await handler(req, res, mockNext);
    expect(quarantineFn).toHaveBeenCalledWith("test-123", "primary failed");
  });

  test("quarantine hook not called on primary success", async () => {
    const req = mockReq();
    const res = mockRes();
    const quarantineFn = vi.fn().mockResolvedValue(undefined);

    const handler = createAccessDeliveryOrchestrator({
      primaryHandler: async (_req, r) => {
        r.json({ ok: true });
      },
      getContentId: (r) => r.params.contentId,
      quarantineHook: quarantineFn,
    });

    await handler(req, res, mockNext);
    expect(quarantineFn).not.toHaveBeenCalled();
  });
});

describe("wrapWithOrchestrator", () => {
  test("wraps a handler with orchestrator fallback chain", async () => {
    const req = mockReq();
    const res = mockRes();

    const wrapped = wrapWithOrchestrator(
      async (_req, r) => {
        r.json({ data: "wrapped content" });
      },
      {
        getContentId: (r) => r.params.contentId,
        staticFallbackData: { fallback: true },
      },
    );

    await wrapped(req, res, mockNext);
    expect(res._json).toEqual({ data: "wrapped content" });
  });

  test("wraps handler and falls to static on failure", async () => {
    const req = mockReq();
    const res = mockRes();

    const wrapped = wrapWithOrchestrator(
      async () => {
        throw new Error("handler failed");
      },
      {
        getContentId: (r) => r.params.contentId,
        staticFallbackData: { fallback: true },
      },
    );

    await wrapped(req, res, mockNext);
    expect(res._json._deliveryTier).toBe("static_fallback");
    expect(res._json.data.fallback).toBe(true);
  });
});
