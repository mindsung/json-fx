import { defineConfig } from "tsup";

export default defineConfig([
  {
    // The library: ESM (`dist/index.mjs`, `.d.mts`) and CommonJS (`dist/index.js`, `.d.ts`).
    entry: { index: "src/index.ts" },
    format: ["cjs", "esm"],
    dts: true,
    target: "es2020",
    platform: "neutral"
  },
  {
    // The `json-fx` command (Node only, CommonJS so `--functions` modules load with `require`).
    entry: { cli: "src/cli/main.ts" },
    format: ["cjs"],
    target: "node18",
    platform: "node",
    banner: { js: "#!/usr/bin/env node" }
  }
]);
