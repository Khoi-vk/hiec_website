import * as React from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  Calendar,
  ChevronLeft,
  Loader2,
  Rocket,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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

  React.useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [actRes, projRes] = await Promise.allSettled([
          supabase
            .from("activities")
            .select("*")
            .eq("status", "published")
            .order("event_date", { ascending: false }),
          supabase
            .from("projects")
            .select("*")
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

  const orderedItems = React.useMemo(
    () => [...items].sort((a, b) => Number(b.type === "activity") - Number(a.type === "activity")),
    [items],
  );

  return (
    <div className="mt-8">
      {loading ? (
        <div className="flex h-72 items-center justify-center">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      ) : orderedItems.length === 0 ? (
        <div className="rounded-[2rem] border border-border bg-background p-12 text-center text-muted-foreground">
          Chưa có mục nào được công bố.
        </div>
      ) : (
        <div className="-mx-5 overflow-x-auto px-5 pb-5 scrollbar-none sm:mx-0 sm:px-0">
          <div className="flex w-max gap-6">
            {orderedItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="group w-[280px] shrink-0 cursor-pointer sm:w-[300px]"
              >
                <Card className="flex flex-col h-full border-none shadow-sm hover:shadow-xl transition-all duration-500 rounded-[2rem] overflow-hidden bg-white dark:bg-slate-900 border border-transparent dark:border-slate-800">
                  <div className="aspect-[16/10] overflow-hidden m-1.5 rounded-[1.5rem] shrink-0">
                    <img
                      src={item.imageUrl}
                      className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                      alt={item.title}
                    />
                  </div>

                  <CardContent className="flex grow flex-col p-6 pt-2">
                    {item.type === "activity" ? (
                      <div className="mb-3 flex items-center">
                        <span className="rounded bg-primary/5 px-2 py-0.5 text-[10px] font-bold text-primary dark:bg-primary/10">
                          {item.badge}
                        </span>
                      </div>
                    ) : (
                      <div className="mb-3 flex items-center justify-between">
                        <span className="rounded bg-primary/5 px-2 py-0.5 text-[10px] font-bold text-primary dark:bg-primary/10">
                          {item.badge}
                        </span>
                        <Rocket className="size-3 text-primary/20" />
                      </div>
                    )}

                    <h3 className="font-display text-base font-black text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors leading-tight uppercase tracking-tighter mb-2 line-clamp-2 min-h-[2.5rem]">
                      {item.title}
                    </h3>
                    <p className={`text-slate-600 dark:text-slate-400 text-[11px] line-clamp-2 font-medium mb-5 ${item.type === "project" ? "leading-relaxed" : ""}`}>
                      {item.excerpt}
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-50 dark:border-slate-800">
                      <span className="text-[9px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase group-hover:text-primary transition-colors">
                        {item.type === "project" ? "Chi tiết dự án" : "Chi tiết"}
                      </span>
                      <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                        <ArrowRight className="size-3.5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
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

