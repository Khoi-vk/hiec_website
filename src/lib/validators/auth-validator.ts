import { z } from "zod";

/**
 * Validation rules taken verbatim from Docs-BA-3.pdf.
 * Messages are kept in Vietnamese exactly as specified in the BA document.
 */

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const phoneRegex = /^\d{10,15}$/;

export const passwordSchema = z
  .string()
  .min(1);



export const loginSchema = z.object({
  password: passwordSchema,
});
export type LoginValues = z.infer<typeof loginSchema>;



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
