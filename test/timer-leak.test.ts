import { afterEach, describe, expect, it, vi } from "vitest";
import { SpaceXSI } from "../src/index.js";

afterEach(() => {
  vi.useRealTimers();
});

describe("per-attempt timeout timer does not leak", () => {
  it("clears the timer when the request fails before it is sent", async () => {
    vi.useFakeTimers();
    // A baseURL without a scheme makes `new Request(url, ...)` throw after the attempt timer is armed.
    const client = new SpaceXSI({ apiKey: "test-key", baseURL: "api.x.ai/v1", maxRetries: 0, timeout: 3_600_000 });
    await expect(client.models.list()).rejects.toBeInstanceOf(TypeError);
    expect(vi.getTimerCount()).toBe(0);
  });
});
