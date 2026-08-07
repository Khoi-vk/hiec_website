/* 
FieldError - Component hiển thị lỗi xác thực (validation error) theo thời gian thực.
   - Hiển thị lỗi validation bên dưới field input
   - Tự động ẩn khi không có lỗi
   - Dùng chung cho mọi form (auth, profile,...)
*/
import { AlertCircle } from "lucide-react";

/** Realtime validation error shown directly beneath a field. */
export function FieldError({ message }: { message?: string | undefined }) {
  if (!message) return null;
  return (
    <p className="flex items-start gap-1.5 text-xs font-medium text-destructive">
      <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
      <span>{message}</span>
    </p>
  );
}
