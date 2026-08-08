import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import * as React from "react";
import { CheckCircle, Home, LogIn } from "lucide-react"; // Thêm icon

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FieldError } from "@/components/auth/field-error";
import { PasswordInput } from "@/components/auth/password-input";
import { HiecLogo } from "@/components/ui/hiec-logo";
import { signupSchema, type SignupValues } from "@/lib/validators/auth-validator";
import { supabase } from "@/utils/supabase";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  // Trạng thái để kiểm tra đã nộp đơn thành công hay chưa
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
        }
      ]);

      if (error) {
        console.error("Lỗi khi lưu lên Supabase:", error);
        toast.error("Gửi đơn thất bại!", {
          description: "Hệ thống đang bận, vui lòng thử lại sau.",
        });
        return;
      }

      // THÀNH CÔNG: Thay vì chuyển trang ngay, ta đổi trạng thái giao diện
      console.log("Đã lưu đơn mới lên Supabase:", values);
      toast.success("Gửi đơn thành công!");
      setIsSubmitted(true); // Kích hoạt màn hình thông báo thành công
      
    } catch (e) {
      console.error("Lỗi hệ thống không xác định:", e);
      toast.error("Đã xảy ra lỗi!", {
        description: "Vui lòng kiểm tra lại kết nối mạng.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero py-10 px-4 flex flex-col items-center">
      <Link to="/" className="mb-8 hover:scale-105 transition-transform">
        <HiecLogo isDark={true} className="scale-125" />
      </Link>

      <div className="w-full max-w-2xl bg-card/95 backdrop-blur-md rounded-3xl p-8 shadow-elevated border border-white/10">
        
        {isSubmitted ? (
          /* GIAO DIỆN SAU KHI NỘP THÀNH CÔNG */
          <div className="py-10 text-center animate-fade-up">
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
                  3. CLB sẽ liên hệ trực tiếp với bạn qua <strong>Email</strong> hoặc <strong>Số điện thoại</strong> để thông báo lịch trình.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button 
                variant="shimmer" 
                className="py-6 font-bold uppercase tracking-wider"
                onClick={() => navigate({ to: "/" })}
              >
                <Home className="size-5 mr-2" /> Quay lại trang chủ
              </Button>
              
              <Button 
                variant="outline" 
                className="py-6 font-bold uppercase tracking-wider"
                onClick={() => navigate({ to: "/login" })}
              >
                <LogIn className="size-5 mr-2" /> Đăng nhập theo dõi đơn
              </Button>
            </div>
          </div>
        ) : (
          /* GIAO DIỆN FORM ĐIỀN ĐƠN (Ban đầu) */
          <>
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

              <div className="md:col-span-2 space-y-2">
                <Label>Tại sao bạn muốn tham gia HIEC?</Label>
                <Textarea 
                  {...register("motivation")} 
                  placeholder="Chia sẻ mong muốn, mục tiêu của bạn khi vào CLB..." 
                  className="min-h-[120px] bg-background/50"
                />
                <FieldError message={errors.motivation?.message} />
              </div>

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
          </>
        )}
      </div>
      
      {!isSubmitted && (
        <div className="mt-8 text-white/70 text-sm">
          Đã có tài khoản? <Link to="/login" className="text-white font-bold hover:underline">Đăng nhập</Link>
        </div>
      )}
    </div>
  );
}