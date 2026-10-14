import { defineConfig } from "vitest/config";

// v1 tests only. The v0 suite (src/**/*.spec.ts) stays on mocha until v0 is removed (see V1-PROGRESS.md).
export default defineConfig({
  test: {
    include: ["test/**/*.test.ts", "src-v1/**/*.test.ts"],
    environment: "node"
  }
});
