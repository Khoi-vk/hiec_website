import { z } from "zod";

export const strongPasswordSchema = z
  .string()
  .min(6, "Mật khẩu tối thiểu 6 ký tự")
  .regex(/[A-Z]/, "Cần ít nhất 1 chữ hoa")
  .regex(/[0-9]/, "Cần ít nhất 1 chữ số");

export const signupSchema = z.object({
  fullName: z.string().min(2, "Vui lòng nhập họ và tên hợp lệ"),
  studentId: z.string().min(5, "Mã số sinh viên không hợp lệ"),
  university: z.string().min(2, "Vui lòng nhập tên trường"),
  major: z.string().min(2, "Vui lòng nhập ngành học"),
  email: z.string().email("Email cá nhân không hợp lệ"),
  phone: z.string().regex(/^\d{10,11}$/, "Số điện thoại phải có 10-11 chữ số"),
  motivation: z.string().min(20, "Vui lòng chia sẻ thêm về lý do bạn ứng tuyển (tối thiểu 20 ký tự)"),
  experience: z.string().optional(),
  password: strongPasswordSchema,
  confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Mật khẩu xác nhận không khớp",
});

export type SignupValues = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});
export type LoginValues = z.infer<typeof loginSchema>;