# Data Pipeline Design

## Purpose

Describe how raw data becomes usable model input.

---

# 1. Data Sources

Explain:

- Dataset origin
- Format
- Size
- Features
- Target variable


---

# 2. Data Schema

Document:

| Feature | Type | Description |
|---|---|---|
| feature_1 | numeric | Description |


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

Checks performed before processing.

## Cleaning

Handling:

- Missing values
- Duplicates
- Invalid values


## Transformation

Examples:

- Encoding
- Scaling
- Normalization


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