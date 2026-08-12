import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Pencil, Trash2, Loader2, Save, Rocket, Image as ImageIcon, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Modal } from "@/components/ui/modal";
import { supabase } from "@/utils/supabase";

// Khai báo Route chuẩn khớp với tên file
export const Route = createFileRoute("/admin/manage-projects")({
  component: ProjectsManagementPage,
});

function ProjectsManagementPage() {
  const [projects, setProjects] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isModalOpen, setIsOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);

  const [formData, setFormData] = React.useState({
    title: "",
    year: "2025",
    excerpt: "",
    content: "",
    imageUrl: ""
  });

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("projects") // Gọi bảng projects
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setProjects(data || []);
    } catch (err: any) {
      toast.error("Lỗi tải danh sách: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => { fetchProjects(); }, []);

  // --- HÀM TẢI ẢNH LÊN BUCKET PROJECT-IMAGES ---
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsSubmitting(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `proj_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('project-images') // Kho ảnh riêng cho dự án
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('project-images').getPublicUrl(fileName);
      setFormData(prev => ({ ...prev, imageUrl: data.publicUrl }));
      toast.success("Đã tải ảnh lên!");
    } catch (error: any) {
      toast.error("Lỗi upload ảnh: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.content) {
      toast.error("Vui lòng điền đầy đủ tên và nội dung dự án.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingId) {
        const { error } = await supabase.from("projects").update(formData).eq("id", editingId);
        if (error) throw error;
        toast.success("Cập nhật dự án thành công!");
      } else {
        const { error } = await supabase.from("projects").insert([formData]);
        if (error) throw error;
        toast.success("Đã đăng dự án mới!");
      }
      setIsOpen(false);
      fetchProjects();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Xác nhận xóa dự án này?")) return;
    try {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
      toast.success("Đã xóa dự án.");
      fetchProjects();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-6 animate-fade-up text-left">
      <div className="flex justify-between items-center border-b pb-6">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tighter text-[#0f3d3e] flex items-center gap-2">
            <Rocket className="text-blue-600 size-6" /> Quản lý Dự án
          </h1>
          <p className="text-xs text-muted-foreground mt-1 font-medium italic">Công bố những dự án đột phá của HIEC HUST.</p>
        </div>
        
        {/* NÚT THÊM: ĐÃ SỬA CHỮ TRẮNG DỄ NHÌN */}
        <Button 
          onClick={() => { setEditingId(null); setFormData({title:"", year:"2025", excerpt:"", content:"", imageUrl:""}); setIsOpen(true); }} 
          className="rounded-full font-black uppercase tracking-widest px-8 py-6 bg-[#0f3d3e] text-white hover:bg-[#1a4d4f] shadow-lg shadow-blue-900/20 transition-all active:scale-95"
        >
          <Plus className="mr-2 h-5 w-5 text-cyan-400" /> 
          THÊM DỰ ÁN
        </Button>
      </div>

      <Card className="rounded-[2rem] border-none shadow-md overflow-hidden bg-white">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="font-bold pl-8 py-4 text-[#0f3d3e]">Ảnh bìa</TableHead>
                <TableHead className="font-bold text-[#0f3d3e]">Tên dự án</TableHead>
                <TableHead className="font-bold text-center text-[#0f3d3e]">Năm</TableHead>
                <TableHead className="text-right pr-8 font-bold text-[#0f3d3e]">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={4} className="text-center py-20"><Loader2 className="animate-spin mx-auto text-blue-600" /></TableCell></TableRow>
              ) : projects.map((p) => (
                <TableRow key={p.id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-50">
                  <TableCell className="pl-8">
                    <div className="size-14 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
                      <img src={p.imageUrl || "https://via.placeholder.com/150"} className="w-full h-full object-cover" alt="" />
                    </div>
                  </TableCell>
                  <TableCell className="font-bold text-[#1a2e35] uppercase tracking-tight text-sm">{p.title}</TableCell>
                  <TableCell className="text-center">
                    <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">{p.year}</span>
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => { setFormData(p); setEditingId(p.id); setIsOpen(true); }} className="rounded-xl hover:bg-blue-50 hover:text-blue-600">
                        <Pencil className="size-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)} className="rounded-xl hover:bg-red-50 hover:text-red-600">
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {projects.length === 0 && !loading && <p className="text-center py-20 text-slate-400 text-sm font-medium">Chưa có dự án nào được đăng tải.</p>}
        </CardContent>
      </Card>

      {/* MODAL THÊM/SỬA DỰ ÁN */}
      <Modal 
        open={isModalOpen} 
        onOpenChange={setIsOpen} 
        title={editingId ? "Cập nhật Dự án" : "Đăng dự án mới"}
        description="Điền thông tin chi tiết để dự án hiển thị trên trang Showcase."
      >
        <div className="space-y-4 py-4 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar">
          <div className="space-y-1 text-left">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Tên dự án chiến lược</label>
            <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="VD: Startup Bootcamp 2025..." className="rounded-xl bg-slate-50 border-none h-12 font-bold text-[#0f3d3e]" />
          </div>

          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Năm triển khai</label>
              <Input placeholder="2025" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} className="rounded-xl bg-slate-50 border-none h-12" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Tải ảnh dự án</label>
              <Input type="file" accept="image/*" onChange={handleFileUpload} className="rounded-xl bg-slate-50 border-none h-12 text-xs pt-3 cursor-pointer" />
            </div>
          </div>

          {formData.imageUrl && (
            <div className="relative aspect-video rounded-3xl overflow-hidden border-2 border-blue-100 shadow-xl group">
               <img src={formData.imageUrl} className="w-full h-full object-cover" alt="Preview" />
               <button type="button" onClick={() => setFormData({...formData, imageUrl: ""})} className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-full p-2 text-red-500 shadow-lg hover:bg-red-500 hover:text-white transition-all">
                 <X className="size-5" />
               </button>
            </div>
          )}

          <div className="space-y-1 text-left">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Mô tả ngắn (Danh sách)</label>
            <Textarea value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} placeholder="Viết 1-2 câu giới thiệu..." className="rounded-xl bg-slate-50 border-none min-h-[80px]" />
          </div>

          <div className="space-y-1 text-left">
            <label className="text-[10px] font-black uppercase text-blue-600 tracking-widest pl-1">Hành trình chi tiết</label>
            <Textarea value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} placeholder="Kể về dự án tại đây..." className="min-h-[200px] rounded-2xl bg-slate-50 border-none p-4" />
          </div>

        <Button 
            className="w-full py-8 font-black uppercase tracking-[0.2em] rounded-2xl text-white bg-[#0f3d3e] hover:bg-[#1a2e35] shadow-xl shadow-cyan-900/20 transition-all hover:scale-[1.01] active:scale-95 border-none mt-4" 
            onClick={handleSubmit} 
            disabled={isSubmitting}
        >
            {isSubmitting ? (
                <Loader2 className="animate-spin mr-2 h-5 w-5" />
            ) : (
                <Save className="mr-2 h-5 w-5 text-cyan-400" /> 
            )}
            {editingId ? "CẬP NHẬT DỰ ÁN" : "ĐĂNG DỰ ÁN LÊN WEB"}
        </Button>
        </div>
      </Modal>
    </div>
  );
}