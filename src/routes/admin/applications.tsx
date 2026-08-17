import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { 
  Eye, Mail, Phone, Search, 
  ClipboardList, Clock, GraduationCap, Trash2, 
  Loader2, ChevronLeft, Copy
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

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRegistrations(data || []);
    } catch (e: any) {
      console.error(e);
      toast.error("Không thể kết nối dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchRegistrations();
    const channel = supabase
      .channel("apps-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "applications" }, () => {
        fetchRegistrations();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Xác nhận xóa bản đăng ký này khỏi hệ thống?")) return;
    const { error } = await supabase.from("applications").delete().eq("id", id);
    if (!error) {
      toast.success("Đã xóa dữ liệu.");
      fetchRegistrations();
    }
  };

  const filteredData = registrations.filter(reg => {
    const name = (reg.fullName || reg.fullname || "").toLowerCase();
    const sid = (reg.studentId || reg.studentid || "");
    return name.includes(searchTerm.toLowerCase()) || sid.includes(searchTerm);
  });

  const handleCopyAllEmails = async () => {
    const emailsList = filteredData
      .map(reg => reg.email)
      .filter(email => email)
      .join(" ");

    if (!emailsList) {
      toast.error("Không có email nào để copy.");
      return;
    }

    try {
      await navigator.clipboard.writeText(emailsList);
      toast.success("Đã copy toàn bộ email vào bộ nhớ tạm!");
    } catch (err) {
      toast.error("Trình duyệt không hỗ trợ copy tự động.");
    }
  };

  return (
    <div className="space-y-6 animate-fade-up text-left">
      {/* 1. BANNER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 dark:border-slate-800 pb-8 pt-2">
        <div className="flex-shrink-0">
          
          
        </div>

        <div className="w-full md:max-w-xl md:border-l-2 border-cyan-500/20 dark:border-cyan-500/10 md:pl-8 flex flex-col gap-4">
          <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm font-medium leading-relaxed transition-colors">
            Hệ thống quản lý danh sách sinh viên đăng ký nhận thông tin và tham gia hệ sinh thái HIEC HUST.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-300 dark:text-slate-500" />
              <Input 
                placeholder="Tìm theo tên hoặc MSSV..." 
                className="pl-10 h-12 rounded-xl border-none bg-slate-50 dark:bg-slate-900 shadow-inner focus-visible:ring-cyan-500 font-bold text-sm w-full text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-colors" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button 
              onClick={handleCopyAllEmails}
              className="h-12 px-6 rounded-xl bg-[#0f3d3e] dark:bg-cyan-700 hover:bg-[#1a2e35] dark:hover:bg-cyan-600 text-white font-black uppercase tracking-widest text-xs transition-all shadow-lg hover:shadow-xl"
            >
              <Copy className="size-4 mr-2 text-cyan-400 dark:text-cyan-200" /> Copy Emails
            </Button>
          </div>
        </div>
      </div>

      {/* 2. BẢNG DANH SÁCH */}
      <Card className="border-none shadow-elevated rounded-[2rem] overflow-hidden bg-white dark:bg-slate-900 transition-colors">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-slate-950/50">
              <TableRow className="border-none">
                <TableHead className="font-bold uppercase text-[10px] tracking-widest text-[#0f3d3e] dark:text-slate-300 pl-8 py-5">Người đăng ký</TableHead>
                <TableHead className="text-right font-bold uppercase text-[10px] tracking-widest text-[#0f3d3e] dark:text-slate-300 pr-8">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={2} className="text-center py-20"><Loader2 className="animate-spin mx-auto text-cyan-600 size-10" /></TableCell></TableRow>
              ) : filteredData.length === 0 ? (
                <TableRow><TableCell colSpan={2} className="text-center py-10 text-slate-400 dark:text-slate-500 font-medium">Không tìm thấy bản ghi nào</TableCell></TableRow>
              ) : filteredData.map((reg) => (
                <TableRow key={reg.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-all border-b border-slate-50 dark:border-slate-800/50 last:border-0 group">
                  <TableCell className="pl-8 py-5">
                    <div className="font-black text-[#1a2e35] dark:text-slate-100 uppercase text-sm group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                      {reg.fullName || reg.fullname}
                    </div>
                    <div className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 mt-1">
                      ID: {reg.studentId || reg.studentid}
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => setSelectedReg(reg)} className="rounded-xl text-slate-600 dark:text-slate-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/30 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all">
                        <Eye className="size-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(reg.id)} className="rounded-xl text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition-all">
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 3. MODAL CHI TIẾT */}
      <Modal
        open={!!selectedReg}
        onOpenChange={(open) => !open && setSelectedReg(null)}
        title="THÔNG TIN CHI TIẾT"
        description="Dữ liệu sinh viên đăng ký nhận bản tin từ hệ thống."
      >
        {selectedReg && (
          <div className="max-w-4xl mx-auto space-y-10 py-6 max-h-[85vh] overflow-y-auto pr-4 custom-scrollbar text-left">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Họ tên */}
              <div className="p-8 rounded-[2.5rem] bg-slate-50 dark:bg-slate-900/80 border border-slate-100 dark:border-slate-800 shadow-inner transition-colors">
                <span className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-[0.2em] block mb-3">Họ và tên</span>
                <p className="text-3xl font-black text-[#0f3d3e] dark:text-white uppercase tracking-tighter">
                  {selectedReg.fullName || selectedReg.fullname}
                </p>
              </div>
              {/* MSSV */}
              <div className="p-8 rounded-[2.5rem] bg-[#0f3d3e] dark:bg-slate-800 border dark:border-slate-700 text-white shadow-xl transition-colors">
                <span className="text-[10px] uppercase font-black text-cyan-400 dark:text-cyan-300 tracking-[0.2em] block mb-3">Mã số sinh viên</span>
                <p className="text-3xl font-black font-mono tracking-tighter">
                  {selectedReg.studentId || selectedReg.studentid}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 px-2">
              <div className="space-y-6">
                 <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-cyan-600 dark:text-cyan-400">Kênh liên lạc</h4>
                 <div className="space-y-3">
                    <div className="flex items-center gap-4 p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[1.5rem] shadow-sm transition-colors">
                       <div className="size-10 rounded-full bg-cyan-50 dark:bg-cyan-900/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400"><Mail className="size-5" /></div>
                       <span className="font-bold text-base text-[#1a2e35] dark:text-slate-200">{selectedReg.email}</span>
                    </div>
                    <div className="flex items-center gap-4 p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[1.5rem] shadow-sm transition-colors">
                       <div className="size-10 rounded-full bg-cyan-50 dark:bg-cyan-900/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400"><Phone className="size-5" /></div>
                       <span className="font-bold text-base text-[#1a2e35] dark:text-slate-200">{selectedReg.phone}</span>
                    </div>
                 </div>
              </div>

              <div className="space-y-6">
                 <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-cyan-600 dark:text-cyan-400">Thông tin học thuật</h4>
                 <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] shadow-sm flex items-start gap-5 transition-colors">
                    <div className="size-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-[#0f3d3e] dark:text-slate-300 shadow-sm"><GraduationCap className="size-7" /></div>
                    <div>
                       <p className="font-black text-[#0f3d3e] dark:text-slate-100 uppercase text-sm leading-tight mb-2">{selectedReg.university}</p>
                       <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-tight">{selectedReg.major}</p>
                    </div>
                 </div>
              </div>
            </div>

            <div className="pt-10 border-t border-slate-100 dark:border-slate-800">
              <Button 
                variant="outline" 
                className="w-full rounded-[2rem] py-8 font-black uppercase tracking-widest border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-[#0f3d3e] dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm hover:shadow" 
                onClick={() => setSelectedReg(null)}
              >
                <ChevronLeft className="mr-2 size-5" /> Đóng chi tiết
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}