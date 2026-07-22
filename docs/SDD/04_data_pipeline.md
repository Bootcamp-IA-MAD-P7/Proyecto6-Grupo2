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

### Streaming Mode

The `load()` method streams the dataset using the Hugging Face `datasets` library.

```python
raw = RawData(2023)
dataset = raw.load()
```

Internally it uses:

```python
load_dataset(
    "Anahia/stackoverflow_survey",
    data_files="stackoverflow_survey_2023.csv",
    streaming=True,
).with_format("polars")
```

Streaming avoids downloading the complete dataset into memory and is recommended for large datasets.

## Schema

The `Schema` class loads the survey metadata (question descriptions and column definitions).

### Download Mode

```python
schema = Schema(2023)
schema_df = schema.download()
```

### Streaming Mode

```python
schema = Schema(2023)
schema_stream = schema.load()
```

The implementation is identical to `RawData`, but targets the schema repository instead of the survey responses.

## Error Handling

Both classes wrap data access inside `try/except` blocks.

If an error occurs:

- an informative message is printed,
- the original exception is re-raised using `raise`.

This allows the pipeline to fail gracefully while preserving the original error for debugging.

## Download vs Streaming

| Download | Streaming |
|----------|-----------|
| Loads the complete CSV into memory | Reads data incrementally |
| Returns a Polars `DataFrame` | Returns a Hugging Face streaming dataset |
| Faster for local analysis | More memory-efficient |
| Best for small and medium datasets | Best for large datasets |

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