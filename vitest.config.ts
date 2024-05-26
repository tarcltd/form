import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    coverage: {
        all: true
    },
    include: ["__tests__/**/*.spec.ts"],
  },
});