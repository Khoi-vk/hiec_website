import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    server: {
      hmr: {
        overlay: false,
      },
    },
    resolve: {
      tsconfigPaths: true,
    },
  },
});
