import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

export const metadata: Metadata = {
  title: "P.Log",
  description: "Pangho's Development Blog",
};

const pertendard = localFont({
  src: "../../public/assets/fonts/PretendardVariable.woff2",
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
      <body className={`${pertendard.variable}`}>{children}</body>
    </html>
  );
}
