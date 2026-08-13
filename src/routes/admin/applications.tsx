import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { 
  Eye, Mail, Phone, Search, CheckCircle, 
  ClipboardList, Clock, GraduationCap, Trash2, 
  Loader2, Send 
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Modal } from "@/components/ui/modal";
import { supabase } from "@/utils/supabase";

export const Route = createFileRoute("/admin/applications")({
  component: RegistrationsPage,
});

function RegistrationsPage() {
  const [registrations, setRegistrations] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedReg, setSelectedReg] = React.useState<any>(null);
  const [searchTerm, setSearchTerm] = React.useState("");

  // HÀM LẤY DỮ LIỆU TỪ BẢNG: applications
  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      console.log("Đang gọi Supabase lấy dữ liệu từ bảng 'applications'...");
      
      const { data, error } = await supabase
        .from("applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Lỗi Supabase trả về:", error);
        throw error;
      }

      console.log("Dữ liệu tải về thành công:", data);
      setRegistrations(data || []);
    } catch (e: any) {
      console.error("Lỗi kĩ thuật khi load data:", e);
      toast.error("Không thể kết nối với Database", {
        description: e.message || "Vui lòng kiểm tra lại bảng 'applications' trên Supabase."
      });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchRegistrations();
    
    // Đăng ký Realtime để có đơn mới là hiện ngay
    const channel = supabase
      .channel("db-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "applications" }, () => {
        fetchRegistrations();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleMarkAsContacted = async (id: string) => {
    try {
      const { error } = await supabase
        .from("applications")
        .update({ status: "contacted" })
        .eq("id", id);

      if (error) throw error;
      toast.success("Đã xác nhận gửi thông tin thành công.");
      setSelectedReg(null);
      fetchRegistrations();
    } catch (e: any) {
      toast.error("Lỗi cập nhật: " + e.message);
    }
  };

  // Lọc dữ liệu theo tìm kiếm (Hỗ trợ cả cột chữ hoa và chữ thường)
  const filteredData = registrations.filter(reg => {
    const name = (reg.fullName || reg.fullname || "").toLowerCase();
    const sid = (reg.studentId || reg.studentid || "");
    return name.includes(searchTerm.toLowerCase()) || sid.includes(searchTerm);
  });

  return (
    <div className="space-y-8 animate-fade-up text-left px-2">
      {/* HEADER: Giao diện mỏng, font chữ "Công" */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-8">
        <div>
          <h1 className="font-display text-5xl font-black uppercase tracking-tighter text-[#0f3d3e] flex items-center gap-3">
            <ClipboardList className="text-cyan-600 size-10" /> Đăng ký nhận tin
          </h1>
          <p className="text-sm text-slate-400 mt-2 font-medium italic">
            Quản lý danh sách sinh viên đăng ký thông tin từ HIEC HUST.
          </p>
        </div>
        
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-300" />
          <Input 
            placeholder="Tìm theo tên hoặc MSSV..." 
            className="pl-11 h-14 rounded-2xl border-none bg-white shadow-sm focus-visible:ring-cyan-500 font-medium" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* BẢNG DANH SÁCH PREMIUM */}
      <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="border-none">
                <TableHead className="font-black uppercase text-[10px] tracking-widest text-slate-400 pl-8 py-6">Người đăng ký</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest text-slate-400">Trường / Ngành</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest text-slate-400 text-center">Tình trạng</TableHead>
                <TableHead className="text-right font-black uppercase text-[10px] tracking-widest text-slate-400 pr-8">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={4} className="text-center py-20"><Loader2 className="animate-spin mx-auto text-cyan-600 size-10" /></TableCell></TableRow>
              ) : filteredData.map((reg) => (
                <TableRow key={reg.id} className="hover:bg-slate-50/80 transition-all border-b border-slate-50 last:border-0 group">
                  <TableCell className="pl-8 py-6">
                    <div className="font-black text-[#1a2e35] uppercase text-sm group-hover:text-cyan-600 transition-colors">
                      {reg.fullName || reg.fullname}
                    </div>
                    <div className="text-[10px] font-mono font-bold text-slate-400 mt-1 uppercase tracking-wider">
                      ID: {reg.studentId || reg.studentid}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs font-bold text-[#0f3d3e] uppercase">{reg.university}</div>
                    <div className="text-[10px] text-slate-400 font-medium mt-1">{reg.major}</div>
                  </TableCell>
                  <TableCell className="text-center">
                    {reg.status === "contacted" ? (
                      <Badge className="bg-cyan-50 text-cyan-700 border-none font-black text-[9px] uppercase px-3 py-1 rounded-full">
                        <Send className="size-3 mr-1" /> Đã gửi tin
                      </Badge>
                    ) : (
                      <Badge className="bg-amber-50 text-amber-600 border-none font-black text-[9px] uppercase px-3 py-1 rounded-full animate-pulse">
                        <Clock className="size-3 mr-1" /> Chờ xử lý
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setSelectedReg(reg)} 
                      className="rounded-xl hover:bg-cyan-50 hover:text-cyan-600"
                    >
                      <Eye className="size-5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {!loading && filteredData.length === 0 && (
            <div className="py-24 text-center">
              <Search className="size-12 text-slate-100 mx-auto mb-4" />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Không có dữ liệu đăng ký</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* MODAL CHI TIẾT SANG TRỌNG */}
      <Modal
        open={!!selectedReg}
        onOpenChange={(open) => !open && setSelectedReg(null)}
        title="HỒ SƠ ĐĂNG KÝ"
        description="Thông tin chi tiết sinh viên đăng ký nhận bản tin HIEC."
      >
        {selectedReg && (
          <div className="max-w-4xl mx-auto space-y-8 py-4 max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100 shadow-inner">
                <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest block mb-2">Họ và tên</span>
                <p className="text-2xl font-black text-[#0f3d3e] uppercase tracking-tighter">
                  {selectedReg.fullName || selectedReg.fullname}
                </p>
              </div>
              <div className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100 shadow-inner">
                <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest block mb-2">Mã số sinh viên</span>
                <p className="text-2xl font-black text-cyan-600 font-mono tracking-tighter">
                  {selectedReg.studentId || selectedReg.studentid}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-2">
              <div className="space-y-4">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-600">Thông tin liên hệ</h4>
                 <div className="space-y-3">
                    <div className="flex items-center gap-4 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
                       <Mail className="size-5 text-cyan-500" />
                       <span className="font-bold text-sm text-[#1a2e35]">{selectedReg.email}</span>
                    </div>
                    <div className="flex items-center gap-4 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
                       <Phone className="size-5 text-cyan-500" />
                       <span className="font-bold text-sm text-[#1a2e35]">{selectedReg.phone}</span>
                    </div>
                 </div>
              </div>

              <div className="space-y-4">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-600">Học vấn</h4>
                 <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-start gap-4">
                    <GraduationCap className="size-8 text-cyan-500 shrink-0" />
                    <div>
                       <p className="font-black text-[#0f3d3e] uppercase text-sm leading-tight">{selectedReg.university}</p>
                       <p className="text-xs text-slate-400 font-bold mt-1 uppercase">{selectedReg.major}</p>
                    </div>
                 </div>
              </div>
            </div>

            <div className="flex gap-4 pt-8 border-t border-slate-100">
              {selectedReg.status !== "contacted" && (
                <Button 
                  className="flex-[2] py-8 font-black uppercase tracking-[0.2em] rounded-2xl text-white bg-[#0f3d3e] hover:bg-[#1a2e35] shadow-2xl shadow-blue-900/20" 
                  onClick={() => handleMarkAsContacted(selectedReg.id)}
                >
                  <Send className="size-5 mr-3 text-cyan-400" /> Đã gửi tin
                </Button>
              )}
              <Button 
                variant="outline" 
                className="flex-1 rounded-2xl py-8 font-black uppercase tracking-widest border-slate-200 text-slate-400 hover:bg-slate-50" 
                onClick={() => setSelectedReg(null)}
              >
                Đóng
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}