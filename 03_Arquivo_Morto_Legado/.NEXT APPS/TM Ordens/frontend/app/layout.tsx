import type { Metadata } from 'next';
import './globals.css';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';

export const metadata: Metadata = {
  title: 'TM Ordens',
  description: 'Gerenciador de Ordens de Serviço - TM Sempre Tecnologia',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased text-white bg-[#0d1117] min-h-screen flex">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 ml-64">
          <Header />
          <main className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-[1600px] mx-auto w-full">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
