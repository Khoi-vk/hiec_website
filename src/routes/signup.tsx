import { createFileRoute } from "@tanstack/react-router";

import { AuthShell } from "@/components/auth/auth-shell";
import { SignUpForm } from "@/components/auth/signup-form";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Đăng ký thành viên HIEC — Sign up" },
      {
        name: "description",
        content:
          "Tạo tài khoản HIEC: nhập họ tên, email, mật khẩu an toàn và đồng ý điều khoản dịch vụ.",
      },
      { property: "og:title", content: "Đăng ký thành viên HIEC" },
      { property: "og:description", content: "Tham gia cộng đồng khởi nghiệp sinh viên HIEC." },
    ],
  }),
  component: SignUpPage,
});

function SignUpPage() {
  return (
    <AuthShell
      title="Tạo tài khoản"
      subtitle="Điền thông tin bên dưới để trở thành thành viên cộng đồng HIEC."
    >
      <SignUpForm />
    </AuthShell>
  );
}
