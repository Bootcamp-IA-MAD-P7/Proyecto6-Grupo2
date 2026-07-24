# Data Pipeline Design

## Purpose

Describe how raw data becomes usable model input.

---

# 1. Data Sources

- **Origin:** Stack Overflow Developer Survey (2021–2025), hosted on Hugging Face
- **Format:** CSV → Parquet (after processing)
- **Target variable:** `JobSat` (0–10, available only in 2024 and 2025)

### Training Dataset (2024–2025)

| Property | Value |
|---|---|
| Source files | `survey_results_public_2024.csv`, `survey_results_public_2025.csv` |
| Raw merged | `data/raw/merged_survey_2024_2025.parquet` (113,983 rows, 25 cols) |
| Cleaned | `data/processed/merged_survey_2024_2025_clean.parquet` (55,008 rows, 15 cols) |
| Target | `JobSat` (Int8, 0–10) |

### Auxiliary Dataset (2021–2025)

| Property | Value |
|---|---|
| Source files | All 5 years |
| Raw merged | `data/raw/merged_survey_2021_2025.parquet` (359,335 rows, 24 cols) |
| Cleaned | `data/processed/auxiliary/merged_survey_2021_2025_clean.parquet` (342,138 rows, 14 cols) |
| Note | No `JobSat` column (not asked in 2021–2023) |


---

# 2. Data Schema (Training Dataset)

| Feature | Type | Description |
|---|---|---|
| `MainBranch` | String | Developer type (e.g., "I am a developer by profession") |
| `Employment` | String | Employment status (full-time, part-time, freelance, etc.) |
| `Country` | String | Country of residence |
| `EdLevel` | String | Education level |
| `Age` | String | Age range (e.g., "25-34 years old") |
| `DevType` | String | Developer role(s), semicolon-separated (multi-select) |
| `OrgSize` | String | Organization size |
| `ConvertedCompYearly` | Float64 | Annual salary in USD, imputed with per-(Year,Country) median |
| `LanguageHaveWorkedWith` | String | Programming languages used, semicolon-separated (multi-select) |
| `DatabaseHaveWorkedWith` | String | Databases used, semicolon-separated (multi-select) |
| `PlatformHaveWorkedWith` | String | Cloud platforms used, semicolon-separated (multi-select) |
| `WebframeHaveWorkedWith` | String | Web frameworks used, semicolon-separated (multi-select) |
| `LearnCode` | String | How the respondent learned to code |
| `YearsCodeNum` | Float64 | Years of coding experience (numeric) |
| `JobSat` | Int8 | **Target** — job satisfaction score (0–10) |


---

# 3. Data Processing Steps

## Data Ingestion

The `utils/load_raw_data.py` module is responsible for the **data ingestion** stage of the pipeline. It provides helper classes to retrieve the Stack Overflow Survey datasets and their corresponding schemas from Hugging Face.

### Data Sources
Survey responses:

```text
https://huggingface.co/datasets/Anahia/stackoverflow_survey
```
Survey schemas:

```text
https://huggingface.co/datasets/Anahia/stackoverflow_survey_schemas
```
### Imports

from utils.load_raw_data import RawData, Schema

### RawData

The `RawData` class loads the Stack Overflow survey responses for a given year.

### Download Mode

The `download()` method:

1. Builds the dataset URL.
2. Downloads the CSV using `pl.read_csv()`.
3. Returns a Polars `DataFrame`.

Example:

```python
raw = RawData(2023)
df = raw.download()
```

### Load Mode (Schema only)

The `Schema.load()` method uses Hugging Face `datasets` to stream schema metadata (small files). This was attempted for survey data as well, but the row-by-row iteration of streaming datasets is too slow for datasets with tens of thousands of rows. Downloading the full CSV with `pl.read_csv()` is faster and simpler.

## Schema

The `Schema` class loads the survey metadata (question descriptions and column definitions).

### Download Mode

```python
schema = Schema(2023)
schema_df = schema.download()
```

### Load Mode

```python
schema = Schema(2023)
schema_stream = schema.load()
```

The schema files are small, so streaming is practical here. The implementation is identical to `RawData` (before removal), but targets the schema repository instead of the survey responses.

## Error Handling

Both classes wrap data access inside `try/except` blocks.

If an error occurs:

- an informative message is printed,
- the original exception is re-raised using `raise`.

This allows the pipeline to fail gracefully while preserving the original error for debugging.

## Download vs Load

| Download (`RawData` / `Schema`) | Load (`Schema` only) |
|----------|-----------|
| Loads the complete CSV into memory | Reads data incrementally |
| Returns a Polars `DataFrame` | Returns a Hugging Face streaming dataset |
| Faster for local analysis | More memory-efficient |
| Best for all dataset sizes | Best for small metadata files |

> `RawData.load()` was removed because the row-by-row iteration of streaming datasets is too slow for survey data.

## Uploading Data to Hugging Face

### CSV Format Issue

The original CSV files stored on Hugging Face had each line wrapped in double quotes and internal quotes escaped as `""`. This caused Polars to read the entire row as a single column. The fix is to:

1. Strip the outer `"` from each line.
2. Unescape `""` → `"` inside quoted fields.

### Upload Script

The `scripts/upload_to_hf.py` script automates this process:

```python
uv run scripts/upload_to_hf.py path/to/stackoverflow_survey_2022.txt
```

It will:
1. Read the broken file
2. Strip line-level quotes and unescape internal quotes
3. Save as a proper `.csv`
4. Upload to the Hugging Face dataset repository

Make sure `HUGGINGFACE_TOKEN` is set in `.env` or as an environment variable.

## Pipeline Position

```text
Hugging Face Repositories
          │
          ▼
utils/load_raw_data.py
    (RawData, Schema)
          │
          ▼
Polars DataFrame / Streaming Dataset
          │
          ▼
Data Cleaning
          │
          ▼
Feature Engineering
          │
          ▼
Model Training
```

This module is the entry point of the data pipeline. It retrieves the raw survey data and schema, making them available for all subsequent preprocessing and machine learning stages.

## Cleaning Steps

1. **Column selection** — keep only 15 common columns across years (see schema above)
2. **Employment normalization** — standardize punctuation variants (e.g., `"Employed, full-time"` → `"Employed full-time"`)
3. **EdLevel normalization** — map `"Other (please specify):"` and `"Something else"` to `"Other"`, shorten `"Professional degree (JD, MD, Ph.D, Ed.D, etc.)"` → `"Professional degree (JD, MD, etc.)"`
4. **MainBranch cleanup** — strip stray quotes and trailing suffixes
5. **YearsCode → YearsCodeNum** — parse `"Less than 1 year"` → 0, `"More than 50 years"` → 50, `"None"` → null, cast to Float64
6. **Salary imputation** — `ConvertedCompYearly` nulls filled with per-(Year, Country) median, falling back to per-Year median
7. **Target filtering** — keep only rows where `JobSat` is numeric (0–10), cast to Int8
8. **Drop columns** — remove `*WantToWorkWith`, `Currency`, `YearsCode` (string), `AgeClean`, `Year`, `SOAccount`, `SOVisitFreq`, `SOComm`, `SOPartFreq`
9. **Drop nulls** — remove any remaining rows with null values (60 rows in `YearsCodeNum`)

## Output Structure

```
data/raw/
  merged_survey_2024_2025.parquet        (113,983 rows, 25 cols — raw merge)
  merged_survey_2021_2025.parquet        (359,335 rows, 24 cols — raw merge)

data/processed/
  merged_survey_2024_2025_clean.parquet   (55,008 rows, 15 cols — training-ready)

data/processed/auxiliary/
  merged_survey_2021_2025_clean.parquet   (342,138 rows, 14 cols — no JobSat)

data/processed/splits/
  train.parquet   (38,505 rows)
  dev.parquet      (8,251 rows)
  test.parquet     (8,252 rows)
```


---

# 4. Dataset Splitting

Explain:

- Training set
- Validation set
- Test set

Include strategy:

- Random split
- Stratified split
- Cross-validation


---

# 5. Pipeline Implementation

Reference:

- src/data/
- preprocessing modules
- validation functions