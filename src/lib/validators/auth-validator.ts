import * as z from "zod";

/**
 * 1. Schema dành cho trang Nộp đơn (Signup)
 * Không cần mật khẩu và lý do tham gia theo ý ông.
 */

export const signupSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(5, "Định dạng tên không hợp lệ"),

  email: z
    .string()
    .trim()
    .email("Định dạng email không hợp lệ"),

  audience: z
    .string()
    .min(1, "Vui lòng chọn đối tượng"),
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
