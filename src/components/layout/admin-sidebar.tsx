/**
 * Component AdminSidebar - Thanh menu điều hướng cho Quản trị viên.
 * Đã cập nhật Logo đồng bộ bằng Component HiecLogo.
 */
import * as React from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  FileText,
  LayoutDashboard,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Palette,
  Type,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useAuth } from "@/store/auth-store";
import { cn } from "@/lib/utils";
import { HiecLogo } from "@/components/ui/hiec-logo"; // Import Logo mới

const items = [
  { title: "Tổng quan", url: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Giao diện", url: "/admin/settings", icon: Palette },
  { title: "Nội dung tĩnh", url: "/admin/static-content", icon: Type },
  { title: "Bài viết", url: "/admin/posts", icon: FileText },
] as const;

export function AdminSidebar() {
  const [collapsed, setCollapsed] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <aside
      className={cn(
        "sticky top-0 flex h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300",
        collapsed ? "w-20" : "w-64",
      )}
    >
      {/* SỬA: Thay thế phần logo cũ bằng HiecLogo */}
      <div className="flex h-16 items-center border-b border-sidebar-border px-4 overflow-hidden">
        <HiecLogo 
          showText={!collapsed} 
          className={cn("transition-all duration-300", collapsed ? "scale-90 ml-1" : "scale-100")} 
        />
      </div>

      <nav className="flex-1 space-y-1 p-2 mt-2">
        {items.map((item) => {
          const active = pathname === item.url;
          return (
            <Link
              key={item.url}
              to={item.url as any}
              title={item.title}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                active
                  ? "bg-primary text-primary-foreground shadow-glow"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <item.icon className="size-5 shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-sidebar-border p-2 pb-4">
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          {collapsed ? (
            <PanelLeftOpen className="size-5 shrink-0" />
          ) : (
            <PanelLeftClose className="size-5 shrink-0" />
          )}
          {!collapsed && <span>Thu gọn</span>}
        </button>
        
        <button
          onClick={() => setConfirmOpen(true)}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-destructive/80 transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="size-5 shrink-0" />
          {!collapsed && <span>Đăng xuất</span>}
        </button>
      </div>

      <Modal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Đăng xuất"
        description="Bạn có chắc chắn muốn đăng xuất khỏi tài khoản HIEC?"
        footer={
          <>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Hủy
            </Button>
            <Button
              variant="shimmer"
              onClick={() => {
                signOut();
                setConfirmOpen(false);
                navigate({ to: "/" });
              }}
            >
              Xác nhận đăng xuất
            </Button>
          </>
        }
      />
    </aside>
  );
}