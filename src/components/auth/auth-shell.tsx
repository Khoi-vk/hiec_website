/**
 * AuthShell – Component khung cho các trang xác thực (đăng nhập).
 * Khung xác thực phẳng, tương thích với cả hai theme.
 */
import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { HiecLogo } from "@/components/ui/hiec-logo"; 

interface AuthShellProps {
  title: string;
  subtitle?: string; // Chuyển thành optional (?) để không bị lỗi nếu không nhập
  children: ReactNode;
  footer?: ReactNode;
  isDark?: boolean; // Thêm prop này để linh hoạt
}

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
  isDark = true,
}: AuthShellProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-primary-deep px-4 py-12">
      <div className="w-full max-w-md animate-fade-up">
        
        {/* LOGO: Đã thêm isDark={isDark} để chữ chuyển sang màu trắng */}
        <div className="mb-8 flex justify-center">
          <Link to="/" className="hover:scale-105 transition-transform duration-300">
            <HiecLogo isDark={isDark} className="scale-125 drop-shadow-xl" />
          </Link>
        </div>

        <div className="rounded-3xl border border-white/10 bg-card/95 p-6 shadow-elevated backdrop-blur-md sm:p-8">
          <div className="mb-6 text-center">
            <h1 className="font-display text-2xl font-bold text-foreground tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-1.5 text-sm text-muted-foreground italic">
                {subtitle}
              </p>
            )}
          </div>
          
          <div className="mt-6">
            {children}
          </div>
        </div>

        {footer ? (
          <div className="mt-6 text-center text-sm text-white/70">
            {footer}
          </div>
        ) : (
          /* Nút quay lại trang chủ mặc định nếu không có footer */
          <div className="mt-8 text-center">
            <Link to="/" className="text-sm text-white/60 hover:text-white transition-colors underline underline-offset-4">
              Quay lại trang chủ
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
