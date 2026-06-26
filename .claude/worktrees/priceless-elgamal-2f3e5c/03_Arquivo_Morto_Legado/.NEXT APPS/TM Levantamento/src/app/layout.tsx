import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TM LEVANTAMENTO | Smart Field Collector",
  description: "Sistema inteligente de levantamento técnico e coleta de campo da suíte TM.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" data-theme="dark">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=block" />
      </head>
      <body className={`${manrope.variable}`}>
        <main className="min-h-screen bg-[var(--tm-bg)] text-[var(--tm-text)]">
          {children}
        </main>
      </body>
    </html>
  );
}
