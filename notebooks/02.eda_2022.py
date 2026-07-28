# %% [markdown]
# # Exploratory Data Analysis — Stack Overflow Survey 2022

# %%
import sys
from pathlib import Path

ROOT = Path.cwd().parent  # sube de notebooks/ a la raíz del repo
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))
    
from utils.load_raw_data import RawData, Schema

import polars as pl
import seaborn as sns
import matplotlib.pyplot as plt
import altair as alt

data_raw = RawData(year=2022)
df = data_raw.download()

# %%
schema_raw = Schema(year=2022)
schema = schema_raw.download()
schema.select("question")

# %%
df.glimpse()

# %%
print(f"Shape: {df.shape}")
print(f"Columns ({len(df.columns)}): {df.columns}")

# %%
df.sample(10)

# %%
schema.select("qname", "question").head(79)

# %% [markdown]
# ## Missing Values

# %%
df.select(pl.all().cast(pl.String)).select(
    pl.all().is_null().or_(pl.all() == "NA").sum().name.suffix("_missing")
).unpivot(variable_name="column", value_name="missing").with_columns(
    (pl.col("missing") / df.height * 100).round(1).alias("ratio")
).filter(pl.col("missing") > 0).sort("ratio", descending=True)

# %%
df = df.drop(["VCHostingPersonal use", "VCHostingProfessional use"])
print(f"Dropped 2 empty columns. New shape: {df.shape}")

# %%
low_null_cols = ["EdLevel", "LearnCode", "SOAccount", "Employment", "Country"]
df = df.drop_nulls(subset=low_null_cols)
print(f"Dropped rows with nulls in low-missing columns. New shape: {df.shape}")

# %% [markdown]
# ## Gender Analysis

# %%
df = df.with_columns(
    pl.when(pl.col("Gender") == "Prefer not to say")
    .then(pl.lit("Prefer not to say"))
    .when(pl.col("Gender") == "NA")
    .then(None)
    .when(pl.col("Gender").is_in(["Man", "Woman"]))
    .then(pl.col("Gender"))
    .otherwise(pl.lit("Non-binary/GNC"))
    .alias("gender_clean")
)

# %%
df["gender_clean"].value_counts().sort("count", descending=True)

# %%
df.group_by("gender_clean").agg(
    pl.len().alias("count"),
    pl.col("Employment")
    .value_counts()
    .first()
    .struct.field("Employment")
    .alias("top_employment"),
    pl.col("ConvertedCompYearly")
    .cast(pl.Float64, strict=False)
    .mean()
    .round(0)
    .alias("avg_comp"),
    pl.col("YearsCodePro")
    .cast(pl.Float64, strict=False)
    .mean()
    .round(1)
    .alias("avg_years_exp"),
)

# %%
df.group_by("gender_clean", "Employment").agg(pl.len().alias("count")).sort(
    "gender_clean", "count", descending=[False, True]
)

# %%
df.group_by("gender_clean", "RemoteWork").agg(pl.len().alias("count")).sort(
    "gender_clean", "count", descending=[False, True]
)

# %%
df.group_by("gender_clean", "MentalHealth").agg(pl.len().alias("count")).sort(
    "gender_clean", "count", descending=[False, True]
)

# %% [markdown]
# ## Mental Health Classification
#
# > **Caveat:** The survey checkbox `"mood or emotional disorder (e.g., depression, bipolar, etc.)"`
# > contains both `depression` and `bipolar` as examples, so keyword matching flags that
# > response under both categories. Free-text answers are more precise.

# %%
def classify_mental_health(df, group_by=None):
    keywords = {
        "Depression": ["depression"],
        "Bipolar": ["bipolar"],
        "Anxiety": ["anxiety"],
        "ADHD": ["adhd", "concentration", "memory disorder"],
        "Autism": ["autism", "asperger"],
        "Dyslexia": ["dyslex", "learning differences"],
        "Mood disorder": ["mood"],
    }

    mh = df.filter(
        pl.col("MentalHealth").is_not_null()
        & (pl.col("MentalHealth") != "NA")
        & (pl.col("MentalHealth") != "Prefer not to say")
        & (pl.col("MentalHealth") != "None of the above")
    ).with_columns(pl.col("MentalHealth").str.to_lowercase())

    for cat, kw_list in keywords.items():
        cond = pl.lit(False)
        for kw in kw_list:
            cond = cond.or_(pl.col("MentalHealth").str.contains(kw, literal=True))
        mh = mh.with_columns(cond.alias(cat))

    by = [group_by] if group_by else []
    result = (
        mh.group_by(by)
        .agg(
            pl.len().alias("Total"),
            *(pl.col(cat).sum().alias(cat) for cat in keywords),
        )
        .sort(by)
    )

    total_col = "Total_respondents"
    grand_total = mh.height
    result = result.with_columns(pl.lit(grand_total).alias(total_col))
    for cat in keywords:
        result = result.with_columns(
            (pl.col(cat) / pl.col(total_col) * 100).round(1).alias(f"{cat} %")
        )

    return result

# %%
classify_mental_health(df)

# %%
classify_mental_health(df, group_by="gender_clean")

# %% [markdown]
# ## Mental Health — Visualizations

# %%
keywords = ["Depression", "Bipolar", "Anxiety", "ADHD", "Autism", "Dyslexia", "Mood disorder"]
mh = df.filter(
    pl.col("MentalHealth").is_not_null()
    & (pl.col("MentalHealth") != "NA")
    & (pl.col("MentalHealth") != "Prefer not to say")
    & (pl.col("MentalHealth") != "None of the above")
).with_columns(pl.col("MentalHealth").str.to_lowercase())

keyword_map = {
    "Depression": ["depression"],
    "Bipolar": ["bipolar"],
    "Anxiety": ["anxiety"],
    "ADHD": ["adhd", "concentration", "memory disorder"],
    "Autism": ["autism", "asperger"],
    "Dyslexia": ["dyslex", "learning differences"],
    "Mood disorder": ["mood"],
}
for cat, kw_list in keyword_map.items():
    cond = pl.lit(False)
    for kw in kw_list:
        cond = cond.or_(pl.col("MentalHealth").str.contains(kw, literal=True))
    mh = mh.with_columns(cond.alias(cat))

overall = {cat: mh[cat].sum() for cat in keywords}
overall_df = pl.DataFrame(
    {"Condition": list(overall.keys()), "Count": list(overall.values())}
).sort("Count", descending=True)

# %%
sns.set_theme(style="whitegrid")
fig, ax = plt.subplots(figsize=(10, 5))
sns.barplot(
    data=overall_df.to_pandas(),
    x="Count",
    y="Condition",
    hue="Condition",
    palette="viridis",
    legend=False,
)
ax.set_title("Mental Health Conditions — Overall Counts", fontsize=14)
ax.set_xlabel("Respondents")
plt.tight_layout()
plt.show()

# %%
mh = mh.with_columns(
    pl.when(pl.col("Gender") == "Prefer not to say")
    .then(pl.lit("Prefer not to say"))
    .when(pl.col("Gender") == "NA")
    .then(None)
    .when(pl.col("Gender").is_in(["Man", "Woman"]))
    .then(pl.col("Gender"))
    .otherwise(pl.lit("Non-binary/GNC"))
    .alias("gender_clean")
)

gender_long = []
for cat in keywords:
    for g in ["Man", "Woman", "Non-binary/GNC"]:
        count = mh.filter((pl.col("gender_clean") == g) & pl.col(cat)).height
        gender_long.append({"Condition": cat, "Gender": g, "Count": count})
gender_df = pl.DataFrame(gender_long)

alt.Chart(gender_df.to_pandas()).mark_bar(opacity=0.85).encode(
    x=alt.X("Condition:N", title="", sort=overall_df["Condition"].to_list()),
    y=alt.Y("Count:Q", title="Respondents"),
    color=alt.Color("Gender:N", scale=alt.Scale(scheme="set2")),
    xOffset="Gender:N",
    tooltip=["Condition", "Gender", "Count"],
).properties(
    width=700, height=400, title="Mental Health Conditions by Gender"
).interactive()

# %%
cooc = pl.DataFrame(
    {
        c1: [mh.filter(pl.col(c1) & pl.col(c2)).height for c2 in keywords]
        for c1 in keywords
    },
    schema=keywords,
)
cooc_pd = cooc.to_pandas().set_axis(keywords, axis=0)

fig, ax = plt.subplots(figsize=(9, 7))
sns.heatmap(cooc_pd, annot=True, fmt="d", cmap="YlOrRd", ax=ax)
ax.set_title("Condition Co-occurrence — Respondents with Both", fontsize=13)
plt.tight_layout()
plt.show()

# %%
gender_totals = (
    mh.group_by("gender_clean")
    .agg(pl.len().alias("total"))
    .filter(pl.col("gender_clean").is_not_null())
)

gender_pct = []
for cat in keywords:
    for g in ["Man", "Woman", "Non-binary/GNC"]:
        total = gender_totals.filter(pl.col("gender_clean") == g)["total"].item()
        count = mh.filter((pl.col("gender_clean") == g) & pl.col(cat)).height
        gender_pct.append({"Condition": cat, "Gender": g, "Percentage": round(count / total * 100, 1)})
gender_pct_df = pl.DataFrame(gender_pct)

alt.Chart(gender_pct_df.to_pandas()).mark_bar(opacity=0.85).encode(
    x=alt.X("Condition:N", title="", sort=overall_df["Condition"].to_list()),
    y=alt.Y("Percentage:Q", title="% of gender group", axis=alt.Axis(format=".1f")),
    color=alt.Color("Gender:N", scale=alt.Scale(scheme="set2")),
    xOffset="Gender:N",
    tooltip=["Condition", "Gender", "Percentage"],
).properties(
    width=700, height=400, title="% of Each Gender Group Reporting Each Condition"
).interactive()

# %%
cond_totals = {cat: mh[cat].sum() for cat in keywords}
gender_within = []
for cat in keywords:
    for g in ["Man", "Woman", "Non-binary/GNC"]:
        count = mh.filter((pl.col("gender_clean") == g) & pl.col(cat)).height
        pct = round(count / cond_totals[cat] * 100, 1) if cond_totals[cat] else 0
        gender_within.append({"Condition": cat, "Gender": g, "Percentage": pct})
gender_within_df = pl.DataFrame(gender_within)

alt.Chart(gender_within_df.to_pandas()).mark_bar(opacity=0.85).encode(
    x=alt.X("Condition:N", title="", sort=overall_df["Condition"].to_list()),
    y=alt.Y("Percentage:Q", title="% of condition's respondents"),
    color=alt.Color("Gender:N", scale=alt.Scale(scheme="set2")),
    xOffset="Gender:N",
    tooltip=["Condition", "Gender", "Percentage"],
).properties(
    width=700, height=400, title="Gender Makeup Within Each Condition"
).interactive()

# %% [markdown]
# ## Mental Health by Experience & Demographics

# %%
mh = mh.with_columns(
    pl.col("YearsCodePro").cast(pl.Float64, strict=False).alias("yrs")
).with_columns(
    pl.when(pl.col("yrs").is_null()).then(pl.lit(None))
    .when(pl.col("yrs") <= 2).then(pl.lit("0-2 yrs"))
    .when(pl.col("yrs") <= 5).then(pl.lit("3-5 yrs"))
    .when(pl.col("yrs") <= 10).then(pl.lit("6-10 yrs"))
    .when(pl.col("yrs") <= 20).then(pl.lit("11-20 yrs"))
    .otherwise(pl.lit("20+ yrs"))
    .alias("exp_bucket")
)

exp_data = []
for cat in keywords:
    for b in ["0-2 yrs", "3-5 yrs", "6-10 yrs", "11-20 yrs", "20+ yrs"]:
        count = mh.filter((pl.col("exp_bucket") == b) & pl.col(cat)).height
        exp_data.append({"Condition": cat, "Experience": b, "Count": count})
exp_df = pl.DataFrame(exp_data)

alt.Chart(exp_df.to_pandas()).mark_bar(opacity=0.85).encode(
    x=alt.X("Experience:N", title="", sort=["0-2 yrs", "3-5 yrs", "6-10 yrs", "11-20 yrs", "20+ yrs"]),
    y=alt.Y("Count:Q", title="Respondents"),
    color=alt.Color("Condition:N", scale=alt.Scale(scheme="viridis")),
    xOffset="Condition:N",
    tooltip=["Condition", "Experience", "Count"],
).properties(
    width=600, height=400, title="Mental Health Conditions by Years of Experience"
).interactive()

# %%
age_data = []
for cat in keywords:
    for a in ["Under 18 years old", "18-24 years old", "25-34 years old",
              "35-44 years old", "45-54 years old", "55-64 years old", "65 years or older"]:
        count = mh.filter((pl.col("Age") == a) & pl.col(cat)).height
        age_data.append({"Condition": cat, "Age": a, "Count": count})
age_df = pl.DataFrame(age_data)

alt.Chart(age_df.to_pandas()).mark_bar(opacity=0.85).encode(
    x=alt.X("Age:N", title="", sort=[
        "Under 18 years old", "18-24 years old", "25-34 years old",
        "35-44 years old", "45-54 years old", "55-64 years old", "65 years or older"
    ]),
    y=alt.Y("Count:Q", title="Respondents"),
    color=alt.Color("Condition:N", scale=alt.Scale(scheme="viridis")),
    xOffset="Condition:N",
    tooltip=["Condition", "Age", "Count"],
).properties(
    width=700, height=400, title="Mental Health Conditions by Age Group"
).interactive()

# %%
remote_data = []
for cat in keywords:
    for r in ["Fully remote", "Hybrid (some remote, some in-person)"]:
        count = mh.filter((pl.col("RemoteWork") == r) & pl.col(cat)).height
        remote_data.append({"Condition": cat, "RemoteWork": r, "Count": count})
remote_df = pl.DataFrame(remote_data)

alt.Chart(remote_df.to_pandas()).mark_bar(opacity=0.85).encode(
    x=alt.X("RemoteWork:N", title="", sort=["Fully remote", "Hybrid (some remote, some in-person)"]),
    y=alt.Y("Count:Q", title="Respondents"),
    color=alt.Color("Condition:N", scale=alt.Scale(scheme="viridis")),
    xOffset="Condition:N",
    tooltip=["Condition", "RemoteWork", "Count"],
).properties(
    width=500, height=400, title="Mental Health Conditions by Remote Work"
).interactive()
