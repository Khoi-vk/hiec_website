/**
 Day la component khung giao dien chung (Layout) cho cac trang cong khai (public pages) cua website.
  No quy dinh bo cuc chuan bao gom thanh dau trang (Header) o tren cung, 
  phan noi dung chinh (main) o giua va chan trang (Footer) o duoi cung cho tat ca cac trang danh cho nguoi xem tu do.
 */
import type { ReactNode } from "react";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

// Define the PublicLayout component that wraps public-facing pages with a standard header, main container, and footer structure

export function PublicLayout({ children }: { children: ReactNode }) {
  return (

    // Main flex container ensuring full screen height and proper column layout

    <div className="flex min-h-screen flex-col">

      {/* Render the top navigation header component */}

      <Header />

      {/* Dynamic main content container that expands to fill available vertical space */}

      <main className="flex-1">{children}</main>

      {/* Render the bottom footer component */}
      
      <Footer />
    </div>
  );
}
