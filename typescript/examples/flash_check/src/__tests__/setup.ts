import "vitest-dom/extend-expect";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});
