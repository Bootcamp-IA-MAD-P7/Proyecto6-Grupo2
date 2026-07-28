# %% [markdown]
# # Exploratory Data Analysis — Stack Overflow Survey 2021

# %% [markdown]
# ## 1. Project Overview
#
# This notebook documents the exploratory assessment of the Stack Overflow
# Developer Survey 2021. It evaluates the dataset structure, data quality,
# respondent population, professional attributes, compensation, technology
# usage, sensitive variables, and feature feasibility.
#
# This phase is descriptive. It does not train a model or create production
# preprocessing artifacts. Its final purpose is to determine whether the 2021
# survey supports the supervised objective defined by the project.

# %%
import sys
from pathlib import Path

ROOT = Path.cwd().parent  # sube de notebooks/ a la raíz del repo
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

# Ensure Polars tables render correctly in Windows terminals.
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

# Configure the project root so imports work regardless of the execution path.
ROOT = Path(__file__).resolve().parents[1]

if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

# %%
import os
import matplotlib
import polars as pl


def get_interactive_shell():
    """Return the active IPython shell, if the file runs interactively."""
    try:
        return get_ipython()
    except NameError:
        return None


INTERACTIVE_SHELL = get_interactive_shell()
INTERACTIVE_SESSION = INTERACTIVE_SHELL is not None

if INTERACTIVE_SESSION:
    # VS Code Interactive and Jupyter provide the inline backend through IPython.
    INTERACTIVE_SHELL.run_line_magic("matplotlib", "inline")
elif "MPLBACKEND" not in os.environ:
    # Normal script execution must not depend on a local Tcl/Tk installation.
    matplotlib.use("Agg")


import matplotlib.pyplot as plt


from utils.load_raw_data import RawData

# %% [markdown]
# ### Validated data loading
#
# The dataset is retrieved using the project's ingestion utility to ensure
# consistency across the data pipeline.

# %%
data_raw = RawData(year=2021)
df = data_raw.download()

# %% [markdown]
# ### Initial inspection
#
# A compact sample is displayed to verify that the download is readable without
# printing the full width or raw contents of the survey.

# %%
sample_columns = [
    "ResponseId",
    "MainBranch",
    "Employment",
    "Country",
    "EdLevel",
    "YearsCodePro",
    "DevType",
    "ConvertedCompYearly",
]
initial_sample = df.select(sample_columns).sample(5, seed=42)
print("Compact sample:")
print(initial_sample)

# %%
print(f"Shape: {df.shape}")
print(f"Columns ({len(df.columns)}):")
print(df.columns)

# %%
def add_value_labels(ax: plt.Axes) -> None:
    """Add compact values to the end of horizontal bars."""
    for patch in ax.patches:
        width = patch.get_width()
        ax.annotate(
            f"{width:,.1f}",
            (width, patch.get_y() + patch.get_height() / 2),
            xytext=(4, 0),
            textcoords="offset points",
            va="center",
            fontsize=8,
        )


def finalize_figure(fig: plt.Figure) -> None:
    """Display in notebook sessions and render silently in script sessions."""
    fig.tight_layout()
    interactive_session = get_interactive_shell() is not None
    backend = matplotlib.get_backend().lower()
    non_interactive_backends = {
        "agg",
        "cairo",
        "pdf",
        "pgf",
        "ps",
        "svg",
        "template",
    }
    headless_backend = any(
        backend == name or backend.endswith(f"backend_{name}")
        for name in non_interactive_backends
    )

    if interactive_session and not headless_backend:
        # Keep the figure open long enough for VS Code/Jupyter to publish it.
        plt.show()
        return

    # Headless and normal script execution render without opening GUI windows.
    fig.canvas.draw()
    plt.close(fig)


def print_concise_table(
    title: str,
    table: pl.DataFrame,
    *,
    max_rows: int = 15,
) -> None:
    """Print an auditable preview without flooding script output."""
    print(title)
    if table.height <= max_rows:
        print(table)
        return

    print(table.head(max_rows))
    print(
        f"Showing {max_rows:,} of {table.height:,} rows; "
        "the complete Polars DataFrame remains available in the notebook."
    )


def horizontal_bar_chart(
    table: pl.DataFrame,
    category_column: str,
    value_column: str,
    title: str,
    x_label: str,
    *,
    figure_height: float = 6.0,
    add_labels: bool = True,
    sort_by_value: bool = True,
) -> None:
    """Plot a small aggregated Polars table as an ordered horizontal chart."""
    if (
        table.is_empty()
        or category_column not in table.columns
        or value_column not in table.columns
    ):
        print(f"Chart skipped because no data is available: {title}")
        return

    plot_table = table.select(
        [category_column, value_column]
    ).drop_nulls()
    if sort_by_value:
        plot_table = plot_table.sort(value_column)

    if plot_table.is_empty():
        print(f"Chart skipped because no valid data is available: {title}")
        return

    fig, ax = plt.subplots(figsize=(10, figure_height))
    category_labels = [
        value.replace("\t", " ")
        for value in plot_table[category_column]
        .cast(pl.String)
        .to_list()
    ]
    ax.barh(
        category_labels,
        plot_table[value_column].to_list(),
    )
    ax.set_title(title)
    ax.set_xlabel(x_label)
    ax.set_ylabel("")
    if add_labels:
        add_value_labels(ax)
    finalize_figure(fig)


def plot_histogram(
    values: pl.Series,
    title: str,
    x_label: str,
    *,
    bins: int = 30,
) -> None:
    """Plot valid values from a Polars Series without converting the dataset."""
    clean_values = values.drop_nulls()
    if clean_values.is_empty():
        print(f"Histogram skipped because no data is available: {title}")
        return

    fig, ax = plt.subplots(figsize=(10, 5))
    ax.hist(clean_values.to_list(), bins=bins)
    ax.set_title(title)
    ax.set_xlabel(x_label)
    ax.set_ylabel("Respondents")
    finalize_figure(fig)


def plot_horizontal_boxplot(
    values: pl.Series,
    title: str,
    x_label: str,
) -> None:
    """Plot a horizontal boxplot from a small analytical Series."""
    clean_values = values.drop_nulls()
    if clean_values.is_empty():
        print(f"Boxplot skipped because no data is available: {title}")
        return

    fig, ax = plt.subplots(figsize=(10, 3))
    ax.boxplot(clean_values.to_list(), orientation="horizontal")
    ax.set_title(title)
    ax.set_xlabel(x_label)
    ax.set_yticks([])
    finalize_figure(fig)

# %% [markdown]
# ## 2. Dataset Overview
#
# This section documents the dimensions, schema, identifier integrity, and
# overall composition of the 2021 survey before any analytical filtering.

# %%
overview = pl.DataFrame(
    {
        "metric": [
            "rows",
            "columns",
            "duplicated_rows",
            "unique_response_ids",
            "duplicated_response_ids",
        ],
        "value": [
            df.height,
            df.width,
            int(df.is_duplicated().sum()),
            df["ResponseId"].n_unique(),
            int(df["ResponseId"].is_duplicated().sum()),
        ],
    }
)
print("Dataset overview:")
print(overview)

# %%
schema_overview = pl.DataFrame(
    {
        "column": df.columns,
        "dtype": [str(dtype) for dtype in df.dtypes],
    }
)

dtype_summary = (
    schema_overview.group_by("dtype").len().sort("len", descending=True)
)
print("Data type summary:")
print(dtype_summary)

# %%
print_concise_table("Schema preview:", schema_overview, max_rows=12)

# %% [markdown]
# **Interpretation.** The survey contains 83,439 responses and 48 variables.
# `ResponseId` uniquely identifies the responses, and there are no duplicated
# rows. Except for the identifier, the downloaded CSV is represented as string
# data, so numeric-looking fields require explicit interpretation before
# quantitative analysis.

# %% [markdown]
# ## 3. Data Quality Assessment
#
# The source uses the literal string `NA` in many fields instead of a native
# null value. Native nulls, `NA`, empty strings, and whitespace-only strings are
# counted separately. The original DataFrame remains unchanged.

# %%
string_columns = [
    column
    for column, dtype in df.schema.items()
    if dtype == pl.String
]

null_counts = df.null_count().row(0, named=True)
unique_counts = df.select(pl.all().n_unique()).row(0, named=True)
na_counts = df.select(
    [
        (pl.col(column) == "NA").sum().alias(column)
        for column in string_columns
    ]
).row(0, named=True)
empty_counts = df.select(
    [
        (pl.col(column) == "").sum().alias(column)
        for column in string_columns
    ]
).row(0, named=True)
whitespace_counts = df.select(
    [
        (
            (pl.col(column) != "")
            & (pl.col(column).str.strip_chars() == "")
        )
        .sum()
        .alias(column)
        for column in string_columns
    ]
).row(0, named=True)

quality_rows = []
for column in df.columns:
    actual_null_count = null_counts[column]
    na_string_count = na_counts.get(column, 0)
    empty_string_count = empty_counts.get(column, 0)
    whitespace_only_count = whitespace_counts.get(column, 0)
    total_missing_count = (
        actual_null_count
        + na_string_count
        + empty_string_count
        + whitespace_only_count
    )

    quality_rows.append(
        {
            "column": column,
            "dtype": str(df.schema[column]),
            "actual_null_count": actual_null_count,
            "na_string_count": na_string_count,
            "empty_string_count": empty_string_count,
            "whitespace_only_count": whitespace_only_count,
            "total_missing_count": total_missing_count,
            "missing_percentage": round(
                total_missing_count * 100 / df.height,
                2,
            ),
            "unique_count": unique_counts[column],
        }
    )

quality_table = pl.DataFrame(quality_rows)
quality_table.sort(
    ["missing_percentage", "unique_count"],
    descending=[True, True],
)

# %%
quality_display = quality_table.sort(
    ["missing_percentage", "unique_count"],
    descending=[True, True],
)
print_concise_table(
    "Data quality summary, highest missingness first:",
    quality_display,
    max_rows=15,
)

# %%
columns_with_missing = quality_table.filter(
    pl.col("total_missing_count") > 0
).select(
    [
        "column",
        "actual_null_count",
        "na_string_count",
        "empty_string_count",
        "whitespace_only_count",
        "total_missing_count",
        "missing_percentage",
        "unique_count",
    ]
).sort("missing_percentage", descending=True)
print_concise_table(
    "Columns containing missing-value representations:",
    columns_with_missing,
    max_rows=15,
)

# %%
top_missing_columns = (
    quality_table.filter(pl.col("missing_percentage") > 0)
    .sort("missing_percentage", descending=True)
    .head(15)
)

horizontal_bar_chart(
    top_missing_columns,
    "column",
    "missing_percentage",
    "Columns with the highest missing-value percentages",
    "Missing values (%)",
    figure_height=7,
)

# %% [markdown]
# **Chart interpretation.** The largest missing percentages are concentrated in
# geographically conditional fields such as `US_State` and `UK_Country`, and
# in optional technology, compensation, and demographic questions. Some
# absence is therefore structural: a state field is not applicable outside its
# country, and compensation is not requested or meaningful for every
# respondent. Nevertheless, the literal `NA` must be normalized as missing
# during later preprocessing; treating it as a real category would distort
# frequencies and model inputs.

# %%
numeric_like_columns = [
    "YearsCode",
    "YearsCodePro",
    "CompTotal",
    "ConvertedCompYearly",
]

for column in numeric_like_columns:
    print(f"\n{column}")
    print(
        df.group_by(column)
        .len()
        .sort("len", descending=True)
        .head(8)
    )

# %% [markdown]
# **Interpretation.** A native-null-only check would incorrectly suggest that
# the dataset is complete. In practice, several professional and compensation
# variables contain substantial numbers of encoded `NA` values. Experience and
# compensation are strings and include non-numeric categories, so they cannot
# be cast safely without explicit rules. These findings are recorded here but
# no production cleaning pipeline is created in this notebook.

# %% [markdown]
# ## 4. Population Definition
#
# The survey covers more than currently employed professional developers. It
# also includes students, hobbyists, unemployed respondents, and people who no
# longer work as developers. The distributions below make that population mix
# explicit and define an analytical professional subset without modifying the
# original DataFrame.

# %%
def frequency_table(
    frame: pl.DataFrame,
    column: str,
    limit: int | None = None,
) -> pl.DataFrame:
    result = (
        frame.group_by(column)
        .len()
        .with_columns(
            (pl.col("len") * 100 / frame.height)
            .round(2)
            .alias("percentage")
        )
        .sort("len", descending=True)
    )
    return result.head(limit) if limit is not None else result


main_branch_distribution = frequency_table(df, "MainBranch")
print("MainBranch distribution:")
print(main_branch_distribution)

# %%
horizontal_bar_chart(
    main_branch_distribution,
    "MainBranch",
    "percentage",
    "Respondents by primary relationship with coding",
    "Respondents (%)",
    figure_height=5,
)

# %% [markdown]
# **MainBranch interpretation.** Professional developers form the largest
# group, but the survey also contains students, hobbyists, former developers,
# and people who code only as part of another job. Analyses about professional
# work cannot assume that every survey response belongs to the target
# population.

# %%
employment_distribution = frequency_table(df, "Employment")
print("Employment distribution:")
print(employment_distribution)

# %%
horizontal_bar_chart(
    employment_distribution,
    "Employment",
    "percentage",
    "Respondents by employment status",
    "Respondents (%)",
    figure_height=6,
)

# %% [markdown]
# **Employment interpretation.** Full-time employment dominates, while
# students, independent professionals, part-time employees, unemployed people,
# and retirees are also represented. Employment status must therefore be part
# of any explicit population rule used in a future modeling dataset.

# %%
professional_developer = (
    pl.col("MainBranch") == "I am a developer by profession"
)
active_employment = pl.col("Employment").is_in(
    [
        "Employed full-time",
        "Employed part-time",
        "Independent contractor, freelancer, or self-employed",
    ]
)

professional_population = df.filter(
    professional_developer & active_employment
)

population_summary = pl.DataFrame(
    {
        "population": [
            "All survey respondents",
            "Developers by profession",
            "Professionals in active employment",
        ],
        "rows": [
            df.height,
            df.filter(professional_developer).height,
            professional_population.height,
        ],
    }
).with_columns(
    (pl.col("rows") * 100 / df.height)
    .round(2)
    .alias("percentage_of_survey")
)

print("Analytical population summary:")
print(population_summary)

# %% [markdown]
# **Interpretation.** The full survey is not equivalent to an employed
# developer population. For descriptive analyses of work, organization, and
# compensation, the notebook uses respondents who identify as professional
# developers and report active employment. This is an analytical definition
# for the EDA only, not a production filtering decision.

# %% [markdown]
# ## 5. Professional Profile
#
# The professional subset is described through education, experience, role,
# organization size, country, and age. Multi-select job roles are separated so
# that individual roles are counted rather than entire response combinations.

# %%
age_order = [
    "NA",
    "Prefer not to say",
    "Under 18 years old",
    "18-24 years old",
    "25-34 years old",
    "35-44 years old",
    "45-54 years old",
    "55-64 years old",
    "65 years or older",
]
age_distribution = (
    pl.DataFrame(
        {
            "Age": age_order,
            "age_order": list(range(len(age_order))),
        }
    )
    .join(
        frequency_table(professional_population, "Age"),
        on="Age",
        how="left",
    )
    .with_columns(
        [
            pl.col("len").fill_null(0),
            pl.col("percentage").fill_null(0),
        ]
    )
    .sort("age_order")
)
print("Ordered age distribution:")
print(age_distribution)

# %%
horizontal_bar_chart(
    age_distribution,
    "Age",
    "percentage",
    "Age distribution of the professional population",
    "Professional respondents (%)",
    figure_height=5,
    sort_by_value=False,
)

# %% [markdown]
# **Age interpretation.** The professional sample is concentrated in the
# working-age groups from 25 to 44, with much smaller representation at older
# ages. Results for sparsely represented age groups will be less stable and
# should not be generalized beyond the voluntary survey sample.

# %%
education_distribution = frequency_table(
    professional_population,
    "EdLevel",
)
print("Education-level distribution:")
print(education_distribution)

# %%
horizontal_bar_chart(
    education_distribution,
    "EdLevel",
    "percentage",
    "Education levels among professional respondents",
    "Professional respondents (%)",
    figure_height=7,
)

# %% [markdown]
# **Education interpretation.** University degrees are common, but the survey
# also contains substantial representation from alternative educational paths.
# `EdLevel` is ordinal only in part; later preprocessing would require an
# explicit mapping rather than treating the labels as naturally numeric.

# %%
years_code_expression = (
    pl.when(pl.col("YearsCode") == "NA")
    .then(None)
    .when(pl.col("YearsCode") == "Less than 1 year")
    .then(0.5)
    .when(pl.col("YearsCode") == "More than 50 years")
    .then(51.0)
    .otherwise(pl.col("YearsCode").cast(pl.Float64, strict=False))
    .alias("YearsCodeNumeric")
)

experience_expression = (
    pl.when(pl.col("YearsCodePro") == "NA")
    .then(None)
    .when(pl.col("YearsCodePro") == "Less than 1 year")
    .then(0.5)
    .when(pl.col("YearsCodePro") == "More than 50 years")
    .then(51.0)
    .otherwise(
        pl.col("YearsCodePro").cast(pl.Float64, strict=False)
    )
    .alias("YearsCodeProNumeric")
)

professional_profile = professional_population.with_columns(
    [years_code_expression, experience_expression]
)

def numerical_summary(
    frame: pl.DataFrame,
    column: str,
) -> pl.DataFrame:
    """Return a compact descriptive summary for a numeric EDA column."""
    return frame.select(
        [
            pl.col(column).count().alias("count"),
            pl.col(column).mean().round(2).alias("mean"),
            pl.col(column).median().alias("median"),
            pl.col(column).std().round(2).alias("standard_deviation"),
            pl.col(column).min().alias("minimum"),
            pl.col(column).quantile(0.10).alias("p10"),
            pl.col(column).quantile(0.25).alias("p25"),
            pl.col(column).quantile(0.75).alias("p75"),
            pl.col(column).quantile(0.90).alias("p90"),
            pl.col(column).max().alias("maximum"),
        ]
    ).with_columns(pl.lit(column).alias("variable")).select(
        ["variable", pl.exclude("variable")]
    )


years_code_statistics = numerical_summary(
    professional_profile,
    "YearsCodeNumeric",
)
years_code_pro_statistics = numerical_summary(
    professional_profile,
    "YearsCodeProNumeric",
)
experience_statistics = pl.concat(
    [years_code_statistics, years_code_pro_statistics]
)
print("Coding-experience descriptive statistics:")
print(experience_statistics)

# %%
plot_histogram(
    professional_profile["YearsCodeNumeric"],
    "Years coding among professional respondents",
    "Years coding (0.5 = less than one year; 51 = more than 50)",
    bins=30,
)

# %% [markdown]
# **YearsCode interpretation.** General coding experience spans from newcomers
# to respondents with more than 50 years of practice. The temporary values
# `0.5` and `51` preserve the ordering of the two boundary labels for
# description only; they are not permanent feature-engineering decisions.

# %%
plot_histogram(
    professional_profile["YearsCodeProNumeric"],
    "Professional coding experience",
    "Professional years (0.5 = less than one year; 51 = more than 50)",
    bins=30,
)

# %% [markdown]
# **YearsCodePro interpretation.** Professional experience is more concentrated
# at lower values than total coding experience and contains meaningful
# non-response. The distinction between total and professional experience
# should be retained because the two variables describe different career
# histories.

# %%
professional_roles = (
    professional_population.select(
        pl.col("DevType").str.split(";").alias("role")
    )
    .explode("role", empty_as_null=True)
    .with_columns(pl.col("role").str.strip_chars())
    .filter(
        pl.col("role").is_not_null()
        & (pl.col("role") != "NA")
        & (pl.col("role") != "")
    )
    .group_by("role")
    .len()
    .with_columns(
        (pl.col("len") * 100 / professional_population.height)
        .round(2)
        .alias("percentage_of_professionals")
    )
    .sort("len", descending=True)
)

top_professional_roles = professional_roles.head(15)
print("Top developer roles:")
print(top_professional_roles)

# %%
horizontal_bar_chart(
    top_professional_roles,
    "role",
    "percentage_of_professionals",
    "Top developer roles",
    "Professional respondents selecting the role (%)",
    figure_height=7,
)

# %% [markdown]
# **Role interpretation.** Full-stack, back-end, and front-end roles are among
# the most frequent selections. Because respondents may select several roles,
# percentages describe respondent prevalence and are not expected to sum to
# 100%. The exploded roles avoid treating each combination as a separate class.

# %%
organization_size_distribution = frequency_table(
    professional_population,
    "OrgSize",
)
print("Organization-size distribution:")
print(organization_size_distribution)

# %%
horizontal_bar_chart(
    organization_size_distribution,
    "OrgSize",
    "percentage",
    "Organization size among professional respondents",
    "Professional respondents (%)",
    figure_height=7,
)

# %% [markdown]
# **Organization-size interpretation.** Professionals work across organizations
# ranging from sole proprietorships to enterprises with more than 10,000
# employees. The categories are ordered ranges rather than precise counts and
# include non-response, so they require deliberate ordinal handling.

# %%
top_countries = frequency_table(
    professional_population,
    "Country",
    limit=15,
)
print("Top countries:")
print(top_countries)

# %%
horizontal_bar_chart(
    top_countries,
    "Country",
    "percentage",
    "Top 15 countries by professional respondent count",
    "Professional respondents (%)",
    figure_height=7,
)

# %% [markdown]
# **Country interpretation.** The professional sample is geographically broad
# but unevenly distributed, with a limited number of countries contributing a
# large share of responses. Global comparisons may therefore reflect survey
# participation patterns as well as real workforce differences.

# %% [markdown]
# **Interpretation.** The professional population is diverse across education,
# experience, roles, organization sizes, and countries. `DevType` is a
# multi-select field and must not be treated as thousands of independent
# combined categories. Geographic concentration and uneven group sizes should
# be considered when interpreting global summaries.

# %% [markdown]
# ## 6. Compensation Analysis
#
# `CompTotal` records compensation in the reported currency and frequency,
# while `ConvertedCompYearly` is the survey's annualized converted value.
# Temporary numeric columns are created for description only. No outliers are
# removed from the source DataFrame.

# %%
compensation_temporary = professional_population.with_columns(
    [
        pl.col("CompTotal")
        .cast(pl.Float64, strict=False)
        .alias("comp_total_numeric"),
        pl.col("ConvertedCompYearly")
        .cast(pl.Float64, strict=False)
        .alias("annual_compensation"),
    ]
)

compensation = compensation_temporary.filter(
        pl.col("annual_compensation").is_not_null()
        & (pl.col("annual_compensation") > 0)
)

compensation_coverage = pl.DataFrame(
    [
        {
            "variable": source_column,
            "valid_value_count": compensation_temporary[
                numeric_column
            ].drop_nulls().len(),
            "missing_value_count": (
                professional_population.height
                - compensation_temporary[
                    numeric_column
                ].drop_nulls().len()
            ),
            "coverage_percentage": round(
                compensation_temporary[
                    numeric_column
                ].drop_nulls().len()
                * 100
                / professional_population.height,
                2,
            ),
        }
        for source_column, numeric_column in [
            ("CompTotal", "comp_total_numeric"),
            ("ConvertedCompYearly", "annual_compensation"),
        ]
    ]
)
print("Compensation coverage:")
print(compensation_coverage)

# %%
def compensation_summary(
    frame: pl.DataFrame,
    column: str,
) -> pl.DataFrame:
    return frame.select(
        [
            pl.col(column).count().alias("count"),
            pl.col(column).mean().round(2).alias("mean"),
            pl.col(column).std().round(2).alias("standard_deviation"),
            pl.col(column).min().alias("minimum"),
            pl.col(column).quantile(0.25).alias("p25"),
            pl.col(column).quantile(0.50).alias("p50"),
            pl.col(column).quantile(0.75).alias("p75"),
            pl.col(column).quantile(0.90).alias("p90"),
            pl.col(column).quantile(0.95).alias("p95"),
            pl.col(column).quantile(0.99).alias("p99"),
            pl.col(column).max().alias("maximum"),
        ]
    ).with_columns(pl.lit(column).alias("variable")).select(
        ["variable", pl.exclude("variable")]
    )


compensation_statistics = pl.concat(
    [
        compensation_summary(
            compensation_temporary,
            "comp_total_numeric",
        ),
        compensation_summary(
            compensation_temporary,
            "annual_compensation",
        ),
    ]
)
print("Compensation descriptive statistics:")
print(compensation_statistics)

# %% [markdown]
# **Coverage interpretation.** Compensation is optional and is unavailable for
# a meaningful share of the professional subset. `CompTotal` is not directly
# comparable internationally because its meaning depends on `Currency` and
# `CompFreq`. `ConvertedCompYearly` is preferable for broad comparisons, but it
# remains self-reported and subject to survey conversion rules.

# %%
compensation_frequency_distribution = frequency_table(
    professional_population,
    "CompFreq",
)
print("Compensation-frequency distribution:")
print(compensation_frequency_distribution)

# %%
horizontal_bar_chart(
    compensation_frequency_distribution,
    "CompFreq",
    "percentage",
    "Reported compensation frequency",
    "Professional respondents (%)",
    figure_height=4,
)

# %% [markdown]
# **CompFreq interpretation.** Monthly and yearly reporting are both common,
# while non-response remains substantial. Raw `CompTotal` values cannot be
# compared without respecting this frequency field.

# %%
top_currencies = frequency_table(
    professional_population.filter(pl.col("Currency") != "NA"),
    "Currency",
    limit=15,
)
print("Top reported currencies:")
print(top_currencies)

# %%
horizontal_bar_chart(
    top_currencies,
    "Currency",
    "percentage",
    "Top reported compensation currencies",
    "Respondents with a reported currency (%)",
    figure_height=7,
)

# %% [markdown]
# **Currency interpretation.** The range of currencies confirms that
# `CompTotal` reflects different monetary units and labor markets. Even after
# conversion, cross-country differences should be interpreted as contextual
# patterns rather than individual outcomes.

# %%
annual_compensation_p99 = compensation.select(
    pl.col("annual_compensation").quantile(0.99)
).item()
annual_compensation_for_visualization = compensation.filter(
    pl.col("annual_compensation") <= annual_compensation_p99
)

plot_histogram(
    annual_compensation_for_visualization["annual_compensation"],
    "Converted annual compensation (values up to p99)",
    "Converted annual compensation",
    bins=40,
)

# %% [markdown]
# **Raw-scale interpretation.** Converted compensation is strongly right
# skewed. The histogram is limited to the observed 99th percentile only to keep
# the central distribution readable; the original values and the descriptive
# maximum remain unchanged.

# %%
log_compensation = compensation.select(
    pl.col("annual_compensation").log10().alias("log10_compensation")
)
plot_histogram(
    log_compensation["log10_compensation"],
    "Log10 of positive converted annual compensation",
    "log10(ConvertedCompYearly)",
    bins=40,
)

# %% [markdown]
# **Log-scale interpretation.** The logarithmic view reduces the visual
# dominance of the highest values and exposes the broad central compensation
# range. This is an exploratory transformation, not a commitment to use a log
# feature during modeling.

# %%
plot_horizontal_boxplot(
    annual_compensation_for_visualization["annual_compensation"],
    "Converted annual compensation boxplot (visualized up to p99)",
    "Converted annual compensation",
)

# %% [markdown]
# **Boxplot interpretation.** Dispersion and upper-tail asymmetry remain visible
# even after limiting the chart to p99. The percentile limit is a visualization
# boundary only and must not be interpreted as an outlier-removal rule.

# %%
country_compensation = (
    compensation.group_by("Country")
    .agg(
        [
            pl.len().alias("responses"),
            pl.col("annual_compensation")
            .median()
            .alias("median_annual_compensation"),
            pl.col("annual_compensation")
            .quantile(0.25)
            .alias("q1"),
            pl.col("annual_compensation")
            .quantile(0.75)
            .alias("q3"),
        ]
    )
    .filter(pl.col("responses") >= 200)
    .sort("median_annual_compensation", descending=True)
)

print_concise_table(
    "Country-level compensation summary (minimum 200 valid responses):",
    country_compensation,
    max_rows=15,
)

# %% [markdown]
# **Interpretation.** Compensation has incomplete coverage and a strongly
# skewed distribution with extreme values, so the median and quantiles are more
# informative than the mean. Cross-country values reflect economic and
# currency differences and should not be interpreted as direct measures of
# individual performance or satisfaction.

# %% [markdown]
# ## 7. Technology Landscape
#
# Technology fields contain semicolon-separated selections. The helper below
# expands each field and reports the prevalence of individual technologies
# among professional respondents. Respondent-share percentages may sum to more
# than 100% because each person may select several technologies.

# %%
def top_multi_select_values(
    frame: pl.DataFrame,
    column: str,
    limit: int = 20,
) -> pl.DataFrame:
    empty_result = pl.DataFrame(
        schema={
            "technology": pl.String,
            "respondent_count": pl.UInt32,
            "respondent_share_pct": pl.Float64,
        }
    )
    if frame.is_empty() or column not in frame.columns:
        return empty_result

    result = (
        frame.select(
            pl.col(column).str.split(";").alias("technology")
        )
        .explode("technology", empty_as_null=True)
        .with_columns(pl.col("technology").str.strip_chars())
        .filter(
            pl.col("technology").is_not_null()
            & (pl.col("technology") != "NA")
            & (pl.col("technology") != "")
        )
        .group_by("technology")
        .len(name="respondent_count")
        .with_columns(
            (pl.col("respondent_count") * 100 / frame.height)
            .round(2)
            .alias("respondent_share_pct")
        )
        .sort("respondent_count", descending=True)
        .head(limit)
    )
    return result if not result.is_empty() else empty_result


top_languages = top_multi_select_values(
    professional_population,
    "LanguageHaveWorkedWith",
    limit=15,
)
print("Top programming languages:")
print(top_languages)

# %%
horizontal_bar_chart(
    top_languages,
    "technology",
    "respondent_share_pct",
    "Top programming languages used",
    "Professional respondents selecting the language (%)",
    figure_height=7,
)

# %% [markdown]
# **Language interpretation.** The leading languages are used across a large
# share of the professional sample, while the long tail remains substantial.
# Since respondents can select multiple languages, prevalence values overlap
# and must not be interpreted as mutually exclusive market shares.

# %%
top_databases = top_multi_select_values(
    professional_population,
    "DatabaseHaveWorkedWith",
    limit=15,
)
print("Top databases:")
print(top_databases)

# %%
horizontal_bar_chart(
    top_databases,
    "technology",
    "respondent_share_pct",
    "Top databases used",
    "Professional respondents selecting the database (%)",
    figure_height=7,
)

# %% [markdown]
# **Database interpretation.** Relational databases dominate the leading
# selections, with additional representation from document, cache, and search
# systems. Multi-label encoding and frequency thresholds would be required
# before these selections could become model features.

# %%
top_platforms = top_multi_select_values(
    professional_population,
    "PlatformHaveWorkedWith",
    limit=15,
)
print("Top cloud and platform technologies:")
print(top_platforms)

# %%
horizontal_bar_chart(
    top_platforms,
    "technology",
    "respondent_share_pct",
    "Top cloud and platform technologies used",
    "Professional respondents selecting the platform (%)",
    figure_height=7,
)

# %% [markdown]
# **Platform interpretation.** Cloud-platform use is concentrated among a
# small number of providers, but the field has lower coverage than core
# language variables. Non-response and respondents without cloud experience
# cannot be distinguished without additional survey context.

# %%
top_web_frameworks = top_multi_select_values(
    professional_population,
    "WebframeHaveWorkedWith",
    limit=15,
)
print("Top web frameworks:")
print(top_web_frameworks)

# %%
horizontal_bar_chart(
    top_web_frameworks,
    "technology",
    "respondent_share_pct",
    "Top web frameworks and libraries used",
    "Professional respondents selecting the framework (%)",
    figure_height=7,
)

# %% [markdown]
# **Web-framework interpretation.** The field contains both frameworks and
# libraries spanning different ecosystems. Raw labels should remain nominal;
# any grouping by ecosystem would require a documented domain decision.

# %%
top_misc_technologies = top_multi_select_values(
    professional_population,
    "MiscTechHaveWorkedWith",
    limit=15,
)
print("Top miscellaneous frameworks and libraries:")
print(top_misc_technologies)

# %%
horizontal_bar_chart(
    top_misc_technologies,
    "technology",
    "respondent_share_pct",
    "Top miscellaneous frameworks and libraries used",
    "Professional respondents selecting the technology (%)",
    figure_height=7,
)

# %% [markdown]
# **Miscellaneous-technology interpretation.** This field mixes data,
# scientific, mobile, and general-purpose libraries. Its analytical value is
# high for ecosystem description, but its semantic breadth and sparsity make
# direct modeling use difficult.

# %%
top_development_tools = top_multi_select_values(
    professional_population,
    "ToolsTechHaveWorkedWith",
    limit=15,
)
print("Top development tools:")
print(top_development_tools)

# %%
horizontal_bar_chart(
    top_development_tools,
    "technology",
    "respondent_share_pct",
    "Top development tools used",
    "Professional respondents selecting the tool (%)",
    figure_height=7,
)

# %% [markdown]
# **Development-tool interpretation.** Version control and container tooling
# appear prominently. Tool selections reflect current practice but do not by
# themselves measure proficiency, intensity of use, or job satisfaction.

# %%
top_collaboration_tools = top_multi_select_values(
    professional_population,
    "NEWCollabToolsHaveWorkedWith",
    limit=15,
)
print("Top collaboration and development environments:")
print(top_collaboration_tools)

# %%
horizontal_bar_chart(
    top_collaboration_tools,
    "technology",
    "respondent_share_pct",
    "Top collaboration and development environments used",
    "Professional respondents selecting the environment (%)",
    figure_height=7,
)

# %% [markdown]
# **Environment interpretation.** Editors and integrated development
# environments are highly multi-label: many respondents regularly use several.
# Multi-hot encoding, grouping of rare selections, or dimensionality reduction
# would be needed for future ML work.

# %%
technology_coverage_rows = []
technology_columns = [
    "LanguageHaveWorkedWith",
    "DatabaseHaveWorkedWith",
    "PlatformHaveWorkedWith",
    "WebframeHaveWorkedWith",
    "MiscTechHaveWorkedWith",
    "ToolsTechHaveWorkedWith",
    "NEWCollabToolsHaveWorkedWith",
]

for column in technology_columns:
    available = professional_population.filter(
        pl.col(column) != "NA"
    ).height
    technology_coverage_rows.append(
        {
            "column": column,
            "available_responses": available,
            "coverage_pct": round(
                available * 100 / professional_population.height,
                2,
            ),
        }
    )

technology_coverage = pl.DataFrame(technology_coverage_rows).sort(
    "coverage_pct",
    descending=True,
)
print("Technology-field coverage:")
print(technology_coverage)

# %% [markdown]
# **Interpretation.** The survey provides a rich view of the technology
# ecosystem, but these variables are sparse, multi-label, and high-cardinality.
# Individual technology prevalence is meaningful for exploration; raw combined
# strings would not be appropriate direct model features.

# %% [markdown]
# ## 8. Fairness and Sensitive Variables Audit
#
# Demographic and health-related fields are inspected to identify missingness,
# under-representation, and potential fairness risks within the professional
# analytical population. They are not framed as predictors.

# %%
sensitive_columns = [
    "Gender",
    "Trans",
    "Sexuality",
    "Ethnicity",
    "Accessibility",
    "MentalHealth",
]

sensitive_quality = quality_table.filter(
    pl.col("column").is_in(sensitive_columns)
).select(
    [
        "column",
        "total_missing_count",
        "missing_percentage",
        "unique_count",
    ]
)
print("Sensitive-variable quality in the complete survey:")
print(sensitive_quality)

# %%
sensitive_coverage_rows = []
for column in sensitive_columns:
    if column not in professional_population.columns:
        continue

    na_count = professional_population.select(
        (pl.col(column) == "NA").sum()
    ).item()
    prefer_not_to_say_count = professional_population.select(
        pl.col(column)
        .str.contains("Prefer not to say", literal=True)
        .fill_null(False)
        .sum()
    ).item()
    available_count = professional_population.height - na_count

    sensitive_coverage_rows.append(
        {
            "variable": column,
            "available_count": available_count,
            "coverage_percentage": round(
                available_count
                * 100
                / professional_population.height,
                2,
            ),
            "na_string_count": na_count,
            "prefer_not_to_say_count": prefer_not_to_say_count,
        }
    )

sensitive_coverage = pl.DataFrame(sensitive_coverage_rows)
print("Sensitive-variable coverage in the professional population:")
print(sensitive_coverage)

# %%
def sensitive_category_distribution(
    frame: pl.DataFrame,
    column: str,
    limit: int = 12,
) -> pl.DataFrame:
    """Return leading selections for a sensitive multi-select field."""
    empty_result = pl.DataFrame(
        schema={
            "category": pl.String,
            "respondent_count": pl.UInt32,
            "respondent_share_pct": pl.Float64,
        }
    )
    if frame.is_empty() or column not in frame.columns:
        return empty_result

    result = (
        frame.select(pl.col(column).str.split(";").alias("category"))
        .explode("category", empty_as_null=True)
        .with_columns(pl.col("category").str.strip_chars())
        .filter(
            pl.col("category").is_not_null()
            & (pl.col("category") != "NA")
            & (pl.col("category") != "")
        )
        .group_by("category")
        .len(name="respondent_count")
        .with_columns(
            (pl.col("respondent_count") * 100 / frame.height)
            .round(2)
            .alias("respondent_share_pct")
        )
        .sort("respondent_count", descending=True)
        .head(limit)
    )
    return result if not result.is_empty() else empty_result

# %%
leading_sensitive_categories = {}
for column in sensitive_columns:
    leading_sensitive_categories[column] = (
        sensitive_category_distribution(
            professional_population,
            column,
        )
    )
    print_concise_table(
        f"Leading categories for {column}:",
        leading_sensitive_categories[column],
        max_rows=8,
    )

# %%
gender_distribution = leading_sensitive_categories["Gender"]
horizontal_bar_chart(
    gender_distribution,
    "category",
    "respondent_share_pct",
    "Gender selections in the professional population",
    "Professional respondents selecting the category (%)",
    figure_height=6,
)

# %% [markdown]
# **Gender interpretation.** Men account for a large majority of the
# professional responses, while women, non-binary respondents, and
# self-described categories have much smaller samples. This imbalance limits
# subgroup precision and reflects survey participation as well as the wider
# population; it does not support causal conclusions.

# %%
accessibility_distribution = sensitive_category_distribution(
    professional_population,
    "Accessibility",
    limit=12,
)
horizontal_bar_chart(
    accessibility_distribution,
    "category",
    "respondent_share_pct",
    "Accessibility selections in the professional population",
    "Professional respondents selecting the category (%)",
    figure_height=7,
)

# %% [markdown]
# **Accessibility interpretation.** Most respondents select no listed
# accessibility condition, while individual reported conditions represent much
# smaller groups. Multi-selection and optional response mean the categories
# must not be read as a clinical prevalence estimate.

# %%
mental_health_distribution = sensitive_category_distribution(
    professional_population,
    "MentalHealth",
    limit=12,
)
horizontal_bar_chart(
    mental_health_distribution,
    "category",
    "respondent_share_pct",
    "Mental-health selections in the professional population",
    "Professional respondents selecting the category (%)",
    figure_height=8,
)

# %% [markdown]
# **Mental-health interpretation.** The responses include non-disclosure,
# multiple simultaneous selections, and unevenly represented conditions. The
# survey is voluntary and self-reported, so these frequencies are useful for a
# fairness audit but not for diagnosis or causal claims.

# %% [markdown]
# **Interpretation.** Several sensitive groups have small sample sizes, and
# all questions are exposed to self-selection and response bias. `Gender`,
# `Trans`, `Sexuality`, `Ethnicity`, `Accessibility`, and `MentalHealth` should
# be excluded from the predictive feature set unless a separately approved
# fairness methodology uses them strictly for auditing. They must never become
# an unsupported basis for decisions about individuals.

# %% [markdown]
# ## 9. Feature Feasibility Assessment
#
# Every available column is classified according to its likely analytical role.
# This is a feasibility inventory, not a final production feature-selection
# decision.

# %%
identifier_columns = {"ResponseId"}
geographic_columns = {"Country", "US_State", "UK_Country"}
professional_columns = {
    "EdLevel",
    "Age1stCode",
    "YearsCode",
    "YearsCodePro",
    "DevType",
    "OrgSize",
    "OpSys",
    "Age",
}
population_definition_columns = {"MainBranch", "Employment"}
compensation_columns = {
    "Currency",
    "CompTotal",
    "CompFreq",
    "ConvertedCompYearly",
}
technology_columns_set = {
    column
    for column in df.columns
    if "HaveWorkedWith" in column or "WantToWorkWith" in column
}
community_columns = {
    "NEWStuck",
    "NEWSOSites",
    "SOVisitFreq",
    "SOAccount",
    "SOPartFreq",
    "SOComm",
    "NEWOtherComms",
}
sensitive_columns_set = set(sensitive_columns)
survey_metadata_columns = {"SurveyLength", "SurveyEase"}

feature_rows = []
for column in df.columns:
    if column in identifier_columns:
        category = "Identifier"
        potential_use = "Row integrity and traceability"
        preprocessing_required = "Uniqueness validation"
        risk_or_limitation = "Would leak row identity; exclude from features"
    elif column in population_definition_columns:
        category = "Population definition"
        potential_use = "Define the eligible professional population"
        preprocessing_required = "Explicit inclusion and exclusion rules"
        risk_or_limitation = "Filtering rule changes the population represented"
    elif column in sensitive_columns_set:
        category = "Sensitive/audit only"
        potential_use = "Representation and fairness audit"
        preprocessing_required = "Multi-select normalization and disclosure handling"
        risk_or_limitation = "Ethical, privacy, bias, and small-group risks"
    elif column in geographic_columns:
        category = "High-cardinality categorical"
        potential_use = "Geographic context"
        preprocessing_required = "Rare-category grouping and applicability rules"
        risk_or_limitation = "Geographic bias; state fields are structurally missing"
    elif column in compensation_columns:
        category = "Compensation"
        potential_use = "Descriptive context; potential predictor after approval"
        preprocessing_required = "Numeric conversion, currency and frequency validation"
        risk_or_limitation = "Missingness, extreme values, and international comparability"
    elif column in technology_columns_set:
        category = "Technology multivalue"
        potential_use = "Technology profile"
        preprocessing_required = "Split, multi-hot encode, and group rare selections"
        risk_or_limitation = "High dimensionality; preference fields may act as proxies"
    elif column in professional_columns:
        category = "Demographic/profile"
        potential_use = "Potential predictor after scope approval"
        preprocessing_required = "Sentinel handling and categorical or ordinal encoding"
        risk_or_limitation = "Self-report, mixed semantics, and possible proxy effects"
    elif column in community_columns:
        category = "Potential predictor"
        potential_use = "Community-engagement context"
        preprocessing_required = "Ordinal or multi-select encoding after domain review"
        risk_or_limitation = "Unclear business relevance and possible behavioral proxies"
    elif column in survey_metadata_columns:
        category = "Survey metadata"
        potential_use = "Response-quality assessment"
        preprocessing_required = "None for EDA"
        risk_or_limitation = "Not recommended as a business predictor"
    elif column == "LearnCode":
        category = "Potential predictor"
        potential_use = "Learning-path context"
        preprocessing_required = "Split and multi-hot encode"
        risk_or_limitation = "High dimensionality and uncertain causal relevance"
    else:
        category = "Not recommended"
        potential_use = "Exploratory context only"
        preprocessing_required = "Domain review"
        risk_or_limitation = "No approved relationship with the project objective"

    feature_rows.append(
        {
            "feature": column,
            "category": category,
            "potential_use": potential_use,
            "preprocessing_required": preprocessing_required,
            "risk_or_limitation": risk_or_limitation,
        }
    )

feature_feasibility = (
    pl.DataFrame(feature_rows)
    .join(
        quality_table.select(
            [
                pl.col("column").alias("feature"),
                "missing_percentage",
                "unique_count",
            ]
        ),
        on="feature",
        how="left",
    )
    .sort(["category", "feature"])
)

assert feature_feasibility.height == df.width
assert feature_feasibility["feature"].n_unique() == df.width
print_concise_table(
    "Feature feasibility assessment (all 48 available columns):",
    feature_feasibility,
    max_rows=15,
)

# %%
feature_category_summary = (
    feature_feasibility.group_by("category")
    .len(name="feature_count")
    .sort("feature_count", descending=True)
)
print("Feature categories:")
print(feature_category_summary)

# %%
required_target_columns = ["JobSat", "job_satisfaction"]
target_presence = pl.DataFrame(
    {
        "required_target": required_target_columns,
        "present_in_2021": [
            column in df.columns
            for column in required_target_columns
        ],
    }
)
# %% [markdown]
# **Interpretation.** The dataset offers many potentially informative
# professional and technology attributes, but most require cleaning, encoding,
# or careful governance. `ResponseId` is an identifier, survey metadata is not
# a business feature, and sensitive fields require special treatment. Most
# importantly, neither `JobSat` nor `job_satisfaction` exists in the 2021
# dataset.

# %% [markdown]
# ## 10. Target Availability and Dataset Suitability
#
# The final assessment separates suitability for exploratory analysis from
# suitability for the project's supervised learning objective. Target
# availability is checked programmatically rather than inferred from the survey
# description.

# %%
has_required_target = any(
    column in df.columns
    for column in required_target_columns
)

suitability_assessment = pl.DataFrame(
    {
        "criterion": [
            "Dataset is accessible through the project loader",
            "Dataset has sufficient volume for exploratory analysis",
            "Professional and technology attributes are available",
            "Sensitive variables can support a fairness audit",
            "Dataset can support temporal comparison",
            "Required JobSat target is available",
            "Validated equivalent satisfaction target is available",
            "Current supervised learning objective is supported",
        ],
        "result": [
            True,
            df.height > 10_000,
            all(
                column in df.columns
                for column in [
                    "Employment",
                    "YearsCodePro",
                    "DevType",
                    "LanguageHaveWorkedWith",
                ]
            ),
            all(
                column in df.columns
                for column in sensitive_columns
            ),
            True,
            has_required_target,
            False,
            has_required_target,
        ],
    }
)

print("Target check:")
print(target_presence)
print("Dataset suitability assessment:")
print(suitability_assessment)
print(
    "Target decision: neither JobSat nor job_satisfaction is present, "
    "and no validated equivalent satisfaction target has been identified."
)

# %% [markdown]
# **Interpretation.** Stack Overflow Survey 2021 is suitable for documenting
# dataset structure, quality, professional profiles, compensation, technology
# usage, and fairness considerations. It does not support the project's current
# supervised learning objective because the required `JobSat` target is absent.
# No proxy target is created because that would change the defined business
# problem rather than solve a data-quality issue. This is a dataset-selection
# limitation, not a code failure. The survey remains valuable for exploratory
# analysis, understanding survey structure, population analysis, data-quality
# assessment, feature feasibility, and temporal comparison with later editions.

# %% [markdown]
# ## 11. Conclusions and Decision Log
#
# The 2021 survey provides valuable exploratory evidence:
#
# - **Population:** professional developers are the largest group, but students,
#   hobbyists, unemployed people, and other profiles make explicit population
#   rules necessary.
# - **Data quality:** the literal `NA`, numeric fields stored as strings,
#   structural missingness, and multi-select fields require deliberate handling.
# - **Technology:** the survey offers rich ecosystem coverage with a long,
#   high-dimensional tail that would require multi-hot encoding and frequency
#   controls.
# - **Compensation:** coverage is incomplete, raw totals are not internationally
#   comparable, and converted annual compensation is strongly right skewed.
# - **Fairness:** sensitive groups are unevenly represented; sensitive fields
#   are appropriate for auditing, not automatic predictive use.
# - **Feature engineering:** useful professional attributes exist, but almost
#   every candidate requires cleaning, encoding, governance, or domain review.
# - **Target:** neither `JobSat` nor a validated equivalent satisfaction target
#   is present.
#
# **Project decision:** preserve this notebook as evidence of the 2021
# exploration. A later survey edition containing the approved target should be
# evaluated separately for supervised model training. The missing target is
# documented, not replaced or approximated.
#
# **Final recommendation:** The Stack Overflow Survey 2021 is suitable for
# exploratory data analysis but is not suitable for supervised model training
# for the current project because it lacks the required target variable
# (`JobSat`). A later survey edition containing the approved target should be
# evaluated for the modeling phase.

# %%
final_decision = pl.DataFrame(
    {
        "use_case": [
            "Exploratory data analysis",
            "Supervised JobSat model training",
        ],
        "suitable": [True, False],
        "decision": [
            "Retain as documented exploratory evidence",
            "Use another survey edition containing JobSat",
        ],
    }
)

print("Final suitability decision:")
print(final_decision)

# %%
decision_log = pl.DataFrame(
    {
        "decision": [
            "Retain the 2021 analysis as project evidence",
            "Treat literal NA values as missing in later preprocessing",
            "Define the professional population explicitly",
            "Keep sensitive variables out of predictive features",
            "Do not use the 2021 survey for supervised JobSat training",
        ],
        "evidence": [
            "83,439 responses and 48 documented survey variables",
            "Missingness is primarily encoded as the string NA",
            "MainBranch and Employment include multiple populations",
            "Uneven representation, optional responses, and ethical risk",
            "JobSat and job_satisfaction are both absent",
        ],
        "consequence": [
            "The notebook supports traceability and temporal comparison",
            "Native-null-only checks are insufficient",
            "Descriptive work analyses use a temporary professional subset",
            "Sensitive fields are reserved for fairness auditing",
            "The current supervised objective cannot be implemented",
        ],
        "next_step": [
            "Preserve the notebook as exploratory documentation",
            "Specify sentinel normalization in the future data pipeline",
            "Approve inclusion criteria before production modeling",
            "Approve a separate fairness methodology if required",
            "Evaluate a later survey edition containing the approved target",
        ],
    }
)
print("Decision log:")
print(decision_log)

# %% [markdown]
# ## Executive Summary — English
#
# - **Dataset overview:** The Stack Overflow Developer Survey 2021 contains
#   83,439 responses and 48 variables. `ResponseId` is unique, and no duplicated
#   rows or duplicated identifiers were detected.
# - **Data quality:** Most fields are loaded as strings, and missing information
#   is represented mainly by the literal `NA` rather than native Polars nulls.
#   `UK_Country` and `US_State` have 94.71% and 82.12% structural missingness,
#   while `ConvertedCompYearly` is missing in 43.86% of all responses.
# - **Respondent population:** 58,153 respondents (69.70%) identify as
#   professional developers. The stricter temporary work-analysis population
#   contains 55,036 actively employed professional developers (65.96%).
# - **Professional profile:** The largest professional age group is 25–34
#   (27,002 respondents), and bachelor's degrees are the most frequent
#   education level (27,291). Full-stack, back-end, and front-end are the three
#   most frequently selected developer roles.
# - **Technology landscape:** JavaScript leads professional language selections
#   (37,610), followed by HTML/CSS (30,468), SQL (27,901), Python (22,166), and
#   TypeScript (20,148). These fields are multi-select and highly dimensional.
# - **Compensation:** 42,703 professionals have a positive converted annual
#   value, giving 77.59% coverage in the analytical population. The median is
#   56,040, while p99 reaches 1,200,000, confirming a strong right skew and the
#   need for cautious cross-country interpretation.
# - **Sensitive variables:** Gender, trans status, sexuality, ethnicity,
#   accessibility, and mental-health fields show non-response and unequal
#   representation. They are appropriate for fairness auditing, not automatic
#   predictive use.
# - **Feature feasibility:** All 48 columns were classified by analytical role,
#   preprocessing needs, and risk; 14 are technology multi-value fields and six
#   are reserved for sensitive-variable auditing.
# - **Target availability:** Neither `JobSat` nor `job_satisfaction` exists in
#   the 2021 survey, and no validated equivalent satisfaction target was found.
# - **Final recommendation:** Retain this notebook as the official exploratory
#   record and evidence of dataset selection, but evaluate a later survey
#   edition containing the approved target for supervised modeling.

# %% [markdown]
# ## Resumen Ejecutivo — Español
#
# - **Visión del conjunto de datos:** La encuesta de Stack Overflow de 2021
#   reúne 83.439 respuestas y 48 variables. `ResponseId` identifica de forma
#   única cada registro y no se detectaron duplicados.
# - **Calidad de los datos:** La mayoría de las columnas se reciben como texto y
#   la ausencia se codifica principalmente mediante `NA`. `UK_Country` y
#   `US_State` presentan un 94,71% y un 82,12% de ausencia estructural;
#   `ConvertedCompYearly` no está disponible en el 43,86% de la encuesta.
# - **Población encuestada:** 58.153 personas (69,70%) se identifican como
#   desarrolladores profesionales. Para el análisis laboral se definió
#   temporalmente un grupo más estricto de 55.036 profesionales en activo
#   (65,96%), sin modificar permanentemente el dataset.
# - **Perfil profesional:** El grupo de 25 a 34 años es el más numeroso entre
#   los profesionales (27.002), y la titulación de grado es la formación más
#   frecuente (27.291). Los perfiles full-stack, back-end y front-end encabezan
#   las especialidades declaradas.
# - **Panorama tecnológico:** JavaScript es el lenguaje más seleccionado
#   (37.610 profesionales), seguido de HTML/CSS (30.468), SQL (27.901), Python
#   (22.166) y TypeScript (20.148). Son respuestas múltiples y requieren control
#   de dimensionalidad antes de cualquier uso predictivo.
# - **Compensación:** 42.703 profesionales disponen de una compensación anual
#   convertida positiva, lo que supone una cobertura del 77,59%. La mediana es
#   56.040 y el percentil 99 alcanza 1.200.000, evidenciando una distribución
#   muy asimétrica y limitada para comparaciones internacionales directas.
# - **Variables sensibles:** Género, identidad trans, sexualidad, etnicidad,
#   accesibilidad y salud mental presentan no respuesta y grupos con tamaños
#   reducidos. Su función adecuada es apoyar auditorías de equidad, no alimentar
#   automáticamente el modelo.
# - **Viabilidad de las variables:** Las 48 columnas han sido clasificadas según
#   su utilidad, transformación y riesgos; 14 son campos tecnológicos
#   multivalor y seis quedan reservadas para auditoría de variables sensibles.
# - **Disponibilidad del objetivo:** La edición 2021 no contiene `JobSat` ni
#   `job_satisfaction`, y no se ha identificado una alternativa validada que
#   represente la satisfacción laboral.
# - **Recomendación final:** El notebook debe conservarse como análisis oficial
#   de 2021 y como evidencia del proceso de selección. El modelado supervisado
#   debe evaluar otra edición que contenga el objetivo aprobado.
#
# > **FINAL RECOMMENDATION — ENGLISH:** The Stack Overflow Survey 2021 should be
# > retained as the official exploratory analysis and as documented evidence of
# > the dataset-selection process. It should not be used for the current
# > supervised model because the required target variable `JobSat` is absent.
# > A later survey edition containing the approved target must be evaluated for
# > model development.
#
# > **RECOMENDACIÓN FINAL — ESPAÑOL:** La encuesta Stack Overflow 2021 debe
# > conservarse como análisis exploratorio oficial y como evidencia documentada
# > del proceso de selección del dataset. No debe utilizarse para entrenar el
# > modelo supervisado actual porque no contiene la variable objetivo `JobSat`.
# > Para la fase de modelado debe evaluarse una edición posterior que incluya la
# > variable objetivo aprobada.
