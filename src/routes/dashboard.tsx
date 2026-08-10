import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  FolderKanban,
  Images,
  Sparkles,
  User,
} from "lucide-react";

import { RouteLoading } from "@/components/auth/route-loading";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { PublicLayout } from "@/components/layout/public-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthRouteGuard } from "@/hooks/use-route-guard";
import { projects } from "@/services/hiec-service";
import { useClubStore } from "@/store/club-store";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Bảng điều khiển thành viên — HIEC" },
      {
        name: "description",
        content: "Trang chủ cá nhân dành cho thành viên HIEC: dự án, tin tức và hoạt động gần đây.",
      },
    ],
  }),
  component: UserDashboardPage,
});

const quickLinks = [
  { label: "Dự án & dấu ấn", to: "/projects", icon: FolderKanban, description: "Khám phá các dự án nổi bật" },
  { label: "Tin tức", to: "/articles", icon: BookOpen, description: "Cập nhật hoạt động mới nhất" },
  { label: "Thư viện ảnh", to: "/gallery", icon: Images, description: "Khoảnh khắc từ các sự kiện HIEC" },
  { label: "Hồ sơ cá nhân", to: "/profile", icon: User, description: "Quản lý thông tin tài khoản" },
] as const;

function UserDashboardPage() {
  const { user, allowed } = useAuthRouteGuard();
  const { articles } = useClubStore();
  const featuredProjects = projects.filter((p) => p.published).slice(0, 3);
  const latestArticles = articles.filter((a) => a.published).slice(0, 3);

  if (!allowed || !user) {
    return <RouteLoading message="Đang tải bảng điều khiển…" />;
  }

  return (
    <PublicLayout>
      <section className="mx-auto w-full max-w-6xl px-4 py-12">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Badge variant="secondary" className="mb-3">
              <Sparkles className="mr-1 size-3" />
              Thành viên HIEC
            </Badge>
            <h1 className="font-display text-3xl font-bold">
              Xin chào, {user.fullName}!
            </h1>
            <p className="mt-2 max-w-xl text-muted-foreground">
              Đây là trang chủ cá nhân của bạn — nơi theo dõi hoạt động, khám phá nội dung mới và quản lý
              tài khoản.
            </p>
          </div>
          <SignOutButton />
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((link) => (
            <Link key={link.to} to={link.to} className="group">
              <Card className="h-full border-border/70 transition-shadow hover:shadow-elevated">
                <CardHeader className="pb-2">
                  <span className="grid size-10 place-items-center rounded-xl bg-accent text-accent-foreground">
                    <link.icon className="size-5" />
                  </span>
                  <CardTitle className="mt-3 font-display text-base group-hover:text-primary">
                    {link.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{link.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="font-display text-lg">Dự án nổi bật</CardTitle>
              <Button asChild variant="ghost" size="sm">
                <Link to="/projects">
                  Xem tất cả <ArrowRight className="size-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {featuredProjects.map((project) => (
                <div key={project.id} className="flex items-start justify-between gap-3 border-b border-border/60 pb-4 last:border-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{project.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {project.category} · {project.year}
                    </p>
                  </div>
                  <Badge variant="secondary">{project.metric}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="font-display text-lg">Tin tức mới</CardTitle>
              <Button asChild variant="ghost" size="sm">
                <Link to="/articles">
                  Xem tất cả <ArrowRight className="size-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {latestArticles.map((article) => (
                <div key={article.id} className="flex items-start gap-3 border-b border-border/60 pb-4 last:border-0 last:pb-0">
                  <CalendarDays className="mt-0.5 size-4 shrink-0 text-primary" />
                  <div className="min-w-0">
                    <p className="truncate font-medium">{article.title}</p>
                    <p className="text-xs text-muted-foreground">{article.publishDate}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </PublicLayout>
  );
}
