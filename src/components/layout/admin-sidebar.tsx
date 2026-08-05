/**Day la component tao ra thanh menu dieu huong ben trai (Sidebar) 
  danh cho khu vuc quan tri (Admin) cua trang web, giup admin chuyen doi giua cac trang quan ly,
  thu gon menu hoac dang xuat tai khoan. 
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
  Sparkles,
  Type,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useAuth } from "@/store/auth-store";
import { cn } from "@/lib/utils";
// Danh sach cac muc menu dieu huong trong trang quan tri admin
const items = [
  { title: "Tổng quan", url: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Giao diện", url: "/admin/settings", icon: Palette },
  { title: "Nội dung tĩnh", url: "/admin/static-content", icon: Type },
  { title: "Bài viết", url: "/admin/posts", icon: FileText },
] as const;

export function AdminSidebar() {
  // Khoi tao state de quan ly trang thai thu gon/mo rong cua sidebar
  const [collapsed, setCollapsed] = React.useState(false);
  // Khoi tao state de quan ly hien thi cua hop thoai xac nhan dang xuat
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  // Lay duong dan hien tai cua URL de xac dinh muc menu nao dang duoc chon
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  // Lay ham dang xuat tu store xac thuc
  const { signOut } = useAuth();
  // Hook dieu huong trang cua router
  const navigate = useNavigate();

  return (
    // The aside dinh nghia khung cua sidebar, thay doi chieu rong tuy thuoc vao trang thai thu gon
    <aside
      className={cn(
        "sticky top-0 flex h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-gradient-brand text-primary-foreground">
          <Sparkles className="size-4" />
        </span>
        {!collapsed && <span className="font-display text-base font-bold">HIEC Admin</span>}
      </div>

      <nav className="flex-1 space-y-1 p-2">
        {items.map((item) => {
          // Kiem tra xem muc hien tai co trung voi URL dang truy cap khong
          const active = pathname === item.url;
          return (
            <Link
              key={item.url}
              to={item.url}
              title={item.title}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <item.icon className="size-4 shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          );
        })}
      </nav>
        {/* Phan chan sidebar:Nut thu gon sidebar va nut dang xuat */}
      <div className="space-y-1 border-t border-sidebar-border p-2">
        {/* Nut bam de bat/tat trang thai thu gon */}
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          {collapsed ? (
            <PanelLeftOpen className="size-4 shrink-0" />
          ) : (
            <PanelLeftClose className="size-4 shrink-0" />
          )}
          {!collapsed && <span>Thu gọn</span>}
        </button>
        {/* Nut bam de kich hoat hop thoai xac nhan dang xuat */}
        <button
          onClick={() => setConfirmOpen(true)}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <LogOut className="size-4 shrink-0" />
          {!collapsed && <span>Đăng xuất</span>}
        </button>
      </div>

      {/* Hop thoai (Modal) xac nhan truoc khi dang xuat khoi tai khoan */}
      <Modal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Đăng xuất"
        description="Bạn có chắc chắn muốn đăng xuất khỏi tài khoản HIEC?"
        footer={
          <>
            {/* Nut huy bo: dong modal */}
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            {/* Nut xac nhan: thuc hien dang xuat, dong modal va dieu huong ve trang chu */}
            <Button
              variant="shimmer"
              onClick={() => {
                signOut();
                setConfirmOpen(false);
                navigate({ to: "/" });
              }}
            >
              Confirm
            </Button>
          </>
        }
      />
    </aside>
  );
}
