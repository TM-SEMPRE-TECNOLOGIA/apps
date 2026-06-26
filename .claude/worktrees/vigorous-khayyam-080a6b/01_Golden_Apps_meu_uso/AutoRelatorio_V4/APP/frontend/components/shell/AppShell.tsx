"use client";

import {
  LayoutDashboard,
  Images,
  FileText,
  Package,
  Settings,
  FileCheck2,
  Moon,
  Sun,
} from "lucide-react";
import { useAppStore, type NavSection } from "@/store/useAppStore";
import { ConsoleWatcher } from "./ConsoleWatcher";

const NAV_ITEMS: { section: NavSection; icon: React.ElementType; label: string }[] = [
  { section: "dashboard",      icon: LayoutDashboard, label: "Dashboard" },
  { section: "organizar",      icon: Images,          label: "Organizar Fotos" },
  { section: "relatorios",     icon: FileText,        label: "Relatórios" },
  { section: "modelos",        icon: Package,         label: "Modelos" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const activeSection = useAppStore((s) => s.activeSection);
  const setActiveSection = useAppStore((s) => s.setActiveSection);
  const isDark = useAppStore((s) => s.isDark);
  const toggleDark = useAppStore((s) => s.toggleDark);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        background: "var(--tm-bg)",
      }}
    >
      {/* ── SIDEBAR PERMANENTE DARK ───────────────────────── */}
      <aside
        style={{
          width: 56,
          background: "var(--tm-sidebar-bg)",
          borderRight: "1px solid var(--tm-sidebar-border)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "14px 0",
          gap: 4,
          flexShrink: 0,
          zIndex: 30,
        }}
      >
        {/* Logo */}
        <div
          style={{
            width: 32,
            height: 32,
            background: "#C8541C",
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 10,
            flexShrink: 0,
          }}
        >
          <FileCheck2 size={16} color="#fff" strokeWidth={1.75} />
        </div>

        {/* Nav items */}
        {NAV_ITEMS.map(({ section, icon: Icon, label }) => {
          const isActive = activeSection === section;
          return (
            <button
              key={section}
              title={label}
              onClick={() => setActiveSection(section)}
              style={{
                width: 36,
                height: 36,
                borderRadius: 6,
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                background: isActive ? "var(--tm-sidebar-active-bg)" : "transparent",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => {
                if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "var(--tm-sidebar-hover-bg)";
              }}
              onMouseLeave={(e) => {
                if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              }}
            >
              {isActive && (
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 8,
                    bottom: 8,
                    width: 2,
                    background: "#C8541C",
                    borderRadius: "0 2px 2px 0",
                  }}
                />
              )}
              <Icon
                size={16}
                strokeWidth={1.75}
                color={isActive ? "var(--tm-sidebar-icon-active)" : "var(--tm-sidebar-icon)"}
              />
            </button>
          );
        })}

        {/* Bottom: Configurações + Dark toggle */}
        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
          <button
            title={isDark ? "Modo claro" : "Modo escuro"}
            onClick={toggleDark}
            style={{
              width: 36,
              height: 36,
              borderRadius: 6,
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "transparent",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--tm-sidebar-hover-bg)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
          >
            {isDark
              ? <Sun size={15} strokeWidth={1.75} color="var(--tm-sidebar-icon)" />
              : <Moon size={15} strokeWidth={1.75} color="var(--tm-sidebar-icon)" />
            }
          </button>

          <button
            title="Configurações"
            onClick={() => setActiveSection("configuracoes")}
            style={{
              width: 36,
              height: 36,
              borderRadius: 6,
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: activeSection === "configuracoes" ? "var(--tm-sidebar-active-bg)" : "transparent",
              transition: "background 0.15s",
              position: "relative",
            }}
            onMouseEnter={(e) => {
              if (activeSection !== "configuracoes") (e.currentTarget as HTMLButtonElement).style.background = "var(--tm-sidebar-hover-bg)";
            }}
            onMouseLeave={(e) => {
              if (activeSection !== "configuracoes") (e.currentTarget as HTMLButtonElement).style.background = "transparent";
            }}
          >
            {activeSection === "configuracoes" && (
              <span style={{ position: "absolute", left: 0, top: 8, bottom: 8, width: 2, background: "#C8541C", borderRadius: "0 2px 2px 0" }} />
            )}
            <Settings
              size={15}
              strokeWidth={1.75}
              color={activeSection === "configuracoes" ? "var(--tm-sidebar-icon-active)" : "var(--tm-sidebar-icon)"}
            />
          </button>
        </div>
      </aside>

      {/* ── ÁREA PRINCIPAL ────────────────────────────────── */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
        <div style={{ flex: 1, overflowY: "auto", position: "relative" }}>
          {children}
        </div>
        
        {/* Footer do Sistema (Console/Terminal) */}
        <ConsoleWatcher />
      </main>
    </div>
  );
}
