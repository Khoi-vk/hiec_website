import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import * as React from "react";
import { ArrowLeft, CheckCircle, Home, Loader2, ChevronDown } from "lucide-react";
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

const audienceOptions = [
  "Sinh viên",
  "Phụ huynh",
  "Doanh nghiệp",
] as const;

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
      // Kiểm tra email đã đăng ký hay chưa
      const { error } = await supabase.from("applications").insert({
        full_name: values.fullName.trim(),
        email: values.email.trim().toLowerCase(),
        audience: values.audience,
      });
      
      if (error) {
        console.error("Lỗi khi lưu lên Supabase:", error);
      
        if (error.code === "23505") {
          toast.error("Email này đã đăng ký nhận thông tin.");
          return;
        }
      
        toast.error("Đăng ký thất bại!", {
          description: "Hệ thống đang bận, vui lòng thử lại sau.",
        });
      
        return;
      }
      
      setIsSubmitted(true);

      // Lưu đăng ký mới
      const { error } = await supabase.from("applications").insert({
        full_name: values.fullName.trim(),
        email: values.email.trim().toLowerCase(),
        audience: values.audience,
      });

      if (error) {
        console.error("Lỗi khi lưu lên Supabase:", error);

        toast.error("Đăng ký thất bại!", {
          description: "Hệ thống đang bận, vui lòng thử lại sau.",
        });

        return;
      }

      setIsSubmitted(true);
    } catch (error) {
      console.error("Lỗi hệ thống:", error);

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

          {/* CARD */}
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
              /* =========================
                 MÀN ĐĂNG KÝ THÀNH CÔNG
                 ========================= */
              <div className="py-6 text-center animate-fade-up">
                <div className="size-20 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="size-12" />
                </div>

                <h1 className="font-display text-3xl font-black text-[#0f3d3e] mb-4 tracking-tight">
                  Đăng ký nhận tin thành công!
                </h1>

                <p className="text-lg font-medium text-slate-500 leading-relaxed mb-10">
                  Cảm ơn bạn đã quan tâm đến HIEC!
                </p>

                <Button
                  variant="shimmer"
                  className="w-full py-7 rounded-2xl font-black uppercase tracking-widest bg-[#0f3d3e] text-white"
                  onClick={() => navigate({ to: "/" })}
                >
                  <Home className="size-5 mr-2" />
                  Quay lại trang chủ
                </Button>
              </div>
            ) : (
              /* =========================
                 FORM ĐĂNG KÝ NHẬN THÔNG TIN
                 ========================= */
              <>
                <div className="mb-8 text-center">
                  <h1 className="font-display text-2xl font-black tracking-tight text-[#0f3d3e] uppercase">
                    ĐĂNG KÝ NHẬN THÔNG TIN
                  </h1>

                  <p className="text-slate-400 text-xs font-bold mt-2 italic">
                    Hãy để chúng mình giúp bạn hiểu rõ hơn về HIEC nhé!
                  </p>
                </div>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-5"
                >
                  {/* HỌ VÀ TÊN */}
                  <div className="space-y-1.5 text-left">
                    <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                      Họ và tên{" "}
                      <span className="text-red-500">*</span>
                    </Label>

                    <Input
                      {...register("fullName")}
                      placeholder="Nguyễn Văn A"
                      className="rounded-xl bg-slate-50 border-none h-11 font-bold"
                    />

                    <FieldError message={errors.fullName?.message} />
                  </div>

                  {/* EMAIL */}
                  <div className="space-y-1.5 text-left">
                    <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                      Email{" "}
                      <span className="text-red-500">*</span>
                    </Label>

                    <Input
                      {...register("email")}
                      type="email"
                      placeholder="name@example.com"
                      className="rounded-xl bg-slate-50 border-none h-11 font-bold"
                    />

                    <FieldError message={errors.email?.message} />
                  </div>

                  {/* ĐỐI TƯỢNG */}
                  <div className="space-y-1.5 text-left">
                    <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                      Đối tượng{" "}
                      <span className="text-red-500">*</span>
                    </Label>

                    <div className="relative">
                      <select
                        {...register("audience")}
                        defaultValue=""
                        className={`w-full h-11 appearance-none rounded-xl bg-slate-50 border-none px-3 pr-10 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/30 ${
                          !errors.audience
                            ? "text-slate-700"
                            : "text-slate-700"
                        }`}
                      >
                        <option value="" disabled>
                          Chọn đối tượng
                        </option>

                        {audienceOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>

                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    </div>

                    <FieldError message={errors.audience?.message} />
                  </div>

                  {/* XÁC NHẬN */}
                  <p className="pt-2 text-center text-[10px] leading-5 text-slate-400 font-bold">
                    Khi ấn vào nút đăng ký, bạn đồng ý với việc nhận tin từ
                    chúng tôi qua email.
                  </p>

                  {/* BUTTON */}
                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={!isValid || isSubmitting}
                      className={`w-full py-8 text-base font-black uppercase tracking-[0.15em] rounded-2xl shadow-xl transition-all ${
                        isValid && !isSubmitting
                          ? "bg-[#0f3d3e] text-white hover:bg-[#1a2e35]"
                          : "bg-slate-100 text-slate-400 cursor-not-allowed"
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="animate-spin size-5 mr-2" />
                          Đang đăng ký...
                        </>
                      ) : (
                        "Đăng ký nhận tin"
                      )}
                    </Button>
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
