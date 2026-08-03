import * as React from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Sparkles, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/store/auth-store";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Trang chủ", to: "/", hash: undefined },
  { label: "Giới thiệu", to: "/", hash: "gioi-thieu" },
  { label: "Giá trị cốt lõi", to: "/", hash: "gia-tri" },
  { label: "Dự án", to: "/projects", hash: undefined },
  { label: "Liên hệ", to: "/", hash: "lien-he" },
] as const;

export function Header() {
  const [open, setOpen] = React.useState(false);
  const { user } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-xl bg-gradient-brand text-primary-foreground shadow-glow">
            <Sparkles className="size-4" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">
            HIEC<span className="text-primary">.vn</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              {...(item.hash ? { hash: item.hash } : {})}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                pathname === item.to && !item.hash && "text-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <Button asChild variant="outline" size="sm">
              <Link to="/profile">{user.fullName}</Link>
            </Button>
          ) : (
            <Button asChild variant="ghost" size="sm">
              <Link to="/login">Đăng nhập</Link>
            </Button>
          )}
          <Button asChild variant="shimmer" size="sm">
            <Link to="/signup">Tham gia HIEC</Link>
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Mở menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X /> : <Menu />}
        </Button>
      </div>

      {open ? (
        <div className="border-t border-border/60 bg-background md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                {...(item.hash ? { hash: item.hash } : {})}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2">
              <Button asChild variant="outline" size="sm" className="flex-1">
                <Link to={user ? "/profile" : "/login"} onClick={() => setOpen(false)}>
                  {user ? "Hồ sơ" : "Đăng nhập"}
                </Link>
              </Button>
              <Button asChild variant="shimmer" size="sm" className="flex-1">
                <Link to="/signup" onClick={() => setOpen(false)}>
                  Tham gia
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
