import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import { ProfileProvider } from "@/lib/profile-context";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "X Buzz Post Tool",
  description: "AIでバズるXの投稿を生成・管理するツール",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-dark-900 text-gray-100`}
      >
        <ProfileProvider>
          <Sidebar />
          <main className="lg:ml-64 min-h-screen p-4 pt-16 lg:p-8">
            {children}
          </main>
        </ProfileProvider>
      </body>
    </html>
  );
}
