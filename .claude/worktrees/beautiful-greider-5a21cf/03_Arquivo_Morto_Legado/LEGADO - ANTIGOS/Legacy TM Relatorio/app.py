import os
import tkinter as tk
from tkinter import filedialog, messagebox

from generator import generate_report


def pick_folder(var: tk.StringVar, title: str) -> None:
    path = filedialog.askdirectory(title=title)
    if path:
        var.set(path)


def pick_docx(var: tk.StringVar, title: str) -> None:
    path = filedialog.askopenfilename(
        title=title,
        filetypes=[("Documentos Word", "*.docx")],
    )
    if path:
        var.set(path)


def open_folder(path: str) -> None:
    if not path:
        return
    try:
        os.startfile(path)  # Windows
    except Exception:
        pass


def main() -> None:
    root = tk.Tk()
    root.title("TM — Gerador de Relatório Fotográfico")
    root.geometry("760x260")

    pasta_raiz = tk.StringVar()
    modelo = tk.StringVar()
    saida = tk.StringVar()

    # Layout
    frame = tk.Frame(root, padx=14, pady=14)
    frame.pack(fill=tk.BOTH, expand=True)

    tk.Label(frame, text="Pasta raiz (fotos):", anchor="w").grid(row=0, column=0, sticky="w")
    tk.Entry(frame, textvariable=pasta_raiz, width=74).grid(row=0, column=1, padx=8)
    tk.Button(frame, text="Selecionar", command=lambda: pick_folder(pasta_raiz, "Selecione a pasta de fotos")).grid(row=0, column=2)

    tk.Label(frame, text="Modelo Word (DOCX):", anchor="w").grid(row=1, column=0, sticky="w", pady=(10, 0))
    tk.Entry(frame, textvariable=modelo, width=74).grid(row=1, column=1, padx=8, pady=(10, 0))
    tk.Button(frame, text="Selecionar", command=lambda: pick_docx(modelo, "Selecione o modelo do Word"))\
        .grid(row=1, column=2, pady=(10, 0))

    tk.Label(frame, text="Pasta de saída:", anchor="w").grid(row=2, column=0, sticky="w", pady=(10, 0))
    tk.Entry(frame, textvariable=saida, width=74).grid(row=2, column=1, padx=8, pady=(10, 0))
    tk.Button(frame, text="Selecionar", command=lambda: pick_folder(saida, "Selecione a pasta para salvar"))\
        .grid(row=2, column=2, pady=(10, 0))

    status = tk.StringVar(value="Pronto")
    tk.Label(frame, textvariable=status, anchor="w", fg="#444").grid(row=3, column=0, columnspan=3, sticky="w", pady=(14, 0))

    btns = tk.Frame(frame)
    btns.grid(row=4, column=0, columnspan=3, sticky="e", pady=(14, 0))

    def run():
        pr = pasta_raiz.get().strip()
        md = modelo.get().strip()
        sd = saida.get().strip()

        if not pr or not os.path.isdir(pr):
            messagebox.showerror("Erro", "Selecione uma pasta raiz válida.")
            return
        if not md or not os.path.isfile(md) or not md.lower().endswith(".docx"):
            messagebox.showerror("Erro", "Selecione um modelo DOCX válido.")
            return
        if not sd or not os.path.isdir(sd):
            messagebox.showerror("Erro", "Selecione uma pasta de saída válida.")
            return

        status.set("Processando... (abrirá pré-visualização)")
        root.update_idletasks()

        try:
            result = generate_report(pr, md, sd, use_preview=True)
            if result["status"] == "cancelado":
                status.set("Cancelado na pré-visualização")
                messagebox.showinfo(
                    "Cancelado",
                    "Geração cancelada.\n\nLogs:\n"
                    f"- {result['process_log']}\n"
                    f"- {result['erros_log']}",
                )
                return

            status.set("Concluído")
            messagebox.showinfo(
                "Sucesso",
                "Relatório gerado com sucesso.\n\n"
                f"Arquivo:\n{result['docx']}\n\n"
                f"Logs:\n- {result['process_log']}\n- {result['erros_log']}",
            )

            open_folder(sd)

        except Exception as e:
            status.set("Erro")
            messagebox.showerror("Erro", f"Falha ao gerar relatório:\n\n{e}")

    tk.Button(btns, text="Abrir saída", command=lambda: open_folder(saida.get().strip())).pack(side=tk.LEFT, padx=6)
    tk.Button(btns, text="Gerar", command=run, bg="#16a34a", fg="white").pack(side=tk.LEFT, padx=6)

    root.mainloop()


if __name__ == "__main__":
    main()
