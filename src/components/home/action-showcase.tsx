import * as React from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Rocket,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { HiecLogo } from "@/components/ui/hiec-logo";
import { supabase } from "@/utils/supabase";

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

const FALLBACK_ITEMS: ActionItem[] = [
  {
    id: "act-fb-1",
    type: "activity",
    title: "HIEC Startup Bootcamp 2025",
    badge: "2025",
    date: "2025",
    excerpt:
      "Chương trình huấn luyện chuyên sâu 6 tuần biến ý tưởng thô thành mô hình kinh doanh gọi vốn.",
    content:
      "HIEC Startup Bootcamp là chương trình ươm mầm sáng tạo thường niên dành cho sinh viên có đam mê khởi nghiệp. Trải qua 6 tuần đào tạo, cố vấn và thực chiến, các đội thi hoàn thiện sản phẩm và thuyết trình trước hội đồng đầu tư.",
    imageUrl:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "proj-fb-1",
    type: "project",
    title: "Nền tảng Kết nối Mentor Sinh viên",
    badge: "Năm 2025",
    year: "2025",
    excerpt:
      "Mạng lưới kết nối sinh viên khởi nghiệp với hơn 45+ cố vấn doanh nghiệp và cựu sinh viên thành công.",
    content:
      "Dự án số hóa quy trình kết nối cố vấn (Mentor Connect), giúp sinh viên nhận được phản hồi trực tiếp về ý tưởng kinh doanh, xây dựng kỹ năng lãnh đạo và mở rộng quan hệ đối tác.",
    imageUrl:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "act-fb-2",
    type: "activity",
    title: "HIEC Talk: Đối thoại cùng Nhà sáng lập",
    badge: "2024",
    date: "2024",
    excerpt:
      "Chuỗi tọa đàm hàng tháng chia sẻ bài học thực chiến từ các Founder và chuyên gia công nghệ.",
    content:
      "HIEC Talk mang đến không gian trò chuyện cởi mở giữa các diễn giả khách mời uy tín và cộng đồng sinh viên, giải đáp những thách thức thực tế trong quá trình xây dựng startup.",
    imageUrl:
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "proj-fb-2",
    type: "project",
    title: "Green Impact Challenge 2024",
    badge: "Năm 2024",
    year: "2024",
    excerpt:
      "Thử thách phát triển giải pháp kinh doanh tuần hoàn và phát triển bền vững trong môi trường đại học.",
    content:
      "Dự án tập trung vào các sáng kiến giải quyết vấn đề rác thải nhựa, tiết kiệm năng lượng và thúc đẩy lối sống xanh trong khuôn viên trường học.",
    imageUrl:
      "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&q=80",
  },
];

export function ActionShowcase() {
  const [items, setItems] = React.useState<ActionItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedItem, setSelectedItem] = React.useState<ActionItem | null>(null);
  const [activeTab, setActiveTab] = React.useState<"all" | "activities" | "projects">("all");
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const [autoplayResetKey, setAutoplayResetKey] = React.useState(0);

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
            .order("displayOrder", { ascending: true }),
        ]);

        const fetchedItems: ActionItem[] = [];

        if (actRes.status === "fulfilled" && actRes.value.data && actRes.value.data.length > 0) {
          actRes.value.data.forEach((act: any) => {
            fetchedItems.push({
              id: `act-${act.id}`,
              type: "activity",
              title: act.title || "Hoạt động HIEC",
              badge: act.date || act.event_date || "Hoạt động",
              date: act.date || act.event_date || "",
              excerpt: act.excerpt || "",
              content: act.content || "",
              imageUrl:
                act.imageUrl ||
                "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
              is_featured: true,
            });
          });
        }

        if (projRes.status === "fulfilled" && projRes.value.data && projRes.value.data.length > 0) {
          projRes.value.data.forEach((proj: any) => {
            fetchedItems.push({
              id: `proj-${proj.id}`,
              type: "project",
              title: proj.title || "Dự án HIEC",
              badge: proj.year ? `Năm ${proj.year}` : "Dự án",
              year: proj.year || "",
              excerpt: proj.excerpt || "",
              content: proj.content || "",
              imageUrl:
                proj.imageUrl || "https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80",
              is_featured: true,
            });
          });
        }

        if (fetchedItems.length > 0) {
          setItems(fetchedItems);
        } else {
          setItems(FALLBACK_ITEMS);
        }
      } catch (err) {
        console.error("Lỗi tải hoạt động & dự án:", err);
        setItems(FALLBACK_ITEMS);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const filteredItems = React.useMemo(() => {
    if (activeTab === "activities") {
      return items.filter((item) => item.type === "activity");
    }
    if (activeTab === "projects") {
      return items.filter((item) => item.type === "project");
    }
    return items;
  }, [items, activeTab]);

  const moveSlide = React.useCallback((direction: "left" | "right") => {
    setCurrentIndex((index) => {
      if (filteredItems.length === 0) return 0;
      const offset = direction === "left" ? -1 : 1;
      return (index + offset + filteredItems.length) % filteredItems.length;
    });
  }, [filteredItems.length]);

  const handleNext = React.useCallback(() => {
    setAutoplayResetKey((key) => key + 1);
    moveSlide("right");
  }, [moveSlide]);

  const handlePrev = React.useCallback(() => {
    setAutoplayResetKey((key) => key + 1);
    moveSlide("left");
  }, [moveSlide]);

  React.useEffect(() => {
    if (filteredItems.length < 2) return;

    const timer = window.setInterval(() => {
      if (isPaused) return;
      moveSlide("right");
    }, 5000);

    return () => window.clearInterval(timer);
  }, [filteredItems.length, activeTab, autoplayResetKey, isPaused, moveSlide]);

  React.useEffect(() => {
    setCurrentIndex(0);
  }, [activeTab]);

  React.useEffect(() => {
    if (currentIndex >= filteredItems.length && filteredItems.length > 0) {
      setCurrentIndex(0);
    }
  }, [currentIndex, filteredItems.length]);

  const currentItem = filteredItems[currentIndex];
  const previousItem = filteredItems.length > 1
    ? filteredItems[(currentIndex - 1 + filteredItems.length) % filteredItems.length]
    : undefined;
  const nextItem = filteredItems.length > 1
    ? filteredItems[(currentIndex + 1) % filteredItems.length]
    : undefined;

  return (
    <div className="mt-8 space-y-6">
      {/* Tab controls & scroll navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 rounded-full border border-border bg-background p-1 shadow-sm">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
              activeTab === "all"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Tất cả ({items.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("activities")}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
              activeTab === "activities"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Hoạt động ({items.filter((i) => i.type === "activity").length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("projects")}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
              activeTab === "projects"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Dự án ({items.filter((i) => i.type === "project").length})
          </button>
        </div>

        <div className="hidden items-center gap-2 sm:flex">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handlePrev}
            className="size-9 rounded-full border-border bg-background transition-colors hover:bg-accent"
            aria-label="Cuộn sang trái"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleNext}
            className="size-9 rounded-full border-border bg-background transition-colors hover:bg-accent"
            aria-label="Cuộn sang phải"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      {/* Center spotlight */}
      {loading ? (
        <div className="flex h-72 items-center justify-center">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="rounded-[2rem] border border-border bg-background p-12 text-center text-muted-foreground">
          Chưa có mục nào được công bố.
        </div>
      ) : (
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
          className="relative mx-auto flex h-[32rem] max-w-6xl items-center justify-center overflow-hidden md:h-[34rem]"
        >
          {previousItem && (
            <ShowcaseSideCard item={previousItem} position="previous" />
          )}
          {currentItem && (
            <ShowcaseActiveCard item={currentItem} onSelect={() => setSelectedItem(currentItem)} />
          )}
          {nextItem && (
            <ShowcaseSideCard item={nextItem} position="next" />
          )}
        </div>
      )}

      {currentItem && filteredItems.length > 0 && (
        <div className="mx-auto flex max-w-md items-center justify-between gap-6 rounded-full border border-border bg-background/80 px-6 py-2 backdrop-blur-md">
          <span className="truncate text-xs font-bold text-foreground sm:text-sm">{currentItem.badge} · {currentItem.title}</span>
          <span className="shrink-0 text-xs font-bold tabular-nums text-primary sm:text-sm">
            {String(currentIndex + 1).padStart(2, "0")} / {String(filteredItems.length).padStart(2, "0")}
          </span>
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
            ? `Hoạt động HIEC - ${selectedItem?.badge}`
            : `Dự án HIEC - ${selectedItem?.badge}`
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
                  className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] ${
                    selectedItem.type === "activity"
                      ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"
                      : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  }`}
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
              </div>

              {selectedItem.excerpt && (
                <p className="text-base font-semibold leading-relaxed text-slate-700 dark:text-slate-300 md:text-lg">
                  {selectedItem.excerpt}
                </p>
              )}

              <div className="whitespace-pre-wrap text-lg font-medium leading-loose text-slate-800 dark:text-slate-100 md:text-xl">
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
                variant="shimmer"
                className="rounded-2xl bg-slate-900 px-10 py-6 text-xs font-black uppercase tracking-widest text-white transition-all hover:scale-105 active:scale-95 dark:bg-white dark:text-slate-900"
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

function ShowcaseActiveCard({
  item,
  onSelect,
}: {
  item: ActionItem;
  onSelect: () => void;
}) {
  return (
    <div onClick={onSelect} className="group relative z-20 w-[320px] shrink-0 cursor-pointer text-center sm:w-[480px] md:w-[600px]">
      <Card className="relative h-[280px] overflow-hidden rounded-2xl border-border bg-card shadow-xl ring-2 ring-primary/40 transition-all duration-700 ease-out md:h-[340px]">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span
          className={`absolute left-4 top-4 inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-white shadow-sm backdrop-blur-md ${
            item.type === "activity" ? "bg-cyan-500/90" : "bg-emerald-500/90"
          }`}
        >
          {item.type === "activity" ? <Calendar className="size-3" /> : <Rocket className="size-3" />}
          {item.type === "activity" ? "Hoạt động" : "Dự án"}
        </span>
      </Card>
      <div className="mx-auto mt-4 max-w-xl text-center">
        <p className="text-xs font-semibold text-primary">[{item.type === "activity" ? "Hoạt động" : "Dự án"}] • {item.date || item.year || item.badge}</p>
        <h3 className="mt-1 line-clamp-1 text-lg font-bold text-foreground md:text-xl">{item.title}</h3>
        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground md:text-sm">{item.excerpt}</p>
        <Link
          to={item.type === "activity" ? "/activities" : "/projects"}
          onClick={(event) => event.stopPropagation()}
          className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80"
        >
          Xem chi tiết <ArrowUpRight className="size-3.5" />
        </Link>
      </div>
    </div>
  );
}

function ShowcaseSideCard({
  item,
  position,
}: {
  item: ActionItem;
  position: "previous" | "next";
}) {
  return (
    <div
      className={`pointer-events-none absolute top-1/2 hidden w-[260px] -translate-y-1/2 scale-90 opacity-35 blur-[0.5px] transition-all duration-700 ease-out sm:block md:w-[320px] ${
        position === "previous" ? "left-0" : "right-0"
      }`}
    >
      <Card className="overflow-hidden rounded-2xl border-border bg-card shadow-xl">
        <div className="h-[200px] overflow-hidden rounded-xl md:h-[240px]">
          <img src={item.imageUrl} alt={item.title} className="size-full object-cover" />
        </div>
      </Card>
    </div>
  );
}
