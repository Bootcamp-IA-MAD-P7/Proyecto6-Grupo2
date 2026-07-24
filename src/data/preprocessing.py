import polars as pl
import seaborn as sns
import matplotlib.pyplot as plt



TARGET_COL = "JobSat"

def _labels_for_job_satisfaction(series: pl.Series) -> pl.Series:
    # Si viene como 0/1 -> No/Yes
    if series.dtype.kind in "iu":
        return series.map({0: "No", 1: "Yes"}).fillna(series.astype(str))

    # Si viene como strings (lo más probable en el survey) -> lo dejamos legible
    s = series.astype(str)

    # Normalización simple de casos comunes (por si vienen con diferentes mayúsculas)
    # No forzamos un mapeo 1:1 porque el Likert puede tener más de 2 categorías.
    s = s.str.strip()
    return s


def plot_numerical_feature(data: pl.DataFrame, col: str, target_col: str = TARGET_COL):
    if col == target_col:
        return

    fig, axes = plt.subplots(1, 3, figsize=(15, 4))

    sns.histplot(data[col], kde=True, ax=axes[0])
    axes[0].set_title(f"Distribution of {col}")
    axes[0].set_xlabel(col)

    sns.boxplot(y=data[col], ax=axes[1])
    axes[1].set_title(f"Boxplot of {col}")

    target_labels = _labels_for_job_satisfaction(data[target_col])

    # boxplot por categoría del target (puede haber varias categorías)
    sns.boxplot(x=target_labels, y=data[col], ax=axes[2])
    axes[2].set_title(f"{col} by {target_col}")
    axes[2].set_xlabel(target_col)
    axes[2].set_ylabel(col)

    plt.tight_layout()
    plt.show()

    print(
        f"{col}: mean={data[col].mean():.2f}, median={data[col].median():.2f}, "
        f"std={data[col].std():.2f}, min={data[col].min():.2f}, max={data[col].max():.2f}"
    )


def plot_categorical_feature(data: pl.DataFrame, col: str, target_col: str = TARGET_COL):
    if col == target_col:
        return

    print(f"\n--- {col} ---")

    freq = data[col].value_counts(dropna=False)
    print(freq)
    print()

    fig, axes = plt.subplots(1, 2, figsize=(14, 4))

    order = data[col].value_counts(dropna=False).index
    sns.countplot(data=data, x=col, order=order, ax=axes[0])
    axes[0].set_title(f"Countplot of {col}")
    axes[0].tick_params(axis="x", rotation=45)

    target_labels = _labels_for_job_satisfaction(data[target_col])

    # Distribución del target por categoría del feature (stacked %)
    crosstab = pl.crosstab(data[col], target_labels, normalize="index") * 100
    crosstab.plot(
        kind="bar",
        stacked=True,
        ax=axes[1],
        legend=True,
        colormap="Set2",
    )
    axes[1].set_title(f"{col} vs {target_col} (Stacked %)")
    axes[1].set_ylabel("Percentage")
    axes[1].legend(title=target_col, loc="upper right")
    axes[1].tick_params(axis="x", rotation=45)

    plt.tight_layout()
    plt.show()


# ----------------------------
# Cleaning helpers
# ----------------------------

def remove_identifier_columns(df: pl.DataFrame) -> pl.DataFrame:
    id_cols = ["Unnamed: 0", "id", "Id", "ID"]
    df = df.copy()
    drop_cols = [c for c in id_cols if c in df.columns]
    if drop_cols:
        df = df.drop(columns=drop_cols)
    return df


def remove_constant_columns(df: pl.DataFrame) -> pl.DataFrame:
    constant_cols = [c for c in df.columns if df[c].nunique(dropna=False) == 1]
    if constant_cols:
        df = df.drop(columns=constant_cols)
    return df


def remove_geographic_columns(df: pl.DataFrame) -> pl.DataFrame:
    # Por si decides eliminarlas en EDA; si no, pon drop_geo=False en clean_raw_data
    geo_cols = [c for c in ["country", "un_subregion", "so_region"] if c in df.columns]
    if geo_cols:
        df = df.drop(columns=geo_cols)
    return df


def remove_redundant_target_columns(df: pl.DataFrame, target_col: str = TARGET_COL) -> pl.DataFrame:
    redundant = ["Churn Label", "target", "Target"]
    df = df.copy()
    for c in redundant:
        if c in df.columns and c != target_col:
            df = df.drop(columns=[c])
    return df


def convert_midpoint_columns(df: pl.DataFrame, cols=None) -> pl.DataFrame:
    df = df.copy()
    if cols is None:
        cols = [c for c in df.columns if c.lower().endswith("_midpoint")]
    for c in cols:
        if c in df.columns:
            df[c] = pl.to_numeric(df[c], errors="coerce")
    return df


def convert_numeric_like_columns(df: pl.DataFrame, cols=None) -> pl.DataFrame:
    df = df.copy()
    if cols is None:
        cols = [
            c for c in df.columns
            if any(k in c.lower() for k in ["range", "frequency", "visit", "women", "rep_", "index", "midpoint"])
        ]
        # evitamos convertir a numéricas columnas categóricas que solo coincidan por nombre, si te pasa
        # comenta aquí o dime y lo afinamos.
    for c in cols:
        if c in df.columns:
            df[c] = pl.to_numeric(df[c], errors="coerce")
    return df


