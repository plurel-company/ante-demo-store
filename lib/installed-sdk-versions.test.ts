import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  INSTALLED_ANTE_REACT_SDK_VERSION,
  INSTALLED_ANTE_SDK_VERSION,
  correctStaleSdkVersionHeaders,
} from "./installed-sdk-versions";

describe("correctStaleSdkVersionHeaders", () => {
  it("corrects stale SDK telemetry to match installed package.json", () => {
    const headers = new Headers();
    const request = new Request("https://store.example/api/ante/v1/sessions", {
      method: "POST",
      headers: {
        "X-Ante-SDK-Version": "0.1.10",
        "X-Ante-React-SDK-Version": "0.1.10",
      },
    });

    correctStaleSdkVersionHeaders(headers, request);

    assert.equal(headers.get("X-Ante-SDK-Version"), INSTALLED_ANTE_SDK_VERSION);
    assert.equal(
      headers.get("X-Ante-React-SDK-Version"),
      INSTALLED_ANTE_REACT_SDK_VERSION,
    );
    assert.equal(INSTALLED_ANTE_SDK_VERSION, "0.1.12");
  });

  it("does not overwrite when telemetry already matches package.json", () => {
    const headers = new Headers({
      "X-Ante-SDK-Version": INSTALLED_ANTE_SDK_VERSION,
    });
    const request = new Request("https://store.example/api/ante/v1/sessions", {
      method: "POST",
      headers: {
        "X-Ante-SDK-Version": INSTALLED_ANTE_SDK_VERSION,
      },
    });

    correctStaleSdkVersionHeaders(headers, request);

    assert.equal(headers.get("X-Ante-SDK-Version"), INSTALLED_ANTE_SDK_VERSION);
  });
});
