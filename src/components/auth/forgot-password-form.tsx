import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/auth/field-error";
import { PasswordInput } from "@/components/auth/password-input";
import {
  forgotIdentifierSchema,
  otpSchema,
  resetPasswordSchema,
  type ForgotIdentifierValues,
  type OtpValues,
  type ResetPasswordValues,
} from "@/lib/validators/auth-validator";

type Step = "identifier" | "otp" | "password";

const DEMO_OTP = "123456";

export function ForgotPasswordForm() {
  const [step, setStep] = React.useState<Step>("identifier");
  const [identifier, setIdentifier] = React.useState("");
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <ol className="flex items-center gap-2 text-xs font-medium">
        {(["identifier", "otp", "password"] as Step[]).map((s, i) => {
          const order = ["identifier", "otp", "password"].indexOf(step);
          const active = i <= order;
          return (
            <li key={s} className="flex flex-1 items-center gap-2">
              <span
                className={
                  active
                    ? "grid size-6 place-items-center rounded-full bg-primary text-[11px] text-primary-foreground"
                    : "grid size-6 place-items-center rounded-full bg-muted text-[11px] text-muted-foreground"
                }
              >
                {i + 1}
              </span>
              {i < 2 ? (
                <span className={active ? "h-px flex-1 bg-primary" : "h-px flex-1 bg-border"} />
              ) : null}
            </li>
          );
        })}
      </ol>

      {step === "identifier" ? (
        <IdentifierStep
          onDone={(value) => {
            setIdentifier(value);
            setStep("otp");
            toast.success("Đã gửi mã xác thực", { description: `Mã demo: ${DEMO_OTP}` });
          }}
        />
      ) : null}

      {step === "otp" ? (
        <OtpStep identifier={identifier} onDone={() => setStep("password")} />
      ) : null}

      {step === "password" ? (
        <NewPasswordStep
          onDone={() => {
            toast.success("Cập nhật mật khẩu thành công", { description: "Vui lòng đăng nhập lại" });
            navigate({ to: "/login" });
          }}
        />
      ) : null}

      <p className="text-center text-sm text-muted-foreground">
        <Link to="/login" className="font-medium text-primary hover:underline">
          Quay lại đăng nhập
        </Link>
      </p>
    </div>
  );
}

function IdentifierStep({ onDone }: { onDone: (value: string) => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ForgotIdentifierValues>({
    resolver: zodResolver(forgotIdentifierSchema),
    mode: "onChange",
    defaultValues: { identifier: "" },
  });

  return (
    <form onSubmit={handleSubmit((v) => onDone(v.identifier))} className="space-y-5" noValidate>
      <div className="space-y-2">
        <Label htmlFor="forgot-identifier">Email / Số điện thoại</Label>
        <Input
          id="forgot-identifier"
          placeholder="ban@hiec.vn hoặc 0912345678"
          aria-invalid={!!errors.identifier}
          {...register("identifier")}
        />
        <FieldError message={errors.identifier?.message} />
      </div>
      <Button type="submit" variant="shimmer" size="lg" className="w-full" disabled={!isValid}>
        Gửi mã xác thực
      </Button>
    </form>
  );
}

function OtpStep({ identifier, onDone }: { identifier: string; onDone: () => void }) {
  const [seconds, setSeconds] = React.useState(60);

  React.useEffect(() => {
    if (seconds <= 0) return;
    const timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm<OtpValues>({
    resolver: zodResolver(otpSchema),
    mode: "onChange",
    defaultValues: { otp: "" },
  });

  return (
    <form
      onSubmit={handleSubmit((v) => {
        if (v.otp !== DEMO_OTP) {
          setError("otp", { message: "Mã xác nhận không chính xác" });
          return;
        }
        onDone();
      })}
      className="space-y-5"
      noValidate
    >
      <div className="space-y-2">
        <Label htmlFor="otp">Verification Code (OTP)</Label>
        <p className="text-xs text-muted-foreground">Mã 6 số đã gửi tới {identifier}</p>
        <Input
          id="otp"
          inputMode="numeric"
          maxLength={6}
          placeholder="123456"
          className="text-center text-lg tracking-[0.6em]"
          aria-invalid={!!errors.otp}
          {...register("otp")}
        />
        <FieldError message={errors.otp?.message} />
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          disabled={seconds > 0}
          onClick={() => setSeconds(60)}
          className="text-sm font-medium text-primary disabled:cursor-not-allowed disabled:text-muted-foreground"
        >
          {seconds > 0 ? `Resend OTP sau ${seconds}s` : "Resend OTP"}
        </button>
      </div>

      <Button type="submit" variant="shimmer" size="lg" className="w-full" disabled={!isValid}>
        Continue
      </Button>
    </form>
  );
}

function NewPasswordStep({ onDone }: { onDone: () => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
    defaultValues: { password: "", confirmPassword: "" },
  });

  return (
    <form onSubmit={handleSubmit(() => onDone())} className="space-y-5" noValidate>
      <div className="space-y-2">
        <Label htmlFor="new-password">New Password</Label>
        <PasswordInput
          id="new-password"
          placeholder="••••••••"
          aria-invalid={!!errors.password}
          {...register("password")}
        />
        <FieldError message={errors.password?.message} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirm-new-password">Confirm new password</Label>
        <PasswordInput
          id="confirm-new-password"
          placeholder="••••••••"
          aria-invalid={!!errors.confirmPassword}
          {...register("confirmPassword")}
        />
        <FieldError message={errors.confirmPassword?.message} />
      </div>
      <Button type="submit" variant="shimmer" size="lg" className="w-full" disabled={!isValid}>
        Continue
      </Button>
    </form>
  );
}
