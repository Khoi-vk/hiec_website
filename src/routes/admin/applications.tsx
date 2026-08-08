import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Eye, Mail, Phone, Search, CheckCircle, UserCheck, Clock, GraduationCap } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Modal } from "@/components/ui/modal";

// Sử dụng 'as any' để tránh lỗi Type khi routeTree chưa kịp cập nhật
export const Route = createFileRoute("/admin/applications")({
  component: ApplicationsPage,
});

// Dữ liệu mẫu mô phỏng các đơn ứng tuyển được gửi từ Form Signup
const initialApplications = [
  { 
    id: "APP-001", 
    fullName: "Nguyễn Công An", 
    studentId: "20210001", 
    university: "ĐH Bách Khoa Hà Nội", 
    major: "Khoa học máy tính", 
    email: "an.nc210001@sis.hust.edu.vn", 
    phone: "0336873705", 
    status: "pending", 
    motivation: "Mình có niềm đam mê mãnh liệt với khởi nghiệp sáng tạo. Mong muốn được gia nhập HIEC để cùng các bạn xây dựng những dự án có sức ảnh hưởng thực tế đến cộng đồng sinh viên Bách Khoa." 
  },
  { 
    id: "APP-002", 
    fullName: "Trần Thu Thảo", 
    studentId: "20224567", 
    university: "ĐH Kinh tế Quốc dân", 
    major: "Marketing", 
    email: "thao.tt@gmail.com", 
    phone: "0987654321", 
    status: "reviewed", 
    motivation: "Em đã theo dõi HIEC từ lâu qua các kỳ Bootcamp. Em muốn ứng tuyển vào ban Truyền thông để học hỏi cách xây dựng thương hiệu cho một câu lạc bộ khởi nghiệp chuyên nghiệp." 
  },
];

function ApplicationsPage() {
  const [apps, setApps] = React.useState<any[]>(() => {
    try {
      const saved = localStorage.getItem("hiec_applications");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Lỗi đọc ứng tuyển từ localStorage:", e);
    }
    return initialApplications;
  });

  const [selectedApp, setSelectedApp] = React.useState<any>(null);
  const [searchTerm, setSearchTerm] = React.useState("");

  // Tự động đồng bộ khi có đơn mới nộp
  React.useEffect(() => {
    const loadApplications = () => {
      try {
        const saved = localStorage.getItem("hiec_applications");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setApps(parsed);
            return;
          }
        }
      } catch (e) {
        console.error(e);
      }
      setApps(initialApplications);
    };

    window.addEventListener("storage", loadApplications);
    window.addEventListener("hiec_app_submitted", loadApplications);
    return () => {
      window.removeEventListener("storage", loadApplications);
      window.removeEventListener("hiec_app_submitted", loadApplications);
    };
  }, []);

  // Lọc danh sách theo tìm kiếm
  const filteredApps = apps.filter(app => 
    (app.fullName || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
    (app.studentId || "").includes(searchTerm)
  );

  const handleApprove = (id: string) => {
    const updated = apps.map(a => a.id === id ? { ...a, status: "reviewed" } : a);
    setApps(updated);
    try {
      localStorage.setItem("hiec_applications", JSON.stringify(updated));
    } catch (e) {
      console.error("Lỗi cập nhật localStorage:", e);
    }
    toast.success("Đã đánh dấu đơn ứng tuyển này là đã xem.");
    setSelectedApp(null);
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Tiêu đề trang */}
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
                    {app.status === "pending" ? (
                      <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-amber-200 gap-1 font-medium">
                        <Clock className="size-3" /> Chờ duyệt
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1 font-medium">
                        <CheckCircle className="size-3" /> Đã duyệt
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
        </CardContent>
      </Card>

      {/* Modal xem chi tiết đơn ứng tuyển */}
      <Modal
        open={!!selectedApp}
        onOpenChange={(open) => !open && setSelectedApp(null)}
        title="Chi tiết đơn ứng tuyển"
        description={`Đơn từ: ${selectedApp?.fullName} (${selectedApp?.id})`}
      >
        {selectedApp && (
          <div className="space-y-5 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-muted/50 border border-border/50">
                <span className="text-[10px] uppercase font-black text-muted-foreground block mb-1">Trường đại học</span>
                <p className="text-sm font-bold flex items-center gap-2"><GraduationCap className="size-4 text-primary" /> {selectedApp.university}</p>
              </div>
              <div className="p-3 rounded-xl bg-muted/50 border border-border/50">
                <span className="text-[10px] uppercase font-black text-muted-foreground block mb-1">Ngành đào tạo</span>
                <p className="text-sm font-bold">{selectedApp.major}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-black text-primary tracking-widest">Lý do muốn gia nhập HIEC:</span>
              </div>
              <div className="bg-primary/[0.03] p-5 rounded-2xl border-l-4 border-primary italic text-sm leading-relaxed text-foreground/80">
                "{selectedApp.motivation}"
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              {selectedApp.status === "pending" && (
                <Button className="flex-1" variant="shimmer" onClick={() => handleApprove(selectedApp.id)}>
                  <CheckCircle className="size-4 mr-2" /> Duyệt & Liên hệ
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
