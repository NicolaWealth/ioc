import { defineConfig } from "rolldown";

export default defineConfig({
  input: "src/index.ts",
  external: ["@nicolawealth/defer_until"],
  output: [
    {
      file: "dist/index.module.mjs",
      format: "esm",
      sourcemap: true,
      cleanDir: true
    },
    {
      file: "dist/index.js",
      format: "cjs",
      sourcemap: true
    }
  ]
});
