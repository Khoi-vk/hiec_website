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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    formState: { errors, isValid, isSubmitting, touchedFields },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: { identifier: "", password: "" },
  });

  const onSubmit = (values: LoginValues) => {
    const user = signIn(values.identifier);
    toast.success("Đăng nhập thành công", { description: `Xin chào ${user.fullName}!` });
    navigate({ to: user.role === "admin" ? "/admin/dashboard" : "/profile" });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      

      <div className="space-y-2">
        <Label htmlFor="password">Mật khẩu</Label>
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
        className="w-full"
        disabled={!isValid || isSubmitting}
      >
        Sign In
      </Button>

      {!isValid && Object.keys(touchedFields).length > 0 ? (
        <p className="text-center text-xs text-muted-foreground">
          Nút đăng nhập được mở khi tất cả trường hợp lệ.
        </p>
      ) : null}
    </form>
  );
}
