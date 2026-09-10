import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      name: "ioc",
      formats: ["es", "cjs"],
      fileName: (format) =>
        format === "es" ? "index.module.mjs" : "index.js",
    },
    rollupOptions: {
      external: ["@nicolawealth/defer_until"],
    },
    sourcemap: true,
  },
});
