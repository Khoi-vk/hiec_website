import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2, User, ChevronLeft, Mail, Facebook, Quote } from "lucide-react";
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
      <section className="relative overflow-hidden bg-white pt-8 pb-4 md:pt-12 md:pb-6 border-b border-slate-100">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-cyan-50/50 blur-[100px] rounded-full -z-10" />
        
        <div className="container relative mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-12">
            <div className="flex-shrink-0 animate-fade-up">
              <Badge className="bg-cyan-100/50 text-cyan-700 border-none mb-2 px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.2em]">
                Our Team
              </Badge>
              <h1 className="font-display text-6xl md:text-8xl font-black text-[#0f3d3e] uppercase tracking-tighter leading-[0.8]">
                Thành viên
              </h1>
            </div>

            <div className="max-w-md md:border-l-2 border-cyan-500/20 md:pl-8 animate-fade-up [animation-delay:200ms]">
              <h2 className="text-[#0f3d3e] text-sm md:text-lg font-black uppercase tracking-tight mb-2 leading-tight">
                Đội ngũ nòng cốt <br /> dẫn dắt HIEC
              </h2>
              <p className="text-slate-500 text-xs md:text-sm font-medium leading-relaxed">
                Những cá nhân xuất sắc cùng chung tay xây dựng hệ sinh thái khởi nghiệp sáng tạo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DANH SÁCH THÀNH VIÊN - CĂN GIỮA */}
      <section className="py-8 md:py-12 bg-slate-50/30 min-h-[600px]">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center py-20 text-cyan-600">
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
                  <Card className="h-full border-none shadow-sm hover:shadow-xl transition-all duration-500 rounded-[2rem] overflow-hidden bg-white p-8">
                    <CardContent className="p-0 flex flex-col items-center text-center">
                      <div className="relative size-32 mb-6">
                        <div className="absolute inset-0 bg-cyan-100 rounded-full blur-2xl group-hover:bg-cyan-200 transition-colors duration-500" />
                        <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg bg-slate-100">
                          {member.avatarUrl ? (
                            <img src={member.avatarUrl} alt={member.fullName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                              <User className="size-16" />
                            </div>
                          )}
                        </div>
                      </div>

                      <h3 className="font-display text-xl font-black text-[#1a2e35] group-hover:text-cyan-600 transition-colors leading-tight uppercase tracking-tighter mb-2">
                        {member.fullName}
                      </h3>
                      <div className="px-4 py-1 rounded-full bg-cyan-50 text-cyan-600 text-[10px] font-black uppercase tracking-widest">
                        {member.position}
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
      <Modal open={!!selectedMember} onOpenChange={(open) => !open && setSelectedMember(null)} title={selectedMember?.fullName}>
        {selectedMember && (
          <div className="space-y-6 py-2 max-h-[75vh] overflow-y-auto text-center">
            <div className="relative size-40 mx-auto">
              <div className="absolute inset-0 bg-cyan-500/10 rounded-full blur-3xl" />
              <img src={selectedMember.avatarUrl || "https://via.placeholder.com/150"} className="relative w-full h-full rounded-full object-cover border-4 border-white shadow-2xl" />
            </div>
            <div>
               <h2 className="text-3xl font-black text-[#0f3d3e] uppercase tracking-tighter">{selectedMember.fullName}</h2>
               <p className="text-cyan-600 font-bold uppercase text-xs tracking-[0.2em] mt-1">{selectedMember.position}</p>
            </div>
            <div className="max-w-md mx-auto pt-6 border-t">
               <p className="text-slate-500 italic text-sm leading-relaxed">
                 "{selectedMember.bio || "Thành viên nhiệt huyết của HIEC."}"
               </p>
            </div>
            <div className="pt-6 border-t flex justify-end">
              <Button variant="shimmer" className="bg-cyan-100 text-cyan-700 rounded-2xl px-6 py-5 font-bold uppercase text-[10px]" onClick={() => setSelectedMember(null)}>
                <ChevronLeft className="mr-2 size-4" /> Quay lại
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </PublicLayout>
  );
}