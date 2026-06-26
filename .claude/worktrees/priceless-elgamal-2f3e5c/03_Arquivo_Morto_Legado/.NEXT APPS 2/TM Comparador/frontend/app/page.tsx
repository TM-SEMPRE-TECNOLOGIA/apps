"use client";

import Header from "@/components/Header";
import SummaryPanel from "@/components/SummaryPanel";
import ResultsTable from "@/components/ResultsTable";
import OutputBar from "@/components/OutputBar";
import ErrorBanner from "@/components/ErrorBanner";
import EmptyState from "@/components/EmptyState";
import { useCompareStore } from "@/stores/useCompareStore";

export default function Home() {
  const { results } = useCompareStore();
  const hasResults = results.length > 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-[1600px] w-full mx-auto px-6 py-6 flex flex-col gap-4">
        <ErrorBanner />

        {hasResults ? (
          <>
            <SummaryPanel />
            <OutputBar />
            <ResultsTable />
          </>
        ) : (
          <EmptyState />
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-white/20 border-t border-white/5">
        <span className="font-medium">TM Comparador</span> — Desenvolvido por{" "}
        <span className="text-brand-primary/60">TM - Sempre Tecnologia</span>
      </footer>
    </div>
  );
}
