import { supabase } from "@/utils/supabase";

/** Dummy data layer for the HIEC website (front-end only demo). */

export type Project = {
  id: string;
  title: string;
  category: "Dự án" | "Hoạt động" | "Dấu ấn";
  excerpt: string;
  year: string;
  metric: string;
  published: boolean;
};

export const projects: Project[] = [
  {
    id: "p1",
    title: "HIEC Startup Bootcamp",
    category: "Dự án",
    excerpt:
      "Chương trình huấn luyện 6 tuần giúp sinh viên biến ý tưởng thành mô hình kinh doanh có thể gọi vốn.",
    year: "2025",
    metric: "18 đội thi",
    published: true,
  },
  {
    id: "p2",
    title: "Innovation Day",
    category: "Hoạt động",
    excerpt:
      "Ngày hội đổi mới sáng tạo với các workshop, triển lãm sản phẩm và phiên pitching cùng nhà đầu tư.",
    year: "2025",
    metric: "1.200 người tham dự",
    published: true,
  },
  {
    id: "p3",
    title: "Mentor Connect",
    category: "Dự án",
    excerpt:
      "Kết nối thành viên HIEC với mentor là doanh nhân, chuyên gia sản phẩm và nhà đầu tư thiên thần.",
    year: "2024",
    metric: "45 mentor",
    published: true,
  },
  {
    id: "p4",
    title: "Cuộc thi Business Case HIEC",
    category: "Dấu ấn",
    excerpt:
      "Giải Nhất cuộc thi phân tích tình huống kinh doanh cấp thành phố dành cho sinh viên khối kinh tế.",
    year: "2024",
    metric: "Giải Nhất",
    published: true,
  },
  {
    id: "p5",
    title: "Green Impact Challenge",
    category: "Dự án",
    excerpt:
      "Thử thách phát triển giải pháp kinh doanh bền vững, gắn với mục tiêu phát triển xanh của địa phương.",
    year: "2024",
    metric: "9 giải pháp",
    published: true,
  },
  {
    id: "p6",
    title: "HIEC Talk Series",
    category: "Hoạt động",
    excerpt:
      "Chuỗi toạ đàm hằng tháng với khách mời từ startup, quỹ đầu tư và các tập đoàn công nghệ.",
    year: "2023",
    metric: "24 số phát sóng",
    published: false,
  },
];

export const coreValues = [
  {
    title: "Đổi mới",
    description: "Luôn thử nghiệm cách làm mới, đặt câu hỏi trước mọi giới hạn quen thuộc.",
  },
  {
    title: "Chính trực",
    description: "Minh bạch trong mọi dự án, tôn trọng cam kết với thành viên và đối tác.",
  },
  {
    title: "Đồng hành",
    description: "Thành viên phát triển cùng nhau qua mentoring và chia sẻ tri thức mở.",
  },
  {
    title: "Tác động",
    description: "Mỗi hoạt động đều hướng tới giá trị thật cho sinh viên và cộng đồng.",
  },
];

export const history = [
  { year: "2019", title: "Thành lập HIEC", description: "12 sinh viên sáng lập câu lạc bộ khởi nghiệp & đổi mới sáng tạo." },
  { year: "2021", title: "Mở rộng hệ sinh thái", description: "Hợp tác cùng 3 vườn ươm doanh nghiệp." },
  { year: "2023", title: "Vươn ra cấp thành phố", description: "Đại diện trường tham dự và đạt thành tích tại các cuộc thi lớn." },
  { year: "2025", title: "350+ thành viên", description: "Cộng đồng alumni và thành viên hoạt động trên 4 mảng chuyên môn." },
];

export const adminStats = [
  { label: "Bài viết đã đăng", value: "42", delta: "+6 tháng này" },
  { label: "Lượt truy cập", value: "18.4K", delta: "+12,5%" },
  { label: "Đăng ký tham gia", value: "236", delta: "+38 tuần này" },
  { label: "Thành viên hoạt động", value: "1.048", delta: "+54" },
];

export const trafficData = [
  { month: "T1", views: 820 },
  { month: "T2", views: 1120 },
  { month: "T3", views: 990 },
  { month: "T4", views: 1580 },
  { month: "T5", views: 1740 },
  { month: "T6", views: 2210 },
];

export const socialLinks = [
  { label: "Facebook", href: "https://www.facebook.com/hiec.vn" },
  { label: "TikTok", href: "https://www.tiktok.com/@hiec.hust" },
  { label: "Instagram", href: "https://www.instagram.com/hiec.in.here/" },
];

export const contactInfo = {
  email: "hiec.hust@gmail.com",
  phone: "0336873705",
  messenger: "https://m.me/hiec.vn",
  address: "Đại học Bách khoa Hà Nội, 1 Đ. Đại Cồ Việt", 
};

// --- TYPE & SUPABASE HANDLERS ---
export type HomeContent = {
  hero: {
    badge: string;
    title: string;
    description: string;
    primaryBtnText: string;
    secondaryBtnText: string;
  };
  historySection: { badge: string; title: string; description: string };
  history: Array<{ year: string; title: string; description: string }>;
  deptSection: { badge: string; title: string; description: string };
  departments: Array<{ code: string; title: string; text: string }>;
  actionSection: { badge: string; title: string; allActivitiesText: string; allProjectsText: string };
  stats: Array<{ number: string; label: string }>;
  cta: {
    tagline: string;
    title: string;
    description: string;
    primaryBtnText: string;
    secondaryBtnText: string;
  };
  contact: { email: string; phone: string; messenger: string; address: string };
};

export const defaultHomeContent: HomeContent = {
  hero: {
    badge: "HIEC / Since 2019",
    title: "Khơi nguồn sáng tạo, Dẫn lối thành công",
    description: "Câu lạc bộ Sáng tạo & Khởi nghiệp HUST — nơi những người trẻ học bằng cách làm, kết nối bằng giá trị và cùng nhau tạo ra điều đáng tự hào.",
    primaryBtnText: "Quan tâm",
    secondaryBtnText: "Khám phá câu chuyện",
  },
  historySection: {
    badge: "01 / Lịch sử",
    title: "Mỗi chặng đường là một lần trưởng thành.",
    description: "Từ một nhóm sinh viên có chung sự tò mò, HIEC lớn lên nhờ những người dám bắt đầu, dám thử và dám làm lại.",
  },
  stats: [
    { number: "06+", label: "năm xây cộng đồng" },
    { number: "04", label: "ban chuyên môn" },
    { number: "24", label: "dự án đã triển khai" },
    { number: "∞", label: "ý tưởng được lắng nghe" }
  ],
  history,
  deptSection: {
    badge: "02 / Cơ cấu phòng ban",
    title: "Một đội ngũ. Bốn cách tạo giá trị.",
    description: "Mỗi ban là một mảnh ghép độc lập, nhưng cùng vận hành để HIEC trở thành một hệ sinh thái học tập và hành động.",
  },
  departments: [
    { code: "01", title: "Ban Phát triển chiến lược", text: "Định hình hướng đi..." },
    { code: "02", title: "Ban Truyền thông", text: "Kể câu chuyện HIEC..." },
    { code: "03", title: "Ban Đối ngoại", text: "Mở rộng mạng lưới..." },
    { code: "04", title: "Ban Nhân sự Sự kiện", text: "Xây văn hóa nội bộ..." },
  ],
  actionSection: {
    badge: "03 / HIEC in action",
    title: "Học bằng cách làm.",
    allActivitiesText: "Tất cả hoạt động",
    allProjectsText: "Tất cả dự án",
  },
  cta: {
    tagline: "Make your move",
    title: "Đừng chỉ có ý tưởng. Hãy biến nó thành thật.",
    description: "HIEC không hứa hẹn một hành trình dễ dàng, nhưng đây là nơi bạn có đồng đội.",
    primaryBtnText: "Nhận thông tin từ HIEC",
    secondaryBtnText: "Liên hệ",
  },
  contact: contactInfo
};

export async function getHomeContent(): Promise<HomeContent> {
  try {
    const { data, error } = await supabase.from("static_content").select("content").eq("id", "home_content").single();
    if (error || !data?.content) return defaultHomeContent;
    const content = data.content as Partial<HomeContent>;
    return {
      ...defaultHomeContent,
      ...content,
      hero: { ...defaultHomeContent.hero, ...content.hero },
      historySection: { ...defaultHomeContent.historySection, ...content.historySection },
      deptSection: { ...defaultHomeContent.deptSection, ...content.deptSection },
      actionSection: { ...defaultHomeContent.actionSection, ...content.actionSection },
      cta: { ...defaultHomeContent.cta, ...content.cta },
      contact: { ...defaultHomeContent.contact, ...content.contact },
      stats: content.stats?.length ? content.stats : defaultHomeContent.stats,
      history: content.history?.length ? content.history : defaultHomeContent.history,
      departments: content.departments?.length ? content.departments : defaultHomeContent.departments,
    };
  } catch {
    return defaultHomeContent;
  }
}

export async function updateHomeContent(payload: HomeContent) {
  const { data, error } = await supabase
    .from("static_content")
    .upsert(
      { 
        id: "home_content",
        content: payload,
        updated_at: new Date().toISOString() 
      }, 
      { onConflict: "id" }
    );

  if (error) {
    console.error("Lỗi Supabase chi tiết:", error);
    throw new Error(error.message);
  }
  return data;
}