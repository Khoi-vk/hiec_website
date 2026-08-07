import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function HiecLogo({ className, showText = true }: LogoProps) {
  const logoPath = "/logo.png"; 

  return (
    <div className={cn("flex items-center gap-3 select-none group", className)}>
      
      {/* 1. ICON LOGO: Thêm bo góc và đổ bóng để nổi bật ảnh */}
      <div className="relative flex items-center justify-center size-10 shrink-0 bg-white rounded-lg p-1 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
        <img 
          src={logoPath} 
          alt="HIEC Logo" 
          className="size-full object-contain" 
        />
      </div>

      {/* 2. PHẦN CHỮ: Khống chế xuống dòng và làm màu long lanh */}
      {showText && (
        <div className="flex flex-col justify-center leading-none whitespace-nowrap">
          {/* Dòng 1: CÂU LẠC BỘ (Màu bạc/trắng xanh tinh tế) */}
          <span className="font-display text-[9px] font-black uppercase tracking-[0.2em] text-cyan-200/70 mb-1">
            Câu lạc bộ
          </span>
          
          {/* Dòng 2: Tên chính - Màu cực kỳ long lanh và nổi bật */}
          <span className="font-display text-[14px] font-black tracking-tight flex items-center gap-1.5">
            <span className="bg-gradient-to-r from-cyan-300 via-white to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]">
              Sáng tạo & Khởi nghiệp
            </span>
           
          </span>
        </div>
      )}
    </div>
  );
}