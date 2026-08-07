/**
 * AuthShell – Component khung cho các trang xác thực (đăng nhập).
 * Đã cập nhật Logo đồng bộ bằng Component HiecLogo.
 */
import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { HiecLogo } from "@/components/ui/hiec-logo"; // Import Logo mới

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
        
        {/* SỬA: Thay thế phần logo cũ bằng HiecLogo, căn giữa và làm chữ trắng để nổi bật trên nền đậm */}
        <div className="mb-8 flex justify-center">
          <Link to="/" className="hover:scale-105 transition-transform duration-300">
            <HiecLogo className="text-white drop-shadow-md" />
          </Link>
        </div>

        <div className="rounded-3xl border border-white/10 bg-card/95 p-6 shadow-elevated backdrop-blur-sm sm:p-8">
          <div className="mb-6">
            <h1 className="font-display text-2xl font-bold text-card-foreground tracking-tight">
              {title}
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground italic">
              {subtitle}
            </p>
          </div>
          
          <div className="mt-6">
            {children}
          </div>
        </div>

        {footer ? (
          <div className="mt-6 text-center text-sm text-white/70">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}