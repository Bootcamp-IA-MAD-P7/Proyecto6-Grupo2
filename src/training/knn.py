# %% 
from sklearn import datasets
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score, classification_report
import matplotlib.pyplot as plt
import seaborn as sns
import polars as pl
import numpy as np




# %%
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=40)
print(y_train)
print(y_test)


# %%
