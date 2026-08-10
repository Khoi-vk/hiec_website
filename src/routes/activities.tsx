import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2, ArrowRight, ChevronLeft, Calendar, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { PublicLayout } from "@/components/layout/public-layout";
import { supabase } from "@/utils/supabase";

// Sử dụng 'as any' để tránh lỗi treo Crawling
export const Route = createFileRoute("/activities")({
  component: ActivitiesPage,
});

function ActivitiesPage() {
  const [activities, setActivities] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedAct, setSelectedAct] = React.useState<any>(null);

  React.useEffect(() => {
    async function fetchActivities() {
      try {
        const { data, error } = await supabase
          .from("activities")
          .select("*")
          .order("created_at", { ascending: false });
        
        if (error) throw error;
        if (data) setActivities(data);
      } catch (err) {
        console.error("Lỗi lấy dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchActivities();
  }, []);

  return (
    <PublicLayout>
      {/* 1. BANNER SIÊU GỌN - BỐ CỤC 2 CỘT HIỆN ĐẠI */}
      <section className="relative overflow-hidden bg-white pt-8 pb-4 md:pt-12 md:pb-6 border-b border-slate-100">
        {/* Mesh Gradient lấp lánh màu Cyan nhạt ở nền */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-cyan-50/50 blur-[100px] rounded-full -z-10" />
        
        <div className="container relative mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-12">
            
            {/* Cột trái: Tiêu đề khổng lồ kiểu chữ "công" */}
            <div className="flex-shrink-0 animate-fade-up">
              <Badge className="bg-cyan-100/50 text-cyan-700 border-none mb-2 px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.2em]">
                Latest Events
              </Badge>
              <h1 className="font-display text-6xl md:text-8xl font-black text-[#0f3d3e] uppercase tracking-tighter leading-[0.8]">
                Hoạt động
              </h1>
            </div>

            {/* Cột phải: Nhấc nội dung mô tả sang ngang */}
            <div className="max-w-md md:border-l-2 border-cyan-500/20 md:pl-8 animate-fade-up [animation-delay:200ms]">
              <h2 className="text-[#0f3d3e] text-sm md:text-lg font-black uppercase tracking-tight mb-2 leading-tight">
                Nhịp đập sáng tạo <br /> tại HIEC HUST
              </h2>
              <p className="text-slate-500 text-xs md:text-sm font-medium leading-relaxed">
                Ghi lại những khoảnh khắc bùng nổ, hành trình kết nối và sẻ chia giá trị của cộng đồng sinh viên.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 2. DANH SÁCH HOẠT ĐỘNG - TRỒI LÊN CAO ĐỂ THẤY ẢNH NGAY */}
      <section className="py-8 md:py-12 bg-slate-50/30 min-h-[600px]">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center py-10 text-cyan-600">
              <Loader2 className="animate-spin size-8" />
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {activities.map((act) => (
                <div 
                  key={act.id} 
                  onClick={() => setSelectedAct(act)}
                  className="group cursor-pointer"
                >
                  <Card className="h-full border-none shadow-sm hover:shadow-xl hover:shadow-cyan-900/5 transition-all duration-500 rounded-[2rem] overflow-hidden bg-white border border-slate-100">
                    <div className="aspect-[16/10] overflow-hidden relative m-1.5 rounded-[1.5rem]">
                      <img 
                        src={act.imageUrl || "https://images.unsplash.com/photo-1523580494863-6f30312248f5?q=80&w=2070"} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        alt={act.title}
                      />
                    </div>

                    <CardContent className="p-6 pt-2">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-bold text-cyan-600 uppercase tracking-widest bg-cyan-50 px-2 py-0.5 rounded">
                          {act.date}
                        </span>
                        <Sparkles className="size-3 text-cyan-200" />
                      </div>
                      
                      {/* Tiêu đề cực đậm kiểu "công" */}
                      <h3 className="font-display text-xl font-black text-[#1a2e35] group-hover:text-cyan-600 transition-colors leading-[1.2] uppercase tracking-tighter mb-3">
                        {act.title}
                      </h3>
                      <p className="text-slate-500 text-xs line-clamp-2 font-medium mb-6">
                        {act.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between mt-auto">
                         <span className="text-[9px] font-black tracking-widest text-slate-400 uppercase group-hover:text-cyan-600 transition-colors">Chi tiết</span>
                         <div className="size-10 rounded-xl bg-cyan-100/50 text-cyan-600 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-white transition-all duration-300">
                            <ArrowRight className="size-4" />
                         </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          )}

          {!loading && activities.length === 0 && (
            <div className="text-center py-20 text-muted-foreground text-sm font-medium uppercase tracking-widest">
              Chưa có hoạt động nào được đăng tải.
            </div>
          )}
        </div>
      </section>

      {/* 3. CỬA SỔ CHI TIẾT (MODAL) - GIỮ NGUYÊN STYLE SANG TRỌNG */}
      <Modal
        open={!!selectedAct}
        onOpenChange={(open) => !open && setSelectedAct(null)}
        title={selectedAct?.title}
      >
        {selectedAct && (
          <div className="space-y-6 py-2 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar text-left">
            <div className="w-full aspect-video rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm bg-slate-50">
               <img 
                 src={selectedAct.imageUrl || "https://images.unsplash.com/photo-1523580494863-6f30312248f5?q=80&w=2070"} 
                 className="w-full h-full object-cover"
                 alt=""
               />
            </div>

            <div className="space-y-4">
               <div className="flex items-center gap-2 text-cyan-600 font-black text-[10px] uppercase tracking-[0.2em]">
                  <Calendar className="size-4" /> 
                  Thời gian: {selectedAct.date}
               </div>
               
               <div className="prose prose-slate max-w-none">
                  <div className="text-[#1a2e35]/80 leading-relaxed whitespace-pre-wrap font-medium text-sm md:text-base">
                    {selectedAct.content}
                  </div>
               </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-end">
              <Button 
                variant="shimmer" 
                className="bg-cyan-100 hover:bg-cyan-200 text-cyan-700 border-none rounded-2xl px-6 py-5 font-bold uppercase text-[10px] tracking-widest"
                onClick={() => setSelectedAct(null)}
              >
                <ChevronLeft className="mr-2 size-4" /> Quay lại
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </PublicLayout>
  );
}