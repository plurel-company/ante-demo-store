import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";

import {
  isRateLimited,
  isSameOriginRequest,
  resetClientLogRateLimitsForTests,
  sanitizeClientLogPayload,
} from "./client-log-payload";

describe("sanitizeClientLogPayload", () => {
  it("keeps only allowed fields and truncates strings", () => {
    const sanitized = sanitizeClientLogPayload({
      stage: "checkout",
      message: "x".repeat(600),
      href: "https://example.com",
      online: true,
      name: "Error",
      ts: "2026-01-01T00:00:00.000Z",
      password: "secret",
      attackerField: "malicious",
    });

    assert.equal(sanitized.stage, "checkout");
    assert.equal(sanitized.message?.length, 500);
    assert.equal(sanitized.href, "https://example.com");
    assert.equal(sanitized.online, true);
    assert.equal(sanitized.name, "Error");
    assert.equal(sanitized.ts, "2026-01-01T00:00:00.000Z");
    assert.equal("password" in sanitized, false);
    assert.equal("attackerField" in sanitized, false);
  });

  it("defaults stage to unknown when missing or empty", () => {
    assert.equal(sanitizeClientLogPayload({}).stage, "unknown");
    assert.equal(sanitizeClientLogPayload({ stage: "" }).stage, "unknown");
  });
});

describe("isSameOriginRequest", () => {
  it("accepts matching Origin header", () => {
    const request = new Request("https://store.example.com/api/client-log", {
      method: "POST",
      headers: { origin: "https://store.example.com" },
    });

    assert.equal(isSameOriginRequest(request), true);
  });

  it("rejects cross-origin requests", () => {
    const request = new Request("https://store.example.com/api/client-log", {
      method: "POST",
      headers: { origin: "https://evil.example" },
    });

    assert.equal(isSameOriginRequest(request), false);
  });
});

describe("isRateLimited", () => {
  beforeEach(() => {
    resetClientLogRateLimitsForTests();
  });

  it("allows requests under the limit", () => {
    for (let i = 0; i < 30; i += 1) {
      assert.equal(isRateLimited("127.0.0.1"), false);
    }
  });

  it("blocks requests over the limit", () => {
    for (let i = 0; i < 30; i += 1) {
      isRateLimited("127.0.0.1");
    }
    assert.equal(isRateLimited("127.0.0.1"), true);
  });
});
