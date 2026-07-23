import polars as pl
from datasets import load_dataset


class RawData:
    def __init__(
        self,
        year: int,
        base_url: str = "https://huggingface.co/datasets/Anahia/stackoverflow_survey/",
    ):
        self.year = year
        self.base_url = base_url

    def download(self) -> pl.DataFrame:
        url = f"{self.base_url}resolve/main/stackoverflow_survey_{self.year}.csv"

        try:
            print(f"Downloading dataframe {self.year}")
            df = pl.read_csv(url)
            print(f"Downloaded {df.height} rows and {df.width} columns")

            return df

        except Exception as e:
            print(f"Failed to download DataFrame {self.year}")
            print(f"Reason: {e}")
            raise

    def load(self):

        try:
            print(f"Loading DataFrame {self.year}")
            df = load_dataset(
                "Anahia/stackoverflow_survey",
                data_files=f"stackoverflow_survey_{self.year}.csv",
                streaming=True,
            ).with_format("polars")
            print("DataFrame loaded")

            return df

        except Exception as e:
            print(f"Failed to load DataFrame {self.year}")
            print(f"Reason: {e}")
            raise


class Schema:
    def __init__(
        self,
        year: int,
        base_url: str = "https://huggingface.co/datasets/Anahia/stackoverflow_survey_schemas/",
    ):
        self.year = year
        self.base_url = base_url

    def download(self) -> pl.DataFrame:
        url = f"{self.base_url}resolve/main/schema_{self.year}.csv"

        try:
            print(f"Downloading schema {self.year}")
            schema = pl.read_csv(url)
            print("Schema loaded")

            return schema

        except Exception as e:
            print(f"Failed to download schema {self.year}")
            print(f"Reason: {e}")
            raise

    def load(self):
        try:
            print(f"Loading schema {self.year}")
            schema = load_dataset(
                "Anahia/stackoverflow_survey_schemas",
                data_files=f"schema_{self.year}.csv",
                streaming=True,
            ).with_format("polars")
            print("Schema loaded")

            return schema

        except Exception as e:
            print(f"Failed to stream schema {self.year}")
            print(f"Reason: {e}")
            raise
