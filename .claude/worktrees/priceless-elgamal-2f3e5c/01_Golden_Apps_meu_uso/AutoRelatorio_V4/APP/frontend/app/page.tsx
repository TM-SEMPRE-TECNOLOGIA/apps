"use client";

import { useEffect } from "react";
import { AppShell } from "@/components/shell/AppShell";
import { OrganizarView } from "@/components/views/OrganizarView";
import { RelatoriosView } from "@/components/views/RelatoriosView";
import { ModelosView } from "@/components/views/ModelosView";
import { ConfiguracoesView } from "@/components/views/ConfiguracoesView";
import { Topbar } from "@/components/shell/Topbar";
import { ConsoleWatcher } from "@/components/shell/ConsoleWatcher";
import { useAppStore } from "@/store/useAppStore";
import { LayoutDashboard } from "lucide-react";

export default function HomePage() {
  const { activeSection, fetchTemplates } = useAppStore();

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  return (
    <>
    <AppShell>
      {activeSection === "dashboard"      && <DashboardView />}
      {activeSection === "organizar"      && <OrganizarView />}
      {activeSection === "relatorios"     && <RelatoriosView />}
      {activeSection === "modelos"        && <ModelosView />}
      {activeSection === "configuracoes"  && <ConfiguracoesView />}
    </AppShell>
    </>
  );
}

function DashboardView() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      <Topbar />
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 12,
          color: "var(--tm-text-subtle)",
          fontFamily: "var(--TM-font-mono)",
          fontSize: 13,
        }}
      >
        <LayoutDashboard size={32} strokeWidth={1.25} color="var(--tm-border)" />
        Dashboard em construção
      </div>
    </div>
  );
}
