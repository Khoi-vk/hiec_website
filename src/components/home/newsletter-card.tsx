import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle, ChevronDown, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/auth/field-error";
import { signupSchema, type SignupValues } from "@/lib/validators/auth-validator";
import { supabase } from "@/utils/supabase";

const audienceOptions = ["Sinh viên", "Phụ huynh", "Doanh nghiệp"] as const;

export function NewsletterCard() {
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="px-5 pb-20 pt-4 lg:px-8 lg:pb-28">
      <div className="mx-auto flex justify-center">
        {/* CARD CONTAINER WITH EXACT PRESERVED SIZE & STYLING */}
        <div className="relative w-full max-w-lg rounded-[2.5rem] bg-[#07191d] p-7 text-white shadow-2xl border border-white/10 sm:p-10 dark:bg-[#061418]">
          {/* NÚT QUAY LẠI TRANG CHỦ */}
          

          {isSubmitted ? (
            /* MÀN ĐĂNG KÝ THÀNH CÔNG */
            <div className="py-8 text-center animate-fade-up">
              <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-primary/20 text-primary">
                <CheckCircle className="size-12" />
              </div>

              <h3 className="mb-4 font-display text-2xl font-black tracking-tight text-white sm:text-3xl">
                Đăng ký nhận tin thành công!
              </h3>

              <p className="mb-8 text-base font-medium leading-relaxed text-slate-300">
                Cảm ơn bạn đã quan tâm đến HIEC! Chúng mình sẽ sớm gửi thông tin mới nhất tới bạn.
              </p>

              <Button
                type="button"
                variant="shimmer"
                className="w-full rounded-2xl bg-white py-6 text-xs font-black uppercase tracking-widest text-[#07191d] transition-all hover:bg-slate-200"
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
                <h3 className="font-display text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">
                  ĐĂNG KÝ NHẬN THÔNG TIN
                </h3>

                <p className="mt-2 text-xs font-bold italic text-slate-300">
                  Hãy để chúng mình giúp bạn hiểu rõ hơn về HIEC nhé!
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* HỌ VÀ TÊN */}
                <div className="space-y-2 text-left">
                  <Label className="ml-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Họ và tên <span className="text-red-400">*</span>
                  </Label>

                  <Input
                    {...register("fullName")}
                    placeholder="Nguyễn Văn A"
                    className="h-12 rounded-full border-none bg-slate-50 px-5 font-bold text-slate-900 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-primary/50"
                  />

                  <FieldError message={errors.fullName?.message} />
                </div>

                {/* EMAIL */}
                <div className="space-y-2 text-left">
                  <Label className="ml-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Email <span className="text-red-400">*</span>
                  </Label>

                  <Input
                    {...register("email")}
                    type="email"
                    placeholder="name@example.com"
                    className="h-12 rounded-full border-none bg-slate-50 px-5 font-bold text-slate-900 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-primary/50"
                  />

                  <FieldError message={errors.email?.message} />
                </div>

                {/* ĐỐI TƯỢNG */}
                <div className="space-y-2 text-left">
                  <Label className="ml-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Đối tượng <span className="text-red-400">*</span>
                  </Label>

                  <div className="relative">
                    <select
                      {...register("audience")}
                      defaultValue=""
                      className="h-12 w-full appearance-none rounded-full border-none bg-slate-50 px-5 pr-10 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="" disabled className="text-slate-400">
                        Chọn đối tượng
                      </option>

                      {audienceOptions.map((option) => (
                        <option
                          key={option}
                          value={option}
                          className="text-slate-900 font-semibold"
                        >
                          {option}
                        </option>
                      ))}
                    </select>

                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
                  </div>

                  <FieldError message={errors.audience?.message} />
                </div>

                {/* XÁC NHẬN */}
                <p className="pt-1 text-center text-[11px] font-bold leading-5 text-slate-400">
                  Khi ấn vào nút đăng ký, bạn đồng ý với việc nhận tin từ chúng tôi qua email.
                </p>

                {/* BUTTON */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={!isValid || isSubmitting}
                    className={`w-full rounded-2xl py-7 text-sm font-black uppercase tracking-[0.15em] shadow-xl transition-all ${
                      isValid && !isSubmitting
                        ? "bg-[#6c868c] text-white hover:bg-[#5b7379] active:scale-[0.99]"
                        : "cursor-not-allowed bg-[#586b70]/60 text-slate-300"
                    }`}
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
      </div>
    </section>
  );
}
