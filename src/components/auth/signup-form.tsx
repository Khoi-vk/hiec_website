import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/auth/field-error";
import { GoogleButton } from "@/components/auth/google-button";
import { PasswordInput } from "@/components/auth/password-input";
import { signUpSchema, type SignUpValues } from "@/lib/validators/auth-validator";
import { useAuth } from "@/store/auth-store";

export function SignUpForm() {
  const { signUp, signIn } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false as unknown as true,
    },
  });

  const accepted = watch("acceptTerms");

  const onSubmit = (values: SignUpValues) => {
    signUp(values.fullName, values.email);
    toast.success("Đăng ký thành công", { description: "Chào mừng bạn đến với HIEC!" });
    navigate({ to: "/profile" });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          placeholder="Nguyễn Văn A"
          aria-invalid={!!errors.fullName}
          {...register("fullName")}
        />
        <FieldError message={errors.fullName?.message} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          placeholder="ban@hiec.vn"
          autoComplete="email"
          aria-invalid={!!errors.email}
          {...register("email")}
        />
        <FieldError message={errors.email?.message} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <PasswordInput
          id="password"
          placeholder="••••••••"
          autoComplete="new-password"
          aria-invalid={!!errors.password}
          {...register("password")}
        />
        <FieldError message={errors.password?.message} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <PasswordInput
          id="confirmPassword"
          placeholder="••••••••"
          autoComplete="new-password"
          aria-invalid={!!errors.confirmPassword}
          {...register("confirmPassword")}
        />
        <FieldError message={errors.confirmPassword?.message} />
      </div>

      <div className="space-y-2">
        <div className="flex items-start gap-3">
          <Checkbox
            id="acceptTerms"
            checked={!!accepted}
            onCheckedChange={(checked) =>
              setValue("acceptTerms", (checked === true) as true, {
                shouldValidate: true,
                shouldTouch: true,
              })
            }
          />
          <Label htmlFor="acceptTerms" className="text-sm font-normal leading-snug">
            Tôi đồng ý với <span className="text-primary">Điều khoản dịch vụ</span> và{" "}
            <span className="text-primary">Chính sách bảo mật</span> của HIEC.
          </Label>
        </div>
        <FieldError message={errors.acceptTerms?.message} />
      </div>

      <Button
        type="submit"
        variant="shimmer"
        size="lg"
        className="w-full"
        disabled={!isValid || isSubmitting}
      >
        Tạo tài khoản
      </Button>

      <div className="relative py-1 text-center">
        <span className="relative z-10 bg-card px-3 text-xs uppercase tracking-widest text-muted-foreground">
          hoặc
        </span>
        <span className="absolute left-0 top-1/2 h-px w-full bg-border" />
      </div>

      <GoogleButton
        label="Sign up with Google"
        onClick={() => {
          signIn("member@gmail.com", { provider: "google" });
          toast.success("Tạo tài khoản bằng Google thành công");
          navigate({ to: "/profile" });
        }}
      />

      <p className="text-center text-sm text-muted-foreground">
        Đã có tài khoản?{" "}
        <Link to="/login" className="font-medium text-primary hover:underline">
          Đăng nhập
        </Link>
      </p>
    </form>
  );
}
