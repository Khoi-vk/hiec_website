import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CheckCircle, ChevronDown, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/auth/field-error";
import { signupSchema, type SignupValues } from "@/lib/validators/auth-validator";
import { supabase } from "@/utils/supabase";

const audienceOptions = ["Sinh viên", "Phụ huynh", "Doanh nghiệp"] as const;

export function NewsletterCard({ popup = false }: { popup?: boolean }) {
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
  });

  const onSubmit = async (values: SignupValues) => {
    try {
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
      toast.success("Đăng ký nhận thông tin thành công!");
    } catch (error) {
      console.error("Lỗi hệ thống:", error);
      toast.error("Đã xảy ra lỗi!", {
        description: "Vui lòng kiểm tra lại kết nối mạng.",
      });
    }
  };

  const card = (
    <div className="relative w-full max-w-lg rounded-3xl border border-border bg-card p-7 text-card-foreground shadow-2xl sm:p-10">
          {/* NÚT QUAY LẠI TRANG CHỦ */}
          

          {isSubmitted ? (
            /* MÀN ĐĂNG KÝ THÀNH CÔNG */
            <div className="py-8 text-center animate-fade-up">
              <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-primary/20 text-primary">
                <CheckCircle className="size-12" />
              </div>

              <h3 className="mb-4 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                Đăng ký nhận tin thành công!
              </h3>

              <p className="mb-8 text-sm font-medium leading-relaxed text-muted-foreground">
                Cảm ơn bạn đã quan tâm đến HIEC! Chúng mình sẽ sớm gửi thông tin mới nhất tới bạn.
              </p>

              <Button
                type="button"
                variant="outline"
                className="w-full rounded-2xl py-6 text-xs font-bold uppercase tracking-wider text-foreground transition-all"
                onClick={() => {
                  setIsSubmitted(false);
                  reset();
                }}
              >
                Đăng ký email khác
              </Button>
            </div>
          ) : (
            /* FORM ĐĂNG KÝ NHẬN THÔNG TIN */
            <>
              <div className="mb-8 text-center">
                <h3 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                  ĐĂNG KÝ NHẬN THÔNG TIN
                </h3>

                <p className="mt-2 text-sm text-muted-foreground">
                  Hãy để chúng mình giúp bạn hiểu rõ hơn về HIEC nhé!
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* HỌ VÀ TÊN */}
                <div className="space-y-2 text-left">
                  <Label className="ml-1 text-xs font-bold uppercase tracking-wider text-foreground">
                    Họ và tên <span className="text-destructive">*</span>
                  </Label>

                  <Input
                    {...register("fullName")}
                    placeholder="Nguyễn Văn A"
                    className="h-12 rounded-2xl border border-border bg-background px-5 font-bold text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                  />

                  <FieldError message={errors.fullName?.message} />
                </div>

                {/* EMAIL */}
                <div className="space-y-2 text-left">
                  <Label className="ml-1 text-xs font-bold uppercase tracking-wider text-foreground">
                    Email <span className="text-destructive">*</span>
                  </Label>

                  <Input
                    {...register("email")}
                    type="email"
                    placeholder="name@example.com"
                    className="h-12 rounded-2xl border border-border bg-background px-5 font-bold text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                  />

                  <FieldError message={errors.email?.message} />
                </div>

                {/* ĐỐI TƯỢNG */}
                <div className="space-y-2 text-left">
                  <Label className="ml-1 text-xs font-bold uppercase tracking-wider text-foreground">
                    Đối tượng <span className="text-destructive">*</span>
                  </Label>

                  <div className="relative">
                    <select
                      {...register("audience")}
                      defaultValue=""
                      className="h-12 w-full appearance-none rounded-2xl border border-border bg-background px-5 pr-10 text-sm font-bold text-foreground outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="" disabled className="bg-background text-muted-foreground">
                        Chọn đối tượng
                      </option>

                      {audienceOptions.map((option) => (
                        <option
                          key={option}
                          value={option}
                          className="bg-background font-semibold text-foreground"
                        >
                          {option}
                        </option>
                      ))}
                    </select>

                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  </div>

                  <FieldError message={errors.audience?.message} />
                </div>

                {/* XÁC NHẬN */}
                <p className="pt-1 text-center text-sm leading-5 text-muted-foreground">
                  Khi ấn vào nút đăng ký, bạn đồng ý với việc nhận tin từ chúng tôi qua email.
                </p>

                {/* BUTTON */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={!isValid || isSubmitting}
                    className="h-12 w-full cursor-pointer rounded-2xl bg-primary text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-xl transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 size-5 animate-spin" />
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
  );

  return popup ? card : (
    <section className="px-5 pb-20 pt-4 lg:px-8 lg:pb-28">
      <div className="mx-auto flex justify-center">{card}</div>
    </section>
  );
}
