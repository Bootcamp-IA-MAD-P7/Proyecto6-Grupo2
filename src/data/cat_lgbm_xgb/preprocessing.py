import joblib
import polars as pl
import numpy as np
from pathlib import Path
from sklearn.preprocessing import OrdinalEncoder


CATEGORICAL_COLS = [
    "MainBranch",
    "Employment",
    "Country",
    "EdLevel",
    "Age",
    "DevType",
    "OrgSize",
    "LearnCode",
]

MULTI_SELECT_COLS = [
    "LanguageHaveWorkedWith",
    "DatabaseHaveWorkedWith",
    "PlatformHaveWorkedWith",
    "WebframeHaveWorkedWith",
]

TARGET = "JobSat"
PIPELINE_DIR = Path("models/pipelines/cat_lgbm_xgb")


def bin_target(y: np.ndarray) -> np.ndarray:
    result = np.zeros(len(y), dtype=np.int8)
    result[(y >= 4) & (y <= 6)] = 1
    result[y >= 7] = 2
    return result


def load_splits(data_dir: Path) -> tuple[pl.DataFrame, pl.DataFrame, pl.DataFrame]:
    splits_dir = data_dir / "splits"
    train = pl.read_parquet(splits_dir / "train.parquet")
    dev = pl.read_parquet(splits_dir / "dev.parquet")
    test = pl.read_parquet(splits_dir / "test.parquet")
    return train, dev, test


def expand_multiselect(
    train: pl.DataFrame,
    dev: pl.DataFrame,
    test: pl.DataFrame,
    cols: list[str] = MULTI_SELECT_COLS,
) -> tuple[pl.DataFrame, pl.DataFrame, pl.DataFrame]:
    for col in cols:
        all_values = train[col].str.split(";").explode().unique().to_list()

        new_train_cols = []
        new_dev_cols = []
        new_test_cols = []

        for val in all_values:
            col_name = f"{col}_{val}"
            new_train_cols.append(
                train[col].str.contains(val, literal=True).cast(pl.Int8).alias(col_name)
            )
            new_dev_cols.append(
                dev[col].str.contains(val, literal=True).cast(pl.Int8).alias(col_name)
            )
            new_test_cols.append(
                test[col].str.contains(val, literal=True).cast(pl.Int8).alias(col_name)
            )

        train = train.with_columns(new_train_cols).drop(col)
        dev = dev.with_columns(new_dev_cols).drop(col)
        test = test.with_columns(new_test_cols).drop(col)

        assert dev.columns == train.columns, (
            f"Column mismatch between train and dev after expanding {col}"
        )
        assert test.columns == train.columns, (
            f"Column mismatch between train and test after expanding {col}"
        )

    return train, dev, test


def engineer_features(
    train: pl.DataFrame,
    dev: pl.DataFrame,
    test: pl.DataFrame,
) -> tuple[pl.DataFrame, pl.DataFrame, pl.DataFrame]:
    def _engineer(df: pl.DataFrame) -> pl.DataFrame:
        median_salary = train["ConvertedCompYearly"].median()
        return df.with_columns(
            [
                (pl.col("ConvertedCompYearly") / (pl.col("YearsCodeNum") + 1)).alias(
                    "salary_per_year_experience"
                ),
                (pl.col("YearsCodeNum") > 10).cast(pl.Int8).alias("is_senior"),
                (pl.col("ConvertedCompYearly") > median_salary)
                .cast(pl.Int8)
                .alias("is_high_earner"),
            ]
        )

    return _engineer(train), _engineer(dev), _engineer(test)


def _rebuild_encoded_df(
    original: pl.DataFrame,
    encoded_cats: np.ndarray,
    cat_cols: list[str],
    non_cat_cols: list[str],
) -> pl.DataFrame:
    encoded_df = pl.DataFrame(
        encoded_cats, schema={col: pl.Float64 for col in cat_cols}
    )
    return pl.concat([original.select(non_cat_cols), encoded_df], how="horizontal")


def encode_categoricals(
    X_train: pl.DataFrame,
    X_dev: pl.DataFrame,
    X_test: pl.DataFrame,
    cat_cols: list[str] = CATEGORICAL_COLS,
) -> tuple[pl.DataFrame, pl.DataFrame, pl.DataFrame, OrdinalEncoder]:
    encoder = OrdinalEncoder(
        handle_unknown="use_encoded_value",
        unknown_value=-1,
    )

    train_cat = X_train.select(cat_cols).to_pandas()
    dev_cat = X_dev.select(cat_cols).to_pandas()
    test_cat = X_test.select(cat_cols).to_pandas()

    train_encoded_cats = encoder.fit_transform(train_cat)
    dev_encoded_cats = encoder.transform(dev_cat)
    test_encoded_cats = encoder.transform(test_cat)

    non_cat_cols = [c for c in X_train.columns if c not in cat_cols]

    X_train_enc = _rebuild_encoded_df(
        X_train, train_encoded_cats, cat_cols, non_cat_cols
    )
    X_dev_enc = _rebuild_encoded_df(X_dev, dev_encoded_cats, cat_cols, non_cat_cols)
    X_test_enc = _rebuild_encoded_df(X_test, test_encoded_cats, cat_cols, non_cat_cols)

    return X_train_enc, X_dev_enc, X_test_enc, encoder


def save_encoder(encoder: OrdinalEncoder, pipeline_dir: Path) -> None:
    pipeline_dir.mkdir(parents=True, exist_ok=True)
    joblib.dump(encoder, pipeline_dir / "ordinal_encoder.joblib")


def load_encoder(pipeline_dir: Path) -> OrdinalEncoder:
    return joblib.load(pipeline_dir / "ordinal_encoder.joblib")


def save_pipeline(
    pipeline_dir: Path,
    X_train: pl.DataFrame,
    X_dev: pl.DataFrame,
    X_test: pl.DataFrame,
    X_train_enc: pl.DataFrame,
    X_dev_enc: pl.DataFrame,
    X_test_enc: pl.DataFrame,
    y_train: np.ndarray,
    y_dev: np.ndarray,
    y_test: np.ndarray,
) -> None:
    pipeline_dir.mkdir(parents=True, exist_ok=True)

    X_train.write_parquet(pipeline_dir / "X_train.parquet")
    X_dev.write_parquet(pipeline_dir / "X_dev.parquet")
    X_test.write_parquet(pipeline_dir / "X_test.parquet")

    X_train_enc.write_parquet(pipeline_dir / "X_train_enc.parquet")
    X_dev_enc.write_parquet(pipeline_dir / "X_dev_enc.parquet")
    X_test_enc.write_parquet(pipeline_dir / "X_test_enc.parquet")

    np.save(pipeline_dir / "y_train.npy", y_train)
    np.save(pipeline_dir / "y_dev.npy", y_dev)
    np.save(pipeline_dir / "y_test.npy", y_test)

    print(f"Pipeline saved to {pipeline_dir}")


def load_pipeline(pipeline_dir: Path) -> dict:
    return {
        "X_train": pl.read_parquet(pipeline_dir / "X_train.parquet"),
        "X_dev": pl.read_parquet(pipeline_dir / "X_dev.parquet"),
        "X_test": pl.read_parquet(pipeline_dir / "X_test.parquet"),
        "X_train_enc": pl.read_parquet(pipeline_dir / "X_train_enc.parquet"),
        "X_dev_enc": pl.read_parquet(pipeline_dir / "X_dev_enc.parquet"),
        "X_test_enc": pl.read_parquet(pipeline_dir / "X_test_enc.parquet"),
        "y_train": np.load(pipeline_dir / "y_train.npy"),
        "y_dev": np.load(pipeline_dir / "y_dev.npy"),
        "y_test": np.load(pipeline_dir / "y_test.npy"),
        "encoder": load_encoder(pipeline_dir),
    }


def run_preprocessing(
    data_dir: Path,
    pipeline_dir: Path = PIPELINE_DIR,
) -> dict:
    print("Loading splits...")
    train, dev, test = load_splits(data_dir)

    print("Expanding multi-select columns...")
    train, dev, test = expand_multiselect(train, dev, test)

    print("Engineering features...")
    train, dev, test = engineer_features(train, dev, test)

    print("Separating features and target...")
    X_train = train.drop(TARGET)
    X_dev = dev.drop(TARGET)
    X_test = test.drop(TARGET)

    y_train = bin_target(train[TARGET].cast(pl.Float64).to_numpy())
    y_dev = bin_target(dev[TARGET].cast(pl.Float64).to_numpy())
    y_test = bin_target(test[TARGET].cast(pl.Float64).to_numpy())

    print("Encoding categoricals for LightGBM/XGBoost...")
    X_train_enc, X_dev_enc, X_test_enc, encoder = encode_categoricals(
        X_train, X_dev, X_test
    )

    print("Saving encoder...")
    save_encoder(encoder, pipeline_dir)

    print("Saving pipeline to disk...")
    save_pipeline(
        pipeline_dir,
        X_train,
        X_dev,
        X_test,
        X_train_enc,
        X_dev_enc,
        X_test_enc,
        y_train,
        y_dev,
        y_test,
    )

    print("Preprocessing complete.")

    return {
        "X_train": X_train,
        "X_dev": X_dev,
        "X_test": X_test,
        "X_train_enc": X_train_enc,
        "X_dev_enc": X_dev_enc,
        "X_test_enc": X_test_enc,
        "y_train": y_train,
        "y_dev": y_dev,
        "y_test": y_test,
    }
