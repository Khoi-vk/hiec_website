import { z } from "zod";

export const POST_CATEGORIES = ["Dự án", "Hoạt động", "Dấu ấn"] as const;

export const postSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Tiêu đề cần tối thiểu 5 ký tự")
    .max(120, "Tiêu đề tối đa 120 ký tự"),
  category: z.enum(POST_CATEGORIES, { errorMap: () => ({ message: "Vui lòng chọn danh mục" }) }),
  excerpt: z
    .string()
    .trim()
    .min(20, "Mô tả ngắn cần tối thiểu 20 ký tự")
    .max(300, "Mô tả ngắn tối đa 300 ký tự"),
  content: z.string().trim().min(50, "Nội dung bài viết cần tối thiểu 50 ký tự").max(5000),
  published: z.boolean(),
});
export type PostValues = z.infer<typeof postSchema>;

export const staticContentSchema = z.object({
  heroTitle: z.string().trim().min(3, "Tiêu đề quá ngắn").max(120),
  slogan: z.string().trim().min(3, "Slogan quá ngắn").max(160),
  intro: z.string().trim().min(20, "Văn bản giới thiệu cần tối thiểu 20 ký tự").max(2000),
  email: z.string().email("Định dạng email không hợp lệ"),
  phone: z.string().regex(/^\d{10,15}$/, "Định dạng số điện thoại không hợp lệ"),
  address: z.string().trim().min(5, "Địa chỉ quá ngắn").max(200),
});
export type StaticContentValues = z.infer<typeof staticContentSchema>;
