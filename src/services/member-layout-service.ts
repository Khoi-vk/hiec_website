/**
 * Service quản lý cơ cấu tầng thành viên (Member Tier Layout)
 * Lưu trữ cấu hình sắp xếp tầng tại Supabase (bảng settings, key: member_layout)
 * kèm theo fallback localStorage & mock data chất lượng cao.
 */
import { supabase } from "@/utils/supabase";

export interface Member {
  id: string;
  fullName: string;
  position: string;
  department: string;
  bio?: string;
  avatarUrl?: string;
  displayOrder?: number;
}

export interface MemberTier {
  id: string;
  name: string;
  subtitle?: string;
  memberIds: string[]; // Tối đa 4 ID thành viên
}

export interface MemberLayoutConfig {
  tiers: MemberTier[];
  showUnassigned: boolean;
  unassignedTitle: string;
  updatedAt?: string;
}

export const DEFAULT_MEMBERS: Member[] = [
  {
    id: "m-1",
    fullName: "Hoàng Minh Đức",
    position: "Chủ nhiệm CLB",
    department: "Ban Chủ nhiệm",
    bio: "Sinh viên năm cuối ĐH Bách Khoa Hà Nội, đam mê khởi nghiệp công nghệ và xây dựng cộng đồng đổi mới sáng tạo.",
    avatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    displayOrder: 1,
  },
  {
    id: "m-2",
    fullName: "Nguyễn Mai Anh",
    position: "Phó Chủ nhiệm Thường trực",
    department: "Ban Chủ nhiệm",
    bio: "Quản trị chiến lược và điều phối hoạt động toàn thể câu lạc bộ HIEC.",
    avatarUrl:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
    displayOrder: 2,
  },
  {
    id: "m-3",
    fullName: "Lê Tuấn Kiệt",
    position: "Trưởng ban Phát triển chiến lược",
    department: "Ban Phát triển chiến lược",
    bio: "Phụ trách ươm tạo dự án sinh viên và xây dựng khung đào tạo khởi nghiệp.",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    displayOrder: 3,
  },
  {
    id: "m-4",
    fullName: "Đỗ Phương Linh",
    position: "Trưởng ban Đối ngoại",
    department: "Ban Đối ngoại",
    bio: "Kết nối mạng lưới doanh nghiệp, quỹ đầu tư và các đối tác đồng hành cùng HIEC.",
    avatarUrl:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80",
    displayOrder: 4,
  },
  {
    id: "m-5",
    fullName: "Vũ Bảo Ngọc",
    position: "Trưởng ban Nhân sự & Sự kiện",
    department: "Ban Nhân sự & Sự kiện",
    bio: "Quản lý tuyển quân, văn hóa nội bộ và tổ chức chuỗi sự kiện lớn của CLB.",
    avatarUrl:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80",
    displayOrder: 5,
  },
  {
    id: "m-6",
    fullName: "Trần Đức Long",
    position: "Trưởng ban Truyền thông",
    department: "Ban Truyền thông",
    bio: "Định hình thương hiệu số HIEC, chiến lược truyền thông đa kênh và sản xuất nội dung.",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    displayOrder: 6,
  },
  {
    id: "m-7",
    fullName: "Phạm Hoàng Nam",
    position: "Phó ban Đối ngoại",
    department: "Ban Đối ngoại",
    bio: "Phụ trách quan hệ tài trợ và bảo trợ truyền thông các chương trình lớn.",
    avatarUrl:
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=80",
    displayOrder: 7,
  },
  {
    id: "m-8",
    fullName: "Trịnh Hải Đăng",
    position: "Phó ban Sự kiện",
    department: "Ban Nhân sự & Sự kiện",
    bio: "Trưởng ban tổ chức Startup Bootcamp và Innovation Day 2025.",
    avatarUrl:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80",
    displayOrder: 8,
  },
  {
    id: "m-9",
    fullName: "Bùi Khánh Linh",
    position: "Phó ban Thiết kế & Sáng tạo",
    department: "Ban Truyền thông",
    bio: "Chủ trì các ấn phẩm hình ảnh, video và bộ nhận diện thương hiệu HIEC.",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
    displayOrder: 9,
  },
  {
    id: "m-10",
    fullName: "Nguyễn Huy Hoàng",
    position: "Thành viên Nòng cốt",
    department: "Ban Phát triển chiến lược",
    bio: "Nghiên cứu thị trường và hỗ trợ các nhóm dự án sinh viên chuẩn bị pitching.",
    avatarUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80",
    displayOrder: 10,
  },
];

export const DEFAULT_MEMBER_LAYOUT: MemberLayoutConfig = {
  tiers: [
    {
      id: "tier-1",
      name: "Tầng 1: Ban Chủ Nhiệm",
      subtitle: "Định hướng chiến lược & Điều hành toàn diện",
      memberIds: ["m-1", "m-2"],
    },
    {
      id: "tier-2",
      name: "Tầng 2: Trưởng Ban Chuyên Môn",
      subtitle: "Quản lý và thực thi các khối hoạt động nòng cốt",
      memberIds: ["m-3", "m-4", "m-5", "m-6"],
    },
    {
      id: "tier-3",
      name: "Tầng 3: Phó Ban Chuyên Môn",
      subtitle: "Hỗ trợ điều phối và tổ chức chương trình",
      memberIds: ["m-7", "m-8", "m-9"],
    },
    {
      id: "tier-4",
      name: "Tầng 4: Thành Viên Tiêu Biểu",
      subtitle: "Lực lượng năng động và triển khai dự án",
      memberIds: ["m-10"],
    },
  ],
  showUnassigned: true,
  unassignedTitle: "Thành viên & Cộng tác viên",
};

const LOCAL_STORAGE_KEY = "hiec_member_layout_v1";

/** Chỉ giữ tầng có ít nhất 1 thành viên tồn tại — giống trang Cơ cấu CLB. */
export function sanitizeTiersForDisplay(tiers: MemberTier[], members: Member[]): MemberTier[] {
  const validIds = new Set(members.map((m) => m.id));
  return tiers
    .map((t) => ({
      ...t,
      memberIds: (t.memberIds || []).filter((id) => validIds.has(id)).slice(0, 4),
    }))
    .filter((t) => t.memberIds.length > 0);
}

/**
 * Lấy tất cả thành viên từ Supabase (nếu có) hoặc fallback dữ liệu mẫu
 */
export async function getAllMembers(): Promise<Member[]> {
  try {
    const { data, error } = await supabase
      .from("members")
      .select("*")
      .order("displayOrder", { ascending: true });

    if (error || !data || data.length === 0) {
      return DEFAULT_MEMBERS;
    }

    return data.map((item: any) => ({
      id: String(item.id),
      fullName: item.fullName || "Thành viên",
      position: item.position || "Thành viên HIEC",
      department: item.department || "HIEC",
      bio: item.bio || "",
      avatarUrl: item.avatarUrl || "",
      displayOrder: item.displayOrder ?? 0,
    }));
  } catch (err) {
    console.warn("Không thể tải members từ Supabase, sử dụng mock:", err);
    return DEFAULT_MEMBERS;
  }
}

/**
 * Lấy cấu hình giao diện thành viên (Tier Layout)
 */
export async function getMemberLayoutConfig(): Promise<MemberLayoutConfig> {
  // 1. Thử lấy từ Supabase bảng settings
  try {
    const { data, error } = await supabase
      .from("settings")
      .select("value")
      .eq("key", "member_layout")
      .maybeSingle();

    if (!error && data?.value && Array.isArray(data.value.tiers)) {
      // Lưu lại local storage làm cache
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data.value));
      return data.value as MemberLayoutConfig;
    }
  } catch (err) {
    console.warn("Lỗi khi tải cấu hình member_layout từ Supabase:", err);
  }

  // 2. Thử lấy từ LocalStorage
  try {
    const local = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (local) {
      const parsed = JSON.parse(local);
      if (parsed && Array.isArray(parsed.tiers)) {
        return parsed as MemberLayoutConfig;
      }
    }
  } catch (err) {
    console.warn("Lỗi khi đọc local storage:", err);
  }

  // 3. Fallback mặc định
  return DEFAULT_MEMBER_LAYOUT;
}

/**
 * Lưu cấu hình giao diện thành viên (Dành cho Admin)
 */
export async function saveMemberLayoutConfig(config: MemberLayoutConfig): Promise<void> {
  // Đảm bảo mỗi tầng không có quá 4 card
  const sanitizedTiers = config.tiers.map((t) => ({
    ...t,
    memberIds: t.memberIds.slice(0, 4),
  }));

  const payload: MemberLayoutConfig = {
    ...config,
    tiers: sanitizedTiers,
    updatedAt: new Date().toISOString(),
  };

  // 1. Lưu vào localStorage ngay lập tức
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.error("Lỗi lưu localStorage:", err);
  }

  // 2. Lưu vào Supabase settings
  try {
    const { error } = await supabase.from("settings").upsert(
      {
        key: "member_layout",
        value: payload,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" },
    );

    if (error) {
      console.warn("Không thể lưu vào Supabase settings (tiếp tục dùng local):", error);
    }
  } catch (err) {
    console.warn("Lỗi kết nối Supabase:", err);
  }
}
