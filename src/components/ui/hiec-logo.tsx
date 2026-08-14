import { cn } from "@/lib/utils";

interface HiecLogoProps {
  isDark?: boolean;
  className?: string;
  showText?: boolean;
}

export function HiecLogo({ isDark, className, showText = true }: HiecLogoProps) {
  return (
    <div className={cn("flex items-center gap-3 select-none group", className)}>
      {/* Icon Logo tròn - Thêm bóng đổ nhẹ để tạo độ khối */}
      <div className="relative size-10 flex-shrink-0 bg-white rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.1)] flex items-center justify-center border border-slate-100 overflow-hidden">
        <img src="/logo.png" alt="HIEC" className="size-7 object-contain transition-transform duration-500 group-hover:scale-110" />
      </div>

      {showText && (
        <div className="flex flex-col justify-center overflow-hidden">
          {/* Dòng 1: CÂU LẠC BỘ */}
          <span
            className={cn(
              "text-[9px] uppercase font-black tracking-[0.3em] leading-none mb-1.5 transition-colors duration-300 whitespace-nowrap",
              isDark ? "text-cyan-400/80" : "text-slate-400"
            )}
          >
            Câu lạc bộ
          </span>

          {/* Dòng 2: SÁNG TẠO & KHỞI NGHIỆP - ĐÃ ĐỔI SANG FONT MONTSERRAT */}
          <span
            style={{ fontFamily: 'var(--font-montserrat)' }} // Ép dùng font Montserrat
            className={cn(
              "text-[15px] font-[900] uppercase tracking-tighter leading-none transition-colors duration-300 whitespace-nowrap",
              isDark 
                ? "bg-gradient-to-r from-white via-cyan-100 to-blue-200 bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" 
                : "text-[#0f3d3e]"
            )}
          >
            Sáng tạo & Khởi nghiệp
          </span>
        </div>
      )}
    </div>
  );
}