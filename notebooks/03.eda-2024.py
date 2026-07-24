
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






# %%
print(df.columns)


import numpy as np

# %% Histograma (JobSat)
plt.figure(figsize=(8, 4))
sns.histplot(df_sel["JobSat"].drop_nulls().to_numpy(), bins=20, kde=False, color="#f5c6d6")
plt.title("Distribución de JobSat")
plt.xlabel("JobSat")
plt.ylabel("Frecuencia")
plt.tight_layout()
plt.show()


print("""
      En la muestra analizada, la satisfacción laboral (JobSat) se concentra principalmente en ciertos niveles (lo que se observa por
      la “forma” del histograma). Esto sugiere que, en general, el sector tecnológico presenta un patrón de bienestar relativamente estable,
      pero también permite identificar la existencia de subgrupos con niveles más bajos de satisfacción. Para TalentCare AI esto es clave
      porque permite enfocar la detección temprana de malestar laboral y orientar estrategias de retención hacia perfiles o condiciones que
      se asocian con JobSat más bajo.
"""
)
# %% Heatmap de correlación (solo variables numéricas de las columnas que tienes)
candidate_num = ["JobSat", "ConvertedCompYearly", "YearsCodePro", "Age", "WorkExp"]
candidate_num = [c for c in candidate_num if c in df_sel.columns]

numeric_cols = []
for c in candidate_num:
    if df_sel.schema[c] in pl.NUMERIC_DTYPES:
        numeric_cols.append(c)

if len(numeric_cols) >= 2:
    df_num = df_sel.select(numeric_cols).drop_nulls()
    corr = np.corrcoef(df_num.to_numpy(), rowvar=False)

    plt.figure(figsize=(7, 6))
    sns.heatmap(
        corr,
        xticklabels=numeric_cols,
        yticklabels=numeric_cols,
        annot=True,
        fmt=".2f",
        cmap="RdPu",
        center=0
    )
    plt.title("Heatmap de correlación (Pearson) - numéricas")
    plt.tight_layout()
    plt.show()

print("""
      El heatmap de correlación muestra qué variables numéricas se mueven en la misma dirección (correlación positiva) o en direcciones 
      opuestas (correlación negativa) respecto a JobSat. Cuando aparecen correlaciones positivas, se interpreta como que ciertos factores 
      del perfil laboral (por ejemplo salario, experiencia o edad/tiempo en el sector) están asociados con mejores niveles de satisfacción,
      lo cual respalda la idea de que el bienestar no depende solo del puesto, sino también del “camino” profesional y las condiciones ligadas 
      a trayectoria y estabilidad. Cuando hay correlaciones cercanas a 0, la interpretación es que la relación lineal con satisfacción es débil
      y que probablemente influyen más los efectos por categorías (como tipo de trabajo o modalidad) o relaciones no lineales, por lo que 
      conviene complementar con análisis segmentados.
      """
      )
# %% Diagrama de barras (relación con bienestar: JobSat por RemoteWork)
if "RemoteWork" in df_sel.columns:
    df_bars = (
        df_sel.select(["RemoteWork", "JobSat"])
        .drop_nulls()
        .group_by("RemoteWork")
        .agg([pl.mean("JobSat").alias("mean_JobSat"), pl.len().alias("n")])
        .sort("n", descending=True)
    )

    # si hay muchas categorías, quedarnos con las más frecuentes
    if "n" in df_bars.columns:
        df_bars = df_bars.head(12)

    plot_df = df_bars.sort("mean_JobSat").to_pandas()

    plt.figure(figsize=(9, 4.5))
    sns.barplot(data=plot_df, x="RemoteWork", y="mean_JobSat", color="#d8b4fe")
    plt.title("JobSat medio por RemoteWork (top por n)")
    plt.xlabel("RemoteWork")
    plt.ylabel("Media JobSat")
    plt.xticks(rotation=35, ha="right")
    plt.tight_layout()
    plt.show()



print("""
      Las barras comparan la satisfacción promedio según la modalidad de trabajo (RemoteWork). Las categorías con una media más alta
      indican que, dentro de este dataset, la modalidad asociada a esas condiciones está vinculada con mejores percepciones de bienestar
      laboral. Por el contrario, categorías con medias más bajas sugieren posibles brechas en la experiencia cotidiana del empleo
      (por ejemplo, menor soporte organizacional, aislamiento, o desajustes en condiciones), que pueden afectar la satisfacción y, por
      tanto, la retención. Además, el tamaño de cada categoría (n) permite priorizar conclusiones: si una modalidad tiene más casos, 
      la señal es más robusta, lo cual fortalece su uso para diseñar recomendaciones y políticas de mejora.
      """)