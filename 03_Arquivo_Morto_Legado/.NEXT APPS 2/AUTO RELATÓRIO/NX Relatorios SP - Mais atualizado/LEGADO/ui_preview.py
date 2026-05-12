"""
Módulo de Pré-visualização do Relatório Fotográfico
Interface moderna com CustomTkinter Dark Theme

───────────────────────────────────────────────────────────
Desenvolvido por: Thiago Nascimento Barbosa
Empresa: TM - Sempre Tecnologia
Data: Fevereiro 2026
───────────────────────────────────────────────────────────
"""

import os
import math
import customtkinter as ctk
from tkinter import filedialog, messagebox
from PIL import Image, ImageTk

# ============================
# CONFIGURAÇÃO
# ============================
ITENS_POR_PAGINA = 100

# Paleta de cores premium (GitHub Dark)
COLORS = {
    "bg_primary": "#0d1117",
    "bg_secondary": "#161b22",
    "bg_tertiary": "#21262d",
    "accent_blue": "#58a6ff",
    "accent_green": "#3fb950",
    "accent_red": "#f85149",
    "accent_yellow": "#d29922",
    "accent_purple": "#a371f7",
    "text_primary": "#c9d1d9",
    "text_secondary": "#8b949e",
    "border": "#30363d",
}

# Cores por tipo de item
ITEM_COLORS = {
    "image": "#1f3a2e",      # Verde escuro
    "topic": "#1f2d3d",      # Azul escuro
    "break": "#3d2e1f",      # Amarelo escuro
    "paragraph": "#2d1f3d",  # Roxo escuro
}


def selecionar_pasta():
    root = ctk.CTk()
    root.withdraw()
    return filedialog.askdirectory(title="Selecione a pasta de fotos")


def selecionar_modelo():
    root = ctk.CTk()
    root.withdraw()
    return filedialog.askopenfilename(
        title="Selecione o modelo do Word",
        filetypes=[("Documentos Word", "*.docx")]
    )


def selecionar_caminho_saida():
    root = ctk.CTk()
    root.withdraw()
    return filedialog.askdirectory(title="Selecione a pasta para salvar o relatório")


def gerar_thumbnail(path, master=None, altura=120):
    try:
        img = Image.open(path)
        w, h = img.size
        fator = altura / float(h)
        nova_largura = max(1, int(w * fator))
        img = img.resize((nova_largura, altura), Image.Resampling.LANCZOS)
    except Exception:
        img = Image.new("RGB", (altura, altura), (33, 38, 45))
    return ImageTk.PhotoImage(img, master=master)


def preview_conteudo(conteudo):
    # Criar janela de preview
    win = ctk.CTkToplevel()
    win.title("👁️ Pré-visualização do Relatório Fotográfico")
    win.geometry("1280x800")
    win.minsize(1000, 600)
    win.configure(fg_color=COLORS["bg_primary"])
    
    # Focar na janela
    win.lift()
    win.focus_force()
    win.grab_set()

    state = {
        "conteudo": list(conteudo),
        "confirmado": False,
        "selecionados": set(),
        "thumb_refs": {},
        "pagina": 1
    }

    # ===== HEADER =====
    header = ctk.CTkFrame(win, height=60, fg_color="transparent")
    header.pack(fill="x", padx=20, pady=(15, 10))
    
    titulo_lbl = ctk.CTkLabel(
        header,
        text="👁️ Revise e edite o relatório antes da geração final",
        font=ctk.CTkFont(size=20, weight="bold"),
        text_color=COLORS["text_primary"]
    )
    titulo_lbl.pack(side="left")

    # ===== BARRA DE AÇÕES =====
    bar = ctk.CTkFrame(win, fg_color=COLORS["bg_secondary"], corner_radius=10)
    bar.pack(fill="x", padx=20, pady=(0, 10))

    def confirmar():
        state["confirmado"] = True
        win.destroy()

    def cancelar():
        state["confirmado"] = False
        win.destroy()

    def mover_sel(d):
        if not state["selecionados"]:
            messagebox.showinfo("Aviso", "Nenhum item selecionado.")
            return
        indices = sorted(state["selecionados"])
        nova = state["conteudo"]
        if d < 0:
            for i in indices:
                if i > 0:
                    nova[i], nova[i - 1] = nova[i - 1], nova[i]
            state["selecionados"] = {i - 1 for i in indices if i > 0}
        else:
            for i in reversed(indices):
                if i < len(nova) - 1:
                    nova[i], nova[i + 1] = nova[i + 1], nova[i]
            state["selecionados"] = {i + 1 for i in indices if i < len(nova) - 1}
        render()

    def excluir_sel():
        if not state["selecionados"]:
            messagebox.showinfo("Aviso", "Nenhum item selecionado.")
            return
        if not messagebox.askyesno("Confirmar", "Remover todos os itens selecionados?"):
            return
        state["conteudo"] = [v for i, v in enumerate(state["conteudo"]) if i not in state["selecionados"]]
        state["selecionados"].clear()
        render()

    # Botões de ação na barra
    btn_frame_left = ctk.CTkFrame(bar, fg_color="transparent")
    btn_frame_left.pack(side="left", padx=15, pady=12)
    
    ctk.CTkButton(
        btn_frame_left,
        text="▲ Mover",
        width=100,
        fg_color=COLORS["accent_blue"],
        hover_color="#4090e0",
        command=lambda: mover_sel(-1)
    ).pack(side="left", padx=(0, 8))
    
    ctk.CTkButton(
        btn_frame_left,
        text="▼ Mover",
        width=100,
        fg_color=COLORS["accent_blue"],
        hover_color="#4090e0",
        command=lambda: mover_sel(1)
    ).pack(side="left", padx=(0, 8))
    
    ctk.CTkButton(
        btn_frame_left,
        text="🗑️ Excluir",
        width=100,
        fg_color=COLORS["accent_red"],
        hover_color="#d03030",
        command=excluir_sel
    ).pack(side="left")

    btn_frame_right = ctk.CTkFrame(bar, fg_color="transparent")
    btn_frame_right.pack(side="right", padx=15, pady=12)
    
    ctk.CTkButton(
        btn_frame_right,
        text="❌ Cancelar",
        width=120,
        fg_color=COLORS["bg_tertiary"],
        hover_color=COLORS["border"],
        border_width=1,
        border_color=COLORS["accent_red"],
        text_color=COLORS["accent_red"],
        command=cancelar
    ).pack(side="right", padx=(8, 0))
    
    ctk.CTkButton(
        btn_frame_right,
        text="✅ Confirmar e Gerar",
        width=160,
        font=ctk.CTkFont(weight="bold"),
        fg_color=COLORS["accent_green"],
        hover_color="#2ea043",
        text_color="#000",
        command=confirmar
    ).pack(side="right")

    # ===== ÁREA DE SCROLL =====
    scroll_frame = ctk.CTkScrollableFrame(
        win,
        fg_color=COLORS["bg_secondary"],
        corner_radius=10,
        scrollbar_button_color=COLORS["border"],
        scrollbar_button_hover_color=COLORS["accent_blue"]
    )
    scroll_frame.pack(fill="both", expand=True, padx=20, pady=(0, 10))

    # ===== PAGINAÇÃO =====
    paginador = ctk.CTkFrame(win, height=50, fg_color="transparent")
    paginador.pack(fill="x", padx=20, pady=(0, 15))

    pagina_lbl = ctk.CTkLabel(
        paginador,
        text="",
        font=ctk.CTkFont(size=12),
        text_color=COLORS["text_secondary"]
    )
    pagina_lbl.pack(side="left")

    def mudar_pagina(delta):
        total_paginas = math.ceil(len(state["conteudo"]) / ITENS_POR_PAGINA)
        nova = state["pagina"] + delta
        if 1 <= nova <= total_paginas:
            state["pagina"] = nova
            render()

    ctk.CTkButton(
        paginador,
        text="Próxima ▶",
        width=100,
        fg_color=COLORS["bg_tertiary"],
        hover_color=COLORS["border"],
        command=lambda: mudar_pagina(1)
    ).pack(side="right", padx=(8, 0))
    
    ctk.CTkButton(
        paginador,
        text="◀ Anterior",
        width=100,
        fg_color=COLORS["bg_tertiary"],
        hover_color=COLORS["border"],
        command=lambda: mudar_pagina(-1)
    ).pack(side="right")

    # ===== FUNÇÕES DE EDIÇÃO =====
    def editar(idx):
        item = state["conteudo"][idx]

        if isinstance(item, str):
            dialog = ctk.CTkInputDialog(
                text="Novo nome do tópico:",
                title="✏️ Editar Tópico"
            )
            novo = dialog.get_input()
            if novo:
                state["conteudo"][idx] = novo
                render()

        elif isinstance(item, dict) and ("quebra_pagina" in item or "paragrafo" in item):
            # Toggle entre quebra e parágrafo
            if "quebra_pagina" in item:
                state["conteudo"][idx] = {"paragrafo": True}
            else:
                state["conteudo"][idx] = {"quebra_pagina": True}
            render()

    def mover_uma(idx, d):
        nova = idx + d
        if 0 <= nova < len(state["conteudo"]):
            state["conteudo"][idx], state["conteudo"][nova] = state["conteudo"][nova], state["conteudo"][idx]
            render()

    def remover_uma(idx):
        if messagebox.askyesno("Remover", "Remover este item?"):
            state["conteudo"].pop(idx)
            render()

    # ===== RENDERIZAÇÃO =====
    def render():
        for c in scroll_frame.winfo_children():
            c.destroy()
        state["thumb_refs"].clear()

        total_itens = len(state["conteudo"])
        total_paginas = max(1, math.ceil(total_itens / ITENS_POR_PAGINA))
        pagina_lbl.configure(text=f"Página {state['pagina']} de {total_paginas} • {total_itens} itens")

        inicio = (state["pagina"] - 1) * ITENS_POR_PAGINA
        fim = min(inicio + ITENS_POR_PAGINA, total_itens)
        subset = state["conteudo"][inicio:fim]

        for idx_global, item in enumerate(subset, start=inicio):
            # Determinar tipo e cor
            if isinstance(item, dict) and "imagem" in item:
                bg_color = ITEM_COLORS["image"]
                icon = "🖼️"
                texto = os.path.basename(item["imagem"])
            elif isinstance(item, dict) and "quebra_pagina" in item:
                bg_color = ITEM_COLORS["break"]
                icon = "⤴️"
                texto = "[Quebra de página]"
            elif isinstance(item, dict) and "paragrafo" in item:
                bg_color = ITEM_COLORS["paragraph"]
                icon = "¶"
                texto = "[Parágrafo]"
            elif isinstance(item, str):
                bg_color = ITEM_COLORS["topic"]
                icon = "📁" if "»" not in item else "🔹"
                texto = item
            else:
                bg_color = ITEM_COLORS["topic"]
                icon = "•"
                texto = str(item)

            # Card do item
            row = ctk.CTkFrame(
                scroll_frame,
                fg_color=bg_color,
                corner_radius=8,
                border_width=1,
                border_color=COLORS["border"]
            )
            row.pack(fill="x", pady=4, padx=8)

            # Checkbox
            var = ctk.BooleanVar(value=(idx_global in state["selecionados"]))
            
            def toggle(i=idx_global, v=var):
                if v.get():
                    state["selecionados"].add(i)
                else:
                    state["selecionados"].discard(i)
            
            cb = ctk.CTkCheckBox(
                row,
                text="",
                variable=var,
                command=toggle,
                width=24,
                fg_color=COLORS["accent_blue"],
                hover_color="#4090e0",
                border_color=COLORS["border"]
            )
            cb.pack(side="left", padx=(12, 8), pady=10)

            # Thumbnail ou ícone
            thumb_frame = ctk.CTkFrame(row, width=150, height=100, fg_color="transparent")
            thumb_frame.pack(side="left", padx=(0, 12), pady=8)
            thumb_frame.pack_propagate(False)

            if isinstance(item, dict) and "imagem" in item:
                try:
                    thumb = gerar_thumbnail(item["imagem"], master=win, altura=90)
                    state["thumb_refs"][idx_global] = thumb
                    # Usar canvas para exibir imagem com PIL
                    import tkinter as tk
                    canvas = tk.Canvas(thumb_frame, width=150, height=90, bg=bg_color, highlightthickness=0)
                    canvas.pack(expand=True)
                    canvas.create_image(75, 45, image=thumb)
                except Exception:
                    lbl_icon = ctk.CTkLabel(thumb_frame, text=icon, font=ctk.CTkFont(size=28))
                    lbl_icon.pack(expand=True)
            else:
                lbl_icon = ctk.CTkLabel(
                    thumb_frame,
                    text=icon,
                    font=ctk.CTkFont(size=28),
                    text_color=COLORS["text_primary"]
                )
                lbl_icon.pack(expand=True)

            # Texto
            lbl_texto = ctk.CTkLabel(
                row,
                text=texto,
                font=ctk.CTkFont(size=12),
                text_color=COLORS["text_primary"],
                anchor="w"
            )
            lbl_texto.pack(side="left", fill="x", expand=True, padx=(0, 10))

            # Botões de ação
            btn_frame = ctk.CTkFrame(row, fg_color="transparent")
            btn_frame.pack(side="right", padx=12, pady=8)

            for txt, cmd in [
                ("❌", lambda i=idx_global: remover_uma(i)),
                ("✏️", lambda i=idx_global: editar(i)),
                ("▲", lambda i=idx_global: mover_uma(i, -1)),
                ("▼", lambda i=idx_global: mover_uma(i, 1))
            ]:
                ctk.CTkButton(
                    btn_frame,
                    text=txt,
                    width=35,
                    height=30,
                    fg_color=COLORS["bg_tertiary"],
                    hover_color=COLORS["border"],
                    command=cmd
                ).pack(side="left", padx=2)

    render()
    win.wait_window()
    return state["conteudo"] if state["confirmado"] else None
