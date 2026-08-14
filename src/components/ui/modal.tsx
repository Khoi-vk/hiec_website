import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  className,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* SỬA: Thêm class dark: cho background và border */}
      <DialogContent className={cn(
        "sm:max-w-4xl p-0 overflow-hidden border-none shadow-2xl bg-white dark:bg-[#020817] dark:border-white/5",
        className
      )}>
        <div className="max-h-[90vh] overflow-y-auto custom-scrollbar">
          <DialogHeader className="p-8 pb-4">
            {/* SỬA: Tiêu đề long lanh, tự đổi màu theo mode */}
            <DialogTitle className="font-display text-2xl md:text-3xl font-black leading-tight uppercase tracking-tighter text-[#0f3d3e] dark:text-transparent dark:bg-gradient-to-r dark:from-white dark:to-cyan-400 dark:bg-clip-text dark:drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]">
              {title}
            </DialogTitle>
            {description ? (
              <DialogDescription className="text-sm font-medium mt-2 italic text-slate-400 dark:text-slate-500">
                {description}
              </DialogDescription>
            ) : null}
          </DialogHeader>

          {/* SỬA: Nội dung chữ bên trong tự sáng ở mode tối */}
          <div className="px-8 pb-8 text-slate-600 dark:text-slate-300">
            {children}
          </div>

          {footer ? (
            <DialogFooter className="p-6 bg-slate-50 dark:bg-white/5 gap-2 border-t border-slate-100 dark:border-white/5 sm:justify-end">
              {footer}
            </DialogFooter>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}