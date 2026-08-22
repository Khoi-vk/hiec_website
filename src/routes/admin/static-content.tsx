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

export const Route = createFileRoute("/admin/static-content" as any)({
  component: StaticContentPage,
});

function StaticContentPage() {
  const [loading, setLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);

  const { register, control, handleSubmit, reset } = useForm<HomeContent>();
  
  // Ép kiểu name sang any để tránh lỗi lồng cấp phức tạp của TS
  const { fields: statFields } = useFieldArray({ control, name: "stats" as any });
  const { fields: historyFields } = useFieldArray({ control, name: "history" as any });
  const { fields: deptFields } = useFieldArray({ control, name: "departments" as any });

  React.useEffect(() => {
  getHomeContent().then((res) => {
    const safeData = {
      ...res,
      // Đảm bảo object contact luôn tồn tại để không bị lỗi 
      contact: {
        email: res?.contact?.email || "",
        phone: res?.contact?.phone || "",
        messenger: res?.contact?.messenger || "",
        address: res?.contact?.address || "",
      }
    };
    reset(safeData);
    setLoading(false);
  });
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

  if (loading) return <div className="flex h-[400px] w-full items-center justify-center"><Loader2 className="size-8 animate-spin text-cyan-500" /></div>;

  return (
    <div className="space-y-8 animate-fade-up font-sans text-left pb-20">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-6">
        <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">Chỉnh sửa Trang chủ</h1>
        <Button onClick={handleSubmit(onSubmit)} disabled={isSaving} variant="shimmer" className="rounded-xl px-8 py-6 font-black uppercase text-xs cursor-pointer">
          {isSaving ? <RefreshCw className="mr-2 size-4 animate-spin" /> : <Save className="mr-2 size-4" />}
          Lưu thay đổi
        </Button>
      </div>

      <Tabs defaultValue="hero">
        <TabsList className="bg-[#020817] border border-white/5 p-1 h-auto grid grid-cols-2 md:grid-cols-5 rounded-2xl mb-8">
          <TabsTrigger value="hero" className="rounded-xl py-3 cursor-pointer"><Layout className="size-4 mr-2" /> Hero</TabsTrigger>
          <TabsTrigger value="stats" className="rounded-xl py-3 cursor-pointer"><BarChart3 className="size-4 mr-2" /> Stats</TabsTrigger>
          <TabsTrigger value="history" className="rounded-xl py-3 cursor-pointer"><History className="size-4 mr-2" /> Lịch sử</TabsTrigger>
          <TabsTrigger value="depts" className="rounded-xl py-3 cursor-pointer"><Users className="size-4 mr-2" /> Ban</TabsTrigger>
          <TabsTrigger value="contact" className="rounded-xl py-3 cursor-pointer"><Contact className="size-4 mr-2" /> Liên hệ</TabsTrigger>
        </TabsList>

        <TabsContent value="contact">
          <Card className="rounded-[2rem] border-border shadow-md overflow-hidden">
            <CardContent className="p-8 grid md:grid-cols-2 gap-6">
              <div className="space-y-2 text-left">
                <Label className="font-bold">Email</Label>
                <Input {...register("contact.email")} className="rounded-xl border-border bg-slate-50" />
              </div>
              <div className="space-y-2 text-left">
                <Label className="font-bold">Số điện thoại</Label>
                <Input {...register("contact.phone")} className="rounded-xl border-border bg-slate-50" />
              </div>
              <div className="space-y-2 text-left">
                <Label className="font-bold">Messenger Link</Label>
                <Input {...register("contact.messenger")} className="rounded-xl border-border bg-slate-50" />
              </div>
              <div className="space-y-2 md:col-span-2 text-left">
                <Label className="font-bold">Địa chỉ</Label>
                <Input {...register("contact.address")} className="rounded-xl border-border bg-slate-50" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <Card className="bg-[#020817]/50 border-white/5 text-white rounded-3xl p-8 grid md:grid-cols-2 gap-6">
            {statFields.map((field, i) => (
              <div key={field.id} className="p-4 bg-white/5 rounded-2xl space-y-3 border border-white/5">
                <Label className="text-[10px] uppercase text-cyan-500 font-black">Thông số {i + 1}</Label>
                <Input {...register(`stats.${i}.number` as any)} placeholder="Con số" className="bg-[#020817]" />
                <Input {...register(`stats.${i}.label` as any)} placeholder="Nhãn" className="bg-[#020817]" />
              </div>
            ))}
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card className="bg-[#020817]/50 border-white/5 text-white rounded-3xl p-8 space-y-4">
            {historyFields.map((field, i) => (
              <div key={field.id} className="grid grid-cols-4 gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                <Input {...register(`history.${i}.year` as any)} className="bg-[#020817] font-bold text-cyan-400" />
                <div className="col-span-3 space-y-2">
                  <Input {...register(`history.${i}.title` as any)} className="bg-[#020817] font-bold" />
                  <Textarea {...register(`history.${i}.description` as any)} className="bg-[#020817] text-sm" />
                </div>
              </div>
            ))}
          </Card>
        </TabsContent>

        <TabsContent value="depts">
          <div className="grid md:grid-cols-2 gap-6">
            {deptFields.map((field, i) => (
              <Card key={field.id} className="bg-[#020817]/50 border-white/5 text-white rounded-3xl overflow-hidden">
                {/* FIX LỖI TẠI ĐÂY: Dùng (field as any).code */}
                <CardHeader className="bg-white/5"><CardTitle className="text-cyan-500 font-black tracking-widest text-sm italic">BAN {(field as any).code}</CardTitle></CardHeader>
                <CardContent className="p-6 space-y-3">
                  <div className="space-y-1">
                    <Label className="text-[10px] text-slate-500 uppercase font-bold">Tên ban</Label>
                    <Input {...register(`departments.${i}.title` as any)} className="bg-[#020817] font-bold" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] text-slate-500 uppercase font-bold">Mô tả</Label>
                    <Textarea {...register(`departments.${i}.text` as any)} className="bg-[#020817] text-sm" rows={4} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="contact">
          <Card className="bg-[#020817]/50 border-white/5 text-white rounded-3xl p-8 grid md:grid-cols-2 gap-6">
            <div className="space-y-2"><Label>Email</Label><Input {...register("contact.email" as any)} className="bg-white/5 border-white/10" /></div>
            <div className="space-y-2"><Label>SĐT</Label><Input {...register("contact.phone" as any)} className="bg-white/5 border-white/10" /></div>
            <div className="space-y-2"><Label>Messenger</Label><Input {...register("contact.messenger" as any)} className="bg-white/5 border-white/10" /></div>
            <div className="space-y-2 md:col-span-2"><Label>Địa chỉ</Label><Input {...register("contact.address" as any)} className="bg-white/5 border-white/10" /></div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}