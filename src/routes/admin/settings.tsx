import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({
    meta: [
      { title: "Thay đổi giao diện — HIEC Admin" },
      {
        name: "description",
        content: "Cấu hình màu chủ đạo, font chữ, căn lề, logo và ảnh nền banner cho website HIEC.",
      },
      { property: "og:title", content: "HIEC Admin — Giao diện" },
      { property: "og:description", content: "Tùy biến màu sắc, font và logo website HIEC." },
    ],
  }),
  component: SettingsPage,
});

const palettes = [
  { name: "HIEC Blue", swatch: "bg-primary" },
  { name: "Deep Navy", swatch: "bg-primary-deep" },
  { name: "Sky", swatch: "bg-chart-2" },
  { name: "Gold Accent", swatch: "bg-gold" },
];

function SettingsPage() {
  const [palette, setPalette] = React.useState("HIEC Blue");
  const [font, setFont] = React.useState("Sora + Manrope");
  const [align, setAlign] = React.useState("Trái");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Thay đổi giao diện</h1>
        <p className="text-sm text-muted-foreground">
          FDD 2.2 — màu chủ đạo, font chữ, căn lề, logo và ảnh nền banner.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg">Màu chủ đạo</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            {palettes.map((p) => (
              <button
                key={p.name}
                onClick={() => setPalette(p.name)}
                className={
                  palette === p.name
                    ? "flex items-center gap-3 rounded-xl border-2 border-primary bg-accent/50 p-3 text-left"
                    : "flex items-center gap-3 rounded-xl border border-border p-3 text-left hover:bg-muted"
                }
              >
                <span className={`size-8 rounded-lg ${p.swatch}`} />
                <span className="text-sm font-medium">{p.name}</span>
              </button>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg">Font chữ & căn lề</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Bộ font</Label>
              <Select value={font} onValueChange={setFont}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sora + Manrope">Sora + Manrope</SelectItem>
                  <SelectItem value="Space Grotesk + DM Sans">Space Grotesk + DM Sans</SelectItem>
                  <SelectItem value="Lora + Nunito Sans">Lora + Nunito Sans</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Căn lề nội dung</Label>
              <Select value={align} onValueChange={setAlign}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Trái">Trái</SelectItem>
                  <SelectItem value="Giữa">Giữa</SelectItem>
                  <SelectItem value="Đều hai bên">Đều hai bên</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg">Logo header & footer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="logo-header">Logo header</Label>
              <Input id="logo-header" type="file" accept="image/*" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="logo-footer">Logo footer</Label>
              <Input id="logo-footer" type="file" accept="image/*" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg">Ảnh nền banner</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-32 rounded-xl bg-primary" />
            <Input id="banner" type="file" accept="image/*" />
          </CardContent>
        </Card>
      </div>

      <Button
        variant="shimmer"
        size="lg"
        onClick={() =>
          toast.success("Đã lưu cấu hình giao diện", {
            description: `${palette} · ${font} · căn lề ${align}`,
          })
        }
      >
        Lưu thay đổi
      </Button>
    </div>
  );
}
