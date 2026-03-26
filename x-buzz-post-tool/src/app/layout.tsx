import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
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
          {children}
        </ProfileProvider>
      </body>
    </html>
  );
}
