/*
AuthShell – Component khung cho các trang xác thực (đăng nhập).
Props:
  - title: Tiêu đề chính
  - subtitle: Mô tả phụ
  - children: Nội dung form bên trong
  - footer: (tùy chọn) Nội dung chân trang
*/
import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-hero px-4 py-12">
      <div className="w-full max-w-md animate-fade-up">
        <Link to="/" className="mb-6 flex items-center justify-center gap-2">
          <span className="grid size-10 place-items-center rounded-xl bg-primary-foreground/15 text-primary-foreground backdrop-blur">
            <Sparkles className="size-5" />
          </span>
          <span className="font-display text-xl font-bold text-primary-foreground">HIEC.vn</span>
        </Link>

        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-elevated sm:p-8">
          <h1 className="font-display text-2xl font-bold text-card-foreground">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </div>

        {footer ? (
          <div className="mt-5 text-center text-sm text-primary-foreground/85">{footer}</div>
        ) : null}
      </div>
    </div>
  );
}
