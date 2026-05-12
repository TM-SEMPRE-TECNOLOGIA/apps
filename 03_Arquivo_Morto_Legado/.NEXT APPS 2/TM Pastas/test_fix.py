import os
import shutil
import uuid

def test_fix():
    base_dir = "test_folders_fix"
    if os.path.exists(base_dir):
        shutil.rmtree(base_dir)
    
    # Criar estrutura inicial: 3 - Recepcão / 2.1 - Pintura
    os.makedirs(os.path.join(base_dir, "3 - Recepcão", "2.1 - Pintura"))
    
    # Simular o que o frontend envia (mudar para 4 - Recepcão e 4.1 - Pintura)
    updates = [
        {
            "old_path": os.path.abspath(os.path.join(base_dir, "3 - Recepcão")),
            "new_path": os.path.abspath(os.path.join(base_dir, "4 - Recepcão"))
        },
        {
            "old_path": os.path.abspath(os.path.join(base_dir, "3 - Recepcão", "2.1 - Pintura")),
            "new_path": os.path.abspath(os.path.join(base_dir, "4 - Recepcão", "4.1 - Pintura"))
        }
    ]
    
    print("--- Antes ---")
    for root, dirs, files in os.walk(base_dir):
        print(root)

    temp_moves = []
    
    # Nova lógica do backend (Stage 1 e 2 com atualizações de caminho)
    current_mappings = [
        {"original_old": item["old_path"], "current_old": item["old_path"], "final_new": item["new_path"]}
        for item in updates
    ]

    try:
        # Stage 1: renomear para nomes temporários
        for i, move in enumerate(current_mappings):
            old_p = move["current_old"]
            new_p = move["final_new"]
            
            if old_p != new_p and os.path.exists(old_p):
                temp_p = os.path.join(os.path.dirname(old_p), f"_tmp_{uuid.uuid4().hex}")
                print(f"S1: Movendo {old_p} -> {temp_p}")
                os.rename(old_p, temp_p)
                move["temp_path"] = temp_p
                temp_moves.append(move)
                
                # Atualizar outros caminhos
                for j in range(len(current_mappings)):
                    if i == j: continue
                    other = current_mappings[j]
                    if other["current_old"].startswith(old_p + os.sep):
                        other["current_old"] = other["current_old"].replace(old_p, temp_p, 1)

        # Stage 2: renomear do temporário para o destino final
        for i, move in enumerate(temp_moves):
            final_p = move["final_new"]
            temp_p = move["temp_path"]
            
            os.makedirs(os.path.dirname(final_p), exist_ok=True)
            print(f"S2: Movendo {temp_p} -> {final_p}")
            os.rename(temp_p, final_p)
            
            # Atualizar subsequentes
            for j in range(len(temp_moves)):
                if i == j: continue
                other = temp_moves[j]
                if other["temp_path"].startswith(temp_p + os.sep):
                     other["temp_path"] = other["temp_path"].replace(temp_p, final_p, 1)

    except Exception as e:
        print(f"Erro: {e}")

    print("\n--- Depois ---")
    for root, dirs, files in os.walk(base_dir):
        print(root)
    
    # Validação
    expected_path = os.path.abspath(os.path.join(base_dir, "4 - Recepcão", "4.1 - Pintura"))
    if os.path.exists(expected_path):
        print("\nSUCESSO: A subpasta foi renomeada corretamente!")
    else:
        print("\nFALHA: A subpasta não foi encontrada no caminho esperado.")

if __name__ == "__main__":
    test_fix()
