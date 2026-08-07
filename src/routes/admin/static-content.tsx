import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FieldError } from "@/components/auth/field-error";
import { staticContentSchema, type StaticContentValues } from "@/lib/validators/post-validator";
import { contactInfo } from "@/services/hiec-service";

export const Route = createFileRoute("/admin/static-content")({
  head: () => ({
    meta: [
      { title: "Quản lý nội dung tĩnh — HIEC Admin" },
      {
        name: "description",
        content: "Cập nhật tiêu đề, slogan, văn bản giới thiệu và thông tin liên hệ của HIEC.",
      },
      { property: "og:title", content: "HIEC Admin — Nội dung tĩnh" },
      { property: "og:description", content: "Chỉnh sửa slogan, giới thiệu và liên hệ HIEC." },
    ],
  }),
  component: StaticContentPage,
});

function StaticContentPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<StaticContentValues>({
    resolver: zodResolver(staticContentSchema),
    mode: "onChange",
    defaultValues: {
      heroTitle: "Ý tưởng sinh viên, tác động thật",
      slogan: "Innovate. Collaborate. Impact.",
      intro:
        "HIEC là câu lạc bộ khởi nghiệp & đổi mới sáng tạo với hơn 1.000 thành viên, hoạt động trên 4 mảng chuyên môn.",
      email: contactInfo.email,
      phone: contactInfo.phone,
      address: contactInfo.address,
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Quản lý nội dung tĩnh</h1>
        <p className="text-sm text-muted-foreground">
          FDD 2.3 — tiêu đề, slogan, văn bản giới thiệu và thông tin liên hệ.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(() => toast.success("Đã cập nhật nội dung tĩnh"))}
        className="grid gap-6 lg:grid-cols-2"
        noValidate
      >
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg">Tiêu đề & slogan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="heroTitle">Tiêu đề banner</Label>
              <Input id="heroTitle" {...register("heroTitle")} />
              <FieldError message={errors.heroTitle?.message} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slogan">Slogan</Label>
              <Input id="slogan" {...register("slogan")} />
              <FieldError message={errors.slogan?.message} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="intro">Văn bản giới thiệu CLB</Label>
              <Textarea id="intro" rows={6} {...register("intro")} />
              <FieldError message={errors.intro?.message} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg">Thông tin liên hệ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" {...register("email")} />
              <FieldError message={errors.email?.message} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input id="phone" {...register("phone")} />
              <FieldError message={errors.phone?.message} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Địa chỉ</Label>
              <Input id="address" {...register("address")} />
              <FieldError message={errors.address?.message} />
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <Button type="submit" variant="shimmer" size="lg" disabled={!isValid}>
            Lưu nội dung
          </Button>
        </div>
      </form>
    </div>
  );
}
