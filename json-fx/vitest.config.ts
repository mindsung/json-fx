import { defineConfig } from "vitest/config";

// Unit tests live next to the code (src/**/*.test.ts); corpus-driven ones are in test/.
export default defineConfig({
  test: {
    include: ["test/**/*.test.ts", "src/**/*.test.ts"],
    environment: "node"
  }
});
