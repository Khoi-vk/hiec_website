import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Rocket } from "lucide-react";

import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { projects } from "@/services/hiec-service";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Dự án & dấu ấn HIEC — Danh sách hoạt động" },
      {
        name: "description",
        content:
          "Danh sách dự án, hoạt động và dấu ấn của câu lạc bộ HIEC qua các năm: bootcamp, mentoring, cuộc thi và sự kiện.",
      },
      { property: "og:title", content: "Dự án & dấu ấn HIEC" },
      {
        property: "og:description",
        content: "Bootcamp, mentoring, cuộc thi và các dấu ấn nổi bật của HIEC.",
      },
    ],
  }),
  component: ProjectsPage,
});

const filters = ["Tất cả", "Dự án", "Hoạt động", "Dấu ấn"] as const;

function ProjectsPage() {
  const [filter, setFilter] = React.useState<(typeof filters)[number]>("Tất cả");
  const visible = projects.filter(
    (p) => p.published && (filter === "Tất cả" || p.category === filter),
  );

  return (
    <PublicLayout>
      <section className="bg-gradient-hero py-16">
        <div className="mx-auto w-full max-w-6xl px-4">
          <h1 className="font-display text-4xl font-extrabold text-primary-foreground sm:text-5xl">
            Dự án & dấu ấn
          </h1>
          <p className="mt-4 max-w-2xl text-primary-foreground/85">
            Mỗi dự án là một chu trình hoàn chỉnh: nghiên cứu, xây dựng, triển khai và đo lường tác
            động cùng cộng đồng sinh viên HIEC.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-14">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <Button
              key={f}
              variant={filter === f ? "shimmer" : "outline"}
              size="sm"
              onClick={() => setFilter(f)}
            >
              {f}
            </Button>
          ))}
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((project) => (
            <Card key={project.id} className="group overflow-hidden border-border/70">
              <div className="h-1.5 w-full bg-gradient-brand" />
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{project.category}</Badge>
                  <span className="text-xs text-muted-foreground">{project.year}</span>
                </div>
                <CardTitle className="mt-3 font-display text-xl group-hover:text-primary">
                  {project.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{project.excerpt}</p>
                <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  <Rocket className="size-4" /> {project.metric}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {visible.length === 0 ? (
          <p className="mt-10 text-center text-sm text-muted-foreground">
            Chưa có bài viết trong danh mục này.
          </p>
        ) : null}
      </section>
    </PublicLayout>
  );
}
