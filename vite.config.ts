import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
    // Cấu hình router trỏ đúng vào src/routes
    router: {
      routesDirectory: "./src/routes",
      generatedRouteTree: "./src/routeTree.gen.ts",
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