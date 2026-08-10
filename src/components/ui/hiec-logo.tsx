import { cn } from "@/lib/utils";

interface HiecLogoProps {
  isDark?: boolean;
  className?: string;
  showText?: boolean;
}

export function HiecLogo({ isDark, className, showText = true }: HiecLogoProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* Icon Logo tròn - Giữ nguyên */}
      <div className="relative size-10 flex-shrink-0 bg-white rounded-full shadow-lg flex items-center justify-center border border-slate-200">
        <img src="/logo.png" alt="HIEC" className="size-7 object-contain" />
      </div>

      {showText && (
        <div className="flex flex-col justify-center overflow-hidden">
          {/* Dòng 1: CÂU LẠC BỘ */}
          <span
            className={cn(
              "text-[9px] uppercase font-black tracking-[0.3em] leading-none mb-1 transition-colors duration-300 whitespace-nowrap",
              isDark ? "text-white/60" : "text-slate-500 dark:text-slate-400"
            )}
          >
            Câu lạc bộ
          </span>

          {/* Dòng 2: SÁNG TẠO & KHỞI NGHIỆP - FONT CHỮ "CÔNG" KHÔNG XUỐNG DÒNG */}
          <span
            className={cn(
              "text-[15px] font-black uppercase tracking-tighter leading-none transition-colors duration-300 whitespace-nowrap",
              isDark 
                ? "text-white" 
                : "text-[#0f3d3e] dark:text-white"
            )}
          >
            Sáng tạo & Khởi nghiệp
          </span>
        </div>
      )}
    </div>
  );
}