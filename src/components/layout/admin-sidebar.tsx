/**
 * Component AdminSidebar - Giao diện Dark Mode cao cấp.
 * Tính năng mới: 
 * 1. Thêm "Chỉnh sửa Trang chủ" vào Management.
 * 2. Thêm nút "Quay lại Trang chủ" phía trên Đăng xuất.
 * 3. Tối ưu cursor-pointer cho mọi thao tác.
 */
import * as React from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  FileText,
  LayoutDashboard,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  UserCheck,
  Rocket,
  Users,
  Home,
  Settings2,
  LayoutTemplate,
  BookOpen,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/store/auth-store";
import { cn } from "@/lib/utils";
import { HiecLogo } from "@/components/ui/hiec-logo";
import { Modal } from "@/components/ui/modal";

const navItems = [
  { title: "Tổng quan", url: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Đơn đăng kí", url: "/admin/applications", icon: UserCheck },
  { title: "Chỉnh sửa Trang chủ", url: "/admin/static-content", icon: Settings2 }, // Nút quản lý nội dung trang chủ
  { title: "Quản lý dự án", url: "/admin/manage-projects", icon: Rocket },
  { title: "Quản lý hoạt động", url: "/admin/manage-activities", icon: FileText },
  { title: "Quản lý Thành viên", url: "/admin/manage-members", icon: Users },
  { title: "Giao diện thành viên", url: "/admin/member-layout", icon: LayoutTemplate },
  { title: "Quản lý học liệu", url: "/admin/learning-resources", icon: BookOpen },
] as const;

export function AdminSidebar() {
  const [collapsed, setCollapsed] = React.useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = React.useState(false);
  
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const auth = useAuth() as any;
  const logoutFunc = auth.logout || auth.signOut;
  const navigate = useNavigate();

  return (
    <>
      <aside
        className={cn(
          "sticky top-0 flex h-screen shrink-0 flex-col bg-[#020817] text-white transition-all duration-300 z-20 border-r border-white/5",
          collapsed ? "w-20" : "w-72",
        )}
      >
        {/* LOGO */}
        <div className="flex h-24 items-center px-4 overflow-hidden mb-2">
          <HiecLogo 
            isDark={true}
            className={cn("transition-all duration-500", collapsed ? "scale-75 -ml-2" : "scale-100")} 
          />
        </div>

        {/* MENU */}
        <nav className="flex-1 space-y-1.5 p-3">
          <p className={cn(
            "text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4 px-3 transition-opacity",
            collapsed ? "opacity-0" : "opacity-100"
          )}>
            Management
          </p>
          
          {navItems.map((item) => {
            const active = pathname === item.url;
            const itemClassName = cn(
              "flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold transition-all duration-300 group cursor-pointer",
              active
                ? "bg-cyan-500 text-[#020817] shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                : "text-slate-400 hover:bg-white/5 hover:text-white",
            );

            // This route reads a saved layout on load. Use a normal navigation so it is
            // always mounted from a fresh route state after an admin session is restored.
            if (item.url === "/admin/member-layout") {
              return (
                <a key={item.url} href={item.url} className={itemClassName}>
                  <item.icon
                    className={cn(
                      "size-5 shrink-0 transition-transform duration-300 group-hover:scale-110",
                      active ? "text-[#020817]" : "text-cyan-500/60 group-hover:text-cyan-400",
                    )}
                  />
                  {!collapsed && <span className="tracking-tight">{item.title}</span>}
                </a>
              );
            }

            return (
              <Link
                key={item.url}
                to={item.url as any}
                className={itemClassName}
              >
                <item.icon className={cn(
                  "size-5 shrink-0 transition-transform duration-300 group-hover:scale-110",
                  active ? "text-[#020817]" : "text-cyan-500/60 group-hover:text-cyan-400"
                )} />
                {!collapsed && <span className="tracking-tight">{item.title}</span>}
              </Link>
            );
          })}
        </nav>

        {/* BOTTOM TOOLS */}
        <div className="p-3 space-y-2 mb-4 border-t border-white/5 pt-4">
          {/* NÚT QUAY LẠI TRANG CHỦ */}
          <button
            onClick={() => navigate({ to: "/" })}
            className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold text-cyan-400 hover:bg-cyan-500/10 transition-colors cursor-pointer"
          >
            <Home className="size-5" />
            {!collapsed && <span>Quay lại Trang chủ</span>}
          </button>

          <button
            onClick={() => setCollapsed((v) => !v)}
            className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-slate-400 hover:bg-white/5 transition-colors cursor-pointer"
          >
            {collapsed ? <PanelLeftOpen className="size-5" /> : <PanelLeftClose className="size-5" />}
            {!collapsed && <span>Thu gọn</span>}
          </button>
          
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="size-5" />
            {!collapsed && <span>Đăng xuất</span>}
          </button>
        </div>
      </aside>

      {/* MODAL XÁC NHẬN ĐĂNG XUẤT */}
      <Modal 
        open={isLogoutModalOpen} 
        onOpenChange={setIsLogoutModalOpen}
        title="Xác nhận đăng xuất?"
        description="Bạn có chắc chắn muốn rời khỏi hệ thống quản trị không?"
      >
        <div className="flex flex-col gap-6 py-4 text-center font-sans">
          <div className="size-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
            <LogOut className="size-10" />
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1 rounded-2xl py-6 font-bold cursor-pointer" 
              onClick={() => setIsLogoutModalOpen(false)}
            >
              Hủy bỏ
            </Button>
            <Button 
              variant="destructive" 
              className="flex-1 rounded-2xl py-6 font-bold uppercase tracking-widest bg-red-600 hover:bg-red-700 cursor-pointer" 
              onClick={() => {
                if (logoutFunc) logoutFunc();
                setIsLogoutModalOpen(false);
                navigate({ to: "/" });
              }}
            >
              Xác nhận
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
