import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Mail, ShieldCheck, User } from "lucide-react";

import { PublicLayout } from "@/components/layout/public-layout";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/store/auth-store";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Hồ sơ thành viên HIEC" },
      {
        name: "description",
        content: "Xem thông tin tài khoản HIEC, quản lý phiên đăng nhập và đăng xuất an toàn.",
      },
      { property: "og:title", content: "Hồ sơ thành viên HIEC" },
      { property: "og:description", content: "Thông tin tài khoản và phiên đăng nhập HIEC." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, hydrated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (hydrated && !user) navigate({ to: "/login" });
  }, [hydrated, user, navigate]);

  if (!hydrated || !user) {
    return (
      <PublicLayout>
        <div className="mx-auto max-w-6xl px-4 py-24 text-sm text-muted-foreground">
          Đang tải hồ sơ…
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <section className="mx-auto w-full max-w-3xl px-4 py-16">
        <h1 className="font-display text-3xl font-bold">Hồ sơ cá nhân</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Phiên đăng nhập được duy trì tối đa 30 ngày.
        </p>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="font-display text-xl">Thông tin tài khoản</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-accent text-accent-foreground">
                <User className="size-5" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Họ và tên</p>
                <p className="font-medium capitalize">{user.fullName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-accent text-accent-foreground">
                <Mail className="size-5" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-accent text-accent-foreground">
                <ShieldCheck className="size-5" />
              </span>
              <div className="flex items-center gap-2">
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    Phương thức
                  </p>
                  <p className="font-medium">
                    {user.provider === "google" ? "Google" : "Email + Password"}
                  </p>
                </div>
                <Badge variant="secondary" className="ml-2">
                  {user.role === "admin" ? "Admin" : "Thành viên"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          {user.role === "admin" ? (
            <Button asChild variant="outline" size="lg">
              <Link to="/admin/dashboard">Vào trang quản trị</Link>
            </Button>
          ) : null}
          {/* Sign Out nằm cuối trang hồ sơ, sau tất cả thông tin người dùng */}
          <SignOutButton />
        </div>
      </section>
    </PublicLayout>
  );
}
