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
<<<<<<< HEAD
/**
 * LoginForm - Xử lý đăng nhập Quản trị viên cho HIEC.vn.
 * Tuân thủ logic: Chỉ nhập mật khẩu (số điện thoại sếp An) để vào Admin.
 */
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
=======
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
>>>>>>> 39cd77023537a057b237d7eb34914b8d94907603
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
<<<<<<< HEAD
    formState: { errors, isValid, isSubmitting },
=======
    formState: { errors, isValid, isSubmitting, touchedFields },
>>>>>>> 39cd77023537a057b237d7eb34914b8d94907603
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: { password: "" },
  });

  const onSubmit = (values: LoginValues) => {
<<<<<<< HEAD
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
=======
    const user = signIn(values.identifier);
    toast.success("Đăng nhập thành công", { description: `Xin chào ${user.fullName}!` });
    navigate({ to: user.role === "admin" ? "/admin/dashboard" : "/profile" });
>>>>>>> 39cd77023537a057b237d7eb34914b8d94907603
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
<<<<<<< HEAD
      <div className="space-y-2">
        <Label htmlFor="password">Mật khẩu truy cập</Label>
=======
      

      <div className="space-y-2">
        <Label htmlFor="password">Mật khẩu</Label>
>>>>>>> 39cd77023537a057b237d7eb34914b8d94907603
        <PasswordInput
          id="password"
          placeholder="••••••••"
          autoComplete="current-password"
          aria-invalid={!!errors.password}
          {...register("password")}
        />
<<<<<<< HEAD
        
        {/* Gợi ý cho người dùng nội bộ CLB */}
        <div className="rounded-lg bg-primary/5 p-3 border border-primary/10 mt-2">
          <p className="text-xs text-primary font-medium leading-relaxed">
            💡 Gợi ý: Sử dụng số điện thoại của Trưởng ban (Sếp An) để đăng nhập quyền Quản trị.
          </p>
        </div>
        
        <FieldError message={errors.password?.message} />
      </div>

=======
        <p className="text-sm text-red-500 mt-1">
        Nhớ số điện thoại sếp An không?
      </p>
        <FieldError message={errors.password?.message} />
      </div>

      

>>>>>>> 39cd77023537a057b237d7eb34914b8d94907603
      <Button
        type="submit"
        variant="shimmer"
        size="lg"
<<<<<<< HEAD
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
=======
        className="w-full"
        disabled={!isValid || isSubmitting}
      >
        Sign In
      </Button>

      
    </form>
  );
}
>>>>>>> 39cd77023537a057b237d7eb34914b8d94907603
