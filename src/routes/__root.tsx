import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/store/auth-store";
import { Button } from "@/components/ui/button";

/**
 * Giao diện trang 404 - Tối ưu theo phong cách HIEC
 */
function NotFoundComponent() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="size-24 rounded-3xl bg-primary flex items-center justify-center text-primary-foreground font-black text-4xl shadow-glow mb-8 animate-float">
        !
      </div>
      <h1 className="font-display text-5xl font-black tracking-tighter sm:text-7xl">404</h1>
      <h2 className="mt-4 text-xl font-bold text-foreground">Trang không tồn tại</h2>
      <p className="mt-2 max-w-xs text-sm text-muted-foreground">
        Có vẻ như đường dẫn này đã bị xóa hoặc chưa bao giờ tồn tại.
      </p>
      <div className="mt-8">
        <Button asChild variant="shimmer" size="lg">
          <Link to="/">Quay lại Trang chủ</Link>
        </Button>
      </div>
    </div>
  );
}

/**
 * Giao diện xử lý lỗi hệ thống (Crash)
 */
function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  
  useEffect(() => {
    console.error("Root Error Boundary:", error);
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="max-w-md w-full rounded-3xl border border-destructive/20 bg-destructive/5 p-8 text-center backdrop-blur-sm">
        <h1 className="text-xl font-bold tracking-tight text-destructive mb-2">
          Hệ thống gặp sự cố
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          Đừng lo lắng, chúng tôi đã ghi nhận lỗi này. Bạn có thể thử tải lại trang.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            variant="outline"
          >
            Thử lại
          </Button>
          <Button asChild variant="destructive">
            <a href="/">Về Trang chủ</a>
          </Button>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "HIEC Club — Khởi nghiệp & Đổi mới sáng tạo" },
      {
        name: "description",
        content: "Cộng đồng sinh viên biến ý tưởng thành dự án có tác động thật.",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Manrope:wght@400;500;600;700&display=swap",
      },
      { rel: "icon", href: "/favicon.ico" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <head>
        <HeadContent />
      </head>
      <body className="antialiased selection:bg-primary/20 selection:text-primary">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {/* Outlet là nơi render các route con. Toaster hiển thị thông báo góc màn hình */}
        <Outlet />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}
