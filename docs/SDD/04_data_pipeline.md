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

### Multi-Select Columns (DevType, LearnCode, etc.)

Columns like `DevType` and `LearnCode` are semicolon-delimited multi-select fields (same pattern as `LanguageHaveWorkedWith`). The current feature set deliberately **excludes** them because the sklearn `Pipeline` (one-hot encoding via `ColumnTransformer`) cannot handle delimited lists directly — they would need to be exploded into binary flag columns before preprocessing.

**Decision:** Leave `DevType` and `LearnCode` out of `FEATURES` for now. This keeps the pipeline simple with 8 clean features (2 numeric + 6 categorical) while still producing a valid 3-class Random Forest. Multi-select columns can be added later via a custom preprocessor step or handled in the ensemble/XGBoost pipeline if needed.

### SMOTE + Class Weight Strategy

The pipeline uses **both** SMOTE and `class_weight="balanced"` — they are complementary, not alternatives:

- **SMOTE** (`imblearn.pipeline.Pipeline`) — inserted between the preprocessor and the classifier. After the preprocessor imputes nulls and one-hot encodes categoricals into numeric vectors, SMOTE synthesises new minority-class samples by interpolating between existing nearest neighbours (`k_neighbors=5`). This fixes the **input distribution**.

- **`class_weight="balanced"`** on the `RandomForestClassifier` — inversely scales the split criterion's loss contribution by class frequency. This fixes the **loss function**.

Using both gives the model two layers of protection against ignoring the minority class: the training set is rebalanced *and* the cost of misclassifying minority samples is higher.

### Overfitting Risk with SMOTE

SMOTE reduces class imbalance by generating synthetic samples, which can introduce **overfitting** if not carefully regularized:

- Synthetic samples are interpolations between existing minority-class neighbours — they are not real observations, so the model can latch on to patterns that don't generalise to real data.
- The RF pipeline applies three regularisation mechanisms to counter this:
  1. **`max_depth=12`** — prevents trees from growing deep enough to memorise synthetic-noise patterns.
  2. **`min_samples_leaf=5`** — forces each leaf to cover at least 5 samples, smoothing out spurious splits.
  3. **`max_samples=0.75`** — bootstraps only 75% of rows per tree, reducing correlation between trees.
- SMOTE itself uses **`k_neighbors=5`** (default), which limits interpolation to the 5 nearest real neighbours, reducing the risk of implausible synthetic points.

The trade-off is deliberate: moderate overfitting risk from SMOTE is acceptable given the heavy regularisation on the RF classifier and the downstream benefit of the model actually seeing minority-class patterns during training.

### Polars-to-Pandas Bridge

SMOTE (and imbalanced-learn generally) expects numpy-compatible input — it doesn't understand Polars `DataFrame` objects. The pipeline includes a `PolarsToPandas` transformer (a no-op `sklearn` `BaseEstimator`) placed between the preprocessor and the SMOTE step:

```python
Pipeline([
    ("preprocessor", build_preprocessor()),
    ("to_pandas", PolarsToPandas()),
    ("smote", SMOTE(...)),
    ("classifier", RandomForestClassifier(...)),
])
```

If the output of the `ColumnTransformer` is a Polars DataFrame (depending on how the data is passed downstream), `PolarsToPandas` converts it to pandas before SMOTE sees it. If it's already pandas, the transformer is a pass-through. This keeps the pipeline resilient regardless of the calling code's DataFrame convention.

### Dependency

The `imbalanced-learn` package was added via `uv add imbalanced-learn`. It provides both `SMOTE` and `imblearn.pipeline.Pipeline` (imblearn pipelines handle step indexing and resampling correctly during `fit`/`predict`, unlike wrapping SMOTE inside a vanilla sklearn `Pipeline`).

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