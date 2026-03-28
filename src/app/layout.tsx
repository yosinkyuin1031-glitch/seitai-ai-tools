import type { Metadata } from "next";
import { ToastContainer } from "@/components/Toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "大口神経整体院 AIツール",
  description: "ブログ生成・神経タイプ診断・診断クイズ作成",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased bg-gray-50 text-gray-900 min-h-screen">
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
