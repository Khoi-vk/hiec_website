import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Camera, Image as ImageIcon } from "lucide-react";

import { PublicLayout } from "@/components/layout/public-layout";
import { Card, CardContent } from "@/components/ui/card";
import { useClubStore, type GalleryImage } from "@/store/club-store";
import { Modal } from "@/components/ui/modal";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Thư viện ảnh HIEC — Hoạt động câu lạc bộ" },
      {
        name: "description",
        content: "Hình ảnh hoạt động, sự kiện, các buổi workshop và khoảnh khắc đáng nhớ của các thành viên HIEC.",
      },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const { images } = useClubStore();
  const [selectedImage, setSelectedImage] = React.useState<GalleryImage | null>(null);

  return (
    <PublicLayout>
      <section className="bg-gradient-hero py-16">
        <div className="mx-auto w-full max-w-6xl px-4">
          <h1 className="font-display text-4xl font-extrabold text-primary-foreground sm:text-5xl">
            Thư viện ảnh
          </h1>
          <p className="mt-4 max-w-2xl text-primary-foreground/85">
            Những khoảnh khắc đáng nhớ trong các chương trình huấn luyện, ngày hội đổi mới sáng tạo, workshop chuyên môn và các buổi teambuilding gắn kết của HIEC.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-14">
        {images.length === 0 ? (
          <div className="text-center text-muted-foreground py-16 flex flex-col items-center justify-center gap-3">
            <ImageIcon className="size-12 text-muted-foreground/55" />
            <p>Thư viện ảnh đang trống. Các khoảnh khắc sẽ sớm được cập nhật!</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {images.map((img) => (
              <Card
                key={img.id}
                className="group overflow-hidden border-border/70 hover:shadow-elevated transition-all cursor-pointer bg-card"
                onClick={() => setSelectedImage(img)}
              >
                <CardContent className="p-0">
                  <div className="aspect-square w-full overflow-hidden bg-muted relative">
                    <img
                      src={img.url}
                      alt={img.caption}
                      className="object-cover size-full group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <p className="text-xs text-white line-clamp-2 font-medium">{img.caption}</p>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-muted-foreground mb-1">{img.uploadedAt}</p>
                    <p className="text-sm font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                      {img.caption}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Lightbox / Zoom Dialog */}
      <Modal
        open={!!selectedImage}
        onOpenChange={(open) => !open && setSelectedImage(null)}
        title="Chi tiết hình ảnh"
        description={`Đăng ngày: ${selectedImage?.uploadedAt ?? ""}`}
      >
        <div className="space-y-4 mt-4">
          {selectedImage && (
            <div className="overflow-hidden rounded-lg bg-black flex items-center justify-center max-h-[60vh]">
              <img
                src={selectedImage.url}
                alt={selectedImage.caption}
                className="object-contain max-h-[60vh] w-full"
              />
            </div>
          )}
          <p className="text-sm font-medium text-foreground text-center">
            {selectedImage?.caption}
          </p>
        </div>
      </Modal>
    </PublicLayout>
  );
}
