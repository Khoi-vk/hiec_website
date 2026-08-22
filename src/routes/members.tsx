import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2, User, ChevronLeft, ArrowRight, Sparkles, Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { PublicLayout } from "@/components/layout/public-layout";
import {
  getAllMembers,
  getMemberLayoutConfig,
  type Member,
  type MemberLayoutConfig,
  type MemberTier,
  DEFAULT_MEMBER_LAYOUT,
} from "@/services/member-layout-service";

export const Route = createFileRoute("/members")({
  head: () => ({
    meta: [
      { title: "Cơ cấu CLB — HIEC HUST" },
      {
        name: "description",
        content:
          "Cơ cấu tổ chức và nhân sự nòng cốt Câu lạc bộ Khởi nghiệp & Đổi mới Sáng tạo HIEC.",
      },
    ],
  }),
  component: MembersPage,
});

function MembersPage() {
  const [members, setMembers] = React.useState<Member[]>([]);
  const [layoutConfig, setLayoutConfig] = React.useState<MemberLayoutConfig>(DEFAULT_MEMBER_LAYOUT);
  const [loading, setLoading] = React.useState(true);
  const [selectedMember, setSelectedMember] = React.useState<Member | null>(null);

  React.useEffect(() => {
    async function loadData() {
      try {
        const [fetchedMembers, fetchedConfig] = await Promise.all([
          getAllMembers(),
          getMemberLayoutConfig(),
        ]);
        setMembers(fetchedMembers);
        setLayoutConfig(fetchedConfig);
      } catch (err) {
        console.error("Lỗi lấy dữ liệu thành viên và cơ cấu:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Map for O(1) lookup
  const memberMap = React.useMemo(() => {
    const map = new Map<string, Member>();
    members.forEach((m) => map.set(m.id, m));
    return map;
  }, [members]);

  // Set of assigned member IDs
  const assignedMemberIds = React.useMemo(() => {
    const set = new Set<string>();
    layoutConfig.tiers.forEach((t) => {
      t.memberIds.forEach((id) => set.add(id));
    });
    return set;
  }, [layoutConfig]);

  // Unassigned members list
  const unassignedMembers = React.useMemo(() => {
    return members.filter((m) => !assignedMemberIds.has(m.id));
  }, [members, assignedMemberIds]);

  return (
    <PublicLayout>
      {/* 1. HERO BANNER */}
      <section className="relative overflow-hidden bg-white dark:bg-slate-950 pt-10 pb-8 md:pt-16 md:pb-12 border-b border-slate-100 dark:border-slate-800 transition-colors">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-100/40 dark:bg-cyan-900/15 blur-[120px] rounded-full -z-10 transition-colors" />
        <div className="absolute -bottom-10 left-10 w-[350px] h-[350px] bg-sky-100/40 dark:bg-sky-900/10 blur-[100px] rounded-full -z-10 transition-colors" />

        <div className="max-w-[1300px] mx-auto px-6 md:px-12 text-left">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-12">
            <div className="flex-shrink-0 animate-fade-up">
              <Badge className="bg-cyan-100/80 dark:bg-cyan-900/50 text-cyan-800 dark:text-cyan-300 border-none mb-3 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] transition-colors">
                Organizational Structure
              </Badge>
              <h1 className="font-sans text-4xl sm:text-5xl md:text-6xl font-black text-[#0f3d3e] dark:text-white uppercase tracking-[-0.04em] leading-[0.95] transition-colors">
                Cơ cấu <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-sky-500 dark:from-cyan-400 dark:to-sky-300">
                  Câu Lạc Bộ
                </span>
              </h1>
            </div>

            <div className="max-w-md md:border-l-2 border-cyan-500/20 dark:border-cyan-500/10 md:pl-8 animate-fade-up [animation-delay:200ms]">
              <h2 className="text-[#0f3d3e] dark:text-slate-100 text-sm md:text-lg font-black uppercase tracking-tight mb-2 leading-tight transition-colors">
                Đội ngũ nòng cốt <br /> dẫn dắt HIEC HUST
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm font-medium leading-relaxed transition-colors">
                Mỗi vị trí là một mảnh ghép quan trọng xây dựng hệ sinh thái khởi nghiệp đổi mới
                sáng tạo cho sinh viên.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CƠ CẤU PHÂN TẦNG (TIERS STRUCTURE) */}
      <section className="py-12 md:py-20 bg-slate-50/40 dark:bg-slate-900/60 min-h-[650px] transition-colors">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6 md:px-12">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-28 text-cyan-600 dark:text-cyan-400">
              <Loader2 className="animate-spin size-10 mb-3" />
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Đang tải sơ đồ cơ cấu...
              </p>
            </div>
          ) : (
            <div className="space-y-16 md:space-y-24">
              {layoutConfig.tiers.map((tier: MemberTier, tIndex: number) => {
                // Lấy danh sách thành viên trong tầng (tối đa 4 người)
                const tierMembers = tier.memberIds
                  .slice(0, 4)
                  .map((id) => memberMap.get(id))
                  .filter(Boolean) as Member[];

                if (tierMembers.length === 0) return null;

                return (
                  <div key={tier.id || tIndex} className="space-y-8 animate-fade-up">
                    {/* TIER HEADER */}
                    <div className="text-center max-w-2xl mx-auto space-y-2">
                      <h2 className="text-2xl sm:text-3xl font-black text-[#0f3d3e] dark:text-white tracking-tight">
                        {tier.name}
                      </h2>

                      <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-sky-400 rounded-full mx-auto mt-3 opacity-80" />
                    </div>

                    {/* TIER CARDS: HIỂN THỊ CÙNG 1 DÒNG, TỐI ĐA 4 CARD, CĂN CHÍNH GIỮA VÀ CÁCH ĐỀU LỀ */}
                    <div className="w-full flex flex-wrap md:flex-nowrap justify-center items-stretch gap-6 md:gap-8 lg:gap-10 max-w-[1300px] mx-auto">
                      {tierMembers.map((member) => (
                        <div
                          key={member.id}
                          onClick={() => setSelectedMember(member)}
                          className="w-full max-w-[240px] sm:max-w-[260px] md:w-64 shrink-0 cursor-pointer group"
                        >
                          <Card className="flex flex-col h-full border-none shadow-sm hover:shadow-2xl transition-all duration-500 rounded-[1.6rem] overflow-hidden bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 group-hover:-translate-y-1.5">
                            {/* CONTAINER ẢNH VUÔNG BO TRÒN */}
                            <div className="aspect-square overflow-hidden m-2 rounded-[1.2rem] shrink-0 bg-slate-100 dark:bg-slate-800 relative">
                              {member.avatarUrl ? (
                                <img
                                  src={member.avatarUrl}
                                  alt={member.fullName}
                                  className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                              ) : (
                                <div className="size-full flex items-center justify-center text-slate-300 dark:text-slate-600">
                                  <User className="size-12" />
                                </div>
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>

                            {/* NỘI DUNG CARD */}
                            <CardContent className="flex flex-col grow p-4 pt-2 text-left">
                              <h3 className="font-sans text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors leading-tight mb-1 line-clamp-1">
                                {member.fullName}
                              </h3>

                              <p className="text-cyan-600 dark:text-cyan-400 text-xs font-bold mb-1 line-clamp-1">
                                {member.position}
                              </p>

                              <p className="text-slate-500 dark:text-slate-400 text-[11px] font-medium line-clamp-1 mb-3">
                                {member.department}
                              </p>

                              {/* FOOTER NẰM DƯỚI CÙNG */}
                              <div className="flex items-center justify-between mt-auto pt-2.5 border-t border-slate-100 dark:border-slate-800/60 transition-colors">
                                <span className="text-[9px] font-black tracking-wider text-slate-400 dark:text-slate-500 uppercase group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                                  Xem hồ sơ
                                </span>
                                <div className="size-6 rounded-lg bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 flex items-center justify-center group-hover:bg-cyan-600 group-hover:text-white dark:group-hover:bg-cyan-500 dark:group-hover:text-white transition-all">
                                  <ArrowRight className="size-3" />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* 3. NHÓM THÀNH VIÊN MỞ RỘNG (NẾU ĐƯỢC BẬT TRONG CẤU HÌNH ADMIN) */}
              {layoutConfig.showUnassigned && unassignedMembers.length > 0 && (
                <div className="pt-12 border-t border-slate-200 dark:border-slate-800 space-y-8 animate-fade-up">
                  <div className="text-center max-w-xl mx-auto space-y-2">
                    <Badge className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-none px-3 py-1 text-[10px] font-black uppercase tracking-widest">
                      Đội ngũ thành viên
                    </Badge>
                    <h3 className="text-2xl font-bold text-[#0f3d3e] dark:text-white">
                      {layoutConfig.unassignedTitle || "Thành viên & Cộng tác viên"}
                    </h3>
                  </div>

                  <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 max-w-[1300px] mx-auto">
                    {unassignedMembers.map((member) => (
                      <div
                        key={member.id}
                        onClick={() => setSelectedMember(member)}
                        className="cursor-pointer group"
                      >
                        <Card className="flex flex-col h-full border-none shadow-sm hover:shadow-xl transition-all duration-300 rounded-[1.3rem] overflow-hidden bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-left">
                          <div className="aspect-square overflow-hidden m-1.5 rounded-[1rem] shrink-0 bg-slate-100 dark:bg-slate-800 relative">
                            {member.avatarUrl ? (
                              <img
                                src={member.avatarUrl}
                                alt={member.fullName}
                                className="size-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className="size-full flex items-center justify-center text-slate-300 dark:text-slate-600">
                                <User className="size-8" />
                              </div>
                            )}
                          </div>
                          <CardContent className="p-3 pt-1 flex flex-col grow">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-cyan-600">
                              {member.fullName}
                            </h4>
                            <p className="text-[10px] text-cyan-600 dark:text-cyan-400 font-semibold truncate">
                              {member.position}
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* 4. MODAL CHI TIẾT THÀNH VIÊN */}
      <Modal
        open={!!selectedMember}
        onOpenChange={(open) => !open && setSelectedMember(null)}
        title="Hồ sơ thành viên"
      >
        {selectedMember && (
          <div className="space-y-6 py-2 max-h-[75vh] overflow-y-auto text-center custom-scrollbar">
            <div className="relative size-36 mx-auto">
              <div className="absolute inset-0 bg-cyan-500/20 dark:bg-cyan-400/20 rounded-full blur-2xl transition-colors" />
              {selectedMember.avatarUrl ? (
                <img
                  src={selectedMember.avatarUrl}
                  alt={selectedMember.fullName}
                  className="relative size-full rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-xl transition-colors"
                />
              ) : (
                <div className="relative size-full rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-4 border-white dark:border-slate-800 shadow-xl">
                  <User className="size-16 text-slate-400" />
                </div>
              )}
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0f3d3e] dark:text-white uppercase tracking-tight transition-colors">
                {selectedMember.fullName}
              </h2>
              <p className="text-cyan-600 dark:text-cyan-400 font-bold uppercase text-xs tracking-[0.2em] mt-1 transition-colors">
                {selectedMember.position}
              </p>
              <p className="text-slate-500 dark:text-slate-400 font-semibold text-xs mt-0.5">
                {selectedMember.department}
              </p>
            </div>

            <div className="max-w-md mx-auto pt-5 border-t border-slate-100 dark:border-slate-800 transition-colors">
              <p className="text-slate-600 dark:text-slate-300 italic text-sm leading-relaxed transition-colors">
                "{selectedMember.bio || "Thành viên nhiệt huyết của CLB Khởi nghiệp HIEC."}"
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end transition-colors">
              <Button
                variant="shimmer"
                className="bg-cyan-100 dark:bg-cyan-900/40 text-cyan-800 dark:text-cyan-300 rounded-2xl px-6 py-4 font-bold uppercase text-[10px] transition-colors"
                onClick={() => setSelectedMember(null)}
              >
                <ChevronLeft className="mr-1.5 size-4" /> Quay lại
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </PublicLayout>
  );
}
