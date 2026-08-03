import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { FieldError } from "@/components/auth/field-error";
import { POST_CATEGORIES, postSchema, type PostValues } from "@/lib/validators/post-validator";
import { projects, type Project } from "@/services/hiec-service";

export const Route = createFileRoute("/admin/posts")({
  head: () => ({
    meta: [
      { title: "Quản lý bài viết — HIEC Admin" },
      {
        name: "description",
        content: "Thêm, sửa, xóa và ẩn/hiện bài viết dự án và hoạt động của câu lạc bộ HIEC.",
      },
      { property: "og:title", content: "HIEC Admin — Bài viết" },
      { property: "og:description", content: "Quản lý bài đăng dự án và hoạt động HIEC." },
    ],
  }),
  component: PostsPage,
});

function PostsPage() {
  const [rows, setRows] = React.useState<Project[]>(projects);
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Project | null>(null);
  const [deleting, setDeleting] = React.useState<Project | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<PostValues>({
    resolver: zodResolver(postSchema),
    mode: "onChange",
    defaultValues: { title: "", category: "Dự án", excerpt: "", content: "", published: true },
  });

  const category = watch("category");

  const openCreate = () => {
    setEditing(null);
    reset({ title: "", category: "Dự án", excerpt: "", content: "", published: true });
    setFormOpen(true);
  };

  const openEdit = (post: Project) => {
    setEditing(post);
    reset({
      title: post.title,
      category: post.category,
      excerpt: post.excerpt,
      content: `${post.excerpt} Nội dung chi tiết của bài viết ${post.title} sẽ được cập nhật tại đây.`,
      published: post.published,
    });
    setFormOpen(true);
  };

  const onSubmit = (values: PostValues) => {
    if (editing) {
      setRows((prev) =>
        prev.map((p) =>
          p.id === editing.id
            ? {
                ...p,
                title: values.title,
                category: values.category,
                excerpt: values.excerpt,
                published: values.published,
              }
            : p,
        ),
      );
      toast.success("Đã cập nhật bài viết");
    } else {
      setRows((prev) => [
        {
          id: `p${Date.now()}`,
          title: values.title,
          category: values.category,
          excerpt: values.excerpt,
          published: values.published,
          year: String(new Date().getFullYear()),
          metric: "Mới tạo",
        },
        ...prev,
      ]);
      toast.success("Đã thêm bài viết mới");
    }
    setFormOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Quản lý bài viết</h1>
          <p className="text-sm text-muted-foreground">
            FDD 2.4 — thêm, sửa, xóa, ẩn/hiện bài đăng dự án & hoạt động.
          </p>
        </div>
        <Button variant="shimmer" onClick={openCreate}>
          <Plus /> Thêm bài viết
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg">Danh sách bài đăng ({rows.length})</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tiêu đề</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead>Năm</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="max-w-xs truncate font-medium">{post.title}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{post.category}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{post.year}</TableCell>
                  <TableCell>
                    <Badge variant={post.published ? "default" : "outline"}>
                      {post.published ? "Đang hiện" : "Đang ẩn"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Ẩn/hiện"
                        onClick={() =>
                          setRows((prev) =>
                            prev.map((p) =>
                              p.id === post.id ? { ...p, published: !p.published } : p,
                            ),
                          )
                        }
                      >
                        {post.published ? <EyeOff /> : <Eye />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Sửa"
                        onClick={() => openEdit(post)}
                      >
                        <Pencil />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Xóa"
                        onClick={() => setDeleting(post)}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Modal
        open={formOpen}
        onOpenChange={setFormOpen}
        title={editing ? "Sửa bài viết" : "Thêm bài viết"}
        description="Nội dung dự án và hoạt động được quản lý dưới dạng bài đăng."
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="title">Tiêu đề</Label>
            <Input id="title" {...register("title")} />
            <FieldError message={errors.title?.message} />
          </div>
          <div className="space-y-2">
            <Label>Danh mục</Label>
            <Select
              value={category}
              onValueChange={(value) =>
                setValue("category", value as PostValues["category"], { shouldValidate: true })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn danh mục" />
              </SelectTrigger>
              <SelectContent>
                {POST_CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError message={errors.category?.message} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="excerpt">Mô tả ngắn</Label>
            <Textarea id="excerpt" rows={2} {...register("excerpt")} />
            <FieldError message={errors.excerpt?.message} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Nội dung</Label>
            <Textarea id="content" rows={5} {...register("content")} />
            <FieldError message={errors.content?.message} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="shimmer" disabled={!isValid}>
              {editing ? "Lưu thay đổi" : "Tạo bài viết"}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Xóa bài viết"
        description={`Bạn có chắc chắn muốn xóa "${deleting?.title ?? ""}"? Hành động này không thể hoàn tác.`}
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleting(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setRows((prev) => prev.filter((p) => p.id !== deleting?.id));
                setDeleting(null);
                toast.success("Đã xóa bài viết");
              }}
            >
              Confirm
            </Button>
          </>
        }
      />
    </div>
  );
}
