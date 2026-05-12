# Correção: "Vista ampla" no contador de numeração

## O que foi corrigido

"Vista ampla" estava sendo contada pelo `enumerate()` como `idx_sub=1`, fazendo o primeiro serviço real começar em `.2`.

## Alterações

### [app.py](file:///c:/Users/thiag/TM-MEUS-APPS/TM%20Pastas/app.py)

**Duas funções corrigidas** — mesma lógica em ambas:

```diff:app.py
"""
Gerador de Estrutura de Pastas para Levantamentos Fotográficos
Aplicação desktop com interface gráfica moderna (CustomTkinter)

Princípios:
- Nada é criado automaticamente
- Tudo é selecionável
- A ordem de criação define a numeração
- O nome é livre
- A visualização é a verdade

───────────────────────────────────────────────────────────
Desenvolvido por: Thiago Nascimento Barbosa
Empresa: TM - Sempre Tecnologia
Data: Fevereiro 2026
───────────────────────────────────────────────────────────
"""

import os
import customtkinter as ctk
from tkinter import filedialog, messagebox, simpledialog
import json

# ============================
# CONFIGURAÇÃO DO TEMA
# ============================
ctk.set_appearance_mode("dark")
ctk.set_default_color_theme("blue")

# ============================
# DADOS PRÉ-DEFINIDOS (ATUALIZADOS)
# ============================
AREAS_SUGERIDAS = [
    "Área externa",
    "Área interna",
    "Segundo piso",
    "Primeiro piso",
    "Cobertura"
]

AMBIENTES_SUGERIDOS = [
    "SAA (sala de autoatendimento)",
    "Atendimento",
    "Corredor de acesso",
    "Banheiro feminino",
    "Banheiro masculino",
    "Banheiro PNE",
    "Copa",
    "Cozinha",
    "Suporte",
    "CAIEX",
    "Tesouraria",
    "Sala de reunião",
    "Sala do gerente",
    "Depósito",
    "Arquivo",
    "Corredor de abastecimento",
    "Escadas",
    "Área restrita"
]

SERVICOS_SUGERIDOS = [
    "Pintura acrílica",
    "Pintura automotiva",
    "Pintura esmalte em porta",
    "Pintura esmalte metal",
    "Piso tátil inox",
    "Piso tátil",
    "Substituição de lâmpadas",
    "Substituição de ducha higiênica",
    "Substituição de torneira",
    "Substituição de fechadura",
    "Substituição de puxador",
    "Substituição de película e policarbonato",
    "Telhado",
    "Impermeabilização de calha",
    "SPDA",
    "Forro de fibra mineral",
    "Forro de gesso",
    "Manutenção em ponto elétrico",
    "Manutenção em ponto lógico",
    "Ar condicionado",
    "Pictograma",
    "Letreiro",
    "Limpeza de fachada"
]

SUBPASTAS_SUGERIDAS = [
    "Vista ampla",
    "Detalhes",
    "Antes",
    "Depois",
    "Descrição"
]

# Cores por nível para o preview interativo
CORES_NIVEL = {
    1: "#3b82f6",   # Azul - Área
    2: "#10b981",   # Verde - Ambiente/Serviço
    3: "#f97316",   # Laranja - Subpasta/Serviço filho
    4: "#8b5cf6",   # Roxo - Detalhe
}

ICONES_NIVEL = {
    1: "🌎",
    2: "📍",
    3: "📂",
    4: "🔍",
}


class GeradorEstruturaPastas(ctk.CTk):
    def __init__(self):
        super().__init__()
        
        # Configuração da janela
        self.title("🏗️ Gerador de Estrutura de Pastas - TM")
        self.geometry("1400x900")
        self.minsize(1200, 750)
        
        # Estado da aplicação
        self.pasta_destino = ctk.StringVar(value="")
        self.nome_levantamento = ctk.StringVar(value="")
        
        self.areas_selecionadas = []
        self.itens_por_area = {}
        self.servicos_por_ambiente = {}
        self.subpastas_por_item = {}
        self.detalhes_por_subitem = {}
        self.vista_ampla_geral = {}
        
        # Rastreamento de itens personalizados
        self.custom_ambientes = set()
        self.custom_servicos = set()
        self.custom_subpastas = set()
        self.custom_detalhes = set()
        
        # Flag para evitar que atualizações de UI disparem eventos de toggle
        self.updating_ui = False
        
        # Seleções atuais para o fluxo de UI
        self.area_atual = None
        self.item_atual = None
        self.subitem_atual = None
        self.servico_atual = None
        
        # Construir interface
        self._criar_interface()
        
    def _criar_interface(self):
        """Monta toda a interface gráfica"""
        
        # ===== HEADER =====
        self.header = ctk.CTkFrame(self, height=80, fg_color="transparent")
        self.header.pack(fill="x", padx=20, pady=(20, 10))
        
        titulo = ctk.CTkLabel(
            self.header, 
            text="🏗️ Gerador de Estrutura de Pastas",
            font=ctk.CTkFont(size=28, weight="bold")
        )
        titulo.pack(side="left")
        
        assinatura = ctk.CTkLabel(
            self.header,
            text="TM - Sempre Tecnologia",
            font=ctk.CTkFont(size=11),
            text_color="#666"
        )
        assinatura.pack(side="right", padx=10)
        
        # ===== BARRA DE CONFIGURAÇÃO =====
        self.config_bar = ctk.CTkFrame(self, fg_color="transparent")
        self.config_bar.pack(fill="x", padx=20, pady=(0, 10))
        
        frame_nome = ctk.CTkFrame(self.config_bar, fg_color="transparent")
        frame_nome.pack(side="left")
        
        ctk.CTkLabel(frame_nome, text="📋 Levantamento:", font=ctk.CTkFont(size=13, weight="bold")).pack(side="left", padx=(0, 10))
        
        self.entry_nome_levantamento = ctk.CTkEntry(
            frame_nome,
            textvariable=self.nome_levantamento,
            width=350,
            placeholder_text="Ex: 01 - Arcos - Enviado"
        )
        self.entry_nome_levantamento.pack(side="left")
        self.entry_nome_levantamento.bind("<KeyRelease>", lambda e: self._atualizar_preview())
        
        frame_destino = ctk.CTkFrame(self.config_bar, fg_color="transparent")
        frame_destino.pack(side="right")
        
        self.entry_destino = ctk.CTkEntry(
            frame_destino, 
            textvariable=self.pasta_destino,
            width=300,
            placeholder_text="Pasta destino..."
        )
        self.entry_destino.pack(side="left", padx=(0, 10))
        
        ctk.CTkButton(
            frame_destino, 
            text="📁 Selecionar",
            width=100,
            command=self._selecionar_pasta
        ).pack(side="left")
        
        # ===== ÁREA PRINCIPAL =====
        self.main_area = ctk.CTkFrame(self, fg_color="transparent")
        self.main_area.pack(fill="both", expand=True, padx=20, pady=10)
        
        # Painel esquerdo (seleções)
        self.painel_esquerdo = ctk.CTkScrollableFrame(self.main_area, width=550)
        self.painel_esquerdo.pack(side="left", fill="both", padx=(0, 10))
        
        # Painel direito (preview interativo)
        self.painel_direito = ctk.CTkFrame(self.main_area)
        self.painel_direito.pack(side="right", fill="both", expand=True)
        
        # ===== COLUNAS DE SELEÇÃO =====
        self._criar_painel_areas()
        self._criar_painel_ambientes_servicos()
        self._criar_painel_subpastas()
        self._criar_painel_detalhes_nivel4()
        
        # ===== PREVIEW INTERATIVO =====
        self._criar_painel_preview()
        
        # ===== FOOTER =====
        self.footer = ctk.CTkFrame(self, height=60, fg_color="transparent")
        self.footer.pack(fill="x", padx=20, pady=(10, 20))
        
        self.btn_gerar = ctk.CTkButton(
            self.footer,
            text="🔨 GERAR ESTRUTURA DE PASTAS",
            font=ctk.CTkFont(size=16, weight="bold"),
            height=50,
            fg_color="#00875a",
            hover_color="#006644",
            command=self._gerar_estrutura
        )
        self.btn_gerar.pack(side="left", fill="x", expand=True, padx=(0, 10))
        
        self.btn_limpar = ctk.CTkButton(
            self.footer,
            text="🧹 LIMPAR SELEÇÃO",
            font=ctk.CTkFont(size=14, weight="bold"),
            height=50,
            fg_color="#991b1b",
            hover_color="#7f1d1d",
            command=self._limpar_selecao
        )
        self.btn_limpar.pack(side="right", fill="x", expand=True)

    # ============================
    # PAINÉIS DE SELEÇÃO (ESQUERDA)
    # ============================
        
    def _criar_painel_areas(self):
        """Cria o painel de seleção de Áreas (Nível 1)"""
        frame = ctk.CTkFrame(self.painel_esquerdo)
        frame.pack(fill="x", padx=5, pady=5)
        
        ctk.CTkLabel(frame, text="🌎 1. SELECIONE A ÁREA", font=ctk.CTkFont(size=14, weight="bold")).pack(padx=10, pady=(10, 5), anchor="w")
        
        # Barra de pesquisa
        self.search_areas = ctk.CTkEntry(frame, placeholder_text="🔍 Filtrar áreas...", height=30)
        self.search_areas.pack(fill="x", padx=10, pady=(0, 5))
        self.search_areas.bind("<KeyRelease>", lambda e: self._filtrar_areas())
        
        self.frame_areas_list = ctk.CTkFrame(frame, fg_color="transparent", height=100)
        self.frame_areas_list.pack(fill="x", padx=10, pady=5)
        
        self.checkboxes_areas = {}
        self._popular_areas()

    def _popular_areas(self, filtro=""):
        """Popula a lista de áreas com filtro"""
        for widget in self.frame_areas_list.winfo_children():
            widget.destroy()
        self.checkboxes_areas.clear()
        
        todas = list(AREAS_SUGERIDAS) + sorted(self.custom_ambientes - set(AMBIENTES_SUGERIDOS))
        # Áreas customizadas são apenas as que foram adicionadas como área
        # Na verdade, as áreas custom não existem atualmente. Mantemos a lógica simples.
        todas = list(AREAS_SUGERIDAS)
        
        filtro_lower = filtro.lower().strip()
        visiveis = [a for a in todas if not filtro_lower or filtro_lower in a.lower()]
        
        for i, area in enumerate(visiveis):
            cb = ctk.CTkCheckBox(
                self.frame_areas_list,
                text=area,
                command=lambda a=area: self._toggle_area(a)
            )
            cb.grid(row=i//2, column=i%2, sticky="w", padx=5, pady=2)
            if area in self.areas_selecionadas:
                cb.select()
            self.checkboxes_areas[area] = cb

    def _filtrar_areas(self):
        filtro = self.search_areas.get()
        self._popular_areas(filtro)

    def _criar_painel_ambientes_servicos(self):
        """Cria o painel de Ambientes ou Serviços dentro da Área (Nível 2)"""
        self.frame_itens_container = ctk.CTkFrame(self.painel_esquerdo)
        self.frame_itens_container.pack(fill="x", padx=5, pady=5)
        
        header = ctk.CTkFrame(self.frame_itens_container, fg_color="transparent")
        header.pack(fill="x", padx=10, pady=(10, 5))
        
        ctk.CTkLabel(header, text="📍 2. AMBIENTES / SERVIÇOS", font=ctk.CTkFont(size=14, weight="bold")).pack(side="left")
        
        self.label_area_temp = ctk.CTkLabel(header, text="", font=ctk.CTkFont(size=11), text_color="#00d4ff")
        self.label_area_temp.pack(side="right")

        # Vista ampla da ÁREA
        self.cb_va_area = ctk.CTkCheckBox(
            self.frame_itens_container,
            text="📷 Incluir 'Vista ampla' nesta ÁREA",
            command=self._toggle_va_area,
            fg_color="#00875a"
        )
        self.cb_va_area.pack(anchor="w", padx=15, pady=5)

        # Barra de pesquisa Nível 2
        self.search_n2 = ctk.CTkEntry(self.frame_itens_container, placeholder_text="🔍 Filtrar ambientes/serviços...", height=30)
        self.search_n2.pack(fill="x", padx=10, pady=(0, 5))
        self.search_n2.bind("<KeyRelease>", lambda e: self._filtrar_nivel2())

        # Tabs para organizar Ambientes vs Serviços Sugeridos
        self.tab_itens = ctk.CTkTabview(self.frame_itens_container, height=250)
        self.tab_itens.pack(fill="x", padx=10, pady=5)
        
        self.tab_itens.add("Ambientes")
        self.tab_itens.add("Serviços")
        
        # Área de adição personalizada Nível 2
        frame_custom = ctk.CTkFrame(self.frame_itens_container, fg_color="transparent")
        frame_custom.pack(fill="x", padx=10, pady=5)
        
        self.entry_custom_n2 = ctk.CTkEntry(frame_custom, placeholder_text="Novo item...", width=150)
        self.entry_custom_n2.pack(side="left", fill="x", expand=True, padx=(0, 5))
        self.entry_custom_n2.bind("<Return>", lambda e: self._adicionar_custom_nivel2())
        
        ctk.CTkButton(
            frame_custom, text="+", width=30, 
            command=self._adicionar_custom_nivel2
        ).pack(side="left")

        # Listas
        self.checkboxes_ambientes = {}
        self.scroll_amb = ctk.CTkScrollableFrame(self.tab_itens.tab("Ambientes"), height=200)
        self.scroll_amb.pack(fill="both", expand=True)

        self.checkboxes_servicos = {}
        self.scroll_srv_n2 = ctk.CTkScrollableFrame(self.tab_itens.tab("Serviços"), height=200)
        self.scroll_srv_n2.pack(fill="both", expand=True)
        
        self._popular_nivel2()

    def _popular_nivel2(self, filtro=""):
        """Popula as listas de Ambientes e Serviços com filtro"""
        # Limpar
        for widget in self.scroll_amb.winfo_children():
            widget.destroy()
        for widget in self.scroll_srv_n2.winfo_children():
            widget.destroy()
        self.checkboxes_ambientes.clear()
        self.checkboxes_servicos.clear()
        
        filtro_lower = filtro.lower().strip()
        selecionados = self.itens_por_area.get(self.area_atual, []) if self.area_atual else []
        
        # Ambientes
        todos_amb = list(AMBIENTES_SUGERIDOS) + sorted(self.custom_ambientes)
        for amb in todos_amb:
            if filtro_lower and filtro_lower not in amb.lower():
                continue
            cb = ctk.CTkCheckBox(self.scroll_amb, text=amb, command=lambda a=amb: self._toggle_item(a))
            cb.pack(anchor="w", pady=2)
            if amb in selecionados:
                cb.select()
            self.checkboxes_ambientes[amb] = cb
        
        # Serviços
        todos_srv = list(SERVICOS_SUGERIDOS) + sorted(self.custom_servicos - set(SERVICOS_SUGERIDOS))
        for srv in todos_srv:
            if filtro_lower and filtro_lower not in srv.lower():
                continue
            cb = ctk.CTkCheckBox(self.scroll_srv_n2, text=srv, command=lambda s=srv: self._toggle_item(s))
            cb.pack(anchor="w", pady=2)
            if srv in selecionados:
                cb.select()
            self.checkboxes_servicos[srv] = cb

    def _filtrar_nivel2(self):
        filtro = self.search_n2.get()
        self._popular_nivel2(filtro)

    def _criar_painel_subpastas(self):
        """Cria o painel de Subpastas (Nível 3)"""
        self.frame_sub_container = ctk.CTkFrame(self.painel_esquerdo)
        self.frame_sub_container.pack(fill="x", padx=5, pady=5)
        
        header = ctk.CTkFrame(self.frame_sub_container, fg_color="transparent")
        header.pack(fill="x", padx=10, pady=(10, 5))
        
        ctk.CTkLabel(header, text="📂 3. SERVIÇOS / SUBPASTAS (NÍVEL 3)", font=ctk.CTkFont(size=14, weight="bold")).pack(side="left")
        self.label_item_temp = ctk.CTkLabel(header, text="", font=ctk.CTkFont(size=11), text_color="#00d4ff")
        self.label_item_temp.pack(side="right")

        # Barra de pesquisa Nível 3
        self.search_n3 = ctk.CTkEntry(self.frame_sub_container, placeholder_text="🔍 Filtrar subpastas/serviços...", height=30)
        self.search_n3.pack(fill="x", padx=10, pady=(0, 5))
        self.search_n3.bind("<KeyRelease>", lambda e: self._filtrar_nivel3())

        # Tabs para Subpastas Padrão vs Serviços (Filhos)
        self.tab_sub = ctk.CTkTabview(self.frame_sub_container, height=250)
        self.tab_sub.pack(fill="x", padx=10, pady=5)
        
        self.tab_sub.add("Padrão")
        self.tab_sub.add("Serviços")

        # Área de adição personalizada Nível 3
        frame_custom = ctk.CTkFrame(self.frame_sub_container, fg_color="transparent")
        frame_custom.pack(fill="x", padx=10, pady=5)
        
        self.entry_custom_n3 = ctk.CTkEntry(frame_custom, placeholder_text="Novo item...", width=150)
        self.entry_custom_n3.pack(side="left", fill="x", expand=True, padx=(0, 5))
        self.entry_custom_n3.bind("<Return>", lambda e: self._adicionar_custom_nivel3())
        
        ctk.CTkButton(
            frame_custom, text="+", width=30, 
            command=self._adicionar_custom_nivel3
        ).pack(side="left")

        # Listas
        self.checkboxes_sub = {}
        self.scroll_sub_padrao = ctk.CTkScrollableFrame(self.tab_sub.tab("Padrão"), height=200)
        self.scroll_sub_padrao.pack(fill="both", expand=True)
        
        self.scroll_sub_servicos = ctk.CTkScrollableFrame(self.tab_sub.tab("Serviços"), height=200)
        self.scroll_sub_servicos.pack(fill="both", expand=True)
        
        self._popular_nivel3()

    def _popular_nivel3(self, filtro=""):
        """Popula as listas de Subpastas e Serviços (filhos) com filtro"""
        for widget in self.scroll_sub_padrao.winfo_children():
            widget.destroy()
        for widget in self.scroll_sub_servicos.winfo_children():
            widget.destroy()
        self.checkboxes_sub.clear()
        
        filtro_lower = filtro.lower().strip()
        
        key = (self.area_atual, self.item_atual) if self.area_atual and self.item_atual else None
        selecionados = self.subpastas_por_item.get(key, []) if key else []
        
        # Padrão
        todos_padrao = list(SUBPASTAS_SUGERIDAS) + sorted(self.custom_subpastas)
        for sub in todos_padrao:
            if filtro_lower and filtro_lower not in sub.lower():
                continue
            cb = ctk.CTkCheckBox(self.scroll_sub_padrao, text=sub, command=lambda s=sub: self._toggle_sub(s))
            cb.pack(anchor="w", pady=2)
            if sub in selecionados:
                cb.select()
            self.checkboxes_sub[sub] = cb
        
        # Serviços
        todos_srv = list(SERVICOS_SUGERIDOS) + sorted(self.custom_servicos - set(SERVICOS_SUGERIDOS))
        for srv in todos_srv:
            if filtro_lower and filtro_lower not in srv.lower():
                continue
            # Evitar duplicata de chave no dict
            key_name = srv
            cb = ctk.CTkCheckBox(self.scroll_sub_servicos, text=srv, command=lambda s=srv: self._toggle_sub(s))
            cb.pack(anchor="w", pady=2)
            if srv in selecionados:
                cb.select()
            if key_name not in self.checkboxes_sub:
                self.checkboxes_sub[key_name] = cb

    def _filtrar_nivel3(self):
        filtro = self.search_n3.get()
        self._popular_nivel3(filtro)

    def _criar_painel_detalhes_nivel4(self):
        """Cria o painel de Detalhes (Nível 4)"""
        self.frame_detalhes_container = ctk.CTkFrame(self.painel_esquerdo)
        self.frame_detalhes_container.pack(fill="x", padx=5, pady=5)
        
        header = ctk.CTkFrame(self.frame_detalhes_container, fg_color="transparent")
        header.pack(fill="x", padx=10, pady=(10, 5))
        
        ctk.CTkLabel(header, text="🔍 4. DETALHES (NÍVEL 4)", font=ctk.CTkFont(size=14, weight="bold")).pack(side="left")
        self.label_subItem_temp = ctk.CTkLabel(header, text="", font=ctk.CTkFont(size=11), text_color="#00d4ff")
        self.label_subItem_temp.pack(side="right")
        
        # Barra de pesquisa Nível 4
        self.search_n4 = ctk.CTkEntry(self.frame_detalhes_container, placeholder_text="🔍 Filtrar detalhes...", height=30)
        self.search_n4.pack(fill="x", padx=10, pady=(0, 5))
        self.search_n4.bind("<KeyRelease>", lambda e: self._filtrar_nivel4())
        
        # Lista Única (Detalhes)
        self.checkboxes_detalhes = {}
        self.scroll_detalhes = ctk.CTkScrollableFrame(self.frame_detalhes_container, height=150)
        self.scroll_detalhes.pack(fill="both", expand=True, padx=10, pady=5)
        
        self._popular_nivel4()

    def _popular_nivel4(self, filtro=""):
        """Popula a lista de Detalhes com filtro"""
        for widget in self.scroll_detalhes.winfo_children():
            widget.destroy()
        self.checkboxes_detalhes.clear()
        
        filtro_lower = filtro.lower().strip()
        
        key = (self.area_atual, self.item_atual, self.subitem_atual) if self.area_atual and self.item_atual and self.subitem_atual else None
        selecionados = self.detalhes_por_subitem.get(key, []) if key else []
        
        todos = list(SUBPASTAS_SUGERIDAS) + sorted(self.custom_detalhes)
        for det in todos:
            if filtro_lower and filtro_lower not in det.lower():
                continue
            cb = ctk.CTkCheckBox(self.scroll_detalhes, text=det, command=lambda d=det: self._toggle_nivel4(d))
            cb.pack(anchor="w", pady=2)
            if det in selecionados:
                cb.select()
            self.checkboxes_detalhes[det] = cb

    def _filtrar_nivel4(self):
        filtro = self.search_n4.get()
        self._popular_nivel4(filtro)

    # ============================
    # PREVIEW INTERATIVO (DIREITA)
    # ============================

    def _criar_painel_preview(self):
        """Cria o painel de preview interativo da estrutura"""
        header = ctk.CTkFrame(self.painel_direito, fg_color="transparent")
        header.pack(fill="x", padx=15, pady=(15, 5))
        
        ctk.CTkLabel(header, text="👁️ PREVIEW INTERATIVO", font=ctk.CTkFont(size=14, weight="bold")).pack(side="left")
        
        # Legenda de cores
        legenda_frame = ctk.CTkFrame(header, fg_color="transparent")
        legenda_frame.pack(side="right")
        for nivel, icone in ICONES_NIVEL.items():
            cor = CORES_NIVEL[nivel]
            lbl = ctk.CTkLabel(legenda_frame, text=f"{icone} N{nivel}", font=ctk.CTkFont(size=10), text_color=cor)
            lbl.pack(side="left", padx=4)
        
        self.preview_scroll = ctk.CTkScrollableFrame(
            self.painel_direito,
            fg_color="#1a1a2e"
        )
        self.preview_scroll.pack(fill="both", expand=True, padx=15, pady=(5, 15))

    def _atualizar_preview(self):
        """Redesenha o preview interativo completo"""
        # Limpar preview
        for widget in self.preview_scroll.winfo_children():
            widget.destroy()
        
        nome_raiz = self.nome_levantamento.get().strip() or "Levantamento"
        
        # Raiz
        self._criar_linha_preview(
            parent=self.preview_scroll,
            texto=f"📁 {nome_raiz}",
            nivel=0,
            cor="#ffffff",
            acoes=False
        )
        
        for area in self.areas_selecionadas:
            # Área (Nível 1)
            self._criar_linha_preview(
                parent=self.preview_scroll,
                texto=f"{ICONES_NIVEL[1]} {area}",
                nivel=1,
                cor=CORES_NIVEL[1],
                lista_pai=self.areas_selecionadas,
                item_nome=area,
                on_add=lambda a=area: self._adicionar_filho_inline(nivel=1, pai_area=a),
                on_remove=lambda a=area: self._remover_do_preview(nivel=1, area=a)
            )
            
            # Vista ampla da área
            if self.vista_ampla_geral.get(area):
                self._criar_linha_preview(
                    parent=self.preview_scroll,
                    texto="📷 Vista ampla",
                    nivel=2,
                    cor="#94a3b8",
                    acoes=False
                )
            
            itens = self.itens_por_area.get(area, [])
            for idx_item, item in enumerate(itens, 1):
                eh_ambiente = item in AMBIENTES_SUGERIDOS or item in self.custom_ambientes
                
                # Item (Nível 2)
                self._criar_linha_preview(
                    parent=self.preview_scroll,
                    texto=f"{ICONES_NIVEL[2]} {idx_item} - {item}",
                    nivel=2,
                    cor=CORES_NIVEL[2],
                    lista_pai=itens,
                    item_nome=item,
                    on_add=lambda a=area, i=item: self._adicionar_filho_inline(nivel=2, pai_area=a, pai_item=i),
                    on_remove=lambda a=area, i=item: self._remover_do_preview(nivel=2, area=a, item=i)
                )
                
                key = (area, item)
                sub_selecionadas = self.subpastas_por_item.get(key, [])
                for idx_sub, sub in enumerate(sub_selecionadas, 1):
                    eh_servico = (sub in SERVICOS_SUGERIDOS) or (sub in self.custom_servicos)
                    
                    if eh_servico:
                        texto_sub = f"{ICONES_NIVEL[3]} {idx_item}.{idx_sub} - {sub}"
                    else:
                        texto_sub = f"{ICONES_NIVEL[3]} - {sub}"
                    
                    # Sub (Nível 3)
                    self._criar_linha_preview(
                        parent=self.preview_scroll,
                        texto=texto_sub,
                        nivel=3,
                        cor=CORES_NIVEL[3],
                        lista_pai=sub_selecionadas,
                        item_nome=sub,
                        on_add=lambda a=area, i=item, s=sub: self._adicionar_filho_inline(nivel=3, pai_area=a, pai_item=i, pai_sub=s),
                        on_remove=lambda a=area, i=item, s=sub: self._remover_do_preview(nivel=3, area=a, item=i, sub=s)
                    )
                    
                    # Nível 4
                    key_n4 = (area, item, sub)
                    detalhes = self.detalhes_por_subitem.get(key_n4, [])
                    for det in detalhes:
                        self._criar_linha_preview(
                            parent=self.preview_scroll,
                            texto=f"{ICONES_NIVEL[4]} - {det}",
                            nivel=4,
                            cor=CORES_NIVEL[4],
                            lista_pai=detalhes,
                            item_nome=det,
                            on_add=None,
                            on_remove=lambda a=area, i=item, s=sub, d=det: self._remover_do_preview(nivel=4, area=a, item=i, sub=s, detalhe=d)
                        )

    def _criar_linha_preview(self, parent, texto, nivel, cor, lista_pai=None, item_nome=None, on_add=None, on_remove=None, acoes=True):
        """Cria uma linha interativa no preview"""
        indent = nivel * 25
        
        row = ctk.CTkFrame(parent, fg_color="transparent", height=28)
        row.pack(fill="x", padx=(indent, 0), pady=1)
        
        # Barra lateral colorida
        if nivel > 0:
            barra = ctk.CTkFrame(row, width=3, fg_color=cor, height=22)
            barra.pack(side="left", padx=(0, 6))
        
        # Texto
        lbl = ctk.CTkLabel(
            row,
            text=texto,
            font=ctk.CTkFont(family="Consolas", size=12, weight="bold" if nivel <= 1 else "normal"),
            text_color=cor,
            anchor="w"
        )
        lbl.pack(side="left", fill="x", expand=True)
        
        if not acoes or lista_pai is None:
            return
        
        # Frame de botões de ação
        btn_frame = ctk.CTkFrame(row, fg_color="transparent")
        btn_frame.pack(side="right")
        
        # Botão Mover para Cima
        btn_up = ctk.CTkButton(
            btn_frame, text="⬆", width=24, height=22,
            font=ctk.CTkFont(size=11),
            fg_color="transparent", hover_color="#374151",
            command=lambda: self._mover_item(lista_pai, item_nome, -1)
        )
        btn_up.pack(side="left", padx=1)
        
        # Botão Mover para Baixo
        btn_down = ctk.CTkButton(
            btn_frame, text="⬇", width=24, height=22,
            font=ctk.CTkFont(size=11),
            fg_color="transparent", hover_color="#374151",
            command=lambda: self._mover_item(lista_pai, item_nome, 1)
        )
        btn_down.pack(side="left", padx=1)
        
        # Botão Adicionar Filho (+)
        if on_add:
            btn_add = ctk.CTkButton(
                btn_frame, text="➕", width=24, height=22,
                font=ctk.CTkFont(size=11),
                fg_color="transparent", hover_color="#1e3a5f",
                command=on_add
            )
            btn_add.pack(side="left", padx=1)
        
        # Botão Remover (❌)
        if on_remove:
            btn_del = ctk.CTkButton(
                btn_frame, text="❌", width=24, height=22,
                font=ctk.CTkFont(size=11),
                fg_color="transparent", hover_color="#5f1e1e",
                command=on_remove
            )
            btn_del.pack(side="left", padx=1)

    def _mover_item(self, lista, item, direcao):
        """Move um item na lista para cima (-1) ou baixo (+1)"""
        if item not in lista:
            return
        idx = lista.index(item)
        new_idx = idx + direcao
        if 0 <= new_idx < len(lista):
            lista[idx], lista[new_idx] = lista[new_idx], lista[idx]
            self._atualizar_preview()

    def _adicionar_filho_inline(self, nivel, pai_area=None, pai_item=None, pai_sub=None):
        """Adiciona um filho via dialog inline"""
        if nivel == 1:
            # Adicionar item (Ambiente/Serviço) na área
            nome = simpledialog.askstring("Novo Item", f"Nome do item em '{pai_area}':", parent=self)
            if not nome or not nome.strip():
                return
            nome = nome.strip()
            if pai_area not in self.itens_por_area:
                self.itens_por_area[pai_area] = []
            if nome not in self.itens_por_area[pai_area]:
                self.itens_por_area[pai_area].append(nome)
                # Registrar como custom
                if nome not in AMBIENTES_SUGERIDOS and nome not in SERVICOS_SUGERIDOS:
                    self.custom_ambientes.add(nome)
                    self._popular_nivel2(self.search_n2.get())
        
        elif nivel == 2:
            # Adicionar subpasta/serviço no item
            nome = simpledialog.askstring("Nova Subpasta", f"Nome da subpasta em '{pai_item}':", parent=self)
            if not nome or not nome.strip():
                return
            nome = nome.strip()
            key = (pai_area, pai_item)
            if key not in self.subpastas_por_item:
                self.subpastas_por_item[key] = []
            if nome not in self.subpastas_por_item[key]:
                self.subpastas_por_item[key].append(nome)
                if nome not in SUBPASTAS_SUGERIDAS and nome not in SERVICOS_SUGERIDOS:
                    self.custom_subpastas.add(nome)
                    self._popular_nivel3(self.search_n3.get())
        
        elif nivel == 3:
            # Adicionar detalhe no sub
            nome = simpledialog.askstring("Novo Detalhe", f"Nome do detalhe em '{pai_sub}':", parent=self)
            if not nome or not nome.strip():
                return
            nome = nome.strip()
            key = (pai_area, pai_item, pai_sub)
            if key not in self.detalhes_por_subitem:
                self.detalhes_por_subitem[key] = []
            if nome not in self.detalhes_por_subitem[key]:
                self.detalhes_por_subitem[key].append(nome)
                if nome not in SUBPASTAS_SUGERIDAS:
                    self.custom_detalhes.add(nome)
                    self._popular_nivel4(self.search_n4.get())
        
        self._atualizar_preview()

    def _remover_do_preview(self, nivel, area=None, item=None, sub=None, detalhe=None):
        """Remove um item diretamente pelo preview"""
        if nivel == 1:
            if area in self.areas_selecionadas:
                self.areas_selecionadas.remove(area)
                if area in self.itens_por_area:
                    del self.itens_por_area[area]
                # Limpar seleções dependentes
                keys_to_del = [k for k in self.subpastas_por_item if k[0] == area]
                for k in keys_to_del:
                    del self.subpastas_por_item[k]
                keys_to_del = [k for k in self.detalhes_por_subitem if k[0] == area]
                for k in keys_to_del:
                    del self.detalhes_por_subitem[k]
                self._popular_areas(self.search_areas.get())
        
        elif nivel == 2:
            lista = self.itens_por_area.get(area, [])
            if item in lista:
                lista.remove(item)
                # Limpar seleções dependentes
                key = (area, item)
                if key in self.subpastas_por_item:
                    del self.subpastas_por_item[key]
                keys_to_del = [k for k in self.detalhes_por_subitem if k[0] == area and k[1] == item]
                for k in keys_to_del:
                    del self.detalhes_por_subitem[k]
                self._popular_nivel2(self.search_n2.get())
        
        elif nivel == 3:
            key = (area, item)
            subs = self.subpastas_por_item.get(key, [])
            if sub in subs:
                subs.remove(sub)
                key_n4 = (area, item, sub)
                if key_n4 in self.detalhes_por_subitem:
                    del self.detalhes_por_subitem[key_n4]
                self._popular_nivel3(self.search_n3.get())
        
        elif nivel == 4:
            key = (area, item, sub)
            dets = self.detalhes_por_subitem.get(key, [])
            if detalhe in dets:
                dets.remove(detalhe)
                self._popular_nivel4(self.search_n4.get())
        
        self._atualizar_preview()

    # ============================
    # LÓGICA DE EVENTOS
    # ============================

    def _selecionar_pasta(self):
        pasta = filedialog.askdirectory()
        if pasta: self.pasta_destino.set(pasta)

    def _toggle_area(self, area):
        if area in self.areas_selecionadas:
            self.areas_selecionadas.remove(area)
            if area in self.itens_por_area: del self.itens_por_area[area]
        else:
            self.areas_selecionadas.append(area)
            self.itens_por_area[area] = []
            self.area_atual = area
            self._atualizar_ui_itens()
        self._atualizar_preview()

    def _toggle_va_area(self):
        if not self.area_atual: return
        self.vista_ampla_geral[self.area_atual] = self.cb_va_area.get()
        self._atualizar_preview()

    def _toggle_item(self, item):
        if self.updating_ui:
            return
        if not self.area_atual:
            messagebox.showwarning("Atenção", "Selecione uma área primeiro!")
            return
        
        lista = self.itens_por_area[self.area_atual]
        if item in lista:
            lista.remove(item)
        else:
            eh_servico = item in SERVICOS_SUGERIDOS or item in self.custom_servicos
            eh_area_interna = "interna" in self.area_atual.lower()
            
            if eh_area_interna and eh_servico:
                confirm = messagebox.askyesno(
                    "Atenção - Lógica de Pastas",
                    f"Você está adicionando '{item}' diretamente na raiz da '{self.area_atual}'.\n\n"
                    "Geralmente, em áreas internas, os serviços ficam dentro de um Ambiente (ex: SAA -> Pintura).\n\n"
                    "Deseja manter como item principal (Nível 2)?"
                )
                if not confirm:
                    self._atualizar_ui_itens()
                    return
            
            lista.append(item)
            self.item_atual = item
            self._atualizar_ui_sub()
        self._atualizar_preview()
        
        if self.area_atual:
             self._atualizar_ui_itens()

    def _toggle_sub(self, sub):
        if self.updating_ui:
            return
        if not self.area_atual or not self.item_atual:
            messagebox.showwarning("Atenção", "Selecione Área e Ambiente/Serviço!")
            return
        
        key = (self.area_atual, self.item_atual)
        if key not in self.subpastas_por_item: self.subpastas_por_item[key] = []
        
        if sub in self.subpastas_por_item[key]:
            self.subpastas_por_item[key].remove(sub)
        else:
            self.subpastas_por_item[key].append(sub)
            self.subitem_atual = sub
            self._atualizar_ui_nivel4()
            
        self._atualizar_preview()

    def _toggle_nivel4(self, detalhe):
        if self.updating_ui: return
        
        if not self.area_atual or not self.item_atual or not self.subitem_atual:
             messagebox.showwarning("Atenção", "Selecione um Serviço/Subpasta no Nível 3 para adicionar detalhes!")
             return
             
        key = (self.area_atual, self.item_atual, self.subitem_atual)
        if key not in self.detalhes_por_subitem: self.detalhes_por_subitem[key] = []
        
        lista = self.detalhes_por_subitem[key]
        if detalhe in lista:
            lista.remove(detalhe)
        else:
            lista.append(detalhe)
            
        self._atualizar_preview()

    def _atualizar_ui_itens(self):
        if not self.area_atual: return
        self.updating_ui = True
        try:
            self.label_area_temp.configure(text=f"→ {self.area_atual}")
            self.cb_va_area.deselect()
            if self.vista_ampla_geral.get(self.area_atual): self.cb_va_area.select()
            self._popular_nivel2(self.search_n2.get())
        finally:
            self.updating_ui = False

    def _atualizar_ui_sub(self):
        if not self.item_atual: return
        self.updating_ui = True
        try:
            self.label_item_temp.configure(text=f"→ {self.item_atual}")
            self._popular_nivel3(self.search_n3.get())
        finally:
            self.updating_ui = False

    def _atualizar_ui_nivel4(self):
        if not self.subitem_atual: return
        self.updating_ui = True
        try:
             self.label_subItem_temp.configure(text=f"→ {self.subitem_atual}")
             self._popular_nivel4(self.search_n4.get())
        finally:
             self.updating_ui = False

    def _adicionar_custom_nivel2(self):
        nome = self.entry_custom_n2.get().strip()
        if not nome: return
        
        aba_ativa = self.tab_itens.get()
        
        if aba_ativa == "Ambientes":
            if nome not in self.checkboxes_ambientes and nome not in AMBIENTES_SUGERIDOS:
                self.custom_ambientes.add(nome)
            self._popular_nivel2(self.search_n2.get())
            self._toggle_item(nome)
        else:
            if nome not in self.checkboxes_servicos and nome not in SERVICOS_SUGERIDOS:
                self.custom_servicos.add(nome)
            self._popular_nivel2(self.search_n2.get())
            self._toggle_item(nome)
            
        self.entry_custom_n2.delete(0, "end")

    def _adicionar_custom_nivel3(self):
        nome = self.entry_custom_n3.get().strip()
        if not nome: return
        
        aba_ativa = self.tab_sub.get()
        
        if aba_ativa == "Padrão":
            if nome not in SUBPASTAS_SUGERIDAS:
                self.custom_subpastas.add(nome)
        else:
            if nome not in SERVICOS_SUGERIDOS:
                self.custom_servicos.add(nome)
        
        self._popular_nivel3(self.search_n3.get())
        self._toggle_sub(nome)
        
        self.entry_custom_n3.delete(0, "end")

    def _gerar_estrutura(self):
        destino = self.pasta_destino.get()
        nome_raiz = self.nome_levantamento.get().strip()
        
        if not destino or not nome_raiz or not self.areas_selecionadas:
            messagebox.showwarning("Atenção", "Preencha todos os campos e selecione ao menos uma área!")
            return

        try:
            raiz = os.path.join(destino, nome_raiz)
            os.makedirs(raiz, exist_ok=True)
            count = 1
            
            for area in self.areas_selecionadas:
                path_area = os.path.join(raiz, f"- {area}")
                os.makedirs(path_area, exist_ok=True)
                count += 1
                
                if self.vista_ampla_geral.get(area):
                    os.makedirs(os.path.join(path_area, "- Vista ampla"), exist_ok=True)
                    count += 1
                
                itens = self.itens_por_area.get(area, [])
                for idx_item, item in enumerate(itens, 1):
                    nome_item = f"{idx_item} - {item}"
                    path_item = os.path.join(path_area, nome_item)
                    os.makedirs(path_item, exist_ok=True)
                    count += 1
                    
                    key = (area, item)
                    subs = self.subpastas_por_item.get(key, [])
                    for idx_sub, sub in enumerate(subs, 1):
                        eh_servico = (sub in SERVICOS_SUGERIDOS) or (sub in self.custom_servicos)
                        
                        if eh_servico:
                             nome_sub = f"{idx_item}.{idx_sub} - {sub}"
                        elif sub in SUBPASTAS_SUGERIDAS or sub in self.custom_subpastas:
                             nome_sub = f"- {sub}"
                        else:
                             nome_sub = f"- {sub}"
                        
                        path_sub = os.path.join(path_item, nome_sub)
                        os.makedirs(path_sub, exist_ok=True)
                        count += 1
                        
                        # NÍVEL 4
                        key_n4 = (area, item, sub)
                        detalhes = self.detalhes_por_subitem.get(key_n4, [])
                        for det in detalhes:
                             path_det = os.path.join(path_sub, f"- {det}")
                             os.makedirs(path_det, exist_ok=True)
                             count += 1

            messagebox.showinfo("Sucesso", f"Estrutura criada com sucesso!\n{count} pastas geradas.")
            self._atualizar_preview()
            
        except Exception as e:
            messagebox.showerror("Erro", f"Erro ao criar pastas: {str(e)}")

    def _limpar_selecao(self):
        confirm = messagebox.askyesno("Confirmar", "Deseja limpar todos os itens selecionados?")
        if not confirm: return
        
        # Resetar dados
        self.areas_selecionadas.clear()
        self.itens_por_area.clear()
        self.subpastas_por_item.clear()
        self.detalhes_por_subitem.clear()
        self.vista_ampla_geral.clear()
        
        self.area_atual = None
        self.item_atual = None
        self.subitem_atual = None
        
        # Resetar UI
        self._popular_areas()
        self._popular_nivel2()
        self._popular_nivel3()
        self._popular_nivel4()
        self.cb_va_area.deselect()
        
        # Limpar Labels
        self.label_area_temp.configure(text="")
        self.label_item_temp.configure(text="")
        self.label_subItem_temp.configure(text="")
        
        # Limpar buscas
        self.search_areas.delete(0, "end")
        self.search_n2.delete(0, "end")
        self.search_n3.delete(0, "end")
        self.search_n4.delete(0, "end")

        self._atualizar_preview()
        messagebox.showinfo("Limpeza", "Todas as seleções foram removidas.")


if __name__ == "__main__":
    app = GeradorEstruturaPastas()
    app.mainloop()
===
"""
Gerador de Estrutura de Pastas para Levantamentos Fotográficos
Aplicação desktop com interface gráfica moderna (CustomTkinter)

Princípios:
- Nada é criado automaticamente
- Tudo é selecionável
- A ordem de criação define a numeração
- O nome é livre
- A visualização é a verdade

───────────────────────────────────────────────────────────
Desenvolvido por: Thiago Nascimento Barbosa
Empresa: TM - Sempre Tecnologia
Data: Fevereiro 2026
───────────────────────────────────────────────────────────
"""

import os
import customtkinter as ctk
from tkinter import filedialog, messagebox, simpledialog
import json

# ============================
# CONFIGURAÇÃO DO TEMA
# ============================
ctk.set_appearance_mode("dark")
ctk.set_default_color_theme("blue")

# ============================
# DADOS PRÉ-DEFINIDOS (ATUALIZADOS)
# ============================
AREAS_SUGERIDAS = [
    "Área externa",
    "Área interna",
    "Segundo piso",
    "Primeiro piso",
    "Cobertura"
]

AMBIENTES_SUGERIDOS = [
    "SAA (sala de autoatendimento)",
    "Atendimento",
    "Corredor de acesso",
    "Banheiro feminino",
    "Banheiro masculino",
    "Banheiro PNE",
    "Copa",
    "Cozinha",
    "Suporte",
    "CAIEX",
    "Tesouraria",
    "Sala de reunião",
    "Sala do gerente",
    "Depósito",
    "Arquivo",
    "Corredor de abastecimento",
    "Escadas",
    "Área restrita"
]

SERVICOS_SUGERIDOS = [
    "Pintura acrílica",
    "Pintura automotiva",
    "Pintura esmalte em porta",
    "Pintura esmalte metal",
    "Piso tátil inox",
    "Piso tátil",
    "Substituição de lâmpadas",
    "Substituição de ducha higiênica",
    "Substituição de torneira",
    "Substituição de fechadura",
    "Substituição de puxador",
    "Substituição de película e policarbonato",
    "Telhado",
    "Impermeabilização de calha",
    "SPDA",
    "Forro de fibra mineral",
    "Forro de gesso",
    "Manutenção em ponto elétrico",
    "Manutenção em ponto lógico",
    "Ar condicionado",
    "Pictograma",
    "Letreiro",
    "Limpeza de fachada"
]

SUBPASTAS_SUGERIDAS = [
    "Vista ampla",
    "Detalhes",
    "Antes",
    "Depois",
    "Descrição"
]

# Cores por nível para o preview interativo
CORES_NIVEL = {
    1: "#3b82f6",   # Azul - Área
    2: "#10b981",   # Verde - Ambiente/Serviço
    3: "#f97316",   # Laranja - Subpasta/Serviço filho
    4: "#8b5cf6",   # Roxo - Detalhe
}

ICONES_NIVEL = {
    1: "🌎",
    2: "📍",
    3: "📂",
    4: "🔍",
}


class GeradorEstruturaPastas(ctk.CTk):
    def __init__(self):
        super().__init__()
        
        # Configuração da janela
        self.title("🏗️ Gerador de Estrutura de Pastas - TM")
        self.geometry("1400x900")
        self.minsize(1200, 750)
        
        # Estado da aplicação
        self.pasta_destino = ctk.StringVar(value="")
        self.nome_levantamento = ctk.StringVar(value="")
        
        self.areas_selecionadas = []
        self.itens_por_area = {}
        self.servicos_por_ambiente = {}
        self.subpastas_por_item = {}
        self.detalhes_por_subitem = {}
        self.vista_ampla_geral = {}
        
        # Rastreamento de itens personalizados
        self.custom_ambientes = set()
        self.custom_servicos = set()
        self.custom_subpastas = set()
        self.custom_detalhes = set()
        
        # Flag para evitar que atualizações de UI disparem eventos de toggle
        self.updating_ui = False
        
        # Seleções atuais para o fluxo de UI
        self.area_atual = None
        self.item_atual = None
        self.subitem_atual = None
        self.servico_atual = None
        
        # Construir interface
        self._criar_interface()
        
    def _criar_interface(self):
        """Monta toda a interface gráfica"""
        
        # ===== HEADER =====
        self.header = ctk.CTkFrame(self, height=80, fg_color="transparent")
        self.header.pack(fill="x", padx=20, pady=(20, 10))
        
        titulo = ctk.CTkLabel(
            self.header, 
            text="🏗️ Gerador de Estrutura de Pastas",
            font=ctk.CTkFont(size=28, weight="bold")
        )
        titulo.pack(side="left")
        
        assinatura = ctk.CTkLabel(
            self.header,
            text="TM - Sempre Tecnologia",
            font=ctk.CTkFont(size=11),
            text_color="#666"
        )
        assinatura.pack(side="right", padx=10)
        
        # ===== BARRA DE CONFIGURAÇÃO =====
        self.config_bar = ctk.CTkFrame(self, fg_color="transparent")
        self.config_bar.pack(fill="x", padx=20, pady=(0, 10))
        
        frame_nome = ctk.CTkFrame(self.config_bar, fg_color="transparent")
        frame_nome.pack(side="left")
        
        ctk.CTkLabel(frame_nome, text="📋 Levantamento:", font=ctk.CTkFont(size=13, weight="bold")).pack(side="left", padx=(0, 10))
        
        self.entry_nome_levantamento = ctk.CTkEntry(
            frame_nome,
            textvariable=self.nome_levantamento,
            width=350,
            placeholder_text="Ex: 01 - Arcos - Enviado"
        )
        self.entry_nome_levantamento.pack(side="left")
        self.entry_nome_levantamento.bind("<KeyRelease>", lambda e: self._atualizar_preview())
        
        frame_destino = ctk.CTkFrame(self.config_bar, fg_color="transparent")
        frame_destino.pack(side="right")
        
        self.entry_destino = ctk.CTkEntry(
            frame_destino, 
            textvariable=self.pasta_destino,
            width=300,
            placeholder_text="Pasta destino..."
        )
        self.entry_destino.pack(side="left", padx=(0, 10))
        
        ctk.CTkButton(
            frame_destino, 
            text="📁 Selecionar",
            width=100,
            command=self._selecionar_pasta
        ).pack(side="left")
        
        # ===== ÁREA PRINCIPAL =====
        self.main_area = ctk.CTkFrame(self, fg_color="transparent")
        self.main_area.pack(fill="both", expand=True, padx=20, pady=10)
        
        # Painel esquerdo (seleções)
        self.painel_esquerdo = ctk.CTkScrollableFrame(self.main_area, width=550)
        self.painel_esquerdo.pack(side="left", fill="both", padx=(0, 10))
        
        # Painel direito (preview interativo)
        self.painel_direito = ctk.CTkFrame(self.main_area)
        self.painel_direito.pack(side="right", fill="both", expand=True)
        
        # ===== COLUNAS DE SELEÇÃO =====
        self._criar_painel_areas()
        self._criar_painel_ambientes_servicos()
        self._criar_painel_subpastas()
        self._criar_painel_detalhes_nivel4()
        
        # ===== PREVIEW INTERATIVO =====
        self._criar_painel_preview()
        
        # ===== FOOTER =====
        self.footer = ctk.CTkFrame(self, height=60, fg_color="transparent")
        self.footer.pack(fill="x", padx=20, pady=(10, 20))
        
        self.btn_gerar = ctk.CTkButton(
            self.footer,
            text="🔨 GERAR ESTRUTURA DE PASTAS",
            font=ctk.CTkFont(size=16, weight="bold"),
            height=50,
            fg_color="#00875a",
            hover_color="#006644",
            command=self._gerar_estrutura
        )
        self.btn_gerar.pack(side="left", fill="x", expand=True, padx=(0, 10))
        
        self.btn_limpar = ctk.CTkButton(
            self.footer,
            text="🧹 LIMPAR SELEÇÃO",
            font=ctk.CTkFont(size=14, weight="bold"),
            height=50,
            fg_color="#991b1b",
            hover_color="#7f1d1d",
            command=self._limpar_selecao
        )
        self.btn_limpar.pack(side="right", fill="x", expand=True)

    # ============================
    # PAINÉIS DE SELEÇÃO (ESQUERDA)
    # ============================
        
    def _criar_painel_areas(self):
        """Cria o painel de seleção de Áreas (Nível 1)"""
        frame = ctk.CTkFrame(self.painel_esquerdo)
        frame.pack(fill="x", padx=5, pady=5)
        
        ctk.CTkLabel(frame, text="🌎 1. SELECIONE A ÁREA", font=ctk.CTkFont(size=14, weight="bold")).pack(padx=10, pady=(10, 5), anchor="w")
        
        # Barra de pesquisa
        self.search_areas = ctk.CTkEntry(frame, placeholder_text="🔍 Filtrar áreas...", height=30)
        self.search_areas.pack(fill="x", padx=10, pady=(0, 5))
        self.search_areas.bind("<KeyRelease>", lambda e: self._filtrar_areas())
        
        self.frame_areas_list = ctk.CTkFrame(frame, fg_color="transparent", height=100)
        self.frame_areas_list.pack(fill="x", padx=10, pady=5)
        
        self.checkboxes_areas = {}
        self._popular_areas()

    def _popular_areas(self, filtro=""):
        """Popula a lista de áreas com filtro"""
        for widget in self.frame_areas_list.winfo_children():
            widget.destroy()
        self.checkboxes_areas.clear()
        
        todas = list(AREAS_SUGERIDAS) + sorted(self.custom_ambientes - set(AMBIENTES_SUGERIDOS))
        # Áreas customizadas são apenas as que foram adicionadas como área
        # Na verdade, as áreas custom não existem atualmente. Mantemos a lógica simples.
        todas = list(AREAS_SUGERIDAS)
        
        filtro_lower = filtro.lower().strip()
        visiveis = [a for a in todas if not filtro_lower or filtro_lower in a.lower()]
        
        for i, area in enumerate(visiveis):
            cb = ctk.CTkCheckBox(
                self.frame_areas_list,
                text=area,
                command=lambda a=area: self._toggle_area(a)
            )
            cb.grid(row=i//2, column=i%2, sticky="w", padx=5, pady=2)
            if area in self.areas_selecionadas:
                cb.select()
            self.checkboxes_areas[area] = cb

    def _filtrar_areas(self):
        filtro = self.search_areas.get()
        self._popular_areas(filtro)

    def _criar_painel_ambientes_servicos(self):
        """Cria o painel de Ambientes ou Serviços dentro da Área (Nível 2)"""
        self.frame_itens_container = ctk.CTkFrame(self.painel_esquerdo)
        self.frame_itens_container.pack(fill="x", padx=5, pady=5)
        
        header = ctk.CTkFrame(self.frame_itens_container, fg_color="transparent")
        header.pack(fill="x", padx=10, pady=(10, 5))
        
        ctk.CTkLabel(header, text="📍 2. AMBIENTES / SERVIÇOS", font=ctk.CTkFont(size=14, weight="bold")).pack(side="left")
        
        self.label_area_temp = ctk.CTkLabel(header, text="", font=ctk.CTkFont(size=11), text_color="#00d4ff")
        self.label_area_temp.pack(side="right")

        # Vista ampla da ÁREA
        self.cb_va_area = ctk.CTkCheckBox(
            self.frame_itens_container,
            text="📷 Incluir 'Vista ampla' nesta ÁREA",
            command=self._toggle_va_area,
            fg_color="#00875a"
        )
        self.cb_va_area.pack(anchor="w", padx=15, pady=5)

        # Barra de pesquisa Nível 2
        self.search_n2 = ctk.CTkEntry(self.frame_itens_container, placeholder_text="🔍 Filtrar ambientes/serviços...", height=30)
        self.search_n2.pack(fill="x", padx=10, pady=(0, 5))
        self.search_n2.bind("<KeyRelease>", lambda e: self._filtrar_nivel2())

        # Tabs para organizar Ambientes vs Serviços Sugeridos
        self.tab_itens = ctk.CTkTabview(self.frame_itens_container, height=250)
        self.tab_itens.pack(fill="x", padx=10, pady=5)
        
        self.tab_itens.add("Ambientes")
        self.tab_itens.add("Serviços")
        
        # Área de adição personalizada Nível 2
        frame_custom = ctk.CTkFrame(self.frame_itens_container, fg_color="transparent")
        frame_custom.pack(fill="x", padx=10, pady=5)
        
        self.entry_custom_n2 = ctk.CTkEntry(frame_custom, placeholder_text="Novo item...", width=150)
        self.entry_custom_n2.pack(side="left", fill="x", expand=True, padx=(0, 5))
        self.entry_custom_n2.bind("<Return>", lambda e: self._adicionar_custom_nivel2())
        
        ctk.CTkButton(
            frame_custom, text="+", width=30, 
            command=self._adicionar_custom_nivel2
        ).pack(side="left")

        # Listas
        self.checkboxes_ambientes = {}
        self.scroll_amb = ctk.CTkScrollableFrame(self.tab_itens.tab("Ambientes"), height=200)
        self.scroll_amb.pack(fill="both", expand=True)

        self.checkboxes_servicos = {}
        self.scroll_srv_n2 = ctk.CTkScrollableFrame(self.tab_itens.tab("Serviços"), height=200)
        self.scroll_srv_n2.pack(fill="both", expand=True)
        
        self._popular_nivel2()

    def _popular_nivel2(self, filtro=""):
        """Popula as listas de Ambientes e Serviços com filtro"""
        # Limpar
        for widget in self.scroll_amb.winfo_children():
            widget.destroy()
        for widget in self.scroll_srv_n2.winfo_children():
            widget.destroy()
        self.checkboxes_ambientes.clear()
        self.checkboxes_servicos.clear()
        
        filtro_lower = filtro.lower().strip()
        selecionados = self.itens_por_area.get(self.area_atual, []) if self.area_atual else []
        
        # Ambientes
        todos_amb = list(AMBIENTES_SUGERIDOS) + sorted(self.custom_ambientes)
        for amb in todos_amb:
            if filtro_lower and filtro_lower not in amb.lower():
                continue
            cb = ctk.CTkCheckBox(self.scroll_amb, text=amb, command=lambda a=amb: self._toggle_item(a))
            cb.pack(anchor="w", pady=2)
            if amb in selecionados:
                cb.select()
            self.checkboxes_ambientes[amb] = cb
        
        # Serviços
        todos_srv = list(SERVICOS_SUGERIDOS) + sorted(self.custom_servicos - set(SERVICOS_SUGERIDOS))
        for srv in todos_srv:
            if filtro_lower and filtro_lower not in srv.lower():
                continue
            cb = ctk.CTkCheckBox(self.scroll_srv_n2, text=srv, command=lambda s=srv: self._toggle_item(s))
            cb.pack(anchor="w", pady=2)
            if srv in selecionados:
                cb.select()
            self.checkboxes_servicos[srv] = cb

    def _filtrar_nivel2(self):
        filtro = self.search_n2.get()
        self._popular_nivel2(filtro)

    def _criar_painel_subpastas(self):
        """Cria o painel de Subpastas (Nível 3)"""
        self.frame_sub_container = ctk.CTkFrame(self.painel_esquerdo)
        self.frame_sub_container.pack(fill="x", padx=5, pady=5)
        
        header = ctk.CTkFrame(self.frame_sub_container, fg_color="transparent")
        header.pack(fill="x", padx=10, pady=(10, 5))
        
        ctk.CTkLabel(header, text="📂 3. SERVIÇOS / SUBPASTAS (NÍVEL 3)", font=ctk.CTkFont(size=14, weight="bold")).pack(side="left")
        self.label_item_temp = ctk.CTkLabel(header, text="", font=ctk.CTkFont(size=11), text_color="#00d4ff")
        self.label_item_temp.pack(side="right")

        # Barra de pesquisa Nível 3
        self.search_n3 = ctk.CTkEntry(self.frame_sub_container, placeholder_text="🔍 Filtrar subpastas/serviços...", height=30)
        self.search_n3.pack(fill="x", padx=10, pady=(0, 5))
        self.search_n3.bind("<KeyRelease>", lambda e: self._filtrar_nivel3())

        # Tabs para Subpastas Padrão vs Serviços (Filhos)
        self.tab_sub = ctk.CTkTabview(self.frame_sub_container, height=250)
        self.tab_sub.pack(fill="x", padx=10, pady=5)
        
        self.tab_sub.add("Padrão")
        self.tab_sub.add("Serviços")

        # Área de adição personalizada Nível 3
        frame_custom = ctk.CTkFrame(self.frame_sub_container, fg_color="transparent")
        frame_custom.pack(fill="x", padx=10, pady=5)
        
        self.entry_custom_n3 = ctk.CTkEntry(frame_custom, placeholder_text="Novo item...", width=150)
        self.entry_custom_n3.pack(side="left", fill="x", expand=True, padx=(0, 5))
        self.entry_custom_n3.bind("<Return>", lambda e: self._adicionar_custom_nivel3())
        
        ctk.CTkButton(
            frame_custom, text="+", width=30, 
            command=self._adicionar_custom_nivel3
        ).pack(side="left")

        # Listas
        self.checkboxes_sub = {}
        self.scroll_sub_padrao = ctk.CTkScrollableFrame(self.tab_sub.tab("Padrão"), height=200)
        self.scroll_sub_padrao.pack(fill="both", expand=True)
        
        self.scroll_sub_servicos = ctk.CTkScrollableFrame(self.tab_sub.tab("Serviços"), height=200)
        self.scroll_sub_servicos.pack(fill="both", expand=True)
        
        self._popular_nivel3()

    def _popular_nivel3(self, filtro=""):
        """Popula as listas de Subpastas e Serviços (filhos) com filtro"""
        for widget in self.scroll_sub_padrao.winfo_children():
            widget.destroy()
        for widget in self.scroll_sub_servicos.winfo_children():
            widget.destroy()
        self.checkboxes_sub.clear()
        
        filtro_lower = filtro.lower().strip()
        
        key = (self.area_atual, self.item_atual) if self.area_atual and self.item_atual else None
        selecionados = self.subpastas_por_item.get(key, []) if key else []
        
        # Padrão
        todos_padrao = list(SUBPASTAS_SUGERIDAS) + sorted(self.custom_subpastas)
        for sub in todos_padrao:
            if filtro_lower and filtro_lower not in sub.lower():
                continue
            cb = ctk.CTkCheckBox(self.scroll_sub_padrao, text=sub, command=lambda s=sub: self._toggle_sub(s))
            cb.pack(anchor="w", pady=2)
            if sub in selecionados:
                cb.select()
            self.checkboxes_sub[sub] = cb
        
        # Serviços
        todos_srv = list(SERVICOS_SUGERIDOS) + sorted(self.custom_servicos - set(SERVICOS_SUGERIDOS))
        for srv in todos_srv:
            if filtro_lower and filtro_lower not in srv.lower():
                continue
            # Evitar duplicata de chave no dict
            key_name = srv
            cb = ctk.CTkCheckBox(self.scroll_sub_servicos, text=srv, command=lambda s=srv: self._toggle_sub(s))
            cb.pack(anchor="w", pady=2)
            if srv in selecionados:
                cb.select()
            if key_name not in self.checkboxes_sub:
                self.checkboxes_sub[key_name] = cb

    def _filtrar_nivel3(self):
        filtro = self.search_n3.get()
        self._popular_nivel3(filtro)

    def _criar_painel_detalhes_nivel4(self):
        """Cria o painel de Detalhes (Nível 4)"""
        self.frame_detalhes_container = ctk.CTkFrame(self.painel_esquerdo)
        self.frame_detalhes_container.pack(fill="x", padx=5, pady=5)
        
        header = ctk.CTkFrame(self.frame_detalhes_container, fg_color="transparent")
        header.pack(fill="x", padx=10, pady=(10, 5))
        
        ctk.CTkLabel(header, text="🔍 4. DETALHES (NÍVEL 4)", font=ctk.CTkFont(size=14, weight="bold")).pack(side="left")
        self.label_subItem_temp = ctk.CTkLabel(header, text="", font=ctk.CTkFont(size=11), text_color="#00d4ff")
        self.label_subItem_temp.pack(side="right")
        
        # Barra de pesquisa Nível 4
        self.search_n4 = ctk.CTkEntry(self.frame_detalhes_container, placeholder_text="🔍 Filtrar detalhes...", height=30)
        self.search_n4.pack(fill="x", padx=10, pady=(0, 5))
        self.search_n4.bind("<KeyRelease>", lambda e: self._filtrar_nivel4())
        
        # Lista Única (Detalhes)
        self.checkboxes_detalhes = {}
        self.scroll_detalhes = ctk.CTkScrollableFrame(self.frame_detalhes_container, height=150)
        self.scroll_detalhes.pack(fill="both", expand=True, padx=10, pady=5)
        
        self._popular_nivel4()

    def _popular_nivel4(self, filtro=""):
        """Popula a lista de Detalhes com filtro"""
        for widget in self.scroll_detalhes.winfo_children():
            widget.destroy()
        self.checkboxes_detalhes.clear()
        
        filtro_lower = filtro.lower().strip()
        
        key = (self.area_atual, self.item_atual, self.subitem_atual) if self.area_atual and self.item_atual and self.subitem_atual else None
        selecionados = self.detalhes_por_subitem.get(key, []) if key else []
        
        todos = list(SUBPASTAS_SUGERIDAS) + sorted(self.custom_detalhes)
        for det in todos:
            if filtro_lower and filtro_lower not in det.lower():
                continue
            cb = ctk.CTkCheckBox(self.scroll_detalhes, text=det, command=lambda d=det: self._toggle_nivel4(d))
            cb.pack(anchor="w", pady=2)
            if det in selecionados:
                cb.select()
            self.checkboxes_detalhes[det] = cb

    def _filtrar_nivel4(self):
        filtro = self.search_n4.get()
        self._popular_nivel4(filtro)

    # ============================
    # PREVIEW INTERATIVO (DIREITA)
    # ============================

    def _criar_painel_preview(self):
        """Cria o painel de preview interativo da estrutura"""
        header = ctk.CTkFrame(self.painel_direito, fg_color="transparent")
        header.pack(fill="x", padx=15, pady=(15, 5))
        
        ctk.CTkLabel(header, text="👁️ PREVIEW INTERATIVO", font=ctk.CTkFont(size=14, weight="bold")).pack(side="left")
        
        # Legenda de cores
        legenda_frame = ctk.CTkFrame(header, fg_color="transparent")
        legenda_frame.pack(side="right")
        for nivel, icone in ICONES_NIVEL.items():
            cor = CORES_NIVEL[nivel]
            lbl = ctk.CTkLabel(legenda_frame, text=f"{icone} N{nivel}", font=ctk.CTkFont(size=10), text_color=cor)
            lbl.pack(side="left", padx=4)
        
        self.preview_scroll = ctk.CTkScrollableFrame(
            self.painel_direito,
            fg_color="#1a1a2e"
        )
        self.preview_scroll.pack(fill="both", expand=True, padx=15, pady=(5, 15))

    def _atualizar_preview(self):
        """Redesenha o preview interativo completo"""
        # Limpar preview
        for widget in self.preview_scroll.winfo_children():
            widget.destroy()
        
        nome_raiz = self.nome_levantamento.get().strip() or "Levantamento"
        
        # Raiz
        self._criar_linha_preview(
            parent=self.preview_scroll,
            texto=f"📁 {nome_raiz}",
            nivel=0,
            cor="#ffffff",
            acoes=False
        )
        
        for area in self.areas_selecionadas:
            # Área (Nível 1)
            self._criar_linha_preview(
                parent=self.preview_scroll,
                texto=f"{ICONES_NIVEL[1]} {area}",
                nivel=1,
                cor=CORES_NIVEL[1],
                lista_pai=self.areas_selecionadas,
                item_nome=area,
                on_add=lambda a=area: self._adicionar_filho_inline(nivel=1, pai_area=a),
                on_remove=lambda a=area: self._remover_do_preview(nivel=1, area=a)
            )
            
            # Vista ampla da área
            if self.vista_ampla_geral.get(area):
                self._criar_linha_preview(
                    parent=self.preview_scroll,
                    texto="📷 Vista ampla",
                    nivel=2,
                    cor="#94a3b8",
                    acoes=False
                )
            
            itens = self.itens_por_area.get(area, [])
            for idx_item, item in enumerate(itens, 1):
                eh_ambiente = item in AMBIENTES_SUGERIDOS or item in self.custom_ambientes
                
                # Item (Nível 2)
                self._criar_linha_preview(
                    parent=self.preview_scroll,
                    texto=f"{ICONES_NIVEL[2]} {idx_item} - {item}",
                    nivel=2,
                    cor=CORES_NIVEL[2],
                    lista_pai=itens,
                    item_nome=item,
                    on_add=lambda a=area, i=item: self._adicionar_filho_inline(nivel=2, pai_area=a, pai_item=i),
                    on_remove=lambda a=area, i=item: self._remover_do_preview(nivel=2, area=a, item=i)
                )
                
                key = (area, item)
                sub_selecionadas = self.subpastas_por_item.get(key, [])
                service_counter = 0
                for sub in sub_selecionadas:
                    eh_servico = (sub in SERVICOS_SUGERIDOS) or (sub in self.custom_servicos)
                    
                    if sub.lower() == "vista ampla":
                        texto_sub = f"{ICONES_NIVEL[3]} - {sub}"
                    elif eh_servico:
                        service_counter += 1
                        texto_sub = f"{ICONES_NIVEL[3]} {idx_item}.{service_counter} - {sub}"
                    else:
                        texto_sub = f"{ICONES_NIVEL[3]} - {sub}"
                    
                    # Sub (Nível 3)
                    self._criar_linha_preview(
                        parent=self.preview_scroll,
                        texto=texto_sub,
                        nivel=3,
                        cor=CORES_NIVEL[3],
                        lista_pai=sub_selecionadas,
                        item_nome=sub,
                        on_add=lambda a=area, i=item, s=sub: self._adicionar_filho_inline(nivel=3, pai_area=a, pai_item=i, pai_sub=s),
                        on_remove=lambda a=area, i=item, s=sub: self._remover_do_preview(nivel=3, area=a, item=i, sub=s)
                    )
                    
                    # Nível 4
                    key_n4 = (area, item, sub)
                    detalhes = self.detalhes_por_subitem.get(key_n4, [])
                    for det in detalhes:
                        self._criar_linha_preview(
                            parent=self.preview_scroll,
                            texto=f"{ICONES_NIVEL[4]} - {det}",
                            nivel=4,
                            cor=CORES_NIVEL[4],
                            lista_pai=detalhes,
                            item_nome=det,
                            on_add=None,
                            on_remove=lambda a=area, i=item, s=sub, d=det: self._remover_do_preview(nivel=4, area=a, item=i, sub=s, detalhe=d)
                        )

    def _criar_linha_preview(self, parent, texto, nivel, cor, lista_pai=None, item_nome=None, on_add=None, on_remove=None, acoes=True):
        """Cria uma linha interativa no preview"""
        indent = nivel * 25
        
        row = ctk.CTkFrame(parent, fg_color="transparent", height=28)
        row.pack(fill="x", padx=(indent, 0), pady=1)
        
        # Barra lateral colorida
        if nivel > 0:
            barra = ctk.CTkFrame(row, width=3, fg_color=cor, height=22)
            barra.pack(side="left", padx=(0, 6))
        
        # Texto
        lbl = ctk.CTkLabel(
            row,
            text=texto,
            font=ctk.CTkFont(family="Consolas", size=12, weight="bold" if nivel <= 1 else "normal"),
            text_color=cor,
            anchor="w"
        )
        lbl.pack(side="left", fill="x", expand=True)
        
        if not acoes or lista_pai is None:
            return
        
        # Frame de botões de ação
        btn_frame = ctk.CTkFrame(row, fg_color="transparent")
        btn_frame.pack(side="right")
        
        # Botão Mover para Cima
        btn_up = ctk.CTkButton(
            btn_frame, text="⬆", width=24, height=22,
            font=ctk.CTkFont(size=11),
            fg_color="transparent", hover_color="#374151",
            command=lambda: self._mover_item(lista_pai, item_nome, -1)
        )
        btn_up.pack(side="left", padx=1)
        
        # Botão Mover para Baixo
        btn_down = ctk.CTkButton(
            btn_frame, text="⬇", width=24, height=22,
            font=ctk.CTkFont(size=11),
            fg_color="transparent", hover_color="#374151",
            command=lambda: self._mover_item(lista_pai, item_nome, 1)
        )
        btn_down.pack(side="left", padx=1)
        
        # Botão Adicionar Filho (+)
        if on_add:
            btn_add = ctk.CTkButton(
                btn_frame, text="➕", width=24, height=22,
                font=ctk.CTkFont(size=11),
                fg_color="transparent", hover_color="#1e3a5f",
                command=on_add
            )
            btn_add.pack(side="left", padx=1)
        
        # Botão Remover (❌)
        if on_remove:
            btn_del = ctk.CTkButton(
                btn_frame, text="❌", width=24, height=22,
                font=ctk.CTkFont(size=11),
                fg_color="transparent", hover_color="#5f1e1e",
                command=on_remove
            )
            btn_del.pack(side="left", padx=1)

    def _mover_item(self, lista, item, direcao):
        """Move um item na lista para cima (-1) ou baixo (+1)"""
        if item not in lista:
            return
        idx = lista.index(item)
        new_idx = idx + direcao
        if 0 <= new_idx < len(lista):
            lista[idx], lista[new_idx] = lista[new_idx], lista[idx]
            self._atualizar_preview()

    def _adicionar_filho_inline(self, nivel, pai_area=None, pai_item=None, pai_sub=None):
        """Adiciona um filho via dialog inline"""
        if nivel == 1:
            # Adicionar item (Ambiente/Serviço) na área
            nome = simpledialog.askstring("Novo Item", f"Nome do item em '{pai_area}':", parent=self)
            if not nome or not nome.strip():
                return
            nome = nome.strip()
            if pai_area not in self.itens_por_area:
                self.itens_por_area[pai_area] = []
            if nome not in self.itens_por_area[pai_area]:
                self.itens_por_area[pai_area].append(nome)
                # Registrar como custom
                if nome not in AMBIENTES_SUGERIDOS and nome not in SERVICOS_SUGERIDOS:
                    self.custom_ambientes.add(nome)
                    self._popular_nivel2(self.search_n2.get())
        
        elif nivel == 2:
            # Adicionar subpasta/serviço no item
            nome = simpledialog.askstring("Nova Subpasta", f"Nome da subpasta em '{pai_item}':", parent=self)
            if not nome or not nome.strip():
                return
            nome = nome.strip()
            key = (pai_area, pai_item)
            if key not in self.subpastas_por_item:
                self.subpastas_por_item[key] = []
            if nome not in self.subpastas_por_item[key]:
                self.subpastas_por_item[key].append(nome)
                if nome not in SUBPASTAS_SUGERIDAS and nome not in SERVICOS_SUGERIDOS:
                    self.custom_subpastas.add(nome)
                    self._popular_nivel3(self.search_n3.get())
        
        elif nivel == 3:
            # Adicionar detalhe no sub
            nome = simpledialog.askstring("Novo Detalhe", f"Nome do detalhe em '{pai_sub}':", parent=self)
            if not nome or not nome.strip():
                return
            nome = nome.strip()
            key = (pai_area, pai_item, pai_sub)
            if key not in self.detalhes_por_subitem:
                self.detalhes_por_subitem[key] = []
            if nome not in self.detalhes_por_subitem[key]:
                self.detalhes_por_subitem[key].append(nome)
                if nome not in SUBPASTAS_SUGERIDAS:
                    self.custom_detalhes.add(nome)
                    self._popular_nivel4(self.search_n4.get())
        
        self._atualizar_preview()

    def _remover_do_preview(self, nivel, area=None, item=None, sub=None, detalhe=None):
        """Remove um item diretamente pelo preview"""
        if nivel == 1:
            if area in self.areas_selecionadas:
                self.areas_selecionadas.remove(area)
                if area in self.itens_por_area:
                    del self.itens_por_area[area]
                # Limpar seleções dependentes
                keys_to_del = [k for k in self.subpastas_por_item if k[0] == area]
                for k in keys_to_del:
                    del self.subpastas_por_item[k]
                keys_to_del = [k for k in self.detalhes_por_subitem if k[0] == area]
                for k in keys_to_del:
                    del self.detalhes_por_subitem[k]
                self._popular_areas(self.search_areas.get())
        
        elif nivel == 2:
            lista = self.itens_por_area.get(area, [])
            if item in lista:
                lista.remove(item)
                # Limpar seleções dependentes
                key = (area, item)
                if key in self.subpastas_por_item:
                    del self.subpastas_por_item[key]
                keys_to_del = [k for k in self.detalhes_por_subitem if k[0] == area and k[1] == item]
                for k in keys_to_del:
                    del self.detalhes_por_subitem[k]
                self._popular_nivel2(self.search_n2.get())
        
        elif nivel == 3:
            key = (area, item)
            subs = self.subpastas_por_item.get(key, [])
            if sub in subs:
                subs.remove(sub)
                key_n4 = (area, item, sub)
                if key_n4 in self.detalhes_por_subitem:
                    del self.detalhes_por_subitem[key_n4]
                self._popular_nivel3(self.search_n3.get())
        
        elif nivel == 4:
            key = (area, item, sub)
            dets = self.detalhes_por_subitem.get(key, [])
            if detalhe in dets:
                dets.remove(detalhe)
                self._popular_nivel4(self.search_n4.get())
        
        self._atualizar_preview()

    # ============================
    # LÓGICA DE EVENTOS
    # ============================

    def _selecionar_pasta(self):
        pasta = filedialog.askdirectory()
        if pasta: self.pasta_destino.set(pasta)

    def _toggle_area(self, area):
        if area in self.areas_selecionadas:
            self.areas_selecionadas.remove(area)
            if area in self.itens_por_area: del self.itens_por_area[area]
        else:
            self.areas_selecionadas.append(area)
            self.itens_por_area[area] = []
            self.area_atual = area
            self._atualizar_ui_itens()
        self._atualizar_preview()

    def _toggle_va_area(self):
        if not self.area_atual: return
        self.vista_ampla_geral[self.area_atual] = self.cb_va_area.get()
        self._atualizar_preview()

    def _toggle_item(self, item):
        if self.updating_ui:
            return
        if not self.area_atual:
            messagebox.showwarning("Atenção", "Selecione uma área primeiro!")
            return
        
        lista = self.itens_por_area[self.area_atual]
        if item in lista:
            lista.remove(item)
        else:
            eh_servico = item in SERVICOS_SUGERIDOS or item in self.custom_servicos
            eh_area_interna = "interna" in self.area_atual.lower()
            
            if eh_area_interna and eh_servico:
                confirm = messagebox.askyesno(
                    "Atenção - Lógica de Pastas",
                    f"Você está adicionando '{item}' diretamente na raiz da '{self.area_atual}'.\n\n"
                    "Geralmente, em áreas internas, os serviços ficam dentro de um Ambiente (ex: SAA -> Pintura).\n\n"
                    "Deseja manter como item principal (Nível 2)?"
                )
                if not confirm:
                    self._atualizar_ui_itens()
                    return
            
            lista.append(item)
            self.item_atual = item
            self._atualizar_ui_sub()
        self._atualizar_preview()
        
        if self.area_atual:
             self._atualizar_ui_itens()

    def _toggle_sub(self, sub):
        if self.updating_ui:
            return
        if not self.area_atual or not self.item_atual:
            messagebox.showwarning("Atenção", "Selecione Área e Ambiente/Serviço!")
            return
        
        key = (self.area_atual, self.item_atual)
        if key not in self.subpastas_por_item: self.subpastas_por_item[key] = []
        
        if sub in self.subpastas_por_item[key]:
            self.subpastas_por_item[key].remove(sub)
        else:
            self.subpastas_por_item[key].append(sub)
            self.subitem_atual = sub
            self._atualizar_ui_nivel4()
            
        self._atualizar_preview()

    def _toggle_nivel4(self, detalhe):
        if self.updating_ui: return
        
        if not self.area_atual or not self.item_atual or not self.subitem_atual:
             messagebox.showwarning("Atenção", "Selecione um Serviço/Subpasta no Nível 3 para adicionar detalhes!")
             return
             
        key = (self.area_atual, self.item_atual, self.subitem_atual)
        if key not in self.detalhes_por_subitem: self.detalhes_por_subitem[key] = []
        
        lista = self.detalhes_por_subitem[key]
        if detalhe in lista:
            lista.remove(detalhe)
        else:
            lista.append(detalhe)
            
        self._atualizar_preview()

    def _atualizar_ui_itens(self):
        if not self.area_atual: return
        self.updating_ui = True
        try:
            self.label_area_temp.configure(text=f"→ {self.area_atual}")
            self.cb_va_area.deselect()
            if self.vista_ampla_geral.get(self.area_atual): self.cb_va_area.select()
            self._popular_nivel2(self.search_n2.get())
        finally:
            self.updating_ui = False

    def _atualizar_ui_sub(self):
        if not self.item_atual: return
        self.updating_ui = True
        try:
            self.label_item_temp.configure(text=f"→ {self.item_atual}")
            self._popular_nivel3(self.search_n3.get())
        finally:
            self.updating_ui = False

    def _atualizar_ui_nivel4(self):
        if not self.subitem_atual: return
        self.updating_ui = True
        try:
             self.label_subItem_temp.configure(text=f"→ {self.subitem_atual}")
             self._popular_nivel4(self.search_n4.get())
        finally:
             self.updating_ui = False

    def _adicionar_custom_nivel2(self):
        nome = self.entry_custom_n2.get().strip()
        if not nome: return
        
        aba_ativa = self.tab_itens.get()
        
        if aba_ativa == "Ambientes":
            if nome not in self.checkboxes_ambientes and nome not in AMBIENTES_SUGERIDOS:
                self.custom_ambientes.add(nome)
            self._popular_nivel2(self.search_n2.get())
            self._toggle_item(nome)
        else:
            if nome not in self.checkboxes_servicos and nome not in SERVICOS_SUGERIDOS:
                self.custom_servicos.add(nome)
            self._popular_nivel2(self.search_n2.get())
            self._toggle_item(nome)
            
        self.entry_custom_n2.delete(0, "end")

    def _adicionar_custom_nivel3(self):
        nome = self.entry_custom_n3.get().strip()
        if not nome: return
        
        aba_ativa = self.tab_sub.get()
        
        if aba_ativa == "Padrão":
            if nome not in SUBPASTAS_SUGERIDAS:
                self.custom_subpastas.add(nome)
        else:
            if nome not in SERVICOS_SUGERIDOS:
                self.custom_servicos.add(nome)
        
        self._popular_nivel3(self.search_n3.get())
        self._toggle_sub(nome)
        
        self.entry_custom_n3.delete(0, "end")

    def _gerar_estrutura(self):
        destino = self.pasta_destino.get()
        nome_raiz = self.nome_levantamento.get().strip()
        
        if not destino or not nome_raiz or not self.areas_selecionadas:
            messagebox.showwarning("Atenção", "Preencha todos os campos e selecione ao menos uma área!")
            return

        try:
            raiz = os.path.join(destino, nome_raiz)
            os.makedirs(raiz, exist_ok=True)
            count = 1
            
            for area in self.areas_selecionadas:
                path_area = os.path.join(raiz, f"- {area}")
                os.makedirs(path_area, exist_ok=True)
                count += 1
                
                if self.vista_ampla_geral.get(area):
                    os.makedirs(os.path.join(path_area, "- Vista ampla"), exist_ok=True)
                    count += 1
                
                itens = self.itens_por_area.get(area, [])
                for idx_item, item in enumerate(itens, 1):
                    nome_item = f"{idx_item} - {item}"
                    path_item = os.path.join(path_area, nome_item)
                    os.makedirs(path_item, exist_ok=True)
                    count += 1
                    
                    key = (area, item)
                    subs = self.subpastas_por_item.get(key, [])
                    service_counter = 0
                    for sub in subs:
                        eh_servico = (sub in SERVICOS_SUGERIDOS) or (sub in self.custom_servicos)
                        
                        if sub.lower() == "vista ampla":
                             nome_sub = f"- {sub}"
                        elif eh_servico:
                             service_counter += 1
                             nome_sub = f"{idx_item}.{service_counter} - {sub}"
                        elif sub in SUBPASTAS_SUGERIDAS or sub in self.custom_subpastas:
                             nome_sub = f"- {sub}"
                        else:
                             nome_sub = f"- {sub}"
                        
                        path_sub = os.path.join(path_item, nome_sub)
                        os.makedirs(path_sub, exist_ok=True)
                        count += 1
                        
                        # NÍVEL 4
                        key_n4 = (area, item, sub)
                        detalhes = self.detalhes_por_subitem.get(key_n4, [])
                        for det in detalhes:
                             path_det = os.path.join(path_sub, f"- {det}")
                             os.makedirs(path_det, exist_ok=True)
                             count += 1

            messagebox.showinfo("Sucesso", f"Estrutura criada com sucesso!\n{count} pastas geradas.")
            self._atualizar_preview()
            
        except Exception as e:
            messagebox.showerror("Erro", f"Erro ao criar pastas: {str(e)}")

    def _limpar_selecao(self):
        confirm = messagebox.askyesno("Confirmar", "Deseja limpar todos os itens selecionados?")
        if not confirm: return
        
        # Resetar dados
        self.areas_selecionadas.clear()
        self.itens_por_area.clear()
        self.subpastas_por_item.clear()
        self.detalhes_por_subitem.clear()
        self.vista_ampla_geral.clear()
        
        self.area_atual = None
        self.item_atual = None
        self.subitem_atual = None
        
        # Resetar UI
        self._popular_areas()
        self._popular_nivel2()
        self._popular_nivel3()
        self._popular_nivel4()
        self.cb_va_area.deselect()
        
        # Limpar Labels
        self.label_area_temp.configure(text="")
        self.label_item_temp.configure(text="")
        self.label_subItem_temp.configure(text="")
        
        # Limpar buscas
        self.search_areas.delete(0, "end")
        self.search_n2.delete(0, "end")
        self.search_n3.delete(0, "end")
        self.search_n4.delete(0, "end")

        self._atualizar_preview()
        messagebox.showinfo("Limpeza", "Todas as seleções foram removidas.")


if __name__ == "__main__":
    app = GeradorEstruturaPastas()
    app.mainloop()
```

**Lógica:** `enumerate(subs, 1)` → contador manual `service_counter` que só incrementa quando `sub.lower() != "vista ampla"`.

### [commit.html](file:///c:/Users/thiag/TM-MEUS-APPS/TM%20Pastas/dev/commit.html)

Commit #10 adicionado documentando a correção.

## Verificação

Para testar, execute `python app.py`, adicione ambientes com "Vista ampla" e serviços. O preview deve mostrar:

```
1 - SAA
  Vista ampla          ← sem número
  1.1 - Pintura        ← começa em .1 ✅
  1.2 - Forro          ← sequência correta ✅
```
