import { describe, expect, it } from "vitest";
import { pathParam } from "../src/http.js";
import { SpaceXSI } from "../src/index.js";
import { mockFetch, jsonResponse } from "./helpers.js";

describe("pathParam", () => {
  it("rejects values that do not address their own segment", () => {
    for (const bad of ["", ".", ".."]) {
      expect(() => pathParam(bad)).toThrow(TypeError);
    }
  });

  it("percent-encodes an ordinary id", () => {
    expect(pathParam("file_123")).toBe("file_123");
    expect(pathParam("a/b")).toBe("a%2Fb");
    expect(pathParam("a b#c")).toBe("a%20b%23c");
  });

  it("does not let a dot-segment id retarget the request", async () => {
    const { fetch } = mockFetch(() => jsonResponse({}));
    const client = new SpaceXSI({ apiKey: "test-key", fetch, maxRetries: 0 });
    await expect(client.files.delete("..")).rejects.toThrow(TypeError);
    await expect(client.files.get("")).rejects.toThrow(TypeError);
  });
});
