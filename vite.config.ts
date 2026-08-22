import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
    // TanStack Start resolve router paths relative to src.
    router: {
      routesDirectory: "./routes",
      generatedRouteTree: "./routeTree.gen.ts",
    }
  },
  vite: {
    server: {
      hmr: {
        overlay: false,
      },
      // Thêm cái này để ổn định hơn trên Windows
      watch: {
        usePolling: true,
      }
    },
    resolve: {
      tsconfigPaths: true,
    },
  },
});
