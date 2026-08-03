import { createFileRoute, Outlet } from "@tanstack/react-router";

import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { useAuth } from "@/store/auth-store";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border bg-background px-6">
          <p className="font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Bảng điều khiển HIEC
          </p>
          <p className="text-sm text-muted-foreground">{user?.email ?? "admin@hiec.vn"}</p>
        </header>
        <main className="flex-1 p-6">
          {/* Required: nested admin routes render here. */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
