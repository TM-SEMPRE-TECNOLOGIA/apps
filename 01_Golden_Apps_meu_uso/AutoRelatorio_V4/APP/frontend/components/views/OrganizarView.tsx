"use client";

import { Topbar } from "@/components/shell/Topbar";
import { PhotoGrid } from "@/components/organizar/PhotoGrid";
import { DocxPreviewPanel } from "@/components/organizar/DocxPreviewPanel";
import { CTABar } from "@/components/organizar/CTABar";

export function OrganizarView() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      <Topbar />

      {/* Content area */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Grid de fotos */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <PhotoGrid />
          <CTABar />
        </div>

        {/* Painel de preview lateral */}
        <DocxPreviewPanel />
      </div>
    </div>
  );
}
