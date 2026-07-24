import sys
from pathlib import Path


def setup_project_root(project_root_marker: str = "utils") -> Path:
    try:
        # Caso normal: se ejecuta como .py
        root = Path(__file__).resolve().parent.parent
    except NameError:
        # Caso notebook: __file__ no existe
        p = Path.cwd()
        while p != p.parent:
            if (p / project_root_marker).exists():
                root = p
                break
            p = p.parent
        else:
            root = Path.cwd()

    root_str = str(root)
    if root_str not in sys.path:
        sys.path.insert(0, root_str)
    return root

# Ejecuta al importar
setup_project_root()
