
# %% 
# import sys
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from utils.load_raw_data import RawData
import seaborn as sns
sns.set_theme(style="darkgrid")

data_raw = RawData(year=2025)
df = data_raw.download()
df.head(10)

# %% 
print(df.columns)