# %% [markdown]
# # Exploratory Data Analysis — Stack Overflow Survey 2023

# %%
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

# %%
import os
import matplotlib
import polars as pl


def get_interactive_shell():
    try:
        return get_ipython()
    except NameError:
        return None


INTERACTIVE_SHELL = get_interactive_shell()
INTERACTIVE_SESSION = INTERACTIVE_SHELL is not None

if INTERACTIVE_SESSION:
    INTERACTIVE_SHELL.run_line_magic("matplotlib", "inline")
elif "MPLBACKEND" not in os.environ:
    matplotlib.use("Agg")

import matplotlib.pyplot as plt
from utils.load_raw_data import RawData, Schema

# %%
data_raw = RawData(year=2023)
df = data_raw.download()

# %%
schema_raw = Schema(year=2023)
schema = schema_raw.download()

# %% [markdown]
# ## 1. Initial Inspection

# %%
print(f"Shape: {df.shape}")
print(f"Rows: {df.height}, Columns: {df.width}")
print(f"Columns ({len(df.columns)}): {df.columns}")

# %% [markdown]
# ## 2. Dataset Overview

# %%
overview = pl.DataFrame({
    "metric": ["rows", "columns", "duplicated_rows"],
    "value": [df.height, df.width, int(df.is_duplicated().sum())],
})
print(overview)

# %% [markdown]
# ## 3. Data Quality

# %%
quality_rows = []
for col in df.columns:
    null_count = df[col].null_count()
    na_string = df.filter(pl.col(col) == "NA").height if df[col].dtype == pl.String else 0
    total_missing = null_count + na_string
    quality_rows.append({
        "column": col,
        "dtype": str(df[col].dtype),
        "null_count": null_count,
        "na_string": na_string,
        "total_missing": total_missing,
        "missing_pct": round(total_missing * 100 / df.height, 2),
        "unique_count": df[col].n_unique(),
    })

quality_table = pl.DataFrame(quality_rows)
print("Data quality table (top 20 most missing):")
print(quality_table.sort("total_missing", descending=True).head(20))

# %%
top_missing = quality_table.sort("missing_pct", descending=True).head(20)
fig, ax = plt.subplots(figsize=(10, 6))
ax.barh(
    top_missing["column"].to_list()[::-1],
    top_missing["missing_pct"].to_list()[::-1],
    color="#E07B54",
)
ax.set_xlabel("Missing values (%)")
ax.set_title("Top 20 columns by missing values — Stack Overflow Survey 2023")
ax.axvline(x=50, color="gray", linestyle="--", linewidth=0.8, label="50% threshold")
ax.legend()
plt.tight_layout()
plt.savefig("notebooks/figures/2023_01_missing_values.png", dpi=150)
plt.show()
print("Interpretation: Columns above 50% missing are unlikely candidates for ML features.")

# %% [markdown]
# ## 4. Population

# %%
main_branch = df["MainBranch"].value_counts(sort=True)
print("MainBranch distribution:")
print(main_branch)

# %%
fig, ax = plt.subplots(figsize=(9, 4))
ax.barh(
    main_branch["MainBranch"].to_list()[::-1],
    main_branch["count"].to_list()[::-1],
    color="#4C72B0",
)
ax.set_xlabel("Respondents")
ax.set_title("Respondent type — Stack Overflow Survey 2023")
plt.tight_layout()
plt.savefig("notebooks/figures/2023_02_main_branch.png", dpi=150)
plt.show()

# %%
professional_population = df.filter(
    pl.col("MainBranch") == "I am a developer by profession"
)
print(f"Total respondents: {df.height}")
print(f"Professional developers: {professional_population.height} ({round(professional_population.height * 100 / df.height, 2)}%)")

# %%
age_dist = df["Age"].drop_nulls().value_counts(sort=True)
print("Age distribution:")
print(age_dist)

# %%
age_order = [
    "Under 18 years old", "18-24 years old", "25-34 years old",
    "35-44 years old", "45-54 years old", "55-64 years old",
    "65 years or older", "Prefer not to say",
]
age_ordered = (
    age_dist
    .with_columns(pl.col("Age").cast(pl.Enum(age_order)).alias("Age_ordered"))
    .sort("Age_ordered")
)
fig, ax = plt.subplots(figsize=(9, 4))
ax.bar(age_ordered["Age"].to_list(), age_ordered["count"].to_list(), color="#4C72B0")
ax.set_xlabel("Age range")
ax.set_ylabel("Respondents")
ax.set_title("Age distribution — Stack Overflow Survey 2023")
ax.tick_params(axis="x", rotation=30)
plt.tight_layout()
plt.savefig("notebooks/figures/2023_03_age.png", dpi=150)
plt.show()
print("Interpretation: The 25-34 age group dominates with 32,813 respondents (37.1%). The survey skews toward early and mid-career professionals.")

# %% [markdown]
# ## 5. Professional Profile

# %%
employment = professional_population["Employment"].drop_nulls().value_counts(sort=True)
print("Employment (top 8):")
print(employment.head(8))

# %%
remote = professional_population["RemoteWork"].drop_nulls().value_counts(sort=True)
print("RemoteWork distribution:")
print(remote)

# %%
fig, ax = plt.subplots(figsize=(7, 4))
ax.bar(remote["RemoteWork"].to_list(), remote["count"].to_list(), color="#55A868")
ax.set_xlabel("Work modality")
ax.set_ylabel("Respondents")
ax.set_title("Remote work modality — Professional developers 2023")
ax.tick_params(axis="x", rotation=15)
plt.tight_layout()
plt.savefig("notebooks/figures/2023_04_remote_work.png", dpi=150)
plt.show()
print("Interpretation: Hybrid and Remote together account for over 83% of professional developers. In-person work is a minority in 2023.")

# %%
edlevel = professional_population["EdLevel"].drop_nulls().value_counts(sort=True)
print("Education level:")
print(edlevel)

# %%
fig, ax = plt.subplots(figsize=(10, 5))
ax.barh(
    edlevel["EdLevel"].to_list()[::-1],
    edlevel["count"].to_list()[::-1],
    color="#4C72B0",
)
ax.set_xlabel("Respondents")
ax.set_title("Education level — Professional developers 2023")
plt.tight_layout()
plt.savefig("notebooks/figures/2023_05_edlevel.png", dpi=150)
plt.show()
print("Interpretation: Bachelor's degree is the most common qualification (36,205). Master's degrees are the second most frequent.")

# %%
years_pro = (
    professional_population
    .filter(pl.col("YearsCodePro").is_not_null())
    .with_columns(pl.col("YearsCodePro").cast(pl.Float64, strict=False).alias("ycp_num"))
    .filter(pl.col("ycp_num").is_not_null())
)
ycp_stats = years_pro.select([
    pl.col("ycp_num").min().alias("min"),
    pl.col("ycp_num").quantile(0.25).alias("p25"),
    pl.col("ycp_num").median().alias("median"),
    pl.col("ycp_num").mean().round(2).alias("mean"),
    pl.col("ycp_num").quantile(0.75).alias("p75"),
    pl.col("ycp_num").max().alias("max"),
])
print("YearsCodePro statistics:")
print(ycp_stats)

# %%
fig, ax = plt.subplots(figsize=(9, 4))
ax.hist(years_pro["ycp_num"].to_list(), bins=30, color="#4C72B0", edgecolor="white")
ax.set_xlabel("Years of professional coding experience")
ax.set_ylabel("Respondents")
ax.set_title("Professional coding experience — Stack Overflow Survey 2023")
plt.tight_layout()
plt.savefig("notebooks/figures/2023_06_years_code_pro.png", dpi=150)
plt.show()
print("Interpretation: Experience is right-skewed. Most professionals have between 2 and 10 years of experience.")

# %%
devtype = professional_population["DevType"].drop_nulls().value_counts(sort=True)
print("DevType (top 10):")
print(devtype.head(10))

# %%
fig, ax = plt.subplots(figsize=(10, 5))
ax.barh(
    devtype["DevType"].to_list()[:9][::-1],
    devtype["count"].to_list()[:9][::-1],
    color="#4C72B0",
)
ax.set_xlabel("Respondents")
ax.set_title("Developer type — Professional developers 2023")
plt.tight_layout()
plt.savefig("notebooks/figures/2023_07_devtype.png", dpi=150)
plt.show()
print("Interpretation: Full-stack (25,379) leads by a wide margin, followed by back-end (13,573) and front-end (5,020).")

# %% [markdown]
# ## 6. Compensation

# %%
compensation = (
    professional_population
    .with_columns(
        pl.col("ConvertedCompYearly").cast(pl.Float64, strict=False).alias("annual_compensation")
    )
    .filter(pl.col("annual_compensation").is_not_null() & (pl.col("annual_compensation") > 0))
)
print(f"Professionals with valid compensation: {compensation.height} ({round(compensation.height * 100 / professional_population.height, 2)}%)")

comp_stats = compensation.select([
    pl.col("annual_compensation").min().alias("min"),
    pl.col("annual_compensation").quantile(0.25).alias("p25"),
    pl.col("annual_compensation").median().alias("median"),
    pl.col("annual_compensation").mean().round(2).alias("mean"),
    pl.col("annual_compensation").quantile(0.75).alias("p75"),
    pl.col("annual_compensation").quantile(0.99).alias("p99"),
    pl.col("annual_compensation").max().alias("max"),
])
print("Compensation statistics (USD/year):")
print(comp_stats)

# %%
p99 = compensation.select(pl.col("annual_compensation").quantile(0.99)).item()
comp_viz = compensation.filter(pl.col("annual_compensation") <= p99)

fig, ax = plt.subplots(figsize=(9, 4))
ax.hist(comp_viz["annual_compensation"].to_list(), bins=40, color="#E07B54", edgecolor="white")
ax.set_xlabel("Annual compensation (USD, capped at p99)")
ax.set_ylabel("Respondents")
ax.set_title("Compensation distribution — Professional developers 2023 (up to p99)")
plt.tight_layout()
plt.savefig("notebooks/figures/2023_08_compensation.png", dpi=150)
plt.show()
print("Interpretation: Compensation is strongly right-skewed. The median is $74,963 while the mean is $102,911, pulled up by extreme values.")

# %%
log_comp = compensation.with_columns(
    pl.col("annual_compensation").log(base=10).alias("log10_comp")
)
fig, ax = plt.subplots(figsize=(9, 4))
ax.hist(log_comp["log10_comp"].to_list(), bins=40, color="#E07B54", edgecolor="white")
ax.set_xlabel("log10(Annual compensation)")
ax.set_ylabel("Respondents")
ax.set_title("Log10 compensation — Professional developers 2023")
plt.tight_layout()
plt.savefig("notebooks/figures/2023_09_compensation_log.png", dpi=150)
plt.show()
print("Interpretation: The log-scale view reveals a roughly normal central distribution. This transformation may be useful for modeling.")

# %%
comp_remote = (
    compensation
    .filter(pl.col("RemoteWork").is_not_null())
    .group_by("RemoteWork")
    .agg([
        pl.len().alias("count"),
        pl.col("annual_compensation").median().alias("median_comp"),
        pl.col("annual_compensation").quantile(0.25).alias("q1"),
        pl.col("annual_compensation").quantile(0.75).alias("q3"),
    ])
    .sort("median_comp", descending=True)
)
print("Compensation by remote work modality:")
print(comp_remote)

# %%
fig, ax = plt.subplots(figsize=(7, 4))
ax.bar(
    comp_remote["RemoteWork"].to_list(),
    comp_remote["median_comp"].to_list(),
    color=["#4C72B0", "#55A868", "#E07B54"],
)
ax.set_xlabel("Work modality")
ax.set_ylabel("Median annual compensation (USD)")
ax.set_title("Median compensation by remote work modality — 2023")
ax.tick_params(axis="x", rotation=15)
plt.tight_layout()
plt.savefig("notebooks/figures/2023_10_comp_by_remote.png", dpi=150)
plt.show()
print("Interpretation: Remote workers tend to earn more than hybrid or in-person workers. This differential is a relevant signal for the model.")

# %% [markdown]
# ## 7. Technology Landscape

# %%
def top_multi_select(frame: pl.DataFrame, column: str, limit: int = 15) -> pl.DataFrame:
    return (
        frame.select(pl.col(column).str.split(";").alias("tech"))
        .explode("tech")
        .with_columns(pl.col("tech").str.strip_chars())
        .filter(pl.col("tech").is_not_null() & (pl.col("tech") != ""))
        .group_by("tech")
        .len(name="count")
        .with_columns(
            (pl.col("count") * 100 / frame.height).round(2).alias("pct")
        )
        .sort("count", descending=True)
        .head(limit)
    )

# %%
top_languages = top_multi_select(professional_population, "LanguageHaveWorkedWith")
print("Top programming languages:")
print(top_languages)

# %%
fig, ax = plt.subplots(figsize=(9, 6))
ax.barh(
    top_languages["tech"].to_list()[::-1],
    top_languages["pct"].to_list()[::-1],
    color="#4C72B0",
)
ax.set_xlabel("Professional respondents (%)")
ax.set_title("Top programming languages — Professional developers 2023")
plt.tight_layout()
plt.savefig("notebooks/figures/2023_11_languages.png", dpi=150)
plt.show()
print("Interpretation: JavaScript leads, followed by HTML/CSS and Python. Multi-select fields require multi-hot encoding before modeling.")

# %%
top_databases = top_multi_select(professional_population, "DatabaseHaveWorkedWith")
print("Top databases:")
print(top_databases)

# %%
fig, ax = plt.subplots(figsize=(9, 6))
ax.barh(
    top_databases["tech"].to_list()[::-1],
    top_databases["pct"].to_list()[::-1],
    color="#55A868",
)
ax.set_xlabel("Professional respondents (%)")
ax.set_title("Top databases — Professional developers 2023")
plt.tight_layout()
plt.savefig("notebooks/figures/2023_12_databases.png", dpi=150)
plt.show()

# %%
top_platforms = top_multi_select(professional_population, "PlatformHaveWorkedWith")
print("Top platforms:")
print(top_platforms)

# %%
fig, ax = plt.subplots(figsize=(9, 6))
ax.barh(
    top_platforms["tech"].to_list()[::-1],
    top_platforms["pct"].to_list()[::-1],
    color="#C44E52",
)
ax.set_xlabel("Professional respondents (%)")
ax.set_title("Top cloud and platform technologies — Professional developers 2023")
plt.tight_layout()
plt.savefig("notebooks/figures/2023_13_platforms.png", dpi=150)
plt.show()

# %% [markdown]
# ## 8. AI Landscape (exclusive to 2023)

# %%
ai_select = df["AISelect"].drop_nulls().value_counts(sort=True)
print("AI tool usage:")
print(ai_select)

# %%
fig, ax = plt.subplots(figsize=(7, 3))
ax.barh(
    ai_select["AISelect"].to_list()[::-1],
    ai_select["count"].to_list()[::-1],
    color="#8172B2",
)
ax.set_xlabel("Respondents")
ax.set_title("Are developers using AI tools? — 2023")
plt.tight_layout()
plt.savefig("notebooks/figures/2023_14_ai_select.png", dpi=150)
plt.show()
print("Interpretation: 43.4% of respondents already use AI tools. 25.3% plan to start soon. Only 29.1% have no plans to adopt AI tools.")

# %%
ai_sent = df["AISent"].drop_nulls().value_counts(sort=True)
print("Sentiment toward AI tools:")
print(ai_sent)

# %%
sentiment_order = ["Very favorable", "Favorable", "Indifferent", "Unsure", "Unfavorable", "Very unfavorable"]
ai_sent_ordered = (
    ai_sent
    .with_columns(pl.col("AISent").cast(pl.Enum(sentiment_order)).alias("sent_ordered"))
    .sort("sent_ordered")
)
colors = ["#2ecc71", "#82e0aa", "#bdc3c7", "#f0b27a", "#e59866", "#e74c3c"]
fig, ax = plt.subplots(figsize=(9, 4))
ax.bar(
    ai_sent_ordered["AISent"].to_list(),
    ai_sent_ordered["count"].to_list(),
    color=colors,
)
ax.set_xlabel("Sentiment")
ax.set_ylabel("Respondents")
ax.set_title("Sentiment toward AI tools — Stack Overflow Survey 2023")
ax.tick_params(axis="x", rotation=20)
plt.tight_layout()
plt.savefig("notebooks/figures/2023_15_ai_sentiment.png", dpi=150)
plt.show()
print("Interpretation: 77.5% of respondents hold a favorable or very favorable view of AI tools. Negative sentiment is a small minority (3.3%).")

# %%
ai_ben = df["AIBen"].drop_nulls().value_counts(sort=True)
print("Trust in AI tool accuracy:")
print(ai_ben)

# %%
trust_order = ["Highly trust", "Somewhat trust", "Neither trust nor distrust", "Somewhat distrust", "Highly distrust"]
ai_ben_ordered = (
    ai_ben
    .with_columns(pl.col("AIBen").cast(pl.Enum(trust_order)).alias("trust_ordered"))
    .sort("trust_ordered")
)
colors_trust = ["#2ecc71", "#82e0aa", "#bdc3c7", "#e59866", "#e74c3c"]
fig, ax = plt.subplots(figsize=(9, 4))
ax.bar(
    ai_ben_ordered["AIBen"].to_list(),
    ai_ben_ordered["count"].to_list(),
    color=colors_trust,
)
ax.set_xlabel("Trust level")
ax.set_ylabel("Respondents")
ax.set_title("Trust in AI tool output accuracy — Stack Overflow Survey 2023")
ax.tick_params(axis="x", rotation=20)
plt.tight_layout()
plt.savefig("notebooks/figures/2023_16_ai_trust.png", dpi=150)
plt.show()
print("Interpretation: Most developers somewhat trust AI output but are not fully confident. Highly trust is the smallest group (2.8%).")

# %%
ai_cross = (
    df
    .filter(pl.col("AISelect").is_not_null() & pl.col("AISent").is_not_null())
    .group_by(["AISelect", "AISent"])
    .len(name="count")
    .sort(["AISelect", "count"], descending=[False, True])
)
print("AI usage vs sentiment:")
print(ai_cross)

# %% [markdown]
# ## 9. Sensitive Variables Audit

# %%
sensitive_columns = ["Gender", "Trans", "Sexuality", "Ethnicity", "Accessibility", "MentalHealth"]

sensitive_audit = pl.DataFrame({
    "variable": sensitive_columns,
    "present_in_2023": [col in df.columns for col in sensitive_columns],
    "present_in_2021": [True, True, True, True, True, True],
})
print("Sensitive variables audit — 2023 vs 2021:")
print(sensitive_audit)
print("\nInterpretation: All six sensitive demographic variables present in the 2021 survey are ABSENT in the 2023 edition.")
print("This is a deliberate survey design decision by Stack Overflow, not a data quality issue.")
print("The absence of Gender makes the 2023 dataset unsuitable for gender equity analysis.")

# %% [markdown]
# ## 10. Feature Feasibility Assessment

# %%
identifier_cols = {"ResponseId"}
population_cols = {"MainBranch", "Employment"}
professional_cols = {"EdLevel", "YearsCode", "YearsCodePro", "DevType", "OrgSize", "Age"}
compensation_cols = {"Currency", "CompTotal", "ConvertedCompYearly"}
remote_cols = {"RemoteWork"}
technology_cols = {c for c in df.columns if "HaveWorkedWith" in c or "WantToWorkWith" in c}
ai_cols = {
    "AISelect", "AISent", "AIAcc", "AIBen", "SOAI",
    "AIToolInterested in Using", "AIToolCurrently Using", "AIToolNot interested in Using",
    "AINextVery different", "AINextNeither different nor similar",
    "AINextSomewhat similar", "AINextVery similar", "AINextSomewhat different",
    "AISearchHaveWorkedWith", "AISearchWantToWorkWith",
    "AIDevHaveWorkedWith", "AIDevWantToWorkWith",
}
community_cols = {"NEWSOSites", "SOVisitFreq", "SOAccount", "SOPartFreq", "SOComm"}
survey_meta_cols = {"SurveyLength", "SurveyEase", "Q120"}
geographic_cols = {"Country"}

feature_rows = []
for col in df.columns:
    missing_pct = quality_table.filter(pl.col("column") == col)["missing_pct"][0]
    if col in identifier_cols:
        category, use, risk = "Identifier", "Row integrity", "Exclude from features"
    elif col in population_cols:
        category, use, risk = "Population definition", "Define analytical population", "Filtering changes population"
    elif col in professional_cols:
        category, use, risk = "Demographic/profile", "Potential predictor", "Self-report, proxy effects"
    elif col in compensation_cols:
        category, use, risk = "Compensation", "Potential predictor", "Missingness, skew, currency"
    elif col in remote_cols:
        category, use, risk = "Potential predictor", "Work modality signal", "Low cardinality, useful"
    elif col in technology_cols:
        category, use, risk = "Technology multivalue", "Technology profile", "High dimensionality, multi-hot needed"
    elif col in ai_cols:
        category, use, risk = "AI landscape (2023 exclusive)", "AI adoption context", "Not present in other years"
    elif col in community_cols:
        category, use, risk = "Community engagement", "Potential predictor", "Unclear business relevance"
    elif col in survey_meta_cols:
        category, use, risk = "Survey metadata", "Response quality", "Not a business feature"
    elif col in geographic_cols:
        category, use, risk = "Geographic", "Context", "High cardinality, bias risk"
    else:
        category, use, risk = "Not recommended", "Exploratory only", "No approved relationship with target"
    feature_rows.append({
        "feature": col,
        "category": category,
        "missing_pct": missing_pct,
        "unique_count": df[col].n_unique(),
        "potential_use": use,
        "risk": risk,
    })

feature_feasibility = pl.DataFrame(feature_rows).sort(["category", "feature"])
print("Feature feasibility assessment (all 84 columns):")
print(feature_feasibility.head(20))

# %%
category_summary = (
    feature_feasibility
    .group_by("category")
    .len(name="count")
    .sort("count", descending=True)
)
print("Feature categories summary:")
print(category_summary)

# %% [markdown]
# ## 11. Target and Dataset Suitability

# %%
required_targets = ["JobSat", "job_satisfaction"]
required_sensitive = ["Gender", "Trans", "Sexuality", "Ethnicity", "Accessibility", "MentalHealth"]

target_check = pl.DataFrame({
    "required_column": required_targets + required_sensitive,
    "type": ["target"] * 2 + ["sensitive"] * 6,
    "present_in_2023": [col in df.columns for col in required_targets + required_sensitive],
})
print("Target and sensitive variable availability:")
print(target_check)

# %%
suitability = pl.DataFrame({
    "criterion": [
        "Dataset accessible through project loader",
        "Sufficient volume for EDA (>10,000 rows)",
        "Professional and technology attributes available",
        "CSV parses correctly with standard tools",
        "Required target JobSat available",
        "Gender variable available for equity analysis",
        "Suitable for supervised model training",
    ],
    "result": [
        True,
        df.height > 10_000,
        all(c in df.columns for c in ["YearsCodePro", "DevType", "LanguageHaveWorkedWith"]),
        False,
        False,
        False,
        False,
    ],
    "note": [
        "Loaded via pandas fallback due to malformed CSV",
        f"{df.height} rows available",
        "All three present",
        "Column SOAI contains unescaped quotes — requires pandas fallback",
        "JobSat not included in 2023 survey edition",
        "Gender not included in 2023 survey edition",
        "Missing target and gender variables",
    ],
})
print("Dataset suitability assessment:")
print(suitability)

# %% [markdown]
# ## 12. Comparative Summary — 2021 vs 2023

# %%
comparison = pl.DataFrame({
    "aspect": [
        "Total respondents",
        "Total columns",
        "CSV parses with Polars",
        "JobSat / job_satisfaction",
        "Gender variable",
        "Sensitive demographic variables",
        "AI-specific columns",
        "Suitable for supervised training",
    ],
    "survey_2021": [
        "83,439", "48", "Yes", "Absent", "Present",
        "6 variables", "None", "No — missing target",
    ],
    "survey_2023": [
        "88,645", "84", "No — requires pandas fallback", "Absent", "Absent",
        "0 variables", "19 columns", "No — missing target and gender",
    ],
})
print("Comparative summary 2021 vs 2023:")
print(comparison)
print("\nConclusion: Neither the 2021 nor the 2023 dataset supports the project's supervised learning objective.")
print("The 2022 dataset is the team's selected edition for model training.")

# %% [markdown]
# ## 13. Decision Log

# %%
decision_log = pl.DataFrame({
    "decision": [
        "Use pandas fallback for 2023 CSV loading",
        "Document CSV malformed quoting as a data quality finding",
        "Retain 2023 analysis as exploratory evidence",
        "Exclude 2023 from supervised model training",
        "Confirm 2022 as the dataset for model training",
    ],
    "evidence": [
        "Column SOAI contains unescaped double quotes breaking Polars parser",
        "88,645 rows recovered via pandas engine=python, on_bad_lines=skip",
        "84 columns, rich AI landscape data, valid professional profile data",
        "JobSat and Gender both absent from the 2023 survey edition",
        "2022 contains JobSat and Gender — confirmed by team EDA",
    ],
    "consequence": [
        "load_raw_data.py updated with _PANDAS_FALLBACK_YEARS = {2023}",
        "Finding documented in SDD-04 and this notebook",
        "Notebook preserved as dataset selection evidence",
        "2023 cannot support the current supervised objective",
        "Model training proceeds with 2022 data",
    ],
})
print("Decision log:")
print(decision_log)

# %% [markdown]
# ## Executive Summary — English
#
# - **Dataset overview:** The Stack Overflow Developer Survey 2023 contains 88,645 responses
#   and 84 variables. No duplicated rows were detected.
# - **CSV quality issue:** Column `SOAI` contains unescaped double quotes that prevent standard
#   CSV parsing. A pandas fallback was implemented in `utils/load_raw_data.py`.
# - **Respondent population:** 66,259 respondents (74.7%) identify as professional developers.
# - **Professional profile:** The 25-34 age group is the largest (32,813). Bachelor's degrees
#   are the most common qualification (36,205). Full-stack is the leading developer type (25,379).
# - **Remote work:** Hybrid (30,671) and Remote (30,092) together represent 83% of professionals.
#   In-person work is a minority in 2023.
# - **Compensation:** 47,278 professionals (53.8%) have a valid positive compensation value.
#   Median is $74,963
