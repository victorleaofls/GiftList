import type { Metadata } from "next";
import "./globals.css";
import { TopNavWrapper } from "@/components/layout/TopNavWrapper";

export const metadata: Metadata = {
  title: "Presentea",
  description: "Listas de presentes com contribuicoes via Pix.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">
        <TopNavWrapper />
        {children}
      </body>
    </html>
  );
}
