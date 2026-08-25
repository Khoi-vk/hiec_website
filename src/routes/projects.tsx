import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2, ArrowRight, ChevronLeft, Rocket } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { PublicLayout } from "@/components/layout/public-layout";
import { HiecLogo } from "@/components/ui/hiec-logo";
import { supabase } from "@/utils/supabase";
import { Input } from "@/components/ui/input";

// Sử dụng 'as any' để tránh lỗi treo Crawling hệ thống
export const Route = createFileRoute("/projects")({
  component: ProjectsPage,
});

function ProjectsPage() {
  const [projects, setProjects] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedProject, setSelectedProject] = React.useState<any>(null);
  
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedGeneration, setSelectedGeneration] =
    React.useState("Tất cả");
  const [selectedField, setSelectedField] =
    React.useState("Tất cả");

  React.useEffect(() => {
    async function fetchProjects() {
      try {
        const { data, error } = await supabase
          .from("projects")
          .select(`
            *,
            project_categories (
              field_id,
              project_fields (
                id,
                name
              )
            )
          `)
          .eq("status", "published")
          .order("year", { ascending: false });

        if (error) throw error;
        
        if (data) {
          const normalizedProjects = data.map((project) => ({
            ...project,
            fields: (project.project_categories ?? [])
              .map((item: any) => item.project_fields?.name)
              .filter(Boolean),
          }));
        
          setProjects(normalizedProjects);
        }
      } catch (err) {
        console.error("Lỗi lấy dữ liệu dự án:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const allGenerations = Array.from(
    new Set(
      projects
        .map((project) => project.generation)
        .filter(Boolean)
    )
  );
  
  const allFields = Array.from(
    new Set(
      projects.flatMap((project) => project.fields ?? [])
    )
  );

  const filteredProjects = projects.filter((project) => {
    const keyword = searchTerm.trim().toLowerCase();
  
    const matchesSearch =
      !keyword ||
      project.title?.toLowerCase().includes(keyword) ||
      project.excerpt?.toLowerCase().includes(keyword);
  
    const matchesGeneration =
      selectedGeneration === "Tất cả" ||
      project.generation === selectedGeneration;
  
    const matchesField =
      selectedField === "Tất cả" ||
      project.fields?.includes(selectedField);
  
    return (
      matchesSearch &&
      matchesGeneration &&
      matchesField
    );
  });

  return (
    <PublicLayout>
      {/* 1. BANNER SIÊU GỌN - BỐ CỤC 2 CỘT TỰ ĐỘNG ĐẢO MÀU CHỮ */}
      <section className="relative overflow-hidden bg-white dark:bg-slate-950 pt-16 pb-10 border-b border-slate-100 dark:border-slate-800 transition-colors duration-300 text-left">
        {/* Mesh Gradient lấp lánh nhẹ ở nền */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-cyan-50/50 dark:bg-cyan-900/10 blur-[100px] rounded-full -z-10" />

        <div className="max-w-[1300px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            {/* Cột trái: Tiêu đề khổng lồ kiểu chữ "công" */}
            <div className="flex-shrink-0 animate-fade-up">
              
              <h1 className="font-sans text-5xl md:text-6xl font-bold text-[#0f3d3e] dark:text-white uppercase tracking-[-0.04em] leading-[0.9] transition-colors">
                Dự án
              </h1>
            </div>

            {/* Cột phải: Nội dung mô tả ngang hàng */}
            <div className="max-w-md md:border-l-2 border-slate-200 dark:border-slate-800 md:pl-10 pb-2 animate-fade-up [animation-delay:200ms]">
              <h2 className="text-slate-800 dark:text-slate-200 text-lg font-black uppercase tracking-tight mb-3 leading-tight">
                Hiện thực hóa <br /> những ý tưởng đột phá
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">
                Nơi những giải pháp sáng tạo được nuôi dưỡng và tạo ra tác động thực chất cho cộng
                đồng sinh viên Bách Khoa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DANH SÁCH DỰ ÁN - CARD TỰ ĐẢO MÀU CHỮ */}
      <section className="py-12 bg-slate-50/30 dark:bg-slate-900/20 min-h-[600px] transition-colors duration-300">
        <div className="max-w-[1300px] mx-auto px-6 md:px-12">
          <div className="mb-8 flex flex-col gap-3 md:flex-row">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm dự án..."
              className="h-11 rounded-xl bg-white dark:bg-slate-900"
            />
          
            <select
              value={selectedGeneration}
              onChange={(e) =>
                setSelectedGeneration(e.target.value)
              }
              className="h-11 rounded-xl bg-white dark:bg-slate-900 px-3 text-sm font-bold text-slate-900 dark:text-slate-100 outline-none"
            >
              <option value="Tất cả">Tất cả Gen</option>
          
              {allGenerations.map((generation) => (
                <option key={generation} value={generation}>
                  {generation}
                </option>
              ))}
            </select>
          
            <select
              value={selectedField}
              onChange={(e) =>
                setSelectedField(e.target.value)
              }
              className="h-11 rounded-xl bg-white dark:bg-slate-900 px-3 text-sm font-bold text-slate-900 dark:text-slate-100 outline-none"
            >
              <option value="Tất cả">Tất cả lĩnh vực</option>
          
              {allFields.map((field) => (
                <option key={field} value={field}>
                  {field}
                </option>
              ))}
            </select>
          </div>
          {loading ? (
            <div className="flex justify-center py-20 text-cyan-600">
              <Loader2 className="animate-spin size-8" />
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 text-left">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className="group cursor-pointer"
                >
                  {/* THÊM 'flex flex-col' vào Card */}
                  <Card className="flex flex-col h-full border-none shadow-sm hover:shadow-xl transition-all duration-500 rounded-[2rem] overflow-hidden bg-white dark:bg-slate-900 border border-transparent dark:border-slate-800">
                    {/* THÊM 'shrink-0' để vùng chứa ảnh không bị bóp méo */}
                    <div className="aspect-[16/10] overflow-hidden m-1.5 rounded-[1.5rem] shrink-0">
                      <img
                        src={
                          project.imageUrl ||
                          "https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80"
                        }
                        className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                        alt={project.title}
                      />
                    </div>

                    {/* THÊM 'flex flex-col grow' vào CardContent để nó chiếm hết phần không gian còn lại */}
                    <CardContent className="flex flex-col grow p-6 pt-2">
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-bold text-primary bg-primary/5 dark:bg-primary/10 px-2 py-0.5 rounded">
                          {project.generation || "—"}
                        </span>
                      
                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                          {project.year}
                        </span>
                      
                        <Rocket className="ml-auto size-3 text-primary/20" />
                      </div>

                      {(project.fields ?? []).map((field: string) => (
                        <Badge
                          key={field}
                          variant="secondary"
                          className="text-[9px]"
                        >
                          {field}
                        </Badge>
                      ))}

                      <h3 className="font-display text-base font-black text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors leading-tight uppercase tracking-tighter mb-2 line-clamp-2 min-h-[2.5rem]">
                        {project.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 text-[11px] line-clamp-2 font-medium mb-5 leading-relaxed">
                        {project.excerpt}
                      </p>

                      {/* Nhờ có phần grow ở trên, class mt-auto ở đây sẽ đẩy khối này xuống sát đáy */}
                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-50 dark:border-slate-800">
                        <span className="text-[9px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase group-hover:text-primary transition-colors">
                          Chi tiết dự án
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
          )}

          {!loading && filteredProjects.length === 0 && (
            <div className="text-center py-20 text-slate-400 text-sm font-medium uppercase tracking-widest">
              Không tìm thấy dự án phù hợp.
            </div>
          )}
        </div>
      </section>

      {/* 3. MODAL CHI TIẾT DỰ ÁN - PHÓNG ĐẠI SANG TRỌNG */}
      <Modal
        open={!!selectedProject}
        onOpenChange={(open) => !open && setSelectedProject(null)}
        title={
          <div className="flex flex-col gap-4 text-left">
            <HiecLogo />
            <span className="text-slate-900 dark:text-white text-2xl md:text-3xl font-black uppercase tracking-tighter mt-2 block">
              {selectedProject?.title}
            </span>
          </div>
        }
        description={`Hành trình dự án triển khai năm ${selectedProject?.year}`}
      >
        {selectedProject && (
          <div className="max-w-4xl mx-auto space-y-10 py-2 max-h-[75vh] overflow-y-auto pr-4 custom-scrollbar text-left bg-white dark:bg-slate-950 transition-colors duration-300">
            <div className="w-full aspect-video rounded-[2.5rem] overflow-hidden border-4 border-slate-100 dark:border-slate-800 shadow-2xl bg-slate-50 dark:bg-slate-900">
              <img
                src={
                  selectedProject.imageUrl ||
                  "https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80"
                }
                className="w-full h-full object-cover"
                alt=""
              />
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3 text-cyan-600 dark:text-cyan-400 font-black text-[11px] uppercase tracking-[0.3em] bg-slate-50 dark:bg-white/5 w-fit px-4 py-2 rounded-full border border-slate-100 dark:border-white/10">
                <div className="flex flex-wrap items-center gap-2 text-cyan-600 dark:text-cyan-400 font-black text-[11px] uppercase tracking-[0.3em]">
                  <div className="flex items-center gap-2 bg-slate-50 dark:bg-white/5 px-4 py-2 rounded-full border border-slate-100 dark:border-white/10">
                    <Rocket className="size-4" />
                    {selectedProject.generation || "—"}
                  </div>
                
                  <div className="flex flex-wrap gap-2">
                    {(selectedProject.fields ?? []).map((field: string) => (
                      <Badge
                        key={field}
                        variant="secondary"
                        className="text-[9px]"
                      >
                        {field}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* PHẦN GIỚI THIỆU NGẮN (EXCERPT) */}
              {selectedProject.excerpt && (
                <p className="text-slate-700 dark:text-slate-300 text-base md:text-lg font-semibold leading-relaxed">
                  {selectedProject.excerpt}
                </p>
              )}

              {/* NỘI DUNG DỰ ÁN: Tự đảo màu chữ */}
              <div className="text-slate-800 dark:text-slate-100 text-lg md:text-xl md:leading-loose whitespace-pre-wrap font-medium">
                {selectedProject.content}
              </div>
            </div>

            <div className="pt-10 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <Button
                variant="shimmer"
                className="rounded-2xl px-12 py-7 font-black uppercase text-xs tracking-widest bg-slate-900 dark:bg-white text-white dark:text-slate-900 transition-all hover:scale-105 active:scale-95 shadow-xl"
                onClick={() => setSelectedProject(null)}
              >
                <ChevronLeft className="mr-2 size-5" /> Quay lại
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </PublicLayout>
  );
}
