import { cn } from "@/lib/utils";

interface HiecLogoProps {
  /** 
   * isDark: Dùng khi ép buộc Logo màu trắng 
   * (VD: Trong trang Login/Signup có nền xanh đậm cố định)
   */
  isDark?: boolean; 
  className?: string;
  showText?: boolean;
}

export function HiecLogo({ isDark, className, showText = true }: HiecLogoProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* Khung Icon tròn - Giữ nền trắng để luôn nổi bật */}
      <div className="relative size-10 flex-shrink-0 bg-white rounded-full shadow-lg flex items-center justify-center border border-slate-200">
        <img src="/logo.png" alt="HIEC" className="size-7 object-contain" />
      </div>

      {showText && (
        <div className="flex flex-col leading-[0.9]">
          {/* Dòng 1: CÂU LẠC BỘ */}
          <span
            className={cn(
              "text-[9px] uppercase font-black tracking-[0.2em] transition-colors duration-300",
              isDark 
                ? "text-white/70" // Ép màu sáng
                : "text-slate-500 dark:text-slate-400" // Tự động: Sáng xám - Tối xám nhạt
            )}
          >
            Câu lạc bộ
          </span>

          {/* Dòng 2: Sáng tạo & Khởi nghiệp */}
          <span
            className={cn(
              "text-[15px] font-black uppercase tracking-tighter transition-colors duration-300 whitespace-nowrap",
              isDark 
                ? "text-white" // Ép màu sáng
                : "text-[#0f3d3e] dark:text-white" // Tự động: Sáng Xanh Đen - Tối Trắng tinh
            )}
          >
            Sáng tạo & Khởi nghiệp
          </span>
        </div>
      )}
    </div>
  );
}