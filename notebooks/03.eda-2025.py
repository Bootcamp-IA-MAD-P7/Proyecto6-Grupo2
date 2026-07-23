

# %% 
# import sys
import sys
import math
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from utils.load_raw_data import RawData
from IPython.display import display
import polars as pl
import seaborn as sns
import matplotlib.pyplot as plt
import altair as alt
import seaborn as sns
sns.set_theme(style="darkgrid")

data_raw = RawData(year=2024)
df = data_raw.download()
df.head(10)



# %% Elegimos columnas relevantes
cols = ["JobSat", "ConvertedCompYearly", "YearsCodePro", "EdLevel", "DevType", "RemoteWork"]
df_sel = df.select([c for c in cols if c in df.columns])

# %%
print(f"Shape: {df.shape}")
print(f"Columns ({len(df.columns)}): {df.columns}")

# %%
print(f"Types: {df.dtypes}")
print(f"Columns ({len(df.columns)}): {df.columns}")



# %%

print(f"Types: {df.describe}")


# %%

print(f"Nulls: {df.null_count}") 


# %% Contar duplicados

print(f'Duplicados: {df.is_duplicated()}')

# %% Eliminar duplicados
print(f"Duplicados: {df.unique()}")

# %%
import polars as pl
import matplotlib.pyplot as plt
import seaborn as sns

sns.set_theme(style="darkgrid")

TARGET = "JobSat"


# %% Boxplots para detectar outliers

num_cols = [c for c, t in df.schema.items() if t in pl.NUMERIC_DTYPES]

fig, axes = plt.subplots(1, len(num_cols), figsize=(14, 4))

if len(num_cols) == 1:
    axes = [axes]

for i, col in enumerate(num_cols):
    sns.boxplot(y=df[col].to_list(), ax=axes[i], color='#f5c6d6')
    axes[i].set_title(col)
    axes[i].set_xlabel("")

plt.tight_layout()
plt.show()


# %% Columnas de interés
cols = [
    "JobSat", "ConvertedCompYearly", "YearsCodePro", "EdLevel",
    "DevType", "RemoteWork", "MainBranch", "Country", "Sexuality",
    "Gender", "Age", "WorkExp"
]

cols = [c for c in cols if c in df.columns]
df_sel = df.select(cols)

print(df_sel.head(10))
print(df_sel.shape)


# %% Gráfico de barras: frecuencia de género o tipo de rol

cat_df = (
    df
    .select(["gender", "JobSat"])
    .drop_nulls()
    .group_by(["gender", "JobSat"])
    .len()
    .sort(["gender", "JobSat"])
)

fig, ax = plt.subplots(figsize=(12, 6))

sns.barplot(
    data=cat_df.to_pandas(),
    x="gender",
    y="len",
    hue="JobSat",
    ax=ax
)

ax.set_title("Comparación entre gender y JobSat")
ax.set_xlabel("Gender")
ax.set_ylabel("Frecuencia")
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()




# %% Matriz de correlación: variables numéricas relacionadas con carrera y bienestar
corr_cols = [c for c in ["JobSat", "ConvertedCompYearly", "YearsCodePro", "Age", "WorkExp"] if c in df.columns]

corr = df.select(corr_cols).to_pandas().corr()
print(corr)




# %% Heatmap: relación entre satisfacción, salario y experiencia
plt.figure(figsize=(8, 6))
sns.heatmap(corr, annot=True, cmap="RdPu", center=0, fmt=".2f", square=True)
plt.title("Relación entre satisfacción laboral, salario y experiencia")
plt.tight_layout()
plt.show()
