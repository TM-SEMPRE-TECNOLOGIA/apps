import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import GlobalNav from "../components/GlobalNav";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TM Pastas - Gerador de Estrutura",
  description: "Organize seus levantamentos fotográficos profissionalmente.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <GlobalNav />
        {children}
      </body>
    </html>
  );
}
