import os
import shutil
import uuid

def reproduce():
    base_dir = "test_folders"
    if os.path.exists(base_dir):
        shutil.rmtree(base_dir)
    os.makedirs(os.path.join(base_dir, "3 - Recepcão", "2.1 - Pintura"))
    
    # Simulating what the frontend sends
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
    
    print("--- Before ---")
    for root, dirs, files in os.walk(base_dir):
        print(root)

    temp_moves = []
    try:
        # Stage 1: rename to temp names
        for item in updates:
            old_p = item["old_path"]
            new_p = item["new_path"]
            if old_p != new_p and os.path.exists(old_p):
                temp_p = os.path.join(os.path.dirname(old_p), f"_tmp_{uuid.uuid4().hex}")
                print(f"Renaming {old_p} to {temp_p}")
                os.rename(old_p, temp_p)
                temp_moves.append(
                    {"temp_path": temp_p, "final_path": new_p, "old_path": old_p}
                )
            else:
                print(f"Skipping {old_p} (exists: {os.path.exists(old_p)})")

        # Stage 2: rename to final names
        for move in temp_moves:
            os.makedirs(os.path.dirname(move["final_path"]), exist_ok=True)
            print(f"Renaming {move['temp_path']} to {move['final_path']}")
            os.rename(move["temp_path"], move["final_path"])
    except Exception as e:
        print(f"Error: {e}")

    print("\n--- After ---")
    for root, dirs, files in os.walk(base_dir):
        print(root)

if __name__ == "__main__":
    reproduce()
