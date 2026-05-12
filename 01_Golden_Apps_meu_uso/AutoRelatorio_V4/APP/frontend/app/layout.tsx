import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AutoRelatório V4 — TM Sempre Tecnologia",
  description: "Gerador de Relatório Fotográfico Inteligente — DS TM Laranjado v3",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body suppressHydrationWarning style={{ margin: 0, padding: 0, height: "100%" }}>
        {children}
      </body>
    </html>
  );
}
