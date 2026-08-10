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
  { label: "Hoạt động", to: "/activities" },
  { label: "Dự án", to: "/projects" },
  { label: "Thành viên", to: "/members" },
] as const;

export function Header() {
  const [open, setOpen] = React.useState(false);
  const auth = useAuth() as any; 
  const user = auth.user;
  const logoutFunc = auth.logout || auth.signOut; 

  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    if (logoutFunc) logoutFunc();
    toast.success("Đã đăng xuất.");
    navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        <Link to="/" className="hover:opacity-80 transition-opacity">
          <HiecLogo />
        </Link>

        {/* 3 Mục chính */}
        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.to as any}
              className={cn(
                "px-4 py-2 text-sm font-semibold transition-all duration-300 rounded-md",
                pathname === item.to ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-accent"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="font-bold border-primary/20 text-primary gap-2" onClick={() => navigate({ to: "/admin/applications" })}>
                <LayoutDashboard className="size-4" /> VÀO QUẢN TRỊ
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout} title="Đăng xuất">
                <LogOut className="size-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="font-bold text-muted-foreground hover:text-primary" onClick={() => navigate({ to: "/login" })}>
                Quản trị viên
              </Button>
              <Button variant="shimmer" size="sm" className="font-bold gap-2" onClick={() => navigate({ to: "/signup" })}>
                <UserPlus className="size-4" /> Tham gia HIEC
              </Button>
            </div>
          )}
        </div>

        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen((v) => !v)}>
          {open ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="border-t border-border/60 bg-background md:hidden shadow-xl">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
            {navItems.map((item) => (
              <Link key={item.label} to={item.to as any} onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}