import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { Eye, Mail, Search, Trash2, Users, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  component: ApplicationsPage,
});

type Application = {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  audience: "Sinh viên" | "Phụ huynh" | "Doanh nghiệp" | string;
};

function ApplicationsPage() {
  const [registrations, setRegistrations] = React.useState<Application[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedReg, setSelectedReg] =
    React.useState<Application | null>(null);
  const [loading, setLoading] = React.useState(true);

  // =========================
  // LẤY DANH SÁCH TỪ SUPABASE
  // =========================
  const fetchRegistrations = React.useCallback(async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("applications")
      .select("id, created_at, full_name, email, audience")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Lỗi khi tải danh sách đăng ký:", error);
      toast.error("Không thể tải danh sách đăng ký");
      setLoading(false);
      return;
    }

    setRegistrations((data ?? []) as Application[]);
    setLoading(false);
  }, []);

  // =========================
  // LOAD + REALTIME
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
  // TÌM KIẾM THEO TÊN / EMAIL
  // =========================
  const filteredData = registrations.filter((reg) => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) return true;

    return (
      (reg.full_name || "").toLowerCase().includes(search) ||
      (reg.email || "").toLowerCase().includes(search)
    );
  });

  // =========================
  // XOÁ ĐĂNG KÝ
  // =========================
  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Bạn có chắc muốn xoá đăng ký này không?",
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("applications")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Lỗi khi xoá đăng ký:", error);
      toast.error("Xoá đăng ký thất bại");
      return;
    }

    setRegistrations((current) =>
      current.filter((item) => item.id !== id),
    );

    if (selectedReg?.id === id) {
      setSelectedReg(null);
    }

    toast.success("Đã xoá đăng ký");
  };

  // =========================
  // COPY EMAIL
  // =========================
  const handleCopyEmails = async () => {
    const emails = filteredData
      .map((reg) => reg.email)
      .filter(Boolean)
      .join(", ");

    if (!emails) {
      toast.info("Chưa có email để sao chép");
      return;
    }

    await navigator.clipboard.writeText(emails);

    toast.success(
      `Đã sao chép ${
        filteredData.filter((reg) => reg.email).length
      } email`,
    );
  };

  return (
    <div className="space-y-6">
      {/* =========================
          HEADER
      ========================= */}
      <div>
        <h1 className="font-display text-2xl font-bold">
          Đăng ký nhận thông tin
        </h1>

        <p className="text-sm text-muted-foreground">
          Hệ thống quản lý danh sách sinh viên đăng ký nhận thông tin
          và tham gia hệ sinh thái HIEC HUST.
        </p>
      </div>

      {/* =========================
          CARD DANH SÁCH
      ========================= */}
      <Card>
        <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="size-5 text-primary" />
              Danh sách đăng ký
            </CardTitle>

            <p className="mt-1 text-sm text-muted-foreground">
              {registrations.length} người đã đăng ký nhận thông tin
            </p>
          </div>

          {/* SEARCH + COPY */}
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="Tìm theo tên hoặc email..."
                className="w-full pl-9 sm:w-72"
              />
            </div>

            <Button
              variant="outline"
              onClick={handleCopyEmails}
            >
              <Mail className="mr-2 size-4" />
              Copy Emails
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto rounded-xl border">
            <Table>
              {/* =========================
                  TABLE HEADER
              ========================= */}
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">
                    Người đăng ký
                  </TableHead>

                  <TableHead>
                    Email
                  </TableHead>

                  <TableHead>
                    Đối tượng
                  </TableHead>

                  <TableHead>
                    Ngày đăng ký
                  </TableHead>

                  <TableHead className="pr-6 text-right">
                    Hành động
                  </TableHead>
                </TableRow>
              </TableHeader>

              {/* =========================
                  TABLE BODY
              ========================= */}
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-32 text-center text-muted-foreground"
                    >
                      Đang tải danh sách...
                    </TableCell>
                  </TableRow>
                ) : filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-32 text-center text-muted-foreground"
                    >
                      {searchTerm
                        ? "Không tìm thấy đăng ký phù hợp."
                        : "Chưa có người đăng ký."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((reg) => (
                    <TableRow key={reg.id}>
                      {/* HỌ TÊN */}
                      <TableCell className="pl-6 font-semibold">
                        {reg.full_name}
                      </TableCell>

                      {/* EMAIL */}
                      <TableCell>
                        {reg.email}
                      </TableCell>

                      {/* ĐỐI TƯỢNG */}
                      <TableCell>
                        <Badge variant="secondary">
                          {reg.audience}
                        </Badge>
                      </TableCell>

                      {/* NGÀY */}
                      <TableCell>
                        {new Date(
                          reg.created_at,
                        ).toLocaleString("vi-VN")}
                      </TableCell>

                      {/* ACTION */}
                      <TableCell className="pr-6 text-right">
                        <div className="flex justify-end gap-1">
                          {/* XEM */}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              setSelectedReg(reg)
                            }
                            aria-label="Xem chi tiết"
                          >
                            <Eye className="size-4" />
                          </Button>

                          {/* XOÁ */}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              handleDelete(reg.id)
                            }
                            aria-label="Xoá đăng ký"
                            className="text-destructive hover:text-destructive"
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

      {/* =========================
          MODAL CHI TIẾT
      ========================= */}
      {selectedReg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-card p-6 shadow-2xl">
            {/* HEADER MODAL */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="font-display text-xl font-bold">
                  Chi tiết đăng ký
                </h2>

                <p className="text-sm text-muted-foreground">
                  Thông tin người đăng ký nhận tin
                </p>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedReg(null)}
              >
                <X className="size-4" />
              </Button>
            </div>

            {/* CONTENT */}
            <div className="space-y-5">
              {/* HỌ TÊN */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Họ và tên
                </p>

                <p className="mt-1 font-semibold">
                  {selectedReg.full_name}
                </p>
              </div>

              {/* EMAIL */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Email
                </p>

                <p className="mt-1 break-all">
                  {selectedReg.email}
                </p>
              </div>

              {/* ĐỐI TƯỢNG */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Đối tượng
                </p>

                <div className="mt-1">
                  <Badge variant="secondary">
                    {selectedReg.audience}
                  </Badge>
                </div>
              </div>

              {/* THỜI GIAN */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Ngày đăng ký
                </p>

                <p className="mt-1">
                  {new Date(
                    selectedReg.created_at,
                  ).toLocaleString("vi-VN")}
                </p>
              </div>
            </div>

            {/* FOOTER */}
            <div className="mt-6 flex justify-end">
              <Button
                variant="outline"
                onClick={() => setSelectedReg(null)}
              >
                Đóng
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
