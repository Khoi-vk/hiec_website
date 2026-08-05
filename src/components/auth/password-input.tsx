/*
PasswordInput - hiển thị một ô nhập mật khẩu có nút bật/tắt hiển thị mật khẩu (con mắt).
   - Mặc định mật khẩu bị ẩn (type="password")
   - Người dùng có thể nhấn nút để chuyển đổi qua lại giữa ẩn và hiện
   - Hỗ trợ đầy đủ các props của Input (placeholder, value, onChange, ...)
   - Sử dụng React.forwardRef để có thể truyền ref từ component cha
   - Đảm bảo accessibility với aria-label cập nhật theo trạng thái
   - Yêu cầu nghiệp vụ: Docs-BA-3 --> này khả năng vibe code từ file của chị Duyên.
*/
import * as React from "react";
import { Eye, EyeOff } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/** Password input with default-hidden value and a show/hide toggle (Docs-BA-3). */
export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentPropsWithoutRef<typeof Input>
>(({ className, ...props }, ref) => {
  const [visible, setVisible] = React.useState(false);
  return (
    <div className="relative">
      <Input
        ref={ref}
        type={visible ? "text" : "password"}
        className={cn("pr-10", className)}
        {...props}
      />
      <button
        type="button"
        aria-label={visible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
        onClick={() => setVisible((v) => !v)}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
      >
        {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
});
PasswordInput.displayName = "PasswordInput";
