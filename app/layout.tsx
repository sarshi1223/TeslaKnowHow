import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Model Y 新手指南｜7 天安心上手",
  description: "給台灣 Tesla Model Y 新車主的互動式駕駛、充電、安全與保養入門指南。",
  openGraph: {
    title: "Model Y 新手指南｜7 天安心上手",
    description: "給台灣 Tesla Model Y 新車主的互動式上手路線。",
    type: "website",
    locale: "zh_TW",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Model Y 新手指南" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Model Y 新手指南｜7 天安心上手",
    description: "給台灣 Tesla Model Y 新車主的互動式上手路線。",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-Hant"><body>{children}</body></html>;
}
