import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import * as React from "react";
import { ArrowLeft, CheckCircle, Home, LogIn, Loader2 } from "lucide-react";
import { HomePage } from "./index";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/auth/field-error";
import {
  signupSchema,
  type SignupValues,
} from "@/lib/validators/auth-validator";
import { supabase } from "@/utils/supabase";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
  });

  const onSubmit = async (values: SignupValues) => {
    try {
      const { error } = await supabase
        .from("applications")
        .insert([
          {
            fullName: values.fullName,
            studentId: values.studentId,
            university: values.university,
            major: values.major,
            email: values.email,
            phone: values.phone,
            motivation: "Đăng ký nhận thông tin", // Gửi giá trị mặc định vì đã xóa ô nhập
            status: "pending",
          },
        ]);

      if (error) {
        console.error("Lỗi khi lưu lên Supabase:", error);
        toast.error("Gửi đơn thất bại!", {
          description: "Hệ thống đang bận, vui lòng thử lại sau.",
        });
        return;
      }

      toast.success("Gửi đơn thành công!");
      setIsSubmitted(true);
    } catch (e) {
      console.error("Lỗi hệ thống không xác định:", e);
      toast.error("Đã xảy ra lỗi!", {
        description: "Vui lòng kiểm tra lại kết nối mạng.",
      });
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* TRANG CHỦ LÀM NỀN */}
      <div className="fixed inset-0 z-0 opacity-40 grayscale-[0.3]">
        <HomePage />
      </div>

      {/* LỚP PHỦ MỜ */}
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/40 backdrop-blur-md">
        <div className="min-h-full px-4 py-6 flex items-center justify-center">

          {/* CARD FORM - Thu nhỏ lại thành max-w-lg cho đẹp và không tràn */}
          <div className="relative w-full max-w-lg rounded-[2.5rem] bg-card p-6 sm:p-10 shadow-2xl border border-white/20">

            {/* NÚT QUAY LẠI */}
            <button
              type="button"
              onClick={() => navigate({ to: "/" })}
              className="mb-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-[#0f3d3e] transition-colors"
            >
              <ArrowLeft className="size-3" />
              Quay lại trang chủ
            </button>

            {isSubmitted ? (
              /* GIAO DIỆN SAU KHI NỘP - GIỮ NGUYÊN NỘI DUNG CỦA ÔNG */
              <div className="py-6 text-center animate-fade-up">
                <div className="size-20 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="size-12" />
                </div>
                <h1 className="font-display text-3xl font-black text-[#0f3d3e] mb-4 uppercase tracking-tighter">
                  Chúc mừng bạn đã gửi đơn thành công!
                </h1>
                <div className="space-y-4 mb-10 text-slate-500 leading-relaxed text-left">
                  <p className="text-lg font-medium text-center">
                    Cảm ơn bạn đã quan tâm đến HIEC!
                  </p>
                  <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10 space-y-3">
                    <p className="text-sm">
                      1. Đơn đăng kí nhận thông tin của bạn đã được chuyển tới Ban Nhân sự - Sự kiện.
                    </p>
                    <p className="text-sm">
                      2. CLB sẽ gửi thông tin đến bạn qua{" "}
                      <strong>Email</strong> hoặc{" "}
                      <strong>Số điện thoại.</strong>
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <Button
                    variant="shimmer"
                    className="py-7 rounded-2xl font-black uppercase tracking-widest bg-[#0f3d3e] text-white"
                    onClick={() => navigate({ to: "/" })}
                  >
                    <Home className="size-5 mr-2" />
                    Quay lại trang chủ
                  </Button>
                </div>
              </div>
            ) : (
              /* FORM ĐĂNG KÝ */
              <>
                <div className="mb-8 text-center">
                  <h1 className="font-display text-2xl font-black tracking-tight text-[#0f3d3e] uppercase">
                    ĐĂNG KÍ NHẬN THÔNG TIN TỪ HIEC
                  </h1>
                  <p className="text-slate-400 text-xs font-bold mt-2 italic">
                    Hãy để chúng mình giúp bạn hiểu rõ hơn về HIEC nhé!
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-1.5 text-left">
                    <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Họ và tên</Label>
                    <Input {...register("fullName")} placeholder="Nguyễn Văn A" className="rounded-xl bg-slate-50 border-none h-11 font-bold" />
                    <FieldError message={errors.fullName?.message} />
                  </div>

                  <div className="space-y-1.5 text-left">
                    <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Mã số sinh viên</Label>
                    <Input {...register("studentId")} placeholder="202xxxxxx" className="rounded-xl bg-slate-50 border-none h-11 font-bold" />
                    <FieldError message={errors.studentId?.message} />
                  </div>

                  <div className="space-y-1.5 text-left">
                    <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Trường đại học</Label>
                    <Input {...register("university")} placeholder="Đại học Bách Khoa Hà Nội" className="rounded-xl bg-slate-50 border-none h-11 font-bold" />
                    <FieldError message={errors.university?.message} />
                  </div>

                  <div className="space-y-1.5 text-left">
                    <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Ngành học</Label>
                    <Input {...register("major")} placeholder="Khoa học máy tính" className="rounded-xl bg-slate-50 border-none h-11 font-bold" />
                    <FieldError message={errors.major?.message} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5 text-left">
                      <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Email cá nhân</Label>
                      <Input {...register("email")} type="email" placeholder="name@example.com" className="rounded-xl bg-slate-50 border-none h-11 font-bold" />
                      <FieldError message={errors.email?.message} />
                    </div>

                    <div className="space-y-1.5 text-left">
                      <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Số điện thoại</Label>
                      <Input {...register("phone")} placeholder="0xxxxxxxxx" className="rounded-xl bg-slate-50 border-none h-11 font-bold" />
                      <FieldError message={errors.phone?.message} />
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full py-8 text-base font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl transition-all cursor-pointer ${
                        isValid ? "bg-[#0f3d3e] text-white hover:bg-[#1a2e35]" : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {isSubmitting ? <Loader2 className="animate-spin size-5" /> : "Nộp đơn đăng kí ngay"}
                    </Button>
                    <p className="text-center text-[10px] text-slate-400 font-bold uppercase mt-4">
                      Khi ấn vào nút đăng ký, bạn đồng ý với việc nhận tin từ chúng tôi qua email.
                    </p>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}