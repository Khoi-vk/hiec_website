import { createFileRoute } from "@tanstack/react-router";

import { AuthShell } from "@/components/auth/auth-shell";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Quên mật khẩu HIEC — Đặt lại mật khẩu" },
      {
        name: "description",
        content:
          "Khôi phục tài khoản HIEC qua 3 bước: nhập email/số điện thoại, xác thực mã OTP 6 số và đặt mật khẩu mới.",
      },
      { property: "og:title", content: "Quên mật khẩu HIEC" },
      { property: "og:description", content: "Đặt lại mật khẩu tài khoản HIEC an toàn." },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Quên mật khẩu"
      subtitle="Xác thực danh tính và đặt lại mật khẩu mới cho tài khoản của bạn."
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
