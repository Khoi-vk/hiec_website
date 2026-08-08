import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Eye, Mail, Phone, Search, CheckCircle, UserCheck, Clock, GraduationCap, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Modal } from "@/components/ui/modal";
import { supabase } from "@/utils/supabase";

export const Route = createFileRoute("/admin/applications")({
  component: ApplicationsPage,
});

function ApplicationsPage() {
  const [apps, setApps] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedApp, setSelectedApp] = React.useState<any>(null);
  const [searchTerm, setSearchTerm] = React.useState("");

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setApps(data || []);
    } catch (e) {
      console.error("Lỗi tải đơn ứng tuyển từ Supabase:", e);
      toast.error("Không thể tải danh sách đơn ứng tuyển.");
    } finally {
      setLoading(false);
    }
  };

  // Load ban đầu + Lắng nghe Realtime có đơn mới hoặc đổi trạng thái
  React.useEffect(() => {
    fetchApplications();

    const channel = supabase
      .channel("admin-applications-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "applications" },
        () => {
          fetchApplications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Lọc danh sách theo tìm kiếm
  const filteredApps = apps.filter(app => 
    (app.fullName || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
    (app.studentId || "").includes(searchTerm)
  );

  const handleApprove = async (id: string) => {
    try {
      const { error } = await supabase
        .from("applications")
        .update({ status: "passed_round_1" }) 
        .eq("id", id);

      if (error) throw error;

      setApps(prev => prev.map(a => a.id === id ? { ...a, status: "passed_round_1" } : a));
      toast.success("Đã duyệt ứng viên này qua vòng đơn!");
      setSelectedApp(null);
    } catch (e) {
      console.error(e);
      toast.error("Không thể duyệt đơn lúc này.");
    }
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Tiêu đề trang - GIỮ NGUYÊN */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <h1 className="font-display text-2xl font-bold flex items-center gap-2">
            <UserCheck className="text-primary size-6" /> Quản lý đơn ứng tuyển
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Danh sách sinh viên nộp đơn tham gia HIEC HUST.</p>
        </div>
        
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input 
            placeholder="Tìm theo tên hoặc MSSV..." 
            className="pl-10 h-10 rounded-xl" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Bảng danh sách */}
      <Card className="border-none shadow-elevated overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-muted-foreground gap-2">
              <Loader2 className="size-6 animate-spin text-primary" />
              <p className="text-sm">Đang đồng bộ dữ liệu từ hệ thống...</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="font-bold">Ứng viên</TableHead>
                    <TableHead className="font-bold">Học vấn</TableHead>
                    <TableHead className="font-bold">Thông tin liên hệ</TableHead>
                    <TableHead className="font-bold">Trạng thái</TableHead>
                    <TableHead className="text-right font-bold">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApps.map((app) => (
                    <TableRow key={app.id} className="hover:bg-muted/20 transition-colors">
                      <TableCell>
                        <div className="font-bold text-foreground">{app.fullName}</div>
                        <div className="text-[11px] font-mono text-primary bg-primary/5 px-1.5 py-0.5 rounded w-fit mt-1">
                          {app.studentId}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">{app.university}</div>
                        <div className="text-xs text-muted-foreground">{app.major}</div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors">
                            <Mail className="size-3" /> {app.email}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Phone className="size-3" /> {app.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {app.status === "passed_round_1" ? (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 gap-1 font-medium italic">
                            <CheckCircle className="size-3" /> Đỗ vòng đơn
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-amber-200 gap-1 font-medium">
                            <Clock className="size-3" /> Chờ duyệt
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedApp(app)} className="rounded-lg">
                          <Eye className="size-4 mr-2" /> Xem đơn
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {filteredApps.length === 0 && (
                <div className="py-20 text-center text-muted-foreground">
                  <Search className="size-10 mx-auto opacity-20 mb-4" />
                  <p>Không tìm thấy đơn ứng tuyển nào phù hợp.</p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Modal xem chi tiết đơn ứng tuyển - GIỮ NGUYÊN */}
      {/* Modal xem chi tiết đơn ứng tuyển */}
      <Modal
        open={!!selectedApp}
        onOpenChange={(open) => !open && setSelectedApp(null)}
        title="Chi tiết hồ sơ ứng viên"
        description={`Mã đơn: ${selectedApp?.id}`}
      >
        {selectedApp && (
          <div className="space-y-6 py-4">
            {/* Thông tin cá nhân & Liên hệ */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-muted/50 border border-border/50">
                <span className="text-[10px] uppercase font-black text-muted-foreground block mb-1">Họ và tên</span>
                <p className="text-sm font-bold">{selectedApp.fullName}</p>
              </div>
              <div className="p-3 rounded-xl bg-muted/50 border border-border/50">
                <span className="text-[10px] uppercase font-black text-muted-foreground block mb-1">MSSV</span>
                <p className="text-sm font-bold font-mono text-primary">{selectedApp.studentId}</p>
              </div>
              <div className="p-3 rounded-xl bg-muted/50 border border-border/50">
                <span className="text-[10px] uppercase font-black text-muted-foreground block mb-1">Email</span>
                <p className="text-xs font-bold truncate">{selectedApp.email}</p>
              </div>
              <div className="p-3 rounded-xl bg-muted/50 border border-border/50">
                <span className="text-[10px] uppercase font-black text-muted-foreground block mb-1">Số điện thoại</span>
                <p className="text-sm font-bold">{selectedApp.phone}</p>
              </div>
            </div>

            {/* Thông tin học vấn */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-muted/50 border border-border/50">
                <span className="text-[10px] uppercase font-black text-muted-foreground block mb-1">Trường</span>
                <p className="text-sm font-bold flex items-center gap-1"><GraduationCap className="size-4 text-primary" /> {selectedApp.university}</p>
              </div>
              <div className="p-3 rounded-xl bg-muted/50 border border-border/50">
                <span className="text-[10px] uppercase font-black text-muted-foreground block mb-1">Ngành học</span>
                <p className="text-sm font-bold">{selectedApp.major}</p>
              </div>
            </div>
            
            {/* Nội dung Motivation */}
            <div className="space-y-2">
              <span className="text-xs uppercase font-black text-primary tracking-widest">Nội dung ứng tuyển:</span>
              <div className="bg-primary/[0.03] p-4 rounded-xl border-l-4 border-primary italic text-sm leading-relaxed text-foreground/80 max-h-[150px] overflow-y-auto">
                "{selectedApp.motivation}"
              </div>
            </div>

            <div className="text-[10px] text-muted-foreground text-right italic">
              Ngày nộp: {new Date(selectedApp.created_at).toLocaleString('vi-VN')}
            </div>

            <div className="flex gap-3 pt-4 border-t">
              {selectedApp.status !== "passed_round_1" && (
                <Button className="flex-1" variant="shimmer" onClick={() => handleApprove(selectedApp.id)}>
                  <CheckCircle className="size-4 mr-2" /> Duyệt qua vòng đơn
                </Button>
              )}
              <Button variant="outline" className="flex-1" onClick={() => setSelectedApp(null)}>
                Đóng lại
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}