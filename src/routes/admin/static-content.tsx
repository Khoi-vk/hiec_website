import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useForm, useFieldArray } from "react-hook-form";
import { Save, Layout, History, Users, Contact, BarChart3, Loader2, RefreshCw, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  defaultHomeContent,
  getHomeContent,
  updateHomeContent,
  type HomeContent,
} from "@/services/hiec-service";

export const Route = createFileRoute("/admin/static-content")({
  component: StaticContentPage,
});

function StaticContentPage() {
  const [loading, setLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);

  const { register, control, handleSubmit, reset } = useForm<HomeContent>();

  const { fields: statFields, append: appendStat, remove: removeStat } = useFieldArray({ control, name: "stats" });
  const { fields: historyFields, append: appendHistory, remove: removeHistory } = useFieldArray({ control, name: "history" });
  const { fields: deptFields, append: appendDept, remove: removeDept } = useFieldArray({ control, name: "departments" });

  React.useEffect(() => {
    let isMounted = true;
    getHomeContent()
      .then((res) => {
        if (!isMounted) return;
        const safeData: HomeContent = {
          ...defaultHomeContent,
          ...res,
          hero: {
            ...defaultHomeContent.hero,
            ...res?.hero,
          },
          historySection: {
            ...defaultHomeContent.historySection,
            ...res?.historySection,
          },
          deptSection: {
            ...defaultHomeContent.deptSection,
            ...res?.deptSection,
          },
          actionSection: {
            ...defaultHomeContent.actionSection,
            ...res?.actionSection,
          },
          stats: res?.stats?.length ? res.stats : defaultHomeContent.stats,
          history: res?.history?.length ? res.history : defaultHomeContent.history,
          departments: res?.departments?.length ? res.departments : defaultHomeContent.departments,
          cta: {
            ...defaultHomeContent.cta,
            ...res?.cta,
          },
          contact: {
            ...defaultHomeContent.contact,
            ...res?.contact,
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
        <TabsList className="bg-muted border border-border p-1 h-auto grid grid-cols-2 md:grid-cols-6 rounded-2xl mb-8">
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
          <TabsTrigger value="action" className="rounded-xl py-3 cursor-pointer">
            Hoạt động
          </TabsTrigger>
          <TabsTrigger value="contact" className="rounded-xl py-3 cursor-pointer">
            <Contact className="size-4 mr-2" /> CTA & Liên hệ
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
                  Badge Hero
                </Label>
                <Input
                  {...register("hero.badge")}
                  placeholder="Nhãn giới thiệu"
                  className="rounded-xl border-border bg-background text-foreground placeholder:text-muted-foreground/60 h-12"
                />
              </div>
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
              <div className="grid gap-6 border-t border-border pt-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-foreground font-semibold text-xs tracking-wider uppercase">
                    Nội dung nút chính
                  </Label>
                  <Input
                    {...register("hero.primaryBtnText")}
                    placeholder="Nội dung nút chính"
                    className="rounded-xl border-border bg-background text-foreground placeholder:text-muted-foreground/60 h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground font-semibold text-xs tracking-wider uppercase">
                    Nội dung nút phụ
                  </Label>
                  <Input
                    {...register("hero.secondaryBtnText")}
                    placeholder="Nội dung nút phụ"
                    className="rounded-xl border-border bg-background text-foreground placeholder:text-muted-foreground/60 h-12"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB STATS */}
        <TabsContent value="stats">
          <Card className="rounded-[2rem] border-border shadow-sm bg-card">
            <CardHeader className="flex-row items-center justify-between border-b border-border">
              <CardTitle className="font-bold text-foreground">Thông số</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendStat({ number: "", label: "" })}
              >
                <Plus className="mr-1.5 size-4" /> Thêm thông số
              </Button>
            </CardHeader>
            <CardContent className="grid gap-6 p-8 md:grid-cols-2">
              {statFields.map((field, i) => (
                <div key={field.id} className="space-y-3 rounded-2xl border border-border bg-muted/30 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <Label className="text-muted-foreground font-semibold text-xs tracking-wider uppercase">Thông số {i + 1}</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeStat(i)}
                      className="size-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      aria-label={`Xóa thông số ${i + 1}`}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
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
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB HISTORY */}
        <TabsContent value="history">
          <Card className="rounded-[2rem] border-border shadow-sm bg-card">
            <CardHeader className="flex-row items-center justify-between border-b border-border">
              <CardTitle className="font-bold text-foreground">Mốc lịch sử</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendHistory({ year: "", title: "", description: "" })}
              >
                <Plus className="mr-1.5 size-4" /> Thêm mốc mới
              </Button>
            </CardHeader>
            <CardContent className="space-y-4 p-8">
              <div className="grid gap-6 border-b border-border pb-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-muted-foreground font-semibold text-xs tracking-wider uppercase">Badge Lịch sử</Label>
                  <Input {...register("historySection.badge")} className="bg-background border-border text-foreground placeholder:text-muted-foreground/60" />
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground font-semibold text-xs tracking-wider uppercase">Tiêu đề Section</Label>
                  <Input {...register("historySection.title")} className="bg-background border-border text-foreground placeholder:text-muted-foreground/60" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-muted-foreground font-semibold text-xs tracking-wider uppercase">Mô tả Section</Label>
                  <Textarea {...register("historySection.description")} className="bg-background border-border text-foreground placeholder:text-muted-foreground/60" />
                </div>
              </div>
              {historyFields.map((field, i) => (
                <div key={field.id} className="relative grid gap-4 rounded-2xl border border-border bg-muted/30 p-4 md:grid-cols-4">
                  <Input
                    {...register(`history.${i}.year`)}
                    placeholder="Năm"
                    className="bg-background border-border text-foreground placeholder:text-muted-foreground/60 font-bold"
                  />
                  <div className="space-y-2 md:col-span-3 md:pr-10">
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
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeHistory(i)}
                    className="absolute right-3 top-3 size-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    aria-label={`Xóa mốc lịch sử ${i + 1}`}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB DEPTS */}
        <TabsContent value="depts">
          <div className="space-y-6">
            <Card className="rounded-[2rem] border-border shadow-sm bg-card">
              <CardHeader className="flex-row items-center justify-between border-b border-border">
                <CardTitle className="font-bold text-foreground">Thông tin phòng ban</CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendDept({ code: `BAN_${deptFields.length + 1}`, title: "", text: "" })}
                >
                  <Plus className="mr-1.5 size-4" /> Thêm phòng ban mới
                </Button>
              </CardHeader>
              <CardContent className="p-8">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-muted-foreground font-semibold text-xs tracking-wider uppercase">Badge Phòng ban</Label>
                  <Input {...register("deptSection.badge")} className="bg-background border-border text-foreground placeholder:text-muted-foreground/60" />
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground font-semibold text-xs tracking-wider uppercase">Tiêu đề Section</Label>
                  <Input {...register("deptSection.title")} className="bg-background border-border text-foreground placeholder:text-muted-foreground/60" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-muted-foreground font-semibold text-xs tracking-wider uppercase">Mô tả Section</Label>
                  <Textarea {...register("deptSection.description")} className="bg-background border-border text-foreground placeholder:text-muted-foreground/60" />
                </div>
              </div>
              </CardContent>
            </Card>
            <div className="grid md:grid-cols-2 gap-6">
            {deptFields.map((field, i) => (
              <Card key={field.id} className="rounded-[2rem] border-border shadow-sm bg-card overflow-hidden">
                <CardHeader className="flex-row items-center justify-between bg-muted/50 border-b border-border">
                  <CardTitle className="font-bold tracking-widest text-sm text-foreground">
                    BAN {i + 1}
                  </CardTitle>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeDept(i)}
                    className="size-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    aria-label={`Xóa phòng ban ${i + 1}`}
                  >
                    <Trash2 className="size-4" />
                  </Button>
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
          </div>
        </TabsContent>

        {/* TAB ACTION */}
        <TabsContent value="action">
          <Card className="rounded-[2rem] border-border shadow-sm bg-card p-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-muted-foreground font-semibold text-xs tracking-wider uppercase">Badge Hoạt động</Label>
                <Input {...register("actionSection.badge")} className="bg-background border-border text-foreground placeholder:text-muted-foreground/60" />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground font-semibold text-xs tracking-wider uppercase">Tiêu đề Section</Label>
                <Input {...register("actionSection.title")} className="bg-background border-border text-foreground placeholder:text-muted-foreground/60" />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground font-semibold text-xs tracking-wider uppercase">Link hoạt động</Label>
                <Input {...register("actionSection.allActivitiesText")} className="bg-background border-border text-foreground placeholder:text-muted-foreground/60" />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground font-semibold text-xs tracking-wider uppercase">Link dự án</Label>
                <Input {...register("actionSection.allProjectsText")} className="bg-background border-border text-foreground placeholder:text-muted-foreground/60" />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* TAB CONTACT */}
        <TabsContent value="contact">
          <div className="space-y-6">
            <Card className="rounded-[2rem] border-border shadow-sm bg-card overflow-hidden">
              <CardHeader className="bg-muted/30 border-b border-border">
                <CardTitle className="font-bold text-foreground">CTA cuối trang</CardTitle>
              </CardHeader>
              <CardContent className="p-8 grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-foreground font-semibold text-xs">Tagline</Label>
                  <Input {...register("cta.tagline")} className="bg-background border-border text-foreground placeholder:text-muted-foreground/60" />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground font-semibold text-xs">Tiêu đề</Label>
                  <Input {...register("cta.title")} className="bg-background border-border text-foreground placeholder:text-muted-foreground/60" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-foreground font-semibold text-xs">Mô tả</Label>
                  <Textarea {...register("cta.description")} className="bg-background border-border text-foreground placeholder:text-muted-foreground/60" />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground font-semibold text-xs">Nội dung nút chính</Label>
                  <Input {...register("cta.primaryBtnText")} className="bg-background border-border text-foreground placeholder:text-muted-foreground/60" />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground font-semibold text-xs">Nội dung nút phụ</Label>
                  <Input {...register("cta.secondaryBtnText")} className="bg-background border-border text-foreground placeholder:text-muted-foreground/60" />
                </div>
              </CardContent>
            </Card>
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
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}