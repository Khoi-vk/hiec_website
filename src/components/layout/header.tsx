/**
 * Component Header - Thanh điều hướng chính của người dùng.
 * Đã cập nhật Logo đồng bộ với hệ thống.
 */
import * as React from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/store/auth-store";
import { cn } from "@/lib/utils";
import { HiecLogo } from "@/components/ui/hiec-logo"; // Import Logo mới

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
        
        {/* SỬA: Sử dụng HiecLogo dùng chung */}
        <Link to="/" className="hover:opacity-80 transition-opacity">
          <HiecLogo />
        </Link>

        {/* Desktop navigation */}
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

        {/* Action buttons */}
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

        {/* Mobile menu toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Mobile drawer */}
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
          </nav>
        </div>
      ) : null}
    </header>
  );
}