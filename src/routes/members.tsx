import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2, User, ChevronLeft, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { PublicLayout } from "@/components/layout/public-layout";
import { supabase } from "@/utils/supabase";

export const Route = createFileRoute("/members")({
  component: MembersPage,
});

function MembersPage() {
  const [members, setMembers] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedMember, setSelectedMember] = React.useState<any>(null);

  React.useEffect(() => {
    async function fetchMembers() {
      try {
        const { data, error } = await supabase
          .from("members")
          .select("*")
          .order("displayOrder", { ascending: true });
        if (error) throw error;
        if (data) setMembers(data);
      } catch (err) {
        console.error("Lỗi lấy dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchMembers();
  }, []);

  return (
    <PublicLayout>
      {/* 1. BANNER SIÊU MỎNG & LÓNG LÁNH */}
      <section className="relative overflow-hidden bg-white dark:bg-slate-950 pt-8 pb-4 md:pt-12 md:pb-6 border-b border-slate-100 dark:border-slate-800 transition-colors">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-cyan-50/50 dark:bg-cyan-900/10 blur-[100px] rounded-full -z-10 transition-colors" />
        
        <div className="max-w-[1300px] mx-auto px-6 md:px-12 text-left">  
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-12">
            <div className="flex-shrink-0 animate-fade-up">
              <Badge className="bg-cyan-100/50 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-400 border-none mb-2 px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.2em] transition-colors">
                Our Team
              </Badge>
              {/* KÍCH THƯỚC CHỮ ĐƯỢC GIỮ NGUYÊN */}
              <h1 className="font-sans text-5xl md:text-6xl font-bold text-[#0f3d3e] dark:text-white uppercase tracking-[-0.04em] leading-[0.9] transition-colors">
                Thành viên
              </h1>
            </div>

            <div className="max-w-md md:border-l-2 border-cyan-500/20 dark:border-cyan-500/10 md:pl-8 animate-fade-up [animation-delay:200ms]">
              <h2 className="text-[#0f3d3e] dark:text-slate-100 text-sm md:text-lg font-black uppercase tracking-tight mb-2 leading-tight transition-colors">
                Đội ngũ nòng cốt <br /> dẫn dắt HIEC
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm font-medium leading-relaxed transition-colors">
                Những cá nhân xuất sắc cùng chung tay xây dựng hệ sinh thái khởi nghiệp sáng tạo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DANH SÁCH THÀNH VIÊN - CẤU TRÚC CARD Y HỆT ACTIVITIES & PROJECTS */}
      <section className="py-8 md:py-12 bg-slate-50/30 dark:bg-slate-900 min-h-[600px] transition-colors">
        <div className="max-w-[1300px] mx-auto px-6 md:px-12 text-left">
          {loading ? (
            <div className="flex justify-center py-20 text-cyan-600 dark:text-cyan-400">
              <Loader2 className="animate-spin size-8" />
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {members.map((member) => (
                <div 
                  key={member.id} 
                  onClick={() => setSelectedMember(member)}
                  className="group cursor-pointer"
                >
                  {/* CARD: Có 'flex flex-col h-full' giống hệ projects/activities */}
                  <Card className="flex flex-col h-full border-none shadow-sm hover:shadow-xl transition-all duration-500 rounded-[2rem] overflow-hidden bg-white dark:bg-slate-950 border border-transparent dark:border-slate-800">
                    
                    {/* CONTAINER ẢNH - Dùng aspect-square để phù hợp ảnh chân dung */}
                    <div className="aspect-square overflow-hidden m-1.5 rounded-[1.5rem] shrink-0 bg-slate-100 dark:bg-slate-800 relative">
                      {member.avatarUrl ? (
                        <img 
                          src={member.avatarUrl} 
                          alt={member.fullName} 
                          className="size-full object-cover transition-transform duration-700 group-hover:scale-105" 
                        />
                      ) : (
                        <div className="size-full flex items-center justify-center text-slate-300 dark:text-slate-600">
                          <User className="size-16" />
                        </div>
                      )}
                    </div>

                    {/* NỘI DUNG CARD: Có 'grow' để đẩy footer xuống đáy */}
                    <CardContent className="flex flex-col grow p-6 pt-3">
                      
                      
                      <h3 className="font-sans text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors leading-snug tracking-normal mb-1.5 line-clamp-2">
                        {member.fullName}
                      </h3>
                      
                      <p className="text-slate-600 dark:text-slate-300 text-sm font-semibold mb-5">
                        {member.department}
                      </p>
                      
                      {/* FOOTER NẰM DƯỚI CÙNG (nhờ mt-auto) */}
                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-50 dark:border-slate-800/60 transition-colors">
                         <span className="text-[9px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">Xem hồ sơ</span>
                         <div className="size-8 rounded-lg bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 flex items-center justify-center group-hover:bg-cyan-600 group-hover:text-white dark:group-hover:bg-cyan-500 dark:group-hover:text-white transition-all">
                            <ArrowRight className="size-3.5" />
                         </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3. MODAL CHI TIẾT */}
      <Modal open={!!selectedMember} onOpenChange={(open) => !open && setSelectedMember(null)} title="Hồ sơ thành viên">
        {selectedMember && (
          <div className="space-y-6 py-2 max-h-[75vh] overflow-y-auto text-center custom-scrollbar">
            <div className="relative size-40 mx-auto">
              <div className="absolute inset-0 bg-cyan-500/10 dark:bg-cyan-400/10 rounded-full blur-3xl transition-colors" />
              <img src={selectedMember.avatarUrl || "https://via.placeholder.com/150"} className="relative w-full h-full rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-2xl transition-colors" />
            </div>
            <div>
               <h2 className="text-3xl font-black text-[#0f3d3e] dark:text-white uppercase tracking-tighter transition-colors">{selectedMember.fullName}</h2>
               <p className="text-cyan-600 dark:text-cyan-400 font-bold uppercase text-xs tracking-[0.2em] mt-1 transition-colors">{selectedMember.position}</p>
            </div>
            <div className="max-w-md mx-auto pt-6 border-t border-slate-100 dark:border-slate-800 transition-colors">
               <p className="text-slate-500 dark:text-slate-400 italic text-sm leading-relaxed transition-colors">
                 "{selectedMember.bio || "Thành viên nhiệt huyết của HIEC."}"
               </p>
            </div>
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end transition-colors">
              <Button variant="shimmer" className="bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300 rounded-2xl px-6 py-5 font-bold uppercase text-[10px] transition-colors" onClick={() => setSelectedMember(null)}>
                <ChevronLeft className="mr-2 size-4" /> Quay lại
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </PublicLayout>
  );
}