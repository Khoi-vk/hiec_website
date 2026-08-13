import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Eye, FileText, TrendingUp, UserPlus } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminStats, trafficData } from "@/services/hiec-service";
import { supabase } from "@/utils/supabase";

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
  const [memberCount, setMemberCount] = React.useState<number | null>(null);

  React.useEffect(() => {
    async function fetchMemberCount() {
      const { count, error } = await supabase
        .from("members")
        .select("*", { count: "exact", head: true });

      if (!error) setMemberCount(count ?? 0);
    }

    fetchMemberCount();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Tổng quan</h1>
        <p className="text-sm text-muted-foreground">Số liệu demo cho website hiec.vn</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {adminStats.map((stat, i) => {
          const Icon = icons[i] ?? FileText;
          const isMemberStat = i === 3;
          return (
            <Card key={stat.label}>
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <Icon className="size-4 text-primary" />
              </CardHeader>
              <CardContent>
                <p className="font-display text-2xl font-bold">
                  {isMemberStat ? (memberCount ?? "—") : stat.value}
                </p>
                {!isMemberStat && <p className="mt-1 text-xs text-success">{stat.delta}</p>}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg">Lượt truy cập 6 tháng</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData}>
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
                  fill="var(--color-primary)"
                  fillOpacity={0.18}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
