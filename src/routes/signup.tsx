import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { PublicLayout } from "@/components/layout/public-layout";
import { NewsletterCard } from "@/components/home/newsletter-card";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Đăng ký nhận thông tin — HIEC" },
      {
        name: "description",
        content: "Đăng ký theo dõi và nhận thông tin hoạt động, cơ hội mới nhất từ HIEC.",
      },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  return (
    <PublicLayout>
      <div className="relative min-h-[calc(100vh-14rem)] flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            Quay lại trang chủ
          </Link>
        </div>
        <NewsletterCard popup />
      </div>
    </PublicLayout>
  );
}
