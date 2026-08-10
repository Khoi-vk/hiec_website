/**
 * Component Header - Bản hoàn thiện cuối cùng
 * 1. Nút "VÀO QUẢN TRỊ" & Nút "ĐĂNG XUẤT" (Mũi tên) hoạt động 100%.
 * 2. Đồng bộ nút Đăng xuất trên cả Mobile.
 * 3. Giữ nguyên hiệu ứng cuộn trang Scrollspy.
 */
import * as React from "react";
import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { Menu, X, UserPlus, LogOut, LayoutDashboard, LogIn } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/store/auth-store";
import { cn } from "@/lib/utils";
import { HiecLogo } from "@/components/ui/hiec-logo";
import { supabase } from "@/utils/supabase";
import { toast } from "sonner";

const navItems = [
  { label: "Thành viên", to: "/", hash: "thanh-vien" },
  { label: "Dự án", to: "/projects", hash: undefined },
] as const;

export function Header() {
  const [open, setOpen] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState<string>(""); 
  const auth = useAuth() as any;
  const user = auth.user;
  const logout = auth.logout || auth.signOut;
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Logic Scrollspy - Theo dõi vị trí lướt chuột
  React.useEffect(() => {
    if (pathname !== "/") {
      setActiveSection("");
      return;
    }
    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
          setActiveSection(entry.target.id);
        }
      });
    };
    const observer = new IntersectionObserver(handleObserver, {
      rootMargin: "-80px 0px -40% 0px", 
      threshold: [0.3, 0.5] 
    });
    navItems.forEach((item) => {
      if (item.hash) {
        const el = document.getElementById(item.hash);
        if (el) observer.observe(el);
      }
    });
    return () => observer.disconnect();
  }, [pathname]);

  // Hàm xử lý Đăng xuất
  const handleLogout = async () => {
    await supabase.auth.signOut(); // Thoát khỏi Supabase
    logout(); // Xóa thông tin trong Store máy tính
    toast.success("Đã đăng xuất thành công.");
    navigate({ to: "/" }); // Quay về trang chủ
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl font-sans">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        
        <Link to="/" className="hover:opacity-80 transition-opacity">
          <HiecLogo />
        </Link>

        {/* Menu chính cho máy tính */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const isActive = item.hash 
              ? activeSection === item.hash 
              : pathname === item.to && !activeSection;

            return (
              <Link
                key={item.label}
                to={item.to}
                {...(item.hash ? { hash: item.hash } : {})}
                className={cn(
                  "relative rounded-md px-3 py-2 text-sm font-medium transition-all duration-300",
                  isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                {item.label}
                {isActive && <span className="absolute bottom-0 left-0 h-0.5 w-full bg-primary animate-in fade-in zoom-in duration-500" />}
              </Link>
            );
          })}
        </nav>

        {/* Các nút bấm hành động */}
        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="font-bold border-primary/20 text-primary gap-2 rounded-xl"
                onClick={() => navigate({ to: "/admin/applications" })}
              >
                <LayoutDashboard className="size-4" /> VÀO QUẢN TRỊ
              </Button>
              {/* Nút Đăng xuất nhanh (Dấu mũi tên) */}
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleLogout} 
                className="text-muted-foreground hover:text-destructive transition-colors"
                title="Đăng xuất"
              >
                <LogOut className="size-5" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="font-bold text-muted-foreground hover:text-primary"
                onClick={() => navigate({ to: "/login" })}
              >
                Quản trị viên
              </Button>
              <Button 
                variant="shimmer" 
                size="sm" 
                className="font-bold gap-2 uppercase tracking-tighter"
                onClick={() => navigate({ to: "/signup" })}
              >
                <UserPlus className="size-4" /> Tham gia HIEC
              </Button>
            </div>
          )}
        </div>

        {/* Nút mở Menu trên điện thoại */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen((v) => !v)}>
          {open ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Menu xổ xuống trên điện thoại */}
      {open && (
        <div className="border-t border-border/60 bg-background md:hidden shadow-xl animate-in slide-in-from-top duration-300">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
            {navItems.map((item) => (
              <Link key={item.label} to={item.to} {...(item.hash ? { hash: item.hash } : {})} onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium">
                {item.label}
              </Link>
            ))}
            <div className="border-t mt-2 pt-4 flex flex-col gap-2">
              {user ? (
                <>
                  <Button variant="shimmer" onClick={() => { setOpen(false); navigate({ to: "/admin/applications" }); }}>
                    VÀO TRANG QUẢN TRỊ
                  </Button>
                  <Button variant="outline" onClick={() => { setOpen(false); handleLogout(); }} className="text-destructive border-destructive/20">
                    ĐĂNG XUẤT
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="shimmer" onClick={() => { setOpen(false); navigate({ to: "/signup" }); }}>
                    THAM GIA HIEC
                  </Button>
                  <Button variant="outline" onClick={() => { setOpen(false); navigate({ to: "/login" }); }}>
                    ĐĂNG NHẬP ADMIN
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}