import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { GNB } from "@/features";

export const metadata: Metadata = {
  title: "P.Log",
  description: "Pangho's Development Blog",
};

const pertendard = localFont({
  src: "../shared/assets/fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  weight: "45 920",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${pertendard.variable}`}>
        <GNB />
        {children}
      </body>
    </html>
  );
}
