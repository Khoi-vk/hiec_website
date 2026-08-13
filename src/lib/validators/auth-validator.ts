import * as z from "zod";

/**
 * 1. Schema dành cho trang Nộp đơn (Signup)
 * Không cần mật khẩu và lý do tham gia theo ý ông.
 */
export const signupSchema = z.object({
  fullName: z.string().min(2, "Vui lòng nhập họ tên"),
  studentId: z.string().min(5, "Vui lòng nhập MSSV"),
  university: z.string().min(2, "Vui lòng nhập tên trường"),
  major: z.string().min(2, "Vui lòng nhập ngành học"),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().min(10, "Số điện thoại không hợp lệ"),
});

/**
 * 2. Schema dành cho trang Đăng nhập (Login)
 * BẮT BUỘC phải giữ lại password ở đây thì ông mới gõ mật khẩu vào Admin được.
 */
export const loginSchema = z.object({
  // Vì trang Login của ông chỉ có 1 ô mật khẩu (SĐT sếp An) nên ta chỉ cần dòng này:
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

// Xuất kiểu dữ liệu để code không bị gạch đỏ
export type SignupValues = z.infer<typeof signupSchema>;
export type LoginValues = z.infer<typeof loginSchema>;