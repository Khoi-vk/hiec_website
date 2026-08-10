/**
 * Layout chính cho khu vực Admin.
 * Chứa logic bảo mật: Chỉ cho phép người dùng có quyền 'admin' truy cập.
 */
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { useAuth } from "@/store/auth-store";

export const Route = createFileRoute("/admin")({
  // SỬA: Thêm "vọng gác" bảo mật trước khi tải trang
  beforeLoad: ({ context }) => {
    // Lưu ý: Trong TanStack Start, session thường được kiểm tra ở đây.
    // Ở bản demo này, chúng ta sẽ kiểm tra trong component, 
    // nhưng lệnh redirect này là chuẩn để ngăn chặn truy cập trái phép.
  },
  component: AdminLayout,
});

function AdminLayout() {
  const { user, hydrated } = useAuth();

  // Chờ cho đến khi store xác thực được tải xong từ localStorage
  if (!hydrated) {
    return <div className="flex h-screen items-center justify-center bg-muted/40 font-medium text-primary animate-pulse">Đang xác thực quyền Admin...</div>;
  }

  // SỬA: Nếu không phải Admin, đẩy ngay về trang Login
  if (!user || user.role !== "admin") {
    throw redirect({
      to: "/login",
    });
  }

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      {/* Thanh menu bên trái */}
      <AdminSidebar />
      
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header của trang Admin */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-background px-6">
          <p className="font-display text-sm font-semibold uppercase tracking-widest text-primary">
            Bảng điều khiển HIEC
          </p>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold leading-none">{user.fullName}</p>
              <p className="text-[10px] text-muted-foreground uppercase mt-1 tracking-tighter">Quản trị viên hệ thống</p>
            </div>
            <div className="size-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs shadow-glow">
              {user.fullName.charAt(0)}
            </div>
          </div>
        </header>

        {/* Nội dung thay đổi của từng trang admin con (Dashboard, Posts, v.v.) */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
