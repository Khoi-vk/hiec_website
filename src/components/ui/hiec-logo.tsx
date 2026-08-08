import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
  isDark?: boolean; // Thêm prop này để phân biệt nền sáng/tối
}

export function HiecLogo({ className, showText = true, isDark = false }: LogoProps) {
  const logoPath = "/logo.png"; 

  return (
    <div className={cn("flex items-center gap-3 select-none", className)}>
      
      {/* 1. BOX LOGO: Giữ nền trắng để logo luôn rõ ràng trên mọi nền */}
      <div className="relative flex items-center justify-center size-10 shrink-0 bg-white rounded-xl p-1.5 shadow-sm border border-blue-100">
        <img src={logoPath} alt="HIEC" className="size-full object-contain" />
      </div>

      {/* 2. PHẦN CHỮ: Tự thích nghi màu sắc */}
      {showText && (
        <div className="flex flex-col justify-center leading-tight whitespace-nowrap">
          {/* Dòng 1: CÂU LẠC BỘ */}
          <span className={cn(
            "font-display text-[10px] font-bold uppercase tracking-[0.15em] mb-0.5",
            isDark ? "text-cyan-400/90" : "text-primary/70"
          )}>
            Câu lạc bộ
          </span>
          
          {/* Dòng 2: Tên chính - Màu long lanh, đứng im */}
          <span className={cn(
            "font-display text-[16px] font-black tracking-tight",
            isDark 
              ? "bg-gradient-to-r from-white via-cyan-100 to-blue-200 bg-clip-text text-transparent drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]" 
              : "text-[#00348a]" // Màu xanh đậm hoàng gia khi ở nền trắng
          )}>
            Sáng tạo & Khởi nghiệp <span className={isDark ? "text-white" : "text-primary"}></span>
          </span>
        </div>
      )}
    </div>
  );
}