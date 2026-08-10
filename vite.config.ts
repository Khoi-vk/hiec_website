import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Điều hướng server entry của TanStack Start
    server: { entry: "server" },
  },
  vite: {
    server: {
      hmr: {
        overlay: false, // Ẩn bảng đen lỗi crawling kẹt giao diện
      },
    },
    resolve: {
      tsconfigPaths: true, // Kích hoạt tính năng đọc đường dẫn native theo khuyên dùng của Vite
    },
    optimizeDeps: {
      force: true, // Ép buộc làm mới và sửa triệt để lỗi mất chức năng (The file does not exist)
    },
  },
});
