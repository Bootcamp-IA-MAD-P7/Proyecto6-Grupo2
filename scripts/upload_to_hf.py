import os
import sys
from pathlib import Path

from huggingface_hub import HfApi


def load_env(env_path: str = ".env") -> None:
    path = Path(env_path)
    if not path.exists():
        return
    for line in path.read_text().strip().splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        key, _, val = line.partition("=")
        os.environ.setdefault(key.strip(), val.strip())


def fix_csv_quoting(input_path: str) -> str:
    raw = Path(input_path).read_text(encoding="utf-8")
    lines = raw.strip().splitlines()

    cleaned = []
    for line in lines:
        line = line.strip()
        if line.startswith('"') and line.endswith('"'):
            line = line[1:-1]
        line = line.replace('""', '"')
        cleaned.append(line)

    output_path = str(Path(input_path).with_suffix(".csv"))
    Path(output_path).write_text("\n".join(cleaned) + "\n", encoding="utf-8")
    print(f"Fixed: {input_path} -> {output_path}")
    return output_path


def upload_to_hf(
    local_path: str,
    repo_id: str = "Anahia/stackoverflow_survey",
    token: str | None = None,
) -> None:
    api = HfApi()
    path_in_repo = Path(local_path).name
    api.upload_file(
        path_or_fileobj=local_path,
        path_in_repo=path_in_repo,
        repo_id=repo_id,
        repo_type="dataset",
        token=token,
    )
    print(f"Uploaded: {local_path} -> {repo_id}/{path_in_repo}")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: uv run scripts/upload_to_hf.py <csv_path>")
        print("  <csv_path>  Path to the raw (broken) CSV file")
        sys.exit(1)

    load_env()
    csv_path = sys.argv[1]
    token = os.getenv("HUGGINGFACE_TOKEN")
    if not token:
        print("HUGGINGFACE_TOKEN not set in .env or environment")
        sys.exit(1)

    csv_path = fix_csv_quoting(csv_path)
    upload_to_hf(csv_path, token=token)
