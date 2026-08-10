import { PublicLayout } from "@/components/layout/public-layout";

export function RouteLoading({ message = "Đang tải…" }: { message?: string }) {
  return (
    <PublicLayout>
      <div className="mx-auto flex min-h-[40vh] max-w-6xl items-center justify-center px-4 py-24 text-sm text-muted-foreground">
        {message}
      </div>
    </PublicLayout>
  );
}

export function AdminRouteLoading({ message = "Đang kiểm tra quyền truy cập…" }: { message?: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 text-sm text-muted-foreground">
      {message}
    </div>
  );
}
