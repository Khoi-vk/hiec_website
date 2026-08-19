import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Eye, FileText, TrendingUp, UserPlus } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

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
  const [contentCount, setContentCount] = React.useState<number | null>(null);
  const [applicationCount, setApplicationCount] = React.useState<number | null>(null);

  React.useEffect(() => {
    let isMounted = true;

    async function fetchDashboardCounts() {
      try {
        const [membersResult, projectsResult, activitiesResult, applicationsResult] =
          await Promise.allSettled([
            supabase.from("members").select("*", { count: "exact", head: true }),
            supabase.from("projects").select("*", { count: "exact", head: true }),
            supabase.from("activities").select("*", { count: "exact", head: true }),
            supabase.from("applications").select("*", { count: "exact", head: true }),
          ]);

        if (!isMounted) return;

        if (membersResult.status === "fulfilled" && !membersResult.value.error) {
          setMemberCount(membersResult.value.count ?? 0);
        }
        if (
          projectsResult.status === "fulfilled" &&
          activitiesResult.status === "fulfilled" &&
          !projectsResult.value.error &&
          !activitiesResult.value.error
        ) {
          setContentCount((projectsResult.value.count ?? 0) + (activitiesResult.value.count ?? 0));
        }
        if (applicationsResult.status === "fulfilled" && !applicationsResult.value.error) {
          setApplicationCount(applicationsResult.value.count ?? 0);
        }
      } catch (err) {
        console.error("Lỗi khi tải số liệu tổng quan:", err);
      }
    }

    fetchDashboardCounts();

    let channel: any = null;
    try {
      channel = supabase
        .channel("dashboard-applications")
        .on("postgres_changes", { event: "*", schema: "public", table: "applications" }, () => {
          fetchDashboardCounts();
        })
        .subscribe();
    } catch (err) {
      console.warn("Không thể đăng ký realtime trên dashboard:", err);
    }

    return () => {
      isMounted = false;
      if (channel) {
        try {
          supabase.removeChannel(channel);
        } catch {
          // ignore
        }
      }
    };
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
          const isContentStat = i === 0;
          const isMemberStat = i === 3;
          const isApplicationStat = i === 2;
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
                  {isContentStat
                    ? (contentCount ?? "—")
                    : isMemberStat
                      ? (memberCount ?? "—")
                      : isApplicationStat
                        ? (applicationCount ?? "—")
                        : stat.value}
                </p>
                {!isContentStat && !isMemberStat && !isApplicationStat && (
                  <p className="mt-1 text-xs text-success">{stat.delta}</p>
                )}
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
