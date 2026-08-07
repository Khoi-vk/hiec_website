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
<<<<<<< HEAD
import { Button } from "@/components/ui/button";

/**
 * Giao diện trang 404 - Tối ưu theo phong cách HIEC
 */
function NotFoundComponent() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="size-24 rounded-3xl bg-gradient-brand flex items-center justify-center text-white font-black text-4xl shadow-glow mb-8 animate-float">
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
=======

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
>>>>>>> 39cd77023537a057b237d7eb34914b8d94907603
      </div>
    </div>
  );
}

<<<<<<< HEAD
/**
 * Giao diện xử lý lỗi hệ thống (Crash)
 */
function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  
  useEffect(() => {
    console.error("Root Error Boundary:", error);
=======
function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
>>>>>>> 39cd77023537a057b237d7eb34914b8d94907603
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
<<<<<<< HEAD
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
=======
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
>>>>>>> 39cd77023537a057b237d7eb34914b8d94907603
            onClick={() => {
              router.invalidate();
              reset();
            }}
<<<<<<< HEAD
            variant="outline"
          >
            Thử lại
          </Button>
          <Button asChild variant="destructive">
            <a href="/">Về Trang chủ</a>
          </Button>
=======
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
>>>>>>> 39cd77023537a057b237d7eb34914b8d94907603
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
<<<<<<< HEAD
        content: "Cộng đồng sinh viên biến ý tưởng thành dự án có tác động thật.",
      },
=======
        content:
          "HIEC là câu lạc bộ khởi nghiệp và đổi mới sáng tạo sinh viên: dự án, hoạt động và cộng đồng mentor.",
      },
      { name: "author", content: "HIEC Club" },
      { property: "og:title", content: "HIEC Club — Khởi nghiệp & Đổi mới sáng tạo" },
      {
        property: "og:description",
        content: "Cộng đồng sinh viên biến ý tưởng thành dự án có tác động thật.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
>>>>>>> 39cd77023537a057b237d7eb34914b8d94907603
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
<<<<<<< HEAD
        href: "https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Manrope:wght@400;500;600;700&display=swap",
      },
      { rel: "icon", href: "/favicon.ico" },
=======
        href: "https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700;800&family=Manrope:wght@400;500;600;700&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
>>>>>>> 39cd77023537a057b237d7eb34914b8d94907603
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
<<<<<<< HEAD
      <body className="antialiased selection:bg-primary/20 selection:text-primary">
=======
      <body>
>>>>>>> 39cd77023537a057b237d7eb34914b8d94907603
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
<<<<<<< HEAD
        {/* Outlet là nơi render các route con. Toaster hiển thị thông báo góc màn hình */}
=======
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
>>>>>>> 39cd77023537a057b237d7eb34914b8d94907603
        <Outlet />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 39cd77023537a057b237d7eb34914b8d94907603
