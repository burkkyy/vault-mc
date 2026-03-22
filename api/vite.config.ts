import { defineConfig } from "vitest/config"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  plugins: [
    tsconfigPaths({
      root: ".",
      projects: ["./tsconfig.json"],
    }),
  ],
  test: {
    globals: true,
    root: ".",
    globalSetup: "./tests/global-setup.ts",
    setupFiles: ["./tests/setup.ts"],
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    // TODO: replace with individual pattern matchers.
    forceRerunTriggers: [
      "**/*.(html|txt)", // Rerun tests when data files change
    ],
    // Mocking
    clearMocks: true,
    mockReset: true,
    restoreMocks: true,
    unstubEnvs: true,
    unstubGlobals: true,
  },
})
