import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import * as React from "react";
import { ArrowLeft, CheckCircle, Home, LogIn } from "lucide-react";
import { HomePage } from "./index";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FieldError } from "@/components/auth/field-error";
import { PasswordInput } from "@/components/auth/password-input";
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
            motivation: values.motivation,
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
      <HomePage />

      {/* LỚP PHỦ MỜ */}
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/35 backdrop-blur-sm">

        <div className="min-h-full px-4 py-6 sm:px-6 sm:py-10 flex items-center justify-center">

          {/* CARD FORM */}
          <div className="relative w-full max-w-2xl rounded-3xl bg-card p-6 sm:p-8 shadow-2xl border border-white/40">

            {/* NÚT QUAY LẠI */}
            <button
              type="button"
              onClick={() => navigate({ to: "/" })}
              className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="size-4" />
              Quay lại trang chủ
            </button>

            {isSubmitted ? (

              /* =========================
                 GIAO DIỆN SAU KHI NỘP
                 ========================= */

              <div className="py-6 text-center animate-fade-up">

                <div className="size-20 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="size-12" />
                </div>

                <h1 className="font-display text-3xl font-black text-foreground mb-4">
                  Chúc mừng bạn đã gửi đơn thành công!
                </h1>

                <div className="space-y-4 mb-10 text-muted-foreground leading-relaxed">

                  <p className="text-lg text-foreground/80 font-medium">
                    Hành trình gia nhập HIEC của bạn đã chính thức bắt đầu!
                  </p>

                  <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10 text-left space-y-3">

                    <p className="text-sm">
                      1. Đơn ứng tuyển của bạn đã được chuyển tới Ban nhân sự để thẩm định.
                    </p>

                    <p className="text-sm font-bold text-primary italic">
                      2. Để trở thành thành viên chính thức, bạn cần trải qua một số thử thách tiếp theo (Phỏng vấn hoặc Test năng lực).
                    </p>

                    <p className="text-sm">
                      3. CLB sẽ liên hệ trực tiếp với bạn qua{" "}
                      <strong>Email</strong> hoặc{" "}
                      <strong>Số điện thoại</strong> để thông báo lịch trình.
                    </p>

                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <Button
                    variant="shimmer"
                    className="py-6 font-bold uppercase tracking-wider"
                    onClick={() => navigate({ to: "/" })}
                  >
                    <Home className="size-5 mr-2" />
                    Quay lại trang chủ
                  </Button>

                  <Button
                    variant="outline"
                    className="py-6 font-bold uppercase tracking-wider"
                    onClick={() => navigate({ to: "/login" })}
                  >
                    <LogIn className="size-5 mr-2" />
                    Đăng nhập theo dõi đơn
                  </Button>

                </div>

              </div>

            ) : (

              /* =========================
                 FORM ĐĂNG KÝ
                 ========================= */

              <>

                <div className="mb-8 text-center">

                  <h1 className="font-display text-3xl font-black tracking-tight text-foreground">
                    Đơn Ứng Tuyển HIEC
                  </h1>

                  <p className="text-muted-foreground mt-2 italic">
                    Hãy để chúng mình hiểu thêm về bạn nhé!
                  </p>

                </div>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >

                  {/* HỌ VÀ TÊN */}
                  <div className="space-y-2">

                    <Label>Họ và tên</Label>

                    <Input
                      {...register("fullName")}
                      placeholder="Nguyễn Văn A"
                      className="bg-background/50"
                    />

                    <FieldError message={errors.fullName?.message} />

                  </div>


                  {/* MSSV */}
                  <div className="space-y-2">

                    <Label>Mã số sinh viên</Label>

                    <Input
                      {...register("studentId")}
                      placeholder="xxxxxxxxx"
                      className="bg-background/50"
                    />

                    <FieldError message={errors.studentId?.message} />

                  </div>


                  {/* TRƯỜNG */}
                  <div className="space-y-2">

                    <Label>Trường đại học</Label>

                    <Input
                      {...register("university")}
                      placeholder="ĐH Bách Khoa Hà Nội"
                      className="bg-background/50"
                    />

                    <FieldError message={errors.university?.message} />

                  </div>


                  {/* NGÀNH */}
                  <div className="space-y-2">

                    <Label>Ngành học</Label>

                    <Input
                      {...register("major")}
                      placeholder="IT1 - CNTT: Khoa học máy tính"
                      className="bg-background/50"
                    />

                    <FieldError message={errors.major?.message} />

                  </div>


                  {/* EMAIL */}
                  <div className="space-y-2">

                    <Label>Email cá nhân</Label>

                    <Input
                      {...register("email")}
                      type="email"
                      placeholder="name@example.com"
                      className="bg-background/50"
                    />

                    <FieldError message={errors.email?.message} />

                  </div>


                  {/* SĐT */}
                  <div className="space-y-2">

                    <Label>Số điện thoại</Label>

                    <Input
                      {...register("phone")}
                      placeholder="0xxxxxxxxx"
                      className="bg-background/50"
                    />

                    <FieldError message={errors.phone?.message} />

                  </div>


                  {/* LÝ DO */}
                  <div className="md:col-span-2 space-y-2">

                    <Label>
                      Tại sao bạn muốn tham gia HIEC?
                    </Label>

                    <Textarea
                      {...register("motivation")}
                      placeholder="Chia sẻ mong muốn, mục tiêu của bạn khi vào CLB..."
                      className="min-h-[120px] bg-background/50"
                    />

                    <FieldError message={errors.motivation?.message} />

                  </div>


                  {/* PASSWORD */}
                  <div className="space-y-2">

                    <Label>
                      Mật khẩu (để theo dõi kết quả Đơn)
                    </Label>

                    <PasswordInput
                      {...register("password")}
                    />

                    <FieldError message={errors.password?.message} />

                  </div>


                  {/* CONFIRM PASSWORD */}
                  <div className="space-y-2">

                    <Label>
                      Xác nhận mật khẩu
                    </Label>

                    <PasswordInput
                      {...register("confirmPassword")}
                    />

                    <FieldError message={errors.confirmPassword?.message} />

                  </div>


                  {/* SUBMIT */}
                  <div className="md:col-span-2 pt-4">

                    <Button
                      type="submit"
                      variant={isValid ? "shimmer" : "default"}
                      className="w-full py-6 text-lg font-bold uppercase tracking-widest"
                      disabled={!isValid || isSubmitting}
                    >
                      {isSubmitting
                        ? "Đang gửi đơn..."
                        : "Nộp đơn ứng tuyển"}
                    </Button>

                    <p className="text-center text-xs text-muted-foreground mt-4">
                      Dữ liệu của bạn sẽ được bảo mật và chỉ dùng cho mục đích tuyển thành viên CLB.
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
