import * as React from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { LogIn, LogOut, Menu, UserPlus, X } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { HiecLogo } from "@/components/ui/hiec-logo";
import { cn } from "@/lib/utils";
import { useAuth } from "@/store/auth-store";
import { supabase } from "@/utils/supabase";
import { toast } from "sonner";

const navItems = [
  { label: "Trang chủ", to: "/" },
  { label: "Hoạt động", to: "/activities" },
  { label: "Dự án", to: "/projects" },
  { label: "Cơ cấu CLB", to: "/members" },
  { label: "Học liệu", to: "#" },
] as const;

export function Header() {
  const [open, setOpen] = React.useState(false);
  const auth = useAuth() as any;
  const user = auth.user;
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    if (auth.logout || auth.signOut) (auth.logout || auth.signOut)();
    toast.success("Đã đăng xuất.");
    navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[4.5rem] w-full max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link to="/" className="shrink-0 transition-opacity hover:opacity-70">
          <HiecLogo />
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-border bg-card p-1 md:flex">
          {navItems.map((item) =>
            item.to === "#" ? (
              <button
                key={item.label}
                type="button"
                className="cursor-default rounded-full px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {item.label}
              </button>
            ) : (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                  pathname === item.to
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="hidden items-center gap-2 sm:flex">
            {user ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate({ to: "/admin/applications" })}
                >
                  Quản trị
                </Button>
                <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Đăng xuất">
                  <LogOut className="size-4" />
                </Button>
              </>
            ) : (
              <>
                <Button variant="default" size="sm" onClick={() => navigate({ to: "/signup" })}>
                  <UserPlus className="mr-2 size-4" /> Theo dõi
                </Button>
                <Button variant="default" size="sm" onClick={() => navigate({ to: "/login" })}>
                  <LogIn className="mr-2 size-4" /> Đăng nhập
                </Button>
              </>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label="Mở menu"
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border bg-background px-5 py-3 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {navItems.map((item) =>
              item.to === "#" ? (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-3 text-left text-sm font-semibold text-muted-foreground hover:bg-accent"
                >
                  {item.label}
                </button>
              ) : (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-3 text-sm font-semibold hover:bg-accent"
                >
                  {item.label}
                </Link>
              ),
            )}
            {!user && (
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Link
                  to="/signup"
                  onClick={() => setOpen(false)}
                  className="rounded-xl bg-primary px-3 py-3 text-center text-sm font-bold text-primary-foreground"
                >
                  Tham gia HIEC
                </Link>
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-xl bg-primary px-3 py-3 text-center text-sm font-bold text-primary-foreground"
                >
                  Đăng nhập
                </Link>
              </div>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
