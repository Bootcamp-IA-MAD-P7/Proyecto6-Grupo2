# %% [markdown]
# # Exploratory Data Analysis — Stack Overflow Survey 2022

# %%
import sys
from pathlib import Path

sys.path.insert(0, str(Path.cwd().parent))

import polars as pl
from utils.load_raw_data import RawData

data_raw = RawData(year=2022)
df = data_raw.download()

# %%
df.glimpse()

# %%
print(f"Shape: {df.shape}")
print(f"Columns ({len(df.columns)}): {df.columns}")

# %%
df.sample(10)
