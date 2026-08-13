/*
LoginForm - một form đăng nhập xây dựng cho web, có các chức năng:
  - Nhập email/số điện thoại và mật khẩu
  - Xác thực dữ liệu ngay khi gõ (validation bằng Zod)
  - Hiển thị lỗi chi tiết cho từng trường
  - Gọi đăng nhập giả lập (qua signIn của store auth)
  - Hiển thị thông báo thành công qua toast
  - Điều hướng đến trang phù hợp với vai trò của người dùng (admin dashboard hoặc profile)
  - Có link quên mật khẩu và nút đăng nhập bằng Google (cũng ở dạng giả lập). --> Đăng nhập bằng Google này mình không dùng nhưng mà tớ chưa bỏ, sợ bỏ xong web ko chạy được :v
*/
/**
 * LoginForm - Xử lý đăng nhập Quản trị viên cho HIEC.vn.
 * Tuân thủ logic: Chỉ nhập mật khẩu (số điện thoại sếp An) để vào Admin.
 */
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/auth/field-error";
import { PasswordInput } from "@/components/auth/password-input";
import { loginSchema, type LoginValues } from "@/lib/validators/auth-validator";
import { useAuth } from "@/store/auth-store";

export function LoginForm() {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: { password: "" },
  });

  const onSubmit = (values: LoginValues) => {
    try {
      // SỬA: Schema của bạn chỉ có field 'password', 
      // và hàm signIn trong auth-store cũng nhận vào password.
      const user = signIn(values.password);
      
      toast.success("Đăng nhập thành công", { 
        description: `Xin chào ${user.fullName}!` 
      });

      // SỬA: Điều hướng chuẩn theo định dạng TanStack Router
      if (user.role === "admin") {
        navigate({ to: "/admin/dashboard" });
      } else {
        navigate({ to: "/" });
      }
    } catch (error: any) {
      toast.error(error.message || "Mật khẩu không chính xác");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="space-y-2">
        <Label htmlFor="password">Mật khẩu truy cập</Label>
        <PasswordInput
          id="password"
          placeholder="••••••••"
          autoComplete="current-password"
          aria-invalid={!!errors.password}
          {...register("password")}
        />
        
        
        <FieldError message={errors.password?.message} />
      </div>

      <Button
        type="submit"
        variant="shimmer"
        size="lg"
        className="w-full font-bold tracking-tight"
        disabled={!isValid || isSubmitting}
      >
        {isSubmitting ? "Đang xác thực..." : "ĐĂNG NHẬP ADMIN"}
      </Button>

      <div className="text-center pt-2">
        <p className="text-xs text-muted-foreground">
          Bạn không phải Admin? <a href="/" className="text-primary hover:underline">Quay lại trang chủ</a>
        </p>
      </div>
    </form>
  );
}
