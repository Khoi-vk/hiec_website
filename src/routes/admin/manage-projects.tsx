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
    imageUrl: "",
    status: "draft",
    generation: "",
    is_featured: false,
  });

  const [fields, setFields] = React.useState<any[]>([]);
  const [selectedFields, setSelectedFields] = React.useState<string[]>([]);
  const [newField, setNewField] = React.useState("");
  const [isAddingField, setIsAddingField] = React.useState(false);

  const fetchFields = async () => {
    const { data, error } = await supabase
      .from("project_fields")
      .select("id, name")
      .order("name", { ascending: true });
  
    if (error) {
      console.error("Lỗi lấy lĩnh vực:", error);
      return;
    }
  
    setFields(data ?? []);
  };

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

  React.useEffect(() => {
    fetchProjects();
    fetchFields();
  }, []);

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
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error("Vui lòng điền đầy đủ tên và nội dung dự án.");
      return;
    }
  
    if (!formData.generation.trim()) {
      toast.error("Vui lòng nhập Gen.");
      return;
    }
  
    if (selectedFields.length === 0) {
      toast.error("Vui lòng chọn ít nhất một lĩnh vực.");
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      let projectId = editingId;
  
      // 1. Tạo mới hoặc cập nhật dự án
      if (editingId) {
        const { error: projectError } = await supabase
          .from("projects")
          .update(formData)
          .eq("id", editingId);
  
        if (projectError) {
          throw projectError;
        }
      } else {
        const { data, error: projectError } = await supabase
          .from("projects")
          .insert([formData])
          .select("id")
          .single();
  
        if (projectError) {
          throw projectError;
        }
  
        projectId = data.id;
      }
  
      if (!projectId) {
        throw new Error("Không xác định được ID dự án.");
      }
  
      // 2. Loại bỏ lĩnh vực trùng
      const uniqueFieldIds = [...new Set(selectedFields)];
  
      // 3. Lấy các lĩnh vực hiện tại của dự án
      const { data: existingLinks, error: fetchLinkError } =
        await supabase
          .from("project_categories")
          .select("field_id")
          .eq("project_id", projectId);
  
      if (fetchLinkError) {
        throw fetchLinkError;
      }
  
      const existingFieldIds = (existingLinks ?? []).map(
        (item) => item.field_id
      );
  
      // 4. Kiểm tra lĩnh vực có thay đổi không
      const fieldsChanged =
        existingFieldIds.length !== uniqueFieldIds.length ||
        existingFieldIds.some(
          (id) => !uniqueFieldIds.includes(id)
        );
  
      if (fieldsChanged) {
        // Xóa liên kết cũ
        const { error: deleteError } = await supabase
          .from("project_categories")
          .delete()
          .eq("project_id", projectId);
  
        if (deleteError) {
          throw deleteError;
        }
  
        // Thêm liên kết mới
        const fieldRows = uniqueFieldIds.map((fieldId) => ({
          project_id: projectId,
          field_id: fieldId,
        }));
  
        const { error: fieldError } = await supabase
          .from("project_categories")
          .insert(fieldRows);
  
        if (fieldError) {
          throw fieldError;
        }
      }
  
      toast.success(
        editingId
          ? "Cập nhật dự án thành công!"
          : "Đã đăng dự án mới!"
      );
  
      setIsOpen(false);
      setEditingId(null);
      setSelectedFields([]);
  
      setFormData({
        title: "",
        year: "2025",
        excerpt: "",
        content: "",
        imageUrl: "",
        status: "draft",
        generation: "",
        is_featured: false,
      });
  
      fetchProjects();
    } catch (error: any) {
      console.error("Lỗi lưu dự án:", error);
      toast.error(error.message || "Không thể lưu dự án.");
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
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Quản lý Dự án</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Công bố những dự án đột phá của HIEC HUST.
          </p>
        </div>
        
        {/* NÚT THÊM */}
        <Button 
          onClick={() => {
            setEditingId(null);
          
            setFormData({
              title: "",
              year: "2025",
              excerpt: "",
              content: "",
              imageUrl: "",
              status: "draft",
              generation: "",
              is_featured: false,
            });
          
            setSelectedFields([]);
            setIsOpen(true);
          }}
          className="rounded-full font-black uppercase tracking-widest px-8 py-6 bg-[#0f3d3e] dark:bg-cyan-700 text-white hover:bg-[#1a4d4f] dark:hover:bg-cyan-600 shadow-lg shadow-blue-900/20 dark:shadow-cyan-900/40 transition-all active:scale-95"
        >
          <Plus className="mr-2 h-5 w-5 text-cyan-400 dark:text-cyan-200" /> 
          THÊM DỰ ÁN
        </Button>
      </div>

      <Card className="rounded-[2rem] border-none shadow-md overflow-hidden bg-white dark:bg-slate-900 transition-colors">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-slate-950/50 transition-colors">
              <TableRow className="border-none">
                <TableHead className="font-bold pl-8 py-4 text-[#0f3d3e] dark:text-slate-300">Ảnh bìa</TableHead>
                <TableHead className="font-bold text-[#0f3d3e] dark:text-slate-300">Tên dự án</TableHead>
                <TableHead className="font-bold text-center text-[#0f3d3e] dark:text-slate-300">Năm</TableHead>
                <TableHead className="font-bold text-[#0f3d3e] dark:text-slate-300">Gen</TableHead>
                <TableHead className="font-bold text-center text-[#0f3d3e] dark:text-slate-300">Trạng thái</TableHead>
                <TableHead className="text-right pr-8 font-bold text-[#0f3d3e] dark:text-slate-300">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-20"><Loader2 className="animate-spin mx-auto text-blue-600 dark:text-blue-400" /></TableCell></TableRow>
              ) : projects.map((p) => (
                <TableRow key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-50 dark:border-slate-800/50">
                  <TableCell className="pl-8">
                    <div className="size-14 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
                      <img src={p.imageUrl || "https://via.placeholder.com/150"} className="w-full h-full object-cover" alt="" />
                    </div>
                  </TableCell>
                  <TableCell className="font-bold text-[#1a2e35] dark:text-slate-100 uppercase tracking-tight text-sm transition-colors">{p.title}</TableCell>
                  <TableCell className="text-center">
                    <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-[10px] font-black uppercase transition-colors">{p.year}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                      {p.generation || "—"}
                    </span>
                  </TableCell>
                  
                  <TableCell className="text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                        p.status === "published"
                          ? "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                          : p.status === "cancelled"
                            ? "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                            : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300"
                      }`}
                    >
                      {p.status === "published"
                        ? "Công khai"
                        : p.status === "cancelled"
                          ? "Đã huỷ"
                          : "Bản nháp"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={async () => {
                          setFormData({
                            title: p.title ?? "",
                            year: p.year ?? "2025",
                            excerpt: p.excerpt ?? "",
                            content: p.content ?? "",
                            imageUrl: p.imageUrl ?? "",
                            status: p.status ?? "draft",
                            generation: p.generation ?? "",
                            is_featured: Boolean(p.is_featured),
                          });
                        
                          const { data: fieldLinks, error } = await supabase
                            .from("project_categories")
                            .select("field_id")
                            .eq("project_id", p.id);
                        
                          if (!error) {
                            setSelectedFields(
                              (fieldLinks ?? []).map((item) => item.field_id)
                            );
                          }
                        
                          setEditingId(p.id);
                          setIsOpen(true);
                        }} 
                        className="rounded-xl text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDelete(p.id)} 
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
          {projects.length === 0 && !loading && <p className="text-center py-20 text-slate-400 dark:text-slate-500 text-sm font-medium transition-colors">Chưa có dự án nào được đăng tải.</p>}
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
          <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-4 text-left">
            <input
              id="project-featured"
              type="checkbox"
              checked={formData.is_featured}
              onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
              className="size-4 accent-primary"
            />
            <label htmlFor="project-featured" className="text-sm font-semibold text-foreground">
              Gắn tag Nổi bật (Featured)
            </label>
          </div>

          <div className="space-y-1 text-left">
            <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest pl-1 transition-colors">Tên dự án chiến lược</label>
            <Input 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
              placeholder="VD: Startup Bootcamp 2025..." 
              className="rounded-xl bg-slate-50 dark:bg-slate-900 border-none h-12 font-bold text-[#0f3d3e] dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-colors" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest pl-1 transition-colors">Năm triển khai</label>
              <Input 
                placeholder="2025" 
                value={formData.year} 
                onChange={e => setFormData({...formData, year: e.target.value})} 
                className="rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-none h-12 placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-colors" 
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400">
                Gen
              </label>
            
              <Input
                value={formData.generation}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    generation: e.target.value,
                  })
                }
                placeholder="VD: Gen 6"
                className="rounded-xl bg-slate-50 dark:bg-slate-900 border-none h-12"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400">
                Trạng thái
              </label>
            
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value,
                  })
                }
                className="w-full h-12 rounded-xl bg-slate-50 dark:bg-slate-900 px-3 text-sm font-bold text-slate-900 dark:text-slate-100 border-none outline-none"
              >
                <option value="draft">Bản nháp</option>
                <option value="published">Công khai</option>
                <option value="cancelled">Đã huỷ</option>
              </select>
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest pl-1 transition-colors">Tải ảnh dự án</label>
              <Input 
                type="file" 
                accept="image/*" 
                onChange={handleFileUpload} 
                className="rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-none h-12 text-xs pt-3 cursor-pointer transition-colors" 
              />
            </div>
          </div>

          <div className="space-y-2 text-left">
            <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest pl-1">
              Lĩnh vực
            </label>
          
            <div className="flex flex-wrap gap-2">
              {fields.map((field) => {
                const checked = selectedFields.includes(field.id);
          
                return (
                  <button
                    key={field.id}
                    type="button"
                    onClick={() => {
                      setSelectedFields((prev) =>
                        checked
                          ? prev.filter((id) => id !== field.id)
                          : [...prev, field.id]
                      );
                    }}
                    className={`rounded-full px-3 py-1.5 text-xs font-bold transition-all ${
                      checked
                        ? "bg-cyan-600 text-white"
                        : "bg-slate-100 text-slate-500 hover:bg-cyan-50 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    }`}
                  >
                    {field.name}
                  </button>
                );
              })}
            </div>
          
            <p className="text-[10px] text-slate-400 dark:text-slate-500">
              Có thể chọn nhiều lĩnh vực.
            </p>

            {isAddingField ? (
              <div className="mt-3 flex gap-2">
                <Input
                  value={newField}
                  onChange={(e) => setNewField(e.target.value)}
                  placeholder="Tên lĩnh vực mới"
                  className="rounded-xl bg-slate-50 dark:bg-slate-900"
                />
            
                <Button
                  type="button"
                  onClick={async () => {
                    const name = newField.trim();
            
                    if (!name) {
                      toast.error("Vui lòng nhập tên lĩnh vực.");
                      return;
                    }
            
                    const { data, error } = await supabase
                      .from("project_fields")
                      .insert({ name })
                      .select("id, name")
                      .single();
            
                    if (error) {
                      if (error.code === "23505") {
                        toast.error("Lĩnh vực này đã tồn tại.");
                      } else {
                        toast.error(error.message);
                      }
                      return;
                    }
            
                    setFields((prev) =>
                      [...prev, data].sort((a, b) =>
                        a.name.localeCompare(b.name)
                      )
                    );
            
                    setSelectedFields((prev) => [...prev, data.id]);
            
                    setNewField("");
                    setIsAddingField(false);
            
                    toast.success("Đã thêm lĩnh vực.");
                  }}
                >
                  Thêm
                </Button>
            
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setNewField("");
                    setIsAddingField(false);
                  }}
                >
                  Huỷ
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                className="mt-3 rounded-full"
                onClick={() => setIsAddingField(true)}
              >
                + Thêm lĩnh vực
              </Button>
            )}
          </div>

          {formData.imageUrl && (
            <div className="relative aspect-video rounded-3xl overflow-hidden border-2 border-blue-100 dark:border-blue-900/50 shadow-xl group transition-colors">
               <img src={formData.imageUrl} className="w-full h-full object-cover" alt="Preview" />
               <button 
                 type="button" 
                 onClick={() => setFormData({...formData, imageUrl: ""})} 
                 className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur rounded-full p-2 text-red-500 shadow-lg hover:bg-red-500 hover:text-white transition-all"
               >
                 <X className="size-5" />
               </button>
            </div>
          )}

          <div className="space-y-1 text-left">
            <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest pl-1 transition-colors">Mô tả ngắn (Danh sách)</label>
            <Textarea 
              value={formData.excerpt} 
              onChange={e => setFormData({...formData, excerpt: e.target.value})} 
              placeholder="Viết 1-2 câu giới thiệu..." 
              className="rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 border-none min-h-[80px] transition-colors" 
            />
          </div>

          <div className="space-y-1 text-left">
            <label className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 tracking-widest pl-1 transition-colors">Hành trình chi tiết</label>
            <Textarea 
              value={formData.content} 
              onChange={e => setFormData({...formData, content: e.target.value})} 
              placeholder="Kể về dự án tại đây..." 
              className="min-h-[200px] rounded-2xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 border-none p-4 transition-colors" 
            />
          </div>

          <Button 
              className="w-full py-8 font-black uppercase tracking-[0.2em] rounded-2xl text-white bg-[#0f3d3e] dark:bg-cyan-700 hover:bg-[#1a2e35] dark:hover:bg-cyan-600 shadow-xl shadow-cyan-900/20 dark:shadow-cyan-900/40 transition-all hover:scale-[1.01] active:scale-95 border-none mt-4" 
              onClick={handleSubmit} 
              disabled={isSubmitting}
          >
              {isSubmitting ? (
                  <Loader2 className="animate-spin mr-2 h-5 w-5" />
              ) : (
                  <Save className="mr-2 h-5 w-5 text-cyan-400 dark:text-cyan-200" /> 
              )}
              {editingId ? "CẬP NHẬT DỰ ÁN" : "ĐĂNG DỰ ÁN LÊN WEB"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
