import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, FileUp, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { supabase } from "@/utils/supabase";

export const Route = createFileRoute("/admin/learning-resources")({
  head: () => ({
    meta: [{ title: "Quản lý học liệu — HIEC Admin" }],
  }),
  component: AdminLearningResourcesPage,
});

type LearningChapter = {
  id: string;
  title: string;
  chapter_date: string | null;
  display_order: number;
};

type LearningLesson = {
  id: string;
  chapter_id: string;
  title: string;
  slide_url: string;
  created_at: string;
};

const emptyChapter = { title: "", chapter_date: "" };
const emptyLesson = { title: "", slide_url: "" };

function AdminLearningResourcesPage() {
  const [chapters, setChapters] = React.useState<LearningChapter[]>([]);
  const [lessons, setLessons] = React.useState<LearningLesson[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [chapterModalOpen, setChapterModalOpen] = React.useState(false);
  const [lessonModalOpen, setLessonModalOpen] = React.useState(false);
  const [editingChapter, setEditingChapter] = React.useState<LearningChapter | null>(null);
  const [editingLesson, setEditingLesson] = React.useState<LearningLesson | null>(null);
  const [activeChapter, setActiveChapter] = React.useState<LearningChapter | null>(null);
  const [chapterForm, setChapterForm] = React.useState(emptyChapter);
  const [lessonForm, setLessonForm] = React.useState(emptyLesson);

  const loadResources = React.useCallback(async () => {
    setLoading(true);
    try {
      const [chapterResult, lessonResult] = await Promise.all([
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

      if (chapterResult.error) throw chapterResult.error;
      if (lessonResult.error) throw lessonResult.error;

      setChapters((chapterResult.data ?? []) as LearningChapter[]);
      setLessons((lessonResult.data ?? []) as LearningLesson[]);
    } catch (error: any) {
      toast.error("Không thể tải học liệu", { description: error.message });
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void loadResources();
  }, [loadResources]);

  const lessonsByChapter = React.useMemo(() => {
    const grouped = new Map<string, LearningLesson[]>();
    lessons.forEach((lesson) => {
      const current = grouped.get(lesson.chapter_id) ?? [];
      current.push(lesson);
      grouped.set(lesson.chapter_id, current);
    });
    return grouped;
  }, [lessons]);

  const openCreateChapter = () => {
    setEditingChapter(null);
    setChapterForm(emptyChapter);
    setChapterModalOpen(true);
  };

  const openEditChapter = (chapter: LearningChapter) => {
    setEditingChapter(chapter);
    setChapterForm({ title: chapter.title, chapter_date: chapter.chapter_date ?? "" });
    setChapterModalOpen(true);
  };

  const saveChapter = async () => {
    if (!chapterForm.title.trim()) {
      toast.error("Vui lòng nhập tên chương");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: chapterForm.title.trim(),
        chapter_date: chapterForm.chapter_date || null,
      };
      const { error } = editingChapter
        ? await supabase.from("learning_chapters").update(payload).eq("id", editingChapter.id)
        : await supabase.from("learning_chapters").insert({
            ...payload,
            display_order: chapters.length,
          });

      if (error) throw error;
      toast.success(editingChapter ? "Đã cập nhật chương" : "Đã tạo chương mới");
      setChapterModalOpen(false);
      await loadResources();
    } catch (error: any) {
      toast.error("Không thể lưu chương", { description: error.message });
    } finally {
      setSaving(false);
    }
  };

  const deleteChapter = async (chapter: LearningChapter) => {
    if (!confirm(`Xóa chương “${chapter.title}” và toàn bộ bài giảng bên trong?`)) return;

    try {
      const { error } = await supabase.from("learning_chapters").delete().eq("id", chapter.id);
      if (error) throw error;
      toast.success("Đã xóa chương");
      await loadResources();
    } catch (error: any) {
      toast.error("Không thể xóa chương", { description: error.message });
    }
  };

  const openCreateLesson = (chapter: LearningChapter) => {
    setActiveChapter(chapter);
    setEditingLesson(null);
    setLessonForm(emptyLesson);
    setLessonModalOpen(true);
  };

  const openEditLesson = (chapter: LearningChapter, lesson: LearningLesson) => {
    setActiveChapter(chapter);
    setEditingLesson(lesson);
    setLessonForm({ title: lesson.title, slide_url: lesson.slide_url });
    setLessonModalOpen(true);
  };

  const uploadSlide = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !activeChapter) return;

    setSaving(true);
    try {
      const extension = file.name.split(".").pop() || "file";
      const safeName = `${Date.now()}-${crypto.randomUUID()}.${extension}`;
      const path = `${activeChapter.id}/${safeName}`;
      const { error } = await supabase.storage.from("learning-slides").upload(path, file);
      if (error) throw error;

      const { data } = supabase.storage.from("learning-slides").getPublicUrl(path);
      setLessonForm((current) => ({
        title: current.title || file.name.replace(/\.[^/.]+$/, ""),
        slide_url: data.publicUrl,
      }));
      toast.success("Đã tải slide lên");
    } catch (error: any) {
      toast.error("Không thể tải slide", { description: error.message });
    } finally {
      setSaving(false);
    }
  };

  const saveLesson = async () => {
    if (!activeChapter || !lessonForm.title.trim() || !lessonForm.slide_url) {
      toast.error("Nhập tên bài giảng và tải file slide lên trước khi lưu");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: lessonForm.title.trim(),
        slide_url: lessonForm.slide_url,
      };
      const { error } = editingLesson
        ? await supabase.from("learning_lessons").update(payload).eq("id", editingLesson.id)
        : await supabase.from("learning_lessons").insert({
            ...payload,
            chapter_id: activeChapter.id,
          });

      if (error) throw error;
      toast.success(editingLesson ? "Đã cập nhật bài giảng" : "Đã thêm bài giảng");
      setLessonModalOpen(false);
      await loadResources();
    } catch (error: any) {
      toast.error("Không thể lưu bài giảng", { description: error.message });
    } finally {
      setSaving(false);
    }
  };

  const deleteLesson = async (lesson: LearningLesson) => {
    if (!confirm(`Xóa bài giảng “${lesson.title}”?`)) return;

    try {
      const { error } = await supabase.from("learning_lessons").delete().eq("id", lesson.id);
      if (error) throw error;
      toast.success("Đã xóa bài giảng");
      await loadResources();
    } catch (error: any) {
      toast.error("Không thể xóa bài giảng", { description: error.message });
    }
  };

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Quản lý học liệu
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Tạo chương học và quản lý các bài giảng dạng slide.
          </p>
        </div>
        <Button
          onClick={openCreateChapter}
          className="rounded-xl bg-cyan-600 font-bold text-white hover:bg-cyan-700"
        >
          <Plus className="mr-2 size-4" /> Thêm chương
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20 text-primary">
          <Loader2 className="size-8 animate-spin" />
        </div>
      ) : chapters.length === 0 ? (
        <Card className="border-dashed bg-card shadow-none">
          <CardContent className="flex flex-col items-center py-16 text-center">
            <BookOpen className="mb-4 size-10 text-muted-foreground" />
            <p className="font-semibold text-foreground">Chưa có chương học nào.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Bắt đầu bằng cách thêm chương đầu tiên.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-5">
          {chapters.map((chapter, index) => {
            const chapterLessons = lessonsByChapter.get(chapter.id) ?? [];
            return (
              <Card
                key={chapter.id}
                className="overflow-hidden rounded-[1.5rem] border-border bg-card shadow-sm"
              >
                <CardContent className="p-0">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-muted/30 p-5">
                    <div className="flex items-center gap-3">
                      <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-sm font-black text-primary">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h2 className="font-bold text-foreground">{chapter.title}</h2>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {chapter.chapter_date
                            ? new Date(`${chapter.chapter_date}T00:00:00`).toLocaleDateString(
                                "vi-VN",
                              )
                            : "Chưa đặt ngày"}
                          {` · ${chapterLessons.length} bài giảng`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => openCreateLesson(chapter)}>
                        <Plus className="mr-1.5 size-4" /> Bài giảng
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditChapter(chapter)}
                        aria-label="Sửa chương"
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteChapter(chapter)}
                        aria-label="Xóa chương"
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </div>

                  {chapterLessons.length === 0 ? (
                    <p className="px-5 py-6 text-sm text-muted-foreground">
                      Chương này chưa có bài giảng.
                    </p>
                  ) : (
                    <div className="divide-y divide-border">
                      {chapterLessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
                        >
                          <a
                            href={lesson.slide_url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex min-w-0 items-center gap-3 text-sm font-semibold text-foreground hover:text-primary"
                          >
                            <BookOpen className="size-5 shrink-0 text-primary" />
                            <span className="truncate">{lesson.title}</span>
                          </a>
                          <div className="flex shrink-0 gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditLesson(chapter, lesson)}
                              aria-label="Sửa bài giảng"
                            >
                              <Pencil className="size-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteLesson(lesson)}
                              aria-label="Xóa bài giảng"
                            >
                              <Trash2 className="size-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Modal
        open={chapterModalOpen}
        onOpenChange={setChapterModalOpen}
        title={editingChapter ? "Sửa chương học" : "Thêm chương học"}
      >
        <div className="space-y-4 py-3">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Tên chương
            </label>
            <Input
              value={chapterForm.title}
              onChange={(event) =>
                setChapterForm((current) => ({ ...current, title: event.target.value }))
              }
              placeholder="Ví dụ: Chương 1 - Khởi nghiệp căn bản"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Ngày
            </label>
            <Input
              type="date"
              value={chapterForm.chapter_date}
              onChange={(event) =>
                setChapterForm((current) => ({ ...current, chapter_date: event.target.value }))
              }
            />
          </div>
          <Button className="w-full" onClick={saveChapter} disabled={saving}>
            {saving ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
            Lưu chương
          </Button>
        </div>
      </Modal>

      <Modal
        open={lessonModalOpen}
        onOpenChange={setLessonModalOpen}
        title={editingLesson ? "Sửa bài giảng" : "Thêm bài giảng"}
        description={activeChapter ? `Chương: ${activeChapter.title}` : undefined}
      >
        <div className="space-y-4 py-3">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Tên bài giảng
            </label>
            <Input
              value={lessonForm.title}
              onChange={(event) =>
                setLessonForm((current) => ({ ...current, title: event.target.value }))
              }
              placeholder="Ví dụ: Bài 1 - Tìm vấn đề"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              File slide
            </label>
            <Input
              type="file"
              accept=".pdf,.ppt,.pptx,application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
              onChange={uploadSlide}
              disabled={saving}
            />
            {lessonForm.slide_url ? (
              <p className="text-xs font-medium text-primary">Đã có file slide.</p>
            ) : (
              <p className="text-xs text-muted-foreground">Hỗ trợ PDF, PPT và PPTX.</p>
            )}
          </div>
          <Button className="w-full" onClick={saveLesson} disabled={saving}>
            {saving ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <FileUp className="mr-2 size-4" />
            )}
            Lưu bài giảng
          </Button>
        </div>
      </Modal>
    </div>
  );
}
