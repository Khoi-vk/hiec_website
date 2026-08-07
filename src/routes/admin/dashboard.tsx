import { createFileRoute } from "@tanstack/react-router";
import { Eye, FileText, TrendingUp, UserPlus } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminStats, projects, trafficData } from "@/services/hiec-service";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({
    meta: [
      { title: "Tổng quan quản trị — HIEC Admin" },
      {
        name: "description",
        content: "Thống kê bài viết, lượt truy cập và đăng ký tham gia của website HIEC.",
      },
      { property: "og:title", content: "HIEC Admin — Tổng quan" },
      { property: "og:description", content: "Bảng điều khiển thống kê nội dung HIEC." },
    ],
  }),
  component: DashboardPage,
});

const icons = [FileText, Eye, UserPlus, TrendingUp];

function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Tổng quan</h1>
        <p className="text-sm text-muted-foreground">Số liệu demo cho website hiec.vn</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {adminStats.map((stat, i) => {
          const Icon = icons[i] ?? FileText;
          return (
            <Card key={stat.label}>
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <Icon className="size-4 text-primary" />
              </CardHeader>
              <CardContent>
                <p className="font-display text-2xl font-bold">{stat.value}</p>
                <p className="mt-1 text-xs text-success">{stat.delta}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-display text-lg">Lượt truy cập 6 tháng</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData}>
                <defs>
                  <linearGradient id="views" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="var(--color-primary)"
                  fill="url(#views)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg">Bài viết mới nhất</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {projects.slice(0, 5).map((post) => (
              <div key={post.id} className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{post.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {post.category} · {post.year}
                  </p>
                </div>
                <Badge variant={post.published ? "default" : "secondary"}>
                  {post.published ? "Hiện" : "Ẩn"}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
