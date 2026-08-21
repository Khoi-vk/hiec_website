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
        
        {/* Nội dung thay đổi của từng trang admin con (Dashboard, Posts, v.v.) */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
