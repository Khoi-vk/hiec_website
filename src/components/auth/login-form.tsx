import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/auth/field-error";
import { GoogleButton } from "@/components/auth/google-button";
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
        <Label htmlFor="identifier">Email / Số điện thoại</Label>
        <Input
          id="identifier"
          placeholder="ban@hiec.vn hoặc 0912345678"
          autoComplete="username"
          aria-invalid={!!errors.identifier}
          {...register("identifier")}
        />
        <FieldError message={errors.identifier?.message} />
      </div>

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

      <div className="flex justify-end">
        <Link
          to="/forgot-password"
          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          Quên mật khẩu?
        </Link>
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

      <div className="relative py-1 text-center">
        <span className="relative z-10 bg-card px-3 text-xs uppercase tracking-widest text-muted-foreground">
          hoặc
        </span>
        <span className="absolute left-0 top-1/2 h-px w-full bg-border" />
      </div>

      <GoogleButton
        label="Sign in with Google"
        onClick={() => {
          const user = signIn("member@gmail.com", { provider: "google" });
          toast.success("Đăng nhập Google thành công", { description: user.email });
          navigate({ to: "/profile" });
        }}
      />
    </form>
  );
}
