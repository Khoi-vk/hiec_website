import * as React from "react";
import { projects as initialProjects } from "@/services/hiec-service";

export type Article = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  publishDate: string;
  published: boolean;
};

export type ClubProject = {
  id: string;
  title: string;
  category: "Dự án" | "Hoạt động" | "Dấu ấn";
  excerpt: string;
  content: string;
  year: string; // Timeline
  members: string; // Members involved
  images: string[]; // Project images
  metric: string;
  published: boolean;
};

export type GalleryImage = {
  id: string;
  url: string;
  caption: string;
  uploadedAt: string;
};

type ClubStoreContextValue = {
  articles: Article[];
  projects: ClubProject[];
  images: GalleryImage[];
  
  // Article CRUD
  addArticle: (article: Omit<Article, "id">) => void;
  updateArticle: (id: string, article: Partial<Article>) => void;
  deleteArticle: (id: string) => void;
  
  // Project CRUD
  addProject: (project: Omit<ClubProject, "id">) => void;
  updateProject: (id: string, project: Partial<ClubProject>) => void;
  deleteProject: (id: string) => void;
  
  // Image CRUD
  addImage: (image: Omit<GalleryImage, "id" | "uploadedAt">) => void;
  deleteImage: (id: string) => void;
};

const ClubStoreContext = React.createContext<ClubStoreContextValue | null>(null);

const DEFAULT_ARTICLES: Article[] = [
  {
    id: "art-1",
    title: "Cẩm nang gọi vốn thiên thần cho Startup Sinh viên",
    excerpt: "Làm thế nào để thuyết phục nhà đầu tư thiên thần khi bạn chưa có sản phẩm hoàn thiện và doanh thu?",
    content: `Gọi vốn thiên thần là bước đi quan trọng đối với các startup sinh viên. Trong bài viết này, chúng tôi sẽ chia sẻ 3 yếu tố cốt lõi giúp các nhà sáng lập trẻ chinh phục nhà đầu tư:
    
1. Tập trung vào tiềm năng của đội ngũ (Team capability): Nhà đầu tư rót vốn vào con người trước khi rót vốn vào ý tưởng.
2. Chứng minh sự thấu hiểu khách hàng qua nghiên cứu thị trường chi tiết.
3. Kế hoạch sử dụng nguồn vốn rõ ràng và thực tế.

HIEC đã hỗ trợ hơn 10 dự án sinh viên kết nối thành công với các mentor và quỹ đầu tư thiên thần tại TP.HCM.`,
    coverImage: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80",
    publishDate: "2026-03-01",
    published: true,
  },
  {
    id: "art-2",
    title: "Trí tuệ Nhân tạo và Xu hướng Đổi mới Sáng tạo năm 2026",
    excerpt: "Khám phá các ứng dụng AI đột phá đang được các thành viên HIEC triển khai trong các dự án thực tế.",
    content: `Năm 2026 đánh dấu sự bùng nổ của AI tạo sinh trong mọi lĩnh vực của đời sống. Tại HIEC, chúng tôi không đứng ngoài làn sóng này. Các dự án của câu lạc bộ đang áp dụng AI để:

- Tối ưu hóa quy trình phân tích dữ liệu thị trường.
- Hỗ trợ cá nhân hóa trải nghiệm học tập cho sinh viên.
- Tự động hóa một phần quy trình thiết kế và viết nội dung truyền thông.

Hãy cùng đón xem chuỗi workshop sắp tới về 'AI-First Product Development' do HIEC tổ chức!`,
    coverImage: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80",
    publishDate: "2026-02-20",
    published: true,
  }
];

const DEFAULT_IMAGES: GalleryImage[] = [
  {
    id: "img-1",
    url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
    caption: "Lễ ra mắt Bootcamp Khởi nghiệp HIEC 2025",
    uploadedAt: "2025-10-15",
  },
  {
    id: "img-2",
    url: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80",
    caption: "Workshop xây dựng mô hình kinh doanh cùng Mentor",
    uploadedAt: "2025-11-02",
  },
  {
    id: "img-3",
    url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
    caption: "Họp mặt định kỳ Ban chủ nhiệm CLB",
    uploadedAt: "2025-12-01",
  },
  {
    id: "img-4",
    url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
    caption: "Chung kết Innovation Day 2025",
    uploadedAt: "2026-01-10",
  }
];

export function ClubStoreProvider({ children }: { children: React.ReactNode }) {
  const [articles, setArticles] = React.useState<Article[]>([]);
  const [projects, setProjects] = React.useState<ClubProject[]>([]);
  const [images, setImages] = React.useState<GalleryImage[]>([]);

  // Load from localStorage on mount
  React.useEffect(() => {
    const storedArticles = localStorage.getItem("hiec.articles");
    const storedProjects = localStorage.getItem("hiec.projects");
    const storedImages = localStorage.getItem("hiec.images");

    if (storedArticles) {
      setArticles(JSON.parse(storedArticles));
    } else {
      setArticles(DEFAULT_ARTICLES);
      localStorage.setItem("hiec.articles", JSON.stringify(DEFAULT_ARTICLES));
    }

    if (storedProjects) {
      setProjects(JSON.parse(storedProjects));
    } else {
      // Map existing Project from hiec-service to ClubProject
      const mapped: ClubProject[] = initialProjects.map((p) => ({
        id: p.id,
        title: p.title,
        category: p.category,
        excerpt: p.excerpt,
        content: `${p.excerpt} Đây là nội dung chi tiết của dự án ${p.title}. Dự án được triển khai thành công với sự tham gia của các thành viên CLB HIEC và sự hỗ trợ nhiệt tình từ các Mentor giàu kinh nghiệm.`,
        year: p.year,
        members: "Nguyễn Văn A, Trần Thị B, Lê Văn C",
        images: ["https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80"],
        metric: p.metric,
        published: p.published,
      }));
      setProjects(mapped);
      localStorage.setItem("hiec.projects", JSON.stringify(mapped));
    }

    if (storedImages) {
      setImages(JSON.parse(storedImages));
    } else {
      setImages(DEFAULT_IMAGES);
      localStorage.setItem("hiec.images", JSON.stringify(DEFAULT_IMAGES));
    }
  }, []);

  const saveArticles = (newArticles: Article[]) => {
    setArticles(newArticles);
    localStorage.setItem("hiec.articles", JSON.stringify(newArticles));
  };

  const saveProjects = (newProjects: ClubProject[]) => {
    setProjects(newProjects);
    localStorage.setItem("hiec.projects", JSON.stringify(newProjects));
  };

  const saveImages = (newImages: GalleryImage[]) => {
    setImages(newImages);
    localStorage.setItem("hiec.images", JSON.stringify(newImages));
  };

  const addArticle = (art: Omit<Article, "id">) => {
    const newArt: Article = {
      ...art,
      id: `art-${Date.now()}`,
    };
    saveArticles([newArt, ...articles]);
  };

  const updateArticle = (id: string, updated: Partial<Article>) => {
    saveArticles(
      articles.map((art) => (art.id === id ? { ...art, ...updated } : art))
    );
  };

  const deleteArticle = (id: string) => {
    saveArticles(articles.filter((art) => art.id !== id));
  };

  const addProject = (proj: Omit<ClubProject, "id">) => {
    const newProj: ClubProject = {
      ...proj,
      id: `proj-${Date.now()}`,
    };
    saveProjects([newProj, ...projects]);
  };

  const updateProject = (id: string, updated: Partial<ClubProject>) => {
    saveProjects(
      projects.map((proj) => (proj.id === id ? { ...proj, ...updated } : proj))
    );
  };

  const deleteProject = (id: string) => {
    saveProjects(projects.filter((proj) => proj.id !== id));
  };

  const addImage = (img: Omit<GalleryImage, "id" | "uploadedAt">) => {
    const newImg: GalleryImage = {
      ...img,
      id: `img-${Date.now()}`,
      uploadedAt: new Date().toISOString().split("T")[0] || "2026-03-01",
    };
    saveImages([newImg, ...images]);
  };

  const deleteImage = (id: string) => {
    saveImages(images.filter((img) => img.id !== id));
  };

  const value = React.useMemo(
    () => ({
      articles,
      projects,
      images,
      addArticle,
      updateArticle,
      deleteArticle,
      addProject,
      updateProject,
      deleteProject,
      addImage,
      deleteImage,
    }),
    [articles, projects, images]
  );

  return <ClubStoreContext.Provider value={value}>{children}</ClubStoreContext.Provider>;
}

export function useClubStore() {
  const ctx = React.useContext(ClubStoreContext);
  if (!ctx) throw new Error("useClubStore must be used inside <ClubStoreProvider>");
  return ctx;
}
