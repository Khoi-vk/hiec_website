import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  BookOpen,
  Calendar,
  ChevronDown,
  ChevronRight,
  FileText,
  Layers,
  Loader2,
  Maximize2,
  Minimize2,
  Search,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  FolderOpen,
  AlertCircle,
  FileSpreadsheet,
} from "lucide-react";

import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { supabase } from "@/utils/supabase";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/learning-resources")({
  head: () => ({
    meta: [
      { title: "Học liệu & Bài giảng — HIEC HUST" },
      {
        name: "description",
        content:
          "Kho tài liệu, slide bài giảng và học liệu đào tạo của Câu lạc bộ Khởi nghiệp HIEC.",
      },
    ],
  }),
  component: LearningResourcesPage,
});

export type LearningChapter = {
  id: string;
  title: string;
  chapter_date: string | null;
  display_order: number;
};

export type LearningLesson = {
  id: string;
  chapter_id: string;
  title: string;
  slide_url: string;
  created_at: string;
};

// Fallback demo data if database is empty so visitors immediately see sample structure
const DEMO_CHAPTERS: LearningChapter[] = [
  {
    id: "demo-chap-1",
    title: "Chương 1: Tổng quan Khởi nghiệp Đổi mới Sáng tạo",
    chapter_date: "2024-09-15",
    display_order: 0,
  },
  {
    id: "demo-chap-2",
    title: "Chương 2: Phát hiện vấn đề & Nghiên cứu thị trường",
    chapter_date: "2024-09-22",
    display_order: 1,
  },
  {
    id: "demo-chap-3",
    title: "Chương 3: Xây dựng Mô hình Kinh doanh (Business Model Canvas)",
    chapter_date: "2024-09-29",
    display_order: 2,
  },
  {
    id: "demo-chap-4",
    title: "Chương 4: Kỹ năng Thuyết trình & Gọi vốn Pitching",
    chapter_date: "2024-10-06",
    display_order: 3,
  },
];

const DEMO_LESSONS: LearningLesson[] = [
  {
    id: "demo-les-1",
    chapter_id: "demo-chap-1",
    title: "Bài 1: Tư duy Khởi nghiệp (Entrepreneurial Mindset) & Hệ sinh thái HUST",
    slide_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    created_at: "2024-09-15T08:00:00Z",
  },
  {
    id: "demo-les-2",
    chapter_id: "demo-chap-1",
    title: "Bài 2: Phân biệt Startup vs Doanh nghiệp truyền thống",
    slide_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    created_at: "2024-09-15T09:30:00Z",
  },
  {
    id: "demo-les-3",
    chapter_id: "demo-chap-2",
    title: "Bài 1: Phương pháp phỏng vấn khách hàng tiềm năng (Customer Discovery)",
    slide_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    created_at: "2024-09-22T08:00:00Z",
  },
  {
    id: "demo-les-4",
    chapter_id: "demo-chap-2",
    title: "Bài 2: Đánh giá quy mô thị trường (TAM, SAM, SOM)",
    slide_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    created_at: "2024-09-22T09:30:00Z",
  },
  {
    id: "demo-les-5",
    chapter_id: "demo-chap-3",
    title: "Bài 1: 9 khối cấu thành Business Model Canvas",
    slide_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    created_at: "2024-09-29T08:00:00Z",
  },
  {
    id: "demo-les-6",
    chapter_id: "demo-chap-4",
    title: "Bài 1: Cấu trúc Pitch Deck 10 slides chuẩn quỹ đầu tư mạo hiểm",
    slide_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    created_at: "2024-10-06T08:00:00Z",
  },
];

function formatDate(dateStr: string | null) {
  if (!dateStr) return null;
  try {
    const d = new Date(dateStr.includes("T") ? dateStr : `${dateStr}T00:00:00`);
    if (isNaN(d.getTime())) return null;
    return d.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return null;
  }
}

function getFileExtension(url: string) {
  if (!url) return "";
  const clean = url.split("?")[0] || "";
  const parts = clean.split(".");
  return parts.length > 1 ? (parts.pop() || "").toLowerCase() : "";
}

function getViewerUrl(slideUrl: string): { url: string; isOffice: boolean; isPdf: boolean } {
  if (!slideUrl) return { url: "", isOffice: false, isPdf: false };
  const cleanUrl = slideUrl.trim();
  const ext = getFileExtension(cleanUrl);

  // Check for Google Drive file
  const gDriveMatch = cleanUrl.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (gDriveMatch && gDriveMatch[1]) {
    return {
      url: `https://drive.google.com/file/d/${gDriveMatch[1]}/preview`,
      isOffice: false,
      isPdf: false,
    };
  }

  // Check for Google Slides presentation
  const gSlidesMatch = cleanUrl.match(/docs\.google\.com\/presentation\/d\/([a-zA-Z0-9_-]+)/);
  if (gSlidesMatch && gSlidesMatch[1]) {
    return {
      url: `https://docs.google.com/presentation/d/${gSlidesMatch[1]}/embed?start=false&loop=false&delayms=3000&rm=minimal`,
      isOffice: false,
      isPdf: false,
    };
  }

  // Check for Google Docs document
  const gDocsMatch = cleanUrl.match(/docs\.google\.com\/document\/d\/([a-zA-Z0-9_-]+)/);
  if (gDocsMatch && gDocsMatch[1]) {
    return {
      url: `https://docs.google.com/document/d/${gDocsMatch[1]}/preview?rm=minimal`,
      isOffice: false,
      isPdf: false,
    };
  }

  // PDF files: append #toolbar=0&navpanes=0 to hide browser PDF viewer's top gray bar (download/print buttons)
  if (ext === "pdf" || cleanUrl.toLowerCase().includes(".pdf")) {
    const basePdf = cleanUrl.split("#")[0];
    return {
      url: `${basePdf}#toolbar=0&navpanes=0&scrollbar=1`,
      isOffice: false,
      isPdf: true,
    };
  }

  if (["ppt", "pptx", "doc", "docx", "xls", "xlsx"].includes(ext)) {
    return {
      url: `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(cleanUrl)}`,
      isOffice: true,
      isPdf: false,
    };
  }

  // Fallback to Google Docs Viewer if unspecified format
  if (cleanUrl.startsWith("http")) {
    return {
      url: `https://docs.google.com/viewer?url=${encodeURIComponent(cleanUrl)}&embedded=true`,
      isOffice: false,
      isPdf: false,
    };
  }

  return { url: cleanUrl, isOffice: false, isPdf: false };
}

function LearningResourcesPage() {
  const [chapters, setChapters] = React.useState<LearningChapter[]>([]);
  const [lessons, setLessons] = React.useState<LearningLesson[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [openChapters, setOpenChapters] = React.useState<Record<string, boolean>>({});
  const [activeLessonId, setActiveLessonId] = React.useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const viewerContainerRef = React.useRef<HTMLDivElement>(null);

  // Fetch data from Supabase
  const loadData = React.useCallback(async () => {
    setLoading(true);
    try {
      const [chapterRes, lessonRes] = await Promise.all([
        supabase
          .from("learning_chapters")
          .select("id, title, chapter_date, display_order")
          .order("display_order", { ascending: true })
          .order("created_at", { ascending: true }),
        supabase
          .from("learning_lessons")
          .select("id, chapter_id, title, slide_url, created_at")
          .order("created_at", { ascending: true }),
      ]);

      const fetchedChapters = (chapterRes.data ?? []) as LearningChapter[];
      const fetchedLessons = (lessonRes.data ?? []) as LearningLesson[];

      if (fetchedChapters.length > 0) {
        setChapters(fetchedChapters);
        setLessons(fetchedLessons);

        // Open all chapters by default
        const initialOpen: Record<string, boolean> = {};
        fetchedChapters.forEach((ch) => {
          initialOpen[ch.id] = true;
        });
        setOpenChapters(initialOpen);

        // Select first lesson by default
        if (fetchedLessons.length > 0) {
          const firstLesson = fetchedLessons[0];
          if (firstLesson) setActiveLessonId(firstLesson.id);
        }
      } else {
        // Use demo items if database is empty
        setChapters(DEMO_CHAPTERS);
        setLessons(DEMO_LESSONS);
        const initialOpen: Record<string, boolean> = {};
        DEMO_CHAPTERS.forEach((ch) => {
          initialOpen[ch.id] = true;
        });
        setOpenChapters(initialOpen);
        const firstDemoLesson = DEMO_LESSONS[0];
        if (firstDemoLesson) setActiveLessonId(firstDemoLesson.id);
      }
    } catch (error) {
      console.error("Lỗi khi tải học liệu:", error);
      // Fallback
      setChapters(DEMO_CHAPTERS);
      setLessons(DEMO_LESSONS);
      const firstDemoLesson = DEMO_LESSONS[0];
      if (firstDemoLesson) setActiveLessonId(firstDemoLesson.id);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void loadData();
  }, [loadData]);

  // Group lessons by chapter
  const lessonsByChapter = React.useMemo(() => {
    const map = new Map<string, LearningLesson[]>();
    lessons.forEach((lesson) => {
      const list = map.get(lesson.chapter_id) ?? [];
      list.push(lesson);
      map.set(lesson.chapter_id, list);
    });
    return map;
  }, [lessons]);

  // Filtered chapters & lessons
  const filteredChapters = React.useMemo(() => {
    if (!searchQuery.trim()) return chapters;
    const q = searchQuery.toLowerCase().trim();

    return chapters
      .map((chap) => {
        const chapLessons = lessonsByChapter.get(chap.id) ?? [];
        const matchesChap =
          chap.title.toLowerCase().includes(q) ||
          (chap.chapter_date && chap.chapter_date.includes(q));
        const matchedLessons = chapLessons.filter((l) => l.title.toLowerCase().includes(q));

        if (matchesChap || matchedLessons.length > 0) {
          return {
            ...chap,
            matchedLessonsCount: matchedLessons.length,
          };
        }
        return null;
      })
      .filter(Boolean) as (LearningChapter & { matchedLessonsCount?: number })[];
  }, [chapters, lessonsByChapter, searchQuery]);

  // Toggle chapter open/close
  const toggleChapter = (chapterId: string) => {
    setOpenChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  };

  // Find active lesson and its chapter
  const activeLesson = React.useMemo(() => {
    if (!activeLessonId) return null;
    return lessons.find((l) => l.id === activeLessonId) ?? null;
  }, [lessons, activeLessonId]);

  const activeChapter = React.useMemo(() => {
    if (!activeLesson) return null;
    return chapters.find((c) => c.id === activeLesson.chapter_id) ?? null;
  }, [chapters, activeLesson]);

  // Navigation: Next & Previous lessons
  const currentLessonIndex = React.useMemo(() => {
    if (!activeLesson) return -1;
    return lessons.findIndex((l) => l.id === activeLesson.id);
  }, [lessons, activeLesson]);

  const prevLesson = currentLessonIndex > 0 ? lessons[currentLessonIndex - 1] : null;
  const nextLesson =
    currentLessonIndex >= 0 && currentLessonIndex < lessons.length - 1
      ? lessons[currentLessonIndex + 1]
      : null;

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!viewerContainerRef.current) return;
    if (!document.fullscreenElement) {
      void viewerContainerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      void document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const viewerInfo = React.useMemo(() => {
    if (!activeLesson?.slide_url) return null;
    return getViewerUrl(activeLesson.slide_url);
  }, [activeLesson]);

  return (
    <PublicLayout>
      <div className="w-full bg-muted/20 min-h-[calc(100vh-4.5rem)]">
        {/* Top Header Banner */}
        <div className="border-b border-border/70 bg-card/60 backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="border-primary/40 bg-primary/10 text-xs font-semibold text-primary"
                  >
                    <BookOpen className="mr-1.5 size-3.5" /> Thư viện tài liệu
                  </Badge>
                  <span className="text-xs text-muted-foreground">HIEC Knowledge Hub</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  Kho Học Liệu & Slide Bài Giảng
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground shadow-xs">
                  <Layers className="size-4 text-primary" />
                  <span>
                    <strong className="text-foreground">{chapters.length}</strong> chương học
                  </span>
                  <span className="text-border">|</span>
                  <span>
                    <strong className="text-foreground">{lessons.length}</strong> bài giảng
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Layout: 2-Column Split */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <Loader2 className="size-10 animate-spin text-primary" />
              <p className="text-sm font-medium text-muted-foreground">Đang tải kho học liệu...</p>
            </div>
          ) : chapters.length === 0 ? (
            <Card className="border-dashed bg-card/50">
              <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                <FolderOpen className="size-12 text-muted-foreground/60 mb-3" />
                <h3 className="text-lg font-semibold text-foreground">Chưa có học liệu</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-md">
                  Hiện chưa có bài giảng nào được tải lên. Các bài giảng mới sẽ được cập nhật sớm
                  nhất.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col lg:flex-row gap-6 items-start">
              {/* LEFT COLUMN: Mục lục (20% width on large screens) */}
              <aside
                id="learning-toc-sidebar"
                className="w-full lg:w-[22%] xl:w-[20%] shrink-0 lg:sticky lg:top-24 max-h-[calc(100vh-8rem)] flex flex-col rounded-2xl border border-border bg-card shadow-xs overflow-hidden"
              >
                {/* TOC Header & Search */}
                <div className="p-4 border-b border-border bg-muted/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="grid size-6 place-items-center rounded-md bg-primary/10 text-primary text-xs font-bold">
                        <Layers className="size-3.5" />
                      </span>
                      <h2 className="text-sm font-bold text-foreground">Mục lục học liệu</h2>
                    </div>
                    <span className="text-[11px] font-medium text-muted-foreground">
                      {lessons.length} bài
                    </span>
                  </div>

                  {/* Search bar inside TOC */}
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Tìm chương, bài giảng..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-8 pl-8 pr-3 text-xs bg-background rounded-lg border-border"
                    />
                  </div>
                </div>

                {/* Chapter list with Dropdowns */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2.5 scrollbar-thin">
                  {filteredChapters.length === 0 ? (
                    <div className="py-8 text-center text-xs text-muted-foreground">
                      Không tìm thấy bài giảng phù hợp.
                    </div>
                  ) : (
                    filteredChapters.map((chapter, index) => {
                      const chapterLessons = lessonsByChapter.get(chapter.id) ?? [];
                      const isOpen = openChapters[chapter.id] ?? true;
                      const hasActiveLesson = chapterLessons.some((l) => l.id === activeLessonId);
                      const formattedDate = formatDate(chapter.chapter_date);

                      return (
                        <div
                          key={chapter.id}
                          className={cn(
                            "rounded-xl border transition-colors overflow-hidden",
                            hasActiveLesson
                              ? "border-primary/40 bg-primary/5"
                              : "border-border/80 bg-card hover:border-border",
                          )}
                        >
                          {/* Chapter Dropdown Trigger */}
                          <button
                            type="button"
                            onClick={() => toggleChapter(chapter.id)}
                            className="w-full flex items-start gap-2.5 p-3 text-left transition-colors hover:bg-accent/50 focus:outline-hidden"
                          >
                            <span
                              className={cn(
                                "grid size-5 shrink-0 place-items-center rounded text-[11px] font-black mt-0.5",
                                hasActiveLesson
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted text-muted-foreground",
                              )}
                            >
                              {index + 1}
                            </span>

                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-foreground leading-snug break-words">
                                {chapter.title}
                              </p>
                              {formattedDate && (
                                <div className="flex items-center gap-1 mt-1 text-[11px] text-muted-foreground">
                                  <Calendar className="size-3 shrink-0 text-muted-foreground/80" />
                                  <span>{formattedDate}</span>
                                </div>
                              )}
                            </div>

                            <span className="shrink-0 text-muted-foreground mt-0.5">
                              {isOpen ? (
                                <ChevronDown className="size-4" />
                              ) : (
                                <ChevronRight className="size-4" />
                              )}
                            </span>
                          </button>

                          {/* Chapter Lessons List (Dropdown content) */}
                          {isOpen && (
                            <div className="border-t border-border/50 bg-background/50 p-1.5 space-y-1">
                              {chapterLessons.length === 0 ? (
                                <p className="px-3 py-2 text-[11px] text-muted-foreground italic">
                                  Chưa có bài giảng trong chương này.
                                </p>
                              ) : (
                                chapterLessons.map((lesson, lessonIndex) => {
                                  const isActive = lesson.id === activeLessonId;
                                  return (
                                    <button
                                      key={lesson.id}
                                      type="button"
                                      onClick={() => setActiveLessonId(lesson.id)}
                                      className={cn(
                                        "w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs transition-all",
                                        isActive
                                          ? "bg-primary font-bold text-primary-foreground shadow-xs"
                                          : "text-foreground/80 hover:bg-accent hover:text-foreground",
                                      )}
                                    >
                                      <BookOpen
                                        className={cn(
                                          "size-3.5 shrink-0",
                                          isActive ? "text-primary-foreground" : "text-primary",
                                        )}
                                      />
                                      <span className="truncate flex-1">
                                        {lessonIndex + 1}. {lesson.title}
                                      </span>
                                    </button>
                                  );
                                })
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </aside>

              {/* RIGHT COLUMN: File bài giảng tương ứng (80% width on large screens) */}
              <section
                id="learning-viewer-panel"
                className="w-full lg:w-[78%] xl:w-[80%] flex-1 min-w-0 flex flex-col rounded-2xl border border-border bg-card shadow-sm overflow-hidden"
              >
                {activeLesson ? (
                  <div className="flex flex-col h-full">
                    {/* Active Lecture Header */}
                    <div className="border-b border-border bg-card p-4 sm:p-5">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="space-y-1.5 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            {activeChapter && (
                              <Badge
                                variant="secondary"
                                className="text-[11px] font-medium bg-muted text-muted-foreground"
                              >
                                {activeChapter.title}
                              </Badge>
                            )}
                            {activeChapter?.chapter_date && (
                              <Badge
                                variant="outline"
                                className="text-[11px] font-normal text-muted-foreground gap-1"
                              >
                                <Calendar className="size-3" />
                                {formatDate(activeChapter.chapter_date)}
                              </Badge>
                            )}
                          </div>
                          <h2 className="text-lg sm:text-xl font-bold text-foreground tracking-tight break-words">
                            {activeLesson.title}
                          </h2>
                        </div>

                        {/* Top Action Controls */}
                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                          {prevLesson && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setActiveLessonId(prevLesson.id)}
                              className="h-8 px-2.5 text-xs rounded-lg"
                              title={`Bài trước: ${prevLesson.title}`}
                            >
                              <ArrowLeft className="mr-1 size-3.5" /> Bài trước
                            </Button>
                          )}

                          {nextLesson && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setActiveLessonId(nextLesson.id)}
                              className="h-8 px-2.5 text-xs rounded-lg"
                              title={`Bài tiếp: ${nextLesson.title}`}
                            >
                              Bài tiếp <ArrowRight className="ml-1 size-3.5" />
                            </Button>
                          )}

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={toggleFullscreen}
                            className="h-8 px-2.5 text-xs rounded-lg gap-1.5"
                            aria-label="Toàn màn hình"
                            title={isFullscreen ? "Thu nhỏ" : "Toàn màn hình"}
                          >
                            {isFullscreen ? (
                              <>
                                <Minimize2 className="size-3.5" /> Thu nhỏ
                              </>
                            ) : (
                              <>
                                <Maximize2 className="size-3.5" /> Toàn màn hình
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* File Slide Viewer Frame */}
                    <div
                      ref={viewerContainerRef}
                      className={cn(
                        "relative bg-zinc-950 flex flex-col items-center justify-center min-h-[550px] lg:min-h-[calc(100vh-14rem)] w-full",
                        isFullscreen && "fixed inset-0 z-50 min-h-screen bg-zinc-950 p-2",
                      )}
                    >
                      {viewerInfo ? (
                        <div className="w-full h-full flex-1 flex flex-col relative">
                          <iframe
                            key={activeLesson.id}
                            src={viewerInfo.url}
                            title={activeLesson.title}
                            className="w-full h-full min-h-[550px] lg:min-h-[calc(100vh-14rem)] flex-1 border-0 bg-zinc-900 rounded-b-xl"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                          />

                          {/* Floating viewer helper at bottom */}
                          <div className="border-t border-zinc-800 bg-zinc-900/90 backdrop-blur-sm px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-400">
                            <div className="flex items-center gap-2">
                              <BookOpen className="size-4 text-primary" />
                              <span className="truncate max-w-xs sm:max-w-md text-zinc-200">
                                {activeLesson.title}
                              </span>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="text-[11px] text-zinc-400">
                                Cuộn trang hoặc dùng phím điều hướng để xem bài giảng
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center p-12 text-center text-zinc-400">
                          <AlertCircle className="size-10 text-amber-500 mb-3" />
                          <p className="font-semibold text-zinc-200">Chưa có liên kết file slide</p>
                          <p className="text-xs text-zinc-500 mt-1">
                            Vui lòng cập nhật đường dẫn slide cho bài giảng này trong trang quản
                            trị.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
                    <BookOpen className="size-12 text-muted-foreground/50 mb-3" />
                    <h3 className="text-base font-semibold text-foreground">
                      Chọn bài giảng từ mục lục
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                      Nhấn vào bất kỳ bài giảng nào ở danh sách bên trái để mở và cuộn xem nội dung
                      slide tương ứng.
                    </p>
                  </div>
                )}
              </section>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
