import { z } from "zod";

/**
 * Validation rules taken verbatim from Docs-BA-3.pdf.
 * Messages are kept in Vietnamese exactly as specified in the BA document.
 */

export const PASSWORD_MESSAGE =
  "Mật khẩu cần tối thiểu 6 ký tự, có ít nhất 1 chữ hoa, 1 ký tự đặc biệt, 1 chữ số";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const phoneRegex = /^\d{10,15}$/;

export const passwordSchema = z
  .string()
  .min(1, "Vui lòng nhập mật khẩu")
  .min(6, PASSWORD_MESSAGE)
  .regex(/[A-Z]/, PASSWORD_MESSAGE)
  .regex(/\d/, PASSWORD_MESSAGE)
  .regex(/[^A-Za-z0-9]/, PASSWORD_MESSAGE);

/** Email hợp lệ hoặc số điện thoại 10–15 số */
export const identifierSchema = z
  .string()
  .min(1, "Vui lòng nhập email hoặc số điện thoại")
  .refine((value) => emailRegex.test(value) || phoneRegex.test(value.replace(/[\s.+-]/g, "")), {
    message: "Định dạng email hoặc số điện thoại không hợp lệ",
  });

export const loginSchema = z.object({
  identifier: identifierSchema,
  password: passwordSchema,
});
export type LoginValues = z.infer<typeof loginSchema>;

export const signUpSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Tên phải gồm từ 2 - 50 ký tự. Vui lòng thử lại.")
      .max(50, "Tên phải gồm từ 2 - 50 ký tự. Vui lòng thử lại.")
      .regex(/^[\p{L}\s'.-]+$/u, "Tên không được chứa ký tự đặc biệt"),
    email: z
      .string()
      .min(1, "Vui lòng nhập email")
      .regex(emailRegex, "Định dạng email không hợp lệ")
      .max(255),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
    acceptTerms: z.literal(true, {
      errorMap: () => ({ message: "Bạn cần đồng ý Điều khoản dịch vụ và Chính sách bảo mật" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Mật khẩu xác nhận không khớp",
  });
export type SignUpValues = z.infer<typeof signUpSchema>;

/** Forgot password — step 1: email / phone */
export const forgotIdentifierSchema = z.object({
  identifier: identifierSchema,
});
export type ForgotIdentifierValues = z.infer<typeof forgotIdentifierSchema>;

/** Forgot password — step 2: 6 digit OTP */
export const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "Mã xác nhận gồm đúng 6 ký tự số")
    .regex(/^\d{6}$/, "Mã xác nhận gồm đúng 6 ký tự số"),
});
export type OtpValues = z.infer<typeof otpSchema>;

/** Forgot password — step 3: new password */
export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Vui lòng nhập lại mật khẩu"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Mật khẩu nhập lại không khớp",
  });
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Vui lòng nhập mật khẩu hiện tại"),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Vui lòng nhập lại mật khẩu"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Mật khẩu nhập lại không khớp",
  });
export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

export const isEmail = (value: string) => emailRegex.test(value);
