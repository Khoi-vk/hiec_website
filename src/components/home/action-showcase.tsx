import * as React from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Rocket,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { HiecLogo } from "@/components/ui/hiec-logo";
import { supabase } from "@/utils/supabase";
import { cn } from "@/lib/utils";

export interface ActionItem {
  id: string;
  type: "activity" | "project";
  title: string;
  badge: string;
  excerpt: string;
  content?: string;
  imageUrl?: string;
  date?: string;
  year?: string | number;
  is_featured?: boolean;
}

const FALLBACK_FEATURED_ITEMS: ActionItem[] = [
  {
    id: "proj-featured-1",
    type: "project",
    title: "ParkWave – Hệ thống chuyển đổi số quản lý xe cộ",
    badge: "2024",
    year: "2024",
    excerpt: "Ngô Thị Thùy Duyên, Nguyễn Đức Dũng, Tô Lê Quang, Tống Diệu Linh, Nguyễn Hoàng Quân",
    content:
      "ParkWave là giải pháp thông minh ứng dụng AI và thị giác máy tính vào tối ưu hóa bãi đỗ xe trong các trường đại học và khu đô thị, giúp giảm thiểu tắc nghẽn và tự động hóa quy trình quản lý.",
    imageUrl:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
    is_featured: true,
  },
  {
    id: "act-featured-1",
    type: "activity",
    title: "Lễ Ra Mắt Ban Chủ Nhiệm CLB Sáng Tạo & Khởi Nghiệp HUST - HIEC",
    badge: "2024",
    date: "2024",
    excerpt:
      "Phạm Thùy An (Chủ nhiệm), Ngô Thị Thùy Duyên (Phó Chủ nhiệm), Bùi Đức Hải, Bùi Kim Ngân",
    content:
      "Sự kiện chuyển giao và công bố cơ cấu nhân sự nhiệm kỳ mới của HIEC, mở ra giai đoạn phát triển bứt phá với các chương trình ươm tạo sáng tạo đổi mới.",
    imageUrl:
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80",
    is_featured: true,
  },
  {
    id: "act-featured-2",
    type: "activity",
    title: "Vinh danh Quán quân Cuộc thi Khởi nghiệp Sinh viên Toàn quốc",
    badge: "2024",
    date: "2024",
    excerpt: "Đội thi HIEC HUST xuất sắc giành giải Nhất với giải pháp công nghệ y tế",
    content:
      "Đại diện HIEC HUST đã vượt qua hơn 200 dự án trên khắp cả nước để bước lên bục vinh quang, khẳng định vị thế và tinh thần đổi mới sáng tạo của sinh viên Bách Khoa.",
    imageUrl:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
    is_featured: true,
  },
];

type FilterCategory = "all" | "activity" | "project";

export function ActionShowcase() {
  const [items, setItems] = React.useState<ActionItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedFilter, setSelectedFilter] = React.useState<FilterCategory>("all");
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [selectedItem, setSelectedItem] = React.useState<ActionItem | null>(null);
  const [isHovered, setIsHovered] = React.useState(false);

  // Fetch data from Supabase (chỉ lấy các mục is_featured = true)
  React.useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [actRes, projRes] = await Promise.allSettled([
          supabase
            .from("activities")
            .select("*")
            .eq("status", "published")
            .eq("is_featured", true)
            .order("event_date", { ascending: false }),
          supabase
            .from("projects")
            .select("*")
            .eq("is_featured", true)
            .order("created_at", { ascending: false }),
        ]);

        const fetchedItems: ActionItem[] = [];

        if (actRes.status === "fulfilled" && actRes.value.data && actRes.value.data.length > 0) {
          actRes.value.data.forEach((act: any) => {
            fetchedItems.push({
              id: `act-${act.id}`,
              type: "activity",
              title: act.title || "Hoạt động nổi bật",
              badge: act.date || act.event_date || "2024",
              date: act.date || act.event_date || "",
              excerpt: act.excerpt || "",
              content: act.content || "",
              imageUrl:
                act.imageUrl ||
                "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
              is_featured: true,
            });
          });
        }

        if (projRes.status === "fulfilled" && projRes.value.data && projRes.value.data.length > 0) {
          projRes.value.data.forEach((proj: any) => {
            fetchedItems.push({
              id: `proj-${proj.id}`,
              type: "project",
              title: proj.title || "Dự án nổi bật",
              badge: proj.year ? String(proj.year) : "2024",
              year: proj.year || "2024",
              excerpt: proj.excerpt || "",
              content: proj.content || "",
              imageUrl:
                proj.imageUrl ||
                "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&q=80",
              is_featured: true,
            });
          });
        }

        // Nếu database chưa có bản ghi is_featured, fallback sang lấy toàn bộ hoặc dùng demo
        if (fetchedItems.length === 0) {
          const [allActRes, allProjRes] = await Promise.allSettled([
            supabase
              .from("activities")
              .select("*")
              .eq("status", "published")
              .order("event_date", { ascending: false })
              .limit(5),
            supabase
              .from("projects")
              .select("*")
              .order("created_at", { ascending: false })
              .limit(5),
          ]);

          if (
            allActRes.status === "fulfilled" &&
            allActRes.value.data &&
            allActRes.value.data.length > 0
          ) {
            allActRes.value.data.forEach((act: any) => {
              fetchedItems.push({
                id: `act-${act.id}`,
                type: "activity",
                title: act.title || "Hoạt động HIEC",
                badge: act.date || act.event_date || "2024",
                date: act.date || act.event_date || "",
                excerpt: act.excerpt || "",
                content: act.content || "",
                imageUrl:
                  act.imageUrl ||
                  "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
                is_featured: true,
              });
            });
          }

          if (
            allProjRes.status === "fulfilled" &&
            allProjRes.value.data &&
            allProjRes.value.data.length > 0
          ) {
            allProjRes.value.data.forEach((proj: any) => {
              fetchedItems.push({
                id: `proj-${proj.id}`,
                type: "project",
                title: proj.title || "Dự án HIEC",
                badge: proj.year ? String(proj.year) : "2024",
                year: proj.year || "2024",
                excerpt: proj.excerpt || "",
                content: proj.content || "",
                imageUrl:
                  proj.imageUrl ||
                  "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&q=80",
                is_featured: true,
              });
            });
          }
        }

        if (fetchedItems.length > 0) {
          setItems(fetchedItems);
        } else {
          setItems(FALLBACK_FEATURED_ITEMS);
        }
      } catch (err) {
        console.error("Lỗi tải hoạt động & dự án nổi bật:", err);
        setItems(FALLBACK_FEATURED_ITEMS);
      } finally {
        setLoading(false);
      }
    }

    void fetchData();
  }, []);

  // Filter items based on active filter
  const filteredItems = React.useMemo(() => {
    if (selectedFilter === "all") return items;
    return items.filter((item) => item.type === selectedFilter);
  }, [items, selectedFilter]);

  const activityCount = React.useMemo(
    () => items.filter((i) => i.type === "activity").length,
    [items],
  );
  const projectCount = React.useMemo(
    () => items.filter((i) => i.type === "project").length,
    [items],
  );

  // Reset index when filter changes
  React.useEffect(() => {
    setCurrentIndex(0);
  }, [selectedFilter]);

  // Handle Carousel navigation
  const handlePrev = () => {
    if (filteredItems.length === 0) return;
    setCurrentIndex((prev) => (prev === 0 ? filteredItems.length - 1 : prev - 1));
  };

  const handleNext = React.useCallback(() => {
    if (filteredItems.length === 0) return;
    setCurrentIndex((prev) => (prev === filteredItems.length - 1 ? 0 : prev + 1));
  }, [filteredItems.length]);

  // Auto-play timer
  React.useEffect(() => {
    if (isHovered || loading || filteredItems.length <= 1) return;

    const interval = window.setInterval(() => {
      handleNext();
    }, 4500);

    return () => window.clearInterval(interval);
  }, [isHovered, loading, filteredItems.length, handleNext]);

  // Active items for 3-card presentation
  const currentItem = filteredItems[currentIndex] || null;

  const getPrevItem = () => {
    if (filteredItems.length <= 1) return null;
    const prevIdx = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
    return filteredItems[prevIdx];
  };

  const getNextItem = () => {
    if (filteredItems.length <= 1) return null;
    const nextIdx = (currentIndex + 1) % filteredItems.length;
    return filteredItems[nextIdx];
  };

  const prevItem = getPrevItem();
  const nextItem = getNextItem();

  return (
    <div
      className="mt-8 space-y-8"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Controls Bar: Filter Pills (Left) & Arrow Nav (Right) */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedFilter("all")}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all border",
              selectedFilter === "all"
                ? "bg-[#B5E9FB] text-slate-900 border-[#B5E9FB] shadow-xs"
                : "border-border/80 bg-card/60 text-muted-foreground hover:bg-accent/60 hover:text-foreground",
            )}
          >
            Tất cả ({items.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter("activity")}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all border",
              selectedFilter === "activity"
                ? "bg-[#B5E9FB] text-slate-900 border-[#B5E9FB] shadow-xs"
                : "border-border/80 bg-card/60 text-muted-foreground hover:bg-accent/60 hover:text-foreground",
            )}
          >
            Hoạt động ({activityCount})
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter("project")}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all border",
              selectedFilter === "project"
                ? "bg-[#B5E9FB] text-slate-900 border-[#B5E9FB] shadow-xs"
                : "border-border/80 bg-card/60 text-muted-foreground hover:bg-accent/60 hover:text-foreground",
            )}
          >
            Dự án ({projectCount})
          </button>
        </div>

        {/* Prev / Next Circular Navigation Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous slide"
            className="size-9 sm:size-10 rounded-full border border-border bg-card flex items-center justify-center text-foreground hover:bg-accent hover:border-primary/50 transition-all shadow-2xs active:scale-95"
          >
            <ChevronLeft className="size-4 sm:size-5" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next slide"
            className="size-9 sm:size-10 rounded-full border border-border bg-card flex items-center justify-center text-foreground hover:bg-accent hover:border-primary/50 transition-all shadow-2xs active:scale-95"
          >
            <ChevronRight className="size-4 sm:size-5" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex h-80 items-center justify-center">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="rounded-3xl border border-border bg-background p-12 text-center text-muted-foreground">
          Chưa có mục nổi bật nào thuộc danh mục này.
        </div>
      ) : (
        <div className="relative overflow-hidden py-4">
          {/* 3D Coverflow Slider Layout */}
          <div className="relative flex items-center justify-center min-h-[300px] sm:min-h-[380px] md:min-h-[440px] px-2 sm:px-8">
            {/* Left Card (Prev) */}
            {prevItem && (
              <div
                onClick={handlePrev}
                aria-label="Xem mục trước"
                className="hidden md:block absolute left-0 lg:left-4 z-10 w-[42%] lg:w-[45%] max-w-lg aspect-[16/10] -translate-x-[20%] scale-80 opacity-40 hover:opacity-75 transition-all duration-700 cursor-pointer rounded-[2rem] overflow-hidden shadow-md select-none"
              >
                <img
                  src={prevItem.imageUrl}
                  alt={prevItem.title}
                  className="size-full object-cover rounded-[2rem]"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-background/40 to-transparent pointer-events-none" />
              </div>
            )}

            {/* Center Active Card */}
            {currentItem && (
              <div
                onClick={() => setSelectedItem(currentItem)}
                className="relative z-20 w-full md:w-[68%] lg:w-[62%] max-w-3xl aspect-[16/10] rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-700 cursor-pointer group select-none border-2 border-white/20 dark:border-white/10"
              >
                <img
                  src={currentItem.imageUrl}
                  alt={currentItem.title}
                  className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Badge on Top-Left (e.g. 🚀 DỰ ÁN / 🎯 HOẠT ĐỘNG) */}
                <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-30">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-white shadow-lg backdrop-blur-md",
                      currentItem.type === "project"
                        ? "bg-[#10b981]" // Green badge as in image
                        : "bg-[#06b6d4]",
                    )}
                  >
                    {currentItem.type === "project" ? (
                      <>
                        <Rocket className="size-3.5" /> DỰ ÁN
                      </>
                    ) : (
                      <>
                        <Calendar className="size-3.5" /> HOẠT ĐỘNG
                      </>
                    )}
                  </span>
                </div>

                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            )}

            {/* Right Card (Next) */}
            {nextItem && (
              <div
                onClick={handleNext}
                aria-label="Xem mục tiếp"
                className="hidden md:block absolute right-0 lg:right-4 z-10 w-[42%] lg:w-[45%] max-w-lg aspect-[16/10] translate-x-[20%] scale-80 opacity-40 hover:opacity-75 transition-all duration-700 cursor-pointer rounded-[2rem] overflow-hidden shadow-md select-none"
              >
                <img
                  src={nextItem.imageUrl}
                  alt={nextItem.title}
                  className="size-full object-cover rounded-[2rem]"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-background/40 to-transparent pointer-events-none" />
              </div>
            )}
          </div>

          {/* Underneath Content Block */}
          {currentItem && (
            <div className="mt-6 text-center space-y-2 max-w-3xl mx-auto px-4 animate-fade-up">
              {/* Meta: [Dự án] • 2024 */}
              <p className="text-xs sm:text-sm font-bold text-[#38bdf8] dark:text-[#7dd3fc] tracking-wide">
                [{currentItem.type === "project" ? "Dự án" : "Hoạt động"}] •{" "}
                {currentItem.year || currentItem.date || currentItem.badge}
              </p>

              {/* Title */}
              <h3
                onClick={() => setSelectedItem(currentItem)}
                className="text-lg sm:text-2xl md:text-3xl font-extrabold text-foreground tracking-tight hover:text-primary transition-colors cursor-pointer"
              >
                {currentItem.title}
              </h3>

              {/* Excerpt / Authors */}
              {currentItem.excerpt && (
                <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed max-w-2xl mx-auto line-clamp-2">
                  {currentItem.excerpt}
                </p>
              )}

              {/* View Details Link */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedItem(currentItem)}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#38bdf8] dark:text-[#7dd3fc] hover:underline"
                >
                  Xem chi tiết <ArrowUpRight className="size-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Detail Modal */}
      <Modal
        open={!!selectedItem}
        onOpenChange={(open) => !open && setSelectedItem(null)}
        title={
          <div className="flex flex-col gap-3 text-left">
            <HiecLogo />
            <span className="mt-2 block font-display text-2xl font-black uppercase tracking-tighter text-slate-900 dark:text-white md:text-3xl">
              {selectedItem?.title}
            </span>
          </div>
        }
        description={
          selectedItem?.type === "activity"
            ? `Hoạt động nổi bật HIEC - ${selectedItem?.badge}`
            : `Dự án nổi bật HIEC - ${selectedItem?.badge}`
        }
      >
        {selectedItem && (
          <div className="max-w-4xl space-y-8 bg-white py-2 text-left transition-colors duration-300 dark:bg-slate-950">
            <div className="aspect-video w-full overflow-hidden rounded-[2.5rem] border-4 border-slate-100 shadow-2xl dark:border-slate-800">
              <img
                src={selectedItem.imageUrl}
                alt={selectedItem.title}
                className="size-full object-cover"
              />
            </div>

            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.2em]",
                    selectedItem.type === "activity"
                      ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"
                      : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                  )}
                >
                  {selectedItem.type === "activity" ? (
                    <>
                      <Calendar className="size-3.5" /> Thời gian:{" "}
                      {selectedItem.date || selectedItem.badge}
                    </>
                  ) : (
                    <>
                      <Rocket className="size-3.5" /> Triển khai:{" "}
                      {selectedItem.year || selectedItem.badge}
                    </>
                  )}
                </span>

                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-1 text-[11px] font-bold">
                  <Sparkles className="size-3" /> Nổi bật
                </span>
              </div>

              {selectedItem.excerpt && (
                <p className="text-base font-semibold leading-relaxed text-slate-700 dark:text-slate-300 md:text-lg">
                  {selectedItem.excerpt}
                </p>
              )}

              <div className="whitespace-pre-wrap text-base sm:text-lg font-medium leading-loose text-slate-800 dark:text-slate-100">
                {selectedItem.content || selectedItem.excerpt}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-8 dark:border-slate-800">
              <Link
                to={selectedItem.type === "activity" ? "/activities" : "/projects"}
                className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary-deep hover:underline dark:text-primary"
              >
                Xem tất cả {selectedItem.type === "activity" ? "hoạt động" : "dự án"}
                <ArrowUpRight className="size-4" />
              </Link>
              <Button
                variant="default"
                className="rounded-2xl bg-slate-900 px-8 py-4 text-xs font-bold uppercase tracking-wider text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900"
                onClick={() => setSelectedItem(null)}
              >
                <ChevronLeft className="mr-2 size-4" /> Đóng
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
