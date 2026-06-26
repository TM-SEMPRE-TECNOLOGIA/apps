import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TM Web Scrapping - Universal Data Miner',
  description: 'Extraia dados estruturados de qualquer site usando seletores CSS',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
