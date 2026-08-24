import { createFileRoute } from "@tanstack/react-router";

import { PublicLayout } from "@/components/layout/public-layout";

export const Route = createFileRoute("/learning-resources")({
  head: () => ({
    meta: [
      { title: "Học liệu — HIEC HUST" },
      {
        name: "description",
        content: "Kho học liệu của Câu lạc bộ Khởi nghiệp & Đổi mới Sáng tạo HIEC.",
      },
    ],
  }),
  component: LearningResourcesPage,
});

function LearningResourcesPage() {
  return <PublicLayout>{/* Nội dung học liệu sẽ được bổ sung sau. */}</PublicLayout>;
}
