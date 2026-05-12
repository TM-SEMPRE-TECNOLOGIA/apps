"""
Gerador de Relatório Fotográfico (Local)
Aplicação desktop com interface gráfica moderna (CustomTkinter Dark Theme)

Funcionalidades:
- Seleção de pasta raiz com fotos
- Seleção de modelo Word (.docx)
- Pré-visualização e edição do conteúdo
- Geração automática do relatório

───────────────────────────────────────────────────────────
Desenvolvido por: Thiago Nascimento Barbosa
Empresa: TM - Sempre Tecnologia
Data: Fevereiro 2026
───────────────────────────────────────────────────────────
"""

import os
import shutil
import customtkinter as ctk
from tkinter import filedialog, messagebox

from generator import build_content_from_root, run_preview, run_all

# ============================
# CONFIGURAÇÃO DO TEMA
# ============================
ctk.set_appearance_mode("dark")
ctk.set_default_color_theme("blue")

# Paleta de cores premium (GitHub Dark)
COLORS = {
    "bg_primary": "#0d1117",
    "bg_secondary": "#161b22",
    "bg_tertiary": "#21262d",
    "accent_blue": "#58a6ff",
    "accent_green": "#3fb950",
    "accent_red": "#f85149",
    "accent_yellow": "#d29922",
    "text_primary": "#c9d1d9",
    "text_secondary": "#8b949e",
    "border": "#30363d",
}

APP_TITLE = "📸 Gerador de Relatório Fotográfico"


def _safe_basename(path: str) -> str:
    return os.path.basename(path.rstrip(os.sep)) if path else ""


class App(ctk.CTk):
    def __init__(self):
        super().__init__()
        
        # Configuração da janela
        self.title(APP_TITLE)
        self.geometry("950x650")
        self.minsize(800, 550)
        self.configure(fg_color=COLORS["bg_primary"])

        self.project_dir = os.path.dirname(os.path.abspath(__file__))
        self.templates_dir = os.path.join(self.project_dir, "templates")

        self.pasta_raiz_var = ctk.StringVar()
        self.pasta_saida_var = ctk.StringVar(value=os.path.join(self.project_dir, "output"))
        self.modelo_var = ctk.StringVar()

        self._conteudo_aprovado = None

        self._build_ui()
        self._refresh_templates()

    def _build_ui(self):
        # ===== HEADER =====
        self.header = ctk.CTkFrame(self, height=70, fg_color="transparent")
        self.header.pack(fill="x", padx=25, pady=(20, 10))
        
        titulo = ctk.CTkLabel(
            self.header,
            text="📸 Gerador de Relatório Fotográfico",
            font=ctk.CTkFont(size=26, weight="bold"),
            text_color=COLORS["text_primary"]
        )
        titulo.pack(side="left")
        
        assinatura = ctk.CTkLabel(
            self.header,
            text="TM - Sempre Tecnologia",
            font=ctk.CTkFont(size=11),
            text_color=COLORS["text_secondary"]
        )
        assinatura.pack(side="right", padx=10)

        # ===== PAINEL PRINCIPAL =====
        self.main_frame = ctk.CTkFrame(self, fg_color=COLORS["bg_secondary"], corner_radius=12)
        self.main_frame.pack(fill="both", expand=True, padx=25, pady=10)

        # ---------- Pasta raiz ----------
        row1 = ctk.CTkFrame(self.main_frame, fg_color="transparent")
        row1.pack(fill="x", padx=20, pady=(20, 10))
        
        ctk.CTkLabel(
            row1,
            text="📁 Pasta raiz (fotos):",
            font=ctk.CTkFont(size=13, weight="bold"),
            text_color=COLORS["text_primary"]
        ).pack(side="left")
        
        self.entry_raiz = ctk.CTkEntry(
            row1,
            textvariable=self.pasta_raiz_var,
            placeholder_text="Selecione a pasta com as fotos...",
            fg_color=COLORS["bg_tertiary"],
            border_color=COLORS["border"],
            text_color=COLORS["text_primary"]
        )
        self.entry_raiz.pack(side="left", fill="x", expand=True, padx=(12, 12))
        
        ctk.CTkButton(
            row1,
            text="Selecionar",
            width=100,
            fg_color=COLORS["accent_blue"],
            hover_color="#4090e0",
            command=self._pick_root
        ).pack(side="right")

        # ---------- Modelo Word ----------
        row2 = ctk.CTkFrame(self.main_frame, fg_color="transparent")
        row2.pack(fill="x", padx=20, pady=10)
        
        ctk.CTkLabel(
            row2,
            text="📄 Modelo Word:",
            font=ctk.CTkFont(size=13, weight="bold"),
            text_color=COLORS["text_primary"]
        ).pack(side="left")
        
        self.modelo_combo = ctk.CTkComboBox(
            row2,
            variable=self.modelo_var,
            values=[],
            fg_color=COLORS["bg_tertiary"],
            border_color=COLORS["border"],
            button_color=COLORS["accent_blue"],
            button_hover_color="#4090e0",
            dropdown_fg_color=COLORS["bg_secondary"],
            dropdown_hover_color=COLORS["bg_tertiary"],
            text_color=COLORS["text_primary"],
            state="readonly"
        )
        self.modelo_combo.pack(side="left", fill="x", expand=True, padx=(12, 12))
        
        ctk.CTkButton(
            row2,
            text="➕ Adicionar",
            width=100,
            fg_color=COLORS["bg_tertiary"],
            hover_color=COLORS["border"],
            border_width=1,
            border_color=COLORS["border"],
            command=self._add_template
        ).pack(side="right")

        # ---------- Pasta de saída ----------
        row3 = ctk.CTkFrame(self.main_frame, fg_color="transparent")
        row3.pack(fill="x", padx=20, pady=10)
        
        ctk.CTkLabel(
            row3,
            text="💾 Pasta de saída:",
            font=ctk.CTkFont(size=13, weight="bold"),
            text_color=COLORS["text_primary"]
        ).pack(side="left")
        
        self.entry_saida = ctk.CTkEntry(
            row3,
            textvariable=self.pasta_saida_var,
            placeholder_text="Onde salvar o relatório...",
            fg_color=COLORS["bg_tertiary"],
            border_color=COLORS["border"],
            text_color=COLORS["text_primary"]
        )
        self.entry_saida.pack(side="left", fill="x", expand=True, padx=(12, 12))
        
        ctk.CTkButton(
            row3,
            text="Selecionar",
            width=100,
            fg_color=COLORS["accent_blue"],
            hover_color="#4090e0",
            command=self._pick_output
        ).pack(side="right")

        # ---------- Botões de Ação ----------
        btn_frame = ctk.CTkFrame(self.main_frame, fg_color="transparent")
        btn_frame.pack(fill="x", padx=20, pady=(20, 10))
        
        self.btn_preview = ctk.CTkButton(
            btn_frame,
            text="👁️ Pré-visualizar",
            font=ctk.CTkFont(size=14, weight="bold"),
            height=45,
            fg_color=COLORS["accent_yellow"],
            hover_color="#c08820",
            text_color="#000",
            command=self._do_preview
        )
        self.btn_preview.pack(side="left", padx=(0, 10))
        
        self.btn_generate = ctk.CTkButton(
            btn_frame,
            text="🚀 Gerar Relatório",
            font=ctk.CTkFont(size=14, weight="bold"),
            height=45,
            fg_color=COLORS["accent_green"],
            hover_color="#2ea043",
            text_color="#000",
            command=self._do_generate
        )
        self.btn_generate.pack(side="left")
        
        ctk.CTkButton(
            btn_frame,
            text="📂 Abrir pasta de saída",
            height=45,
            fg_color=COLORS["bg_tertiary"],
            hover_color=COLORS["border"],
            border_width=1,
            border_color=COLORS["border"],
            command=self._open_output
        ).pack(side="right")

        # ---------- Log (tela) ----------
        log_label = ctk.CTkLabel(
            self.main_frame,
            text="📋 Log de Execução:",
            font=ctk.CTkFont(size=13, weight="bold"),
            text_color=COLORS["text_primary"]
        )
        log_label.pack(anchor="w", padx=20, pady=(15, 8))
        
        self.log = ctk.CTkTextbox(
            self.main_frame,
            font=ctk.CTkFont(family="Consolas", size=12),
            fg_color=COLORS["bg_primary"],
            text_color=COLORS["text_primary"],
            border_width=1,
            border_color=COLORS["border"],
            corner_radius=8
        )
        self.log.pack(fill="both", expand=True, padx=20, pady=(0, 20))
        self._log_line("✅ Pronto. Selecione a pasta raiz e o modelo.")

    def _log_line(self, msg: str) -> None:
        self.log.insert("end", msg + "\n")
        self.log.see("end")
        self.update_idletasks()

    def _pick_root(self):
        path = filedialog.askdirectory(title="Selecione a pasta de fotos")
        if path:
            self.pasta_raiz_var.set(path)
            self._conteudo_aprovado = None
            self._log_line(f"📁 Pasta raiz: {path}")

    def _pick_output(self):
        path = filedialog.askdirectory(title="Selecione a pasta de saída")
        if path:
            self.pasta_saida_var.set(path)
            self._log_line(f"💾 Pasta de saída: {path}")

    def _refresh_templates(self):
        os.makedirs(self.templates_dir, exist_ok=True)
        files = [f for f in os.listdir(self.templates_dir) if f.lower().endswith(".docx")]
        files.sort(key=str.casefold)
        self.modelo_combo.configure(values=files)
        if files and not self.modelo_var.get():
            self.modelo_var.set(files[0])

    def _add_template(self):
        src = filedialog.askopenfilename(title="Adicionar modelo DOCX", filetypes=[("Word", "*.docx")])
        if not src:
            return
        try:
            os.makedirs(self.templates_dir, exist_ok=True)
            dst = os.path.join(self.templates_dir, os.path.basename(src))
            if os.path.abspath(src) != os.path.abspath(dst):
                shutil.copy2(src, dst)
            self._refresh_templates()
            self.modelo_var.set(os.path.basename(dst))
            self._log_line(f"➕ Modelo adicionado: {dst}")
        except Exception as e:
            messagebox.showerror("Erro", f"Falha ao adicionar o modelo:\n\n{e}")

    def _resolve_model_path(self) -> str:
        name = self.modelo_var.get().strip()
        if not name:
            return ""
        return os.path.join(self.templates_dir, name)

    def _validate_inputs(self) -> tuple[str, str, str]:
        pasta_raiz = self.pasta_raiz_var.get().strip()
        pasta_saida = self.pasta_saida_var.get().strip()
        modelo_path = self._resolve_model_path()

        if not pasta_raiz or not os.path.isdir(pasta_raiz):
            raise ValueError("Selecione uma pasta raiz válida.")
        if not pasta_saida:
            raise ValueError("Selecione uma pasta de saída.")
        if not modelo_path or not os.path.isfile(modelo_path):
            raise ValueError("Selecione um modelo válido em templates.")

        return pasta_raiz, modelo_path, pasta_saida

    def _do_preview(self):
        try:
            pasta_raiz, _, pasta_saida = self._validate_inputs()
        except Exception as e:
            messagebox.showerror("Erro", str(e))
            return

        log_errors = os.path.join(pasta_saida, "erros_pastas.txt")

        self._log_line("─" * 50)
        self._log_line("👁️ Montando conteúdo para preview...")
        try:
            conteudo = build_content_from_root(pasta_raiz, log_errors_path=log_errors, logger=self._log_line)
            self._log_line(f"📊 Conteúdo montado: {len(conteudo)} elementos.")
            conteudo_editado = run_preview(conteudo)
            if conteudo_editado is None:
                self._log_line("❌ Preview cancelado.")
                self._conteudo_aprovado = None
                return
            self._conteudo_aprovado = conteudo_editado
            self._log_line(f"✅ Preview confirmado: {len(conteudo_editado)} elementos aprovados.")
            messagebox.showinfo("Preview", "Pré-visualização confirmada. Você já pode gerar o relatório.")
        except Exception as e:
            self._log_line(f"❌ Erro no preview: {e}")
            messagebox.showerror("Erro", f"Falha ao pré-visualizar:\n\n{e}")

    def _do_generate(self):
        try:
            pasta_raiz, modelo_path, pasta_saida = self._validate_inputs()
        except Exception as e:
            messagebox.showerror("Erro", str(e))
            return

        self._log_line("─" * 50)
        self._log_line("🚀 Iniciando geração do relatório...")

        try:
            result = run_all(
                pasta_raiz=pasta_raiz,
                modelo_path=modelo_path,
                pasta_saida=pasta_saida,
                logger=self._log_line,
                conteudo_aprovado=self._conteudo_aprovado,
            )
            self._log_line("✅ Geração concluída com sucesso!")
            messagebox.showinfo(
                "Sucesso",
                "Relatório gerado com sucesso!\n\n"
                f"📸 Imagens inseridas: {result.total_images}\n"
                f"📄 Arquivo: {result.output_docx}\n\n"
                f"📋 Logs:\n• {result.log_process}\n• {result.log_errors}",
            )
        except Exception as e:
            self._log_line(f"❌ Erro na geração: {e}")
            messagebox.showerror("Erro", f"Ocorreu um erro:\n\n{e}")

    def _open_output(self):
        path = self.pasta_saida_var.get().strip() or os.path.join(self.project_dir, "output")
        try:
            os.makedirs(path, exist_ok=True)
            os.startfile(path)
        except Exception:
            messagebox.showinfo("Pasta", f"Pasta de saída:\n{path}")


if __name__ == "__main__":
    App().mainloop()
