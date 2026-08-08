import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import * as React from "react";

import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FieldError } from "@/components/auth/field-error";
import { PasswordInput } from "@/components/auth/password-input";
import { HiecLogo } from "@/components/ui/hiec-logo";
import { signupSchema, type SignupValues } from "@/lib/validators/auth-validator";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
  });

  const onSubmit = async (values: SignupValues) => {
    // Lưu đơn ứng tuyển vào localStorage để Admin nhận được dữ liệu
    try {
      const defaultInitial = [
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

      const rawSaved = localStorage.getItem("hiec_applications");
      const existingApps = rawSaved ? JSON.parse(rawSaved) : defaultInitial;
      
      const newApp = {
        id: `APP-${String(existingApps.length + 1).padStart(3, "0")}`,
        fullName: values.fullName || "",
        studentId: values.studentId || "",
        university: values.university || "",
        major: values.major || "",
        email: values.email || "",
        phone: values.phone || "",
        status: "pending",
        motivation: values.motivation || "",
        createdAt: new Date().toISOString(),
      };

      const updatedApps = [newApp, ...existingApps];
      localStorage.setItem("hiec_applications", JSON.stringify(updatedApps));
      window.dispatchEvent(new Event("hiec_app_submitted"));
    } catch (e) {
      console.error("Lỗi khi lưu đơn ứng tuyển:", e);
    }

    await new Promise((r) => setTimeout(r, 1000));
    console.log("Đơn ứng tuyển mới:", values);
    toast.success("Gửi đơn thành công!", {
      description: "Ban nhân sự HIEC sẽ liên hệ với bạn sớm nhất qua Email/SĐT.",
    });
    navigate({ to: "/login" });
  };

  return (
    <div className="min-h-screen bg-gradient-hero py-10 px-4 flex flex-col items-center">
      {/* Logo Sáng rực rỡ trên nền tối */}
      <Link to="/" className="mb-8 hover:scale-105 transition-transform">
        <HiecLogo isDark={true} className="scale-125" />
      </Link>

      <div className="w-full max-w-2xl bg-card/95 backdrop-blur-md rounded-3xl p-8 shadow-elevated border border-white/10">
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-black tracking-tight text-foreground">Đơn Ứng Tuyển HIEC</h1>
          <p className="text-muted-foreground mt-2 italic">Hãy để chúng mình hiểu thêm về bạn nhé!</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Thông tin cá nhân */}
          <div className="space-y-2">
            <Label>Họ và tên</Label>
            <Input {...register("fullName")} placeholder="Nguyễn Văn A" className="bg-background/50" />
            <FieldError message={errors.fullName?.message} />
          </div>

          <div className="space-y-2">
            <Label>Mã số sinh viên</Label>
            <Input {...register("studentId")} placeholder="xxxxxxxxx" className="bg-background/50" />
            <FieldError message={errors.studentId?.message} />
          </div>

          <div className="space-y-2">
            <Label>Trường đại học</Label>
            <Input {...register("university")} placeholder="ĐH Bách Khoa Hà Nội" className="bg-background/50" />
            <FieldError message={errors.university?.message} />
          </div>

          <div className="space-y-2">
            <Label>Ngành học</Label>
            <Input {...register("major")} placeholder="IT1 - CNTT: Khoa học máy tính" className="bg-background/50" />
            <FieldError message={errors.major?.message} />
          </div>

          <div className="space-y-2">
            <Label>Email cá nhân</Label>
            <Input {...register("email")} type="email" placeholder="name@example.com" className="bg-background/50" />
            <FieldError message={errors.email?.message} />
          </div>

          <div className="space-y-2">
            <Label>Số điện thoại</Label>
            <Input {...register("phone")} placeholder="0xxxxxxxxx" className="bg-background/50" />
            <FieldError message={errors.phone?.message} />
          </div>

          {/* Câu hỏi ứng tuyển */}
          <div className="md:col-span-2 space-y-2">
            <Label>Tại sao bạn muốn tham gia HIEC?</Label>
            <Textarea 
              {...register("motivation")} 
              placeholder="Chia sẻ mong muốn, mục tiêu của bạn khi vào CLB..." 
              className="min-h-[120px] bg-background/50"
            />
            <FieldError message={errors.motivation?.message} />
          </div>

          {/* Mật khẩu tài khoản web */}
          <div className="space-y-2">
            <Label>Mật khẩu (để theo dõi kết quả Đơn)</Label>
            <PasswordInput {...register("password")} />
            <FieldError message={errors.password?.message} />
          </div>

          <div className="space-y-2">
            <Label>Xác nhận mật khẩu</Label>
            <PasswordInput {...register("confirmPassword")} />
            <FieldError message={errors.confirmPassword?.message} />
          </div>

          <div className="md:col-span-2 pt-4">
            <Button 
              type="submit" 
              variant={isValid ? "shimmer" : "default"} 
              className="w-full py-6 text-lg font-bold uppercase tracking-widest" 
              disabled={!isValid || isSubmitting}
            >
              {isSubmitting ? "Đang gửi đơn..." : "Nộp đơn ứng tuyển"}
            </Button>
            <p className="text-center text-xs text-muted-foreground mt-4">
              Dữ liệu của bạn sẽ được bảo mật và chỉ dùng cho mục đích tuyển thành viên CLB.
            </p>
          </div>
        </form>
      </div>
      
      <div className="mt-8 text-white/70 text-sm">
        Đã có tài khoản? <Link to="/login" className="text-white font-bold hover:underline">Đăng nhập</Link>
      </div>
    </div>
  );
}
