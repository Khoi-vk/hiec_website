import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Calendar, Eye, User } from "lucide-react";

import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useClubStore, type Article } from "@/store/club-store";
import { Modal } from "@/components/ui/modal";

export const Route = createFileRoute("/articles")({
  head: () => ({
    meta: [
      { title: "Tin tức & Bài viết HIEC — CLB Khởi nghiệp" },
      {
        name: "description",
        content: "Cập nhật những tin tức mới nhất, cẩm nang khởi nghiệp, xu hướng công nghệ từ HIEC.",
      },
    ],
  }),
  component: ArticlesPage,
});

function ArticlesPage() {
  const { articles } = useClubStore();
  const [selectedArticle, setSelectedArticle] = React.useState<Article | null>(null);

  const visibleArticles = articles.filter((art) => art.published);

  return (
    <PublicLayout>
      <section className="bg-gradient-hero py-16">
        <div className="mx-auto w-full max-w-6xl px-4">
          <h1 className="font-display text-4xl font-extrabold text-primary-foreground sm:text-5xl">
            Tin tức & Bài viết
          </h1>
          <p className="mt-4 max-w-2xl text-primary-foreground/85">
            Cập nhật các hoạt động mới nhất của CLB, cùng các kiến thức hữu ích về khởi nghiệp, đổi mới sáng tạo và phát triển sản phẩm.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-14">
        {visibleArticles.length === 0 ? (
          <p className="text-center text-muted-foreground py-10">Chưa có bài viết nào được xuất bản.</p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {visibleArticles.map((art) => (
              <Card key={art.id} className="group overflow-hidden flex flex-col border-border/70 hover:shadow-elevated transition-all">
                <div className="aspect-video w-full overflow-hidden bg-muted relative">
                  <img
                    src={art.coverImage || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80"}
                    alt={art.title}
                    className="object-cover size-full group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader className="flex-1">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3.5" /> {art.publishDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="size-3.5" /> HIEC Team
                    </span>
                  </div>
                  <CardTitle className="font-display text-xl group-hover:text-primary transition-colors line-clamp-2">
                    {art.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-5">
                    {art.excerpt}
                  </p>
                  <Button variant="outline" size="sm" onClick={() => setSelectedArticle(art)}>
                    Đọc tiếp
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Article Detail Modal */}
      <Modal
        open={!!selectedArticle}
        onOpenChange={(open) => !open && setSelectedArticle(null)}
        title={selectedArticle?.title ?? ""}
        description={`Đăng ngày: ${selectedArticle?.publishDate ?? ""} bởi HIEC Team`}
      >
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 mt-4">
          {selectedArticle?.coverImage && (
            <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted">
              <img
                src={selectedArticle.coverImage}
                alt={selectedArticle.title}
                className="object-cover size-full"
              />
            </div>
          )}
          <div className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
            {selectedArticle?.content}
          </div>
          <div className="flex justify-end pt-4 border-t border-border">
            <Button onClick={() => setSelectedArticle(null)}>Đóng</Button>
          </div>
        </div>
      </Modal>
    </PublicLayout>
  );
}
