import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import {
  AlertCircle,
  Copy,
  Download,
  Eye,
  Mail,
  RefreshCw,
  Search,
  Trash2,
  Users,
  X,
  ExternalLink,
  GraduationCap,
  Briefcase,
  HeartHandshake,
  UserCheck,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/utils/supabase";

export const Route = createFileRoute("/admin/applications")({
  head: () => ({
    meta: [
      { title: "Quản lý đơn đăng ký — HIEC Admin" },
      {
        name: "description",
        content: "Danh sách và quản lý các đơn đăng ký nhận thông tin từ người dùng.",
      },
    ],
  }),
  component: ApplicationsPage,
});

export type Application = {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  audience: "Sinh viên" | "Phụ huynh" | "Doanh nghiệp" | string;
};

function getAudienceBadge(audience: string) {
  switch (audience) {
    case "Sinh viên":
      return (
        <Badge className="bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/20 font-bold hover:bg-sky-500/20">
          <GraduationCap className="mr-1 size-3.5" />
          Sinh viên
        </Badge>
      );
    case "Phụ huynh":
      return (
        <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/20 font-bold hover:bg-emerald-500/20">
          <HeartHandshake className="mr-1 size-3.5" />
          Phụ huynh
        </Badge>
      );
    case "Doanh nghiệp":
      return (
        <Badge className="bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/20 font-bold hover:bg-purple-500/20">
          <Briefcase className="mr-1 size-3.5" />
          Doanh nghiệp
        </Badge>
      );
    default:
      return (
        <Badge variant="secondary" className="font-bold">
          {audience || "Chưa phân loại"}
        </Badge>
      );
  }
}

function ApplicationsPage() {
  const [registrations, setRegistrations] = React.useState<Application[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedAudience, setSelectedAudience] = React.useState<string>("all");
  const [selectedReg, setSelectedReg] = React.useState<Application | null>(null);
  const [deletingReg, setDeletingReg] = React.useState<Application | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  // =========================
  // LẤY DỮ LIỆU TỪ SUPABASE
  // =========================
  const fetchRegistrations = React.useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const { data, error } = await supabase
        .from("applications")
        .select("id, created_at, full_name, email, audience")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Lỗi khi tải dữ liệu từ Supabase:", error);
        setErrorMessage(error.message);
        toast.error("Không thể tải danh sách đơn đăng ký");
        setRegistrations([]);
      } else {
        setRegistrations((data ?? []) as Application[]);
      }
    } catch (err: unknown) {
      console.error("Lỗi kết nối Supabase:", err);
      setErrorMessage("Không thể kết nối với Supabase.");
    } finally {
      setLoading(false);
    }
  }, []);

  // =========================
  // REALTIME SUPABASE
  // =========================
  React.useEffect(() => {
    fetchRegistrations();

    const channel = supabase
      .channel("applications-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "applications",
        },
        () => {
          fetchRegistrations();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchRegistrations]);

  // =========================
  // THỐNG KÊ SỐ LƯỢNG
  // =========================
  const totalCount = registrations.length;
  const studentCount = registrations.filter((r) => r.audience === "Sinh viên").length;
  const parentCount = registrations.filter((r) => r.audience === "Phụ huynh").length;
  const businessCount = registrations.filter((r) => r.audience === "Doanh nghiệp").length;

  // =========================
  // TÌM KIẾM & BỘ LỌC
  // =========================
  const filteredData = React.useMemo(() => {
    return registrations.filter((reg) => {
      const matchSearch =
        !searchTerm.trim() ||
        (reg.full_name || "").toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
        (reg.email || "").toLowerCase().includes(searchTerm.trim().toLowerCase());

      const matchAudience = selectedAudience === "all" || reg.audience === selectedAudience;

      return matchSearch && matchAudience;
    });
  }, [registrations, searchTerm, selectedAudience]);

  // =========================
  // XOÁ ĐƠN ĐĂNG KÝ
  // =========================
  const confirmDelete = async () => {
    if (!deletingReg) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase.from("applications").delete().eq("id", deletingReg.id);

      if (error) {
        console.error("Lỗi khi xoá đơn:", error);
        toast.error("Xoá thất bại: " + error.message);
        return;
      }

      setRegistrations((current) => current.filter((item) => item.id !== deletingReg.id));
      if (selectedReg?.id === deletingReg.id) {
        setSelectedReg(null);
      }
      toast.success(`Đã xoá đơn của ${deletingReg.full_name}`);
      setDeletingReg(null);
    } catch (error) {
      console.error("Lỗi xoá:", error);
      toast.error("Đã xảy ra lỗi khi xoá");
    } finally {
      setIsDeleting(false);
    }
  };

  // =========================
  // SAO CHÉP DANH SÁCH EMAIL
  // =========================
  const handleCopyEmails = async () => {
    const emails = filteredData
      .map((reg) => reg.email)
      .filter(Boolean)
      .join(", ");

    if (!emails) {
      toast.info("Không có email nào để sao chép");
      return;
    }

    try {
      await navigator.clipboard.writeText(emails);
      toast.success(`Đã sao chép ${filteredData.filter((r) => r.email).length} email`);
    } catch {
      toast.error("Không thể sao chép vào bộ nhớ tạm");
    }
  };

  // =========================
  // XUẤT FILE CSV
  // =========================
  const handleExportCSV = () => {
    if (filteredData.length === 0) {
      toast.info("Không có dữ liệu để xuất");
      return;
    }

    const headers = ["ID", "Tên", "Email", "Đối tượng", "Ngày đăng ký"];
    const rows = filteredData.map((reg) => [
      `"${reg.id}"`,
      `"${reg.full_name.replace(/"/g, '""')}"`,
      `"${reg.email.replace(/"/g, '""')}"`,
      `"${(reg.audience || "").replace(/"/g, '""')}"`,
      `"${new Date(reg.created_at).toLocaleString("vi-VN")}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `HIEC_Don_Dang_Ky_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Đã tải xuống file CSV đơn đăng ký");
  };

  return (
    <div className="space-y-6">
      {/* =========================
          TIÊU ĐỀ TRANG
      ========================= */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight">
            Quản lý đơn đăng ký
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Bảng theo dõi và quản lý dữ liệu người đăng ký từ Supabase
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchRegistrations}
            disabled={loading}
            className="font-semibold"
          >
            <RefreshCw className={`mr-2 size-4 ${loading ? "animate-spin" : ""}`} />
            Làm mới
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={handleExportCSV}
            disabled={filteredData.length === 0}
            className="font-semibold bg-primary text-primary-foreground"
          >
            <Download className="mr-2 size-4" />
            Xuất CSV
          </Button>
        </div>
      </div>

      {/* =========================
          CÁC THẺ THỐNG KÊ NHANH
      ========================= */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card
          onClick={() => setSelectedAudience("all")}
          className={`cursor-pointer transition-all hover:border-primary/50 ${
            selectedAudience === "all" ? "ring-2 ring-primary" : ""
          }`}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Tổng số đơn
            </CardTitle>
            <Users className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">{totalCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Tất cả đối tượng</p>
          </CardContent>
        </Card>

        <Card
          onClick={() => setSelectedAudience("Sinh viên")}
          className={`cursor-pointer transition-all hover:border-sky-500/50 ${
            selectedAudience === "Sinh viên" ? "ring-2 ring-sky-500" : ""
          }`}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Sinh viên
            </CardTitle>
            <GraduationCap className="size-4 text-sky-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-sky-600 dark:text-sky-400">{studentCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalCount > 0 ? Math.round((studentCount / totalCount) * 100) : 0}% tổng số đơn
            </p>
          </CardContent>
        </Card>

        <Card
          onClick={() => setSelectedAudience("Phụ huynh")}
          className={`cursor-pointer transition-all hover:border-emerald-500/50 ${
            selectedAudience === "Phụ huynh" ? "ring-2 ring-emerald-500" : ""
          }`}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Phụ huynh
            </CardTitle>
            <HeartHandshake className="size-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {parentCount}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalCount > 0 ? Math.round((parentCount / totalCount) * 100) : 0}% tổng số đơn
            </p>
          </CardContent>
        </Card>

        <Card
          onClick={() => setSelectedAudience("Doanh nghiệp")}
          className={`cursor-pointer transition-all hover:border-purple-500/50 ${
            selectedAudience === "Doanh nghiệp" ? "ring-2 ring-purple-500" : ""
          }`}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Doanh nghiệp
            </CardTitle>
            <Briefcase className="size-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-purple-600 dark:text-purple-400">
              {businessCount}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalCount > 0 ? Math.round((businessCount / totalCount) * 100) : 0}% tổng số đơn
            </p>
          </CardContent>
        </Card>
      </div>

      {/* =========================
          THÔNG BÁO LỖI (NẾU CÓ)
      ========================= */}
      {errorMessage && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="size-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <Button variant="outline" size="sm" onClick={fetchRegistrations} className="shrink-0">
            Thử lại
          </Button>
        </div>
      )}

      {/* =========================
          BẢNG DANH SÁCH DỮ LIỆU
      ========================= */}
      <Card className="overflow-hidden border-border shadow-sm">
        <CardHeader className="flex flex-col gap-4 border-b border-border/60 bg-muted/20 p-5 lg:flex-row lg:items-center lg:justify-between">
          {/* FILTER BUTTONS */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedAudience("all")}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                selectedAudience === "all"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              Tất cả ({totalCount})
            </button>
            <button
              onClick={() => setSelectedAudience("Sinh viên")}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                selectedAudience === "Sinh viên"
                  ? "bg-sky-500 text-white shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              Sinh viên ({studentCount})
            </button>
            <button
              onClick={() => setSelectedAudience("Phụ huynh")}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                selectedAudience === "Phụ huynh"
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              Phụ huynh ({parentCount})
            </button>
            <button
              onClick={() => setSelectedAudience("Doanh nghiệp")}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                selectedAudience === "Doanh nghiệp"
                  ? "bg-purple-500 text-white shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              Doanh nghiệp ({businessCount})
            </button>
          </div>

          {/* SEARCH + COPY ACTIONS */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm theo tên hoặc email..."
                className="w-full pl-9 sm:w-64 h-9 text-xs rounded-xl"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyEmails}
              disabled={filteredData.length === 0}
              className="h-9 font-semibold text-xs rounded-xl"
            >
              <Mail className="mr-1.5 size-3.5" />
              Copy Emails
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              {/* =========================
                  CỘT TIÊU ĐỀ BẢNG
              ========================= */}
              <TableHeader className="bg-muted/40">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-12 pl-5 font-bold text-xs uppercase tracking-wider text-muted-foreground">
                    #
                  </TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                    Tên
                  </TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                    Email
                  </TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                    Đối tượng
                  </TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                    Thời gian đăng ký
                  </TableHead>
                  <TableHead className="pr-5 text-right font-bold text-xs uppercase tracking-wider text-muted-foreground">
                    Thao tác
                  </TableHead>
                </TableRow>
              </TableHeader>

              {/* =========================
                  DỮ LIỆU CÁC HÀNG
              ========================= */}
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-40 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <RefreshCw className="size-6 animate-spin text-primary" />
                        <p className="text-sm font-medium">Đang tải danh sách từ Supabase...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-40 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center gap-2 py-6">
                        <UserCheck className="size-8 text-muted-foreground/50" />
                        <p className="text-base font-bold text-foreground">
                          {searchTerm || selectedAudience !== "all"
                            ? "Không tìm thấy kết quả phù hợp"
                            : "Chưa có đơn đăng ký nào trong hệ thống"}
                        </p>
                        <p className="text-xs text-muted-foreground max-w-md">
                          {searchTerm || selectedAudience !== "all"
                            ? "Hãy thử thay đổi từ khóa tìm kiếm hoặc bỏ chọn bộ lọc đối tượng."
                            : "Khi người dùng điền form tại trang Đăng ký (nút Theo dõi trên Header), thông tin sẽ xuất hiện tại đây theo thời gian thực."}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((reg, index) => (
                    <TableRow key={reg.id} className="hover:bg-muted/30 transition-colors">
                      {/* SỐ THỨ TỰ */}
                      <TableCell className="pl-5 text-xs text-muted-foreground font-medium">
                        {index + 1}
                      </TableCell>

                      {/* CỘT TÊN */}
                      <TableCell className="font-bold text-sm text-foreground">
                        <div className="flex items-center gap-2">
                          <div className="size-7 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs uppercase shrink-0">
                            {reg.full_name?.charAt(0) || "U"}
                          </div>
                          <span>{reg.full_name || "—"}</span>
                        </div>
                      </TableCell>

                      {/* CỘT EMAIL */}
                      <TableCell className="text-sm font-medium">
                        <a
                          href={`mailto:${reg.email}`}
                          className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary hover:underline"
                        >
                          <Mail className="size-3.5 shrink-0 opacity-60" />
                          <span>{reg.email}</span>
                        </a>
                      </TableCell>

                      {/* CỘT ĐỐI TƯỢNG */}
                      <TableCell>{getAudienceBadge(reg.audience)}</TableCell>

                      {/* CỘT THỜI GIAN ĐĂNG KÝ */}
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        {reg.created_at
                          ? new Date(reg.created_at).toLocaleString("vi-VN", {
                              hour: "2-digit",
                              minute: "2-digit",
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })
                          : "—"}
                      </TableCell>

                      {/* CỘT THAO TÁC */}
                      <TableCell className="pr-5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* NÚT XEM CHI TIẾT */}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent"
                            onClick={() => setSelectedReg(reg)}
                            title="Xem chi tiết"
                          >
                            <Eye className="size-4" />
                          </Button>

                          {/* NÚT SAO CHÉP EMAIL */}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent"
                            onClick={async () => {
                              await navigator.clipboard.writeText(reg.email);
                              toast.success(`Đã copy: ${reg.email}`);
                            }}
                            title="Sao chép email"
                          >
                            <Copy className="size-4" />
                          </Button>

                          {/* NÚT XOÁ */}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 rounded-lg text-destructive/70 hover:text-destructive hover:bg-destructive/10"
                            onClick={() => setDeletingReg(reg)}
                            title="Xoá đơn"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* =========================================
          MODAL XEM CHI TIẾT ĐƠN ĐĂNG KÝ
      ========================================= */}
      {selectedReg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-up">
          <div className="w-full max-w-md rounded-3xl bg-card border border-border p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-2xl bg-primary/20 text-primary flex items-center justify-center font-bold uppercase">
                  {selectedReg.full_name?.charAt(0) || "U"}
                </div>
                <div>
                  <h2 className="font-display text-lg font-bold">Chi tiết đơn đăng ký</h2>
                  <p className="text-xs text-muted-foreground">ID: {selectedReg.id}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full size-8"
                onClick={() => setSelectedReg(null)}
              >
                <X className="size-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="p-3 rounded-2xl bg-muted/40 space-y-1">
                <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                  Tên đầy đủ
                </p>
                <p className="text-base font-bold text-foreground">{selectedReg.full_name}</p>
              </div>

              <div className="p-3 rounded-2xl bg-muted/40 space-y-1">
                <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                  Địa chỉ Email
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground break-all">
                    {selectedReg.email}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={async () => {
                      await navigator.clipboard.writeText(selectedReg.email);
                      toast.success("Đã sao chép email");
                    }}
                  >
                    <Copy className="size-3 mr-1" />
                    Copy
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-muted/40 space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                    Đối tượng
                  </p>
                  <div className="pt-0.5">{getAudienceBadge(selectedReg.audience)}</div>
                </div>

                <div className="p-3 rounded-2xl bg-muted/40 space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                    Ngày đăng ký
                  </p>
                  <p className="text-xs font-semibold text-foreground">
                    {selectedReg.created_at
                      ? new Date(selectedReg.created_at).toLocaleString("vi-VN")
                      : "—"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/60">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl font-bold"
                onClick={() => setSelectedReg(null)}
              >
                Đóng
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  className="rounded-xl font-bold"
                  onClick={() => {
                    setDeletingReg(selectedReg);
                    setSelectedReg(null);
                  }}
                >
                  <Trash2 className="size-3.5 mr-1" />
                  Xoá đơn
                </Button>

                <a
                  href={`mailto:${selectedReg.email}?subject=HIEC%20-%20Th%C3%B4ng%20tin%20ch%C6%B0%C6%A1ng%20tr%C3%ACnh`}
                  className="inline-flex items-center justify-center rounded-xl bg-primary px-3 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <ExternalLink className="size-3.5 mr-1.5" />
                  Gửi Email
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================
          MODAL XÁC NHẬN XOÁ ĐƠN (IN-APP MODAL)
      ========================================= */}
      {deletingReg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-up">
          <div className="w-full max-w-sm rounded-3xl bg-card border border-border p-6 shadow-2xl space-y-5 text-center">
            <div className="size-14 rounded-full bg-destructive/15 text-destructive flex items-center justify-center mx-auto">
              <Trash2 className="size-7" />
            </div>

            <div>
              <h3 className="font-display text-lg font-bold text-foreground">
                Xác nhận xoá đơn đăng ký?
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Bạn sắp xoá thông tin của{" "}
                <span className="font-bold text-foreground">{deletingReg.full_name}</span> (
                {deletingReg.email}). Hành động này không thể hoàn tác trên Supabase.
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 rounded-xl font-bold"
                onClick={() => setDeletingReg(null)}
                disabled={isDeleting}
              >
                Huỷ bỏ
              </Button>
              <Button
                variant="destructive"
                className="flex-1 rounded-xl font-bold bg-destructive hover:bg-destructive/90"
                onClick={confirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Đang xoá..." : "Xác nhận xoá"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
