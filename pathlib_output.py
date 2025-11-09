from pathlib import Path

def print_tree(path, level=0, max_level=2):
    if level > max_level:
        return
    indent = " " * 4 * level
    print(f"{indent}{path.name}/")
    for child in path.iterdir():
        if child.is_dir() and child.name != "__pycache__":
            print_tree(child, level + 1, max_level)
        elif child.suffix == ".py":
            print(f"{' ' * 4 * (level + 1)}{child.name}")

# Projektverzeichnis anpassen
root_path = Path(r"C:\dev\SSMA")
print_tree(root_path)