import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    coverage: {
        all: true,
        'exclude': ['scripts/']
    },
    include: ["__tests__/**/*.spec.ts"],
  },
});