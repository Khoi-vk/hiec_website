import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Pencil, Trash2, Loader2, Save, Users, UserCircle, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Modal } from "@/components/ui/modal";
import { supabase } from "@/utils/supabase";

export const Route = createFileRoute("/admin/manage-members")({
  component: MembersManagementPage,
});

function MembersManagementPage() {
  const [members, setMembers] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isModalOpen, setIsOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);

  const [formData, setFormData] = React.useState({
    fullName: "",
    position: "",
    department: "",
    bio: "",
    avatarUrl: "",
    displayOrder: 0
  });

  const fetchMembers = async () => {
    setLoading(true);
    const { data } = await supabase.from("members").select("*").order("displayOrder", { ascending: true });
    if (data) setMembers(data);
    setLoading(false);
  };

  React.useEffect(() => { fetchMembers(); }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsSubmitting(true);
    try {
      const fileName = `avatar_${Date.now()}`;
      const { error } = await supabase.storage.from('member-avatars').upload(fileName, file);
      if (error) throw error;
      const { data } = supabase.storage.from('member-avatars').getPublicUrl(fileName);
      setFormData(prev => ({ ...prev, avatarUrl: data.publicUrl }));
      toast.success("Đã tải ảnh đại diện lên.");
    } catch (err: any) {
      toast.error("Lỗi tải ảnh: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.fullName || !formData.position) {
      toast.error("Vui lòng nhập tên và chức vụ");
      return;
    }
    setIsSubmitting(true);
    try {
      const { error } = editingId 
        ? await supabase.from("members").update(formData).eq("id", editingId)
        : await supabase.from("members").insert([formData]);
      if (error) throw error;
      toast.success(editingId ? "Đã cập nhật thành viên" : "Đã thêm thành viên mới");
      setIsOpen(false);
      fetchMembers();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Xóa thành viên này khỏi danh sách?")) return;
    const { error } = await supabase.from("members").delete().eq("id", id);
    if (!error) {
      toast.success("Đã xóa.");
      fetchMembers();
    }
  };

  return (
    <div className="space-y-6 text-left animate-fade-up">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tighter text-[#0f3d3e] flex items-center gap-2">
            <Users className="text-cyan-600 size-6" /> Quản lý Thành viên
          </h1>
          <p className="text-xs text-muted-foreground mt-1 font-medium italic">Nhân sự nòng cốt của HIEC HUST.</p>
        </div>
        <Button 
        onClick={() => { setEditingId(null); setIsOpen(true); }} 
        className="rounded-full font-black uppercase tracking-widest px-8 py-6 bg-[#0f3d3e] text-white hover:bg-[#1a4d4f] shadow-lg shadow-cyan-900/20 transition-all active:scale-95"
        >
        <Plus className="mr-2 h-5 w-5 text-cyan-400" /> 
        THÊM NHÂN SỰ
        </Button>
      </div>

      <Card className="rounded-[2rem] border-none shadow-md overflow-hidden bg-white">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="font-bold pl-8">Thành viên</TableHead>
                <TableHead className="font-bold">Ban</TableHead>
                <TableHead className="font-bold text-center">Thứ tự</TableHead>
                <TableHead className="text-right pr-8">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={4} className="text-center py-20"><Loader2 className="animate-spin mx-auto text-cyan-600" /></TableCell></TableRow>
              ) : members.map((m) => (
                <TableRow key={m.id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell className="pl-8">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full overflow-hidden border bg-slate-100">
                        <img src={m.avatarUrl || ""} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div>
                        <p className="font-bold text-[#0f3d3e]">{m.fullName}</p>
                        <p className="text-[10px] text-cyan-600 font-bold uppercase tracking-widest">{m.position}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs font-medium text-slate-500">{m.department}</TableCell>
                  <TableCell className="text-center font-mono font-bold text-slate-400">{m.displayOrder}</TableCell>
                  <TableCell className="text-right pr-8">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => { setFormData(m); setEditingId(m.id); setIsOpen(true); }}><Pencil className="size-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(m.id)} className="text-red-500"><Trash2 className="size-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Modal open={isModalOpen} onOpenChange={setIsOpen} title={editingId ? "Sửa thông tin" : "Thêm thành viên"} description="Thông tin này sẽ hiển thị công khai trên trang Thành viên.">
        <div className="space-y-4 py-4 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400">Họ và tên</label>
            <Input value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="rounded-xl bg-slate-50" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400">Chức vụ</label>
              <Input placeholder="VD: Chủ tịch" value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} className="rounded-xl bg-slate-50" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400">Ban / Bộ phận</label>
              <Input placeholder="VD: Ban Điều Hành" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className="rounded-xl bg-slate-50" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400">Thứ tự hiển thị (Số nhỏ hiện trước)</label>
              <Input type="number" value={formData.displayOrder} onChange={e => setFormData({...formData, displayOrder: parseInt(e.target.value)})} className="rounded-xl bg-slate-50" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400">Ảnh đại diện</label>
              <Input type="file" accept="image/*" onChange={handleFileUpload} className="rounded-xl bg-slate-50 text-xs" />
            </div>
          </div>
          {formData.avatarUrl && (
            <div className="flex justify-center py-2">
              <div className="size-24 rounded-full overflow-hidden border-4 border-cyan-100 shadow-lg relative group">
                <img src={formData.avatarUrl} className="w-full h-full object-cover" />
                <button onClick={() => setFormData({...formData, avatarUrl: ""})} className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"><X className="size-6" /></button>
              </div>
            </div>
          )}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400">Giới thiệu ngắn / Châm ngôn</label>
            <Textarea value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="rounded-xl bg-slate-50 min-h-[80px]" />
          </div>
          <Button className="w-full py-6 font-bold uppercase tracking-widest" onClick={handleSubmit} disabled={isSubmitting} variant="shimmer">
            {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2 h-4 w-4" />}
            LƯU THÔNG TIN
          </Button>
        </div>
      </Modal>
    </div>
  );
}