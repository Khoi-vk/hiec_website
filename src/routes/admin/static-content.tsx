import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useForm, useFieldArray } from "react-hook-form";
import { Save, Layout, History, Users, Contact, BarChart3, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getHomeContent, updateHomeContent, type HomeContent } from "@/services/hiec-service";

export const Route = createFileRoute("/admin/static-content")({
  component: StaticContentPage,
});

function StaticContentPage() {
  const [loading, setLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);

  const { register, control, handleSubmit, reset } = useForm<HomeContent>();

  const { fields: statFields } = useFieldArray({ control, name: "stats" });
  const { fields: historyFields } = useFieldArray({ control, name: "history" });
  const { fields: deptFields } = useFieldArray({ control, name: "departments" });

  React.useEffect(() => {
    let isMounted = true;
    getHomeContent()
      .then((res) => {
        if (!isMounted) return;
        const safeData = {
          ...res,
          hero: {
            title: res?.hero?.title || "",
            description: res?.hero?.description || "",
          },
          cta: {
            title: res?.cta?.title || "",
            description: res?.cta?.description || "",
          },
          contact: {
            email: res?.contact?.email || "",
            phone: res?.contact?.phone || "",
            messenger: res?.contact?.messenger || "",
            address: res?.contact?.address || "",
          },
        };
        reset(safeData);
      })
      .catch(() => {
        toast.error("Không thể tải dữ liệu trang chủ");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [reset]);

  const onSubmit = async (values: HomeContent) => {
    setIsSaving(true);
    try {
      await updateHomeContent(values);
      toast.success("Đã cập nhật trang chủ thành công!");
    } catch (error) {
      toast.error("Lỗi khi lưu dữ liệu");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-up font-sans text-left pb-20 text-foreground">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Chỉnh sửa Trang chủ
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Nội dung tự động đồng bộ với giao diện người dùng.
          </p>
        </div>
        <Button
          onClick={handleSubmit(onSubmit)}
          disabled={isSaving}
          className="rounded-xl px-8 py-6 font-black uppercase text-xs cursor-pointer shadow-sm"
        >
          {isSaving ? <RefreshCw className="mr-2 size-4 animate-spin" /> : <Save className="mr-2 size-4" />}
          Lưu thay đổi
        </Button>
      </div>

      <Tabs defaultValue="hero" className="w-full">
        <TabsList className="bg-muted border border-border p-1 h-auto grid grid-cols-2 md:grid-cols-5 rounded-2xl mb-8">
          <TabsTrigger value="hero" className="rounded-xl py-3 cursor-pointer">
            <Layout className="size-4 mr-2" /> Hero
          </TabsTrigger>
          <TabsTrigger value="stats" className="rounded-xl py-3 cursor-pointer">
            <BarChart3 className="size-4 mr-2" /> Stats
          </TabsTrigger>
          <TabsTrigger value="history" className="rounded-xl py-3 cursor-pointer">
            <History className="size-4 mr-2" /> Lịch sử
          </TabsTrigger>
          <TabsTrigger value="depts" className="rounded-xl py-3 cursor-pointer">
            <Users className="size-4 mr-2" /> Ban
          </TabsTrigger>
          <TabsTrigger value="contact" className="rounded-xl py-3 cursor-pointer">
            <Contact className="size-4 mr-2" /> Liên hệ
          </TabsTrigger>
        </TabsList>

        {/* TAB HERO & CTA */}
        <TabsContent value="hero" className="space-y-6">
          <Card className="rounded-[2rem] border-border shadow-sm overflow-hidden bg-card">
            <CardHeader className="border-b border-border bg-muted/30">
              <CardTitle className="font-bold text-foreground">Giới thiệu & Kêu gọi (Hero / CTA)</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-2">
                <Label className="text-muted-foreground font-semibold text-xs tracking-wider uppercase">
                  Tiêu đề chính (Hero Title)
                </Label>
                <Input
                  {...register("hero.title")}
                  placeholder="Khởi nguồn sáng tạo, Dẫn lối thành công"
                  className="rounded-xl border-border bg-background text-foreground placeholder:text-muted-foreground/60 h-12 font-bold"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground font-semibold text-xs tracking-wider uppercase">
                  Mô tả giới thiệu (Hero Description)
                </Label>
                <Textarea
                  {...register("hero.description")}
                  placeholder="Câu lạc bộ Sáng tạo & Khởi nghiệp HUST..."
                  className="rounded-xl border-border bg-background text-foreground placeholder:text-muted-foreground/60 min-h-[100px]"
                />
              </div>

              <div className="pt-6 border-t border-border space-y-6">
                <div className="space-y-2">
                  <Label className="text-foreground font-semibold text-xs tracking-wider uppercase">
                    Tiêu đề CTA (Cuối trang)
                  </Label>
                  <Input
                    {...register("cta.title")}
                    placeholder="Ý tưởng thành tiền thật - Gia nhập HIEC ngay!"
                    className="rounded-xl border-border bg-background text-foreground placeholder:text-muted-foreground/60 h-12 font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground font-semibold text-xs tracking-wider uppercase">
                    Mô tả CTA
                  </Label>
                  <Textarea
                    {...register("cta.description")}
                    placeholder="Nếu bạn muốn thử sức trong một môi trường nhiều năng lượng..."
                    className="rounded-xl border-border bg-background text-foreground placeholder:text-muted-foreground/60"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB STATS */}
        <TabsContent value="stats">
          <Card className="rounded-[2rem] border-border shadow-sm bg-card p-8 grid md:grid-cols-2 gap-6">
            {statFields.map((field, i) => (
              <div key={field.id} className="p-5 bg-muted/30 rounded-2xl space-y-3 border border-border">
                <Label className="text-muted-foreground font-semibold text-xs tracking-wider uppercase">Thông số {i + 1}</Label>
                <Input
                  {...register(`stats.${i}.number`)}
                  placeholder="Con số"
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground/60 h-11 font-bold"
                />
                <Input
                  {...register(`stats.${i}.label`)}
                  placeholder="Nhãn"
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground/60 h-11"
                />
              </div>
            ))}
          </Card>
        </TabsContent>

        {/* TAB HISTORY */}
        <TabsContent value="history">
          <Card className="rounded-[2rem] border-border shadow-sm bg-card p-8 space-y-4">
            {historyFields.map((field, i) => (
              <div key={field.id} className="grid md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-2xl border border-border">
                <Input
                  {...register(`history.${i}.year`)}
                  placeholder="Năm"
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground/60 font-bold"
                />
                <div className="md:col-span-3 space-y-2">
                  <Input
                    {...register(`history.${i}.title`)}
                    placeholder="Tiêu đề"
                    className="bg-background border-border text-foreground placeholder:text-muted-foreground/60 font-bold"
                  />
                  <Textarea
                    {...register(`history.${i}.description`)}
                    placeholder="Mô tả sự kiện"
                    className="bg-background border-border text-foreground placeholder:text-muted-foreground/60 text-sm"
                  />
                </div>
              </div>
            ))}
          </Card>
        </TabsContent>

        {/* TAB DEPTS */}
        <TabsContent value="depts">
          <div className="grid md:grid-cols-2 gap-6">
            {deptFields.map((field, i) => (
              <Card key={field.id} className="rounded-[2rem] border-border shadow-sm bg-card overflow-hidden">
                <CardHeader className="bg-muted/50 border-b border-border">
                  <CardTitle className="font-bold tracking-widest text-sm text-foreground">
                    BAN {field.code}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-3">
                  <div className="space-y-1">
                    <Label className="text-muted-foreground font-semibold text-xs tracking-wider uppercase">Tên ban</Label>
                    <Input
                      {...register(`departments.${i}.title`)}
                      className="bg-background border-border text-foreground placeholder:text-muted-foreground/60 font-bold h-11"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground font-semibold text-xs tracking-wider uppercase">Mô tả</Label>
                    <Textarea
                      {...register(`departments.${i}.text`)}
                      className="bg-background border-border text-foreground placeholder:text-muted-foreground/60 text-sm"
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* TAB CONTACT */}
        <TabsContent value="contact">
          <Card className="rounded-[2rem] border-border shadow-sm bg-card overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border">
              <CardTitle className="font-bold text-foreground">Thông tin liên hệ</CardTitle>
              <CardDescription>Cập nhật email và các kênh kết nối chính thức.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-foreground font-semibold text-xs">Email</Label>
                <Input {...register("contact.email")} className="bg-background border-border text-foreground placeholder:text-muted-foreground/60 h-11" />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground font-semibold text-xs">SĐT</Label>
                <Input {...register("contact.phone")} className="bg-background border-border text-foreground placeholder:text-muted-foreground/60 h-11" />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground font-semibold text-xs">Messenger</Label>
                <Input {...register("contact.messenger")} className="bg-background border-border text-foreground placeholder:text-muted-foreground/60 h-11" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="text-foreground font-semibold text-xs">Địa chỉ</Label>
                <Input {...register("contact.address")} className="bg-background border-border text-foreground placeholder:text-muted-foreground/60 h-11" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}