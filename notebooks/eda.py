# %% [markdown]
# # Exploratory Data Analysis

# %% [markdown]
# ## Objectives
#
# - Understand the dataset
# - Inspect data quality
# - Explore feature distributions
# - Identify potential preprocessing steps

# %%
#Importaciones


# %% para que sea compatible en linux y windows
import sys

print(sys.executable)
print(sys.version)



# %% 
from datasets import load_dataset
import polars as pl
df = load_dataset
df.head()

# %%
import seaborn as sns
sns.set_theme(style="whitegrid")





# %% cargar el dataset



# ejemplo: target y un par de columnas para arrancar
TARGET_COL = "job_satisfaction"

print(df[TARGET_COL].value_counts(dropna=False))

# Ejemplo numérica
num_cols = [c for c in df.columns if c.endswith("_midpoint") or "midpoint" in c]
for c in num_cols[:5]:
    if c != TARGET_COL and pd.api.types.is_numeric_dtype(df[c]):
        plot_numerical_feature(df, c, target_col=TARGET_COL)

# Ejemplo categórica
cat_cols = [c for c in df.columns if c not in num_cols + [TARGET_COL]]
for c in cat_cols[:5]:
    plot_categorical_feature(df, c, target_col=TARGET_COL)
