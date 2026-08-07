import { createFileRoute, Link } from "@tanstack/react-router";

import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Đăng nhập HIEC — Sign in" },
      {
        name: "description",
        content: "Đăng nhập tài khoản HIEC bằng email/số điện thoại và mật khẩu hoặc bằng Google.",
      },
      { property: "og:title", content: "Đăng nhập HIEC" },
      { property: "og:description", content: "Truy cập tài khoản thành viên HIEC." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  return (
    <AuthShell
      title="Sign in"
      
    >
      <LoginForm />
    </AuthShell>
  );
}
