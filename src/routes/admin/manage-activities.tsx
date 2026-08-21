import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Pencil, Trash2, Loader2, Save, Image as ImageIcon, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Modal } from "@/components/ui/modal";
import { supabase } from "@/utils/supabase";

export const Route = createFileRoute("/admin/manage-activities")({
  component: AdminManageActivitiesPage,
});

  const activityStatuses = [
    {
      value: "draft",
      label: "Bản nháp",
    },
    {
      value: "published",
      label: "Công khai",
    },
    {
      value: "cancelled",
      label: "Đã huỷ",
    },
  ] as const;
  
  const activityTags = [
    "HIEC News",
    "Workshop",
    "Training",
    "Event",
    "Startup",
    "Community",
  ]; // Đây là các tag hoạt động ví dụ thôi nha ae, sau có hoạt động cụ thể như nào thì sửa ở đây nha

function AdminManageActivitiesPage() {
  const [acts, setActs] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isModalOpen, setIsOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);

  // Form chứa cả link ảnh
  const [formData, setFormData] = React.useState({
    title: "",
    date: "",
    event_date: "",
    excerpt: "",
    content: "",
    imageUrl: "",
    tags: [] as string[],
    status: "draft",
  });

  const fetchActs = async () => {
    setLoading(true);
    const { data } = await supabase.from("activities").select("*").order("created_at", { ascending: false });
    if (data) setActs(data);
    setLoading(false);
  };

  React.useEffect(() => { fetchActs(); }, []);

  // --- HÀM TẢI ẢNH LÊN KHI CHỌN FILE ---
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsSubmitting(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;

      // 1. Đẩy file lên bucket 'activity-images'
      const { error: uploadError } = await supabase.storage
        .from('activity-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // 2. Lấy link ảnh công khai
      const { data } = supabase.storage.from('activity-images').getPublicUrl(fileName);
      
      // 3. Cập nhật vào form để hiện Preview
      setFormData(prev => ({ ...prev, imageUrl: data.publicUrl }));
      toast.success("Đã tải ảnh lên thành công!");
    } catch (error: any) {
      toast.error("Lỗi tải ảnh: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.title) return toast.error("Vui lòng nhập tiêu đề");
    setIsSubmitting(true);
    try {
      const { error } = editingId 
        ? await supabase.from("activities").update(formData).eq("id", editingId)
        : await supabase.from("activities").insert([formData]);
      
      if (error) throw error;
      toast.success("Thành công!");
      setIsOpen(false);
      fetchActs();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Xác nhận xóa bài viết này?")) return;

    try {
      const { error } = await supabase
        .from("activities")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("Đã xóa bài viết.");
      fetchActs();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-6 text-left animate-fade-up">
      <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4 transition-colors">
        <h1 className="text-2xl font-black uppercase tracking-tighter text-[#0f3d3e] dark:text-white transition-colors">Quản lý Hoạt động</h1>
        <Button onClick={() => { setEditingId(null); setFormData({title:"", date:"", excerpt:"", content:"", imageUrl:""}); setIsOpen(true); }} className="rounded-xl font-bold bg-cyan-600 dark:bg-cyan-700 hover:bg-cyan-700 dark:hover:bg-cyan-600 text-white transition-colors">
          <Plus className="mr-2 h-4 w-4" /> ĐĂNG BÀI MỚI
        </Button>
      </div>

      {/* BẢNG DANH SÁCH CÓ HIỆN ẢNH NHỎ */}
      <Card className="rounded-[2rem] border-none shadow-md overflow-hidden bg-white dark:bg-slate-900 transition-colors">
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-slate-950/50 transition-colors">
            <TableRow className="border-none">
              <TableHead className="font-bold pl-8 text-slate-700 dark:text-slate-300">Ảnh</TableHead>
              <TableHead className="font-bold text-slate-700 dark:text-slate-300">Tiêu đề</TableHead>
              <TableHead className="font-bold text-center text-slate-700 dark:text-slate-300">Ngày</TableHead>
              <TableHead className="text-right pr-8 font-bold text-slate-700 dark:text-slate-300">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {acts.map((a) => (
              <TableRow key={a.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800/50 last:border-0 transition-colors">
                <TableCell className="pl-8 py-4">
                  <div className="size-12 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 transition-colors">
                    <img src={a.imageUrl || "https://via.placeholder.com/150"} className="w-full h-full object-cover" />
                  </div>
                </TableCell>
                <TableCell className="font-bold text-[#0f3d3e] dark:text-slate-100 transition-colors">{a.title}</TableCell>
                <TableCell className="text-center text-slate-600 dark:text-slate-400 transition-colors">{a.date}</TableCell>
                <TableCell className="text-right pr-8">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setFormData(a);
                        setEditingId(a.id);
                        setIsOpen(true);
                      }}
                      className="rounded-xl text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                    >
                      <Pencil className="size-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(a.id)}
                      className="rounded-xl text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition-all"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* MODAL CÓ MỤC THÊM ẢNH */}
      <Modal open={isModalOpen} onOpenChange={setIsOpen} title={editingId ? "Sửa bài viết" : "Đăng bài mới"}>
        <div className="space-y-4 py-4 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar text-left">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 transition-colors">Tiêu đề hoạt động</label>
            <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 transition-colors" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 transition-colors">Ngày diễn ra</label>
              <Input placeholder="VD: 19/11/2025" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-colors" />
            </div>
            
            {/* NÚT THÊM ẢNH */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 transition-colors">Ảnh bài viết</label>
              <Input type="file" accept="image/*" onChange={handleFileUpload} className="rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 cursor-pointer transition-colors" />
            </div>
          </div>

          // Thêm chọn Tag vào form Admin
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400">
              Chuyên mục / Tag
            </label>
          
            <div className="flex flex-wrap gap-2">
              {activityTags.map((tag) => {
                const checked = formData.tags.includes(tag);
          
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        tags: checked
                          ? prev.tags.filter((item) => item !== tag)
                          : [...prev.tags, tag],
                      }));
                    }}
                    className={`rounded-full px-3 py-1.5 text-xs font-bold transition-all ${
                      checked
                        ? "bg-cyan-600 text-white"
                        : "bg-slate-100 text-slate-500 hover:bg-cyan-50"
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          
            <p className="text-[10px] text-slate-400">
              Có thể chọn nhiều chuyên mục.
            </p>
          </div>

          // Thêm trạng thái bài viết
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400">
              Trạng thái bài viết
            </label>
          
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  status: e.target.value,
                }))
              }
              className="w-full h-11 rounded-xl bg-slate-50 border-none px-3 text-sm font-bold"
            >
              {activityStatuses.map((status) => (
                <option
                  key={status.value}
                  value={status.value}
                >
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          {/* HIỂN THỊ ẢNH XEM TRƯỚC (PREVIEW) */}
          {formData.imageUrl && (
            <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-cyan-100 dark:border-cyan-900/50 shadow-sm transition-colors">
               <img src={formData.imageUrl} className="w-full h-full object-cover" />
               <button 
                 type="button" 
                 onClick={() => setFormData({...formData, imageUrl: ""})}
                 className="absolute top-2 right-2 bg-white/80 dark:bg-slate-900/80 rounded-full p-1 text-red-500 dark:text-red-400 shadow-md transition-colors hover:bg-white dark:hover:bg-slate-900"
               >
                 <X className="size-4" />
               </button>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 transition-colors">Mô tả ngắn</label>
            <Textarea value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} className="rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 transition-colors" />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-cyan-600 dark:text-cyan-400 transition-colors">Nội dung chi tiết</label>
            <Textarea value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="min-h-[150px] rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 transition-colors" />
          </div>

          <Button 
            className="w-full py-6 font-bold uppercase tracking-widest bg-cyan-600 dark:bg-cyan-700 hover:bg-cyan-700 dark:hover:bg-cyan-600 text-white transition-colors mt-2" 
            onClick={handleSubmit} 
            disabled={isSubmitting} 
            variant="default" // Tôi chuyển về default để nút dùng các màu custom bên trên nhé
          >
            {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2 h-4 w-4" />}
            Lưu bài viết
          </Button>
        </div>
      </Modal>
    </div>
  );
}
