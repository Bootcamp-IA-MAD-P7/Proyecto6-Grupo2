BASE_FEATURES = [
    "country", "un_subregion", "so_region",
    "age_range", "age_midpoint",
    "gender", "self_identification",
    "occupation", "occupation_group",
    "experience_range", "experience_midpoint",
    "salary_range", "salary_midpoint",
    "employment_status",
    "company_size_range", "team_size_range",
    "remote",
    "job_discovery", "job_satisfaction", "open_to_new_job",
    "dev_environment", "education", "desktop_os",
]

# Numéricas típicas para EDA/feature building (derivadas/opcional)
NUMERIC_FEATURES = [
    "age_midpoint",
    "experience_midpoint",
    "salary_midpoint",
    "big_mac_index",
    "women_on_team",
]

# ----------------------------
# Derived / EDA features
# ----------------------------

def add_has_remote(df: pd.DataFrame) -> pd.DataFrame:
    # remote suele ser string categórico; si ya es 0/1 en tu CSV, igual funcionará con la comparación
    if "remote" not in df.columns:
        return df
    df["HasRemote"] = (df["remote"].astype(str).str.lower() != "no").astype(int)
    return df


def add_wants_new_job(df: pd.DataFrame) -> pd.DataFrame:
    if "open_to_new_job" not in df.columns:
        return df
    # open_to_new_job suele venir como "Yes"/"No"
    df["WantsNewJob"] = (df["open_to_new_job"].astype(str).str.lower() == "yes").astype(int)
    return df


def add_relative_pay(df: pd.DataFrame) -> pd.DataFrame:
    # Ejemplo útil para EDA: “salario relativo” vs experiencia/edad, evitando divisiones raras
    # (se crea solo si existen columnas)
    if "salary_midpoint" in df.columns and "experience_midpoint" in df.columns:
        denom = df["experience_midpoint"].replace({0: np.nan})
        df["SalaryPerExpUnit"] = df["salary_midpoint"] / denom
        df["SalaryPerExpUnit"] = df["SalaryPerExpUnit"].replace([np.inf, -np.inf], np.nan).fillna(0)
    if "salary_midpoint" in df.columns and "age_midpoint" in df.columns:
        denom = df["age_midpoint"].replace({0: np.nan})
        df["SalaryPerAgeUnit"] = df["salary_midpoint"] / denom
        df["SalaryPerAgeUnit"] = df["SalaryPerAgeUnit"].replace([np.inf, -np.inf], np.nan).fillna(0)
    return df


def add_tech_engagement_proxy(df: pd.DataFrame) -> pd.DataFrame:
    # Proxy simple para EDA: si existen columnas tipo "commit_frequency", etc.
    # En vez de inventar escalas, creamos contadores binarios solo si hay valores Yes/No.
    # Puedes ampliar esto cuando me digas qué columnas exactas quieres.
    return df


def add_selected_features(df: pd.DataFrame) -> pd.DataFrame:
    # 1) Derivadas
    df = add_has_remote(df)
    df = add_wants_new_job(df)
    df = add_relative_pay(df)
    df = add_tech_engagement_proxy(df)

    # 2) Filtrar columnas (solo las que existan en tu df)
    keep_cols = [c for c in BASE_FEATURES if c in df.columns]
    # y también las derivadas que se hayan creado
    for c in ["HasRemote", "WantsNewJob", "SalaryPerExpUnit", "SalaryPerAgeUnit"]:
        if c in df.columns:
            keep_cols.append(c)

    # Si quieres conservar TODAS para EDA, comenta la línea del return y usa keep_cols solo para EDA
    df = df[keep_cols].copy()
    return df


def create_selected_feature_transformer() -> FunctionTransformer:
    return FunctionTransformer(add_selected_features, validate=False)