import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/member-layout")({
  head: () => ({
    meta: [
      { title: "Giao diện thành viên — HIEC Admin" },
      {
        name: "description",
        content: "Tùy chỉnh giao diện hiển thị thành viên trên website HIEC.",
      },
    ],
  }),
  component: MemberLayoutAdminPage,
});

function MemberLayoutAdminPage() {
  return (
    <div className="space-y-2">
      <h1 className="font-display text-2xl font-black tracking-tight">
        Giao diện thành viên
      </h1>
      <p className="text-sm text-muted-foreground">
        Mục này đang được chuẩn bị. Chưa có tính năng.
      </p>
    </div>
  );
}
